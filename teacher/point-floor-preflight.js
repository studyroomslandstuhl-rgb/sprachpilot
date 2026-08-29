(function(){
'use strict';
if(window.__SP_POINT_FLOOR_PREFLIGHT_V1)return;
window.__SP_POINT_FLOOR_PREFLIGHT_V1=true;

const COURSE='B174698';
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const database=()=>window.db||window.firebase?.firestore?.();
const now=()=>window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();
function total(value={}){
 const audit=value?.metadata?.pointAudit||{};
 return Math.max(
  point(value.points),point(value.rankingPoints),point(value.pointsTotal),point(value.lifetimePoints),point(value.punkteGesamt),
  point(value?.ranking?.points),point(value?.totals?.points),point(audit.preservedPoints),point(audit.preservedHistoricalFloor),point(audit.finalPoints),point(audit.reconciledPoints)
 );
}
function course(value={}){return text(value.courseKey||value.courseCode||value.kurs||value.kursnummer||value.courseDocId||value.course)}
async function run(){
 const db=database();if(!db)return{ok:false,reason:'NO_DB'};
 let rankings=[];
 try{const snap=await db.collection('studentRankings').get();rankings=snap.docs.map(doc=>({id:doc.id,...(doc.data()||{})})).filter(row=>norm(course(row))===norm(COURSE))}
 catch(error){console.warn('Historische Ranglistenpunkte konnten vor dem Abgleich nicht gelesen werden',error);return{ok:false,reason:'RANKINGS_READ_FAILED'}}
 let raisedStudents=0,raisedProgress=0,checked=0;
 for(const ranking of rankings){
  const id=text(ranking.studentId||ranking.id),floor=total(ranking);if(!id||floor<=0)continue;checked++;
  try{
   const studentRef=db.collection('students').doc(id),progressRef=db.collection('progress').doc(id);
   const [studentSnap,progressSnap]=await Promise.all([studentRef.get().catch(()=>null),progressRef.get().catch(()=>null)]);
   const student=studentSnap?.exists?(studentSnap.data()||{}):{},progress=progressSnap?.exists?(progressSnap.data()||{}):{};
   const studentSafe=Math.max(floor,total(student)),progressSafe=Math.max(floor,total(progress));
   if(studentSafe>total(student)){
    await studentRef.set({rankingPoints:studentSafe,pointsTotal:studentSafe,lifetimePoints:studentSafe,punkteGesamt:studentSafe,points:studentSafe,ranking:{...(student.ranking||{}),points:studentSafe},totals:{...(student.totals||{}),points:studentSafe},pointFloorPreserved:true,pointFloorPreservedFrom:'studentRankings',pointFloorPreservedAt:now(),updatedAt:now()},{merge:true});raisedStudents++;
   }
   if(progressSafe>total(progress)){
    const audit=progress?.metadata?.pointAudit||{};
    await progressRef.set({points:progressSafe,pointsTotal:progressSafe,lifetimePoints:progressSafe,punkteGesamt:progressSafe,ranking:{...(progress.ranking||{}),points:progressSafe},totals:{...(progress.totals||{}),points:progressSafe},metadata:{...(progress.metadata||{}),pointAudit:{...audit,preservedHistoricalFloor:Math.max(point(audit.preservedHistoricalFloor),progressSafe),preservedPoints:Math.max(point(audit.preservedPoints),progressSafe),floorSource:'studentRankings',autoLoweringDisabled:true}},pointFloorPreserved:true,pointFloorPreservedAt:now(),updatedAt:now()},{merge:true});raisedProgress++;
   }
  }catch(error){console.warn('Historischer Punktestand konnte nicht als Untergrenze gespiegelt werden',id,error)}
 }
 const result={ok:true,course:COURSE,checked,raisedStudents,raisedProgress};
 try{window.dispatchEvent(new CustomEvent('SP_POINT_FLOOR_PREFLIGHT_DONE',{detail:result}))}catch(e){}
 return result;
}
window.SPPointFloorPreflightReady=run();
window.SPPointFloorPreflight={run,ready:window.SPPointFloorPreflightReady};
})();