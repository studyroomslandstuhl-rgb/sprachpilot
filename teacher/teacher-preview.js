const TeacherPreview = {
  openAll(){
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({teacherPreview:true,allAccess:true,courseCode:"ALLE",kurs:"ALLE",name:"Alle Inhalte",assignments:{enabledModules:{"Fragen A1":true,"Wortschatz":true,"Verben A1":true}},startedAt:new Date().toISOString()}));
    location.href="/index.html?teacherPreview=all";
  },
  open(courseName){
    const course=(window.__SP_COURSES||[]).find(c=>(c.id||c.name)===courseName)||{id:courseName,name:courseName};

    // Lehrer-Vorschau ist ein expliziter Session-Zustand und darf Schüler-Logins nicht verunreinigen.
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({
      teacherPreview:true,
      courseCode:courseName,
      kurs:courseName,
      name:course.name||courseName,
      releases:course.releases||course.release||{},
      assignments:course.assignments||{},
      startedAt:new Date().toISOString()
    }));

    location.href="/student-dashboard/index.html?teacherPreview=1&course="+encodeURIComponent(courseName);
  },
  exit(){
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
    sessionStorage.removeItem("SP_PREVIEW_COURSE");
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    location.href="/teacher/index.html";
  }
};
