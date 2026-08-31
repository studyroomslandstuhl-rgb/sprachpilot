(function(){
'use strict';
if(window.__SP_L8_TASK_AUTOSCROLL_V1)return;window.__SP_L8_TASK_AUTOSCROLL_V1=true;
if(document.body.dataset.page!=='task')return;
let finished=false;
function findTarget(){
 const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
 if(task==='karteikarten'||task==='cards')return document.querySelector('.l8-card-stage');
 return document.querySelector('.l8-exercise');
}
function run(){
 if(finished)return true;
 const target=findTarget();if(!target)return false;
 finished=true;
 target.style.scrollMarginTop='14px';
 requestAnimationFrame(()=>requestAnimationFrame(()=>target.scrollIntoView({behavior:'auto',block:'start'})));
 return true;
}
const root=document.getElementById('app');
if(root){const observer=new MutationObserver(()=>{if(run())observer.disconnect()});observer.observe(root,{childList:true,subtree:true})}
[0,60,150,350,800,1400].forEach(ms=>setTimeout(run,ms));
})();
