import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
if(SP_USER){
  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}
import("/js/activity-tracker.js?v=1").catch(e=>console.warn("activity helper failed",e));
import("/js/scoring.js?v=1").catch(e=>console.warn("scoring helper failed",e));
