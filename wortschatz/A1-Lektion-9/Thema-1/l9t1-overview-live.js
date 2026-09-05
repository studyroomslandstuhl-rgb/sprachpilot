(function(){
'use strict';
if(window.L9T1OverviewLive)return;
const D=window.L9T1,root=document.getElementById('app');
if(!D||!root)return;
let queued=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){return ['teacher','lehrer','admin','owner','superadmin'].includes(String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase())||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function idsFor(t){if(!t)return[];switch(t.kind){case'cards':return(D.cards||[]).map(x=>x.id);case'listen':return(D.listen||[]).map(x=>x.id);case'defs':return(D.defs||[]).map(x=>x.id);case'speak':return(D.speak||[]).map(x=>x.id);case'forms':return(D.forms||[]).map(x=>x.id);case'gaps':return(D.gaps||[]).map(x=>x.id);case'modals':return(D.modals||[]).map(x=>x.id);case'sequences':return(D.sequences||[]).map(x=>x.id);case'writing':return(D.writing||[]).flatMap(x=>(x.steps||[]).map(s=>s.id));case'cloze':return(D.cloze||[]).flatMap((x,i)=>(x.answers||[]).map((_,j)=>`c${i}-${j}`));case'exam':return(D.exam||[]).map(x=>x.id);default:return[]}}
function load(id){const store=preview()?sessionStorage:localStorage;const key=`SP_L9_${pid()}_T1_${id}`;try{return JSON.parse(store.getItem(key)||'{}')||{}}catch(e){return{}}}
function pct(t){const ids=idsFor(t),done=Array.isArray(load(t.id).done)?load(t.id).done:[];return ids.length?Math.round(done.filter(id=>ids.includes(id)).length/ids.length*100):0}
function taskEmoji(t){return t.icon||({cards:'📚',listen:'🎧',defs:'🧠',speak:'🎤',forms:'🔤',gaps:'✍️',modals:'🧩',sequences:'🎧',writing:'✍️',cloze:'✍️',exam:'⭐'}[t.kind]||'✅')}
function cardHtml(t,i,examOpen){const p=pct(t),locked=t.exam&&!examOpen;if(locked)return`<div class="l8-card l8-task-card locked" aria-disabled="true"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">⭐</div><p>${esc(t.description||'')}</p><div class="l8-progress"><div style="width:0%"></div></div><div class="l8-small">gesperrt</div><div class="l8-task-start">Prüfung gesperrt</div></div>`;return`<a class="l8-card l8-task-card ${p>=100?'done':''}" href="task.html?task=${encodeURIComponent(t.id)}"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(taskEmoji(t))}</div><p>${esc(t.description||'')}</p><div class="l8-progress"><div style="width:${p}%"></div></div><div class="l8-small">${p}%</div><div class="l8-task-start">${p>=100?'Fertig':'Starten'}</div></a>`}
function refresh(){
 queued=false;
 if(document.body?.dataset?.page!=='theme')return;
 const grid=root.querySelector('.l8-grid'),progressCard=root.querySelector('.l8-progress-card');
 if(!grid||!progressCard)return;
 const tasks=D.tasks||[],normal=tasks.filter(t=>!t.exam),values=normal.map(pct),avg=Math.round(values.reduce((a,b)=>a+b,0)/Math.max(1,values.length)),completed=values.filter(x=>x>=100).length,examOpen=completed===normal.length;
 const circle=progressCard.querySelector('.l8-progress-circle');if(circle)circle.textContent=`${avg}%`;
 const main=progressCard.querySelector('.l8-progress-main');
 if(main){const small=main.querySelector('.l8-small');if(small)small.textContent=`${completed} / ${normal.length} Aufgaben abgeschlossen`;const bar=main.querySelector('.l8-progress > div');if(bar)bar.style.width=`${avg}%`}
 grid.innerHTML=tasks.map((t,i)=>cardHtml(t,i,examOpen)).join('');
 const score=root.querySelector('.l8-score-total');if(score&&!preview())score.textContent=`${Number(localStorage.getItem('SP_POINTS_TOTAL')||0)||0} Punkte`;
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{refresh();setTimeout(refresh,80);setTimeout(refresh,350)})}
function ready(){if(root.querySelector('.l8-grid'))schedule();else setTimeout(ready,60)}
window.addEventListener('pageshow',schedule);
window.addEventListener('focus',schedule);
window.addEventListener('storage',schedule);
window.addEventListener('sprachpilot-progress',schedule);
window.addEventListener('SP_PROGRESS_WRITE_CONFIRMED',schedule);
window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',schedule);
window.addEventListener('SP_PROFILE_SYNCED',schedule);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule()});
ready();
window.L9T1OverviewLive={refresh,schedule};
})();