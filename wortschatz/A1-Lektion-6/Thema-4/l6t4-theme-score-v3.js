(function(){
'use strict';
if(window.L6T4ThemeScoreV3)return;
const LEDGER_KEY='SP_THEME_SCORE_A1_L6_T4_V3';
const TOPIC_ID='wortschatz-a1-lektion-6-thema-4';
const RUN_KEY='SP_SCORE_RUN_'+TOPIC_ID;
const PRACTICE_IDS=['cards','image-word','word-image','listen-image','article','plural','noun-verb','nehmen','yes-no-doch','doch-answer','dialogs','gaps','listen-abc','finden','questions','singular-plural'];
const LEGACY_MERGES={dialogs:['dialog-rf','dialog-abc'],gaps:['phrases','gaps']};
let syncing=false;
const now=()=>new Date().toISOString();
const clamp=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));
const isOverview=()=>{const path=location.pathname.replace(/\/+$/,'');return path.endsWith('/Thema-4')||path.endsWith('/Thema-4/index.html')};
const preview=()=>typeof window.l6t4IsPreview==='function'?window.l6t4IsPreview():String(localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase()==='teacher';
const taskPoints=run=>run===1?5:run===2?10:run===3?15:0;
const examMax=run=>run===1?100:run===2?200:run===3?300:0;
const blankRun=()=>({tasks:{},examBestPercent:0,examPoints:0,examStars:0,completed:false,startedAt:now(),updatedAt:now()});
const blankLedger=()=>({version:3,themeKey:'A1-L6-T4',currentRun:1,runs:{'1':blankRun()},lifetimePoints:0,pending:{tasks:{},exams:{}},advanceAfterPerfect:false,migrated:false,updatedAt:now()});
function normalize(value){
 const ledger=value&&typeof value==='object'?value:blankLedger();
 ledger.version=3;ledger.currentRun=Math.max(1,Math.min(3,Number(ledger.currentRun)||1));
 ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};
 for(let run=1;run<=ledger.currentRun;run++)ledger.runs[String(run)]={...blankRun(),...(ledger.runs[String(run)]||{}),tasks:{...((ledger.runs[String(run)]||{}).tasks||{})}};
 ledger.pending=ledger.pending&&typeof ledger.pending==='object'?ledger.pending:{tasks:{},exams:{}};
 ledger.pending.tasks=ledger.pending.tasks&&typeof ledger.pending.tasks==='object'?ledger.pending.tasks:{};
 ledger.pending.exams=ledger.pending.exams&&typeof ledger.pending.exams==='object'?ledger.pending.exams:{};
 ledger.lifetimePoints=calculateLifetime(ledger);
 return ledger
}
function read(){try{return normalize(JSON.parse(localStorage.getItem(LEDGER_KEY)||'null'))}catch(e){return blankLedger()}}
function runData(ledger,run=ledger.currentRun){const key=String(run);if(!ledger.runs[key])ledger.runs[key]=blankRun();return ledger.runs[key]}
function calculateLifetime(ledger){let total=0;Object.values(ledger.runs||{}).forEach(run=>{Object.values(run.tasks||{}).forEach(task=>total+=Math.max(0,Number(task.points)||0));total+=Math.max(0,Number(run.examPoints)||0)});return total}
function write(ledger){if(preview())return normalize(ledger);ledger=normalize(ledger);ledger.updatedAt=now();ledger.lifetimePoints=calculateLifetime(ledger);localStorage.setItem(LEDGER_KEY,JSON.stringify(ledger));localStorage.setItem(RUN_KEY,String(ledger.currentRun));try{window.dispatchEvent(new CustomEvent('l6t4-score-change',{detail:summaryFrom(ledger)}))}catch(e){}return ledger}
function statePercent(state){const total=Math.max(0,Number(state?.total)||0),done=Array.isArray(state?.done)?state.done.length:Number(state?.done)||0;return total?clamp(done/total*100):clamp(state?.percent)}
function taskFile(id){return id==='plural'?'plural-sprechen.html':`task-${id}`}
function taskTitle(id){return window.L6T4_USER_META?.find(item=>item.id===id)?.title||window.L6T4_DATA?.tasks?.find(item=>item.id===id)?.title||id}
function recordTask(file,state){
 if(preview())return read();
 const ledger=read(),run=ledger.currentRun,data=runData(ledger,run),percent=statePercent(state),old=data.tasks[file]||{};
 const completed=!!old.completed||percent>=100;
 const next={...old,file,title:window.L6T4_TASKS?.find(item=>item.key===file||item.file===file)?.title||file,percent:Math.max(Number(old.percent)||0,percent),completed,points:completed?Math.max(Number(old.points)||0,taskPoints(run)):Number(old.points)||0,total:Math.max(Number(old.total)||0,Number(state?.total)||0),done:Math.max(Number(old.done)||0,Array.isArray(state?.done)?state.done.length:Number(state?.done)||0),updatedAt:now()};
 data.tasks[file]=next;data.updatedAt=now();ledger.pending.tasks[`${run}:${file}`]=true;return write(ledger)
}
function recordExam(result){
 if(preview())return read();
 const ledger=read(),run=ledger.currentRun,data=runData(ledger,run),percent=clamp(result?.percent);
 if(percent>=Number(data.examBestPercent||0)){data.examBestPercent=percent;data.examPoints=Math.round(examMax(run)*percent/100);data.examStars=Math.max(Number(data.examStars)||0,Number(result?.stars)||0)}
 data.completed=data.examBestPercent>=100;data.updatedAt=now();ledger.pending.exams[String(run)]=true;
 if(data.completed&&run<3)ledger.advanceAfterPerfect=true;
 return write(ledger)
}
function rawState(file){try{return JSON.parse(localStorage.getItem(`SP_L6_T4_V2_${file}`)||'null')}catch(e){return null}}
function rawPercent(file){return statePercent(rawState(file))}
function totalFor(id){const meta=window.L6T4_TASKS?.find(item=>item.id===id);const current=window.L6T4_DATA?.tasks?.find(item=>item.id===id);return Math.max(0,Number(meta?.total)||Number(current?.items?.length)||0)}
function writeVisibleState(id,percent){
 const total=totalFor(id);if(!total)return;
 const file=taskFile(id),existing=rawState(file);if(existing&&existing.total===total)return;
 const doneCount=Math.min(total,Math.floor(clamp(percent)*total/100));
 const done=[...Array(doneCount).keys()],queue=[...Array(total).keys()].filter(index=>!done.includes(index));
 localStorage.setItem(`SP_L6_T4_V2_${file}`,JSON.stringify({total,done,queue,current:null,tries:0,hadWrong:false,firstCorrect:doneCount,firstSeen:[...done]}));
}
function mergedPercent(id){const files=LEGACY_MERGES[id]||[];if(id==='dialogs')return Math.min(...files.map(source=>rawPercent(`task-${source}`)));if(id==='gaps')return Math.round(files.map(source=>rawPercent(`task-${source}`)).reduce((sum,value)=>sum+value,0)/Math.max(1,files.length));return 0}
function migrate(){
 if(preview())return;
 const ledger=read();if(ledger.migrated)return;
 PRACTICE_IDS.forEach(id=>{const file=taskFile(id);let percent=rawPercent(file);if(!percent&&LEGACY_MERGES[id])percent=mergedPercent(id);if(percent>0){writeVisibleState(id,percent);const state=rawState(file);if(state)recordTask(file,state)}});
 const oldExam=rawState('task-exam');if(oldExam){const total=Number(oldExam.total)||0,first=Number(oldExam.firstCorrect)||0,best=total?clamp(first/total*100):0;if(best)recordExam({percent:best,stars:best>=100?3:best>=70?2:best>=50?1:0})}
 const updated=read();updated.migrated=true;write(updated)
}
function clearVisible(){
 const remove=[];for(let i=0;i<localStorage.length;i++){const key=String(localStorage.key(i)||'');if(key.startsWith('SP_L6_T4_V2_')||key.startsWith('SP_L6_T4_EXAM_ATTEMPTS_'))remove.push(key)}remove.forEach(key=>localStorage.removeItem(key));
}
function advanceIfNeeded(){
 if(preview())return false;
 const ledger=read(),current=ledger.currentRun,data=runData(ledger,current);
 if(!ledger.advanceAfterPerfect||current>=3||Number(data.examBestPercent||0)<100)return false;
 ledger.currentRun=current+1;runData(ledger,ledger.currentRun);ledger.advanceAfterPerfect=false;clearVisible();write(ledger);return true
}
function summaryFrom(ledger){
 ledger=normalize(ledger);const data=runData(ledger),taskTotal=Object.values(data.tasks||{}).reduce((sum,item)=>sum+(Number(item.points)||0),0);
 return{currentRun:ledger.currentRun,label:ledger.currentRun===1?'Versuch 1 von 3':`Wiederholung ${ledger.currentRun} von 3`,runTaskPoints:taskTotal,runExamPoints:Number(data.examPoints)||0,examBestPercent:Number(data.examBestPercent)||0,runPoints:taskTotal+Number(data.examPoints||0),lifetimePoints:Number(ledger.lifetimePoints)||0,pending:!!(Object.keys(ledger.pending.tasks||{}).length||Object.keys(ledger.pending.exams||{}).length),preview:preview()}
}
function summary(){return summaryFrom(read())}
function summaryHtml(){const s=summary();if(s.preview)return'<div class="score-ledger-card"><b>Lehrer-Vorschau</b><div class="small">Es werden keine Schülerpunkte gespeichert.</div></div>';return`<div class="score-ledger-card"><div><b>${s.label}</b><div class="small">Aufgaben: ${s.runTaskPoints} Punkte · Prüfung: ${s.runExamPoints} Punkte · Bestes Prüfungsergebnis: ${s.examBestPercent}%</div></div><div class="score-ledger-total">Gesamt: ${s.lifetimePoints} Punkte</div>${s.pending?'<div class="small">Die Änderungen werden auf dieser Themenübersicht mit dem Hauptsystem synchronisiert.</div>':''}</div>`}
function renderSummary(){const target=document.getElementById('scoreSummary');if(target)target.innerHTML=summaryHtml()}
async function ensureApi(){if(window.SPProgress?.recordTaskProgress)return window.SPProgress;try{await import('/js/progress.js?v=l6t4-central3')}catch(e){return null}return window.SPProgress||null}
async function syncFirebase(){
 if(!isOverview()||preview()||syncing)return false;
 const ledger=read(),taskKeys=Object.keys(ledger.pending.tasks||{}),examKeys=Object.keys(ledger.pending.exams||{});if(!taskKeys.length&&!examKeys.length)return true;
 const api=await ensureApi();if(!api)return false;syncing=true;let ok=true;
 try{
  for(const key of taskKeys){const split=key.indexOf(':'),run=Math.max(1,Math.min(3,Number(key.slice(0,split))||1)),file=key.slice(split+1),item=runData(ledger,run).tasks[file];if(!item){delete ledger.pending.tasks[key];continue}localStorage.setItem(RUN_KEY,String(run));const result=await api.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:TOPIC_ID,title:'A1 Lektion 6 · Thema 4',file,taskKey:file,taskTitle:item.title||file,total:item.total||1,done:item.done||0,percent:item.percent||0,completed:!!item.completed});if(result)delete ledger.pending.tasks[key];else ok=false}
  for(const key of examKeys){const run=Math.max(1,Math.min(3,Number(key)||1)),data=runData(ledger,run);if(!data.examBestPercent){delete ledger.pending.exams[key];continue}localStorage.setItem(RUN_KEY,String(run));const result=await api.recordExamResult({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:TOPIC_ID,title:'A1 Lektion 6 · Thema 4',percent:data.examBestPercent,scorePercent:data.examBestPercent,stars:data.examStars||0});if(result)delete ledger.pending.exams[key];else ok=false}
 }catch(e){ok=false}
 finally{localStorage.setItem(RUN_KEY,String(ledger.currentRun));localStorage.setItem(LEDGER_KEY,JSON.stringify(normalize(ledger)));syncing=false;renderSummary()}
 return ok
}
function resetPractice(){if(preview()){alert('In der Lehrer-Vorschau wird kein Teilnehmerfortschritt gespeichert.');return false}if(!confirm('Sichtbaren Fortschritt zurücksetzen? Bereits verdiente Punkte bleiben erhalten.'))return false;clearVisible();location.href='index.html?v=l6t4-central3';return true}
function initOverview(){migrate();advanceIfNeeded();renderSummary();setTimeout(syncFirebase,250)}

const originalPercent=window.l6t4Percent;
window.l6t4Sync=function(file,state){return recordTask(file,state)};
window.l6t4Percent=function(file,total){const item=window.L6T4_TASKS?.find(task=>task.key===file||task.file===file||task.id===file);if(item?.exam||file==='task-exam'||file==='pruefung.html')return summary().examBestPercent;return typeof originalPercent==='function'?originalPercent(file,total):0};
window.l6t4ExamUnlocked=function(){return preview()||PRACTICE_IDS.every(id=>{const item=window.L6T4_TASKS?.find(task=>task.id===id);return item&&window.l6t4Percent(item.key,item.total)>=100})};
window.l6t4Reset=resetPractice;
window.L6T4ThemeScoreV3={read,recordTask,recordExam,summary,summaryHtml,renderSummary,initOverview,syncFirebase,advanceIfNeeded,resetPractice,taskPoints,examMax,ledgerKey:LEDGER_KEY};
window.addEventListener('l6t4-score-change',renderSummary);
migrate();
})();
