const TeacherPreview = {
  openAll(){
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
    localStorage.removeItem("SP_STUDENT_PROFILE");
    localStorage.removeItem("SP_STUDENT_ID");
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({
      teacherPreview:true,
      allAccess:true,
      courseCode:"ALLE",
      kurs:"ALLE",
      name:"Alle Inhalte",
      assignments:{enabledModules:{"Fragen A1":true,"Wortschatz":true,"Verben A1":true}},
      startedAt:new Date().toISOString()
    }));
    location.href="/index.html?teacherPreview=all";
  },
  open(courseName){
    const needle=String(courseName||"").trim();
    const course=(window.__SP_COURSES||[]).find(c=>[
      c.__docId,c.docId,c.id,c.courseCode,c.code,c.kurs,c.kursnummer,c.name,c.courseName
    ].map(v=>String(v||"").trim()).includes(needle)) || {id:needle,name:needle,courseCode:needle};
    const code=String(course.courseCode||course.code||course.kurs||course.kursnummer||course.id||course.name||needle).trim();

    // Lehrer-Vorschau ist ein expliziter Session-Zustand und darf Schüler-Logins nicht verunreinigen.
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
    localStorage.removeItem("SP_STUDENT_PROFILE");
    localStorage.removeItem("SP_STUDENT_ID");
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({
      teacherPreview:true,
      courseCode:code,
      kurs:code,
      name:course.courseName||course.name||code,
      releases:course.releases||course.release||{},
      assignments:course.assignments||{},
      startedAt:new Date().toISOString()
    }));

    location.href="/student-dashboard/index.html?teacherPreview=1&course="+encodeURIComponent(code);
  },
  exit(){
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
    sessionStorage.removeItem("SP_PREVIEW_COURSE");
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    location.href="/teacher/index.html";
  }
};
