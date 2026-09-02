(function(){
'use strict';
if(window.__SP_L8T3_PROGRESS_NAV_20260902_V1)return;window.__SP_L8T3_PROGRESS_NAV_20260902_V1=true;
const LAST='SP_L8_T3_LAST_TASK';
function oldClean(v){return String(v||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')}
function readProfile(){for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE']){try{const raw=localStorage.getItem(key);if(raw)return JSON.parse(raw)||{}}catch(e){}}return{}}
function oldPid(){const p=readProfile();return oldClean(p.authUid||p.canonicalStudentId||p.docId||p.studentId||p.uid||p.userId||p.id||p.email||[p.kurs||p.kursnummer||p.courseCode,p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_'))||'student'}
function migrateTask(task){
 if(!window.L8S?.key||!task?.id)return;
 const newKey=window.L8S.key(3,task.id);if(localStorage.getItem(newKey))return;
 const oldKey=`SP_L8_${oldPid()}_T3_${task.id}`,raw=localStorage.getItem(oldKey);if(!raw)return;
 try{const state=JSON.parse(raw)||{};state.schema=2;state.total=Array.isArray(task.items)?task.items.length:Number(state.total)||0;localStorage.setItem(newKey,JSON.stringify(state))}catch(e){}
}
function migrateTheme(theme){if(!theme||window.L8S?.preview?.())return;for(const task of theme.tasks||[])migrateTask(task)}
function rememberCurrent(){if(document.body.dataset.page!=='task')return;const id=new URLSearchParams(location.search).get('task');if(!id)return;try{sessionStorage.setItem(LAST,id);localStorage.setItem(LAST,id)}catch(e){}}
function lastTask(){try{return sessionStorage.getItem(LAST)||localStorage.getItem(LAST)||''}catch(e){return''}}
function refreshOverview(){
 if(document.body.dataset.page!=='theme'||!window.L8_THEME||!window.L8S)return false;
 const tasks=window.L8_THEME.tasks||[],cards=[...document.querySelectorAll('.l8-task-card')];if(!cards.length)return false;
 const normal=tasks.filter(t=>!t.exam);let sum=0,completed=0;
 tasks.forEach((task,i)=>{const pct=window.L8S.pct(3,task.id,task.items?.length||0);if(!task.exam){sum+=pct;if(pct>=100)completed++}const card=cards[i];if(!card)return;const bar=card.querySelector('.l8-progress > div');if(bar)bar.style.width=`${pct}%`;const small=card.querySelector('.l8-small');if(small&&!card.classList.contains('locked'))small.textContent=`${pct}%`;card.classList.toggle('done',pct>=100)});
 const avg=Math.round(sum/Math.max(1,normal.length)),circle=document.querySelector('.l8-progress-circle'),overall=document.querySelector('.l8-progress-card .l8-progress > div'),count=document.querySelector('.l8-progress-main > .l8-small');if(circle)circle.textContent=`${avg}%`;if(overall)overall.style.width=`${avg}%`;if(count)count.textContent=`${completed} / ${normal.length} Aufgaben abgeschlossen`;return true
}
let scrolled=false;
function scrollLast(){
 if(document.body.dataset.page!=='theme'||scrolled)return false;const id=lastTask();if(!id)return false;
 const link=[...document.querySelectorAll('a.l8-task-card')].find(a=>{try{return new URL(a.href,location.href).searchParams.get('task')===id}catch(e){return false}});if(!link)return false;scrolled=true;link.style.scrollMarginTop='18px';requestAnimationFrame(()=>requestAnimationFrame(()=>link.scrollIntoView({behavior:'auto',block:'center'})));return true
}
rememberCurrent();
const previous=window.L8_CONTENT_READY;window.L8_T3_PROGRESS_NAV_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=all[3]||all['3']||(Array.isArray(all)?all.find(t=>Number(t?.number)===3):null);migrateTheme(theme);return themes}).catch(()=>window.L8_ALL_THEMES||{});window.L8_CONTENT_READY=window.L8_T3_PROGRESS_NAV_READY;
if(document.body.dataset.page==='theme'){
 const root=document.getElementById('app');if(root)new MutationObserver(()=>{refreshOverview();scrollLast()}).observe(root,{childList:true,subtree:true});
 window.addEventListener('pageshow',e=>{if(e.persisted&&window.L8UI?.themeOverview){try{window.L8UI.themeOverview()}catch(x){}}setTimeout(()=>{refreshOverview();scrollLast()},120)});
 window.addEventListener('focus',()=>setTimeout(refreshOverview,60));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(refreshOverview,60)});
 [100,250,500,900,1600,2600].forEach(ms=>setTimeout(()=>{refreshOverview();scrollLast()},ms));
}
window.L8T3ProgressNavigation20260902={migrateTheme,refreshOverview,scrollLast};
})();
