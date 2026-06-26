function spSafe(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function spGetProfile() {
  try {
    return JSON.parse(localStorage.getItem("SP_USER_PROFILE") || "{}");
  } catch (e) {
    return {};
  }
}

function renderSprachPilotHeader(config = {}) {
  const header = document.querySelector(".topbar");
  if (!header) return;

  const profile = spGetProfile();

  const firstName = profile.vorname || profile.firstName || "";
  const lastName = profile.nachname || profile.lastName || "";
  const course = profile.kurs || profile.kursnummer || profile.courseCode || "";

  const who = `${firstName} ${lastName}`.trim() || "Schüler/in";

  const title = config.title || "SprachPilot";
  const subtitle = config.subtitle || "A1 Lektion 4";
  const backHref = config.backHref || "index.html";
  const overviewHref = config.overviewHref || "uebersicht.html";
  const statsHref = config.statsHref || "statistik.html";

  header.innerHTML = `
    <div class="topbar-main">
      <a class="brand" href="/index.html">
        <div class="logo">SP</div>
        <div>
          <h1>SprachPilot</h1>
          <div class="subtitle">${spSafe(title)} · ${spSafe(subtitle)}</div>
        </div>
      </a>

      <div class="account-tools">
        <span class="account-pill">${spSafe(who)}${course ? " · " + spSafe(course) : ""}</span>
        <a class="account-link" href="/student-dashboard/index.html">📊 Dashboard</a>
        <a class="account-link" href="/profile/index.html">👤 Profil</a>
        <button class="account-link account-btn" onclick="spLogout()">🚪 Abmelden</button>
      </div>
    </div>

    <nav class="nav">
      <a class="btn secondary" href="${backHref}">← Zurück</a>
      <a class="btn secondary" href="${overviewHref}">Übersicht</a>
      <a class="btn secondary" href="${statsHref}">Statistik</a>
      <button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button>
    </nav>
  `;
}

function spLogout() {
  localStorage.removeItem("SP_USER_PROFILE");
  localStorage.removeItem("SP_KEEP_LOGGED_IN");
  location.href = "/index.html";
}

function renderFinishBox(container, options = {}) {
  const nextHref = options.nextHref || "index.html";
  const themeHref = options.themeHref || "index.html";
  const taskFile = options.taskFile || "";

  container.innerHTML = `
    <div class="finish-box">
      <div class="finish-icon">✓</div>
      <div class="question">Aufgabe geschafft!</div>
      <div class="big">100% erreicht.</div>

      <div class="progress">
        <div class="bar" style="width:100%"></div>
      </div>

      <div class="actions finish-actions">
        <button class="btn" onclick="resetOneTask('${taskFile}')">Nochmal üben</button>
        <a class="btn green" href="${nextHref}">Weiter</a>
        <a class="btn secondary" href="${themeHref}">Zurück zum Thema</a>
      </div>
    </div>
  `;
}

function feedbackForTry(tries, solution, typeText = "Form und Schreibweise") {
  if (tries === 1) {
    return "Da ist noch ein Fehler.";
  }

  if (tries === 2) {
    return "Tipp: Prüfe " + typeText + ".";
  }

  return "Lösung: " + solution;
}

function speakGerman(text, slow = false) {
  if (!("speechSynthesis" in window)) return;

  const run = () => {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(String(text || ""));
    utterance.lang = "de-DE";
    utterance.rate = slow ? 0.38 : 0.98;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = speechSynthesis.getVoices();

    const germanVoice =
      voices.find(v => v.lang === "de-DE" && /google|microsoft|anna|katja|deutsch|german/i.test(v.name || "")) ||
      voices.find(v => v.lang === "de-DE") ||
      voices.find(v => String(v.lang || "").startsWith("de"));

    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    speechSynthesis.speak(utterance);
  };

  if (!speechSynthesis.getVoices().length) {
    speechSynthesis.onvoiceschanged = run;
    setTimeout(run, 250);
  } else {
    run();
  }
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[.,!?]/g, "")
    .replace(/\s+/g, " ");
}

function exampleBox(html) {
  return `<div class="example-box"><b>Beispiel:</b><br>${html}</div>`;
}

function instruction(text) {
  return `<div class="task-instruction">${text}</div>`;
}
