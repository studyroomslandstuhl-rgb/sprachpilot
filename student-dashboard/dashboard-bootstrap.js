import '/shared/sp-cache-epoch.js?v=20260829-points7';
import '/js/session-restore.js?v=20260831-central2';
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
  revealDashboard();let box=document.getElementById('spDashboardWarning');
  if(!box){box=document.createElement('div');box.id='spDashboardWarning';box.style.cssText='max-width:1160px;margin:14px auto;padding:14px 16px;border:1px solid #e5b94b;border-radius:16px;background:#fff8df;color:#6f5310;font:15px/1.45 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.07)';document.body.insertBefore(box,document.body.firstChild)}
  box.innerHTML=`<strong>${title}</strong><br>${text} <button id="spDashboardRetry" type="button" style="margin-left:8px;padding:7px 10px;border:0;border-radius:10px;background:#2f7f96;color:#fff;font-weight:800">Jetzt aktualisieren</button>`;
  document.getElementById('spDashboardRetry').onclick=async()=>{const btn=document.getElementById('spDashboardRetry');if(btn)btn.disabled=true;try{const ok=typeof window.SP_DASHBOARD_RETRY==='function'?await window.SP_DASHBOARD_RETRY():false;if(ok){box.remove();return}location.reload()}catch(e){location.reload()}};
}
function fatalVisible(title,text){revealDashboard();warning(title,text)}

clearStaleTeacherPreview();
if(['teacher','lehrer','admin','owner','superadmin'].includes(activeRole()))location.replace('/teacher/index.html');
else{
  try{
    const access=await verifySecureAccess({allowTeacher:false,redirect:true,mark:false});
    if(!access?.ok||access.type!=='student')throw new Error('SECURE_STUDENT_DASHBOARD_ACCESS_REQUIRED');
    revealDashboard();
    let normalizedProfile=readProfile();
    if(!alreadyCanonicalSecureProfile(normalizedProfile,access.uid)){
      try{const identity=await import('/js/student-identity.js?v=identity5');normalizedProfile=await identity.normalizeStudentIdentity(normalizedProfile,{silent:true})||normalizedProfile}
      catch(error){console.error('Sichere Schüleridentität konnte vor dem Dashboard nicht bestätigt werden',error);location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));throw error}
    }
    if(String(normalizedProfile?.authUid||'')!==String(access.uid||'')){location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));throw new Error('STUDENT_UID_CHANGED_BEFORE_DASHBOARD_RENDER')}

    try{await import('/js/point-delta-bridge.js?v=20260831-central2');try{window.SPEnsurePointDeltaBridge?.()}catch(e){}}
    catch(error){console.warn('Punkte-Kompatibilitätsbridge konnte im Dashboard noch nicht vorbereitet werden.',error)}

    try{
      const l8t1Points=await import('/js/l8t1-milestone-sync.js?v=20260831-central2');
      await Promise.race([l8t1Points.flushL8T1Milestones({reason:'dashboard-before-server-read'}),new Promise(resolve=>setTimeout(()=>resolve({ok:false,reason:'dashboard-flush-timeout'}),10000))]);
    }catch(error){console.warn('Lokale L8T1-Fortschritte konnten vor dem Dashboard noch nicht an den zentralen Fortschrittsschreiber übergeben werden.',error)}

    try{
      const aliases=await import('/student-dashboard/progress-alias-unifier.js?v=20260831-central2');
      await Promise.race([aliases.unifyProgressAliases({force:true}),new Promise(resolve=>setTimeout(()=>resolve({ok:false,reason:'alias-unify-timeout'}),8000))]);
    }catch(error){console.warn('Verteilte Fortschrittsstände konnten noch nicht zusammengeführt werden.',error)}

    // Keine automatische Punkte-Neuberechnung/Reparatur beim bloßen Öffnen des Dashboards.
    // Historische Teilnehmerstände werden nur gezielt repariert; normale neue Punkte kommen
    // aus dem transaktionalen Fortschrittsschreiber.
    let progressReady=false;
    try{
      const progressModule=await import('/js/account-progress-sync.js?v=20260831-central2');
      const progressState=await progressModule.startAccountProgressSync();
      progressReady=progressState?.blocked!==true&&progressState?.nonDestructive===true&&Number(progressState?.authorityVersion||0)>=5;
      if(!progressReady)console.warn('Dashboard nutzt direkten Firebase-Stand, Kontosynchronisierung ist noch nicht vollständig bereit.',progressState);
    }catch(error){console.warn('Kontosynchronisierung im Dashboard verzögert; direkter Firebase-Stand wird trotzdem geladen.',error)}

    try{localStorage.removeItem('SP_STUDENT_DASHBOARD_LITE_V3')}catch(e){}
    window.SP_PROGRESS_ALIAS_READY=Promise.resolve({ok:progressReady,skipped:!progressReady,reason:progressReady?'non-destructive-progress-v5':'dashboard-direct-server-fallback'});
    try{await import('./dashboard-server-v3.js?v=20260829-points7')}
    catch(error){console.error('Dashboard-Inhalte konnten nicht vollständig geladen werden',error);warning('Dashboard konnte nur teilweise geladen werden.','Die Anmeldung funktioniert, aber die aktuellen Statistiken konnten nicht vollständig aufgebaut werden.')}
    revealDashboard();
  }catch(error){
    console.error('Schüler-Dashboard Startfehler',error);
    setTimeout(()=>{if(!document.documentElement.dataset.spDashboardAuth&&document.visibilityState!=='hidden')fatalVisible('Dashboard konnte nicht geöffnet werden.','Bitte melde dich erneut an oder lade die Seite neu.')},500);
  }
}