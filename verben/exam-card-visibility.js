(function(){
'use strict';
if(window.__SP_VERB_EXAM_CARD_VISIBILITY_V1)return;
window.__SP_VERB_EXAM_CARD_VISIBILITY_V1=true;

const E=window.VerbGroupsEngine;
if(!E)return;

function examPercent(groupId){
 const run=E.currentRun(groupId);
 return Math.max(0,Number(run?.exam?.bestPercent)||0);
}

function examOpen(groupId){
 try{return Boolean(E.learnDone(groupId))}catch(error){return false}
}

function createExamCard(groupId){
 const button=document.createElement('button');
 button.type='button';
 button.className='task-card verb-exam-card';
 button.dataset.action='task';
 button.dataset.group=String(groupId);
 button.dataset.task='exam';
 button.innerHTML=`
  <span class="task-number">${E.LEARN.length+1}</span>
  <span class="task-icon">★</span>
  <span class="task-title">Abschlussprüfung</span>
  <span class="task-desc">Prüfung zu allen Verben dieser Gruppe</span>
  <div class="task-mini-progress"><span></span></div>
  <span class="task-status">Gesperrt</span>`;
 return button;
}

function updateExamCard(card,groupId){
 const open=examOpen(groupId);
 const percent=examPercent(groupId);
 card.classList.add('verb-exam-card');
 card.classList.toggle('locked-task',!open);
 card.classList.toggle('done-card',percent>=100);
 card.disabled=!open;
 card.dataset.action='task';
 card.dataset.group=String(groupId);
 card.dataset.task='exam';
 card.setAttribute('aria-label',open?`Abschlussprüfung für Gruppe ${groupId} starten`:`Abschlussprüfung für Gruppe ${groupId}: zuerst alle Aufgaben abschließen`);

 const number=card.querySelector('.task-number');
 if(number)number.textContent=String(E.LEARN.length+1);
 const icon=card.querySelector('.task-icon');
 if(icon)icon.textContent=open?'★':'🔒';
 const title=card.querySelector('.task-title');
 if(title)title.textContent='Abschlussprüfung';
 let description=card.querySelector('.task-desc');
 if(!description){
  description=document.createElement('span');
  description.className='task-desc';
  card.querySelector('.task-title')?.after(description);
 }
 description.textContent=open?'Prüfung zu allen Verben dieser Gruppe':'Wird nach allen Aufgaben freigeschaltet';
 const bar=card.querySelector('.task-mini-progress span');
 if(bar)bar.style.width=`${percent}%`;
 const status=card.querySelector('.task-status');
 if(status)status.textContent=open?(percent>=100?'Bestanden':percent?`${percent}% · erneut starten`:'Prüfung starten'):'Zuerst alle Aufgaben abschließen';
}

function ensureExamCards(){
 document.querySelectorAll('.group-panel[data-group-panel]').forEach(panel=>{
  const groupId=Number(panel.dataset.groupPanel)||0;
  const grid=panel.querySelector('.task-grid');
  if(!groupId||!grid)return;
  let card=grid.querySelector(`.task-card[data-task="exam"][data-group="${groupId}"]`);
  if(!card){
   card=createExamCard(groupId);
   grid.appendChild(card);
  }else if(card!==grid.lastElementChild){
   grid.appendChild(card);
  }
  updateExamCard(card,groupId);
 });
}

const style=document.createElement('style');
style.id='sp-verb-exam-card-style';
style.textContent=`
.verb-exam-card{border:3px solid #d99b00!important;background:#fff8db!important;box-shadow:0 12px 28px rgba(138,91,0,.18)!important}
.verb-exam-card .task-icon{color:#8a5b00}.verb-exam-card .task-title{font-size:23px}.verb-exam-card .task-desc{display:block!important;min-height:42px;color:#765000;font-weight:700;line-height:1.35}
.verb-exam-card.locked-task{border-color:var(--gray-line)!important;background:var(--gray)!important;box-shadow:none!important}.verb-exam-card.locked-task .task-icon,.verb-exam-card.locked-task .task-desc{color:#6b7280}
`;
document.head.appendChild(style);

let scheduled=false;
function schedule(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
  scheduled=false;
  ensureExamCards();
 });
}

new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('pageshow',schedule);
document.addEventListener('click',event=>{
 if(event.target.closest('[data-action="group"],[data-action="task"],[data-action="answer"],[data-action="check-input"]'))setTimeout(schedule,0);
});
setTimeout(schedule,0);
setTimeout(schedule,300);
})();
