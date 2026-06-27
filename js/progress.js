import { db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from "./firebase.js";
import { getActiveProfile } from "./auth.js";

const MODULE_KEYS = ["fragen","wortschatz","verben","grammatik"];
const TECH_PROGRESS_KEYS = new Set([
  "state","progress","stars","activeVerbs","learnedVerbs","known","unknown","unsure","updatedAt","lastActive","lastLogin","lastPage","lastAction","totals","current","profile","metadata"
]);
function isTopicRecord(key,value){
  if(TECH_PROGRESS_KEYS.has(key)) return false;
  if(!value || typeof value!=="object" || Array.isArray(value)) return false;
  return !!(value.tasks || value.exam || value.current || value.lifetime || value.progressPercent || value.title || value.moduleTitle);
}
function verbListLength(x){ return Array.isArray(x) ? x.length : (x && typeof x==="object" ? Object.keys(x).length : 0); }
function verbStats(mod={}){
  const learned=verbListLength(mod.learnedVerbs || mod.known || mod.state?.learnedVerbs || mod.state?.known || []);
  const active=verbListLength(mod.activeVerbs || mod.state?.activeVerbs || mod.state?.active || []);
  const known=verbListLength(mod.known || mod.state?.known || []);
  const unsure=verbListLength(mod.unsure || mod.state?.unsure || []);
  const unknown=verbListLength(mod.unknown || mod.state?.unknown || []);
  return {learned, active, known, unsure, unknown, contentsDone: Math.floor(learned/20), currentPackagePercent: Math.min(100, Math.round(((learned % 20) || (learned?20:0))/20*100))};
}

function nowIso(){ return new Date().toISOString(); }
function cleanId(s){ return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "item"; }
function clampPercent(v){ return Math.max(0, Math.min(100, Math.round(Number(v)||0))); }
function arr(x){ return Array.isArray(x) ? x : []; }
function uniq(a){ return [...new Set(arr(a).filter(Boolean))]; }
function getProfile(){
  try{ return getActiveProfile() || JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null") || {}; }
  catch(e){ return {}; }
}
function getStudentId(profile=getProfile()){
  return profile.studentId || profile.userId || profile.docId || localStorage.getItem("SP_STUDENT_ID") || cleanId((profile.kurs||"")+"_"+(profile.email||profile.vorname||"student"));
}
function getCourse(profile=getProfile()){
  return profile.kurs || profile.kursnummer || profile.courseCode || localStorage.getItem("SP_COURSE_CODE") || "";
}
function getName(profile=getProfile()){
  return [profile.vorname||profile.firstName||profile.name, profile.nachname||profile.lastName].filter(Boolean).join(" ") || profile.displayName || profile.email || "Schüler/in";
}
function isTeacherPreviewSession(){
  try{
    if(typeof window !== "undefined" && typeof window.spIsTeacherPreview === "function") return window.spIsTeacherPreview();
    const preview=JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW")||"null");
    const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
    return !!(preview && preview.teacherPreview===true && role==="teacher");
  }catch(e){return false;}
}
function canWriteFirebaseProgress(){
  if(isTeacherPreviewSession()) return false;
  if(typeof window !== "undefined" && typeof window.spCanWriteFirebaseProgress === "function") return window.spCanWriteFirebaseProgress();
  return true;
}
function topicId(p){
  return p.topicId || p.themeId || cleanId([p.module||"wortschatz", p.level||"A1", "lektion", p.lesson||p.lektion||"", "thema", p.theme||p.thema||""].filter(Boolean).join("_"));
}
async function readProgress(studentId=getStudentId()){
  if(!studentId) return {};
  const snap = await getDoc(doc(db,"progress",studentId));
  return snap.exists() ? snap.data() : {};
}
function recalcTotals(progress){
  let points=0, stars=0, progressSum=0, progressCount=0, completedTasks=0, completedExams=0;
  MODULE_KEYS.forEach(moduleKey=>{
    const mod=progress[moduleKey]||{};
    Object.entries(mod).forEach(([topicKey,topic])=>{
      if(!isTopicRecord(topicKey, topic)) return;
      const lifetime=topic.lifetime||{};
      points += Number(lifetime.points||0);
      const pct=clampPercent(topic.progressPercent ?? topic.current?.percent ?? 0);
      progressSum += pct; progressCount++;
      const tasks=topic.tasks||{};
      Object.values(tasks).forEach(t=>{ if(t && t.completed) completedTasks++; });
      if(topic.exam?.attempted){ completedExams++; stars += Number(topic.exam.stars||0); }
    });
    if(moduleKey==="verben"){
      const vs=verbStats(mod);
      if(vs.learned || vs.active || vs.known || vs.unsure || vs.unknown){
        progressSum += vs.currentPackagePercent;
        progressCount++;
        completedTasks += vs.contentsDone;
      }
    }
  });
  return {
    points,
    stars,
    progressPercent: progressCount ? clampPercent(progressSum/progressCount) : 0,
    completedTasks,
    completedExams,
    updatedAt: nowIso()
  };
}
async function writeProgress(next){
  if(!canWriteFirebaseProgress()) return null;
  const profile=getProfile();
  const studentId=getStudentId(profile);
  const kurs=getCourse(profile);
  if(!studentId) return null;
  next.studentId=studentId;
  next.userId=studentId;
  next.kurs=kurs || next.kurs || "";
  next.studentName=getName(profile);
  next.muttersprache=profile.muttersprache || profile.motherLanguage || next.muttersprache || "";
  next.email=profile.email || next.email || "";
  next.lastActive=serverTimestamp();
  next.updatedAt=serverTimestamp();
  next.totals=recalcTotals(next);
  await setDoc(doc(db,"progress",studentId), next, {merge:true});
  try{ localStorage.setItem("SP_PROGRESS_LAST_SYNC", nowIso()); }catch(e){}
  return next;
}
function taskTitleFromFile(file){
  const map={
    "karteikarten.html":"Karteikarten","hoeren.html":"Hören","artikel-klick.html":"Artikel klicken","artikel.html":"Artikel zuordnen","plural.html":"Plural","bild-wort.html":"Bild → Wort","wort-bild.html":"Wort → Bild","kategorien.html":"Kategorien","dialoge.html":"Dialoge","wo-ist.html":"Wo ist?","ist-hier.html":"Ist hier?","pruefung.html":"Prüfung"
  };
  return map[file] || String(file||"Aufgabe").replace(".html","");
}
async function recordTaskProgress(payload={}){
  if(!canWriteFirebaseProgress()) return null;
  try{
    const moduleKey=payload.module || "wortschatz";
    const id=topicId(payload);
    const taskKey=cleanId(payload.taskKey || payload.file || payload.taskTitle || "task");
    const current=await readProgress();
    const mod={...(current[moduleKey]||{})};
    const topic={...(mod[id]||{})};
    const tasks={...(topic.tasks||{})};
    const oldTask=tasks[taskKey]||{};
    const percent=clampPercent(payload.percent ?? payload.progress ?? 0);
    const completed=!!payload.completed || percent>=100;
    const wrongItems=uniq([...(oldTask.wrongItems||[]), ...(payload.wrongItems||[])]).slice(-50);
    const pointsDelta = completed && !oldTask.completed ? 100 : 0;
    tasks[taskKey]={
      ...oldTask,
      key:taskKey,
      file:payload.file||oldTask.file||"",
      title:payload.taskTitle || oldTask.title || taskTitleFromFile(payload.file),
      percent,
      completed,
      total:Number(payload.total||oldTask.total||0),
      done:Number(payload.done||oldTask.done||0),
      attempts:Number(oldTask.attempts||0) + (payload.countAttempt ? 1 : 0),
      tries:Number(payload.tries||oldTask.tries||0),
      wrongItems,
      lastWrongItem:payload.lastWrongItem || oldTask.lastWrongItem || "",
      lastActiveAt:nowIso(),
      completedAt: completed ? (oldTask.completedAt || nowIso()) : (oldTask.completedAt || null),
      points:Number(oldTask.points||0)+pointsDelta
    };
    const taskValues=Object.values(tasks);
    const taskAvg=taskValues.length ? clampPercent(taskValues.reduce((s,t)=>s+Number(t.percent||0),0)/taskValues.length) : percent;
    const completedTasks=taskValues.filter(t=>t.completed).length;
    const lifetime={...(topic.lifetime||{})};
    lifetime.points=Number(lifetime.points||0)+pointsDelta;
    lifetime.completedTasks=Math.max(Number(lifetime.completedTasks||0),completedTasks);
    topic.title=payload.title || topic.title || "A1 Lektion 4 · Thema 2";
    topic.moduleTitle=payload.moduleTitle || topic.moduleTitle || "Wortschatz";
    topic.level=payload.level || topic.level || "A1";
    topic.lesson=payload.lesson || topic.lesson || "4";
    topic.theme=payload.theme || topic.theme || "2";
    topic.progressPercent=taskAvg;
    topic.completedTasks=completedTasks;
    topic.totalTasks=taskValues.length;
    topic.tasks=tasks;
    topic.current={percent:taskAvg, completedTasks, totalTasks:taskValues.length, updatedAt:nowIso()};
    topic.lifetime=lifetime;
    mod[id]=topic;
    current[moduleKey]=mod;
    await writeProgress(current);
  }catch(err){ console.warn("SPProgress task sync failed", err); }
}
async function recordExamResult(payload={}){
  if(!canWriteFirebaseProgress()) return null;
  try{
    const moduleKey=payload.module || "wortschatz";
    const id=topicId(payload);
    const current=await readProgress();
    const mod={...(current[moduleKey]||{})};
    const topic={...(mod[id]||{})};
    const exam={...(topic.exam||{})};
    const score=Number(payload.score||0), maxScore=Number(payload.maxScore||200)||200;
    const percent=clampPercent(payload.percent ?? (score/maxScore*100));
    const stars=Number(payload.stars ?? (percent>=100?3:percent>=70?2:percent>=50?1:0));
    const oldBestScore=Number(exam.bestScore||0);
    const oldBestPercent=Number(exam.bestPercent||0);
    const better=percent>oldBestPercent || score>oldBestScore;
    const pointsDelta=Math.max(0, score-oldBestScore);
    const attempts=Number(exam.attempts||0)+1;
    const attemptsLog=arr(exam.attemptsLog).concat([{score,maxScore,percent,stars,date:nowIso()}]).slice(-20);
    topic.exam={
      attempted:true,
      unlocked:true,
      attempts,
      attemptsLog,
      lastScore:score,
      lastPercent:percent,
      lastStars:stars,
      lastAttemptAt:nowIso(),
      bestScore: better ? score : oldBestScore,
      bestPercent: better ? percent : oldBestPercent,
      stars: better ? stars : Number(exam.stars||0),
      maxScore
    };
    const lifetime={...(topic.lifetime||{})};
    lifetime.points=Number(lifetime.points||0)+pointsDelta;
    lifetime.bestExamPercent=Math.max(Number(lifetime.bestExamPercent||0),percent);
    lifetime.bestStars=Math.max(Number(lifetime.bestStars||0),stars);
    lifetime.examAttempts=attempts;
    topic.lifetime=lifetime;
    topic.examUnlocked=true;
    topic.progressPercent=Math.max(clampPercent(topic.progressPercent||0), percent>=50 ? 100 : clampPercent(topic.progressPercent||0));
    mod[id]=topic;
    current[moduleKey]=mod;
    await writeProgress(current);
  }catch(err){ console.warn("SPProgress exam sync failed", err); }
}
async function recordThemeReset(payload={}){
  if(!canWriteFirebaseProgress()) return null;
  try{
    const moduleKey=payload.module || "wortschatz";
    const id=topicId(payload);
    const current=await readProgress();
    const mod={...(current[moduleKey]||{})};
    const topic={...(mod[id]||{})};
    const lifetime={...(topic.lifetime||{})};
    lifetime.resets=Number(lifetime.resets||0)+1;
    topic.progressPercent=0;
    topic.completedTasks=0;
    topic.totalTasks=topic.totalTasks||0;
    topic.tasks={};
    topic.current={percent:0, completedTasks:0, totalTasks:topic.totalTasks||0, resetAt:nowIso()};
    topic.examUnlocked=false;
    topic.exam={...(topic.exam||{}), unlocked:false};
    topic.lifetime=lifetime;
    mod[id]=topic;
    current[moduleKey]=mod;
    await writeProgress(current);
  }catch(err){ console.warn("SPProgress reset sync failed", err); }
}
async function touch(payload={}){
  if(!canWriteFirebaseProgress()) return null;
  try{
    const current=await readProgress();
    current.lastPage=location.pathname;
    current.lastAction=payload.action || "active";
    await writeProgress(current);
  }catch(err){ console.warn("SPProgress touch failed", err); }
}
async function loadCurrentStudentProgress(){ if(isTeacherPreviewSession()) return {}; return await readProgress(); }
async function loadCourseRanking(courseCode=getCourse()){
  if(isTeacherPreviewSession()) return [];
  if(!courseCode) return [];
  const q=query(collection(db,"progress"), where("kurs","==",courseCode), limit(100));
  const snap=await getDocs(q);
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}

async function migrateLegacyLocalProgress(){
  if(!canWriteFirebaseProgress()) return;
  try{
    const flag="SP_PROGRESS_LEGACY_MIGRATED_V3";
    if(localStorage.getItem(flag)==="1") return;
    const taskSets=[
      {key:"SP_L4_T1_V2", module:"wortschatz", moduleTitle:"Wortschatz", level:"A1", lesson:"4", theme:"1", title:"A1 Lektion 4 · Thema 1", files:["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","wo-ist.html","ist-hier.html"]},
      {key:"SP_L4_T2_FINAL_V3", module:"wortschatz", moduleTitle:"Wortschatz", level:"A1", lesson:"4", theme:"2", title:"A1 Lektion 4 · Thema 2", files:["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","kategorien.html","dialoge.html"]}
    ];
    for(const set of taskSets){
      for(const file of set.files){
        let st=null;
        try{ st=JSON.parse(localStorage.getItem(set.key+"_"+file)||"null"); }catch(e){}
        if(!st || !st.total) continue;
        const done=Array.isArray(st.done)?st.done.length:0;
        const percent=clampPercent(done/Number(st.total||1)*100);
        if(percent<=0) continue;
        await recordTaskProgress({...set,file,taskKey:file,taskTitle:taskTitleFromFile(file),total:Number(st.total||0),done,percent,completed:percent>=100,wrongItems:st.wrongItems||[]});
      }
    }
    const exams=[
      {key:"SP_L4_T1_EXAM_HISTORY_V1", module:"wortschatz", moduleTitle:"Wortschatz", level:"A1", lesson:"4", theme:"1", title:"A1 Lektion 4 · Thema 1"},
      {key:"SP_L4_T2_EXAM_HISTORY_V1", module:"wortschatz", moduleTitle:"Wortschatz", level:"A1", lesson:"4", theme:"2", title:"A1 Lektion 4 · Thema 2"}
    ];
    for(const ex of exams){
      let hist=[];
      try{ hist=JSON.parse(localStorage.getItem(ex.key)||"[]"); }catch(e){}
      if(!Array.isArray(hist) || !hist.length) continue;
      const best=hist.reduce((b,x)=> Number(x.percent||0)>Number(b.percent||0)?x:b, hist[0]);
      await recordExamResult({...ex, score:Number(best.score||0), maxScore:Number(best.maxScore||200)||200, percent:Number(best.percent||0), stars:Number(best.stars||0)});
    }
    localStorage.setItem(flag,"1");
  }catch(err){ console.warn("SPProgress legacy migration failed", err); }
}

const API={recordTaskProgress,recordExamResult,recordThemeReset,touch,loadCurrentStudentProgress,loadCourseRanking,migrateLegacyLocalProgress};
window.SPProgress=API;
const q=window.SP_PROGRESS_QUEUE||[];
window.SP_PROGRESS_QUEUE=[];
for(const item of q){
  if(item && API[item.method]) API[item.method](item.payload||{});
}
try{ touch({action:"page-open"}); }catch(e){}
export { recordTaskProgress, recordExamResult, recordThemeReset, touch, loadCurrentStudentProgress, loadCourseRanking, migrateLegacyLocalProgress, verbStats };
