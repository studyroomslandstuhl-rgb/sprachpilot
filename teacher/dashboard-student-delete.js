(function(){
'use strict';

const api=window.SPTeacherDashboard;
if(!api||api.__studentDeleteInstalled)return;
api.__studentDeleteInstalled=true;

const REGION='europe-west1';
const SDK_TIMEOUT_MS=8000;
const DELETE_TIMEOUT_MS=30000;
let functionsPromise=null;
const previousEdit=api.editStudent;

const text=value=>String(value==null?'':value).trim();
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const studentName=student=>text([student?.vorname||student?.firstName,student?.nachname||student?.lastName].filter(Boolean).join(' '))||text(student?.name||student?.displayName)||'Teilnehmer/in';
const studentDocId=student=>text(student?.__docId||student?.id||student?.docId||student?.canonicalStudentId||student?.studentId||student?.userId);

function studentIdentifiers(student){
  const aliases=Array.isArray(student?.aliasIds)?student.aliasIds:[];
  return [...new Set([student?.__docId,student?.id,student?.docId,student?.canonicalStudentId,student?.studentId,student?.userId,...aliases].map(text).filter(Boolean))];
}
function currentStudent(id){
  const wanted=text(id);
  return (api.state?.students||[]).find(student=>studentIdentifiers(student).includes(wanted));
}
function database(){
  if(window.db&&typeof window.db.collection==='function')return window.db;
  if(window.firebase&&typeof window.firebase.firestore==='function')return window.firebase.firestore();
  throw new Error('FIRESTORE_NOT_AVAILABLE');
}
function status(message,kind=''){
  const el=document.getElementById('spStatus');if(!el)return;
  el.textContent=message;el.className='sp-status'+(kind?' '+kind:'');
}
function timeoutError(code,message){const error=new Error(message);error.code=code;return error}
function withTimeout(promise,ms,code,message){
  return new Promise((resolve,reject)=>{
    let settled=false;
    const timer=setTimeout(()=>{if(settled)return;settled=true;reject(timeoutError(code,message))},ms);
    Promise.resolve(promise).then(value=>{if(settled)return;settled=true;clearTimeout(timer);resolve(value)},error=>{if(settled)return;settled=true;clearTimeout(timer);reject(error)});
  });
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
    const loaded=()=>{
      script.dataset.spLoaded='1';
      const current=window.firebase;
      if(current&&typeof current.functions==='function')resolve(regionalFunctions());
      else reject(timeoutError('sp/functions-sdk-missing','Firebase Functions wurde geladen, ist aber nicht verfügbar.'));
    };
    const failed=()=>reject(timeoutError('sp/functions-sdk-load','Firebase Functions konnte nicht geladen werden.'));
    if(script){
      if(script.dataset.spLoaded==='1')return loaded();
      script.addEventListener('load',loaded,{once:true});script.addEventListener('error',failed,{once:true});return;
    }
    script=document.createElement('script');
    script.src='https://www.gstatic.com/firebasejs/10.12.5/firebase-functions-compat.js';
    script.dataset.spFunctionsSdk='1';
    script.addEventListener('load',loaded,{once:true});script.addEventListener('error',failed,{once:true});document.head.appendChild(script);
  });
  functionsPromise=withTimeout(loader,SDK_TIMEOUT_MS,'sp/functions-sdk-timeout','Firebase Functions konnte nicht rechtzeitig geladen werden.').catch(error=>{functionsPromise=null;throw error});
  return functionsPromise;
}
function backendUnavailable(error){
  const code=String(error?.code||'').toLowerCase(),message=String(error?.message||'').toLowerCase();
  return code.includes('functions/not-found')||code.includes('functions/unavailable')||code.includes('functions-call-timeout')||code.includes('functions-sdk')||
    (code.includes('functions/internal')&&(!message||message==='internal'));
}
function friendlyError(error){
  const code=String(error?.code||'').toLowerCase(),message=String(error?.message||''),details=String(error?.details||'');
  const diagnostic=`${message} ${details}`;
  if(diagnostic.includes('STUDENT_OUTSIDE_TEACHER_COURSES'))return 'Dieser TN hat mindestens ein Profil in einem Kurs, für den du keine Berechtigung hast. Die vollständige Löschung darf dann nur der Owner durchführen.';
  if(diagnostic.includes('STUDENT_AUTH_IS_TEACHER'))return 'Dieses Firebase-Konto gehört auch zu einer Lehrkraft und darf nicht als TN-Konto gelöscht werden.';
  if(diagnostic.includes('STUDENT_NOT_FOUND')||code.includes('not-found'))return 'Der TN wurde bereits gelöscht oder nicht mehr gefunden.';
  if(diagnostic.includes('DELETE_CONFIRMATION_REQUIRED'))return 'Die Löschung wurde nicht bestätigt.';
  if(diagnostic.includes('TEACHER_REQUIRED')||code.includes('permission-denied'))return 'Du hast keine Berechtigung für die vollständige Löschung dieses TN.';
  if(diagnostic.includes('STUDENT_AUTH_DELETE_FAILED'))return 'Das Firebase-Login konnte nicht gelöscht werden. Es wurden keine Teilnehmerprofile entfernt. Bitte erneut versuchen.';
  if(diagnostic.includes('STUDENT_DATA_DELETE_FAILED'))return 'Das Firebase-Login wurde entfernt, aber die Datensätze konnten nicht vollständig bereinigt werden. Bitte denselben TN erneut löschen.';
  if(backendUnavailable(error))return 'Der serverseitige Löschdienst ist nicht erreichbar.';
  return message||'Der TN konnte nicht vollständig gelöscht werden.';
}
function canDeleteLocally(student){
  return api.state?.isOwner===true&&!text(student?.authUid)&&!text(student?.authEmail)&&!text(student?.email);
}
function openModal(html){
  document.getElementById('spModalBackdrop')?.remove();
  const back=document.createElement('div');back.id='spModalBackdrop';back.className='sp-modal-backdrop';
  back.innerHTML=`<div class="sp-modal" role="dialog" aria-modal="true">${html}</div>`;
  back.addEventListener('click',event=>{if(event.target===back)back.remove()});document.body.appendChild(back);
}
function installDeleteButton(id){
  const modal=document.querySelector('#spModalBackdrop .sp-modal');if(!modal||modal.querySelector('#deleteFirebaseStudentBtn'))return;
  const actions=modal.querySelector('.sp-row-actions:last-of-type')||modal.querySelector('.sp-row-actions');if(!actions)return;
  const button=document.createElement('button');button.type='button';button.id='deleteFirebaseStudentBtn';button.className='sp-button danger';button.textContent='TN vollständig löschen';
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openDeleteConfirmation(id)});
  actions.insertBefore(button,actions.firstChild);
}
function openDeleteConfirmation(id){
  const student=currentStudent(id);if(!student)return status('TN wurde nicht gefunden.','error');
  const email=text(student.authEmail||student.email)||'keine E-Mail';
  const localNote=canDeleteLocally(student)?'<br><br><strong>Hinweis:</strong> Für diesen TN ist kein Firebase-Login hinterlegt. Als Owner können die Teilnehmerdaten deshalb auch dann gelöscht werden, wenn der serverseitige Kontodienst nicht verfügbar ist.':'';
  openModal(`<div class="sp-modal-head"><div><h2 style="margin:0">TN vollständig löschen</h2><div class="sp-meta">${esc(studentName(student))} · ${esc(email)}</div></div><button type="button" class="sp-icon-btn" onclick="SPTeacherDashboard.closeModal()">Schließen</button></div>
  <div class="sp-owner-note" style="margin-top:14px"><strong>Diese Löschung kann nicht rückgängig gemacht werden.</strong><br>Gelöscht werden das Firebase-Login, alle mit diesem Login verbundenen TN-Profile, Fortschritte, Ranglisten-Einträge und Teilnehmer-Lookups. Hat dieselbe Person mehrere Kursprofile, werden diese ebenfalls gelöscht.${localNote}</div>
  <div class="sp-field wide" style="margin-top:16px"><label>Zur Bestätigung LÖSCHEN eingeben</label><input id="deleteStudentConfirmText" autocomplete="off" placeholder="LÖSCHEN"></div>
  <div id="spDeleteStudentStatus" class="sp-status" aria-live="polite" hidden style="margin-top:14px"></div>
  <div class="sp-row-actions" style="margin-top:18px"><button type="button" class="sp-button secondary" onclick="SPTeacherDashboard.closeModal()">Abbrechen</button><button type="button" class="sp-button danger" id="confirmDeleteFirebaseStudentBtn">Endgültig löschen</button></div>`);
  document.getElementById('confirmDeleteFirebaseStudentBtn')?.addEventListener('click',()=>void deleteStudent(id));
  setTimeout(()=>document.getElementById('deleteStudentConfirmText')?.focus(),30);
}
function deleteModalStatus(message,kind=''){
  const el=document.getElementById('spDeleteStudentStatus');if(!el)return;
  el.hidden=!message;el.textContent=message;el.className='sp-status'+(kind?' '+kind:'');
}
async function callDelete(studentId){
  const functions=await ensureFunctions(),callable=functions.httpsCallable('deleteStudentAccount');
  const response=await withTimeout(callable({studentId,confirmation:'DELETE_STUDENT'}),DELETE_TIMEOUT_MS,'sp/functions-call-timeout','Firebase hat die Löschung nicht rechtzeitig bestätigt.');
  return response?.data||{};
}
function addRef(refs,ref){
  if(ref?.path)refs.set(ref.path,ref);
}
async function collectQueryRefs(refs,collectionName,field,value){
  if(!value)return;
  const snap=await database().collection(collectionName).where(field,'==',value).get();
  snap.docs.forEach(doc=>addRef(refs,doc.ref));
}
async function deleteRefs(refs){
  const rows=[...refs.values()];
  for(let start=0;start<rows.length;start+=400){
    const batch=database().batch();
    rows.slice(start,start+400).forEach(ref=>batch.delete(ref));
    await batch.commit();
  }
}
async function deleteUnboundStudentLocally(student){
  if(!canDeleteLocally(student))throw new Error('LOCAL_DELETE_NOT_ALLOWED');
  const ids=studentIdentifiers(student),refs=new Map(),db=database();
  const primary=studentDocId(student);if(primary&&!ids.includes(primary))ids.unshift(primary);

  for(const id of ids){
    addRef(refs,db.collection('students').doc(id));
    addRef(refs,db.collection('progress').doc(id));
    addRef(refs,db.collection('studentRankings').doc(id));
  }
  const jobs=[];
  for(const id of ids){
    for(const field of ['canonicalStudentId','studentId','userId','docId'])jobs.push(collectQueryRefs(refs,'students',field,id));
    for(const field of ['canonicalStudentId','studentId','userId','docId'])jobs.push(collectQueryRefs(refs,'progress',field,id));
    for(const field of ['studentId','canonicalStudentId'])jobs.push(collectQueryRefs(refs,'studentRankings',field,id));
    for(const field of ['canonicalStudentId','studentId'])jobs.push(collectQueryRefs(refs,'studentLookups',field,id));
  }
  await Promise.all(jobs);
  await deleteRefs(refs);
  return{deletedStudentIds:ids,authLinked:false,localFallback:true};
}
function removeLocalRows(result,id){
  const deleted=new Set((Array.isArray(result?.deletedStudentIds)?result.deletedStudentIds:[]).map(text).filter(Boolean));deleted.add(text(id));
  const authUid=text(result?.authUid);
  api.state.students=(api.state.students||[]).filter(student=>!studentIdentifiers(student).some(value=>deleted.has(value))&&(!authUid||text(student.authUid)!==authUid));
  if(window.__SP_STUDENTS_BY_ID){
    for(const key of Object.keys(window.__SP_STUDENTS_BY_ID)){
      const student=window.__SP_STUDENTS_BY_ID[key];
      if(studentIdentifiers(student).some(value=>deleted.has(value))||(authUid&&text(student?.authUid)===authUid))delete window.__SP_STUDENTS_BY_ID[key];
    }
  }
}
async function finishSuccessfulDelete(result,id,message){
  removeLocalRows(result,id);api.closeModal();api.navigate('students');status(message,'ok');
}
async function deleteStudent(id){
  const typed=text(document.getElementById('deleteStudentConfirmText')?.value).toUpperCase();
  if(typed!=='LÖSCHEN')return deleteModalStatus('Bitte zuerst LÖSCHEN eingeben.','error');
  const student=currentStudent(id);if(!student)return deleteModalStatus('TN wurde nicht gefunden.','error');
  const button=document.getElementById('confirmDeleteFirebaseStudentBtn');if(button){button.disabled=true;button.textContent='Wird gelöscht …'}
  deleteModalStatus('Firebase-Login und Teilnehmerdaten werden vollständig gelöscht …');
  try{
    const result=await callDelete(studentDocId(student)||id);
    await finishSuccessfulDelete(result,id,result?.authLinked===false
      ? 'TN vollständig aus dem System gelöscht. Es war kein gebundenes Firebase-Login vorhanden.'
      : 'TN vollständig gelöscht: Firebase-Login, Teilnehmerprofile, Fortschritt, Rangliste und Lookup-Daten wurden entfernt.');
  }catch(error){
    console.error('[SprachPilot] full student deletion failed',error);
    if(backendUnavailable(error)&&canDeleteLocally(student)){
      try{
        deleteModalStatus('Serverdienst nicht erreichbar. TN ohne Firebase-Login wird direkt aus den Teilnehmerdaten gelöscht …');
        const result=await deleteUnboundStudentLocally(student);
        await finishSuccessfulDelete(result,id,'TN vollständig gelöscht. Für diesen TN war kein Firebase-Login hinterlegt; Teilnehmerprofil, Fortschritt, Rangliste und Lookup-Daten wurden direkt entfernt.');
        return;
      }catch(localError){
        console.error('[SprachPilot] local owner deletion fallback failed',localError);
        deleteModalStatus('Der serverseitige Löschdienst ist nicht erreichbar und die direkte Datenlöschung ist ebenfalls fehlgeschlagen: '+text(localError?.message||localError),'error');
      }
    }else{
      const suffix=backendUnavailable(error)&&!canDeleteLocally(student)?' Bei TN mit E-Mail oder Firebase-Konto ist die serverseitige Löschung zwingend erforderlich.':'';
      deleteModalStatus(friendlyError(error)+suffix,'error');
    }
    if(button){button.disabled=false;button.textContent='Endgültig löschen'}
  }
}

api.editStudent=function(id){
  const result=previousEdit.call(api,id);
  setTimeout(()=>installDeleteButton(id),0);
  return result;
};
api.deleteStudentAccount=openDeleteConfirmation;
})();
