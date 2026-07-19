(function(){
'use strict';

const VERSION=1;
const LEARN_TASKS=['cards','meaning-to-verb','verb-to-meaning','listen','image-to-verb','verb-to-image','read-sentence','change','choose-form','write-form','speak','sentence'];
const ALL_TASKS=[...LEARN_TASKS,'exam'];
const TASK_TITLES={
 cards:'Karteikarten',
 'meaning-to-verb':'Bedeutung → Verb',
 'verb-to-meaning':'Verb → Bedeutung',
 listen:'Hören → Verb',
 'image-to-verb':'Bild → Verb',
 'verb-to-image':'Verb → Bild',
 'read-sentence':'Lesen → Verb',
 change:'Vokalwechsel',
 'choose-form':'Form auswählen',
 'write-form':'Form schreiben',
 speak:'Form sprechen',
 sentence:'Satz ergänzen',
 exam:'Tagesprüfung'
};
const DAYS=()=>Array.isArray(window.IRREGULAR_VERB_DAYS)&&window.IRREGULAR_VERB_DAYS.length?window.IRREGULAR_VERB_DAYS.length:14;
let syncTimer=0;
let syncing=false;
let observer=null;

function now(){return new Date().toISOString()}
function clamp(value){return Math.max(0,Math.min(100,Math.round(Number(value)||0)))}
function readJson(key,fallback=null,storage=localStorage){try{const value=JSON.parse(storage.getItem(key)||'null');return value??fallback}catch(e){return fallback}}
function rawProfile(){
 const candidates=[readJson('SP_USER_PROFILE',null),readJson('SP_STUDENT_PROFILE',null),readJson('SP_TEACHER_PROFILE',null)];
 return candidates.find(value=>value&&typeof value==='object'&&Object.keys(value).length)||{};
}
function activeRole(){
 const stored=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_AUTH_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();
 if(['teacher','lehrer','admin','owner'].includes(stored))return'teacher';
 if(['student','schueler','schüler'].includes(stored))return'student';
 const profile=rawProfile();
 const role=String(profile.role||profile.type||profile.typ||profile.accountType||profile.loginRole||'').toLowerCase();
 if(['teacher','lehrer','admin','owner'].includes(role)||profile.isTeacher===true||profile.teacher===true||profile.lehrer===true)return'teacher';
 return'student';
}
function preview(){
 if(activeRole()==='teacher')return true;
 try{
  for(const storage of [sessionStorage,localStorage]){
   const raw=storage.getItem('SP_TEACHER_PREVIEW');
   if(raw==='1'&&activeRole()==='teacher')return true;
   if(raw&&raw!=='0'){
    const parsed=JSON.parse(raw);
    if(parsed&&parsed.teacherPreview===true&&activeRole()==='teacher')return true;
   }
  }
 }catch(e){}
 return false;
}
function userSlug(){
 const profile=rawProfile();
 return [profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname]
  .filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
}
function progressKey(){return'SP_IRREGULAR_VERBS_PROGRESS_'+userSlug()}
function ledgerKey(){return'SP_IRREGULAR_VERBS_SCORE_'+userSlug()}
function topicId(day){return'irregulaere-verben-tag-'+String(day).padStart(2,'0')}
function runKey(day){return'SP_SCORE_RUN_'+topicId(day)}
function taskPoints(run){return run===1?5:run===2?10:run===3?15:0}
function examMax(run){return run===1?100:run===2?200:run===3?300:0}
function stars(percent){return percent>=100?3:percent>=70?2:percent>=50?1:0}
function blankRun(){return{tasks:{},exams:{},completed:false,startedAt:now(),updatedAt:now()}}
function blankLedger(){return{version:VERSION,currentRun:1,runs:{'1':blankRun()},lifetimePoints:0,pending:{tasks:{},exams:{}},revision:0,updatedAt:now()}}
function calculateLifetime(ledger){
 let total=0;
 Object.values(ledger.runs||{}).forEach(run=>{
  Object.values(run.tasks||{}).forEach(task=>{total+=Math.max(0,Number(task.points)||0)});
  Object.values(run.exams||{}).forEach(exam=>{total+=Math.max(0,Number(exam.points)||0)});
 });
 return total;
}
function normalizeLedger(value){
 const ledger=value&&typeof value==='object'?value:blankLedger();
 ledger.version=VERSION;
 ledger.currentRun=Math.max(1,Math.min(3,Math.round(Number(ledger.currentRun)||1)));
 ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};
 for(let run=1;run<=ledger.currentRun;run++){
  const key=String(run);
  ledger.runs[key]={...blankRun(),...(ledger.runs[key]||{})};
  ledger.runs[key].tasks=ledger.runs[key].tasks&&typeof ledger.runs[key].tasks==='object'?ledger.runs[key].tasks:{};
  ledger.runs[key].exams=ledger.runs[key].exams&&typeof ledger.runs[key].exams==='object'?ledger.runs[key].exams:{};
 }
 ledger.pending=ledger.pending&&typeof ledger.pending==='object'?ledger.pending:{tasks:{},exams:{}};
 ledger.pending.tasks=ledger.pending.tasks&&typeof ledger.pending.tasks==='object'?ledger.pending.tasks:{};
 ledger.pending.exams=ledger.pending.exams&&typeof ledger.pending.exams==='object'?ledger.pending.exams:{};
 ledger.lifetimePoints=calculateLifetime(ledger);
 return ledger;
}
function readLedger(){return normalizeLedger(readJson(ledgerKey(),null))}
function writeLedger(ledger,{schedule=true,render=true}={}){
 if(preview())return normalizeLedger(ledger);
 ledger=normalizeLedger(ledger);
 ledger.lifetimePoints=calculateLifetime(ledger);
 ledger.revision=Math.max(0,Number(ledger.revision)||0)+1;
 ledger.updatedAt=now();
 localStorage.setItem(ledgerKey(),JSON.stringify(ledger));
 setRunKeys(ledger.currentRun);
 if(render)renderScore();
 if(schedule)scheduleSync();
 try{window.dispatchEvent(new CustomEvent('irregular-score-change',{detail:summaryFromLedger(ledger)}))}catch(e){}
 return ledger;
}
function runData(ledger,run=ledger.currentRun){
 const key=String(run);
 if(!ledger.runs[key])ledger.runs[key]=blankRun();
 return ledger.runs[key];
}
function readProgress(){return readJson(progressKey(),{})||{}}
function entryDone(progress,day,task){return !!progress.completed?.[day]?.[task]?.done}
function examPercent(progress,day){
 const entry=progress.completed?.[day]?.exam||{};
 const first=Number(entry.firstScore);
 if(Number.isFinite(first)&&first>0)return clamp(first);
 const best=Number(entry.bestScore);
 return entry.done?clamp(Number.isFinite(best)&&best>0?best:100):0;
}
function moduleComplete(progress=readProgress()){
 for(let day=1;day<=DAYS();day++)for(const task of ALL_TASKS)if(!entryDone(progress,day,task))return false;
 return true;
}
function updateRunCompletion(ledger,progress){
 const data=runData(ledger);
 data.completed=moduleComplete(progress);
 data.updatedAt=now();
}
function reconcile(){
 if(preview()){renderScore();return readLedger()}
 const progress=readProgress();
 const ledger=readLedger();
 const run=ledger.currentRun;
 const data=runData(ledger,run);
 let changed=false;
 for(let day=1;day<=DAYS();day++){
  for(const task of LEARN_TASKS){
   if(!entryDone(progress,day,task))continue;
   const id=day+':'+task;
   if(data.tasks[id]?.completed)continue;
   const points=taskPoints(run);
   data.tasks[id]={day,task,title:TASK_TITLES[task]||task,completed:true,points,completedAt:now()};
   ledger.pending.tasks[run+':'+day+':'+task]=true;
   changed=true;
  }
  if(entryDone(progress,day,'exam')){
   const percent=examPercent(progress,day);
   const earned=Math.round(examMax(run)*percent/100);
   const old=data.exams[String(day)]||{bestPercent:0,points:0};
   if(percent>Number(old.bestPercent||0)||earned>Number(old.points||0)){
    data.exams[String(day)]={day,bestPercent:Math.max(Number(old.bestPercent)||0,percent),points:Math.max(Number(old.points)||0,earned),stars:Math.max(Number(old.stars)||0,stars(percent)),updatedAt:now()};
    ledger.pending.exams[run+':'+day]=true;
    changed=true;
   }
  }
 }
 const wasComplete=!!data.completed;
 updateRunCompletion(ledger,progress);
 if(wasComplete!==data.completed)changed=true;
 if(changed)return writeLedger(ledger);
 setRunKeys(ledger.currentRun);
 renderScore();
 scheduleSync();
 return ledger;
}
function summaryFromLedger(ledger){
 ledger=normalizeLedger(ledger);
 const data=runData(ledger);
 const taskTotal=Object.values(data.tasks||{}).reduce((sum,item)=>sum+(Number(item.points)||0),0);
 const examTotal=Object.values(data.exams||{}).reduce((sum,item)=>sum+(Number(item.points)||0),0);
 return{
  currentRun:ledger.currentRun,
  runTaskPoints:taskTotal,
  runExamPoints:examTotal,
  runPoints:taskTotal+examTotal,
  lifetimePoints:Number(ledger.lifetimePoints)||0,
  completed:!!data.completed,
  canRepeat:ledger.currentRun<3&&!!data.completed,
  pending:!!(Object.keys(ledger.pending.tasks||{}).length||Object.keys(ledger.pending.exams||{}).length),
  preview:preview()
 };
}
function summary(){return summaryFromLedger(readLedger())}
function scoreSignature(s){
 return[s.preview?'preview':'student',s.currentRun,s.runTaskPoints,s.runExamPoints,s.lifetimePoints,s.pending?'pending':'synced',s.canRepeat?'repeat':'norepeat'].join('-');
}
function summaryHtml(){
 const s=summary();
 const signature=scoreSignature(s);
 if(s.preview)return`<section class="card score-ledger-card" data-score-signature="${signature}"><div><h2>Punkte</h2><p class="small">Lehrer-Vorschau: Es werden keine Schülerpunkte vergeben.</p></div></section>`;
 const next=s.currentRun<3?s.currentRun+1:null;
 return`<section class="card score-ledger-card" data-score-signature="${signature}">
  <div class="score-ledger-head"><div><p class="eyebrow">Punktesystem</p><h2>Punkterunde ${s.currentRun} von 3</h2><p class="small">Aufgaben: ${s.runTaskPoints} Punkte · Tagesprüfungen: ${s.runExamPoints} Punkte</p></div><div class="score-ledger-total">${s.lifetimePoints}<span>Punkte gesamt</span></div></div>
  <div class="score-rules"><span>Aufgabe: ${taskPoints(s.currentRun)} P.</span><span>Tagesprüfung: bis ${examMax(s.currentRun)} P.</span></div>
  ${s.pending?'<p class="small">Firebase-Synchronisierung vorgemerkt.</p>':''}
  ${s.canRepeat?`<div class="actions"><button class="btn" type="button" onclick="IrregularVerbScore.startNextRun()">Modul wiederholen – Runde ${next} starten</button></div>`:''}
 </section>`;
}
function renderScore(){
 const app=document.querySelector('#app');
 if(!app)return;
 const existing=app.querySelector('.score-ledger-card');
 const progress=app.querySelector('.progress-card');
 if(progress){
  const wanted=summary();
  const signature=scoreSignature(wanted);
  if(!existing)progress.insertAdjacentHTML('beforebegin',summaryHtml());
  else if(existing.dataset.scoreSignature!==signature)existing.outerHTML=summaryHtml();
 }
 const finish=app.querySelector('.finish-box');
 if(finish&&!finish.querySelector('.score-earned-note')){
  const params=new URLSearchParams(location.search);
  const day=Math.max(1,Number(params.get('day'))||1);
  const task=params.get('task')||'';
  const ledger=readLedger(),data=runData(ledger);
  const points=task==='exam'?Number(data.exams?.[String(day)]?.points||0):Number(data.tasks?.[day+':'+task]?.points||0);
  if(points>0)finish.insertAdjacentHTML('beforeend',`<div class="score-earned-note">Punkterunde ${ledger.currentRun}: ${task==='exam'?'Prüfungsstand':'Aufgabe'} ${points} Punkte.</div>`);
 }
}
function setRunKeys(run){
 if(preview())return;
 for(let day=1;day<=DAYS();day++)localStorage.setItem(runKey(day),String(run));
}
function clearVisibleProgress(){
 localStorage.removeItem(progressKey());
 try{sessionStorage.removeItem('SP_IRREGULAR_RETURN_TASK')}catch(e){}
}
function startNextRun(){
 if(preview())return false;
 const ledger=readLedger();
 const data=runData(ledger);
 if(ledger.currentRun>=3||!data.completed)return false;
 const next=ledger.currentRun+1;
 if(!confirm('Runde '+next+' starten? In dieser Runde gibt es '+(next===2?'doppelte':'dreifache')+' Punkte. Der sichtbare Lernfortschritt beginnt wieder bei Tag 1.'))return false;
 ledger.currentRun=next;
 runData(ledger,next);
 clearVisibleProgress();
 writeLedger(ledger,{schedule:true,render:false});
 location.href='index.html?run='+next+'&v=irregular-score1';
 return true;
}
async function progressApi(){
 if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')return window.SPProgress;
 try{await import('/js/progress.js?v=irregular-score1')}catch(e){return null}
 return window.SPProgress||null;
}
function taskPayload(day,task){
 return{module:'verben',moduleTitle:'Verben',level:'A1',lesson:'Irreguläre Verben',theme:'Tag '+day,topicId:topicId(day),title:'Irreguläre Verben · Tag '+day,file:task,taskKey:task,taskTitle:TASK_TITLES[task]||task,total:1,done:1,percent:100,completed:true};
}
function examPayload(day,exam){
 return{module:'verben',moduleTitle:'Verben',level:'A1',lesson:'Irreguläre Verben',theme:'Tag '+day,topicId:topicId(day),title:'Irreguläre Verben · Tag '+day,percent:clamp(exam.bestPercent),stars:Number(exam.stars)||stars(exam.bestPercent)};
}
async function syncFirebase(){
 if(preview()||syncing)return false;
 const ledger=readLedger();
 const taskKeys=Object.keys(ledger.pending.tasks||{});
 const examKeys=Object.keys(ledger.pending.exams||{});
 if(!taskKeys.length&&!examKeys.length)return true;
 const api=await progressApi();
 if(!api)return false;
 syncing=true;
 let ok=true;
 try{
  for(const key of taskKeys){
   const [runRaw,dayRaw,...taskParts]=key.split(':');
   const run=Math.max(1,Math.min(3,Number(runRaw)||1));
   const day=Math.max(1,Number(dayRaw)||1);
   const task=taskParts.join(':');
   const data=runData(ledger,run);
   if(!data.tasks[day+':'+task]){delete ledger.pending.tasks[key];continue}
   localStorage.setItem(runKey(day),String(run));
   const result=await api.recordTaskProgress(taskPayload(day,task));
   if(result)delete ledger.pending.tasks[key];else ok=false;
  }
  for(const key of examKeys){
   const [runRaw,dayRaw]=key.split(':');
   const run=Math.max(1,Math.min(3,Number(runRaw)||1));
   const day=Math.max(1,Number(dayRaw)||1);
   const data=runData(ledger,run),exam=data.exams[String(day)];
   if(!exam){delete ledger.pending.exams[key];continue}
   localStorage.setItem(runKey(day),String(run));
   const result=await api.recordExamResult(examPayload(day,exam));
   if(result)delete ledger.pending.exams[key];else ok=false;
  }
 }catch(e){ok=false}
 finally{
  setRunKeys(ledger.currentRun);
  localStorage.setItem(ledgerKey(),JSON.stringify(normalizeLedger(ledger)));
  syncing=false;
  renderScore();
 }
 return ok;
}
function scheduleSync(){
 clearTimeout(syncTimer);
 syncTimer=setTimeout(syncFirebase,900);
}
function scheduleReconcile(){
 clearTimeout(scheduleReconcile.timer);
 scheduleReconcile.timer=setTimeout(reconcile,30);
}
function patchStorage(){
 const originalSet=Storage.prototype.setItem;
 const originalRemove=Storage.prototype.removeItem;
 if(!Storage.prototype.__irregularScorePatched){
  Storage.prototype.setItem=function(key,value){
   const result=originalSet.call(this,key,value);
   if(this===localStorage&&String(key)===progressKey())scheduleReconcile();
   return result;
  };
  Storage.prototype.removeItem=function(key){
   const watch=this===localStorage&&String(key)===progressKey();
   const result=originalRemove.call(this,key);
   if(watch)setTimeout(renderScore,30);
   return result;
  };
  Object.defineProperty(Storage.prototype,'__irregularScorePatched',{value:true,configurable:true});
 }
}
function observe(){
 const app=document.querySelector('#app');
 if(!app)return;
 if(observer)observer.disconnect();
 observer=new MutationObserver(()=>renderScore());
 observer.observe(app,{childList:true,subtree:true});
 renderScore();
}
function init(){
 patchStorage();
 setRunKeys(readLedger().currentRun);
 reconcile();
 observe();
 window.addEventListener('online',scheduleSync);
 window.addEventListener('storage',event=>{if(event.key===progressKey()||event.key===ledgerKey())scheduleReconcile()});
}
window.IrregularVerbScore={reconcile,summary,summaryHtml,startNextRun,syncFirebase,taskPoints,examMax,ledgerKey,progressKey};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();