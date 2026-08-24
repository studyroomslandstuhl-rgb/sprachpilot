import { loadCourse } from './auth.js';
import { deleteUser } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  createSecureStudentCredential,
  signInSecureStudent,
  clearRegistrationAuthFailure,
  sendStudentVerification
} from './student-secure-auth.js?v=20260824-register1';

const PENDING_KEY='SP_PENDING_SECURE_STUDENT_REGISTRATION_V1';
const RESERVED_COURSE_CODES=new Set(['ALLE','ALLEE','ALL_ACCESS','LEHRER','TEACHER']);

function normEmail(value){return String(value||'').trim().toLowerCase()}
function clean(value){return String(value||'').trim()}
function writePending(value){localStorage.setItem(PENDING_KEY,JSON.stringify(value))}
function assertCourseAllowed(course){
  if(RESERVED_COURSE_CODES.has(clean(course).toUpperCase()))throw new Error('RESERVED_COURSE_CODE');
}
async function loadAllowedCourse(course){
  assertCourseAllowed(course);
  const loaded=await loadCourse(course);
  if(!loaded)throw new Error('COURSE_NOT_FOUND');
  const code=loaded.data?.courseCode||loaded.data?.code||loaded.data?.kurs||loaded.data?.kursnummer||loaded.id;
  if(RESERVED_COURSE_CODES.has(clean(code).toUpperCase())||RESERVED_COURSE_CODES.has(clean(loaded.id).toUpperCase()))throw new Error('RESERVED_COURSE_CODE');
  return{...loaded,courseCode:code};
}
function currentAuthUser(){
  return window.spAuth?.currentUser||window.spFirebase?.auth?.currentUser||window.SP_FIREBASE?.auth?.currentUser||null;
}
function isExistingAccountError(error){
  const code=String(error?.code||''),message=String(error?.message||'');
  return code==='auth/email-already-in-use'||code==='auth/credential-already-in-use'||message==='STUDENT_AUTH_ACCOUNT_EXISTS';
}
async function rollbackCredential(user,createdThisAttempt){
  if(!createdThisAttempt||!user)return;
  try{await deleteUser(user)}catch(error){console.warn('[SprachPilot] Registrierung: Firebase-Konto nach ungültigem Kurscode konnte nicht zurückgerollt werden',error)}
}

export async function registerStudentOnce(payload={},finishPendingStudentRegistration){
  const pending={
    vorname:clean(payload.vorname),
    nachname:clean(payload.nachname),
    email:normEmail(payload.email),
    muttersprache:clean(payload.muttersprache),
    kurs:clean(payload.kurs)
  };
  const password=String(payload.password||'');
  if(!pending.vorname||!pending.nachname||!pending.email||!pending.muttersprache||!pending.kurs||!password)throw new Error('MISSING_FIELDS');
  if(password.length<8)throw new Error('WEAK_STUDENT_PASSWORD');
  assertCourseAllowed(pending.kurs);

  // Genau ein Konto-Erstellungsversuch. Existiert die E-Mail bereits, wird genau einmal
  // mit dem eingegebenen Passwort angemeldet. So kann eine unterbrochene Registrierung
  // ihr vorhandenes Firebase-Konto endlich mit dem Kursprofil verbinden.
  const before=currentAuthUser();
  let user=null,createdThisAttempt=false,existingFirebaseAccount=false;
  try{
    user=await createSecureStudentCredential(pending.email,password);
    createdThisAttempt=!before||before.isAnonymous===true;
  }catch(error){
    if(!isExistingAccountError(error))throw error;
    clearRegistrationAuthFailure(pending.email);
    user=await signInSecureStudent(pending.email,password);
    existingFirebaseAccount=true;
    createdThisAttempt=false;
  }

  let courseLoaded;
  try{
    courseLoaded=await loadAllowedCourse(pending.kurs);
  }catch(error){
    // Nur ein Konto löschen, das tatsächlich in genau diesem Registrierungsversuch neu entstand.
    await rollbackCredential(user,createdThisAttempt);
    throw error;
  }

  pending.courseDocId=courseLoaded.id;
  pending.courseCode=courseLoaded.courseCode;
  pending.uid=user.uid;
  pending.createdAt=Date.now();
  writePending(pending);

  if(user.emailVerified!==true){
    await sendStudentVerification(user);
    return{verificationRequired:true,email:pending.email,existingFirebaseAccount};
  }

  if(typeof finishPendingStudentRegistration!=='function')throw new Error('REGISTRATION_FINISH_HANDLER_MISSING');
  const profile=await finishPendingStudentRegistration();
  return{verificationRequired:false,activated:true,email:pending.email,profile,existingFirebaseAccount};
}
