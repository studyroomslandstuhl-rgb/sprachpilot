(function(){
'use strict';
if(window.__L7_CLEANUP_20260729)return;
window.__L7_CLEANUP_20260729=true;
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
function patchState(){
 const S=window.L7S;
 if(!S)return false;
 S.norm=normalizeAnswer;
 S.exact=function(value,solutions){
  const normalized=normalizeAnswer(value);
  return (Array.isArray(solutions)?solutions:[solutions]).some(solution=>normalizeAnswer(solution)===normalized);
 };
 return true;
}
function patchThemeMeta(){
 const T=window.L7_THEME;
 if(!T||!Array.isArray(T.tasks))return false;
 T.tasks.forEach((task,index)=>{
  if(task.exam||/pr[uü]fung/i.test(String(task.title||''))){
   task.title='Prüfung';
   task.icon='⭐';
  }
  if(!task.number)task.number=String(index+1);
  if(task.description)task.description=String(task.description).replace(/Bunny-?Bildern?/gi,'Bilder').replace(/Bunny/gi,'');
 });
 return true;
}
function patchLinks(){
 document.querySelectorAll('a[href]').forEach(link=>{
  const href=String(link.getAttribute('href')||'');
  if(href.includes('dialoge.html')&&location.pathname.includes('/A1-Lektion-7/'))return;
 });
}
function apply(){patchState();patchThemeMeta();patchLinks()}
apply();
window.addEventListener('DOMContentLoaded',apply,{once:true});
window.addEventListener('load',apply,{once:true});
setTimeout(apply,100);
setTimeout(apply,800);
try{new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();
