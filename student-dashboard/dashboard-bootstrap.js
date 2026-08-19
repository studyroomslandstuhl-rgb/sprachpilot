// Schüler-Dashboard strikt von Lehrer- und Vorschau-Sitzungen trennen.
function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function activeRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase()}
function previewContext(){return String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase()==='teacher-student-preview'}
function clearStaleTeacherPreview(){
  const p=readProfile(),role=activeRole();
  const legitimatePreview=previewContext()&&(p.previewOnly===true||p.studentCoursePreview===true||p.teacherPreview===true);
  if(role==='student'&&!legitimatePreview){
    try{
      ['SP_TEACHER_PREVIEW','SP_TEACHER_MODE_WAS_ACTIVE','SP_PREVIEW_COURSE'].forEach(k=>sessionStorage.removeItem(k));
      ['SP_TEACHER_PREVIEW','SP_PREVIEW_COURSE','SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE'].forEach(k=>localStorage.removeItem(k));
      localStorage.removeItem('SP_LOGIN_CONTEXT');
      // Alte Diagnose-Sitzungen dürfen die Firebase-Synchronisierung nicht dauerhaft deaktivieren.
      localStorage.removeItem('SP_NO_FIREBASE_SYNC');
    }catch(e){}
  }
  return legitimatePreview
}
const legitimatePreview=clearStaleTeacherPreview();
if(activeRole()==='teacher'&&!legitimatePreview){
  location.replace('/teacher/index.html');
}else{
  await import('./dashboard-lite.js?v=6');
  const aliasRepair=import('./progress-alias-unifier.js?v=3')
    .then(module=>module.unifyProgressAliases())
    .catch(error=>{console.warn('Verteilte Schüler-Fortschritte konnten noch nicht zusammengeführt werden',error);return null});
  import('./local-theme-points-recovery.js?v=2').catch(error=>console.warn('Lokale Themenpunkte konnten noch nicht geprüft werden',error));
  aliasRepair.then(result=>{
    if(!result?.ok)return;
    try{window.dispatchEvent(new CustomEvent('SP_POINT_DELTA_APPLIED',{detail:{type:'dashboard-alias-repair',total:result.points||0}}))}catch(e){}
  });
}
