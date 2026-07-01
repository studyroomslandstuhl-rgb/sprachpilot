import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
const isL3T2Page=location.pathname.indexOf("/wortschatz/A1-Lektion-3/Thema-2/")>=0;
if(SP_USER){
  document.addEventListener("DOMContentLoaded",()=>{
    if(isL3T2Page){
      const el=document.getElementById("accountStrip");
      if(el){el.textContent="";el.style.display="none";}
    }else{
      renderAccountStrip();
    }
  });
}
import("/js/activity-tracker.js?v=1").catch(()=>{});
import("/js/scoring.js?v=4").catch(()=>{});
import("/js/release-helper.js?v=5").catch(()=>{});
import("/js/sp-help-flow.js?v=1").catch(()=>{});
if(/^\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname)){
  import("/wortschatz/index-release-lock.js?v=11").catch(()=>{});
}
if(location.pathname.includes("/verben-A1/")){
  import("/verben-A1/js/scoring-bridge.js?v=5").catch(()=>{});
}
if(location.pathname.includes("/fragen-A1/")||location.pathname.includes("/fragen/")){
  import("/fragen-A1/scoring-bridge.js?v=2").catch(()=>{});
}