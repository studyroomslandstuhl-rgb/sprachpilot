(function(){
  "use strict";

  function isOptionalPendingWarning(message){
    var text=String(message||"").toLowerCase();
    return text.indexOf("teachers_pending/")!==-1 &&
      (text.indexOf("permission")!==-1 || text.indexOf("insufficient")!==-1 || text.indexOf("konnte nicht gelesen werden")!==-1);
  }

  function install(){
    if(!window.TeacherEnv || typeof window.TeacherEnv.note!=="function" || window.TeacherEnv.__pendingWarningFilter)return false;
    var original=window.TeacherEnv.note.bind(window.TeacherEnv);
    window.TeacherEnv.note=function(message,error){
      var errorText=error && error.message ? error.message : "";
      if(isOptionalPendingWarning(String(message||"")+" "+String(errorText||""))){
        console.warn("[SprachPilot Lehrer-Dashboard] Optionale teachers_pending-Pruefung ignoriert.", message, error||"");
        return;
      }
      return original(message,error);
    };
    window.TeacherEnv.__pendingWarningFilter=true;
    return true;
  }

  if(!install())setTimeout(install,0);
})();
