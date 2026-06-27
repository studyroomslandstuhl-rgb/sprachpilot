function spLoginRole(){return localStorage.getItem("SP_LOGIN_ROLE") || localStorage.getItem("SP_USER_ROLE") || "student"}
function spIsTeacherPreview(){return spLoginRole()==="teacher" && (localStorage.getItem("SP_TEACHER_PREVIEW")==="1" || localStorage.getItem("SP_TEACHER_MODE")==="1")}
function spDashboardHref(){return spLoginRole()==="teacher"?"/teacher/index.html":"/student-dashboard/index.html"}
function spCurrentProfile(){try{return JSON.parse(localStorage.getItem(spLoginRole()==="teacher"?"SP_TEACHER_PROFILE":"SP_STUDENT_PROFILE")||localStorage.getItem("SP_USER_PROFILE")||"{}")}catch(e){return {}}}
function spDisplayName(){const p=spCurrentProfile();return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.email||"Schüler/in"}
function spCourseLabel(){const p=spCurrentProfile();return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_PREVIEW_COURSE_CODE")||""}
function spLogout(){["SP_LOGIN_ROLE","SP_USER_ROLE","SP_USER_PROFILE","SP_STUDENT_PROFILE","SP_TEACHER_PREVIEW","SP_TEACHER_MODE","SP_PREVIEW_COURSE","SP_PREVIEW_COURSE_CODE"].forEach(k=>localStorage.removeItem(k));location.href="/index.html"}
function spLogoHtml(){return `<img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot" onerror="this.replaceWith(document.createTextNode('SP'))">`}
function renderHeader(){
  const h=$("spHeader");
  if(!h)return;
  const course=spCourseLabel();
  h.innerHTML=`
    <div class="topbar-main">
      <a class="brand" href="/index.html">
        <span class="logo">${spLogoHtml()}</span>
        <span><h1>SprachPilot</h1><span class="subtitle">Verben A1</span></span>
      </a>
      <div class="account-tools">
        <span class="account-pill">${safeText(spDisplayName())}${course?" · "+safeText(course):""}</span>
        <a class="account-link" href="${spDashboardHref()}">Dashboard</a>
        <a class="account-link" href="/profile/index.html">Profil</a>
        <button class="account-btn" onclick="spLogout()">Abmelden</button>
      </div>
    </div>
    <nav class="nav">
      <a class="btn secondary" href="/index.html">← Zurück</a>
      <button class="btn secondary" onclick="renderHome()">Übersicht</button>
      <button class="btn secondary" onclick="openVerbTask('renderStudentDashboard')">Statistik</button>
      <button class="btn danger-btn" onclick="resetCurrentPackage()">Fortschritte löschen</button>
    </nav>`;
}
function setHomeArea(){const a=$("app");if(a)a.className="app-area home-view"}
function setTaskArea(){const a=$("app");if(a)a.className="app-area card"}
function openVerbTask(name){
  setTaskArea();
  const map={flashcards,memory,quiz,verbToImage,writeVerb,hearWrite,hearSpeak,imageSpeak,sentencePuzzle,startAssessment,renderStudentDashboard};
  if(map[name])map[name]();
}
function renderSideMenu(){if(typeof renderMenu==="function")return renderMenu()}
function statusBox(){return `<section class="card progress-card"><div class="circle">${overall()}%</div><div class="progress-main"><h2>Dein Fortschritt</h2><p class="small">${state.active.length} aktive Verben · ${totalStars()} vollständig gelernt · ${(state.practicePool||[]).length} im Übungsblock</p><div class="progress"><div class="bar" style="width:${overall()}%"></div></div><p class="small">Ziel: alle aktiven Verben in allen Aufgaben sicher können.</p></div></section>`}
function taskCard(skill,icon,fn,num,desc){
  const done=taskDone(skill);
  const p=queuedProgress(skill);
  return `<button class="module task-card ${done?"done-card":""}" onclick="openVerbTask('${fn}')">
    <span class="num">${num}. ${VERB_SKILL_LABELS[skill]}</span>
    <span class="icon big-icon">${icon}</span>
    <p class="task-desc">${desc}</p>
    <div class="progress"><div class="bar" style="width:${p.pct}%"></div></div>
    <div class="small task-status">${done?"100%":p.pct+"%"}</div>
    <div class="start">${done?"Wiederholen":"Starten"}</div>
  </button>`;
}
function renderHome(){
  state.phase="home";
  migrateState();
  setHomeArea();
  if(!state.active.length){
    $("app").innerHTML=`<section class="card"><h2>Start</h2><p class="small">Schätze zuerst neue Verben ein. Wörter, die du nicht kannst, kommen im Üben öfter vor.</p><button class="btn green" onclick="openVerbTask('startAssessment')">Neue Verben einschätzen</button></section>`;
    return;
  }
  $("app").innerHTML=`
    ${spIsTeacherPreview()?"<section class='teacher-preview-banner'>Lehrer-Vorschau: Du kannst alles testen. Es werden keine Schülerpunkte gespeichert.</section>":""}
    ${statusBox()}
    <section class="grid">
      ${taskCard("karteikarte","K","flashcards",1,"Lerne die Verben mit Karteikarten.")}
      ${taskCard("memory","M","memory",2,"Finde Verb und Bild als Paar.")}
      ${taskCard("bild_verb","B→V","quiz",3,"Sieh das Bild und wähle das Verb.")}
      ${taskCard("verb_bild","V→B","verbToImage",4,"Lies das Verb und wähle das Bild.")}
      ${taskCard("schreiben","S","writeVerb",5,"Schreibe das deutsche Verb.")}
      ${taskCard("hoeren_schreiben","H→S","hearWrite",6,"Höre und schreibe das Verb.")}
      ${taskCard("hoeren_sprechen","H→R","hearSpeak",7,"Höre und sprich das Verb.")}
      ${taskCard("bild_sprechen","B→R","imageSpeak",8,"Sieh das Bild und sprich das Verb.")}
      ${taskCard("satz_puzzle","P","sentencePuzzle",9,"Baue einen Satz mit dem Verb.")}
    </section>
    <section class="card"><div class="menu-actions"><button class="btn secondary" onclick="openVerbTask('startAssessment')">Weitere Verben einschätzen</button><button class="btn warning" onclick="buildPracticePool();renderHome()">Übungsblock neu mischen</button></div></section>`;
}
function resetCurrentPackage(){if(!confirm("Nur das aktuelle Verben-Paket zurücksetzen? Dein Profil bleibt erhalten."))return;state.active=[];state.practicePool=[];state.taskQueues={};state.taskDoneSets={};saveState();renderHome()}
function openNextTask(){const order=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle"];const map={karteikarte:"flashcards",memory:"memory",bild_verb:"quiz",verb_bild:"verbToImage",schreiben:"writeVerb",hoeren_schreiben:"hearWrite",hoeren_sprechen:"hearSpeak",bild_sprechen:"imageSpeak",satz_puzzle:"sentencePuzzle"};for(const s of order){if(!taskDone(s)){openVerbTask(map[s]);return}}renderHome()}
async function boot(){renderHeader();if(!loadProfile())return;await loadState();if(!state.active.length&&unusedVerbs().length){setTaskArea();startAssessment()}else renderHome();renderSideMenu();renderAndHydrate()}
document.addEventListener("DOMContentLoaded",boot);
