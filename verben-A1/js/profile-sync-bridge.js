// Verben A1: Profil/Sprache aus dem globalen Sync übernehmen.
(function(){
  function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')}catch(e){return null}}
  function applyProfile(p){
    if(!p)return;
    if(typeof profile!=='undefined'){
      profile={...(profile||{}),...p};
      try{localStorage.setItem('motherLanguage',profile.muttersprache||profile.motherLanguage||'')}catch(e){}
      try{localStorage.setItem('muttersprache',profile.muttersprache||profile.motherLanguage||'')}catch(e){}
      try{if(typeof renderHeader==='function')renderHeader()}catch(e){}
      try{
        var box=document.getElementById('profileBox');
        if(box&&typeof safeText==='function'&&typeof nativeLang==='function')box.innerHTML='<div class="ok"><strong>'+safeText(profile.vorname||'')+' '+safeText(profile.nachname||'')+'</strong><br><span class="small">Kurs: '+safeText(profile.kurs||profile.kursnummer||profile.courseCode||'')+' · Sprache: '+safeText(nativeLang())+'</span></div>';
      }catch(e){}
      try{if(typeof renderAndHydrate==='function')renderAndHydrate()}catch(e){}
    }
  }
  window.addEventListener('SP_PROFILE_SYNCED',function(e){applyProfile(e.detail&&e.detail.profile)});
  setTimeout(function(){applyProfile(readProfile())},500);
  setTimeout(function(){applyProfile(readProfile())},1800);
})();
