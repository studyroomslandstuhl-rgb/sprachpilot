(function(){
'use strict';
if(window.__SP_B1_POINT_ALIAS_NORMALIZE_V2)return;
window.__SP_B1_POINT_ALIAS_NORMALIZE_V2=true;

const COURSE='B174698';
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const db=()=>window.db||window.firebase?.firestore?.();
const nowTs=()=>window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();

function state(){return window.SPTeacherDashboard?.state||null}
function studentId(s={}){return text(s.canonicalStudentId||s.docId||s.studentId||s.userId||s.id||s.__docId)}
function studentCourse(s={}){return text(s.courseCode||s.kurs||s.kursnummer||s.courseDocId||s.course)}
function studentById(id){return (state()?.students||[]).find(s=>studentId(s)===String(id||''))||null}
function stored(value={}){const audit=value?.metadata?.pointAudit||{};return Math.max(point(value.rankingPoints),point(value?.ranking?.points),point(value?.totals?.points),point(value.points),point(value.pointsTotal),point(value.lifetimePoints),point(value.punkteGesamt),point(audit.preservedPoints),point(audit.preservedHistoricalFloor),point(audit.finalPoints),point(audit.reconciledPoints))}
function candidateIds(student={}){
 const fallback=clean((student.courseDocId||studentCourse(student)||'kurs')+'_'+(norm(student.email)||student.vorname||student.firstName||'student'));
 return [...new Set([studentId(student),student.docId,student.studentId,student.userId,student.uid,student.id,student.__docId,student.canonicalStudentId,...(Array.isArray(student.aliasIds)?student.aliasIds:[]),fallback].filter(Boolean).map(String))];
}
async function normalizeOne(change={}){
 const database=db(),id=text(change.id),target=point(change.points);if(!database||!id)return 0;
 const student=studentById(id)||{},docs=new Map(),queue=[...candidateIds(student),id],seen=new Set();
 while(queue.length&&seen.size<100){
  const candidate=String(queue.shift()||'');if(!candidate||seen.has(candidate))continue;seen.add(candidate);
  try{
   const snap=await database.collection('progress').doc(candidate).get();if(!snap.exists)continue;
   const data=snap.data()||{};docs.set(snap.id,{ref:snap.ref,data});
   for(const alias of [data.canonicalStudentId,data.studentId,data.userId,data.docId,...(Array.isArray(data.aliasIds)?data.aliasIds:[])])if(alias&&!seen.has(String(alias)))queue.push(String(alias));
  }catch(e){}
 }
 const email=norm(student.email);
 if(email){
  try{
   const snap=await database.collection('progress').where('email','==',email).get();
   snap.docs.forEach(doc=>{const data=doc.data()||{},course=text(data.courseCode||data.kurs||data.kursnummer||data.courseDocId||data.course);if(!course||norm(course)===norm(COURSE))docs.set(doc.id,{ref:doc.ref,data})});
  }catch(e){console.warn('Punkte-Aliase konnten nicht zusätzlich über die E-Mail ermittelt werden',email,e)}
 }
 let written=0;
 for(const {ref,data} of docs.values()){
  try{
   const total=Math.max(target,stored(data));
   await ref.set({
    totals:{...(data.totals||{}),points:total},ranking:{...(data.ranking||{}),points:total},points:total,pointsTotal:total,lifetimePoints:total,punkteGesamt:total,
    pointAuditVersion:2,pointReconciliationVersion:2,autoLoweringDisabled:true,lastPointRecalculationAt:nowTs(),updatedAt:nowTs()
   },{merge:true});written++;
  }catch(error){console.warn('Punktespiegel eines Fortschritts-Alias konnte nicht korrigiert werden',ref.id,error)}
 }
 return written;
}
async function normalizeSummary(summary){
 const changes=(summary?.changes||[]).filter(change=>change?.status==='updated'&&change.id);
 let written=0;for(const change of changes)written+=await normalizeOne(change);
 try{window.dispatchEvent(new CustomEvent('SP_B1_POINT_ALIASES_NORMALIZED',{detail:{students:changes.length,written,version:2}}))}catch(e){}
 return{students:changes.length,written};
}
window.addEventListener('SP_B1_POINTS_RECALCULATED',event=>normalizeSummary(event.detail).catch(error=>console.warn('B1-Punkte-Aliase konnten nicht normalisiert werden',error)));
window.SPB1PointAliasNormalize={normalizeSummary,normalizeOne};
})();