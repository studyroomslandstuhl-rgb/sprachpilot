(function(){
'use strict';
if(window.__SP_L8_EXPLICIT_EMOJI_20260902_V2)return;window.__SP_L8_EXPLICIT_EMOJI_20260902_V2=true;
function theme(){const n=Number(document.body?.dataset?.theme||location.pathname.match(/\/Thema-(\d+)\//i)?.[1]||0),all=window.L8_ALL_THEMES||{};return window.L8_THEME||all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function icon(task){if(task?.exam)return'⭐';return String(task?.emoji||task?.icon||'').trim()}
function setText(node,value){if(node&&node.textContent!==value)node.textContent=value}
function run(){const t=theme();if(!t||!Array.isArray(t.tasks))return false;if(document.body.dataset.page==='theme'){const cards=[...document.querySelectorAll('.l8-task-card')];cards.forEach((card,i)=>{const task=t.tasks[i],node=card.querySelector('.emoji');const e=icon(task);if(node&&e)setText(node,e)});return !!cards.length}const id=new URLSearchParams(location.search).get('task'),task=t.tasks.find(x=>String(x?.id)===String(id)),e=icon(task);if(!task||!e)return false;const line=document.querySelector('.l8-task-title-block p');if(line)setText(line,`${e} ${task.instruction||''}`);return !!line}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();window.addEventListener('load',run);[0,80,220,500,1000,1800].forEach(ms=>setTimeout(run,ms));
try{
 const root=document.getElementById('app')||document.documentElement;let timer=null,stopped=false;
 const observer=new MutationObserver(()=>{if(stopped)return;clearTimeout(timer);timer=setTimeout(()=>{const ready=run();if(ready){stopped=true;observer.disconnect()}},40)});
 observer.observe(root,{childList:true,subtree:true});
}catch(e){}
window.L8ExplicitEmoji20260902={run,version:2};
})();
