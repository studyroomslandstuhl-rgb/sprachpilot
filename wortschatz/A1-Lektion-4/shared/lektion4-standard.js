function spSafe(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function spReadJson(key, fallback = {}) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (e) {
    return fallback;
  }
}

function spReadSessionJson(key, fallback = null) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || JSON.stringify(fallback));
  } catch (e) {
    return fallback;
  }
}

function spRawProfile() {
  const storedRole = String(
    localStorage.getItem("SP_LOGIN_ROLE") ||
    localStorage.getItem("SP_ACTIVE_ROLE") ||
    localStorage.getItem("SP_AUTH_ROLE") ||
    localStorage.getItem("SP_LOGIN_CONTEXT") ||
    ""
  ).toLowerCase();

  if (storedRole === "teacher" || storedRole === "lehrer" || storedRole === "admin") {
    const teacherProfile = spReadJson("SP_TEACHER_PROFILE", null);
    if (teacherProfile && Object.keys(teacherProfile).length) return teacherProfile;
  }

  if (storedRole === "student" || storedRole === "schueler" || storedRole === "schüler") {
    const studentProfile = spReadJson("SP_STUDENT_PROFILE", null);
    if (studentProfile && Object.keys(studentProfile).length) return studentProfile;
  }

  return spReadJson("SP_USER_PROFILE", {});
}

function spProfileRole(profile = {}) {
  return String(
    profile.loginRole || profile.role || profile.typ || profile.type || profile.accountType || profile.userRole || ""
  ).toLowerCase();
}

function spLooksLikeStudent(profile = {}) {
  const role = spProfileRole(profile);
  return Boolean(
    role === "student" || role === "schueler" || role === "schüler" ||
    profile.isStudent === true || profile.student === true || profile.schueler === true || profile.schüler === true ||
    ((profile.kurs || profile.kursnummer || profile.courseCode) && (profile.muttersprache || profile.nativeLanguage || profile.language))
  );
}

function spLooksLikeTeacher(profile = {}) {
  const role = spProfileRole(profile);
  return Boolean(
    role === "teacher" || role === "lehrer" || role === "admin" ||
    profile.isTeacher === true || profile.teacher === true || profile.lehrer === true || profile.admin === true
  );
}

function spActiveRole(profile = spRawProfile()) {
  const profileRole = spProfileRole(profile);

  if (profileRole === "student" || profileRole === "schueler" || profileRole === "schüler") return "student";
  if (profileRole === "teacher" || profileRole === "lehrer" || profileRole === "admin") return "teacher";

  // Wichtig: Schülerprofil schlägt alte Lehrer-/Preview-Speicherwerte.
  if (spLooksLikeStudent(profile)) return "student";

  const storedRole = String(
    localStorage.getItem("SP_LOGIN_ROLE") ||
    localStorage.getItem("SP_ACTIVE_ROLE") ||
    localStorage.getItem("SP_AUTH_ROLE") ||
    localStorage.getItem("SP_LOGIN_CONTEXT") ||
    ""
  ).toLowerCase();

  if (storedRole === "student" || storedRole === "schueler" || storedRole === "schüler") return "student";
  if (storedRole === "teacher" || storedRole === "lehrer" || storedRole === "admin") return "teacher";

  if (spLooksLikeTeacher(profile)) return "teacher";

  return "student";
}

function spClearTeacherPreviewState() {
  try {
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
    sessionStorage.removeItem("SP_PREVIEW_COURSE");
  } catch (e) {}
}

function spTeacherPreview() {
  const profile = spRawProfile();
  const role = spActiveRole(profile);
  const preview = spReadSessionJson("SP_TEACHER_PREVIEW", null);

  if (!preview || preview.teacherPreview !== true) return null;

  // Thema-Seiten dürfen alte Vorschau nie in einer echten Schüler-Session anzeigen.
  if (role !== "teacher") {
    spClearTeacherPreviewState();
    return null;
  }

  return preview;
}

function spIsTeacherPreview() {
  return !!spTeacherPreview();
}

function spGetProfile() {
  const profile = spRawProfile();
  const preview = spTeacherPreview();

  if (preview) {
    const courseCode = preview.courseCode || preview.kurs || "";
    return {
      ...profile,
      kurs: courseCode || profile.kurs || profile.kursnummer || profile.courseCode || "",
      kursnummer: courseCode || profile.kursnummer || profile.kurs || profile.courseCode || "",
      courseCode: courseCode || profile.courseCode || profile.kurs || profile.kursnummer || "",
      teacherPreview: true,
      role: "teacher"
    };
  }

  return profile;
}

/* ---------- Lehrer-Vorschau / Testmodus ---------- */
function spIsTeacherProfile(profile) {
  return spActiveRole(profile || spRawProfile()) === "teacher";
}

function spPreviewCourseCode() {
  const preview = spTeacherPreview() || {};
  const p = spGetProfile();
  return preview.courseCode || preview.kurs || p.previewCourseCode || p.kurs || p.kursnummer || p.courseCode || "";
}

function spEnterCoursePreview(course) {
  const data = typeof course === "string" ? { courseCode: course, kurs: course } : (course || {});
  const courseCode = data.courseCode || data.kurs || data.name || data.id || "";

  localStorage.setItem("SP_ACTIVE_ROLE", "teacher");
  localStorage.setItem("SP_LOGIN_CONTEXT", "teacher");
  localStorage.setItem("SP_LOGIN_ROLE", "teacher");

  sessionStorage.setItem("SP_TEACHER_PREVIEW", JSON.stringify({
    courseCode,
    kurs: courseCode,
    name: data.name || data.title || courseCode,
    releases: data.releases || data.release || {},
    assignments: data.assignments || {},
    teacherPreview: true,
    startedAt: new Date().toISOString()
  }));
}

function spExitCoursePreview() {
  spClearTeacherPreviewState();
  localStorage.setItem("SP_ACTIVE_ROLE", "teacher");
  localStorage.setItem("SP_LOGIN_CONTEXT", "teacher");
  location.href = "/teacher/index.html";
}

function spCanSaveStudentProgress() {
  return !spIsTeacherPreview();
}

function spProgressStorage() {
  return spCanSaveStudentProgress() ? localStorage : sessionStorage;
}

function spProgressKey(key) {
  if (spCanSaveStudentProgress()) return key;
  const course = spPreviewCourseCode() || "kurs";
  return "SP_TEACHER_PREVIEW_PROGRESS_" + course + "_" + key;
}

function spTeacherPreviewNotice() {
  if (!spIsTeacherPreview()) return "";
  const course = spPreviewCourseCode();
  return `<div class="hint"><b>Lehrer-Vorschau${course ? " · " + spSafe(course) : ""}</b><br>Du siehst und testest die Schüleransicht. Es werden keine Punkte, keine Rangliste und kein Schülerfortschritt gespeichert.</div>`;
}

function renderSprachPilotHeader(config = {}) {
  const header = document.querySelector(".topbar");
  if (!header) return;

  const profile = spGetProfile();

  const firstName = profile.vorname || profile.firstName || "";
  const lastName = profile.nachname || profile.lastName || "";
  const course = profile.kurs || profile.kursnummer || profile.courseCode || "";

  const role = spActiveRole(profile);
  const isTeacher = role === "teacher";
  const preview = spTeacherPreview();
  const previewCourse = preview ? spPreviewCourseCode() : "";
  const who = `${firstName} ${lastName}`.trim() || (isTeacher ? "Lehrer/in" : "Schüler/in");

  const title = config.title || "SprachPilot";
  const subtitle = config.subtitle || "A1 Lektion 4";
  const backHref = config.backHref || "index.html";
  const overviewHref = config.overviewHref || "uebersicht.html";
  const statsHref = config.statsHref || "statistik.html";
  const dashboardHref = isTeacher ? "/teacher/index.html" : "/student-dashboard/index.html";

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
        <span class="account-pill">${spSafe(who)}${previewCourse ? " · Vorschau: " + spSafe(previewCourse) : (course ? " · " + spSafe(course) : "")}</span>
        <a class="account-link" href="${dashboardHref}">📊 ${isTeacher ? "Lehrer-Dashboard" : "Dashboard"}</a>
        <a class="account-link" href="/profile/index.html">👤 Profil</a>
        ${preview ? '<button class="account-link account-btn" onclick="spExitCoursePreview()">Vorschau beenden</button>' : ''}
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
  spClearTeacherPreviewState();
  localStorage.removeItem("SP_USER_PROFILE");
  localStorage.removeItem("SP_STUDENT_PROFILE");
  localStorage.removeItem("SP_TEACHER_PROFILE");
  localStorage.removeItem("SP_KEEP_LOGGED_IN");
  localStorage.removeItem("SP_ACTIVE_ROLE");
  localStorage.removeItem("SP_LOGIN_ROLE");
  localStorage.removeItem("SP_AUTH_ROLE");
  localStorage.removeItem("SP_LOGIN_CONTEXT");
  localStorage.removeItem("SP_TEACHER_MODE");
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
