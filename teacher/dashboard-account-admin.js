(function(){
'use strict';

const REGION='europe-west1';
const SDK_TIMEOUT_MS=8000;
const CALL_TIMEOUT_MS=20000;
const api=window.SPTeacherDashboard;
if(!api||api.__accountAdminInstalled)return;
api.__accountAdminInstalled=true;

const originalEdit=api.editStudent;
const originalSave=api.saveStudent;
let functionsPromise=null;

const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const studentId=student=>text(student?.canonicalStudentId||student?.docId||student?.studentId||student?.userId||student?.id);
const studentName=student=>text([student?.vorname||student?.firstName,student?.nachname||student?.lastName].filter(Boolean).join(' '))||text(student?.name||student?.displayName)||'Teilnehmer/in';
const studentCourse=student=>text(student?.courseCode||student?.kurs||student?.kursnummer||student?.courseDocId);

function status(message,kind=''){
  const el=document.getElementById('spStatus');
  if(!el)return;
  el.textContent=message;
  el.className='sp-status'+(kind?' '+kind:'');
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
    ? '<strong>Firebase-Konto verbunden.</strong><br>Die Login-E-Mail wird auch in Firebase Authentication geändert. Teilnehmer-ID, Punkte und Fortschritte bleiben erhalten. Die neue Adresse muss danach bestätigt werden.'
    : '<strong>Noch kein Firebase-Login gebunden.</strong><br>Die E-Mail wird serverseitig in Firestore und im Teilnehmer-Lookup gespeichert und später für die Kontoerstellung verwendet.';
  openModal(`<div class="sp-modal-head"><div><h2 style="margin:0">Teilnehmende bearbeiten</h2><div class="sp-meta">${esc(studentName(student))}</div></div><button class="sp-icon-btn" onclick="SPTeacherDashboard.closeModal()">Schließen</button></div>
  <div class="sp-form-grid">
    <div class="sp-field"><label>Vorname</label><input id="editFirstName" value="${esc(student.vorname||student.firstName||'')}"></div>
    <div class="sp-field"><label>Nachname</label><input id="editLastName" value="${esc(student.nachname||student.lastName||'')}"></div>
    <div class="sp-field wide"><label>${bound?'Login-E-Mail':'E-Mail'}</label><input id="editEmail" type="email" value="${esc(student.authEmail||student.email||'')}" autocomplete="email"></div>
    <div class="sp-field wide"><label>Kurs</label><select id="editCourse"><option value="">Ohne Kurs</option>${courseOptions(student)}</select></div>
  </div>
  <div class="sp-owner-note" style="margin-top:14px">${note}</div>
  <div class="sp-row-actions" style="margin-top:18px"><button class="sp-button secondary" onclick="SPTeacherDashboard.closeModal()">Abbrechen</button><button class="sp-button" id="saveFirebaseStudentBtn" onclick="SPTeacherDashboard.saveStudent('${esc(id)}')">In Firebase speichern</button></div>`);
}
async function ensureFunctions(){
  if(typeof firebase?.functions==='function')return firebase.functions(REGION);
  if(functionsPromise)return functionsPromise;
  const loader=new Promise((resolve,reject)=>{
    let script=document.querySelector('script[data-sp-functions-sdk]');
    const onLoad=()=>{
      script.dataset.spLoaded='1';
      if(typeof firebase?.functions==='function')resolve(firebase.functions(REGION));
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
function friendlyError(error){
  const code=String(error?.code||'');
  const message=String(error?.message||'');
  if(code.includes('functions-sdk-timeout')||code.includes('functions-sdk-load')||code.includes('functions-sdk-missing'))return 'Firebase Functions konnte nicht geladen werden. Bitte Internetverbindung prüfen und erneut versuchen.';
  if(code.includes('functions-call-timeout'))return 'Firebase antwortet zu langsam. Der Speichervorgang wurde nicht bestätigt. Bitte nicht sofort erneut speichern: kurz warten und danach die Teilnehmerliste über „Aktualisieren“ prüfen.';
  if(code.includes('already-exists')||message.includes('EMAIL_ALREADY_IN_USE')||message.includes('STUDENT_LOOKUP_ALREADY_IN_USE'))return 'Diese E-Mail-Adresse wird bereits von einem anderen Firebase-Konto verwendet.';
  if(code.includes('permission-denied')||message.includes('OWNER_REQUIRED'))return 'Nur das bestätigte Owner-Konto darf diese E-Mail-Änderung durchführen.';
  if(code.includes('invalid-argument'))return 'Bitte eine gültige E-Mail-Adresse eingeben.';
  if(code.includes('unavailable')||code.includes('functions/not-found')||message.includes('Function')&&message.includes('not found'))return 'Der Firebase-Kontodienst ist noch nicht erreichbar.';
  if(code.includes('not-found'))return 'Das Teilnehmerkonto wurde in Firebase nicht gefunden.';
  return message||'Das Firebase-Konto konnte nicht aktualisiert werden.';
}
async function ownerSaveStudent(id){
  const student=currentStudent(id);
  if(!student)return;
  if(!api.state.isOwner)return originalSave(id);

  const email=norm(document.getElementById('editEmail')?.value);
  const firstName=text(document.getElementById('editFirstName')?.value);
  const lastName=text(document.getElementById('editLastName')?.value);
  const courseCode=text(document.getElementById('editCourse')?.value);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return status('Bitte eine gültige E-Mail-Adresse eingeben.','error');

  const currentEmail=norm(student.authEmail||student.email);
  if(email===currentEmail)return originalSave(id);

  const button=document.getElementById('saveFirebaseStudentBtn');
  if(button){button.disabled=true;button.textContent='Wird gespeichert …'}
  status(student.authUid?'Firebase Authentication und Teilnehmerdaten werden aktualisiert …':'Teilnehmerdaten werden serverseitig in Firebase aktualisiert …');
  try{
    const functions=await ensureFunctions();
    const callable=functions.httpsCallable('updateStudentAccount');
    const response=await withTimeout(
      callable({studentId:id,email,firstName,lastName,courseCode}),
      CALL_TIMEOUT_MS,
      'sp/functions-call-timeout',
      'Firebase hat den Speichervorgang nicht rechtzeitig bestätigt.'
    );
    const result=response?.data||{};
    const index=api.state.students.findIndex(item=>studentId(item)===id);
    if(index>=0){
      api.state.students[index]={
        ...api.state.students[index],vorname:firstName,nachname:lastName,
        email,emailLower:email,
        ...(result.authUid?{authEmail:result.authEmail||email,authEmailLower:email,authEmailVerified:result.emailVerified===true}:{}),
        kurs:courseCode,kursnummer:courseCode,courseCode
      };
      if(window.__SP_STUDENTS_BY_ID)window.__SP_STUDENTS_BY_ID[id]=api.state.students[index];
    }
    api.closeModal();
    status(result.verificationSent?'Login-E-Mail geändert. Eine Bestätigungs-E-Mail wurde an die neue Adresse gesendet.':'E-Mail in Firebase gespeichert.','ok');
    api.navigate('students');
  }catch(error){
    console.error('[SprachPilot] Firebase student update failed',error);
    status(friendlyError(error),'error');
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
