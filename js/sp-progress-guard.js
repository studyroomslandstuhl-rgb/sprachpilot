// Globaler Schutz: Lehrer-Vorschau darf keine Schülerpunkte/Ranglisten/Fortschritte speichern.
// Wichtig: Der Schutz ist NUR aktiv, wenn SP_TEACHER_PREVIEW explizit in sessionStorage gesetzt ist.
(function(){
  function readProfile(){
    try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"{}")}catch(e){return {}}
  }
  function isStudentProfile(profile){
    const role=String(profile.role||profile.type||profile.typ||profile.accountType||profile.loginRole||"").toLowerCase();
    return profile.isStudent===true || profile.student===true || profile.schueler===true || role==="student" || role==="schueler" || role==="schüler";
  }
  function clearTeacherPreviewState(){
    try{
      sessionStorage.removeItem("SP_TEACHER_PREVIEW");
      sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
      sessionStorage.removeItem("SP_PREVIEW_COURSE");
    }catch(e){}
  }
  function isPreview(){
    let preview=null;
    try{preview=JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW")||"null")}catch(e){}
    if(!preview || preview.teacherPreview!==true) return false;

    const activeRole=String(localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
    const profile=readProfile();
    if(activeRole==="student" || isStudentProfile(profile)){
      clearTeacherPreviewState();
      return false;
    }
    return true;
  }
  function shouldRedirectKey(key){
    key=String(key||"");
    return /^(SP_L\d|SP_PROGRESS_|SP_DASHBOARD_PROGRESS|SP_POINTS_|SP_COURSE_LEADERBOARD|A1_ACTIVE_SESSION)/.test(key) || /EXAM_HISTORY|EXAM_UNLOCK|LEADERBOARD|RANKING/i.test(key);
  }
  function previewKey(key){
    let course="kurs";
    try{const p=JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW")||"{}");course=p.courseCode||p.kurs||course}catch(e){}
    return "SP_TEACHER_PREVIEW_PROGRESS_"+course+"_"+key;
  }
  const realSet=Storage.prototype.setItem;
  const realGet=Storage.prototype.getItem;
  const realRemove=Storage.prototype.removeItem;
  Storage.prototype.setItem=function(key,value){
    if(this===localStorage&&isPreview()&&shouldRedirectKey(key))return realSet.call(sessionStorage,previewKey(key),value);
    return realSet.call(this,key,value);
  };
  Storage.prototype.getItem=function(key){
    if(this===localStorage&&isPreview()&&shouldRedirectKey(key)){
      const v=realGet.call(sessionStorage,previewKey(key));
      return v===null?null:v;
    }
    return realGet.call(this,key);
  };
  Storage.prototype.removeItem=function(key){
    if(this===localStorage&&isPreview()&&shouldRedirectKey(key))return realRemove.call(sessionStorage,previewKey(key));
    return realRemove.call(this,key);
  };
  window.spCanSaveStudentProgress=function(){return !isPreview()};
  window.spClearTeacherPreviewState=clearTeacherPreviewState;
  window.spIsTeacherPreview=isPreview;

  function patchFirestore(){
    if(!isPreview()||!window.db||window.__spProgressGuardDbPatched)return;
    const originalCollection=window.db.collection?.bind(window.db);
    if(!originalCollection)return;
    window.__spProgressGuardDbPatched=true;
    window.db.collection=function(name){
      const ref=originalCollection(name);
      if(!["progress","leaderboard","rankings","studentProgress"].includes(String(name)))return ref;
      return new Proxy(ref,{get(target,prop){
        if(prop==="add")return async()=>null;
        if(prop==="doc")return function(id){
          const docRef=target.doc(id);
          return new Proxy(docRef,{get(d,p){
            if(["set","update","delete"].includes(String(p)))return async()=>null;
            return d[p];
          }});
        };
        return target[prop];
      }});
    };
  }
  patchFirestore();
  setInterval(patchFirestore,500);
})();
