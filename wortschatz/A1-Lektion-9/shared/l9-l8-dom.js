(function(){
'use strict';
let scheduled=false;
function q(sel,root=document){return [...root.querySelectorAll(sel)]}
function runNo(){try{return Number(window.SPProgress?.currentRun?.('wortschatz-a1-lektion-9-thema-1')||localStorage.getItem('SP_SCORE_RUN_wortschatz-a1-lektion-9-thema-1')||1)||1}catch(e){return 1}}
function preview(){const roles=['teacher','lehrer','admin','owner','superadmin'];const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return roles.includes(role)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function add(el,...cls){if(el)el.classList.add(...cls)}
function convertProgress(el){if(!el)return;add(el,'l8-progress');const span=el.querySelector(':scope>span');if(span&&!el.querySelector(':scope>div')){const div=document.createElement('div');div.style.cssText=span.style.cssText;span.replaceWith(div)}}
function patchTaskCards(root){
 q('.task-grid',root).forEach(grid=>add(grid,'l8-grid'));
 q('.task-card',root).forEach(card=>{
  add(card,'l8-card','l8-task-card');
  const num=card.querySelector('.task-num'),title=card.querySelector('h3');
  if(num&&title&&!num.dataset.l8Merged){num.dataset.l8Merged='1';num.textContent=`${String(num.textContent||'').trim()}. ${String(title.textContent||'').trim()}`;add(num,'l8-task-number');title.dataset.l8Hidden='1'}
  add(card.querySelector('.task-icon'),'emoji');
  convertProgress(card.querySelector('.progress'));
  const bottom=card.querySelector('.task-bottom');
  if(bottom){add(bottom,'l8-bottom-adapter');const small=bottom.querySelector('span'),start=bottom.querySelector('strong');add(small,'l8-small');add(start,'l8-task-start')}
 });
}
function patchOverview(root){
 const page=root.querySelector('.l9-page');if(page)add(page,'l8-wrap');
 const hero=root.querySelector('.hero');
 if(hero){
  add(hero,'l8-card','l8-progress-card');
  const circle=hero.querySelector('.circle');add(circle,'l8-progress-circle');
  const main=hero.children[1];add(main,'l8-progress-main');
  const h2=main?.querySelector('h2');
  if(h2&&!h2.dataset.l8Title){h2.dataset.l8Title='1';const old=h2.textContent;h2.textContent='Dein Fortschritt';const goal=main.querySelector('p:not(.muted)');if(goal){goal.classList.add('l8-small','l8-theme-subtitle');goal.textContent=`${old} · ${goal.textContent}`}}
  convertProgress(main?.querySelector('.progress'));
  const muted=main?.querySelector('.muted');add(muted,'l8-small');
  if(!hero.querySelector('.l8-score-slot')){
   const slot=document.createElement('div');slot.className='l8-score-slot';
   if(preview())slot.innerHTML='<div class="l8-score-panel"><div class="l8-score-label">Punkte</div><div class="l8-score-total">Vorschau</div><div class="l8-small">Keine Teilnehmerpunkte</div></div>';
   else{const run=runNo(),total=Number(localStorage.getItem('SP_POINTS_TOTAL')||0)||0;slot.innerHTML=`<div class="l8-score-panel"><div class="l8-score-label">${run===1?'Versuch 1 von 3':`Wiederholung ${run} von 3`}</div><div class="l8-score-total">${total} Punkte</div><div class="l8-small">Fortschritt wird automatisch gespeichert.</div></div>`}
   hero.appendChild(slot)
  }
 }
 const grid=root.querySelector('.task-grid');
 if(grid){patchTaskCards(root);const parent=grid.parentElement;if(parent?.classList.contains('card')&&!parent.dataset.l8Unwrapped){parent.dataset.l8Unwrapped='1';parent.replaceWith(grid)}}
}
function taskMeta(){const d=window.L9T1,id=new URLSearchParams(location.search).get('task');if(!d||!id)return null;const task=(d.tasks||[]).find(x=>String(x.id)===String(id));if(!task)return null;return{task,index:(d.tasks||[]).indexOf(task)+1}}
function patchTaskPage(root){
 const page=root.querySelector('.l9-page');if(page)add(page,'l8-wrap');
 const meta=taskMeta();if(!meta)return;
 q('.card',root).forEach(c=>add(c,'l8-card'));
 const finish=root.querySelector('.finish,.exam-lock');if(finish){add(finish,'l8-finish');return}
 let exercise=q('.card',root).find(c=>c.querySelector('#taskArea'));
 if(!exercise)return;
 add(exercise,'l8-exercise');
 if(!root.querySelector('.l9-l8-taskhead')){
  const row=exercise.querySelector('.progress-row'),bar=exercise.querySelector('.progress');
  const stateText=row?.querySelector('span')?.textContent||'';const pct=row?.querySelector('strong')?.textContent||'';
  const head=document.createElement('section');head.className='l8-card l8-task-head l9-l8-taskhead';
  head.innerHTML=`<div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${meta.index}</span><h1></h1><p></p></div><div class="l8-progress-row"><span></span><strong></strong></div><div class="l8-progress"><div></div></div>`;
  head.querySelector('h1').textContent=meta.task.title||'';
  head.querySelector('p').textContent=`${meta.task.icon||'✅'} ${meta.task.description||''}`;
  head.querySelector('.l8-progress-row span').textContent=stateText;
  head.querySelector('.l8-progress-row strong').textContent=pct;
  head.querySelector('.l8-progress>div').style.width=pct;
  exercise.before(head)
 }
 const row=exercise.querySelector('.progress-row'),bar=exercise.querySelector('.progress');if(row)add(row,'l9-current-progress-hidden');if(bar)add(bar,'l9-current-progress-hidden');
 const instruction=exercise.querySelector('.instruction');if(instruction)add(instruction,'l8-note');
}
function patchGeneric(root){
 q('.l9-wrap',root).forEach(x=>add(x,'l8-wrap'));
 q('.l9-card',root).forEach(x=>add(x,'l8-card'));
}
function patch(){scheduled=false;const app=document.getElementById('app');if(!app)return;q('.l9-top,.l9-head',app).forEach(x=>x.remove());patchGeneric(app);if(document.body.dataset.page==='theme'&&String(document.body.dataset.theme||'')==='1')patchOverview(app);else if(document.body.dataset.page==='task')patchTaskPage(app)}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(patch)}
function start(){const app=document.getElementById('app');if(!app)return;new MutationObserver(schedule).observe(app,{childList:true,subtree:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
