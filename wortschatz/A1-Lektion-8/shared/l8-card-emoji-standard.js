(function(){
'use strict';
if(window.__SP_L8_CARD_EMOJI_STANDARD_V1)return;
window.__SP_L8_CARD_EMOJI_STANDARD_V1=true;
const CARD_EMOJI='🃏';
let scheduled=false;
function theme(){
 const n=Number(document.body?.dataset?.theme||0);
 const all=window.L8_ALL_THEMES||{};
 return all[n]||all[String(n)]||window.L8_THEME||null;
}
function isCards(task){return !!task&&(task.kind==='cards'||task.id==='karteikarten'||/karteikart/i.test(String(task.title||'')));}
function patchData(){
 const t=theme();
 if(!t?.tasks)return;
 for(const task of t.tasks){if(isCards(task)){task.icon=CARD_EMOJI;task.emoji=CARD_EMOJI;}}
}
function patchDom(){
 patchData();
 const t=theme();
 if(!t?.tasks)return;
 const ids=new Set(t.tasks.filter(isCards).map(task=>String(task.id||'')));
 document.querySelectorAll('.l8-task-card').forEach(card=>{
  const href=card.getAttribute('href')||'';
  let id='';
  try{id=new URL(href,location.href).searchParams.get('task')||'';}catch(e){}
  if(ids.has(id)){const node=card.querySelector('.emoji');if(node&&node.textContent!==CARD_EMOJI)node.textContent=CARD_EMOJI;}
 });
 const currentId=new URLSearchParams(location.search).get('task')||'';
 const current=t.tasks.find(task=>String(task?.id||'')===currentId);
 if(isCards(current)){
  const line=document.querySelector('.l8-task-title-block p');
  if(line&&current.instruction){const wanted=`${CARD_EMOJI} ${current.instruction}`;if(line.textContent!==wanted)line.textContent=wanted;}
 }
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;patchDom();});}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{patchData();return value;});
const root=document.getElementById('app');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
[0,80,250,700,1600].forEach(ms=>setTimeout(patchDom,ms));
window.L8CardEmojiStandard={emoji:CARD_EMOJI,patch:patchDom};
})();
