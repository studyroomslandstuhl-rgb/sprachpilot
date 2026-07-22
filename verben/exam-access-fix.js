(function(){
'use strict';
const E=window.VerbGroupsEngine;
if(!E)return;
const originalLearnDone=E.learnDone.bind(E);
const key=id=>`SP_VERBEN_EXAM_UNLOCK_${id}_${E.groupState(id)?.currentRun||1}`;
function completed(id){return E.LEARN.every(task=>E.taskPercent(id,task)>=100)}
E.learnDone=function(id){
 const done=originalLearnDone(id)||completed(id);
 if(done&&!E.isPreview())try{localStorage.setItem(key(id),'1')}catch{}
 return done||(!E.isPreview()&&localStorage.getItem(key(id))==='1')
};
function repair(){
 E.GROUPS.forEach(group=>{
  const id=group.id;
  if(!E.learnDone(id))return;
  document.querySelectorAll(`[data-task="exam"][data-group="${id}"]`).forEach(card=>{
   card.disabled=false;
   card.classList.remove('locked-task');
   const icon=card.querySelector('.task-icon');if(icon)icon.textContent='★';
   const status=card.querySelector('.task-status');if(status&&status.textContent==='Gesperrt')status.textContent='Starten'
  })
 })
}
document.addEventListener('click',event=>{
 const card=event.target.closest('[data-task="exam"][data-group]');
 if(!card)return;
 const id=Number(card.dataset.group)||0;
 if(!id||!E.learnDone(id))return;
 event.preventDefault();
 location.href=`/verben/?group=${id}&task=exam`
},true);
new MutationObserver(()=>setTimeout(repair,0)).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',repair);
setTimeout(repair,100);
setTimeout(repair,800);
})();
