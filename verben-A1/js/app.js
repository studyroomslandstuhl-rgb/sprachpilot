function spLoginRole(){return localStorage.getItem("SP_LOGIN_ROLE") || localStorage.getItem("SP_USER_ROLE") || "student"}
function spIsTeacherPreview(){return spLoginRole()==="teacher" && (localStorage.getItem("SP_TEACHER_PREVIEW")==="1" || localStorage.getItem("SP_TEACHER_MODE")==="1")}
function spDashboardHref(){return spLoginRole()==="teacher"?"/teacher/index.html":"/student-dashboard/index.html"}
function spLogout(){
  ["SP_LOGIN_ROLE","SP_USER_ROLE","SP_USER_PROFILE","SP_STUDENT_PROFILE","SP_TEACHER_PREVIEW","SP_TEACHER_MODE","SP_PREVIEW_COURSE","SP_PREVIEW_COURSE_CODE"].forEach(k=>localStorage.removeItem(k));
  location.href="/index.html";
}
function spLogoHtml(){return `<img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot" onerror="this.replaceWith(document.createTextNode('SP'))">`}
function renderHeader(){
  const h=$("spHeader");
  if(!h)return;
  h.innerHTML=`
    <div class="topbar">
      <a class="brand" href="/index.html">
        <span class="logo">${spLogoHtml()}</span>
        <span><strong>SprachPilot</strong><small>Verben A1</small></span>
      </a>
      <div class="top-actions">
        <a class="btn secondary" href="${spDashboardHref()}">Dashboard</a>
        <a class="btn secondary" href="/profile/index.html">Profil</a>
        <button class="secondary" onclick="spLogout()">Abmelden</button>
      </div>
    </div>`;
}
function renderSideMenu(){if(typeof renderMenu==="function")return renderMenu();const m=$("spMenu");if(!m)return;m.innerHTML=`<div class="menu-card"><button onclick="renderHome()">Übersicht</button><button onclick="startAssessment()">Verben einschätzen</button></div>`}
function statusBox(){return `<div class="progress-card"><div class="circle">${overall()}%</div><div class="progress-main"><h2>Dein Fortschritt</h2><div class="small">${state.active.length} aktive Verben · ${totalStars()} vollständig gelernt · ${(state.practicePool||[]).length} im Übungsblock</div><div class="progress-line"><div class="progress-fill" style="width:${overall()}%"></div></div><div class="small">Ziel: alle aktiven Verben in allen Aufgaben sicher können.</div></div></div>`}
function taskCard(skill,icon,fn,num){
  const done=taskDone(skill);
  const p=queuedProgress(skill);
  return `<button class="task-card ${done?"done-card":""}" onclick="${fn}()">
    <span class="num">${num}. ${VERB_SKILL_LABELS[skill]}</span>
    <span class="big-icon">${icon}</span>
    <span class="small">Übe diese Aufgabe mit deinem aktuellen Verben-Paket.</span>
    <span class="task-progress-line"><span class="task-progress-fill" style="width:${p.pct}%"></span></span>
    <span class="task-status">${done?"Fertig":p.done+"/"+p.total+" · "+p.pct+"%"}</span>
    <span class="start">${done?"Wiederholen":"Starten"}</span>
  </button>`;
}
function renderHome(){
  state.phase="home";
  migrateState();
  if(!state.active.length){
    $("app").innerHTML=`<h2>Start</h2><p>Schätze zuerst neue Verben ein. Wörter, die du nicht kannst, kommen im Üben öfter vor.</p><button class="success" onclick="startAssessment()">Neue Verben einschätzen</button>`;
    return;
  }
  $("app").innerHTML=`<h2>Aufgabenübersicht</h2>${spIsTeacherPreview()?"<div class='teacher-preview-banner'>Lehrer-Vorschau: Du kannst alles testen. Es werden keine Schülerpunkte gespeichert.</div>":""}${statusBox()}<div class="ok"><strong>System:</strong> Unsichere Verben kommen 1× in den Übungsblock, unbekannte Verben 2×.</div><div class="task-grid">${taskCard("karteikarte","K","flashcards",1)}${taskCard("memory","M","memory",2)}${taskCard("bild_verb","B→V","quiz",3)}${taskCard("verb_bild","V→B","verbToImage",4)}${taskCard("schreiben","S","writeVerb",5)}${taskCard("hoeren_schreiben","H→S","hearWrite",6)}${taskCard("hoeren_sprechen","H→R","hearSpeak",7)}${taskCard("bild_sprechen","B→R","imageSpeak",8)}${taskCard("satz_puzzle","P","sentencePuzzle",9)}</div><button class="secondary" onclick="startAssessment()">Weitere Verben einschätzen</button><button class="warning" onclick="buildPracticePool();renderHome()">Übungsblock neu mischen</button><button class="danger" onclick="resetCurrentPackage()">Aktuelles Paket zurücksetzen</button>`;
}
function resetCurrentPackage(){if(!confirm("Nur das aktuelle Verben-Paket zurücksetzen? Dein Profil bleibt erhalten."))return;state.active=[];state.practicePool=[];state.taskQueues={};state.taskDoneSets={};saveState();renderHome()}
function openNextTask(){const order=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle"];for(const s of order){if(!taskDone(s)){({karteikarte:flashcards,memory, bild_verb:quiz, verb_bild:verbToImage, schreiben:writeVerb, hoeren_schreiben:hearWrite, hoeren_sprechen:hearSpeak, bild_sprechen:imageSpeak, satz_puzzle:sentencePuzzle})[s]();return}}renderHome()}
async function boot(){renderHeader();if(!loadProfile())return;await loadState();if(!state.active.length&&unusedVerbs().length)startAssessment();else renderHome();renderSideMenu();renderAndHydrate()}
document.addEventListener("DOMContentLoaded",boot);
