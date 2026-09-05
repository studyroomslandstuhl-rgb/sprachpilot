(function(){
'use strict';
if(window.SPTaskPositionStandard)return;
const match=String(location.pathname||'').match(/\/wortschatz\/A\d-Lektion-(\d+)\/Thema-(\d+)\//i);
if(!match)return;
const lesson=Number(match[1]),theme=Number(match[2]);
const qs=new URLSearchParams(location.search),taskId=String(qs.get('task')||'').trim();
let timer=null,lastTarget=null;

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
function headerOffset(){const h=[document.querySelector('.sp-header'),document.querySelector('header.topbar'),document.querySelector('.topbar'),document.querySelector('.l7-topbar')].find(visible);return h?Math.min(170,Math.max(12,Math.round(h.getBoundingClientRect().height)+12)):12}
function scrollNode(node,behavior='smooth',block='center'){
 if(!node||!visible(node))return false;
 try{
  if(block==='center'){node.scrollIntoView({behavior,block:'center'});return true}
  const top=Math.max(0,window.scrollY+node.getBoundingClientRect().top-headerOffset());window.scrollTo({top,left:0,behavior});return true;
 }catch(e){try{node.scrollIntoView({behavior,block});return true}catch(_){return false}}
}
function taskCardById(id){
 if(!id)return null;
 const links=[...document.querySelectorAll('a[href]')];
 const a=links.find(link=>{try{return String(new URL(link.getAttribute('href')||'',location.href).searchParams.get('task')||'')===String(id)}catch(e){return false}});
 if(a)return a.closest('.l8-task-card,.l7-module,.task-card,.card,[data-task-id],[data-task]')||a;
 const esc=window.CSS?.escape?CSS.escape(String(id)):String(id).replace(/[^a-zA-Z0-9_-]/g,'');
 const direct=document.querySelector(`[data-task-id="${esc}"],[data-task="${esc}"],#task-${esc}`);
 return direct?.closest?.('.l8-task-card,.l7-module,.task-card,.card')||direct||null;
}
function scrollOverview(force=false){
 if(taskId)return false;const last=readLast();if(!last)return false;
 const node=taskCardById(last.taskId);if(!node)return false;
 if(!force&&lastTarget===node)return true;lastTarget=node;return scrollNode(node,force?'auto':'smooth','center');
}
function activeTaskTarget(){
 const selectors=['[data-sp-task-active]','#taskArea .l8-prompt','#taskArea .l7-prompt','#taskArea','.l8-card-stage','.l8-exercise','.l7-card-stage','.l7-exercise','.exercise-card','.task-exercise'];
 for(const sel of selectors){const node=[...document.querySelectorAll(sel)].find(visible);if(node)return node.closest?.('.l8-card-stage,.l8-exercise,.l7-card-stage,.l7-exercise,.exercise-card,.task-exercise')||node}
 return null;
}
function scrollTask(force=false){if(!taskId)return false;const node=activeTaskTarget();if(!node)return false;return scrollNode(node,force?'auto':'smooth','start')}
function installTaskAutoScroll(){
 if(!taskId)return;
 if(window.SPTaskAutoScroll){setTimeout(()=>window.SPTaskAutoScroll.scrollNow?.(),0);return}
 import('/js/sp-task-autoscroll.js?v=20260905-position2').then(()=>setTimeout(()=>window.SPTaskAutoScroll?.scrollNow?.(),0)).catch(()=>scrollTask(true));
}
function run(force=false){if(taskId){remember();installTaskAutoScroll();scrollTask(force)}else scrollOverview(force)}
function schedule(delay=80){clearTimeout(timer);timer=setTimeout(()=>run(false),delay)}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>run(true),{once:true});else run(true);
window.addEventListener('load',()=>{setTimeout(()=>run(true),60);setTimeout(()=>run(false),280)});
[120,350,800,1500,3000].forEach(ms=>setTimeout(()=>run(ms<400),ms));
try{new MutationObserver(()=>schedule(70)).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
window.addEventListener('pagehide',remember);document.addEventListener('visibilitychange',()=>{if(document.hidden)remember();else schedule(30)});
window.SPTaskPositionStandard={version:'1.0',remember,scrollOverview,scrollTask,run,lesson,theme,taskId};
})();
