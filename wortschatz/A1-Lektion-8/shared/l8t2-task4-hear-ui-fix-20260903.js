(function(){
'use strict';
if(window.__SP_L8T2_TASK4_HEAR_UI_FIX_20260903)return;
window.__SP_L8T2_TASK4_HEAR_UI_FIX_20260903=true;

const base=window.L8UI;
if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;

function currentTask(){
 const theme=window.L8_THEME;
 const id=new URLSearchParams(location.search).get('task');
 return (theme?.tasks||[]).find(task=>String(task?.id)===String(id));
}
function isTask4(task){
 const tasks=window.L8_THEME?.tasks||[];
 const practice=tasks.filter(t=>!t?.exam);
 return task===practice[3] || /fragen\s+und\s+antworten/i.test(String(task?.title||''));
}
function ensureAudio(task){
 if(!task||!Array.isArray(task.items))return;
 task.items=task.items.map(item=>{
  if(!item||item.type!=='choice')return item;
  const spoken=String(item.context||item.prompt||'').trim();
  if(!spoken)return item;
  return {...item,audio:spoken};
 });
}
function patchedTaskPage(){
 const task=currentTask();
 if(isTask4(task))ensureAudio(task);
 return originalTaskPage();
}

window.L8UI={...base,taskPage:patchedTaskPage};
})();
