import { auth, authReady } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';

const STUDENT_SESSION_KEYS=[
  'SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_KEEP_LOGGED_IN','SP_STUDENT_ID','SP_STUDENT_AUTH_UID',
  'SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE','SP_LOGIN_CONTEXT'
];

function profile(){
  try{return getActiveProfile?.()||JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}
  catch(e){return{}}
}
function role(){return String(getActiveRole?.()||localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').trim().toLowerCase()}
function teacherRole(value=role()){return ['teacher','lehrer','admin','owner','superadmin'].includes(value)}
function studentRole(value=role()){return ['student','schueler','schüler'].includes(value)}
function secureStudentProfile(p={}){
  return p.secureAuth===true&&Number(p.authVersion||0)>=2&&!!String(p.authUid||'').trim()&&!p.teacherPreview&&!p.previewOnly&&!p.isTeacher;
}
function clearActiveStudentSession(){
  try{STUDENT_SESSION_KEYS.forEach(key=>localStorage.removeItem(key));localStorage.setItem('SP_SECURE_STUDENT_RELOGIN_REQUIRED','1')}catch(e){}
}
function loginTarget(){
  const redirect=String(location.pathname||'/')+String(location.search||'')+String(location.hash||'');
  return '/login/?redirect='+encodeURIComponent(redirect);
}
function markVisible(){
  try{document.documentElement.dataset.spLearningAuth='ok';document.documentElement.dataset.spSecureAuth='ok';document.documentElement.style.removeProperty('visibility')}catch(e){}
}
function fail(reason,{redirect=true}={}){
  const detail={ok:false,reason};
  try{window.SP_SECURE_ACCESS=detail;window.dispatchEvent(new CustomEvent('SP_SECURE_ACCESS_BLOCKED',{detail}))}catch(e){}
  if(redirect){try{location.replace(loginTarget())}catch(e){location.href=loginTarget()}}
  return detail;
}

export async function verifySecureAccess({allowTeacher=true,redirect=true,mark=true}={}){
  let firebaseUser=null;
  try{firebaseUser=await authReady}catch(e){firebaseUser=auth.currentUser||null}
  firebaseUser=auth.currentUser||firebaseUser||null;
  const activeRole=role(),p=profile();

  if(allowTeacher&&teacherRole(activeRole)){
    // Der eigentliche Lehrer-Datenzugriff bleibt zusätzlich durch Firestore Rules geschützt.
    // Für die Sichtbarkeit von Lerninhalten genügt eine echte, nicht-anonyme Firebase-Sitzung.
    if(!firebaseUser||firebaseUser.isAnonymous||!firebaseUser.uid)return fail('TEACHER_FIREBASE_AUTH_REQUIRED',{redirect});
    const result={ok:true,type:'teacher',uid:String(firebaseUser.uid),profile:p,user:firebaseUser};
    try{window.SP_SECURE_ACCESS=result}catch(e){}
    if(mark)markVisible();
    return result;
  }

  if(!studentRole(activeRole)||!secureStudentProfile(p)){
    if(studentRole(activeRole))clearActiveStudentSession();
    return fail('SECURE_STUDENT_PROFILE_REQUIRED',{redirect});
  }

  const expected=String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();
  if(!firebaseUser||firebaseUser.isAnonymous||firebaseUser.emailVerified!==true||!firebaseUser.uid){
    clearActiveStudentSession();
    return fail('VERIFIED_FIREBASE_STUDENT_REQUIRED',{redirect});
  }
  if(String(firebaseUser.uid)!==expected){
    clearActiveStudentSession();
    return fail('STUDENT_UID_MISMATCH',{redirect});
  }
  const authEmail=String(firebaseUser.email||'').trim().toLowerCase(),profileEmail=String(p.authEmail||p.email||'').trim().toLowerCase();
  if(profileEmail&&authEmail&&profileEmail!==authEmail){
    clearActiveStudentSession();
    return fail('STUDENT_EMAIL_MISMATCH',{redirect});
  }

  try{localStorage.setItem('SP_STUDENT_AUTH_UID',expected);localStorage.removeItem('SP_SECURE_STUDENT_RELOGIN_REQUIRED')}catch(e){}
  const result={ok:true,type:'student',uid:expected,profile:p,user:firebaseUser};
  try{window.SP_SECURE_ACCESS=result;window.dispatchEvent(new CustomEvent('SP_SECURE_ACCESS_CONFIRMED',{detail:{type:'student',uid:expected}}))}catch(e){}
  if(mark)markVisible();
  return result;
}

export function hideUntilSecure(){
  try{document.documentElement.style.visibility='hidden';document.documentElement.dataset.spSecureAuth='pending'}catch(e){}
}
