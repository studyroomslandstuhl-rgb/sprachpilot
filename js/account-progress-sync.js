import '/js/progress.js?v=11';
import '/js/point-delta-bridge.js?v=1';
import { accountProgressReady, startAccountProgressSync as startSafeAccountProgressSync } from '/js/account-progress-sync-safe.js?v=5';
export { accountProgressReady };

export async function startAccountProgressSync(options={}){
  const result=await startSafeAccountProgressSync(options);
  // Die aufwendige Legacy-Rettung läuft höchstens einmal pro Browser-Sitzung
  // und blockiert weder Aufgabe noch Dashboard.
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
