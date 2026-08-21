(function(){
'use strict';

const REGION='europe-west1';
const SDK_TIMEOUT_MS=8000;
const CALL_TIMEOUT_MS=12000;
const api=window.SPTeacherDashboard;
if(!api||api.__accountAdminInstalled)return;
api.__accountAdminInstalled=true;

const originalEdit=api.editStudent;
const originalSave=api.saveStudent;
let functionsPromise=null;
let adminFunctionUnavailable=false;

const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const uniq=values=>[...new Set((values||[]).filter(Boolean).map(value=>String(value).trim()).filter(Boolean))];
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const studentId=student=>text(student?.canonicalStudentId||student?.docId||student?.studentId||student?.userId||student?.id);
const studentName=student=>text([student?.vorname||student?.firstName,student?.nachname||student?.lastName].filter(Boolean).join(' '))||text(student?.name||student?.displayName)||'Teilnehmer/in';
const studentCourse=student=>text(student?.courseCode||student?.kurs||student?.kursnummer||student?.courseDocId);

function database(){
  if(window.db&&typeof window.db.collection==='function')return window.db;
  const firebase=window.firebase;
  if(firebase&&typeof firebase.firestore==='function')return firebase.firestore();
  throw new Error('FIRESTORE_NOT_AVAILABLE');
}
function serverTimestamp(){
  const firebase=window.firebase;
  return firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();
}
function status(message,kind=''){
  const el=document.getElementById('spStatus');
  if(!el)return;
  el.textContent=message;
  el.className='sp-status'+(kind?' '+kind:'');
}
function modalStatus(message='',kind=''){
  const el=document.getElementById('spFirebaseSaveStatus');
  if(!el)return;
  el.textContent=message;
  el.className='sp-status'+(kind?' '+kind:'');
  el.hidden=!message;
}
function actionStatus(message='',kind=''){
  status(message,kind);
  modalStatus(message,kind);
}
function timeoutError(code,message){
  const error=new Error(message);
  error.code=code;
  return error;
}
function withTimeout(promise,ms,code,message){
  return new Promise((resolve,reject)=>{
    let settled=false;
    const timer=setTimeout(()=>{
      if(settled)return;
      settled=true;
      reject(timeoutError(code,message));
    },ms);
    Promise.resolve(promise).then(value=>{
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      resolve(value);
    },error=>{
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      reject(error);
    });
  });
}
function openModal(html){
  document.getElementById('spModalBackdrop')?.remove();
  const back=document.createElement('div');
  back.id='spModalBackdrop';
  back.className='sp-modal-backdrop';
  back.innerHTML=`<div class="sp-modal" role="dialog" aria-modal="true">${html}</div>`;
  back.addEventListener('click',event=>{if(event.target===back)back.remove()});
  document.body.appendChild(back);
}
function currentStudent(id){return api.state.students.find(student=>studentId(student)===id)}
function courseOptions(student){
  return api.state.courses.map(course=>{
    const code=text(course.courseCode||course.code||course.kurs||course.kursnummer||course.id||course.name);
    const name=text(course.courseName||course.name||code)||'Unbenannter Kurs';
    return `<option value="${esc(code)}" ${norm(studentCourse(student))===norm(code)?'selected':''}>${esc(name)}</option>`;
  }).join('');
}
function ownerEditStudent(id){
  const student=currentStudent(id);
  if(!student)return;
  if(!api.state.isOwner)return originalEdit(id);
  const bound=!!student.authUid;
  const note=bound
    ? '<strong>Firebase-Konto verbunden.</strong><br>Die Login-E-Mail wird in Firebase umgestellt. Teilnehmer-ID, Punkte und Fortschritte bleiben erhalten. Die neue Adresse muss danach bestätigt werden.'
    : '<strong>Noch kein Firebase-Login gebunden.</strong><br>Die E-Mail wird in Firestore und im Teilnehmer-Lookup gespeichert und später für die Kontoerstellung verwendet.';
  openModal(`<div class="sp-modal-head"><div><h2 style="margin:0">Teilnehmende bearbeiten</h2><div class="sp-meta">${esc(studentName(student))}</div></div><button type="button" class="sp-icon-btn" onclick="SPTeacherDashboard.closeModal()">Schließen</button></div>
  <div class="sp-form-grid">
    <div class="sp-field"><label>Vorname</label><input id="editFirstName" value="${esc(student.vorname||student.firstName||'')}"></div>
    <div class="sp-field"><label>Nachname</label><input id="editLastName" value="${esc(student.nachname||student.lastName||'')}"></div>
    <div class="sp-field wide"><label>${bound?'Login-E-Mail':'E-Mail'}</label><input id="editEmail" type="email" value="${esc(student.authEmail||student.email||'')}" autocomplete="email"></div>
    <div class="sp-field wide"><label>Kurs</label><select id="editCourse"><option value="">Ohne Kurs</option>${courseOptions(student)}</select></div>
  </div>
  <div class="sp-owner-note" style="margin-top:14px">${note}</div>
  <div id="spFirebaseSaveStatus" class="sp-status" aria-live="polite" hidden style="margin-top:14px"></div>
  <div class="sp-row-actions" style="margin-top:18px"><button type="button" class="sp-button secondary" onclick="SPTeacherDashboard.closeModal()">Abbrechen</button><button type="button" class="sp-button" id="saveFirebaseStudentBtn">In Firebase speichern</button></div>`);
  const button=document.getElementById('saveFirebaseStudentBtn');
  if(button){
    button.dataset.studentId=id;
    button.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      void ownerSaveStudent(id);
    });
  }
}

function regionalFunctions(){
  const firebase=window.firebase;
  if(!firebase||typeof firebase.app!=='function')throw timeoutError('sp/firebase-app-missing','Firebase App ist nicht verfügbar.');
  const app=firebase.app();
  if(!app||typeof app.functions!=='function')throw timeoutError('sp/functions-sdk-missing','Firebase Functions ist nicht verfügbar.');
  return app.functions(REGION);
}
async function ensureFunctions(){
  const firebase=window.firebase;
  if(firebase&&typeof firebase.functions==='function')return regionalFunctions();
  if(functionsPromise)return functionsPromise;
  const loader=new Promise((resolve,reject)=>{
    let script=document.querySelector('script[data-sp-functions-sdk]');
    const onLoad=()=>{
      script.dataset.spLoaded='1';
      const current=window.firebase;
      if(current&&typeof current.functions==='function')resolve(regionalFunctions());
      else reject(timeoutError('sp/functions-sdk-missing','Firebase Functions wurde geladen, ist aber nicht verfügbar.'));
    };
    const onError=()=>reject(timeoutError('sp/functions-sdk-load','Firebase Functions konnte nicht geladen werden.'));
    if(script){
      if(script.dataset.spLoaded==='1')return onLoad();
      script.addEventListener('load',onLoad,{once:true});
      script.addEventListener('error',onError,{once:true});
      return;
    }
    script=document.createElement('script');
    script.src='https://www.gstatic.com/firebasejs/10.12.5/firebase-functions-compat.js';
    script.dataset.spFunctionsSdk='1';
    script.addEventListener('load',onLoad,{once:true});
    script.addEventListener('error',onError,{once:true});
    document.head.appendChild(script);
  });
  functionsPromise=withTimeout(loader,SDK_TIMEOUT_MS,'sp/functions-sdk-timeout','Firebase Functions konnte nicht rechtzeitig geladen werden.')
    .catch(error=>{
      functionsPromise=null;
      if(String(error?.code||'').includes('functions-sdk'))document.querySelector('script[data-sp-functions-sdk]')?.remove();
      throw error;
    });
  return functionsPromise;
}
function backendUnavailable(error){
  const code=String(error?.code||'').toLowerCase();
  const message=String(error?.message||'').trim().toLowerCase();
  return code.includes('functions/not-found')||code.includes('functions/unavailable')||code.includes('functions/internal')&&(!message||message==='internal')||code.includes('functions-call-timeout');
}
function friendlyError(error){
  const code=String(error?.code||'');
  const message=String(error?.message||'');
  const identity=String(error?.identityCode||'');
  if(code.includes('functions-sdk-timeout')||code.includes('functions-sdk-load')||code.includes('functions-sdk-missing'))return 'Firebase Functions konnte nicht geladen werden.';
  if(code.includes('firebase-app-missing'))return 'Firebase App ist nicht vollständig geladen. Bitte die Seite neu laden.';
  if(code.includes('functions-call-timeout'))return 'Firebase antwortet zu langsam.';
  if(code.includes('already-exists')||code.includes('email-already-in-use')||identity.includes('EMAIL_EXISTS')||message.includes('EMAIL_ALREADY_IN_USE')||message.includes('STUDENT_LOOKUP_ALREADY_IN_USE'))return 'Diese E-Mail-Adresse wird bereits von einem anderen Firebase-Konto verwendet.';
  if(code.includes('permission-denied')||message.includes('OWNER_REQUIRED'))return 'Nur das bestätigte Owner-Konto darf diese E-Mail-Änderung durchführen.';
  if(code.includes('invalid-argument')||code.includes('invalid-email'))return 'Bitte eine gültige E-Mail-Adresse eingeben.';
  if(code.includes('network-request-failed'))return 'Keine Verbindung zu Firebase. Bitte Internetverbindung prüfen.';
  if(code.includes('too-many-requests'))return 'Firebase hat zu viele Versuche erkannt. Bitte einige Minuten warten und erneut versuchen.';
  if(code.includes('internal')&&message.toLowerCase()==='internal')return 'Der serverseitige Kontodienst ist nicht veröffentlicht.';
  return message||'Das Firebase-Konto konnte nicht aktualisiert werden.';
}

function lookupClean(value){
  return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function courseValues(student={}){
  return uniq([student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course]);
}
function lookupKeys(email,courses=[]){
  const mail=norm(email);
  if(!mail)return[];
  return uniq((courses||[]).map(course=>`${lookupClean(course)}_${lookupClean(mail)}`).filter(key=>key!=='_'));
}
function randomPassword(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes=new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  let body='';
  for(const byte of bytes)body+=chars[byte%chars.length];
  return `Aa1!${body}`;
}
async function prepareLookupMigration(student,id,email,courseCode){
  const db=database();
  const oldEmail=norm(student.authEmail||student.email);
  const oldKeys=lookupKeys(oldEmail,courseValues(student));
  const newKeys=lookupKeys(email,courseCode?[courseCode]:[]);
  const oldRows=[];
  for(const key of newKeys){
    const ref=db.collection('studentLookups').doc(key),snap=await ref.get();
    if(!snap.exists)continue;
    const mapped=text((snap.data()||{}).canonicalStudentId||(snap.data()||{}).studentId);
    if(mapped&&mapped!==id){
      const error=new Error('EMAIL_ALREADY_IN_USE');
      error.code='sp/email-already-in-use';
      throw error;
    }
  }
  for(const key of oldKeys.filter(key=>!newKeys.includes(key))){
    const ref=db.collection('studentLookups').doc(key),snap=await ref.get();
    if(!snap.exists)continue;
    const mapped=text((snap.data()||{}).canonicalStudentId||(snap.data()||{}).studentId);
    if(mapped===id)oldRows.push({key,ref});
  }
  return{oldRows,newKeys};
}
async function collectBoundDocs(student,id){
  const db=database();
  const ids=uniq([id,student.canonicalStudentId,student.docId,student.studentId,student.userId,...(Array.isArray(student.aliasIds)?student.aliasIds:[])]).slice(0,80);
  const progress=[];
  const rankings=[];
  for(const key of ids){
    const progressRef=db.collection('progress').doc(key);
    try{const snap=await progressRef.get();if(snap.exists)progress.push({ref:progressRef,data:snap.data()||{}})}catch(error){console.warn('Progress binding read skipped',key,error)}
    const rankingRef=db.collection('studentRankings').doc(key);
    try{const snap=await rankingRef.get();if(snap.exists)rankings.push({ref:rankingRef,data:snap.data()||{}})}catch(error){console.warn('Ranking binding read skipped',key,error)}
  }
  return{ids,progress,rankings};
}
async function createSecondaryFirebaseUser(email,displayName){
  const firebase=window.firebase;
  if(!firebase||typeof firebase.initializeApp!=='function'||typeof firebase.app!=='function')throw new Error('FIREBASE_APP_NOT_AVAILABLE');
  const appName=`sp-email-migration-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const secondary=firebase.initializeApp(firebase.app().options,appName);
  const auth=secondary.auth();
  let user=null;
  try{
    const credential=await auth.createUserWithEmailAndPassword(email,randomPassword());
    user=credential?.user||null;
    if(!user?.uid)throw new Error('NEW_AUTH_USER_MISSING');
    if(displayName)try{await user.updateProfile({displayName})}catch(error){console.warn('Display name update skipped',error)}
    await user.sendEmailVerification();
    await auth.sendPasswordResetEmail(email);
    return{secondary,auth,user};
  }catch(error){
    if(user)try{await user.delete()}catch(cleanupError){console.warn('Temporary Firebase user cleanup failed',cleanupError)}
    try{await auth.signOut()}catch(e){}
    try{await secondary.delete()}catch(e){}
    throw error;
  }
}
async function disposeSecondaryAccount(context,{deleteUser=false}={}){
  if(!context)return;
  if(deleteUser&&context.user)try{await context.user.delete()}catch(error){console.warn('Temporary Firebase user rollback failed',error)}
  try{await context.auth?.signOut()}catch(e){}
  try{await context.secondary?.delete()}catch(e){}
}
async function migrateBoundAccountLocally({student,id,email,firstName,lastName,courseCode}){
  const db=database();
  const oldUid=text(student.authUid);
  if(!oldUid)throw new Error('BOUND_AUTH_UID_MISSING');
  const lookup=await prepareLookupMigration(student,id,email,courseCode);
  const boundDocs=await collectBoundDocs(student,id);
  const displayName=text([firstName,lastName].filter(Boolean).join(' '))||studentName(student);
  let secondary=null,committed=false;
  try{
    secondary=await createSecondaryFirebaseUser(email,displayName);
    const newUid=text(secondary.user?.uid);
    if(!newUid)throw new Error('NEW_AUTH_USER_MISSING');
    const batch=db.batch(),stamp=serverTimestamp();
    batch.set(db.collection('students').doc(id),{
      vorname:firstName,nachname:lastName,
      email,emailLower:email,
      kurs:courseCode,kursnummer:courseCode,courseCode,
      authUid:newUid,authEmail:email,authEmailLower:email,authEmailVerified:false,
      authVersion:3,authProvisioningEmail:email,
      authProvisioningStatus:'owner-email-migrated-client-v1',
      authPreviousUid:oldUid,
      authReboundByOwnerUid:text(api.state.user?.uid),
      authReboundAt:stamp,updatedAt:stamp
    },{merge:true});
    for(const key of lookup.newKeys){
      batch.set(db.collection('studentLookups').doc(key),{
        lookupVersion:1,canonicalStudentId:id,studentId:id,email,
        courseKeys:courseCode?[courseCode]:[],active:student.active!==false,updatedAt:stamp
      },{merge:true});
    }
    for(const row of lookup.oldRows)batch.delete(row.ref);
    for(const row of boundDocs.progress){
      batch.set(row.ref,{authUid:newUid,authEmail:email,authReboundAt:stamp},{merge:true});
    }
    for(const row of boundDocs.rankings){
      batch.set(row.ref,{authUid:newUid,updatedAt:stamp},{merge:true});
    }
    await batch.commit();
    committed=true;
    return{
      ok:true,migrated:true,studentId:id,authUid:newUid,authEmail:email,
      emailVerified:false,verificationSent:true,passwordResetSent:true,
      previousAuthUid:oldUid,progressBindingsUpdated:boundDocs.progress.length,rankingBindingsUpdated:boundDocs.rankings.length
    };
  }catch(error){
    if(!committed)await disposeSecondaryAccount(secondary,{deleteUser:true});
    throw error;
  }finally{
    if(committed)await disposeSecondaryAccount(secondary);
  }
}
async function callAdminUpdate(payload){
  if(adminFunctionUnavailable)throw timeoutError('sp/admin-function-unavailable','ADMIN_FUNCTION_UNAVAILABLE');
  try{
    const functions=await ensureFunctions();
    const callable=functions.httpsCallable('updateStudentAccount');
    const response=await withTimeout(callable(payload),CALL_TIMEOUT_MS,'sp/functions-call-timeout','Firebase hat den Speichervorgang nicht rechtzeitig bestätigt.');
    return response?.data||{};
  }catch(error){
    if(backendUnavailable(error))adminFunctionUnavailable=true;
    throw error;
  }
}
function updateLocalStudent(id,{email,firstName,lastName,courseCode,result}){
  const index=api.state.students.findIndex(item=>studentId(item)===id);
  if(index<0)return;
  api.state.students[index]={
    ...api.state.students[index],vorname:firstName,nachname:lastName,
    email,emailLower:email,
    ...(result?.authUid?{authUid:result.authUid,authEmail:result.authEmail||email,authEmailLower:email,authEmailVerified:result.emailVerified===true}:{}),
    kurs:courseCode,kursnummer:courseCode,courseCode
  };
  if(window.__SP_STUDENTS_BY_ID)window.__SP_STUDENTS_BY_ID[id]=api.state.students[index];
}
async function ownerSaveStudent(id){
  const student=currentStudent(id);
  if(!student)return actionStatus('Teilnehmerkonto wurde nicht gefunden.','error');
  if(!api.state.isOwner)return originalSave(id);

  const email=norm(document.getElementById('editEmail')?.value);
  const firstName=text(document.getElementById('editFirstName')?.value);
  const lastName=text(document.getElementById('editLastName')?.value);
  const courseCode=text(document.getElementById('editCourse')?.value);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return actionStatus('Bitte eine gültige E-Mail-Adresse eingeben.','error');

  const currentEmail=norm(student.authEmail||student.email);
  if(email===currentEmail||!student.authUid){
    actionStatus('Änderungen werden in Firebase gespeichert …');
    return originalSave(id);
  }

  const button=document.getElementById('saveFirebaseStudentBtn');
  if(button){button.disabled=true;button.textContent='Wird gespeichert …'}
  actionStatus('Login-E-Mail und Teilnehmerkonto werden in Firebase aktualisiert …');
  try{
    const payload={studentId:id,email,firstName,lastName,courseCode};
    let result=null;
    try{
      result=await callAdminUpdate(payload);
    }catch(adminError){
      if(!backendUnavailable(adminError)&&String(adminError?.code||'')!=='sp/admin-function-unavailable')throw adminError;
      actionStatus('Serverfunktion nicht verfügbar. Sichere Firebase-Kontomigration wird ausgeführt …');
      result=await migrateBoundAccountLocally({student,id,email,firstName,lastName,courseCode});
    }
    updateLocalStudent(id,{email,firstName,lastName,courseCode,result});
    api.closeModal();
    const migrated=result?.migrated===true;
    status(migrated
      ? 'Login-E-Mail geändert. Der Firebase-Zugang wurde auf die neue Adresse umgebunden. Bestätigungs- und Passwort-E-Mail wurden gesendet.'
      : result?.verificationSent?'Login-E-Mail geändert. Eine Bestätigungs-E-Mail wurde an die neue Adresse gesendet.':'E-Mail in Firebase gespeichert.','ok');
    api.navigate('students');
  }catch(error){
    console.error('[SprachPilot] Firebase student update failed',error);
    actionStatus('Änderung fehlgeschlagen: '+friendlyError(error),'error');
    if(button){button.disabled=false;button.textContent='In Firebase speichern'}
  }
}

api.editStudent=ownerEditStudent;
api.saveStudent=ownerSaveStudent;

document.addEventListener('click',event=>{
  if(event.target.closest('.sp-mobile-sheet [data-view],.sp-mobile-sheet button,.sp-mobile-sheet a')){
    document.querySelectorAll('.sp-mobile-more[open]').forEach(details=>details.removeAttribute('open'));
  }
});
})();
