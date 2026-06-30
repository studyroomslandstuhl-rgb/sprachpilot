// Muss im Schüler-Dashboard vor dem Dashboard-Code geladen werden.
// Trennt Schüler-Login strikt von Lehrer-Vorschau.
(function(){
  function cleanDashboardCopy(){
    try{
      document.querySelectorAll('.small').forEach(el=>{
        const txt=String(el.textContent||'').trim();
        if(txt==='Das Dashboard öffnet sofort; Firestore wird danach aktualisiert.')el.remove();
        if(txt==='Lokale Daten werden angezeigt. Online-Daten laden im Hintergrund.')el.textContent='Dein Fortschritt wird angezeigt.';
      });
    }catch(e){}
  }
  cleanDashboardCopy();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanDashboardCopy);else setTimeout(cleanDashboardCopy,0);
  setTimeout(cleanDashboardCopy,100);
  setTimeout(cleanDashboardCopy,500);
  function readProfile(){
    try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"{}") }catch(e){return {}}
  }
  function roleOf(profile){
    return String(profile.role||profile.type||profile.typ||profile.accountType||profile.loginRole||"").toLowerCase();
  }
  function isTeacherProfile(profile){
    const role=roleOf(profile);
    return profile.isTeacher===true || profile.teacher===true || profile.lehrer===true || role==="teacher" || role==="lehrer" || role==="admin" || role==="owner";
  }
  function isStudentProfile(profile){
    const role=roleOf(profile);
    if(profile.teacherPreview===true || profile.isTeacher===true || role==="teacher" || role==="lehrer" || role==="admin" || role==="owner") return false;
    return profile.isStudent===true || profile.student===true || profile.schueler===true || role==="student" || role==="schueler" || role==="schüler" || ((profile.kurs||profile.kursnummer||profile.courseCode)&&(profile.muttersprache||profile.nativeLanguage||profile.language));
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
  const activeRole=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||localStorage.getItem("SP_AUTH_ROLE")||localStorage.getItem("SP_LOGIN_CONTEXT")||"").toLowerCase();

  // Aktive Schüler-Session gewinnt immer. Alte Lehrerwerte dürfen nie durchschlagen.
  if(activeRole==="student" || isStudentProfile(profile)){
    clearPreview();
    localStorage.setItem("SP_ACTIVE_ROLE","student");
    localStorage.setItem("SP_LOGIN_ROLE","student");
    localStorage.removeItem("SP_TEACHER_MODE");
    return;
  }

  const teacherAllowed=activeRole==="teacher" || isTeacherProfile(profile);

  if(wantsPreview && teacherAllowed){
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({teacherPreview:true,courseCode:course,kurs:course,startedAt:new Date().toISOString()}));
    return;
  }

  if(!wantsPreview || !teacherAllowed){
    clearPreview();
  }
})();