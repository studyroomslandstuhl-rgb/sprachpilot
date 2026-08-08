(function(){
'use strict';
if(window.__SP_PERFEKT_REGROUP_RECOVERY_V3)return;
window.__SP_PERFEKT_REGROUP_RECOVERY_V3=true;

const GROUP_SIZE=20;
const TASKS=['cards','inf-perfect','perfect-inf','listen','image-perfect','build','auxiliary','write','speak','sentence'];
let activeProfile=null,activeVisible=[];
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');
const uniq=list=>{const seen=new Set(),out=[];(list||[]).forEach(v=>{const k=clean(v);if(k&&!seen.has(k)){seen.add(k);out.push(String(v).trim())}});return out};
function userSlug(profile={}){return[profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function stateKey(profile){return`SP_PERFEKT_STABLE_${userSlug(profile)}`}
function floorKey(profile){return`SP_PERFEKT_POINTS_FLOOR_${userSlug(profile)}`}
function syncKey(profile){return`SP_PERFEKT_CLOUD_SYNC_${userSlug(profile)}`}
function readJSON(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function runPoints(run){return Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0)}
function groupPoints(gs){return Object.values(gs?.runs||{}).reduce((sum,run)=>sum+runPoints(run),0)}
function statePoints(entries){return(entries||[]).reduce((sum,[,gs])=>sum+groupPoints(gs),0)}
function pointFloor(profile){return Math.max(0,Number(localStorage.getItem(floorKey(profile))||0)||0)}
function preserveFloor(profile,value){const next=Math.max(pointFloor(profile),Math.max(0,Number(value)||0));try{localStorage.setItem(floorKey(profile),String(next))}catch{}return next}
function signatureVerbs(signature){const parts=String(signature||'').split('|').map(v=>v.trim()).filter(Boolean);if(['regular','strong','middle','separable','mixed','release'].includes(parts[0]))parts.shift();return parts}
function sameSet(a,b){const A=new Set((a||[]).map(clean)),B=new Set((b||[]).map(clean));return A.size===B.size&&[...A].every(x=>B.has(x))}
function blankTask(total){return{total,done:[],queue:[],current:null,tries:0,hadWrong:false}}
function blankRun(total=0){const tasks={};TASKS.forEach(t=>tasks[t]=blankTask(total));return{tasks,exam:{bestPercent:0,stars:0,session:null},awards:{tasks:{},examPoints:0},completed:false}}
function blankGroup(signature,total){return{signature,currentRun:1,runs:{'1':blankRun(total)}}}
function clone(v){try{return JSON.parse(JSON.stringify(v))}catch{return null}}
function normalizeExact(source,signature,verbs){
 const out=clone(source)||blankGroup(signature,verbs.length);out.signature=signature;out.currentRun=Math.max(1,Math.min(3,Number(out.currentRun)||1));out.runs=out.runs||{};
 for(const[runId,raw]of Object.entries(out.runs)){
  const run={...blankRun(verbs.length),...(raw||{})};run.tasks=run.tasks||{};run.awards={tasks:{},examPoints:0,...(run.awards||{})};run.awards.tasks=run.awards.tasks||{};run.exam={bestPercent:0,stars:0,session:null,...(run.exam||{})};
  for(const task of TASKS){const st=run.tasks[task]||blankTask(verbs.length);st.total=verbs.length;st.done=[...new Set((st.done||[]).filter(v=>verbs.includes(v)))];st.queue=[...new Set((st.queue||[]).filter(v=>verbs.includes(v)&&!st.done.includes(v)))];st.current=st.current&&verbs.includes(st.current)&&!st.done.includes(st.current)?st.current:null;run.tasks[task]=st}
  run.completed=TASKS.every(task=>(run.tasks[task]?.done||[]).length>=verbs.length)&&Number(run.exam.bestPercent||0)>=100;out.runs[runId]=run
 }
 if(!out.runs[String(out.currentRun)])out.runs[String(out.currentRun)]=blankRun(verbs.length);return out
}
function impliedHistoricalPoints(entries){
 let total=0;
 for(const[,gs]of entries||[]){
  const current=Math.max(1,Math.min(3,Number(gs?.currentRun)||1));
  const actual=groupPoints(gs);
  let required=0;
  if(current>=2)required+=TASKS.length*5+100;
  if(current>=3)required+=TASKS.length*10+200;
  const currentActual=runPoints(gs?.runs?.[String(current)]||{});
  total+=Math.max(actual,required+currentActual)
 }
 return total
}
function migrate({profile={},visible=[]}={}){
 activeProfile=profile||{};activeVisible=uniq(visible);
 const key=stateKey(activeProfile),state=readJSON(key)||{version:1,selectedGroup:1,groups:{}};state.groups=state.groups&&typeof state.groups==='object'?state.groups:{};
 const entries=Object.entries(state.groups),legacy=entries.filter(([sig])=>!String(sig).startsWith('release|'));
 const trusted=legacy.length?legacy:entries;
 preserveFloor(activeProfile,Math.max(statePoints(trusted),impliedHistoricalPoints(trusted)));
 const alreadySafe=Number(state.regroupRecoveryVersion||0)>=3;
 for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){
  const verbs=activeVisible.slice(i,i+GROUP_SIZE),signature='release|'+verbs.join('|');
  const exact=trusted.find(([sig,gs])=>sameSet(signatureVerbs(gs?.signature||sig),verbs));
  if(exact){state.groups[signature]=normalizeExact(exact[1],signature,verbs);continue}
  if(alreadySafe&&state.groups[signature]){state.groups[signature]=normalizeExact(state.groups[signature],signature,verbs);continue}
  // Eine neue gemischte Gruppe ist fachlich eine neue Gruppe. Alte Punkte bleiben
  // global erhalten, aber wir erfinden dafür keinen erledigten Aufgabenstand.
  state.groups[signature]=blankGroup(signature,verbs.length)
 }
 state.regroupRecoveryVersion=3;state.version=Math.max(1,Number(state.version)||1);writeJSON(key,state);scheduleScorePatch();scheduleCloudSync();return{restored:0,points:pointFloor(activeProfile)}
}
function activePoints(){
 if(!activeProfile)return 0;const state=readJSON(stateKey(activeProfile));if(!state?.groups)return 0;let sum=0;
 for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){const verbs=activeVisible.slice(i,i+GROUP_SIZE),sig='release|'+verbs.join('|');sum+=groupPoints(state.groups[sig])}
 return sum
}
function patchScore(){if(!activeProfile||!location.pathname.startsWith('/perfekt/'))return;const total=Math.max(pointFloor(activeProfile),activePoints());document.querySelectorAll('.compact-score h2').forEach(el=>{el.textContent=`${total} Punkte`})}
let scoreTimer=0;function scheduleScorePatch(){clearTimeout(scoreTimer);scoreTimer=setTimeout(patchScore,80)}
new MutationObserver(scheduleScorePatch).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('popstate',scheduleScorePatch);window.addEventListener('load',()=>{scheduleScorePatch();scheduleCloudSync()});
function fingerprint(state){const parts=[];for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){const verbs=activeVisible.slice(i,i+GROUP_SIZE),sig='release|'+verbs.join('|'),gs=state?.groups?.[sig];parts.push(sig,gs?.currentRun||1);for(const[runId,run]of Object.entries(gs?.runs||{})){parts.push(runId);TASKS.forEach(task=>parts.push(task,(run?.tasks?.[task]?.done||[]).length));parts.push('exam',run?.exam?.bestPercent||0,run?.exam?.stars||0)}}return parts.join('~')}
let syncing=false,syncTimer=0;function scheduleCloudSync(){clearTimeout(syncTimer);syncTimer=setTimeout(syncCloud,1200)}
async function syncCloud(){
 if(syncing||!activeProfile||!activeVisible.length)return;const state=readJSON(stateKey(activeProfile));if(!state?.groups)return;const fp=fingerprint(state),marker=localStorage.getItem(syncKey(activeProfile));if(marker===fp)return;syncing=true;
 try{
  if(!window.SPProgress)await import('/js/progress.js?v=perfekt-regroup-recovery3');const api=window.SPProgress;if(!api)return;
  for(let i=0;i<activeVisible.length;i+=GROUP_SIZE){
   const verbs=activeVisible.slice(i,i+GROUP_SIZE),groupId=Math.floor(i/GROUP_SIZE)+1,sig='release|'+verbs.join('|'),gs=state.groups[sig];if(!gs)continue;
   for(const[runId,run]of Object.entries(gs.runs||{})){
    localStorage.setItem(`SP_SCORE_RUN_perfekt-gruppe-${String(groupId).padStart(2,'0')}`,String(runId));
    for(const task of TASKS){const st=run?.tasks?.[task];if(!st)continue;const done=(st.done||[]).length,total=verbs.length;if(!done&&!Number(run?.awards?.tasks?.[task]||0))continue;await api.recordTaskProgress?.({module:'perfekt',moduleTitle:'Perfekt',level:'A1',lesson:`Gruppe ${groupId}`,theme:`Runde ${runId}`,topicId:`perfekt-gruppe-${String(groupId).padStart(2,'0')}`,title:`Perfekt · Gruppe ${groupId}`,file:task,taskKey:task,taskTitle:task,total,done,percent:total?Math.round(done/total*100):0,completed:total>0&&done>=total})}
    if(Number(run?.exam?.bestPercent||0)>0)await api.recordExamResult?.({module:'perfekt',moduleTitle:'Perfekt',level:'A1',lesson:`Gruppe ${groupId}`,theme:`Runde ${runId}`,topicId:`perfekt-gruppe-${String(groupId).padStart(2,'0')}`,title:`Perfekt · Gruppe ${groupId}`,percent:Number(run.exam.bestPercent)||0,stars:Number(run.exam.stars)||0})
   }
  }
  localStorage.setItem(syncKey(activeProfile),fp)
 }catch(error){console.warn('Perfekt-Fortschritt konnte nicht vollständig synchronisiert werden',error)}finally{syncing=false}
}
document.addEventListener('click',()=>{scheduleScorePatch();setTimeout(scheduleCloudSync,700)});document.addEventListener('keydown',event=>{if(event.key==='Enter')setTimeout(scheduleCloudSync,800)});
window.SPPerfektRegroupRecovery={migrate,pointFloor:()=>activeProfile?pointFloor(activeProfile):0,preserveFloor:value=>activeProfile?preserveFloor(activeProfile,value):0,activePoints,syncCloud};
})();
