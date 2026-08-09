(function(){
'use strict';
if(window.__SP_PERFEKT_GROUP_STABILITY_FINAL_V1)return;
window.__SP_PERFEKT_GROUP_STABILITY_FINAL_V1=true;

const GROUP_SIZE=20;
const TASKS=['cards','inf-perfect','perfect-inf','listen','image-perfect','build','auxiliary','write','speak','sentence'];
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');
const uniq=list=>{const seen=new Set(),out=[];for(const raw of list||[]){const v=String(raw||'').trim(),k=clean(v);if(v&&k&&!seen.has(k)){seen.add(k);out.push(v)}}return out};
function userSlug(profile={}){return[profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function stateKey(profile){return`SP_PERFEKT_STABLE_${userSlug(profile)}`}
function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function signature(verbs){return'release|'+verbs.join('|')}
function runComplete(run,total){
 if(!run)return false;
 const tasksOk=TASKS.every(task=>Array.isArray(run.tasks?.[task]?.done)&&run.tasks[task].done.length>=total);
 return tasksOk&&Number(run.exam?.bestPercent||0)>=100;
}
function sanitize(profile,visible){
 const key=stateKey(profile),state=read(key);if(!state?.groups)return 0;
 const list=uniq(visible),recovery=window.SPPerfektRegroupRecovery;
 let changed=0;
 for(let i=0;i<list.length;i+=GROUP_SIZE){
  const verbs=list.slice(i,i+GROUP_SIZE),sig=signature(verbs),gs=state.groups[sig];if(!gs)continue;
  const before=Math.max(1,Math.min(3,Number(gs.currentRun)||1));
  let maxAllowed=1;
  if(runComplete(gs.runs?.['1'],verbs.length))maxAllowed=2;
  if(maxAllowed>=2&&runComplete(gs.runs?.['2'],verbs.length))maxAllowed=3;
  const next=Math.min(before,maxAllowed);
  if(next===before)continue;
  try{recovery?.preserveFloor?.(0)}catch{}
  gs.currentRun=next;
  for(let run=next+1;run<=3;run++)delete gs.runs?.[String(run)];
  changed++;
 }
 if(changed)write(key,state);
 window.SP_PERFEKT_GROUP_STABILITY_SANITIZED=changed;
 return changed;
}

const recovery=window.SPPerfektRegroupRecovery;
if(recovery?.migrate&&!recovery.__groupStabilityFinalV1){
 recovery.__groupStabilityFinalV1=true;
 const original=recovery.migrate.bind(recovery);
 recovery.migrate=async function(args={}){
  const result=await original(args);
  const sanitized=sanitize(args.profile||{},args.visible||[]);
  return{...(result||{}),sanitizedRounds:sanitized};
 };
}

window.SPPerfektGroupStabilityFinal={sanitize};
})();
