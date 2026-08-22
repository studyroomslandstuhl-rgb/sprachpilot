import { db, doc, setDoc, serverTimestamp, getDocFromServer } from '/js/firebase.js?v=20260823-points1';
import { getActiveProfile } from '/js/auth.js';

if(!window.__SP_RANKING_MIRROR_V4){
  window.__SP_RANKING_MIRROR_V4=true;
  const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0};
  const clean=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const profile=()=>getActiveProfile?.()||{};
  const totalFrom=r=>Math.max(point(r?.ranking?.points),point(r?.totals?.points),point(r?.pointsTotal),point(r?.lifetimePoints),point(r?.punkteGesamt),point(r?.points),point(r?.rankingPoints));
  const course=p=>String(p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim();
  const name=p=>[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ').trim()||p.studentName||p.displayName||p.email||'Schüler/in';
  const id=p=>String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||clean((course(p)||'kurs')+'_'+(p.email||p.vorname||p.firstName||'student'))).trim();
  const uid=p=>String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();

  async function readServer(ref,label){
    try{
      const snap=await getDocFromServer(ref);
      return {ok:true,data:snap.exists()?(snap.data()||{}):{}};
    }catch(error){
      console.warn(label+' konnte nicht sicher vom Server gelesen werden; Punkte werden nicht überschrieben',error);
      return {ok:false,data:{}};
    }
  }

  async function mirror(total){
    const p=profile(),sid=id(p),requested=point(total),c=course(p),authUid=uid(p);
    if(!sid||!c||!authUid)return false;

    const rankingRef=doc(db,'studentRankings',sid),studentRef=doc(db,'students',sid);
    const [rankingRead,studentRead]=await Promise.all([
      readServer(rankingRef,'Ranglistenstand'),
      readServer(studentRef,'Teilnehmerstand')
    ]);

    // Ein unbekannter Serverstand darf niemals mit einem möglicherweise kleineren
    // Themen-/Cachewert überschrieben werden. Lieber später erneut synchronisieren.
    if(!rankingRead.ok||!studentRead.ok)return false;

    const localTotal=point(localStorage.getItem('SP_POINTS_TOTAL'));
    const profileTotal=totalFrom(p);
    const rankingTotal=point(rankingRead.data?.points);
    const studentTotal=Math.max(
      point(studentRead.data?.rankingPoints),
      point(studentRead.data?.pointsTotal),
      point(studentRead.data?.lifetimePoints),
      point(studentRead.data?.punkteGesamt),
      point(studentRead.data?.points),
      point(studentRead.data?.ranking?.points),
      point(studentRead.data?.totals?.points)
    );
    const safe=Math.max(requested,localTotal,profileTotal,rankingTotal,studentTotal);

    const rankingPayload={studentId:sid,authUid,displayName:name(p),courseKey:c,points:safe,version:4,updatedAt:serverTimestamp()};
    const studentPayload={studentId:p.studentId||p.userId||sid,userId:p.userId||p.studentId||sid,studentName:name(p),kurs:c,kursnummer:c,courseCode:p.courseCode||c,courseDocId:p.courseDocId||c,rankingPoints:safe,pointsTotal:safe,rankingMirrorVersion:4,rankingUpdatedAt:serverTimestamp()};
    const result=await Promise.allSettled([
      setDoc(rankingRef,rankingPayload,{merge:true}),
      setDoc(studentRef,studentPayload,{merge:true})
    ]);
    result.forEach((r,index)=>{if(r.status==='rejected')console.warn(index===0?'Ranglisten-Zeile konnte nicht aktualisiert werden':'Schüler-Punkte-Mirror konnte nicht aktualisiert werden',r.reason)});
    if(result.every(r=>r.status==='fulfilled')){
      try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(localTotal,safe)))}catch(e){}
      return true;
    }
    return false;
  }

  function patch(){
    const api=window.SPProgress;if(!api||api.__rankingMirrorV4)return false;
    for(const method of ['recordTaskProgress','recordExamResult']){
      const raw=api[method]?.bind(api);if(typeof raw!=='function')continue;
      api[method]=async function(payload={}){const result=await raw(payload);const pts=totalFrom(result||{});if(result)await mirror(pts);return result};
    }
    api.__rankingMirrorV4=true;window.SPProgress=api;return true;
  }

  window.SPRankingMirror={mirror,totalFrom,version:4};
  window.addEventListener('SP_POINT_DELTA_APPLIED',e=>{const total=point(e?.detail?.total);if(total>0)mirror(total)});
  window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',e=>{const total=totalFrom(e?.detail||{});if(total>0)mirror(total)});
  window.addEventListener('online',()=>{const total=point(localStorage.getItem('SP_POINTS_TOTAL'));if(total>0)mirror(total)});
  if(!patch()){let n=0;const t=setInterval(()=>{n++;if(patch()||n>80)clearInterval(t)},100)}
}
