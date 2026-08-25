(function(){
'use strict';
function polishHeader(){
 const t=window.L8_THEME;if(!t)return;
 const taskId=new URLSearchParams(location.search).get('task');
 const task=(t.tasks||[]).find(x=>x.id===taskId);
 const subtitle=document.querySelector('.sp-header__subtitle');
 if(subtitle)subtitle.textContent=task?`${task.title} · A1 Lektion 8 · Thema ${t.number}`:`${t.title} · A1 Lektion 8 · Thema ${t.number}`;
 document.querySelectorAll('.sp-header__nav-link').forEach(link=>{if(String(link.textContent||'').trim()==='Übersicht'&&link.tagName==='A')link.setAttribute('href','uebersicht.html')});
}
function start(){
 if(window.L8_T2_TIME_REVIEW_PENDING||window.L8_T2_QUALITY_PENDING||!window.L8_THEME||!window.L8S||!window.L8UI){setTimeout(start,30);return}
 if(document.body.dataset.page==='theme')window.L8UI.themeOverview();else window.L8UI.taskPage();
 [0,80,250,700,1500].forEach(ms=>setTimeout(polishHeader,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();