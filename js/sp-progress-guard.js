// Globaler Schutz: Lehrer-Vorschau darf keine Schülerpunkte/Ranglisten/Fortschritte speichern.
// Lehrer-Vorschau ist nur aktiv, wenn sie explizit im Lehrer-Dashboard gestartet wurde.
(function(){
  function readProfile(){
    try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"{}")}catch(e){return {}}
  }
  function roleOf(profile){
    return String(profile?.role||profile?.type||profile?.typ||profile?.accountType||profile?.loginRole||"").toLowerCase();
  }
  function isStudentProfile(profile){
    const role=roleOf(profile);
    return profile?.isStudent===true || profile?.student===true || profile?.schueler===true || role==="student" || role==="schueler" || role==="schüler";
  }
  function isTeacherProfile(profile){
    const role=roleOf(profile);
    return profile?.isTeacher===true || profile?.teacher===true || profile?.lehrer===true || role==="teacher" || role==="lehrer" || role==="admin" || role==="owner";
  }
  function clearTeacherPreviewState(){
    try{
      sessionStorage.removeItem("SP_TEACHER_PREVIEW");
      sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
      sessionStorage.removeItem("SP_PREVIEW_COURSE");
    }catch(e){}
  }
  function storedRole(){
    return String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||localStorage.getItem("SP_AUTH_ROLE")||localStorage.getItem("SP_LOGIN_CONTEXT")||"").toLowerCase();
  }
  function activeRole(profile){
    const stored=storedRole();
    // Die aktive Login-Art entscheidet zuerst. Gleiche E-Mail darf Schüler und Lehrer sein.
    if(["student","schueler","schüler"].includes(stored))return "student";
    if(["teacher","lehrer","admin","owner"].includes(stored))return "teacher";

    const profileRole=roleOf(profile);
    if(["student","schueler","schüler"].includes(profileRole))return "student";
    if(["teacher","lehrer","admin","owner"].includes(profileRole))return "teacher";
    if(isStudentProfile(profile) || ((profile?.kurs||profile?.kursnummer||profile?.courseCode)&&(profile?.muttersprache||profile?.nativeLanguage||profile?.language)))return "student";
    if(isTeacherProfile(profile))return "teacher";
    return "student";
  }
  function readPreview(){
    try{return JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW")||"null")}catch(e){return null}
  }
  function isPreview(){
    const preview=readPreview();
    if(!preview || preview.teacherPreview!==true) return false;

    const profile=readProfile();
    if(activeRole(profile)!=="teacher"){
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
    try{const p=readPreview()||{};course=p.courseCode||p.kurs||course}catch(e){}
    return "SP_TEACHER_PREVIEW_PROGRESS_"+course+"_"+key;
  }

  const realSet=Storage.prototype.setItem;
  const realGet=Storage.prototype.getItem;
  const realRemove=Storage.prototype.removeItem;

  if(!window.__spProgressGuardStoragePatched){
    window.__spProgressGuardStoragePatched=true;
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
  }

  window.spCanSaveStudentProgress=function(){return !isPreview()};
  window.spCanWriteFirebaseProgress=function(){return !isPreview()};
  window.spClearTeacherPreviewState=clearTeacherPreviewState;
  window.spIsTeacherPreview=isPreview;
  window.spActiveLoginRole=function(){return activeRole(readProfile())};

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

  function dashboardHref(){
    return activeRole(readProfile())==="teacher" ? "/teacher/index.html" : "/student-dashboard/index.html";
  }
  function patchDashboardButtons(){
    const href=dashboardHref();
    document.querySelectorAll('a,button').forEach(el=>{
      const text=String(el.textContent||"").trim().toLowerCase();
      if(!text.includes('dashboard'))return;
      if(el.tagName.toLowerCase()==='a'){
        el.setAttribute('href',href);
      }else{
        el.onclick=function(){ location.href=href; };
      }
    });
  }
  window.spDashboardHref=dashboardHref;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchDashboardButtons);else patchDashboardButtons();
  setTimeout(patchDashboardButtons,300);
})();
