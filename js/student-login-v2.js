import { updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { db, doc, collection, query, where, getDocsFromServer, getDocFromServer, setDoc, limit, updateDoc, serverTimestamp } from './firebase.js';
import { loadCourse, makeStudentId } from './auth.js';
import {
  signInSecureStudent,
  secureStudentSignOut
} from './student-secure-auth.js?v=20260825-register7';
import {
  finishPendingStudentRegistration,
  hasPendingStudentRegistration,
  resetStudentPassword,
  $, safeText, getRedirectTarget
} from './student-identity.js?v=identity4';
import { registerStudentOnce, restorePendingStudentRegistration } from './student-registration-v3.js?v=20260825-register9';

export { finishPendingStudentRegistration, hasPendingStudentRegistration, resetStudentPassword, $, safeText, getRedirectTarget };

const PENDING_KEY='SP_PENDING_SECURE_STUDENT_REGISTRATION_V1';
function normEmail(value){return String(value||'').trim().toLowerCase()}
function normCourse(value){return String(value||'').trim().toLowerCase()}
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
function point(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0}
function courseOf(data={}){return String(data.courseCode||data.kurs||data.kursnummer||data.courseDocId||data.course||'').trim()}
function rankingCourseOf(data={}){return String(data.courseDocId||data.courseCode||data.kurs||data.kursnummer||data.course||'').trim()}
function displayName(data={}){return [data.vorname||data.firstName||data.name,data.nachname||data.lastName].filter(Boolean).join(' ').trim()||data.displayName||data.studentName||data.email||'Schüler/in'}
function rankingPoints(data={}){return Math.max(point(data.rankingPoints),point(data.pointsTotal),point(data.lifetimePoints),point(data.punkteGesamt),point(data.points),point(data.ranking?.points),point(data.totals?.points))}
function activeOwnProfile(data={}){return data.securityArchived!==true&&data.securityLookupExcluded!==true&&data.active!==false&&String(data.authUid||'').trim()!==''}
function courseMatches(data={},variants=[]){const wanted=new Set((variants||[]).map(normCourse).filter(Boolean));return [data.courseCode,data.kurs,data.kursnummer,data.courseDocId,data.course].some(value=>wanted.has(normCourse(value)))}
function pendingRegistrationFor(email,courseRaw=''){
  let pending=null;
  try{pending=JSON.parse(localStorage.getItem(PENDING_KEY)||'null')}catch(e){pending=null}
  if(!pending||normEmail(pending.email)!==normEmail(email))return null;
  const raw=normCourse(courseRaw);
  if(!raw)return pending;
  const variants=[pending.kurs,pending.courseCode,pending.courseDocId].map(normCourse).filter(Boolean);
  return variants.includes(raw)?pending:null;
}
function clearPendingRegistration(){try{localStorage.removeItem(PENDING_KEY)}catch(e){}}
async function clearAuthRegistrationMarker(user,pending={}){
  try{await updateProfile(user,{displayName:[pending.vorname,pending.nachname].filter(Boolean).join(' ').trim()||null})}catch(error){console.warn('[SprachPilot] Registrierungsmarker im Firebase-Profil konnte nicht bereinigt werden',error)}
}
async function ownProfiles(uid){
  const snap=await getDocsFromServer(query(collection(db,'students'),where('authUid','==',String(uid)),limit(20)));
  return snap.docs.map(d=>({id:d.id,data:d.data()||{}})).filter(row=>activeOwnProfile(row.data)).map(row=>({id:row.id,course:courseOf(row.data),name:displayName(row.data),data:row.data}));
}
async function verifiedPasswordUser(email,password){
  const emailNorm=normEmail(email),pwd=String(password||'');if(!emailNorm||!pwd)throw new Error('MISSING_LOGIN_FIELDS');
  const user=await signInSecureStudent(emailNorm,pwd);
  if(user.emailVerified!==true)throw new Error('EMAIL_NOT_VERIFIED');
  if(user.isAnonymous||!user.uid)throw new Error('SECURE_AUTH_REQUIRED');return user;
}
function profileChoiceError(profiles){const error=new Error('MULTIPLE_STUDENT_PROFILES');error.profiles=(profiles||[]).map(p=>({id:p.id,course:p.course,name:p.name}));return error}
function clearTeacherSession(){
  try{
    ['SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE','SP_L7_PREVIEW_PID'].forEach(key=>localStorage.removeItem(key));
    sessionStorage.removeItem('SP_TEACHER_PREVIEW');
  }catch(e){}
}
function clearStudentSession(){
  try{['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_KEEP_LOGGED_IN','SP_STUDENT_ID','SP_STUDENT_AUTH_UID','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE','SP_LOGIN_CONTEXT','motherLanguage','muttersprache','SP_MOTHER_LANGUAGE_CODE'].forEach(key=>localStorage.removeItem(key))}catch(e){}
}
function persistBoundProfile(selected,user,assignments={}){
  clearTeacherSession();
  const remote=selected.data||{},canonical=String(selected.id||'').trim(),course=selected.course||courseOf(remote),aliases=uniq([canonical,...(Array.isArray(remote.aliasIds)?remote.aliasIds:[]),remote.canonicalStudentId,remote.docId,remote.studentId,remote.userId]);
  const courseDocId=String(remote.courseDocId||assignments?.courseDocId||assignments?.id||remote.courseId||'').trim();
  const profile={...remote,assignments:assignments||remote.assignments||{},canonicalStudentId:canonical,docId:canonical,studentId:canonical,userId:canonical,aliasIds:aliases,authUid:String(user.uid),authEmail:normEmail(user.email),authVersion:Math.max(2,Number(remote.authVersion||0)),secureAuth:true,email:normEmail(remote.email||user.email),kurs:course,kursnummer:course,courseCode:course,courseDocId,role:'student',loginRole:'student',isStudent:true,isTeacher:false,firebase:true,keepLoggedIn:true};
  const json=JSON.stringify(profile);localStorage.setItem('SP_USER_PROFILE',json);localStorage.setItem('SP_STUDENT_PROFILE',json);localStorage.setItem('SP_KEEP_LOGGED_IN','1');localStorage.setItem('SP_LOGIN_ROLE','student');localStorage.setItem('SP_ACTIVE_ROLE','student');localStorage.setItem('SP_USER_ROLE','student');localStorage.setItem('SP_STUDENT_ID',canonical);localStorage.setItem('SP_STUDENT_AUTH_UID',String(user.uid));
  const mother=String(profile.muttersprache||profile.motherLanguage||'').trim();if(mother){localStorage.setItem('motherLanguage',mother);localStorage.setItem('muttersprache',mother)}return profile;
}
async function ensureRankingRow(profile,user){
  const id=String(profile?.canonicalStudentId||profile?.docId||profile?.studentId||profile?.userId||'').trim();
  const key=rankingCourseOf(profile),uid=String(user?.uid||profile?.authUid||'').trim();
  if(!id||!key||!uid)return false;
  let oldPoints=0;
  try{const snap=await getDocFromServer(doc(db,'studentRankings',id));if(snap.exists())oldPoints=point(snap.data()?.points)}catch(e){}
  try{
    await setDoc(doc(db,'studentRankings',id),{
      studentId:id,authUid:uid,displayName:displayName(profile),courseKey:key,
      points:Math.max(oldPoints,rankingPoints(profile)),version:4,updatedAt:serverTimestamp()
    },{merge:true});
    return true;
  }catch(error){console.warn('Ranglisten-Eintrag beim Schülerlogin konnte nicht aktualisiert werden',error);return false}
}
async function activateBoundProfile(selected,user){
  let assignments=selected.data?.assignments||{};
  try{
    const loaded=await loadCourse(selected.data?.courseDocId||selected.course);
    if(loaded?.data&&typeof loaded.data==='object')assignments=loaded.data;
  }catch(error){console.warn('Kursfreigaben konnten bei der Anmeldung nicht zusätzlich geladen werden',error)}
  const profile=persistBoundProfile(selected,user,assignments);
  try{const isolation=await import('/js/account-progress-owner-isolation.js?v=3').then(m=>m.isolateLocalProgressOwner());if(isolation?.blocked)throw new Error('LOCAL_PROGRESS_ISOLATION_FAILED')}catch(error){clearStudentSession();try{await secureStudentSignOut()}catch(e){}throw error}
  try{await updateDoc(doc(db,'students',selected.id),{lastLogin:serverTimestamp()})}catch(e){console.warn('lastLogin update skipped',e)}
  await ensureRankingRow(profile,user);
  return profile;
}
async function claimLegacyStudentRecord(studentId,data,user,email){
  const id=String(studentId||'').trim(),mail=normEmail(email),existingUid=String(data?.authUid||'').trim();
  if(!id)throw new Error('STUDENT_NOT_FOUND');
  if(normEmail(data?.email)!==mail)throw new Error('STUDENT_EMAIL_MISMATCH');
  if(existingUid&&existingUid!==String(user.uid))throw new Error('STUDENT_AUTH_OWNERSHIP_MISMATCH');
  if(!existingUid){
    await updateDoc(doc(db,'students',id),{
      authUid:String(user.uid),
      authEmail:mail,
      authVersion:Math.max(2,Number(data?.authVersion||0)),
      authLinkedAt:serverTimestamp()
    });
  }
  try{
    await setDoc(doc(db,'progress',id),{
      authUid:String(user.uid),authEmail:mail,authVersion:Math.max(2,Number(data?.authVersion||0)),
      canonicalStudentId:id,studentId:id,userId:id,docId:id,authLinkedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn('Progress-Verknüpfung beim Altprofil-Login wurde übersprungen',error)}
  return{id,course:courseOf(data),name:displayName(data),data:{...data,authUid:String(user.uid),authEmail:mail,authVersion:Math.max(2,Number(data?.authVersion||0))}};
}
async function createVerifiedProfileFromPending(user,email,courseRaw=''){
  let pending=pendingRegistrationFor(email,courseRaw);
  if(!pending)pending=restorePendingStudentRegistration(user,courseRaw);
  if(!pending)return null;
  const loaded=await loadCourse(pending.courseDocId||pending.courseCode||pending.kurs);
  if(!loaded)throw new Error('COURSE_NOT_FOUND');
  const courseCode=loaded.data?.courseCode||loaded.data?.code||loaded.data?.kurs||loaded.data?.kursnummer||loaded.id;
  const mail=normEmail(user.email),studentId=makeStudentId(mail,loaded.id);
  let existing=null;
  try{
    existing=await getDocFromServer(doc(db,'students',studentId));
  }catch(error){
    // Bei einem noch nicht existierenden Dokument kann die alte Firestore-Regel den GET
    // mit permission-denied ablehnen, obwohl CREATE für den verifizierten Eigentümer erlaubt ist.
    // In diesem Fall direkt den sicheren CREATE versuchen statt die Anmeldung abzubrechen.
    if(!String(error?.code||'').includes('permission-denied'))throw error;
  }
  if(existing?.exists()){
    const row=await claimLegacyStudentRecord(existing.id||studentId,existing.data()||{},user,mail);
    clearPendingRegistration();await clearAuthRegistrationMarker(user,pending);
    return row;
  }
  const st={
    canonicalStudentId:studentId,studentId,userId:studentId,docId:studentId,aliasIds:[studentId],
    authUid:String(user.uid),authEmail:mail,authVersion:3,authLinkedAt:serverTimestamp(),
    vorname:String(pending.vorname||'').trim(),nachname:String(pending.nachname||'').trim(),email:mail,
    muttersprache:String(pending.muttersprache||'').trim(),
    kurs:courseCode,kursnummer:courseCode,courseCode,courseDocId:loaded.id,
    role:'student',loginRole:'student',isStudent:true,isTeacher:false,
    profilVollstaendig:false,active:true,
    fragenFortschritt:0,verbenFortschritt:0,wortschatzFortschritt:0,
    identityVersion:3,createdAt:serverTimestamp(),lastLogin:serverTimestamp()
  };
  await setDoc(doc(db,'students',studentId),st);
  await setDoc(doc(db,'progress',studentId),{
    canonicalStudentId:studentId,studentId,userId:studentId,docId:studentId,aliasIds:[studentId],
    authUid:String(user.uid),authEmail:mail,authVersion:3,
    email:mail,kurs:courseCode,kursnummer:courseCode,courseCode,courseDocId:loaded.id,
    fragen:{progress:0,state:{}},verben:{progress:0,stars:0,state:{}},wortschatz:{progress:0,state:{}},grammatik:{progress:0,state:{}},
    updatedAt:serverTimestamp()
  },{merge:true});
  clearPendingRegistration();await clearAuthRegistrationMarker(user,pending);
  return{id:studentId,course:courseCode,name:displayName(st),data:st};
}
async function recoverPreparedProfile(user,email,courseRaw){
  const mail=normEmail(email),raw=String(courseRaw||'').trim();
  if(!raw)throw new Error('STUDENT_COURSE_REQUIRED_FOR_LINK');
  const loaded=await loadCourse(raw);
  if(!loaded)throw new Error('COURSE_NOT_FOUND');
  const data=loaded.data||{};
  const variants=uniq([raw,loaded.id,data.courseCode,data.code,data.kurs,data.kursnummer,data.course]);
  const lookupIds=uniq(variants.map(course=>makeStudentId(mail,course)));

  for(const lookupId of lookupIds){
    try{
      const lookupSnap=await getDocFromServer(doc(db,'studentLookups',lookupId));
      if(!lookupSnap.exists())continue;
      const lookup=lookupSnap.data()||{};
      if(normEmail(lookup.email)!==mail)continue;
      const canonical=String(lookup.canonicalStudentId||lookup.studentId||'').trim();
      if(!canonical)continue;
      const studentSnap=await getDocFromServer(doc(db,'students',canonical));
      if(!studentSnap.exists())continue;
      const student=studentSnap.data()||{};
      if(!courseMatches(student,variants))continue;
      return claimLegacyStudentRecord(studentSnap.id||canonical,student,user,mail);
    }catch(error){
      const code=String(error?.code||'');
      if(code.includes('permission-denied'))console.warn('Vorbereiteter Schüler-Lookup konnte nicht gelesen werden',lookupId,error);
      else throw error;
    }
  }

  for(const candidateId of lookupIds){
    try{
      const studentSnap=await getDocFromServer(doc(db,'students',candidateId));
      if(!studentSnap.exists())continue;
      const student=studentSnap.data()||{};
      if(normEmail(student.email)!==mail||!courseMatches(student,variants))continue;
      return claimLegacyStudentRecord(studentSnap.id||candidateId,student,user,mail);
    }catch(error){
      const code=String(error?.code||'');
      if(code.includes('permission-denied'))continue;
      throw error;
    }
  }
  throw new Error('STUDENT_NOT_FOUND');
}
async function loginResolvedProfile(email,password,requestedId='',courseRaw=''){
  const user=await verifiedPasswordUser(email,password),profiles=await ownProfiles(user.uid);
  let selected=null;
  if(!profiles.length){
    selected=await createVerifiedProfileFromPending(user,email,courseRaw);
    if(selected)return activateBoundProfile(selected,user);
    try{selected=await recoverPreparedProfile(user,email,courseRaw)}catch(error){try{await secureStudentSignOut()}catch(e){};throw error}
    return activateBoundProfile(selected,user);
  }
  if(requestedId){selected=profiles.find(p=>p.id===String(requestedId));if(!selected){try{await secureStudentSignOut()}catch(e){};throw new Error('STUDENT_AUTH_OWNERSHIP_MISMATCH')}}
  else if(courseRaw){
    const matches=profiles.filter(profile=>normCourse(profile.course)===normCourse(courseRaw)||normCourse(profile.data?.courseDocId)===normCourse(courseRaw));
    if(matches.length===1)selected=matches[0];
  }
  if(!selected){if(profiles.length===1)selected=profiles[0];else throw profileChoiceError(profiles)}
  if(!selected.course)throw new Error('STUDENT_COURSE_MISSING');return activateBoundProfile(selected,user);
}
export async function loginStudentWithEmailPassword(email,password,course=''){return loginResolvedProfile(email,password,'',course)}
export async function loginStudentProfileWithEmailPassword(email,password,studentId){return loginResolvedProfile(email,password,studentId,'')}
export async function registerStudentV2(payload={}){
  const email=normEmail(payload.email),password=String(payload.password||'');if(!email||!password)throw new Error('MISSING_FIELDS');
  clearTeacherSession();
  return registerStudentOnce({...payload,email,password},finishPendingStudentRegistration);
}