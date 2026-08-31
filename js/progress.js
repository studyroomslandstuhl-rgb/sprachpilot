import { db, doc, getDoc, getDocFromServer, serverTimestamp, collection, query, where, getDocs, limit } from "./firebase.js";
import { getActiveProfile } from "./auth.js";
import "/shared/points-recalculator.js?v=1";
import "/js/point-delta-bridge.js?v=20260831-central6";
import { runTransaction } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const MODULE_KEYS=["fragen","wortschatz","verben","perfekt","grammatik","dativverben"];
const MODULE_ALIASES={
  "fragen":"fragen","fragen-a1":"fragen","wortschatz":"wortschatz",
  "verben":"verben","verben-a1":"verben","irregulare-verben":"verben",
  "perfekt":"perfekt","grammatik":"grammatik","dativverben":"dativverben","dativ-verben":"dativverben"
};
const RULES={
  taskPoints(run){run=Number(run)||1;return run===1?5:run===2?10:run===3?15:0},
  examMax(run){run=Number(run)||1;return run===1?100:run===2?200:run===3?300:0},
  examEarned(run,percent){run=Number(run)||1;percent=clamp(percent);return run>=4?0:Math.round(this.examMax(run)*percent/100)}
};
const TECH=new Set(["state","progress","stars","activeVerbs","learnedVerbs","known","unknown","unsure","updatedAt","lastActive","lastLogin","lastPage","lastAction","totals","current","profile","metadata"]);

function now(){return new Date().toISOString()}
function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item"}
function normalizeModuleKey(value){const key=cleanId(value||"wortschatz");return MODULE_ALIASES[key]||key}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function clampRun(v){return Math.max(1,Math.min(3,Math.round(Number(v)||1)))}
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}}
function profile(){try{return getActiveProfile()||read("SP_USER_PROFILE")||read("SP_STUDENT_PROFILE")||{}}catch(e){return {}}}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem("SP_COURSE_CODE")||""}
function email(p=profile()){return String(p.email||"").trim().toLowerCase()}
function fallbackId(p=profile()){return cleanId((p.courseDocId||course(p)||"kurs")+"_"+(email(p)||p.vorname||p.firstName||"student"))}
function idCandidates(p=profile()){return uniq([p.canonicalStudentId,p.docId,p.studentId,p.userId,p.authUid,p.uid,p.id,...(Array.isArray(p.aliasIds)?p.aliasIds:[]),localStorage.getItem("SP_STUDENT_ID"),fallbackId(p)])}
function primaryIds(p=profile()){return idCandidates(p).slice(0,12)}
function studentId(p=profile()){return String(p.canonicalStudentId||idCandidates(p)[0]||fallbackId(p))}
function name(p=profile()){return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
function isTeacherPreview(){try{if(typeof window.spIsTeacherPreview==="function")return window.spIsTeacherPreview();const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();const prev=read("SP_TEACHER_PREVIEW")||read("teacherPreview");return role==="teacher"||!!(prev&&prev.teacherPreview===true)||sessionStorage.getItem("SP_TEACHER_PREVIEW")==="1"||localStorage.getItem("SP_TEACHER_PREVIEW")==="1"}catch(e){return false}}
function canWrite(){if(isTeacherPreview())return false;if(typeof window.spCanWriteFirebaseProgress==="function")return window.spCanWriteFirebaseProgress();if(window.SP_PERFORMANCE_MODE||window.SP_NO_FIREBASE_SYNC)return false;return true}
function isTopicRecord(k,v){return !TECH.has(k)&&!!(v&&typeof v==="object"&&!Array.isArray(v)&&(v.tasks||v.exam||v.current||v.lifetime||v.progressPercent!=null||v.title||v.moduleTitle))}
function point(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0}
function topicId(p){return p.topicId||p.themeId||cleanId([p.module||"wortschatz",p.level||"A1","lektion",p.lesson||p.lektion||"","thema",p.theme||p.thema||""].filter(Boolean).join("_"))}
function runKey(scope){return `SP_SCORE_RUN_${scope}`}
function currentRun(scope){return clampRun(localStorage.getItem(runKey(scope))||1)}
function setRun(scope,run){localStorage.setItem(runKey(scope),String(clampRun(run)))}
function explicitRun(payload={}){return payload.run!==undefined&&payload.run!==null&&String(payload.run)!==''}
function requestedRun(payload,id){return explicitRun(payload)?clampRun(payload.run):currentRun(id)}
function mergeRuns(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=Math.max(Number(a?.[k]||0),Number(b?.[k]||0));return out}
function mergeTaskRunMaps(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=mergeRuns(a?.[k]||{},b?.[k]||{});return out}
function exactTopicPoints(topic){try{return Number(window.SPPointRecalculator?.topicPoints?.(topic)?.points)||0}catch(e){return 0}}
function taskDoneCount(t={}){return Array.isArray(t.done)?t.done.length:Math.max(0,Number(t.done)||0)}
function topicRun(t={}){
  let run=Math.max(1,Number(t.currentRun)||0,Number(t.current?.run)||0,Number(t.exam?.run)||0,Math.min(3,(Number(t.lifetime?.resets)||0)+1));
  for(const task of Object.values(t.tasks||{}))run=Math.max(run,Number(task?.run)||0);
  return clampRun(run||1);
}
function taskIsCurrent(task={},source={},targetRun=1){
  const explicit=Number(task.run)||0;if(explicit)return explicit===targetRun;
  if(topicRun(source)!==targetRun)return false;
  if(targetRun>1&&source.current?.resetAt&&clamp(source.current?.percent||0)===0)return false;
  return true;
}
function examIsCurrent(source={},targetRun=1){
  const exam=source.exam||{},explicit=Number(exam.run)||0;if(explicit)return explicit===targetRun;
  if(topicRun(source)!==targetRun)return false;
  if(targetRun>1&&source.current?.resetAt&&clamp(source.current?.percent||0)===0&&!exam.lastAttemptAt)return false;
  return true;
}
function betterTask(a={},b={},run=1){
  const percent=Math.max(clamp(a.percent||0),clamp(b.percent||0)),done=Math.max(taskDoneCount(a),taskDoneCount(b)),total=Math.max(Number(a.total||0),Number(b.total||0));
  const stronger=(clamp(b.percent||0)>clamp(a.percent||0)||taskDoneCount(b)>taskDoneCount(a))?b:a;
  const weaker=stronger===a?b:a,pointsByRun=mergeRuns(a.pointsByRun||{},b.pointsByRun||{});
  const out={...weaker,...stronger,percent,completed:!!(a.completed||b.completed||percent>=100),done,total,pointsByRun,run};
  out.points=Object.values(pointsByRun).reduce((s,v)=>s+Math.max(0,Number(v)||0),0);return out
}
function mergeGeneric(a,b,key=''){
  if(a===undefined||a===null)return b;if(b===undefined||b===null)return a;
  if(Array.isArray(a)&&Array.isArray(b))return uniq([...a,...b].map(v=>typeof v==='string'?v:JSON.stringify(v))).map(v=>{try{return JSON.parse(v)}catch(e){return v}});
  if(typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){const out={...b,...a};for(const k of new Set([...Object.keys(a),...Object.keys(b)]))out[k]=mergeGeneric(a[k],b[k],k);return out}
  if(typeof a==='number'&&typeof b==='number'&&/(?:points?|score|stars?|percent|progress|attempt|count|total|done|learned|known|unknown|unsure|run|reset|revision)/i.test(key))return Math.max(a,b);
  if(typeof a==='boolean'&&typeof b==='boolean'&&/(?:done|completed|finished|passed|known|learned)/i.test(key))return a||b;
  return a;
}
function mergeTopic(a={},b={}){
  const run=Math.max(topicRun(a),topicRun(b)),aRun=topicRun(a),bRun=topicRun(b),preferred=aRun>bRun?a:bRun>aRun?b:a;
  const secondary=preferred===a?b:a,out={...secondary,...preferred,currentRun:run};
  const al=a.lifetime||{},bl=b.lifetime||{};
  out.lifetime={...bl,...al,taskPointRuns:mergeTaskRunMaps(al.taskPointRuns||{},bl.taskPointRuns||{}),examPointRuns:mergeRuns(al.examPointRuns||{},bl.examPointRuns||{}),resets:Math.max(Number(al.resets||0),Number(bl.resets||0),run-1),finishedRuns:Math.max(Number(al.finishedRuns||0),Number(bl.finishedRuns||0)),bestExamPercent:Math.max(Number(al.bestExamPercent||0),Number(bl.bestExamPercent||0)),bestStars:Math.max(Number(al.bestStars||0),Number(bl.bestStars||0)),completedTasks:Math.max(Number(al.completedTasks||0),Number(bl.completedTasks||0)),examAttempts:Math.max(Number(al.examAttempts||0),Number(bl.examAttempts||0))};
  const tasks={};
  for(const key of new Set([...Object.keys(a.tasks||{}),...Object.keys(b.tasks||{})])){
    const av=a.tasks?.[key],bv=b.tasks?.[key],ac=av&&taskIsCurrent(av,a,run),bc=bv&&taskIsCurrent(bv,b,run);
    if(ac&&bc)tasks[key]=betterTask(av,bv,run);else if(ac)tasks[key]={...av,run};else if(bc)tasks[key]={...bv,run};
  }
  out.tasks=tasks;
  const vals=Object.values(tasks),totalHint=Math.max(Number(a.totalTasks||a.current?.totalTasks||0),Number(b.totalTasks||b.current?.totalTasks||0),vals.length);
  out.completedTasks=vals.filter(t=>t.completed||clamp(t.percent)>=100).length;out.totalTasks=totalHint;
  out.progressPercent=vals.length?clamp(vals.reduce((s,t)=>s+clamp(t.percent||0),0)/Math.max(vals.length,totalHint||vals.length)):0;
  out.current={...(secondary.current||{}),...(preferred.current||{}),run,percent:out.progressPercent,completedTasks:out.completedTasks,totalTasks:out.totalTasks,updatedAt:now()};
  const ae=examIsCurrent(a,run)?(a.exam||{}):{},be=examIsCurrent(b,run)?(b.exam||{}):{};
  out.exam={...be,...ae,run,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempts:Math.max(Number(ae.attempts||0),Number(be.attempts||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed),unlocked:!!(ae.unlocked||be.unlocked)};
  out.examUnlocked=!!(out.exam.unlocked||a.examUnlocked||b.examUnlocked);
  out.lifetime.points=out.technicalRecovery?Math.max(point(al.points),point(bl.points)):exactTopicPoints(out);return out
}
function normalizeModuleAliases(progress={}){
  const out={...(progress||{})};
  for(const[rawKey,value]of Object.entries(progress||{})){
    const target=normalizeModuleKey(rawKey);if(!MODULE_KEYS.includes(target)||target===rawKey)continue;
    const merged={...(out[target]||{})};for(const[key,record]of Object.entries(value||{})){if(isTopicRecord(key,record))merged[key]=mergeTopic(record,merged[key]||{});else merged[key]=mergeGeneric(record,merged[key],key)}out[target]=merged;delete out[rawKey]
  }
  return out
}
function mergeProgress(a={},b={}){
  a=normalizeModuleAliases(a);b=normalizeModuleAliases(b);const out={...b,...a};
  for(const m of MODULE_KEYS){const mod={...(b[m]||{})};for(const[k,t]of Object.entries(a[m]||{})){if(isTopicRecord(k,t))mod[k]=mergeTopic(t,mod[k]||{});else mod[k]=mergeGeneric(t,mod[k],k)}out[m]=mod}
  out.metadata=mergeGeneric(a.metadata||{},b.metadata||{},'metadata');
  if(a.finnischVerben||b.finnischVerben)out.finnischVerben=mergeGeneric(a.finnischVerben||{},b.finnischVerben||{},'finnischVerben');
  out.ranking={...(b.ranking||{}),...(a.ranking||{}),points:Math.max(point(a.ranking?.points),point(b.ranking?.points))};
  out.totals={...(b.totals||{}),...(a.totals||{}),points:Math.max(point(a.totals?.points),point(b.totals?.points))};
  out.pointsTotal=Math.max(point(a.pointsTotal),point(b.pointsTotal));out.lifetimePoints=Math.max(point(a.lifetimePoints),point(b.lifetimePoints));out.punkteGesamt=Math.max(point(a.punkteGesamt),point(b.punkteGesamt));
  out.aliasIds=uniq([...(a.aliasIds||[]),...(b.aliasIds||[])]);return out
}
async function readProgress(id=null){
  const ids=id?[id]:primaryIds();let merged={};
  for(const one of ids){try{let snap;try{snap=await getDocFromServer(doc(db,"progress",one))}catch(serverError){snap=await getDoc(doc(db,"progress",one))}if(snap.exists())merged=mergeProgress(snap.data()||{},merged)}catch(e){console.warn("Progress read failed",one,e)}}return merged
}
function technicalRecoveryPoints(progress={}){let total=0;for(const m of MODULE_KEYS){const groupKey=m==='verben'?'verbenGroups':m==='perfekt'?'perfektGroups':'';let groupEvidence=0;if(groupKey){for(const group of Object.values(progress?.metadata?.[groupKey]||{})){try{groupEvidence+=Math.max(0,Number(window.SPPointRecalculator?.groupPoints?.(group)?.points)||0)}catch(e){}}}if(groupEvidence>0)continue;let maxRecovery=0;for(const[k,t]of Object.entries(progress[m]||{})){if(!isTopicRecord(k,t)||t?.technicalRecovery!==true)continue;maxRecovery=Math.max(maxRecovery,point(t?.lifetime?.points))}total+=maxRecovery}return total}
function evidencePoints(progress={}){const verified=Number(window.SPPointRecalculator?.calculate?.(progress)?.total)||0;return Math.max(0,verified)+technicalRecoveryPoints(progress)}
function storedPoints(...records){let best=Math.max(0,Number(localStorage.getItem("SP_POINTS_TOTAL")||0)||0);for(const r of records.filter(Boolean)){best=Math.max(best,point(r?.ranking?.points),point(r?.totals?.points),point(r?.pointsTotal),point(r?.lifetimePoints),point(r?.punkteGesamt),point(r?.points))}return best}
function recalcTotals(progress){progress=normalizeModuleAliases(progress);let stars=0,progressSum=0,progressCount=0,completedTasks=0,completedExams=0;for(const m of MODULE_KEYS){for(const[k,t]of Object.entries(progress[m]||{})){if(!isTopicRecord(k,t))continue;progressSum+=clamp(t.progressPercent??t.current?.percent??0);progressCount++;Object.values(t.tasks||{}).forEach(task=>{if(task&&task.completed)completedTasks++});if(t.exam?.attempted){completedExams++;stars+=Number(t.exam.stars||0)}}}const points=evidencePoints(progress);return{points,stars,progressPercent:progressCount?clamp(progressSum/progressCount):0,completedTasks,completedExams,updatedAt:now()}}
function taskAward(progress,event){
  const topic=progress?.[event.module]?.[event.topicId]||{},run=String(event.run),raw=event.rawKey,key=event.pointsKey;
  return Math.max(point(topic?.lifetime?.taskPointRuns?.[key]?.[run]),point(topic?.tasks?.[raw]?.pointsByRun?.[run]),point(topic?.tasks?.[key]?.pointsByRun?.[run]));
}
function examAward(progress,event){return point(progress?.[event.module]?.[event.topicId]?.lifetime?.examPointRuns?.[String(event.run)])}
function eventDelta(progress,event){if(!event?.targetAward)return 0;const existing=event.type==='exam'?examAward(progress,event):taskAward(progress,event);return Math.max(0,point(event.targetAward)-existing)}
async function writeProgress(next,event=null){
  if(!canWrite())return null;const p=profile(),id=studentId(p),kurs=course(p);if(!id)return null;next=normalizeModuleAliases(next);
  const ref=doc(db,"progress",id);let result=null,appliedDelta=0;
  try{
    await runTransaction(db,async tx=>{
      const snap=await tx.get(ref),server=snap.exists()?(snap.data()||{}):{},delta=eventDelta(server,event),floor=storedPoints(server,next),combined=mergeProgress(next,server);
      combined.studentId=id;combined.userId=id;combined.docId=id;combined.canonicalStudentId=id;combined.aliasIds=uniq([...idCandidates(p),...(combined.aliasIds||[])]);combined.kurs=kurs||combined.kurs||"";combined.kursnummer=kurs||combined.kursnummer||"";combined.courseCode=kurs||combined.courseCode||"";combined.studentName=name(p);combined.email=p.email||combined.email||"";combined.muttersprache=p.muttersprache||p.motherLanguage||combined.muttersprache||"";combined.lastActive=serverTimestamp();combined.updatedAt=serverTimestamp();combined.lastActiveAt=now();combined.lastPage=location.pathname;
      combined.totals=recalcTotals(combined);const evidence=Number(combined.totals.points)||0,safe=Math.max(evidence,floor+delta);combined.totals.points=safe;combined.lifetimePoints=safe;combined.pointsTotal=safe;combined.punkteGesamt=safe;combined.ranking={...(combined.ranking||{}),points:safe,updatedAt:now()};combined.metadata={...(combined.metadata||{}),pointAudit:{...(combined.metadata?.pointAudit||{}),version:9,autoLoweringDisabled:true,transactionalAwards:true,runAwareHistoricalSync:true,lastEvidenceCheckAt:now(),evidencePoints:evidence,preservedPoints:safe,lastAward:event?{type:event.type,module:event.module,topicId:event.topicId,run:event.run,targetAward:event.targetAward,delta}:null}};
      tx.set(ref,combined,{merge:true});result=combined;appliedDelta=delta;
    });
  }catch(e){console.warn("Progress transaction failed",id,e);try{localStorage.setItem("SP_PROGRESS_LAST_ERROR",JSON.stringify({at:now(),id,message:e?.message||String(e)}))}catch(x){}return null}
  const safe=storedPoints(result);try{localStorage.setItem("SP_STUDENT_ID",id);localStorage.setItem("SP_POINTS_TOTAL",String(safe));localStorage.setItem("SP_PROGRESS_LAST_SYNC",now());localStorage.removeItem("SP_PROGRESS_LAST_ERROR")}catch(e){}
  try{window.dispatchEvent(new CustomEvent("SP_ACCOUNT_PROGRESS_SYNCED",{detail:{studentId:id,points:safe,transactional:true}}));window.dispatchEvent(new CustomEvent("SP_PROGRESS_WRITE_CONFIRMED",{detail:{studentId:id,points:safe,transactional:true}}));if(appliedDelta>0)window.dispatchEvent(new CustomEvent("SP_POINT_DELTA_APPLIED",{detail:{studentId:id,total:safe,delta:appliedDelta,type:event?.type||'progress',module:event?.module,topicId:event?.topicId,run:event?.run}}))}catch(e){}
  return result
}
function taskTitle(file){return String(file||"Aufgabe").replace(/\.html$/i,"").replace(/-/g," ")}
async function recordTaskProgress(payload={}){
  if(!canWrite())return null;
  try{
    const moduleKey=normalizeModuleKey(payload.module||"wortschatz"),id=topicId({...payload,module:moduleKey}),incomingRun=requestedRun(payload,id),current=await readProgress(),mod={...(current[moduleKey]||{})},topic={...(mod[id]||{})},existingRun=topicRun(topic),historical=explicitRun(payload)&&incomingRun<existingRun,activeRun=historical?incomingRun:Math.max(incomingRun,existingRun),rawKey=payload.file||payload.taskKey||payload.taskTitle||"task",pointsKey=cleanId(rawKey);
    if(!explicitRun(payload)&&existingRun>incomingRun)setRun(id,existingRun);else if(!historical&&activeRun>currentRun(id))setRun(id,activeRun);
    const lifetime={...(topic.lifetime||{})},taskPointRuns=mergeTaskRunMaps(lifetime.taskPointRuns||{},{}),existingVisible=historical?{}:{...(topic.tasks||{})},currentTasks={};
    if(!historical&&activeRun===existingRun){for(const[k,t]of Object.entries(existingVisible))if(taskIsCurrent(t,topic,activeRun))currentTasks[k]=t}
    const old=historical?{}:(currentTasks[rawKey]||currentTasks[pointsKey]||{});let percent=clamp(payload.percent??payload.progress??0);if(!payload.allowDecrease&&!historical)percent=Math.max(percent,clamp(old.percent||0));const completed=!!payload.completed||percent>=100,thisRuns=mergeRuns(taskPointRuns[pointsKey]||{},old.pointsByRun||{});if(completed&&!thisRuns[String(activeRun)])thisRuns[String(activeRun)]=RULES.taskPoints(activeRun);taskPointRuns[pointsKey]=thisRuns;
    lifetime.taskPointRuns=taskPointRuns;lifetime.completedTasks=Math.max(Number(lifetime.completedTasks||0),completed?1:0);lifetime.resets=Math.max(Number(lifetime.resets||0),existingRun-1,activeRun-1);
    topic.title=payload.title||topic.title||`A1 Lektion ${payload.lesson||""} · Thema ${payload.theme||""}`;topic.moduleTitle=payload.moduleTitle||topic.moduleTitle||"Wortschatz";topic.level=payload.level||topic.level||"A1";topic.lesson=payload.lesson||topic.lesson||"";topic.theme=payload.theme||topic.theme||"";topic.lifetime=lifetime;
    if(!historical){
      currentTasks[rawKey]={...old,key:rawKey,file:payload.file||old.file||rawKey,title:payload.taskTitle||old.title||taskTitle(payload.file||rawKey),percent,completed,total:Number(payload.total||old.total||0),done:Number(payload.done||old.done||0),lastActiveAt:now(),completedAt:completed?(old.completedAt||now()):(old.completedAt||null),points:Object.values(thisRuns).reduce((s,v)=>s+Math.max(0,Number(v)||0),0),pointsByRun:thisRuns,run:activeRun};
      const values=Object.values(currentTasks),avg=values.length?clamp(values.reduce((s,t)=>s+Number(t.percent||0),0)/values.length):percent,done=values.filter(t=>t.completed).length;topic.currentRun=activeRun;topic.progressPercent=avg;topic.completedTasks=done;topic.totalTasks=Math.max(Number(topic.totalTasks||0),values.length);topic.tasks=currentTasks;topic.current={run:activeRun,percent:avg,completedTasks:done,totalTasks:topic.totalTasks,updatedAt:now()};
    }
    topic.lifetime.points=exactTopicPoints(topic);mod[id]=topic;current[moduleKey]=mod;
    return await writeProgress(current,{type:'task',module:moduleKey,topicId:id,rawKey,pointsKey,run:activeRun,targetAward:completed?RULES.taskPoints(activeRun):0,historical});
  }catch(e){console.warn("SPProgress task sync failed",e);return null}
}
async function recordExamResult(payload={}){
  if(!canWrite())return null;
  try{
    const moduleKey=normalizeModuleKey(payload.module||"wortschatz"),id=topicId({...payload,module:moduleKey}),incomingRun=requestedRun(payload,id),current=await readProgress(),mod={...(current[moduleKey]||{})},topic={...(mod[id]||{})},existingRun=topicRun(topic),historical=explicitRun(payload)&&incomingRun<existingRun,activeRun=historical?incomingRun:Math.max(incomingRun,existingRun),percent=clamp(payload.percent??payload.scorePercent??payload.score??0),earned=RULES.examEarned(activeRun,percent),maxScore=RULES.examMax(activeRun),lifetime={...(topic.lifetime||{})},examRuns=mergeRuns(lifetime.examPointRuns||{},{});
    if(!explicitRun(payload)&&existingRun>incomingRun)setRun(id,existingRun);else if(!historical&&activeRun>currentRun(id))setRun(id,activeRun);
    examRuns[String(activeRun)]=Math.max(Number(examRuns[String(activeRun)]||0),earned);lifetime.examPointRuns=examRuns;lifetime.resets=Math.max(Number(lifetime.resets||0),existingRun-1,activeRun-1);lifetime.bestExamPercent=Math.max(Number(lifetime.bestExamPercent||0),percent);lifetime.bestStars=Math.max(Number(lifetime.bestStars||0),Number(payload.stars||0));lifetime.examAttempts=Math.max(Number(lifetime.examAttempts||0),1);topic.lifetime=lifetime;topic.title=payload.title||topic.title||`A1 Lektion ${payload.lesson||""} · Thema ${payload.theme||""}`;topic.moduleTitle=payload.moduleTitle||topic.moduleTitle||"Wortschatz";topic.level=payload.level||topic.level||"A1";topic.lesson=payload.lesson||topic.lesson||"";topic.theme=payload.theme||topic.theme||"";
    if(!historical){
      const exam=examIsCurrent(topic,activeRun)?{...(topic.exam||{})}:{},attempts=Number(exam.attempts||0)+1,stars=Number(payload.stars??(percent>=100?3:percent>=70?2:percent>=50?1:0));topic.exam={...exam,run:activeRun,attempted:true,unlocked:true,attempts,lastScore:earned,lastPercent:percent,lastStars:stars,lastAttemptAt:now(),bestScore:Math.max(Number(exam.bestScore||0),earned),bestPercent:Math.max(Number(exam.bestPercent||0),percent),percent:Math.max(Number(exam.percent||0),percent),stars:Math.max(Number(exam.stars||0),stars),maxScore,completed:percent>=100||exam.completed===true};topic.currentRun=activeRun;topic.examUnlocked=true;topic.current={...(topic.current||{}),run:activeRun,updatedAt:now()};lifetime.bestStars=Math.max(Number(lifetime.bestStars||0),stars);lifetime.examAttempts=Math.max(Number(lifetime.examAttempts||0),attempts);
    }
    topic.lifetime.points=exactTopicPoints(topic);mod[id]=topic;current[moduleKey]=mod;
    return await writeProgress(current,{type:'exam',module:moduleKey,topicId:id,run:activeRun,targetAward:earned,historical});
  }catch(e){console.warn("SPProgress exam sync failed",e);return null}
}
async function recordThemeReset(payload={}){
  if(!canWrite())return null;
  try{
    const moduleKey=normalizeModuleKey(payload.module||"wortschatz"),id=topicId({...payload,module:moduleKey}),current=await readProgress(),mod={...(current[moduleKey]||{})},topic={...(mod[id]||{})},oldRun=Math.max(currentRun(id),topicRun(topic)),nextRun=Math.min(3,oldRun+1);setRun(id,nextRun);const lifetime={...(topic.lifetime||{})};lifetime.resets=Math.max(Number(lifetime.resets||0),nextRun-1);topic.currentRun=nextRun;topic.progressPercent=0;topic.completedTasks=0;topic.totalTasks=topic.totalTasks||0;topic.tasks={};topic.current={run:nextRun,percent:0,completedTasks:0,totalTasks:topic.totalTasks||0,resetAt:now(),updatedAt:now()};topic.examUnlocked=false;topic.exam={run:nextRun,unlocked:false,attempted:false,attempts:0,bestPercent:0,percent:0,stars:0,completed:false};topic.lifetime=lifetime;topic.lifetime.points=Math.max(point(lifetime.points),exactTopicPoints(topic));mod[id]=topic;current[moduleKey]=mod;return await writeProgress(current)
  }catch(e){console.warn("SPProgress reset sync failed",e);return null}
}
async function touch(){if(!canWrite())return null;try{return await writeProgress(await readProgress())}catch(e){return null}}
async function loadCurrentStudentProgress(){if(isTeacherPreview())return{};return await readProgress()}
async function loadCourseRanking(courseCode=course()){if(isTeacherPreview()||!courseCode)return[];const q=query(collection(db,"progress"),where("kurs","==",courseCode),limit(100));const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}))}
async function migrateLegacyLocalProgress(){return null}
function verbStats(mod={}){const len=x=>Array.isArray(x)?x.length:(x&&typeof x==="object"?Object.keys(x).length:0),learned=len(mod.learnedVerbs||mod.known||mod.state?.learnedVerbs||mod.state?.known||[]),active=len(mod.activeVerbs||mod.state?.activeVerbs||mod.state?.active||[]),known=len(mod.known||mod.state?.known||[]),unsure=len(mod.unsure||mod.state?.unsure||[]),unknown=len(mod.unknown||mod.state?.unknown||[]);return{learned,active,known,unsure,unknown,contentsDone:Math.floor(learned/20),currentPackagePercent:Math.min(100,Math.round(((learned%20)||(learned?20:0))/20*100))}}
async function syncCurrentTopicLocal(){return null}
const API={RULES,recordTaskProgress,recordExamResult,recordThemeReset,touch,loadCurrentStudentProgress,loadCourseRanking,migrateLegacyLocalProgress,verbStats,currentRun,taskPointsForRun:RULES.taskPoints,examMaxForRun:RULES.examMax,examEarnedForRun:RULES.examEarned,idCandidates,syncCurrentTopicLocal};
window.SPProgress=API;const queued=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE=[];for(const item of queued){if(item&&API[item.method])API[item.method](item.payload||{})}
export{recordTaskProgress,recordExamResult,recordThemeReset,touch,loadCurrentStudentProgress,loadCourseRanking,migrateLegacyLocalProgress,verbStats};