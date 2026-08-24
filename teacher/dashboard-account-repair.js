(function(){
'use strict';

const api=window.SPTeacherDashboard;
if(!api||api.__accountRepairInstalled)return;
api.__accountRepairInstalled=true;

const previousEdit=api.editStudent;
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const uniq=values=>[...new Set((values||[]).map(text).filter(Boolean))];
const studentDocId=student=>text(student?.__docId||student?.id||student?.docId||student?.canonicalStudentId||student?.studentId||student?.userId);
const studentName=student=>text([student?.vorname||student?.firstName,student?.nachname||student?.lastName].filter(Boolean).join(' '))||text(student?.name||student?.displayName)||'Teilnehmer/in';
const studentCourse=student=>text(student?.courseCode||student?.kurs||student?.kursnummer||student?.courseDocId||student?.course);

function database(){
  if(window.db&&typeof window.db.collection==='function')return window.db;
  if(window.firebase&&typeof window.firebase.firestore==='function')return window.firebase.firestore();
  throw new Error('FIRESTORE_NOT_AVAILABLE');
}
function stamp(){return window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date()}
function studentIdentifiers(student){
  return uniq([student?.__docId,student?.id,student?.docId,student?.canonicalStudentId,student?.studentId,student?.userId,...(Array.isArray(student?.aliasIds)?student.aliasIds:[])]);
}
function currentStudent(id){
  const wanted=String(id||'');
  return (api.state?.students||[]).find(student=>studentIdentifiers(student).includes(wanted));
}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm(email))}
function emailOf(student){return norm(student?.authEmail||student?.email)}
function matchingProfiles(email){
  const wanted=norm(email);
  return (api.state?.students||[]).filter(student=>emailOf(student)===wanted);
}
function isRepairGhost(student){
  return !studentCourse(student)
    && !text(student?.email)
    && !text(student?.vorname||student?.firstName||student?.name||student?.displayName)
    && /^owner-(?:account|duplicate)-/.test(text(student?.authProvisioningStatus));
}
function courseValues(student={}){
  return uniq([student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course]);
}
function lookupClean(value){
  return String(value||'').trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-|-$/g,'');
}
function lookupKeys(email,student){
  const mail=lookupClean(email);
  if(!mail)return[];
  return courseValues(student).map(course=>`${lookupClean(course)}_${mail}`).filter(key=>key&&!key.startsWith('_'));
}
function setMessage(message,kind=''){
  const modal=document.getElementById('spFirebaseSaveStatus');
  if(modal){modal.textContent=message;modal.className='sp-status'+(kind?' '+kind:'');modal.hidden=!message}
  const global=document.getElementById('spStatus');
  if(global){global.textContent=message;global.className='sp-status'+(kind?' '+kind:'')}
}
function randomPassword(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes=new Uint8Array(32);globalThis.crypto.getRandomValues(bytes);
  let body='';for(const byte of bytes)body+=chars[byte%chars.length];
  return `Aa1!${body}`;
}
function friendlyError(error){
  const code=String(error?.code||'');
  const message=String(error?.message||'');
  if(message==='STUDENT_LOOKUP_COLLISION')return 'Diese E-Mail und dieser Kurs sind bereits einem anderen TN-Profil zugeordnet. Die automatische Verknüpfung wurde aus Sicherheitsgründen nicht verändert.';
  if(code.includes('email-already-in-use'))return 'Für diese E-Mail existiert bereits ein Firebase-Konto. Der Zugang kann nicht aus dem Lehrer-Browser übernommen werden; SprachPilot bereitet stattdessen die automatische Verknüpfung beim nächsten TN-Login vor.';
  if(code.includes('too-many-requests'))return 'Firebase hat zu viele Anfragen erkannt. Der TN kann später über „Passwort vergessen“ fortfahren.';
  if(code.includes('network-request-failed'))return 'Keine Verbindung zu Firebase. Bitte Internetverbindung prüfen.';
  if(code.includes('permission-denied'))return 'Das Owner-Konto darf diese Teilnehmerprofile momentan nicht aktualisieren.';
  return message||'Der Firebase-Zugang konnte nicht repariert werden.';
}
function updateLocalProfiles(email,uid){
  const wanted=norm(email);
  for(const student of api.state?.students||[]){
    if(emailOf(student)!==wanted||isRepairGhost(student))continue;
    student.authUid=uid;student.authEmail=wanted;student.authEmailLower=wanted;student.authVersion=Math.max(3,Number(student.authVersion||0));
    student.authProvisioningStatus='owner-account-linked-client-v3';
    for(const id of studentIdentifiers(student)){
      if(id&&window.__SP_STUDENTS_BY_ID?.[id]){
        Object.assign(window.__SP_STUDENTS_BY_ID[id],{authUid:uid,authEmail:wanted,authEmailLower:wanted,authVersion:Math.max(3,Number(window.__SP_STUDENTS_BY_ID[id].authVersion||0)),authProvisioningStatus:'owner-account-linked-client-v3'});
      }
    }
  }
}
function markLocalPending(email){
  const wanted=norm(email);
  for(const student of api.state?.students||[]){
    if(emailOf(student)!==wanted||isRepairGhost(student))continue;
    student.authProvisioningStatus='owner-existing-account-awaiting-login';
    student.authProvisioningEmail=wanted;
    for(const id of studentIdentifiers(student)){
      if(id&&window.__SP_STUDENTS_BY_ID?.[id])Object.assign(window.__SP_STUDENTS_BY_ID[id],{authProvisioningStatus:'owner-existing-account-awaiting-login',authProvisioningEmail:wanted});
    }
  }
}
async function bindMatchingProfiles(email,uid,status='owner-account-repaired-client-v3'){
  const rows=matchingProfiles(email),db=database(),batch=db.batch(),now=stamp();
  const courseRows=rows.filter(row=>studentCourse(row)&&!isRepairGhost(row));
  const targetRows=courseRows.length?courseRows:rows.filter(row=>!isRepairGhost(row));
  let count=0,removedGhosts=0;
  for(const student of targetRows){
    const id=studentDocId(student);if(!id)continue;
    batch.set(db.collection('students').doc(id),{
      authUid:String(uid),authEmail:norm(email),authEmailLower:norm(email),authVersion:3,
      authProvisioningStatus:status,authProvisioningEmail:norm(email),authProvisioningUpdatedAt:now
    },{merge:true});
    count++;
  }
  for(const ghost of rows.filter(isRepairGhost)){
    const id=studentDocId(ghost);if(!id)continue;
    batch.delete(db.collection('students').doc(id));removedGhosts++;
  }
  if(!count)throw new Error('STUDENT_PROFILE_NOT_FOUND');
  await batch.commit();
  if(removedGhosts)api.state.students=(api.state?.students||[]).filter(row=>!isRepairGhost(row));
  updateLocalProfiles(email,String(uid));
  return{count,removedGhosts};
}
async function prepareExistingAccountLink(email){
  const rows=matchingProfiles(email).filter(row=>!isRepairGhost(row));
  if(!rows.length)throw new Error('STUDENT_PROFILE_NOT_FOUND');
  const db=database(),allIds=new Set(rows.flatMap(studentIdentifiers)),planned=new Map();

  for(const student of rows){
    const canonical=studentDocId(student);if(!canonical)continue;
    for(const key of lookupKeys(email,student)){
      const prior=planned.get(key);
      if(prior&&prior!==canonical){const error=new Error('STUDENT_LOOKUP_COLLISION');error.key=key;throw error}
      planned.set(key,canonical);
      const snap=await db.collection('studentLookups').doc(key).get();
      if(!snap.exists)continue;
      const data=snap.data()||{},mapped=text(data.canonicalStudentId||data.studentId);
      if(mapped&&!allIds.has(mapped)){const error=new Error('STUDENT_LOOKUP_COLLISION');error.key=key;error.mapped=mapped;throw error}
    }
  }

  const batch=db.batch(),now=stamp();let profiles=0,lookups=0;
  for(const student of rows){
    const canonical=studentDocId(student);if(!canonical)continue;
    batch.set(db.collection('students').doc(canonical),{
      authProvisioningStatus:'owner-existing-account-awaiting-login',
      authProvisioningEmail:norm(email),authProvisioningUpdatedAt:now
    },{merge:true});profiles++;
    const courses=courseValues(student);
    for(const key of lookupKeys(email,student)){
      batch.set(db.collection('studentLookups').doc(key),{
        lookupVersion:1,canonicalStudentId:canonical,studentId:canonical,email:norm(email),
        courseKeys:courses,active:student.active!==false,updatedAt:now
      },{merge:true});lookups++;
    }
  }
  if(!profiles)throw new Error('STUDENT_PROFILE_NOT_FOUND');
  await batch.commit();markLocalPending(email);
  return{profiles,lookups};
}
async function sendResetBestEffort(email){
  try{await window.firebase.auth().sendPasswordResetEmail(email);return{sent:true,error:null}}
  catch(error){console.warn('[SprachPilot] password reset for existing unbound account failed',error);return{sent:false,error}}
}
async function createSecondaryAccount(email,name){
  const firebase=window.firebase;
  if(!firebase||typeof firebase.initializeApp!=='function'||typeof firebase.app!=='function')throw new Error('Firebase Authentication ist nicht verfügbar.');
  const appName=`sp-student-repair-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const secondary=firebase.initializeApp(firebase.app().options,appName),auth=secondary.auth();
  let user=null;
  try{
    const credential=await auth.createUserWithEmailAndPassword(email,randomPassword());
    user=credential?.user||null;if(!user?.uid)throw new Error('NEW_AUTH_USER_MISSING');
    if(name)try{await user.updateProfile({displayName:name})}catch(error){console.warn('[SprachPilot] repair display name skipped',error)}
    try{await user.sendEmailVerification()}catch(error){console.warn('[SprachPilot] repair verification mail skipped',error)}
    await auth.sendPasswordResetEmail(email);
    return{secondary,auth,user};
  }catch(error){
    if(user)try{await user.delete()}catch(cleanupError){console.warn('[SprachPilot] repair auth rollback failed',cleanupError)}
    try{await auth.signOut()}catch(e){}try{await secondary.delete()}catch(e){}
    throw error;
  }
}
async function disposeSecondary(context,{deleteUser=false}={}){
  if(!context)return;
  if(deleteUser&&context.user)try{await context.user.delete()}catch(error){console.warn('[SprachPilot] repair user rollback failed',error)}
  try{await context.auth?.signOut()}catch(e){}try{await context.secondary?.delete()}catch(e){}
}
async function existingAccountPendingResult(email){
  const prepared=await prepareExistingAccountLink(email),reset=await sendResetBestEffort(email);
  return{email,uid:'',linked:0,removedGhosts:0,created:false,existingUnbound:true,pendingLogin:true,preparedProfiles:prepared.profiles,preparedLookups:prepared.lookups,resetSent:reset.sent,resetError:reset.error||null};
}
async function ensureFirebaseAccount(id){
  const student=currentStudent(id);if(!student)throw new Error('Teilnehmerkonto wurde nicht gefunden.');
  const email=emailOf(student);if(!validEmail(email))throw new Error('Für diesen TN ist keine gültige E-Mail gespeichert.');
  const rows=matchingProfiles(email),bound=rows.find(row=>text(row.authUid));
  if(bound){
    const uid=text(bound.authUid),result=await bindMatchingProfiles(email,uid,'owner-duplicate-profile-repaired-client-v3');
    return{email,uid,linked:result.count,removedGhosts:result.removedGhosts,created:false,existingUnbound:false,pendingLogin:false,resetSent:false};
  }

  if(text(student.authProvisioningStatus)==='owner-existing-account-awaiting-login')return existingAccountPendingResult(email);

  let secondary=null,committed=false;
  try{
    secondary=await createSecondaryAccount(email,studentName(student));
    const uid=text(secondary.user?.uid);if(!uid)throw new Error('NEW_AUTH_USER_MISSING');
    const result=await bindMatchingProfiles(email,uid,'owner-account-created-client-v3');
    committed=true;
    return{email,uid,linked:result.count,removedGhosts:result.removedGhosts,created:true,existingUnbound:false,pendingLogin:false,resetSent:true};
  }catch(error){
    if(String(error?.code||'').includes('email-already-in-use')){
      if(secondary&&!committed){await disposeSecondary(secondary,{deleteUser:true});secondary=null}
      return existingAccountPendingResult(email);
    }
    if(secondary&&!committed)await disposeSecondary(secondary,{deleteUser:true});
    throw error;
  }finally{
    if(secondary&&committed)await disposeSecondary(secondary);
  }
}
async function repairAccess(id){
  if(!api.state?.isOwner)return setMessage('Nur das Owner-Konto darf Firebase-Zugänge reparieren.','error');
  const student=currentStudent(id);if(!student)return setMessage('Teilnehmerkonto wurde nicht gefunden.','error');
  const button=document.getElementById('repairStudentFirebaseAccountBtn');
  if(button){button.disabled=true;button.textContent='Zugang wird geprüft …'}
  setMessage('Firebase-Zugang und Kursprofil werden geprüft …');
  try{
    const result=await ensureFirebaseAccount(id);
    if(result.pendingLogin){
      const mail=result.resetSent
        ? `Eine Passwort-Mail wurde an ${result.email} gesendet.`
        : `Die automatische Passwort-Mail konnte momentan nicht gesendet werden${String(result.resetError?.code||'').includes('too-many-requests')?' (Firebase-Anfragelimit)':''}. Der TN kann auf der Login-Seite „Passwort vergessen“ verwenden.`;
      setMessage(`Das Firebase-Konto existiert bereits. ${result.preparedProfiles} TN-Profil${result.preparedProfiles===1?' ist':'e sind'} für die automatische Verknüpfung vorbereitet. ${mail} Danach meldet sich der TN einmal mit E-Mail, Passwort und Kurscode an; dabei wird das bestehende Firebase-Konto automatisch mit dem TN-Profil verbunden.`,'ok');
      if(button){button.textContent='Passwort-Mail erneut senden';button.disabled=false}
      setTimeout(()=>{try{api.refresh()}catch(e){}},500);
      return;
    }
    if(!result.created&&!result.resetSent)await window.firebase.auth().sendPasswordResetEmail(result.email);
    const cleanup=result.removedGhosts?` ${result.removedGhosts} fehlerhafter Zwischen-Datensatz wurde entfernt.`:'';
    setMessage(`Firebase-Zugang repariert. ${result.linked} echtes Kursprofil${result.linked===1?' ist':'e sind'} mit dem Konto verbunden.${cleanup} Passwort-Mail wurde an ${result.email} gesendet.`,'ok');
    if(button){button.textContent='Zugang repariert';button.disabled=false}
    setTimeout(()=>{try{api.refresh()}catch(e){}},500);
  }catch(error){
    console.error('[SprachPilot] student account repair failed',error);setMessage(friendlyError(error),'error');
    if(button){
      button.disabled=false;
      button.textContent=text(student.authUid)?'Zugang prüfen & Passwort-Mail':text(student.authProvisioningStatus)==='owner-existing-account-awaiting-login'?'Passwort-Mail erneut senden':'Firebase-Zugang einrichten';
    }
  }
}
function enhanceEdit(id){
  previousEdit(id);
  if(!api.state?.isOwner)return;
  const student=currentStudent(id);if(!student)return;
  const email=emailOf(student);if(!validEmail(email))return;
  const saveButton=document.getElementById('saveFirebaseStudentBtn');if(!saveButton||document.getElementById('repairStudentFirebaseAccountBtn'))return;
  const pending=text(student.authProvisioningStatus)==='owner-existing-account-awaiting-login';
  const button=document.createElement('button');button.type='button';button.id='repairStudentFirebaseAccountBtn';button.className='sp-button secondary';
  button.textContent=text(student.authUid)?'Zugang prüfen & Passwort-Mail':pending?'Passwort-Mail erneut senden':'Firebase-Zugang einrichten';
  button.title=text(student.authUid)?'Kursprofil korrekt mit dem Firebase-Konto verknüpfen und Passwort-Mail senden':pending?'Bestehendes Firebase-Konto ist erkannt; Passwort-Mail erneut senden und Verknüpfung beim nächsten TN-Login abschließen':'Firebase-Konto anlegen oder ein vorhandenes Konto für die Verknüpfung beim nächsten Login vorbereiten';
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();void repairAccess(id)});
  saveButton.parentElement?.insertBefore(button,saveButton);
}

api.editStudent=enhanceEdit;
api.repairStudentFirebaseAccess=repairAccess;
api.ensureStudentFirebaseAccount=ensureFirebaseAccount;
})();
