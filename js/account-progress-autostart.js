import '/js/session-restore.js?v=20260831-central3';
import '/shared/points-recalculator.js?v=2';
import '/shared/dativ-points-extension.js?v=4';

if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname))import('/wortschatz/lesson-colors-pastel.js?v=4').catch(()=>{});

function parse(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
function teacherOrPreviewSession(){
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').trim().toLowerCase();
  if(['teacher','lehrer','admin','owner','superadmin'].includes(role))return true;
  const p=parse(localStorage.getItem('SP_USER_PROFILE'))||parse(localStorage.getItem('SP_STUDENT_PROFILE'))||{};
  if(p.teacherPreview===true||p.previewOnly===true||p.studentCoursePreview===true||p.isTeacher===true)return true;
  try{
    const marker=localStorage.getItem('SP_TEACHER_PREVIEW'),session=sessionStorage.getItem('SP_TEACHER_PREVIEW'),teacher=parse(localStorage.getItem('SP_TEACHER_PROFILE'))||{};
    return !!(teacher.uid||teacher.email||localStorage.getItem('SP_TEACHER_UID'))&&(marker==='1'||session==='1'||parse(marker)?.teacherPreview===true||parse(session)?.teacherPreview===true);
  }catch(e){return false}
}
function activeStudentSession(){
  if(teacherOrPreviewSession())return false;
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').trim().toLowerCase();
  if(!['student','schueler','schüler'].includes(role))return false;
  const p=parse(localStorage.getItem('SP_USER_PROFILE'))||parse(localStorage.getItem('SP_STUDENT_PROFILE'));
  return !!(p&&typeof p==='object'&&(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.email));
}

// Ein Einstieg für den Kontofortschritt. Ohne echte aktive Schüler-Sitzung wird überhaupt kein
// Schüler-Sync gestartet. Lehrer-Kursvorschauen dürfen auch bei sichtbarer Rolle "student"
// keinen Schüler-Sync importieren.
if(activeStudentSession()){
  import('/js/account-progress-sync.js?v=20260831-central4')
    .then(mod=>mod.startAccountProgressSync?.())
    .catch(error=>console.warn('Account-Fortschritt Sync konnte nicht gestartet werden',error));
}
