import '/js/progress.js?v=20260831-central2';
import '/js/point-delta-bridge.js?v=20260831-central2';
import '/js/ranking-mirror.js?v=20260829-safe15';
import { authReady } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { normalizeStudentIdentity } from '/js/student-identity.js?v=identity5';
import { isolateLocalProgressOwner } from '/js/account-progress-owner-isolation.js?v=3';
import { prepareL78AccountProgressBridge, hydrateL78VisibleProgress, installL78RuntimeBridge } from '/js/account-progress-l78-bridge.js?v=2';
import { accountProgressReady, startAccountProgressSync as startSafeAccountProgressSync } from '/js/account-progress-sync-authoritative-v2.js?v=5';
export { accountProgressReady };

function learningPage(){return /^\/(?:wortschatz|fragen-A1|fragen|verben|verben-A1|verben-bereich|irregulaere-verben|perfekt|grammatik|finnisch|dativverben)(?:\/|$)/i.test(location.pathname||'')}
function profile(){return getActiveProfile?.()||null}
function storedRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').trim().toLowerCase()}
function activeStudentSession(){
  const p=profile(),role=storedRole();
  if(!['student','schueler','schüler'].includes(role))return false;
  return !!(p&&typeof p==='object'&&(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.email));
}
function inactiveResult(reason='NO_ACTIVE_STUDENT_SESSION'){
  const detail={active:false,blocked:false,reason};
  try{delete window.SP_ACCOUNT_PROGRESS_SYNC_BLOCKED;window.SP_ACCOUNT_PROGRESS_SYNC_INACTIVE=detail}catch(e){}
  return detail;
}
function secureStudentOwner(){
  const p=profile()||{},user=currentFirebaseUser();
  const expected=String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();
  return !!(p.secureAuth===true&&expected&&user&&!user.isAnonymous&&user.emailVerified===true&&String(user.uid)===expected);
}
function alreadyCanonicalSecureProfile(){
  const p=profile()||{},user=currentFirebaseUser(),canonical=String(p.canonicalStudentId||'').trim();
  if(!canonical||!user||user.isAnonymous||user.emailVerified!==true)return false;
  if(String(p.authUid||'').trim()!==String(user.uid))return false;
  return p.secureAuth===true&&String(p.docId||canonical)===canonical&&String(p.studentId||canonical)===canonical&&String(p.userId||canonical)===canonical;
}
function blockedSecureResult(reason='SECURE_STUDENT_AUTH_REQUIRED'){
  const detail={active:false,blocked:true,reason};
  try{window.SP_ACCOUNT_PROGRESS_SYNC_BLOCKED=detail;window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNC_BLOCKED',{detail}))}catch(e){}
  return detail;
}
function showCloudProgressRequired(result){
  // Diese Sperre ist ausschließlich für eine tatsächlich aktive Schüler-Sitzung gedacht.
  // Öffentliche/ausgeloggte Wortschatzseiten dürfen niemals durch den Schüler-Sync blockiert werden.
  if(!activeStudentSession()||!learningPage()||!result?.blocked||document.getElementById('sp-cloud-progress-required'))return;
  const box=document.createElement('div');box.id='sp-cloud-progress-required';
  box.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(245,249,252,.98);display:flex;align-items:center;justify-content:center;padding:24px;font:16px/1.5 system-ui;color:#17324d';
  const authProblem=/AUTH|UID|IDENTITY/i.test(String(result.reason||''));
  box.innerHTML=authProblem
    ?'<div style="max-width:620px;background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.14)"><h2 style="margin-top:0">Anmeldung muss erneuert werden</h2><p>Dein gespeicherter Lernstand wurde nicht gelöscht. Bitte melde dich erneut an, damit dein Konto sicher mit der Cloud verbunden werden kann.</p><button id="sp-cloud-progress-retry" type="button" style="padding:10px 16px">Zur Anmeldung</button></div>'
    :'<div style="max-width:620px;background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.14)"><h2 style="margin-top:0">Lernstand konnte nicht sicher synchronisiert werden</h2><p>Der gespeicherte Lernstand wurde nicht gelöscht. Prüfe die Internetverbindung und lade die Seite erneut, damit Cloud- und Browserstand sicher zusammengeführt werden können.</p><button id="sp-cloud-progress-retry" type="button" style="padding:10px 16px">Erneut laden</button></div>';
  document.body.appendChild(box);
  box.querySelector('#sp-cloud-progress-retry').onclick=()=>{if(authProblem)location.href='/login/?redirect='+encodeURIComponent(location.pathname+location.search);else location.reload()};
}
function refreshAfterProgressPreparation(result,isolation){
  if(!learningPage())return false;
  const studentId=String(result?.studentId||isolation?.currentId||localStorage.getItem('SP_STUDENT_ID')||'student');
  const page=String(location.pathname||'')+String(location.search||'');
  const key='SP_ACCOUNT_PROGRESS_RENDERED_V10_'+studentId+'_'+page;
  const restored=Math.max(0,Number(result?.restored)||0)+Math.max(0,Number(result?.restoredStructured)||0)+Math.max(0,Number(result?.rescuedLocal)||0)+Math.max(0,Number(result?.restoredL78)||0);
  const switched=!!isolation?.switchedAccount&&Math.max(0,Number(isolation?.quarantined)||0)>0;
  try{if(restored<=0&&!switched){sessionStorage.removeItem(key);return false}if(sessionStorage.getItem(key)==='1')return false;sessionStorage.setItem(key,'1')}catch(e){if(restored<=0&&!switched)return false}
  location.reload();return true;
}

export async function startAccountProgressSync(options={}){
  // Wichtig: Auf öffentlichen Seiten bzw. ohne echte Schüler-Sitzung gibt es nichts zu
  // synchronisieren. Das ist kein Fehler und darf keine Vollbild-Sperre auslösen.
  if(!activeStudentSession())return inactiveResult();

  try{await authReady}catch(e){}
  if(!activeStudentSession())return inactiveResult('STUDENT_SESSION_ENDED');
  if(!secureStudentOwner()){
    const result=blockedSecureResult();showCloudProgressRequired(result);return result;
  }
  if(!alreadyCanonicalSecureProfile()){
    try{await normalizeStudentIdentity(null,{silent:true})}catch(e){
      const result=blockedSecureResult(e?.message||'IDENTITY_NORMALIZATION_FAILED');showCloudProgressRequired(result);return result;
    }
  }
  if(!activeStudentSession())return inactiveResult('STUDENT_SESSION_ENDED');
  if(!secureStudentOwner()){
    const result=blockedSecureResult('STUDENT_UID_CHANGED');showCloudProgressRequired(result);return result;
  }
  let isolation=null;
  try{isolation=await isolateLocalProgressOwner()}catch(e){
    const result=blockedSecureResult('LOCAL_OWNER_ISOLATION_FAILED');showCloudProgressRequired(result);return result;
  }
  if(isolation?.blocked){const result=blockedSecureResult('LOCAL_OWNER_ISOLATION_BLOCKED');showCloudProgressRequired(result);return result}

  let bridge={active:false,staged:0};
  try{bridge=prepareL78AccountProgressBridge()||bridge;installL78RuntimeBridge()}catch(error){console.warn('L7/L8 Kontofortschritt konnte vor der Cloud-Hydrierung nicht vorbereitet werden',error)}
  const result=await startSafeAccountProgressSync(options);
  if(result?.blocked){showCloudProgressRequired(result);return result}
  let restoredL78=0;
  try{restoredL78=hydrateL78VisibleProgress()||0;installL78RuntimeBridge()}catch(error){console.warn('L7/L8 Kontofortschritt konnte nicht vollständig rekonstruiert werden',error)}
  const enriched={...result,l78BridgeStaged:Number(bridge?.staged)||0,restoredL78,serverResetApplied:Number(result?.restoredStructured||0)>0,nonDestructive:true};
  if(refreshAfterProgressPreparation(enriched,isolation))return enriched;
  return enriched;
}