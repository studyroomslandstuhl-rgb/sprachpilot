(function(){
'use strict';
if(window.__SP_B1_POINT_ALIAS_NORMALIZE_V1)return;
window.__SP_B1_POINT_ALIAS_NORMALIZE_V1=true;

const COURSE='B174698';
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const db=()=>window.db||window.firebase?.firestore?.();
const nowTs=()=>window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();

function state(){return window.SPTeacherDashboard?.state||null}
function studentId(s={}){return text(s.canonicalStudentId||s.docId||s.studentId||s.userId||s.id||s.__docId)}
function studentCourse(s={}){return text(s.courseCode||s.kurs||s.kursnummer||s.courseDocId)}
function studentById(id){return (state()?.students||[]).find(s=>studentId(s)===String(id||''))||null}
function candidateIds(student={}){
 const fallback=clean((student.courseDocId||studentCourse(student)||'kurs')+'_'+(norm(student.email)||student.vorname||student.firstName||'student'));
 return [...new Set([studentId(student),student.docId,student.studentId,student.userId,student.uid,student.id,student.__docId,student.canonicalStudentId,...(Array.isArray(student.aliasIds)?student.aliasIds:[]),fallback].filter(Boolean).map(String))];
}
async function normalizeOne(change={}){
 const database=db(),id=text(change.id),total=point(change.points);if(!database||!id)return 0;
 const student=studentById(id)||{},refs=new Map();
 for(const candidate of candidateIds(student)){try{const snap=await database.collection('progress').doc(candidate).get();if(snap.exists)refs.set(snap.id,snap.ref)}catch(e){}}
 const email=norm(student.email);
 if(email){
  try{
   const snap=await database.collection('progress').where('email','==',email).get();
   snap.docs.forEach(doc=>{const data=doc.data()||{},course=text(data.courseCode||data.kurs||data.kursnummer||data.courseDocId);if(!course||norm(course)===norm(COURSE))refs.set(doc.id,doc.ref)});
  }catch(e){console.warn('Punkte-Aliase konnten nicht zusätzlich über die E-Mail ermittelt werden',email,e)}
 }
 let written=0;
 for(const ref of refs.values()){
  try{
   await ref.set({
    totals:{points:total},ranking:{points:total},points:total,pointsTotal:total,lifetimePoints:total,punkteGesamt:total,
    metadata:{pointAudit:{authoritativeExactVersion:1,authoritativeExactPoints:total,b1RecalculationVersion:1,b1RecalculationCourse:COURSE}},
    pointAuditVersion:1,lastPointRecalculationAt:nowTs(),updatedAt:nowTs()
   },{merge:true});written++;
  }catch(error){console.warn('Punktespiegel eines Fortschritts-Alias konnte nicht korrigiert werden',ref.id,error)}
 }
 return written;
}
async function normalizeSummary(summary){
 const changes=(summary?.changes||[]).filter(change=>change?.status==='updated'&&change.id);
 let written=0;for(const change of changes)written+=await normalizeOne(change);
 try{window.dispatchEvent(new CustomEvent('SP_B1_POINT_ALIASES_NORMALIZED',{detail:{students:changes.length,written}}))}catch(e){}
 return{students:changes.length,written};
}
window.addEventListener('SP_B1_POINTS_RECALCULATED',event=>normalizeSummary(event.detail).catch(error=>console.warn('B1-Punkte-Aliase konnten nicht normalisiert werden',error)));
window.SPB1PointAliasNormalize={normalizeSummary,normalizeOne};
})();
