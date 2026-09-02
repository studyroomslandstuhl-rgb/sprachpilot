(function(){
'use strict';
if(window.__SP_L8T2_DIRECT_BOOT_V2)return;
window.__SP_L8T2_DIRECT_BOOT_V2=true;

const MAX_WAIT_MS=300;

function theme(){
 const all=window.L8_ALL_THEMES||{};
 const t=all[2]||all['2']||(Array.isArray(all)?all.find(x=>Number(x?.number)===2):null)||window.L8_THEME||null;
 if(t){t.number=2;window.L8_THEME=t}
 return t;
}
function installTaskUIs(){
 try{window.L8T2BiographyPairs?.install?.()}catch(e){console.error('L8T2 Biografien-UI',e)}
 try{window.L8T2BiographyWrite?.install?.()}catch(e){console.error('L8T2 Biografie-Schreib-UI',e)}
}
function finalize(){
 const t=theme();
 if(!t||!window.L8S||!window.L8UI){
  const root=document.getElementById('app');
  if(root)root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Die Aufgabe konnte nicht geladen werden.</h2><button class="l8-btn" type="button" onclick="location.reload()">Neu laden</button></section></div>';
  return;
 }
 try{window.L8CardBunnyStandardV4?.patchTheme?.(t)}catch(e){}
 try{window.L8AudioCoreSafeV3?.install?.()}catch(e){}
 installTaskUIs();
 if(document.body?.dataset?.page==='theme')window.L8UI.themeOverview();
 else window.L8UI.taskPage();
}

const ready=Promise.resolve(window.L8_CONTENT_READY).catch(error=>console.error('L8T2 Inhalte',error));
const timeout=new Promise(resolve=>setTimeout(resolve,MAX_WAIT_MS));
Promise.race([ready,timeout]).finally(()=>queueMicrotask(finalize));
})();