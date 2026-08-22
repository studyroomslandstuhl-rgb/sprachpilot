(function(){
'use strict';
if(window.__SP_L7_STABLE_HELP_FLOW_34_V3)return;
window.__SP_L7_STABLE_HELP_FLOW_34_V3=true;
// Verbindliche L7-Regel: Eine falsche Antwort bleibt in derselben Aufgabe.
// 1. Versuch: falsch melden; 2. Versuch: konkreter Hinweis; ab 3. Versuch: Lösungshilfe.
// Erst wenn der Teilnehmer die richtige Antwort selbst eingegeben/gewählt hat, geht es weiter.
function isMemoryTask(id){
 const S=window.L7S,t=S?.task?.(id);
 if(t?.spL7T2Memory===true||t?.spL7Memory===true||t?.memory===true)return true;
 const text=[id,t?.id,t?.title,t?.kind,t?.type].filter(Boolean).join(' ').toLowerCase();
 return text.includes('memory')||text.includes('mamory');
}
window.SP_L7_STABLE_HELP_FLOW_34={install:()=>true,isMemoryTask,policy:'no-skip-three-stage-help'};
})();