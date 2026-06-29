function logoHtml(){
  const raw="https://raw.githubusercontent.com/studyroomslandstuhl-rgb/sprachpilot/4f1ebc6391558b144fbad1cfcb18a758d5634160/assets/logo/sprachpilot-logo.png";
  return `<img class="brand-logo" src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot" onerror="this.onerror=null;this.src='${raw}'">`;
}

function renderHeader(){
  const h=$("spHeader"); if(!h)return;
  const name=profile?`${safeText(profile.vorname||"")} ${safeText(profile.nachname||"")}`.trim():"";
  const kurs=profile?safeText(profile.kurs||profile.kursnummer||""):"";
  h.innerHTML=`
    <div class="topbar-main">
      <a class="brand" href="/index.html">
        ${logoHtml()}
        <div>
          <h1>SprachPilot</h1>
          <div class="subtitle">Verben A1</div>
        </div>
      </a>
      <div class="account-tools">
        <span class="account-pill">${name||"Schüler/in"}${kurs?" · "+kurs:""}</span>
        <a class="account-link" href="/student-dashboard/index.html">Dashboard</a>
        <a class="account-link" href="/profile/index.html">Profil</a>
        <button class="account-link account-btn" onclick="spVerbLogout()">Abmelden</button>
      </div>
    </div>
    <nav class="nav">
      <button class="btn secondary" onclick="renderHome()">← Zurück</button>
      <button class="btn secondary" onclick="renderHome()">Übersicht</button>
      <button class="btn secondary" onclick="renderStudentDashboard()">Statistik</button>
      <button class="btn secondary" onclick="handleAssessmentClick()">Weitere Verben einschätzen</button>
      <button class="btn danger-btn" onclick="resetCurrentPackage()">Fortschritte löschen</button>
    </nav>`;
}

function spVerbLogout(){
  localStorage.removeItem("SP_USER_PROFILE");
  localStorage.removeItem("SP_STUDENT_PROFILE");
  localStorage.removeItem("SP_KEEP_LOGGED_IN");
  localStorage.removeItem("SP_LOGIN_ROLE");
  location.href="/index.html";
}

function renderSideMenu(){const m=$("spMenu");if(m)m.innerHTML=""}

function statusBox(){
  const pct=overall();
  const examTxt=state.exam&&state.exam.passed?"Prüfung 100%":(allPracticeTasksDone()?"Prüfung offen":"Prüfung gesperrt");
  return `<section class="card progress-card">
    <div class="circle">${pct}%</div>
    <div class="progress-main">
      <h2>Dein Fortschritt</h2>
      <div class="small">${state.active.length} aktive Verben · ${(state.learned||[]).length} vollständig gelernt · ${examTxt}</div>
      <div class="progress"><div class="bar" style="width:${pct}%"></div></div>
      <p class="small">Ziel: alle aktiven Verben in allen Aufgaben üben und die Prüfung mit 100% abschließen.</p>
    </div>
  </section>`;
}

function taskDescription(skill){
  return {
    karteikarte:"Lerne das Verb mit Bild.",
    memory:"Finde Bild und Verb.",
    bild_verb:"Sieh das Bild und wähle das Verb.",
    verb_bild:"Lies das Verb und wähle das Bild.",
    schreiben:"Schreibe das Verb zum Bild.",
    hoeren_schreiben:"Höre und schreibe das Verb.",
    hoeren_sprechen:"Höre und sprich das Verb.",
    bild_sprechen:"Sieh das Bild und sprich das Verb.",
    satz_puzzle:"Höre und baue den Satz.",
    konjugieren:"Schreibe die richtige Form."
  }[skill]||"Übe das Verb.";
}

function taskCard(skill,icon,fn,num){
  const done=taskDone(skill);
  const p=queuedProgress(skill);
  return `<button class="module task-card ${done?"done-card":""}" onclick="${fn}()">
    <div><div class="num">${num}. ${VERB_SKILL_LABELS[skill]}</div></div>
    <div class="icon big-icon">${icon}</div>
    <p>${taskDescription(skill)}</p>
    <div>
      <div class="progress"><div class="bar" style="width:${done?100:p.pct}%"></div></div>
      <div class="small">${done?"100%":p.pct+"%"}</div>
      <div class="start">Starten</div>
    </div>
  </button>`;
}

function examCard(){
  const ready=allPracticeTasksDone();
  const passed=state.exam&&state.exam.passed;
  return `<button class="module task-card ${passed?"done-card":""}" ${ready?"onclick=\"startVerbExam()\"":"disabled"}>
    <div><div class="num">11. Prüfung</div></div>
    <div class="icon big-icon">✅</div>
    <p>Prüfe die aktiven Verben.</p>
    <div>
      <div class="progress"><div class="bar" style="width:${passed?100:0}%"></div></div>
      <div class="small">${passed?"100%":ready?"offen":"gesperrt"}</div>
      <div class="start">Starten</div>
    </div>
  </button>`;
}

function renderHome(){
  const appNode=$("app"); if(appNode) appNode.classList.remove("card");
  state.phase="home";
  state.currentTask=null;
  migrateState();
  if(!state.active.length){
    $("app").innerHTML=`${statusBox()}<section class="card"><h2>Verben einschätzen</h2><p class="small">Schätze zuerst bis zu 20 neue Verben ein. Danach übst du diese Verben in allen Aufgaben.</p><div class="actions"><button class="btn green" onclick="handleAssessmentClick()">Verben einschätzen</button></div></section>`;
    saveState();
    return;
  }
  $("app").innerHTML=`${statusBox()}<section class="card"><div class="grid task-grid">${taskCard("karteikarte","🃏","flashcards",1)}${taskCard("memory","🧠","memory",2)}${taskCard("bild_verb","🖼️","quiz",3)}${taskCard("verb_bild","🔁","verbToImage",4)}${taskCard("schreiben","✍️","writeVerb",5)}${taskCard("hoeren_schreiben","👂","hearWrite",6)}${taskCard("hoeren_sprechen","🎤","hearSpeak",7)}${taskCard("bild_sprechen","🗣️","imageSpeak",8)}${taskCard("satz_puzzle","🧩","sentencePuzzle",9)}${taskCard("konjugieren","🔤","conjugationTask",10)}${examCard()}</div></section>`;
  saveState();
}

function resetCurrentPackage(){
  if(!confirm("Fortschritte im aktuellen Verben-Paket löschen?"))return;
  state.active=[];
  resetPackageTasks();
  saveState();
  renderHome();
}

function openNextTask(){
  const order=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle","konjugieren"];
  for(const s of order){
    if(!taskDone(s)){
      ({karteikarte:flashcards,memory, bild_verb:quiz, verb_bild:verbToImage, schreiben:writeVerb, hoeren_schreiben:hearWrite, hoeren_sprechen:hearSpeak, bild_sprechen:imageSpeak, satz_puzzle:sentencePuzzle, konjugieren:conjugationTask})[s]();
      return;
    }
  }
  renderHome();
}

function resumePhase(){
  if(state.phase==="assessment"){renderAssessment();return true}
  if(state.phase==="memory" && state.memoryCards && state.memoryCards.length){renderMemory();return true}
  const map={karteikarte:flashcards,bild_verb:quiz,verb_bild:verbToImage,schreiben:writeVerb,hoeren_schreiben:hearWrite,hoeren_sprechen:hearSpeak,bild_sprechen:imageSpeak,satz_puzzle:sentencePuzzle,konjugieren:conjugationTask,pruefung:resumeVerbExam};
  if(state.phase&&map[state.phase]){map[state.phase]();return true}
  return false;
}

async function boot(){
  if(!loadProfile())return;
  renderHeader();
  await loadState();
  renderHeader();
  renderSideMenu();
  if(!resumePhase())renderHome();
  renderAndHydrate();
}

document.addEventListener("DOMContentLoaded",boot);
