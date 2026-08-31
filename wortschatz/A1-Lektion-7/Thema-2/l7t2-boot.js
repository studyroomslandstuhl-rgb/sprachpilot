(function(){
'use strict';
const theme=Number(document.body.dataset.theme);
const page=document.body.dataset.page||'theme';
const root=document.getElementById('app');
const version='l7t2-firebase-progress-v14';
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)})}
function currentTask(){const id=new URLSearchParams(location.search).get('task');return window.L7S?.task?.(id)||null}
function concise(){if(page!=='task')return;const task=currentTask();if(!task?.spL7T2Write)return;document.querySelectorAll('.l7-answer-box label').forEach(label=>{if(label.textContent!=='Antwort')label.textContent='Antwort'})}
function addPolish(){if(document.getElementById('sp-l7t2-standard-polish'))return;const style=document.createElement('style');style.id='sp-l7t2-standard-polish';style.textContent=`.l7-actions:has([data-action="check-order"]){display:flex!important;gap:10px!important;align-items:stretch!important}.l7-actions:has([data-action="check-order"])>button{flex:1 1 0!important;width:0!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important}.l7-actions [data-action="check-order"]{order:1!important}.l7-actions [data-action="reset-order"]{order:2!important}.l7-actions [data-action="undo"]{order:3!important}@media(max-width:520px){.l7-actions:has([data-action="check-order"]){gap:7px!important}.l7-actions:has([data-action="check-order"])>button{padding-left:7px!important;padding-right:7px!important}}`;document.head.appendChild(style)}
load('/shared/sp-cache-epoch.js?v=20260831-sync-device-merge8').catch(()=>{})
 .then(()=>load('/js/progress-role-guard.js?v=20260831-central8'))
 .then(()=>Promise.resolve(window.L7_THEME_READY))
 .then(()=>load('../shared/l7-state-safety.js?v=1'))
 .then(()=>load(`../shared/l7-state.js?v=${version}`))
 .then(()=>load('../shared/l7-wrong-queue-v4.js?v=10'))
 .then(()=>{window.SPL7WrongQueueV8?.install?.();return load('../shared/l7-theme-score.js?v=20260831-firebase-progress1')})
 .then(()=>load('../shared/l7-score-repeat-fix.js?v=1'))
 .then(()=>load('../shared/l7-score-live-sync.js?v=20260831-central8'))
 .then(()=>page==='task'?window.L7ThemeScore?.seedFromCloud?.(theme):null)
 .then(()=>load('../shared/l7-exam-gate.js?v=2'))
 .then(()=>{window.SPL7StrictExamGate?.install?.();window.L7T2CardImages?.installRenderer?.();return load('l7t2-bunny-audio.js?v=2')})
 .then(()=>{
  window.L7T2BunnyAudio?.install?.();
  if(page==='theme')return load('../shared/l7-theme-standard.js?v=l7-theme-standard12').then(()=>window.L7ThemeStandard.render(theme));
  if(window.L7S)window.L7S.header=()=>'';addPolish();const observer=new MutationObserver(()=>concise());if(root)observer.observe(root,{childList:true,subtree:true});
  return load(`../shared/l7-ui.js?v=${version}`)
   .then(()=>load('../shared/l7-external-links.js?v=1'))
   .then(()=>load('l7t2-memory-ui.js?v=4'))
   .then(()=>load('l7t2-endings-ui.js?v=3'))
   .then(()=>load('l7t2-advanced-ui.js?v=1'))
   .then(()=>load('l7t2-card-images.js?v=1'))
   .then(()=>{window.SPL7WrongQueueV8?.install?.();window.L7T2MemoryUI?.install?.();window.L7T2EndingsUI?.install?.();window.L7T2AdvancedUI?.install?.();const result=window.L7.renderTaskPage(theme,new URLSearchParams(location.search).get('task'));window.L7T2CardImages?.patchAll?.(document);return result});
 })
 .catch(error=>{console.error(error);if(root)root.innerHTML='<section class="card"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu oder aktualisiere deinen Browser.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>'});
})();