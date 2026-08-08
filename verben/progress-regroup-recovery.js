(function(){
'use strict';
if(window.__SP_VERB_REGROUP_RECOVERY_V1)return;
window.__SP_VERB_REGROUP_RECOVERY_V1=true;
const E=window.VerbGroupsEngine;
if(!E)return;

const originalLoad=E.load.bind(E);
const originalTotalPoints=E.totalPoints.bind(E);
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');

function profile(){
 if(window.VerbGroupsProfile&&typeof window.VerbGroupsProfile==='object')return window.VerbGroupsProfile;
 for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE']){
  try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')return value}catch{}
 }
 return{};
}
function userSlug(){
 const p=profile();
 return[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname]
  .filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
}
function stateKey(){return`SP_VERB_GROUPS_PROGRESS_${userSlug()}`}
function floorKey(){return`SP_VERB_POINTS_FLOOR_${userSlug()}`}
function readState(){try{return JSON.parse(localStorage.getItem(stateKey())||'null')}catch{return null}}
function runPoints(run){return Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0)}
function groupPoints(gs){return Math.max(0,Number(gs?.legacyPoints)||0)+Object.values(gs?.runs||{}).reduce((sum,run)=>sum+runPoints(run),0)}
function localHistoricalPoints(state=readState()){
 return Object.values(state?.groups||{}).reduce((sum,gs)=>sum+groupPoints(gs),0)
}
function pointFloor(){return Math.max(0,Number(localStorage.getItem(floorKey())||0)||0)}
function preserveFloor(value){
 const next=Math.max(pointFloor(),Math.max(0,Number(value)||0));
 try{localStorage.setItem(floorKey(),String(next))}catch{}
 return next
}

function historyFromState(state){
 const history={done:{},order:[]};
 const groups=Object.entries(state?.groups||{}).sort((a,b)=>(Number(a[0])||0)-(Number(b[0])||0));
 const orderSeen=new Set();
 for(const[,gs]of groups){
  const signature=String(gs?.signature||'');
  signature.split('|').map(v=>String(v||'').trim()).filter(Boolean).forEach(v=>{
   const key=clean(v);if(!orderSeen.has(key)){orderSeen.add(key);history.order.push(v)}
  });
  for(const[runId,run]of Object.entries(gs?.runs||{})){
   history.done[runId]=history.done[runId]||{};
   for(const[task,st]of Object.entries(run?.tasks||{})){
    const set=history.done[runId][task]||(history.done[runId][task]=new Set());
    (st?.done||[]).forEach(v=>set.add(clean(v)));
   }
  }
 }
 return history
}
function restoreDone(history){
 if(!history)return 0;
 let changed=0;
 for(const group of E.GROUPS||[]){
  const gs=E.groupState(group.id);if(!gs)continue;
  for(const[runId,taskMap]of Object.entries(history.done||{})){
   const run=gs.runs?.[String(runId)];if(!run)continue;
   for(const task of E.LEARN||[]){
    const learned=taskMap?.[task];
    const st=run.tasks?.[task];
    if(!learned||!st)continue;
    const before=new Set((st.done||[]).map(clean));
    const merged=[];
    for(const verb of group.verbs){
     const key=clean(verb);
     if(before.has(key)||learned.has(key))merged.push(verb)
    }
    if(merged.length!==(st.done||[]).length){st.done=merged;changed++}
    st.total=group.verbs.length;
    st.queue=(st.queue||[]).filter(v=>group.verbs.includes(v)&&!st.done.includes(v));
    if(st.current&&st.done.includes(st.current))st.current=null;
   }
  }
 }
 return changed
}

E.load=function(){
 const raw=readState();
 const history=historyFromState(raw);
 preserveFloor(localHistoricalPoints(raw));
 const result=originalLoad();
 const restored=restoreDone(history);
 if(restored)E.save();
 window.SP_VERB_REGROUP_LAST_RESTORED=restored;
 return result
};
E.totalPoints=function(){return Math.max(originalTotalPoints(),pointFloor())};

function historicalOrder(active){
 const list=Array.isArray(active)?active:[];
 const allowed=new Map(list.map(v=>[clean(v),v]));
 const out=[],seen=new Set();
 const history=historyFromState(readState());
 for(const old of history.order||[]){
  const key=clean(old),verb=allowed.get(key);
  if(verb&&!seen.has(key)){seen.add(key);out.push(verb)}
 }
 for(const verb of list){const key=clean(verb);if(!seen.has(key)){seen.add(key);out.push(verb)}}
 return out
}
function cloudModulePoints(module){
 let total=0;
 for(const topic of Object.values(module||{})){
  if(!topic||typeof topic!=='object'||Array.isArray(topic))continue;
  total+=Math.max(0,Number(topic?.lifetime?.points)||0);
 }
 return total
}
async function refreshCloudFloor(){
 try{
  if(!window.SPProgress)await import('/js/progress.js?v=verb-regroup-recovery1');
  const progress=await window.SPProgress?.loadCurrentStudentProgress?.();
  const module=progress?.verben||progress?.Verben||{};
  preserveFloor(cloudModulePoints(module));
 }catch(error){console.warn('Verben-Punkteuntergrenze konnte nicht aus der Cloud gelesen werden',error)}
}

const persistence=window.SPVerbProgressPersistence;
if(persistence?.restoreCloud&&!persistence.__regroupRecoveryWrapped){
 persistence.__regroupRecoveryWrapped=true;
 const originalRestore=persistence.restoreCloud.bind(persistence);
 persistence.restoreCloud=async function(){
  const result=await originalRestore();
  await refreshCloudFloor();
  preserveFloor(localHistoricalPoints());
  return result
 };
}

preserveFloor(localHistoricalPoints());
window.SPVerbRegroupRecovery={historicalOrder,restoreDone,pointFloor,preserveFloor,refreshCloudFloor};
})();
