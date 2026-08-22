(function(){
'use strict';
if(window.__SP_TEACHER_RANKING_ROSTER_BACKFILL_V1)return;
window.__SP_TEACHER_RANKING_ROSTER_BACKFILL_V1=true;

const text=value=>String(value==null?'':value).trim();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0};
const db=()=>window.db||window.firebase?.firestore?.();
const nowTs=()=>window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();

function studentId(student={}){
  return text(student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id||student.__docId);
}
function courseKey(student={}){
  return text(student.courseDocId||student.courseCode||student.kurs||student.kursnummer||student.course);
}
function displayName(student={}){
  return text([student.vorname||student.firstName||student.name,student.nachname||student.lastName].filter(Boolean).join(' '))||
    text(student.displayName||student.studentName)||'Teilnehmer/in';
}
function currentPoints(student={}){
  return Math.max(
    point(student.rankingPoints),point(student.pointsTotal),point(student.lifetimePoints),
    point(student.punkteGesamt),point(student.points),point(student.ranking?.points),point(student.totals?.points)
  );
}
function studentRows(){
  const map=window.__SP_STUDENTS_BY_ID;
  if(map&&typeof map==='object')return Object.values(map).filter(Boolean);
  return [];
}

let running=false,lastSignature='',lastRunAt=0;
async function syncRoster({force=false}={}){
  if(running)return false;
  const database=db(),students=studentRows();
  if(!database||!students.length)return false;
  const signature=students.map(s=>`${studentId(s)}|${courseKey(s)}|${displayName(s)}`).sort().join('||');
  if(!force&&signature===lastSignature&&Date.now()-lastRunAt<60000)return true;
  running=true;
  let written=0,skipped=0,failed=0;
  try{
    for(let offset=0;offset<students.length;offset+=12){
      const chunk=students.slice(offset,offset+12);
      await Promise.all(chunk.map(async student=>{
        const id=studentId(student),key=courseKey(student);if(!id||!key){skipped++;return}
        try{
          const ref=database.collection('studentRankings').doc(id);
          let old={};
          try{const snap=await ref.get();if(snap.exists)old=snap.data()||{}}catch(e){}
          const authUid=text(student.authUid||old.authUid);
          const name=displayName(student)!=='Teilnehmer/in'?displayName(student):text(old.displayName)||'Teilnehmer/in';
          const points=Math.max(currentPoints(student),point(old.points));
          await ref.set({
            studentId:id,
            authUid,
            displayName:name,
            courseKey:key,
            points,
            version:4,
            updatedAt:nowTs()
          },{merge:true});
          written++;
        }catch(error){
          failed++;
          console.warn('Ranglisten-Roster konnte für Teilnehmer nicht gespiegelt werden',id,error);
        }
      }));
    }
    lastSignature=signature;lastRunAt=Date.now();
    try{window.dispatchEvent(new CustomEvent('SP_RANKING_ROSTER_BACKFILLED',{detail:{written,skipped,failed,total:students.length}}))}catch(e){}
    return failed===0;
  }finally{running=false}
}

function schedule(force=false,delay=500){setTimeout(()=>syncRoster({force}).catch(()=>{}),delay)}

window.SPRankingRosterBackfill={sync:syncRoster};
window.addEventListener('load',()=>schedule(true,900),{once:true});
window.addEventListener('focus',()=>schedule(false,300));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(false,300)});
document.addEventListener('click',event=>{
  if(event.target?.closest?.('#refreshBtn,[onclick*="SPTeacherDashboard.refresh"]'))schedule(true,1300);
});
[700,1600,3200,6500].forEach(delay=>schedule(false,delay));
setInterval(()=>syncRoster({force:false}).catch(()=>{}),60000);
})();
