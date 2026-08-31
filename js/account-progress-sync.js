import '/js/progress.js?v=20260831-central3';
import '/js/point-delta-bridge.js?v=20260831-central3';
import '/js/ranking-mirror.js?v=20260829-safe15';
import { auth, authReady } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { normalizeStudentIdentity } from '/js/student-identity.js?v=identity5';
import { isolateLocalProgressOwner } from '/js/account-progress-owner-isolation.js?v=3';
import { prepareL78AccountProgressBridge, hydrateL78VisibleProgress, installL78RuntimeBridge } from '/js/account-progress-l78-bridge.js?v=20260831-central3';
import { accountProgressReady, startAccountProgressSync as startSafeAccountProgressSync } from '/js/account-progress-sync-authoritative-v2.js?v=20260831-central3';
export { accountProgressReady };

let wrapperRunning=null,retryTimer=null;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function learningPage(){return /^\/(?:wortschatz|fragen-A1|fragen|verben|verben-A1|verben-bereich|irregulaere-verben|perfekt|grammatik|finnisch|dativverben)(?:\/|$)/i.test(location.pathname||'')}
function profile(){return getActiveProfile?.()||null}
function storedRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').trim().toLowerCase()}
function teacherSession(){const role=storedRole(),p=profile()||{};return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||p.teacherPreview===true||p.previewOnly===true||p.isTeacher===true}
function activeStudentSession(){
  if(teacherSession())return false;
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
  const p=profile()||{},user=currentFirebaseUser()||auth.currentUser;
  const expected=String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();
  return !!(p.secureAuth===true&&expected&&user&&!user.isAnonymous&&user.emailVerified===true&&String(user.uid)===expected);
}
function alreadyCanonicalSecureProfile(){
  const p=profile()||{},user=currentFirebaseUser()||auth.currentUser,canonical=String(p.canonicalStudentId||'').trim();
  if(!canonical||!user||user.isAnonymous||user.emailVerified!==true)return false;
  if(String(p.authUid||'').trim()!==String(user.uid))return false;
  return p.secureAuth===true&&String(p.docId||canonical)===canonical&&String(p.studentId||canonical)===canonical&&String(p.userId||canonical)===canonical;
}
async function waitForFirebaseStudent(timeout=4500){
  const until=Date.now()+Math.max(500,Number(timeout)||4500);
  while(Date.now()<until){
    if(!activeStudentSession())return null;
    const user=currentFirebaseUser()||auth.currentUser;
    if(user&&!user.isAnonymous)return user;
    await sleep(120);
  }
  return currentFirebaseUser()||auth.currentUser||null;
}
function blockedSecureResult(reason='SECURE_STUDENT_AUTH_REQUIRED'){
  const detail={active:false,blocked:true,reason};
  try{window.SP_ACCOUNT_PROGRESS_SYNC_BLOCKED=detail;window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNC_BLOCKED',{detail}))}catch(e){}
  return detail;
}
function scheduleRetry(delay=1200){
  clearTimeout(retryTimer);
  retryTimer=setTimeout(()=>{retryTimer=null;startAccountProgressSync({reason:'auth-retry',silentPending:true}).catch(()=>{})},Math.max(250,Number(delay)||1200));
}
function showCloudProgressRequired(result){
  if(teacherSession()||!activeStudentSession()||!learningPage()||!result?.blocked||document.getElementById('sp-cloud-progress-required'))return;
  const box=document.createElement('div');box.id='sp-cloud-progress-required';
  box.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(245,249,252,.98);display:flex;align-items:center;justify-content:center;padding:24px;font:16px/1.5 system-ui;color:#17324d';
  const authProblem=/AUTH|UID|IDENTITY|STUDENT_ID/i.test(String(result.reason||''));
  box.innerHTML=authProblem
    ?'<div style="max-width:620px;background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.14)"><h2 style="margin-top:0">Anmeldung muss erneuert werden</h2><p>Dein Lernstand ist gespeichert. Die sichere Firebase-Anmeldung dieses Geräts ist jedoch nicht mehr aktiv. Melde dich einmal neu an; danach werden die Geräte zusammengeführt.</p><button id="sp-cloud-progress-retry" type="button" style="padding:10px 16px">Neu anmelden</button></div>'
    :'<div style="max-width:620px;background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.14)"><h2 style="margin-top:0">Cloud gerade nicht erreichbar</h2><p>Dein lokaler Lernstand bleibt erhalten. Du kannst weiterarbeiten; die Synchronisierung wird automatisch erneut versucht.</p><button id="sp-cloud-progress-retry" type="button" style="padding:10px 16px">Jetzt erneut versuchen</button></div>';
  document.body.appendChild(box);
  box.querySelector('#sp-cloud-progress-retry').onclick=()=>{if(authProblem)location.href='/login/?redirect='+encodeURIComponent(location.pathname+location.search);else{box.remove();scheduleRetry(0)}};
}
function refreshAfterProgressPreparation(result,isolation){
  if(!learningPage())return false;
  const studentId=String(result?.studentId||isolation?.currentId||localStorage.getItem('SP_STUDENT_ID')||'student');
  const page=String(location.pathname||'')+String(location.search||'');
  const key='SP_ACCOUNT_PROGRESS_RENDERED_V11_'+studentId+'_'+page;
  const restored=Math.max(0,Number(result?.restored)||0)+Math.max(0,Number(result?.restoredStructured)||0)+Math.max(0,Number(result?.rescuedLocal)||0)+Math.max(0,Number(result?.restoredL78)||0);
  const switched=!!isolation?.switchedAccount&&Math.max(0,Number(isolation?.quarantined)||0)>0;
  try{if(restored<=0&&!switched){sessionStorage.removeItem(key);return false}if(sessionStorage.getItem(key)==='1')return false;sessionStorage.setItem(key,'1')}catch(e){if(restored<=0&&!switched)return false}
  location.reload();return true;
}

async function startInner(options={}){
  if(teacherSession())return inactiveResult('TEACHER_OR_PREVIEW_SESSION');
  if(!activeStudentSession())return inactiveResult();

  try{await authReady}catch(e){}
  if(!activeStudentSession())return inactiveResult('STUDENT_SESSION_ENDED');

  let user=await waitForFirebaseStudent(options.authWaitMs||4500);
  if(!user){scheduleRetry(1500);return inactiveResult('STUDENT_AUTH_PENDING')}
  if(user.isAnonymous){
    const result=blockedSecureResult('SECURE_STUDENT_AUTH_REQUIRED');showCloudProgressRequired(result);return result;
  }

  if(!alreadyCanonicalSecureProfile()){
    try{await normalizeStudentIdentity(null,{silent:true})}catch(e){
      const result=blockedSecureResult(e?.message||'IDENTITY_NORMALIZATION_FAILED');showCloudProgressRequired(result);return result;
    }
  }
  if(!activeStudentSession())return inactiveResult('STUDENT_SESSION_ENDED');
  if(!secureStudentOwner()){
    user=currentFirebaseUser()||auth.currentUser;
    const reason=user&&!user.isAnonymous?'STUDENT_UID_CHANGED':'SECURE_STUDENT_AUTH_REQUIRED';
    const result=blockedSecureResult(reason);showCloudProgressRequired(result);return result;
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

export function startAccountProgressSync(options={}){
  if(wrapperRunning)return wrapperRunning;
  wrapperRunning=startInner(options).finally(()=>{wrapperRunning=null});
  return wrapperRunning;
}