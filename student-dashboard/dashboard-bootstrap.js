// Das Dashboard muss sofort benutzbar sein. Keine Reparatur-/Alias-Schreibläufe
// werden mehr vor dem Rendern abgewartet.
await import('./dashboard-sync-fixed.js?v=14');

// Nicht-destruktive Kontosynchronisierung nur im Hintergrund starten.
// Das Dashboard selbst liest den Cloud-Stand direkt und ist davon nicht abhängig.
setTimeout(()=>{
  import('/js/account-progress-sync-safe.js?v=5')
    .then(m=>m.startAccountProgressSync({reload:false}))
    .then(()=>window.SP_DASHBOARD_REFRESH?.())
    .catch(error=>console.warn('Account-Fortschritt im Hintergrund konnte nicht synchronisiert werden',error));
},1200);

// Die alte, teure Alias-Vereinheitlichung und Punkte-Reparatur laufen bewusst
// NICHT mehr bei jedem Dashboard-Aufruf. Sie hatten den Seitenaufbau blockiert.
