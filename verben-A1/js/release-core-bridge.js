(function(){
  "use strict";

  var MODULE="Verben A1";
  var releaseData={};
  var releasedNames=[];

  function readJson(key){try{return JSON.parse(localStorage.getItem(key)||"null")}catch(e){return null}}
  function profile(){return readJson("SP_USER_PROFILE")||readJson("SP_STUDENT_PROFILE")||{};}
  function role(){return String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();}
  function teacher(){
    var p=profile();
    return role()==="teacher" || role()==="lehrer" || p.role==="teacher" || p.teacherPreview===true || p.isTeacher===true;
  }
  function allVerbs(){
    return (window.ALL_VERBS||[]).map(function(item){return typeof item==="string"?item:item&&item.v;}).filter(Boolean);
  }
  function patchState(){
    var allowed=new Set(releasedNames);
    try{
      if(!window.state || !allowed.size)return true;
      ["practiceQueue","reviewQueue","wrongVerbs","knownVerbs","sessionVerbs"].forEach(function(key){
        if(Array.isArray(window.state[key]))window.state[key]=window.state[key].filter(function(v){return allowed.has(typeof v==="string"?v:v&&v.v);});
      });
      if(window.state.currentVerb && !allowed.has(typeof window.state.currentVerb==="string"?window.state.currentVerb:window.state.currentVerb.v)){
        window.state.currentVerb=null;
      }
      if(typeof window.saveState==="function")window.saveState();
    }catch(e){}
    return true;
  }
  function install(api){
    var all=allVerbs();
    releasedNames=teacher()?all:api.releasedVerbs(releaseData,all);
    window.spReleasedVerbList=function(){return releasedNames.slice();};
    window.spStrictReleasedVerbList=function(){return releasedNames.slice();};
    window.spVerbAssessmentEnabled=function(){return teacher()?true:api.assessmentEnabled(releaseData);};
    window.spVerbPracticeTargetCount=function(){return Math.min(20,releasedNames.length);};
    window.spSyncVerbRelease=patchState;
    window.spVerbReleaseDebug=function(){
      return {source:"course-releases",module:MODULE,released:releasedNames.slice(),releaseData:releaseData};
    };
    patchState();
    try{if(typeof window.renderHome==="function")window.renderHome();}catch(e){}
  }

  window.spVerbReleaseReady=import("/js/course-releases.js?v=release-core-20260701b")
    .then(function(api){
      return api.loadCourseRelease(profile()).then(function(data){
        releaseData=data||{};
        install(api);
        return releaseData;
      });
    })
    .catch(function(err){
      console.error("Verben-Freigabe konnte nicht geladen werden",err);
      releasedNames=teacher()?allVerbs():[];
      window.spReleasedVerbList=function(){return releasedNames.slice();};
      window.spStrictReleasedVerbList=function(){return releasedNames.slice();};
      window.spVerbAssessmentEnabled=function(){return teacher();};
      window.spVerbPracticeTargetCount=function(){return Math.min(20,releasedNames.length);};
      window.spSyncVerbRelease=patchState;
      return releaseData;
    });
})();
