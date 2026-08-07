(function(){
'use strict';
if(window.__SP_VERB_PROGRESS_PERSISTENCE_V1)return;
window.__SP_VERB_PROGRESS_PERSISTENCE_V1=true;

const E=window.VerbGroupsEngine;
if(!E)return;

const originalLoad=E.load.bind(E);
const pad=value=>String(value).padStart(2,'0');
const clamp=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));

function profile(){
 if(window.VerbGroupsProfile&&typeof window.VerbGroupsProfile==='object')return window.VerbGroupsProfile;
 for(const key of['SP_USER_PROFILE','SP_STUDENT_PROFILE']){
  try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')return value}catch(error){}
 }
 return{};
}
function userSlug(){
 const p=profile();
 return[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname]
  .filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
}
function storageKey(){return`SP_VERB_GROUPS_PROGRESS_${userSlug()}`}
function rawRunPoints(run){
 return Object.values(run?.awards?.tasks||{}).reduce((sum,value)=>sum+(Number(value)||0),0)+(Number(run?.awards?.examPoints)||0);
}
function rawGroupPoints(gs){
 return Object.values(gs?.runs||{}).reduce((sum,run)=>sum+rawRunPoints(run),0);
}
function taskKey(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

function preserveLocalGroupsBeforeLoad(){
 if(E.isPreview?.())return;
 let state;
 try{state=JSON.parse(localStorage.getItem(storageKey())||'null')}catch(error){return}
 if(!state?.groups||typeof state.groups!=='object')return;
 let changed=false;
 for(const group of E.GROUPS||[]){
  const gs=state.groups[String(group.id)]||state.groups[group.id];
  if(!gs||typeof gs!=='object')continue;
  if(gs.signature!==group.signature){
   gs.signature=group.signature;
   changed=true;
  }
 }
 if(changed){
  try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch(error){}
 }
}

E.load=function(){
 preserveLocalGroupsBeforeLoad();
 return originalLoad();
};

function completeRun(groupId,runNumber,{examPercent=100,restoreTasks=true}={}){
 const group=E.GROUPS[groupId-1];
 const gs=E.groupState(groupId);
 if(!group||!gs)return false;
 const runId=Math.max(1,Math.min(3,Number(runNumber)||1));
 if(gs.currentRun<runId)gs.currentRun=runId;
 E.groupState(groupId);
 const run=gs.runs?.[String(runId)];
 if(!run)return false;
 let changed=false;

 if(restoreTasks){
  for(const task of E.LEARN||[]){
   const st=run.tasks?.[task];
   if(!st)continue;
   if(st.done.length<group.verbs.length){
    st.total=group.verbs.length;
    st.done=[...group.verbs];
    st.queue=[];
    st.current=null;
    st.tries=0;
    st.hadWrong=false;
    changed=true;
   }
   const award=Number(E.taskPoints(runId))||0;
   if(Number(run.awards?.tasks?.[task]||0)<award){
    run.awards.tasks[task]=award;
    changed=true;
   }
  }
 }

 const p=clamp(examPercent);
 if(p>Number(run.exam?.bestPercent||0)){
  run.exam.bestPercent=p;
  changed=true;
 }
 const stars=p>=100?3:p>=70?2:p>=50?1:0;
 if(stars>Number(run.exam?.stars||0)){run.exam.stars=stars;changed=true}
 const earned=Math.round((Number(E.examMax(runId))||0)*p/100);
 if(earned>Number(run.awards?.examPoints||0)){
  run.awards.examPoints=earned;
  run.awards.examPercent=Math.max(Number(run.awards.examPercent)||0,p);
  changed=true;
 }
 run.completed=(E.LEARN||[]).every(task=>run.tasks?.[task]?.done?.length>=group.verbs.length)&&Number(run.exam?.bestPercent||0)>=100;
 return changed;
}

function preservePointTotal(groupId,before,cloudPoints=0){
 const gs=E.groupState(groupId);
 if(!gs)return;
 const raw=rawGroupPoints(gs);
 const target=Math.max(Number(before)||0,Number(cloudPoints)||0,raw);
 gs.legacyPoints=Math.max(0,target-raw);
}

function recoverFromPreservedPoints(){
 let restored=0;
 for(const group of E.GROUPS||[]){
  const id=group.id;
  const before=Number(E.groupPoints(id))||0;
  const gs=E.groupState(id);
  if(!gs)continue;
  let cumulative=0;
  let changed=false;
  for(let runId=1;runId<=3;runId++){
   cumulative+=(E.LEARN||[]).length*(Number(E.taskPoints(runId))||0)+(Number(E.examMax(runId))||0);
   if(before<cumulative)break;
   const run=gs.runs?.[String(runId)];
   const alreadyComplete=run&&(E.LEARN||[]).every(task=>run.tasks?.[task]?.done?.length>=group.verbs.length)&&Number(run.exam?.bestPercent||0)>=100;
   if(!alreadyComplete&&completeRun(id,runId,{examPercent:100,restoreTasks:true}))changed=true;
  }
  if(changed){restored++;preservePointTotal(id,before)}
 }
 if(restored)E.save();
 return restored;
}

function cloudRunNumbers(topic){
 const set=new Set([1]);
 const lifetime=topic?.lifetime||{};
 for(const runs of Object.values(lifetime.taskPointRuns||{}))for(const key of Object.keys(runs||{}))set.add(Number(key)||1);
 for(const key of Object.keys(lifetime.examPointRuns||{}))set.add(Number(key)||1);
 for(const task of Object.values(topic?.tasks||{}))if(Number(task?.run))set.add(Number(task.run));
 const resets=Math.max(0,Number(lifetime.resets)||0);
 set.add(Math.min(3,resets+1));
 return[...set].filter(run=>run>=1&&run<=3).sort((a,b)=>a-b);
}
function cloudTaskCompleted(topic,task,run,total){
 const key=taskKey(task);
 const record=topic?.tasks?.[task]||topic?.tasks?.[key]||{};
 const lifetimeRuns=topic?.lifetime?.taskPointRuns?.[key]||topic?.lifetime?.taskPointRuns?.[task]||{};
 const recordRuns=record?.pointsByRun||{};
 if(Number(lifetimeRuns[String(run)]||0)>0||Number(recordRuns[String(run)]||0)>0)return true;
 const compatibleTotal=!Number(record.total)||Number(record.total)===Number(total);
 const sameRun=Number(record.run||1)===Number(run);
 return compatibleTotal&&sameRun&&(record.completed===true||Number(record.percent)>=100||Number(record.done)>=Number(total));
}
function cloudExamPercent(topic,run){
 const earned=Number(topic?.lifetime?.examPointRuns?.[String(run)]||0);
 const max=Number(E.examMax(run))||0;
 if(earned>0&&max>0)return clamp(earned/max*100);
 const resets=Math.max(0,Number(topic?.lifetime?.resets)||0);
 if(run===1&&resets===0)return clamp(topic?.exam?.bestPercent||topic?.exam?.percent||0);
 return 0;
}
function cloudPoints(topic){return Math.max(0,Number(topic?.lifetime?.points)||0)}

async function progressApi(){
 if(window.SPProgress)return window.SPProgress;
 try{await import('/js/progress.js?v=verb-persistence-1')}catch(error){console.warn('Verben-Fortschritt konnte nicht geladen werden',error)}
 return window.SPProgress||null;
}

async function restoreCloud(){
 if(E.isPreview?.())return{restored:0};
 E.load();
 const localRecovered=recoverFromPreservedPoints();
 const api=await progressApi();
 if(!api?.loadCurrentStudentProgress)return{restored:localRecovered};
 let progress={};
 try{progress=await api.loadCurrentStudentProgress()||{}}catch(error){console.warn('Gespeicherter Verben-Fortschritt konnte nicht gelesen werden',error);return{restored:localRecovered}}
 const module=progress.verben||progress.Verben||{};
 let restored=localRecovered;

 for(const group of E.GROUPS||[]){
  const id=group.id;
  const topic=module[`verben-gruppe-${pad(id)}`]||module[`verben-gruppe-${id}`];
  if(!topic||typeof topic!=='object')continue;
  const before=Number(E.groupPoints(id))||0;
  const gs=E.groupState(id);
  if(!gs)continue;
  const runs=cloudRunNumbers(topic);
  const targetRun=Math.max(gs.currentRun||1,...runs);
  if(gs.currentRun<targetRun)gs.currentRun=Math.min(3,targetRun);
  E.groupState(id);
  let groupChanged=false;

  for(const runId of runs){
   const run=gs.runs?.[String(runId)];
   if(!run)continue;
   for(const task of E.LEARN||[]){
    if(!cloudTaskCompleted(topic,task,runId,group.verbs.length))continue;
    const st=run.tasks?.[task];
    if(st&&st.done.length<group.verbs.length){
     st.total=group.verbs.length;
     st.done=[...group.verbs];
     st.queue=[];
     st.current=null;
     st.tries=0;
     st.hadWrong=false;
     groupChanged=true;
    }
    const award=Number(E.taskPoints(runId))||0;
    if(Number(run.awards?.tasks?.[task]||0)<award){run.awards.tasks[task]=award;groupChanged=true}
   }
   const examPercent=cloudExamPercent(topic,runId);
   if(examPercent>0){
    const old=Number(run.exam?.bestPercent||0);
    run.exam.bestPercent=Math.max(old,examPercent);
    run.exam.stars=Math.max(Number(run.exam.stars)||0,examPercent>=100?3:examPercent>=70?2:examPercent>=50?1:0);
    const earned=Math.round((Number(E.examMax(runId))||0)*examPercent/100);
    run.awards.examPoints=Math.max(Number(run.awards.examPoints)||0,earned);
    run.awards.examPercent=Math.max(Number(run.awards.examPercent)||0,examPercent);
    if(examPercent>old)groupChanged=true;
   }
   run.completed=(E.LEARN||[]).every(task=>run.tasks?.[task]?.done?.length>=group.verbs.length)&&Number(run.exam?.bestPercent||0)>=100;
  }

  if(groupChanged)restored++;
  preservePointTotal(id,before,cloudPoints(topic));
  E.updateCompletion(id);
 }
 E.save();
 return{restored};
}

window.SPVerbProgressPersistence={restoreCloud,recoverFromPreservedPoints,preserveLocalGroupsBeforeLoad};
})();
