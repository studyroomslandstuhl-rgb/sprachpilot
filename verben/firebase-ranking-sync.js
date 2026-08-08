import { db, doc, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';

const E=window.VerbGroupsEngine;
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const CARRY_ID='verben-recovered-points';
let syncing=false,timer=0;
const point=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const cleanId=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
function profile(){return getActiveProfile()||window.VerbGroupsProfile||{}}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem('SP_COURSE_CODE')||''}
function fallbackId(p=profile()){return cleanId((p.courseDocId||course(p)||'kurs')+'_'+(String(p.email||'').trim().toLowerCase()||p.vorname||p.firstName||'student'))}
function ids(p=profile()){
 const api=window.SPProgress;
 if(api?.idCandidates){try{const list=api.idCandidates(p);if(Array.isArray(list)&&list.length)return uniq(list)}catch{}}
 return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)])
}
function isPreview(){const role=String(getActiveRole()||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();return role==='teacher'||role==='lehrer'||role==='admin'||E?.isPreview?.()===true}
function isTopic(v){return !!(v&&typeof v==='object'&&!Array.isArray(v)&&(v.lifetime||v.tasks||v.exam||v.current||v.progressPercent!=null))}
function modulePoints(mod={},exclude=''){
 let total=0;
 for(const [key,topic] of Object.entries(mod||{})){if(key===exclude||key==='state'||key==='progress'||key==='totals'||!isTopic(topic))continue;total+=point(topic?.lifetime?.points)}
 return total
}
function allModulePoints(progress={}){let total=0;for(const key of MODULES)total+=modulePoints(progress[key]||{});return total}
function displayName(p){return[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ')||p.displayName||p.email||'Schüler/in'}
async function getProgress(){if(!window.SPProgress){try{await import('/js/progress.js?v=verb-firebase-ranking1')}catch{}}try{return await window.SPProgress?.loadCurrentStudentProgress?.()||{}}catch{return{}}}
function groupMetadata(){
 const out={};
 for(const group of E?.GROUPS||[]){
  const gs=E.groupState?.(group.id),runs={};
  for(const[runId,run]of Object.entries(gs?.runs||{})){
   const tasks={};
   for(const task of E.LEARN||[])tasks[task]={done:(run?.tasks?.[task]?.done||[]).slice(),total:Number(run?.tasks?.[task]?.total)||group.verbs.length,completed:(run?.tasks?.[task]?.done||[]).length>=group.verbs.length};
   runs[runId]={tasks,exam:{bestPercent:Number(run?.exam?.bestPercent)||0,stars:Number(run?.exam?.stars)||0},completed:!!run?.completed}
  }
  out[String(group.id).padStart(2,'0')]={signature:group.signature,verbs:group.verbs.slice(),currentRun:Number(gs?.currentRun)||1,runs}
 }
 return out
}
async function sync(){
 if(syncing||isPreview()||!E?.GROUPS?.length)return;
 syncing=true;
 try{
  const p=profile(),progress=await getProgress(),id=ids(p)[0];if(!id)return;
  const target=point(E.totalPoints?.());
  const verben={...(progress.verben||{})};
  const actual=modulePoints(verben,CARRY_ID);
  const carryNeeded=Math.max(0,target-actual);
  if(carryNeeded>0){
   const old=verben[CARRY_ID]||{};
   verben[CARRY_ID]={...old,title:'Verben · wiederhergestellte Punkte',moduleTitle:'Verben',level:'A1',technicalRecovery:true,progressPercent:Number(old.progressPercent)||0,current:{...(old.current||{}),updatedAt:new Date().toISOString()},lifetime:{...(old.lifetime||{}),points:carryNeeded}}
  }else if(verben[CARRY_ID]){
   verben[CARRY_ID]={...verben[CARRY_ID],lifetime:{...(verben[CARRY_ID].lifetime||{}),points:0}}
  }
  const metadata={...(progress.metadata||{}),verbenGroups:groupMetadata()};
  const next={...progress,verben,metadata};
  const computed=allModulePoints(next);
  const rankingPoints=Math.max(computed,point(progress?.ranking?.points),point(progress?.totals?.points),point(progress?.pointsTotal),point(progress?.lifetimePoints),point(progress?.punkteGesamt),point(localStorage.getItem('SP_POINTS_TOTAL')));
  const c=course(p);
  const patch={verben,metadata,ranking:{...(progress.ranking||{}),points:rankingPoints,updatedAt:new Date().toISOString()},totals:{...(progress.totals||{}),points:rankingPoints,updatedAt:new Date().toISOString()},lifetimePoints:rankingPoints,pointsTotal:rankingPoints,punkteGesamt:rankingPoints,studentId:id,userId:id,docId:id,canonicalStudentId:id,aliasIds:ids(p),studentName:displayName(p),email:p.email||progress.email||'',kurs:c||progress.kurs||'',kursnummer:c||progress.kursnummer||'',courseCode:c||progress.courseCode||'',lastActive:serverTimestamp(),updatedAt:serverTimestamp(),lastActiveAt:new Date().toISOString(),lastPage:location.pathname};
  await setDoc(doc(db,'progress',id),patch,{merge:true});
  try{localStorage.setItem('SP_POINTS_TOTAL',String(rankingPoints));localStorage.setItem('SP_VERBEN_FIREBASE_POINTS_SYNC',new Date().toISOString())}catch{}
  window.SP_VERBEN_FIREBASE_SYNC={ok:true,verbenPoints:actual+carryNeeded,rankingPoints,at:new Date().toISOString()}
 }catch(error){console.warn('Verben-Punkte konnten nicht mit Firebase/Rangliste synchronisiert werden',error);window.SP_VERBEN_FIREBASE_SYNC={ok:false,error:String(error?.message||error),at:new Date().toISOString()}}
 finally{syncing=false}
}
function schedule(delay=700){clearTimeout(timer);timer=setTimeout(sync,delay)}
window.addEventListener('load',()=>schedule(800));window.addEventListener('pageshow',()=>schedule(500));window.addEventListener('pagehide',()=>schedule(0));
document.addEventListener('click',()=>schedule(900));document.addEventListener('keydown',e=>{if(e.key==='Enter')schedule(900)});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')schedule(0)});
new MutationObserver(()=>schedule(1000)).observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>schedule(0),1400);
window.SPVerbFirebaseRankingSync={sync,schedule};
