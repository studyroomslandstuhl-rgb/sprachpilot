(function(){
'use strict';
if(window.__SP_L7T4_CUSTOM_UI_LOADER_V3)return;window.__SP_L7T4_CUSTOM_UI_LOADER_V3=true;
let tries=0;
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)})}
function start(){
 if(window.L7&&window.L7S){
  load('/wortschatz/A1-Lektion-7/Thema-4/l7t4-custom-ui.js?v=3')
   .then(()=>load('/wortschatz/A1-Lektion-7/Thema-4/l7t4-ui-polish.js?v=1'))
   .then(()=>{window.L7T4UIPolish?.install?.();return load('/wortschatz/A1-Lektion-7/Thema-4/l7t4-listening-ui.js?v=2')})
   .then(()=>{
    const id=new URLSearchParams(location.search).get('task');
    if(document.body.dataset.page==='task'&&id)window.L7?.renderTaskPage?.(4,id)
   })
   .catch(e=>console.warn('L7T4 Zusatzoberfläche konnte nicht geladen werden',e));
  return;
 }
 if(++tries<200)setTimeout(start,50);
}
start();
})();
