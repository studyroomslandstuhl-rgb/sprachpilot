(function(){
'use strict';
const TASK_ID='behoerden-dialog',TOTAL=16,TOPIC='wortschatz-a1-lektion-9-thema-1';
const ids=[...Array(TOTAL)].map((_,i)=>`d${i+1}`);
let patchTimer=null,patchAttempts=0,started=false;
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
const key=()=>`SP_L9_${pid()}_T1_${TASK_ID}`;
function read(){try{return JSON.parse(localStorage.getItem(key())||'{}')||{}}catch(e){return{}}}
function percent(){const s=read(),done=[...new Set((s.done||[]).filter(x=>ids.includes(x)))].length;return Math.round(done/TOTAL*100)}
function completed(){return percent()>=100}
async function hydrate(){
 try{
  const api=window.SPProgress;
  if(!api?.loadCurrentStudentProgress)return false;
  const all=await Promise.race([
   api.loadCurrentStudentProgress(),
   new Promise(resolve=>setTimeout(()=>resolve(null),2500))
  ]);
  const topic=all?.wortschatz?.[TOPIC],cloud=topic?.tasks?.['dialog.html']||topic?.tasks?.[TASK_ID];
  if(!cloud)return false;
  const n=Math.min(TOTAL,Math.max(Number(cloud.done)||0,Math.round(TOTAL*Number(cloud.percent||0)/100)));
  const s=read();s.done=[...new Set([...(s.done||[]),...ids.slice(0,n)])];s.wrong=s.wrong||{};s.answers=s.answers||{};
  localStorage.setItem(key(),JSON.stringify(s));return true;
 }catch(e){console.warn('L9T1 Dialog restore',e);return false}
}
function taskProgress(card){const text=card?.querySelector('.task-bottom span')?.textContent||'';const m=text.match(/(\d+)%/);return Number(m?.[1]||0)}
function setText(el,value){if(el&&el.textContent!==String(value))el.textContent=String(value)}
function setHref(el,value){if(el&&el.getAttribute('href')!==value)el.setAttribute('href',value)}
function patchOverview(){
 if(document.body.dataset.page!=='theme')return false;
 const grid=document.querySelector('.task-grid');if(!grid)return false;
 const exam=[...grid.querySelectorAll('.task-card')].find(a=>String(a.getAttribute('href')||'').includes('task=pruefung')||/Prüfung/i.test(a.querySelector('h3')?.textContent||''));
 if(!exam)return false;
 let card=document.getElementById('l9t1-dialog-card');const p=percent();
 if(!card){
  card=document.createElement('a');card.id='l9t1-dialog-card';card.className='task-card';card.href='dialog.html';
  card.innerHTML='<div class="task-top"><span class="task-num">11</span><strong></strong></div><div class="task-icon">🗣️</div><h3>Dialog im Amt</h3><p>Sprich oder schreibe im Gespräch. Mehrere richtige Antworten sind möglich.</p><div class="progress"><span></span></div><div class="task-bottom"><span></span><strong>Starten</strong></div>';
  grid.insertBefore(card,exam)
 }
 card.classList.toggle('done',p>=100);
 const cardBar=card.querySelector('.progress span');if(cardBar&&cardBar.style.width!==p+'%')cardBar.style.width=p+'%';
 setText(card.querySelector('.task-bottom span'),p+'%');setText(card.querySelector('.task-bottom strong'),p>=100?'Fertig':'Starten');setText(card.querySelector('.task-top strong'),p>=100?'✓':'');
 setText(exam.querySelector('.task-num'),'12');
 const coreCards=[...grid.querySelectorAll('.task-card')].filter(x=>x!==exam&&x!==card),coreDone=coreCards.filter(x=>x.classList.contains('done')).length,dialogDone=p>=100?1:0,done=coreDone+dialogDone,coreAll=coreCards.length>0&&coreDone===coreCards.length;
 if(!(coreAll&&completed())){
  exam.classList.add('locked');setHref(exam,'#');exam.onclick=e=>e.preventDefault();setText(exam.querySelector('.task-bottom span'),'Erst alle Aufgaben 100%')
 }else{
  exam.classList.remove('locked');setHref(exam,'task.html?task=pruefung');exam.onclick=null
 }
 const values=coreCards.map(taskProgress),avg=Math.round((values.reduce((a,b)=>a+b,0)+p)/(coreCards.length+1));
 setText(document.querySelector('.hero .circle'),avg+'%');const bar=document.querySelector('.hero .progress span');if(bar&&bar.style.width!==avg+'%')bar.style.width=avg+'%';
 const muted=document.querySelector('.hero .muted');if(muted){const next=String(muted.textContent||'').replace(/\d+ von \d+ Lernaufgaben abgeschlossen/,`${done} von ${coreCards.length+1} Lernaufgaben abgeschlossen`);setText(muted,next)}
 return true
}
function schedulePatch(){
 if(document.body.dataset.page!=='theme')return;
 clearTimeout(patchTimer);patchAttempts=0;
 const tryPatch=()=>{patchAttempts++;if(patchOverview()||patchAttempts>=20)return;patchTimer=setTimeout(tryPatch,100)};
 patchTimer=setTimeout(tryPatch,0)
}
function guardExamAfterHydrate(){
 if(document.body.dataset.page!=='task')return;
 const q=new URLSearchParams(location.search);if(q.get('task')!=='pruefung')return;
 if(!completed())location.replace('index.html#l9t1-dialog-card')
}
function start(){
 if(started)return;started=true;
 schedulePatch();
 hydrate().then(()=>{schedulePatch();guardExamAfterHydrate()}).catch(()=>{})
}
window.L9T1DialogExtension={start,hydrate,percent,completed,patchOverview,TASK_ID,TOTAL};
})();