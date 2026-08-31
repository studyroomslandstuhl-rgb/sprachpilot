import { db, doc, serverTimestamp } from '/js/firebase.js';
import { runTransaction } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

// Seit 2026-08-31 vergibt progress.js neue Aufgaben-/Prüfungspunkte selbst
// transaktional und idempotent. Diese Datei bleibt als Kompatibilitäts-Bridge
// bestehen, damit alte Importe nicht brechen. Sie schreibt KEINE neuen Deltas mehr.
// Ein eventuell noch vorhandener alter Pending-Eintrag wird einmalig nur auf seinen
// bereits berechneten absoluten Zielwert angehoben; dadurch kann nichts doppelt addiert werden.

const PENDING_KEY='SP_POINT_DELTA_PENDING_V2';
const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const stored=r=>Math.max(point(r?.ranking?.points),point(r?.totals?.points),point(r?.pointsTotal),point(r?.lifetimePoints),point(r?.punkteGesamt),point(r?.points));
let repairing=false;

window.__SP_POINT_DELTA_BRIDGE_V2=true;
window.__SP_POINT_DELTA_BRIDGE_V3=true;
window.__SP_POINT_DELTA_BRIDGE_V4=true;
window.__SP_POINT_DELTA_BRIDGE_V5=true;
window.__SP_POINT_DELTA_BRIDGE_V6=true;

function pending(){try{return JSON.parse(localStorage.getItem(PENDING_KEY)||'null')}catch(e){return null}}
function clearPending(){try{localStorage.removeItem(PENDING_KEY)}catch(e){}}

async function repairLegacyPending(){
  if(repairing)return false;
  const p=pending();
  if(!p?.id||!point(p.desired)){clearPending();return true}
  repairing=true;
  try{
    const ref=doc(db,'progress',String(p.id));
    const result=await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);if(!snap.exists())return{ok:false,reason:'progress-missing'};
      const data=snap.data()||{},current=stored(data),target=Math.max(current,point(p.desired));
      if(target>current){
        tx.set(ref,{
          pointsTotal:target,lifetimePoints:target,punkteGesamt:target,
          totals:{...(data.totals||{}),points:target},
          ranking:{...(data.ranking||{}),points:target},
          metadata:{...(data.metadata||{}),legacyPointDeltaMigration:{version:1,target,sourceDesired:point(p.desired),at:serverTimestamp()}}
        },{merge:true});
      }
      return{ok:true,total:target,changed:target>current};
    });
    if(result?.ok){
      clearPending();
      try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(point(localStorage.getItem('SP_POINTS_TOTAL')),point(result.total))))}catch(e){}
    }
    return !!result?.ok;
  }catch(error){console.warn('Altes Punkte-Pending konnte noch nicht sicher übernommen werden',error);return false}
  finally{repairing=false}
}

function ensure(){
  const api=window.SPProgress;if(api)api.__deltaBridgeV6=true;
  repairLegacyPending();
  return true;
}

window.SPEnsurePointDeltaBridge=ensure;
window.SPRepairPendingPointDelta=repairLegacyPending;
window.addEventListener('online',repairLegacyPending);
window.addEventListener('pageshow',ensure);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')ensure()});
ensure();

export function ensurePointDeltaBridge(){return ensure()}
export function repairPendingPointDelta(){return repairLegacyPending()}
