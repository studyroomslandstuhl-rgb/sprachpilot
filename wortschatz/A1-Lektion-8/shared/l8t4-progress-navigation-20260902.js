(function(){
'use strict';
if(window.__SP_L8T4_PROGRESS_NAV_20260902_V1)return;window.__SP_L8T4_PROGRESS_NAV_20260902_V1=true;
const LAST='SP_L8_T4_LAST_TASK';
function theme(){const all=window.L8_ALL_THEMES||{},t=all[4]||all['4']||(Array.isArray(all)?all.find(x=>Number(x?.number)===4):null)||window.L8_THEME;return t||null}
function remember(){if(document.body.dataset.page!=='task')return;const id=new URLSearchParams(location.search).get('task');if(!id)return;try{sessionStorage.setItem(LAST,id);localStorage.setItem(LAST,id)}catch(e){}}
function last(){try{return sessionStorage.getItem(LAST)||localStorage.getItem(LAST)||''}catch(e){return''}}
function setText(node,value){if(node&&node.textContent!==value)node.textContent=value}
function setWidth(node,value){if(node&&node.style.width!==value)node.style.width=value}
function refresh(){
 if(document.body.dataset.page!=='theme'||!window.L8S)return false;const t=theme();if(!t)return false;
 const tasks=t.tasks||[],cards=[...document.querySelectorAll('.l8-task-card')];if(!cards.length)return false;
 const normal=tasks.filter(x=>!x.exam);let sum=0,completed=0;
 tasks.forEach((task,i)=>{const total=Array.isArray(task.items)?task.items.length:0,pct=window.L8S.pct(4,task.id,total);if(!task.exam){sum+=pct;if(pct>=100)completed++}const card=cards[i];if(!card)return;setWidth(card.querySelector('.l8-progress > div'),`${pct}%`);const small=card.querySelector('.l8-small');if(small&&!card.classList.contains('locked'))setText(small,`${pct}%`);card.classList.toggle('done',pct>=100)});
 const avg=Math.round(sum/Math.max(1,normal.length));setText(document.querySelector('.l8-progress-circle'),`${avg}%`);setWidth(document.querySelector('.l8-progress-card .l8-progress > div'),`${avg}%`);setText(document.querySelector('.l8-progress-main > .l8-small'),`${completed} / ${normal.length} Aufgaben abgeschlossen`);return true
}
let scrolled=false;
function scrollLast(){if(document.body.dataset.page!=='theme'||scrolled)return false;const id=last();if(!id)return false;const link=[...document.querySelectorAll('a.l8-task-card')].find(a=>{try{return new URL(a.href,location.href).searchParams.get('task')===id}catch(e){return false}});if(!link)return false;scrolled=true;link.style.scrollMarginTop='18px';requestAnimationFrame(()=>requestAnimationFrame(()=>link.scrollIntoView({behavior:'auto',block:'center'})));return true}
remember();
if(document.body.dataset.page==='theme'){
 const root=document.getElementById('app');if(root){let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;setTimeout(()=>{scheduled=false;const ready=refresh();scrollLast();if(ready)observer.disconnect()},40)});observer.observe(root,{childList:true,subtree:true})}
 window.addEventListener('pageshow',e=>{if(e.persisted&&window.L8UI?.themeOverview){try{window.L8UI.themeOverview()}catch(x){}}setTimeout(()=>{scrolled=false;refresh();scrollLast()},120)});
 window.addEventListener('focus',()=>setTimeout(refresh,60));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(refresh,60)});
 [100,250,500,900,1600].forEach(ms=>setTimeout(()=>{refresh();scrollLast()},ms));
}
window.L8T4ProgressNavigation20260902={refresh,scrollLast,version:1};
})();
