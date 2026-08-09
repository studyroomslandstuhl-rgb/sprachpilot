import{getActiveProfile,getActiveRole}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,releasedVerbs}from'/js/course-releases.js?v=verb-release-order5';

const GROUP_SIZE=20;
const profile=getActiveProfile()||{};
let preview=String(getActiveRole()||'').toLowerCase()==='teacher';
try{const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');if(raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true)preview=true}catch{}
function uniq(list){const seen=new Set(),out=[];(list||[]).forEach(value=>{const verb=String(typeof value==='string'?value:value?.v||'').trim();if(verb&&!seen.has(verb)){seen.add(verb);out.push(verb)}});return out}
function releaseOrder(data){
 const candidates=[data?.verbReleaseOrder,data?.releases?.Verben?.wordOrder,data?.releases?.verben?.wordOrder,data?.releases?.['Verben A1']?.wordOrder,data?.releases?.['verben-A1']?.wordOrder]
  .filter(Array.isArray).map(uniq).filter(list=>list.length);
 if(!candidates.length)return[];
 const votes=new Map();
 for(const list of candidates){const key=list.join('\u0001'),entry=votes.get(key)||{list,count:0};entry.count++;votes.set(key,entry)}
 return [...votes.values()].sort((a,b)=>b.count-a.count||b.list.length-a.list.length)[0].list.slice()
}
function orderedReleased(data,all){
 const active=preview?all.slice():releasedVerbs(data,all);if(preview)return uniq(active);
 const activeList=uniq(active),activeSet=new Set(activeList),allowed=new Set(all),savedOrder=releaseOrder(data),explicit=savedOrder.filter(v=>allowed.has(v)&&activeSet.has(v));
 if(savedOrder.length){
  const seen=new Set(explicit);
  for(const verb of activeList){if(allowed.has(verb)&&!seen.has(verb)){seen.add(verb);explicit.push(verb)}}
  return uniq(explicit)
 }
 return uniq(all.filter(v=>activeSet.has(v)))
}
function installVisibleCatalog(visible){
 if(window.SP_VERB_GROUP_DATA)window.SP_VERB_GROUP_DATA={...window.SP_VERB_GROUP_DATA,groupSize:GROUP_SIZE,verbs:visible.slice()};
 if(Array.isArray(window.ALL_VERBS)){const byVerb=new Map(window.ALL_VERBS.map(item=>[String(item?.v||item||'').trim(),item]));window.ALL_VERBS=visible.map(v=>{const item=byVerb.get(v);return typeof item==='object'&&item?{...item,v}:{v}})}
}
const completeCatalog=uniq(window.SP_VERB_GROUP_DATA?.verbs||window.VerbGroupsEngine?.ALL||[]);
let assignments={};try{assignments=await loadCourseRelease(profile)||{}}catch{}
const ordered=orderedReleased(assignments,completeCatalog),visible=ordered.slice();installVisibleCatalog(visible);
window.SP_PERFEKT_PENDING={verbs:[],count:0,needed:0};
window.SP_PERFEKT_RELEASE_SYNC={groupSize:GROUP_SIZE,visible:visible.slice(),pending:[],releaseOrder:ordered.slice(),mirrorsVerben:true,partialLastGroup:visible.length%GROUP_SIZE};
if(!preview){
 try{await window.SPPerfektRegroupRecovery?.migrate?.({profile,visible})}
 catch(error){console.warn('Alter Perfekt-Fortschritt konnte nicht vollständig übernommen werden',error)}
}

const originalPush=Array.prototype.push;let groupBuildIntercepted=false,restoreScheduled=false;
function isLegacyPerfektGroup(value){return !!(value&&typeof value==='object'&&Array.isArray(value.verbs)&&['regular','strong','middle','separable'].includes(value.category)&&typeof value.signature==='string')}
Array.prototype.push=function(...items){
 if(location.pathname.startsWith('/perfekt/')&&items.length===1&&isLegacyPerfektGroup(items[0])){
  if(!groupBuildIntercepted){groupBuildIntercepted=true;for(let i=0;i<visible.length;i+=GROUP_SIZE){const verbs=visible.slice(i,i+GROUP_SIZE);originalPush.call(this,{id:this.length+1,category:'mixed',title:'Verben',verbs,signature:'release|'+verbs.join('|')})}}
  if(!restoreScheduled){restoreScheduled=true;setTimeout(()=>{if(Array.prototype.push!==originalPush)Array.prototype.push=originalPush},0)}
  return this.length
 }
 return originalPush.apply(this,items)
};
try{await import('./app-stable.js?v=perfekt-progress-restore7')}finally{setTimeout(()=>{if(Array.prototype.push!==originalPush)Array.prototype.push=originalPush},6000)}