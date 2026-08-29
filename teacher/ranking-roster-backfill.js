(function(){
'use strict';
if(window.__SP_TEACHER_RANKING_ROSTER_BACKFILL_V3)return;
window.__SP_TEACHER_RANKING_ROSTER_BACKFILL_V3=true;

const text=value=>String(value==null?'':value).trim();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0};
const db=()=>window.db||window.firebase?.firestore?.();
const nowTs=()=>window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();

function studentId(student={}){return text(student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id||student.__docId)}
function courseKey(student={}){return text(student.courseDocId||student.courseCode||student.kurs||student.kursnummer||student.course)}
function displayName(student={}){return text([student.vorname||student.firstName||student.name,student.nachname||student.lastName].filter(Boolean).join(' '))||text(student.displayName||student.studentName)||'Teilnehmer/in'}
function currentPoints(student={}){return Math.max(point(student.rankingPoints),point(student.pointsTotal),point(student.lifetimePoints),point(student.punkteGesamt),point(student.points),point(student.ranking?.points),point(student.totals?.points))}
function usable(student={}){return student.active!==false&&student.securityArchived!==true&&student.securityLookupExcluded!==true&&!!studentId(student)&&!!courseKey(student)}
async function studentRows(){
 const database=db();if(!database)return[];
 try{
  const snap=await database.collection('students').get();
  const rows=snap.docs.map(doc=>({id:doc.id,__docId:doc.id,docId:doc.id,...(doc.data()||{})})).filter(usable);
  if(rows.length)return rows;
 }catch(error){console.warn('Direkter Teilnehmer-Roster konnte nicht gelesen werden',error)}
 const map=window.__SP_STUDENTS_BY_ID;
 return map&&typeof map==='object'?Object.values(map).filter(usable):[];
}

let running=false,lastSignature='',lastRunAt=0;
async function syncRoster({force=false}={}){
 if(running)return false;
 const database=db();if(!database)return false;
 const students=await studentRows();if(!students.length)return false;
 const signature=students.map(s=>`${studentId(s)}|${courseKey(s)}|${displayName(s)}|${currentPoints(s)}`).sort().join('||');
 if(!force&&signature===lastSignature&&Date.now()-lastRunAt<60000)return true;
 running=true;let written=0,skipped=0,failed=0;
 try{
  for(let offset=0;offset<students.length;offset+=12){
   const chunk=students.slice(offset,offset+12);
   await Promise.all(chunk.map(async student=>{
    const id=studentId(student),key=courseKey(student);if(!id||!key){skipped++;return}
    try{
     const ref=db().collection('studentRankings').doc(id);let old={};
     try{const snap=await ref.get();if(snap.exists)old=snap.data()||{}}catch(e){}
     const authUid=text(student.authUid||old.authUid),name=displayName(student)!=='Teilnehmer/in'?displayName(student):text(old.displayName)||'Teilnehmer/in';
     const auditedVersion=Math.max(point(student.pointAuditVersion),point(student.pointReconciliationVersion),point(old.pointAuditVersion),point(old.pointReconciliationVersion));
     const points=Math.max(currentPoints(student),point(old.points));
     await ref.set({studentId:id,authUid,displayName:name,courseKey:key,courseCode:text(student.courseCode||student.kurs||student.kursnummer),courseDocId:text(student.courseDocId),points,version:7,pointAuditVersion:auditedVersion,pointReconciliationVersion:Math.max(point(student.pointReconciliationVersion),point(old.pointReconciliationVersion)),rosterBackfilled:true,autoLoweringDisabled:true,updatedAt:nowTs()},{merge:true});
     written++;
    }catch(error){failed++;console.warn('Ranglisten-Roster konnte für Teilnehmer nicht gespiegelt werden',id,error)}
   }));
  }
  lastSignature=signature;lastRunAt=Date.now();
  try{window.dispatchEvent(new CustomEvent('SP_RANKING_ROSTER_BACKFILLED',{detail:{written,skipped,failed,total:students.length}}))}catch(e){}
  return failed===0;
 }finally{running=false}
}
function schedule(force=false,delay=500){setTimeout(()=>syncRoster({force}).catch(()=>{}),delay)}
function appendScript(src,marker){
 if(document.querySelector(`script[data-${marker}]`))return Promise.resolve();
 return new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=src;script.async=true;script.setAttribute(`data-${marker}`,'1');
  script.onload=()=>resolve();script.onerror=()=>reject(new Error(`Script konnte nicht geladen werden: ${src}`));document.head.appendChild(script);
 });
}
async function loadPointSuite(){
 if(window.__SP_TEACHER_POINTS_SUITE_LOADING_V3)return;
 window.__SP_TEACHER_POINTS_SUITE_LOADING_V3=true;
 try{
  await appendScript('/teacher/points-suite.js?v=20260829-points3','sp-points-suite-v3');
  await appendScript('/teacher/b1-points-runtime-fix.js?v=20260829-points3','sp-b1-runtime-fix-v3');
 }catch(error){window.__SP_TEACHER_POINTS_SUITE_LOADING_V3=false;console.warn('Punkte-Werkzeuge konnten nicht vollständig nachgeladen werden',error)}
}
window.SPRankingRosterBackfill={sync:syncRoster,loadPointSuite};
window.addEventListener('load',()=>{schedule(true,600);setTimeout(loadPointSuite,250)},{once:true});
window.addEventListener('focus',()=>schedule(false,200));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(false,200)});
document.addEventListener('click',event=>{if(event.target?.closest?.('#refreshBtn,[onclick*="SPTeacherDashboard.refresh"]'))schedule(true,500)});
[300,900,1800,3500].forEach(delay=>schedule(false,delay));
setTimeout(loadPointSuite,300);
setInterval(()=>syncRoster({force:false}).catch(()=>{}),60000);
})();