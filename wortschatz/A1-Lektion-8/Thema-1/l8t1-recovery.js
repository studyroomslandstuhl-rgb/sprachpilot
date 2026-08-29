(function(){
'use strict';
if(window.__SP_L8T1_RECOVERY_V1)return;window.__SP_L8T1_RECOVERY_V1=true;
function theme(){return window.L8_THEME||window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||null}
function forceLocalScore(){const S=window.L8ThemeScore;if(!S||S.__l8t1Recovery)return;const rawSummary=typeof S.summary==='function'?S.summary.bind(S):null;S.initOverview=function(t){if(Number(t)!==1)return Promise.resolve(rawSummary?rawSummary(t):{});let out={run:1,lifetime:0,taskPoints:0,examPoints:0,examBest:0,pending:0};try{out=S.summary?.(1)||out}catch(e){}return Promise.resolve(out)};S.__l8t1Recovery=true}
function needsRecovery(){if(document.body.dataset.page!=='theme')return false;const root=document.getElementById('app');if(!root)return false;if(root.querySelector('.l8-task-card'))return false;const text=String(root.textContent||'').toLowerCase();return !text.trim()||text.includes('werden geladen')||text.includes('aufgaben werden geladen')}
function recover(){if(!needsRecovery())return;const t=theme();if(t&&!window.L8_THEME)window.L8_THEME=t;forceLocalScore();if(window.L8UI?.themeOverview&&window.L8S&&window.L8_THEME){try{window.L8UI.themeOverview()}catch(e){console.error('L8T1 Recovery konnte Übersicht nicht rendern',e)}}}
[450,900,1600,3000].forEach(ms=>setTimeout(recover,ms));
window.addEventListener('l8t1-cloud-merged',()=>{if(document.body.dataset.page==='theme'&&window.L8UI?.themeOverview){try{window.L8UI.themeOverview()}catch(e){}}});
})();