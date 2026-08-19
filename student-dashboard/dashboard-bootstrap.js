// Schüler-Dashboard strikt von Lehrer- und Vorschau-Sitzungen trennen.
function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function activeRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase()}
function previewContext(){return String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase()==='teacher-student-preview'}
function clearStaleTeacherPreview(){
  const p=readProfile(),role=activeRole();
  const legitimatePreview=previewContext()&&(p.previewOnly===true||p.studentCoursePreview===true||p.teacherPreview===true);
  if(role==='student'&&!legitimatePreview){
    try{
      ['SP_TEACHER_PREVIEW','SP_TEACHER_MODE_WAS_ACTIVE','SP_PREVIEW_COURSE'].forEach(k=>sessionStorage.removeItem(k));
      ['SP_TEACHER_PREVIEW','SP_PREVIEW_COURSE','SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE'].forEach(k=>localStorage.removeItem(k));
      localStorage.removeItem('SP_LOGIN_CONTEXT');
      // Alte Diagnose-Sitzungen dürfen die Firebase-Synchronisierung nicht dauerhaft deaktivieren.
      localStorage.removeItem('SP_NO_FIREBASE_SYNC');
    }catch(e){}
  }
  return legitimatePreview
}

const legitimatePreview=clearStaleTeacherPreview();
if(activeRole()==='teacher'&&!legitimatePreview){
  location.replace('/teacher/index.html');
}else{
  // Reihenfolge ist wichtig:
  // 1. technische Schüler-ID stabilisieren,
  // 2. verteilte Cloud-Fortschritte auf die kanonische ID zusammenführen,
  // 3. erst danach das Dashboard aus dem konsolidierten Serverstand rendern.
  let normalizedProfile=readProfile();
  if(activeRole()==='student'){
    try{
      const identity=await import('/js/student-identity.js?v=identity-dashboard1');
      normalizedProfile=await identity.normalizeStudentIdentity(normalizedProfile,{silent:true})||normalizedProfile;
    }catch(error){
      console.warn('Schüleridentität konnte vor dem Dashboard noch nicht normalisiert werden',error);
    }
  }

  const aliasRepair=activeRole()==='student'
    ? import('./progress-alias-unifier.js?v=5')
        .then(module=>module.unifyProgressAliases())
        .catch(error=>{console.warn('Verteilte Schüler-Fortschritte konnten noch nicht zusammengeführt werden',error);return null})
    : Promise.resolve(null);
  window.SP_PROGRESS_ALIAS_READY=aliasRepair;

  await aliasRepair;
  await import('./dashboard-lite.js?v=7');

  // Legacy-/Lokalspeicher-Recovery kommt bewusst erst nach dem konsolidierten Cloud-Stand.
  // Neue Funde lösen anschließend SP_POINT_DELTA_APPLIED aus und aktualisieren die Anzeige.
  import('./local-theme-points-recovery.js?v=3').catch(error=>console.warn('Lokale Themenpunkte konnten noch nicht geprüft werden',error));
  import('./local-standard-points-recovery.js?v=3').catch(error=>console.warn('Lokale Aufgabenpunkte konnten noch nicht geprüft werden',error));

  aliasRepair.then(result=>{
    if(!result?.ok)return;
    try{window.dispatchEvent(new CustomEvent('SP_POINT_DELTA_APPLIED',{detail:{type:'dashboard-alias-repair',total:result.points||0}}))}catch(e){}
  });
}
