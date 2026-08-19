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
    }catch(e){}
  }
  return legitimatePreview
}
const legitimatePreview=clearStaleTeacherPreview();
if(activeRole()==='teacher'&&!legitimatePreview){
  location.replace('/teacher/index.html');
}else{
  await import('./dashboard-lite.js?v=5');
  import('./local-theme-points-recovery.js?v=1').catch(error=>console.warn('Lokale Themenpunkte konnten noch nicht geprüft werden',error));
}
