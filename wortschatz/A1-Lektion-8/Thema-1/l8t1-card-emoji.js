(function(){
'use strict';
if(window.__SP_L8T1_CARD_EMOJI_SAFE_V3)return;
window.__SP_L8T1_CARD_EMOJI_SAFE_V3=true;
const CARD_EMOJI='📚';
let scheduled=false;
function patchData(){
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;
 const cards=theme?.tasks?.find(t=>t?.id==='karteikarten'||t?.kind==='cards'||/karteikart/i.test(t?.title||''));
 if(cards){cards.icon=CARD_EMOJI;cards.emoji=CARD_EMOJI}
}
function setText(node,text){if(node&&String(node.textContent||'')!==text)node.textContent=text}
function patchDom(){
 patchData();
 document.querySelectorAll('a.l8-task-card[href*="task=karteikarten"] .emoji').forEach(node=>setText(node,CARD_EMOJI));
 const id=new URLSearchParams(location.search).get('task');
 if(id==='karteikarten'){
  const line=document.querySelector('.l8-task-title-block p');
  if(line){const raw=String(line.textContent||'').trim(),instruction=raw.replace(/^[^\s]+\s*/, '').trim();setText(line,`${CARD_EMOJI} ${instruction}`.trim())}
 }
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;patchDom()})}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{patchData();return value});
const root=document.getElementById('app');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
[0,80,250,700,1600].forEach(ms=>setTimeout(patchDom,ms));
})();