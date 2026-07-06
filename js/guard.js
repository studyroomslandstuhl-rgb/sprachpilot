import "/js/session-restore.js?v=1";
import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
const path=location.pathname;
const isL3T2Page=path.indexOf("/wortschatz/A1-Lektion-3/Thema-2/")>=0;
if(isL3T2Page){const style=document.createElement("style");style.textContent="#accountStrip,.account-strip{display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:0!important}";document.head.appendChild(style)}
if(SP_USER&&!isL3T2Page){document.addEventListener("DOMContentLoaded",()=>{try{renderAccountStrip()}catch(e){}})}
if(SP_USER&&isL3T2Page){document.addEventListener("DOMContentLoaded",()=>{const el=document.getElementById("accountStrip");if(el){el.innerHTML="";el.style.display="none";el.style.height="0";el.style.overflow="hidden"}})}
window.addEventListener("SP_PROFILE_SYNCED",()=>{try{renderAccountStrip()}catch(e){}});
import("/js/microphone-fallback.js?v=1").catch(()=>{});
import("/js/back-button-fix.js?v=1").catch(()=>{});
import("/js/release-helper.js?v=10").catch(()=>{});
import("/js/sp-help-flow.js?v=1").catch(()=>{});
setTimeout(()=>{import("/js/global-sync.js?v=1").then(m=>m.startGlobalSync()).then(()=>{try{renderAccountStrip()}catch(e){}}).catch(()=>{})},700);
setTimeout(()=>{import("/js/progress.js?v=7").catch(()=>{});import("/js/activity-tracker.js?v=1").catch(()=>{});import("/js/scoring.js?v=4").catch(()=>{})},1000);
if(path.includes("/wortschatz/")){setTimeout(()=>import("/js/topic-progress-sync.js?v=4").catch(()=>{}),1400)}
if(path.includes("/fragen-A1/")||path.includes("/fragen/")){setTimeout(()=>import("/js/fragen-progress-sync.js?v=1").catch(()=>{}),1200)}
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(path)){setTimeout(()=>import("/wortschatz/index-release-lock.js?v=12").catch(()=>{}),800)}
if(path.includes("/verben-A1/")){
  import("/verben-A1/js/release-bridge.js?v=8").catch(()=>{});
  import("/verben-A1/js/scoring-bridge.js?v=5").catch(()=>{});
  window.addEventListener("load",()=>setTimeout(()=>{const s=document.createElement("script");s.src="/verben-A1/js/cloud-progress-sync.js?v=4";document.body.appendChild(s)},900));
}
if(path.includes("/fragen-A1/")||path.includes("/fragen/")){import("/fragen-A1/scoring-bridge.js?v=2").catch(()=>{})}