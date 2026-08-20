import '/js/progress.js?v=11';
import '/js/point-delta-bridge.js?v=2';
import '/js/ranking-mirror.js?v=2';
import { authReady } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { normalizeStudentIdentity } from '/js/student-identity.js?v=identity5';
import { isolateLocalProgressOwner } from '/js/account-progress-owner-isolation.js?v=3';
import { accountProgressReady, startAccountProgressSync as startAuthoritativeAccountProgressSync } from '/js/account-progress-sync-authoritative-v2.js?v=2';
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
function alreadyCanonicalSecureProfile(){
  const p=getActiveProfile?.()||{},user=currentFirebaseUser();
  const canonical=String(p.canonicalStudentId||'').trim();
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
  if(!learningPage()||!result?.blocked)return;
  if(document.getElementById('sp-cloud-progress-required'))return;
  const repair=result.reason==='CLOUD_PROGRESS_REPAIR_SOURCE_REQUIRED';
  const box=document.createElement('div');box.id='sp-cloud-progress-required';
  box.style.cssText='position:fixed;inset:0;z-index:2147483647;background:rgba(245,249,252,.98);display:flex;align-items:center;justify-content:center;padding:24px;font:16px/1.5 system-ui;color:#17324d';
  box.innerHTML=repair
    ?'<div style="max-width:620px;background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.14)"><h2 style="margin-top:0">Alter Lernstand muss einmal sicher übernommen werden</h2><p>Firebase enthält Lernfortschritt, aber die frühere Geräte-Synchronisierung hat noch keine vollständige geräteunabhängige Kopie erzeugt.</p><p><b>Öffne SprachPilot bitte einmal auf dem Gerät oder Browser, auf dem dein bisheriger Lernstand noch sichtbar ist.</b> Dort wird er verlustfrei in Firebase übernommen. Danach funktioniert derselbe Stand auf anderen Geräten.</p><button id="sp-cloud-progress-retry" type="button" style="padding:10px 16px">Erneut prüfen</button></div>'
    :'<div style="max-width:620px;background:#fff;border:1px solid #cbd8e2;border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.14)"><h2 style="margin-top:0">Firebase-Fortschritt wird benötigt</h2><p>Dein gespeicherter Lernstand konnte gerade nicht frisch vom SprachPilot-Server geladen werden. Aus Sicherheitsgründen wird kein alter Browser-Cache als Lernstand verwendet.</p><p>Prüfe deine Internetverbindung und lade die Seite danach neu.</p><button id="sp-cloud-progress-retry" type="button" style="padding:10px 16px">Erneut laden</button></div>';
  document.body.appendChild(box);box.querySelector('#sp-cloud-progress-retry').onclick=()=>location.reload();
}
function refreshAfterProgressPreparation(result,isolation){
  if(!learningPage())return false;
  const studentId=String(result?.studentId||isolation?.currentId||localStorage.getItem('SP_STUDENT_ID')||'student');
  const page=String(location.pathname||'')+String(location.search||'');
  const key='SP_ACCOUNT_PROGRESS_RENDERED_V4_'+studentId+'_'+page;
  const restored=Math.max(0,Number(result?.restored)||0)+Math.max(0,Number(result?.restoredStructured)||0)+Math.max(0,Number(result?.rescuedLocal)||0);
  const switched=!!isolation?.switchedAccount&&Math.max(0,Number(isolation?.quarantined)||0)>0;
  try{if(restored<=0&&!switched){sessionStorage.removeItem(key);return false}if(sessionStorage.getItem(key)==='1')return false;sessionStorage.setItem(key,'1')}catch(e){if(restored<=0&&!switched)return false}
  location.reload();return true;
}

export async function startAccountProgressSync(options={}){
  invalidateOldL5Confirmations();
  try{await authReady}catch(e){}
  if(!secureStudentOwner()){
    console.error('Account-Fortschritt-Sync blockiert: keine passende verifizierte Schüler-UID.');
    const result=blockedSecureResult();showCloudProgressRequired(result);return result;
  }
  if(!alreadyCanonicalSecureProfile()){
    try{await normalizeStudentIdentity(null,{silent:true})}catch(e){
      console.error('Schüleridentität konnte nicht sicher normalisiert werden',e);
      const result=blockedSecureResult(e?.message||'IDENTITY_NORMALIZATION_FAILED');showCloudProgressRequired(result);return result;
    }
  }
  if(!secureStudentOwner()){
    const result=blockedSecureResult('STUDENT_UID_CHANGED');showCloudProgressRequired(result);return result;
  }

  let isolation=null;
  try{isolation=await isolateLocalProgressOwner()}catch(e){
    const result=blockedSecureResult('LOCAL_OWNER_ISOLATION_FAILED');showCloudProgressRequired(result);return result;
  }
  if(isolation?.blocked){const result=blockedSecureResult('LOCAL_OWNER_ISOLATION_BLOCKED');showCloudProgressRequired(result);return result}

  const result=await startAuthoritativeAccountProgressSync(options);
  if(result?.blocked){showCloudProgressRequired(result);return result}
  if(refreshAfterProgressPreparation(result,isolation))return result;
  return result;
}
