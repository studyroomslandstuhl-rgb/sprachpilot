import { startAccountProgressSync } from "/js/account-progress-sync.js?v=2";

startAccountProgressSync().catch(error=>{
  console.warn("Account-Fortschritt Sync konnte nicht gestartet werden",error);
});
