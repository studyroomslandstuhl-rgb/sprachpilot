(function(){
'use strict';
if(window.__SP_VERB_GROUP_STABILITY_FINAL_V1)return;
window.__SP_VERB_GROUP_STABILITY_FINAL_V1=true;
const E=window.VerbGroupsEngine;
if(!E)return;

function runComplete(run,group){
 if(!run||!group)return false;
 const tasksOk=(E.LEARN||[]).every(task=>{
  const st=run.tasks?.[task];
  return Array.isArray(st?.done)&&st.done.length>=group.verbs.length;
 });
 return tasksOk&&Number(run.exam?.bestPercent||0)>=100;
}
function sanitizeGroup(group){
 const gs=E.groupState?.(group.id);if(!gs)return false;
 const before=Math.max(1,Math.min(3,Number(gs.currentRun)||1));
 let maxAllowed=1;
 if(runComplete(gs.runs?.['1'],group))maxAllowed=2;
 if(maxAllowed>=2&&runComplete(gs.runs?.['2'],group))maxAllowed=3;
 const next=Math.min(before,maxAllowed);
 if(next===before)return false;
 gs.currentRun=next;
 for(let run=next+1;run<=3;run++)delete gs.runs?.[String(run)];
 E.groupState?.(group.id);
 return true;
}
function sanitizeAll(){
 if(E.isPreview?.())return 0;
 let changed=0;
 for(const group of E.GROUPS||[])if(sanitizeGroup(group))changed++;
 if(changed)E.save?.();
 window.SP_VERB_GROUP_STABILITY_SANITIZED=changed;
 return changed;
}

/* Jede Cloud-/Backup-Wiederherstellung wird anschließend auf logisch mögliche Runden geprüft. */
const persistence=window.SPVerbProgressPersistence;
if(persistence?.restoreCloud&&!persistence.__groupStabilityFinalV1){
 persistence.__groupStabilityFinalV1=true;
 const original=persistence.restoreCloud.bind(persistence);
 persistence.restoreCloud=async function(){
  const result=await original();
  const sanitized=sanitizeAll();
  return{...(result||{}),sanitizedRounds:sanitized};
 };
}

/* Eine neue Runde startet immer leer. Alte versteckte Run-2/Run-3-Daten dürfen nicht wieder auftauchen. */
if(typeof E.startNextRun==='function'&&!E.startNextRun.__groupStabilityFinalV1){
 const originalStart=E.startNextRun.bind(E);
 const wrapped=function(groupId){
  const ok=originalStart(groupId);if(!ok)return false;
  const group=E.GROUPS?.[groupId-1],gs=E.groupState?.(groupId);if(!group||!gs)return ok;
  const runId=String(gs.currentRun),tasks={};
  for(const task of E.LEARN||[])tasks[task]={total:group.verbs.length,done:[],queue:[],current:null,tries:0,hadWrong:false,recoveredByVerb:false};
  gs.runs[runId]={tasks,exam:{bestPercent:0,stars:0,session:null},awards:{tasks:{},examPoints:0,examPercent:0},completed:false};
  E.save?.();
  return true;
 };
 wrapped.__groupStabilityFinalV1=true;
 E.startNextRun=wrapped;
}

window.addEventListener('pageshow',()=>setTimeout(sanitizeAll,600));
window.SPVerbGroupStabilityFinal={sanitizeAll};
})();
