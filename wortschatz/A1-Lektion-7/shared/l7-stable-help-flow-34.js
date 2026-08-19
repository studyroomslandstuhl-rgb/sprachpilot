(function(){
'use strict';
if(window.__SP_L7_STABLE_HELP_FLOW_34_V2)return;
window.__SP_L7_STABLE_HELP_FLOW_34_V2=true;
// Seit Queue V4 werden falsche Fragen in allen L7-Themen zentral ans Ende gestellt.
// Diese Datei bleibt als Cache-/Kompatibilitätsstub bestehen und überschreibt S.wrong/S.right nicht mehr.
function isMemoryTask(id){
 const S=window.L7S,t=S?.task?.(id);
 if(t?.spL7T2Memory===true||t?.spL7Memory===true||t?.memory===true)return true;
 const text=[id,t?.id,t?.title,t?.kind,t?.type].filter(Boolean).join(' ').toLowerCase();
 return text.includes('memory')||text.includes('mamory');
}
window.SP_L7_STABLE_HELP_FLOW_34={install:()=>true,isMemoryTask};
})();
