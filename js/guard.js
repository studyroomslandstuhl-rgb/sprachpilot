import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
if(SP_USER){
  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}
import("/js/activity-tracker.js?v=1").catch(()=>{});
import("/js/scoring.js?v=1").catch(()=>{});
if(location.pathname.includes("/wortschatz/A1-Lektion-3/")){
  import("/wortschatz/A1-Lektion-3/shared/lektion3-topbar.js?v=1").catch(()=>{});
}
if(location.pathname.includes("/verben-A1/")){
  import("/verben-A1/js/scoring-bridge.js?v=1").catch(()=>{});
}
if(location.pathname.includes("/fragen-A1/")||location.pathname.includes("/fragen/")){
  import("/fragen-A1/scoring-bridge.js?v=1").catch(()=>{});
}
