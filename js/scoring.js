import { recordTaskProgress, recordExamResult, recordThemeReset } from "/js/progress.js?v=9";

const RULES={
  taskPoints(run){run=Number(run)||1;if(run===1)return 5;if(run===2)return 10;if(run===3)return 15;return 1},
  examMax(run){run=Number(run)||1;if(run===1)return 100;if(run===2)return 200;if(run===3)return 300;return 1},
  examEarned(run,percent){run=Number(run)||1;percent=Math.max(0,Math.min(100,Math.round(Number(percent)||0)));if(run>=4)return percent>=100?1:0;return Math.round(this.examMax(run)*percent/100)}
};
function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item"}
function scopeInfo(){
  const path=String(location.pathname||"");
  if(/\/verben-A1\//.test(path))return{moduleKey:"verben",scope:"verben-a1",module:"verben",title:"Verben A1",lesson:"",theme:""};
  const w=path.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\//i);
  if(w){const lesson=w[1],theme=w[2];return{moduleKey:"wortschatz",module:"wortschatz",scope:`wortschatz-${lesson}-${theme}`.toLowerCase(),topicId:`wortschatz-${lesson}-${theme}`.toLowerCase(),title:`${lesson.replace("-"," ")} · ${theme.replace("-"," ")}`,lesson:lesson.replace(/.*Lektion-/i,""),theme:theme.replace(/.*Thema-/i,"")};}
  if(/\/fragen-A1\//.test(path)||/\/fragen\//.test(path))return{moduleKey:"fragen",module:"fragen",scope:"fragen-a1",topicId:"fragen-a1",title:"Fragen A1",lesson:"",theme:""};
  return{moduleKey:"allgemein",module:"allgemein",scope:cleanId(path),topicId:cleanId(path),title:path,lesson:"",theme:""};
}
function currentRun(scope=scopeInfo().scope){return Math.max(1,Math.round(Number(localStorage.getItem(`SP_SCORE_RUN_${scope}`)||1)||1))}
function taskPayload(file,percent=100){const info=scopeInfo();return{module:info.module,moduleTitle:info.moduleKey==="wortschatz"?"Wortschatz":info.moduleKey,level:"A1",lesson:info.lesson,theme:info.theme,topicId:info.topicId,title:info.title,file:file||location.pathname.split('/').pop()||'aufgabe.html',taskKey:file||location.pathname.split('/').pop()||'aufgabe.html',taskTitle:String(file||'Aufgabe').replace(/\.html$/,'').replace(/-/g,' '),percent,completed:percent>=100,total:100,done:percent,countAttempt:false}}
async function awardTask(file,options={}){return recordTaskProgress({...taskPayload(file,100),...(options.payload||{})})}
async function awardExam(result={},options={}){const percent=Math.max(0,Math.min(100,Math.round(Number(result.percent??result.scorePercent??result.score??100)||0)));const p={...taskPayload('pruefung.html',percent),scorePercent:percent,score:percent,stars:percent>=100?3:percent>=70?2:percent>=50?1:0,...(options.payload||{})};await recordExamResult(p);return recordTaskProgress(p)}
async function resetScope(info=scopeInfo()){return recordThemeReset({module:info.module,level:"A1",lesson:info.lesson,theme:info.theme,topicId:info.topicId,title:info.title})}
function patch(){
  if(window.__SP_SCORING_PATCHED_V9)return;window.__SP_SCORING_PATCHED_V9=true;
  const later=()=>{
    if(typeof window.complete==="function"&&!window.complete.__spScoringV9){const old=window.complete;window.complete=function(area,file,nextFile){const out=old.apply(this,arguments);if(String(file||"").includes("pruefung"))awardExam({percent:100});else awardTask(file);return out};window.complete.__spScoringV9=true;}
    if(typeof window.done==="function"&&!window.done.__spScoringV9){const old=window.done;window.done=function(file,total){const out=old.apply(this,arguments);awardTask(file,{payload:{total:Number(total||100),done:Number(total||100)}});return out};window.done.__spScoringV9=true;}
    if(typeof window.saveExamResult==="function"&&!window.saveExamResult.__spScoringV9){const old=window.saveExamResult;window.saveExamResult=function(result){const out=old.apply(this,arguments);awardExam(result||{});return out};window.saveExamResult.__spScoringV9=true;}
    drainQueues();
  };
  later();document.addEventListener("DOMContentLoaded",later);setTimeout(later,300);
}
function drainQueues(){const tq=Array.isArray(window.SP_L3_TASK_DONE_QUEUE)?window.SP_L3_TASK_DONE_QUEUE.splice(0):[];tq.forEach(file=>awardTask(file));const eq=Array.isArray(window.SP_L3_EXAM_QUEUE)?window.SP_L3_EXAM_QUEUE.splice(0):[];eq.forEach(r=>awardExam(r||{percent:100}))}
window.SprachPilotScoring={RULES,scopeInfo,currentRun,taskPointsForRun:RULES.taskPoints,examMaxForRun:RULES.examMax,examEarnedForRun:RULES.examEarned,awardTask,awardExam,resetScope};
window.spL3RecordTaskDone=(file)=>awardTask(file);
window.spL3RecordExamResult=(result)=>awardExam(result||{percent:100});
patch();