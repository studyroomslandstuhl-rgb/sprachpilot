import { db, doc, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const CARRY_ID='perfekt-recovered-points';
let syncing=false,timer=0;
const point=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const cleanId=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
function profile(){return getActiveProfile()||{}}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem('SP_COURSE_CODE')||''}
function fallbackId(p=profile()){return cleanId((p.courseDocId||course(p)||'kurs')+'_'+(String(p.email||'').trim().toLowerCase()||p.vorname||p.firstName||'student'))}
function ids(p=profile()){const api=window.SPProgress;if(api?.idCandidates){try{const list=api.idCandidates(p);if(Array.isArray(list)&&list.length)return uniq(list)}catch{}}return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)])}
function isPreview(){const role=String(getActiveRole()||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();if(['teacher','lehrer','admin'].includes(role))return true;try{const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');return raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true}catch{return false}}
function isTopic(v){return !!(v&&typeof v==='object'&&!Array.isArray(v)&&(v.lifetime||v.tasks||v.exam||v.current||v.progressPercent!=null))}
function modulePoints(mod={},exclude=''){let total=0;for(const[key,topic]of Object.entries(mod||{})){if(key===exclude||key==='state'||key==='progress'||key==='totals'||!isTopic(topic))continue;total+=point(topic?.lifetime?.points)}return total}
function allModulePoints(progress={}){let total=0;for(const key of MODULES)total+=modulePoints(progress[key]||{});return total}
function storedPoints(progress={}){return Math.max(point(progress?.ranking?.points),point(progress?.totals?.points),point(progress?.pointsTotal),point(progress?.lifetimePoints),point(progress?.punkteGesamt),point(localStorage.getItem('SP_POINTS_TOTAL')))}
function localPerfektTarget(){const recovery=window.SPPerfektRegroupRecovery;let floor=0,active=0;try{floor=point(recovery?.pointFloor?.())}catch{}try{active=point(recovery?.activePoints?.())}catch{}return Math.max(floor,active)}
function displayName(p){return[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ')||p.displayName||p.email||'Schüler/in'}
function groupMetadata(){try{const detailed=window.SPPerfektRegroupRecovery?.metadata?.();if(detailed&&Object.keys(detailed).length)return detailed}catch{}const visible=window.SP_PERFEKT_RELEASE_SYNC?.visible||[],out={};for(let i=0;i<visible.length;i+=20){const verbs=visible.slice(i,i+20),id=String(Math.floor(i/20)+1).padStart(2,'0');out[id]={signature:'release|'+verbs.join('|'),verbs:verbs.slice(),currentRun:1,runs:{}}}return out}
async function getProgress(){if(!window.SPProgress){try{await import('/js/progress.js?v=points-preserve3')}catch{}}try{return await window.SPProgress?.loadCurrentStudentProgress?.()||{}}catch{return{}}}
async function sync(){
 if(syncing||isPreview())return;syncing=true;
 try{
  const p=profile(),progress=await getProgress(),id=ids(p)[0];if(!id)return;
  const previousStored=storedPoints(progress),perfekt={...(progress.perfekt||{})},actual=modulePoints(perfekt,CARRY_ID),target=Math.max(localPerfektTarget(),actual),carryNeeded=Math.max(0,target-actual),oldCarry=perfekt[CARRY_ID]||{};
  if(carryNeeded>0)perfekt[CARRY_ID]={...oldCarry,title:'Perfekt · wiederhergestellte Punkte',moduleTitle:'Perfekt',level:'A1',technicalRecovery:true,progressPercent:Number(oldCarry.progressPercent)||0,current:{...(oldCarry.current||{}),updatedAt:new Date().toISOString()},lifetime:{...(oldCarry.lifetime||{}),points:carryNeeded}};
  else if(perfekt[CARRY_ID])perfekt[CARRY_ID]={...perfekt[CARRY_ID],lifetime:{...(perfekt[CARRY_ID].lifetime||{}),points:0}};
  const nowIso=new Date().toISOString(),metadata={...(progress.metadata||{}),perfektGroups:groupMetadata()},next={...progress,perfekt,metadata},evidencePoints=allModulePoints(next),rankingPoints=Math.max(previousStored,evidencePoints),c=course(p);
  const patch={perfekt,metadata,ranking:{...(progress.ranking||{}),points:rankingPoints,updatedAt:nowIso},totals:{...(progress.totals||{}),points:rankingPoints,updatedAt:nowIso},lifetimePoints:rankingPoints,pointsTotal:rankingPoints,punkteGesamt:rankingPoints,studentId:id,userId:id,docId:id,canonicalStudentId:id,aliasIds:ids(p),studentName:displayName(p),email:p.email||progress.email||'',kurs:c||progress.kurs||'',kursnummer:c||progress.kursnummer||'',courseCode:c||progress.courseCode||'',lastActive:serverTimestamp(),updatedAt:serverTimestamp(),lastActiveAt:nowIso,lastPage:location.pathname};
  await setDoc(doc(db,'progress',id),patch,{merge:true});
  try{localStorage.setItem('SP_POINTS_TOTAL',String(rankingPoints));localStorage.setItem('SP_PERFEKT_FIREBASE_POINTS_SYNC',nowIso)}catch{}
  window.SP_PERFEKT_FIREBASE_SYNC={ok:true,perfektPoints:actual+carryNeeded,target,evidencePoints,previousStored,rankingPoints,autoLowering:false,at:nowIso}
 }catch(error){console.warn('Perfekt-Punkte/Fortschritt konnten nicht mit Firebase/Rangliste synchronisiert werden',error);window.SP_PERFEKT_FIREBASE_SYNC={ok:false,error:String(error?.message||error),at:new Date().toISOString()}}
 finally{syncing=false}
}
function schedule(delay=600){clearTimeout(timer);timer=setTimeout(sync,delay)}
window.addEventListener('load',()=>schedule(700));window.addEventListener('pageshow',()=>schedule(500));window.addEventListener('pagehide',()=>schedule(0));document.addEventListener('click',()=>schedule(1000));document.addEventListener('keydown',e=>{if(e.key==='Enter')schedule(1000)});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')schedule(0)});new MutationObserver(()=>schedule(900)).observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>schedule(0),1200);
window.SPPerfektFirebaseRankingSync={sync,schedule};
