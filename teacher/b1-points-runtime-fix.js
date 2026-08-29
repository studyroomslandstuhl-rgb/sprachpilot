(function(){
'use strict';
if(window.__SP_B1_POINTS_RUNTIME_FIX_V2)return;
window.__SP_B1_POINTS_RUNTIME_FIX_V2=true;

const COURSE='B174698';
const norm=value=>String(value==null?'':value).trim().toLowerCase();
const text=value=>String(value==null?'':value).trim();
let running=false,done=false;

function state(){return window.SPTeacherDashboard?.state||null}
function courseValues(student={}){
  return [student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course]
    .map(text).filter(Boolean);
}
function matchesCourse(student={},s=state()){
  const wanted=norm(COURSE);
  if(courseValues(student).some(value=>norm(value)===wanted))return true;
  const ids=new Set(courseValues(student).map(norm));
  return (s?.courses||[]).some(course=>{
    const code=text(course.courseCode||course.code||course.kurs||course.kursnummer||course.name);
    const id=text(course.__docId||course.docId||course.id);
    return norm(code)===wanted&&ids.has(norm(id));
  });
}
function summaryCard(summary){
  const app=document.getElementById('app');if(!app||!summary)return;
  let card=app.querySelector('[data-b1-runtime-summary]');
  if(!card){
    card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.b1RuntimeSummary='1';card.style.marginBottom='16px';
    const head=app.querySelector('.sp-page-head');if(head)head.insertAdjacentElement('afterend',card);else app.prepend(card);
  }
  card.innerHTML=`<h2>B1-Punkte neu geprüft</h2><p>Kurs <strong>${COURSE}</strong>: ${summary.processed} TN geprüft · ${summary.updated} korrigiert · ${summary.noEvidence} ohne sichere Punktquelle · ${summary.failed} Fehler.</p>`;
}
function status(message,kind=''){
  const el=document.getElementById('spStatus');if(!el)return;
  el.textContent=message;if(kind)el.className='sp-status '+kind;
}
async function waitReady(){
  for(let i=0;i<80;i++){
    const s=state();
    if(s?.loadedAt&&window.SPB1PointRecalculation?.repairStudent)return true;
    await new Promise(resolve=>setTimeout(resolve,125));
  }
  return false;
}
async function run(){
  if(running||done)return null;
  if(!(await waitReady())){status('B1-Punktekorrektur konnte nicht gestartet werden: Punkte-Modul nicht geladen.','error');return null}
  const s=state();
  if(!s?.isOwner)return null;
  const students=(s.students||[]).filter(student=>matchesCourse(student,s));
  if(!students.length){
    status(`B1-Punktekorrektur: Im Dashboard wurde kein TN für Kurs ${COURSE} gefunden.`,'error');
    summaryCard({processed:0,updated:0,noEvidence:0,failed:0});
    return null;
  }
  running=true;
  status(`Punkte für ${students.length} TN im Kurs ${COURSE} werden neu aus Firebase berechnet …`);
  const summary={course:COURSE,processed:students.length,updated:0,noEvidence:0,failed:0,changes:[]};
  try{
    for(const student of students){
      try{
        const result=await window.SPB1PointRecalculation.repairStudent(student,{force:true});
        if(result?.status==='updated'){summary.updated++;summary.changes.push(result)}
        else if(result?.status==='no-evidence')summary.noEvidence++;
        else if(result?.status==='skipped')summary.updated++;
        else summary.failed++;
      }catch(error){summary.failed++;summary.changes.push({status:'failed',id:text(student.id||student.docId),error:text(error?.message||error)})}
    }
    done=true;
    try{sessionStorage.setItem('SP_B1_POINT_RUNTIME_FIX_V2',JSON.stringify(summary))}catch(e){}
    status(`B1-Punkte neu geprüft: ${summary.processed} TN · ${summary.updated} geschrieben · ${summary.noEvidence} ohne sichere Punktquelle · ${summary.failed} Fehler.`,summary.failed?'error':'ok');
    summaryCard(summary);
    try{window.dispatchEvent(new CustomEvent('SP_B1_POINTS_RECALCULATED',{detail:{...summary,version:2,runtimeFix:true}}))}catch(e){}
    setTimeout(()=>window.SPTeacherPointsDashboard?.loadRankings?.(true),350);
    return summary;
  }finally{running=false}
}

function addButton(){
  const s=state(),app=document.getElementById('app');if(!s?.isOwner||!app||!['overview','students'].includes(s.view))return;
  const head=app.querySelector('.sp-page-head');if(!head||head.querySelector('[data-b1-runtime-button]'))return;
  const box=document.createElement('div');box.className='sp-row-actions';
  const button=document.createElement('button');button.type='button';button.className='sp-button';button.dataset.b1RuntimeButton='1';button.textContent='B1-Punkte jetzt neu berechnen';
  button.onclick=async()=>{done=false;button.disabled=true;button.textContent='B1-Punkte werden berechnet …';try{await run()}finally{button.disabled=false;button.textContent='B1-Punkte jetzt neu berechnen'}};
  box.appendChild(button);head.appendChild(box);
}

const observer=new MutationObserver(()=>addButton());observer.observe(document.documentElement,{childList:true,subtree:true});
[500,1200,2500].forEach(delay=>setTimeout(addButton,delay));
setTimeout(()=>run().catch(error=>status('B1-Punktekorrektur fehlgeschlagen: '+text(error?.message||error),'error')),1800);
window.SPB1PointRuntimeFix={run,matchesCourse};
})();
