import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
if(SP_USER){
  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}
import("/js/activity-tracker.js?v=1").catch(e=>console.warn("Aktivität konnte nicht getrackt werden",e));
if(/\/wortschatz\/A1-Lektion-3\//.test(location.pathname)){
  import("/js/l3-points-guard.js?v=1").catch(e=>console.warn("Lektion 3 Punkte-Guard konnte nicht geladen werden",e));
}
