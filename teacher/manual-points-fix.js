(function(){
'use strict';
if(window.__SP_TEACHER_MANUAL_POINTS_FIX_V1)return;
window.__SP_TEACHER_MANUAL_POINTS_FIX_V1=true;

function wait(){
 if(typeof Students==='undefined'||typeof Analytics==='undefined'||typeof TeacherEnv==='undefined'){setTimeout(wait,50);return}
 const num=v=>Number.isFinite(Number(v))?Math.max(0,Number(v)):0;
 const norm=v=>String(v||'').trim().toLowerCase();
 const domId=id=>String(id||'').replace(/[^a-zA-Z0-9_-]/g,'_');
 const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
 function stored(p={}){return Math.max(num(p.ranking?.points),num(p.totals?.points),num(p.pointsTotal),num(p.lifetimePoints),num(p.punkteGesamt),num(p.points))}
 function course(x={}){return norm(x.kurs||x.kursnummer||x.courseCode||x.courseDocId)}
 function sameStudent(a={},b={}){
  const ak=new Set(Students.progressKeys(a));
  if(Students.progressKeys(b).some(k=>ak.has(k)))return true;
  const ae=norm(a.email),be=norm(b.email),ac=course(a),bc=course(b);
  return !!(ae&&be&&ae===be&&(!ac||!bc||ac===bc))
 }
 function strongestLog(rows=[]){
  let best=[];
  rows.forEach(r=>{const log=Array.isArray(r.manualPointsLog)?r.manualPointsLog:[];if(log.length>best.length)best=log});
  return best.slice(-99)
 }
 Students.addManualPoints=async function(studentId){
  const id=String(studentId||''),did=domId(id);
  const amount=Math.max(0,Math.round(Number(document.getElementById(`manual-points-${did}`)?.value||0)));
  const reason=String(document.getElementById(`manual-reason-${did}`)?.value||'').trim();
  if(!amount)return alert('Bitte eine positive Punktzahl eingeben.');
  const database=this.database();
  if(!database)return alert('Firebase ist nicht verbunden. Punkte wurden nicht gespeichert.');
  const row=window.__SP_STUDENTS_BY_ID?.[id]||{};
  try{
   const all=await this.progressList();
   const matches=(all||[]).filter(p=>sameStudent(row,p)||sameStudent(row.progressDoc||{},p));
   const canonical=String(row.studentId||row.userId||row.id||id);
   const targetIds=uniq(matches.map(p=>p.id).concat(matches.length?[]:[canonical]));
   const shown=typeof Analytics.pointsTotal==='function'?num(Analytics.pointsTotal(row)):0;
   const current=Math.max(shown,...matches.map(stored),stored(row.progressDoc||{}));
   const next=current+amount;
   const manualCurrent=Math.max(0,...matches.map(p=>num(p.manualPointsTotal)),num(row.progressDoc?.manualPointsTotal));
   const manualNext=manualCurrent+amount;
   const teacher=TeacherEnv.teacherProfile?TeacherEnv.teacherProfile():{};
   const entry={points:amount,reason,teacher:teacher.email||teacher.name||'Lehrkraft',date:new Date().toISOString()};
   const baseLog=strongestLog(matches.length?matches:[row.progressDoc||{}]);
   const log=baseLog.concat([entry]).slice(-100);
   const batch=database.batch();
   for(const targetId of targetIds){
    const ref=database.collection('progress').doc(targetId);
    const source=matches.find(p=>String(p.id)===targetId)||{};
    batch.set(ref,{
      studentId:source.studentId||row.studentId||row.userId||canonical,
      userId:source.userId||row.userId||row.studentId||canonical,
      kurs:row.kurs||row.kursnummer||row.courseCode||source.kurs||'',
      kursnummer:row.kursnummer||row.kurs||row.courseCode||source.kursnummer||'',
      courseCode:row.courseCode||row.kurs||row.kursnummer||source.courseCode||'',
      studentName:Analytics.studentName(row),
      email:row.email||source.email||'',
      lifetimePoints:next,
      pointsTotal:next,
      punkteGesamt:next,
      points:next,
      ranking:{...(source.ranking||{}),points:next},
      totals:{...(source.totals||{}),points:next},
      manualPointsTotal:manualNext,
      manualPointsLog:log,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp(),
      lastManualPointsAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
   }
   const studentDocId=String(row.id||row.docId||row.studentId||row.userId||id);
   if(studentDocId){
    batch.set(database.collection('students').doc(studentDocId),{
      rankingPoints:next,
      pointsTotal:next,
      manualPointsTotal:manualNext,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp(),
      lastManualPointsAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
   }
   await batch.commit();
   if(row.progressDoc){
    row.progressDoc.pointsTotal=next;row.progressDoc.lifetimePoints=next;row.progressDoc.punkteGesamt=next;row.progressDoc.points=next;
    row.progressDoc.ranking={...(row.progressDoc.ranking||{}),points:next};
    row.progressDoc.totals={...(row.progressDoc.totals||{}),points:next};
   }
   row.rankingPoints=Math.max(num(row.rankingPoints),next);row.pointsTotal=next;
   const pointsInput=document.getElementById(`manual-points-${did}`);if(pointsInput)pointsInput.value='';
   const reasonInput=document.getElementById(`manual-reason-${did}`);if(reasonInput)reasonInput.value='';
   alert(`${amount} Punkte hinzugefügt. Neuer Stand: ${next} Punkte.`);
   await TeacherApp.render();
  }catch(error){
   console.error('Manuelle Punkte konnten nicht gespeichert werden',error);
   TeacherEnv.note?.('Manuelle Punkte konnten nicht gespeichert werden',error);
   alert('Punkte konnten nicht gespeichert werden: '+String(error?.message||error));
  }
 };
}
wait();
})();