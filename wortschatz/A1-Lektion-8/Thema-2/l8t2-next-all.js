(function(){
'use strict';
if(window.__SP_L8T2_NEXT_ALL_20260902)return;
window.__SP_L8T2_NEXT_ALL_20260902=true;

function currentTask(){
 const id=String(new URLSearchParams(location.search).get('task')||'');
 return (window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===id)||null;
}
function shouldSkip(task){
 const kind=String(task?.kind||'').toLowerCase();
 const id=String(task?.id||'').toLowerCase();
 return kind==='vocab-memory'||kind==='cards'||id==='karteikarten'||id==='cards';
}
function canAdvance(task){
 if(!task||!window.L8S||!window.L8_THEME)return false;
 try{
  const state=window.L8S.load(window.L8_THEME.number,task.id,Array.isArray(task.items)?task.items.length:0);
  return state?.current===null||state?.current===undefined;
 }catch(e){return false}
}
function installNext(){
 const task=currentTask();
 if(!task||shouldSkip(task)||!canAdvance(task))return;
 const feedbacks=[...document.querySelectorAll('.l8-feedback.good')];
 const feedback=feedbacks[feedbacks.length-1];
 if(!feedback||!feedback.isConnected)return;
 if(document.getElementById('l8t2GlobalNext'))return;
 const wrap=document.createElement('div');
 wrap.className='l8-row l8-center-actions sp-l8t2-global-next-wrap';
 const btn=document.createElement('button');
 btn.id='l8t2GlobalNext';
 btn.type='button';
 btn.className='l8-btn primary';
 btn.textContent='Weiter';
 btn.onclick=()=>{
  if(btn.disabled)return;
  btn.disabled=true;
  try{window.L8UI?.taskPage?.()}catch(error){console.error('L8T2 Weiter',error);btn.disabled=false}
 };
 wrap.appendChild(btn);
 feedback.insertAdjacentElement('afterend',wrap);
}

const root=document.getElementById('app');
if(root)new MutationObserver(()=>queueMicrotask(installNext)).observe(root,{childList:true,subtree:true});
queueMicrotask(installNext);

const style=document.createElement('style');
style.textContent=`
.sp-l8t2-global-next-wrap{max-width:620px;margin:12px auto 0!important}
.sp-l8t2-global-next-wrap .l8-btn{min-width:180px;min-height:48px}
`;
document.head.appendChild(style);
})();
