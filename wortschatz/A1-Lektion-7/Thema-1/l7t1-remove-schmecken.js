(function(){
'use strict';
if(window.__SP_L7T1_REMOVE_SCHMECKEN_1)return;
window.__SP_L7T1_REMOVE_SCHMECKEN_1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const TARGET=/\bschmeck[a-zäöüß]*/i;
const TEXT_KEYS=['prompt','context','meaning','hint','example','label','title','description','goal','text'];
const PRIMARY_KEYS=['word','full','term','answer','solution','correct','expected'];

function hasTarget(value){return TARGET.test(String(value??''))}
function rewriteKnown(value){
 let text=String(value??'');
 text=text
  .replace(/Das Essen schmeckt prima\.?/gi,'Das Essen ist prima.')
  .replace(/Der Kuchen schmeckt gut\.?/gi,'Der Kuchen ist lecker.')
  .replace(/Das Essen schmeckt ___\.?/gi,'Das Essen ist ___.')
  .replace(/Der Kuchen schmeckt ___\.?/gi,'Der Kuchen ist ___.');
 return text;
}
function arrayHasTarget(value){return Array.isArray(value)&&value.some(entry=>hasTarget(entry))}
function isTargetItem(item){
 if(!item||typeof item!=='object')return false;
 if(PRIMARY_KEYS.some(key=>hasTarget(item[key])))return true;
 if(arrayHasTarget(item.answers))return true;
 return false;
}
function cleanString(value){
 const rewritten=rewriteKnown(value);
 return hasTarget(rewritten)?'':rewritten;
}
function cleanItem(item){
 if(!item||typeof item!=='object')return item;
 ['options','tokens','answers'].forEach(key=>{
  if(Array.isArray(item[key]))item[key]=item[key].filter(value=>!hasTarget(value));
 });
 for(const key of TEXT_KEYS){
  if(typeof item[key]==='string'&&hasTarget(item[key]))item[key]=cleanString(item[key]);
 }
 return item;
}
function hasVisibleTarget(item){
 if(!item||typeof item!=='object')return false;
 return [...PRIMARY_KEYS,...TEXT_KEYS].some(key=>hasTarget(item[key]))||
  ['options','tokens','answers'].some(key=>arrayHasTarget(item[key]));
}
function cleanTask(task,report){
 if(!task||typeof task!=='object')return null;
 if(hasTarget(task.title)||hasTarget(task.description)||hasTarget(task.id)){
  report.removedTasks.push(task.id||task.title||'unbekannt');
  return null;
 }
 if(!Array.isArray(task.items))return task;
 const before=task.items.length;
 task.items=task.items
  .filter(item=>!isTargetItem(item))
  .map(cleanItem)
  .filter(item=>!hasVisibleTarget(item));
 const removed=before-task.items.length;
 if(removed)report.removedItems[task.id||task.title||'unbekannt']=removed;
 return task;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const report={removedTasks:[],removedItems:{}};
 theme.tasks=theme.tasks.map(task=>cleanTask(task,report)).filter(Boolean);
 for(const key of ['title','subtitle','goal','description']){
  if(typeof theme[key]==='string'&&hasTarget(theme[key]))theme[key]=cleanString(theme[key]);
 }
 theme.schmeckenRemoved=true;
 window.L7T1SchmeckenRemovalReport=report;
 return theme;
});
})();
