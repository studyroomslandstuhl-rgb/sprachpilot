(function(){
'use strict';
if(window.__SP_VERB_PROGRESS_PERSISTENCE_V2)return;
window.__SP_VERB_PROGRESS_PERSISTENCE_V2=true;

const E=window.VerbGroupsEngine;
if(!E)return;

const originalLoad=E.load.bind(E);
const pad=value=>String(value).padStart(2,'0');
const clamp=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');

function profile(){
 if(window.VerbGroupsProfile&&typeof window.VerbGroupsProfile==='object')return window.VerbGroupsProfile;
 for(const key of['SP_USER_PROFILE','SP_STUDENT_PROFILE']){
  try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')return value}catch{}
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
function rawGroupPoints(gs){return Object.values(gs?.runs||{}).reduce((sum,run)=>sum+rawRunPoints(run),0)}
function taskKey(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function signatureVerbs(signature){return String(signature||'').split('|').map(v=>v.trim()).filter(Boolean)}
function sameSet(a,b){const A=new Set((a||[]).map(clean)),B=new Set((b||[]).map(clean));return A.size===B.size&&[...A].every(x=>B.has(x))}
function overlapRatio(a,b){const A=new Set((a||[]).map(clean)),B=new Set((b||[]).map(clean));if(!A.size||!B.size)return 0;let hit=0;A.forEach(x=>{if(B.has(x))hit++});return hit/Math.min(A.size,B.size)}
function blankRun(){return{tasks:{},exam:{bestPercent:0,stars:0,session:null},awards:{tasks:{},examPoints:0,examPercent:0},completed:false}}
function blankGroup(signature,legacyPoints=0){return{signature,currentRun:1,runs:{'1':blankRun()},legacyPoints:Math.max(0,Number(legacyPoints)||0)}}

// Gruppenänderungen dürfen vorhandene Punkte nicht löschen, aber auch niemals
// alte komplette Aufgaben auf eine andere neue 20er-Gruppe übertragen.
function preserveLocalGroupsBeforeLoad(){
 if(E.isPreview?.())return;
 let state;
 try{state=JSON.parse(localStorage.getItem(storageKey())||'null')}catch{return}
 if(!state?.groups||typeof state.groups!=='object')return;
 let changed=false;
 for(const group of E.GROUPS||[]){
  const key=String(group.id),gs=state.groups[key]||state.groups[group.id];
  if(!gs||typeof gs!=='object'||gs.signature===group.signature)continue;
  const oldVerbs=signatureVerbs(gs.signature),current=group.verbs||[];
  const exact=sameSet(oldVerbs,current),continuity=exact||overlapRatio(oldVerbs,current)>=.75;
  if(!continuity){
   const carry=(Number(gs.legacyPoints)||0)+rawGroupPoints(gs);
   state.groups[key]=blankGroup(group.signature,carry);
   changed=true;
   continue;
  }
  gs.signature=group.signature;
  for(const run of Object.values(gs.runs||{})){
   run.tasks=run.tasks||{};
   for(const task of Object.values(run.tasks)){
    if(!task||typeof task!=='object')continue;
    task.total=current.length;
    task.done=[...new Set((task.done||[]).filter(v=>current.includes(v)))];
    task.queue=[...new Set((task.queue||[]).filter(v=>current.includes(v)&&!task.done.includes(v)))];
    task.current=task.current&&current.includes(task.current)&&!task.done.includes(task.current)?task.current:null;
   }
   if(!exact){
    // Die alte Prüfung gehörte zu einer anderen Wortmenge. Die bereits dafür
    // verdienten Punkte bleiben in awards erhalten, aber die neue Prüfung ist offen.
    run.exam={...(run.exam||{}),bestPercent:0,stars:0,session:null};
    run.completed=false;
   }
  }
  changed=true;
 }
 if(changed){try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch{}}
}

E.load=function(){preserveLocalGroupsBeforeLoad();return originalLoad()};

function preservePointTotal(groupId,before,cloudPoints=0){
 const gs=E.groupState(groupId);if(!gs)return;
 const raw=rawGroupPoints(gs);
 const target=Math.max(Number(before)||0,Number(cloudPoints)||0,raw+(Number(gs.legacyPoints)||0));
 gs.legacyPoints=Math.max(Number(gs.legacyPoints)||0,target-raw);
}

// Gesamtpunkte sind kein Beweis dafür, dass eine konkrete Aufgabe erledigt ist.
// Daher wird aus Punkteschwellen nie wieder automatisch 100%-Fortschritt erzeugt.
function recoverFromPreservedPoints(){return 0}

function cloudRunNumbers(topic){
 const set=new Set([1]),lifetime=topic?.lifetime||{};
 for(const runs of Object.values(lifetime.taskPointRuns||{}))for(const key of Object.keys(runs||{}))set.add(Number(key)||1);
 for(const key of Object.keys(lifetime.examPointRuns||{}))set.add(Number(key)||1);
 for(const task of Object.values(topic?.tasks||{}))if(Number(task?.run))set.add(Number(task.run));
 return[...set].filter(run=>run>=1&&run<=3).sort((a,b)=>a-b)
}
function cloudTaskCompleted(topic,task,run,total){
 const key=taskKey(task),record=topic?.tasks?.[task]||topic?.tasks?.[key]||{};
 const lifetimeRuns=topic?.lifetime?.taskPointRuns?.[key]||topic?.lifetime?.taskPointRuns?.[task]||{};
 const recordRuns=record?.pointsByRun||{};
 if(Number(lifetimeRuns[String(run)]||0)>0||Number(recordRuns[String(run)]||0)>0)return true;
 const compatibleTotal=!Number(record.total)||Number(record.total)===Number(total);
 return compatibleTotal&&Number(record.run||1)===Number(run)&&(record.completed===true||Number(record.percent)>=100||Number(record.done)>=Number(total))
}
function cloudExamPercent(topic,run){
 const earned=Number(topic?.lifetime?.examPointRuns?.[String(run)]||0),max=Number(E.examMax(run))||0;
 if(earned>0&&max>0)return clamp(earned/max*100);
 return 0
}
function cloudPoints(topic){return Math.max(0,Number(topic?.lifetime?.points)||0)}
async function progressApi(){if(window.SPProgress)return window.SPProgress;try{await import('/js/progress.js?v=verb-persistence-2')}catch{}return window.SPProgress||null}

async function restoreCloud(){
 if(E.isPreview?.())return{restored:0};
 E.load();
 const api=await progressApi();if(!api?.loadCurrentStudentProgress)return{restored:0};
 let progress={};try{progress=await api.loadCurrentStudentProgress()||{}}catch{return{restored:0}}
 const module=progress.verben||progress.Verben||{},meta=progress?.metadata?.verbenGroups||{};
 let restored=0;
 for(const group of E.GROUPS||[]){
  const id=group.id,topic=module[`verben-gruppe-${pad(id)}`]||module[`verben-gruppe-${id}`];
  if(!topic||typeof topic!=='object')continue;
  const before=Number(E.groupPoints(id))||0;
  // Alte Cloud-Punkte bleiben erhalten, auch wenn sich die Gruppe geändert hat.
  preservePointTotal(id,before,cloudPoints(topic));
  const signature=meta?.[pad(id)]?.signature||meta?.[String(id)]?.signature||topic.groupSignature||'';
  if(signature!==group.signature)continue;

  const gs=E.groupState(id),runs=cloudRunNumbers(topic);
  if(!gs)continue;
  gs.currentRun=Math.max(gs.currentRun||1,...runs);
  E.groupState(id);
  let groupChanged=false;
  for(const runId of runs){
   const run=gs.runs?.[String(runId)];if(!run)continue;
   for(const task of E.LEARN||[]){
    if(!cloudTaskCompleted(topic,task,runId,group.verbs.length))continue;
    const st=run.tasks?.[task];
    if(st&&st.done.length<group.verbs.length){st.total=group.verbs.length;st.done=[...group.verbs];st.queue=[];st.current=null;st.tries=0;st.hadWrong=false;groupChanged=true}
    const award=Number(E.taskPoints(runId))||0;
    if(Number(run.awards?.tasks?.[task]||0)<award){run.awards.tasks[task]=award;groupChanged=true}
   }
   const examPercent=cloudExamPercent(topic,runId);
   if(examPercent>0){
    const old=Number(run.exam?.bestPercent||0);run.exam.bestPercent=Math.max(old,examPercent);
    run.exam.stars=Math.max(Number(run.exam.stars)||0,examPercent>=100?3:examPercent>=70?2:examPercent>=50?1:0);
    run.awards.examPoints=Math.max(Number(run.awards.examPoints)||0,Math.round((Number(E.examMax(runId))||0)*examPercent/100));
    run.awards.examPercent=Math.max(Number(run.awards.examPercent)||0,examPercent);if(examPercent>old)groupChanged=true
   }
   run.completed=(E.LEARN||[]).every(task=>run.tasks?.[task]?.done?.length>=group.verbs.length)&&Number(run.exam?.bestPercent||0)>=100
  }
  if(groupChanged)restored++;
  E.updateCompletion(id)
 }
 E.save();return{restored}
}

window.SPVerbProgressPersistence={restoreCloud,recoverFromPreservedPoints,preserveLocalGroupsBeforeLoad};
})();
