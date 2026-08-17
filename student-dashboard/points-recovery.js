export async function repairDashboardPoints(){
  const result={
    ok:true,
    skipped:true,
    writeChanges:false,
    autoLowering:false,
    reason:'Legacy-Punktekorrektur deaktiviert: gespeicherte Punkte dürfen nicht automatisch abgesenkt werden.'
  };
  window.SP_POINTS_AUDIT=result;
  return result;
}
