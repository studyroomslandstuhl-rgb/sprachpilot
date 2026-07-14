import "/js/sp-assets.js?v=3";
import "/js/sp-image-guard.js?v=4";
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
const IS_WORTSCHATZ_THEME_OVERVIEW=/\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\/?(?:index\.html)?$/i.test(path);
const IS_WORTSCHATZ_LESSON_OVERVIEW=/\/wortschatz\/A\d-Lektion-\d+\/?(?:index\.html)?$/i.test(path);
const IS_FRAGEN_EXERCISE=path.includes("/fragen-A1/")||path.includes("/fragen/");
const IS_VERBEN_EXERCISE=path.includes("/verben-A1/");
const IS_L3T1=path.includes("/wortschatz/A1-Lektion-3/Thema-1/");
const IS_L3T2=path.includes("/wortschatz/A1-Lektion-3/Thema-2/");
const IS_L5=path.includes("/wortschatz/A1-Lektion-5/");
const IS_L6T2=path.includes("/wortschatz/A1-Lektion-6/Thema-2/");
const HAS_OWN_PROGRESS_SYSTEM=IS_L3T2||IS_L5||IS_L6T2;
const IS_WORTSCHATZ_TASK_PAGE=IS_WORTSCHATZ_EXERCISE&&!IS_WORTSCHATZ_THEME_OVERVIEW;
const NEEDS_EXAM_UNLOCK_FIX=IS_WORTSCHATZ_TASK_PAGE&&!IS_L3T1&&!HAS_OWN_PROGRESS_SYSTEM&&!IS_L6T2;
const USES_STANDARD_PROGRESS=(IS_WORTSCHATZ_TASK_PAGE&&!IS_L3T1&&!HAS_OWN_PROGRESS_SYSTEM)||IS_FRAGEN_EXERCISE;
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
setTimeout(normalizeExamIcons,250);
setTimeout(normalizeExamIcons,1400);
if(!IS_L3T1&&!IS_L5){
  try{
    let iconTimer=null;
    new MutationObserver(()=>{
      clearTimeout(iconTimer);
      iconTimer=setTimeout(normalizeExamIcons,100);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
}
window.addEventListener("SP_PROFILE_SYNCED",()=>setTimeout(installHeaderOnce,0));
import("/js/microphone-fallback.js?v=1").catch(()=>{});
import("/js/back-button-fix.js?v=1").catch(()=>{});
if(!IS_L6T2)import("/js/release-helper.js?v=11").catch(()=>{});
import("/js/sp-help-flow.js?v=1").catch(()=>{});
if(IS_L3T1){
  import("/wortschatz/A1-Lektion-3/Thema-1/l3t1-stability.js?v=3").catch(()=>{});
  import("/wortschatz/A1-Lektion-3/Thema-1/l3t1-image-fix.js?v=3").catch(()=>{});
}
if(IS_L3T2){
  import("/wortschatz/A1-Lektion-3/Thema-2/l3t2-task-fix.js?v=3").catch(()=>{});
}
if(USES_STANDARD_PROGRESS){
  import("/js/sp-progress-standard.js?v=4").catch(()=>{});
}
if(NEEDS_EXAM_UNLOCK_FIX&&!PERFORMANCE_SYNC_OFF){
  setTimeout(()=>import("/js/exam-unlock-fix.js?v=4").catch(()=>{}),120);
}
if(path.includes("/wortschatz/A1-Lektion-4/")){window.addEventListener("load",()=>setTimeout(()=>{const s=document.createElement("script");s.src="/js/l4-answer-aliases.js?v=1";document.body.appendChild(s)},500))}
if(FULL_FIREBASE){
  if(!LIGHT_FIREBASE_PAGE)setTimeout(()=>{import("/js/global-sync.js?v=2").then(m=>m.startGlobalSync()).catch(()=>{})},1500);
  const scoringDelay=IS_L5?1800:300;
  setTimeout(()=>{import("/js/scoring.js?v=10").catch(()=>{})},scoringDelay);
}
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(path)){setTimeout(()=>import("/wortschatz/index-release-lock.js?v=12").catch(()=>{}),900)}
if(IS_VERBEN_EXERCISE){
  import("/verben-A1/js/release-bridge.js?v=10").catch(()=>{});
  if(!PERFORMANCE_SYNC_OFF){
    import("/verben-A1/js/scoring-bridge.js?v=6").catch(()=>{});
    window.addEventListener("load",()=>setTimeout(()=>{const s=document.createElement("script");s.src="/verben-A1/js/verb-overview-dedupe.js?v=1";document.body.appendChild(s)},2500));
  }
}
if(!PERFORMANCE_SYNC_OFF&&IS_FRAGEN_EXERCISE){
  setTimeout(()=>import("/js/fragen-progress-sync.js?v=3").catch(()=>{}),2400);
  import("/fragen-A1/scoring-bridge.js?v=3").catch(()=>{});
}