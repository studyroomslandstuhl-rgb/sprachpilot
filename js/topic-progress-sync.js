import { db, doc, getDoc, setDoc, serverTimestamp } from "/js/firebase.js";
import { getActiveProfile, getActiveRole } from "/js/auth.js";
import { globalStudentId, idCandidates } from "/js/global-sync.js?v=1";

const TOPICS=[
 {key:"SP_L4_T1_V2",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"1",topicId:"wortschatz-a1-lektion-4-thema-1",title:"A1 Lektion 4 · Thema 1",href:"/wortschatz/A1-Lektion-4/Thema-1/",files:["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","wo-ist.html","ist-hier.html","pruefung.html"]},
 {key:"SP_L4_T2_FINAL_V3",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"2",topicId:"wortschatz-a1-lektion-4-thema-2",title:"A1 Lektion 4 · Thema 2",href:"/wortschatz/A1-Lektion-4/Thema-2/",files:["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","kategorien.html","dialoge.html","pruefung.html"]},
 {key:"SP_L4_T3_V2",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"3",topicId:"wortschatz-a1-lektion-4-thema-3",title:"A1 Lektion 4 · Thema 3",href:"/wortschatz/A1-Lektion-4/Thema-3/",files:["karteikarten.html","hoeren.html","farben.html","memory.html","gegenteile.html","kein.html","reaktionen.html","gefallen.html","saetze-bauen.html","schreiben.html","pruefung.html"]},
 {key:"SP_L5_T1_V1",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"5",theme:"1",topicId:"wortschatz-a1-lektion-5-thema-1",title:"A1 Lektion 5 · Thema 1",href:"/wortschatz/A1-Lektion-5/Thema-1/",files:["karteikarten.html","bild-wort.html","wort-bild.html","hoeren-schreiben.html","trennbare-verben.html","trennbare-verben-im-satz.html","marias-tag.html","was-machst-du-gern.html","ja-nein-fragen.html","verb-passt.html","pruefung.html"]},
 {key:"SP_L5_T2_V1",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"5",theme:"2",topicId:"wortschatz-a1-lektion-5-thema-2",title:"A1 Lektion 5 · Thema 2",href:"/wortschatz/A1-Lektion-5/Thema-2/",files:["karteikarten.html","artikel.html","plural.html","sehen-schreiben.html","hoeren-schreiben.html","sprechen.html","formell-informell.html","frage-antwort.html","schon-erst.html","pruefung.html"]}
];
const TASK_TITLES={"karteikarten.html":"Karteikarten","hoeren.html":"Hören","artikel-klick.html":"Artikel klicken","artikel.html":"Artikel zuordnen","plural.html":"Plural","bild-wort.html":"Bild → Wort","wort-bild.html":"Wort → Bild","kategorien.html":"Kategorien","dialoge.html":"Dialoge","wo-ist.html":"Wo ist?","ist-hier.html":"Ist hier?","farben.html":"Farben","memory.html":"Memory","gegenteile.html":"Gegenteile","kein.html":"nicht / kein","reaktionen.html":"Reaktionen","gefallen.html":"Gefallen","saetze-bauen.html":"Sätze bauen","schreiben.html":"Schreiben","sehen-schreiben.html":"Sehen → Schreiben","hoeren-schreiben.html":"Hören → Schreiben","sprechen.html":"Sprechen","formell-informell.html":"Formell ↔ informell","frage-antwort.html":"Frage / Antwort","schon-erst.html":"schon / erst","trennbare-verben.html":"Trennbare Verben","trennbare-verben-im-satz.html":"Sätze bauen","marias-tag.html":"Marias Tag","was-machst-du-gern.html":"Was machst du gern?","ja-nein-fragen.html":"Ja-/Nein-Fragen","verb-passt.html":"Mini-Situationen","pruefung.html":"Prüfung"};
let timer=null;
const pending=new Set();
function isStudent(){const r=String(getActiveRole()||localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();const p=getActiveProfile()||{};return r==="student"&&!p.teacherPreview&&!p.isTeacher}
function cleanPercent(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}}
function profile(){return getActiveProfile()||read("SP_USER_PROFILE")||read("SP_STUDENT_PROFILE")||{}}
function sid(){return globalStudentId(profile())||idCandidates(profile())[0]||""}
function course(){const p=profile();return p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem("SP_COURSE_CODE")||""}
function name(){const p=profile();return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
function email(){return String(profile().email||"").toLowerCase()}
function topicForKey(storageKey){return TOPICS.find(t=>String(storageKey||"").startsWith(t.key+"_"))}
function stateProgress(st){
  if(!st||typeof st!=="object")return {total:0,done:0,percent:0,started:false,completed:false,tries:0,hadWrong:false};
  const total=Number(st.total||0)||0;
  const done=Array.isArray(st.done)?st.done.length:Number(st.done||0)||0;
  const queue=Array.isArray(st.queue)?st.queue.length:0;
  const started=!!(st.current!==null&&st.current!==undefined)||done>0||queue>0||Number(st.tries||0)>0||st.hadWrong===true;
  const percent=total?cleanPercent(done/total*100):cleanPercent(st.percent||0);
  return {total,done,percent,started,completed:!!st.completed||percent>=100,tries:Number(st.tries||0)||0,hadWrong:!!st.hadWrong};
}
function taskRecord(t,file,old={}){
  const st=read(t.key+"_"+file);
  const p=stateProgress(st);
  const started=p.started||!!old.startedAt||Number(old.percent||0)>0;
  const completed=p.completed;
  return {
    ...(old||{}),
    key:file,
    file,
    title:TASK_TITLES[file]||file.replace(/\.html$/,""),
    total:p.total||old.total||0,
    done:p.done||0,
    percent:p.percent,
    completed,
    started,
    tries:p.tries,
    hadWrong:p.hadWrong,
    startedAt:started?(old.startedAt||new Date().toISOString()):(old.startedAt||null),
    lastActiveAt:started?new Date().toISOString():(old.lastActiveAt||null),
    completedAt:completed?(old.completedAt||new Date().toISOString()):(old.completedAt||null)
  };
}
function isTopicRecord(key,value){if(["state","progress","stars","activeVerbs","learnedVerbs","known","unknown","unsure","updatedAt","lastActive","lastLogin","lastPage","lastAction","totals","current","profile","metadata"].includes(key))return false;return !!(value&&typeof value==="object"&&!Array.isArray(value)&&(value.tasks||value.exam||value.current||value.lifetime||value.progressPercent||value.title));}
function recalcTotals(progress){let progressSum=0,progressCount=0,completedTasks=0,completedExams=0,stars=0;["wortschatz","fragen","grammatik"].forEach(moduleKey=>{Object.entries(progress[moduleKey]||{}).forEach(([key,topic])=>{if(!isTopicRecord(key,topic))return;progressSum+=cleanPercent(topic.progressPercent||topic.current?.percent||0);progressCount++;Object.values(topic.tasks||{}).forEach(t=>{if(t&&t.completed)completedTasks++});if(topic.exam?.attempted){completedExams++;stars+=Number(topic.exam.stars||0)}})});const points=Math.max(Number(progress.totals?.points||0),Number(progress.lifetimePoints||0),Number(progress.pointsTotal||0),Number(progress.punkteGesamt||0),Number(localStorage.getItem("SP_POINTS_TOTAL")||0));return {points,stars,progressPercent:progressCount?cleanPercent(progressSum/progressCount):0,completedTasks,completedExams,updatedAt:new Date().toISOString()}}
function mergeExam(oldExam,examTask){
  const p=cleanPercent(examTask.percent||oldExam?.bestPercent||0);
  const attempted=!!(oldExam?.attempted||examTask.started||p>0);
  const stars=p>=100?3:p>=70?2:p>=50?1:0;
  return {...(oldExam||{}),attempted,unlocked:true,percent:p,lastPercent:p,bestPercent:Math.max(Number(oldExam?.bestPercent||0),p),stars:Math.max(Number(oldExam?.stars||0),stars),completed:p>=100||oldExam?.completed===true,lastAttemptAt:attempted?new Date().toISOString():(oldExam?.lastAttemptAt||null)};
}
async function readProgressDoc(id){try{const snap=await getDoc(doc(db,"progress",id));return snap.exists()?snap.data()||{}:{}}catch(e){return {}}}
async function writeTopic(t){
  if(!isStudent())return;
  const id=sid();if(!id)return;
  const current=await readProgressDoc(id);
  const mod={...(current[t.module]||{})};
  const oldTopic={...(mod[t.topicId]||{})};
  const oldTasks=oldTopic.tasks||{};
  const tasks={};
  let sum=0,done=0,started=false;
  for(const file of t.files){
    const rec=taskRecord(t,file,oldTasks[file]||{});
    tasks[file]=rec;
    sum+=cleanPercent(rec.percent);
    if(rec.completed)done++;
    if(rec.started)started=true;
  }
  const percent=cleanPercent(sum/Math.max(1,t.files.length));
  const examTask=tasks["pruefung.html"]||{};
  const exam=mergeExam(oldTopic.exam||{},examTask);
  const lifetime={...(oldTopic.lifetime||{})};
  const topic={...oldTopic,module:t.module,moduleTitle:t.moduleTitle,level:t.level,lesson:t.lesson,theme:t.theme,title:t.title,href:t.href,progressPercent:percent,completedTasks:done,totalTasks:t.files.length,startedAt:started?(oldTopic.startedAt||new Date().toISOString()):(oldTopic.startedAt||null),lastActiveAt:started?new Date().toISOString():(oldTopic.lastActiveAt||null),tasks,exam,current:{percent,completedTasks:done,totalTasks:t.files.length,updatedAt:new Date().toISOString()},lifetime,updatedAt:new Date().toISOString()};
  mod[t.topicId]=topic;
  const next={...current,[t.module]:mod,studentId:id,userId:id,docId:id,kurs:course(),kursnummer:course(),courseCode:course(),email:email(),studentName:name(),lastPage:location.pathname,lastAction:"topic-progress-sync",lastActiveAt:serverTimestamp(),updatedAt:serverTimestamp()};
  next.totals=recalcTotals(next);
  next.lifetimePoints=Math.max(Number(current.lifetimePoints||0),Number(next.totals.points||0));
  next.pointsTotal=Math.max(Number(current.pointsTotal||0),next.lifetimePoints);
  next.punkteGesamt=Math.max(Number(current.punkteGesamt||0),next.lifetimePoints);
  await setDoc(doc(db,"progress",id),next,{merge:true});
  try{localStorage.setItem("SP_TOPIC_PROGRESS_LAST_SYNC",new Date().toISOString())}catch(e){}
}
function schedule(t){if(!t)return;pending.add(t.key);clearTimeout(timer);timer=setTimeout(flush,700)}
async function flush(){const keys=[...pending];pending.clear();for(const key of keys){const t=TOPICS.find(x=>x.key===key);if(!t)continue;try{await writeTopic(t)}catch(e){console.warn("Topic progress sync failed",t.title,e)}}}
function currentTopic(){const p=location.pathname;return TOPICS.find(t=>p.startsWith(t.href))||null}
function patchStorage(){
  if(window.__SP_TOPIC_PROGRESS_SYNC_PATCHED)return;
  window.__SP_TOPIC_PROGRESS_SYNC_PATCHED=true;
  const native=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){const out=native.apply(this,arguments);try{const t=topicForKey(key);if(t)schedule(t)}catch(e){}return out};
}
function syncExistingLocal(){TOPICS.forEach(t=>{const has=t.files.some(file=>!!localStorage.getItem(t.key+"_"+file));if(has)schedule(t)})}
function touchCurrent(){const t=currentTopic();if(!t||!isStudent())return;try{schedule(t)}catch(e){}}
function boot(){patchStorage();touchCurrent();syncExistingLocal();const t=currentTopic();if(t)setTimeout(()=>schedule(t),1200)}
boot();
window.addEventListener("online",()=>syncExistingLocal());
window.addEventListener("pagehide",()=>{try{flush()}catch(e){}});
window.addEventListener("sprachpilot-progress",()=>{const t=currentTopic();if(t)schedule(t)});
window.SPTopicProgressSync={syncExistingLocal,flush,topics:TOPICS};
