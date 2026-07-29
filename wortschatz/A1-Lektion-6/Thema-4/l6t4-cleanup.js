(function(){
'use strict';
if(window.__L6T4_CLEANUP_20260729)return;
window.__L6T4_CLEANUP_20260729=true;
const TASK13='aufgabe13-dialoge-20260728.html';
function normalizeAnswer(value){
 return String(value||'')
  .toLowerCase()
  .trim()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/ß/g,'ss')
  .replace(/[.…⋯,!?;:()\[\]{}„“”"'`´’‘<>/\\|_\-]+/g,' ')
  .replace(/\s+/g,' ')
  .trim();
}
window.l6t4Simple=normalizeAnswer;
window.l6t4Exact=function(value,solutions){
 const normalized=normalizeAnswer(value);
 return (Array.isArray(solutions)?solutions:[solutions]).some(solution=>normalizeAnswer(solution)===normalized);
};
function patchTask13(entry){
 if(!entry||entry.id!=='dialog-abc')return;
 entry.number='13';
 entry.title='Dialoge';
 entry.icon='🎧';
 entry.description='Höre einen Dialog und beantworte alle drei Fragen.';
 entry.external=TASK13;
 entry.file=TASK13;
 entry.key='task-dialog-abc';
 entry.total=5;
}
function patchAllTask13(){
 [window.L6T4_META,window.L6T4_TASKS,window.L6T4_USER_META].forEach(list=>{
  if(Array.isArray(list))list.forEach(patchTask13);
 });
 const task=window.L6T4_DATA?.tasks?.find(item=>item.id==='dialog-abc');
 if(task){
  task.title='Dialoge';
  task.icon='🎧';
  task.description='Höre einen Dialog und beantworte alle drei Fragen.';
  task.external=TASK13;
 }
 document.querySelectorAll('a[href*="dialoge.html"],a[href*="task=dialog-abc"]').forEach(link=>link.setAttribute('href',TASK13));
 document.querySelectorAll('#taskGrid a').forEach(link=>{
  const number=String(link.querySelector('.num')?.textContent||'').trim();
  const href=String(link.getAttribute('href')||'');
  if(/^13\./.test(number)||href.includes('dialoge.html')||href.includes('task=dialog-abc'))link.setAttribute('href',TASK13);
 });
}
patchAllTask13();
window.addEventListener('DOMContentLoaded',patchAllTask13,{once:true});
window.addEventListener('load',patchAllTask13,{once:true});
setTimeout(patchAllTask13,200);
setTimeout(patchAllTask13,1200);
try{
 new MutationObserver(patchAllTask13).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
}catch(e){}
})();
