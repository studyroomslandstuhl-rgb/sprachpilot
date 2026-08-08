(function(){
'use strict';
if(window.__SP_FI_POINTS_UI_V1)return;
window.__SP_FI_POINTS_UI_V1=true;

const LEARN=['cards','meaning-to-verb','verb-to-meaning','listen','image-to-verb','verb-to-image','verb-type','choose-form','write-form','speak-form','sentence'];
const GROUP_SIZE=20;
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch{return{}}}
function slug(){const p=profile();return[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function key(){return`SP_FI_VERB_GROUPS_PROGRESS_${slug()}`}
function read(){try{return JSON.parse(localStorage.getItem(key())||'{}')||{}}catch{return{}}}
function write(s){try{localStorage.setItem(key(),JSON.stringify(s))}catch{}}
function runPoints(run){return Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0)}
function groupPoints(gs){return Object.values(gs?.runs||{}).reduce((sum,r)=>sum+runPoints(r),0)}
function totalPoints(){return Object.values(read()).reduce((sum,gs)=>sum+(gs&&typeof gs==='object'?groupPoints(gs):0),0)}
function groupSize(id){const list=window.SP_FI_VERBS||[];return Math.max(0,Math.min(GROUP_SIZE,list.length-(id-1)*GROUP_SIZE))}
function runComplete(id,run){const total=groupSize(id);if(!total||!run)return false;const tasks=run.tasks||{};return LEARN.every(t=>(tasks[t]?.done||[]).length>=total)&&Number(run.exam?.bestPercent||0)>=100}
function current(id,state){const gs=state[id]||state[String(id)]||null;if(!gs)return null;const n=Math.max(1,Math.min(3,Number(gs.currentRun)||1));return{gs,n,run:gs.runs?.[String(n)]||null}}
function canRepeat(id,state){const c=current(id,state);return!!c&&c.n<3&&runComplete(id,c.run)}
function fullyDone(id,state){const c=current(id,state);return!!c&&c.n===3&&runComplete(id,c.run)}
function startNext(id){const state=read(),c=current(id,state);if(!c||!canRepeat(id,state))return false;const next=c.n+1;c.gs.currentRun=next;c.gs.runs=c.gs.runs||{};c.gs.runs[String(next)]={tasks:{},awards:{tasks:{},examPoints:0},exam:{bestPercent:0,stars:0,session:null}};write(state);return true}
function scoreCard(){return`<section class="card score-card compact-score fi-total-score"><h2>${totalPoints()} Punkte</h2><span>gesamt</span></section>`}
function decorate(){
 if(!location.pathname.startsWith('/finnisch/verben/'))return;
 const app=document.querySelector('#app');if(!app)return;
 const q=new URLSearchParams(location.search);if(q.get('task'))return;
 let score=app.querySelector('.fi-total-score');if(!score){app.insertAdjacentHTML('afterbegin',scoreCard());score=app.querySelector('.fi-total-score')}else score.querySelector('h2').textContent=`${totalPoints()} Punkte`;
 const state=read();
 document.querySelectorAll('.group-panel').forEach((panel,index)=>{
  const id=index+1,c=current(id,state),summary=panel.querySelector('summary'),body=panel.querySelector('.group-body');if(!summary||!body)return;
  panel.classList.toggle('fi-group-finished',fullyDone(id,state));
  let status=summary.querySelector('.fi-round-status');if(!status){status=document.createElement('span');status.className='fi-round-status';summary.appendChild(status)}
  status.textContent=c?`Runde ${c.n}/3`: 'Runde 1/3';
  body.querySelector('.fi-next-run')?.remove();body.querySelector('.fi-finished-note')?.remove();
  if(canRepeat(id,state)){
   const b=document.createElement('button');b.type='button';b.className='btn fi-next-run';b.textContent=`Runde ${c.n+1} starten`;b.onclick=e=>{e.preventDefault();e.stopPropagation();if(startNext(id))location.reload()};body.appendChild(b)
  }else if(fullyDone(id,state)){
   const note=document.createElement('div');note.className='fi-finished-note';note.innerHTML='<strong>✓ Erledigt</strong><span>Sehr gut! Du hast diese Gruppe dreimal vollständig abgeschlossen.</span>';body.prepend(note)
  }
 });
}
const style=document.createElement('style');style.textContent=`
.fi-total-score{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important}.fi-total-score h2{margin:0!important}.fi-total-score>span{font-weight:800;color:#596579}.fi-group-finished{border:3px solid #5fbf75!important;background:#f2fff5!important}.fi-group-finished>summary{color:#176b2a!important}.fi-finished-note{display:grid;gap:4px;margin:0 0 14px;padding:14px 16px;border:2px solid #7ccc8c;border-radius:16px;background:#effbf2;color:#176b2a}.fi-finished-note strong{font-size:1.05rem}.fi-next-run{margin:16px auto 0;display:block}.fi-round-status{font-weight:800}
`;document.head.appendChild(style);
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('pageshow',schedule);window.addEventListener('popstate',schedule);document.addEventListener('click',()=>setTimeout(schedule,80));schedule();
window.SPFinnishVerbPoints={totalPoints,startNext,runComplete};
})();
