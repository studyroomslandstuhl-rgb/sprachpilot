(function(){
  const PROFILE_KEYS=['SP_USER_PROFILE','SP_STUDENT_PROFILE'];
  const BACKUP_KEYS=['SP_PROFILE_BACKUP','SP_STUDENT_PROFILE_BACKUP'];
  function parse(v){try{return JSON.parse(v||'null')}catch(e){return null}}
  function valid(p){return !!(p&&typeof p==='object'&&(p.studentId||p.userId||p.email)&&(p.kurs||p.kursnummer||p.courseCode))}
  function firstValid(keys,store){for(const k of keys){const p=parse(store.getItem(k));if(valid(p))return p}return null}
  function saveBackups(p){if(!valid(p))return;const s=JSON.stringify(p);try{BACKUP_KEYS.forEach(k=>localStorage.setItem(k,s));sessionStorage.setItem('SP_PROFILE_SESSION_BACKUP',s);sessionStorage.setItem('SP_STUDENT_PROFILE_SESSION_BACKUP',s)}catch(e){}}
  function restore(){let p=firstValid(PROFILE_KEYS,localStorage);if(p){saveBackups(p);return p}p=firstValid(BACKUP_KEYS,localStorage)||firstValid(['SP_PROFILE_SESSION_BACKUP','SP_STUDENT_PROFILE_SESSION_BACKUP'],sessionStorage);if(p){try{localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(p));localStorage.setItem('SP_KEEP_LOGGED_IN','1');localStorage.setItem('SP_LOGIN_ROLE','student');localStorage.setItem('SP_ACTIVE_ROLE','student');if(p.studentId||p.userId)localStorage.setItem('SP_STUDENT_ID',p.studentId||p.userId)}catch(e){}return p}return null}
  restore();
  window.addEventListener('storage',restore);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)restore();else{const p=firstValid(PROFILE_KEYS,localStorage);if(p)saveBackups(p)}});
  window.addEventListener('pagehide',()=>{const p=firstValid(PROFILE_KEYS,localStorage);if(p)saveBackups(p)});
})();