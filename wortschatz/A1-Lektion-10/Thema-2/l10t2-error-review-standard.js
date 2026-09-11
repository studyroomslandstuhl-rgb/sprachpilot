(function(){
'use strict';
if(window.__SP_L10T2_ERROR_REVIEW_STANDARD_V1)return;
window.__SP_L10T2_ERROR_REVIEW_STANDARD_V1=true;

const taskId=String(new URLSearchParams(location.search).get('task')||'').trim().toLowerCase();
if(!taskId)return;

const previousSetItem=Storage.prototype.setItem;
let reviewNoticeUntil=0;
let internalWrite=false;

function matchesKey(key){
 const k=String(key||'').toLowerCase();
 return k.startsWith('sp_l10_')&&k.includes('_t2_')&&k.endsWith('_'+taskId);
}
function ids(values){return [...new Set((Array.isArray(values)?values:[]).map(v=>String(v)))]}
function moveToEnd(order,id){
 const next=ids(order).filter(x=>x!==id);next.push(id);return next;
}
function normalizeReview(value){
 const out={};
 if(value&&typeof value==='object'&&!Array.isArray(value))for(const [k,v] of Object.entries(value)){const n=Number(v);if(n>0)out[String(k)]=n}
 return out;
}
function transformState(state){
 if(!state||typeof state!=='object')return state;
 state.done=ids(state.done);
 state.wrong=state.wrong&&typeof state.wrong==='object'?state.wrong:{};
 state.order=ids(state.order);
 state._reviewPending=normalizeReview(state._reviewPending);
 state._reviewSchema=1;
 const done=new Set(state.done);
 const wrongNow=new Set();
 for(const [id,count] of Object.entries(state.wrong)){
  if(Number(count)>0){
   wrongNow.add(String(id));
   state._reviewPending[String(id)]=1;
   state._hadError=true;
   done.delete(String(id));
  }
 }
 for(const [id,stageRaw] of Object.entries({...state._reviewPending})){
  const stage=Number(stageRaw)||1;
  if(wrongNow.has(id))continue;
  if(stage===1&&done.has(id)){
   // Erste richtige Antwort nach einem Fehler zählt noch nicht als erledigt.
   // Das Item wandert ans Ende und muss dort erneut fehlerfrei gelöst werden.
   done.delete(id);
   state._reviewPending[id]=2;
   state.order=moveToEnd(state.order,id);
   reviewNoticeUntil=Date.now()+1200;
  }else if(stage>=2&&done.has(id)){
   // Erst die fehlerfreie Wiederholung schließt das Item ab.
   delete state._reviewPending[id];
   delete state.wrong[id];
  }
 }
 state.done=[...done];
 return state;
}

Storage.prototype.setItem=function(key,value){
 if(internalWrite||!matchesKey(key))return previousSetItem.apply(this,arguments);
 let next=value;
 try{
  const state=JSON.parse(String(value||'null'));
  if(state&&typeof state==='object')next=JSON.stringify(transformState(state));
 }catch(e){}
 return previousSetItem.call(this,key,next);
};

function findState(){
 for(const storage of [sessionStorage,localStorage]){
  try{
   for(let i=0;i<storage.length;i++){
    const k=String(storage.key(i)||'');if(!matchesKey(k))continue;
    const state=JSON.parse(storage.getItem(k)||'null');
    if(state&&typeof state==='object')return{storage,key:k,state};
   }
  }catch(e){}
 }
 return null;
}
function markDomWrong(id){
 id=String(id??'');if(!id)return;
 const hit=findState();if(!hit)return;
 const state=hit.state;
 state.wrong=state.wrong&&typeof state.wrong==='object'?state.wrong:{};
 state._reviewPending=normalizeReview(state._reviewPending);
 state.wrong[id]=Math.max(1,Number(state.wrong[id])||0);
 state._reviewPending[id]=1;
 state._hadError=true;
 state.done=ids(state.done).filter(x=>x!==id);
 state._reviewSchema=1;
 try{
  internalWrite=true;
  previousSetItem.call(hit.storage,hit.key,JSON.stringify(state));
 }catch(e){}finally{internalWrite=false}
}
function scanIncorrect(){
 document.querySelectorAll('.poss.incorrect[data-i],.sp-inline-gap.incorrect[data-idx]').forEach(el=>{
  if(el.dataset.spReviewMarked==='1')return;
  el.dataset.spReviewMarked='1';
  markDomWrong(el.dataset.i??el.dataset.idx);
 });
}
function fixReviewFeedback(){
 if(Date.now()>reviewNoticeUntil)return;
 const boxes=[...document.querySelectorAll('.l8-feedback.good')];
 const box=boxes.at(-1);if(!box)return;
 const text=String(box.textContent||'').trim();
 if(/^Richtig!?$/i.test(text)){
  box.textContent='Richtig. Diese Aufgabe kommt am Ende noch einmal.';
  reviewNoticeUntil=0;
 }
}
function scan(){scanIncorrect();fixReviewFeedback()}
const root=document.getElementById('app')||document.body;
try{new MutationObserver(scan).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})}catch(e){}
[0,80,250,700].forEach(ms=>setTimeout(scan,ms));

window.L10T2ErrorReviewStandard={version:1,taskId,scan};
})();
