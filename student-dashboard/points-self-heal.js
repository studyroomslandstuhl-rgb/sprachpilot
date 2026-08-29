(function(){
'use strict';
if(window.__SP_DASHBOARD_POINTS_SELF_HEAL_V3)return;window.__SP_DASHBOARD_POINTS_SELF_HEAL_V3=true;
let timer=null,running=false,last=-1,serverRefreshRunning=false,repairModulePromise=null;
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0};

window.SP_DASHBOARD_DATIV_POINTS_READY=(async()=>{
 try{
  await import('/shared/points-recalculator.js?v=20260829-dativ4');
  await import('/shared/dativ-points-extension.js?v=4');
  for(let i=0;i<80;i++){
   if(window.SPPointRecalculator?.__dativverbenV2)return true;
   await new Promise(resolve=>setTimeout(resolve,25));
  }
 }catch(error){console.warn('Dativ-Punkteberechnung konnte im Dashboard noch nicht vorbereitet werden',error)}
 return false;
})();

async function repairLocalDativ(){
 try{
  repairModulePromise=repairModulePromise||import('/shared/dativ-points-direct-repair.js?v=1');
  const mod=await repairModulePromise;
  const result=await mod.repairDativPoints?.();
  if(result?.ok&&point(result.points)>0){
    const el=document.getElementById('pointsTotal');
    if(el&&point(el.textContent)<point(result.points))el.textContent=String(point(result.points));
    return result;
  }
 }catch(error){console.warn('Bereits lokal verdiente Dativ-Punkte konnten noch nicht nachgetragen werden',error)}
 return null;
}

async function refreshExactPoints(){
 if(serverRefreshRunning)return false;
 serverRefreshRunning=true;
 try{
  const ready=await window.SP_DASHBOARD_DATIV_POINTS_READY;if(!ready)return false;
  const repaired=await repairLocalDativ();
  const [{db,doc,getDocFromServer},{getActiveProfile}]=await Promise.all([import('/js/firebase.js'),import('/js/auth.js?v=login-main-4')]);
  const p=getActiveProfile?.()||{};
  const id=String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim();
  if(!id)return false;
  const snap=await getDocFromServer(doc(db,'progress',id));if(!snap.exists())return repaired?.points||false;
  const data=snap.data()||{};
  const calculated=point(window.SPPointRecalculator?.calculate?.(data)?.total);
  const stored=Math.max(point(data.ranking?.points),point(data.totals?.points),point(data.pointsTotal),point(data.lifetimePoints),point(data.punkteGesamt),point(data.points));
  const total=Math.max(calculated,stored,point(repaired?.points));
  const el=document.getElementById('pointsTotal');
  if(el&&point(el.textContent)!==total)el.textContent=String(total);
  try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(total,point(localStorage.getItem('SP_POINTS_TOTAL')))))}catch(e){}
  return total;
 }catch(error){console.warn('Exakter Dativ-Punktestand konnte im Dashboard noch nicht geladen werden',error);return false}
 finally{serverRefreshRunning=false}
}
async function reconcile(){
 if(running)return false;
 const el=document.getElementById('pointsTotal');if(!el)return false;
 await refreshExactPoints();
 const total=point(el.textContent);if(total<=0||total===last)return false;
 running=true;
 try{
  await import('/js/ranking-mirror.js?v=20260823-points1');
  const ok=await window.SPRankingMirror?.mirror?.(total);
  if(ok){last=total;return true}
  return false;
 }catch(error){console.warn('Dashboard-Punkte konnten noch nicht zurückgespiegelt werden',error);return false}
 finally{running=false}
}
function schedule(delay=350){clearTimeout(timer);timer=setTimeout(()=>reconcile(),delay)}
const start=()=>{
 const el=document.getElementById('pointsTotal');if(!el)return;
 new MutationObserver(()=>schedule(120)).observe(el,{childList:true,characterData:true,subtree:true});
 [80,250,600,1200,2500,5000,10000].forEach(delay=>setTimeout(()=>reconcile(),delay));
};
window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>schedule(80));
window.addEventListener('SP_PROGRESS_WRITE_CONFIRMED',()=>schedule(80));
window.addEventListener('SP_POINT_DELTA_APPLIED',()=>schedule(80));
window.addEventListener('SP_DATIVVERBEN_FIREBASE_SYNCED',()=>schedule(30));
window.addEventListener('SP_DATIV_POINTS_DIRECT_REPAIRED',()=>schedule(20));
window.addEventListener('pageshow',()=>schedule(60));
window.addEventListener('online',()=>schedule(100));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(80)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
