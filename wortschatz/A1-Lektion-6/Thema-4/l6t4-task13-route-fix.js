(function(){
'use strict';
const TARGET='dialoge.html?v=20260810-progress-repair1';
const FILE='task-dialog-abc';
const CURRENT_KEY='SP_L6_T4_V2_'+FILE;
const LEGACY_KEYS=[
 CURRENT_KEY,
 'SP_L6_T4_V2_dialoge.html',
 'SP_L6_T4_V2_dialoge.html?v=l6t4-dialoge4',
 'SP_L6_T4_V2_dialoge.html?v=202607301410',
 'SP_L6_T4_V2_task.html?task=dialog-abc',
 'SP_L6_T4_V2_task.html?task=dialog-abc&number=13'
];
let running=false;
let repairedOnce=false;

function readState(key){
 try{
  const value=JSON.parse(localStorage.getItem(key)||'null');
  if(!value||typeof value!=='object')return null;
  const total=Math.max(0,Number(value.total)||0);
  const done=Array.isArray(value.done)?[...new Set(value.done.map(Number).filter(Number.isFinite))]:[];
  if(!total)return null;
  return {...value,total,done};
 }catch(e){return null}
}
function percent(state){
 if(!state?.total)return 0;
 return Math.max(0,Math.min(100,Math.round((state.done?.length||0)/state.total*100)));
}
function normalizeFive(state){
 if(!state)return null;
 const done=[...new Set((state.done||[]).map(Number).filter(i=>i>=0&&i<5))];
 if(percent(state)>=100)while(done.length<5)done.push(done.length);
 const current=Number.isInteger(Number(state.current))&&!done.includes(Number(state.current))?Number(state.current):null;
 const queue=[...new Set((Array.isArray(state.queue)?state.queue:[]).map(Number).filter(i=>i>=0&&i<5&&!done.includes(i)&&i!==current))];
 return {...state,total:5,done,queue,current,tries:Number(state.tries)||0,hadWrong:!!state.hadWrong};
}
function strongestState(){
 let best=null,bestPercent=-1;
 LEGACY_KEYS.forEach(key=>{
  const state=readState(key);
  const pct=percent(state);
  if(state&&pct>bestPercent){best=state;bestPercent=pct}
 });
 return normalizeFive(best);
}
function repairLocalState(){
 const best=strongestState();
 if(!best)return null;
 const current=normalizeFive(readState(CURRENT_KEY));
 if(!current||percent(best)>percent(current))localStorage.setItem(CURRENT_KEY,JSON.stringify(best));
 return percent(best)>percent(current)?best:(current||best);
}
function repairScoreAndCloud(state){
 if(!state||percent(state)<=0)return;
 try{
  if(window.L6T4ThemeScoreV3?.recordTask){
   window.L6T4ThemeScoreV3.recordTask(FILE,state);
   return;
  }
 }catch(e){}
 const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:'wortschatz-a1-lektion-6-thema-4',title:'A1 Lektion 6 · Thema 4',file:FILE,taskKey:FILE,taskTitle:'Dialoge',percent:percent(state),done:state.done.length,total:5,completed:percent(state)>=100};
 const api=window.SPProgress?.recordTaskProgress;
 if(api){Promise.resolve(api(payload)).catch(()=>{});return}
 window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];
 window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload});
}
function repair(){
 if(repairedOnce)return;
 repairedOnce=true;
 const before=normalizeFive(readState(CURRENT_KEY));
 const state=repairLocalState();
 if(!state)return;
 repairScoreAndCloud(state);
 if(percent(state)!==percent(before)&&typeof window.l6t4RenderMenu==='function'){
  try{window.l6t4RenderMenu()}catch(e){}
 }
}
function fix(){
 if(running)return;
 running=true;
 try{
  repair();
  document.querySelectorAll('#taskGrid a').forEach(link=>{
   const text=(link.textContent||'').toLowerCase();
   const href=link.getAttribute('href')||'';
   if(text.includes('13.')||href.includes('dialoge.html')||href.includes('dialog-abc')){
    if(href!==TARGET)link.setAttribute('href',TARGET);
   }
  });
 }finally{
  running=false;
 }
}
fix();
const grid=document.getElementById('taskGrid');
if(grid)new MutationObserver(fix).observe(grid,{childList:true,subtree:true});
})();