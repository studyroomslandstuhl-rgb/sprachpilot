// Muss im Schüler-Dashboard vor dem Dashboard-Code geladen werden.
(function(){
  const params=new URLSearchParams(location.search);
  const course=params.get("course")||params.get("kurs")||"";
  if(params.get("teacherPreview")==="1" && course){
    sessionStorage.setItem("SP_TEACHER_PREVIEW",JSON.stringify({teacherPreview:true,courseCode:course,kurs:course,startedAt:new Date().toISOString()}));
  }
  if(sessionStorage.getItem("SP_TEACHER_PREVIEW")){
    if(localStorage.getItem("SP_TEACHER_MODE")==="1"){
      sessionStorage.setItem("SP_TEACHER_MODE_WAS_ACTIVE","1");
      localStorage.removeItem("SP_TEACHER_MODE");
    }
  }
})();
