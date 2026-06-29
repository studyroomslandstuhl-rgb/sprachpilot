function renderHeader(){
  const h=$("spHeader");if(!h)return;
  const name=profile?`${safeText(profile.vorname||"")} ${safeText(profile.nachname||"")}`.trim():"";
  const kurs=profile?safeText(profile.kurs||profile.kursnummer||""):"";
  h.innerHTML=`<div class="topbar">
    <a class="brand" href="/index.html"><span class="logo">SP</span><span><strong>SprachPilot</strong><small>Verben A1</small></span></a>
    <div class="top-actions">
      <span class="account-mini">${name||"Schüler/in"}${kurs?" · "+kurs:""}</span>
      <button class="secondary" onclick="renderHome()">← Zurück</button>
      <button class="secondary" onclick="renderHome()">Übersicht</button>
      <button class="secondary" onclick="renderStudentDashboard()">Statistik</button>
      <button class="secondary" onclick="handleAssessmentClick()">Verben einschätzen</button>
      <button class="warning" onclick="resetCurrentPackage()">Fortschritte löschen</button>
      <button class="secondary" onclick="spVerbLogout()">Abmelden</button>
    </div>
  </div>`;
}
function spVerbLogout(){localStorage.removeItem("SP_USER_PROFILE");location.href="/index.html"}
function renderSideMenu(){const m=$("spMenu");if(m)m.innerHTML=""}
function statusBox(){return `<div class="stats"><div class="stat"><div>Fortschritt</div><div class="num">${overall()}%</div></div><div class="stat"><div>Gelernt</div><div class="num">${(state.learned||[]).length}</div></div><div class="stat"><div>Aktiv</div><div class="num">${state.active.length}/20</div></div><div class="stat"><div>Prüfung</div><div class="num">${state.exam&&state.exam.passed?"100%":(allPracticeTasksDone()?"offen":"gesperrt")}</div></div></div>`}
function taskCard(skill,icon,fn){const done=taskDone(skill);return `<button class="task-card ${done?"done-card":""}" onclick="${fn}()"><span class="big-icon">${icon}</span><strong>${VERB_SKILL_LABELS[skill]}</strong><span class="task-status">${done?"Erledigt ✓":queuedProgress(skill).pct+"%"}</span></button>`}
function examCard(){const ready=allPracticeTasksDone();const passed=state.exam&&state.exam.passed;return `<button class="task-card ${passed?"done-card":""}" ${ready?"onclick=\"startVerbExam()\"":"disabled"}><span class="big-icon">🧪</span><strong>Prüfung</strong><span class="task-status">${passed?"100% ✓":ready?"Starten":"gesperrt"}</span></button>`}
function renderHome(){
  state.phase="home";state.currentTask=null;migrateState();
  if(!state.active.length){$("app").innerHTML=`<h2>Start</h2><p>Schätze zuerst 20 neue Verben ein. Danach übst du diese Verben in allen Aufgaben.</p><button class="success" onclick="handleAssessmentClick()">Neue Verben einschätzen</button>`;saveState();return}
  $("app").innerHTML=`<h2>Aufgabenübersicht</h2>${statusBox()}<div class="ok"><strong>Aktueller Block:</strong> Maximal 20 Verben. Neue Verben kannst du erst nach 100% in der Prüfung einschätzen.</div><div class="task-grid">${taskCard("karteikarte","🃏","flashcards")}${taskCard("memory","🧠","memory")}${taskCard("bild_verb","🖼️","quiz")}${taskCard("verb_bild","🔁","verbToImage")}${taskCard("schreiben","✍️","writeVerb")}${taskCard("hoeren_schreiben","👂","hearWrite")}${taskCard("hoeren_sprechen","🎤","hearSpeak")}${taskCard("bild_sprechen","🗣️","imageSpeak")}${taskCard("satz_puzzle","🧩","sentencePuzzle")}${taskCard("konjugieren","🔤","conjugationTask")}${examCard()}</div>`;
  saveState();
}
function resetCurrentPackage(){if(!confirm("Fortschritte im aktuellen Verben-Paket löschen?"))return;state.active=[];resetPackageTasks();saveState();renderHome()}
function openNextTask(){const order=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle","konjugieren"];for(const s of order){if(!taskDone(s)){({karteikarte:flashcards,memory, bild_verb:quiz, verb_bild:verbToImage, schreiben:writeVerb, hoeren_schreiben:hearWrite, hoeren_sprechen:hearSpeak, bild_sprechen:imageSpeak, satz_puzzle:sentencePuzzle, konjugieren:conjugationTask})[s]();return}}renderHome()}
function resumePhase(){
  if(state.phase==="assessment"){renderAssessment();return true}
  if(state.phase==="memory" && state.memoryCards && state.memoryCards.length){renderMemory();return true}
  const map={karteikarte:flashcards,bild_verb:quiz,verb_bild:verbToImage,schreiben:writeVerb,hoeren_schreiben:hearWrite,hoeren_sprechen:hearSpeak,bild_sprechen:imageSpeak,satz_puzzle:sentencePuzzle,konjugieren:conjugationTask,pruefung:resumeVerbExam};
  if(state.phase&&map[state.phase]){map[state.phase]();return true}
  return false;
}
async function boot(){if(!loadProfile())return;renderHeader();await loadState();renderHeader();renderSideMenu();if(!state.active.length&&unusedVerbs().length)startAssessment();else if(!resumePhase())renderHome();renderAndHydrate()}
document.addEventListener("DOMContentLoaded",boot);
