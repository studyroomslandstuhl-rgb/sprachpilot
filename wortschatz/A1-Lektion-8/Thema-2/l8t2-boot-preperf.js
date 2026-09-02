(function(){
'use strict';
if(window.__SP_L8T2_BOOT_PERF_FIX)return;
window.__SP_L8T2_BOOT_PERF_FIX=true;

function loadCore(){
 if(document.getElementById('sp-l8t2-core-boot'))return;
 const script=document.createElement('script');
 script.id='sp-l8t2-core-boot';
 script.src='l8t2-core-boot-preperf.js?v=20260902-teacher-exams1';
 script.onerror=()=>{
  const root=document.getElementById('app');
  if(root)root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Die Seite konnte nicht gestartet werden.</h2><button class="l8-btn" type="button" onclick="location.reload()">Neu laden</button></section></div>';
 };
 document.body.appendChild(script);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadCore,{once:true});
else loadCore();
})();