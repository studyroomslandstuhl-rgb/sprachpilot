import '/js/session-restore.js?v=3';

if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname)){
  import('/wortschatz/lesson-colors-pastel.js?v=4').catch(()=>{});
}

import('/js/account-progress-sync.js?v=6')
  .then(mod=>mod.startAccountProgressSync?.())
  .catch(error=>{
    console.warn("Account-Fortschritt Sync konnte nicht gestartet werden",error);
  });
