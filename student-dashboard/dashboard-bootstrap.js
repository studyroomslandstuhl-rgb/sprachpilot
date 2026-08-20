import '/js/session-restore.js?v=4';
import { verifySecureAccess } from '/js/secure-access-gate.js?v=1';

function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function activeRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase()}
function clearStaleTeacherPreview(){
  if(activeRole()!=='student')return;
  try{
    ['SP_TEACHER_PREVIEW','SP_TEACHER_MODE_WAS_ACTIVE','SP_PREVIEW_COURSE'].forEach(k=>sessionStorage.removeItem(k));
    ['SP_TEACHER_PREVIEW','SP_PREVIEW_COURSE','SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE'].forEach(k=>localStorage.removeItem(k));
    localStorage.removeItem('SP_LOGIN_CONTEXT');
    localStorage.removeItem('SP_NO_FIREBASE_SYNC');
  }catch(e){}
}
function revealDashboard(){
  try{document.documentElement.dataset.spDashboardAuth='ok';document.documentElement.style.removeProperty('visibility')}catch(e){}
}
function showCloudRequired(){
  try{
    document.documentElement.style.removeProperty('visibility');
    document.body.innerHTML='<main style="max-width:640px;margin:8vh auto;padding:24px;font:16px/1.5 system-ui;color:#17324d"><div style="background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.12)"><h2>Firebase-Fortschritt wird benötigt</h2><p>Dein Lernstand konnte gerade nicht frisch vom SprachPilot-Server geladen werden. Ein alter Browser-Cache wird nicht als Lernstand verwendet.</p><button id="spDashboardCloudRetry" type="button">Erneut laden</button></div></main>';
    document.getElementById('spDashboardCloudRetry').onclick=()=>location.reload();
  }catch(e){}
}

clearStaleTeacherPreview();

// Das Schüler-Dashboard ist ausschließlich für eine echte Schüler-Sitzung gedacht.
// Lehrer bleiben im Lehrer-Dashboard und können Lerninhalte über ihre eigene Route öffnen.
if(['teacher','lehrer','admin','owner','superadmin'].includes(activeRole())){
  location.replace('/teacher/index.html');
}else{
  const access=await verifySecureAccess({allowTeacher:false,redirect:true,mark:false});
  if(!access?.ok||access.type!=='student')throw new Error('SECURE_STUDENT_DASHBOARD_ACCESS_REQUIRED');

  // Erst NACH bestätigter Firebase-UID darf irgendein Lernstand ausgewertet oder sichtbar werden.
  let normalizedProfile=readProfile();
  try{
    const identity=await import('/js/student-identity.js?v=identity5');
    normalizedProfile=await identity.normalizeStudentIdentity(normalizedProfile,{silent:true})||normalizedProfile;
  }catch(error){
    console.error('Sichere Schüleridentität konnte vor dem Dashboard nicht bestätigt werden',error);
    location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));
    throw error;
  }

  if(String(normalizedProfile?.authUid||'')!==String(access.uid||'')){
    location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));
    throw new Error('STUDENT_UID_CHANGED_BEFORE_DASHBOARD_RENDER');
  }

  // Das Dashboard wartet jetzt zwingend auf den kontogebundenen Firebase-Fortschritt.
  // Beim allerersten sicheren Login darf der alte Rettungsabgleich genau einmal laufen;
  // danach wird sofort neu geladen und ab dann ausschließlich server-first gestartet.
  const progressModule=await import('/js/account-progress-sync.js?v=9');
  const progressState=await progressModule.startAccountProgressSync();
  if(progressState?.blocked){showCloudRequired();throw new Error(progressState.reason||'CLOUD_PROGRESS_SERVER_REQUIRED')}
  if(progressState?.reloadRequired){
    const reloadKey='SP_DASHBOARD_CLOUD_AUTHORITY_RELOAD_V1_'+String(normalizedProfile?.canonicalStudentId||normalizedProfile?.studentId||'student');
    if(sessionStorage.getItem(reloadKey)!=='1'){sessionStorage.setItem(reloadKey,'1');location.reload();await new Promise(()=>{})}
  }
  const serverAuthoritative=progressState?.serverAuthoritative===true;
  if(!serverAuthoritative){showCloudRequired();throw new Error('SERVER_AUTHORITATIVE_PROGRESS_REQUIRED')}

  // Ein alter Dashboard-Anzeigecache darf nach erfolgreichem Serverstart nicht mehr
  // als Fallback aus einer früheren Sitzung übrig bleiben.
  try{localStorage.removeItem('SP_STUDENT_DASHBOARD_LITE_V3')}catch(e){}

  // Historische Alias- und lokale Punkte-Recovery war für die Migration nötig. Nach dem
  // server-first Cutover darf sie den frisch geladenen Firebase-Stand nicht mehr verändern.
  const aliasRepair=Promise.resolve({ok:true,skipped:true,reason:'server-authoritative-progress'});
  window.SP_PROGRESS_ALIAS_READY=aliasRepair;

  await import('./dashboard-lite.js?v=8');
  revealDashboard();
}
