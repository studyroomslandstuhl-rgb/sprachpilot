import { loadCourse } from './auth.js';
import { deleteUser, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  createSecureStudentCredential,
  signInSecureStudent,
  clearRegistrationAuthFailure,
  sendStudentVerification,
  reloadFirebaseUser,
  secureStudentSignOut
} from './student-secure-auth.js?v=20260825-register7';

const PENDING_KEY='SP_PENDING_SECURE_STUDENT_REGISTRATION_V1';
const AUTH_PENDING_PREFIX='SPREG1|';
const RESERVED_COURSE_CODES=new Set(['ALLE','ALLEE','ALL_ACCESS','LEHRER','TEACHER']);
const STALE_AUTH_CODES=new Set(['auth/user-token-expired','auth/invalid-user-token','auth/user-not-found','auth/user-disabled']);

function normEmail(value){return String(value||'').trim().toLowerCase()}
function clean(value){return String(value||'').trim()}
function normCourse(value){return clean(value).toLowerCase()}
function writePending(value){localStorage.setItem(PENDING_KEY,JSON.stringify(value))}
function readPending(){try{return JSON.parse(localStorage.getItem(PENDING_KEY)||'null')}catch(e){return null}}
function clearPending(){try{localStorage.removeItem(PENDING_KEY)}catch(e){}}
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
function isVerificationThrottle(error){
  return String(error?.code||'')==='auth/too-many-requests'&&String(error?.authStage||'')==='verification';
}
function isStaleAuthError(error){
  const code=String(error?.code||'');
  const message=String(error?.message||'').toLowerCase();
  return STALE_AUTH_CODES.has(code)||message.includes('user-token-expired')||message.includes('invalid-user-token')||message.includes('user-not-found');
}
function enc(value){return encodeURIComponent(clean(value))}
function dec(value){try{return decodeURIComponent(String(value||''))}catch(e){return String(value||'')}}
function encodeAuthPending(pending={}){
  return AUTH_PENDING_PREFIX+[
    pending.vorname,pending.nachname,pending.muttersprache,
    pending.courseCode||pending.kurs,pending.courseDocId||''
  ].map(enc).join('|');
}
function decodeAuthPending(displayName=''){
  const raw=String(displayName||'');
  if(!raw.startsWith(AUTH_PENDING_PREFIX))return null;
  const parts=raw.slice(AUTH_PENDING_PREFIX.length).split('|').map(dec);
  if(parts.length<4)return null;
  const [vorname,nachname,muttersprache,kurs,courseDocId='']=parts;
  if(!vorname||!nachname||!muttersprache||!kurs)return null;
  return{vorname,nachname,muttersprache,kurs,courseCode:kurs,courseDocId};
}
function pendingMatchesUser(pending,user,courseRaw=''){
  if(!pending||!user||user.isAnonymous||!user.uid)return false;
  if(normEmail(pending.email)!==normEmail(user.email))return false;
  if(pending.uid&&String(pending.uid)!==String(user.uid))return false;
  const wanted=normCourse(courseRaw);
  if(!wanted)return true;
  return [pending.kurs,pending.courseCode,pending.courseDocId].some(value=>normCourse(value)===wanted);
}
async function persistAuthPending(user,pending){
  if(!user||user.isAnonymous||!user.uid)throw new Error('SECURE_AUTH_USER_REQUIRED');
  const token=encodeAuthPending(pending);
  await updateProfile(user,{displayName:token});
  return token;
}

export function restorePendingStudentRegistration(user,courseRaw=''){
  const local=readPending();
  if(pendingMatchesUser(local,user,courseRaw))return local;
  const meta=decodeAuthPending(user?.displayName||'');
  if(!meta)return null;
  const wanted=normCourse(courseRaw);
  if(wanted&&![meta.kurs,meta.courseCode,meta.courseDocId].some(value=>normCourse(value)===wanted))return null;
  const pending={
    ...meta,
    email:normEmail(user.email),
    uid:String(user.uid),
    createdAt:Date.now(),
    restoredFromAuthProfile:true
  };
  writePending(pending);
  return pending;
}

export function isAuthPendingRegistration(user){return !!decodeAuthPending(user?.displayName||'')}

async function validatedExistingSession(email){
  const wanted=normEmail(email),current=currentAuthUser();
  if(!current||current.isAnonymous)return current;
  if(normEmail(current.email)!==wanted)return current;
  try{
    const refreshed=await reloadFirebaseUser(current);
    if(!refreshed||refreshed.isAnonymous||normEmail(refreshed.email)!==wanted)throw Object.assign(new Error('STALE_FIREBASE_SESSION'),{code:'auth/invalid-user-token'});
    return refreshed;
  }catch(error){
    if(!isStaleAuthError(error))throw error;
    console.warn('[SprachPilot] Veraltete Firebase-Sitzung vor Registrierung verworfen.',error?.code||error?.message||error);
    try{await secureStudentSignOut()}catch(e){}
    clearRegistrationAuthFailure(wanted);
    return null;
  }
}
async function rollbackCredential(user,createdThisAttempt){
  if(!createdThisAttempt||!user)return false;
  try{await deleteUser(user);return true}catch(error){console.warn('[SprachPilot] Registrierung: neu angelegtes Firebase-Konto konnte nicht zurückgerollt werden',error);return false}
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

  let before=await validatedExistingSession(pending.email);
  let user=null,createdThisAttempt=false,existingFirebaseAccount=false;
  try{
    user=await createSecureStudentCredential(pending.email,password);
    createdThisAttempt=!before||before.isAnonymous===true;
    user=await reloadFirebaseUser(user);
    if(!user||user.isAnonymous||normEmail(user.email)!==pending.email)throw new Error('SECURE_AUTH_ACCOUNT_CONFIRMATION_FAILED');
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
    await rollbackCredential(user,createdThisAttempt);
    clearPending();
    throw error;
  }

  pending.courseDocId=courseLoaded.id;
  pending.courseCode=courseLoaded.courseCode;
  pending.uid=user.uid;
  pending.createdAt=Date.now();
  writePending(pending);

  // Die für das spätere Firestore-TN-Profil nötigen Daten werden zusätzlich im eigenen
  // Firebase-Auth-Profil zwischengespeichert. So kann ein bestätigter Account auch dann
  // fertiggestellt werden, wenn der Mail-Link in einem anderen Browser/Tab geöffnet wurde
  // und dort kein localStorage-Pending vorhanden ist.
  try{
    await persistAuthPending(user,pending);
  }catch(error){
    console.error('[SprachPilot] Registrierungsdaten konnten nicht am Firebase-Konto hinterlegt werden',error);
    const rolledBack=await rollbackCredential(user,createdThisAttempt);
    if(rolledBack)clearPending();
    const wrapped=new Error('REGISTRATION_PROFILE_METADATA_FAILED');
    wrapped.code='sp/registration-profile-metadata-failed';
    wrapped.cause=error;
    throw wrapped;
  }

  if(user.emailVerified!==true){
    try{
      const verification=await sendStudentVerification(user);
      const throttled=verification?.reason==='throttled-cooldown';
      return{
        verificationRequired:true,
        verificationSent:verification?.sent===true||verification?.reason==='cooldown',
        verificationThrottled:throttled,
        verificationRetryAfterMs:Number(verification?.retryAfterMs||0),
        verificationRolledBack:false,
        email:pending.email,
        existingFirebaseAccount,
        accountCreatedThisAttempt:createdThisAttempt,
        verificationTransport:verification?.transport||''
      };
    }catch(error){
      const throttled=isVerificationThrottle(error);
      return{
        verificationRequired:true,
        verificationSent:false,
        verificationThrottled:throttled,
        verificationRetryAfterMs:Number(error?.retryAfterMs||0),
        verificationFailed:true,
        verificationErrorCode:String(error?.code||error?.message||''),
        verificationRolledBack:false,
        email:pending.email,
        existingFirebaseAccount,
        accountCreatedThisAttempt:createdThisAttempt
      };
    }
  }

  if(typeof finishPendingStudentRegistration!=='function')throw new Error('REGISTRATION_FINISH_HANDLER_MISSING');
  const profile=await finishPendingStudentRegistration();
  return{verificationRequired:false,activated:true,email:pending.email,profile,existingFirebaseAccount,accountCreatedThisAttempt:createdThisAttempt};
}
