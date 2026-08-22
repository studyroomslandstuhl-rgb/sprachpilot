import { db, doc, collection, query, where, getDocsFromServer, limit, updateDoc, serverTimestamp } from './firebase.js';
import { loadCourse } from './auth.js';
import {
  signInSecureStudent,
  sendStudentVerification,
  secureStudentSignOut
} from './student-secure-auth.js?v=1';
import {
  registerStudent as legacyRegisterStudent,
  finishPendingStudentRegistration,
  hasPendingStudentRegistration,
  resetStudentPassword,
  $, safeText, getRedirectTarget
} from './student-identity.js?v=identity4';

export { finishPendingStudentRegistration, hasPendingStudentRegistration, resetStudentPassword, $, safeText, getRedirectTarget };

function normEmail(value){return String(value||'').trim().toLowerCase()}
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
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
function clearStudentSession(){
  try{
    ['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_KEEP_LOGGED_IN','SP_STUDENT_ID','SP_STUDENT_AUTH_UID','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE','SP_LOGIN_CONTEXT','motherLanguage','muttersprache','SP_MOTHER_LANGUAGE_CODE'].forEach(key=>localStorage.removeItem(key));
  }catch(e){}
}
function persistBoundProfile(selected,user,assignments={}){
  const remote=selected.data||{},canonical=String(selected.id||'').trim(),course=selected.course||courseOf(remote);
  const aliases=uniq([canonical,...(Array.isArray(remote.aliasIds)?remote.aliasIds:[]),remote.canonicalStudentId,remote.docId,remote.studentId,remote.userId]);
  const profile={
    ...remote,
    assignments:assignments||remote.assignments||{},
    canonicalStudentId:canonical,docId:canonical,studentId:canonical,userId:canonical,aliasIds:aliases,
    authUid:String(user.uid),authEmail:normEmail(user.email),authVersion:Math.max(2,Number(remote.authVersion||0)),secureAuth:true,
    email:normEmail(remote.email||user.email),kurs:course,kursnummer:course,courseCode:course,
    role:'student',loginRole:'student',isStudent:true,isTeacher:false,firebase:true,keepLoggedIn:true
  };
  const json=JSON.stringify(profile);
  localStorage.setItem('SP_USER_PROFILE',json);
  localStorage.setItem('SP_STUDENT_PROFILE',json);
  localStorage.setItem('SP_KEEP_LOGGED_IN','1');
  localStorage.setItem('SP_LOGIN_ROLE','student');
  localStorage.setItem('SP_ACTIVE_ROLE','student');
  localStorage.setItem('SP_USER_ROLE','student');
  localStorage.setItem('SP_STUDENT_ID',canonical);
  localStorage.setItem('SP_STUDENT_AUTH_UID',String(user.uid));
  const mother=String(profile.muttersprache||profile.motherLanguage||'').trim();
  if(mother){localStorage.setItem('motherLanguage',mother);localStorage.setItem('muttersprache',mother)}
  return profile;
}
async function activateBoundProfile(selected,user){
  let assignments=selected.data?.assignments||{};
  try{
    const loaded=await loadCourse(selected.data?.courseDocId||selected.course);
    assignments=loaded?.data?.assignments||assignments;
  }catch(error){console.warn('Kursfreigaben konnten beim Login nicht zusätzlich geladen werden',error)}
  const profile=persistBoundProfile(selected,user,assignments);
  try{
    const isolation=await import('/js/account-progress-owner-isolation.js?v=3').then(m=>m.isolateLocalProgressOwner());
    if(isolation?.blocked)throw new Error('LOCAL_PROGRESS_ISOLATION_FAILED');
  }catch(error){
    clearStudentSession();
    try{await secureStudentSignOut()}catch(e){}
    throw error;
  }
  try{await updateDoc(doc(db,'students',selected.id),{lastLogin:serverTimestamp()})}catch(e){console.warn('lastLogin update skipped',e)}
  return profile;
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
  return activateBoundProfile(selected,user);
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
  // student-identity.js besitzt den kompletten Registrierungsablauf inklusive genau
  // eines Firebase-Auth-Versuchs (create ODER sign-in bei bestehendem Konto).
  // Hier darf nicht vorab nochmals create/sign-in ausgeführt werden: Das verdoppelt
  // Auth-Anfragen pro Klick und kann Firebase unnötig in too-many-requests treiben.
  return legacyRegisterStudent({...payload,email,password});
}
