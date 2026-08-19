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

clearStaleTeacherPreview();

// Das Schüler-Dashboard ist ausschließlich für eine echte Schüler-Sitzung gedacht.
// Lehrer bleiben im Lehrer-Dashboard und können Lerninhalte über ihre eigene Route öffnen.
if(['teacher','lehrer','admin','owner','superadmin'].includes(activeRole())){
  location.replace('/teacher/index.html');
}else{
  const access=await verifySecureAccess({allowTeacher:false,redirect:true,mark:false});
  if(!access?.ok||access.type!=='student')throw new Error('SECURE_STUDENT_DASHBOARD_ACCESS_REQUIRED');

  // Erst NACH bestätigter Firebase-UID darf irgendein lokaler oder Cloud-Lernstand
  // ausgewertet, zusammengeführt oder sichtbar gemacht werden.
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

  const aliasRepair=import('./progress-alias-unifier.js?v=6')
    .then(module=>module.unifyProgressAliases())
    .catch(error=>{console.warn('Verteilte Schüler-Fortschritte konnten noch nicht zusammengeführt werden',error);return null});
  window.SP_PROGRESS_ALIAS_READY=aliasRepair;

  await aliasRepair;
  await import('./dashboard-lite.js?v=8');
  revealDashboard();

  // Recovery erst nach bestätigter UID, kanonischer Identität und Cloud-Aliasprüfung.
  import('./local-theme-points-recovery.js?v=3').catch(error=>console.warn('Lokale Themenpunkte konnten noch nicht geprüft werden',error));
  import('./local-standard-points-recovery.js?v=3').catch(error=>console.warn('Lokale Aufgabenpunkte konnten noch nicht geprüft werden',error));

  aliasRepair.then(result=>{
    if(!result?.ok)return;
    try{window.dispatchEvent(new CustomEvent('SP_POINT_DELTA_APPLIED',{detail:{type:'dashboard-alias-repair',total:result.points||0}}))}catch(e){}
  });
}
