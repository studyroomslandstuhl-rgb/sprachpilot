import { accountProgressReady, startAccountProgressSync as startSafeAccountProgressSync } from '/js/account-progress-sync-safe.js?v=5';
export { accountProgressReady };

export async function startAccountProgressSync(options={}){
  const result=await startSafeAccountProgressSync(options);
  try{
    const rescue=await import('/js/progress-rescue-legacy.js?v=1');
    await rescue.rescueLegacyProgress();
  }catch(error){
    console.warn('Alte Lektionsfortschritte konnten nicht vollständig rekonstruiert werden',error);
  }
  return result;
}
