function spSafe(value){return String(value||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function spProfile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"{}")}catch(e){return {}}}
function spWho(){const p=spProfile();const first=p.vorname||p.firstName||"";const last=p.nachname||p.lastName||"";return `${first} ${last}`.trim()||"Schüler/in"}
function spCourse(){const p=spProfile();return p.kurs||p.kursnummer||p.courseCode||""}
function spLogout(){
  ["SP_USER_PROFILE","SP_KEEP_LOGGED_IN","SP_LOGIN_ROLE","SP_TEACHER_PREVIEW","SP_PREVIEW_COURSE","SP_TEACHER_PREVIEW_COURSE"].forEach(k=>localStorage.removeItem(k));
  location.href="/index.html";
}
function renderL3Header(config={}){
  const header=document.querySelector(".topbar");
  if(!header) return;
  const title=config.title||"A1 Lektion 3";
  const subtitle=config.subtitle||"Einkaufen";
  const backHref=config.backHref||"../index.html";
  const overviewHref=config.overviewHref||"index.html";
  const statsHref=config.statsHref||"statistik.html";
  const course=spCourse();
  header.innerHTML=`
    <div class="topbar-main">
      <a class="brand" href="/index.html">
        <div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div>
        <div><h1>SprachPilot</h1><div class="subtitle">${spSafe(title)} · ${spSafe(subtitle)}</div></div>
      </a>
      <div class="account-tools">
        <span class="account-pill">${spSafe(spWho())}${course?" · "+spSafe(course):""}</span>
        <a class="account-link" href="/student-dashboard/index.html">Dashboard</a>
        <a class="account-link" href="/profile/index.html">Profil</a>
        <button class="account-link account-btn" onclick="spLogout()">Abmelden</button>
      </div>
    </div>
    <nav class="nav">
      <a class="btn secondary" href="${backHref}">Zurück</a>
      <a class="btn secondary" href="${overviewHref}">Übersicht</a>
      ${statsHref?`<a class="btn secondary" href="${statsHref}">Statistik</a>`:""}
    </nav>`;
}
function moduleCard({href,num,title,desc,words=[],progress=null,status="Starten",icon=""}){
  const wordHtml=words.length?`<div class="word-list">${words.map(w=>`<span class="word">${spSafe(w)}</span>`).join("")}</div>`:"";
  const progressHtml=progress===null?"":`<div class="progress"><div class="bar" style="width:${Math.max(0,Math.min(100,progress))}%"></div></div><div class="small">${Math.round(progress)}%</div>`;
  return `<a class="module" href="${href}"><div class="num">${num}. ${spSafe(title)}</div><div class="icon">${spSafe(icon)}</div><p>${spSafe(desc)}</p>${wordHtml}${progressHtml}<div class="start">${spSafe(status)}</div></a>`;
}
function progressCard({percent=0,doneText="",goal=""}){
  const p=Math.max(0,Math.min(100,Math.round(percent)||0));
  return `<section class="card progress-card"><div class="circle">${p}%</div><div class="progress-main"><h2>Dein Fortschritt</h2><p class="small">${spSafe(doneText)}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><p class="small">${spSafe(goal)}</p></div></section>`;
}
