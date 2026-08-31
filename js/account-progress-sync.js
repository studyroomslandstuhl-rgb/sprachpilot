import '/js/progress.js?v=20260831-central6';
import '/js/point-delta-bridge.js?v=20260831-central6';
import '/js/ranking-mirror.js?v=20260829-safe15';
import { auth, authReady } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { normalizeStudentIdentity } from '/js/student-identity.js?v=identity6';
import { isolateLocalProgressOwner } from '/js/account-progress-owner-isolation.js?v=3';
import { prepareL78AccountProgressBridge, hydrateL78VisibleProgress, installL78RuntimeBridge } from '/js/account-progress-l78-bridge.js?v=20260831-central8';
import { accountProgressReady, startAccountProgressSync as startSafeAccountProgressSync } from '/js/account-progress-sync-authoritative-v2.js?v=20260831-central6';
export { accountProgressReady };

let wrapperRunning=null,retryTimer=null;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function learningPage(){return /^\/(?:wortschatz|fragen-A1|fragen|verben|verben-A1|verben-bereich|irregulaere-verben|perfekt|grammatik|finnisch|dativverben)(?:\/|$)/i.test(location.pathname||'')}
function parse(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
function profile(){return getActiveProfile?.()||null}
function storedRole(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').trim().toLowerCase()}
function previewMarker(){
 try{
  const local=localStorage.getItem('SP_TEACHER_PREVIEW'),session=sessionStorage.getItem('SP_TEACHER_PREVIEW');
  return local==='1'||session==='1'||parse(local)?.teacherPreview===true||parse(session)?.teacherPreview===true;
 }catch(e){return false}
}
function teacherSession(){
 const role=storedRole(),p=profile()||{},teacher=parse(localStorage.getItem('SP_TEACHER_PROFILE'))||{};
 if(['teacher','lehrer','admin','owner','superadmin'].includes(role)||p.teacherPreview===true||p.previewOnly===true||p.studentCoursePreview===true||p.isTeacher===true)return true;
 return previewMarker()&&!!(teacher.uid||teacher.email||localStorage.getItem('SP_TEACHER_UID'));
}
function activeStudentSession(){
  if(teacherSession())return false;
  const p=profile(),role=storedRole();
  if(!['student','schueler','schüler'].includes(role))return false;
  return !!(p&&typeof p==='object'&&(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.email));
}
function inactiveResult(reason='NO_ACTIVE_STUDENT_SESSION',extra={}){
  const detail={active:false,blocked:false,reason,...extra};
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
async function waitForFirebaseStudent(timeout=6000){
  const until=Date.now()+Math.max(800,Number(timeout)||6000);
  while(Date.now()<until){
    if(!activeStudentSession())return null;
    const user=currentFirebaseUser()||auth.currentUser;
    if(user&&!user.isAnonymous)return user;
    await sleep(120);
  }
  return currentFirebaseUser()||auth.currentUser||null;
}
function hardAuthProblem(user){
  if(!user||user.isAnonymous)return'';
  if(user.emailVerified!==true)return'VERIFIED_FIREBASE_STUDENT_REQUIRED';
  const p=profile()||{},expected=String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();
  if(expected&&String(user.uid)!==expected)return'STUDENT_UID_CHANGED';
  return'';
}
async function prepareSecureIdentity(timeout=5000){
  const until=Date.now()+Math.max(1000,Number(timeout)||5000);let lastError=null,normalizedOnce=false;
  while(Date.now()<until){
    if(teacherSession())return{ok:false,inactive:'TEACHER_OR_PREVIEW_SESSION'};
    if(!activeStudentSession())return{ok:false,inactive:'STUDENT_SESSION_ENDED'};
    const user=currentFirebaseUser()||auth.currentUser,hard=hardAuthProblem(user);
    if(hard)return{ok:false,hard};
    if(user&&!user.isAnonymous&&user.emailVerified===true){
      if(!normalizedOnce||!alreadyCanonicalSecureProfile()){
        try{await normalizeStudentIdentity(null,{silent:true});lastError=null;normalizedOnce=true}
        catch(error){
          lastError=error;normalizedOnce=true;
          const code=String(error?.message||'');
          if(/OWNERSHIP_MISMATCH|UID_MISMATCH/i.test(code))return{ok:false,hard:code};
        }
      }
      if(secureStudentOwner())return{ok:true,user:currentFirebaseUser()||auth.currentUser};
    }
    await sleep(280);
  }
  return{ok:false,pending:lastError?.message||'STUDENT_IDENTITY_PENDING'};
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
function authBlockingResult(result){const text=String(result?.reason||'')+' '+String(result?.code||'');return /AUTH|UID|IDENTITY|STUDENT_ID|VERIFIED|permission-denied/i.test(text)}
function showCloudProgressRequired(result){
  if(teacherSession()||!activeStudentSession()||!learningPage()||!result?.blocked||!authBlockingResult(result)||document.getElementById('sp-cloud-progress-required'))return;
  const box=document.createElement('div');box.id='sp-cloud-progress-required';
  box.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(245,249,252,.98);display:flex;align-items:center;justify-content:center;padding:24px;font:16px/1.5 system-ui;color:#17324d';
  box.innerHTML='<div style="max-width:620px;background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.14)"><h2 style="margin-top:0">Anmeldung muss erneuert werden</h2><p>Dein Lernstand bleibt erhalten. Die sichere Firebase-Anmeldung dieses Geräts passt nicht zur aktiven Schüler-Sitzung. Melde dich einmal neu an; danach werden die Geräte zusammengeführt.</p><button id="sp-cloud-progress-retry" type="button" style="padding:10px 16px">Neu anmelden</button></div>';
  document.body.appendChild(box);
  box.querySelector('#sp-cloud-progress-retry').onclick=()=>{location.href='/login/?redirect='+encodeURIComponent(location.pathname+location.search)};
}
function refreshAfterProgressPreparation(result,isolation){
  if(!learningPage())return false;
  const studentId=String(result?.studentId||isolation?.currentId||localStorage.getItem('SP_STUDENT_ID')||'student');
  const page=String(location.pathname||'')+String(location.search||'');
  const key='SP_ACCOUNT_PROGRESS_RENDERED_V14_'+studentId+'_'+page;
  const restored=Math.max(0,Number(result?.restoredStructured)||0)+Math.max(0,Number(result?.rescuedLocal)||0)+Math.max(0,Number(result?.pendingApplied)||0)+Math.max(0,Number(result?.restoredL78)||0);
  const switched=!!isolation?.switchedAccount&&Math.max(0,Number(isolation?.quarantined)||0)>0;
  try{if(restored<=0&&!switched){sessionStorage.removeItem(key);return false}if(sessionStorage.getItem(key)==='1')return false;sessionStorage.setItem(key,'1')}catch(e){if(restored<=0&&!switched)return false}
  location.reload();return true;
}

async function startInner(options={}){
  if(teacherSession())return inactiveResult('TEACHER_OR_PREVIEW_SESSION');
  if(!activeStudentSession())return inactiveResult();

  try{await authReady}catch(e){}
  if(!activeStudentSession())return inactiveResult('STUDENT_SESSION_ENDED');

  const user=await waitForFirebaseStudent(options.authWaitMs||6000);
  if(!user){scheduleRetry(1500);return inactiveResult('STUDENT_AUTH_PENDING')}
  const hard=hardAuthProblem(user);
  if(hard){const result=blockedSecureResult(hard);showCloudProgressRequired(result);return result}

  const identity=await prepareSecureIdentity(options.identityWaitMs||5000);
  if(identity.inactive)return inactiveResult(identity.inactive);
  if(identity.hard){const result=blockedSecureResult(identity.hard);showCloudProgressRequired(result);return result}
  if(!identity.ok){scheduleRetry(1500);return inactiveResult(identity.pending||'STUDENT_IDENTITY_PENDING')}

  // L7/L8 zuerst in das kontogebundene Pending-Journal übernehmen. Dadurch bleibt der
  // lokale Gerätefortschritt auch dann erhalten, wenn die Owner-Isolation wegen einer
  // alten Konto-ID anschließend lokale Alias-Keys quarantänisieren muss.
  let bridge={active:false,staged:0,rawMigrated:0};
  try{bridge=prepareL78AccountProgressBridge()||bridge;installL78RuntimeBridge()}catch(error){console.warn('L7/L8 Kontofortschritt konnte vor der Kontozuordnung nicht vorbereitet werden',error)}

  let isolation=null;
  try{isolation=await isolateLocalProgressOwner()}catch(e){
    const result=blockedSecureResult('LOCAL_OWNER_ISOLATION_FAILED');showCloudProgressRequired(result);return result;
  }
  if(isolation?.blocked){const result=blockedSecureResult('LOCAL_OWNER_ISOLATION_BLOCKED');showCloudProgressRequired(result);return result}

  const result=await startSafeAccountProgressSync(options);
  if(result?.pending||result?.transient){scheduleRetry(1400);return inactiveResult(result.reason||'CLOUD_SYNC_PENDING',{pending:true,transient:!!result.transient,code:result.code||''})}
  if(result?.blocked){
    if(authBlockingResult(result)){showCloudProgressRequired(result);return result}
    scheduleRetry(1800);return inactiveResult(result.reason||'CLOUD_SYNC_RETRY',{pending:true,code:result.code||''})
  }
  let restoredL78=0,l78Flushed=false;
  try{
    restoredL78=hydrateL78VisibleProgress()||0;
    installL78RuntimeBridge();
    // Die account-scoped Canonicalisierung kann einen neuen gemeinsamen Ledger erzeugen.
    // Dieser muss noch in derselben Startphase in die Cloud, damit das zweite Gerät nicht
    // erneut nur seinen alten PID-Zweig liest.
    const flushed=await window.SPAccountProgressSync?.flush?.();
    l78Flushed=!!flushed?.ok;
  }catch(error){console.warn('L7/L8 Kontofortschritt konnte nicht vollständig rekonstruiert werden',error)}
  const enriched={...result,l7l8AccountScopedMerge:true,l78BridgeStaged:Number(bridge?.staged)||0,l78RawMigrated:Number(bridge?.rawMigrated)||0,restoredL78,l78Flushed,serverResetApplied:Number(result?.restoredStructured||0)>0,nonDestructive:true};
  if(refreshAfterProgressPreparation(enriched,isolation))return enriched;
  return enriched;
}

export function startAccountProgressSync(options={}){
  if(wrapperRunning)return wrapperRunning;
  wrapperRunning=startInner(options).finally(()=>{wrapperRunning=null});
  return wrapperRunning;
}