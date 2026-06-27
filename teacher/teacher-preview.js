const TeacherPreview = {
  open(courseName){
    const course=(window.__SP_COURSES||[]).find(c=>(c.id||c.name)===courseName)||{id:courseName,name:courseName};
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({
      teacherPreview:true,
      courseCode:courseName,
      kurs:courseName,
      name:course.name||courseName,
      releases:course.releases||course.release||{},
      assignments:course.assignments||{},
      startedAt:new Date().toISOString()
    }));
    if(localStorage.getItem("SP_TEACHER_MODE")==="1"){
      sessionStorage.setItem("SP_TEACHER_MODE_WAS_ACTIVE","1");
      localStorage.removeItem("SP_TEACHER_MODE");
    }
    location.href="/student-dashboard/index.html?teacherPreview=1&course="+encodeURIComponent(courseName);
  },
  exit(){
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    if(sessionStorage.getItem("SP_TEACHER_MODE_WAS_ACTIVE")==="1"){
      localStorage.setItem("SP_TEACHER_MODE","1");
      sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
    }
    location.href="/teacher/index.html"
  }
};
