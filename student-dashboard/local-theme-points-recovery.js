import '/js/progress.js?v=20260831-central4';
import '/js/point-delta-bridge.js?v=20260831-central6';

const clean=value=>String(value||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'');
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function currentPids(){
 const p=profile(),fallback=[p.kurs||p.kursnummer||p.courseCode,p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_');
 const aliases=Array.isArray(p.aliasIds)?p.aliasIds:[];
 const runtimeAliases=Array.isArray(window.SP_PROGRESS_ALIAS_UNIFIER?.aliases)?window.SP_PROGRESS_ALIAS_UNIFIER.aliases:[];
 const values=[
  p.authUid,p.canonicalStudentId,p.courseDocId,p.docId,p.studentId,p.userId,p.uid,p.id,p.email,fallback,
  ...aliases,...runtimeAliases,
  localStorage.getItem('SP_STUDENT_ID'),
  localStorage.getItem('SP_ACCOUNT_PROGRESS_OWNER'),
  localStorage.getItem('SP_L7_STABLE_PID'),
  localStorage.getItem('SP_L8_ACTIVE_PID_V2'),
  localStorage.getItem('SP_L8_ACTIVE_OWNER_V2')
 ];
 return new Set(values.map(clean).filter(Boolean));
}
function ledgers(){
 const pids=currentPids(),out=[];
 for(let i=0;i<localStorage.length;i++){
  const key=String(localStorage.key(i)||''),m=key.match(/^SP_THEME_SCORE_A1_L([78])_T(\d+)_V1_(.+)$/i);
  if(!m||!pids.has(clean(m[3])))continue;
  try{const ledger=JSON.parse(localStorage.getItem(key)||'null');if(ledger&&typeof ledger==='object')out.push({key,lesson:Number(m[1]),theme:Number(m[2]),ledger})}catch(e){}
 }
 return out;
}
function topicId(lesson,theme){return`wortschatz-a1-lektion-${lesson}-thema-${theme}`}
function taskPoints(run){return run===1?5:run===2?10:run===3?15:0}
function examMax(run){return run===1?100:run===2?200:run===3?300:0}
async function recoverOne(entry,api){
 const {lesson,theme,key}=entry,ledger=entry.ledger||{},pending=ledger.pending||{},taskPending={...(pending.tasks||{})},examPending={...(pending.exams||{})};
 const taskKeys=Object.keys(taskPending),examKeys=Object.keys(examPending);if(!taskKeys.length&&!examKeys.length)return 0;
 const runStorage=`SP_SCORE_RUN_${topicId(lesson,theme)}`,restore=Math.max(1,Math.min(3,Number(ledger.currentRun)||1));let recovered=0;
 try{
  for(const pendingKey of taskKeys){
   const cut=pendingKey.indexOf(':'),run=Math.max(1,Math.min(3,Number(pendingKey.slice(0,cut))||1)),id=pendingKey.slice(cut+1),data=ledger.runs?.[String(run)]||ledger.runs?.[run]||{},item=data.tasks?.[id];
   if(!item){delete taskPending[pendingKey];continue}
   localStorage.setItem(runStorage,String(run));
   const result=await api.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson,theme,topicId:topicId(lesson,theme),title:`A1 Lektion ${lesson} · Thema ${theme}`,file:`task.html?task=${id}`,taskKey:id,taskTitle:item.title||id,total:Number(item.total)||1,done:Number(item.done)||0,percent:Number(item.percent)||0,completed:!!item.completed,run});
   if(result){delete taskPending[pendingKey];recovered+=item.completed?taskPoints(run):0}
  }
  for(const pendingKey of examKeys){
   const run=Math.max(1,Math.min(3,Number(pendingKey)||1)),data=ledger.runs?.[String(run)]||ledger.runs?.[run]||{},percent=Math.max(0,Math.min(100,Number(data.examBestPercent)||0));
   if(!percent){delete examPending[pendingKey];continue}
   localStorage.setItem(runStorage,String(run));
   const result=await api.recordExamResult({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson,theme,topicId:topicId(lesson,theme),title:`A1 Lektion ${lesson} · Thema ${theme}`,percent,scorePercent:percent,stars:Number(data.examStars)||0,run});
   if(result){delete examPending[pendingKey];recovered+=Math.round(examMax(run)*percent/100)}
  }
 }finally{localStorage.setItem(runStorage,String(restore))}
 ledger.pending={...pending,tasks:taskPending,exams:examPending};ledger.updatedAt=new Date().toISOString();try{localStorage.setItem(key,JSON.stringify(ledger))}catch(e){}
 return recovered;
}
export async function recover(options={}){
 const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();if(['teacher','lehrer','admin','owner'].includes(role))return 0;
 if(!options.skipAliasWait){try{if(window.SP_PROGRESS_ALIAS_READY)await window.SP_PROGRESS_ALIAS_READY}catch(e){}}
 const api=window.SPProgress;if(!api?.recordTaskProgress)return 0;let recovered=0;
 for(const entry of ledgers()){try{recovered+=await recoverOne(entry,api)}catch(e){console.warn('Lokale Themenpunkte konnten noch nicht synchronisiert werden',entry.key,e)}}
 if(recovered>0){try{window.dispatchEvent(new CustomEvent('SP_POINT_DELTA_APPLIED',{detail:{type:'local-theme-recovery',recovered}}))}catch(e){}}
 return recovered;
}
window.SP_LOCAL_THEME_POINTS_RECOVERY={recover};
setTimeout(()=>recover({skipAliasWait:true}),400);
window.addEventListener('online',()=>setTimeout(()=>recover({skipAliasWait:true}),150));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>recover({skipAliasWait:true}),150)});
