(function(){
'use strict';
if(window.__SP_PERFEKT_REGROUP_RECOVERY_V2)return;
window.__SP_PERFEKT_REGROUP_RECOVERY_V2=true;

const GROUP_SIZE=20;
const TASKS=['cards','inf-perfect','perfect-inf','listen','image-perfect','build','auxiliary','write','speak','sentence'];
let activeProfile=null,activeVisible=[];

const clean=v=>String(v||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');
const uniq=list=>{const seen=new Set(),out=[];(list||[]).forEach(v=>{const key=clean(v);if(key&&!seen.has(key)){seen.add(key);out.push(String(v).trim())}});return out};
function userSlug(profile={}){
 return[profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname]
  .filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
}
function stateKey(profile){return`SP_PERFEKT_STABLE_${userSlug(profile)}`}
function floorKey(profile){return`SP_PERFEKT_POINTS_FLOOR_${userSlug(profile)}`}
function syncKey(profile){return`SP_PERFEKT_CLOUD_SYNC_${userSlug(profile)}`}
function readJSON(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function runPoints(run){
 return Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0);
}
function statePoints(state){
 return Object.values(state?.groups||{}).reduce((sum,gs)=>sum+Object.values(gs?.runs||{}).reduce((s,run)=>s+runPoints(run),0),0);
}
function pointFloor(profile){return Math.max(0,Number(localStorage.getItem(floorKey(profile))||0)||0)}
function preserveFloor(profile,value){
 const next=Math.max(pointFloor(profile),Math.max(0,Number(value)||0));
 try{localStorage.setItem(floorKey(profile),String(next))}catch{}
 try{
  const global=Math.max(0,Number(localStorage.getItem('SP_POINTS_TOTAL')||0)||0);
  if(next>global)localStorage.setItem('SP_POINTS_TOTAL',String(next));
 }catch{}
 return next;
}
function historyFromState(state){
 const done={};
 let maxRun=1;
 for(const gs of Object.values(state?.groups||{})){
  maxRun=Math.max(maxRun,Math.min(3,Number(gs?.currentRun)||1));
  for(const[runId,run]of Object.entries(gs?.runs||{})){
   const r=Math.max(1,Math.min(3,Number(runId)||1));
   maxRun=Math.max(maxRun,r);
   done[r]=done[r]||{};
   for(const task of TASKS){
    const set=done[r][task]||(done[r][task]=new Set());
    (run?.tasks?.[task]?.done||[]).forEach(v=>set.add(clean(v)));
   }
  }
 }
 return{done,maxRun};
}
function blankTask(total,done=[]){return{total,done:done.slice(),queue:[],current:null,tries:0,hadWrong:false}}
function blankRun(){return{tasks:{},exam:{bestPercent:0,stars:0,session:null},awards:{tasks:{},examPoints:0},completed:false}}
function mergeTargetGroup(existing,verbs,history){
 const group={...(existing||{}),signature:'release|'+verbs.join('|')};
 group.runs=group.runs&&typeof group.runs==='object'?group.runs:{};
 let highestExisting=Math.max(1,Math.min(3,Number(group.currentRun)||1));
 for(let r=1;r<=3;r++){
  const hasLearned=TASKS.some(task=>verbs.some(v=>history.done?.[r]?.[task]?.has(clean(v))));
  if(!group.runs[String(r)]&&!hasLearned&&r>highestExisting)continue;
  const run={...blankRun(),...(group.runs[String(r)]||{})};
  run.tasks=run.tasks&&typeof run.tasks==='object'?run.tasks:{};
  run.awards={tasks:{},examPoints:0,...(run.awards||{})};
  run.awards.tasks=run.awards.tasks&&typeof run.awards.tasks==='object'?run.awards.tasks:{};
  run.exam={bestPercent:0,stars:0,session:null,...(run.exam||{})};
  for(const task of TASKS){
   const old=run.tasks[task]||{};
   const existingDone=new Set((old.done||[]).map(clean));
   const learned=history.done?.[r]?.[task];
   const done=verbs.filter(v=>existingDone.has(clean(v))||learned?.has(clean(v)));
   run.tasks[task]={...blankTask(verbs.length,done),...old,total:verbs.length,done,queue:(old.queue||[]).filter(v=>verbs.includes(v)&&!done.includes(v)),current:old.current&&verbs.includes(old.current)&&!done.includes(old.current)?old.current:null,tries:Number(old.tries)||0,hadWrong:!!old.hadWrong};
   if(done.length===verbs.length&&verbs.length){
    run.awards.tasks[task]=Math.max(Number(run.awards.tasks[task])||0,r*5);
   }
  }
  run.completed=TASKS.every(task=>(run.tasks[task]?.done||[]).length>=verbs.length)&&Number(run.exam.bestPercent||0)>=100;
  group.runs[String(r)]=run;
  if(hasLearned)highestExisting=Math.max(highestExisting,r);
 }
 group.currentRun=Math.max(1,Math.min(3,highestExisting));
 if(!group.runs[String(group.currentRun)])group.runs[String(group.currentRun)]=blankRun();
 return group;
}
function migrate({profile={},visible=[]}={}){
 activeProfile=profile||{};
 activeVisible=uniq(visible);
 const key=stateKey(activeProfile),state=readJSON(key);
 if(!state?.groups||typeof state.groups!=='object')return{restored:0,points:preserveFloor(activeProfile,0)};
 // Beim allerersten Lauf ist der alte Gesamtstand die Ausgangsbasis. Danach ist
 // die gespeicherte Untergrenze maßgeblich, damit alte + migrierte Gruppen nicht
 // bei jedem Seitenaufruf erneut zusammengezählt werden.
 const savedFloor=pointFloor(activeProfile);
 const oldTotal=savedFloor>0?savedFloor:statePoints(state);
 preserveFloor(activeProfile,oldTotal);
 const history=historyFromState(state);
 let restored=0;
 for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){
  const verbs=activeVisible.slice(i,i+GROUP_SIZE),signature='release|'+verbs.join('|');
  const before=JSON.stringify(state.groups[signature]||null);
  state.groups[signature]=mergeTargetGroup(state.groups[signature],verbs,history);
  if(JSON.stringify(state.groups[signature])!==before)restored++;
 }
 state.version=Math.max(1,Number(state.version)||1);
 writeJSON(key,state);
 scheduleScorePatch();
 scheduleCloudSync();
 return{restored,points:oldTotal};
}
function activePoints(){
 if(!activeProfile)return 0;
 const state=readJSON(stateKey(activeProfile));
 if(!state?.groups)return 0;
 let sum=0;
 for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){
  const verbs=activeVisible.slice(i,i+GROUP_SIZE),sig='release|'+verbs.join('|');
  const gs=state.groups[sig];
  sum+=Object.values(gs?.runs||{}).reduce((s,run)=>s+runPoints(run),0);
 }
 return sum;
}
function patchScore(){
 if(!activeProfile||!location.pathname.startsWith('/perfekt/'))return;
 const total=Math.max(pointFloor(activeProfile),activePoints());
 document.querySelectorAll('.compact-score h2').forEach(el=>{el.textContent=`${total} Punkte`});
}
let scoreTimer=0;
function scheduleScorePatch(){clearTimeout(scoreTimer);scoreTimer=setTimeout(patchScore,80)}
new MutationObserver(scheduleScorePatch).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',scheduleScorePatch);
window.addEventListener('load',()=>{scheduleScorePatch();scheduleCloudSync()});

function fingerprint(state){
 const parts=[];
 for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){
  const verbs=activeVisible.slice(i,i+GROUP_SIZE),sig='release|'+verbs.join('|'),gs=state?.groups?.[sig];
  parts.push(sig,gs?.currentRun||1);
  for(const[runId,run]of Object.entries(gs?.runs||{})){
   parts.push(runId);
   TASKS.forEach(task=>parts.push(task,(run?.tasks?.[task]?.done||[]).length));
   parts.push('exam',run?.exam?.bestPercent||0,run?.exam?.stars||0);
  }
 }
 return parts.join('~');
}
let syncing=false,syncTimer=0;
function scheduleCloudSync(){clearTimeout(syncTimer);syncTimer=setTimeout(syncCloud,1200)}
async function syncCloud(){
 if(syncing||!activeProfile||!activeVisible.length)return;
 const state=readJSON(stateKey(activeProfile));if(!state?.groups)return;
 const fp=fingerprint(state),marker=localStorage.getItem(syncKey(activeProfile));
 if(marker===fp)return;
 syncing=true;
 try{
  if(!window.SPProgress)await import('/js/progress.js?v=perfekt-regroup-recovery2');
  const api=window.SPProgress;if(!api)return;
  for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){
   const verbs=activeVisible.slice(i,i+GROUP_SIZE),groupId=Math.floor(i/GROUP_SIZE)+1,sig='release|'+verbs.join('|'),gs=state.groups[sig];
   if(!gs)continue;
   for(const[runId,run]of Object.entries(gs.runs||{})){
    localStorage.setItem(`SP_SCORE_RUN_perfekt-gruppe-${String(groupId).padStart(2,'0')}`,String(runId));
    for(const task of TASKS){
     const st=run?.tasks?.[task];if(!st)continue;
     const done=(st.done||[]).length,total=verbs.length;
     if(!done&&!Number(run?.awards?.tasks?.[task]||0))continue;
     await api.recordTaskProgress?.({module:'perfekt',moduleTitle:'Perfekt',level:'A1',lesson:`Gruppe ${groupId}`,theme:`Runde ${runId}`,topicId:`perfekt-gruppe-${String(groupId).padStart(2,'0')}`,title:`Perfekt · Gruppe ${groupId}`,file:task,taskKey:task,taskTitle:task,total,done,percent:total?Math.round(done/total*100):0,completed:total>0&&done>=total});
    }
    if(Number(run?.exam?.bestPercent||0)>0){
     await api.recordExamResult?.({module:'perfekt',moduleTitle:'Perfekt',level:'A1',lesson:`Gruppe ${groupId}`,theme:`Runde ${runId}`,topicId:`perfekt-gruppe-${String(groupId).padStart(2,'0')}`,title:`Perfekt · Gruppe ${groupId}`,percent:Number(run.exam.bestPercent)||0,stars:Number(run.exam.stars)||0});
    }
   }
  }
  localStorage.setItem(syncKey(activeProfile),fp);
 }catch(error){console.warn('Perfekt-Fortschritt konnte nicht vollständig synchronisiert werden',error)}finally{syncing=false}
}
document.addEventListener('click',()=>{scheduleScorePatch();setTimeout(scheduleCloudSync,700)});
document.addEventListener('keydown',event=>{if(event.key==='Enter')setTimeout(scheduleCloudSync,800)});

window.SPPerfektRegroupRecovery={migrate,pointFloor:()=>activeProfile?pointFloor(activeProfile):0,activePoints,syncCloud};
})();
