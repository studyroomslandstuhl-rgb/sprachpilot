(function(){
'use strict';
const theme=Number(document.body.dataset.theme||3);
const page=document.body.dataset.page||'theme';
const root=document.getElementById('app');
const version='l7t3-bunny-standard-v2';
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)})}
Promise.resolve(window.L7_THEME_READY)
 .then(()=>load(`../shared/l7-state.js?v=${version}`))
 .then(()=>load('../shared/l7-exam-gate.js?v=1'))
 .then(()=>{
  window.SPL7StrictExamGate?.install?.();
  window.L7T3CardImages?.installRenderer?.();
  return load(`l7t3-bunny-audio.js?v=1`)
 })
 .then(()=>{
  window.L7T3BunnyAudio?.install?.();
  if(page==='theme')return load(`../shared/l7-theme-standard.js?v=${version}`).then(()=>window.L7ThemeStandard.render(theme));
  if(window.L7S)window.L7S.header=()=>'';
  return load(`../shared/l7-ui.js?v=${version}`)
   .then(()=>load('../shared/l7-external-links.js?v=1'))
   .then(()=>{
    const result=window.L7.renderTaskPage(theme,new URLSearchParams(location.search).get('task'));
    window.L7T3CardImages?.patchAll?.(document);
    return result
   })
 })
 .catch(error=>{console.error(error);if(root)root.innerHTML='<section class="card"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>'});
})();
