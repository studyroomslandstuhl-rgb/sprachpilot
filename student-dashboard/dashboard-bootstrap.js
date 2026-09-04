import '/shared/sp-cache-epoch.js?v=20260831-global-progress-sync9';
import '/shared/points-recalculator.js?v=20260904-l8-dashboard1';
import '/shared/dativ-points-extension.js?v=20260831-global3';
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
function timeoutValue(ms,value){return new Promise(resolve=>setTimeout(()=>resolve(value),ms))}
async function withTimeout(promise,ms,fallback){try{return await Promise.race([Promise.resolve(promise),timeoutValue(ms,fallback)])}catch(error){return fallback}}

async function runBackgroundSyncs(){
  const bridgeReady=import('/js/point-delta-bridge.js?v=20260831-central6').then(()=>{try{window.SPEnsurePointDeltaBridge?.()}catch(e){};return true}).catch(error=>{console.warn('Punkte-Kompatibilitätsbridge konnte noch nicht vorbereitet werden.',error);return false});

  const l8Job=(async()=>{
    await bridgeReady;
    try{
      const mod=await import('/js/l8t1-milestone-sync.js?v=20260831-central2');
      return await withTimeout(mod.flushL8T1Milestones({reason:'dashboard-background-sync'}),4000,{ok:false,reason:'dashboard-flush-timeout'});
    }catch(error){console.warn('Lokale L8T1-Fortschritte werden später synchronisiert.',error);return{ok:false}}
  })();

  const aliasJob=(async()=>{
    try{
      const mod=await import('/student-dashboard/progress-alias-unifier.js?v=20260831-central3');
      return await withTimeout(mod.unifyProgressAliases({force:true}),4000,{ok:false,reason:'alias-unify-timeout'});
    }catch(error){console.warn('Fortschritts-Aliasse werden später zusammengeführt.',error);return{ok:false}}
  })();

  const accountJob=(async()=>{
    try{
      const mod=await import('/js/account-progress-sync.js?v=20260831-global9');
      return await withTimeout(mod.startAccountProgressSync({reason:'student-dashboard-background-merge'}),5000,{ok:false,blocked:true,reason:'account-sync-timeout'});
    }catch(error){console.warn('Kontosynchronisierung läuft später weiter.',error);return{ok:false,blocked:true}}
  })();

  const [l8,aliases,progress]=await Promise.all([l8Job,aliasJob,accountJob]);
  let localThemes=0;
  try{
    const mod=await import('/student-dashboard/local-theme-points-recovery.js?v=20260904-l8-all3');
    localThemes=await withTimeout(mod.recover({skipAliasWait:true}),5000,0);
  }catch(error){console.warn('Lokale L7/L8-Themenpunkte werden später synchronisiert.',error)}
  const progressReady=progress?.blocked!==true&&progress?.nonDestructive===true&&Number(progress?.authorityVersion||0)>=5;
  return{ok:progressReady,l8,aliases,progress,localThemes};
}

clearStaleTeacherPreview();
if(['teacher','lehrer','admin','owner','superadmin'].includes(activeRole()))location.replace('/teacher/index.html');
else{
  try{
    const access=await verifySecureAccess({allowTeacher:false,redirect:true,mark:false});
    if(!access?.ok||access.type!=='student')throw new Error('SECURE_STUDENT_DASHBOARD_ACCESS_REQUIRED');
    revealDashboard();

    let normalizedProfile=readProfile();
    if(!alreadyCanonicalSecureProfile(normalizedProfile,access.uid)){
      try{const identity=await import('/js/student-identity.js?v=identity6');normalizedProfile=await identity.normalizeStudentIdentity(normalizedProfile,{silent:true})||normalizedProfile}
      catch(error){console.error('Sichere Schüleridentität konnte vor dem Dashboard nicht bestätigt werden',error);location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));throw error}
    }
    if(String(normalizedProfile?.authUid||'')!==String(access.uid||'')){location.replace('/login/?redirect='+encodeURIComponent(location.pathname+location.search));throw new Error('STUDENT_UID_CHANGED_BEFORE_DASHBOARD_RENDER')}

    try{localStorage.removeItem('SP_STUDENT_DASHBOARD_LITE_V3')}catch(e){}

    // Wichtig für die Startgeschwindigkeit: Statistiken sofort vom kanonischen Firebase-Dokument
    // laden. Aufwendige Reparatur-/Merge-Synchronisierungen laufen parallel und blockieren das
    // Dashboard nicht mehr bis zu 18+ Sekunden.
    const backgroundSync=runBackgroundSyncs();
    window.SP_PROGRESS_ALIAS_READY=backgroundSync.then(result=>({ok:result.ok,skipped:!result.ok,reason:result.ok?'global-non-destructive-progress':'dashboard-direct-server-fallback'}));

    try{await import('./dashboard-server-v3.js?v=20260904-l8points2')}
    catch(error){console.error('Dashboard-Inhalte konnten nicht vollständig geladen werden',error);warning('Dashboard konnte nur teilweise geladen werden.','Die Anmeldung funktioniert, aber die aktuellen Statistiken konnten nicht vollständig aufgebaut werden.')}
    revealDashboard();

    backgroundSync.then(()=>setTimeout(()=>{try{window.SP_DASHBOARD_RETRY?.()}catch(e){}},120)).catch(()=>{});
  }catch(error){
    console.error('Schüler-Dashboard Startfehler',error);
    setTimeout(()=>{if(!document.documentElement.dataset.spDashboardAuth&&document.visibilityState!=='hidden')fatalVisible('Dashboard konnte nicht geöffnet werden.','Bitte melde dich erneut an oder lade die Seite neu.')},500);
  }
}
