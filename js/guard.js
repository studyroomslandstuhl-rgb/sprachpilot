import { requireLogin, renderAccountStrip, logout } from "/js/auth.js";
window.logout=logout;
const SP_USER=requireLogin();
if(SP_USER){
  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}
