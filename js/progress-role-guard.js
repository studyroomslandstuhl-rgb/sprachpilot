(function(){
'use strict';
if(window.__SP_PROGRESS_ROLE_GUARD_V1)return;window.__SP_PROGRESS_ROLE_GUARD_V1=true;
const role=()=>String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_USER_ROLE')||'').trim().toLowerCase();
const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}};
window.spIsTeacherPreview=function(){
 try{
  const active=role();
  // Ein echter Schülerlogin hat Vorrang vor allen alten Preview-Markern.
  if(['student','schueler','schüler'].includes(active))return false;
  // Ein aktiver Lehrerzugang darf niemals Schülerfortschritt schreiben.
  if(['teacher','lehrer','admin','owner'].includes(active))return true;
  const preview=read('SP_TEACHER_PREVIEW')||read('teacherPreview');
  return !!(preview&&preview.teacherPreview===true)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1';
 }catch(e){return false}
};
})();
