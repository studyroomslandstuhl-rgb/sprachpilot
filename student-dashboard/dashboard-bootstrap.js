// Das Schüler-Dashboard ist bewusst nur lesend und startet keine schweren
// Reparatur-, Alias- oder Account-Synchronisationsläufe mehr.
// Synchronisiert wird auf den eigentlichen Lern-/Aufgabenseiten.
await import('./dashboard-sync-fixed.js?v=14');
