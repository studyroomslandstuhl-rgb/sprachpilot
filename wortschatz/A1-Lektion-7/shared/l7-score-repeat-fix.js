(function(){
'use strict';
if(window.__SP_L7_SCORE_REPEAT_FIX_V1)return;
window.__SP_L7_SCORE_REPEAT_FIX_V1=true;
const base=window.L7ThemeScore,S=window.L7S;
if(!base||!S)return;
const originalRecordState=base.recordState.bind(base);
const originalMigrate=base.migrate.bind(base);
const originalSeedFromCloud=base.seedFromCloud.bind(base);
const originalSyncFirebase=base.syncFirebase.bind(base);
function tasks(){return Array.isArray(window.L7_THEME?.tasks)?window.L7_THEME.tasks:[]}
function practiceTasks(){return tasks().filter(task=>task&&!task.exam&&Array.isArray(task.items)&&task.items.length>0)}
function examTask(){return tasks().find(task=>task?.exam&&Array.isArray(task.items)&&task.items.length>0)||null}
function runData(ledger,run=ledger.currentRun){ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};const key=String(run);if(!ledger.runs[key])ledger.runs[key]={tasks:{},examBestPercent:0,examPoints:0,examStars:0,examAttempted:false,completed:false,startedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};ledger.runs[key].tasks=ledger.runs[key].tasks&&typeof ledger.runs[key].tasks==='object'?ledger.runs[key].tasks:{};return ledger.runs[key]}
function uniqueDone(state,total){return new Set((Array.isArray(state?.done)?state.done:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<total)).size}
function examFinished(theme){const exam=examTask();if(!exam)return true;const state=S.load(theme,exam.id,exam.items.length);return uniqueDone(state,exam.items.length)>=exam.items.length}
function practiceFinished(theme){const list=practiceTasks();return list.length>0&&list.every(task=>S.pct(theme,task.id,task.items.length)>=100)}
function canRepeat(theme,ledger=base.read(theme)){const run=Math.max(1,Number(ledger.currentRun)||1);return run<3&&practiceFinished(theme)&&examFinished(theme)}
function cleanPid(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_').replace(/^_+|_+$/g,'')}
function legacyPid(){const p=S.profile?.()||{};return cleanPid([p.email,p.kurs,p.kursnummer,p.courseCode,p.vorname,p.firstName,p.nachname,p.lastName].filter(Boolean).join('_'))}
function clearVisible(theme){
 if(S.preview?.())return 0;
 const current=String(S.pid?.()||'student'),legacy=legacyPid(),prefixes=[`SP_L7_${current}_T${theme}_`];
 if(legacy&&legacy!==current)prefixes.push(`SP_L7_${legacy}_T${theme}_`);
 if(current==='student')prefixes.push(`SP_L7_student_T${theme}_`);
 const remove=[];for(let i=0;i<localStorage.length;i++){const key=String(localStorage.key(i)||'');if(prefixes.some(prefix=>key.startsWith(prefix))||key.startsWith(`SP_L7_EXAM_SYNCED_T${theme}_`))remove.push(key)}
 remove.forEach(key=>localStorage.removeItem(key));
 try{localStorage.setItem(`SP_THEME_RESET_A1_L7_T${theme}`,String(Date.now()))}catch(e){}
 return remove.length;
}
function clearAutoAdvance(theme){const ledger=base.read(theme);if(!ledger.advanceAfterPerfect)return ledger;ledger.advanceAfterPerfect=false;return base.write(theme,ledger)}
function markExamAttempted(theme,state){const exam=examTask();if(!exam||!state||uniqueDone(state,exam.items.length)<exam.items.length)return;const ledger=base.read(theme),data=runData(ledger);if(data.examAttempted===true&&!ledger.advanceAfterPerfect)return;data.examAttempted=true;data.updatedAt=new Date().toISOString();ledger.advanceAfterPerfect=false;base.write(theme,ledger)}
base.recordState=function(theme,id,state){const result=originalRecordState(theme,id,state);const task=tasks().find(item=>String(item?.id)===String(id));if(task?.exam)markExamAttempted(Number(theme),state);else clearAutoAdvance(Number(theme));return result};
function reconcileVisible(theme){
 theme=Number(theme);let ledger=base.read(theme),data=runData(ledger);let changed=false;
 for(const task of practiceTasks()){
  const state=S.load(theme,task.id,task.items.length),percent=S.pct(theme,task.id,task.items.length),old=data.tasks?.[task.id]||{};
  if(percent>Number(old.percent||0)||(percent>=100&&!old.completed)){base.recordState(theme,task.id,state);changed=true;ledger=base.read(theme);data=runData(ledger)}
 }
 const exam=examTask();if(exam){const state=S.load(theme,exam.id,exam.items.length);if(uniqueDone(state,exam.items.length)>=exam.items.length){const oldAttempted=data.examAttempted===true;const oldBest=Number(data.examBestPercent||0);base.recordState(theme,exam.id,state);ledger=base.read(theme);data=runData(ledger);if(!oldAttempted||Number(data.examBestPercent||0)>oldBest)changed=true}}
 clearAutoAdvance(theme);return changed;
}
function repeatButton(theme){const ledger=base.read(theme),run=Math.max(1,Number(ledger.currentRun)||1);if(canRepeat(theme,ledger))return `<button type="button" class="sp-l7-repeat-btn" onclick="window.L7ThemeScore.startRepeat(${Number(theme)})">Wiederholung ${run+1} starten</button>`;if(run>=3&&practiceFinished(theme)&&examFinished(theme))return '<div class="small sp-l7-repeat-done">Alle 3 Punkteläufe abgeschlossen.</div>';return''}
function summaryHtml(theme){const summary=base.summary(theme);if(summary.preview)return'<div class="sp-l7-score-card"><div class="sp-l7-score-label">Lehrer-Vorschau</div><div class="sp-l7-score-total">Keine Punkte</div><div class="small">Teilnehmerpunkte werden nicht gespeichert.</div></div>';return `<div class="sp-l7-score-card"><div class="sp-l7-score-label">${summary.label}</div><div class="sp-l7-score-total">${summary.lifetimePoints} Punkte</div><div class="small">Aufgaben: ${summary.runTaskPoints} · Prüfung: ${summary.runExamPoints}${summary.examBestPercent?` · Prüfung ${summary.examBestPercent}%`:''}</div>${summary.pending?'<div class="small sp-l7-score-sync">Synchronisierung läuft …</div>':''}${repeatButton(theme)}</div>`}
function renderSummary(theme){const target=document.getElementById('scoreSummary');if(target)target.innerHTML=summaryHtml(theme)}
async function initOverview(theme){
 theme=Number(theme);try{originalMigrate(theme)}catch(error){console.warn('L7 Altstand konnte nicht geprüft werden',error)}
 try{await originalSeedFromCloud(theme)}catch(error){console.warn('L7 Cloud-Punkte konnten nicht geladen werden',error)}
 reconcileVisible(theme);clearAutoAdvance(theme);renderSummary(theme);
 [120,1600,5200,15000].forEach(delay=>setTimeout(()=>originalSyncFirebase(theme),delay));
 return base.summary(theme);
}
function startRepeat(theme,skipConfirm=false){
 theme=Number(theme);if(S.preview?.()){alert('In der Lehrer-Vorschau wird keine Teilnehmer-Wiederholung gestartet.');return false}
 const ledger=base.read(theme),run=Math.max(1,Number(ledger.currentRun)||1);
 if(run>=3){alert('Für dieses Thema sind bereits alle 3 Punkteläufe erreicht.');return false}
 if(!canRepeat(theme,ledger)){alert('Eine neue Wiederholung ist möglich, wenn alle Aufgaben und die Prüfung dieses Durchgangs abgeschlossen sind.');return false}
 if(!skipConfirm&&!confirm(`Lektion 7 · Thema ${theme} als Wiederholung ${run+1} starten? Die bisher verdienten Punkte bleiben erhalten.`))return false;
 ledger.currentRun=run+1;runData(ledger,ledger.currentRun);ledger.advanceAfterPerfect=false;base.write(theme,ledger);clearVisible(theme);location.href='index.html?repeat='+Date.now();return true;
}
function resetPractice(theme){
 theme=Number(theme);if(S.preview?.()){alert('In der Lehrer-Vorschau wird kein Teilnehmerfortschritt gespeichert.');return false}
 const ledger=base.read(theme),run=Math.max(1,Number(ledger.currentRun)||1);
 if(canRepeat(theme,ledger))return startRepeat(theme,false);
 const suffix=run>=3?' Es gibt danach keine weiteren Wiederholungspunkte.':'';
 if(!confirm(`Fortschritte in Lektion 7 · Thema ${theme} löschen? Bereits verdiente Punkte bleiben erhalten.${suffix}`))return false;
 clearVisible(theme);location.href='index.html?reset='+Date.now();return true;
}
base.advanceIfNeeded=function(){return false};
base.summaryHtml=summaryHtml;base.renderSummary=renderSummary;base.initOverview=initOverview;base.startRepeat=startRepeat;base.resetPractice=resetPractice;base.canRepeat=canRepeat;base.reconcileVisible=reconcileVisible;base.clearVisible=clearVisible;
window.addEventListener('l7-theme-score-change',event=>{const theme=Number(event.detail?.theme||document.body.dataset.theme||0);if(theme)setTimeout(()=>renderSummary(theme),0)});
})();