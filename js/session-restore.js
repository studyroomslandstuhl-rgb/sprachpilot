(function(){
  const PROFILE_KEYS=['SP_USER_PROFILE','SP_STUDENT_PROFILE'];
  const BACKUP_KEYS=['SP_PROFILE_BACKUP','SP_STUDENT_PROFILE_BACKUP'];
  function parse(v){try{return JSON.parse(v||'null')}catch(e){return null}}
  function valid(p){return !!(p&&typeof p==='object'&&(p.studentId||p.userId||p.email)&&(p.kurs||p.kursnummer||p.courseCode))}
  function role(p){return String(p?.loginRole||p?.role||p?.type||p?.accountType||'').trim().toLowerCase()}
  function previewProfile(p){
    if(!p||typeof p!=='object')return false;
    if(p.previewOnly===true||p.teacherPreview===true||p.studentCoursePreview===true)return true;
    const context=String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();
    return context==='teacher-student-preview';
  }
  function realStudent(p){
    if(!valid(p)||previewProfile(p))return false;
    const r=role(p);
    return !['teacher','lehrer','admin','owner','superadmin'].includes(r);
  }
  function firstValid(keys,store){for(const k of keys){const p=parse(store.getItem(k));if(valid(p))return p}return null}
  function firstRealStudent(keys,store){for(const k of keys){const p=parse(store.getItem(k));if(realStudent(p))return p}return null}
  function clearPreviewResidue(){
    try{
      ['SP_TEACHER_PREVIEW','SP_TEACHER_MODE_WAS_ACTIVE','SP_PREVIEW_COURSE'].forEach(k=>sessionStorage.removeItem(k));
      ['SP_TEACHER_PREVIEW','SP_PREVIEW_COURSE','SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE'].forEach(k=>localStorage.removeItem(k));
      if(String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase().startsWith('teacher'))localStorage.removeItem('SP_LOGIN_CONTEXT');
    }catch(e){}
  }
  function enforceStudentRole(p){
    if(!realStudent(p))return;
    clearPreviewResidue();
    try{
      localStorage.setItem('SP_LOGIN_ROLE','student');
      localStorage.setItem('SP_ACTIVE_ROLE','student');
      localStorage.setItem('SP_USER_ROLE','student');
    }catch(e){}
  }
  function saveBackups(p){if(!realStudent(p))return;const s=JSON.stringify(p);try{BACKUP_KEYS.forEach(k=>localStorage.setItem(k,s));sessionStorage.setItem('SP_PROFILE_SESSION_BACKUP',s);sessionStorage.setItem('SP_STUDENT_PROFILE_SESSION_BACKUP',s)}catch(e){}}
  function restore(){
    let p=firstValid(PROFILE_KEYS,localStorage);
    if(p){if(realStudent(p)){enforceStudentRole(p);saveBackups(p)}return p}
    p=firstRealStudent(BACKUP_KEYS,localStorage)||firstRealStudent(['SP_PROFILE_SESSION_BACKUP','SP_STUDENT_PROFILE_SESSION_BACKUP'],sessionStorage);
    if(p){
      try{
        enforceStudentRole(p);
        localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));
        localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(p));
        localStorage.setItem('SP_KEEP_LOGGED_IN','1');
        localStorage.setItem('SP_LOGIN_ROLE','student');
        localStorage.setItem('SP_ACTIVE_ROLE','student');
        if(p.studentId||p.userId)localStorage.setItem('SP_STUDENT_ID',p.studentId||p.userId)
      }catch(e){}
      return p
    }
    return null
  }
  restore();
  window.addEventListener('storage',restore);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)restore();else{const p=firstRealStudent(PROFILE_KEYS,localStorage);if(p)saveBackups(p)}});
  window.addEventListener('pagehide',()=>{const p=firstRealStudent(PROFILE_KEYS,localStorage);if(p)saveBackups(p)});
})();