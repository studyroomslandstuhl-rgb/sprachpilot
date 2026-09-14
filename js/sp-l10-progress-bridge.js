(function(){
'use strict';
if(window.__SP_L10_PROGRESS_BRIDGE_V1)return;
const theme=Number(document.body?.dataset?.theme||0);
if(theme!==1&&theme!==2)return;
const D=theme===1?window.L10T1:window.L10T2;
if(!D||!Array.isArray(D.tasks))return;
window.__SP_L10_PROGRESS_BRIDGE_V1=true;

const TOPIC=`wortschatz-a1-lektion-10-thema-${theme}`;
const tasks=D.tasks||[];
const practice=tasks.filter(t=>!t.exam);
const taskIds=new Set(tasks.map(t=>String(t.id||'')).filter(Boolean));
const proto=Storage.prototype;
const rawGet=proto.getItem;
const rawSet=proto.setItem;
const rawRemove=proto.removeItem;
const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));

function profile(){try{return JSON.parse(rawGet.call(localStorage,'SP_USER_PROFILE')||rawGet.call(localStorage,'SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function preview(){try{const p=profile(),role=String(rawGet.call(localStorage,'SP_LOGIN_ROLE')||rawGet.call(localStorage,'SP_ACTIVE_ROLE')||p.role||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(role)||rawGet.call(sessionStorage,'SP_TEACHER_PREVIEW')==='1'||rawGet.call(localStorage,'SP_TEACHER_PREVIEW')==='1'}catch(e){return false}}
function owner(){const p=profile();return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email||rawGet.call(localStorage,'SP_STUDENT_ID')||'student').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function run(){return Math.max(1,Math.min(3,Number(rawGet.call(localStorage,'SP_SCORE_RUN_'+TOPIC)||1)||1))}
function scopedKey(id){return`SP_L10_${owner()}_T${theme}_${id}`}
function legacyKey(id){return`SP_L10_T${theme}_${id}`}
function parse(v){try{const x=JSON.parse(v||'null');return x&&typeof x==='object'?x:null}catch(e){return null}}
function stamp(v){const s=parse(v);if(!s)return v;if(s._run==null)s._run=run();if(s.updatedAt==null)s.updatedAt=Date.now();return JSON.stringify(s)}
function legacyTaskId(key){if(theme!==1)return'';const prefix='SP_L10_T1_';if(!String(key||'').startsWith(prefix))return'';const id=String(key).slice(prefix.length);return taskIds.has(id)?id:''}

/* L10T1 used old unscoped keys in several task apps. Redirect only those known task keys. */
if(theme===1&&!proto.__spL10T1ScopedKeys){
 const originalGet=proto.getItem,originalSet=proto.setItem,originalRemove=proto.removeItem;
 proto.getItem=function(key){
  const id=this===localStorage?legacyTaskId(key):'';
  if(id){
   const target=preview()?sessionStorage:localStorage;
   const scoped=scopedKey(id);
   let value=rawGet.call(target,scoped);
   if(value==null&&preview()&&id==='karteikarten')value=rawGet.call(sessionStorage,'SP_L10_PREVIEW_T1_karteikarten');
   if(value==null)value=rawGet.call(localStorage,key);
   return value;
  }
  return originalGet.call(this,key);
 };
 proto.setItem=function(key,value){
  const id=this===localStorage?legacyTaskId(key):'';
  if(id){
   const target=preview()?sessionStorage:localStorage;
   rawSet.call(target,scopedKey(id),stamp(value));
   return;
  }
  return originalSet.call(this,key,value);
 };
 proto.removeItem=function(key){
  const id=this===localStorage?legacyTaskId(key):'';
  if(id){
   const target=preview()?sessionStorage:localStorage;
   rawRemove.call(target,scopedKey(id));
   if(!preview())rawRemove.call(localStorage,key);
   return;
  }
  return originalRemove.call(this,key);
 };
 Object.defineProperty(proto,'__spL10T1ScopedKeys',{value:true,configurable:true});
}

function migrateLegacy(){
 if(preview())return;
 for(const t of tasks){
  const id=String(t.id||'');if(!id)continue;
  const dest=scopedKey(id);
  if(rawGet.call(localStorage,dest)!=null)continue;
  const old=rawGet.call(localStorage,legacyKey(id));
  if(old==null)continue;
  const s=parse(old);if(!s)continue;
  const active=run(),stored=Number(s._run||1)||1;
  if(stored!==active)continue;
  if(s._run==null)s._run=active;
  rawSet.call(localStorage,dest,JSON.stringify(s));
 }
}

function statePercent(task,state){
 if(!state)return 0;
 const active=run(),stored=Number(state._run||1)||1;
 if(stored!==active)return 0;
 if(task?.exam&&Number.isFinite(Number(state.percent)))return clamp(state.percent);
 const total=Math.max(0,Number(state.total||0));
 const done=Array.isArray(state.done)?state.done.length:Math.max(0,Number(state.done||0));
 return total?clamp(done/total*100):0;
}
function stateFor(task){
 const id=String(task?.id||'');if(!id)return null;
 const sources=[];
 const add=(store,key)=>{const s=parse(rawGet.call(store,key));if(s)sources.push(s)};
 if(preview()){
  add(sessionStorage,scopedKey(id));
  if(theme===1&&id==='karteikarten')add(sessionStorage,'SP_L10_PREVIEW_T1_karteikarten');
 }else{
  add(localStorage,scopedKey(id));
  add(localStorage,legacyKey(id));
 }
 let best=null,bestPct=-1,bestAt=-1;
 for(const s of sources){const p=statePercent(task,s),at=Number(s.updatedAt||0)||0;if(p>bestPct||(p===bestPct&&at>bestAt)){best=s;bestPct=p;bestAt=at}}
 return best;
}

function normalizePayload(payload){
 if(!payload||typeof payload!=='object')return payload;
 const belongs=payload.topic===TOPIC||payload.topicId===TOPIC||(Number(payload.lesson)===10&&Number(payload.theme)===theme);
 if(!belongs)return payload;
 const p={...payload,module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:10,theme,topicId:TOPIC,title:`A1 Lektion 10 · Thema ${theme}`};
 delete p.topic;
 return p;
}
function wrapQueue(){
 const q=Array.isArray(window.SP_PROGRESS_QUEUE)?window.SP_PROGRESS_QUEUE:[];
 window.SP_PROGRESS_QUEUE=q;
 if(q.__spL10Wrapped)return;
 const push=Array.prototype.push;
 q.push=function(...items){return push.apply(this,items.map(item=>item&&item.method==='recordTaskProgress'?{...item,payload:normalizePayload(item.payload)}:item))};
 Object.defineProperty(q,'__spL10Wrapped',{value:true,configurable:true});
}
function wrapApi(){
 const api=window.SPProgress;if(!api||api.__spL10Wrapped||typeof api.recordTaskProgress!=='function')return;
 const original=api.recordTaskProgress.bind(api);
 api.recordTaskProgress=function(payload){return original(normalizePayload(payload))};
 Object.defineProperty(api,'__spL10Wrapped',{value:true,configurable:true});
}
function sendCorrectProgress(task,state){
 if(preview()||task?.exam||!state)return;
 const percent=statePercent(task,state);if(percent<=0)return;
 const total=Math.max(0,Number(state.total||0));
 const done=Array.isArray(state.done)?Math.min(total,state.done.length):Math.max(0,Number(state.done||0));
 if(!total)return;
 const sig=`${run()}:${done}:${total}:${percent}`;
 const sigKey=`SP_L10_SYNC_${owner()}_T${theme}_${task.id}`;
 if(rawGet.call(sessionStorage,sigKey)===sig)return;
 rawSet.call(sessionStorage,sigKey,sig);
 const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:10,theme,topicId:TOPIC,title:`A1 Lektion 10 · Thema ${theme}`,file:`task.html?task=${task.id}`,taskKey:task.id,taskTitle:task.title||task.id,run:run(),done,total,percent,completed:percent>=100};
 const deliver=()=>{
  wrapApi();
  if(window.SPProgress?.recordTaskProgress)return Promise.resolve(window.SPProgress.recordTaskProgress(payload)).catch(()=>{});
  wrapQueue();window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload});
  return import('/js/progress.js?v=20260831-central6').then(()=>wrapApi()).catch(()=>{});
 };
 deliver();
}

function hrefFor(task){return theme===1&&task.id==='karteikarten'?'karteikarten.html?task=karteikarten':`task.html?task=${encodeURIComponent(task.id)}`}
function cardId(card){
 if(card.tagName==='A'){try{return new URL(card.href,location.href).searchParams.get('task')||''}catch(e){return''}}
 return'';
}
function setCardProgress(card,p){
 if(!card)return;card.classList.toggle('done',p>=100);
 const bar=card.querySelector('.l8-progress > div');if(bar)bar.style.width=`${p}%`;
 const small=card.querySelector('.l8-small');if(small)small.textContent=`${p}%`;
 const start=card.querySelector('.l8-task-start');if(start)start.textContent=p>=100?'Fertig':'Starten';
}
function unlockExam(exam,index){
 const cards=[...document.querySelectorAll('.l8-task-card')];let card=cards[index];if(!card||card.tagName==='A')return card;
 const a=document.createElement('a');a.className=card.className.replace(/\blocked\b/g,'').replace(/\s+/g,' ').trim();a.classList.remove('locked');a.href=hrefFor(exam);a.innerHTML=card.innerHTML;card.replaceWith(a);setCardProgress(a,statePercent(exam,stateFor(exam)));return a;
}
function patchOverview(){
 if(document.body?.dataset?.page!=='theme')return;
 const allCards=[...document.querySelectorAll('.l8-task-card')];if(!allCards.length)return;
 const pcts={};for(const t of tasks)pcts[t.id]=statePercent(t,stateFor(t));
 for(const t of practice){const card=allCards.find(c=>cardId(c)===t.id);if(card)setCardProgress(card,pcts[t.id]||0)}
 const completed=practice.filter(t=>(pcts[t.id]||0)>=100).length;
 const avg=practice.length?Math.round(practice.reduce((n,t)=>n+(pcts[t.id]||0),0)/practice.length):0;
 const circle=document.querySelector('.l8-progress-circle');if(circle)circle.textContent=`${avg}%`;
 const count=document.querySelector('.l8-progress-main > p.l8-small');if(count)count.textContent=`${completed} / ${practice.length} Aufgaben abgeschlossen`;
 const overall=document.querySelector('.l8-progress-main > .l8-progress > div');if(overall)overall.style.width=`${avg}%`;
 const exam=tasks.find(t=>t.exam);if(exam&&completed===practice.length){const idx=tasks.indexOf(exam),examCard=unlockExam(exam,idx);if(examCard)setCardProgress(examCard,pcts[exam.id]||0)}
}
function scan(){
 migrateLegacy();wrapQueue();wrapApi();
 for(const t of practice){const s=stateFor(t);if(s)sendCorrectProgress(t,s)}
 patchOverview();
}

scan();
[40,160,450,900].forEach(ms=>setTimeout(scan,ms));
const timer=setInterval(scan,700);
window.addEventListener('pagehide',()=>{scan();clearInterval(timer)},{once:true});
window.SPL10ProgressBridge={scan,stateFor,statePercent,topic:TOPIC,theme};
})();
