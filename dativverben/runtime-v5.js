(function(){
'use strict';
if(window.__SP_DATIV_RUNTIME_V5)return;
window.__SP_DATIV_RUNTIME_V5=true;

const REMOVED=new Set(['nachrennen','hinterherrennen']);
const data=window.SPDativLearningData;
if(!data)return;

data.ENTRIES=(data.ENTRIES||[]).filter(entry=>!REMOVED.has(String(entry?.verb||'').trim().toLowerCase()));
for(const verb of REMOVED){try{delete data.CONJ?.[verb]}catch{}}

const A2_ENTRIES=data.ENTRIES.filter(entry=>entry.level==='A2');
const A2_SIGNATURE=`v2|A2|${A2_ENTRIES.map(entry=>entry.verb).join('|')}`;
const A2_TOTAL=A2_ENTRIES.length;
const PREFIX='SP_DATIVVERBEN_V2_';

function baseKey(value){return String(value||'').split('#')[0]}
function removedUnit(value){
 const base=baseKey(value).toLowerCase();
 return base==='a2:nachrennen'||base==='a2:hinterherrennen';
}
function cleanTask(task,taskKey,runNo,awards){
 if(!task||typeof task!=='object')return task;
 const total=taskKey==='dativ-use'?A2_TOTAL*2:A2_TOTAL;
 task.done=[...new Set((Array.isArray(task.done)?task.done:[]).filter(key=>!removedUnit(key)))];
 task.queue=[];
 if(removedUnit(task.current))task.current=null;
 if(removedUnit(task.last))task.last=null;
 task.total=total;
 if(task.done.length>=total&&total>0){
   awards.tasks=awards.tasks||{};
   if(!Number(awards.tasks[taskKey]||0))awards.tasks[taskKey]=Math.max(1,Math.min(3,Number(runNo)||1))*5;
 }
 return task;
}
function cleanRun(run,runNo){
 if(!run||typeof run!=='object')return run;
 run.tasks=run.tasks||{};
 run.awards=run.awards||{tasks:{},examPoints:0};
 run.awards.tasks=run.awards.tasks||{};
 for(const [taskKey,task] of Object.entries(run.tasks))cleanTask(task,taskKey,runNo,run.awards);
 if(run.exam?.session?.items){
   const before=run.exam.session.items.length;
   run.exam.session.items=run.exam.session.items.filter(item=>!removedUnit(item?.key));
   if(run.exam.session.items.length!==before)run.exam.session=null;
 }
 return run;
}
function cleanGroup(group){
 if(!group||typeof group!=='object')return group;
 group.signature=A2_SIGNATURE;
 group.runs=group.runs||{};
 for(const [runNo,run] of Object.entries(group.runs))cleanRun(run,runNo);
 return group;
}
function mergeTask(target={},source={}){
 const out={...target,...source};
 out.done=[...new Set([...(target.done||[]),...(source.done||[])].filter(key=>!removedUnit(key)))];
 out.queue=[];
 out.current=source.current||target.current||null;
 if(removedUnit(out.current))out.current=null;
 out.last=source.last||target.last||null;
 if(removedUnit(out.last))out.last=null;
 out.total=Math.max(Number(target.total)||0,Number(source.total)||0);
 out.tries=Math.max(Number(target.tries)||0,Number(source.tries)||0);
 out.hadWrong=!!(target.hadWrong||source.hadWrong);
 return out;
}
function mergeRun(target={},source={},runNo){
 const out={...target,...source};
 out.tasks={...(target.tasks||{})};
 for(const [taskKey,task] of Object.entries(source.tasks||{}))out.tasks[taskKey]=mergeTask(out.tasks[taskKey]||{},task||{});
 const ta=target.awards||{},sa=source.awards||{};
 out.awards={...ta,...sa,tasks:{...(ta.tasks||{})}};
 for(const [key,value] of Object.entries(sa.tasks||{}))out.awards.tasks[key]=Math.max(Number(out.awards.tasks[key])||0,Number(value)||0);
 out.awards.examPoints=Math.max(Number(ta.examPoints)||0,Number(sa.examPoints)||0);
 const te=target.exam||{},se=source.exam||{};
 out.exam={...te,...se,bestPercent:Math.max(Number(te.bestPercent)||0,Number(se.bestPercent)||0),stars:Math.max(Number(te.stars)||0,Number(se.stars)||0),session:null};
 out.completed=!!(target.completed||source.completed);
 return cleanRun(out,runNo);
}
function mergeGroup(target,source){
 if(!target)return cleanGroup(source);
 if(!source)return cleanGroup(target);
 const out={...target,...source,signature:A2_SIGNATURE,currentRun:Math.max(Number(target.currentRun)||1,Number(source.currentRun)||1),runs:{...(target.runs||{})}};
 for(const [runNo,run] of Object.entries(source.runs||{}))out.runs[runNo]=mergeRun(out.runs[runNo]||{},run||{},runNo);
 return cleanGroup(out);
}

try{
 for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);
   if(!key||!key.startsWith(PREFIX))continue;
   let state=null;
   try{state=JSON.parse(localStorage.getItem(key)||'null')}catch{}
   if(!state?.groups)continue;
   let changed=false;
   for(const signature of Object.keys(state.groups)){
     if(!/^v2\|A2\|/i.test(signature))continue;
     if(!signature.toLowerCase().includes('nachrennen')&&!signature.toLowerCase().includes('hinterherrennen'))continue;
     const source=cleanGroup(state.groups[signature]);
     state.groups[A2_SIGNATURE]=mergeGroup(state.groups[A2_SIGNATURE],source);
     if(signature!==A2_SIGNATURE)delete state.groups[signature];
     changed=true;
   }
   if(changed)localStorage.setItem(key,JSON.stringify(state));
 }
}catch(error){console.warn('Dativverben-Migration konnte nicht vollständig ausgeführt werden',error)}
})();
