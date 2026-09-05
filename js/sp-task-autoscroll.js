(function(){
'use strict';
if(window.SPTaskAutoScroll)return;
let timer=null;

function visible(node){
 if(!node)return false;
 const r=node.getBoundingClientRect();
 const s=getComputedStyle(node);
 return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
}
function target(){
 const direct=[
  '.l8-card-stage','.l8-exercise','.l8-finish',
  '.l7-card-stage','.l7-exercise','.l7-finish',
  '[data-sp-task-active]','.exercise-card','.task-exercise'
 ];
 for(const sel of direct){const n=[...document.querySelectorAll(sel)].find(visible);if(n)return n}
 const area=document.getElementById('taskArea')||document.querySelector('.task-area,[data-task-area]');
 if(area&&visible(area))return area.closest('.l8-card,.l7-card,.card,.exercise-card')||area;
 const candidates=[...document.querySelectorAll('main .card, main section.card, main .task-card')].filter(n=>visible(n)&&!n.matches('.progress-card,.l8-task-head,.l7-task-head,.l8-progress-card,.l7-progress-card'));
 return candidates[0]||null;
}
function headerOffset(){
 const h=[document.querySelector('.sp-header'),document.querySelector('header.topbar'),document.querySelector('.topbar'),document.querySelector('.l7-topbar')].find(visible);
 if(!h)return 12;
 return Math.min(170,Math.max(12,Math.round(h.getBoundingClientRect().height)+12));
}
function go(behavior='smooth'){
 const n=target();if(!n)return false;
 try{
  const top=Math.max(0,window.scrollY+n.getBoundingClientRect().top-headerOffset());
  window.scrollTo({top,left:0,behavior});
  return true;
 }catch(e){try{n.scrollIntoView({behavior,block:'start'});return true}catch(_){return false}}
}
function schedule(delay=70,behavior='smooth'){
 clearTimeout(timer);
 timer=setTimeout(()=>{requestAnimationFrame(()=>go(behavior))},delay);
}

const root=document.getElementById('app')||document.querySelector('main')||document.body;
if(root){
 const observer=new MutationObserver(()=>schedule(85,'smooth'));
 observer.observe(root,{childList:true,subtree:true,characterData:true});
}

document.addEventListener('click',e=>{
 const el=e.target?.closest?.('button,a,.l8-option,.l7-option,[data-value],[data-answer],[data-next]');
 if(!el)return;
 schedule(120,'smooth');
 setTimeout(()=>schedule(80,'smooth'),420);
},true);
document.addEventListener('submit',()=>{schedule(120,'smooth');setTimeout(()=>schedule(80,'smooth'),420)},true);
document.addEventListener('keydown',e=>{if(e.key==='Enter'){schedule(120,'smooth');setTimeout(()=>schedule(80,'smooth'),420)}},true);
window.addEventListener('load',()=>{schedule(40,'auto');setTimeout(()=>schedule(40,'auto'),250)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{schedule(30,'auto');setTimeout(()=>schedule(30,'auto'),180)});else{schedule(20,'auto');setTimeout(()=>schedule(20,'auto'),180)}

window.SPTaskAutoScroll={version:'1.0',scroll:()=>go('smooth'),scrollNow:()=>go('auto'),schedule};
})();
