import '/js/session-restore.js?v=4';
import '/shared/dativ-points-extension.js?v=2';

if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname)){
  import('/wortschatz/lesson-colors-pastel.js?v=4').catch(()=>{});
}

import('/js/account-progress-sync.js?v=13')
  .then(async mod=>{
    await mod.startAccountProgressSync?.();
    import('/js/authoritative-point-repair.js?v=1').catch(error=>{
      console.warn('Autoritativer Punktestand konnte nicht vorbereitet werden',error);
    });
  })
  .catch(error=>{
    console.warn("Account-Fortschritt Sync konnte nicht gestartet werden",error);
  });
