(function(){
'use strict';
if(window.__SP_VERB_REGROUP_RECOVERY_V3)return;
window.__SP_VERB_REGROUP_RECOVERY_V3=true;
const E=window.VerbGroupsEngine;
if(!E)return;

const originalTotalPoints=E.totalPoints.bind(E);
const originalStartNextRun=typeof E.startNextRun==='function'?E.startNextRun.bind(E):null;
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');
const clone=v=>{try{return JSON.parse(JSON.stringify(v))}catch{return null}};

function profile(){
 if(window.VerbGroupsProfile&&typeof window.VerbGroupsProfile==='object')return window.VerbGroupsProfile;
 for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE']){
  try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')return value}catch{}
 }
 return{};
}
function userSlug(){const p=profile();return[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function stateKey(){return`SP_VERB_GROUPS_PROGRESS_${userSlug()}`}
function floorKey(){return`SP_VERB_POINTS_FLOOR_${userSlug()}`}
function backupKey(){return`SP_VERB_PROGRESS_EVIDENCE_V3_${userSlug()}`}
function readJSON(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function readState(){return readJSON(stateKey())}
function runPoints(run){return Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0)}
function groupPoints(gs){return Math.max(0,Number(gs?.legacyPoints)||0)+Object.values(gs?.runs||{}).reduce((sum,run)=>sum+runPoints(run),0)}
function localHistoricalPoints(state=readState()){return Object.values(state?.groups||{}).reduce((sum,gs)=>sum+groupPoints(gs),0)}
function pointFloor(){return Math.max(0,Number(localStorage.getItem(floorKey())||0)||0)}
function preserveFloor(value){const next=Math.max(pointFloor(),Math.max(0,Number(value)||0));try{localStorage.setItem(floorKey(),String(next))}catch{}return next}

const bootState=clone(readState());
try{if(bootState?.groups&&!localStorage.getItem(backupKey()))localStorage.setItem(backupKey(),JSON.stringify(bootState))}catch{}

function emptyHistory(){return{runs:{},maxRunByVerb:{}}}
function addDone(history,runId,task,verbs){
 const r=String(Math.max(1,Math.min(3,Number(runId)||1)));
 const map=history.runs[r]||(history.runs[r]={});
 const set=map[task]||(map[task]=new Set());
 for(const verb of verbs||[]){const key=clean(verb);if(!key)continue;set.add(key);history.maxRunByVerb[key]=Math.max(Number(history.maxRunByVerb[key]||0),Number(r))}
}
function historyFromState(state,history=emptyHistory()){
 for(const gs of Object.values(state?.groups||{})){
  for(const [runId,run] of Object.entries(gs?.runs||{})){
   for(const [task,st] of Object.entries(run?.tasks||{})){
    const done=st?.done||[],total=Math.max(0,Number(st?.total)||0),awarded=Number(run?.awards?.tasks?.[task]||0)>0;
    if(done.length&&total&&done.length>=total&&!awarded&&!st?.recoveredByVerb)continue;
    addDone(history,runId,task,done)
   }
  }
 }
 return history
}
function historyFromMetadata(meta,history=emptyHistory()){
 const current=new Set((E.GROUPS||[]).map(g=>String(g.signature||'')));
 for(const group of Object.values(meta||{})){
  if(!current.has(String(group?.signature||'')))continue;
  for(const [runId,run] of Object.entries(group?.runs||{})){
   for(const [task,st] of Object.entries(run?.tasks||{}))addDone(history,runId,task,st?.done||[])
  }
 }
 return history
}
function combineHistories(...items){
 const out=emptyHistory();
 for(const h of items){
  if(!h)continue;
  for(const [runId,tasks] of Object.entries(h.runs||{}))for(const [task,set] of Object.entries(tasks||{}))addDone(out,runId,task,[...set]);
 }
 return out
}
function blankTask(total){return{total,done:[],queue:[],current:null,tries:0,hadWrong:false,recoveredByVerb:false}}
function blankRun(total){const tasks={};for(const task of E.LEARN||[])tasks[task]=blankTask(total);return{tasks,exam:{bestPercent:0,stars:0,session:null},awards:{tasks:{},examPoints:0,examPercent:0},completed:false}}
function ensureRun(gs,runId,total){const key=String(runId);if(!gs.runs)gs.runs={};if(!gs.runs[key])gs.runs[key]=blankRun(total);const run=gs.runs[key];run.tasks=run.tasks||{};for(const task of E.LEARN||[])if(!run.tasks[task])run.tasks[task]=blankTask(total);run.exam={bestPercent:0,stars:0,session:null,...(run.exam||{})};run.awards={tasks:{},examPoints:0,examPercent:0,...(run.awards||{})};run.awards.tasks=run.awards.tasks||{};return run}
function restoreHistory(history){
 if(!history||E.isPreview?.())return 0;
 let changed=0;
 for(const group of E.GROUPS||[]){
  const gs=E.groupState(group.id);if(!gs)continue;
  const groupKeys=new Map(group.verbs.map(v=>[clean(v),v]));
  let desiredRun=1;
  if(group.verbs.length){const runs=group.verbs.map(v=>Math.max(1,Number(history.maxRunByVerb[clean(v)]||1)));desiredRun=Math.max(1,Math.min(3,Math.min(...runs)))}
  gs.currentRun=Math.max(Number(gs.currentRun)||1,desiredRun);
  for(let runId=1;runId<=3;runId++){
   const source=history.runs[String(runId)];if(!source)continue;
   const run=ensureRun(gs,runId,group.verbs.length);
   let runChanged=false;
   for(const task of E.LEARN||[]){
    const evidence=source[task];if(!evidence)continue;
    const st=run.tasks[task],before=new Set((st.done||[]).map(clean)),merged=[];
    for(const verb of group.verbs){const key=clean(verb);if(before.has(key)||evidence.has(key))merged.push(groupKeys.get(key)||verb)}
    if(merged.length>(st.done||[]).length){st.done=merged;st.recoveredByVerb=true;runChanged=true;changed++}
    st.total=group.verbs.length;
    st.queue=[...new Set((st.queue||[]).filter(v=>group.verbs.includes(v)&&!st.done.includes(v)))];
    if(st.current&&st.done.includes(st.current))st.current=null;
   }
   if(runChanged)run.completed=(E.LEARN||[]).every(task=>(run.tasks?.[task]?.done||[]).length>=group.verbs.length)&&Number(run.exam?.bestPercent||0)>=100
  }
 }
 if(changed){E.save();window.SP_VERB_PROGRESS_RESTORED_BY_VERB=changed}
 return changed
}

function historicalOrder(active){return Array.isArray(active)?active.slice():[]}
function restoreDone(history){return restoreHistory(history)}
E.totalPoints=function(){return Math.max(originalTotalPoints(),pointFloor())};

if(originalStartNextRun){
 E.startNextRun=function(groupId){
  const gs=E.groupState(groupId);if(!gs)return false;
  const nextId=String((Number(gs.currentRun)||1)+1),saved=clone(gs.runs?.[nextId]);
  const ok=originalStartNextRun(groupId);
  if(ok&&saved){
   const now=E.groupState(groupId),target=now?.runs?.[nextId],group=E.GROUPS[groupId-1];
   if(target&&group){
    for(const task of E.LEARN||[]){
     const old=saved?.tasks?.[task],st=target?.tasks?.[task];if(!old||!st)continue;
     const evidence=new Set((old.done||[]).map(clean));
     st.done=group.verbs.filter(v=>evidence.has(clean(v)));
     st.recoveredByVerb=!!old.recoveredByVerb||st.done.length>0;
     st.queue=[];st.current=null;st.total=group.verbs.length
    }
    E.save()
   }
  }
  return ok
 }
}

function cloudModulePoints(module){let total=0;for(const topic of Object.values(module||{})){if(topic&&typeof topic==='object'&&!Array.isArray(topic))total+=Math.max(0,Number(topic?.lifetime?.points)||0)}return total}
async function refreshCloudFloor(){
 try{
  if(!window.SPProgress)await import('/js/progress.js?v=verb-regroup-recovery3');
  const progress=await window.SPProgress?.loadCurrentStudentProgress?.();
  preserveFloor(cloudModulePoints(progress?.verben||progress?.Verben||{}));
  return progress||{}
 }catch(error){console.warn('Verben-Punkteuntergrenze konnte nicht aus der Cloud gelesen werden',error);return{}}
}
async function restoreAvailableProgress(){
 const progress=await refreshCloudFloor();
 const localHistory=historyFromState(readState(),historyFromState(readJSON(backupKey()),historyFromState(bootState)));
 const cloudHistory=historyFromMetadata(progress?.metadata?.verbenGroups||{});
 const restored=restoreHistory(combineHistories(localHistory,cloudHistory));
 preserveFloor(localHistoricalPoints());
 return restored
}
const persistence=window.SPVerbProgressPersistence;
if(persistence?.restoreCloud&&!persistence.__regroupRecoveryWrappedV3){
 persistence.__regroupRecoveryWrappedV3=true;
 const originalRestore=persistence.restoreCloud.bind(persistence);
 persistence.restoreCloud=async function(){const result=await originalRestore();const restoredByVerb=await restoreAvailableProgress();return{...(result||{}),restoredByVerb}}
}
preserveFloor(localHistoricalPoints(bootState));
window.SPVerbRegroupRecovery={historicalOrder,restoreDone,restoreHistory,restoreAvailableProgress,pointFloor,preserveFloor,refreshCloudFloor};
})();