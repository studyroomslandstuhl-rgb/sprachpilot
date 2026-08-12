(function(){
'use strict';
if(window.__SP_FI_VERB_PROGRESS_STATE_REFRESH_V1)return;
window.__SP_FI_VERB_PROGRESS_STATE_REFRESH_V1=true;
const RELOAD_MARK='SP_FI_PROGRESS_RELOAD_AT';
function syncSoon(){setTimeout(()=>{try{window.SPFinnishVerbFirebaseSync?.schedule?.(0)}catch(e){}},0)}
window.addEventListener('SP_FI_PROGRESS_RESTORED',()=>{
 let last=0;try{last=Number(sessionStorage.getItem(RELOAD_MARK)||0)}catch(e){}
 const now=Date.now();
 if(now-last<3000)return;
 try{sessionStorage.setItem(RELOAD_MARK,String(now))}catch(e){}
 location.reload();
});
document.addEventListener('click',syncSoon,true);
document.addEventListener('keydown',event=>{if(event.key==='Enter')syncSoon()},true);
document.addEventListener('change',syncSoon,true);
window.addEventListener('pagehide',syncSoon);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')syncSoon()});
})();
