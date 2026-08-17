(function(){
'use strict';
if(window.__SP_TEACHER_POINT_RECOVERY_V6)return;
window.__SP_TEACHER_POINT_RECOVERY_V6=true;
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
function stored(p={}){return Math.max(num(p?.ranking?.points),num(p?.totals?.points),num(p?.pointsTotal),num(p?.lifetimePoints),num(p?.punkteGesamt),num(p?.points))}
function technicalFor(p={},module){
 let best=0;
 for(const topic of Object.values(p?.[module]||{})){if(topic&&typeof topic==='object'&&topic.technicalRecovery===true)best=Math.max(best,num(topic?.lifetime?.points))}
 if(module==='verben')best=Math.max(best,num(p?.metadata?.pointRecovery?.verbenApplied));
 return best
}
function groupFor(p={},module){const key=module==='verben'?'verbenGroups':module==='perfekt'?'perfektGroups':'';if(!key)return 0;let total=0;for(const group of Object.values(p?.metadata?.[key]||{})){try{total+=num(window.SPPointRecalculator?.groupPoints?.(group)?.points)}catch(e){}}return total}
function evidence(p={}){
 let calc={total:0,breakdown:{}};try{calc=window.SPPointRecalculator?.calculate?.(p)||calc}catch(e){}
 let total=0;
 for(const module of MODULES){const base=num(calc.breakdown?.[module]),groups=groupFor(p,module),technical=technicalFor(p,module);total+=groups>0?Math.max(base,groups):base+technical}
 total+=num(calc.breakdown?.finnischVerben);return total
}
function safePoints(p={}){return Math.max(stored(p),evidence(p))}
try{if(typeof Analytics!=='undefined')Analytics.points=function(s){return safePoints(this.progressDoc(s))}}catch(e){console.warn('Punkteanzeige konnte nicht auf sichere Wiederherstellung umgestellt werden',e)}
try{
 if(typeof Students!=='undefined'&&typeof Students.progressList==='function'){
  const original=Students.progressList.bind(Students);
  Students.progressList=async function(){
   const rows=await original(),database=this.database();if(!database)return rows;
   const raised=[],suspicious=[];
   for(const row of rows||[]){
    const before=stored(row),fromEvidence=evidence(row),target=Math.max(before,fromEvidence);
    if(before>fromEvidence&&before>0)suspicious.push({id:row.id,stored:before,evidence:fromEvidence});
    if(target<=before)continue;
    const nowIso=new Date().toISOString(),patch={ranking:{...(row.ranking||{}),points:target,updatedAt:nowIso},totals:{...(row.totals||{}),points:target,updatedAt:nowIso},pointsTotal:target,lifetimePoints:target,punkteGesamt:target,metadata:{...(row.metadata||{}),pointRecovery:{...(row.metadata?.pointRecovery||{}),version:7,lastRaisedAt:nowIso,raisedFrom:before,raisedTo:target,evidencePoints:fromEvidence,method:'raise-only-groups-runs-or-preserved-recovery'}},updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
    try{await database.collection('progress').doc(row.id).set(patch,{merge:true});row.ranking=patch.ranking;row.totals=patch.totals;row.pointsTotal=target;row.lifetimePoints=target;row.punkteGesamt=target;row.metadata=patch.metadata;raised.push({id:row.id,from:before,to:target,evidence:fromEvidence})}catch(error){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Punkte konnten nicht wiederhergestellt werden: '+row.id,error)}
   }
   window.SP_TEACHER_POINT_AUDIT={at:new Date().toISOString(),checked:(rows||[]).length,raised,suspicious,autoLowering:false};return rows;
  }
 }
}catch(e){console.warn('Punkte-Wiederherstellung im Lehrer-Dashboard konnte nicht installiert werden',e)}
window.SPTeacherPointRecovery={stored,evidence,safePoints};
})();
