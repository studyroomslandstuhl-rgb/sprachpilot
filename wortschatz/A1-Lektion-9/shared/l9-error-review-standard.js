(function(){
'use strict';
if(window.__SP_L9_ERROR_REVIEW_STANDARD_V1)return;
window.__SP_L9_ERROR_REVIEW_STANDARD_V1=true;
const path=location.pathname.match(/A1-Lektion-9\/Thema-(\d+)/i);
const theme=path?Number(path[1]):0;
const taskId=String(new URLSearchParams(location.search).get('task')||'').trim().toLowerCase();
if(!theme||!taskId||['karteikarten','cards','memory','pruefung','exam'].includes(taskId))return;
const nativeSetItem=Storage.prototype.setItem;
let internal=false,reviewNoticeUntil=0;
function unique(values){return [...new Set((Array.isArray(values)?values:[]).map(String))]}
function reviewMap(value){const out={};if(value&&typeof value==='object'&&!Array.isArray(value))for(const[id,v]of Object.entries(value))if(v)out[String(id)]=true;return out}
function pendingMap(value){const out={};if(value&&typeof value==='object'&&!Array.isArray(value))for(const[id,v]of Object.entries(value)){const n=Number(v);if(n>0)out[String(id)]=n}return out}
function matches(key){const k=String(key||'').toLowerCase();return k.startsWith('sp_l9_')&&k.includes(`_t${theme}_`)&&k.endsWith('_'+taskId)}
function moveLast(order,id){const next=unique(order).filter(x=>x!==id);next.push(id);return next}
function transform(state){
 if(!state||typeof state!=='object')return state;
 state.done=unique(state.done);state.wrong=state.wrong&&typeof state.wrong==='object'?state.wrong:{};state.review=reviewMap(state.review);state.order=unique(state.order);state.__spReviewPending=pendingMap(state.__spReviewPending);
 const done=new Set(state.done),wrongNow=new Set();
 for(const[id,count]of Object.entries(state.wrong))if(Number(count)>0){wrongNow.add(id);state.review[id]=true;state.__spReviewPending[id]=1;done.delete(id)}
 for(const[id,stageRaw]of Object.entries({...state.__spReviewPending})){
  if(wrongNow.has(id))continue;
  const stage=Number(stageRaw)||1;
  if(stage===1&&done.has(id)){done.delete(id);state.review[id]=true;state.__spReviewPending[id]=2;state.order=moveLast(state.order,id);reviewNoticeUntil=Date.now()+1400}
  else if(stage>=2&&done.has(id)){delete state.__spReviewPending[id];delete state.review[id];delete state.wrong[id]}
 }
 state.done=[...done];state.__spReviewSchema=1;return state;
}
Storage.prototype.setItem=function(key,value){if(internal||!matches(key))return nativeSetItem.apply(this,arguments);let next=value;try{const state=JSON.parse(String(value||'null'));if(state&&typeof state==='object')next=JSON.stringify(transform(state))}catch(e){}return nativeSetItem.call(this,key,next)};
function migrate(){for(const storage of[sessionStorage,localStorage])try{for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!matches(key))continue;const state=JSON.parse(storage.getItem(key)||'null');if(!state||typeof state!=='object')continue;internal=true;nativeSetItem.call(storage,key,JSON.stringify(transform(state)));internal=false}}catch(e){internal=false}}
function feedback(){if(Date.now()>reviewNoticeUntil)return;const box=[...document.querySelectorAll('.l8-feedback.good')].at(-1);if(!box)return;if(/^Richtig!?$/i.test(String(box.textContent||'').trim()))box.textContent='Richtig korrigiert. Dieses Item kommt am Ende noch einmal.';reviewNoticeUntil=0}
migrate();const root=document.getElementById('app')||document.body;try{new MutationObserver(feedback).observe(root,{childList:true,subtree:true})}catch(e){}
window.L9ErrorReviewStandard={version:1,theme,taskId,transform};
})();
