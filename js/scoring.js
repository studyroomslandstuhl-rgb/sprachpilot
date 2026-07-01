import { db, doc, getDoc, setDoc, serverTimestamp } from "/js/firebase.js";
import { getActiveProfile } from "/js/auth.js";

if(!window.__SP_NO_AUTO_INPUT_FOCUS__){
  window.__SP_NO_AUTO_INPUT_FOCUS__=true;
  const nativeFocus=HTMLElement.prototype.focus;
  HTMLElement.prototype.focus=function(){
    const tag=String(this.tagName||"").toLowerCase();
    if(tag==="input"||tag==="textarea"||tag==="select"||this.isContentEditable)return;
    return nativeFocus.apply(this,arguments);
  };
}

const RULES={
  taskPoints(run){run=Number(run)||1;if(run===1)return 5;if(run===2)return 10;if(run===3)return 15;return 1},
  examMax(run){run=Number(run)||1;if(run===1)return 100;if(run===2)return 200;if(run===3)return 300;return 1},
  examEarned(run,percent){
    run=Number(run)||1;percent=Math.max(0,Math.min(100,Math.round(Number(percent)||0)));
    const max=this.examMax(run);
    if(run>=4)return percent>=100?1:0;
    return Math.round(max*percent/100);
  }
};

function safeJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"")||fallback}catch(e){return fallback}}
function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item"}
function nowIso(){return new Date().toISOString()}
function clampPercent(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function arr(x){return Array.isArray(x)?x:[]}
function profile(){try{return getActiveProfile()||JSON.parse(localStorage.getItem("SP_USER_PROFILE")||localStorage.getItem("SP_STUDENT_PROFILE")||"null")||{}}catch(e){return {}}}
function studentId(p=profile()){return p.studentId||p.userId||p.docId||localStorage.getItem("SP_STUDENT_ID")||cleanId((p.kurs||p.kursnummer||p.courseCode||"")+"_"+(p.email||p.vorname||"student"))}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||""}
function studentName(p=profile()){return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
function isTeacherPreview(){
  try{
    const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
    const preview=safeJson("SP_TEACHER_PREVIEW",null)||safeJson("teacherPreview",null);
    return !!(role==="teacher" || (preview&&preview.teacherPreview===true) || sessionStorage.getItem("SP_TEACHER_PREVIEW")==="1" || localStorage.getItem("SP_TEACHER_PREVIEW")==="1");
  }catch(e){return false}
}
function localLifetimePoints(){return Math.max(0,Number(localStorage.getItem("SP_POINTS_TOTAL")||0)||0)}
function strongestPoints(record={}){return Math.max(Number(record.lifetimePoints||0),Number(record.pointsTotal||0),Number(record.punkteGesamt||0),Number(record.totals?.points||0),Number(record.manualPointsTotal||0),localLifetimePoints())}
function scopeInfo(){
  const path=String(location.pathname||"");
  if(/\/verben-A1\//.test(path))return {moduleKey:"verben",scope:"verben-a1",title:"Verben A1",lesson:"",theme:""};
  const w=path.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\//i);
  if(w){const lesson=w[1];const theme=w[2];return {moduleKey:"wortschatz",scope:`wortschatz-${lesson}-${theme}`.toLowerCase(),title:`${lesson.replace("-"," ")} · ${theme.replace("-"," ")}`,lesson:lesson.replace(/.*Lektion-/i,""),theme:theme.replace(/.*Thema-/i,"")};}
  const q=path.match(/\/fragen\/?([^/]*)/i)||path.match(/\/fragen-A1\/?([^/]*)/i);
  if(q)return {moduleKey:"fragen",scope:"fragen-a1",title:"Fragen A1",lesson:"",theme:""};
  const parts=path.split("/").filter(Boolean);const last=parts.slice(0,-1).join("-")||parts.join("-")||"sprachpilot";
  return {moduleKey:"allgemein",scope:cleanId(last),title:last,lesson:"",theme:""};
}
function runKey(scope=scopeInfo().scope){return `SP_SCORE_RUN_${scope}`}
function currentRun(scope=scopeInfo().scope){return Math.max(1,Math.round(Number(localStorage.getItem(runKey(scope))||1)||1))}
function setRun(scope,run){localStorage.setItem(runKey(scope),String(Math.max(1,Math.round(Number(run)||1))))}
function taskKey(file){return cleanId(file||location.pathname.split("/").pop()||"aufgabe")}
function taskTitle(file){return String(file||"").replace(/\.html$/i,"").replace(/-/g," ").replace(/\b\w/g,m=>m.toUpperCase())||"Aufgabe"}
async function readProgress(id=studentId()){if(!id)return {};const snap=await getDoc(doc(db,"progress",id));return snap.exists()?snap.data():{}}
async function writeProgress(mutator,delta=0){
  if(isTeacherPreview())return null;
  const p=profile();const id=studentId(p);if(!id)return null;
  const current=await readProgress(id);
  const next=mutator({...current})||current;
  const oldTotal=strongestPoints(current);
  const newTotal=Math.max(oldTotal+Math.max(0,Number(delta)||0),oldTotal,strongestPoints(next));
  next.studentId=id;next.userId=id;next.kurs=course(p)||next.kurs||"";next.studentName=studentName(p);next.email=p.email||next.email||"";next.muttersprache=p.muttersprache||p.motherLanguage||next.muttersprache||"";
  next.lifetimePoints=newTotal;next.pointsTotal=newTotal;next.punkteGesamt=newTotal;next.totals={...(next.totals||{}),points:newTotal,updatedAt:nowIso()};next.lastActive=serverTimestamp();next.updatedAt=serverTimestamp();next.lastActiveAt=nowIso();next.lastPage=location.pathname;
  await setDoc(doc(db,"progress",id),next,{merge:true});
  try{localStorage.setItem("SP_POINTS_TOTAL",String(newTotal))}catch(e){}
  return next;
}
function ensureTopic(data,info){
  data[info.moduleKey]=data[info.moduleKey]||{};
  const topic={...(data[info.moduleKey][info.scope]||{})};
  topic.title=topic.title||info.title;topic.moduleTitle=info.moduleKey;topic.level=info.scope.includes("a1")?"A1":(topic.level||"");topic.lesson=info.lesson||topic.lesson||"";topic.theme=info.theme||topic.theme||"";
  topic.tasks=topic.tasks||{};topic.exam=topic.exam||{};topic.lifetime=topic.lifetime||{};
  return topic;
}
function saveTopic(data,info,topic){
  const vals=Object.values(topic.tasks||{}).filter(x=>x&&typeof x==="object");
  topic.completedTasks=vals.filter(t=>t.completed||Number(t.percent)>=100).length;
  topic.totalTasks=Math.max(Number(topic.totalTasks||0),vals.length);
  topic.progressPercent=vals.length?clampPercent(vals.reduce((s,t)=>s+Number(t.percent||0),0)/vals.length):clampPercent(topic.progressPercent||0);
  topic.current={percent:topic.progressPercent,completedTasks:topic.completedTasks,totalTasks:topic.totalTasks,updatedAt:nowIso()};
  data[info.moduleKey]=data[info.moduleKey]||{};data[info.moduleKey][info.scope]=topic;
  data.scoring=data.scoring||{};data.scoring[info.scope]={rules:"standard-v1",run:currentRun(info.scope),lifetime:topic.lifetime,updatedAt:nowIso()};
  return data;
}
async function awardTask(file,options={}){
  if(isTeacherPreview())return 0;
  const info=options.info||scopeInfo();const scope=info.scope;const run=currentRun(scope);const fileName=file||location.pathname.split("/").pop()||"aufgabe.html";
  if(/index\.html|statistik\.html|uebersicht\.html/i.test(fileName))return 0;
  const key=taskKey(fileName);const localKey=`SP_SCORE_TASK_${scope}_RUN_${run}_${key}`;
  if(localStorage.getItem(localKey)==="1")return 0;
  const delta=RULES.taskPoints(run);
  await writeProgress(data=>{const topic=ensureTopic(data,info);const runs={...((topic.lifetime.taskPointRuns||{})[key]||{})};if(runs[String(run)])return saveTopic(data,info,topic);runs[String(run)]=delta;topic.lifetime.taskPointRuns={...(topic.lifetime.taskPointRuns||{}),[key]:runs};topic.lifetime.points=Number(topic.lifetime.points||0)+delta;topic.lifetime.resets=Math.max(Number(topic.lifetime.resets||0),run-1);topic.tasks[key]={...(topic.tasks[key]||{}),key,file:fileName,title:options.title||taskTitle(fileName),percent:100,completed:true,completedAt:(topic.tasks[key]?.completedAt||nowIso()),lastActiveAt:nowIso(),points:Number(topic.tasks[key]?.points||0)+delta,pointsByRun:runs,run};return saveTopic(data,info,topic);},delta);
  localStorage.setItem(localKey,"1");
  return delta;
}
async function awardExam(result={},options={}){
  if(isTeacherPreview())return 0;
  const info=options.info||scopeInfo();const scope=info.scope;const run=currentRun(scope);const percent=clampPercent(result.percent??result.scorePercent??result.score??100);const earned=RULES.examEarned(run,percent);const localKey=`SP_SCORE_EXAM_${scope}_RUN_${run}`;const oldLocal=Number(localStorage.getItem(localKey)||0);const delta=Math.max(0,earned-oldLocal);if(!delta)return 0;
  await writeProgress(data=>{const topic=ensureTopic(data,info);const oldBest=Number((topic.lifetime.examPointRuns||{})[String(run)]||0);const better=Math.max(oldBest,earned);const firestoreDelta=Math.max(0,better-oldBest);topic.lifetime.examPointRuns={...(topic.lifetime.examPointRuns||{}),[String(run)]:better};topic.lifetime.points=Number(topic.lifetime.points||0)+firestoreDelta;topic.lifetime.resets=Math.max(Number(topic.lifetime.resets||0),run-1);topic.lifetime.bestExamPercent=Math.max(Number(topic.lifetime.bestExamPercent||0),percent);const exam={...(topic.exam||{})};exam.attempted=true;exam.unlocked=true;exam.attempts=Number(exam.attempts||0)+1;exam.lastPercent=percent;exam.lastScore=earned;exam.maxScore=RULES.examMax(run);exam.lastAttemptAt=nowIso();exam.bestScore=Math.max(Number(exam.bestScore||0),earned);exam.bestPercent=Math.max(Number(exam.bestPercent||0),percent);exam.stars=percent>=100?3:percent>=70?2:percent>=50?1:0;exam.attemptsLog=arr(exam.attemptsLog).concat([{run,percent,score:earned,maxScore:exam.maxScore,date:nowIso()}]).slice(-30);topic.exam=exam;topic.examUnlocked=true;if(percent>=100)topic.progressPercent=100;return saveTopic(data,info,topic);},delta);
  if(earned>oldLocal)localStorage.setItem(localKey,String(earned));
  return delta;
}
async function resetScope(info=scopeInfo()){
  const scope=info.scope;const next=currentRun(scope)+1;setRun(scope,next);
  await writeProgress(data=>{const topic=ensureTopic(data,info);topic.lifetime.resets=Number(topic.lifetime.resets||0)+1;topic.tasks={};topic.current={percent:0,completedTasks:0,totalTasks:Number(topic.totalTasks||0),resetAt:nowIso()};topic.progressPercent=0;topic.completedTasks=0;topic.exam={...(topic.exam||{}),unlocked:false};topic.examUnlocked=false;return saveTopic(data,info,topic);},0);
  return next;
}
function patch(){
  if(window.__SP_SCORING_PATCHED)return;window.__SP_SCORING_PATCHED=true;
  const patchLater=()=>{
    if(typeof window.complete==="function"&&!window.complete.__spScoring){const old=window.complete;window.complete=function(area,file,nextFile){const out=old.apply(this,arguments);if(String(file||"").includes("pruefung"))awardExam({percent:100});else awardTask(file);return out};window.complete.__spScoring=true;}
    if(typeof window.done==="function"&&!window.done.__spScoring){const old=window.done;window.done=function(file,total){const out=old.apply(this,arguments);awardTask(file);return out};window.done.__spScoring=true;}
    if(typeof window.saveExamResult==="function"&&!window.saveExamResult.__spScoring){const old=window.saveExamResult;window.saveExamResult=function(result){const out=old.apply(this,arguments);awardExam(result||{});return out};window.saveExamResult.__spScoring=true;}
    if(typeof window.resetThemeProgress==="function"&&!window.resetThemeProgress.__spScoring){const old=window.resetThemeProgress;window.resetThemeProgress=function(){if(!confirm("Fortschritte für dieses Thema wirklich löschen? Punkte bleiben erhalten."))return;resetScope().finally(()=>{const c=window.confirm;try{window.confirm=()=>true;old.apply(this,arguments)}finally{window.confirm=c}})};window.resetThemeProgress.__spScoring=true;}
    drainQueues();
  };
  patchLater();document.addEventListener("DOMContentLoaded",patchLater);setTimeout(patchLater,0);setTimeout(patchLater,250);setTimeout(patchLater,1000);
}
function drainQueues(){
  const tq=Array.isArray(window.SP_L3_TASK_DONE_QUEUE)?window.SP_L3_TASK_DONE_QUEUE.splice(0):[];tq.forEach(file=>awardTask(file));
  const eq=Array.isArray(window.SP_L3_EXAM_QUEUE)?window.SP_L3_EXAM_QUEUE.splice(0):[];eq.forEach(r=>awardExam(r||{percent:100}));
}

window.SprachPilotScoring={RULES,scopeInfo,currentRun,taskPointsForRun:RULES.taskPoints,examMaxForRun:RULES.examMax,examEarnedForRun:RULES.examEarned,awardTask,awardExam,resetScope};
window.spL3RecordTaskDone=(file)=>awardTask(file,{info:scopeInfo()});
window.spL3RecordExamResult=(result)=>awardExam(result||{percent:100},{info:scopeInfo()});

patch();