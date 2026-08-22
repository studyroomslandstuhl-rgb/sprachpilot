import { db, doc, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';

if(!window.__SP_RANKING_MIRROR_V3){
  window.__SP_RANKING_MIRROR_V3=true;
  const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0};
  const clean=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const profile=()=>getActiveProfile?.()||{};
  const totalFrom=r=>Math.max(point(r?.ranking?.points),point(r?.totals?.points),point(r?.pointsTotal),point(r?.lifetimePoints),point(r?.punkteGesamt),point(r?.points));
  const course=p=>String(p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim();
  const name=p=>[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ').trim()||p.studentName||p.displayName||p.email||'Schüler/in';
  const id=p=>String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||clean((course(p)||'kurs')+'_'+(p.email||p.vorname||p.firstName||'student'))).trim();
  const uid=p=>String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();

  async function mirror(total){
    const p=profile(),sid=id(p),pts=point(total),c=course(p),authUid=uid(p);if(!sid||!c||!authUid)return false;
    const rankingPayload={studentId:sid,authUid,displayName:name(p),courseKey:c,points:pts,version:3,updatedAt:serverTimestamp()};
    const studentPayload={studentId:p.studentId||p.userId||sid,userId:p.userId||p.studentId||sid,studentName:name(p),kurs:c,kursnummer:c,courseCode:p.courseCode||c,courseDocId:p.courseDocId||c,rankingPoints:pts,pointsTotal:pts,rankingMirrorVersion:3,rankingUpdatedAt:serverTimestamp()};
    const jobs=[
      setDoc(doc(db,'studentRankings',sid),rankingPayload,{merge:true}),
      setDoc(doc(db,'students',sid),studentPayload,{merge:true})
    ];
    const result=await Promise.allSettled(jobs);
    result.forEach((r,index)=>{if(r.status==='rejected')console.warn(index===0?'Ranglisten-Zeile konnte nicht aktualisiert werden':'Schüler-Punkte-Mirror konnte nicht aktualisiert werden',r.reason)});
    return result.some(r=>r.status==='fulfilled');
  }

  function patch(){
    const api=window.SPProgress;if(!api||api.__rankingMirrorV3)return false;
    for(const method of ['recordTaskProgress','recordExamResult']){
      const raw=api[method]?.bind(api);if(typeof raw!=='function')continue;
      api[method]=async function(payload={}){const result=await raw(payload);const pts=totalFrom(result||{});if(result)mirror(pts);return result};
    }
    api.__rankingMirrorV3=true;window.SPProgress=api;return true;
  }

  window.SPRankingMirror={mirror,totalFrom};
  window.addEventListener('SP_POINT_DELTA_APPLIED',e=>mirror(point(e?.detail?.total)));
  window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',e=>{const total=totalFrom(e?.detail||{});if(total>0)mirror(total)});
  if(!patch()){let n=0;const t=setInterval(()=>{n++;if(patch()||n>80)clearInterval(t)},100)}
}
