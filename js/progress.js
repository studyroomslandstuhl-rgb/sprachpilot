import { db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "./firebase.js";
import { getActiveProfile } from "./auth.js";

const MODULE_KEYS=["fragen","wortschatz","verben","grammatik"];
const RULES={taskPoints(run){run=Number(run)||1;if(run===1)return 5;if(run===2)return 10;if(run===3)return 15;return 0},examMax(run){run=Number(run)||1;if(run===1)return 100;if(run===2)return 200;if(run===3)return 300;return 0},examEarned(run,percent){run=Number(run)||1;percent=clamp(percent);if(run>=4)return 0;return Math.round(this.examMax(run)*percent/100)}};
const TECH=new Set(["state","progress","stars","activeVerbs","learnedVerbs","known","unknown","unsure","updatedAt","lastActive","lastLogin","lastPage","lastAction","totals","current","profile","metadata"]);
function now(){return new Date().toISOString()}
function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item"}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}}
function profile(){try{return getActiveProfile()||read("SP_USER_PROFILE")||read("SP_STUDENT_PROFILE")||{}}catch(e){return {}}}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem("SP_COURSE_CODE")||""}
function email(p=profile()){return String(p.email||"").trim().toLowerCase()}
function fallbackId(p=profile()){return cleanId((p.courseDocId||course(p)||"kurs")+"_"+(email(p)||p.vorname||p.firstName||"student"))}
function idCandidates(p=profile()){return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem("SP_STUDENT_ID"),fallbackId(p)])}
function primaryIds(p=profile()){return uniq([p.docId,p.studentId,p.userId,localStorage.getItem("SP_STUDENT_ID"),fallbackId(p)]).slice(0,2)}
function studentId(p=profile()){return idCandidates(p)[0]||fallbackId(p)}
function name(p=profile()){return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
function isTeacherPreview(){try{if(typeof window.spIsTeacherPreview==="function")return window.spIsTeacherPreview();const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();const prev=read("SP_TEACHER_PREVIEW")||read("teacherPreview");return role==="teacher"||!!(prev&&prev.teacherPreview===true)||sessionStorage.getItem("SP_TEACHER_PREVIEW")==="1"||localStorage.getItem("SP_TEACHER_PREVIEW")==="1"}catch(e){return false}}
function canWrite(){if(isTeacherPreview())return false;if(typeof window.spCanWriteFirebaseProgress==="function")return window.spCanWriteFirebaseProgress();if(window.SP_PERFORMANCE_MODE||window.SP_NO_FIREBASE_SYNC)return false;return true}
function isTopicRecord(k,v){return !TECH.has(k)&&!!(v&&typeof v==="object"&&!Array.isArray(v)&&(v.tasks||v.exam||v.current||v.lifetime||v.progressPercent||v.title||v.moduleTitle))}
function point(v){const n=Number(v);return Number.isFinite(n)?n:0}
function strongest(...records){let best=Math.max(0,Number(localStorage.getItem("SP_POINTS_TOTAL")||0)||0);records.filter(Boolean).forEach(r=>{best=Math.max(best,point(r.lifetimePoints),point(r.pointsTotal),point(r.punkteGesamt),point(r.totals?.points));MODULE_KEYS.forEach(m=>Object.values(r[m]||{}).forEach(t=>{if(t&&typeof t==="object"&&!Array.isArray(t))best=Math.max(best,point(t.lifetime?.points),point(t.lifetimePoints),point(t.pointsTotal))}))});return best}
function addDelta(progress,delta){delta=Math.max(0,point(delta));if(delta)progress.__pointsDelta=point(progress.__pointsDelta)+delta}
function takeDelta(progress){const d=Math.max(0,point(progress?.__pointsDelta));if(progress&&Object.prototype.hasOwnProperty.call(progress,"__pointsDelta"))delete progress.__pointsDelta;return d}
function topicId(p){return p.topicId||p.themeId||cleanId([p.module||"wortschatz",p.level||"A1","lektion",p.lesson||p.lektion||"","thema",p.theme||p.thema||""].filter(Boolean).join("_"))}
function runKey(scope){return`SP_SCORE_RUN_${scope}`}
function currentRun(scope){return Math.max(1,Math.round(Number(localStorage.getItem(runKey(scope))||1)||1))}
function setRun(scope,run){localStorage.setItem(runKey(scope),String(Math.max(1,Math.round(Number(run)||1))))}
function mergeRuns(a={},b={}){const out={...b,...a};Object.keys(b||{}).forEach(k=>out[k]=Math.max(Number(out[k]||0),Number(b[k]||0)));Object.keys(a||{}).forEach(k=>out[k]=Math.max(Number(out[k]||0),Number(a[k]||0)));return out}
function betterTask(a={},b={}){return clamp(b.percent)>clamp(a.percent)?b:{...b,...a,percent:Math.max(clamp(a.percent),clamp(b.percent)),completed:!!(a.completed||b.completed),done:Math.max(Number(a.done||0),Number(b.done||0)),total:Math.max(Number(a.total||0),Number(b.total||0)),points:Math.max(Number(a.points||0),Number(b.points||0)),pointsByRun:{...(b.pointsByRun||{}),...(a.pointsByRun||{})}}}
function mergeTopic(a={},b={}){const out={...b,...a};const tasks={...(b.tasks||{})};Object.entries(a.tasks||{}).forEach(([k,v])=>{tasks[k]=betterTask(tasks[k]||{},v)});out.tasks=tasks;const vals=Object.values(tasks);out.completedTasks=vals.filter(t=>t.completed||clamp(t.percent)>=100).length;out.totalTasks=Math.max(Number(a.totalTasks||0),Number(b.totalTasks||0),vals.length);out.progressPercent=vals.length?clamp(vals.reduce((s,t)=>s+clamp(t.percent||0),0)/Math.max(vals.length,out.totalTasks||vals.length)):Math.max(clamp(a.progressPercent||a.current?.percent||0),clamp(b.progressPercent||b.current?.percent||0));out.current={...(b.current||{}),...(a.current||{}),percent:out.progressPercent,completedTasks:out.completedTasks,totalTasks:out.totalTasks,updatedAt:now()};const ae=a.exam||{},be=b.exam||{};out.exam={...be,...ae,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed)};const al=a.lifetime||{},bl=b.lifetime||{};out.lifetime={...bl,...al,points:Math.max(Number(al.points||0),Number(bl.points||0)),taskPointRuns:{...(bl.taskPointRuns||{}),...(al.taskPointRuns||{})},examPointRuns:mergeRuns(al.examPointRuns||{},bl.examPointRuns||{}),resets:Math.max(Number(al.resets||0),Number(bl.resets||0)),finishedRuns:Math.max(Number(al.finishedRuns||0),Number(bl.finishedRuns||0))};return out}
function mergeProgress(a={},b={}){const out={...b,...a};MODULE_KEYS.forEach(m=>{const mod={...(b[m]||{})};Object.entries(a[m]||{}).forEach(([k,t])=>{if(isTopicRecord(k,t))mod[k]=mergeTopic(t,mod[k]||{});else mod[k]=t});out[m]=mod});out.lifetimePoints=Math.max(point(a.lifetimePoints),point(b.lifetimePoints),point(a.totals?.points),point(b.totals?.points));out.pointsTotal=Math.max(point(a.pointsTotal),point(b.pointsTotal),out.lifetimePoints);out.punkteGesamt=Math.max(point(a.punkteGesamt),point(b.punkteGesamt),out.lifetimePoints);return out}
async function readProgress(id=null){const ids=id?[id]:primaryIds();let merged={};for(const one of ids){try{const snap=await getDoc(doc(db,"progress",one));if(snap.exists())merged=mergeProgress(snap.data()||{},merged)}catch(e){}}return merged}
function recalcTotals(progress){let points=0,stars=0,progressSum=0,progressCount=0,completedTasks=0,completedExams=0;MODULE_KEYS.forEach(m=>{const mod=progress[m]||{};Object.entries(mod).forEach(([k,t])=>{if(!isTopicRecord(k,t))return;const lifetime=t.lifetime||{};points+=point(lifetime.points);const pct=clamp(t.progressPercent??t.current?.percent??0);progressSum+=pct;progressCount++;Object.values(t.tasks||{}).forEach(task=>{if(task&&task.completed)completedTasks++});if(t.exam?.attempted){completedExams++;stars+=Number(t.exam.stars||0)}})});return{points,stars,progressPercent:progressCount?clamp(progressSum/progressCount):0,completedTasks,completedExams,updatedAt:now()}}
async function writeProgress(next){if(!canWrite())return null;const p=profile(),id=studentId(p),kurs=course(p);if(!id)return null;let previous={};try{previous=await readProgress(id)}catch(e){}const earned=takeDelta(next);next=mergeProgress(next,previous);next.studentId=id;next.userId=id;next.docId=id;next.kurs=kurs||next.kurs||"";next.kursnummer=kurs||next.kursnummer||"";next.courseCode=kurs||next.courseCode||"";next.studentName=name(p);next.email=p.email||next.email||"";next.muttersprache=p.muttersprache||p.motherLanguage||next.muttersprache||"";next.lastActive=serverTimestamp();next.updatedAt=serverTimestamp();next.lastActiveAt=now();next.lastPage=location.pathname;next.totals=recalcTotals(next);const preserved=Math.max(strongest(previous)+earned,strongest(previous),strongest(next));next.lifetimePoints=preserved;next.pointsTotal=preserved;next.punkteGesamt=preserved;next.totals.points=Math.max(point(next.totals.points),preserved);try{await setDoc(doc(db,"progress",id),{...next,canonicalStudentId:id,aliasIds:idCandidates(p)},{merge:true})}catch(e){console.warn("Progress write failed",id,e)}try{localStorage.setItem("SP_STUDENT_ID",id);localStorage.setItem("SP_POINTS_TOTAL",String(preserved));localStorage.setItem("SP_PROGRESS_LAST_SYNC",now())}catch(e){}return next}
function taskTitle(file){return String(file||"Aufgabe").replace(/\.html$/i,"").replace(/-/g," ")}
async function recordTaskProgress(payload={}){if(!canWrite())return null;try{const moduleKey=payload.module||"wortschatz",id=topicId(payload),run=currentRun(id);const rawKey=payload.file||payload.taskKey||payload.taskTitle||"task";const pointsKey=cleanId(rawKey);const current=await readProgress();const mod={...(current[moduleKey]||{})};const topic={...(mod[id]||{})};const tasks={...(topic.tasks||{})};const old=tasks[rawKey]||tasks[pointsKey]||{};let percent=clamp(payload.percent??payload.progress??0);if(!payload.allowDecrease)percent=Math.max(percent,clamp(old.percent||0));const completed=!!payload.completed||percent>=100;const lifetime={...(topic.lifetime||{})};const taskPointRuns={...(lifetime.taskPointRuns||{})};const thisRuns={...(taskPointRuns[pointsKey]||{})};let delta=0;if(completed&&!thisRuns[String(run)]){delta=RULES.taskPoints(run);thisRuns[String(run)]=delta;taskPointRuns[pointsKey]=thisRuns}tasks[rawKey]={...old,key:rawKey,file:payload.file||old.file||rawKey,title:payload.taskTitle||old.title||taskTitle(payload.file||rawKey),percent,completed,total:Number(payload.total||old.total||0),done:Number(payload.done||old.done||0),lastActiveAt:now(),completedAt:completed?(old.completedAt||now()):(old.completedAt||null),points:Number(old.points||0)+delta,pointsByRun:thisRuns,run};const values=Object.values(tasks);const avg=values.length?clamp(values.reduce((s,t)=>s+Number(t.percent||0),0)/values.length):percent;const done=values.filter(t=>t.completed).length;lifetime.points=Number(lifetime.points||0)+delta;lifetime.taskPointRuns=taskPointRuns;lifetime.completedTasks=Math.max(Number(lifetime.completedTasks||0),done);lifetime.resets=Math.max(Number(lifetime.resets||0),run-1);topic.title=payload.title||topic.title||`A1 Lektion ${payload.lesson||""} · Thema ${payload.theme||""}`;topic.moduleTitle=payload.moduleTitle||topic.moduleTitle||"Wortschatz";topic.level=payload.level||topic.level||"A1";topic.lesson=payload.lesson||topic.lesson||"";topic.theme=payload.theme||topic.theme||"";topic.progressPercent=avg;topic.completedTasks=done;topic.totalTasks=values.length;topic.tasks=tasks;topic.current={percent:avg,completedTasks:done,totalTasks:values.length,updatedAt:now()};topic.lifetime=lifetime;mod[id]=topic;current[moduleKey]=mod;addDelta(current,delta);return await writeProgress(current)}catch(e){console.warn("SPProgress task sync failed",e);return null}}
async function recordExamResult(payload={}){if(!canWrite())return null;try{const moduleKey=payload.module||"wortschatz",id=topicId(payload),run=currentRun(id);const current=await readProgress();const mod={...(current[moduleKey]||{})};const topic={...(mod[id]||{})};const exam={...(topic.exam||{})};const percent=clamp(payload.percent??payload.scorePercent??payload.score??0);const earned=RULES.examEarned(run,percent),maxScore=RULES.examMax(run);const lifetime={...(topic.lifetime||{})};const examRuns={...(lifetime.examPointRuns||{})};const oldBest=Number(examRuns[String(run)]||0);const better=Math.max(oldBest,earned);const delta=Math.max(0,better-oldBest);examRuns[String(run)]=better;const attempts=Number(exam.attempts||0)+1;const stars=Number(payload.stars??(percent>=100?3:percent>=70?2:percent>=50?1:0));topic.exam={attempted:true,unlocked:true,attempts,lastScore:earned,lastPercent:percent,lastStars:stars,lastAttemptAt:now(),bestScore:Math.max(Number(exam.bestScore||0),earned),bestPercent:Math.max(Number(exam.bestPercent||0),percent),stars:Math.max(Number(exam.stars||0),stars),maxScore,completed:percent>=100||exam.completed===true};lifetime.points=Number(lifetime.points||0)+delta;lifetime.examPointRuns=examRuns;lifetime.resets=Math.max(Number(lifetime.resets||0),run-1);lifetime.bestExamPercent=Math.max(Number(lifetime.bestExamPercent||0),percent);lifetime.bestStars=Math.max(Number(lifetime.bestStars||0),stars);lifetime.examAttempts=attempts;topic.lifetime=lifetime;topic.examUnlocked=true;topic.title=payload.title||topic.title||`A1 Lektion ${payload.lesson||""} · Thema ${payload.theme||""}`;topic.moduleTitle=payload.moduleTitle||topic.moduleTitle||"Wortschatz";topic.level=payload.level||topic.level||"A1";topic.lesson=payload.lesson||topic.lesson||"";topic.theme=payload.theme||topic.theme||"";mod[id]=topic;current[moduleKey]=mod;addDelta(current,delta);return await writeProgress(current)}catch(e){console.warn("SPProgress exam sync failed",e);return null}}
async function recordThemeReset(payload={}){if(!canWrite())return null;try{const moduleKey=payload.module||"wortschatz",id=topicId(payload);setRun(id,currentRun(id)+1);const current=await readProgress();const mod={...(current[moduleKey]||{})};const topic={...(mod[id]||{})};const lifetime={...(topic.lifetime||{})};lifetime.resets=Number(lifetime.resets||0)+1;topic.progressPercent=0;topic.completedTasks=0;topic.totalTasks=topic.totalTasks||0;topic.tasks={};topic.current={percent:0,completedTasks:0,totalTasks:topic.totalTasks||0,resetAt:now()};topic.examUnlocked=false;topic.exam={...(topic.exam||{}),unlocked:false};topic.lifetime=lifetime;mod[id]=topic;current[moduleKey]=mod;return await writeProgress(current)}catch(e){console.warn("SPProgress reset sync failed",e);return null}}
async function touch(){return null}
async function loadCurrentStudentProgress(){if(isTeacherPreview())return{};return await readProgress()}
async function loadCourseRanking(courseCode=course()){if(isTeacherPreview()||!courseCode)return[];const q=query(collection(db,"progress"),where("kurs","==",courseCode),limit(100));const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()}))}
async function migrateLegacyLocalProgress(){return null}
function verbStats(mod={}){const len=x=>Array.isArray(x)?x.length:(x&&typeof x==="object"?Object.keys(x).length:0);const learned=len(mod.learnedVerbs||mod.known||mod.state?.learnedVerbs||mod.state?.known||[]);const active=len(mod.activeVerbs||mod.state?.activeVerbs||mod.state?.active||[]);const known=len(mod.known||mod.state?.known||[]);const unsure=len(mod.unsure||mod.state?.unsure||[]);const unknown=len(mod.unknown||mod.state?.unknown||[]);return{learned,active,known,unsure,unknown,contentsDone:Math.floor(learned/20),currentPackagePercent:Math.min(100,Math.round(((learned%20)||(learned?20:0))/20*100))}}
async function syncCurrentTopicLocal(){return null}
const API={RULES,recordTaskProgress,recordExamResult,recordThemeReset,touch,loadCurrentStudentProgress,loadCourseRanking,migrateLegacyLocalProgress,verbStats,currentRun,taskPointsForRun:RULES.taskPoints,examMaxForRun:RULES.examMax,examEarnedForRun:RULES.examEarned,idCandidates,syncCurrentTopicLocal};
window.SPProgress=API;
const q=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE=[];for(const item of q){if(item&&API[item.method])API[item.method](item.payload||{})}
function installL4T2FastLocalSave(){
  const path=String(location.pathname||"");
  if(!/A1-Lektion-4\/Thema-2/i.test(path))return;
  if(window.__spL4T2ProgressFastSave)return;
  window.__spL4T2ProgressFastSave=true;
  let tries=0;
  const wait=setInterval(()=>{
    tries++;
    if(typeof window.saveTask!=="function"||typeof window.taskKey!=="function"){
      if(tries>160)clearInterval(wait);
      return;
    }
    clearInterval(wait);
    const pending=new Map();
    let timer=0;
    let syncing=false;
    function copy(st){const out={};Object.keys(st||{}).forEach(k=>{const v=st[k];out[k]=Array.isArray(v)?v.slice():v});return out}
    function pctLocal(st){const total=Number(st&&st.total||0)||1;const done=Array.isArray(st&&st.done)?st.done.length:0;return clamp(done/total*100)}
    function title(file){return String(file||"").replace(/\.html$/i,"").replace(/-/g," ")}
    function schedule(){clearTimeout(timer);timer=setTimeout(flush,850)}
    function flush(){
      if(syncing){schedule();return}
      const batch=Array.from(pending.entries());
      pending.clear();
      syncing=true;
      setTimeout(()=>{
        batch.forEach(([file,st])=>{
          try{
            API.recordTaskProgress({
              module:"wortschatz",level:"A1",lesson:"4",theme:"2",topicId:"wortschatz-a1-lektion-4-thema-2",
              file,taskKey:file,taskTitle:title(file),total:st.total||0,done:Array.isArray(st.done)?st.done.length:0,
              percent:pctLocal(st),completed:(Array.isArray(st.done)?st.done.length:0)>=(st.total||1),
              tries:st.tries||0,wrongItems:st.wrongItems||[],lastWrongItem:st.lastWrongItem||""
            });
          }catch(e){}
        });
        try{if(typeof window.syncDashboardProgress==="function")window.syncDashboardProgress()}catch(e){}
        syncing=false;
        if(pending.size)schedule();
      },0);
    }
    window.saveTask=function(file,st){
      try{localStorage.setItem(window.taskKey(file),JSON.stringify(st))}catch(e){}
      try{window.dispatchEvent(new CustomEvent("sprachpilot-progress",{detail:{file,st}}))}catch(e){}
      pending.set(file,copy(st));
      schedule();
    };
    window.addEventListener("pagehide",flush);
  },50);
}
installL4T2FastLocalSave();
export{recordTaskProgress,recordExamResult,recordThemeReset,touch,loadCurrentStudentProgress,loadCourseRanking,migrateLegacyLocalProgress,verbStats};