(function(){
'use strict';
if(window.SPTaskPositionStandard)return;
const match=String(location.pathname||'').match(/\/wortschatz\/A\d-Lektion-(\d+)\/Thema-(\d+)\//i);
if(!match)return;
const lesson=Number(match[1]),theme=Number(match[2]);
const qs=new URLSearchParams(location.search),taskId=String(qs.get('task')||'').trim();

function profileId(){
 try{
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
  if(['teacher','lehrer','admin','owner','superadmin'].includes(role)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1')return'teacher';
  const p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}');
  return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_');
 }catch(e){return'student'}
}
function key(){return`SP_LAST_TASK_A1_L${lesson}_T${theme}_${profileId()}`}
function store(){try{return profileId()==='teacher'?sessionStorage:localStorage}catch(e){return localStorage}}
function remember(){
 if(!taskId)return false;
 try{store().setItem(key(),JSON.stringify({taskId,href:location.pathname+location.search,at:Date.now()}));return true}catch(e){return false}
}
function readLast(){try{const raw=JSON.parse(store().getItem(key())||'null');return raw&&raw.taskId?raw:null}catch(e){return null}}
function visible(node){if(!node)return false;const r=node.getBoundingClientRect(),s=getComputedStyle(node);return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}
function taskCardById(id){
 if(!id)return null;
 const links=[...document.querySelectorAll('a[href]')];
 const a=links.find(link=>{try{return String(new URL(link.getAttribute('href')||'',location.href).searchParams.get('task')||'')===String(id)}catch(e){return false}});
 if(a)return a.closest('.l8-task-card,.l7-module,.task-card,.card,[data-task-id],[data-task]')||a;
 const esc=window.CSS?.escape?CSS.escape(String(id)):String(id).replace(/[^a-zA-Z0-9_-]/g,'');
 const direct=document.querySelector(`[data-task-id="${esc}"],[data-task="${esc}"],#task-${esc}`);
 return direct?.closest?.('.l8-task-card,.l7-module,.task-card,.card')||direct||null;
}

// Aufgabenseiten: nur die zuletzt bearbeitete Aufgabe merken. Das Scrollen
// innerhalb einer Aufgabe gehört ausschließlich SPTaskAutoScroll.
if(taskId){
 remember();
 window.addEventListener('pagehide',remember);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)remember()});
 window.SPTaskPositionStandard={version:'2.0',remember,scrollOverview:()=>false,scrollTask:()=>false,run:remember,lesson,theme,taskId};
 return;
}

// Themenübersicht: genau einmal zur zuletzt bearbeiteten Aufgabe springen.
let done=false,observer=null;
function scrollOverview(){
 if(done)return true;
 const last=readLast();if(!last)return false;
 const node=taskCardById(last.taskId);if(!node||!visible(node))return false;
 try{
  node.scrollIntoView({behavior:'auto',block:'center'});
  done=true;
  try{observer?.disconnect()}catch(e){}
  return true;
 }catch(e){return false}
}
function retry(ms){setTimeout(()=>{if(!done)scrollOverview()},ms)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scrollOverview,{once:true});else scrollOverview();
[80,250,600].forEach(retry);
try{
 observer=new MutationObserver(()=>{if(!done)scrollOverview()});
 observer.observe(document.documentElement,{childList:true,subtree:true});
 setTimeout(()=>{try{observer?.disconnect()}catch(e){}},1500);
}catch(e){}
window.SPTaskPositionStandard={version:'2.0',remember,scrollOverview,scrollTask:()=>false,run:scrollOverview,lesson,theme,taskId};
})();
