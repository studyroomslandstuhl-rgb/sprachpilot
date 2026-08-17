import { startAccountProgressSync } from "/js/account-progress-sync.js?v=3";

if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname)){
  import('/wortschatz/lesson-colors-pastel.js?v=2').catch(()=>{});
}

startAccountProgressSync().catch(error=>{
  console.warn("Account-Fortschritt Sync konnte nicht gestartet werden",error);
});
