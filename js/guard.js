import "/js/header-stability.js?v=1";
import "/js/sp-assets.js?v=4";
import "/js/session-restore.js?v=1";
import { requireLogin, renderAccountStrip, logout } from "/js/auth.js?v=step136-login-fix";

(function(){
  const CANONICAL_HOST="sprachpilot.org";
  const WWW_HOST="www.sprachpilot.org";
  const MIGRATION_KEY="SP_DOMAIN_PROGRESS_MIGRATION_V1";
  const progressKey=/^(SP_USER_PROFILE|SP_STUDENT_PROFILE|SP_KEEP_LOGGED_IN|SP_STUDENT_ID|SP_LOGIN_ROLE|SP_ACTIVE_ROLE|SP_USER_ROLE|motherLanguage|muttersprache|SP_L\d|SP_TASK_STATE_|SP_PROGRESS_|SP_POINTS_|SP_SCORE_RUN_|SP_DASHBOARD_PROGRESS|A1_ACTIVE_SESSION)/;
  function collectLocalProgress(){
    const data={from:location.hostname,createdAt:Date.now(),items:{}};
    try{
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k&&progressKey.test(k))data.items[k]=localStorage.getItem(k);
      }
    }catch(e){}
    return data;
  }
  function restoreMigratedProgress(){
    try{
      if(!window.name||!String(window.name).includes(MIGRATION_KEY))return;
      const payload=JSON.parse(window.name);
      const data=payload&&payload[MIGRATION_KEY];
      if(!data||!data.items)return;
      Object.entries(data.items).forEach(([k,v])=>{
        if(!progressKey.test(k)||v===null||v===undefined)return;
        const old=localStorage.getItem(k);
        const shouldWrite=old===null||old===""||(/SP_TASK_STATE_|SP_L\d|SP_PROGRESS_|SP_POINTS_|SP_SCORE_RUN_/.test(k)&&String(v).length>String(old||"").length);
        if(shouldWrite)localStorage.setItem(k,v);
      });
      window.name="";
      sessionStorage.setItem("SP_DOMAIN_MIGRATION_DONE","1");
    }catch(e){}
  }
  if(location.hostname===WWW_HOST){
    try{window.name=JSON.stringify({[MIGRATION_KEY]:collectLocalProgress()});}catch(e){}
    location.replace("https://"+CANONICAL_HOST+location.pathname+location.search+location.hash);
  }else{
    restoreMigratedProgress();
  }
})();

window.logout=logout;
const SP_USER=requireLogin();
const path=location.pathname;
const qs=new URLSearchParams(location.search);
if(qs.has("nofirebase"))localStorage.setItem("SP_NO_FIREBASE_SYNC","1");
if(qs.has("firebase"))localStorage.removeItem("SP_NO_FIREBASE_SYNC");
const IS_WORTSCHATZ_EXERCISE=/\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\//.test(path);
const IS_FRAGEN_EXERCISE=path.includes("/fragen-A1/")||path.includes("/fragen/");
const IS_VERBEN_EXERCISE=path.includes("/verben-A1/");
const LIGHT_FIREBASE_PAGE=IS_WORTSCHATZ_EXERCISE||IS_FRAGEN_EXERCISE||IS_VERBEN_EXERCISE;
const EXPLICIT_NO_FIREBASE_SYNC=qs.has("nofirebase")||localStorage.getItem("SP_NO_FIREBASE_SYNC")==="1";
const FULL_FIREBASE=!EXPLICIT_NO_FIREBASE_SYNC&&!LIGHT_FIREBASE_PAGE;
if(EXPLICIT_NO_FIREBASE_SYNC){
  window.spCanWriteFirebaseProgress=()=>false;
  window.SP_NO_FIREBASE_SYNC=true;
  window.SP_PERFORMANCE_MODE=true;
}else{
  window.SP_LIGHT_FIREBASE_PAGE=LIGHT_FIREBASE_PAGE;
  window.SP_PERFORMANCE_MODE=false;
  window.SP_NO_FIREBASE_SYNC=false;
}
const isL3T2Page=path.indexOf("/wortschatz/A1-Lektion-3/Thema-2/")>=0;
if(isL3T2Page){const style=document.createElement("style");style.textContent="#accountStrip,.account-strip{display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:0!important}";document.head.appendChild(style)}
if(SP_USER&&!isL3T2Page){document.addEventListener("DOMContentLoaded",()=>{try{renderAccountStrip()}catch(e){}})}
if(SP_USER&&isL3T2Page){document.addEventListener("DOMContentLoaded",()=>{const el=document.getElementById("accountStrip");if(el){el.innerHTML="";el.style.display="none";el.style.height="0";el.style.overflow="hidden"}})}
window.addEventListener("SP_PROFILE_SYNCED",()=>{try{renderAccountStrip()}catch(e){}});
import("/js/microphone-fallback.js?v=1").catch(()=>{});
import("/js/back-button-fix.js?v=1").catch(()=>{});
import("/js/release-helper.js?v=10").catch(()=>{});
import("/js/sp-help-flow.js?v=1").catch(()=>{});
if(path.includes("/wortschatz/A1-Lektion-4/")){window.addEventListener("load",()=>setTimeout(()=>{const s=document.createElement("script");s.src="/js/l4-answer-aliases.js?v=1";document.body.appendChild(s)},500))}
if(!EXPLICIT_NO_FIREBASE_SYNC){
  setTimeout(()=>import("/js/progress.js?v=restore-20260710").catch(()=>{}),700);
}
if(FULL_FIREBASE){
  setTimeout(()=>{import("/js/global-sync.js?v=2").then(m=>m.startGlobalSync()).then(()=>{try{renderAccountStrip()}catch(e){}}).catch(()=>{})},1500);
  setTimeout(()=>{import("/js/scoring.js?v=6").catch(()=>{})},1800);
}
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(path)){setTimeout(()=>import("/wortschatz/index-release-lock.js?v=12").catch(()=>{}),900)}
if(IS_VERBEN_EXERCISE){
  import("/verben-A1/js/release-bridge.js?v=8").catch(()=>{});
  if(!EXPLICIT_NO_FIREBASE_SYNC){
    import("/verben-A1/js/scoring-bridge.js?v=6").catch(()=>{});
    window.addEventListener("load",()=>setTimeout(()=>{let s=document.createElement("script");s.src="/verben-A1/js/cloud-progress-sync.js?v=6";document.body.appendChild(s);s=document.createElement("script");s.src="/verben-A1/js/verb-overview-dedupe.js?v=1";document.body.appendChild(s)},2500));
  }
}
if(!EXPLICIT_NO_FIREBASE_SYNC&&IS_FRAGEN_EXERCISE){
  setTimeout(()=>import("/js/fragen-progress-sync.js?v=3").catch(()=>{}),2400);
  import("/fragen-A1/scoring-bridge.js?v=3").catch(()=>{});
}