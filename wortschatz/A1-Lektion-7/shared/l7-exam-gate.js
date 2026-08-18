(function(){
'use strict';
if(window.__SP_L7_STRICT_EXAM_GATE_V2)return;
window.__SP_L7_STRICT_EXAM_GATE_V2=true;

function install(){
 const S=window.L7S,T=window.L7_THEME;
 if(!S||!T||!Array.isArray(T.tasks))return false;

 function completed(theme,task){
  if(!task||task.exam)return true;
  const total=Array.isArray(task.items)?task.items.length:0;
  if(total<=0)return false;
  try{
   const state=S.load(theme,task.id,total);
   const unique=new Set((Array.isArray(state?.done)?state.done:[]).map(Number).filter(index=>Number.isInteger(index)&&index>=0&&index<total));
   return unique.size===total;
  }catch(e){return false}
 }

 S.pct=function(theme,id,total){
  total=Number(total)||0;
  if(total<=0)return 0;
  try{
   const state=S.load(theme,id,total);
   const unique=new Set((Array.isArray(state?.done)?state.done:[]).map(Number).filter(index=>Number.isInteger(index)&&index>=0&&index<total));
   if(unique.size===total)return 100;
   return Math.min(99,Math.round(unique.size/total*100));
  }catch(e){return 0}
 };

 S.allDone=function(theme){
  if(S.preview?.())return true;
  const learning=T.tasks.filter(task=>!task.exam);
  return learning.length>0&&learning.every(task=>completed(theme,task));
 };

 S.learningTaskComplete=completed;
 return true;
}

window.SPL7StrictExamGate={install};
install();
})();
