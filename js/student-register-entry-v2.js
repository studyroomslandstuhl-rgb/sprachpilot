import {
  finishPendingStudentRegistration as finishPendingStudentRegistrationRaw,
  hasPendingStudentRegistration,
  $, safeText
} from './student-identity.js?v=identity4';
import { authReady } from './firebase.js';
import { registerStudentOnce } from './student-registration-v3.js?v=20260825-register9';

export { hasPendingStudentRegistration, $, safeText };

function normEmail(value){return String(value||'').trim().toLowerCase()}
function clearTeacherSession(){
  try{
    ['SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE','SP_L7_PREVIEW_PID'].forEach(key=>localStorage.removeItem(key));
    sessionStorage.removeItem('SP_TEACHER_PREVIEW');
  }catch(e){}
}

// Die Registrierungsdaten bleiben bis zur ersten erfolgreichen, verifizierten Anmeldung erhalten.
// Ein Bestätigungslink kann in einem anderen Tab/Browser geöffnet werden; fehlende aktive Auth
// darf deshalb die Daten für das spätere TN-Profil niemals löschen.
export async function finishPendingStudentRegistration(){
  try{await authReady}catch(e){}
  return finishPendingStudentRegistrationRaw();
}

export async function registerStudentV2(payload={}){
  const email=normEmail(payload.email),password=String(payload.password||'');
  if(!email||!password)throw new Error('MISSING_FIELDS');
  clearTeacherSession();
  return registerStudentOnce({...payload,email,password},finishPendingStudentRegistration);
}
