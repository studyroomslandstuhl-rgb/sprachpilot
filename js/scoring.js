import '/js/progress.js?v=20260831-central2';
import '/js/point-delta-bridge.js?v=20260831-central2';

const RULES={
  taskPoints(run){run=Number(run)||1;if(run===1)return 5;if(run===2)return 10;if(run===3)return 15;return 0},
  examMax(run){run=Number(run)||1;if(run===1)return 100;if(run===2)return 200;if(run===3)return 300;return 0},
  examEarned(run,percent){run=Number(run)||1;percent=Math.max(0,Math.min(100,Math.round(Number(percent)||0)));if(run>=4)return 0;return Math.round(this.examMax(run)*percent/100)}
};
const RETRY_KEY='SP_PROGRESS_RETRY_QUEUE_V1';
let retryTimer=null;
function cleanId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item'}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function isExamFile(file){return /(?:pruefung|prüfung|exam)/i.test(String(file||''))}
function api(){return window.SPProgress}
function scopeInfo(){
  const path=String(location.pathname||'');
  if(/\/verben-A1\//.test(path))return{moduleKey:'verben',scope:'verben-a1',module:'verben',title:'Verben A1',lesson:'',theme:''};
  const w=path.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\//i);
  if(w){const lesson=w[1],theme=w[2];return{moduleKey:'wortschatz',module:'wortschatz',scope:`wortschatz-${lesson}-${theme}`.toLowerCase(),topicId:`wortschatz-${lesson}-${theme}`.toLowerCase(),title:`${lesson.replace('-',' ')} · ${theme.replace('-',' ')}`,lesson:lesson.replace(/.*Lektion-/i,''),theme:theme.replace(/.*Thema-/i,'')}}
  if(/\/fragen-A1\//.test(path)||/\/fragen\//.test(path))return{moduleKey:'fragen',module:'fragen',scope:'fragen-a1',topicId:'fragen-a1',title:'Fragen A1',lesson:'',theme:''};
  return{moduleKey:'allgemein',module:'allgemein',scope:cleanId(path),topicId:cleanId(path),title:path,lesson:'',theme:''};
}
function isCentralL7(){const info=scopeInfo();return info.module==='wortschatz'&&String(info.lesson)==='7'}
function currentRun(scope=scopeInfo().scope){return Math.max(1,Math.min(3,Math.round(Number(localStorage.getItem(`SP_SCORE_RUN_${scope}`)||1)||1)))}
function taskPayload(file,percent=100){const info=scopeInfo(),run=currentRun(info.scope);return{module:info.module,moduleTitle:info.moduleKey==='wortschatz'?'Wortschatz':info.moduleKey,level:'A1',lesson:info.lesson,theme:info.theme,topicId:info.topicId,title:info.title,file:file||location.pathname.split('/').pop()||'aufgabe.html',taskKey:file||location.pathname.split('/').pop()||'aufgabe.html',taskTitle:String(file||'Aufgabe').replace(/\.html$/,'').replace(/-/g,' '),run,percent,completed:percent>=100,total:100,done:percent,countAttempt:false}}
function statePercent(st={}){if(st.examPercent!==undefined)return clamp(st.examPercent);const total=Number(st.total||0);const done=Array.isArray(st.done)?st.done.length:Number(st.done||0);return total>0?clamp(done/total*100):0}
function entryKey(entry={}){const p=entry.payload||{};return JSON.stringify([entry.method,p.module,p.topicId,p.lesson,p.theme,p.run,p.taskKey,p.file,p.percent,p.scorePercent,p.score,p.completed])}
function readRetry(){try{const value=JSON.parse(localStorage.getItem(RETRY_KEY)||'[]');return Array.isArray(value)?value:[]}catch(e){return[]}}
function writeRetry(list){try{if(list.length)localStorage.setItem(RETRY_KEY,JSON.stringify(list));else localStorage.removeItem(RETRY_KEY)}catch(e){}}
function remember(entry){if(!entry?.method)return;const list=readRetry(),key=entryKey(entry);if(!list.some(x=>entryKey(x)===key)){list.push(entry);writeRetry(list)}}
function forget(entry){const key=entryKey(entry),list=readRetry().filter(x=>entryKey(x)!==key);writeRetry(list)}
function scheduleRetry(delay=5000){if(retryTimer)return;retryTimer=setTimeout(()=>{retryTimer=null;drainGenericProgressQueue()},delay)}
function requeue(entry){if(!entry?.method)return;remember(entry);window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];const key=entryKey(entry);if(!window.SP_PROGRESS_QUEUE.some(x=>entryKey(x)===key))window.SP_PROGRESS_QUEUE.push(entry);scheduleRetry()}
function hydrateRetryQueue(){const q=readRetry();if(!q.length)return;window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];for(const entry of q){const key=entryKey(entry);if(!window.SP_PROGRESS_QUEUE.some(x=>entryKey(x)===key))window.SP_PROGRESS_QUEUE.push(entry)}}
async function awardTask(file,options={}){
  if(isCentralL7())return null;
  if(isExamFile(file)){const p=options.payload||{},percent=clamp(p.percent??p.scorePercent??p.score??100);return awardExam({percent},options)}
  const payload={...taskPayload(file,100),...(options.payload||{})},entry={method:'recordTaskProgress',payload},a=api();
  if(!a?.recordTaskProgress){requeue(entry);return null}
  try{const result=await a.recordTaskProgress(payload);if(result)forget(entry);else requeue(entry);return result}catch(e){requeue(entry);return null}
}
async function awardExam(result={},options={}){
  if(isCentralL7())return null;
  const percent=clamp(result.percent??result.scorePercent??result.score??100),payload={...taskPayload('pruefung.html',percent),scorePercent:percent,score:percent,stars:percent>=100?3:percent>=70?2:percent>=50?1:0,...(options.payload||{})},entry={method:'recordExamResult',payload},a=api();
  if(!a?.recordExamResult){requeue(entry);return null}
  try{const saved=await a.recordExamResult(payload);if(saved)forget(entry);else requeue(entry);return saved}catch(e){requeue(entry);return null}
}
async function resetScope(info=scopeInfo()){if(info.module==='wortschatz'&&String(info.lesson)==='7')return null;const a=api();return a?.recordThemeReset?await a.recordThemeReset({module:info.module,level:'A1',lesson:info.lesson,theme:info.theme,topicId:info.topicId,title:info.title}):null}
function drainGenericProgressQueue(){
  hydrateRetryQueue();
  const raw=Array.isArray(window.SP_PROGRESS_QUEUE)?window.SP_PROGRESS_QUEUE.splice(0):[],seen=new Set(),queue=[];
  for(const entry of raw){const key=entryKey(entry);if(!seen.has(key)){seen.add(key);queue.push(entry)}}
  if(!queue.length)return;
  const a=api();
  queue.forEach(entry=>{
    const p=entry?.payload||{};
    if(String(p.lesson||p.lektion||'')==='7'&&String(p.module||'wortschatz').toLowerCase()==='wortschatz'){forget(entry);return}
    const method=String(entry?.method||''),fn=a?.[method];
    if(typeof fn!=='function'){requeue(entry);return}
    Promise.resolve(fn.call(a,p)).then(result=>{if(result)forget(entry);else requeue(entry)}).catch(()=>requeue(entry))
  });
}
function drainQueues(){const tq=Array.isArray(window.SP_L3_TASK_DONE_QUEUE)?window.SP_L3_TASK_DONE_QUEUE.splice(0):[];tq.forEach(file=>awardTask(file));const eq=Array.isArray(window.SP_L3_EXAM_QUEUE)?window.SP_L3_EXAM_QUEUE.splice(0):[];eq.forEach(r=>awardExam(r||{percent:100}));drainGenericProgressQueue()}
function patch(){
  if(window.__SP_SCORING_PATCHED_V17)return;window.__SP_SCORING_PATCHED_V17=true;
  const later=()=>{
    if(typeof window.complete==='function'&&!window.complete.__spScoringV17){const old=window.complete;window.complete=function(area,file,nextFile){const out=old.apply(this,arguments);if(isExamFile(file))awardExam({percent:100});else awardTask(file);return out};window.complete.__spScoringV17=true}
    if(typeof window.done==='function'&&!window.done.__spScoringV17){const old=window.done;window.done=function(file,total){const out=old.apply(this,arguments);awardTask(file,{payload:{total:Number(total||100),done:Number(total||100)}});return out};window.done.__spScoringV17=true}
    if(typeof window.finishTask==='function'&&!window.finishTask.__spScoringV17){const old=window.finishTask;window.finishTask=function(file){const out=old.apply(this,arguments);if(isExamFile(file))awardExam({percent:100});else awardTask(file);return out};window.finishTask.__spScoringV17=true}
    if(typeof window.saveTask==='function'&&!window.saveTask.__spScoringV17){const old=window.saveTask;window.saveTask=function(file,st){const out=old.apply(this,arguments),percent=statePercent(st||{});if(isExamFile(file))awardExam({percent});else if(percent>=100)awardTask(file,{payload:{total:Number(st?.total||100),done:Number(st?.done?.length||st?.done||100)}});return out};window.saveTask.__spScoringV17=true}
    if(typeof window.saveExamResult==='function'&&!window.saveExamResult.__spScoringV17){const old=window.saveExamResult;window.saveExamResult=function(result){const out=old.apply(this,arguments);awardExam(result||{});return out};window.saveExamResult.__spScoringV17=true}
    if(typeof window.syncExam==='function'&&!window.syncExam.__spScoringV17){const old=window.syncExam;window.syncExam=function(result){const out=old.apply(this,arguments);awardExam(result||{});return out};window.syncExam.__spScoringV17=true}
    drainQueues();
  };
  hydrateRetryQueue();later();document.addEventListener('DOMContentLoaded',later);setTimeout(later,250);setTimeout(later,900);setTimeout(drainGenericProgressQueue,1800);
}
window.SprachPilotScoring={RULES,scopeInfo,currentRun,taskPointsForRun:RULES.taskPoints,examMaxForRun:RULES.examMax,examEarnedForRun:RULES.examEarned,awardTask,awardExam,resetScope,drainGenericProgressQueue};
window.spL3RecordTaskDone=file=>awardTask(file);
window.spL3RecordExamResult=result=>awardExam(result||{percent:100});
window.addEventListener('online',()=>{if(retryTimer){clearTimeout(retryTimer);retryTimer=null}setTimeout(drainGenericProgressQueue,100)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(retryTimer){clearTimeout(retryTimer);retryTimer=null}setTimeout(drainGenericProgressQueue,100)}});
patch();