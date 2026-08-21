(function(){
'use strict';

const api=window.SPTeacherDashboard;
if(!api||api.__passwordResetInstalled)return;
api.__passwordResetInstalled=true;

const previousEdit=api.editStudent;
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const studentId=student=>text(student?.canonicalStudentId||student?.docId||student?.studentId||student?.userId||student?.id);

function currentStudent(id){
  return api.state.students.find(student=>studentId(student)===String(id||''));
}
function setMessage(message,kind=''){
  const modal=document.getElementById('spFirebaseSaveStatus');
  if(modal){
    modal.textContent=message;
    modal.className='sp-status'+(kind?' '+kind:'');
    modal.hidden=!message;
  }
  const global=document.getElementById('spStatus');
  if(global){
    global.textContent=message;
    global.className='sp-status'+(kind?' '+kind:'');
  }
}
function errorMessage(error){
  const code=String(error?.code||'');
  if(code.includes('invalid-email'))return 'Die gespeicherte Login-E-Mail ist ungültig.';
  if(code.includes('user-not-found'))return 'Für diese E-Mail wurde kein Firebase-Login gefunden.';
  if(code.includes('too-many-requests'))return 'Firebase hat zu viele Anfragen erkannt. Bitte einige Minuten warten.';
  if(code.includes('network-request-failed'))return 'Keine Verbindung zu Firebase. Bitte Internetverbindung prüfen.';
  return String(error?.message||'Die Passwort-Mail konnte nicht gesendet werden.');
}
async function sendPasswordReset(id){
  if(!api.state.isOwner)return setMessage('Nur das Owner-Konto darf Passwort-Mails auslösen.','error');
  const student=currentStudent(id);
  if(!student)return setMessage('Teilnehmerkonto wurde nicht gefunden.','error');
  if(!student.authUid)return setMessage('Für diesen TN ist noch kein Firebase-Konto verbunden.','error');
  const email=norm(student.authEmail||student.email);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setMessage('Für diesen TN ist keine gültige Login-E-Mail gespeichert.','error');

  const button=document.getElementById('sendStudentPasswordResetBtn');
  if(button){button.disabled=true;button.textContent='Wird gesendet …';}
  setMessage(`Passwort-Mail wird an ${email} gesendet …`);
  try{
    const firebase=window.firebase;
    if(!firebase||typeof firebase.auth!=='function')throw new Error('Firebase Authentication ist nicht verfügbar.');
    await firebase.auth().sendPasswordResetEmail(email);
    setMessage(`Passwort-Wiederherstellungs-Mail wurde an ${email} gesendet.`,'ok');
    if(button)button.textContent='Erneut senden';
  }catch(error){
    console.error('[SprachPilot] password reset mail failed',error);
    setMessage(errorMessage(error),'error');
    if(button)button.textContent='Passwort-Mail senden';
  }finally{
    if(button)button.disabled=false;
  }
}
function enhanceEditStudent(id){
  previousEdit(id);
  if(!api.state.isOwner)return;
  const student=currentStudent(id);
  if(!student?.authUid)return;
  const saveButton=document.getElementById('saveFirebaseStudentBtn');
  if(!saveButton||document.getElementById('sendStudentPasswordResetBtn'))return;
  const reset=document.createElement('button');
  reset.type='button';
  reset.id='sendStudentPasswordResetBtn';
  reset.className='sp-button secondary';
  reset.textContent='Passwort-Mail senden';
  reset.title=`Passwort-Wiederherstellung an ${norm(student.authEmail||student.email)} senden`;
  reset.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    void sendPasswordReset(id);
  });
  saveButton.parentElement?.insertBefore(reset,saveButton);
}

api.editStudent=enhanceEditStudent;
api.sendStudentPasswordReset=sendPasswordReset;
})();
