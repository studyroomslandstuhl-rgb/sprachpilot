const TeacherPreview = {
  teacherProfile(){
    try{return JSON.parse(localStorage.getItem("SP_TEACHER_PROFILE")||"{}") || {}}catch(e){return {}}
  },
  previewUser(preview){
    const t=this.teacherProfile();
    const firstName=t.firstName || t.vorname || t.name || "Lehrer";
    const lastName=t.lastName || t.nachname || "";
    const course=preview.courseCode || preview.kurs || (preview.allAccess ? "ALLE" : "Lehrer-Vorschau");
    const openAssignments={releaseMode:"all",defaultLocked:false,enabledModules:{"Fragen A1":true,"Wortschatz":true,"Verben A1":true}};
    return {
      vorname:firstName,
      nachname:lastName,
      firstName,
      lastName,
      email:t.email || "",
      kurs:course,
      kursnummer:course,
      courseCode:course,
      muttersprache:"Deutsch",
      assignments:{...openAssignments,...(preview.assignments||{})},
      releases:preview.releases || {},
      role:"teacher",
      loginRole:"teacher",
      isTeacher:true,
      isStudent:false,
      teacherPreview:true,
      allAccess:!!preview.allAccess,
      previewOnly:true
    };
  },
  activate(preview){
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
    localStorage.removeItem("SP_STUDENT_PROFILE");
    localStorage.removeItem("SP_STUDENT_ID");
    localStorage.removeItem("SP_KEEP_LOGGED_IN");
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify(preview));
    localStorage.setItem("SP_TEACHER_PREVIEW","1");
    localStorage.setItem("SP_PREVIEW_COURSE",preview.courseCode||preview.kurs||"");
    localStorage.setItem("SP_USER_PROFILE",JSON.stringify(this.previewUser(preview)));
  },
  openAll(){
    this.activate({
      teacherPreview:true,
      allAccess:true,
      courseCode:"ALLE",
      kurs:"ALLE",
      name:"Alle Inhalte",
      assignments:{releaseMode:"all",defaultLocked:false,enabledModules:{"Fragen A1":true,"Wortschatz":true,"Verben A1":true}},
      releases:{},
      startedAt:new Date().toISOString()
    });
    location.href="/index.html?teacherPreview=all";
  },
  open(courseName){
    const needle=String(courseName||"").trim();
    const course=(window.__SP_COURSES||[]).find(c=>[
      c.__docId,c.docId,c.id,c.courseCode,c.code,c.kurs,c.kursnummer,c.name,c.courseName
    ].map(v=>String(v||"").trim()).includes(needle)) || {id:needle,name:needle,courseCode:needle};
    const code=String(course.courseCode||course.code||course.kurs||course.kursnummer||course.id||course.name||needle).trim();

    this.activate({
      teacherPreview:true,
      allAccess:true,
      courseCode:code,
      kurs:code,
      name:course.courseName||course.name||code,
      releases:course.releases||course.release||{},
      assignments:{releaseMode:"all",defaultLocked:false,enabledModules:{"Fragen A1":true,"Wortschatz":true,"Verben A1":true}},
      startedAt:new Date().toISOString()
    });

    location.href="/student-dashboard/index.html?teacherPreview=1&course="+encodeURIComponent(code);
  },
  exit(){
    localStorage.removeItem("SP_TEACHER_PREVIEW");
    localStorage.removeItem("SP_PREVIEW_COURSE");
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
    sessionStorage.removeItem("SP_PREVIEW_COURSE");
    const p=(()=>{try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}catch(e){return null}})();
    if(p && p.teacherPreview) localStorage.removeItem("SP_USER_PROFILE");
    localStorage.setItem("SP_ACTIVE_ROLE","teacher");
    localStorage.setItem("SP_LOGIN_ROLE","teacher");
    location.href="/teacher/index.html";
  }
};