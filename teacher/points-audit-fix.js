(function(){
'use strict';
if(window.__SP_TEACHER_POINT_RECOVERY_V10)return;
window.__SP_TEACHER_POINT_RECOVERY_V10=true;

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik','dativverben'];
const num=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
function stored(p={}){
 const audit=p?.metadata?.pointAudit||{};
 return Math.max(
  num(p?.ranking?.points),num(p?.totals?.points),num(p?.rankingPoints),num(p?.pointsTotal),num(p?.lifetimePoints),num(p?.punkteGesamt),num(p?.points),
  num(audit.preservedPoints),num(audit.preservedHistoricalFloor),num(audit.finalPoints),num(audit.reconciledPoints)
 );
}
function groupPoints(group={}){try{return num(window.SPPointRecalculator?.groupPoints?.(group)?.points)}catch(e){return 0}}
function evidenceDetails(p={}){
 let calc={total:0,breakdown:{}};try{calc=window.SPPointRecalculator?.calculate?.(p)||calc}catch(e){}
 const breakdown={...(calc.breakdown||{})};
 for(const [key,module] of [['verbenGroups','verben'],['perfektGroups','perfekt'],['dativverbenGroups','dativverben']]){
  let grouped=0;for(const group of Object.values(p?.metadata?.[key]||{}))grouped+=groupPoints(group);
  if(grouped>0)breakdown[module]=Math.max(num(breakdown[module]),grouped);
 }
 let total=0;for(const module of MODULES)total+=num(breakdown[module]);total+=num(breakdown.finnischVerben);
 return{total,breakdown};
}
function evidence(p={}){return evidenceDetails(p).total}
function safePoints(p={}){return Math.max(stored(p),evidence(p))}

try{if(typeof Analytics!=='undefined')Analytics.points=function(student){const progress=typeof this.progressDoc==='function'?this.progressDoc(student):student;return safePoints(progress||{})}}catch(e){console.warn('Sichere Punkteanzeige konnte nicht installiert werden',e)}

// Dieses Modul darf keine exakten niedrigeren Punktestände mehr schreiben. Historische
// Reparaturen laufen ausschließlich über den zentralen, nicht-destruktiven Abgleich.
window.SP_TEACHER_POINT_AUDIT={at:new Date().toISOString(),autoLowering:false,targetedExactDisabled:true,mode:'preserve-or-raise-only'};
window.SPTeacherPointRecovery={stored,evidence,evidenceDetails,safePoints,version:10,autoLowering:false};
})();