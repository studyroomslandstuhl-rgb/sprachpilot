(function(){
'use strict';
const MARK='SP_L6_T4_ALL_PRACTICE_100';
const isExam=/pruefung-ohne-audio\.html$/i.test(location.pathname);
function marker(){return localStorage.getItem(MARK)==='1'}
if(isExam){
 if(marker()){
  window.L6T4_TASKS=[{id:'compat-practice-complete',key:'compat-practice-complete',total:1,exam:false}];
  window.l6t4Percent=function(){return 100};
 }
 return;
}
function visiblePracticeComplete(){
 const grid=document.getElementById('taskGrid');if(!grid)return false;
 const cards=[...grid.querySelectorAll('a,div.module,.l8-task-card')].filter(node=>{
  const text=String(node.textContent||'').toLowerCase(),href=String(node.getAttribute?.('href')||'').toLowerCase();
  return !text.includes('prüfung')&&!text.includes('themenprüfung')&&!href.includes('pruefung')&&!href.includes('task=exam');
 });
 const uniq=[...new Set(cards)];if(!uniq.length)return false;
 return uniq.every(node=>{
  const text=String(node.textContent||'');
  const bar=node.querySelector?.('.bar,.l8-progress>div');
  const width=parseFloat(String(bar?.style?.width||'0'))||0;
  return /(^|\D)100\s*%/.test(text)||width>=99.5||node.classList.contains('done')||node.classList.contains('done-card');
 });
}
function repair(){
 let complete=false;
 try{complete=typeof window.l6t4ExamUnlocked==='function'&&window.l6t4ExamUnlocked()}catch(e){}
 if(!complete)complete=visiblePracticeComplete();
 if(complete)localStorage.setItem(MARK,'1');
 const grid=document.getElementById('taskGrid');if(!grid||!complete)return;
 grid.querySelectorAll('a,.module,.l8-task-card').forEach(node=>{
  const text=String(node.textContent||'').toLowerCase(),href=String(node.getAttribute?.('href')||'').toLowerCase();
  if(!text.includes('prüfung')&&!text.includes('themenprüfung')&&!href.includes('pruefung')&&!href.includes('task=exam'))return;
  if(node.tagName==='A')node.setAttribute('href','pruefung-ohne-audio.html?v=20260915-unlock2');
  node.removeAttribute('aria-disabled');node.classList.remove('locked','exam-locked');
  const start=node.querySelector?.('.start,.l8-task-start');if(start)start.textContent='Starten';
 });
}
[0,80,250,700,1500].forEach(ms=>setTimeout(repair,ms));
const grid=document.getElementById('taskGrid');if(grid)new MutationObserver(repair).observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','href']});
})();
