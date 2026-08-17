export async function repairDashboardPointsSafe(){
  const result={
    ok:true,
    skipped:true,
    writeChanges:false,
    reason:'Historische Punkte werden nicht mehr automatisch abgesenkt.'
  };
  window.SP_POINTS_AUDIT=result;
  return result;
}
