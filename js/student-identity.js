import {
  db, doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, query, where, getDocs, limit
} from './firebase.js';
import {
  makeStudentId,
  loadCourse,
  getActiveProfile,
  getActiveRole,
  $, safeText, getRedirectTarget
} from './auth.js';
import {
  currentFirebaseUser,
  reloadFirebaseUser,
  signInSecureStudent,
  createSecureStudentCredential,
  sendStudentVerification,
  resetSecureStudentPassword,
  secureStudentSignOut,
  assertVerifiedStudentUser
} from './student-secure-auth.js?v=1';

export { $, safeText, getRedirectTarget };

const PENDING_KEY='SP_PENDING_SECURE_STUDENT_REGISTRATION_V1';
const LOOKUP_COLLECTION='studentLookups';
const SECURITY_SETTINGS_DOC='studentSecurity';
const LOOKUP_VERSION=1;
const RESERVED_COURSE_CODES=new Set(['ALLE','ALLEE','ALL_ACCESS','LEHRER','TEACHER']);

function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
function normEmail(value){return String(value||'').trim().toLowerCase()}
function readJson(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch(e){return fallback}}
function writeJson(key,value){localStorage.setItem(key,JSON.stringify(value))}
function readProfile(){return getActiveProfile()||readJson('SP_USER_PROFILE',null)||readJson('SP_STUDENT_PROFILE',null)}
function courseOf(p={}){return String(p.courseCode||p.kurs||p.kursnummer||p.course||'').trim()}
function emailOf(p={}){return normEmail(p.email)}
function isRealStudent(p={}){
  const role=String(getActiveRole?.()||p.loginRole||p.role||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();
  return role==='student'&&!p.teacherPreview&&!p.previewOnly&&!p.isTeacher;
}
function currentVerifiedUser(){
  const user=currentFirebaseUser();
  return user&&!user.isAnonymous&&user.emailVerified===true&&user.uid?user:null;
}
function candidateIds(p={}){
  const courseDoc=String(p.courseDocId||courseOf(p)||'').trim();
  const legacy=emailOf(p)&&courseDoc?makeStudentId(emailOf(p),courseDoc):'';
  let stored='';try{stored=localStorage.getItem('SP_STUDENT_ID')||''}catch(e){}
  return uniq([p.canonicalStudentId,p.docId,p.studentId,p.userId,p.id,...(Array.isArray(p.aliasIds)?p.aliasIds:[]),stored,legacy]);
}
function courseVariants(course,courseDocId=''){
  return uniq([course,String(course||'').toLowerCase(),String(course||'').toUpperCase(),courseDocId,String(courseDocId||'').toLowerCase(),String(courseDocId||'').toUpperCase()]);
}
function lookupIds(email,course,courseDocId=''){
  const mail=normEmail(email);
  if(!mail)return[];
  return uniq(courseVariants(course,courseDocId).map(value=>makeStudentId(mail,value)));
}
function courseMatches(data={},course,courseDocId=''){
  const wanted=new Set(courseVariants(course,courseDocId).map(v=>String(v).trim().toLowerCase()));
  return [data.kurs,data.courseCode,data.kursnummer,data.courseDocId,data.course]
    .some(value=>wanted.has(String(value||'').trim().toLowerCase()));
}
async function securityLookupReady(){
  try{
    const snap=await getDoc(doc(db,'settings',SECURITY_SETTINGS_DOC));
    const data=snap.exists()?snap.data()||{}:{};
    return data.studentLookupReady===true&&Number(data.studentLookupVersion||0)>=LOOKUP_VERSION;
  }catch(e){return false}
}
async function assertSecurityLookupReady(){
  if(await securityLookupReady())return true;
  throw new Error('SECURITY_MIGRATION_NOT_READY');
}
function canonicalLink(id,data={}){
  const linked=String(data.canonicalStudentId||'').trim();
  return linked&&linked!==String(id||'').trim()?linked:'';
}
async function followCanonicalStudent(record,uid='',course='',courseDocId=''){
  let current=record,aliases=[];const seen=new Set();
  for(let depth=0;current&&depth<8;depth++){
    const id=String(current.id||'').trim(),data=current.data||{};if(!id||seen.has(id))break;seen.add(id);aliases.push(id,...(Array.isArray(data.aliasIds)?data.aliasIds:[]));
    const next=canonicalLink(id,data);if(!next||seen.has(next))break;
    try{
      const snap=await getDoc(doc(db,'students',next));if(!snap.exists())break;const nextData=snap.data()||{},owner=String(nextData.authUid||'').trim();
      if(uid&&owner&&owner!==uid)break;if((course||courseDocId)&&!courseMatches(nextData,course,courseDocId))break;
      current={id:snap.id||next,data:nextData};
    }catch(e){break}
  }
  return current?{...current,aliases:uniq(aliases)}:record;
}
async function findStudentByAuthUidAndCourse(uid,course,courseDocId=''){
  if(!uid)return null;
  try{
    // Die Query ist ausschließlich nach der verifizierten Firebase-UID gefiltert.
    // Bei historischen Alias-Zeilen folgt die Auflösung anschließend ausdrücklich
    // canonicalStudentId, statt den zuerst gefundenen lokalen Alias zur Wahrheit zu machen.
    const snap=await getDocs(query(collection(db,'students'),where('authUid','==',uid),limit(30)));
    const matches=snap.docs.filter(d=>courseMatches(d.data()||{},course,courseDocId));
    if(!matches.length)return null;
    const direct=matches.find(d=>{const data=d.data()||{},canonical=String(data.canonicalStudentId||'').trim();return canonical&&canonical===String(d.id)})||matches[0];
    return followCanonicalStudent({id:direct.id,data:direct.data()||{}},uid,course,courseDocId);
  }catch(e){console.warn('UID-Schülerlookup fehlgeschlagen',e)}
  return null;
}
async function directLegacyStudent(email,course,courseDocId=''){
  const mail=normEmail(email);
  if(!mail)return null;

  // Unkorrigierte Altprofile hatten historisch eine deterministische Dokument-ID.
  for(const id of lookupIds(mail,course,courseDocId)){
    try{
      const snap=await getDoc(doc(db,'students',id));
      if(snap.exists()){
        const data=snap.data()||{};
        if(normEmail(data.email)===mail&&courseMatches(data,course,courseDocId))return followCanonicalStudent({id:snap.id||id,data},'',course,courseDocId);
      }
    }catch(e){}
  }

  // Korrigierte Altprofile behalten ihre alte kanonische Dokument-ID. Dafür gibt es
  // nach der Lehrer-Migration einen direkten, nicht auflistbaren Lookup-Schlüssel.
  for(const key of lookupIds(mail,course,courseDocId)){
    try{
      const lookupSnap=await getDoc(doc(db,LOOKUP_COLLECTION,key));
      if(!lookupSnap.exists())continue;
      const lookup=lookupSnap.data()||{};
      if(normEmail(lookup.email)!==mail)continue;
      const canonical=String(lookup.canonicalStudentId||lookup.studentId||'').trim();
      if(!canonical)continue;
      const studentSnap=await getDoc(doc(db,'students',canonical));
      if(!studentSnap.exists())continue;
      const data=studentSnap.data()||{};
      if(normEmail(data.email)===mail&&courseMatches(data,course,courseDocId))return followCanonicalStudent({id:studentSnap.id||canonical,data},'',course,courseDocId);
    }catch(e){}
  }
  return null;
}
async function resolveCanonical(profile){
  const p=profile||{},candidates=candidateIds(p),user=currentVerifiedUser(),email=emailOf(p),course=courseOf(p),courseDocId=String(p.courseDocId||'').trim();
  // Eine verifizierte Firebase-UID ist die stärkste Identität. Sie wird vor lokalen
  // Alt-IDs geprüft, damit Handy und Tablet nicht auf unterschiedlichen Alias-Dokumenten
  // weiterarbeiten, nur weil dort noch alte studentId/docId-Werte gespeichert sind.
  if(user){
    const byUid=await findStudentByAuthUidAndCourse(user.uid,course,courseDocId);
    if(byUid)return{id:byUid.id,data:byUid.data||{},aliases:uniq([...candidates,...(byUid.aliases||[])])};
  }
  for(const id of candidates){
    try{
      const snap=await getDoc(doc(db,'students',id));if(!snap.exists())continue;const data=snap.data()||{},owner=String(data.authUid||'').trim();
      if(user&&owner&&owner!==user.uid)continue;
      const resolved=await followCanonicalStudent({id:snap.id||id,data},user?.uid||'',course,courseDocId);
      if(resolved)return{id:resolved.id,data:resolved.data||{},aliases:uniq([...candidates,...(resolved.aliases||[])])};
    }catch(e){}
  }
  if(email&&course&&await securityLookupReady()){
    const found=await directLegacyStudent(email,course,courseDocId);
    if(found)return{id:found.id,data:found.data||{},aliases:uniq([...candidates,...(found.aliases||[])])};
  }
  return null;
}
function persistProfile(profile){
  const json=JSON.stringify(profile);
  localStorage.setItem('SP_USER_PROFILE',json);
  localStorage.setItem('SP_STUDENT_PROFILE',json);
  localStorage.setItem('SP_KEEP_LOGGED_IN','1');
  localStorage.setItem('SP_LOGIN_ROLE','student');
  localStorage.setItem('SP_ACTIVE_ROLE','student');
  localStorage.setItem('SP_USER_ROLE','student');
  localStorage.setItem('SP_STUDENT_ID',profile.canonicalStudentId||profile.docId||profile.studentId||profile.userId||'');
  localStorage.setItem('SP_STUDENT_AUTH_UID',profile.authUid||'');
}
function clearActivatedStudentSession(){
  try{
    ['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_KEEP_LOGGED_IN','SP_STUDENT_ID','SP_STUDENT_AUTH_UID','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE','SP_LOGIN_CONTEXT','motherLanguage','muttersprache','SP_MOTHER_LANGUAGE_CODE'].forEach(key=>localStorage.removeItem(key));
  }catch(e){}
}
async function isolateActivatedStudent(){
  const module=await import('/js/account-progress-owner-isolation.js?v=3');
  const result=await module.isolateLocalProgressOwner();
  if(result?.blocked){
    clearActivatedStudentSession();
    const error=new Error('LOCAL_PROGRESS_ISOLATION_FAILED');error.isolation=result;throw error;
  }
  return result;
}
function pendingRegistration(){return readJson(PENDING_KEY,null)}
function clearPendingRegistration(){try{localStorage.removeItem(PENDING_KEY)}catch(e){}}
function assertCourseAllowed(course){
  if(RESERVED_COURSE_CODES.has(String(course||'').trim().toUpperCase()))throw new Error('RESERVED_COURSE_CODE');
}
async function loadAllowedCourse(course){
  assertCourseAllowed(course);
  const loaded=await loadCourse(course);
  if(!loaded)throw new Error('COURSE_NOT_FOUND');
  const code=loaded.data?.courseCode||loaded.data?.code||loaded.data?.kurs||loaded.data?.kursnummer||loaded.id;
  if(RESERVED_COURSE_CODES.has(String(code||'').trim().toUpperCase())||RESERVED_COURSE_CODES.has(String(loaded.id||'').trim().toUpperCase()))throw new Error('RESERVED_COURSE_CODE');
  return{...loaded,courseCode:code};
}
async function claimStudentRecord(found,user){
  const remote=found?.data||{},id=String(found?.id||'').trim();
  if(!id)throw new Error('STUDENT_NOT_FOUND');
  const existingOwner=String(remote.authUid||'').trim();
  if(existingOwner&&existingOwner!==user.uid)throw new Error('STUDENT_AUTH_OWNERSHIP_MISMATCH');
  if(!existingOwner){
    await updateDoc(doc(db,'students',id),{
      authUid:user.uid,
      authEmail:normEmail(user.email),
      authVersion:2,
      authLinkedAt:serverTimestamp()
    });
  }
  await setDoc(doc(db,'progress',id),{
    authUid:user.uid,
    authEmail:normEmail(user.email),
    canonicalStudentId:id,
    studentId:id,
    userId:id,
    docId:id,
    authVersion:2,
    authLinkedAt:serverTimestamp()
  },{merge:true});
  try{await updateDoc(doc(db,'students',id),{lastLogin:serverTimestamp()})}catch(e){}
  return{id,data:{...remote,authUid:user.uid,authEmail:normEmail(user.email),authVersion:2}};
}
async function createStudentRecord(pending,user,courseLoaded){
  const email=normEmail(user.email),studentId=makeStudentId(email,courseLoaded.id),courseCode=courseLoaded.courseCode;
  const st={
    canonicalStudentId:studentId,studentId,userId:studentId,docId:studentId,
    authUid:user.uid,authEmail:email,authVersion:2,authLinkedAt:serverTimestamp(),
    vorname:String(pending.vorname||'').trim(),nachname:String(pending.nachname||'').trim(),email,
    muttersprache:String(pending.muttersprache||'').trim(),
    kurs:courseCode,kursnummer:courseCode,courseCode,courseDocId:courseLoaded.id,
    role:'student',loginRole:'student',isStudent:true,isTeacher:false,
    profilVollstaendig:false,active:true,
    fragenFortschritt:0,verbenFortschritt:0,wortschatzFortschritt:0,
    identityVersion:2,createdAt:serverTimestamp(),lastLogin:serverTimestamp()
  };
  await setDoc(doc(db,'students',studentId),st);
  await setDoc(doc(db,'progress',studentId),{
    canonicalStudentId:studentId,studentId,userId:studentId,docId:studentId,
    authUid:user.uid,authEmail:email,authVersion:2,
    email,kurs:courseCode,kursnummer:courseCode,courseCode,courseDocId:courseLoaded.id,
    fragen:{progress:0,state:{}},verben:{progress:0,stars:0,state:{}},wortschatz:{progress:0,state:{}},grammatik:{progress:0,state:{}},
    updatedAt:serverTimestamp()
  },{merge:true});
  return{id:studentId,data:st};
}
function profileFromRecord(record,user,courseData={}){
  const remote=record.data||{},canonical=String(record.id||'').trim();
  const course=remote.kurs||remote.courseCode||remote.kursnummer||'';
  const aliases=uniq([canonical,...(record.aliases||[]),...(Array.isArray(remote.aliasIds)?remote.aliasIds:[]),remote.canonicalStudentId,remote.docId,remote.studentId,remote.userId]);
  return{
    ...remote,
    assignments:courseData||remote.assignments||{},
    canonicalStudentId:canonical,docId:canonical,studentId:canonical,userId:canonical,aliasIds:aliases,
    authUid:user.uid,authEmail:normEmail(user.email),authVersion:2,secureAuth:true,
    email:normEmail(remote.email||user.email),kurs:course,kursnummer:course,courseCode:course,
    role:'student',loginRole:'student',isStudent:true,isTeacher:false,firebase:true,keepLoggedIn:true
  };
}

export async function normalizeStudentIdentity(inputProfile=null,{silent=false}={}){
  const local=inputProfile||readProfile();
  if(!local||!isRealStudent(local))return local;
  const user=currentVerifiedUser();
  if(!user){
    try{window.SP_SECURE_STUDENT_AUTH_REQUIRED=true}catch(e){}
    if(!silent)console.warn('Sichere Schüler-Authentifizierung fehlt; Identitätsdaten werden nicht geschrieben.');
    return local;
  }
  if(local.authUid&&String(local.authUid)!==user.uid)throw new Error('STUDENT_AUTH_OWNERSHIP_MISMATCH');

  const resolved=await resolveCanonical(local);
  if(!resolved)return local;
  const remote=resolved.data||{},canonical=String(resolved.id||'').trim();
  if(!canonical)return local;
  if(remote.authUid&&String(remote.authUid)!==user.uid)throw new Error('STUDENT_AUTH_OWNERSHIP_MISMATCH');

  const aliases=uniq([canonical,...resolved.aliases,...(Array.isArray(remote.aliasIds)?remote.aliasIds:[]),remote.canonicalStudentId,remote.docId,remote.studentId,remote.userId]);
  const course=remote.kurs||remote.courseCode||remote.kursnummer||local.kurs||local.courseCode||local.kursnummer||'';
  const email=normEmail(remote.email||local.email||user.email);
  const next={...local,...remote,canonicalStudentId:canonical,docId:canonical,studentId:canonical,userId:canonical,aliasIds:aliases,authUid:user.uid,authEmail:normEmail(user.email),authVersion:2,secureAuth:true,email,kurs:course,kursnummer:course,courseCode:course,role:'student',loginRole:'student',isStudent:true,isTeacher:false,firebase:true,keepLoggedIn:true};

  const identityPatch={canonicalStudentId:canonical,docId:canonical,studentId:canonical,userId:canonical,aliasIds:aliases,authUid:user.uid,authEmail:normEmail(user.email),authVersion:2,email,kurs:course,kursnummer:course,courseCode:course,role:'student',loginRole:'student',isStudent:true,isTeacher:false,active:true,identityVersion:2,identityUpdatedAt:serverTimestamp()};
  if(next.courseDocId)identityPatch.courseDocId=next.courseDocId;
  await setDoc(doc(db,'students',canonical),identityPatch,{merge:true});
  await setDoc(doc(db,'progress',canonical),{canonicalStudentId:canonical,docId:canonical,studentId:canonical,userId:canonical,aliasIds:aliases,authUid:user.uid,authEmail:normEmail(user.email),authVersion:2,email,kurs:course,kursnummer:course,courseCode:course,identityVersion:2,identityUpdatedAt:serverTimestamp()},{merge:true});

  persistProfile(next);
  try{window.SP_SECURE_STUDENT_AUTH_REQUIRED=false;window.dispatchEvent(new CustomEvent('SP_STUDENT_IDENTITY_NORMALIZED',{detail:{studentId:canonical,authUid:user.uid,aliasIds:aliases,profile:next}}))}catch(e){}
  return next;
}

export async function registerStudent(payload){
  const pending={
    vorname:String(payload?.vorname||'').trim(),nachname:String(payload?.nachname||'').trim(),
    email:normEmail(payload?.email),muttersprache:String(payload?.muttersprache||'').trim(),kurs:String(payload?.kurs||'').trim()
  };
  const password=String(payload?.password||'');
  if(!pending.vorname||!pending.nachname||!pending.email||!pending.muttersprache||!pending.kurs||!password)throw new Error('MISSING_FIELDS');
  if(password.length<8)throw new Error('WEAK_STUDENT_PASSWORD');
  const courseLoaded=await loadAllowedCourse(pending.kurs);
  pending.courseDocId=courseLoaded.id;pending.courseCode=courseLoaded.courseCode;

  let user=null,existingFirebaseAccount=false;
  try{
    user=await createSecureStudentCredential(pending.email,password);
  }catch(error){
    if(error?.code!=='auth/email-already-in-use')throw error;
    user=await signInSecureStudent(pending.email,password);
    existingFirebaseAccount=true;
  }

  pending.uid=user.uid;pending.createdAt=Date.now();
  writeJson(PENDING_KEY,pending);

  if(user.emailVerified!==true){
    await sendStudentVerification(user);
    clearActivatedStudentSession();
    return{verificationRequired:true,email:pending.email,existingFirebaseAccount};
  }

  const profile=await finishPendingStudentRegistration();
  return{verificationRequired:false,activated:true,email:pending.email,profile,existingFirebaseAccount};
}

export async function finishPendingStudentRegistration(){
  const pending=pendingRegistration();
  if(!pending)throw new Error('NO_PENDING_REGISTRATION');
  let user=currentFirebaseUser();
  if(!user||user.isAnonymous)throw new Error('VERIFICATION_LOGIN_REQUIRED');
  user=await reloadFirebaseUser(user);
  assertVerifiedStudentUser(user,pending.email);

  const courseLoaded=await loadAllowedCourse(pending.courseCode||pending.kurs);
  let found=await findStudentByAuthUidAndCourse(user.uid,courseLoaded.courseCode,courseLoaded.id);
  if(!found){
    await assertSecurityLookupReady();
    found=await directLegacyStudent(pending.email,courseLoaded.courseCode,courseLoaded.id);
  }
  const record=found?await claimStudentRecord(found,user):await createStudentRecord(pending,user,courseLoaded);
  const profile=profileFromRecord(record,user,courseLoaded.data||{});
  persistProfile(profile);
  const normalized=await normalizeStudentIdentity(profile);
  await isolateActivatedStudent();
  clearPendingRegistration();
  return normalized;
}

export async function loginStudent(email,kurs,password){
  const emailNorm=normEmail(email),courseRaw=String(kurs||'').trim();
  if(!emailNorm||!courseRaw||!password)throw new Error('MISSING_LOGIN_FIELDS');
  clearActivatedStudentSession();
  const user=await signInSecureStudent(emailNorm,password);
  if(user.emailVerified!==true){
    try{await sendStudentVerification(user)}catch(e){}
    throw new Error('EMAIL_NOT_VERIFIED');
  }
  assertVerifiedStudentUser(user,emailNorm);

  const courseLoaded=await loadAllowedCourse(courseRaw);
  let found=await findStudentByAuthUidAndCourse(user.uid,courseLoaded.courseCode,courseLoaded.id);
  if(!found){
    await assertSecurityLookupReady();
    found=await directLegacyStudent(emailNorm,courseLoaded.courseCode,courseLoaded.id);
  }
  if(!found){
    const pending=pendingRegistration();
    if(pending&&normEmail(pending.email)===emailNorm&&courseMatches(pending,courseLoaded.courseCode,courseLoaded.id))return finishPendingStudentRegistration();
    throw new Error('STUDENT_NOT_FOUND');
  }
  const record=await claimStudentRecord(found,user);
  const courseData=courseLoaded.data||{};
  const profile=profileFromRecord(record,user,courseData);
  persistProfile(profile);
  const normalized=await normalizeStudentIdentity(profile);
  await isolateActivatedStudent();
  return normalized;
}

export async function resendStudentVerification(){
  const user=currentFirebaseUser();
  if(!user||user.isAnonymous)throw new Error('SECURE_AUTH_REQUIRED');
  await sendStudentVerification(user);
}

export async function resetStudentPassword(email){return resetSecureStudentPassword(email)}

export async function logoutSecureStudent(){
  clearActivatedStudentSession();
  await secureStudentSignOut();
}

export function hasPendingStudentRegistration(){return!!pendingRegistration()}