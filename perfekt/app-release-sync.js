import{getActiveProfile,getActiveRole}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,releasedVerbs}from'/js/course-releases.js?v=verb-release-order1';

const GROUP_SIZE=20;
const profile=getActiveProfile()||{};
let preview=String(getActiveRole()||'').toLowerCase()==='teacher';
try{
 const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');
 if(raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true)preview=true;
}catch{}

function uniq(list){
 const seen=new Set(),out=[];
 (list||[]).forEach(value=>{
  const verb=String(typeof value==='string'?value:value?.v||'').trim();
  if(verb&&!seen.has(verb)){seen.add(verb);out.push(verb)}
 });
 return out;
}
function releaseOrder(data){
 const candidates=[
  data?.verbReleaseOrder,
  data?.releases?.Verben?.wordOrder,
  data?.releases?.verben?.wordOrder,
  data?.releases?.['Verben A1']?.wordOrder,
  data?.releases?.['verben-A1']?.wordOrder
 ];
 return uniq(candidates.find(Array.isArray)||[]);
}
function orderedReleased(data,all){
 const active=preview?all.slice():releasedVerbs(data,all);
 const activeSet=new Set(active),seen=new Set(),out=[];
 releaseOrder(data).forEach(v=>{
  if(activeSet.has(v)&&!seen.has(v)){seen.add(v);out.push(v)}
 });
 active.forEach(v=>{
  if(!seen.has(v)){seen.add(v);out.push(v)}
 });
 return out;
}
function installVisibleCatalog(visible){
 if(window.SP_VERB_GROUP_DATA){
  window.SP_VERB_GROUP_DATA={...window.SP_VERB_GROUP_DATA,groupSize:GROUP_SIZE,verbs:visible.slice()};
 }
 if(Array.isArray(window.ALL_VERBS)){
  const byVerb=new Map(window.ALL_VERBS.map(item=>[String(item?.v||item||'').trim(),item]));
  window.ALL_VERBS=visible.map(v=>{
   const item=byVerb.get(v);
   return typeof item==='object'&&item?{...item,v}:{v};
  });
 }
}

const completeCatalog=uniq(window.SP_VERB_GROUP_DATA?.verbs||window.VerbGroupsEngine?.ALL||[]);
let assignments={};
try{assignments=await loadCourseRelease(profile)||{}}catch{}
const ordered=orderedReleased(assignments,completeCatalog);
const fullCount=Math.floor(ordered.length/GROUP_SIZE)*GROUP_SIZE;
const visible=ordered.slice(0,fullCount);
const pending=ordered.slice(fullCount);
installVisibleCatalog(visible);
window.SP_PERFEKT_PENDING={verbs:pending.slice(),count:pending.length,needed:pending.length?GROUP_SIZE-pending.length:0};
window.SP_PERFEKT_RELEASE_SYNC={groupSize:GROUP_SIZE,visible:visible.slice(),pending:pending.slice(),releaseOrder:ordered.slice(),mirrorsVerben:true};

// app-stable.js sortiert Perfekt intern noch nach Verbtypen. Nur während dieses
// Gruppenaufbaus ersetzen wir die alten Teilgruppen durch die Freigabereihenfolge.
const originalPush=Array.prototype.push;
let groupBuildIntercepted=false;
let restoreScheduled=false;
function isLegacyPerfektGroup(value){
 return !!(value&&typeof value==='object'&&Array.isArray(value.verbs)&&
  ['regular','strong','middle','separable'].includes(value.category)&&
  typeof value.signature==='string');
}
Array.prototype.push=function(...items){
 if(location.pathname.startsWith('/perfekt/')&&items.length===1&&isLegacyPerfektGroup(items[0])){
  if(!groupBuildIntercepted){
   groupBuildIntercepted=true;
   for(let i=0;i<visible.length;i+=GROUP_SIZE){
    const verbs=visible.slice(i,i+GROUP_SIZE);
    originalPush.call(this,{
     id:this.length+1,
     category:'mixed',
     title:'Verben',
     verbs,
     signature:'release|'+verbs.join('|')
    });
   }
  }
  if(!restoreScheduled){
   restoreScheduled=true;
   setTimeout(()=>{if(Array.prototype.push!==originalPush)Array.prototype.push=originalPush},0);
  }
  return this.length;
 }
 return originalPush.apply(this,items);
};

try{
 await import('./app-stable.js?v=perfekt-release-sync2');
}finally{
 // Die zweite Freigabeabfrage in app-stable kann bis zu einige Sekunden dauern.
 // Der Hook bleibt deshalb nur als Sicherheitsnetz etwas länger aktiv und wird
 // spätestens danach garantiert zurückgesetzt.
 setTimeout(()=>{if(Array.prototype.push!==originalPush)Array.prototype.push=originalPush},6000);
}
