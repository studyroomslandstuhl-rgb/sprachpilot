import { db, doc, getDoc, setDoc, serverTimestamp } from './firebase.js';
import {
  registerStudent as legacyRegisterStudent,
  loginStudent as legacyLoginStudent,
  findStudentByEmailAndCourse,
  makeStudentId,
  getActiveProfile,
  getActiveRole,
  $, safeText, getRedirectTarget
} from './auth.js';

export { $, safeText, getRedirectTarget };

function uniq(values){
  return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))];
}
function readProfile(){
  try{return getActiveProfile() || JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null') || null}
  catch(e){return null}
}
function courseOf(p={}){return String(p.courseCode||p.kurs||p.kursnummer||p.course||'').trim()}
function emailOf(p={}){return String(p.email||'').trim().toLowerCase()}
function isRealStudent(p={}){
  const role=String(getActiveRole?.()||p.loginRole||p.role||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();
  return role==='student' && !p.teacherPreview && !p.previewOnly && !p.isTeacher;
}
function candidateIds(p={}){
  const courseDoc=String(p.courseDocId||courseOf(p)||'').trim();
  const legacy=emailOf(p)&&courseDoc ? makeStudentId(emailOf(p),courseDoc) : '';
  let stored='';
  try{stored=localStorage.getItem('SP_STUDENT_ID')||''}catch(e){}
  return uniq([
    p.canonicalStudentId,p.docId,p.studentId,p.userId,p.uid,p.id,
    ...(Array.isArray(p.aliasIds)?p.aliasIds:[]),stored,legacy
  ]);
}
async function resolveCanonical(profile){
  const p=profile||{};
  const candidates=candidateIds(p);
  for(const id of candidates){
    try{
      const snap=await getDoc(doc(db,'students',id));
      if(snap.exists())return {id:snap.id||id,data:snap.data()||{},aliases:candidates};
    }catch(e){console.warn('Student identity direct lookup failed',id,e)}
  }
  const email=emailOf(p),course=courseOf(p),courseDocId=String(p.courseDocId||'').trim();
  if(email&&course){
    try{
      const found=await findStudentByEmailAndCourse(email,course,courseDocId);
      if(found)return {id:found.id,data:found.data||{},aliases:candidates};
    }catch(e){console.warn('Student identity fallback lookup failed',e)}
  }
  return null;
}
function persistProfile(profile){
  const json=JSON.stringify(profile);
  localStorage.setItem('SP_USER_PROFILE',json);
  localStorage.setItem('SP_STUDENT_PROFILE',json);
  localStorage.setItem('SP_KEEP_LOGGED_IN','1');
  localStorage.setItem('SP_LOGIN_ROLE','student');
  localStorage.setItem('SP_ACTIVE_ROLE','student');
  localStorage.setItem('SP_USER_ROLE','student');
  localStorage.setItem('SP_STUDENT_ID',profile.canonicalStudentId||profile.docId||profile.studentId||profile.userId||'');
}
function clearActivatedStudentSession(){
  try{
    ['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_KEEP_LOGGED_IN','SP_STUDENT_ID','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE','SP_LOGIN_CONTEXT','motherLanguage','muttersprache','SP_MOTHER_LANGUAGE_CODE'].forEach(key=>localStorage.removeItem(key));
  }catch(e){}
}
async function isolateActivatedStudent(){
  try{
    const module=await import('/js/account-progress-owner-isolation.js?v=3');
    const result=await module.isolateLocalProgressOwner();
    if(result?.blocked){
      // Der neue Login wird verworfen. Lernstände und der bisherige Besitzer bleiben
      // unangetastet, bis die lokale Trennung vollständig und dauerhaft gelingt.
      clearActivatedStudentSession();
      const error=new Error('LOCAL_PROGRESS_ISOLATION_FAILED');
      error.isolation=result;
      throw error;
    }
    return result;
  }catch(error){
    if(error?.message==='LOCAL_PROGRESS_ISOLATION_FAILED')throw error;
    console.warn('Lokaler Fortschritt konnte beim Kontowechsel noch nicht getrennt werden',error);
    return null;
  }
}

export async function normalizeStudentIdentity(inputProfile=null,{silent=false}={}){
  const local=inputProfile||readProfile();
  if(!local||!isRealStudent(local))return local;

  let resolved=null;
  try{resolved=await resolveCanonical(local)}catch(e){if(!silent)console.warn('Student identity normalization failed',e)}
  if(!resolved)return local;

  const remote=resolved.data||{};
  const canonical=String(resolved.id||'').trim();
  if(!canonical)return local;

  const aliases=uniq([
    canonical,
    ...resolved.aliases,
    ...(Array.isArray(remote.aliasIds)?remote.aliasIds:[]),
    remote.canonicalStudentId,remote.docId,remote.studentId,remote.userId,remote.uid,remote.id
  ]);
  const course=remote.kurs||remote.courseCode||remote.kursnummer||local.kurs||local.courseCode||local.kursnummer||'';
  const email=emailOf(remote)||emailOf(local);
  const next={
    ...local,
    ...remote,
    canonicalStudentId:canonical,
    docId:canonical,
    studentId:canonical,
    userId:canonical,
    aliasIds:aliases,
    email,
    kurs:course,
    kursnummer:course,
    courseCode:course,
    role:'student',
    loginRole:'student',
    isStudent:true,
    isTeacher:false,
    firebase:true,
    keepLoggedIn:true
  };

  const identityPatch={
    canonicalStudentId:canonical,
    docId:canonical,
    studentId:canonical,
    userId:canonical,
    aliasIds:aliases,
    email,
    kurs:course,
    kursnummer:course,
    courseCode:course,
    role:'student',
    loginRole:'student',
    isStudent:true,
    isTeacher:false,
    active:true,
    identityVersion:1,
    identityUpdatedAt:serverTimestamp()
  };
  if(next.courseDocId)identityPatch.courseDocId=next.courseDocId;

  try{await setDoc(doc(db,'students',canonical),identityPatch,{merge:true})}
  catch(e){if(!silent)console.warn('Student identity could not be written to student document',e)}

  // Nur Identitäts-Metadaten werden ergänzt. Bestehende Aufgaben-, Punkte- und Prüfungsdaten
  // werden hier ausdrücklich nicht verändert oder überschrieben.
  try{
    await setDoc(doc(db,'progress',canonical),{
      canonicalStudentId:canonical,
      docId:canonical,
      studentId:canonical,
      userId:canonical,
      aliasIds:aliases,
      email,
      kurs:course,
      kursnummer:course,
      courseCode:course,
      identityVersion:1,
      identityUpdatedAt:serverTimestamp()
    },{merge:true});
  }catch(e){if(!silent)console.warn('Student identity could not be written to progress document',e)}

  try{persistProfile(next)}catch(e){if(!silent)console.warn('Student identity could not be stored locally',e)}
  try{window.dispatchEvent(new CustomEvent('SP_STUDENT_IDENTITY_NORMALIZED',{detail:{studentId:canonical,aliasIds:aliases,profile:next}}))}catch(e){}
  return next;
}

export async function registerStudent(payload){
  const profile=await legacyRegisterStudent(payload);
  const normalized=await normalizeStudentIdentity(profile);
  await isolateActivatedStudent();
  return normalized;
}

export async function loginStudent(email,kurs){
  const profile=await legacyLoginStudent(email,kurs);
  const normalized=await normalizeStudentIdentity(profile);
  await isolateActivatedStudent();
  return normalized;
}
