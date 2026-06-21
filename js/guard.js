import { getActiveProfile, refreshActiveProfile, renderAccountStrip, logout, loginUrlForCurrent } from "/js/auth.js";

window.logout=logout;

let SP_USER=getActiveProfile();

if(!SP_USER){
  location.href=loginUrlForCurrent();
}else{
  // Wichtig: erst Firebase-Profil aktualisieren, dann Aufgaben-JS laufen lassen.
  // So kommen Änderungen wie Muttersprache Arabisch sofort an.
  await refreshActiveProfile();
  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}
