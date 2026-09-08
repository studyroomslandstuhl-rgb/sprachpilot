(function(){
'use strict';
if(window.L10T1TaskStandard)return;
const D=window.L10T1||{tasks:[]};
const taskId=String(new URLSearchParams(location.search).get('task')||'karteikarten');
const taskIndex=Math.max(0,(D.tasks||[]).findIndex(t=>t.id===taskId));
let timer=null;

function pctFromProgress(node){
 const text=String(node?.querySelector('span')?.textContent||'');
 const nums=text.match(/\d+/g)||[];
 const done=Number(nums[0]||0),total=Number(nums[1]||34)||34;
 return{done,total,pct:total?Math.min(100,Math.round(done/total*100)):0};
}
function normalize(){
 const head=document.querySelector('.l8-task-head');
 if(head){
  head.classList.add('l8-card');
  const block=head.querySelector('.l8-task-title-block');
  if(block&&!block.querySelector('.l8-task-kicker')){
   const k=document.createElement('span');k.className='l8-task-kicker';k.textContent=`Aufgabe ${taskIndex+1}`;block.insertBefore(k,block.firstChild);
  }
  const old=head.querySelector('.l10-progress');
  if(old){
   const {done,total,pct}=pctFromProgress(old);
   const row=document.createElement('div');row.className='l8-progress-row';row.innerHTML=`<span>${done} von ${total} fertig</span><strong>${pct}%</strong>`;
   const bar=document.createElement('div');bar.className='l8-progress';bar.innerHTML=`<div style="width:${pct}%"></div>`;
   old.replaceWith(row,bar);
  }
 }
 document.querySelectorAll('.l10-question').forEach(n=>n.classList.add('l8-exercise'));
 document.querySelectorAll('.l10-options').forEach(n=>n.classList.add('l8-options'));
 document.querySelectorAll('.l10-options button').forEach(n=>n.classList.add('l8-option'));
 document.querySelectorAll('.l10-write-row').forEach(n=>n.classList.add('l8-answer-row'));
 document.querySelectorAll('.l10-write-row input,.l8-answer-row input').forEach(n=>n.classList.add('l8-input'));
 document.querySelectorAll('.l10-write-row button,.l10-listen,.l10-btn').forEach(n=>n.classList.add('l8-btn'));
 document.querySelectorAll('.l10-btn.primary').forEach(n=>n.classList.add('primary'));
 document.querySelectorAll('.l10-feedback.ok').forEach(n=>n.classList.add('l8-feedback','good'));
 document.querySelectorAll('.l10-feedback.bad').forEach(n=>n.classList.add('l8-feedback','bad'));
 document.querySelectorAll('.l10-finish-actions').forEach(n=>n.classList.add('l8-row','l8-center-actions'));
}
function schedule(){clearTimeout(timer);timer=setTimeout(normalize,0)}
const root=document.getElementById('app');
if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
[0,40,120,300,700].forEach(ms=>setTimeout(normalize,ms));
window.L10T1TaskStandard={version:'1.0',normalize};
})();
