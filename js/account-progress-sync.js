import '/js/progress.js?v=11';
import '/js/point-delta-bridge.js?v=2';
import '/js/ranking-mirror.js?v=2';
import { normalizeStudentIdentity } from '/js/student-identity.js?v=identity1';
import { accountProgressReady, startAccountProgressSync as startSafeAccountProgressSync } from '/js/account-progress-sync-safe.js?v=5';
export { accountProgressReady };

function invalidateOldL5Confirmations(){
  if(sessionStorage.getItem('SP_L5_SIG_RECHECK_V4')==='1')return;
  sessionStorage.setItem('SP_L5_SIG_RECHECK_V4','1');
  try{
    const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(String(k||'').startsWith('SP_L5_POINTS_SIG_V3_'))keys.push(k)}
    keys.forEach(k=>localStorage.removeItem(k));
  }catch(e){}
}

function learningPage(){
  return /^\/(?:wortschatz|fragen-A1|fragen|verben|verben-A1|verben-bereich|irregulaere-verben|perfekt|grammatik|finnisch)(?:\/|$)/i.test(location.pathname||'');
}

function refreshAfterCloudRestore(result){
  if(!learningPage())return false;
  const studentId=String(result?.studentId||localStorage.getItem('SP_STUDENT_ID')||'student');
  const page=String(location.pathname||'')+String(location.search||'');
  const key='SP_CLOUD_PROGRESS_RENDERED_V1_'+studentId+'_'+page;
  const restored=Math.max(0,Number(result?.restored)||0);
  try{
    if(restored<=0){sessionStorage.removeItem(key);return false}
    if(sessionStorage.getItem(key)==='1')return false;
    sessionStorage.setItem(key,'1');
  }catch(e){if(restored<=0)return false}
  // Legacy-Aufgaben lesen localStorage beim ersten Render synchron. Wenn die Cloud
  // danach einen stärkeren Stand wiederherstellt, ist ein einmaliger Neuaufbau nötig,
  // damit genau dieser wiederhergestellte Zustand sichtbar wird.
  location.reload();
  return true;
}

export async function startAccountProgressSync(options={}){
  invalidateOldL5Confirmations();
  // Bevor Fortschritt gelesen oder geschrieben wird, muss eindeutig feststehen,
  // welches Firestore-Schülerdokument die unveränderliche technische Identität ist.
  // Die Normalisierung ergänzt nur Identitäts-Metadaten und löscht keine Lernstände.
  try{await normalizeStudentIdentity(null,{silent:true})}catch(e){console.warn('Schüleridentität konnte vor dem Fortschritt-Sync noch nicht normalisiert werden',e)}
  const result=await startSafeAccountProgressSync(options);
  if(refreshAfterCloudRestore(result))return result;
  if(!sessionStorage.getItem('SP_LEGACY_RESCUE_STARTED_V2')){
    sessionStorage.setItem('SP_LEGACY_RESCUE_STARTED_V2','1');
    setTimeout(()=>{
      import('/js/progress-rescue-legacy.js?v=2')
        .then(m=>m.rescueLegacyProgress())
        .catch(error=>console.warn('Alte Lektionsfortschritte konnten nicht vollständig rekonstruiert werden',error));
    },2500);
  }
  return result;
}
