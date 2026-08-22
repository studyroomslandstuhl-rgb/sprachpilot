(function(){
'use strict';
if(window.__SP_DASHBOARD_POINTS_SELF_HEAL_V1)return;window.__SP_DASHBOARD_POINTS_SELF_HEAL_V1=true;
let timer=null,running=false,last=-1;
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0};
async function reconcile(){
 if(running)return false;
 const el=document.getElementById('pointsTotal');if(!el)return false;
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
 [700,1800,4500,10000].forEach(delay=>setTimeout(()=>reconcile(),delay));
};
window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>schedule(100));
window.addEventListener('SP_PROGRESS_WRITE_CONFIRMED',()=>schedule(100));
window.addEventListener('SP_POINT_DELTA_APPLIED',()=>schedule(100));
window.addEventListener('pageshow',()=>schedule(250));
window.addEventListener('online',()=>schedule(250));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(200)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
