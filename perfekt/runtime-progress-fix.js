(function(){
'use strict';
if(window.__SP_PERFEKT_RUNTIME_PROGRESS_FIX_V1)return;
window.__SP_PERFEKT_RUNTIME_PROGRESS_FIX_V1=true;

const GROUP_SIZE=20;
const TASKS=['cards','inf-perfect','perfect-inf','listen','image-perfect','build','auxiliary','write','speak','sentence'];
const STATE_PREFIX='SP_PERFEKT_STABLE_';
const BACKUP_PREFIX='SP_PERFEKT_PROGRESS_EVIDENCE_V4_';
const RESET_PREFIX='SP_PERFEKT_MANUAL_RESETS_';
const clone=value=>{try{return JSON.parse(JSON.stringify(value))}catch{return null}};
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');
const nativeGet=Storage.prototype.getItem;
const nativeSet=Storage.prototype.setItem;
const nativeParse=JSON.parse;
let captureNextAppState=false,pendingStableKey='',appState=null,appStateKey='',activeProfile={};

function userSlug(profile={}){return[profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function stateKey(profile){return STATE_PREFIX+userSlug(profile)}
function backupKey(profile){return BACKUP_PREFIX+userSlug(profile)}
function resetKey(profile){return RESET_PREFIX+userSlug(profile)}
function readJSON(key){try{return nativeParse.call(JSON,nativeGet.call(localStorage,key)||'null')}catch{return null}}
function writeJSON(key,value){try{nativeSet.call(localStorage,key,JSON.stringify(value))}catch{}}
function signatureVerbs(signature){const parts=String(signature||'').split('|').map(v=>v.trim()).filter(Boolean);if(['regular','strong','middle','separable','release'].includes(parts[0]))parts.shift();return parts}
function sameSet(a,b){const A=new Set((a||[]).map(clean)),B=new Set((b||[]).map(clean));return A.size===B.size&&[...A].every(x=>B.has(x))}
function groupSignature(verbs){return'release|'+(verbs||[]).join('|')}
function visibleGroups(visible){const out=[];for(let i=0;i<(visible||[]).length;i+=GROUP_SIZE){const verbs=visible.slice(i,i+GROUP_SIZE);out.push({id:Math.floor(i/GROUP_SIZE)+1,verbs,signature:groupSignature(verbs)})}return out}
function findGroupState(state,group){if(!state?.groups||!group)return null;if(state.groups[group.signature])return state.groups[group.signature];for(const [key,gs] of Object.entries(state.groups)){if(sameSet(signatureVerbs(gs?.signature||key),group.verbs))return gs}return null}
function resetMarks(profile){const value=readJSON(resetKey(profile));return value&&typeof value==='object'?value:{}}
function saveResetMarks(profile,value){writeJSON(resetKey(profile),value||{})}

// Wir greifen genau die JSON-Instanz ab, die app-stable.js als internen State
// benutzt. Spätere reine Lesevorgänge dürfen diese Referenz nicht überschreiben.
Storage.prototype.getItem=function(key){
 const value=nativeGet.call(this,key);
 if(this===localStorage&&captureNextAppState&&String(key||'').startsWith(STATE_PREFIX))pendingStableKey=String(key);
 return value
};
JSON.parse=function(text,reviver){
 const value=nativeParse.call(JSON,text,reviver);
 if(captureNextAppState&&pendingStableKey){
  if(value&&typeof value==='object'){appState=value;appStateKey=pendingStableKey;captureNextAppState=false}
  pendingStableKey=''
 }
 return value
};

function mergeEvidence(current,old,verbs){
 const out=clone(current)||{};out.runs=out.runs||{};
 for(const [runId,oldRun] of Object.entries(old?.runs||{})){
  const run=out.runs[runId]||(out.runs[runId]=clone(oldRun)||{});run.tasks=run.tasks||{};
  for(const task of TASKS){
   const oldTask=oldRun?.tasks?.[task];if(!oldTask)continue;
   const st=run.tasks[task]||(run.tasks[task]=clone(oldTask));
   const evidence=new Set([...(st?.done||[]),...(oldTask?.done||[])].map(clean));
   st.done=(verbs||[]).filter(v=>evidence.has(clean(v)));
   st.total=(verbs||[]).length;
   st.queue=(st.queue||[]).filter(v=>(verbs||[]).includes(v)&&!st.done.includes(v));
   if(st.current&&st.done.includes(st.current))st.current=null
  }
  run.awards=run.awards||{tasks:{},examPoints:0};run.awards.tasks=run.awards.tasks||{};
  for(const [task,points] of Object.entries(oldRun?.awards?.tasks||{}))run.awards.tasks[task]=Math.max(Number(run.awards.tasks[task])||0,Number(points)||0);
  run.awards.examPoints=Math.max(Number(run.awards.examPoints)||0,Number(oldRun?.awards?.examPoints)||0)
 }
 return out
}

function prepareBackup(profile,visible){
 const state=readJSON(stateKey(profile));if(!state?.groups)return;
 const backup=readJSON(backupKey(profile))||{version:state.version||1,selectedGroup:state.selectedGroup||1,groups:{}};backup.groups=backup.groups||{};
 const marks=resetMarks(profile);
 for(const group of visibleGroups(visible)){
  const current=findGroupState(state,group);if(!current)continue;
  const matches=[];for(const [key,gs] of Object.entries(backup.groups)){if(sameSet(signatureVerbs(gs?.signature||key),group.verbs))matches.push([key,gs])}
  let next=clone(current);
  if(!marks[group.signature])for(const [,old] of matches)next=mergeEvidence(next,old,group.verbs);
  for(const [key] of matches)delete backup.groups[key];
  next.signature=group.signature;backup.groups[group.signature]=next
 }
 writeJSON(backupKey(profile),backup)
}

function restoreMarkedSnapshots(profile,visible,snapshots){
 const marks=resetMarks(profile);if(!Object.keys(marks).length)return 0;
 const state=readJSON(stateKey(profile));if(!state?.groups)return 0;let changed=0;
 for(const group of visibleGroups(visible)){
  if(!marks[group.signature])continue;
  const snapshot=snapshots[group.signature];if(!snapshot)continue;
  for(const [key,gs] of Object.entries(state.groups)){if(key!==group.signature&&sameSet(signatureVerbs(gs?.signature||key),group.verbs))delete state.groups[key]}
  state.groups[group.signature]=clone(snapshot);state.groups[group.signature].signature=group.signature;changed++
 }
 if(changed)writeJSON(stateKey(profile),state);
 return changed
}

const recovery=window.SPPerfektRegroupRecovery;
if(recovery?.migrate&&!recovery.__runtimeProgressFixV1){
 recovery.__runtimeProgressFixV1=true;
 const originalMigrate=recovery.migrate.bind(recovery);
 recovery.migrate=async function(args={}){
  const profile=args.profile||{},visible=[...(args.visible||[])],marks=resetMarks(profile),raw=readJSON(stateKey(profile)),snapshots={};
  activeProfile=profile;
  for(const group of visibleGroups(visible))if(marks[group.signature]){const gs=findGroupState(raw,group);if(gs)snapshots[group.signature]=clone(gs)}
  prepareBackup(profile,visible);
  let result;
  try{result=await originalMigrate(args)}finally{
   restoreMarkedSnapshots(profile,visible,snapshots);
   captureNextAppState=true
  }
  return result
 }
}

function activeRoute(){const q=new URLSearchParams(location.search);return{group:Math.max(0,Number(q.get('group'))||0),task:q.get('task')||''}}
function activeGroupFromApp(groupId){const visible=window.SP_PERFEKT_RELEASE_SYNC?.visible||[],verbs=visible.slice((groupId-1)*GROUP_SIZE,groupId*GROUP_SIZE);if(!verbs.length)return null;return{id:groupId,verbs,signature:groupSignature(verbs)}}
function appTaskState(groupId,task){const group=activeGroupFromApp(groupId);if(!group||!appState?.groups)return null;const gs=findGroupState(appState,group);if(!gs)return null;const run=gs.runs?.[String(gs.currentRun)];const st=run?.tasks?.[task];return st?{group,gs,run,st}:null}
function persistAppState(){if(!appState||!appStateKey)return;try{nativeSet.call(localStorage,appStateKey,JSON.stringify(appState))}catch{}}

let pendingAnswer=null;
function captureAnswerAttempt(){
 const r=activeRoute();if(!r.group||!r.task||r.task==='exam')return;
 const ref=appTaskState(r.group,r.task);if(!ref?.st?.current)return;
 pendingAnswer={...ref,task:r.task,verb:ref.st.current,hadWrong:!!ref.st.hadWrong||Number(ref.st.tries)>0,at:Date.now()};
 setTimeout(applyCorrectedAnswer,25)
}
function hasPositiveFeedback(){return!!document.querySelector('#feedback.feedback.ok,#cardFeedback.feedback.ok,.feedback.ok')}
function applyCorrectedAnswer(){
 const p=pendingAnswer;pendingAnswer=null;if(!p||!p.hadWrong||!hasPositiveFeedback())return;
 const st=p.st,verb=p.verb;if(!st||!verb)return;
 if(!st.done.includes(verb))st.done.push(verb);
 st.queue=(st.queue||[]).filter(v=>clean(v)!==clean(verb));st.current=null;st.tries=0;st.hadWrong=false;
 if(st.total&&st.done.length>=st.total){p.run.awards=p.run.awards||{tasks:{},examPoints:0};p.run.awards.tasks=p.run.awards.tasks||{};if(!p.run.awards.tasks[p.task])p.run.awards.tasks[p.task]=(Number(p.gs.currentRun)||1)*5}
 persistAppState();
 try{window.SPPerfektRegroupRecovery?.syncCloud?.()}catch{}
 try{window.SPPerfektFirebaseRankingSync?.schedule?.(0)}catch{}
}

document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target.closest('button,[data-action]'):null;if(!target)return;
 if(target.matches('[data-action="answer"],[data-action="check-input"],#cardCheckBtn,#spPerfektNativeCheck'))captureAnswerAttempt();
 if(target.matches('[data-action="reset-group"]')){
  const groupId=Number(target.dataset.group)||0,before=appStateKey?nativeGet.call(localStorage,appStateKey):'';
  setTimeout(()=>{
   if(!groupId||!appStateKey)return;const after=nativeGet.call(localStorage,appStateKey);if(after===before)return;
   const group=activeGroupFromApp(groupId);if(!group)return;
   const profile=activeProfile||{};const marks=resetMarks(profile);marks[group.signature]={at:new Date().toISOString()};saveResetMarks(profile,marks);
   const current=readJSON(appStateKey),backup=readJSON(backupKey(profile))||{version:1,groups:{}};backup.groups=backup.groups||{};
   for(const [key,gs] of Object.entries(backup.groups)){if(sameSet(signatureVerbs(gs?.signature||key),group.verbs))delete backup.groups[key]}
   const gs=findGroupState(current,group);if(gs)backup.groups[group.signature]=clone(gs);writeJSON(backupKey(profile),backup);
   try{window.SPPerfektFirebaseRankingSync?.schedule?.(0)}catch{}
  },80)
 }
},true);
document.addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.target?.id==='answerInput'||event.target?.id==='cardAnswerInput'))captureAnswerAttempt()},true);

function clearSyncedResetMarks(){
 const status=window.SP_PERFEKT_FIREBASE_SYNC;if(!status?.ok||!status.at)return;
 const profile=activeProfile||{};const marks=resetMarks(profile),syncedAt=Date.parse(status.at);if(!Number.isFinite(syncedAt))return;let changed=false;
 for(const [signature,mark] of Object.entries(marks)){const at=Date.parse(mark?.at||'');if(Number.isFinite(at)&&syncedAt>=at){delete marks[signature];changed=true}}
 if(changed)saveResetMarks(profile,marks)
}
setInterval(clearSyncedResetMarks,900);window.addEventListener('pageshow',()=>setTimeout(clearSyncedResetMarks,1200));

window.SPPerfektRuntimeProgressFix={get appState(){return appState},resetMarks:()=>resetMarks(activeProfile||{})};
})();