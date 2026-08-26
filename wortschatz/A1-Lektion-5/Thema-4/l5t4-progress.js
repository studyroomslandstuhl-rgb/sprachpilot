(function(){
'use strict';
if(window.__SP_L5T4_PROGRESS_V1)return;
window.__SP_L5T4_PROGRESS_V1=true;

const MASTER_KEY='SP_L5_T4_PROGRESS_V2';
const POINTS_KEY='SP_L5_T4_POINTS';
const TOPIC_ID='wortschatz-a1-lektion-5-thema-4';
const SCORE_RUN_KEY='SP_SCORE_RUN_'+TOPIC_ID;
const LEGACY_PREFIXES=['SP_L5_T4_V1_','SP_L5_T4_V2_','SP_L5_T4_'];
const TASK_TOTALS={
 'karteikarten.html':null,
 'artikel.html':12,
 'hoeren-schreiben.html':13,
 'hoeren-bild.html':null,
 'bild-wort.html':null,
 'hoeren.html':13,
 'schilder.html':10,
 'lesen.html':6,
 'tv-programm.html':6,
 'zuordnen.html':10,
 'saetze-bauen.html':8,
 'mini-dialoge.html':8,
 'jede-zeit.html':16
};
const ALIASES={
 'zuordnen-v5.html':'zuordnen.html',
 'zuordnen-v6.html':'zuordnen.html',
 'zuordnen-v7.html':'zuordnen.html'
};
const TITLES={
 'karteikarten.html':'Karteikarten','artikel.html':'Artikel','hoeren-schreiben.html':'Hören / Schreiben',
 'hoeren-bild.html':'Hören / Bild','bild-wort.html':'Bild / Wort','hoeren.html':'Hören','schilder.html':'Schilder',
 'lesen.html':'Lesen: Noras Tag','tv-programm.html':'TV-Programm','zuordnen.html':'Zuordnen','saetze-bauen.html':'Sätze bauen',
 'mini-dialoge.html':'Mini-Dialoge','jede-zeit.html':'jeden / jede / jedes'
};
let cloudPromise=null;
let flushTimer=null;
const pending=new Map();

function parse(raw,fallback=null){try{return JSON.parse(raw||'null')??fallback}catch(e){return fallback}}
function clamp(n){return Math.max(0,Math.min(100,Math.round(Number(n)||0)))}
function uniqueInts(list,total){return [...new Set((Array.isArray(list)?list:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<total))]}
function canonical(file){file=String(file||'');return ALIASES[file]||file}
function currentRunFromStorage(){return Math.max(1,Math.min(3,Math.round(Number(localStorage.getItem(SCORE_RUN_KEY)||1)||1)))}
function taskPoints(run){return run===1?5:run===2?10:run===3?15:0}
function examMax(run){return run===1?100:run===2?200:run===3?300:0}
function blankTask(total){total=Math.max(0,Number(total)||0);return{total,done:[],queue:[...Array(total).keys()].sort(()=>Math.random()-.5),current:null,tries:0,hadWrong:false}}
function taskPercent(st,total){total=Math.max(0,Number(total??st?.total)||0);return total?clamp((Array.isArray(st?.done)?st.done.length:0)/total*100):0}
function normalizeTask(st,total){
 total=Math.max(0,Number(total??st?.total)||0);
 if(!st||typeof st!=='object')return blankTask(total);
 const oldTotal=Math.max(0,Number(st.total)||total),oldDone=Array.isArray(st.done)?st.done.length:0,oldPct=oldTotal?clamp(oldDone/oldTotal*100):0;
 let done=uniqueInts(st.done,total);
 if(oldPct>=100&&total)done=[...Array(total).keys()];
 else if(oldTotal!==total&&total&&oldPct>0&&done.length===0)done=[...Array(Math.min(total,Math.round(total*oldPct/100))).keys()];
 const missing=[...Array(total).keys()].filter(i=>!done.includes(i));
 let queue=uniqueInts(st.queue,total).filter(i=>!done.includes(i));
 for(const i of missing)if(!queue.includes(i)&&i!==st.current)queue.push(i);
 let current=Number.isInteger(st.current)&&st.current>=0&&st.current<total&&!done.includes(st.current)?st.current:null;
 return{...st,total,done,queue,current,tries:Math.max(0,Number(st.tries)||0),hadWrong:!!st.hadWrong};
}
function emptyMaster(){return{version:2,run:currentRunFromStorage(),tasks:{},awards:{taskByRun:{},examByRun:{}},exam:{byRun:{}},points:0,updatedAt:new Date().toISOString()}}
function mergeTaskState(a,b,total){
 a=normalizeTask(a,total);b=normalizeTask(b,total);
 const pa=taskPercent(a,total),pb=taskPercent(b,total),best=pa>=pb?a:b;
 if(Math.max(pa,pb)>=100)return normalizeTask({total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false},total);
 return normalizeTask(best,total);
}
function readMasterRaw(){const m=parse(localStorage.getItem(MASTER_KEY),null);return m&&typeof m==='object'?m:emptyMaster()}
function knownTotal(file,fallback){const configured=TASK_TOTALS[canonical(file)];return Math.max(0,Number(fallback??configured)||0)}
function legacyCandidates(file){const names=[file,...Object.keys(ALIASES).filter(k=>ALIASES[k]===file)];const keys=[];for(const prefix of LEGACY_PREFIXES)for(const name of names)keys.push(prefix+name);return keys}
function migrateLegacy(master){
 master.tasks=master.tasks&&typeof master.tasks==='object'?master.tasks:{};
 for(const file of Object.keys(TASK_TOTALS)){
  let total=knownTotal(file,master.tasks[file]?.total);
  let merged=master.tasks[file]||null;
  for(const key of legacyCandidates(file)){
   const st=parse(localStorage.getItem(key),null);if(!st)continue;
   total=knownTotal(file,st.total||total);
   merged=merged?mergeTaskState(merged,st,total):normalizeTask(st,total);
  }
  if(merged)master.tasks[file]=normalizeTask(merged,total||merged.total);
 }
 for(const key of Object.keys(localStorage)){
  if(/^SP_L5_T4_V\d+_/.test(key)&&key!==MASTER_KEY)localStorage.removeItem(key);
  if(key.startsWith('SP_L5_POINTS_SIG_'+TOPIC_ID+'_'))localStorage.removeItem(key);
 }
 return master;
}
function recalc(master){
 master.awards=master.awards||{taskByRun:{},examByRun:{}};master.awards.taskByRun=master.awards.taskByRun||{};master.awards.examByRun=master.awards.examByRun||{};
 let total=0;
 for(const runMap of Object.values(master.awards.taskByRun))for(const value of Object.values(runMap||{}))total+=Math.max(0,Number(value)||0);
 for(const value of Object.values(master.awards.examByRun))total+=Math.max(0,Number(value)||0);
 master.points=Math.round(total);master.updatedAt=new Date().toISOString();return master;
}
function readMaster(){
 let master=migrateLegacy(readMasterRaw());
 master.version=2;master.run=Math.max(1,Math.min(3,Number(master.run)||1,currentRunFromStorage()));
 master.tasks=master.tasks||{};master.exam=master.exam||{byRun:{}};master.exam.byRun=master.exam.byRun||{};
 master.awards=master.awards||{taskByRun:{},examByRun:{}};master.awards.taskByRun=master.awards.taskByRun||{};master.awards.examByRun=master.awards.examByRun||{};
 return recalc(master);
}
function writeMaster(master,dispatch=true){
 recalc(master);localStorage.setItem(MASTER_KEY,JSON.stringify(master));localStorage.setItem(POINTS_KEY,String(master.points||0));
 if(dispatch)try{window.dispatchEvent(new CustomEvent('sprachpilot-progress',{detail:{theme:'L5T4',master}}))}catch(e){}
 return master;
}
function payload(file,st){
 const total=Math.max(0,Number(st?.total)||knownTotal(file));const done=Math.min(total,Array.isArray(st?.done)?st.done.length:0),percent=total?clamp(done/total*100):0;
 return{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'4',topicId:TOPIC_ID,title:'A1 Lektion 5 · Thema 4',file,taskKey:file,taskTitle:TITLES[file]||file.replace('.html',''),total,done,percent,completed:percent>=100,countAttempt:false};
}
function loadCloudApi(){
 if(window.SPProgress)return Promise.resolve(window.SPProgress);
 if(cloudPromise)return cloudPromise;
 cloudPromise=import('/js/progress.js?v=l5t4-central1').then(()=>window.SPProgress||null).catch(e=>{console.warn('L5T4 Firebase-Sync konnte noch nicht geladen werden',e);return null});
 return cloudPromise;
}
function queueCloud(method,data,key){pending.set(key||method+':'+(data?.file||''),{method,data});clearTimeout(flushTimer);flushTimer=setTimeout(flushCloud,180)}
async function flushCloud(){
 if(!pending.size)return;const api=await loadCloudApi();if(!api){setTimeout(flushCloud,1500);return}
 const items=[...pending.values()];pending.clear();
 for(const item of items){try{if(typeof api[item.method]==='function')await api[item.method](item.data)}catch(e){console.warn('L5T4 Sync fehlgeschlagen',item.method,e);pending.set(item.method+':'+(item.data?.file||Date.now()),item)}}
 if(pending.size)setTimeout(flushCloud,1200);
}
function awardTask(master,file,st){
 const percent=taskPercent(st,st.total);if(percent<100)return;
 const run=master.run,points=taskPoints(run);master.awards.taskByRun[file]=master.awards.taskByRun[file]||{};
 if(!master.awards.taskByRun[file][String(run)])master.awards.taskByRun[file][String(run)]=points;
}
function saveCanonicalTask(file,st,sync=true){
 file=canonical(file);const master=readMaster(),total=knownTotal(file,st?.total);const normalized=normalizeTask(st,total);
 master.tasks[file]=normalized;awardTask(master,file,normalized);writeMaster(master);
 if(sync&&file!=='pruefung.html')queueCloud('recordTaskProgress',payload(file,normalized),'task:'+file);
 return normalized;
}
function loadCanonicalTask(file,total){
 file=canonical(file);const master=readMaster(),resolved=knownTotal(file,total);let st=normalizeTask(master.tasks[file],resolved);
 if(master.tasks[file]&&JSON.stringify(master.tasks[file])!==JSON.stringify(st)){master.tasks[file]=st;writeMaster(master,false)}
 return st;
}
function examPercent(master,run=master.run){return clamp(master.exam?.byRun?.[String(run)]?.percent||0)}
function saveExamResult(result={}){
 const master=readMaster(),run=master.run,percent=clamp(result.percent??result.scorePercent??0),score=Number(result.score)||0,maxScore=Number(result.maxScore)||12,stars=Number(result.stars)||(percent>=100?3:percent>=70?2:percent>=50?1:0);
 master.exam.byRun[String(run)]=master.exam.byRun[String(run)]||{attempts:0,percent:0,score:0,maxScore,stars:0};
 const old=master.exam.byRun[String(run)];old.attempts=Math.max(0,Number(old.attempts)||0)+1;old.percent=Math.max(clamp(old.percent),percent);old.score=old.percent===percent?score:old.score;old.maxScore=maxScore;old.stars=Math.max(Number(old.stars)||0,stars);old.lastAttemptAt=new Date().toISOString();
 const earned=Math.round(examMax(run)*old.percent/100);master.awards.examByRun[String(run)]=Math.max(Number(master.awards.examByRun[String(run)]||0),earned);writeMaster(master);
 queueCloud('recordExamResult',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'4',topicId:TOPIC_ID,title:'A1 Lektion 5 · Thema 4',file:'pruefung.html',taskTitle:'Prüfung',score,maxScore,percent,scorePercent:percent,stars},'exam:'+run);
 return old;
}
function mergeCloudAwards(master,topic){
 const life=topic?.lifetime||{};const taskRuns=life.taskPointRuns||{};
 for(const[fileRaw,runs]of Object.entries(taskRuns)){const file=canonical(fileRaw.endsWith('.html')?fileRaw:fileRaw.replace(/-html$/,'.html'));if(!TASK_TOTALS.hasOwnProperty(file))continue;master.awards.taskByRun[file]=master.awards.taskByRun[file]||{};for(const[r,v]of Object.entries(runs||{}))master.awards.taskByRun[file][r]=Math.max(Number(master.awards.taskByRun[file][r]||0),Number(v)||0)}
 for(const[r,v]of Object.entries(life.examPointRuns||{}))master.awards.examByRun[r]=Math.max(Number(master.awards.examByRun[r]||0),Number(v)||0);
}
function stateFromPercent(total,percent){const doneCount=percent>=100?total:Math.min(total,Math.round(total*clamp(percent)/100));return normalizeTask({total,done:[...Array(doneCount).keys()],queue:[],current:null,tries:0,hadWrong:false},total)}
async function pullCloud(){
 const api=await loadCloudApi();if(!api||typeof api.loadCurrentStudentProgress!=='function')return;
 try{
  const progress=await api.loadCurrentStudentProgress(),topic=progress?.wortschatz?.[TOPIC_ID];if(!topic)return;
  let master=readMaster();const cloudRun=Math.max(1,Math.min(3,(Number(topic?.lifetime?.resets)||0)+1));master.run=Math.max(master.run,cloudRun,currentRunFromStorage());localStorage.setItem(SCORE_RUN_KEY,String(master.run));mergeCloudAwards(master,topic);
  const cloudTasks=topic.tasks||{};
  for(const file of Object.keys(TASK_TOTALS)){
   const candidates=[file,...Object.keys(ALIASES).filter(k=>ALIASES[k]===file)];let best=null;
   for(const key of candidates){const rec=cloudTasks[key];if(rec&&(!best||clamp(rec.percent)>clamp(best.percent)))best=rec}
   if(!best)continue;const total=knownTotal(file,best.total||master.tasks[file]?.total);if(!total)continue;
   const cloudState=stateFromPercent(total,best.percent||0),localState=normalizeTask(master.tasks[file],total);if(taskPercent(cloudState,total)>taskPercent(localState,total))master.tasks[file]=cloudState;
  }
  const erun=String(master.run),exam=topic.exam||{};if(exam.attempted){master.exam.byRun[erun]=master.exam.byRun[erun]||{attempts:0,percent:0,score:0,maxScore:12,stars:0};const local=master.exam.byRun[erun];local.percent=Math.max(clamp(local.percent),clamp(exam.bestPercent||exam.percent));local.stars=Math.max(Number(local.stars)||0,Number(exam.stars)||0);local.attempts=Math.max(Number(local.attempts)||0,Number(exam.attempts)||0)}
  writeMaster(master);
 }catch(e){console.warn('L5T4 Cloud-Fortschritt konnte noch nicht übernommen werden',e)}
}
function syncAllLocal(){const master=readMaster();for(const file of Object.keys(TASK_TOTALS)){const st=master.tasks[file];if(st&&st.total&&taskPercent(st,st.total)>0)queueCloud('recordTaskProgress',payload(file,st),'task:'+file)}const ex=master.exam?.byRun?.[String(master.run)];if(ex&&ex.attempts)queueCloud('recordExamResult',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'4',topicId:TOPIC_ID,title:'A1 Lektion 5 · Thema 4',file:'pruefung.html',taskTitle:'Prüfung',score:ex.score||0,maxScore:ex.maxScore||12,percent:ex.percent||0,scorePercent:ex.percent||0,stars:ex.stars||0},'exam:'+master.run)}
function resetTheme(){
 if(!confirm('Fortschritte in diesem Thema löschen?'))return;
 const master=readMaster();master.run=Math.min(3,master.run+1);localStorage.setItem(SCORE_RUN_KEY,String(master.run));master.tasks={};master.exam.byRun[String(master.run)]={attempts:0,percent:0,score:0,maxScore:12,stars:0};writeMaster(master);
 queueCloud('recordThemeReset',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'4',topicId:TOPIC_ID,title:'A1 Lektion 5 · Thema 4'},'reset');setTimeout(()=>location.href='index.html',250);
}

window.taskKey=function(file){return 'SP_L5_T4_CANONICAL_'+canonical(file)};
window.loadTask=function(file,total){return loadCanonicalTask(file,total)};
window.saveTask=function(file,st){return saveCanonicalTask(file,st,true)};
window.markTaskDone=function(file,total){return saveCanonicalTask(file,{total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false},file!=='pruefung.html')};
window.pctFor=function(file,total){file=canonical(file);const master=readMaster();if(file==='pruefung.html')return examPercent(master);const st=loadCanonicalTask(file,total);return taskPercent(st,total||st.total)};
window.spProgressHtml=function(file,total){const st=loadCanonicalTask(file,total),d=Math.min(st.done.length,total),p=window.pctFor(file,total);return`<div class="small">${d} richtig · ${Math.max(0,total-d)} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`};
window.resetThemeProgress=resetTheme;
window.spL5T4SaveExamResult=saveExamResult;
window.spL5T4ReadProgress=readMaster;
window.spL5T4ThemePoints=function(){return readMaster().points||0};
window.spL5T4SyncNow=function(){syncAllLocal();return flushCloud()};

writeMaster(readMaster(),false);
loadCloudApi().then(async()=>{await pullCloud();syncAllLocal();flushCloud()});
window.addEventListener('online',()=>{syncAllLocal();flushCloud()});
window.addEventListener('focus',()=>{syncAllLocal();flushCloud()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){syncAllLocal();flushCloud()}});
})();
