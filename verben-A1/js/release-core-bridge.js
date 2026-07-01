(function(){
  "use strict";

  function readJson(key){try{return JSON.parse(localStorage.getItem(key)||"null")}catch(e){return null}}
  function profile(){return readJson("SP_USER_PROFILE")||readJson("SP_STUDENT_PROFILE")||{};}
  function remember(data){
    try{
      var p=profile();
      p.assignments=data||{};
      if(data && (data.id || data.courseDocId))p.courseDocId=data.courseDocId||data.id;
      if(data && (data.courseCode || data.kurs || data.kursnummer)){
        p.courseCode=data.courseCode||data.kurs||data.kursnummer;
        p.kurs=p.kurs||p.courseCode;
        p.kursnummer=p.kursnummer||p.courseCode;
      }
      localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));
      localStorage.setItem("SP_STUDENT_PROFILE",JSON.stringify(p));
      localStorage.setItem("SP_COURSE_RELEASES",JSON.stringify(data||{}));
    }catch(e){}
  }
  function refresh(){
    try{if(typeof window.spSyncVerbRelease==="function")window.spSyncVerbRelease();}catch(e){}
    try{if(typeof window.renderHome==="function")window.renderHome();}catch(e){}
  }

  var previousReady=window.spVerbReleaseReady||Promise.resolve();
  import("/js/course-releases.js?v=release-core-20260701b")
    .then(function(api){return api.loadCourseRelease(profile());})
    .then(function(data){
      remember(data||{});
      return previousReady.then(function(){refresh();return data||{};});
    })
    .catch(function(err){
      console.error("Zentrale Verben-Freigabe konnte nicht aktualisiert werden",err);
      return previousReady;
    });
})();
