(function(){
'use strict';

const api=window.SPTeacherDashboard;
if(!api||api.__accountRepairInstalled)return;
api.__accountRepairInstalled=true;

const previousEdit=api.editStudent;
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const studentId=student=>text(student?.canonicalStudentId||student?.docId||student?.studentId||student?.userId||student?.id);
const studentName=student=>text([student?.vorname||student?.firstName,student?.nachname||student?.lastName].filter(Boolean).join(' '))||text(student?.name||student?.displayName)||'Teilnehmer/in';

function database(){
  if(window.db&&typeof window.db.collection==='function')return window.db;
  if(window.firebase&&typeof window.firebase.firestore==='function')return window.firebase.firestore();
  throw new Error('FIRESTORE_NOT_AVAILABLE');
}
function stamp(){return window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date()}
function currentStudent(id){return (api.state?.students||[]).find(student=>studentId(student)===String(id||''))}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm(email))}
function emailOf(student){return norm(student?.authEmail||student?.email)}
function matchingProfiles(email){
  const wanted=norm(email);
  return (api.state?.students||[]).filter(student=>emailOf(student)===wanted);
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
  if(code.includes('email-already-in-use'))return 'Zu dieser E-Mail existiert bereits ein Firebase-Konto, aber im TN-Profil fehlt die Verknüpfung. Die Passwort-Mail wurde ausgelöst; die automatische Verknüpfung benötigt den serverseitigen Kontodienst.';
  if(code.includes('too-many-requests'))return 'Firebase hat zu viele Anfragen erkannt. Bitte einige Minuten warten und erneut versuchen.';
  if(code.includes('network-request-failed'))return 'Keine Verbindung zu Firebase. Bitte Internetverbindung prüfen.';
  if(code.includes('permission-denied'))return 'Das Owner-Konto darf diese Teilnehmerprofile momentan nicht aktualisieren.';
  return message||'Der Firebase-Zugang konnte nicht repariert werden.';
}
function updateLocalProfiles(email,uid){
  const wanted=norm(email);
  for(const student of api.state?.students||[]){
    if(emailOf(student)!==wanted)continue;
    student.authUid=uid;student.authEmail=wanted;student.authEmailLower=wanted;student.authVersion=Math.max(3,Number(student.authVersion||0));
    const id=studentId(student);
    if(id&&window.__SP_STUDENTS_BY_ID&&window.__SP_STUDENTS_BY_ID[id]){
      Object.assign(window.__SP_STUDENTS_BY_ID[id],{authUid:uid,authEmail:wanted,authEmailLower:wanted,authVersion:Math.max(3,Number(window.__SP_STUDENTS_BY_ID[id].authVersion||0))});
    }
  }
}
async function bindMatchingProfiles(email,uid,status='owner-account-repaired-client-v1'){
  const rows=matchingProfiles(email),db=database(),batch=db.batch(),now=stamp();
  let count=0;
  for(const student of rows){
    const id=studentId(student);if(!id)continue;
    batch.set(db.collection('students').doc(id),{
      authUid:String(uid),authEmail:norm(email),authEmailLower:norm(email),authVersion:3,
      authProvisioningStatus:status,authProvisioningEmail:norm(email),authProvisioningUpdatedAt:now
    },{merge:true});
    count++;
  }
  if(!count)throw new Error('STUDENT_PROFILE_NOT_FOUND');
  await batch.commit();updateLocalProfiles(email,String(uid));return count;
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
async function ensureFirebaseAccount(id){
  const student=currentStudent(id);if(!student)throw new Error('Teilnehmerkonto wurde nicht gefunden.');
  const email=emailOf(student);if(!validEmail(email))throw new Error('Für diesen TN ist keine gültige E-Mail gespeichert.');
  const rows=matchingProfiles(email),bound=rows.find(row=>text(row.authUid));
  if(bound){
    const uid=text(bound.authUid),linked=await bindMatchingProfiles(email,uid,'owner-duplicate-profile-repaired-client-v1');
    return{email,uid,linked,created:false};
  }

  let secondary=null,committed=false;
  try{
    secondary=await createSecondaryAccount(email,studentName(student));
    const uid=text(secondary.user?.uid);if(!uid)throw new Error('NEW_AUTH_USER_MISSING');
    const linked=await bindMatchingProfiles(email,uid,'owner-account-created-client-v1');
    committed=true;
    return{email,uid,linked,created:true};
  }catch(error){
    if(String(error?.code||'').includes('email-already-in-use')){
      try{await window.firebase.auth().sendPasswordResetEmail(email)}catch(resetError){console.warn('[SprachPilot] existing unbound account reset failed',resetError)}
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
  if(button){button.disabled=true;button.textContent='Zugang wird repariert …'}
  setMessage('Firebase-Zugang und doppelte Kursprofile werden geprüft …');
  try{
    const result=await ensureFirebaseAccount(id);
    if(!result.created){
      await window.firebase.auth().sendPasswordResetEmail(result.email);
      setMessage(`Firebase-Zugang repariert. ${result.linked} Kursprofil${result.linked===1?'':'e'} sind mit demselben Konto verbunden. Passwort-Mail wurde an ${result.email} gesendet.`,'ok');
    }else{
      setMessage(`Firebase-Konto wurde eingerichtet und mit ${result.linked} Kursprofil${result.linked===1?'':'en'} verbunden. Bestätigungs- und Passwort-Mail wurden an ${result.email} gesendet.`,'ok');
    }
    if(button){button.textContent='Zugang repariert';button.disabled=false}
    setTimeout(()=>{try{api.navigate('students')}catch(e){}},700);
  }catch(error){
    console.error('[SprachPilot] student account repair failed',error);setMessage(friendlyError(error),'error');
    if(button){button.disabled=false;button.textContent=text(student.authUid)?'Zugang prüfen & Passwort-Mail':'Firebase-Zugang einrichten'}
  }
}
function enhanceEdit(id){
  previousEdit(id);
  if(!api.state?.isOwner)return;
  const student=currentStudent(id);if(!student)return;
  const email=emailOf(student);if(!validEmail(email))return;
  const saveButton=document.getElementById('saveFirebaseStudentBtn');if(!saveButton||document.getElementById('repairStudentFirebaseAccountBtn'))return;
  const button=document.createElement('button');button.type='button';button.id='repairStudentFirebaseAccountBtn';button.className='sp-button secondary';
  button.textContent=text(student.authUid)?'Zugang prüfen & Passwort-Mail':'Firebase-Zugang einrichten';
  button.title=text(student.authUid)?'Doppelte Kursprofile verknüpfen und Passwort-Mail senden':'Firebase-Konto anlegen und Einrichtungs-Mails senden';
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();void repairAccess(id)});
  saveButton.parentElement?.insertBefore(button,saveButton);
}

api.editStudent=enhanceEdit;
api.repairStudentFirebaseAccess=repairAccess;
api.ensureStudentFirebaseAccount=ensureFirebaseAccount;
})();
