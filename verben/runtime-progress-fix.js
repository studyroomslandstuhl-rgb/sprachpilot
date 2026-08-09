(function(){
'use strict';
if(window.__SP_VERB_RUNTIME_PROGRESS_FIX_V2)return;
window.__SP_VERB_RUNTIME_PROGRESS_FIX_V2=true;

const E=window.VerbGroupsEngine;
if(!E)return;

const nativeMarkRight=typeof E.markRight==='function'?E.markRight.bind(E):null;
const nativeResetGroup=typeof E.resetGroup==='function'?E.resetGroup.bind(E):null;
const clone=value=>{try{return JSON.parse(JSON.stringify(value))}catch{return null}};
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');

function profile(){
 if(window.VerbGroupsProfile&&typeof window.VerbGroupsProfile==='object')return window.VerbGroupsProfile;
 for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE']){
  try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')return value}catch{}
 }
 return{};
}
function userSlug(){const p=profile();return[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function stateKey(){return`SP_VERB_GROUPS_PROGRESS_${userSlug()}`}
function backupKey(){return`SP_VERB_PROGRESS_EVIDENCE_V3_${userSlug()}`}
function resetKey(){return`SP_VERB_MANUAL_RESETS_${userSlug()}`}
function readJSON(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function resetMarks(){const value=readJSON(resetKey());return value&&typeof value==='object'?value:{}}
function saveResetMarks(value){writeJSON(resetKey(),value||{})}

// Eine richtige Korrektur zählt als richtig. Ein vorheriger Fehler darf das Verb
// nicht endlos wieder in die Warteschlange legen.
if(nativeMarkRight){
 E.markRight=function(groupId,task){
  const st=E.taskState?.(groupId,task);
  if(st){st.hadWrong=false;st.tries=0}
  return nativeMarkRight(groupId,task)
 }
}

function removeGroupEvidenceFromBackup(group){
 if(!group)return;
 const backup=readJSON(backupKey());
 if(!backup?.groups)return;
 const blocked=new Set((group.verbs||[]).map(clean));
 for(const gs of Object.values(backup.groups||{})){
  for(const run of Object.values(gs?.runs||{})){
   for(const st of Object.values(run?.tasks||{})){
    if(!st||typeof st!=='object')continue;
    st.done=(st.done||[]).filter(v=>!blocked.has(clean(v)));
    st.queue=(st.queue||[]).filter(v=>!blocked.has(clean(v)));
    if(st.current&&blocked.has(clean(st.current)))st.current=null
   }
  }
 }
 const state=readJSON(stateKey()),current=state?.groups?.[String(group.id)]||state?.groups?.[group.id];
 if(current)backup.groups[String(group.id)]=clone(current);
 writeJSON(backupKey(),backup)
}

function markManualReset(group){
 if(!group)return;
 const marks=resetMarks();
 marks[group.signature]={at:new Date().toISOString()};
 saveResetMarks(marks);
 removeGroupEvidenceFromBackup(group);
 try{window.SPVerbFirebaseRankingSync?.schedule?.(0)}catch{}
}

if(nativeResetGroup){
 E.resetGroup=function(groupId){
  const group=E.GROUPS?.[groupId-1];
  const result=nativeResetGroup(groupId);
  if(group&&!E.isPreview?.())markManualReset(group);
  return result
 }
}

function restoreSnapshot(group,snapshot,pointFloor){
 if(!group||!snapshot)return false;
 const gs=E.groupState?.(group.id);if(!gs)return false;
 const beforePoints=Number(pointFloor)||Number(E.groupPoints?.(group.id))||0;
 gs.signature=group.signature;
 gs.currentRun=Math.max(1,Math.min(3,Number(snapshot.currentRun)||1));
 gs.runs=clone(snapshot.runs)||{};
 gs.legacyPoints=Math.max(0,Number(snapshot.legacyPoints)||0);
 E.groupState?.(group.id);
 const after=Number(E.groupPoints?.(group.id))||0;
 if(after<beforePoints)gs.legacyPoints=Math.max(0,Number(gs.legacyPoints)||0)+(beforePoints-after);
 return true
}

function parsedTime(value){const t=Date.parse(String(value||''));return Number.isFinite(t)?t:0}
function cloudProgressTime(progress){return Math.max(parsedTime(progress?.lastActiveAt),parsedTime(progress?.ranking?.updatedAt),parsedTime(progress?.totals?.updatedAt),parsedTime(progress?.metadata?.verbenGroupsUpdatedAt))}
async function reconcileCloudMetadata(localState=null){
 const api=window.SPProgress;if(!api?.loadCurrentStudentProgress)return{changed:0,preferLocal:true,progress:{}};
 let progress={};try{progress=await api.loadCurrentStudentProgress()||{}}catch{return{changed:0,preferLocal:true,progress:{}}}
 const localAt=parsedTime(localState?.updatedAt),cloudAt=cloudProgressTime(progress);
 if(localAt&&(!cloudAt||localAt>cloudAt+500))return{changed:0,preferLocal:true,progress};
 const meta=progress?.metadata?.verbenGroups||{};
 let changed=0;
 for(const group of E.GROUPS||[]){
  const m=meta[String(group.id).padStart(2,'0')]||meta[String(group.id)];
  if(!m||String(m.signature||'')!==String(group.signature||''))continue;
  const gs=E.groupState?.(group.id);if(!gs)continue;
  const wantedRun=Math.max(1,Math.min(3,Number(m.currentRun)||1));
  gs.currentRun=wantedRun;E.groupState?.(group.id);
  for(const [runId,mr] of Object.entries(m.runs||{})){
   const run=gs.runs?.[String(runId)];if(!run)continue;
   for(const task of E.LEARN||[]){
    const st=run.tasks?.[task],mt=mr?.tasks?.[task];if(!st||!mt)continue;
    const allowed=new Set((mt.done||[]).map(clean));
    st.total=group.verbs.length;
    st.done=group.verbs.filter(v=>allowed.has(clean(v)));
    st.queue=[];st.current=null;st.tries=0;st.hadWrong=false;
   }
   run.exam={...(run.exam||{}),bestPercent:Number(mr?.exam?.bestPercent)||0,stars:Number(mr?.exam?.stars)||0,session:null};
   run.completed=(E.LEARN||[]).every(task=>(run.tasks?.[task]?.done||[]).length>=group.verbs.length)&&Number(run.exam.bestPercent||0)>=100
  }
  E.updateCompletion?.(group.id);changed++
 }
 if(changed)E.save?.();
 return{changed,preferLocal:false,progress}
}

// Alte Cloud-100%-Stände dürfen einen ausdrücklich zurückgesetzten aktuellen
// Lernstand nicht wieder herstellen. Die Detail-Metadaten sind für den aktuellen
// Stand maßgeblich; Punkte/Awards bleiben davon unberührt.
const persistence=window.SPVerbProgressPersistence;
if(persistence?.restoreCloud&&!persistence.__runtimeProgressFixV2){
 persistence.__runtimeProgressFixV2=true;
 const originalRestore=persistence.restoreCloud.bind(persistence);
 persistence.restoreCloud=async function(){
  const marks=resetMarks(),snapshots={};
  const raw=readJSON(stateKey());
  for(const group of E.GROUPS||[]){
   if(!marks[group.signature])continue;
   const snap=raw?.groups?.[String(group.id)]||raw?.groups?.[group.id];
   if(snap)snapshots[group.signature]=clone(snap)
  }
  const result=await originalRestore();
  const cloudResult=await reconcileCloudMetadata(raw);
  let protectedCount=0;
  if(cloudResult.preferLocal&&raw?.groups){
   for(const group of E.GROUPS||[]){
    const snap=raw.groups?.[String(group.id)]||raw.groups?.[group.id];if(!snap)continue;
    const points=Number(E.groupPoints?.(group.id))||0;if(restoreSnapshot(group,snap,points))protectedCount++
   }
   if(protectedCount)E.save?.()
  }
  for(const group of E.GROUPS||[]){
   if(!marks[group.signature])continue;
   const points=Number(E.groupPoints?.(group.id))||0;
   if(snapshots[group.signature]){restoreSnapshot(group,snapshots[group.signature],points);protectedCount++}
   else if(nativeResetGroup){nativeResetGroup(group.id);protectedCount++}
  }
  if(protectedCount)E.save?.();
  return{...(result||{}),protectedResets:protectedCount}
 }
}

function clearSyncedResetMarks(){
 const status=window.SP_VERBEN_FIREBASE_SYNC;if(!status?.ok||!status.at)return;
 const syncedAt=Date.parse(status.at);if(!Number.isFinite(syncedAt))return;
 const marks=resetMarks();let changed=false;
 for(const [signature,mark] of Object.entries(marks)){
  const at=Date.parse(mark?.at||'');if(Number.isFinite(at)&&syncedAt>=at){delete marks[signature];changed=true}
 }
 if(changed)saveResetMarks(marks)
}
setInterval(clearSyncedResetMarks,900);
window.addEventListener('pageshow',()=>setTimeout(clearSyncedResetMarks,1200));

window.SPVerbRuntimeProgressFix={reconcileCloudMetadata,resetMarks};
})();