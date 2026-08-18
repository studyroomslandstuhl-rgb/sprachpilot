(function(){
'use strict';
const theme=Number(document.body.dataset.theme);
const page=document.body.dataset.page||'theme';
const root=document.getElementById('app');
const version='l7t1-wrong-at-end1';
function load(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script)})}
function installBunnyImages(){try{return window.L7T1BunnyImages?.installRenderer?.()||false}catch(e){console.warn('L7T1 Bunny renderer',e);return false}}
function resetLegacyHelpState(){
 try{
  if(!window.L7S||theme!==1)return;const pid=String(window.L7S.pid?.()||'student'),migrationKey=`SP_L7T1_HELP_FLOW_20260817_V2_${pid}`;if(localStorage.getItem(migrationKey)==='1')return;
  const taskIds=['faehigkeiten-abstufen','faehigkeit-saetze-schreiben'],stores=window.L7S.preview?.()?[localStorage,sessionStorage]:[localStorage];stores.forEach(store=>{const keys=[];for(let i=0;i<store.length;i++)keys.push(store.key(i));keys.filter(Boolean).forEach(key=>{if(!String(key).includes('_T1_')||!taskIds.some(id=>String(key).endsWith(`_T1_${id}`)))return;try{const state=JSON.parse(store.getItem(key)||'null');if(!state||typeof state!=='object')return;state.tries=0;state.hadWrong=false;store.setItem(key,JSON.stringify(state))}catch(e){}})});localStorage.setItem(migrationKey,'1');
 }catch(e){console.warn('L7T1 help migration',e)}
}
Promise.resolve(window.L7_THEME_READY)
 .then(()=>load(`../shared/l7-state.js?v=${version}`))
 .then(()=>load(`../shared/l7-theme-score.js?v=1`))
 .then(()=>{resetLegacyHelpState();installBunnyImages();return load(`../shared/l7-answer-normalization.js?v=${version}`)})
 .then(()=>{
  if(page==='theme')return load(`../shared/l7-theme-standard.js?v=l7-theme-standard4`).then(()=>load(`l7t1-l6-layout.js?v=${version}`)).then(()=>{window.L7ThemeStandard.render(theme);window.L7T1L6Layout?.run?.()});
  if(window.L7S)window.L7S.header=()=>'';
  return load(`../shared/l7-ui.js?v=${version}`).then(()=>load('../shared/l7-external-links.js?v=1')).then(()=>load(`l7t1-conjugation-ui.js?v=${version}`)).then(()=>load(`l7t1-tasks-2-4-ui.js?v=${version}`)).then(()=>load(`l7t1-grammar-ui.js?v=${version}`)).then(()=>load(`l7t1-ability-ui.js?v=${version}`)).then(()=>load(`l7t1-sms-modal-ui.js?v=${version}`)).then(()=>{window.L7T1SoundTask?.installUI?.();installBunnyImages();return load(`l7t1-l6-layout.js?v=${version}`)}).then(()=>{const result=window.L7.renderTaskPage(theme,new URLSearchParams(location.search).get('task'));window.L7T1L6Layout?.run?.();return result});
 })
 .catch(error=>{console.error(error);if(root)root.innerHTML='<section class="card"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu oder aktualisiere deinen Browser.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>'});
})();