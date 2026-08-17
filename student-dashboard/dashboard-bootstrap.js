try{
  const accountSync=await import('/js/account-progress-sync-safe.js?v=4');
  await accountSync.startAccountProgressSync({reload:false});
}catch(error){
  console.warn('Account-Fortschritt vor Dashboard konnte nicht synchronisiert werden',error);
}
import { repairDashboardPointsSafe } from './points-recovery-safe.js?v=2';
try{await repairDashboardPointsSafe()}catch(error){console.warn('Punkte-Sicherheitsprüfung vor Dashboard fehlgeschlagen',error)}
try{
  const aliases=await import('./progress-alias-unifier.js?v=2');
  await aliases.unifyProgressAliases();
}catch(error){console.warn('Fortschritts-Aliasse konnten nicht vereinheitlicht werden',error)}
await import('./dashboard-sync-fixed.js?v=12');
await import('./ranking-points-fixed.js?v=2');
