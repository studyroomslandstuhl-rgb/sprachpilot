import { startAccountProgressSync } from "/js/account-progress-sync.js?v=4";

if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname)){
  import('/wortschatz/lesson-colors-pastel.js?v=3').catch(()=>{});
}

startAccountProgressSync().catch(error=>{
  console.warn("Account-Fortschritt Sync konnte nicht gestartet werden",error);
});
