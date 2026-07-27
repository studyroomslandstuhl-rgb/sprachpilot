const LEDGER_KEY='SP_THEME_SCORE_A1_L6_T3_V1';
const TOPIC_ID='wortschatz-a1-lektion-6-thema-3';
const RUN_KEY='SP_SCORE_RUN_'+TOPIC_ID;
const EXAM_FILE='pruefung.html';
const VERSION=1;
const TASK_QUEUE=new Map();
const IS_OVERVIEW=/\/(?:index\.html)?$/.test(location.pathname)&&location.pathname.includes('/wortschatz/A1-Lektion-6/Thema-3/');
let syncTimer=0;
let syncing=false;
let taskFlushTimer=0;

function now(){return new Date().toISOString()}
function clamp(value){return Math.max(0,Math.min(100,Math.round(Number(value)||0)))}
function cleanId(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function activeRole(profile){
 const stored=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_AUTH_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();
 if(['student','schueler','schüler'].includes(stored))return'student';
 if(['teacher','lehrer','admin','owner'].includes(stored))return'teacher';
 const role=String(profile&&(profile.role||profile.type||profile.accountType||profile.loginRole)||'').toLowerCase();
 if(['teacher','lehrer','admin','owner'].includes(role)||profile.isTeacher===true||profile.teacher===true)return'teacher';
 return'student';
}
function previewFlag(){
 for(const storage of [sessionStorage,localStorage]){
  try{
   const raw=storage.getItem('SP_TEACHER_PREVIEW');
   if(raw==='1')return true;
   if(raw&&raw!=='0'){const parsed=JSON.parse(raw);if(parsed&&parsed.teacherPreview===true)return true}
  }catch(e){}
 }
 return false;
}
function isPreview(){try{if(typeof window.spIsTeacherPreview==='function')return !!window.spIsTeacherPreview();return previewFlag()&&activeRole(readProfile())==='teacher'}catch(e){return false}}
function taskPoints(run){return run===1?5:run===2?10:run===3?15:0}
function examMax(run){return run===1?100:run===2?200:run===3?300:0}
function initialRun(){const value=Math.round(Number(localStorage.getItem(RUN_KEY))||1);return Math.max(1,Math.min(3,value))}
function blankRun(){return{tasks:{},examBestPercent:0,examPoints:0,examStars:0,completed:false,startedAt:now(),updatedAt:now()}}
function blankLedger(){const run=initialRun();return{version:VERSION,themeKey:'A1-L6-T3',currentRun:run,runs:{[String(run)]:blankRun()},lifetimePoints:0,revision:0,lastSyncedRevision:0,pending:{tasks:{},exams:{}},updatedAt:now()}}
function calculateLifetime(ledger){let total=0;Object.values(ledger.runs||{}).forEach(run=>{Object.values(run.tasks||{}).forEach(task=>{total+=Math.max(0,Number(task.points)||0)});total+=Math.max(0,Number(run.examPoints)||0)});return total}
function normalizeLedger(value){
 const ledger=value&&typeof value==='object'?value:blankLedger();
 ledger.version=VERSION;
 ledger.currentRun=Math.max(1,Math.min(3,Math.round(Number(ledger.currentRun)||initialRun())));
 ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};
 for(let run=1;run<=ledger.currentRun;run++){
  const key=String(run);
  ledger.runs[key]={...blankRun(),...(ledger.runs[key]||{})};
  ledger.runs[key].tasks=ledger.runs[key].tasks&&typeof ledger.runs[key].tasks==='object'?ledger.runs[key].tasks:{};
 }
 ledger.pending=ledger.pending&&typeof ledger.pending==='object'?ledger.pending:{tasks:{},exams:{}};
 ledger.pending.tasks=ledger.pending.tasks&&typeof ledger.pending.tasks==='object'?ledger.pending.tasks:{};
 ledger.pending.exams=ledger.pending.exams&&typeof ledger.pending.exams==='object'?ledger.pending.exams:{};
 ledger.lifetimePoints=calculateLifetime(ledger);
 return ledger;
}
function readLedger(){try{return normalizeLedger(JSON.parse(localStorage.getItem(LEDGER_KEY)||'null'))}catch(e){return blankLedger()}}
function runData(ledger,run=ledger.currentRun){const key=String(run);if(!ledger.runs[key])ledger.runs[key]=blankRun();return ledger.runs[key]}
function taskList(){
 let tasks=[];
 try{if(window.L6T3&&typeof L6T3.activeTasks==='function')tasks=L6T3.activeTasks()}catch(e){}
 if(!tasks.length&&Array.isArray(window.TASKS))tasks=window.TASKS;
 return tasks.filter(task=>task&&task[0]&&task[0]!==EXAM_FILE);
}
function taskTitle(file,tasks=taskList()){const task=tasks.find(item=>item[0]===file);return task&&task[2]||String(file||'Aufgabe').replace(/\.html$/i,'').replace(/-/g,' ')}
function summaryFromLedger(ledger){ledger=normalizeLedger(ledger);const data=runData(ledger);const taskTotal=Object.values(data.tasks||{}).reduce((sum,task)=>sum+(Number(task.points)||0),0);return{currentRun:ledger.currentRun,runTaskPoints:taskTotal,runExamPoints:Number(data.examPoints)||0,runPoints:taskTotal+(Number(data.examPoints)||0),lifetimePoints:Number(ledger.lifetimePoints)||0,examBestPercent:Number(data.examBestPercent)||0,canRepeat:ledger.currentRun<3&&Number(data.examBestPercent||0)>=100,pending:!!(Object.keys(ledger.pending.tasks||{}).length||Object.keys(ledger.pending.exams||{}).length),preview:isPreview()}}
function dispatchScore(ledger){try{window.dispatchEvent(new CustomEvent('l6t3-score-change',{detail:summaryFromLedger(ledger)}))}catch(e){}}
function writeLedger(ledger,{schedule=true,dispatch=true}={}){
 if(isPreview())return normalizeLedger(ledger);
 ledger=normalizeLedger(ledger);ledger.lifetimePoints=calculateLifetime(ledger);ledger.revision=Math.max(0,Number(ledger.revision)||0)+1;ledger.updatedAt=now();
 localStorage.setItem(LEDGER_KEY,JSON.stringify(ledger));localStorage.setItem(RUN_KEY,String(ledger.currentRun));
 if(dispatch)dispatchScore(ledger);if(schedule)scheduleSync();return ledger;
}
function statePercent(state){if(!state||typeof state!=='object')return 0;if(state.completed===true||state.finished===true)return 100;const total=Math.max(0,Number(state.total)||0);const done=Array.isArray(state.done)?state.done.length:Math.max(0,Number(state.done)||0);return total?clamp(done/total*100):clamp(state.percent??state.progress)}
function taskSnapshot(state){return{percent:statePercent(state),total:Math.max(0,Number(state&&state.total)||0),done:Array.isArray(state&&state.done)?state.done.length:Math.max(0,Number(state&&state.done)||0)}}
function queuedSnapshot(state){return{total:Math.max(0,Number(state&&state.total)||0),done:Array.isArray(state&&state.done)?state.done.slice():Math.max(0,Number(state&&state.done)||0),completed:statePercent(state)>=100}}
function applyTaskState(ledger,run,file,state,title=''){
 if(!file||file===EXAM_FILE)return false;
 const data=runData(ledger,run),snap=taskSnapshot(state),old=data.tasks[file]||{percent:0,completed:false,points:0,total:0,done:0};
 const completed=!!old.completed||snap.percent>=100;
 const next={...old,file,title:title||old.title||taskTitle(file),percent:Math.max(clamp(old.percent),snap.percent),completed,points:completed?Math.max(Number(old.points)||0,taskPoints(run)):Number(old.points)||0,total:Math.max(Number(old.total)||0,snap.total),done:Math.max(Number(old.done)||0,snap.done),updatedAt:now()};
 const changed=Number(old.percent||0)!==next.percent||!!old.completed!==next.completed||Number(old.points||0)!==next.points||Number(old.total||0)!==next.total||Number(old.done||0)!==next.done;
 if(changed){data.tasks[file]=next;data.updatedAt=now();ledger.pending.tasks[run+':'+file]=true}
 return changed;
}
function recordTask(file,state,{dispatch=true,schedule=true}={}){if(isPreview()||file===EXAM_FILE)return readLedger();const ledger=readLedger();if(!applyTaskState(ledger,ledger.currentRun,file,state))return ledger;return writeLedger(ledger,{dispatch,schedule})}
function queueTask(file,state){
 if(isPreview()||!file||file===EXAM_FILE)return state;
 TASK_QUEUE.set(String(file),queuedSnapshot(state));
 clearTimeout(taskFlushTimer);
 const delay=IS_OVERVIEW?250:(statePercent(state)>=100?1800:15000);
 taskFlushTimer=setTimeout(()=>flushTaskQueue(),delay);
 return state;
}
function flushTaskQueue(){
 clearTimeout(taskFlushTimer);taskFlushTimer=0;
 if(!TASK_QUEUE.size)return readLedger();
 const entries=[...TASK_QUEUE.entries()];TASK_QUEUE.clear();
 let ledger=null;
 for(const [file,state] of entries)ledger=recordTask(file,state,{dispatch:IS_OVERVIEW,schedule:IS_OVERVIEW});
 return ledger||readLedger();
}
function recordExam(result){
 if(isPreview())return readLedger();
 flushTaskQueue();
 const ledger=readLedger(),run=ledger.currentRun,data=runData(ledger,run),percent=clamp(result&&result.percent);
 if(percent>=Number(data.examBestPercent||0)){data.examBestPercent=percent;data.examPoints=Math.round(examMax(run)*percent/100);data.examStars=Math.max(Number(data.examStars)||0,Number(result&&result.stars)||0)}
 data.completed=Number(data.examBestPercent||0)>=100;data.updatedAt=now();ledger.pending.exams[String(run)]=true;return writeLedger(ledger);
}
function readState(key){try{const value=JSON.parse(localStorage.getItem(key)||'null');return value&&typeof value==='object'?value:null}catch(e){return null}}
function collectProgressEntries(){
 const entries=[];
 try{
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i)||'';
   if(!key.startsWith('SP_L6_T3_V1_')&&!key.startsWith('SP_TASK_STATE_')&&!key.startsWith('SP_TASK_PROGRESS_'))continue;
   const value=readState(key);if(value)entries.push({key,value});
  }
 }catch(e){}
 return entries;
}
function taskStateCandidates(file,entries){
 const out=[],seen=new Set();
 const add=(key,value)=>{if(!value||seen.has(key))return;seen.add(key);out.push(value)};
 entries.forEach(entry=>{if(entry.key.includes(file))add(entry.key,entry.value)});
 try{
  if(typeof window.taskKey==='function'){const key=window.taskKey(file);add(key,readState(key))}
  for(const name of [file,cleanId(file)])for(const prefix of ['SP_TASK_STATE_','SP_TASK_PROGRESS_']){const key=prefix+name;add(key,readState(key))}
 }catch(e){}
 return out;
}
function reconcile(){
 if(isPreview()){const ledger=readLedger();dispatchScore(ledger);return ledger}
 const ledger=readLedger(),run=ledger.currentRun,tasks=taskList(),entries=collectProgressEntries();
 let changed=false;
 for(const task of tasks){
  const file=task[0],candidates=taskStateCandidates(file,entries);if(!candidates.length)continue;
  const best=candidates.reduce((winner,state)=>statePercent(state)>statePercent(winner)?state:winner,candidates[0]);
  if(statePercent(best)>0&&applyTaskState(ledger,run,file,best,task[2]))changed=true;
 }
 localStorage.setItem(RUN_KEY,String(ledger.currentRun));
 if(changed)return writeLedger(ledger);
 dispatchScore(ledger);return ledger;
}
function isProtectedKey(key){return key===LEDGER_KEY||key===RUN_KEY}
function clearVisibleProgress(){
 if(window.L6T3Revision&&typeof L6T3Revision.clearProgress==='function')return L6T3Revision.clearProgress();
 const protectedKeys=new Set([LEDGER_KEY,RUN_KEY]),files=new Set(taskList().map(task=>task[0]).concat([EXAM_FILE])),remove=[];
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)||'';if(protectedKeys.has(key))continue;if(key.startsWith('SP_L6_T3_V1_')||[...files].some(file=>key==='SP_TASK_STATE_'+file||key==='SP_TASK_PROGRESS_'+file))remove.push(key)}
 remove.forEach(key=>localStorage.removeItem(key));return{localRemoved:remove,sessionRemoved:[],total:remove.length};
}
function resetPractice(){if(!confirm('Fortschritte in Lektion 6 · Thema 3 löschen? Bereits verdiente Punkte bleiben erhalten.'))return false;clearVisibleProgress();const ledger=readLedger();localStorage.setItem(RUN_KEY,String(ledger.currentRun));location.replace('index.html?resetDone='+Date.now()+'&v=l6t3-score2');return true}
function startNextRun(){
 const ledger=readLedger(),current=ledger.currentRun,data=runData(ledger,current);if(current>=3||Number(data.examBestPercent||0)<100)return false;
 const next=current+1;if(!confirm('Runde '+next+' starten? In dieser Runde gibt es '+(next===2?'doppelte':'dreifache')+' Punkte.'))return false;
 ledger.currentRun=next;runData(ledger,next);clearVisibleProgress();writeLedger(ledger);location.replace('index.html?v=l6t3-score2&run='+next);return true;
}
function summary(){return summaryFromLedger(readLedger())}
function summaryHtml(){const s=summary();if(s.preview)return '<div class="score-ledger-card"><div><b>Lehrer-Vorschau</b><div class="small">In der Vorschau werden keine Schülerpunkte vergeben.</div></div></div>';const next=s.currentRun<3?s.currentRun+1:null;return '<div class="score-ledger-card"><div><b>Punkterunde '+s.currentRun+' von 3</b><div class="small">Aufgaben: '+s.runTaskPoints+' Punkte · Prüfung: '+s.runExamPoints+' Punkte</div></div><div class="score-ledger-total">Gesamt: '+s.lifetimePoints+' Punkte</div>'+(s.pending?'<div class="small">Synchronisierung vorgemerkt</div>':'')+(s.canRepeat?'<div class="actions"><button class="btn" type="button" onclick="L6T3ThemeScore.startNextRun()">Thema wiederholen – Runde '+next+' starten</button></div>':'')+'</div>'}
async function ensureProgressApi(){if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')return window.SPProgress;try{await import('/js/progress.js?v=l6t3-score3')}catch(e){return null}return window.SPProgress||null}
async function syncFirebase(){
 if(isPreview()||syncing)return false;
 if(IS_OVERVIEW)flushTaskQueue();
 const ledger=readLedger(),taskKeys=Object.keys(ledger.pending.tasks||{}),examKeys=Object.keys(ledger.pending.exams||{});if(!taskKeys.length&&!examKeys.length)return true;
 const api=await ensureProgressApi();if(!api)return false;syncing=true;let ok=true;
 try{
  for(const key of taskKeys){const split=key.indexOf(':'),run=Math.max(1,Math.min(3,Number(key.slice(0,split))||1)),file=key.slice(split+1),data=runData(ledger,run),task=data.tasks[file];if(!task){delete ledger.pending.tasks[key];continue}localStorage.setItem(RUN_KEY,String(run));const result=await api.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:3,topicId:TOPIC_ID,title:'A1 Lektion 6 · Thema 3',file,taskKey:file,taskTitle:task.title||taskTitle(file),total:task.total||1,done:task.done||0,percent:task.percent||0,completed:!!task.completed});if(result)delete ledger.pending.tasks[key];else ok=false}
  for(const key of examKeys){const run=Math.max(1,Math.min(3,Number(key)||1)),data=runData(ledger,run);if(!data.examBestPercent){delete ledger.pending.exams[key];continue}localStorage.setItem(RUN_KEY,String(run));const result=await api.recordExamResult({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:3,topicId:TOPIC_ID,title:'A1 Lektion 6 · Thema 3',percent:data.examBestPercent,stars:data.examStars||0});if(result)delete ledger.pending.exams[key];else ok=false}
 }catch(e){ok=false}
 finally{localStorage.setItem(RUN_KEY,String(ledger.currentRun));ledger.lastSyncedRevision=ok?ledger.revision:ledger.lastSyncedRevision;ledger.updatedAt=now();localStorage.setItem(LEDGER_KEY,JSON.stringify(normalizeLedger(ledger)));syncing=false;dispatchScore(ledger)}
 return ok;
}
function runIdle(callback,timeout=1200){if('requestIdleCallback'in window)requestIdleCallback(()=>callback(),{timeout});else setTimeout(callback,80)}
function scheduleSync(){if(!IS_OVERVIEW)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>runIdle(syncFirebase,4000),1800)}
function install(){
 if(typeof window.syncTask==='function')window.syncTask=function(file,state){return queueTask(file,state)};
 window.L6T3ThemeScore={read:readLedger,recordTask,queueTask,flushTaskQueue,recordExam,reconcile,summary,summaryHtml,resetPractice,startNextRun,syncFirebase,taskPoints,examMax,isProtectedKey,ledgerKey:LEDGER_KEY,runKey:RUN_KEY};
 if(IS_OVERVIEW){runIdle(reconcile,1000);window.addEventListener('online',scheduleSync);setTimeout(scheduleSync,2200)}
 window.addEventListener('pagehide',()=>{try{flushTaskQueue();localStorage.setItem(RUN_KEY,String(readLedger().currentRun))}catch(e){}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)try{flushTaskQueue()}catch(e){}});
}
install();
