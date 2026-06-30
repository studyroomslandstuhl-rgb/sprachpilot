import { db, doc, getDoc, setDoc, serverTimestamp } from "/js/firebase.js";
import { getActiveProfile } from "/js/auth.js";

function taskPointsForRun(run){run=Number(run)||1;if(run===1)return 5;if(run===2)return 10;if(run===3)return 15;return 1}
function examPointsForRun(run){run=Number(run)||1;if(run===1)return 100;if(run===2)return 200;if(run===3)return 300;return 1}
const TASK_TITLES={
  "karteikarten.html":"Karteikarten",
  "bild-wort.html":"Bild → Wort",
  "wort-bild.html":"Wort → Bild",
  "hoeren.html":"Hören",
  "artikel.html":"Artikel",
  "drag-drop-artikel.html":"Artikel zuordnen",
  "plural.html":"Plural",
  "plural-drag-drop.html":"Pluralgruppen",
  "memory.html":"Memory",
  "fragen-bilden.html":"Fragen bilden",
  "ein-eine.html":"ein / eine",
  "kein-keine.html":"kein / keine",
  "verpackungen.html":"Verpackung + Produkt",
  "preis-hoeren.html":"Preis hören",
  "preis-schreiben.html":"Preis schreiben",
  "preis-sprechen.html":"Preis sprechen",
  "frage-und-antwort.html":"Frage & Antwort",
  "pruefung.html":"Prüfung"
};

function isL3(){return /\/wortschatz\/A1-Lektion-3\//.test(location.pathname)}
function isTeacherPreview(){
  try{
    const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
    const preview=JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW")||"null");
    return !!(role==="teacher" && preview && preview.teacherPreview===true);
  }catch(e){return false}
}
function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item"}
function nowIso(){return new Date().toISOString()}
function clampPercent(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function arr(x){return Array.isArray(x)?x:[]}
function profile(){try{return getActiveProfile()||JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")||{}}catch(e){return {}}}
function studentId(p=profile()){return p.studentId||p.userId||p.docId||localStorage.getItem("SP_STUDENT_ID")||cleanId((p.kurs||"")+"_"+(p.email||p.vorname||"student"))}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||""}
function studentName(p=profile()){return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
function themeNo(){const m=location.pathname.match(/A1-Lektion-3\/Thema-(\d+)/);return m?m[1]:""}
function topicKey(theme=themeNo()){return `wortschatz-a1-lektion-3-thema-${theme}`}
function topicTitle(theme=themeNo()){return `A1 Lektion 3 · Thema ${theme}`}
function themeTitle(theme=themeNo()){return theme==="1"?"Lebensmittel & Getränke":theme==="2"?"Mengen & Verpackungen":theme==="3"?"Einkaufen":theme==="4"?"Kochen":"A1 Lektion 3"}
function taskTitle(file){return TASK_TITLES[file]||String(file||"Aufgabe").replace(".html","")}
async function readProgress(id=studentId()){if(!id)return {};const snap=await getDoc(doc(db,"progress",id));return snap.exists()?snap.data():{}}
function strongestPoints(record={}){return Math.max(Number(record.lifetimePoints||0),Number(record.pointsTotal||0),Number(record.punkteGesamt||0),Number(record.totals?.points||0))}
async function writeProgress(next,delta=0){
  if(isTeacherPreview())return null;
  const p=profile();const id=studentId(p);if(!id)return null;
  const prev=await readProgress(id);
  const oldTotal=strongestPoints(prev);
  const newTotal=Math.max(oldTotal+Math.max(0,Number(delta)||0),oldTotal,strongestPoints(next));
  next.studentId=id;next.userId=id;next.kurs=course(p)||next.kurs||"";next.studentName=studentName(p);next.muttersprache=p.muttersprache||p.motherLanguage||next.muttersprache||"";next.email=p.email||next.email||"";
  next.lifetimePoints=newTotal;next.pointsTotal=newTotal;next.punkteGesamt=newTotal;next.totals={...(next.totals||{}),points:newTotal,updatedAt:nowIso()};next.lastActive=serverTimestamp();next.updatedAt=serverTimestamp();
  await setDoc(doc(db,"progress",id),next,{merge:true});
  try{localStorage.setItem("SP_POINTS_TOTAL",String(newTotal));}catch(e){}
  return next;
}
function currentRun(lifetime={}){return Math.max(1,Number(lifetime.resets||0)+1)}
function taskLocalState(file){try{return JSON.parse(localStorage.getItem("SP_TASK_STATE_"+file)||"null")}catch(e){return null}}
function taskDoneTotal(file){
  const st=taskLocalState(file);
  if(st&&st.total)return {total:Number(st.total)||0,done:arr(st.done).length||Number(st.total)||0};
  return {total:1,done:1};
}
async function recordTaskDone(file){
  if(!isL3()||isTeacherPreview()||!file||file==="index.html"||file==="statistik.html"||file==="uebersicht.html")return;
  if(file==="pruefung.html")return recordExamResult({percent:100,stars:3});
  const theme=themeNo();if(!theme)return;
  const current=await readProgress();
  const mod={...(current.wortschatz||{})};
  const key=topicKey(theme);
  const topic={...(mod[key]||{})};
  const lifetime={...(topic.lifetime||{})};
  const run=currentRun(lifetime);
  const taskKey=cleanId(file);
  const taskPointRuns={...(lifetime.taskPointRuns||{})};
  const taskRuns={...(taskPointRuns[taskKey]||{})};
  const runKey=String(run);
  const delta=taskRuns[runKey]?0:taskPointsForRun(run);
  if(delta) taskRuns[runKey]=delta;
  taskPointRuns[taskKey]=taskRuns;
  lifetime.taskPointRuns=taskPointRuns;
  lifetime.points=Number(lifetime.points||0)+delta;
  const tasks={...(topic.tasks||{})};
  const local=taskDoneTotal(file);
  tasks[taskKey]={...(tasks[taskKey]||{}),key:taskKey,file,title:taskTitle(file),percent:100,completed:true,total:local.total,done:local.done,completedAt:(tasks[taskKey]?.completedAt||nowIso()),lastActiveAt:nowIso(),pointsByRun:taskRuns,points:Number(tasks[taskKey]?.points||0)+delta};
  const values=Object.values(tasks);
  const completedTasks=values.filter(t=>t.completed).length;
  const avg=values.length?clampPercent(values.reduce((s,t)=>s+Number(t.percent||0),0)/values.length):100;
  lifetime.completedTasks=Math.max(Number(lifetime.completedTasks||0),completedTasks);
  topic.title=topicTitle(theme);topic.moduleTitle="Wortschatz";topic.level="A1";topic.lesson="3";topic.theme=theme;topic.themeTitle=themeTitle(theme);topic.progressPercent=avg;topic.completedTasks=completedTasks;topic.totalTasks=values.length;topic.tasks=tasks;topic.current={percent:avg,completedTasks,totalTasks:values.length,updatedAt:nowIso()};topic.lifetime=lifetime;
  mod[key]=topic;current.wortschatz=mod;
  await writeProgress(current,delta);
}
async function recordReset(){
  if(!isL3()||isTeacherPreview())return;
  const theme=themeNo();if(!theme)return;
  const current=await readProgress();const mod={...(current.wortschatz||{})};const key=topicKey(theme);const topic={...(mod[key]||{})};const lifetime={...(topic.lifetime||{})};
  lifetime.resets=Number(lifetime.resets||0)+1;
  topic.progressPercent=0;topic.completedTasks=0;topic.totalTasks=topic.totalTasks||0;topic.tasks={};topic.current={percent:0,completedTasks:0,totalTasks:topic.totalTasks||0,resetAt:nowIso()};topic.examUnlocked=false;topic.exam={...(topic.exam||{}),unlocked:false};topic.lifetime=lifetime;topic.title=topicTitle(theme);topic.moduleTitle="Wortschatz";topic.level="A1";topic.lesson="3";topic.theme=theme;topic.themeTitle=themeTitle(theme);
  mod[key]=topic;current.wortschatz=mod;await writeProgress(current,0);
}
async function recordExamResult(result={}){
  if(!isL3()||isTeacherPreview())return;
  const theme=themeNo();if(!theme)return;
  const current=await readProgress();const mod={...(current.wortschatz||{})};const key=topicKey(theme);const topic={...(mod[key]||{})};const lifetime={...(topic.lifetime||{})};
  const run=currentRun(lifetime);const percent=clampPercent(result.percent??0);const maxForRun=examPointsForRun(run);const earned=Math.round(percent/100*maxForRun);
  const examPointRuns={...(lifetime.examPointRuns||{})};const oldRunBest=Number(examPointRuns[String(run)]||0);const delta=Math.max(0,earned-oldRunBest);if(earned>oldRunBest) examPointRuns[String(run)]=earned;
  lifetime.examPointRuns=examPointRuns;lifetime.points=Number(lifetime.points||0)+delta;lifetime.bestExamPercent=Math.max(Number(lifetime.bestExamPercent||0),percent);lifetime.bestStars=Math.max(Number(lifetime.bestStars||0),Number(result.stars||0));
  const exam={...(topic.exam||{})};const attempts=Number(exam.attempts||0)+1;const score=Number(result.score||earned||0);const maxScore=Number(result.maxScore||maxForRun||100)||100;const attemptsLog=arr(exam.attemptsLog).concat([{score,maxScore,percent,stars:Number(result.stars||0),run,date:nowIso()}]).slice(-20);
  topic.exam={attempted:true,unlocked:true,attempts,attemptsLog,lastScore:score,lastPercent:percent,lastStars:Number(result.stars||0),lastAttemptAt:nowIso(),bestScore:Math.max(Number(exam.bestScore||0),score),bestPercent:Math.max(Number(exam.bestPercent||0),percent),stars:Math.max(Number(exam.stars||0),Number(result.stars||0)),maxScore};
  topic.lifetime=lifetime;topic.examUnlocked=true;topic.progressPercent=Math.max(clampPercent(topic.progressPercent||0),percent>=50?100:clampPercent(topic.progressPercent||0));topic.title=topicTitle(theme);topic.moduleTitle="Wortschatz";topic.level="A1";topic.lesson="3";topic.theme=theme;topic.themeTitle=themeTitle(theme);
  mod[key]=topic;current.wortschatz=mod;await writeProgress(current,delta);
}
function patchComplete(){
  if(typeof window.complete==="function" && !window.complete.__l3PointsPatched){
    const original=window.complete;
    window.complete=function(area,file,nextFile){const result=original.apply(this,arguments);recordTaskDone(file).catch(e=>console.warn("L3 task points failed",e));return result};
    window.complete.__l3PointsPatched=true;
  }
}
function patchReset(){
  if(typeof window.resetThemeProgress==="function" && !window.resetThemeProgress.__l3PointsPatched){
    const original=window.resetThemeProgress;
    window.resetThemeProgress=function(){
      if(!confirm("Fortschritte für dieses Thema wirklich löschen? Punkte bleiben erhalten."))return;
      recordReset().finally(()=>{const realConfirm=window.confirm;try{window.confirm=()=>true;original.apply(this,arguments)}finally{window.confirm=realConfirm}});
    };
    window.resetThemeProgress.__l3PointsPatched=true;
  }
}
function patchExam(){
  if(typeof window.saveExamResult==="function" && !window.saveExamResult.__l3PointsPatched){
    const original=window.saveExamResult;
    window.saveExamResult=function(result){const out=original.apply(this,arguments);recordExamResult(result||{}).catch(e=>console.warn("L3 exam points failed",e));return out};
    window.saveExamResult.__l3PointsPatched=true;
  }
}
function patchDone(){
  if(typeof window.done==="function" && !window.done.__l3PointsPatched){
    const original=window.done;
    window.done=function(file,total){const out=original.apply(this,arguments);recordTaskDone(file).catch(e=>console.warn("L3 done points failed",e));return out};
    window.done.__l3PointsPatched=true;
  }
}
function drainQueues(){
  const q=Array.isArray(window.SP_L3_TASK_DONE_QUEUE)?window.SP_L3_TASK_DONE_QUEUE.splice(0):[];
  q.forEach(file=>recordTaskDone(file).catch(e=>console.warn("L3 queued task points failed",e)));
  const eq=Array.isArray(window.SP_L3_EXAM_QUEUE)?window.SP_L3_EXAM_QUEUE.splice(0):[];
  eq.forEach(r=>recordExamResult(r).catch(e=>console.warn("L3 queued exam points failed",e)));
}
function patchAll(){patchComplete();patchReset();patchExam();patchDone();drainQueues();window.spL3RecordTaskDone=recordTaskDone;window.spL3RecordExamResult=recordExamResult;}
if(isL3()){
  patchAll();
  document.addEventListener("DOMContentLoaded",patchAll);
  setTimeout(patchAll,0);
  setTimeout(patchAll,250);
  setTimeout(patchAll,1000);
}
