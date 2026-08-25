import {
  finishPendingStudentRegistration,
  hasPendingStudentRegistration,
  $, safeText
} from './student-identity.js?v=identity4';
import { registerStudentOnce } from './student-registration-v3.js?v=20260825-register7';

export { finishPendingStudentRegistration, hasPendingStudentRegistration, $, safeText };

function normEmail(value){return String(value||'').trim().toLowerCase()}
function clearTeacherSession(){
  try{
    ['SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE','SP_L7_PREVIEW_PID'].forEach(key=>localStorage.removeItem(key));
    sessionStorage.removeItem('SP_TEACHER_PREVIEW');
  }catch(e){}
}

export async function registerStudentV2(payload={}){
  const email=normEmail(payload.email),password=String(payload.password||'');
  if(!email||!password)throw new Error('MISSING_FIELDS');
  clearTeacherSession();
  return registerStudentOnce({...payload,email,password},finishPendingStudentRegistration);
}
