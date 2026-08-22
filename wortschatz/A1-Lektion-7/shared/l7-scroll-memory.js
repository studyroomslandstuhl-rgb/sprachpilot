(function(){
'use strict';
if(window.__SP_L7_SCROLL_MEMORY_V3)return;window.__SP_L7_SCROLL_MEMORY_V3=true;
const theme=Number(document.body?.dataset?.theme||0),page=String(document.body?.dataset?.page||'');
if(!theme)return;
const key=`SP_L7_LAST_TASK_T${theme}`;
const app=document.getElementById('app');
if(!app)return;
function taskId(){return String(new URLSearchParams(location.search).get('task')||'')}
function remember(id){if(id)try{sessionStorage.setItem(key,id)}catch(e){}return id}
function store(){return remember(taskId())}
function taskTarget(){return document.querySelector('[data-sp-task-focus],.flip-wrap,.l7-question-card,.l7-learning,.l7-exercise,#exercise')}
function scrollTask(behavior='smooth'){
 const target=taskTarget();if(!target)return false;
 target.style.scrollMarginTop='14px';
 try{target.scrollIntoView({block:'start',inline:'nearest',behavior})}catch(e){target.scrollIntoView(true)}
 return true
}
function restore(){let id='';try{id=location.hash.replace(/^#task-/,'')||sessionStorage.getItem(key)||''}catch(e){id=location.hash.replace(/^#task-/,'')||''}if(!id)return false;const target=document.getElementById(`task-${id}`);if(!target)return false;target.style.scrollMarginTop='14px';try{target.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){target.scrollIntoView(true)}return true}
if(page==='task'){
 store();
 let cancelled=false,first=false;
 const run=()=>{if(cancelled)return;const ok=scrollTask(first?'auto':'smooth');if(ok)first=true};
 const obs=new MutationObserver(()=>{if(!cancelled)requestAnimationFrame(run)});obs.observe(app,{childList:true,subtree:true});
 [40,120,280,520,900,1400,2100].forEach(ms=>setTimeout(run,ms));
 document.addEventListener('load',e=>{if(!cancelled&&e.target instanceof HTMLImageElement)setTimeout(run,40)},true);
 const cancel=()=>{if(first){cancelled=true;obs.disconnect()}};
 window.addEventListener('wheel',cancel,{passive:true,once:true});
 window.addEventListener('touchstart',cancel,{passive:true,once:true});
 window.addEventListener('pageshow',()=>{store();cancelled=false;first=false;setTimeout(run,50);setTimeout(run,260)});
}else if(page==='theme'){
 let done=false;const run=()=>{if(done)return;if(restore())done=true};
 document.addEventListener('click',event=>{const link=event.target.closest?.('a[id^="task-"]');if(!link)return;remember(String(link.id||'').replace(/^task-/,''))},true);
 const obs=new MutationObserver(()=>run());obs.observe(app,{childList:true,subtree:true});run();setTimeout(run,180);setTimeout(run,600);
 window.addEventListener('pageshow',()=>{done=false;setTimeout(run,60);setTimeout(run,240)});
}
})();
