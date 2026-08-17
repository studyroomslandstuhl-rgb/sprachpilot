try{
  const accountSync=await import('/js/account-progress-sync.js?v=1');
  await accountSync.startAccountProgressSync({reload:false});
}catch(error){
  console.warn('Account-Fortschritt vor Dashboard konnte nicht synchronisiert werden',error);
}
import { repairDashboardPoints } from './points-recovery.js?v=3';
try{await repairDashboardPoints()}catch(error){console.warn('Punkte-Reparatur vor Dashboard fehlgeschlagen',error)}
await import('./dashboard-sync-fixed.js?v=9');
await import('./ranking-points-fixed.js?v=1');
