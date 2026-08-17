(function(){
'use strict';
if(window.__SP_TEACHER_POINT_AUDIT_V2)return;window.__SP_TEACHER_POINT_AUDIT_V2=true;
function calc(progress){try{return window.SPPointRecalculator?.audit?.(progress)||{total:0,stored:0,inflatedBy:0,breakdown:{}}}catch(e){return{total:0,stored:0,inflatedBy:0,breakdown:{}}}}
try{
 if(typeof Analytics!=='undefined')Analytics.points=function(s){return Number(calc(this.progressDoc(s)).total)||0};
}catch(e){console.warn('Punkteanzeige im Lehrer-Dashboard konnte nicht ersetzt werden',e)}
try{
 if(typeof Students!=='undefined'&&typeof Students.progressList==='function'){
  const original=Students.progressList.bind(Students);
  Students.progressList=async function(){
   const rows=await original();const database=this.database();if(!database||!window.SPPointRecalculator)return rows;
   const changed=[];
   for(const row of rows||[]){
    const audit=calc(row),exact=Number(audit.total)||0;
    const fields=[row?.ranking?.points,row?.totals?.points,row?.pointsTotal,row?.lifetimePoints,row?.punkteGesamt].map(v=>Number(v)||0);
    if(fields.every(v=>v===exact))continue;
    const nowIso=new Date().toISOString();
    const patch={ranking:{...(row.ranking||{}),points:exact,updatedAt:nowIso},totals:{...(row.totals||{}),points:exact,updatedAt:nowIso},pointsTotal:exact,lifetimePoints:exact,punkteGesamt:exact,metadata:{...(row.metadata||{}),pointAudit:{...(row.metadata?.pointAudit||{}),version:4,lastRepairAt:nowIso,storedBefore:audit.stored,correctedPoints:exact,inflatedBy:audit.inflatedBy,breakdown:audit.breakdown,method:'verified-progress-evidence'}},updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
    try{await database.collection('progress').doc(row.id).set(patch,{merge:true});row.ranking=patch.ranking;row.totals=patch.totals;row.pointsTotal=exact;row.lifetimePoints=exact;row.punkteGesamt=exact;row.metadata=patch.metadata;changed.push({id:row.id,from:audit.stored,to:exact,inflatedBy:audit.inflatedBy})}catch(error){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Punkte konnten nicht korrigiert werden: '+row.id,error)}
   }
   window.SP_TEACHER_POINT_AUDIT={at:new Date().toISOString(),checked:(rows||[]).length,changed};
   return rows;
  };
 }
}catch(e){console.warn('Automatische Punkteprüfung im Lehrer-Dashboard konnte nicht installiert werden',e)}
})();
