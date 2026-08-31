(function(){
'use strict';
if(window.__SP_TEACHER_RANKING_ROSTER_BACKFILL_V9)return;
window.__SP_TEACHER_RANKING_ROSTER_BACKFILL_V9=true;
function appendScript(src,marker){if(document.querySelector(`script[data-${marker}]`))return Promise.resolve();return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.async=true;script.setAttribute(`data-${marker}`,'1');script.onload=()=>resolve();script.onerror=()=>reject(new Error(`Script konnte nicht geladen werden: ${src}`));document.head.appendChild(script)})}
async function loadPointSuite(){if(window.__SP_TEACHER_POINTS_SUITE_LOADING_V9)return;window.__SP_TEACHER_POINTS_SUITE_LOADING_V9=true;try{await appendScript('/teacher/points-suite.js?v=20260831-global-progress-points-v7-target-audit','sp-points-suite-v9')}catch(error){window.__SP_TEACHER_POINTS_SUITE_LOADING_V9=false;console.warn('Punkte-Prüfwerkzeuge konnten nicht geladen werden',error)}}
async function syncRoster(){return false}
window.SPRankingRosterBackfill={sync:syncRoster,loadPointSuite,automaticWrites:false};
if(document.readyState==='complete')setTimeout(loadPointSuite,100);else window.addEventListener('load',()=>setTimeout(loadPointSuite,100),{once:true});setTimeout(loadPointSuite,250);
})();