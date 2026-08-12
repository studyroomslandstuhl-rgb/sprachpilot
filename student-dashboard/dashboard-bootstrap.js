import { repairDashboardPoints } from './points-recovery.js?v=3';
try{await repairDashboardPoints()}catch(error){console.warn('Punkte-Reparatur vor Dashboard fehlgeschlagen',error)}
await import('./dashboard-sync-fixed.js?v=9');
