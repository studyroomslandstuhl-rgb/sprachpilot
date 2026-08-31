(function(){
  const PROFILE_KEYS=['SP_USER_PROFILE','SP_STUDENT_PROFILE'];
  const BACKUP_KEYS=['SP_PROFILE_BACKUP','SP_STUDENT_PROFILE_BACKUP'];
  function parse(v){try{return JSON.parse(v||'null')}catch(e){return null}}
  function valid(p){return !!(p&&typeof p==='object'&&(p.studentId||p.userId||p.email)&&(p.kurs||p.kursnummer||p.courseCode))}
  function role(p){return String(p?.loginRole||p?.role||p?.type||p?.accountType||'').trim().toLowerCase()}
  function previewProfile(p){return !!(p&&typeof p==='object'&&(p.previewOnly===true||p.teacherPreview===true||p.studentCoursePreview===true))}
  function realStudent(p){if(!valid(p)||previewProfile(p))return false;const r=role(p);return !['teacher','lehrer','admin','owner','superadmin'].includes(r)}
  function secureStudent(p){return !!(realStudent(p)&&p.secureAuth===true&&String(p.authUid||'').trim()&&Number(p.authVersion||0)>=2)}
  function storedRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').trim().toLowerCase()}
  function teacherSession(){const r=storedRole();return ['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_MODE')==='1'||!!localStorage.getItem('SP_TEACHER_PROFILE')||!!localStorage.getItem('SP_TEACHER_ID')||!!localStorage.getItem('SP_TEACHER_EMAIL')}
  function keepLoggedIn(){return localStorage.getItem('SP_KEEP_LOGGED_IN')==='1'}
  function norm(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,'')}
  function course(p){return String(p?.courseCode||p?.kurs||p?.kursnummer||p?.course||'').trim()}
  function assignmentCourses(a={}){return[a.courseCode,a.kurs,a.kursnummer,a.course,a.courseDocId,a.id,a.code].map(norm).filter(Boolean)}
  function sanitizeCourseState(p){
    if(!realStudent(p))return p;
    const current=course(p),wanted=norm(current);if(!wanted)return p;
    try{
      const old=norm(localStorage.getItem('SP_COURSE_CODE')||''),marker=norm(localStorage.getItem('SP_RELEASE_CACHE_COURSE')||'');
      if((old&&old!==wanted)||(marker&&marker!==wanted))['SP_COURSE_RELEASES','SP_RELEASE_SYNC_AT','SP_RELEASE_CACHE_COURSE'].forEach(k=>localStorage.removeItem(k));
      const own=assignmentCourses(p.assignments||{});if(own.length&&!own.includes(wanted))delete p.assignments;
      localStorage.setItem('SP_COURSE_CODE',current);localStorage.removeItem('SP_NO_FIREBASE_SYNC');
    }catch(e){}
    return p;
  }
  function firstValid(keys,store){for(const k of keys){const p=parse(store.getItem(k));if(valid(p))return p}return null}
  function firstSecureStudent(keys,store){for(const k of keys){const p=parse(store.getItem(k));if(secureStudent(p))return p}return null}
  function clearPreviewResidue(){
    try{
      ['SP_TEACHER_PREVIEW','SP_TEACHER_MODE_WAS_ACTIVE','SP_PREVIEW_COURSE'].forEach(k=>sessionStorage.removeItem(k));
      ['SP_TEACHER_PREVIEW','SP_PREVIEW_COURSE','SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE'].forEach(k=>localStorage.removeItem(k));
      if(String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase().startsWith('teacher'))localStorage.removeItem('SP_LOGIN_CONTEXT');
    }catch(e){}
  }
  function clearStudentSessionFlags(){try{['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_KEEP_LOGGED_IN','SP_STUDENT_ID','SP_STUDENT_AUTH_UID','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE','SP_LOGIN_CONTEXT','motherLanguage','muttersprache','SP_MOTHER_LANGUAGE_CODE'].forEach(k=>localStorage.removeItem(k))}catch(e){}}
  function clearInsecureActiveStudent(){clearStudentSessionFlags();try{localStorage.setItem('SP_SECURE_STUDENT_RELOGIN_REQUIRED','1')}catch(e){}}
  function enforceStudentRole(p){if(!secureStudent(p))return;clearPreviewResidue();sanitizeCourseState(p);try{localStorage.setItem('SP_LOGIN_ROLE','student');localStorage.setItem('SP_ACTIVE_ROLE','student');localStorage.setItem('SP_USER_ROLE','student');localStorage.setItem('SP_STUDENT_AUTH_UID',String(p.authUid||''));localStorage.removeItem('SP_SECURE_STUDENT_RELOGIN_REQUIRED')}catch(e){}}
  function saveBackups(p){if(!secureStudent(p))return;p=sanitizeCourseState(p);const s=JSON.stringify(p);try{BACKUP_KEYS.forEach(k=>localStorage.setItem(k,s));sessionStorage.setItem('SP_PROFILE_SESSION_BACKUP',s);sessionStorage.setItem('SP_STUDENT_PROFILE_SESSION_BACKUP',s)}catch(e){}}
  function persistProfile(p){try{const s=JSON.stringify(p);localStorage.setItem('SP_USER_PROFILE',s);localStorage.setItem('SP_STUDENT_PROFILE',s)}catch(e){}}
  function restore(){
    if(teacherSession())return null;
    let p=firstValid(PROFILE_KEYS,localStorage);
    if(p){if(realStudent(p)&&!secureStudent(p)){clearInsecureActiveStudent();return null}if(secureStudent(p)){p=sanitizeCourseState(p);enforceStudentRole(p);persistProfile(p);saveBackups(p)}return p}
    if(!keepLoggedIn())return null;
    p=firstSecureStudent(BACKUP_KEYS,localStorage)||firstSecureStudent(['SP_PROFILE_SESSION_BACKUP','SP_STUDENT_PROFILE_SESSION_BACKUP'],sessionStorage);
    if(p){try{p=sanitizeCourseState(p);enforceStudentRole(p);persistProfile(p);localStorage.setItem('SP_KEEP_LOGGED_IN','1');localStorage.setItem('SP_LOGIN_ROLE','student');localStorage.setItem('SP_ACTIVE_ROLE','student');localStorage.setItem('SP_STUDENT_AUTH_UID',String(p.authUid||''));if(p.canonicalStudentId||p.studentId||p.userId)localStorage.setItem('SP_STUDENT_ID',p.canonicalStudentId||p.studentId||p.userId)}catch(e){}return p}
    return null;
  }
  function installSecureLogoutOverride(){
    try{
      if(window.logout&&window.logout.__spSecureStudentLogout===true)return;
      const fallback=typeof window.logout==='function'?window.logout:null;
      const secureLogout=async function(){
        const p=firstSecureStudent(PROFILE_KEYS,localStorage);
        if(!p){if(fallback)return fallback();clearStudentSessionFlags();location.href='/index.html';return}
        try{const module=await import('/js/student-secure-auth.js?v=1');await module.secureStudentSignOut()}
        catch(error){console.error('Sichere Firebase-Abmeldung fehlgeschlagen',error);try{window.alert('Abmeldung konnte nicht vollständig abgeschlossen werden. Die Sitzung bleibt aus Sicherheitsgründen aktiv. Bitte die Seite neu laden und erneut abmelden.')}catch(e){}return}
        clearStudentSessionFlags();try{sessionStorage.removeItem('SP_PROFILE_SESSION_BACKUP');sessionStorage.removeItem('SP_STUDENT_PROFILE_SESSION_BACKUP')}catch(e){}location.href='/index.html';
      };
      secureLogout.__spSecureStudentLogout=true;window.logout=secureLogout;
    }catch(e){}
  }
  function installPointBridge(){
    try{const p=firstSecureStudent(PROFILE_KEYS,localStorage);if(!p||teacherSession())return;import('/js/point-delta-bridge.js?v=20260831-central2').then(()=>{try{window.SPEnsurePointDeltaBridge?.()}catch(e){}}).catch(error=>console.warn('Punkte-Kompatibilitätsbridge konnte noch nicht geladen werden',error))}catch(e){}
  }

  restore();installPointBridge();
  setTimeout(installSecureLogoutOverride,0);setTimeout(installSecureLogoutOverride,500);setTimeout(installPointBridge,250);
  window.addEventListener('SP_STUDENT_IDENTITY_NORMALIZED',()=>{setTimeout(installSecureLogoutOverride,0);setTimeout(installPointBridge,0)});
  window.addEventListener('storage',()=>{restore();installPointBridge()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){restore();installPointBridge()}else{const p=firstSecureStudent(PROFILE_KEYS,localStorage);if(p&&!teacherSession())saveBackups(p)}});
  window.addEventListener('pagehide',()=>{const p=firstSecureStudent(PROFILE_KEYS,localStorage);if(p&&!teacherSession())saveBackups(p)});
})();