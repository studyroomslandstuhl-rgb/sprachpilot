(function(){
'use strict';
if(window.__SP_TEACHER_POINT_AUDIT_V3)return;
window.__SP_TEACHER_POINT_AUDIT_V3=true;
/*
  Automatische Punktkorrekturen im Lehrer-Dashboard sind absichtlich deaktiviert.
  Historische Verben-/Perfekt-Punkte können aus älteren Gruppen- und Run-Daten stammen,
  die nicht vollständig in der neuen allgemeinen Aufgabenstruktur abgebildet sind.
  Deshalb darf das Lehrer-Dashboard niemals einen gespeicherten Punktestand automatisch
  nach unten überschreiben. Eine spätere Prüfung darf nur lesend arbeiten oder einen
  eindeutig belegten höheren Wert ergänzen.
*/
window.SP_TEACHER_POINT_AUDIT={
  disabled:true,
  writeChanges:false,
  reason:'Kein automatisches Absenken historischer Punkte',
  at:new Date().toISOString()
};
})();
