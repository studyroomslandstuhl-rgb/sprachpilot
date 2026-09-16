(function(){
'use strict';
if(window.__SP_ROLE_SESSION_GUARD_V1)return;
window.__SP_ROLE_SESSION_GUARD_V1=true;

const ROLE_KEYS=new Set([
  'SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_LOGIN_CONTEXT','SP_USER_ROLE',
  'SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_STUDENT_ID','SP_STUDENT_AUTH_UID',
  'SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE'
]);
const STUDENT_LOCAL=[
  'SP_STUDENT_PROFILE','SP_PROFILE_BACKUP','SP_STUDENT_PROFILE_BACKUP',
  'SP_KEEP_LOGGED_IN','SP_STUDENT_ID','SP_STUDENT_AUTH_UID'
];
const STUDENT_SESSION=[
  'SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_STUDENT_ID','SP_STUDENT_AUTH_UID',
  'SP_PROFILE_SESSION_BACKUP','SP_STUDENT_PROFILE_SESSION_BACKUP'
];
const TEACHER_LOCAL=[
  'SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID',
  'SP_TEACHER_PROFILE','SP_L7_PREVIEW_PID'
];
const TEACHER_SESSION=['SP_TEACHER_PREVIEW','SP_TEACHER_MODE_WAS_ACTIVE','SP_PREVIEW_COURSE'];

function value(key){try{return String(localStorage.getItem(key)||'').trim().toLowerCase()}catch(e){return''}}
function parse(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
function teacherPreviewActive(){
  try{
    const teacher=parse(localStorage.getItem('SP_TEACHER_PROFILE'))||{};
    const preview=parse(sessionStorage.getItem('SP_TEACHER_PREVIEW'))||{};
    const localPreview=localStorage.getItem('SP_TEACHER_PREVIEW');
    return !!(teacher.uid||teacher.email||localStorage.getItem('SP_TEACHER_UID'))&&
      (localPreview==='1'||preview.teacherPreview===true);
  }catch(e){return false}
}
function role(){
  if(teacherPreviewActive())return'teacher';
  const explicit=value('SP_LOGIN_ROLE')||value('SP_ACTIVE_ROLE')||value('SP_LOGIN_CONTEXT');
  if(['teacher','lehrer','admin','owner','superadmin'].includes(explicit))return'teacher';
  if(['student','schueler','schüler'].includes(explicit))return'student';
  try{
    if(localStorage.getItem('SP_TEACHER_PROFILE')||localStorage.getItem('SP_TEACHER_UID')||localStorage.getItem('SP_TEACHER_MODE')==='1')return'teacher';
    if(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE'))return'student';
  }catch(e){}
  return'guest';
}
function remove(store,keys){try{keys.forEach(key=>store.removeItem(key))}catch(e){}}
function normalize(active){
  if(active==='teacher'){
    remove(localStorage,STUDENT_LOCAL);
    remove(sessionStorage,STUDENT_SESSION);
    try{
      const p=parse(localStorage.getItem('SP_USER_PROFILE'));
      if(!p||!(p.teacherPreview===true||p.previewOnly===true||p.isTeacher===true))localStorage.removeItem('SP_USER_PROFILE');
    }catch(e){}
    localStorage.setItem('SP_LOGIN_ROLE','teacher');
    localStorage.setItem('SP_ACTIVE_ROLE','teacher');
  }else if(active==='student'){
    remove(localStorage,TEACHER_LOCAL);
    remove(sessionStorage,TEACHER_SESSION);
  }
}
function teacherPage(){
  return /^\/teacher(?:\/|$)/i.test(location.pathname||'')&&!/^\/teacher\/login(?:\.html)?\/?$/i.test(location.pathname||'');
}
function studentPage(){return /^\/(?:student-dashboard|profile)(?:\/|$)/i.test(location.pathname||'')}
function loginPage(){return /^\/(?:login|register)(?:\/|$)/i.test(location.pathname||'')||/^\/teacher\/login(?:\.html)?\/?$/i.test(location.pathname||'')}
function enforce(){
  const active=role();
  normalize(active);
  if(teacherPage()&&active!=='teacher'){
    location.replace('/teacher/login.html?reason=role-changed');
    return false;
  }
  if(studentPage()&&active!=='student'){
    location.replace(active==='teacher'?'/teacher/index.html':'/login/?redirect='+encodeURIComponent(location.pathname+location.search));
    return false;
  }
  return true;
}

const initialRole=role();
normalize(initialRole);
let changing=false;
function roleChanged(){
  if(changing)return;
  const current=role();
  if(current===initialRole)return;
  changing=true;
  if(!enforce())return;
  if(!loginPage())location.reload();
}
window.addEventListener('storage',event=>{
  if(!event.key||ROLE_KEYS.has(event.key))setTimeout(roleChanged,80);
});
try{
  const channel=new BroadcastChannel('sprachpilot-session');
  channel.addEventListener('message',event=>{if(event.data?.type==='role-changed'||event.data?.type==='logout')setTimeout(roleChanged,0)});
  window.SP_ROLE_SESSION_CHANNEL=channel;
}catch(e){}
window.SPNotifyRoleChanged=function(nextRole){
  try{window.SP_ROLE_SESSION_CHANNEL?.postMessage({type:nextRole?'role-changed':'logout',role:nextRole||'guest',at:Date.now()})}catch(e){}
};
enforce();
})();