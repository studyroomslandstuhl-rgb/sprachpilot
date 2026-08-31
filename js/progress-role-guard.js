(function(){
'use strict';
if(window.__SP_PROGRESS_ROLE_GUARD_V2)return;window.__SP_PROGRESS_ROLE_GUARD_V2=true;
const role=()=>String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_USER_ROLE')||'').trim().toLowerCase();
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}};
const teacherProfile=()=>read('SP_TEACHER_PROFILE')||{};
const hasPreviewMarker=()=>{
 try{
  const local=localStorage.getItem('SP_TEACHER_PREVIEW'),session=sessionStorage.getItem('SP_TEACHER_PREVIEW');
  if(local==='1'||session==='1')return true;
  const lp=read('SP_TEACHER_PREVIEW');let sp=null;try{sp=JSON.parse(session||'null')}catch(e){}
  return !!(lp?.teacherPreview||sp?.teacherPreview);
 }catch(e){return false}
};
window.spIsTeacherPreview=function(){
 try{
  const active=role(),p=read('SP_USER_PROFILE')||read('SP_STUDENT_PROFILE')||{},teacher=teacherProfile();
  // Die Kursvorschau setzt absichtlich die sichtbare Rolle auf "student". Preview-Marker
  // und das weiterhin vorhandene echte Lehrerprofil müssen deshalb VOR der Schülerrolle gelten.
  if((p.previewOnly===true||p.studentCoursePreview===true||p.teacherPreview===true||hasPreviewMarker())&&!!(teacher.uid||teacher.email||localStorage.getItem('SP_TEACHER_UID')))return true;
  if(['teacher','lehrer','admin','owner','superadmin'].includes(active))return true;
  if(['student','schueler','schüler'].includes(active))return false;
  return false;
 }catch(e){return false}
};
})();
