(function(){
'use strict';
const theme=Number(document.body.dataset.theme||3),page=document.body.dataset.page||'theme',root=document.getElementById('app'),version='l7t3-device-merge-v17';
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)})}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function prepareAccountProgress(){
 try{
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
  if(['teacher','lehrer','admin','owner','superadmin'].includes(role))return null;
  const mod=await import('/js/account-progress-sync.js?v=20260831-central8');
  const work=Promise.resolve(mod.startAccountProgressSync?.({reason:'l7t3-before-render',authWaitMs:6000,identityWaitMs:5000}));
  // Bei einem echten kurzfristigen Netzproblem darf die Lektion trotzdem benutzbar bleiben.
  return await Promise.race([work,sleep(7000).then(()=>({active:false,pending:true,reason:'L7T3_SYNC_WAIT_TIMEOUT'}))]);
 }catch(error){console.warn('L7T3 Kontofortschritt konnte vor dem Rendern noch nicht abgeschlossen werden',error);return null}
}
function addOrderPolish(){if(page!=='task')return;const taskId=String(new URLSearchParams(location.search).get('task')||'');if(taskId!=='t3-partizip-bauen-v2'||document.getElementById('sp-l7t3-order-polish'))return;const style=document.createElement('style');style.id='sp-l7t3-order-polish';style.textContent=`.l7-actions:has([data-action="check-order"]){display:flex!important;gap:10px!important;align-items:stretch!important}.l7-actions:has([data-action="check-order"])>button{flex:1 1 0!important;width:0!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important}.l7-actions [data-action="check-order"]{order:1!important}.l7-actions [data-action="reset-order"]{order:2!important}.l7-actions [data-action="undo"]{order:3!important}@media(max-width:520px){.l7-actions:has([data-action="check-order"]){gap:7px!important}.l7-actions:has([data-action="check-order"])>button{padding-left:7px!important;padding-right:7px!important}}`;document.head.appendChild(style)}
load('/shared/sp-cache-epoch.js?v=20260831-sync-device-merge8').catch(()=>{})
 .then(()=>load('/js/progress-role-guard.js?v=20260831-central8'))
 .then(()=>prepareAccountProgress())
 .then(()=>Promise.resolve(window.L7_THEME_READY))
 .then(()=>load('../shared/l7-state-safety.js?v=1'))
 .then(()=>load(`../shared/l7-state.js?v=${version}`))
 .then(()=>load('../shared/l7-wrong-queue-v4.js?v=10'))
 .then(()=>{window.SPL7WrongQueueV8?.install?.();return load('../shared/l7-theme-score.js?v=20260831-central8')})
 .then(()=>load('../shared/l7-score-repeat-fix.js?v=1'))
 .then(()=>load('../shared/l7-score-live-sync.js?v=20260831-central8'))
 .then(()=>load('../shared/l7-exam-gate.js?v=2'))
 .then(()=>{window.SPL7StrictExamGate?.install?.();window.L7T3CardImages?.installRenderer?.();return load('l7t3-bunny-audio.js?v=3')})
 .then(()=>{
  window.L7T3BunnyAudio?.install?.();if(page==='theme')return load('../shared/l7-theme-standard.js?v=l7-theme-standard14').then(()=>window.L7ThemeStandard.render(theme));if(window.L7S)window.L7S.header=()=>'';addOrderPolish();
  return load(`../shared/l7-ui.js?v=${version}`)
   .then(()=>load('../shared/l7-external-links.js?v=1'))
   .then(()=>load('../Thema-2/l7t2-memory-ui.js?v=4'))
   .then(()=>load('../Thema-2/l7t2-endings-ui.js?v=3'))
   .then(()=>load('../Thema-2/l7t2-advanced-ui.js?v=1'))
   .then(()=>load('../shared/l7-listen-participle-bunny-fix.js?v=1'))
   .then(()=>load('l7t3-special-ui.js?v=2'))
   .then(()=>{window.L7T3SpecialUI?.install?.();return load('l7t3-no-repeat-special.js?v=2')})
   .then(()=>{window.L7T3RetrySpecial?.install?.();return load('l7t3-sein-answer-fix.js?v=1')})
   .then(()=>{window.L7T3SeinAnswerFix?.install?.();return load('l7t3-error-selection-fix.js?v=2')})
   .then(()=>{window.L7T3ErrorSelectionFix?.install?.();return load('l7t3-help-standard.js?v=3')})
   .then(()=>load('../shared/l7-reading-queue-fix.js?v=2'))
   .then(()=>load('l7t3-schon-einmal-ui.js?v=4'))
   .then(()=>{window.SPL7WrongQueueV8?.install?.();window.L7T2MemoryUI?.install?.();window.L7T2EndingsUI?.install?.();window.L7T2AdvancedUI?.install?.();window.L7T3SpecialUI?.install?.();window.L7T3RetrySpecial?.install?.();window.L7T3SeinAnswerFix?.install?.();window.L7T3ErrorSelectionFix?.install?.();window.L7T3HelpStandard?.install?.();window.L7ReadingQueueFix?.install?.();window.L7T3SchonEinmalUI?.install?.();const result=window.L7.renderTaskPage(theme,new URLSearchParams(location.search).get('task'));window.L7T3CardImages?.patchAll?.(document);return result});
 })
 .catch(error=>{console.error(error);if(root)root.innerHTML='<section class="card"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>'});
})();