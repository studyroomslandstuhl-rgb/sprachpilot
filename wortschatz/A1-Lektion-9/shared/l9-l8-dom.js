(function(){
'use strict';
let scheduled=false;
function q(sel,root=document){return [...root.querySelectorAll(sel)]}
function runNo(){try{return Number(window.SPProgress?.currentRun?.('wortschatz-a1-lektion-9-thema-1')||localStorage.getItem('SP_SCORE_RUN_wortschatz-a1-lektion-9-thema-1')||1)||1}catch(e){return 1}}
function preview(){const roles=['teacher','lehrer','admin','owner','superadmin'];const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return roles.includes(role)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function add(el,...cls){if(el)el.classList.add(...cls)}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function convertProgress(el){if(!el)return;add(el,'l8-progress');const span=el.querySelector(':scope>span');if(span&&!el.querySelector(':scope>div')){const div=document.createElement('div');div.style.cssText=span.style.cssText;span.replaceWith(div)}}
function currentPct(card){const txt=card?.querySelector('.task-bottom span,.l8-small')?.textContent||'';const n=Number(String(txt).match(/\d+/)?.[0]||0);return Number.isFinite(n)?n:0}
function scorePanel(){
 if(preview())return '<div class="l8-score-panel"><div class="l8-score-label">Punkte</div><div class="l8-score-total">Vorschau</div><div class="l8-small">Keine Teilnehmerpunkte</div></div>';
 const run=runNo(),total=Number(localStorage.getItem('SP_POINTS_TOTAL')||0)||0;
 return `<div class="l8-score-panel"><div class="l8-score-label">${run===1?'Versuch 1 von 3':`Wiederholung ${run} von 3`}</div><div class="l8-score-total">${total} Punkte</div><div class="l8-small">Fortschritt wird gespeichert.</div></div>`
}
function taskEmoji(task){return String(task?.icon||task?.emoji||'✅')}
function rebuildTaskGrid(root){
 const oldGrid=root.querySelector('.task-grid');if(!oldGrid||oldGrid.dataset.l8Exact==='1')return;
 const data=window.L9T1,tasks=data?.tasks||[];if(!tasks.length)return;
 const oldCards=q('.task-card',oldGrid);
 const grid=document.createElement('section');grid.className='l8-grid task-grid';grid.dataset.l8Exact='1';
 tasks.forEach((task,index)=>{
  const old=oldCards[index],pct=currentPct(old),locked=old?.classList.contains('locked')||false,done=pct>=100;
  const node=document.createElement(locked?'div':'a');
  node.className=`l8-card l8-task-card ${done?'done':''} ${locked?'locked':''}`.trim();
  if(locked)node.setAttribute('aria-disabled','true');else node.href=old?.getAttribute('href')||`task.html?task=${encodeURIComponent(task.id)}`;
  node.innerHTML=`<div class="l8-task-number">${index+1}. ${esc(task.title||'')}</div><div class="emoji">${locked?'⭐':esc(taskEmoji(task))}</div><p>${esc(task.description||task.instruction||'')}</p><div class="l8-progress"><div style="width:${locked?0:pct}%"></div></div><div class="l8-small">${locked?'gesperrt':pct+'%'}</div><div class="l8-task-start">${locked?'Prüfung gesperrt':done?'Fertig':'Starten'}</div>`;
  grid.appendChild(node)
 });
 const parent=oldGrid.parentElement;
 if(parent?.classList.contains('card'))parent.replaceWith(grid);else oldGrid.replaceWith(grid)
}
function patchOverview(root){
 const page=root.querySelector('.l9-page');if(page){page.className='l8-wrap';}
 const hero=root.querySelector('.hero');
 if(hero&&hero.dataset.l8Exact!=='1'){
  const data=window.L9T1||{},theme=window.L9_THEMES?.[1]||window.L9_THEMES?.['1']||{};
  const oldCards=q('.task-card',root),normal=(data.tasks||[]).filter(t=>!t.exam),completed=oldCards.slice(0,normal.length).filter(c=>currentPct(c)>=100).length;
  const pcts=oldCards.slice(0,normal.length).map(currentPct),avg=normal.length?Math.round(pcts.reduce((a,b)=>a+b,0)/normal.length):0;
  const chips=(theme.chips||['müssen','man','Anweisungen']).slice(0,4);
  hero.dataset.l8Exact='1';hero.className='l8-card l8-progress-card';
  hero.innerHTML=`<div class="l8-progress-circle">${avg}%</div><div class="l8-progress-main"><h2>Dein Fortschritt</h2><p class="l8-small">${completed} / ${normal.length} Aufgaben abgeschlossen</p><div class="l8-progress"><div style="width:${avg}%"></div></div><p class="l8-small l8-theme-subtitle">${esc(data.title||'Was muss man machen?')}</p><div class="l8-tags">${chips.map(x=>`<span class="l8-tag">${esc(x)}</span>`).join('')}</div></div><div class="l8-score-slot">${scorePanel()}</div>`;
 }
 rebuildTaskGrid(root)
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
function patchGeneric(root){q('.l9-wrap',root).forEach(x=>add(x,'l8-wrap'));q('.l9-card',root).forEach(x=>add(x,'l8-card'))}
function patch(){scheduled=false;const app=document.getElementById('app');if(!app)return;q('.l9-top,.l9-head',app).forEach(x=>x.remove());patchGeneric(app);if(document.body.dataset.page==='theme'&&String(document.body.dataset.theme||'')==='1')patchOverview(app);else if(document.body.dataset.page==='task')patchTaskPage(app)}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(patch)}
function start(){const app=document.getElementById('app');if(!app)return;new MutationObserver(schedule).observe(app,{childList:true,subtree:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
