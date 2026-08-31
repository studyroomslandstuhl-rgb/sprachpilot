(function(){
'use strict';
if(window.__SP_L7_SCORE_LIVE_SYNC_V4)return;window.__SP_L7_SCORE_LIVE_SYNC_V4=true;
const theme=()=>Number(document.body?.dataset?.theme||0);
let running=false,timer=null;
async function syncNow(){
 const t=theme(),S=window.L7ThemeScore;if(!t||!S?.syncFirebase||window.L7S?.preview?.()||running)return false;
 const summary=S.summary?.(t);if(!summary?.pending)return true;
 running=true;
 try{
  await Promise.allSettled([
   import('/js/progress.js?v=20260831-central6'),
   import('/js/point-delta-bridge.js?v=20260831-central6'),
   import('/js/ranking-mirror.js?v=20260829-safe15')
  ]);
  const ok=await S.syncFirebase(t,{allowTaskPage:true});
  if(ok){
   // Nur das zentrale SPProgress-System schreibt den globalen Gesamtpunktestand.
   try{window.dispatchEvent(new CustomEvent('SP_L7_LIVE_SCORE_SYNCED',{detail:{theme:t}}))}catch(e){}
  }
  return !!ok;
 }catch(error){console.warn('L7 Punkte-Live-Synchronisierung fehlgeschlagen',error);return false}
 finally{running=false}
}
function schedule(delay=250){clearTimeout(timer);timer=setTimeout(()=>syncNow(),delay)}
window.addEventListener('l7-theme-score-change',()=>schedule(180));
window.addEventListener('online',()=>schedule(100));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(100);else syncNow()});
window.addEventListener('pagehide',()=>{syncNow()});
[500,1600,4500,12000].forEach(ms=>setTimeout(()=>syncNow(),ms));
window.SPL7ScoreLiveSync={sync:syncNow,schedule,version:4};
})();