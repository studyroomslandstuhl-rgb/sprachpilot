(function(){
'use strict';
const RELEASE='20260728b';
const task=(window.L6T4_DATA?.tasks||[]).find(item=>item.id==='dialog-abc');
if(task){
 task.title='Dialoge';
 task.description='Höre den Dialog und beantworte alle drei Fragen.';
 task.instruction='Höre den Dialog und beantworte alle drei Fragen.';
}
const meta=(window.L6T4_USER_META||[]).find(item=>item.id==='dialog-abc');
if(meta){
 meta.title='Dialoge';
 meta.icon='🎧';
 meta.description='Höre einen Dialog und beantworte alle drei Fragen.';
 meta.external=`dialoge.html?release=${RELEASE}`;
}
function patchBuiltLists(){
 for(const list of [window.L6T4_META,window.L6T4_TASKS]){
  if(!Array.isArray(list))continue;
  const entry=list.find(item=>item.id==='dialog-abc');
  if(!entry)continue;
  entry.title='Dialoge';
  entry.icon='🎧';
  entry.description='Höre einen Dialog und beantworte alle drei Fragen.';
  entry.external=`dialoge.html?release=${RELEASE}`;
  entry.file=`dialoge.html?release=${RELEASE}`;
 }
}
patchBuiltLists();
window.addEventListener('DOMContentLoaded',patchBuiltLists,{once:true});
window.L6T4_DIALOG13_RELEASE=RELEASE;
})();
