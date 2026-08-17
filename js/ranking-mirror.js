import { db, doc, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';

if(!window.__SP_RANKING_MIRROR_V2){
  window.__SP_RANKING_MIRROR_V2=true;
  const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0};
  const clean=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const profile=()=>getActiveProfile?.()||{};
  const totalFrom=r=>Math.max(point(r?.ranking?.points),point(r?.totals?.points),point(r?.pointsTotal),point(r?.lifetimePoints),point(r?.punkteGesamt));
  const course=p=>String(p.courseCode||p.kurs||p.kursnummer||p.course||p.courseDocId||localStorage.getItem('SP_COURSE_CODE')||'').trim();
  const name=p=>[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ').trim()||p.studentName||p.displayName||p.email||'Schüler/in';
  const id=p=>p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||clean((course(p)||'kurs')+'_'+(p.email||p.vorname||p.firstName||'student'));
  async function mirror(total){const p=profile(),sid=id(p),pts=point(total);if(!sid||pts<=0)return false;const c=course(p);try{await setDoc(doc(db,'students',String(sid)),{studentId:p.studentId||p.userId||sid,userId:p.userId||p.studentId||sid,studentName:name(p),email:p.email||'',kurs:c,kursnummer:c,courseCode:c,rankingPoints:pts,pointsTotal:pts,rankingMirrorVersion:2,rankingUpdatedAt:serverTimestamp()},{merge:true});return true}catch(e){console.warn('Ranglisten-Mirror fehlgeschlagen',e);return false}}
  function patch(){const api=window.SPProgress;if(!api||api.__rankingMirrorV2)return false;for(const method of ['recordTaskProgress','recordExamResult']){const raw=api[method]?.bind(api);if(typeof raw!=='function')continue;api[method]=async function(payload={}){const result=await raw(payload);const pts=totalFrom(result||{});if(result&&pts>0)mirror(pts);return result}}
    api.__rankingMirrorV2=true;window.SPProgress=api;return true}
  window.SPRankingMirror={mirror,totalFrom};
  window.addEventListener('SP_POINT_DELTA_APPLIED',e=>{const pts=point(e?.detail?.total);if(pts>0)mirror(pts)});
  if(!patch()){let n=0;const t=setInterval(()=>{n++;if(patch()||n>50)clearInterval(t)},100)}
}
