(function(){
'use strict';
if(window.__SP_TEACHER_POINT_RECOVERY_V8)return;
window.__SP_TEACHER_POINT_RECOVERY_V8=true;

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const TARGET_NAME='tetiana lavrynenko';
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const mail=v=>String(v||'').trim().toLowerCase();
const uniq=a=>[...new Set((a||[]).filter(v=>v!==undefined&&v!==null).map(String))];

function stored(p={}){
 return Math.max(num(p?.ranking?.points),num(p?.totals?.points),num(p?.pointsTotal),num(p?.lifetimePoints),num(p?.punkteGesamt),num(p?.points));
}
function technicalFor(p={},module){
 let best=0;
 for(const topic of Object.values(p?.[module]||{})){
  if(topic&&typeof topic==='object'&&topic.technicalRecovery===true)best=Math.max(best,num(topic?.lifetime?.points));
 }
 if(module==='verben')best=Math.max(best,num(p?.metadata?.pointRecovery?.verbenApplied));
 return best;
}
function groupPoints(group={}){
 try{return num(window.SPPointRecalculator?.groupPoints?.(group)?.points)}catch(e){return 0}
}
function groupFor(p={},module){
 const key=module==='verben'?'verbenGroups':module==='perfekt'?'perfektGroups':'';
 if(!key)return 0;
 let total=0;
 for(const group of Object.values(p?.metadata?.[key]||{}))total+=groupPoints(group);
 return total;
}
function evidenceDetails(p={}){
 let calc={total:0,breakdown:{}};
 try{calc=window.SPPointRecalculator?.calculate?.(p)||calc}catch(e){}
 const breakdown={},technical={},groups={verben:groupFor(p,'verben'),perfekt:groupFor(p,'perfekt')};
 let total=0;
 for(const module of MODULES){
  const base=num(calc.breakdown?.[module]),group=module==='verben'?groups.verben:module==='perfekt'?groups.perfekt:0,tech=technicalFor(p,module);
  technical[module]=tech;
  const effective=group>0?Math.max(base,group):base+tech;
  breakdown[module]=effective;
  total+=effective;
 }
 const finnisch=num(calc.breakdown?.finnischVerben);
 if(finnisch){breakdown.finnischVerben=finnisch;total+=finnisch}
 return{
  total,
  breakdown,
  rawBreakdown:{...(calc.breakdown||{})},
  groups:{verben:groups.verben,perfekt:groups.perfekt},
  technical,
  includes:{fragen:true,wortschatz:true,verben:true,irregulaereVerben:true,perfekt:true,grammatik:true},
  note:'Irregulaere Verben werden im Verben-System gespeichert und sind in metadata.verbenGroups enthalten.'
 };
}
function evidence(p={}){return evidenceDetails(p).total}
function safePoints(p={}){return Math.max(stored(p),evidence(p))}
function studentName(s={}){return norm(s.studentName||s.name||[s.vorname||s.firstName,s.nachname||s.lastName].filter(Boolean).join(' '))}
function courseText(s={}){return norm(s.kurs||s.kursnummer||s.courseCode||s.course||'')}
function emailOf(s={}){return mail(s.email||s.mail||'')}
function keysFor(x={}){
 try{return new Set((Students.progressKeys?.(x)||[]).map(String))}
 catch(e){return new Set([x.id,x.studentId,x.userId,x.docId,x.uid,x.canonicalStudentId,x.email].filter(Boolean).map(String))}
}
function intersects(a,b){for(const x of a)if(b.has(x))return true;return false}

function mergeDone(a,b){return uniq([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])])}
function mergeGroupTask(a={},b={}){
 const done=mergeDone(a?.done,b?.done),total=Math.max(Number(a?.total||0),Number(b?.total||0));
 return{...a,...b,done,total,completed:!!(a?.completed||b?.completed||(total>0&&done.length>=total))};
}
function mergeAwardTasks(a={},b={}){
 const out={};
 for(const key of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[key]=Math.max(num(a?.[key]),num(b?.[key]));
 return out;
}
function mergeGroupRun(a={},b={}){
 const tasks={};
 for(const key of new Set([...Object.keys(a?.tasks||{}),...Object.keys(b?.tasks||{})]))tasks[key]=mergeGroupTask(a?.tasks?.[key]||{},b?.tasks?.[key]||{});
 const ae=a?.exam||{},be=b?.exam||{};
 return{
  ...a,...b,
  tasks,
  awards:{...(a?.awards||{}),...(b?.awards||{}),tasks:mergeAwardTasks(a?.awards?.tasks||{},b?.awards?.tasks||{}),examPoints:Math.max(num(a?.awards?.examPoints),num(b?.awards?.examPoints))},
  exam:{...ae,...be,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0))},
  completed:!!(a?.completed||b?.completed)
 };
}
function sameGroup(a={},b={}){
 const as=String(a?.signature||''),bs=String(b?.signature||'');
 if(as&&bs)return as===bs;
 const av=(a?.verbs||[]).map(String).join('|'),bv=(b?.verbs||[]).map(String).join('|');
 return !av||!bv||av===bv;
}
function mergeGroup(a={},b={}){
 if(!sameGroup(a,b))return groupPoints(a)>=groupPoints(b)?a:b;
 const runs={};
 for(const key of new Set([...Object.keys(a?.runs||{}),...Object.keys(b?.runs||{})]))runs[key]=mergeGroupRun(a?.runs?.[key]||{},b?.runs?.[key]||{});
 return{...a,...b,signature:b?.signature||a?.signature||'',verbs:uniq([...(a?.verbs||[]),...(b?.verbs||[])]),currentRun:Math.max(Number(a?.currentRun||1),Number(b?.currentRun||1)),runs};
}
function mergeGroupMaps(rows,key){
 const out={};
 for(const row of rows||[]){
  for(const[id,group]of Object.entries(row?.metadata?.[key]||{}))out[id]=out[id]?mergeGroup(out[id],group||{}):group||{};
 }
 const bestBySignature=new Map();
 for(const[id,group]of Object.entries(out)){
  const sig=String(group?.signature||'').trim();if(!sig)continue;
  const old=bestBySignature.get(sig);
  if(!old||groupPoints(group)>groupPoints(old.group))bestBySignature.set(sig,{id,group});
 }
 for(const[id,group]of Object.entries(out)){
  const sig=String(group?.signature||'').trim();if(sig&&bestBySignature.get(sig)?.id!==id)delete out[id];
 }
 return out;
}
function mergePointRecovery(rows){
 const out={};
 for(const row of rows||[]){
  const data=row?.metadata?.pointRecovery||{};
  for(const[key,value]of Object.entries(data)){
   if(typeof value==='number')out[key]=Math.max(Number(out[key]||0),value);
   else if(!(key in out)||/updated|at$/i.test(key))out[key]=value;
  }
 }
 return out;
}
function mergeRows(rows){
 if(!rows?.length)return{};
 let out={};
 try{out=typeof Students.mergeProgressRows==='function'?rows.reduce((acc,row)=>Students.mergeProgressRows(acc,row),{}):rows.reduce((acc,row)=>({...acc,...row}),{})}
 catch(e){out=rows.reduce((acc,row)=>({...acc,...row}),{})}
 out.metadata={...(out.metadata||{}),verbenGroups:mergeGroupMaps(rows,'verbenGroups'),perfektGroups:mergeGroupMaps(rows,'perfektGroups'),pointRecovery:mergePointRecovery(rows)};
 return out;
}
function matchesTargetRow(row,target){
 const targetKeys=keysFor(target),rowKeys=keysFor(row);
 if(intersects(targetKeys,rowKeys))return true;
 const te=emailOf(target),re=emailOf(row);if(te&&re&&te===re)return true;
 if(studentName(row)!==TARGET_NAME)return false;
 const tc=courseText(target),rc=courseText(row);
 return !tc||!rc||tc===rc||tc.includes('b1')&&rc.includes('b1');
}
function targetRows(rows,target){return (rows||[]).filter(row=>matchesTargetRow(row,target))}

async function writeExact(database,row,target,details,merged,nowIso){
 const before=stored(row),metadata={...(row.metadata||{}),verbenGroups:{...(merged?.metadata?.verbenGroups||{})},perfektGroups:{...(merged?.metadata?.perfektGroups||{})},pointRecovery:{...(row.metadata?.pointRecovery||{}),version:9,lastExactAt:nowIso,exactFrom:before,exactTo:target,evidencePoints:details.total,breakdown:details.breakdown,groupEvidence:details.groups,includes:details.includes,method:'targeted-exact-all-modules-and-group-runs',targetStudent:'Tetiana Lavrynenko'}};
 const patch={ranking:{...(row.ranking||{}),points:target,updatedAt:nowIso},totals:{...(row.totals||{}),points:target,updatedAt:nowIso},pointsTotal:target,lifetimePoints:target,punkteGesamt:target,points:target,metadata,updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
 await database.collection('progress').doc(row.id).set(patch,{merge:true});
 row.ranking=patch.ranking;row.totals=patch.totals;row.pointsTotal=target;row.lifetimePoints=target;row.punkteGesamt=target;row.points=target;row.metadata=metadata;
 return{id:row.id,from:before,to:target,evidence:details.total,breakdown:details.breakdown,groups:details.groups};
}

try{if(typeof Analytics!=='undefined')Analytics.points=function(s){return safePoints(this.progressDoc(s))}}catch(e){console.warn('Punkteanzeige konnte nicht auf sichere Wiederherstellung umgestellt werden',e)}

try{
 if(typeof Students!=='undefined'&&typeof Students.progressList==='function'){
  const original=Students.progressList.bind(Students);
  Students.progressList=async function(){
   const rows=await original(),database=this.database();if(!database)return rows;
   const raised=[],suspicious=[],exactCorrected=[],exactUnresolved=[];
   let exactBreakdown=null,targetStudent=null;

   try{
    const students=await this.list(),exact=(students||[]).filter(s=>studentName(s)===TARGET_NAME),b1=exact.filter(s=>courseText(s).includes('b1'));
    targetStudent=b1[0]||(exact.length===1?exact[0]:null);
   }catch(e){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Tetiana konnte für die Punktekorrektur nicht aufgelöst werden',e)}

   if(!targetStudent){
    const namedRows=(rows||[]).filter(row=>studentName(row)===TARGET_NAME&&(!courseText(row)||courseText(row).includes('b1')));
    if(namedRows.length)targetStudent=namedRows[0];
   }

   const matched=targetStudent?targetRows(rows,targetStudent):[];
   const targetIds=new Set(matched.map(r=>String(r.id)));
   if(matched.length){
    const merged=mergeRows(matched),details=evidenceDetails(merged),before=Math.max(...matched.map(stored),0);
    exactBreakdown={name:'Tetiana Lavrynenko',course:courseText(targetStudent),matchedProgressIds:matched.map(r=>r.id),storedBefore:before,total:details.total,breakdown:details.breakdown,rawBreakdown:details.rawBreakdown,groups:details.groups,technical:details.technical,includes:details.includes,note:details.note,verbenGroupCount:Object.keys(merged?.metadata?.verbenGroups||{}).length,perfektGroupCount:Object.keys(merged?.metadata?.perfektGroups||{}).length};
    if(details.total>0||before===0){
     const nowIso=new Date().toISOString();
     for(const row of matched){
      try{exactCorrected.push(await writeExact(database,row,details.total,details,merged,nowIso))}
      catch(error){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Tetianas Punkte konnten nicht exakt korrigiert werden: '+row.id,error)}
     }
    }else exactUnresolved.push({name:'Tetiana Lavrynenko',stored:before,evidence:details.total,reason:'Keine belastbaren strukturierten Punktnachweise gefunden; deshalb nicht auf 0 gesenkt.'});
   }else exactUnresolved.push({name:'Tetiana Lavrynenko',reason:'Kein eindeutig zuordenbarer B1-Fortschrittsdatensatz gefunden.'});

   for(const row of rows||[]){
    if(targetIds.has(String(row.id)))continue;
    const before=stored(row),details=evidenceDetails(row),fromEvidence=details.total,target=Math.max(before,fromEvidence);
    if(before>fromEvidence&&before>0)suspicious.push({id:row.id,stored:before,evidence:fromEvidence});
    if(target<=before)continue;
    const nowIso=new Date().toISOString(),patch={ranking:{...(row.ranking||{}),points:target,updatedAt:nowIso},totals:{...(row.totals||{}),points:target,updatedAt:nowIso},pointsTotal:target,lifetimePoints:target,punkteGesamt:target,metadata:{...(row.metadata||{}),pointRecovery:{...(row.metadata?.pointRecovery||{}),version:9,lastRaisedAt:nowIso,raisedFrom:before,raisedTo:target,evidencePoints:fromEvidence,method:'raise-only-groups-runs-or-preserved-recovery'}},updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
    try{await database.collection('progress').doc(row.id).set(patch,{merge:true});row.ranking=patch.ranking;row.totals=patch.totals;row.pointsTotal=target;row.lifetimePoints=target;row.punkteGesamt=target;row.metadata=patch.metadata;raised.push({id:row.id,from:before,to:target,evidence:fromEvidence})}
    catch(error){if(typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Punkte konnten nicht wiederhergestellt werden: '+row.id,error)}
   }

   window.SP_TETIANA_POINT_RECALC=exactBreakdown;
   window.SP_TEACHER_POINT_AUDIT={at:new Date().toISOString(),checked:(rows||[]).length,raised,suspicious,exactCorrected,exactUnresolved,exactBreakdown,autoLowering:false,targetedExactOnly:'Tetiana Lavrynenko'};
   if(exactBreakdown&&typeof TeacherEnv!=='undefined')TeacherEnv.note?.('Tetiana Lavrynenko: Punkte vollständig neu berechnet ('+exactBreakdown.total+').');
   return rows;
  };
 }
}catch(e){console.warn('Punkte-Wiederherstellung im Lehrer-Dashboard konnte nicht installiert werden',e)}

window.SPTeacherPointRecovery={stored,evidence,evidenceDetails,safePoints,mergeRows};
})();
