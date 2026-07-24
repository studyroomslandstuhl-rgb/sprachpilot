(function(){
'use strict';

const PREFIX='SP_PERFEKT_STABLE_';
const STABLE_PREFIX='SP_PERFEKT_STABLE_V3_';
const TASKS=['cards','inf-perfect','perfect-inf','listen','image-perfect','build','auxiliary','write','speak','sentence'];
const nativeGet=Storage.prototype.getItem;
const nativeSet=Storage.prototype.setItem;
const nativeKey=Storage.prototype.key;
const nativeLength=Object.getOwnPropertyDescriptor(Storage.prototype,'length')?.get;

const slug=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const parse=value=>{try{const data=JSON.parse(value||'null');return data&&typeof data==='object'&&data.groups&&typeof data.groups==='object'?data:null}catch{return null}};
const profile=()=>{try{return JSON.parse(nativeGet.call(localStorage,'SP_USER_PROFILE')||nativeGet.call(localStorage,'SP_STUDENT_PROFILE')||'null')||{}}catch{return {}}};
const isPreview=()=>{const p=profile(),role=String(nativeGet.call(localStorage,'SP_LOGIN_ROLE')||nativeGet.call(localStorage,'SP_ACTIVE_ROLE')||p.role||'').toLowerCase();return role==='teacher'||role==='lehrer'||p.teacherPreview===true||p.isTeacher===true};
const identity=()=>{const p=profile();return slug(p.studentId||p.userId||p.docId||p.email)||'student'};
const stableKey=()=>STABLE_PREFIX+identity();
const legacySlug=()=>{const p=profile();return [p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'};
const legacyKey=()=>PREFIX+legacySlug();

function relatedKeys(){
 const p=profile(),tokens=[p.studentId,p.userId,p.docId,p.email].map(slug).filter(token=>token.length>=3),keys=[stableKey(),legacyKey()];
 const length=nativeLength?nativeLength.call(localStorage):localStorage.length;
 for(let i=0;i<length;i++){
  const key=String(nativeKey.call(localStorage,i)||'');
  if(!key.startsWith(PREFIX))continue;
  const normalized=slug(key);
  if(tokens.some(token=>normalized.includes(token)))keys.push(key)
 }
 return[...new Set(keys)]
}

const blankTask=total=>({total,done:[],queue:[],current:null,tries:0,hadWrong:false});
const blankRun=()=>({tasks:{},exam:{bestPercent:0,stars:0,session:null},awards:{tasks:{},examPoints:0},completed:false});
const blankGroup=signature=>({signature,currentRun:1,runs:{'1':blankRun()}});
const blankState=()=>({version:3,selectedGroup:1,groups:{},archivedPoints:0,archivedSignatures:{}});

function mergeRun(left,right){
 const result={...blankRun(),...(left||{})},incoming=right||{};
 result.tasks=result.tasks||{};
 for(const task of TASKS){
  const a=result.tasks[task]||blankTask(0),b=incoming.tasks?.[task]||blankTask(0),done=[...new Set([...(a.done||[]),...(b.done||[])])];
  result.tasks[task]={total:Math.max(Number(a.total)||0,Number(b.total)||0),done,queue:[...new Set([...(a.queue||[]),...(b.queue||[])])].filter(v=>!done.includes(v)),current:a.current||b.current||null,tries:Math.max(Number(a.tries)||0,Number(b.tries)||0),hadWrong:!!(a.hadWrong||b.hadWrong)}
 }
 result.exam={bestPercent:Math.max(Number(result.exam?.bestPercent)||0,Number(incoming.exam?.bestPercent)||0),stars:Math.max(Number(result.exam?.stars)||0,Number(incoming.exam?.stars)||0),session:null};
 result.awards={tasks:{...(incoming.awards?.tasks||{}),...(result.awards?.tasks||{})},examPoints:Math.max(Number(result.awards?.examPoints)||0,Number(incoming.awards?.examPoints)||0)};
 for(const task of TASKS)result.awards.tasks[task]=Math.max(Number(left?.awards?.tasks?.[task])||0,Number(right?.awards?.tasks?.[task])||0);
 result.completed=!!(result.completed||incoming.completed);
 return result
}

function mergeState(left,right){
 if(!left)return right;
 if(!right)return left;
 const result={...blankState(),...left,groups:{...(left.groups||{})},archivedPoints:Math.max(Number(left.archivedPoints)||0,Number(right.archivedPoints)||0),archivedSignatures:{...(left.archivedSignatures||{}),...(right.archivedSignatures||{})}};
 for(const [signature,incoming]of Object.entries(right.groups||{})){
  const existing=result.groups[signature];
  if(!existing){result.groups[signature]=incoming;continue}
  const merged={...existing,signature:existing.signature||incoming.signature||signature,currentRun:Math.max(Number(existing.currentRun)||1,Number(incoming.currentRun)||1),runs:{...(existing.runs||{})}};
  for(const [runId,run]of Object.entries(incoming.runs||{}))merged.runs[runId]=mergeRun(merged.runs[runId],run);
  result.groups[signature]=merged
 }
 return result
}

function hasReleaseData(data){return !!(data&&typeof data==='object'&&(data.enabledModules||data.enabledWords||data.releases||data.releaseMode||data.defaultLocked!==undefined))}
function defaultOpen(data){return data?.releaseMode==='all'||data?.releaseMode==='open'||data?.defaultLocked===false}
function moduleExplicitOff(data){const names=['Verben','verben','Verben A1','verben-A1','Verben Test','verben-test'],values=names.flatMap(name=>[data?.enabledModules?.[name],data?.releases?.[name]?.enabled]).filter(value=>value!==undefined);return !values.some(value=>value===true)&&values.some(value=>value===false)}
function verbOpen(data,verb){
 if(isPreview())return true;
 if(!hasReleaseData(data)||moduleExplicitOff(data))return false;
 const values=[data.enabledWords?.[verb],data.enabledWords?.[`verben/${verb}`],data.enabledWords?.[`Verben/${verb}`],data.enabledWords?.[`verben-A1/${verb}`],data.enabledWords?.[`Verben A1/${verb}`],data.releases?.verben?.words?.[verb],data.releases?.Verben?.words?.[verb],data.releases?.['verben-A1']?.words?.[verb],data.releases?.['Verben A1']?.words?.[verb]];
 if(values.some(value=>value===true))return true;
 if(values.some(value=>value===false))return false;
 return defaultOpen(data)
}

function currentGroups(){
 const engine=window.VerbGroupsEngine,all=[...new Set((window.SP_VERB_GROUP_DATA?.verbs||engine?.ALL||[]).filter(Boolean))],p=profile();
 let assignments=p.assignments||{};
 try{assignments=JSON.parse(nativeGet.call(localStorage,'SP_COURSE_RELEASES')||'null')||assignments}catch{}
 const verbs=isPreview()?all:all.filter(verb=>verbOpen(assignments,verb));
 const order=['reflexive','separable','strong','ieren','inseparable','weak'],byCategory=new Map(order.map(key=>[key,[]]));
 for(const verb of verbs){
  const label=engine?.groupLabel?.(verb)||'';
  let category='weak';
  if(String(verb).startsWith('sich '))category='reflexive';
  else if(label==='Trennbar')category='separable';
  else if(String(verb).replace(/^sich\s+/,'').endsWith('ieren')&&verb!=='verlieren')category='ieren';
  else if(label==='Unregelmäßig')category='strong';
  else if(label==='Nicht trennbar')category='inseparable';
  byCategory.get(category)?.push(verb)
 }
 const groups=[];
 for(const category of order){const list=byCategory.get(category)||[];for(let i=0;i<list.length;i+=20){const groupVerbs=list.slice(i,i+20);groups.push({signature:category+'|'+groupVerbs.join('|'),verbs:groupVerbs})}}
 return groups
}

const signatureVerbs=value=>String(value||'').split('|').slice(1).filter(Boolean);
function migrateGroups(raw){
 const state={...blankState(),...(raw||{}),groups:{...((raw||{}).groups||{})}};
 const sources=Object.entries(state.groups).map(([key,group])=>({key,group,verbs:signatureVerbs(group?.signature||key)}));
 for(const target of currentGroups()){
  if(state.groups[target.signature])continue;
  const overlaps=sources.filter(source=>source.verbs.some(verb=>target.verbs.includes(verb)));
  if(!overlaps.length)continue;
  const migrated=blankGroup(target.signature);migrated.currentRun=Math.max(1,...overlaps.map(source=>Number(source.group?.currentRun)||1));migrated.runs={};
  for(let runId=1;runId<=migrated.currentRun;runId++){
   const run=blankRun();
   for(const task of TASKS){const done=new Set();overlaps.forEach(source=>(source.group?.runs?.[String(runId)]?.tasks?.[task]?.done||[]).forEach(verb=>{if(target.verbs.includes(verb))done.add(verb)}));run.tasks[task]={...blankTask(target.verbs.length),done:target.verbs.filter(verb=>done.has(verb))}}
   const exact=overlaps.find(source=>source.verbs.length===target.verbs.length&&target.verbs.every(verb=>source.verbs.includes(verb)));
   if(exact){const oldRun=exact.group?.runs?.[String(runId)]||{};run.exam={...run.exam,...(oldRun.exam||{}),session:null};run.awards={tasks:{...(oldRun.awards?.tasks||{})},examPoints:Number(oldRun.awards?.examPoints)||0};run.completed=!!oldRun.completed}
   migrated.runs[String(runId)]=run
  }
  state.groups[target.signature]=migrated
 }
 state.version=3;
 return state
}

function prepare(){
 let merged=null;
 for(const key of relatedKeys())merged=mergeState(merged,parse(nativeGet.call(localStorage,key)));
 const state=migrateGroups(merged||blankState()),serialized=JSON.stringify(state);
 for(const key of relatedKeys())nativeSet.call(localStorage,key,serialized);
 nativeSet.call(localStorage,stableKey(),serialized);
 return serialized
}

let prepared='';
try{prepared=prepare()}catch(error){console.warn('Perfekt-Fortschritt konnte nicht vorbereitet werden',error)}

Storage.prototype.getItem=function(key){
 if(this===localStorage&&String(key).startsWith(PREFIX)){
  if(!prepared)try{prepared=prepare()}catch{}
  return nativeGet.call(this,stableKey())||prepared||nativeGet.call(this,key)
 }
 return nativeGet.call(this,key)
};
Storage.prototype.setItem=function(key,value){
 if(this===localStorage&&String(key).startsWith(PREFIX)){
  prepared=String(value);
  nativeSet.call(this,stableKey(),prepared);
  nativeSet.call(this,key,prepared);
  return
 }
 return nativeSet.call(this,key,value)
};

window.SP_PERFEKT_PROGRESS_STORAGE={stableKey:stableKey(),relatedKeys:relatedKeys()};
})();
