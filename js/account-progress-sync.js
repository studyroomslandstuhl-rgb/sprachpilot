import '/js/progress.js?v=20260822-sync14';
import '/js/point-delta-bridge.js?v=20260822-sync14';
import '/js/ranking-mirror.js?v=20260822-sync14';
import { authReady, db, doc, getDocFromServer, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { currentFirebaseUser } from '/js/student-secure-auth.js?v=1';
import { normalizeStudentIdentity } from '/js/student-identity.js?v=identity5';
import { isolateLocalProgressOwner } from '/js/account-progress-owner-isolation.js?v=3';
import { prepareL78AccountProgressBridge, hydrateL78VisibleProgress, installL78RuntimeBridge } from '/js/account-progress-l78-bridge.js?v=1';
import { accountProgressReady, startAccountProgressSync as startAuthoritativeAccountProgressSync } from '/js/account-progress-sync-authoritative-v2.js?v=3';
export { accountProgressReady };

const RESET_MARKER='spCanonicalResetAuthoritativeV1';
const CLOUD_FIELD='clientProgressStateV1';
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
function canonicalId(){const p=getActiveProfile?.()||{};return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim()}
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
  const key='SP_ACCOUNT_PROGRESS_RENDERED_V6_'+studentId+'_'+page;
  const restored=Math.max(0,Number(result?.restored)||0)+Math.max(0,Number(result?.restoredStructured)||0)+Math.max(0,Number(result?.rescuedLocal)||0)+Math.max(0,Number(result?.restoredL78)||0);
  const switched=!!isolation?.switchedAccount&&Math.max(0,Number(isolation?.quarantined)||0)>0;
  try{if(restored<=0&&!switched){sessionStorage.removeItem(key);return false}if(sessionStorage.getItem(key)==='1')return false;sessionStorage.setItem(key,'1')}catch(e){if(restored<=0&&!switched)return false}
  location.reload();return true;
}
function positive(value){return Number(value||0)>0}
function serverHasStructuredProgress(data={}){
  if(positive(data?.totals?.points)||positive(data.pointsTotal)||positive(data.lifetimePoints)||positive(data.punkteGesamt)||positive(data.points)||positive(data?.ranking?.points))return true;
  for(const module of ['wortschatz','fragen','verben','perfekt','grammatik']){
    const group=data?.[module];if(!group||typeof group!=='object')continue;
    for(const record of Object.values(group)){
      if(!record||typeof record!=='object')continue;
      if(positive(record.progressPercent)||positive(record?.current?.percent)||record.completed===true)return true;
      if(positive(record?.exam?.bestPercent)||positive(record?.exam?.percent)||record?.exam?.completed===true)return true;
      for(const task of Object.values(record.tasks||{})){
        if(!task||typeof task!=='object')continue;
        if(positive(task.percent)||positive(task.progress)||positive(task.done)||task.completed===true||(Array.isArray(task.done)&&task.done.length))return true;
      }
    }
  }
  return false;
}
function isProgressLocalKey(key,value){
  const k=String(key||'');
  if(!k)return false;
  if(/^SP_ACCOUNT_PROGRESS_PENDING_V1_/.test(k)||k==='SP_ACCOUNT_PROGRESS_TRACKED'||k==='SP_ACCOUNT_PROGRESS_OWNER'||k==='SP_POINTS_TOTAL')return true;
  if(/^SP_(?:THEME_SCORE_|SCORE_RUN_|L[3-9]_T|L[3-9]_.*_T|L7_|L8_|VERB|PERFEKT|GRAMMATIK|FRAGEN)/i.test(k))return true;
  try{return !!window.SPAccountProgressCloudCore?.eligible?.(k,value)}catch(e){return false}
}
function clearLocalProgressForServerReset(){
  const remove=[];
  try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i),value=key?localStorage.getItem(key):null;if(key&&isProgressLocalKey(key,value))remove.push(key)}}catch(e){}
  remove.forEach(key=>{try{localStorage.removeItem(key)}catch(e){}});
  try{for(let i=sessionStorage.length-1;i>=0;i--){const key=sessionStorage.key(i);if(key&&/^SP_ACCOUNT_PROGRESS_RENDERED_/.test(key))sessionStorage.removeItem(key)}}catch(e){}
  return remove.length;
}
function profileStorageSnapshot(){const out={};for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE']){try{out[key]=localStorage.getItem(key)}catch(e){out[key]=null}}return out}
function setCanonicalOnlyProfiles(){
  const canonical=canonicalId(),before=profileStorageSnapshot();if(!canonical)return()=>{};
  for(const key of Object.keys(before)){
    try{const raw=before[key];if(!raw)continue;const p=JSON.parse(raw);p.aliasIds=[];p.canonicalStudentId=canonical;p.docId=canonical;p.studentId=canonical;p.userId=canonical;p.id=canonical;localStorage.setItem(key,JSON.stringify(p))}catch(e){}
  }
  return()=>{for(const [key,raw] of Object.entries(before)){try{if(raw==null)localStorage.removeItem(key);else localStorage.setItem(key,raw)}catch(e){}}};
}
async function prepareCanonicalResetPolicy(){
  const id=canonicalId();if(!id)return{canonicalOnly:false,reset:false};
  let snap=null;try{snap=await getDocFromServer(doc(db,'progress',id))}catch(error){console.warn('Reset-Prüfung konnte Firebase nicht frisch lesen',error);return{canonicalOnly:false,reset:false}}
  const exists=!!snap?.exists?.(),data=exists?(snap.data()||{}):{};
  const marked=data[RESET_MARKER]===true;
  const noStructured=!serverHasStructuredProgress(data);
  if(marked)return{canonicalOnly:true,reset:false};
  if(!exists||noStructured){
    const removed=clearLocalProgressForServerReset();
    try{
      await setDoc(doc(db,'progress',id),{
        [CLOUD_FIELD]:{},clientProgressStateVersion:2,clientProgressAuthorityVersion:2,
        clientProgressAuthorityMode:'server-reset-authoritative-v1',[RESET_MARKER]:true,
        spCanonicalResetAt:serverTimestamp(),updatedAt:serverTimestamp()
      },{merge:true});
    }catch(error){console.warn('Server-Reset-Markierung konnte nicht geschrieben werden',error)}
    try{window.dispatchEvent(new CustomEvent('SP_SERVER_PROGRESS_RESET_APPLIED',{detail:{studentId:id,removedLocal:removed}}))}catch(e){}
    return{canonicalOnly:true,reset:true,removedLocal:removed};
  }
  return{canonicalOnly:false,reset:false};
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

  const resetPolicy=await prepareCanonicalResetPolicy();
  let bridge={active:false,staged:0};
  if(!resetPolicy.reset){try{bridge=prepareL78AccountProgressBridge()||bridge;installL78RuntimeBridge()}catch(error){console.warn('L7/L8 Kontofortschritt konnte vor der Cloud-Hydrierung nicht vorbereitet werden',error)}}

  let restoreProfile=()=>{},result=null;
  try{
    if(resetPolicy.canonicalOnly)restoreProfile=setCanonicalOnlyProfiles();
    result=await startAuthoritativeAccountProgressSync(options);
  }finally{restoreProfile()}
  if(result?.blocked){showCloudProgressRequired(result);return result}
  let restoredL78=0;
  try{restoredL78=hydrateL78VisibleProgress()||0;installL78RuntimeBridge()}catch(error){console.warn('L7/L8 Kontofortschritt konnte nicht vollständig rekonstruiert werden',error)}
  const enriched={...result,l78BridgeStaged:Number(bridge?.staged)||0,restoredL78,serverResetApplied:!!resetPolicy.reset,canonicalOnly:!!resetPolicy.canonicalOnly};
  if(refreshAfterProgressPreparation(enriched,isolation))return enriched;
  return enriched;
}
