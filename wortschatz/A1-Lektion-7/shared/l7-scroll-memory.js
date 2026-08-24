(function(){
'use strict';
if(window.__SP_L7_SCROLL_MEMORY_V5)return;window.__SP_L7_SCROLL_MEMORY_V5=true;
const theme=Number(document.body?.dataset?.theme||0),page=String(document.body?.dataset?.page||'');
if(!theme)return;
function loadReleaseEnforcer(){if(window.__SP_L7_RELEASE_ENFORCER_V1||document.querySelector('script[data-sp-l7-release-enforcer]'))return;const s=document.createElement('script');s.src='../shared/l7-release-enforcer.js?v=20260824-1';s.dataset.spL7ReleaseEnforcer='1';document.head.appendChild(s)}
loadReleaseEnforcer();
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
 let observer=null,finished=false;
 function stop(){finished=true;if(observer){observer.disconnect();observer=null}}
 function run(behavior='smooth'){
  if(finished)return;
  if(scrollTask(behavior))stop()
 }
 function start(){
  finished=false;if(observer)observer.disconnect();
  observer=new MutationObserver(()=>{if(!finished)requestAnimationFrame(()=>run('smooth'))});
  observer.observe(app,{childList:true,subtree:true});
  run('smooth');
  [40,120,280,520,900,1400].forEach(ms=>setTimeout(()=>run(ms<=120?'smooth':'auto'),ms));
 }
 start();
 window.addEventListener('pageshow',()=>{store();setTimeout(start,30)});
}else if(page==='theme'){
 let done=false;const run=()=>{if(done)return;if(restore())done=true};
 document.addEventListener('click',event=>{const link=event.target.closest?.('a[id^="task-"]');if(!link)return;remember(String(link.id||'').replace(/^task-/,''))},true);
 const obs=new MutationObserver(()=>run());obs.observe(app,{childList:true,subtree:true});run();setTimeout(run,180);setTimeout(run,600);
 window.addEventListener('pageshow',()=>{done=false;setTimeout(run,60);setTimeout(run,240)});
}
})();