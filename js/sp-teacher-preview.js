// SprachPilot: Lehrer-Vorschau für Schülerbereiche.
// Wichtig: Lehrer-Vorschau ist NUR aktiv, wenn sie explizit aus dem Lehrer-Dashboard gestartet wurde.
// Ein Schülerprofil oder alte lokale Speicherwerte dürfen nie automatisch Lehrer-Vorschau aktivieren.
export function getStoredTeacherPreview(){
  try{
    const preview = JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW") || "null");
    if(!preview || preview.teacherPreview !== true) return null;
    return preview;
  }catch(e){
    return null;
  }
}

export function clearTeacherPreviewState(){
  try{
    localStorage.removeItem("SP_TEACHER_PREVIEW");
    localStorage.removeItem("SP_PREVIEW_COURSE");
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
    sessionStorage.removeItem("SP_PREVIEW_COURSE");
  }catch(e){}
}

export function isTeacherProfile(profile={}){
  const role=String(profile.role||profile.typ||profile.type||profile.accountType||profile.loginRole||"").toLowerCase();
  return profile.isTeacher===true || profile.teacher===true || profile.lehrer===true || role==="teacher" || role==="lehrer" || role==="admin";
}

export function isStudentProfile(profile={}){
  const role=String(profile.role||profile.typ||profile.type||profile.accountType||profile.loginRole||"").toLowerCase();
  return profile.isStudent===true || profile.student===true || profile.schueler===true || role==="student" || role==="schueler" || role==="schüler";
}

export function isTeacherPreview(profile={}){
  const preview=getStoredTeacherPreview();
  if(!preview) return false;

  // Wenn ausdrücklich ein Schülerkontext aktiv ist, alte Vorschau sofort entfernen.
  const activeRole=String(localStorage.getItem("SP_ACTIVE_ROLE") || "").toLowerCase();
  if(activeRole==="student" || isStudentProfile(profile)){
    clearTeacherPreviewState();
    return false;
  }

  return true;
}

export function canSaveStudentProgress(profile={}){
  return !isTeacherPreview(profile);
}

export function enterTeacherCoursePreview(course){
  const data=typeof course==="string"?{courseCode:course,kurs:course}:course||{};
  const courseCode=data.courseCode||data.kurs||data.name||data.id||"";
  const preview={
    teacherPreview:true,
    courseCode,
    kurs:courseCode,
    name:data.title||data.name||courseCode,
    releases:data.releases||data.release||{},
    assignments:data.assignments||{},
    startedAt:new Date().toISOString()
  };

  localStorage.setItem("SP_ACTIVE_ROLE","teacher");
  localStorage.setItem("SP_LOGIN_ROLE","teacher");
  localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
  localStorage.removeItem("SP_STUDENT_PROFILE");
  localStorage.removeItem("SP_STUDENT_ID");
  localStorage.setItem("SP_TEACHER_PREVIEW","1");
  localStorage.setItem("SP_PREVIEW_COURSE",preview.courseCode||preview.kurs||"");
  sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify(preview));

  let teacher={};
  try{teacher=JSON.parse(localStorage.getItem("SP_TEACHER_PROFILE")||"{}")||{}}catch(e){}
  localStorage.setItem("SP_USER_PROFILE",JSON.stringify({
    vorname:teacher.firstName||teacher.vorname||teacher.name||"Lehrer",
    nachname:teacher.lastName||teacher.nachname||"",
    firstName:teacher.firstName||teacher.vorname||teacher.name||"Lehrer",
    lastName:teacher.lastName||teacher.nachname||"",
    email:teacher.email||"",
    kurs:courseCode,
    kursnummer:courseCode,
    courseCode,
    muttersprache:"Deutsch",
    assignments:preview.assignments||{},
    releases:preview.releases||{},
    role:"teacher",
    loginRole:"teacher",
    isTeacher:true,
    isStudent:false,
    teacherPreview:true,
    previewOnly:true
  }));
}

export function exitTeacherCoursePreview(){
  clearTeacherPreviewState();
  try{
    const p=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null");
    if(p && p.teacherPreview) localStorage.removeItem("SP_USER_PROFILE");
  }catch(e){}
}

export function previewProfile(base={}){
  const preview=getStoredTeacherPreview();
  if(!preview)return base||{};
  return {...(base||{}),kurs:preview.kurs||preview.courseCode,kursnummer:preview.kurs||preview.courseCode,courseCode:preview.courseCode||preview.kurs,teacherPreview:true,role:(base&&base.role)||"teacher"};
}

export function progressStorage(profile={}){
  return canSaveStudentProgress(profile)?localStorage:sessionStorage;
}

export function progressKey(key,profile={}){
  if(canSaveStudentProgress(profile))return key;
  const p=previewProfile(profile);
  return "SP_TEACHER_PREVIEW_PROGRESS_"+(p.courseCode||p.kurs||"kurs")+"_"+key;
}
