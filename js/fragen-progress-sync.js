import { db, doc, getDoc, setDoc, serverTimestamp } from "/js/firebase.js";
import { getActiveProfile, getActiveRole } from "/js/auth.js";
import { globalStudentId, idCandidates } from "/js/global-sync.js?v=2";
const EXERCISES=["learn","qa","speak","puzzle","dictation","memory","quickfire","listen","listenrespond","exam"];
const TITLES={learn:"Lernen",qa:"Fragen beantworten",speak:"Sprechen",puzzle:"Puzzle",dictation:"Diktat",memory:"Memory",quickfire:"Blitzfeuer",listen:"Hören",listenrespond:"Hören & Antworten",exam:"Prüfung"};
let timer=null,lastSig="",running=false;
function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}}
function isStudent(){const r=String(getActiveRole()||localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();const p=getActiveProfile()||{};return r==="student"&&!p.teacherPreview&&!p.isTeacher}
function profile(){return getActiveProfile()||read("SP_USER_PROFILE")||read("SP_STUDENT_PROFILE")||{}}
function sid(){return globalStudentId(profile())||idCandidates(profile())[0]||""}
function course(){const p=profile();return p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem("SP_COURSE_CODE")||""}
function name(){const p=profile();return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
function email(){return String(profile().email||"").toLowerCase()}
function pct(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function findFragenState(){const active=localStorage.getItem("A1_ACTIVE_SESSION");if(active){const s=read(active);if(s&&s.exerciseProgress)return s}for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||!k.startsWith("A1_")||k==="A1_ACTIVE_SESSION"||k.startsWith("A1_STUDENTS_"))continue;const s=read(k);if(s&&s.exerciseProgress)return s}return null}
function signature(state){try{return JSON.stringify(state?.exerciseProgress||{})}catch(e){return String(Date.now())}}
function isTopicRecord(key,value){if(["state","progress","stars","activeVerbs","learnedVerbs","known","unknown","unsure","updatedAt","lastActive","lastLogin","lastPage","lastAction","totals","current","profile","metadata"].includes(key))return false;return !!(value&&typeof value==="object"&&!Array.isArray(value)&&(value.tasks||value.exam||value.current||value.lifetime||value.progressPercent||value.title));}
function recalcTotals(progress){let progressSum=0,progressCount=0,completedTasks=0,completedExams=0,stars=0;["wortschatz","fragen","grammatik"].forEach(moduleKey=>{Object.entries(progress[moduleKey]||{}).forEach(([key,topic])=>{if(!isTopicRecord(key,topic))return;progressSum+=pct(topic.progressPercent||topic.current?.percent||0);progressCount++;Object.values(topic.tasks||{}).forEach(t=>{if(t&&t.completed)completedTasks++});if(topic.exam?.attempted){completedExams++;stars+=Number(topic.exam.stars||0)}})});const points=Math.max(Number(progress.totals?.points||0),Number(progress.lifetimePoints||0),Number(progress.pointsTotal||0),Number(progress.punkteGesamt||0),Number(localStorage.getItem("SP_POINTS_TOTAL")||0));return {points,stars,progressPercent:progressCount?pct(progressSum/progressCount):0,completedTasks,completedExams,updatedAt:new Date().toISOString()}}
async function syncFragen(force=false){
  if(running||!isStudent())return;
  const state=findFragenState();if(!state)return;
  const sig=signature(state);if(!force&&sig===lastSig)return;lastSig=sig;
  const id=sid();if(!id)return;running=true;
  try{
    const progress=state.exerciseProgress||{};
    const tasks={};let sum=0,done=0;
    EXERCISES.forEach(ex=>{const p=pct(progress[ex]||0);const completed=p>=100;tasks[ex]={key:ex,file:ex,title:TITLES[ex]||ex,percent:p,completed,started:p>0,lastActiveAt:p>0?new Date().toISOString():null,completedAt:completed?new Date().toISOString():null};if(ex!=="exam"){sum+=p;if(completed)done++;}});
    const percent=pct(sum/Math.max(1,EXERCISES.filter(x=>x!=="exam").length));
    const examPct=pct(progress.exam||0);
    const stars=examPct>=100?3:examPct>=70?2:examPct>=50?1:0;
    if(percent<=0&&examPct<=0)return;
    const snap=await getDoc(doc(db,"progress",id));
    const current=snap.exists()?snap.data()||{}:{};
    const fragen={...(current.fragen||{})};
    fragen["fragen-a1"]={...(fragen["fragen-a1"]||{}),module:"fragen",moduleTitle:"Fragen",level:"A1",title:"Fragen A1",href:"/fragen-A1/",progressPercent:percent,completedTasks:done,totalTasks:EXERCISES.filter(x=>x!=="exam").length,tasks,exam:{...(fragen["fragen-a1"]?.exam||{}),attempted:examPct>0,percent:examPct,bestPercent:Math.max(Number(fragen["fragen-a1"]?.exam?.bestPercent||0),examPct),stars:Math.max(Number(fragen["fragen-a1"]?.exam?.stars||0),stars),completed:examPct>=100},current:{percent,completedTasks:done,totalTasks:EXERCISES.filter(x=>x!=="exam").length,updatedAt:new Date().toISOString()},lastActiveAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    const next={...current,fragen,studentId:id,userId:id,docId:id,kurs:course(),kursnummer:course(),courseCode:course(),email:email(),studentName:name(),lastPage:location.pathname,lastAction:"fragen-progress-sync",lastActiveAt:serverTimestamp(),updatedAt:serverTimestamp()};
    next.totals=recalcTotals(next);
    next.lifetimePoints=Math.max(Number(current.lifetimePoints||0),Number(next.totals.points||0));
    next.pointsTotal=Math.max(Number(current.pointsTotal||0),next.lifetimePoints);
    next.punkteGesamt=Math.max(Number(current.punkteGesamt||0),next.lifetimePoints);
    await setDoc(doc(db,"progress",id),next,{merge:true});
  }finally{running=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>syncFragen(false).catch(e=>console.warn("Fragen Sync fehlgeschlagen",e)),2200)}
function patch(){if(window.__SP_FRAGEN_PROGRESS_SYNC_PATCHED)return;window.__SP_FRAGEN_PROGRESS_SYNC_PATCHED=true;const native=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){const out=native.apply(this,arguments);try{if(String(key||"").startsWith("A1_")&&String(value||"").includes("exerciseProgress"))schedule()}catch(e){}return out}}
patch();setTimeout(schedule,2200);window.addEventListener("online",schedule);window.SPFragenProgressSync={sync:()=>syncFragen(true)};