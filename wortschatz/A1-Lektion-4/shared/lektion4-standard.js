try{import('/js/sp-assets.js?v=4').catch(function(){});}catch(e){}
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

  if (role !== "teacher") {
    spClearTeacherPreviewState();
    return null;
  }

  return preview;
}

function spIsTeacherPreview() {
  return !!spTeacherPreview();
}