import "/js/session-restore.js?v=20260831-central3";
import { logout } from "/js/auth.js";
import { verifySecureAccess } from "/js/secure-access-gate.js?v=20260831-central4";
import { installSpHeader } from "/js/sp-header.js?v=theme-standard2";

const SECURE_ACCESS=await verifySecureAccess({allowTeacher:true,redirect:true,mark:true});
const SP_USER=SECURE_ACCESS?.profile||null;
const IS_SECURE_STUDENT=SECURE_ACCESS?.type==='student';

const path=location.pathname;
if(/\/wortschatz\/A1-Lektion-(?:3|4|5)(?:\/|$)/i.test(path))import("/js/lesson-button-colors.js?v=2").catch(()=>{});
const IS_L6T3_PATH=path.includes("/wortschatz/A1-Lektion-6/Thema-3/");
if(!IS_L6T3_PATH){import("/js/sp-teacher-unlocked.js?v=3").catch(()=>{});import("/js/sp-assets.js?v=4").catch(()=>{});import("/js/sp-image-guard.js?v=5").catch(()=>{})}
window.logout=logout;
const qs=new URLSearchParams(location.search);
const HAD_LEGACY_NO_FIREBASE=localStorage.getItem("SP_NO_FIREBASE_SYNC")==="1";
localStorage.removeItem("SP_NO_FIREBASE_SYNC");
if(HAD_LEGACY_NO_FIREBASE)sessionStorage.setItem("SP_SYNC_RECOVERY_NEEDED","1");
if(qs.has("nofirebase"))sessionStorage.setItem("SP_NO_FIREBASE_SYNC_SESSION","1");else sessionStorage.removeItem("SP_NO_FIREBASE_SYNC_SESSION");
if(qs.has("firebase")){sessionStorage.removeItem("SP_NO_FIREBASE_SYNC_SESSION");sessionStorage.removeItem("SP_SYNC_RECOVERY_NEEDED")}
const IS_WORTSCHATZ_EXERCISE=/\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\//.test(path);
const IS_WORTSCHATZ_THEME_OVERVIEW=/\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\/?(?:index\.html)?$/i.test(path);
const IS_WORTSCHATZ_LESSON_OVERVIEW=/\/wortschatz\/A\d-Lektion-\d+\/?(?:index\.html)?$/i.test(path);
const IS_FRAGEN_EXERCISE=path.includes("/fragen-A1/")||path.includes("/fragen/");
const IS_VERBEN_EXERCISE=path.includes("/verben/");
const IS_PERFEKT_EXERCISE=path.includes("/perfekt/");
const IS_L3T1=path.includes("/wortschatz/A1-Lektion-3/Thema-1/");
const IS_L3T2=path.includes("/wortschatz/A1-Lektion-3/Thema-2/");
const IS_L5=path.includes("/wortschatz/A1-Lektion-5/");
const IS_L6T2=path.includes("/wortschatz/A1-Lektion-6/Thema-2/");
const IS_L6T3=IS_L6T3_PATH;
const IS_L6T4=path.includes("/wortschatz/A1-Lektion-6/Thema-4/");
const IS_L7=path.includes("/wortschatz/A1-Lektion-7/");
const IS_L8=path.includes("/wortschatz/A1-Lektion-8/");
const IS_L7_THEME_OVERVIEW=IS_L7&&IS_WORTSCHATZ_THEME_OVERVIEW;
const IS_L8_THEME_OVERVIEW=IS_L8&&IS_WORTSCHATZ_THEME_OVERVIEW;
const HAS_OWN_PROGRESS_SYSTEM=IS_L3T2||IS_L5||IS_L6T2||IS_L6T3||IS_L6T4||IS_L7||IS_L8;
const IS_WORTSCHATZ_TASK_PAGE=IS_WORTSCHATZ_EXERCISE&&!IS_WORTSCHATZ_THEME_OVERVIEW;
const NEEDS_EXAM_UNLOCK_FIX=IS_WORTSCHATZ_TASK_PAGE&&!IS_L3T1&&!HAS_OWN_PROGRESS_SYSTEM&&!IS_L6T2;
const USES_STANDARD_PROGRESS=(IS_WORTSCHATZ_TASK_PAGE&&!IS_L3T1&&!HAS_OWN_PROGRESS_SYSTEM)||IS_FRAGEN_EXERCISE;
const LIGHT_FIREBASE_PAGE=IS_WORTSCHATZ_EXERCISE||IS_FRAGEN_EXERCISE||IS_VERBEN_EXERCISE||IS_PERFEKT_EXERCISE;
const NO_FIREBASE_SYNC=qs.has("nofirebase")||sessionStorage.getItem("SP_NO_FIREBASE_SYNC_SESSION")==="1";
const PERFORMANCE_SYNC_OFF=NO_FIREBASE_SYNC;
const FULL_FIREBASE=!PERFORMANCE_SYNC_OFF;
if(IS_L6T2||IS_L6T3||IS_L6T4)import("/js/l6-image-format-fix.js?v=2").catch(()=>{});
if(PERFORMANCE_SYNC_OFF){window.spCanWriteFirebaseProgress=()=>false;window.SP_NO_FIREBASE_SYNC=true;window.SP_PERFORMANCE_MODE=true}
let aliasRepairPromise=Promise.resolve(null);
if(FULL_FIREBASE&&IS_SECURE_STUDENT){
 aliasRepairPromise=import("/student-dashboard/progress-alias-unifier.js?v=20260831-central3").then(module=>module.unifyProgressAliases()).catch(error=>{console.warn("Verteilte Schüler-Fortschritte konnten noch nicht zusammengeführt werden",error);return null});
 window.SP_PROGRESS_ALIAS_READY=aliasRepairPromise;
}
if(FULL_FIREBASE&&IS_SECURE_STUDENT){aliasRepairPromise.finally(()=>import("/js/account-progress-sync.js?v=20260831-central4").then(module=>module.startAccountProgressSync()).catch(error=>console.warn("Account-Fortschritt Sync konnte nicht gestartet werden",error)))}
function shouldInstallGlobalHeader(){if(IS_WORTSCHATZ_LESSON_OVERVIEW)return false;if(IS_WORTSCHATZ_EXERCISE)return true;return !document.querySelector(".topbar")&&!document.querySelector("header.topbar")}
function installHeaderOnce(){if(!SECURE_ACCESS?.ok)return;if(!shouldInstallGlobalHeader())return;try{installSpHeader()}catch(e){}}
function setStar(el){if(el&&el.textContent!=="⭐")el.textContent="⭐"}
function normalizeExamIcons(){document.querySelectorAll(".exam-icon").forEach(setStar);document.querySelectorAll("a,button,.module,.task-card").forEach(el=>{const text=String(el.textContent||""),href=String(el.getAttribute?.("href")||"");if(!/Prüfung|Pruefung/i.test(text)&&!/pruefung|exam/i.test(href))return;setStar(el.querySelector?.(".icon,.big-icon"))})}
let overviewProbe=null;
function overviewButtonClass(nav){const sample=nav.querySelector("a.l7-btn,button.l7-btn,a.btn,button.btn");if(sample?.classList.contains("l7-btn"))return"l7-btn secondary";return"btn secondary"}
async function ensureThemeOverviewButton(){if(!IS_WORTSCHATZ_EXERCISE||IS_L8)return;if(document.querySelector('a[href*="uebersicht.html"]'))return;const nav=document.querySelector(".topbar nav,.l7-topbar nav,header.topbar nav,nav.nav");if(!nav)return;if(!overviewProbe){const url=new URL("uebersicht.html",location.href);overviewProbe=fetch(url,{method:"HEAD",cache:"no-store"}).then(response=>response.ok).catch(()=>false)}if(!await overviewProbe)return;if(document.querySelector('a[href*="uebersicht.html"]'))return;const link=document.createElement("a");link.href="uebersicht.html";link.textContent="Übersicht";link.className=overviewButtonClass(nav);const reset=[...nav.querySelectorAll("button")].find(button=>/Fortschritt|löschen|zurücksetzen/i.test(String(button.textContent||"")));nav.insertBefore(link,reset||null)}
function scheduleThemeOverviewButton(){setTimeout(()=>ensureThemeOverviewButton(),0)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installHeaderOnce);else installHeaderOnce();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",normalizeExamIcons);else normalizeExamIcons();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scheduleThemeOverviewButton);else scheduleThemeOverviewButton();
window.addEventListener("load",scheduleThemeOverviewButton);setTimeout(normalizeExamIcons,250);setTimeout(normalizeExamIcons,1400);setTimeout(ensureThemeOverviewButton,300);setTimeout(ensureThemeOverviewButton,1400);setTimeout(ensureThemeOverviewButton,3200);
if(!IS_L3T1&&!IS_L5&&!IS_L6T3){try{let iconTimer=null;new MutationObserver(()=>{clearTimeout(iconTimer);iconTimer=setTimeout(normalizeExamIcons,100)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}}
window.addEventListener("SP_PROFILE_SYNCED",()=>setTimeout(installHeaderOnce,0));
function delayedImport(src,delay){setTimeout(()=>import(src).catch(()=>{}),delay)}
if(IS_L6T3){delayedImport("/js/microphone-fallback.js?v=1",1200);delayedImport("/js/back-button-fix.js?v=5",1600);delayedImport("/js/sp-help-flow.js?v=1",1800)}else{import("/js/microphone-fallback.js?v=1").catch(()=>{});import("/js/back-button-fix.js?v=5").catch(()=>{});import("/js/sp-help-flow.js?v=1").catch(()=>{})}
import("/js/release-helper.js?v=20260824-release13").catch(()=>{});
if(IS_L3T1){import("/wortschatz/A1-Lektion-3/Thema-1/l3t1-stability.js?v=3").catch(()=>{});import("/wortschatz/A1-Lektion-3/Thema-1/l3t1-image-fix.js?v=3").catch(()=>{})}
if(IS_L3T2){import("/wortschatz/A1-Lektion-3/Thema-2/l3t2-task-fix.js?v=3").catch(()=>{})}
if(IS_L6T2){import("/wortschatz/A1-Lektion-6/Thema-2/l6t2-stability.js?v=1").catch(()=>{})}
if(IS_L6T3){import("/wortschatz/A1-Lektion-6/Thema-3/l6t3-theme-score-v2.js?v=3").catch(()=>{})}
if((IS_L6T4||IS_L7_THEME_OVERVIEW||IS_L8_THEME_OVERVIEW)&&!PERFORMANCE_SYNC_OFF)import("/js/progress.js?v=20260831-central3").catch(()=>{});
if(USES_STANDARD_PROGRESS)import("/js/sp-progress-standard.js?v=20260831-central3").catch(()=>{});
if(NEEDS_EXAM_UNLOCK_FIX&&!PERFORMANCE_SYNC_OFF){setTimeout(()=>import("/js/exam-unlock-fix.js?v=4").catch(()=>{}),120)}
if(path.includes("/wortschatz/A1-Lektion-4/")){window.addEventListener("load",()=>setTimeout(()=>{const s=document.createElement("script");s.src="/js/l4-answer-aliases.js?v=1";document.body.appendChild(s)},500))}
if(FULL_FIREBASE){if(!LIGHT_FIREBASE_PAGE)setTimeout(()=>{import("/js/global-sync.js?v=2").then(m=>m.startGlobalSync()).catch(()=>{})},1500);if(!IS_L6T3&&!IS_L7&&!IS_L8){const scoringDelay=IS_L5?1800:300;setTimeout(()=>{import("/js/scoring.js?v=20260831-central3").catch(()=>{})},scoringDelay)}}
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(path)){setTimeout(()=>import("/wortschatz/index-release-lock.js?v=12").catch(()=>{}),900)}
if(!PERFORMANCE_SYNC_OFF&&IS_FRAGEN_EXERCISE){setTimeout(()=>import("/js/fragen-progress-sync.js?v=3").catch(()=>{}),2400);import("/fragen-A1/scoring-bridge.js?v=3").catch(()=>{})}