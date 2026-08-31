import '/js/session-restore.js?v=20260831-central2';
import '/shared/points-recalculator.js?v=2';
import '/shared/dativ-points-extension.js?v=4';

if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname))import('/wortschatz/lesson-colors-pastel.js?v=4').catch(()=>{});

function activeStudentSession(){
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').trim().toLowerCase();
  if(!['student','schueler','schüler'].includes(role))return false;
  try{
    const p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null');
    return !!(p&&typeof p==='object'&&(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.email));
  }catch{return false}
}

// Ein Einstieg für den Kontofortschritt. Ohne aktive Schüler-Sitzung wird überhaupt kein
// Schüler-Sync gestartet. So bleiben öffentliche Seiten und Lehreransichten unbeeinflusst.
if(activeStudentSession()){
  import('/js/account-progress-sync.js?v=20260831-central3')
    .then(mod=>mod.startAccountProgressSync?.())
    .catch(error=>console.warn('Account-Fortschritt Sync konnte nicht gestartet werden',error));
}