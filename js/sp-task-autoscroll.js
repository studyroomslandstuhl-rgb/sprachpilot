(function(){
'use strict';
if(window.SPTaskAutoScroll)return;
let timer=null;
let suppressUntil=0;
let booted=false;

function visible(node){
 if(!node)return false;
 const r=node.getBoundingClientRect();
 const s=getComputedStyle(node);
 return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;
}
function target(){
 const direct=['.l8-card-stage','.l8-exercise','.l8-finish','.l7-card-stage','.l7-exercise','.l7-finish','[data-sp-task-active]','.exercise-card','.task-exercise'];
 for(const sel of direct){const n=[...document.querySelectorAll(sel)].find(visible);if(n)return n}
 const area=document.getElementById('taskArea')||document.querySelector('.task-area,[data-task-area]');
 if(area&&visible(area))return area.closest('.l8-card,.l7-card,.card,.exercise-card')||area;
 return null;
}
function headerOffset(){
 const h=[document.querySelector('.sp-header'),document.querySelector('header.topbar'),document.querySelector('.topbar'),document.querySelector('.l7-topbar')].find(visible);
 if(!h)return 12;
 return Math.min(170,Math.max(12,Math.round(h.getBoundingClientRect().height)+12));
}
function markUserScroll(){
 suppressUntil=Date.now()+1800;
 clearTimeout(timer);
 timer=null;
}
['touchstart','touchmove','wheel','pointerdown'].forEach(type=>window.addEventListener(type,markUserScroll,{passive:true,capture:true}));
function go(behavior='auto',force=false){
 if(!force&&Date.now()<suppressUntil)return false;
 const n=target();if(!n)return false;
 try{
  const top=Math.max(0,window.scrollY+n.getBoundingClientRect().top-headerOffset());
  if(Math.abs(window.scrollY-top)<16)return true;
  window.scrollTo({top,left:0,behavior});
  return true;
 }catch(e){return false}
}
function schedule(delay=50,behavior='auto',force=false){
 clearTimeout(timer);
 timer=setTimeout(()=>{
  timer=null;
  requestAnimationFrame(()=>go(behavior,force));
 },Math.max(0,delay));
}
function boot(){
 if(booted)return;
 booted=true;
 schedule(100,'auto',false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

window.SPTaskAutoScroll={
 version:'3.0',
 scroll:()=>go('auto',false),
 scrollNow:()=>go('auto',true),
 schedule:(delay=40,behavior='auto')=>schedule(delay,behavior,false),
 cancel:()=>{clearTimeout(timer);timer=null;suppressUntil=Date.now()+1800}
};
})();
