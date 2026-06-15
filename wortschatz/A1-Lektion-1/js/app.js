import { VERBS } from "../data/verbs.js";
import { VERB_TRANSLATIONS } from "../data/translations.js";
import { SENTENCES } from "../data/sentences.js";
import { loadTeacherAssignment, loadProgress, saveProgress } from "./firebase.js";
import { normalizeAssignment, detectNewVerbs } from "./teacherConfig.js";
import { migrateProgress, addNewAssignedVerbs, markSkill, recalc, clearProgress, verbPercent } from "./progress.js";
import { renderSelection } from "./selection.js";
import { renderTaskOverview, openTask } from "./router.js";
import { progressHtml } from "../shared/ui.js";

const app = document.getElementById("app");
const profileBox = document.getElementById("profileBox");
const progressBox = document.getElementById("progressBox");
const teacherNotice = document.getElementById("teacherNotice");

let profile = null;
let assignment = null;
let progress = null;

function loadProfile(){
  try{ profile = JSON.parse(localStorage.getItem("SP_USER_PROFILE") || "null"); }catch(e){ profile=null; }

  // Wichtig: Die Verben-Seite darf nie leer bleiben.
  // Wenn noch kein SprachPilot-Profil vorhanden ist, startet sie im Gastmodus.
  if(!profile){
    profile = {
      userId:"guest",
      studentId:"guest",
      vorname:"Gast",
      nachname:"",
      kurs:"demo",
      muttersprache:"Englisch"
    };
    profileBox.innerHTML = `<div class="info">Gastmodus: Kein Profil gefunden. Die Aufgaben werden trotzdem angezeigt.</div>`;
  }else{
    profileBox.innerHTML = `<div class="ok">Eingeloggt: <strong>${profile.vorname||""} ${profile.nachname||""}</strong> | Kurs: ${profile.kurs||profile.kursnummer||""}</div>`;
  }
  return true;
}


function localKey(){ return "SP_VERB_A1_V2_" + (profile?.studentId || profile?.userId || "guest"); }

function saveLocal(){ localStorage.setItem(localKey(), JSON.stringify(progress)); }

async function saveAll(){
  recalc(progress, assignment);
  saveLocal();
  renderProgress();
  try{
    await saveProgress(profile, progress);
  }catch(e){
    console.warn("Firebase speichern nicht möglich, lokale Speicherung bleibt aktiv:", e);
  }
}


function renderProgress(){
  recalc(progress, assignment);
  progressBox.innerHTML = `
    <strong>Aktuelles Set:</strong> ${assignment.title || assignment.assignmentId}<br>
    <strong>Verben:</strong> ${progress.activeVerbs.length} |
    <strong>Sterne:</strong> ${progress.stars} |
    <strong>Fortschritt:</strong> ${progress.overallPercent}%
    ${progressHtml(progress.overallPercent)}
  `;
}

function verbsNeedingSelection(){
  const rated = new Set([...progress.known, ...progress.unsure, ...progress.unknown]);
  return progress.activeVerbs.filter(v=>!rated.has(v));
}

function renderHome(){
  renderProgress();
  if(verbsNeedingSelection().length){
    renderSelection({
      app,
      verbs:VERBS,
      translations:VERB_TRANSLATIONS,
      lang:profile.muttersprache || "Englisch",
      progress,
      onChange: async (p)=>{ progress=p; await saveAll(); renderHome(); },
      onDone: renderHome
    });
    return;
  }
  renderTaskOverview({
    app, assignment, progress,
    openTask:(taskId)=>openTask(taskId, taskContext())
  });
}

function taskContext(){
  return {
    app,
    assignment,
    progress,
    verbs:VERBS,
    translations:VERB_TRANSLATIONS,
    sentences:SENTENCES,
    lang:profile.muttersprache || "Englisch",
    nextPracticeVerb(taskId){
      const candidates = progress.activeVerbs
        .filter(v => !progress.known.includes(v) || taskId !== "flashcards")
        .sort((a,b)=>verbPercent(progress,a,assignment.enabledTasks)-verbPercent(progress,b,assignment.enabledTasks));
      return candidates[0] || progress.activeVerbs[0];
    },
    async finishTask(verbId, taskId, good){
      markSkill(progress, verbId, taskId, good);
      await saveAll();
      app.innerHTML = good
        ? `<div class="ok">Richtig.</div><button class="success" id="next">Weiter</button>`
        : `<div class="no">Noch einmal üben. Richtig: <strong>${verbId}</strong></div><button id="next">Weiter</button>`;
      app.querySelector("#next").onclick = renderHome;
    }
  };
}

async function boot(){
  try{
    loadProfile();

    let remoteAssignment = null;
    try{ remoteAssignment = await loadTeacherAssignment(profile); }
    catch(e){ console.warn("Lehrer-Konfiguration nicht geladen:", e); }
    assignment = normalizeAssignment(remoteAssignment);

    let loaded = null;
    try{ loaded = JSON.parse(localStorage.getItem(localKey()) || "null"); }catch(e){}

    let cloud = null;
    try{ cloud = await loadProgress(profile); }
    catch(e){ console.warn("Cloud-Fortschritt nicht geladen:", e); }

    progress = migrateProgress(cloud || loaded, assignment);

    const newVerbs = detectNewVerbs(assignment, progress);
    if(newVerbs.length){
      progress = addNewAssignedVerbs(progress, newVerbs);
      teacherNotice.innerHTML = `<div class="info"><strong>Sie haben neue Verben zu üben:</strong> ${newVerbs.length}</div>`;
    }else{
      teacherNotice.innerHTML = "";
    }

    await saveAll();
    renderHome();
  }catch(e){
    console.error(e);
    app.innerHTML = `<div class="no"><strong>Startfehler:</strong><br>${String(e.message || e)}</div>`;
  }
}

document.getElementById("menuHome").onclick = renderHome;
document.getElementById("menuProgress").onclick = () => {
  app.innerHTML = `<h2>Fortschritt</h2>
    <div class="grid">${progress.activeVerbs.map(v=>`<div class="verb-card"><strong>${v}</strong><br>${verbPercent(progress,v,assignment.enabledTasks)}%</div>`).join("")}</div>`;
};
document.getElementById("deleteProgress").onclick = async () => {
  if(!confirm("Alle Verben-Fortschritte wirklich löschen?")) return;
  progress = clearProgress(assignment);
  await saveAll();
  renderHome();
};

boot();
