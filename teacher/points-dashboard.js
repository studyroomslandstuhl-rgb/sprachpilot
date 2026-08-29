(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_DASHBOARD_V1)return;
window.__SP_TEACHER_POINTS_DASHBOARD_V1=true;

const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const db=()=>window.db||window.firebase?.firestore?.();
let rankingById=new Map(),loading=false,lastLoad=0,decorateTimer=null;

function state(){return window.SPTeacherDashboard?.state||null}
function studentId(student={}){return text(student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id||student.__docId)}
function studentCourse(student={}){return text(student.courseCode||student.kurs||student.kursnummer||student.courseDocId)}
function studentName(student={}){return text([student.vorname||student.firstName,student.nachname||student.lastName].filter(Boolean).join(' '))||text(student.name||student.displayName)||'Teilnehmer/in'}
function studentPoints(student={}){
  const id=studentId(student),ranking=rankingById.get(id)||{};
  return Math.max(
    point(ranking.points),point(student.rankingPoints),point(student.pointsTotal),point(student.lifetimePoints),
    point(student.punkteGesamt),point(student.points),point(student.ranking?.points),point(student.totals?.points)
  );
}
function findStudent(name,email,course){
  const rows=state()?.students||[],e=norm(email),n=norm(name),c=norm(course);
  return rows.find(s=>e&&norm(s.email)===e)||rows.find(s=>norm(studentName(s))===n&&norm(studentCourse(s))===c)||null;
}
async function loadRankings(force=false){
  const database=db(),s=state();if(!database||!s?.loadedAt||loading)return false;
  if(!force&&Date.now()-lastLoad<15000)return true;
  loading=true;
  try{
    const snap=await database.collection('studentRankings').get(),map=new Map();
    snap.docs.forEach(doc=>map.set(doc.id,{id:doc.id,...(doc.data()||{})}));
    rankingById=map;lastLoad=Date.now();decorate();
    return true;
  }catch(error){
    console.warn('Punktestände konnten im Lehrer-Dashboard nicht geladen werden',error);return false;
  }finally{loading=false}
}
function decorateStudentTable(){
  if(state()?.view!=='students')return;
  const table=document.querySelector('#studentTableHost .sp-table');if(!table)return;
  const head=table.querySelector('thead tr');if(!head)return;
  if(!head.querySelector('[data-sp-points]')){
    const th=document.createElement('th');th.dataset.spPoints='1';th.textContent='Punkte';
    const access=[...head.children].find(cell=>norm(cell.textContent)==='zugang');
    head.insertBefore(th,access||head.lastElementChild);
  }
  table.querySelectorAll('tbody tr').forEach(row=>{
    if(row.querySelector('[data-sp-points]'))return;
    const cells=[...row.children];if(cells.length<4)return;
    const student=findStudent(cells[0]?.textContent,cells[1]?.textContent,cells[2]?.textContent);
    const td=document.createElement('td');td.dataset.spPoints='1';
    td.innerHTML=student?`<strong>${studentPoints(student)}</strong><div style="font-size:11px;color:var(--sp-muted)">Punkte</div>`:'—';
    const accessCell=cells[3];row.insertBefore(td,accessCell||row.lastElementChild);
  });
}
function decorateOverview(){
  if(state()?.view!=='overview')return;
  const app=document.getElementById('app');if(!app||app.querySelector('[data-sp-point-summary]'))return;
  const students=state()?.students||[],total=students.reduce((sum,s)=>sum+studentPoints(s),0);
  const card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.spPointSummary='1';
  card.innerHTML=`<h2>Punkte</h2><p><strong style="font-size:26px;color:var(--sp-text)">${total}</strong> Punkte bei ${students.length} Teilnehmenden. Die Werte kommen aus Firebase und der Rangliste.</p>`;
  const grid=app.querySelector('.sp-grid');if(grid)grid.appendChild(card);
}
function decorate(){
  clearTimeout(decorateTimer);decorateTimer=setTimeout(()=>{decorateStudentTable();decorateOverview()},30);
}

const observer=new MutationObserver(()=>decorate());
observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',event=>{if(event.target?.closest?.('#refreshBtn,[onclick*="SPTeacherDashboard.refresh"]'))setTimeout(()=>loadRankings(true),450)});
window.addEventListener('SP_RANKING_ROSTER_BACKFILLED',()=>loadRankings(true));
window.addEventListener('SP_B1_POINTS_RECALCULATED',()=>loadRankings(true));
[400,900,1800,3500].forEach(delay=>setTimeout(()=>loadRankings(delay>1000),delay));
window.SPTeacherPointsDashboard={loadRankings,studentPoints,decorate};
})();
