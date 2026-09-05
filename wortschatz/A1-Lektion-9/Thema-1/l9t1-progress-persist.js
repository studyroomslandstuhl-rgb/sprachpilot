(function(){
'use strict';
if(window.L9T1ProgressPersistence)return;
const D=window.L9T1;if(!D)return;
const TOPIC='wortschatz-a1-lektion-9-thema-1';
const nativeGet=Storage.prototype.getItem;
const nativeSet=Storage.prototype.setItem;
const nativeRemove=Storage.prototype.removeItem;
const syncTimers=new Map();
let importingProgress=false;

function parseJson(raw,fallback=null){try{return JSON.parse(raw)}catch(e){return fallback}}
function profile(){return parseJson(nativeGet.call(localStorage,'SP_USER_PROFILE')||nativeGet.call(localStorage,'SP_STUDENT_PROFILE')||'{}',{})||{}}
function normOwner(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function ownerAliases(){
 const p=profile();
 const values=[p.canonicalStudentId,p.docId,p.studentId,p.userId,p.authUid,p.uid,p.id,p.email,nativeGet.call(localStorage,'SP_STUDENT_ID')];
 const out=[];for(const value of values){const x=normOwner(value);if(x&&!out.includes(x))out.push(x)}
 const frozen=normOwner(nativeGet.call(sessionStorage,'SP_L9_T1_OWNER'));
 if(frozen&&!out.includes(frozen))out.unshift(frozen);
 if(!out.length)out.push('student');
 return out;
}
function canonicalOwner(){
 const aliases=ownerAliases();
 const specific=aliases.find(x=>x&&x!=='student')||aliases[0]||'student';
 if(specific!=='student')nativeSet.call(sessionStorage,'SP_L9_T1_OWNER',specific);
 return specific;
}
function isPreview(){
 try{
  const role=String(nativeGet.call(localStorage,'SP_LOGIN_ROLE')||nativeGet.call(localStorage,'SP_ACTIVE_ROLE')||'').toLowerCase();
  return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||nativeGet.call(sessionStorage,'SP_TEACHER_PREVIEW')==='1'||nativeGet.call(localStorage,'SP_TEACHER_PREVIEW')==='1';
 }catch(e){return false}
}
function parseTaskKey(key){
 const m=String(key||'').match(/^SP_L9_(.+)_T1_(.+)$/);if(!m)return null;
 return {owner:normOwner(m[1]),task:String(m[2]||'')};
}
function canonicalKey(task){return `SP_L9_${canonicalOwner()}_T1_${task}`}
function previewKey(task){return `SP_L9P_${canonicalOwner()}_T1_${task}`}
function uniq(arr){return [...new Set((arr||[]).filter(v=>v!==undefined&&v!==null).map(String))]}
function mergeObjMax(a={},b={}){const out={...a};for(const[k,v]of Object.entries(b||{})){if(typeof v==='number')out[k]=Math.max(Number(out[k]||0),v);else if(typeof v==='boolean')out[k]=!!(out[k]||v);else if(out[k]===undefined)out[k]=v}return out}
function mergeState(a,b){
 if(!a)return b;if(!b)return a;
 const out={...a,...b};
 out.done=uniq([...(a.done||[]),...(b.done||[])]);
 out.firstSeen=uniq([...(a.firstSeen||[]),...(b.firstSeen||[])]);
 out.firstCorrect=uniq([...(a.firstCorrect||[]),...(b.firstCorrect||[])]);
 out.wrong=mergeObjMax(a.wrong||{},b.wrong||{});
 out.review=mergeObjMax(a.review||{},b.review||{});
 out.reviewFirstCorrect=mergeObjMax(a.reviewFirstCorrect||{},b.reviewFirstCorrect||{});
 out.answers={...(a.answers||{}),...(b.answers||{})};
 out.total=Math.max(Number(a.total||0),Number(b.total||0))||out.total;
 return out;
}
function stateFrom(raw){const x=parseJson(raw,null);return x&&typeof x==='object'&&!Array.isArray(x)?x:null}
function allowedOwner(owner){
 const aliases=ownerAliases();
 if(aliases.includes(owner))return true;
 return owner==='student'&&nativeGet.call(sessionStorage,'SP_L9_T1_USED_GENERIC')==='1';
}
function collect(task,store){
 let merged=null;
 try{
  for(let i=0;i<store.length;i++){
   const key=String(store.key(i)||''),parsed=parseTaskKey(key);if(!parsed||parsed.task!==task||!allowedOwner(parsed.owner))continue;
   merged=mergeState(merged,stateFrom(nativeGet.call(store,key)));
  }
 }catch(e){}
 if(store===localStorage)merged=mergeState(merged,stateFrom(nativeGet.call(localStorage,canonicalKey(task))));
 if(store===sessionStorage&&isPreview())merged=mergeState(merged,stateFrom(nativeGet.call(localStorage,previewKey(task))));
 return merged;
}
function idsFor(t){
 if(!t)return[];
 switch(t.kind){
  case'cards':return (D.cards||[]).map(x=>x.id);
  case'listen':return (D.listen||[]).map(x=>x.id);
  case'defs':return (D.defs||[]).map(x=>x.id);
  case'speak':return (D.speak||[]).map(x=>x.id);
  case'forms':return (D.forms||[]).map(x=>x.id);
  case'gaps':return (D.gaps||[]).map(x=>x.id);
  case'modals':return (D.modals||[]).map(x=>x.id);
  case'sequences':return (D.sequences||[]).map(x=>x.id);
  case'writing':return (D.writing||[]).flatMap(x=>(x.steps||[]).map(s=>s.id));
  case'cloze':return (D.cloze||[]).flatMap((x,i)=>(x.answers||[]).map((_,j)=>`c${i}-${j}`));
  case'exam':return (D.exam||[]).map(x=>x.id);
  default:return[];
 }
}
function taskDef(task){return (D.tasks||[]).find(t=>String(t.id)===String(task))||null}
function queueProgress(method,payload){
 if(isPreview())return;
 if(window.SPProgress&&typeof window.SPProgress[method]==='function'){
  try{const p=window.SPProgress[method](payload);p?.then?.(()=>nativeSet.call(localStorage,'SP_L9_T1_LAST_SYNC_CONFIRMED',new Date().toISOString())).catch?.(()=>{})}catch(e){}
  return;
 }
 window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];
 window.SP_PROGRESS_QUEUE.push({method,payload});
 if(!importingProgress){importingProgress=true;import('/js/progress.js?v=20260831-central6').catch(()=>{}).finally(()=>{importingProgress=false})}
}
function syncNow(task,state=null){
 if(isPreview())return;
 const t=taskDef(task);if(!t||t.exam)return;
 state=state||collect(task,localStorage)||{};
 const ids=idsFor(t),total=ids.length||Number(state.total||0),done=Array.isArray(state.done)?state.done.filter(id=>!ids.length||ids.includes(id)).length:Math.max(0,Number(state.done)||0);
 if(!total)return;
 const percent=Math.max(0,Math.min(100,Math.round(done/total*100)));
 nativeSet.call(localStorage,'SP_L9_T1_LAST_SYNC_REQUEST',JSON.stringify({task,done,total,percent,at:new Date().toISOString()}));
 queueProgress('recordTaskProgress',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:9,theme:1,topicId:TOPIC,title:'A1 Lektion 9 · Thema 1',file:`task.html?task=${task}`,taskKey:task,taskTitle:t.title||task,total,done,percent,completed:percent>=100});
}
function scheduleSync(task,state){
 if(isPreview())return;
 clearTimeout(syncTimers.get(task));
 syncTimers.set(task,setTimeout(()=>{syncTimers.delete(task);syncNow(task,state)},120));
}
function persistCanonical(task,state,sourceStore){
 if(!state)return;
 const owner=canonicalOwner();
 if(owner==='student')nativeSet.call(sessionStorage,'SP_L9_T1_USED_GENERIC','1');
 if(isPreview()){
  nativeSet.call(localStorage,previewKey(task),JSON.stringify(state));
  return;
 }
 const key=`SP_L9_${owner}_T1_${task}`;
 const existing=stateFrom(nativeGet.call(localStorage,key));
 const merged=mergeState(existing,state)||state;
 nativeSet.call(localStorage,key,JSON.stringify(merged));
 scheduleSync(task,merged);
}

Storage.prototype.getItem=function(key){
 const raw=nativeGet.apply(this,arguments),parsed=parseTaskKey(key);
 if(!parsed)return raw;
 const merged=mergeState(stateFrom(raw),collect(parsed.task,this));
 return merged?JSON.stringify(merged):raw;
};
Storage.prototype.setItem=function(key,value){
 const result=nativeSet.apply(this,arguments),parsed=parseTaskKey(key);
 if(!parsed)return result;
 if(parsed.owner==='student')nativeSet.call(sessionStorage,'SP_L9_T1_USED_GENERIC','1');
 const state=stateFrom(value);if(state)persistCanonical(parsed.task,state,this);
 try{window.dispatchEvent(new CustomEvent('sprachpilot-progress',{detail:{lesson:9,theme:1,task:parsed.task,state}}))}catch(e){}
 return result;
};

function migrateTask(task){
 const store=isPreview()?sessionStorage:localStorage;
 const state=collect(task,store);if(!state)return;
 persistCanonical(task,state,store);
 if(isPreview()){
  const requestKey=`SP_L9_${canonicalOwner()}_T1_${task}`;
  nativeSet.call(sessionStorage,requestKey,JSON.stringify(state));
 }
}
function migrateAll(){for(const t of (D.tasks||[]))migrateTask(t.id)}
function syncAll(){if(isPreview())return;for(const t of (D.tasks||[]))if(!t.exam){const state=collect(t.id,localStorage);if(state)syncNow(t.id,state)}}
function flush(){for(const[task,timer]of syncTimers){clearTimeout(timer);syncTimers.delete(task);syncNow(task)}syncAll()}
function clearLocal(){
 const aliases=new Set(ownerAliases());aliases.add(canonicalOwner());
 for(const store of [localStorage,sessionStorage]){const keys=[];for(let i=0;i<store.length;i++){const key=String(store.key(i)||''),p=parseTaskKey(key);if(p&&aliases.has(p.owner))keys.push(key)}keys.forEach(k=>nativeRemove.call(store,k))}
 for(const t of (D.tasks||[]))nativeRemove.call(localStorage,previewKey(t.id));
}

migrateAll();
setTimeout(migrateAll,100);setTimeout(()=>{migrateAll();syncAll()},500);setTimeout(syncAll,1600);
window.addEventListener('SP_PROFILE_SYNCED',()=>setTimeout(()=>{migrateAll();syncAll()},0));
window.addEventListener('pagehide',flush);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
window.L9T1ProgressPersistence={version:'1.0',migrateAll,syncAll,syncNow,flush,clearLocal,canonicalOwner};
})();
