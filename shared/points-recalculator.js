(function(){
'use strict';
if(window.SPPointRecalculator)return;
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const TECH=new Set(['state','progress','totals','metadata','profile','updatedAt','lastActive','lastPage','known','learned','unknown','unsure','activeVerbs','learnedVerbs']);
const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
const positive=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const clean=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const taskPoints=run=>Number(run)===1?5:Number(run)===2?10:Number(run)===3?15:0;
const examMax=run=>Number(run)===1?100:Number(run)===2?200:Number(run)===3?300:0;
const examEarned=(run,pct)=>Math.round(examMax(run)*clamp(pct)/100);
function isTopic(k,v){return !TECH.has(k)&&!!(v&&typeof v==='object'&&!Array.isArray(v)&&(v.lifetime||v.tasks||v.exam||v.current||v.progressPercent!=null||v.title||v.moduleTitle));}
function topicSig(module,key,t={}){
 if(t.technicalRecovery)return module+'|tech|'+clean(key);
 if(t.topicId||t.themeId)return module+'|id|'+clean(t.topicId||t.themeId);
 const lesson=clean(t.lesson||t.lektion),theme=clean(t.theme||t.thema),level=clean(t.level);
 if(lesson||theme)return [module,level,lesson,theme].join('|');
 return module+'|key|'+clean(key);
}
function taskStateMap(topic={}){
 const map=new Map();
 const ensure=raw=>{const id=clean(raw)||String(raw||'task');if(!map.has(id))map.set(id,{id,runs:new Set(),completed:false});return map.get(id)};
 for(const[raw,runs]of Object.entries(topic?.lifetime?.taskPointRuns||{})){
  const item=ensure(raw);for(const run of [1,2,3])if(positive(runs?.[String(run)]??runs?.[run]))item.runs.add(run);
 }
 for(const[raw,task]of Object.entries(topic.tasks||{})){
  const item=ensure(raw);for(const run of [1,2,3])if(positive(task?.pointsByRun?.[String(run)]??task?.pointsByRun?.[run]))item.runs.add(run);
  const pct=clamp(task?.percent??task?.progress??0);if(task?.completed===true||pct>=100)item.completed=true;
 }
 return map;
}
function topicPoints(topic={}){
 if(topic?.technicalRecovery)return {points:0,taskPoints:0,examPoints:0,tasks:0,exams:0,technical:true};
 const taskMap=taskStateMap(topic);let tasks=0,taskTotal=0;
 for(const item of taskMap.values()){
  if(item.runs.size){for(const run of item.runs){taskTotal+=taskPoints(run);tasks++;}}
  else if(item.completed){taskTotal+=taskPoints(1);tasks++;}
 }
 if(!taskMap.size&&positive(topic.completedTasks||topic.current?.completedTasks)){
  const n=Math.max(0,Math.round(positive(topic.completedTasks||topic.current?.completedTasks)));taskTotal+=n*taskPoints(1);tasks+=n;
 }
 const examRuns=topic?.lifetime?.examPointRuns||{};let examTotal=0,exams=0,hasExamRun=false;
 for(const run of [1,2,3]){
  const raw=positive(examRuns?.[String(run)]??examRuns?.[run]);if(!raw)continue;hasExamRun=true;examTotal+=Math.min(examMax(run),raw);exams++;
 }
 if(!hasExamRun){const exam=topic.exam||{},pct=clamp(exam.bestPercent??exam.percent??exam.lastPercent??0);if(exam.attempted===true||exam.completed===true||pct>0){examTotal+=examEarned(1,pct||(exam.completed?100:0));exams++;}}
 return {points:taskTotal+examTotal,taskPoints:taskTotal,examPoints:examTotal,tasks,exams,technical:false};
}
function groupPoints(group={}){
 let total=0,taskTotal=0,examTotal=0,tasks=0,exams=0;
 for(const[runId,run]of Object.entries(group.runs||{})){
  const r=Math.max(1,Math.min(3,Number(runId)||1));
  for(const[taskKey,task]of Object.entries(run.tasks||{})){
   const done=Array.isArray(task?.done)?task.done.length:Number(task?.done||0),target=Number(task?.total||0),awarded=positive(run?.awards?.tasks?.[taskKey]);
   if(task?.completed===true||(target>0&&done>=target)||awarded>0){taskTotal+=taskPoints(r);tasks++;}
  }
  const pct=clamp(run?.exam?.bestPercent??run?.exam?.percent??0),award=positive(run?.awards?.examPoints);
  if(pct>0||award>0){examTotal+=pct>0?examEarned(r,pct):Math.min(examMax(r),award);exams++;}
 }
 total=taskTotal+examTotal;return {points:total,taskPoints:taskTotal,examPoints:examTotal,tasks,exams};
}
function moduleAudit(progress,module){
 const topics=new Map();
 for(const[key,t]of Object.entries(progress?.[module]||{})){
  if(!isTopic(key,t)||t?.technicalRecovery)continue;
  const sig=topicSig(module,key,t),audit=topicPoints(t),old=topics.get(sig);
  if(!old||audit.points>old.points)topics.set(sig,{...audit,key,sig,title:t.title||key});
 }
 return topics;
}
function metadataFallback(progress,module,topics){
 const key=module==='verben'?'verbenGroups':module==='perfekt'?'perfektGroups':'';if(!key)return 0;
 let extra=0;for(const[id,group]of Object.entries(progress?.metadata?.[key]||{})){
  const sig=module+'|id|'+clean(module+'-gruppe-'+String(Number(id)||id).padStart(2,'0'));
  if(topics.has(sig)&&topics.get(sig).points>0)continue;
  extra+=groupPoints(group).points;
 }
 return extra;
}
function finnishPoints(progress={}){
 let total=0;for(const group of Object.values(progress?.finnischVerben?.groups||{}))total+=groupPoints(group).points;return total;
}
function calculate(progress={}){
 const breakdown={},topicDetails={};let total=0;
 for(const module of MODULES){const topics=moduleAudit(progress,module);const topicTotal=[...topics.values()].reduce((sum,x)=>sum+x.points,0);const fallback=metadataFallback(progress,module,topics);breakdown[module]=topicTotal+fallback;topicDetails[module]=[...topics.values()];total+=breakdown[module];}
 const finnisch=finnishPoints(progress);if(finnisch){breakdown.finnischVerben=finnisch;total+=finnisch;}
 return {total,breakdown,topics:topicDetails,version:1};
}
function stored(progress={}){return Math.max(positive(progress?.ranking?.points),positive(progress?.totals?.points),positive(progress?.pointsTotal),positive(progress?.lifetimePoints),positive(progress?.punkteGesamt),positive(progress?.points));}
function audit(progress={}){const exact=calculate(progress);return {...exact,stored:stored(progress),difference:exact.total-stored(progress),inflatedBy:Math.max(0,stored(progress)-exact.total)};}
window.SPPointRecalculator={calculate,audit,topicPoints,groupPoints,taskPoints,examMax,examEarned,version:1};
})();
