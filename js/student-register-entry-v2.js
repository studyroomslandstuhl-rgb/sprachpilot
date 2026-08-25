import {
  finishPendingStudentRegistration as finishPendingStudentRegistrationRaw,
  hasPendingStudentRegistration,
  $, safeText
} from './student-identity.js?v=identity4';
import { authReady } from './firebase.js';
import { registerStudentOnce } from './student-registration-v3.js?v=20260825-register7';

export { hasPendingStudentRegistration, $, safeText };

const PENDING_KEY='SP_PENDING_SECURE_STUDENT_REGISTRATION_V1';

function normEmail(value){return String(value||'').trim().toLowerCase()}
function clearTeacherSession(){
  try{
    ['SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE','SP_L7_PREVIEW_PID'].forEach(key=>localStorage.removeItem(key));
    sessionStorage.removeItem('SP_TEACHER_PREVIEW');
  }catch(e){}
}

// Eine lokal gespeicherte offene Registrierung darf die Registrierungsseite nicht dauerhaft sperren.
// Zuerst warten wir, bis Firebase eine eventuell vorhandene Anmeldung wiederhergestellt hat.
// Gibt es danach wirklich keine Anmeldung mehr, ist nur der lokale Pending-Eintrag veraltet:
// wir entfernen ihn und geben die normale Registrierung wieder frei.
export async function finishPendingStudentRegistration(){
  try{await authReady}catch(e){}
  try{
    return await finishPendingStudentRegistrationRaw();
  }catch(error){
    if(String(error?.message||'')==='VERIFICATION_LOGIN_REQUIRED'){
      try{localStorage.removeItem(PENDING_KEY)}catch(e){}
      const recovered=new Error('Die alte offene Registrierung hatte keine aktive Anmeldung mehr. Bitte gib dein Passwort erneut ein und klicke auf „Registrieren“.');
      recovered.code='STALE_PENDING_REGISTRATION';
      throw recovered;
    }
    throw error;
  }
}

export async function registerStudentV2(payload={}){
  const email=normEmail(payload.email),password=String(payload.password||'');
  if(!email||!password)throw new Error('MISSING_FIELDS');
  clearTeacherSession();
  return registerStudentOnce({...payload,email,password},finishPendingStudentRegistration);
}
