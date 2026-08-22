import '/js/session-restore.js?v=4';
import { verifySecureAccess } from '/js/secure-access-gate.js?v=1';

function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function activeRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase()}
function clearStaleTeacherPreview(){
  if(activeRole()!=='student')return;
  try{
    ['SP_TEACHER_PREVIEW','SP_TEACHER_MODE_WAS_ACTIVE','SP_PREVIEW_COURSE'].forEach(k=>sessionStorage.removeItem(k));
    ['SP_TEACHER_PREVIEW','SP_PREVIEW_COURSE','SP_TEACHER_MODE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE','SP_L7_PREVIEW_PID'].forEach(k=>localStorage.removeItem(k));
    localStorage.removeItem('SP_LOGIN_CONTEXT');localStorage.removeItem('SP_NO_FIREBASE_SYNC');
  }catch(e){}
}
function alreadyCanonicalSecureProfile(profile,uid){const p=profile||{},canonical=String(p.canonicalStudentId||'').trim();return !!(canonical&&p.secureAuth===true&&String(p.authUid||'')===String(uid||'')&&String(p.docId||canonical)===canonical&&String(p.studentId||canonical)===canonical&&String(p.userId||canonical)===canonical)}
function revealDashboard(){try{document.documentElement.dataset.spDashboardAuth='ok';document.documentElement.style.removeProperty('visibility')}catch(e){}}
function warning(title,text){
 revealDashboard();
 let box=document.getElementById('spDashboardWarning');
 if(!box){box=document.createElement('div');box.id='spDashboardWarning';box.style.cssText='max-width:1160px;margin:14px auto;padding:14px 16px;border:1px solid #e5b94b;border-radius:16px;background:#fff8df;color:#6f5310;font:15px/1.45 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.07)';document.body.insertBefore(box,document.body.firstChild)}
 box.innerHTML=`<strong>${title}</strong><br>${text} <button id="spDashboardRetry" type="button" style="margin-left:8px;padding:7px 10px;border:0;border-radius:10px;background:#2f7f96;color:#fff;font-weight:800">Erneut laden</button>`;
 document.getElementById('spDashboardRetry').onclick=()=>location.reload();
}
function fatalVisible(title,text){revealDashboard();warning(title,text)}

clearStaleTeacherPreview();

if(['teacher','lehrer','admin','owner','superadmin'].includes(activeRole())){
  location.replace('/teacher/index.html');
}else{
  try{
    const access=await verifySecureAccess({allowTeacher:false,redirect:true,mark:false});
    if(!access?.ok||access.type!=='student')throw new Error('SECURE_STUDENT_DASHBOARD_ACCESS_REQUIRED');
    // Sobald die Schüleridentität sicher bestätigt ist, darf die Seite nicht mehr unsichtbar bleiben.
    revealDashboard();

    let normalizedProfile=readProfile();
    if(!alreadyCanonicalSecureProfile(normalizedProfile,access.uid)){
      try{
        const identity=await import('/js/student-identity.js?v=identity5');
        normalizedProfile=await identity.normalizeStudentIdentity(normalizedProfile,{silent:true})||normalizedProfile;
      }catch(error){
        console.error('Sichere Schüleridentität konnte vor dem Dashboard nicht bestätigt werden',error);
        location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));
        throw error;
      }
    }
    if(String(normalizedProfile?.authUid||'')!==String(access.uid||'')){
      location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));
      throw new Error('STUDENT_UID_CHANGED_BEFORE_DASHBOARD_RENDER');
    }

    let progressReady=false;
    try{
      const progressModule=await import('/js/account-progress-sync.js?v=12');
      const progressState=await progressModule.startAccountProgressSync();
      progressReady=progressState?.blocked!==true&&progressState?.serverAuthoritative===true&&Number(progressState?.authorityVersion||0)>=2;
      if(!progressReady){
        const repair=String(progressState?.reason||'')==='CLOUD_PROGRESS_REPAIR_SOURCE_REQUIRED';
        warning('Lernstand noch nicht vollständig synchronisiert.',repair?'Öffne SprachPilot einmal auf dem Gerät oder Browser, auf dem dein bisheriger Lernstand noch sichtbar ist. Das Dashboard bleibt trotzdem erreichbar.':'Der Server-Lernstand konnte gerade nicht vollständig geladen werden. Das Dashboard bleibt sichtbar und kann erneut geladen werden.');
      }
    }catch(error){
      console.error('Dashboard-Fortschritt konnte nicht synchronisiert werden',error);
      warning('Lernstand konnte gerade nicht aktualisiert werden.','Die Dashboard-Seite bleibt geöffnet. Versuche die Aktualisierung später erneut.');
    }

    try{localStorage.removeItem('SP_STUDENT_DASHBOARD_LITE_V3')}catch(e){}
    window.SP_PROGRESS_ALIAS_READY=Promise.resolve({ok:progressReady,skipped:!progressReady,reason:progressReady?'server-authoritative-progress-v2':'dashboard-visible-fallback'});
    try{await import('./dashboard-server-v2.js?v=2')}catch(error){console.error('Dashboard-Inhalte konnten nicht vollständig geladen werden',error);warning('Dashboard konnte nur teilweise geladen werden.','Die Anmeldung funktioniert, aber die aktuellen Statistiken konnten nicht vollständig aufgebaut werden.')}
    revealDashboard();
  }catch(error){
    console.error('Schüler-Dashboard Startfehler',error);
    // Authentifizierungsfehler werden vom Gate zur Anmeldung weitergeleitet. Falls eine Weiterleitung ausbleibt,
    // darf die Seite trotzdem nie als komplett leere, unsichtbare Fläche stehen bleiben.
    setTimeout(()=>{
      if(!document.documentElement.dataset.spDashboardAuth&&document.visibilityState!=='hidden')fatalVisible('Dashboard konnte nicht geöffnet werden.','Bitte melde dich erneut an oder lade die Seite neu.');
    },500);
  }
}
