(function(){
'use strict';
const TARGET='dialoge.html?v=20260819-a13-progress1';
const FILE='task-dialog-abc';
const CURRENT_KEY='SP_L6_T4_V2_'+FILE;
const LEGACY_KEYS=[
 'SP_L6_T4_V2_dialoge.html',
 'SP_L6_T4_V2_dialoge.html?v=l6t4-dialoge4',
 'SP_L6_T4_V2_dialoge.html?v=202607301410',
 'SP_L6_T4_V2_task.html?task=dialog-abc',
 'SP_L6_T4_V2_task.html?task=dialog-abc&number=13'
];
let running=false,repairedOnce=false;
function readState(key){try{const value=JSON.parse(localStorage.getItem(key)||'null');if(!value||typeof value!=='object')return null;const total=Math.max(0,Number(value.total)||0),done=Array.isArray(value.done)?[...new Set(value.done.map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<total))]:[];if(!total)return null;return{...value,total,done}}catch(e){return null}}
function percent(state){if(!state?.total)return 0;return Math.max(0,Math.min(100,Math.round((state.done?.length||0)/state.total*100)))}
function normalizeFive(state){
 if(!state)return null;const sourceTotal=Math.max(0,Number(state.total)||0),pct=percent(state);let done=[];
 if(sourceTotal===5)done=[...new Set((state.done||[]).map(Number).filter(i=>i>=0&&i<5))];else done=[...Array(pct>=100?5:Math.max(0,Math.min(5,Math.floor(pct*5/100)))).keys()];
 let current=sourceTotal===5&&Number.isInteger(Number(state.current))&&!done.includes(Number(state.current))&&Number(state.current)>=0&&Number(state.current)<5?Number(state.current):null;
 let queue=[];if(sourceTotal===5)queue=[...new Set((Array.isArray(state.queue)?state.queue:[]).map(Number).filter(i=>i>=0&&i<5&&!done.includes(i)&&i!==current))];
 // Fehlende, noch nicht erledigte Dialoge immer wieder in die Warteschlange aufnehmen.
 for(let i=0;i<5;i++)if(!done.includes(i)&&i!==current&&!queue.includes(i))queue.push(i);
 if(current==null&&queue.length){current=queue.shift()}
 return{...state,total:5,done,queue,current,tries:Number(state.tries)||0,hadWrong:!!state.hadWrong,completed:done.length===5,percent:done.length*20};
}
function legacyBest(){let best=null,bestPct=-1;for(const key of LEGACY_KEYS){const s=readState(key),p=percent(s);if(s&&p>bestPct){best=s;bestPct=p}}return normalizeFive(best)}
function repairLocalState(){
 // Der aktive kanonische Zustand ist maßgeblich. Ein alter 100%-Alias darf einen echten 20/40/60/80%-Stand nicht mehr überschreiben.
 const current=normalizeFive(readState(CURRENT_KEY));if(current){localStorage.setItem(CURRENT_KEY,JSON.stringify(current));return current}
 const legacy=legacyBest();if(legacy){localStorage.setItem(CURRENT_KEY,JSON.stringify(legacy));return legacy}return null;
}
function repairScoreAndCloud(state){if(!state)return;try{if(window.L6T4ThemeScoreV3?.recordTask){window.L6T4ThemeScoreV3.recordTask(FILE,state);return}}catch(e){}const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:'wortschatz-a1-lektion-6-thema-4',title:'A1 Lektion 6 · Thema 4',file:FILE,taskKey:FILE,taskTitle:'Dialoge',percent:percent(state),done:state.done.length,total:5,completed:state.done.length===5};const api=window.SPProgress?.recordTaskProgress;if(api){Promise.resolve(api(payload)).catch(()=>{});return}window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload})}
function repair(){if(repairedOnce)return;repairedOnce=true;const state=repairLocalState();if(state)repairScoreAndCloud(state)}
function fix(){if(running)return;running=true;try{repair();document.querySelectorAll('#taskGrid a').forEach(link=>{const text=(link.textContent||'').toLowerCase(),href=link.getAttribute('href')||'';if(text.includes('13.')||href.includes('dialoge.html')||href.includes('dialog-abc')){if(href!==TARGET)link.setAttribute('href',TARGET)}})}finally{running=false}}
fix();const grid=document.getElementById('taskGrid');if(grid)new MutationObserver(fix).observe(grid,{childList:true,subtree:true});
})();
