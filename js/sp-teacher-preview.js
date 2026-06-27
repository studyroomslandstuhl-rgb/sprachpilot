// SprachPilot: Lehrer-Vorschau für alle Schülerbereiche.
// Laden vor Modul-/Aufgabencode, damit Lehrer testen können, ohne Schülerpunkte zu erzeugen.
export function getStoredTeacherPreview(){
  try{return JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW")||"null")}catch(e){return null}
}
export function isTeacherProfile(profile={}){
  const role=String(profile.role||profile.typ||profile.type||profile.accountType||"").toLowerCase();
  return profile.isTeacher===true || profile.teacher===true || profile.lehrer===true || role==="teacher" || role==="lehrer" || localStorage.getItem("SP_TEACHER_MODE")==="1";
}
export function isTeacherPreview(profile={}){
  return isTeacherProfile(profile) || !!getStoredTeacherPreview();
}
export function canSaveStudentProgress(profile={}){
  return !isTeacherPreview(profile);
}
export function enterTeacherCoursePreview(course){
  const data=typeof course==="string"?{courseCode:course,kurs:course}:course||{};
  const courseCode=data.courseCode||data.kurs||data.name||data.id||"";
  sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({
    teacherPreview:true,
    courseCode,
    kurs:courseCode,
    name:data.title||data.name||courseCode,
    releases:data.releases||data.release||{},
    assignments:data.assignments||{},
    startedAt:new Date().toISOString()
  }));
}
export function exitTeacherCoursePreview(){
  sessionStorage.removeItem("SP_TEACHER_PREVIEW");
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
