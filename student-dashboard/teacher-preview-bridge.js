// Muss im Schüler-Dashboard vor dem Dashboard-Code geladen werden.
// Trennt Schüler-Login strikt von Lehrer-Vorschau.
(function(){
  function readProfile(){
    try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"{}") }catch(e){return {}}
  }
  function roleOf(profile){
    return String(profile.role||profile.type||profile.typ||profile.accountType||profile.loginRole||"").toLowerCase();
  }
  function isTeacherProfile(profile){
    const role=roleOf(profile);
    return profile.isTeacher===true || profile.teacher===true || profile.lehrer===true || role==="teacher" || role==="lehrer" || role==="admin";
  }
  function isStudentProfile(profile){
    const role=roleOf(profile);
    return profile.isStudent===true || profile.student===true || profile.schueler===true || role==="student" || role==="schueler" || role==="schüler";
  }
  function clearPreview(){
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
    sessionStorage.removeItem("SP_PREVIEW_COURSE");
  }

  const params=new URLSearchParams(location.search);
  const course=params.get("course")||params.get("kurs")||"";
  const wantsPreview=params.get("teacherPreview")==="1" && !!course;
  const profile=readProfile();
  const activeRole=String(localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
  const teacherAllowed=activeRole==="teacher" || isTeacherProfile(profile);

  if(wantsPreview && teacherAllowed){
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({teacherPreview:true,courseCode:course,kurs:course,startedAt:new Date().toISOString()}));
    return;
  }

  // Normaler Schülerlogin: alte Lehrer-Vorschau darf nie sichtbar bleiben.
  if(!wantsPreview || activeRole==="student" || isStudentProfile(profile) || !teacherAllowed){
    clearPreview();
    if(isStudentProfile(profile) || activeRole==="student"){
      localStorage.setItem("SP_ACTIVE_ROLE","student");
      localStorage.removeItem("SP_TEACHER_MODE");
    }
  }
})();
