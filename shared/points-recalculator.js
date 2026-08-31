(function(){
'use strict';
if(window.SPPointRecalculator?.version>=3)return;
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
function legacyRunState(topic={}){
 const lifetime=topic.lifetime||{};
 const finished=Math.max(0,Math.min(3,Math.round(Number(lifetime.finishedRuns)||0)));
 const resets=Math.max(0,Math.min(2,Math.round(Number(lifetime.resets)||0)));
 const previous=Math.max(finished,resets);
 const current=previous>=3?3:previous+1;
 return{previous,current,hasLegacyMarkers:finished>0||resets>0};
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
 const legacy=legacyRunState(topic),taskMap=taskStateMap(topic);let tasks=0,taskTotal=0,legacyTaskRuns=0;
 for(const item of taskMap.values()){
  const counted=new Set(item.runs);
  if(legacy.hasLegacyMarkers){
   for(let run=1;run<=legacy.previous&&run<=3;run++)if(!counted.has(run)){counted.add(run);legacyTaskRuns++}
   if(item.completed&&legacy.current<=3&&!counted.has(legacy.current)){counted.add(legacy.current);legacyTaskRuns++}
  }
  if(counted.size){for(const run of counted){taskTotal+=taskPoints(run);tasks++}}
  else if(item.completed){taskTotal+=taskPoints(1);tasks++}
 }
 if(!taskMap.size){
  const totalTasks=Math.max(0,Math.round(positive(topic.totalTasks||topic.current?.totalTasks)));
  const completedNow=Math.max(0,Math.round(positive(topic.completedTasks||topic.current?.completedTasks)));
  if(legacy.hasLegacyMarkers&&totalTasks>0){
   for(let run=1;run<=legacy.previous&&run<=3;run++){taskTotal+=totalTasks*taskPoints(run);tasks+=totalTasks;legacyTaskRuns+=totalTasks}
   if(legacy.current<=3&&completedNow>0){taskTotal+=completedNow*taskPoints(legacy.current);tasks+=completedNow;legacyTaskRuns+=completedNow}
  }else if(completedNow>0){taskTotal+=completedNow*taskPoints(1);tasks+=completedNow}
 }
 const examRuns=topic?.lifetime?.examPointRuns||{};let examTotal=0,exams=0,hasExamRun=false;
 for(const run of [1,2,3]){
  const raw=positive(examRuns?.[String(run)]??examRuns?.[run]);if(!raw)continue;hasExamRun=true;examTotal+=Math.min(examMax(run),raw);exams++;
 }
 if(!hasExamRun){
  const exam=topic.exam||{},pct=clamp(exam.bestPercent??exam.percent??exam.lastPercent??0);
  if(exam.attempted===true||exam.completed===true||pct>0){
   const run=legacy.hasLegacyMarkers?legacy.current:1;
   examTotal+=examEarned(run,pct||(exam.completed?100:0));exams++;
  }
 }
 return {points:taskTotal+examTotal,taskPoints:taskTotal,examPoints:examTotal,tasks,exams,technical:false,legacyTaskRuns};
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
function levelOf(key,record={}){
 const direct=String(record.level||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0];if(direct)return direct;
 const raw=String(record.signature||key||'').toUpperCase();return raw.match(/(?:^|[^A-Z0-9])(A1|A2|B1|B2|C1)(?:[^A-Z0-9]|$)/)?.[1]||clean(key)||'unknown';
}
function dativverbenPoints(progress={}){
 const byLevel=new Map();
 for(const[key,topic]of Object.entries(progress?.dativverben||{})){
  if(!topic||typeof topic!=='object'||Array.isArray(topic)||!(topic.tasks||topic.lifetime||topic.exam||topic.current||topic.progressPercent!=null))continue;
  const points=positive(topicPoints(topic).points),level=levelOf(key,topic);byLevel.set(level,Math.max(byLevel.get(level)||0,points));
 }
 for(const[key,group]of Object.entries(progress?.metadata?.dativverbenGroups||{})){
  if(!group||typeof group!=='object')continue;const points=positive(groupPoints(group).points),level=levelOf(key,group);byLevel.set(level,Math.max(byLevel.get(level)||0,points));
 }
 return [...byLevel.values()].reduce((sum,value)=>sum+positive(value),0);
}
function finnishPoints(progress={}){let total=0;for(const group of Object.values(progress?.finnischVerben?.groups||{}))total+=groupPoints(group).points;return total;}
function calculate(progress={}){
 const breakdown={},topicDetails={};let total=0;
 for(const module of MODULES){const topics=moduleAudit(progress,module);const topicTotal=[...topics.values()].reduce((sum,x)=>sum+x.points,0);const fallback=metadataFallback(progress,module,topics);breakdown[module]=topicTotal+fallback;topicDetails[module]=[...topics.values()];total+=breakdown[module];}
 const dativ=dativverbenPoints(progress);breakdown.dativverben=dativ;topicDetails.dativverben=Object.entries(progress?.dativverben||{}).filter(([,topic])=>topic&&typeof topic==='object');total+=dativ;
 const finnisch=finnishPoints(progress);if(finnisch){breakdown.finnischVerben=finnisch;total+=finnisch;}
 return {total,breakdown,topics:topicDetails,version:3};
}
function stored(progress={}){return Math.max(positive(progress?.ranking?.points),positive(progress?.totals?.points),positive(progress?.pointsTotal),positive(progress?.lifetimePoints),positive(progress?.punkteGesamt),positive(progress?.points));}
function audit(progress={}){const exact=calculate(progress);return {...exact,stored:stored(progress),difference:exact.total-stored(progress),inflatedBy:Math.max(0,stored(progress)-exact.total)};}
window.SPPointRecalculator={calculate,audit,topicPoints,groupPoints,dativverbenPoints,taskPoints,examMax,examEarned,legacyRunState,builtinDativverben:true,version:3};
})();
