import { db, collection, query, where, getDocsFromServer, limit } from './firebase.js';
import {
  signInSecureStudent,
  createSecureStudentCredential,
  sendStudentVerification,
  secureStudentSignOut
} from './student-secure-auth.js?v=1';
import {
  loginStudent as legacyLoginStudent,
  registerStudent as legacyRegisterStudent,
  finishPendingStudentRegistration,
  hasPendingStudentRegistration,
  resetStudentPassword,
  $, safeText, getRedirectTarget
} from './student-identity.js?v=identity4';

export { finishPendingStudentRegistration, hasPendingStudentRegistration, resetStudentPassword, $, safeText, getRedirectTarget };

function normEmail(value){return String(value||'').trim().toLowerCase()}
function courseOf(data={}){return String(data.courseCode||data.kurs||data.kursnummer||data.courseDocId||data.course||'').trim()}
function displayName(data={}){
  return [data.vorname||data.firstName||data.name,data.nachname||data.lastName]
    .filter(Boolean).join(' ').trim()||data.displayName||data.studentName||data.email||'Schüler/in';
}
function activeOwnProfile(data={}){
  return data.securityArchived!==true&&data.securityLookupExcluded!==true&&data.active!==false&&String(data.authUid||'').trim()!=='';
}
async function ownProfiles(uid){
  const snap=await getDocsFromServer(query(collection(db,'students'),where('authUid','==',String(uid)),limit(20)));
  return snap.docs
    .map(d=>({id:d.id,data:d.data()||{}}))
    .filter(row=>activeOwnProfile(row.data))
    .map(row=>({id:row.id,course:courseOf(row.data),name:displayName(row.data),data:row.data}));
}
async function verifiedPasswordUser(email,password){
  const emailNorm=normEmail(email),pwd=String(password||'');
  if(!emailNorm||!pwd)throw new Error('MISSING_LOGIN_FIELDS');
  const user=await signInSecureStudent(emailNorm,pwd);
  if(user.emailVerified!==true){
    try{await sendStudentVerification(user)}catch(e){}
    throw new Error('EMAIL_NOT_VERIFIED');
  }
  if(user.isAnonymous||!user.uid)throw new Error('SECURE_AUTH_REQUIRED');
  return user;
}
function profileChoiceError(profiles){
  const error=new Error('MULTIPLE_STUDENT_PROFILES');
  error.profiles=(profiles||[]).map(p=>({id:p.id,course:p.course,name:p.name}));
  return error;
}
async function loginResolvedProfile(email,password,requestedId=''){
  const user=await verifiedPasswordUser(email,password);
  const profiles=await ownProfiles(user.uid);
  if(!profiles.length){
    try{await secureStudentSignOut()}catch(e){}
    throw new Error('STUDENT_NOT_FOUND');
  }
  let selected=null;
  if(requestedId){
    selected=profiles.find(p=>p.id===String(requestedId));
    if(!selected){try{await secureStudentSignOut()}catch(e){};throw new Error('STUDENT_AUTH_OWNERSHIP_MISMATCH')}
  }else if(profiles.length===1){
    selected=profiles[0];
  }else{
    throw profileChoiceError(profiles);
  }
  if(!selected.course)throw new Error('STUDENT_COURSE_MISSING');
  return legacyLoginStudent(normEmail(email),selected.course,String(password||''));
}

export async function loginStudentWithEmailPassword(email,password){
  return loginResolvedProfile(email,password,'');
}

export async function loginStudentProfileWithEmailPassword(email,password,studentId){
  return loginResolvedProfile(email,password,studentId);
}

export async function registerStudentV2(payload={}){
  const email=normEmail(payload.email),password=String(payload.password||'');
  if(!email||!password)throw new Error('MISSING_FIELDS');
  // Unter den strikten Firestore-Regeln dürfen Kurse erst nach Firebase-Anmeldung gelesen werden.
  // Deshalb wird zuerst das persönliche Password-Konto erstellt bzw. angemeldet. Die bestehende
  // Registrierungslogik prüft danach den Kurs und übernimmt/erstellt das Schülerprofil sicher.
  try{
    await createSecureStudentCredential(email,password);
  }catch(error){
    if(error?.code!=='auth/email-already-in-use')throw error;
    await signInSecureStudent(email,password);
  }
  return legacyRegisterStudent({...payload,email,password});
}
