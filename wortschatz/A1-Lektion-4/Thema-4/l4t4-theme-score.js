(function(){
'use strict';
if(window.__L4T4_THEME_SCORE_V1)return;
window.__L4T4_THEME_SCORE_V1=true;

const LEDGER_KEY='SP_THEME_SCORE_A1_L4_T4_V1';
const TOPIC_ID='wortschatz-a1-lektion-4-thema-4';
const RUN_KEY='SP_SCORE_RUN_'+TOPIC_ID;
const VERSION=1;
const TASK_FILES=['karteikarten.html','hoeren.html','schreibe-mit-artikel.html','artikel.html','plural.html','paare-finden.html','woerter-verstehen.html','anzeige-lesen.html','welche-anzeige-passt.html','reihenfolge.html'];
const TASK_TITLES={
 'karteikarten.html':'Karteikarten',
 'hoeren.html':'Hören',
 'schreibe-mit-artikel.html':'Schreibe mit Artikel',
 'artikel.html':'Artikel',
 'plural.html':'Plural',
 'paare-finden.html':'Paare finden',
 'woerter-verstehen.html':'Wörter verstehen',
 'anzeige-lesen.html':'Anzeige lesen',
 'welche-anzeige-passt.html':'Welche Anzeige passt?',
 'reihenfolge.html':'Reihenfolge'
};
const nativeSet=Storage.prototype.setItem;
let internal=false;
let renderTimer=0;
let syncTimer=0;
let syncing=false;

function now(){return new Date().toISOString()}
function clamp(value){return Math.max(0,Math.min(100,Math.round(Number(value)||0)))}
function isPreview(){try{return typeof window.spIsTeacherPreview==='function'&&window.spIsTeacherPreview()}catch(e){return false}}
function taskPoints(run){return run===1?5:run===2?10:run===3?15:0}
function examMax(run){return run===1?100:run===2?200:run===3?300:0}
function blankRun(){return{tasks:{},examBestPercent:0,examPoints:0,examStars:0,completed:false,startedAt:now(),updatedAt:now()}}
function blankLedger(){return{version:VERSION,themeKey:'A1-L4-T4',currentRun:1,runs:{'1':blankRun()},lifetimePoints:0,pending:{tasks:{},exams:{}},updatedAt:now()}}
function calculateLifetime(ledger){let total=0;Object.values(ledger.runs||{}).forEach(run=>{Object.values(run.tasks||{}).forEach(task=>{total+=Math.max(0,Number(task.points)||0)});total+=Math.max(0,Number(run.examPoints)||0)});return total}
function normalizeLedger(value){const ledger=value&&typeof value==='object'?value:blankLedger();ledger.version=VERSION;ledger.currentRun=Math.max(1,Math.min(3,Math.round(Number(ledger.currentRun)||1)));ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};for(let run=1;run<=ledger.currentRun;run++){const key=String(run);ledger.runs[key]={...blankRun(),...(ledger.runs[key]||{})};ledger.runs[key].tasks=ledger.runs[key].tasks&&typeof ledger.runs[key].tasks==='object'?ledger.runs[key].tasks:{}}ledger.pending=ledger.pending&&typeof ledger.pending==='object'?ledger.pending:{tasks:{},exams:{}};ledger.pending.tasks=ledger.pending.tasks&&typeof ledger.pending.tasks==='object'?ledger.pending.tasks:{};ledger.pending.exams=ledger.pending.exams&&typeof ledger.pending.exams==='object'?ledger.pending.exams:{};ledger.lifetimePoints=calculateLifetime(ledger);return ledger}
function readLedger(){try{return normalizeLedger(JSON.parse(localStorage.getItem(LEDGER_KEY)||'null'))}catch(e){return blankLedger()}}
function runData(ledger,run=ledger.currentRun){const key=String(run);if(!ledger.runs[key])ledger.runs[key]=blankRun();return ledger.runs[key]}
function summaryFromLedger(ledger){ledger=normalizeLedger(ledger);const data=runData(ledger);const taskTotal=Object.values(data.tasks||{}).reduce((sum,task)=>sum+(Number(task.points)||0),0);return{currentRun:ledger.currentRun,runTaskPoints:taskTotal,runExamPoints:Number(data.examPoints)||0,runPoints:taskTotal+(Number(data.examPoints)||0),lifetimePoints:Number(ledger.lifetimePoints)||0,examBestPercent:Number(data.examBestPercent)||0,canRepeat:ledger.currentRun<3&&Number(data.examBestPercent||0)>=100,preview:isPreview()}}
function writeLedger(ledger,{dispatch=true,schedule=true}={}){if(isPreview())return normalizeLedger(ledger);ledger=normalizeLedger(ledger);ledger.lifetimePoints=calculateLifetime(ledger);ledger.updatedAt=now();internal=true;try{nativeSet.call(localStorage,LEDGER_KEY,JSON.stringify(ledger));nativeSet.call(localStorage,RUN_KEY,String(ledger.currentRun))}finally{internal=false}if(dispatch){try{window.dispatchEvent(new CustomEvent('l4t4-score-change',{detail:summaryFromLedger(ledger)}))}catch(e){}scheduleRender()}if(schedule)scheduleSync();return ledger}
function statePercent(state){const total=Math.max(0,Number(state&&state.total)||0);const done=Array.isArray(state&&state.done)?new Set(state.done).size:Math.max(0,Number(state&&state.done)||0);return total?clamp(done/total*100):clamp(state&&state.percent)}
function applyTaskState(ledger,run,file,state){const data=runData(ledger,run);const percent=statePercent(state);const total=Math.max(0,Number(state&&state.total)||0);const done=Array.isArray(state&&state.done)?new Set(state.done).size:Math.max(0,Number(state&&state.done)||0);const old=data.tasks[file]||{percent:0,completed:false,points:0,total:0,done:0};const completed=!!old.completed||percent>=100;const next={...old,file,title:TASK_TITLES[file]||file,percent:Math.max(clamp(old.percent),percent),completed,points:completed?Math.max(Number(old.points)||0,taskPoints(run)):Number(old.points)||0,total:Math.max(Number(old.total)||0,total),done:Math.max(Number(old.done)||0,done),updatedAt:now()};const changed=Number(old.percent||0)!==next.percent||!!old.completed!==next.completed||Number(old.points||0)!==next.points||Number(old.total||0)!==next.total||Number(old.done||0)!==next.done;if(changed){data.tasks[file]=next;data.updatedAt=now();ledger.pending.tasks[run+':'+file]=true}return changed}
function recordTask(file,state){if(isPreview()||!TASK_FILES.includes(file))return readLedger();const ledger=readLedger();if(!applyTaskState(ledger,ledger.currentRun,file,state))return ledger;return writeLedger(ledger)}
function recordExam(result){if(isPreview())return readLedger();const ledger=readLedger();const run=ledger.currentRun;const data=runData(ledger,run);const percent=clamp(result&&result.percent);if(percent>=Number(data.examBestPercent||0)){data.examBestPercent=percent;data.examPoints=Math.round(examMax(run)*percent/100);data.examStars=Math.max(Number(data.examStars)||0,Number(result&&result.stars)||0)}data.completed=Number(data.examBestPercent||0)>=100;data.updatedAt=now();ledger.pending.exams[String(run)]=true;return writeLedger(ledger)}
function parseState(value){try{const state=JSON.parse(value);return state&&typeof state==='object'?state:null}catch(e){return null}}
function fileFromKey(key){return TASK_FILES.find(file=>String(key||'').includes(file))||''}
function observeStorage(key,value){if(internal||isPreview())return;const file=fileFromKey(key);if(file){const state=parseState(value);if(state)recordTask(file,state);return}if(/L4[_-]?T4|L4_T4/i.test(String(key||''))&&/EXAM/i.test(String(key||''))){const parsed=parseState(value);const list=Array.isArray(parsed)?parsed:[];if(list.length){const best=list.reduce((winner,item)=>Number(item&&item.percent||0)>Number(winner&&winner.percent||0)?item:winner,list[0]);if(best)recordExam(best)}}}
Storage.prototype.setItem=function(key,value){const result=nativeSet.call(this,key,value);if(this===localStorage&&!internal)queueMicrotask(()=>observeStorage(String(key),String(value)));return result};
function reconcile(){if(isPreview())return readLedger();const ledger=readLedger();let changed=false;for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)||'';const file=fileFromKey(key);if(file&&/L4[_-]?T4|L4_T4/i.test(key)){const state=parseState(localStorage.getItem(key));if(state&&applyTaskState(ledger,ledger.currentRun,file,state))changed=true}if(/L4[_-]?T4|L4_T4/i.test(key)&&/EXAM/i.test(key)){const list=parseState(localStorage.getItem(key));if(Array.isArray(list)&&list.length){const best=list.reduce((winner,item)=>Number(item&&item.percent||0)>Number(winner&&winner.percent||0)?item:winner,list[0]);const data=runData(ledger);const percent=clamp(best&&best.percent);if(percent>Number(data.examBestPercent||0)){data.examBestPercent=percent;data.examPoints=Math.round(examMax(ledger.currentRun)*percent/100);data.examStars=Math.max(Number(data.examStars)||0,Number(best&&best.stars)||0);data.completed=percent>=100;ledger.pending.exams[String(ledger.currentRun)]=true;changed=true}}}}return changed?writeLedger(ledger):ledger}
function summary(){return summaryFromLedger(readLedger())}
function summaryHtml(){const s=summary();if(s.preview)return'<div class="score-ledger-card"><div><b>Lehrer-Vorschau</b><div class="small">In der Vorschau werden keine Schülerpunkte vergeben.</div></div></div>';const next=s.currentRun<3?s.currentRun+1:null;return'<div class="score-ledger-card"><div><b>Punkterunde '+s.currentRun+' von 3</b><div class="small">Aufgaben: '+s.runTaskPoints+' Punkte · Prüfung: '+s.runExamPoints+' Punkte</div></div><div class="score-ledger-total">Gesamt: '+s.lifetimePoints+' Punkte</div>'+(s.canRepeat?'<div class="actions"><button class="btn green" type="button" onclick="L4T4ThemeScore.startNextRun()">Thema wiederholen – Runde '+next+' starten</button></div>':'')+'</div>'}
function addStyles(){if(document.getElementById('l4t4ScoreStyles'))return;const style=document.createElement('style');style.id='l4t4ScoreStyles';style.textContent='.score-ledger-card{margin-top:14px;padding:14px 16px;border:2px solid #ffe28a;border-radius:18px;background:#fffdf2;display:grid;gap:8px}.score-ledger-total{font-size:22px;font-weight:900;color:#9a6700}.progress-card{display:grid!important}';document.head.appendChild(style)}
function renderSummary(){addStyles();const mount=document.getElementById('themeProgress');if(mount&&!mount.querySelector('.progress-card')&&typeof window.renderThemeProgress==='function')mount.innerHTML=window.renderThemeProgress();const main=mount&&mount.querySelector('.progress-main');if(main){let target=main.querySelector('#scoreSummary');if(!target){target=document.createElement('div');target.id='scoreSummary';main.appendChild(target)}target.innerHTML=summaryHtml()}}
function scheduleRender(){clearTimeout(renderTimer);renderTimer=setTimeout(renderSummary,40)}
function clearVisibleProgress(){const remove=[];for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)||'';if(key===LEDGER_KEY||key===RUN_KEY)continue;if(/SP_L4_T4|SP_L4-T4|L4_T4/i.test(key))remove.push(key)}remove.forEach(key=>localStorage.removeItem(key));try{if(typeof window.clearDashboardProgress==='function')window.clearDashboardProgress()}catch(e){}}
function resetPractice(){if(!confirm('Möchten Sie den sichtbaren Lernfortschritt löschen? Die bereits verdienten Punkte bleiben erhalten.'))return false;clearVisibleProgress();location.href='index.html?v=l4t4-score1';return true}
function startNextRun(){const ledger=readLedger();const data=runData(ledger);if(ledger.currentRun>=3||Number(data.examBestPercent||0)<100)return false;const next=ledger.currentRun+1;if(!confirm('Runde '+next+' starten? In dieser Runde gibt es '+(next===2?'doppelte':'dreifache')+' Punkte.'))return false;ledger.currentRun=next;runData(ledger,next);clearVisibleProgress();writeLedger(ledger);location.href='index.html?v=l4t4-score1';return true}
async function ensureProgressApi(){if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')return window.SPProgress;try{await import('/js/progress.js?v=l4t4-score1')}catch(e){return null}return window.SPProgress||null}
async function syncFirebase(){if(isPreview()||syncing)return false;const ledger=readLedger();const taskKeys=Object.keys(ledger.pending.tasks||{});const examKeys=Object.keys(ledger.pending.exams||{});if(!taskKeys.length&&!examKeys.length)return true;const api=await ensureProgressApi();if(!api)return false;syncing=true;let ok=true;try{for(const key of taskKeys){const split=key.indexOf(':');const run=Math.max(1,Math.min(3,Number(key.slice(0,split))||1));const file=key.slice(split+1);const data=runData(ledger,run);const task=data.tasks[file];if(!task){delete ledger.pending.tasks[key];continue}internal=true;try{nativeSet.call(localStorage,RUN_KEY,String(run))}finally{internal=false}const result=await api.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'4',theme:'4',title:'A1 Lektion 4 · Thema 4',file,taskKey:file,taskTitle:TASK_TITLES[file]||file,total:task.total||1,done:task.done||0,percent:task.percent||0,completed:!!task.completed});if(result)delete ledger.pending.tasks[key];else ok=false}for(const key of examKeys){const run=Math.max(1,Math.min(3,Number(key)||1));const data=runData(ledger,run);if(!data.examBestPercent){delete ledger.pending.exams[key];continue}internal=true;try{nativeSet.call(localStorage,RUN_KEY,String(run))}finally{internal=false}const result=await api.recordExamResult({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'4',theme:'4',title:'A1 Lektion 4 · Thema 4',percent:data.examBestPercent,stars:data.examStars||0});if(result)delete ledger.pending.exams[key];else ok=false}}catch(e){ok=false}finally{internal=true;try{nativeSet.call(localStorage,RUN_KEY,String(ledger.currentRun));nativeSet.call(localStorage,LEDGER_KEY,JSON.stringify(normalizeLedger(ledger)))}finally{internal=false}syncing=false;scheduleRender()}return ok}
function scheduleSync(){clearTimeout(syncTimer);syncTimer=setTimeout(syncFirebase,900)}
window.L4T4ThemeScore={read:readLedger,recordTask,recordExam,reconcile,summary,summaryHtml,renderSummary,startNextRun,resetPractice,syncFirebase,taskPoints,examMax,ledgerKey:LEDGER_KEY};
reconcile();
[0,80,300,800].forEach(delay=>setTimeout(renderSummary,delay));
setTimeout(()=>{window.resetThemeProgress=resetPractice},120);
window.addEventListener('l4t4-score-change',renderSummary);
window.addEventListener('online',scheduleSync);
})();
