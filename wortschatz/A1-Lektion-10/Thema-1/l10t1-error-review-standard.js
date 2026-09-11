(function(){
'use strict';
if(window.__SP_L10T1_ERROR_REVIEW_STANDARD_V1)return;
window.__SP_L10T1_ERROR_REVIEW_STANDARD_V1=true;
const taskId=String(new URLSearchParams(location.search).get('task')||'').trim().toLowerCase();
const nativeRepeat=new Set(['karteikarten','cards','memory','artikel-sortieren','gesicht-koerper','pruefung','exam']);
if(!taskId||nativeRepeat.has(taskId))return;

const previousSetItem=Storage.prototype.setItem;
let internalWrite=false,reviewNoticeUntil=0;
function keyName(){return `sp_l10_t1_${taskId}`}
function matchesKey(key){return String(key||'').toLowerCase()===keyName()}
function ids(v){return [...new Set((Array.isArray(v)?v:[]).map(x=>String(x)))]}
function reviewMap(v){const out={};if(v&&typeof v==='object'&&!Array.isArray(v))for(const[k,n]of Object.entries(v))if(Number(n)>0)out[String(k)]=Number(n);return out}
function moveEnd(order,id){const a=ids(order).filter(x=>x!==id);a.push(id);return a}
function transform(state){
 if(!state||typeof state!=='object')return state;
 state.done=ids(state.done);state.order=ids(state.order);state.wrong=state.wrong&&typeof state.wrong==='object'?state.wrong:{};state._reviewPending=reviewMap(state._reviewPending);state._everWrong=state._everWrong&&typeof state._everWrong==='object'?state._everWrong:{};state._reviewSchema=1;
 const done=new Set(state.done),wrongNow=new Set();
 for(const[id,n]of Object.entries(state.wrong))if(Number(n)>0){wrongNow.add(String(id));state._reviewPending[String(id)]=1;state._everWrong[String(id)]=true;done.delete(String(id))}
 for(const[id,stageRaw]of Object.entries({...state._reviewPending})){
  const stage=Number(stageRaw)||1;if(wrongNow.has(id))continue;
  if(stage===1&&done.has(id)){done.delete(id);state._reviewPending[id]=2;state.order=moveEnd(state.order,id);reviewNoticeUntil=Date.now()+1400}
  else if(stage>=2&&done.has(id)){delete state._reviewPending[id];delete state.wrong[id]}
 }
 if(Array.isArray(state.firstCorrect))state.firstCorrect=state.firstCorrect.map(String).filter(id=>!state._everWrong[id]);
 state.done=[...done];return state;
}
Storage.prototype.setItem=function(key,value){
 if(internalWrite||!matchesKey(key))return previousSetItem.apply(this,arguments);
 let next=value;try{const s=JSON.parse(String(value||'null'));if(s&&typeof s==='object')next=JSON.stringify(transform(s))}catch(e){}
 return previousSetItem.call(this,key,next);
};
function readState(){try{const raw=localStorage.getItem(`SP_L10_T1_${taskId}`),state=JSON.parse(raw||'null');return state&&typeof state==='object'?state:null}catch(e){return null}}
function currentId(state){if(!state)return'';const order=ids(state.order),done=new Set(ids(state.done));return order.find(id=>!done.has(id))||''}
function markCurrentWrong(){
 const state=readState(),id=currentId(state);if(!state||!id)return;
 state.wrong=state.wrong&&typeof state.wrong==='object'?state.wrong:{};state._reviewPending=reviewMap(state._reviewPending);state._everWrong=state._everWrong&&typeof state._everWrong==='object'?state._everWrong:{};
 state.wrong[id]=Math.max(1,Number(state.wrong[id])||0);state._reviewPending[id]=1;state._everWrong[id]=true;state.done=ids(state.done).filter(x=>x!==id);if(Array.isArray(state.firstCorrect))state.firstCorrect=state.firstCorrect.map(String).filter(x=>x!==id);state._reviewSchema=1;
 try{internalWrite=true;previousSetItem.call(localStorage,`SP_L10_T1_${taskId}`,JSON.stringify(state))}catch(e){}finally{internalWrite=false}
}
function scanWrong(){
 const bad=[...document.querySelectorAll('.l10-feedback.bad,.l8-feedback.bad,button.wrong,.l8-option.wrong')].find(el=>el.dataset.spReviewMarked!=='1');
 if(!bad)return;bad.dataset.spReviewMarked='1';markCurrentWrong();
}
function fixFeedback(){if(Date.now()>reviewNoticeUntil)return;const boxes=[...document.querySelectorAll('.l10-feedback.ok,.l8-feedback.good')],box=boxes.at(-1);if(!box)return;const t=String(box.textContent||'').trim();if(t&&!/kommt am Ende noch einmal/i.test(t)){box.textContent=t+' Diese Aufgabe kommt am Ende noch einmal.';reviewNoticeUntil=0}}
function scan(){scanWrong();fixFeedback()}
const root=document.getElementById('app')||document.body;try{new MutationObserver(scan).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})}catch(e){}
[0,80,250,700].forEach(ms=>setTimeout(scan,ms));
window.L10T1ErrorReviewStandard={version:1,taskId,scan};
})();
