(function(){
'use strict';
if(window.__SP_L7_SCORE_LIVE_SYNC_V2)return;window.__SP_L7_SCORE_LIVE_SYNC_V2=true;
const theme=()=>Number(document.body?.dataset?.theme||0);
let running=false,timer=null;
async function syncNow(){
 const t=theme(),S=window.L7ThemeScore;if(!t||!S?.syncFirebase||window.L7S?.preview?.()||running)return false;
 const summary=S.summary?.(t);if(!summary?.pending)return true;
 running=true;
 const oldPage=document.body.dataset.page||'task';
 try{
  await Promise.allSettled([
   import('/js/progress.js?v=20260823-points1'),
   import('/js/point-delta-bridge.js?v=20260823-points1'),
   import('/js/ranking-mirror.js?v=20260823-points1')
  ]);
  document.body.dataset.page='theme';
  const ok=await S.syncFirebase(t);
  if(ok){
   // Wichtig: S.summary(t).lifetimePoints sind NUR die Punkte dieses Themas.
   // Dieser Wert darf niemals als globaler Dashboard-/Ranking-Gesamtstand
   // gespiegelt werden. SPProgress schreibt den echten globalen Gesamtstand und
   // RankingMirror übernimmt ausschließlich diesen bestätigten Wert.
   try{window.dispatchEvent(new CustomEvent('SP_L7_LIVE_SCORE_SYNCED',{detail:{theme:t}}))}catch(e){}
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
window.SPL7ScoreLiveSync={sync:syncNow,schedule,version:2};
})();
