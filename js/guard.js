import "/js/session-restore.js?v=1";
import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
const path=location.pathname;
const qs=new URLSearchParams(location.search);
if(qs.has("nofirebase"))localStorage.setItem("SP_NO_FIREBASE_SYNC","1");
if(qs.has("firebase"))localStorage.removeItem("SP_NO_FIREBASE_SYNC");
const NO_FIREBASE_SYNC=qs.has("nofirebase")||localStorage.getItem("SP_NO_FIREBASE_SYNC")==="1";
const IS_WORTSCHATZ_EXERCISE=/\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\//.test(path);
const IS_FRAGEN_EXERCISE=path.includes("/fragen-A1/")||path.includes("/fragen/");
const IS_VERBEN_EXERCISE=path.includes("/verben-A1/");
const LIGHT_FIREBASE_PAGE=IS_WORTSCHATZ_EXERCISE||IS_FRAGEN_EXERCISE||IS_VERBEN_EXERCISE;
const FULL_FIREBASE=!NO_FIREBASE_SYNC&&!LIGHT_FIREBASE_PAGE;
if(NO_FIREBASE_SYNC){window.spCanWriteFirebaseProgress=()=>false;window.SP_NO_FIREBASE_SYNC=true;console.warn("SprachPilot: Firebase-Sync ist für Diagnose deaktiviert. Mit ?firebase=1 wieder aktivieren.")}
const isL3T2Page=path.indexOf("/wortschatz/A1-Lektion-3/Thema-2/")>=0;
if(isL3T2Page){const style=document.createElement("style");style.textContent="#accountStrip,.account-strip{display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:0!important}";document.head.appendChild(style)}
if(SP_USER&&!isL3T2Page){document.addEventListener("DOMContentLoaded",()=>{try{renderAccountStrip()}catch(e){}})}
if(SP_USER&&isL3T2Page){document.addEventListener("DOMContentLoaded",()=>{const el=document.getElementById("accountStrip");if(el){el.innerHTML="";el.style.display="none";el.style.height="0";el.style.overflow="hidden"}})}
window.addEventListener("SP_PROFILE_SYNCED",()=>{try{renderAccountStrip()}catch(e){}});
import("/js/microphone-fallback.js?v=1").catch(()=>{});
import("/js/back-button-fix.js?v=1").catch(()=>{});
import("/js/release-helper.js?v=10").catch(()=>{});
import("/js/sp-help-flow.js?v=1").catch(()=>{});
if(path.includes("/wortschatz/A1-Lektion-4/")){window.addEventListener("load",()=>setTimeout(()=>{const s=document.createElement("script");s.src="/js/l4-answer-aliases.js?v=1";document.body.appendChild(s)},400))}
if(FULL_FIREBASE){
  setTimeout(()=>{import("/js/global-sync.js?v=2").then(m=>m.startGlobalSync()).then(()=>{try{renderAccountStrip()}catch(e){}}).catch(()=>{})},1000);
  setTimeout(()=>{import("/js/scoring.js?v=5").catch(()=>{})},1300);
}
if(NO_FIREBASE_SYNC){
  document.addEventListener("DOMContentLoaded",()=>{try{const d=document.createElement("div");d.textContent="Firebase-Sync aus";d.style.cssText="position:fixed;right:10px;bottom:10px;z-index:9999;background:#fff3cd;border:1px solid #f59e0b;color:#7c2d12;border-radius:999px;padding:7px 10px;font:700 12px Arial";document.body.appendChild(d)}catch(e){}});
}
if(!NO_FIREBASE_SYNC&&IS_FRAGEN_EXERCISE){setTimeout(()=>import("/js/fragen-progress-sync.js?v=2").catch(()=>{}),2200)}
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(path)){setTimeout(()=>import("/wortschatz/index-release-lock.js?v=12").catch(()=>{}),800)}
if(IS_VERBEN_EXERCISE){
  import("/verben-A1/js/release-bridge.js?v=8").catch(()=>{});
  import("/verben-A1/js/scoring-bridge.js?v=5").catch(()=>{});
  if(!NO_FIREBASE_SYNC)window.addEventListener("load",()=>setTimeout(()=>{let s=document.createElement("script");s.src="/verben-A1/js/cloud-progress-sync.js?v=5";document.body.appendChild(s);s=document.createElement("script");s.src="/verben-A1/js/verb-overview-dedupe.js?v=1";document.body.appendChild(s)},2200));
}
if(IS_FRAGEN_EXERCISE){import("/fragen-A1/scoring-bridge.js?v=2").catch(()=>{})}