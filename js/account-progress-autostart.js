import '/js/session-restore.js?v=20260831-central2';
import '/shared/points-recalculator.js?v=2';
import '/shared/dativ-points-extension.js?v=4';

if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname))import('/wortschatz/lesson-colors-pastel.js?v=4').catch(()=>{});

// Ein Einstieg für den Kontofortschritt. Keine zusätzliche automatische Punkte-Reparatur
// beim Seitenstart; neue Punkte werden transaktional in progress.js vergeben und alte
// Teilnehmerstände nur gezielt repariert.
import('/js/account-progress-sync.js?v=20260831-central2')
  .then(mod=>mod.startAccountProgressSync?.())
  .catch(error=>console.warn('Account-Fortschritt Sync konnte nicht gestartet werden',error));