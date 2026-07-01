import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
const path=location.pathname;
const isL3T2Page=path.indexOf("/wortschatz/A1-Lektion-3/Thema-2/")>=0;
if(isL3T2Page){
  const style=document.createElement("style");
  style.textContent="#accountStrip,.account-strip{display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:0!important}";
  document.head.appendChild(style);
}
if(SP_USER&&!isL3T2Page){
  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}
if(SP_USER&&isL3T2Page){
  document.addEventListener("DOMContentLoaded",()=>{
    const el=document.getElementById("accountStrip");
    if(el){el.innerHTML="";el.style.display="none";el.style.height="0";el.style.overflow="hidden";}
  });
}
import("/js/activity-tracker.js?v=1").catch(()=>{});
import("/js/scoring.js?v=4").catch(()=>{});
import("/js/release-helper.js?v=5").catch(()=>{});
import("/js/sp-help-flow.js?v=1").catch(()=>{});
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(path)){
  import("/wortschatz/index-release-lock.js?v=11").catch(()=>{});
}
if(path.includes("/verben-A1/")){
  import("/verben-A1/js/release-bridge.js?v=8").catch(()=>{});
  import("/verben-A1/js/scoring-bridge.js?v=5").catch(()=>{});
}
if(path.includes("/fragen-A1/")||path.includes("/fragen/")){
  import("/fragen-A1/scoring-bridge.js?v=2").catch(()=>{});
}