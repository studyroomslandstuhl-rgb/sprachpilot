(function(){
'use strict';
if(window.__SP_RELEASE_CHILD_SCOPE_FIX_20260916)return;
window.__SP_RELEASE_CHILD_SCOPE_FIX_20260916=true;

function install(){
 const draft=window.ReleaseDraft||globalThis.ReleaseDraft;
 if(!draft||draft.__childScopeFix20260916)return false;
 draft.__childScopeFix20260916=true;
 const oldSetTask=typeof draft.setTask==='function'?draft.setTask.bind(draft):null;
 if(!oldSetTask)return false;

 function themeTasks(lessonKey,themeKey){
   try{
     const lesson=(RELEASE_CATALOG.lessons||[]).find(l=>l&&l.key===lessonKey);
     const theme=(lesson?.themes||[]).find(t=>t&&t.key===themeKey);
     return (theme?.tasks||[]).map(x=>Array.isArray(x)?x[0]:x?.file).filter(Boolean);
   }catch(e){return []}
 }
 function hasAnyExplicitTask(lessonKey,themeKey){
   return themeTasks(lessonKey,themeKey).some(file=>{
     try{return draft.getAny(taskReleasePaths(lessonKey,themeKey,file),undefined)!==undefined}catch(e){return false}
   });
 }
 function seedSiblingsOff(lessonKey,themeKey,exceptFile){
   for(const file of themeTasks(lessonKey,themeKey)){
     if(file===exceptFile)continue;
     try{draft.setMany(taskReleasePaths(lessonKey,themeKey,file),false)}catch(e){}
   }
 }

 draft.setTask=function(lessonKey,themeKey,file,value){
   const on=!!value;
   if(on&&!hasAnyExplicitTask(lessonKey,themeKey))seedSiblingsOff(lessonKey,themeKey,file);
   oldSetTask(lessonKey,themeKey,file,on);
 };
 return true;
}

if(!install()){
 let n=0;const timer=setInterval(()=>{n++;if(install()||n>300)clearInterval(timer)},100);
 window.addEventListener('beforeunload',()=>clearInterval(timer),{once:true});
}
})();
