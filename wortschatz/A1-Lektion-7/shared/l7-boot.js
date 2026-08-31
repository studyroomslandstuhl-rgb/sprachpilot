(function(){
'use strict';
const theme=Number(document.body.dataset.theme);
const page=document.body.dataset.page||'theme';
const root=document.getElementById('app');
const version='l7-firebase-progress-v15';
function load(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script)})}
load('/shared/sp-cache-epoch.js?v=20260831-sync-device-merge8').catch(()=>{})
 .then(()=>load('/js/progress-role-guard.js?v=20260831-central8'))
 .then(()=>Promise.resolve(window.L7_THEME_READY))
 .then(()=>load('../shared/l7-state-safety.js?v=1'))
 .then(()=>load(`../shared/l7-state.js?v=${version}`))
 .then(()=>load('../shared/l7-wrong-queue-v4.js?v=10'))
 .then(()=>{window.SPL7WrongQueueV8?.install?.();return load('../shared/l7-theme-score.js?v=20260831-firebase-progress2')})
 .then(()=>load('../shared/l7-score-repeat-fix.js?v=1'))
 .then(()=>load('../shared/l7-score-live-sync.js?v=20260831-central8'))
 .then(()=>page==='task'?window.L7ThemeScore?.seedFromCloud?.(theme):null)
 .then(()=>{if([2,3,4].includes(theme))return load('../shared/l7-exam-gate.js?v=2').then(()=>window.SPL7StrictExamGate?.install?.())})
 .then(()=>{if(theme===4)window.L7T4BunnyMedia?.install?.()})
 .then(()=>{
   if(page==='theme')return load('../shared/l7-theme-standard.js?v=l7-theme-standard12').then(()=>window.L7ThemeStandard.render(theme));
   if(window.L7S)window.L7S.header=()=>'';
   return load(`../shared/l7-ui.js?v=${version}`)
    .then(()=>theme===4?load('../Thema-4/l7t4-custom-ui.js?v=4'):null)
    .then(()=>load('../shared/l7-external-links.js?v=1'))
    .then(()=>{window.SPL7WrongQueueV8?.install?.();return window.L7.renderTaskPage(theme,new URLSearchParams(location.search).get('task'))});
 })
 .catch(error=>{console.error(error);if(root)root.innerHTML='<section class="card"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu oder aktualisiere deinen Browser.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>'});
})();