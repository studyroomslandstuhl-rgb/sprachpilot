import "/js/sp-assets.js?v=3";
import "/js/session-restore.js?v=1";
import { requireLogin, logout } from "/js/auth.js";
import { installSpHeader } from "/js/sp-header.js";
window.logout=logout;
const SP_USER=requireLogin();
const path=location.pathname;
const qs=new URLSearchParams(location.search);
if(qs.has("nofirebase"))localStorage.setItem("SP_NO_FIREBASE_SYNC","1");
if(qs.has("firebase"))localStorage.removeItem("SP_NO_FIREBASE_SYNC");
const IS_WORTSCHATZ_EXERCISE=/\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\//.test(path);
const IS_WORTSCHATZ_LESSON_OVERVIEW=/\/wortschatz\/A\d-Lektion-\d+\/?(?:index\.html)?$/i.test(path);
const IS_FRAGEN_EXERCISE=path.includes("/fragen-A1/")||path.includes("/fragen/");
const IS_VERBEN_EXERCISE=path.includes("/verben-A1/");
const NEEDS_EXAM_UNLOCK_FIX=/\/wortschatz\/A1-Lektion-[345]\/Thema-\d+\//.test(path);
const LIGHT_FIREBASE_PAGE=IS_WORTSCHATZ_EXERCISE||IS_FRAGEN_EXERCISE||IS_VERBEN_EXERCISE;
const NO_FIREBASE_SYNC=qs.has("nofirebase")||localStorage.getItem("SP_NO_FIREBASE_SYNC")==="1";
const PERFORMANCE_SYNC_OFF=NO_FIREBASE_SYNC;
const FULL_FIREBASE=!PERFORMANCE_SYNC_OFF;
if(PERFORMANCE_SYNC_OFF){
  window.spCanWriteFirebaseProgress=()=>false;
  window.SP_NO_FIREBASE_SYNC=true;
  window.SP_PERFORMANCE_MODE=true;
}
function shouldInstallGlobalHeader(){
  if(IS_WORTSCHATZ_LESSON_OVERVIEW)return false;
  return !document.querySelector(".topbar") && !document.querySelector("header.topbar");
}
function installHeaderOnce(){
  if(!SP_USER)return;
  if(!shouldInstallGlobalHeader())return;
  try{installSpHeader()}catch(e){}
}
function setStar(el){if(el&&el.textContent!=="⭐")el.textContent="⭐"}
function normalizeExamIcons(){
  document.querySelectorAll(".exam-icon").forEach(setStar);
  document.querySelectorAll("a,button,.module,.task-card").forEach(el=>{
    const text=String(el.textContent||"");
    const href=String(el.getAttribute?.("href")||"");
    if(!/Prüfung|Pruefung/i.test(text)&&!/pruefung|exam/i.test(href))return;
    setStar(el.querySelector?.(".icon,.big-icon"));
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installHeaderOnce);else installHeaderOnce();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalizeExamIcons);else normalizeExamIcons();
setTimeout(normalizeExamIcons,200);
setTimeout(normalizeExamIcons,1200);
try{new MutationObserver(()=>normalizeExamIcons()).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
window.addEventListener("SP_PROFILE_SYNCED",()=>setTimeout(installHeaderOnce,0));
import("/js/microphone-fallback.js?v=1").catch(()=>{});
import("/js/back-button-fix.js?v=1").catch(()=>{});
import("/js/release-helper.js?v=10").catch(()=>{});
import("/js/sp-help-flow.js?v=1").catch(()=>{});
if(LIGHT_FIREBASE_PAGE){
  import("/js/sp-progress-standard.js?v=1").catch(()=>{});
}
if(NEEDS_EXAM_UNLOCK_FIX&&!PERFORMANCE_SYNC_OFF){
  setTimeout(()=>import("/js/exam-unlock-fix.js?v=2").catch(()=>{}),120);
}
if(path.includes("/wortschatz/A1-Lektion-4/")){window.addEventListener("load",()=>setTimeout(()=>{const s=document.createElement("script");s.src="/js/l4-answer-aliases.js?v=1";document.body.appendChild(s)},500))}
if(FULL_FIREBASE){
  if(!LIGHT_FIREBASE_PAGE)setTimeout(()=>{import("/js/global-sync.js?v=2").then(m=>m.startGlobalSync()).catch(()=>{})},1500);
  setTimeout(()=>{import("/js/scoring.js?v=10").catch(()=>{})},300);
}
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(path)){setTimeout(()=>import("/wortschatz/index-release-lock.js?v=12").catch(()=>{}),900)}
if(IS_VERBEN_EXERCISE){
  import("/verben-A1/js/release-bridge.js?v=8").catch(()=>{});
  if(!PERFORMANCE_SYNC_OFF){
    import("/verben-A1/js/scoring-bridge.js?v=6").catch(()=>{});
    window.addEventListener("load",()=>setTimeout(()=>{let s=document.createElement("script");s.src="/verben-A1/js/cloud-progress-sync.js?v=6";document.body.appendChild(s);s=document.createElement("script");s.src="/verben-A1/js/verb-overview-dedupe.js?v=1";document.body.appendChild(s)},2500));
  }
}
if(!PERFORMANCE_SYNC_OFF&&IS_FRAGEN_EXERCISE){
  setTimeout(()=>import("/js/fragen-progress-sync.js?v=3").catch(()=>{}),2400);
  import("/fragen-A1/scoring-bridge.js?v=3").catch(()=>{});
}
