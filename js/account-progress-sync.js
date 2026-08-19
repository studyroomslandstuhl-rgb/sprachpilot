import '/js/progress.js?v=11';
import '/js/point-delta-bridge.js?v=2';
import '/js/ranking-mirror.js?v=2';
import { authReady } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { normalizeStudentIdentity } from '/js/student-identity.js?v=identity5';
import { isolateLocalProgressOwner } from '/js/account-progress-owner-isolation.js?v=3';
import { accountProgressReady, startAccountProgressSync as startSafeAccountProgressSync } from '/js/account-progress-sync-safe.js?v=6';
export { accountProgressReady };

function invalidateOldL5Confirmations(){
  if(sessionStorage.getItem('SP_L5_SIG_RECHECK_V4')==='1')return;
  sessionStorage.setItem('SP_L5_SIG_RECHECK_V4','1');
  try{const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(String(k||'').startsWith('SP_L5_POINTS_SIG_V3_'))keys.push(k)}keys.forEach(k=>localStorage.removeItem(k))}catch(e){}
}
function learningPage(){return /^\/(?:wortschatz|fragen-A1|fragen|verben|verben-A1|verben-bereich|irregulaere-verben|perfekt|grammatik|finnisch)(?:\/|$)/i.test(location.pathname||'')}
function secureStudentOwner(){
  const p=getActiveProfile?.()||{};
  const user=currentFirebaseUser();
  const expected=String(p.authUid||localStorage.getItem('SP_STUDENT_AUTH_UID')||'').trim();
  return !!(p.secureAuth===true&&expected&&user&&!user.isAnonymous&&user.emailVerified===true&&String(user.uid)===expected);
}
function blockedSecureResult(reason='SECURE_STUDENT_AUTH_REQUIRED'){
  const detail={active:false,blocked:true,reason};
  try{window.SP_ACCOUNT_PROGRESS_SYNC_BLOCKED=detail;window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNC_BLOCKED',{detail}))}catch(e){}
  return detail;
}
function refreshAfterProgressPreparation(result,isolation){
  if(!learningPage())return false;
  const studentId=String(result?.studentId||isolation?.currentId||localStorage.getItem('SP_STUDENT_ID')||'student');
  const page=String(location.pathname||'')+String(location.search||'');
  const key='SP_ACCOUNT_PROGRESS_RENDERED_V2_'+studentId+'_'+page;
  const restored=Math.max(0,Number(result?.restored)||0),switched=!!isolation?.switchedAccount&&Math.max(0,Number(isolation?.quarantined)||0)>0;
  try{if(restored<=0&&!switched){sessionStorage.removeItem(key);return false}if(sessionStorage.getItem(key)==='1')return false;sessionStorage.setItem(key,'1')}catch(e){if(restored<=0&&!switched)return false}
  location.reload();return true;
}

export async function startAccountProgressSync(options={}){
  invalidateOldL5Confirmations();
  try{await authReady}catch(e){}
  if(!secureStudentOwner()){
    console.error('Account-Fortschritt-Sync blockiert: keine passende verifizierte Schüler-UID.');
    return blockedSecureResult();
  }
  try{await normalizeStudentIdentity(null,{silent:true})}catch(e){
    console.error('Schüleridentität konnte nicht sicher normalisiert werden',e);
    return blockedSecureResult(e?.message||'IDENTITY_NORMALIZATION_FAILED');
  }
  if(!secureStudentOwner())return blockedSecureResult('STUDENT_UID_CHANGED');

  let isolation=null;
  try{isolation=await isolateLocalProgressOwner()}catch(e){return blockedSecureResult('LOCAL_OWNER_ISOLATION_FAILED')}
  if(isolation?.blocked)return blockedSecureResult('LOCAL_OWNER_ISOLATION_BLOCKED');

  const result=await startSafeAccountProgressSync(options);
  if(refreshAfterProgressPreparation(result,isolation))return result;
  if(!sessionStorage.getItem('SP_LEGACY_RESCUE_STARTED_V2')){
    sessionStorage.setItem('SP_LEGACY_RESCUE_STARTED_V2','1');
    setTimeout(()=>{import('/js/progress-rescue-legacy.js?v=2').then(m=>m.rescueLegacyProgress()).catch(error=>console.warn('Alte Lektionsfortschritte konnten nicht vollständig rekonstruiert werden',error))},2500);
  }
  return result;
}