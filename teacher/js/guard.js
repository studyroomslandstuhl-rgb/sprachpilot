import { getActiveProfile, refreshActiveProfile, renderAccountStrip, logout, loginUrlForCurrent } from "/js/auth.js";

window.logout=logout;

let SP_USER=getActiveProfile();

if(!SP_USER){
  location.href=loginUrlForCurrent();
}else if(SP_USER.teacherMode){
  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}else{
  const before=localStorage.getItem("SP_MOTHER_LANGUAGE_CODE") || localStorage.getItem("motherLanguage") || "";
  await refreshActiveProfile();
  const after=localStorage.getItem("SP_MOTHER_LANGUAGE_CODE") || localStorage.getItem("motherLanguage") || "";

  if(before && after && before!==after && sessionStorage.getItem("SP_LANG_RELOADED")!=="1"){
    sessionStorage.setItem("SP_LANG_RELOADED","1");
    location.reload();
  }else{
    sessionStorage.removeItem("SP_LANG_RELOADED");
  }

  document.addEventListener("DOMContentLoaded",()=>renderAccountStrip());
}
