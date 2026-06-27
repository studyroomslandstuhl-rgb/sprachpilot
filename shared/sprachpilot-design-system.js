/* SprachPilot Global Design System v15 */
(function(){
  function safe(value){
    return String(value || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }
  function readJson(key){
    try{return JSON.parse(localStorage.getItem(key)||sessionStorage.getItem(key)||"null");}
    catch(e){return null;}
  }
  function getLoginRole(){
    return localStorage.getItem("SP_LOGIN_ROLE") || sessionStorage.getItem("SP_LOGIN_ROLE") || localStorage.getItem("SP_USER_ROLE") || "";
  }
  function getActiveProfile(){
    const role=getLoginRole();
    if(role==="teacher") return readJson("SP_TEACHER_PROFILE") || readJson("SP_USER_PROFILE") || {};
    if(role==="student") return readJson("SP_STUDENT_PROFILE") || readJson("SP_USER_PROFILE") || {};
    return readJson("SP_STUDENT_PROFILE") || readJson("SP_TEACHER_PROFILE") || readJson("SP_USER_PROFILE") || {};
  }
  function dashboardHref(){
    return getLoginRole()==="teacher" ? "/teacher/index.html" : "/student-dashboard/index.html";
  }
  function logoPath(){ return "/assets/logo/sprachpilot-logo.png"; }
  function clearPreview(){
    ["SP_TEACHER_PREVIEW","SP_TEACHER_PREVIEW_COURSE","SP_PREVIEW_COURSE","SP_PREVIEW_MODE","SP_TEACHER_MODE"].forEach(k=>{
      localStorage.removeItem(k); sessionStorage.removeItem(k);
    });
  }
  function logoutAll(){
    ["SP_LOGIN_ROLE","SP_USER_ROLE","SP_USER_PROFILE","SP_STUDENT_PROFILE","SP_TEACHER_PROFILE","SP_KEEP_LOGGED_IN","SP_TEACHER_EMAIL","SP_TEACHER_ID","SP_TEACHER_UID"].forEach(k=>{
      localStorage.removeItem(k); sessionStorage.removeItem(k);
    });
    clearPreview();
    location.href="/index.html";
  }
  function renderHeader(target, options){
    const el=typeof target==="string"?document.querySelector(target):target;
    if(!el) return;
    const opts=options||{};
    const profile=getActiveProfile();
    const name=[profile.vorname||profile.firstName||profile.name||"", profile.nachname||profile.lastName||""].join(" ").trim() || (getLoginRole()==="teacher"?"Lehrer/in":"Schüler/in");
    const course=profile.kurs||profile.kursnummer||profile.courseCode||"";
    const title=opts.title||"SprachPilot";
    const subtitle=opts.subtitle||"Deutsch lernen";
    const backHref=opts.backHref||"/index.html";
    const showReset=!!opts.showReset;
    el.innerHTML=`
      <div class="sp-topbar-main">
        <a class="sp-brand" href="/index.html">
          <img class="sp-logo-img" src="${logoPath()}" alt="SprachPilot Logo">
          <div><div class="sp-brand-title">SprachPilot</div><div class="sp-subtitle">${safe(title)} · ${safe(subtitle)}</div></div>
        </a>
        <div class="sp-account">
          <span class="sp-pill">${safe(name)}${course?" · "+safe(course):""}</span>
          <a class="sp-btn secondary" href="${dashboardHref()}">Dashboard</a>
          <a class="sp-btn secondary" href="/profile/index.html">Profil</a>
          <button class="sp-btn secondary" type="button" onclick="SprachPilotDesign.logoutAll()">Abmelden</button>
        </div>
      </div>
      <nav class="sp-nav">
        <a class="sp-btn secondary" href="${backHref}">Zurück</a>
        ${opts.overviewHref?`<a class="sp-btn secondary" href="${opts.overviewHref}">Übersicht</a>`:""}
        ${opts.statsHref?`<a class="sp-btn secondary" href="${opts.statsHref}">Statistik</a>`:""}
        ${showReset?`<button class="sp-btn danger" type="button" onclick="resetThemeProgress && resetThemeProgress()">Fortschritte löschen</button>`:""}
      </nav>`;
  }
  window.SprachPilotDesign={safe,readJson,getLoginRole,getActiveProfile,dashboardHref,logoPath,clearPreview,logoutAll,renderHeader};
})();
