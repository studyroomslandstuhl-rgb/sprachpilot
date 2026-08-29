(function(){
'use strict';
if(window.__SP_POINT_FLOOR_PREFLIGHT_V2)return;
window.__SP_POINT_FLOOR_PREFLIGHT_V2=true;

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
function idOf(value={},fallback=''){return text(value.canonicalStudentId||value.studentId||value.userId||value.docId||value.id||fallback)}
function emailOf(value={}){return norm(value.email||value.authEmail)}
function related(progress={},student={},id=''){
 const ids=new Set([id,student.canonicalStudentId,student.studentId,student.userId,student.docId,student.id,...(Array.isArray(student.aliasIds)?student.aliasIds:[])].filter(Boolean).map(String));
 for(const value of [progress.id,progress.canonicalStudentId,progress.studentId,progress.userId,progress.docId,...(Array.isArray(progress.aliasIds)?progress.aliasIds:[])])if(value&&ids.has(String(value)))return true;
 const se=emailOf(student),pe=emailOf(progress);return !!(se&&pe&&se===pe);
}
function structured(progress={}){try{return point(window.SPPointRecalculator?.calculate?.(progress)?.total)}catch(e){return 0}}
async function run(){
 const db=database();if(!db)return{ok:false,reason:'NO_DB'};
 let rankings=[],students=[],progressRows=[];
 try{
  const [rankingSnap,studentSnap,progressSnap]=await Promise.all([
   db.collection('studentRankings').get(),db.collection('students').get(),db.collection('progress').get()
  ]);
  rankings=rankingSnap.docs.map(doc=>({id:doc.id,...(doc.data()||{})})).filter(row=>norm(course(row))===norm(COURSE));
  students=studentSnap.docs.map(doc=>({id:doc.id,docId:doc.id,...(doc.data()||{})})).filter(row=>norm(course(row))===norm(COURSE));
  progressRows=progressSnap.docs.map(doc=>({id:doc.id,...(doc.data()||{})})).filter(row=>!course(row)||norm(course(row))===norm(COURSE));
 }catch(error){console.warn('Historische Punktquellen konnten vor dem Abgleich nicht vollständig gelesen werden',error);return{ok:false,reason:'POINT_FLOOR_READ_FAILED'}}
 const rankingById=new Map();for(const row of rankings){const id=idOf(row,row.id);if(id)rankingById.set(id,row)}
 const studentById=new Map();for(const row of students){const id=idOf(row,row.id);if(id)studentById.set(id,row)}
 const ids=new Set([...rankingById.keys(),...studentById.keys()]);
 let raisedStudents=0,raisedProgress=0,raisedRankings=0,manualRecovered=0,checked=0;
 for(const id of ids){
  const student=studentById.get(id)||{},ranking=rankingById.get(id)||{};
  const relatedRows=progressRows.filter(row=>related(row,student,id));
  const canonical=relatedRows.find(row=>row.id===id)||{};
  const manual=Math.max(point(student.manualPointsTotal),...relatedRows.map(row=>point(row.manualPointsTotal)),0);
  const evidence=Math.max(structured(canonical),...relatedRows.map(structured),0);
  const manualFloor=evidence+manual;
  const safe=Math.max(total(ranking),total(student),...relatedRows.map(total),manualFloor,0);
  if(!safe)continue;checked++;
  if(manual>0&&manualFloor>Math.max(total(ranking),total(student),...relatedRows.map(total),0))manualRecovered+=manualFloor-Math.max(total(ranking),total(student),...relatedRows.map(total),0);
  try{
   const studentRef=db.collection('students').doc(id),progressRef=db.collection('progress').doc(id),rankingRef=db.collection('studentRankings').doc(id);
   if(safe>total(student)){
    await studentRef.set({rankingPoints:safe,pointsTotal:safe,lifetimePoints:safe,punkteGesamt:safe,points:safe,ranking:{...(student.ranking||{}),points:safe},totals:{...(student.totals||{}),points:safe},manualPointsTotal:manual||point(student.manualPointsTotal),pointFloorPreserved:true,pointFloorPreservedFrom:'all-stored-sources',pointFloorPreservedAt:now(),updatedAt:now()},{merge:true});raisedStudents++;
   }
   if(safe>total(canonical)){
    const audit=canonical?.metadata?.pointAudit||{};
    await progressRef.set({studentId:id,userId:id,docId:id,canonicalStudentId:id,points:safe,pointsTotal:safe,lifetimePoints:safe,punkteGesamt:safe,ranking:{...(canonical.ranking||{}),points:safe},totals:{...(canonical.totals||{}),points:safe},manualPointsTotal:manual||point(canonical.manualPointsTotal),metadata:{...(canonical.metadata||{}),pointAudit:{...audit,preservedHistoricalFloor:Math.max(point(audit.preservedHistoricalFloor),safe),preservedPoints:Math.max(point(audit.preservedPoints),safe),manualPointsPreserved:manual,structuredFloorEvidence:evidence,floorSource:'all-stored-sources',autoLoweringDisabled:true}},pointFloorPreserved:true,pointFloorPreservedAt:now(),updatedAt:now()},{merge:true});raisedProgress++;
   }
   if(safe>total(ranking)){
    await rankingRef.set({studentId:id,displayName:text(ranking.displayName)||text(student.studentName||student.name)||id,courseKey:COURSE,courseCode:COURSE,points:safe,pointFloorPreserved:true,pointFloorPreservedAt:now(),updatedAt:now()},{merge:true});raisedRankings++;
   }
  }catch(error){console.warn('Historischer Punktestand konnte nicht als Untergrenze gespiegelt werden',id,error)}
 }
 const result={ok:true,course:COURSE,checked,raisedStudents,raisedProgress,raisedRankings,manualRecovered};
 try{window.dispatchEvent(new CustomEvent('SP_POINT_FLOOR_PREFLIGHT_DONE',{detail:result}))}catch(e){}
 return result;
}
window.SPPointFloorPreflightReady=run();
window.SPPointFloorPreflight={run,ready:window.SPPointFloorPreflightReady};
})();