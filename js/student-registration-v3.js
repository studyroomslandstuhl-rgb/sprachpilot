import { loadCourse } from './auth.js';
import {
  createSecureStudentCredential,
  sendStudentVerification
} from './student-secure-auth.js?v=20260824-register1';

const PENDING_KEY='SP_PENDING_SECURE_STUDENT_REGISTRATION_V1';
const COURSE_AUTH_BLOCK_KEY='SP_REGISTER_COURSE_AUTH_BLOCK_V1';
const COURSE_AUTH_BLOCK_MS=120000;
const RESERVED_COURSE_CODES=new Set(['ALLE','ALLEE','ALL_ACCESS','LEHRER','TEACHER']);

function normEmail(value){return String(value||'').trim().toLowerCase()}
function clean(value){return String(value||'').trim()}
function writePending(value){localStorage.setItem(PENDING_KEY,JSON.stringify(value))}
function assertCourseAllowed(course){
  if(RESERVED_COURSE_CODES.has(clean(course).toUpperCase()))throw new Error('RESERVED_COURSE_CODE');
}
function readCourseAuthBlock(){
  try{
    const value=JSON.parse(sessionStorage.getItem(COURSE_AUTH_BLOCK_KEY)||'null');
    if(!value||!value.at)return null;
    if(Date.now()-Number(value.at)>COURSE_AUTH_BLOCK_MS){sessionStorage.removeItem(COURSE_AUTH_BLOCK_KEY);return null}
    return value;
  }catch(e){return null}
}
function rememberCourseAuthThrottle(error){
  try{sessionStorage.setItem(COURSE_AUTH_BLOCK_KEY,JSON.stringify({code:String(error?.code||'auth/too-many-requests'),at:Date.now()}))}catch(e){}
}
function clearCourseAuthBlock(){try{sessionStorage.removeItem(COURSE_AUTH_BLOCK_KEY)}catch(e){}}
function blockedCourseAuthError(block){
  const error=new Error('REGISTRATION_AUTH_THROTTLED');
  error.code=String(block?.code||'auth/too-many-requests');
  error.spPreflightBlocked=true;
  return error;
}
async function ensureCourseLookupAuth(){
  const block=readCourseAuthBlock();
  if(block)throw blockedCourseAuthError(block);
  const ensure=window.spEnsureFirebaseAuth;
  if(typeof ensure!=='function'){
    const error=new Error('FIREBASE_AUTH_NOT_READY');
    error.code='sp/auth-not-ready';
    throw error;
  }
  try{
    const user=await ensure();
    if(!user){
      const error=new Error('FIREBASE_AUTH_NOT_READY');
      error.code='sp/auth-not-ready';
      throw error;
    }
    clearCourseAuthBlock();
    return user;
  }catch(error){
    if(String(error?.code||'')==='auth/too-many-requests')rememberCourseAuthThrottle(error);
    throw error;
  }
}
async function loadAllowedCourse(course){
  assertCourseAllowed(course);

  // Kursdaten dürfen laut Firestore-Regeln nur angemeldete Nutzer lesen. Deshalb
  // stellen wir die anonyme Sitzung genau EINMAL vor der robusten Kurs-Suche her.
  // Scheitert Firebase Auth, brechen wir sofort ab. loadCourse() darf dann nicht
  // dutzende Varianten abfragen und dabei immer neue Auth-Versuche auslösen.
  await ensureCourseLookupAuth();

  const loaded=await loadCourse(course);
  if(!loaded)throw new Error('COURSE_NOT_FOUND');
  const code=loaded.data?.courseCode||loaded.data?.code||loaded.data?.kurs||loaded.data?.kursnummer||loaded.id;
  if(RESERVED_COURSE_CODES.has(clean(code).toUpperCase())||RESERVED_COURSE_CODES.has(clean(loaded.id).toUpperCase()))throw new Error('RESERVED_COURSE_CODE');
  return{...loaded,courseCode:code};
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

  const courseLoaded=await loadAllowedCourse(pending.kurs);
  pending.courseDocId=courseLoaded.id;
  pending.courseCode=courseLoaded.courseCode;

  // Wichtig: genau ein Firebase-Credential-Versuch pro Registrierung.
  // Kein automatischer Passwort-Login als Fallback bei bereits existierender E-Mail.
  const user=await createSecureStudentCredential(pending.email,password);
  pending.uid=user.uid;
  pending.createdAt=Date.now();
  writePending(pending);

  if(user.emailVerified!==true){
    await sendStudentVerification(user);
    return{verificationRequired:true,email:pending.email,existingFirebaseAccount:false};
  }

  if(typeof finishPendingStudentRegistration!=='function')throw new Error('REGISTRATION_FINISH_HANDLER_MISSING');
  const profile=await finishPendingStudentRegistration();
  return{verificationRequired:false,activated:true,email:pending.email,profile,existingFirebaseAccount:false};
}
