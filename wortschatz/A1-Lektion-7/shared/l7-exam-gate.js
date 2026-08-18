(function(){
'use strict';
if(window.__SP_L7_STRICT_EXAM_GATE_V1)return;
window.__SP_L7_STRICT_EXAM_GATE_V1=true;

function install(){
 const S=window.L7S,T=window.L7_THEME;
 if(!S||!T||!Array.isArray(T.tasks))return false;

 function completed(theme,task){
  if(!task||task.exam)return true;
  const total=Array.isArray(task.items)?task.items.length:0;
  if(total<=0)return true;
  try{
   const state=S.load(theme,task.id,total);
   return Array.isArray(state?.done)&&state.done.length>=total;
  }catch(e){return false}
 }

 S.pct=function(theme,id,total){
  total=Number(total)||0;
  if(total<=0)return 0;
  let done=0;
  try{done=Math.max(0,Math.min(total,S.load(theme,id,total)?.done?.length||0))}catch(e){return 0}
  if(done>=total)return 100;
  return Math.min(99,Math.round(done/total*100));
 };

 S.allDone=function(theme){
  if(S.preview?.())return true;
  return T.tasks.filter(task=>!task.exam).every(task=>completed(theme,task));
 };

 S.learningTaskComplete=completed;
 return true;
}

window.SPL7StrictExamGate={install};
install();
})();
