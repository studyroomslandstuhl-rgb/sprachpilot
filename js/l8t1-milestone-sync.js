const MASTER_KEY='SP_L8_T1_LOCAL_HUB_V1';
const TOPIC='wortschatz-a1-lektion-8-thema-1';
const RUN_KEY='SP_SCORE_RUN_'+TOPIC;
const SYNC_VERSION=7;
let running=null,timer=null;
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9@._-]+/g,'_').replace(/^_+|_+$/g,'');
const parse=(value,fallback=null)=>{try{return JSON.parse(value||'')??fallback}catch(e){return fallback}};
const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
function profile(){return parse(localStorage.getItem('SP_USER_PROFILE'),null)||parse(localStorage.getItem('SP_STUDENT_PROFILE'),null)||{}}
function readMaster(){const raw=parse(localStorage.getItem(MASTER_KEY),null);return raw&&typeof raw==='object'?raw:null}
function ownerCandidates(){const p=profile();return [...new Set([p.canonicalStudentId,p.docId,p.studentId,p.userId,p.authUid,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),p.email].map(clean).filter(Boolean))]}
function findOwner(master){const students=master?.students&&typeof master.students==='object'?master.students:{};for(const id of ownerCandidates())if(students[id])return id;const keys=Object.keys(students);return keys.length===1?keys[0]:''}
function doneCount(st){const total=Math.max(0,Number(st?.total)||0);return new Set((st?.done||[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<total)).size}
function completed(st){const total=Math.max(0,Number(st?.total)||0);return total>0&&doneCount(st)>=total}
function isExam(id){return /(pruefung|prüfung|exam)/i.test(String(id||''))}
function taskTitle(id){try{return window.L8_THEME?.tasks?.find(t=>String(t.id)===String(id))?.title||String(id)}catch(e){return String(id)}}
function signature(run,id,st){return `${SYNC_VERSION}|${run}|${id}|100|${doneCount(st)}|${Number(st?.total)||0}|${Number(st?.firstCorrect)||0}`}
function ackKey(run,id){return `V${SYNC_VERSION}:R${run}:${id}`}
function acked(master,owner,key,sig){return String(master?.students?.[owner]?.sync?.[key]||'')===sig}
function saveAck(owner,key,sig){const latest=readMaster();if(!latest?.students?.[owner])return;latest.students[owner].sync=latest.students[owner].sync&&typeof latest.students[owner].sync==='object'?latest.students[owner].sync:{};latest.students[owner].sync[key]=sig;latest.updatedAt=new Date().toISOString();try{localStorage.setItem(MASTER_KEY,JSON.stringify(latest))}catch(e){}}
function cloudRun(progress={}){const topic=progress?.wortschatz?.[TOPIC]||{};return Math.max(1,Math.min(3,Number(topic.currentRun||topic.current?.run||((Number(topic.lifetime?.resets)||0)+1))||1))}
async function normalizeIdentity(){try{const identity=await import('/js/student-identity.js?v=identity5');const p=profile(),normalized=await identity.normalizeStudentIdentity(p,{silent:true}),canonical=String(normalized?.canonicalStudentId||normalized?.docId||'').trim();if(canonical)localStorage.setItem('SP_STUDENT_ID',canonical);return normalized||p}catch(error){console.warn('L8T1: Schüleridentität konnte vor dem Fortschrittssync nicht normalisiert werden',error);return profile()}}
async function api(){try{await normalizeIdentity();if(!window.SPProgress?.recordTaskProgress)await import('/js/progress.js?v=20260831-central1');return window.SPProgress?.recordTaskProgress?window.SPProgress:null}catch(error){console.warn('L8T1 milestone sync: Fortschritts-API fehlt',error);return null}}
async function doFlush(reason='auto'){
 const master=readMaster();if(!master)return{ok:true,reason:'no-local-l8t1',synced:0};
 const owner=findOwner(master);if(!owner)return{ok:false,reason:'local-owner-not-found',synced:0};
 const student=master.students?.[owner];if(!student?.runs)return{ok:true,reason:'no-runs',synced:0};
 const P=await api();if(!P)return{ok:false,reason:'progress-api-unavailable',synced:0};
 let serverProgress={};try{serverProgress=await P.loadCurrentStudentProgress?.()||{}}catch(e){}
 let currentServerRun=cloudRun(serverProgress),synced=0,failed=0,eligible=0,skippedHistorical=0;const originalRun=localStorage.getItem(RUN_KEY);
 try{
  const runs=Object.entries(student.runs||{}).sort((a,b)=>Number(a[0])-Number(b[0]));
  for(const [runRaw,runData] of runs){
   const run=Math.max(1,Math.min(3,Number(runRaw)||1));
   // Ein bereits serverseitig weiter fortgeschrittener Run wird nicht rückwärts
   // überschrieben. Solche historischen Altdaten bleiben im lokalen Hub erhalten und
   // können bei Bedarf gezielt geprüft werden.
   if(run<currentServerRun){for(const st of Object.values(runData?.tasks||{}))if(completed(st)){eligible++;skippedHistorical++}continue}
   for(const [id,st] of Object.entries(runData?.tasks||{})){
    if(!completed(st))continue;eligible++;
    const key=ackKey(run,id),sig=signature(run,id,st);if(acked(readMaster(),owner,key,sig))continue;
    try{
     localStorage.setItem(RUN_KEY,String(run));const total=Math.max(1,Number(st.total)||1),done=doneCount(st),result=isExam(id)
       ?await P.recordExamResult({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:8,theme:1,topicId:TOPIC,title:'A1 Lektion 8 · Thema 1',file:'pruefung.html',score:Math.max(0,Math.min(total,Number(st.firstCorrect)||0)),maxScore:total,percent:clamp((Number(st.firstCorrect)||0)/total*100),scorePercent:clamp((Number(st.firstCorrect)||0)/total*100),stars:clamp((Number(st.firstCorrect)||0)/total*100)>=100?3:clamp((Number(st.firstCorrect)||0)/total*100)>=70?2:clamp((Number(st.firstCorrect)||0)/total*100)>=50?1:0})
       :await P.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:8,theme:1,topicId:TOPIC,title:'A1 Lektion 8 · Thema 1',file:`task.html?task=${id}`,taskKey:id,taskTitle:taskTitle(id),total,done,percent:100,completed:true,countAttempt:false});
     if(result==null)throw new Error('Zentraler Fortschrittsschreibvorgang nicht bestätigt');saveAck(owner,key,sig);synced++;currentServerRun=Math.max(currentServerRun,run);
    }catch(error){failed++;console.warn('L8T1 milestone sync fehlgeschlagen',id,error)}
   }
  }
 }finally{if(originalRun==null)localStorage.removeItem(RUN_KEY);else localStorage.setItem(RUN_KEY,originalRun)}
 try{window.dispatchEvent(new CustomEvent('SP_L8T1_MILESTONES_SYNCED',{detail:{reason,synced,failed,eligible,skippedHistorical,centralWriter:true}}))}catch(e){}
 return{ok:failed===0,reason,synced,failed,eligible,skippedHistorical,centralWriter:true};
}
export function flushL8T1Milestones(options={}){if(running)return running;running=doFlush(options.reason||'manual').finally(()=>{running=null});return running}
export function scheduleL8T1MilestoneSync(delay=700,reason='local-change'){clearTimeout(timer);timer=setTimeout(()=>flushL8T1Milestones({reason}),Math.max(0,Number(delay)||0))}
window.SPL8T1MilestoneSync={flush:flushL8T1Milestones,schedule:scheduleL8T1MilestoneSync};
window.addEventListener('l8t1-local-progress',()=>scheduleL8T1MilestoneSync(850,'local-progress'));
window.addEventListener('online',()=>scheduleL8T1MilestoneSync(150,'online'));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')scheduleL8T1MilestoneSync(250,'visible')});
setTimeout(()=>flushL8T1Milestones({reason:'startup'}),900);