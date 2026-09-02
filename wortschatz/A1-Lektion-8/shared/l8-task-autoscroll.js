(function(){
'use strict';
if(window.__SP_L8_TASK_AUTOSCROLL_V3)return;window.__SP_L8_TASK_AUTOSCROLL_V3=true;window.__SP_L8_TASK_AUTOSCROLL_V2=true;
if(document.body.dataset.page!=='task')return;
let finished=false;
const visible=node=>!!(node&&node.isConnected&&node.getClientRects().length);
function findTarget(){
 const root=document.getElementById('app');if(!root)return null;
 const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
 if(task==='karteikarten'||task==='cards'){
  const cards=root.querySelector('.l8-card-stage,.flip-wrap,.l8-flip-wrap');
  if(visible(cards))return cards.closest('.l8-card,section')||cards;
 }
 const selectors=[
  '[data-sp-task-stage]',
  '.l8-exercise#exercise',
  '.sp-lg-card',
  '.sp-time-card',
  '.sp-img-card',
  '.sp-dialog-card',
  '.sp-sa-card',
  '.sp-t3-vocab-card',
  '.sp-uf-context',
  '.sp-pw-card',
  '.sp-t4-task-card',
  '.sp-ter-list',
  '.sp-production-exam',
  '.l8-finish',
  '.sp-rv-finish',
  '.sp-lg-finish',
  '.sp-vs-finish',
  '.sp-uf-finish',
  '.sp-exam-finish'
 ];
 for(const selector of selectors){const node=root.querySelector(selector);if(visible(node))return node}
 const control=[...root.querySelectorAll('input,textarea,select,button')].find(node=>visible(node)&&!node.closest('.l8-task-head,.sp-rv-head,.sp-lg-head,.sp-ter-head,.sp-uf-head,.sp-exam-head'));
 if(control){const box=control.closest('[data-sp-task-stage],.l8-exercise,.l8-card,section,article');if(visible(box)&&!/Aufgabe wird geladen/.test(box.textContent||''))return box}
 return null;
}
function run(){
 if(finished)return true;
 const target=findTarget();if(!target)return false;
 finished=true;target.style.scrollMarginTop='12px';
 requestAnimationFrame(()=>requestAnimationFrame(()=>target.scrollIntoView({behavior:'auto',block:'start'})));
 return true;
}
const root=document.getElementById('app');
if(root){const observer=new MutationObserver(()=>{if(run())observer.disconnect()});observer.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']})}
[0,40,100,220,450,800,1400,2400,3600].forEach(ms=>setTimeout(run,ms));
})();
