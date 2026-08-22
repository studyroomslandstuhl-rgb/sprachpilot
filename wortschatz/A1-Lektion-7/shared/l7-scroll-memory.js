(function(){
'use strict';
if(window.__SP_L7_SCROLL_MEMORY_V2)return;window.__SP_L7_SCROLL_MEMORY_V2=true;
const theme=Number(document.body?.dataset?.theme||0),page=String(document.body?.dataset?.page||'');
if(!theme)return;
const key=`SP_L7_LAST_TASK_T${theme}`;
const app=document.getElementById('app');
if(!app)return;
function taskId(){return String(new URLSearchParams(location.search).get('task')||'')}
function remember(id){if(id)try{sessionStorage.setItem(key,id)}catch(e){}return id}
function store(){return remember(taskId())}
function scrollTask(){const target=document.querySelector('.l7-question-card,.l7-learning,.l7-exercise,[data-sp-task-focus]');if(!target)return false;target.scrollIntoView({block:'start',behavior:'smooth'});setTimeout(()=>window.scrollBy(0,-10),180);return true}
function restore(){let id='';try{id=location.hash.replace(/^#task-/,'')||sessionStorage.getItem(key)||''}catch(e){id=location.hash.replace(/^#task-/,'')||''}if(!id)return false;const target=document.getElementById(`task-${id}`);if(!target)return false;target.scrollIntoView({block:'center',behavior:'smooth'});return true}
if(page==='task'){
 store();let done=false;const run=()=>{if(done)return;if(scrollTask())done=true};
 const obs=new MutationObserver(()=>run());obs.observe(app,{childList:true,subtree:true});run();setTimeout(run,120);setTimeout(run,450);window.addEventListener('pageshow',()=>{store();done=false;setTimeout(run,40)});
}else if(page==='theme'){
 let done=false;const run=()=>{if(done)return;if(restore())done=true};
 document.addEventListener('click',event=>{const link=event.target.closest?.('a[id^="task-"]');if(!link)return;remember(String(link.id||'').replace(/^task-/,''))},true);
 const obs=new MutationObserver(()=>run());obs.observe(app,{childList:true,subtree:true});run();setTimeout(run,180);setTimeout(run,600);
 window.addEventListener('pageshow',()=>{done=false;setTimeout(run,60);setTimeout(run,240)});
}
})();
