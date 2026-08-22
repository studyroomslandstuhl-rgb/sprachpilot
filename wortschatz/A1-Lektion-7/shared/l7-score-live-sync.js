(function(){
'use strict';
if(window.__SP_L7_SCORE_LIVE_SYNC_V1)return;window.__SP_L7_SCORE_LIVE_SYNC_V1=true;
const theme=()=>Number(document.body?.dataset?.theme||0);
let running=false,timer=null;
async function syncNow(){
 const t=theme(),S=window.L7ThemeScore;if(!t||!S?.syncFirebase||window.L7S?.preview?.()||running)return false;
 const summary=S.summary?.(t);if(!summary?.pending)return true;
 running=true;
 const oldPage=document.body.dataset.page||'task';
 try{
  await Promise.allSettled([
   import('/js/progress.js?v=20260822-l7-live1'),
   import('/js/point-delta-bridge.js?v=20260822-l7-live1'),
   import('/js/ranking-mirror.js?v=20260822-l7-live1')
  ]);
  document.body.dataset.page='theme';
  const ok=await S.syncFirebase(t);
  if(ok){
   try{window.dispatchEvent(new CustomEvent('SP_L7_LIVE_SCORE_SYNCED',{detail:{theme:t}}))}catch(e){}
   try{const total=S.summary?.(t)?.lifetimePoints||0;await window.SPRankingMirror?.mirror?.(total)}catch(e){}
  }
  return !!ok;
 }catch(error){console.warn('L7 Punkte-Live-Synchronisierung fehlgeschlagen',error);return false}
 finally{document.body.dataset.page=oldPage;running=false}
}
function schedule(delay=250){clearTimeout(timer);timer=setTimeout(()=>syncNow(),delay)}
window.addEventListener('l7-theme-score-change',()=>schedule(180));
window.addEventListener('online',()=>schedule(100));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(100);else syncNow()});
window.addEventListener('pagehide',()=>{syncNow()});
[500,1600,4500,12000].forEach(ms=>setTimeout(()=>syncNow(),ms));
window.SPL7ScoreLiveSync={sync:syncNow,schedule};
})();
