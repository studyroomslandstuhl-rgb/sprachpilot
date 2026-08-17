import '/js/progress.js?v=11';
import '/js/point-delta-bridge.js?v=2';
import '/js/ranking-mirror.js?v=1';
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

export async function startAccountProgressSync(options={}){
  invalidateOldL5Confirmations();
  const result=await startSafeAccountProgressSync(options);
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
