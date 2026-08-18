(function(){
'use strict';
if(window.__SP_TEACHER_POINT_RECOVERY_V7)return;
window.__SP_TEACHER_POINT_RECOVERY_V7=true;
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const TARGET_NAME='tetiana lavrynenko';
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
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
function studentName(s={}){return norm(s.studentName||s.name||[s.vorname||s.firstName,s.nachname||s.lastName].filter(Boolean).join(' '))}
function courseText(s={}){return norm(s.kurs||s.kursnummer||s.courseCode||s.course||'')}
function keysFor(x={}){try{return new Set((Students.progressKeys?.(x)||[]).map(String))}catch(e){return new Set([x.id,x.studentId,x.userId,x.docId,x.uid,x.email].filter(Boolean).map(String))}}
function intersects(a,b){for(const x of a)if(b.has(x))return true;return false}
function relatedRows(rows,target){
 const keys=keysFor(target),out=[];let changed=true;
 while(changed){
  changed=false;
  for(const row of rows||[]){if(out.includes(row))continue;const rowKeys=keysFor(row);if(!intersects(keys,rowKeys))continue;out.push(row);for(const k of rowKeys)if(!keys.has(k)){keys.add(k);changed=true}}
 }
 return out
}
function mergeRows(rows){
 if(!rows?.length)return{};
 try{if(typeof Students.mergeProgressRows==='function')return rows.reduce((acc,row)=>Students.mergeProgressRows(acc,row),{})}catch(e){}
 return rows.reduce((acc,row)=>({...acc,...row}),{});
}
async function writeExact(database,row,target,fromEvidence,nowIso){
 const before=stored(row),patch={ranking:{...(row.ranking||{}),points:target,updatedAt:nowIso},totals:{...(row.totals||{}),points:target,updatedAt:nowIso},pointsTotal:target,lifetimePoints:target,punkteGesamt:target,points:target,metadata:{...(row.metadata||{}),pointRecovery:{...(row.metadata?.pointRecovery||{}),version:8,lastExactAt:nowIso,exactFrom:before,exactTo:target,evidencePoints:fromEvidence,method:'targeted-exact-evidence-recalculation',targetStudent:'Tetiana Lavrynenko'}},updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
 await database.collection('progress').doc(row.id).set(patch,{merge:true});
 row.ranking=patch.ranking;row.totals=patch.totals;row.pointsTotal=target;row.lifetimePoints=target;row.punkteGesamt=target;row.points=target;row.metadata=patch.metadata;
 return{ id:row.id,from:before,to:target,evidence:fromEvidence }
}
try{if(typeof Analytics!=='undefined')Analytics.points=function(s){return safePoints(this.progressDoc(s))}}catch(e){console.warn('Punkteanzeige konnte nicht auf sichere Wiederherstellung umgestellt werden',e)}
try{
 if(typeof Students!=='undefined'&&typeof Students.progressList==='function'){
  const original=Students.progressList.bind(Students);
  Students.progressList=async function(){
   const rows=await original(),database=this.database();if(!database)return rows;
   const raised=[],suspicious=[],exactCorrected=[],exactUnresolved=[];

   let targetStudent=null;
   try{
    const students=await this.list();
    const exact=(students||[]).filter(s=>studentName(s)===TARGET_NAME);
    const b1=exact.filter(s=>courseText(s).includes('b1'));
    targetStudent=b1[0]||(exact.length===1?exact[0]:null);
   }catch(e){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Tetiana konnte für die Punktekorrektur nicht aufgelöst werden',e)}

   const targetProgress=targetStudent?relatedRows(rows,targetStudent):[];
   const targetIds=new Set(targetProgress.map(r=>String(r.id)));
   if(targetProgress.length){
    const merged=mergeRows(targetProgress),fromEvidence=evidence(merged),before=Math.max(...targetProgress.map(stored),0);
    if(fromEvidence>0||before===0){
     const nowIso=new Date().toISOString();
     for(const row of targetProgress){
      try{exactCorrected.push(await writeExact(database,row,fromEvidence,fromEvidence,nowIso))}
      catch(error){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Tetianas Punkte konnten nicht exakt korrigiert werden: '+row.id,error)}
     }
    }else{
     exactUnresolved.push({name:'Tetiana Lavrynenko',stored:before,evidence:fromEvidence,reason:'Keine belastbaren strukturierten Punktnachweise gefunden; deshalb nicht auf 0 gesenkt.'});
    }
   }else{
    exactUnresolved.push({name:'Tetiana Lavrynenko',reason:'Kein eindeutig zuordenbarer Fortschrittsdatensatz gefunden.'});
   }

   for(const row of rows||[]){
    if(targetIds.has(String(row.id)))continue;
    const before=stored(row),fromEvidence=evidence(row),target=Math.max(before,fromEvidence);
    if(before>fromEvidence&&before>0)suspicious.push({id:row.id,stored:before,evidence:fromEvidence});
    if(target<=before)continue;
    const nowIso=new Date().toISOString(),patch={ranking:{...(row.ranking||{}),points:target,updatedAt:nowIso},totals:{...(row.totals||{}),points:target,updatedAt:nowIso},pointsTotal:target,lifetimePoints:target,punkteGesamt:target,metadata:{...(row.metadata||{}),pointRecovery:{...(row.metadata?.pointRecovery||{}),version:8,lastRaisedAt:nowIso,raisedFrom:before,raisedTo:target,evidencePoints:fromEvidence,method:'raise-only-groups-runs-or-preserved-recovery'}},updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
    try{await database.collection('progress').doc(row.id).set(patch,{merge:true});row.ranking=patch.ranking;row.totals=patch.totals;row.pointsTotal=target;row.lifetimePoints=target;row.punkteGesamt=target;row.metadata=patch.metadata;raised.push({id:row.id,from:before,to:target,evidence:fromEvidence})}catch(error){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Punkte konnten nicht wiederhergestellt werden: '+row.id,error)}
   }
   window.SP_TEACHER_POINT_AUDIT={at:new Date().toISOString(),checked:(rows||[]).length,raised,suspicious,exactCorrected,exactUnresolved,autoLowering:false,targetedExactOnly:'Tetiana Lavrynenko'};return rows;
  }
 }
}catch(e){console.warn('Punkte-Wiederherstellung im Lehrer-Dashboard konnte nicht installiert werden',e)}
window.SPTeacherPointRecovery={stored,evidence,safePoints};
})();
