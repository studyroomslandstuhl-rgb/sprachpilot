(function(){
'use strict';
const CARD_EMOJI='🃏';
function patchData(){
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;
 const cards=theme?.tasks?.find(t=>t?.id==='karteikarten'||t?.kind==='cards'||/karteikart/i.test(t?.title||''));
 if(cards)cards.icon=CARD_EMOJI;
}
function patchDom(){
 document.querySelectorAll('a.l8-task-card[href*="task=karteikarten"] .emoji').forEach(node=>node.textContent=CARD_EMOJI);
 const id=new URLSearchParams(location.search).get('task');
 if(id==='karteikarten'){
  const line=document.querySelector('.l8-task-title-block p');
  if(line){
   const text=String(line.textContent||'').replace(/^\S+\s*/,'');
   line.textContent=`${CARD_EMOJI} ${text}`;
  }
 }
}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{patchData();return value});
const root=document.getElementById('app');
if(root)new MutationObserver(()=>patchDom()).observe(root,{childList:true,subtree:true,characterData:true});
[0,60,180,500,1700].forEach(ms=>setTimeout(()=>{patchData();patchDom()},ms));
})();
