import { db, doc, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';

const STANDARD_MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
let syncing=false,timer=0;
const point=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const cleanId=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
function profile(){return getActiveProfile()||{}}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem('SP_COURSE_CODE')||''}
function fallbackId(p=profile()){return cleanId((p.courseDocId||course(p)||'kurs')+'_'+(String(p.email||'').trim().toLowerCase()||p.vorname||p.firstName||'student'))}
function ids(p=profile()){
 const api=window.SPProgress;
 if(api?.idCandidates){try{const list=api.idCandidates(p);if(Array.isArray(list)&&list.length)return uniq(list)}catch{}}
 return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)])
}
function isPreview(){const role=String(getActiveRole()||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();return role==='teacher'||role==='lehrer'||role==='admin'}
function userSlug(p=profile()){return[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function stateKey(p=profile()){return`SP_FI_VERB_GROUPS_PROGRESS_${userSlug(p)}`}
function state(p=profile()){try{return JSON.parse(localStorage.getItem(stateKey(p))||'{}')||{}}catch{return{}}}
function saveState(p,value){try{localStorage.setItem(stateKey(p),JSON.stringify(value))}catch{}}
function runPoints(run){return Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+point(n),0)+point(run?.awards?.examPoints)}
function groupPoints(gs){return Object.values(gs?.runs||{}).reduce((sum,r)=>sum+runPoints(r),0)}
function localPoints(p=profile()){return Object.values(state(p)).reduce((sum,gs)=>sum+(gs&&typeof gs==='object'?groupPoints(gs):0),0)}
function isTopic(v){return !!(v&&typeof v==='object'&&!Array.isArray(v)&&(v.lifetime||v.tasks||v.exam||v.current||v.progressPercent!=null))}
function modulePoints(mod={}){let total=0;for(const[key,topic]of Object.entries(mod||{})){if(key==='state'||key==='progress'||key==='totals'||!isTopic(topic))continue;total+=point(topic?.lifetime?.points)}return total}
function standardPoints(progress={}){return STANDARD_MODULES.reduce((sum,key)=>sum+modulePoints(progress[key]||{}),0)}
function displayName(p){return[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ')||p.displayName||p.email||'Schüler/in'}
async function getProgress(){if(!window.SPProgress){try{await import('/js/progress.js?v=fi-verben-ranking2')}catch{}}try{return await window.SPProgress?.loadCurrentStudentProgress?.()||{}}catch{return{}}}
function mergeRun(local={},cloud={}){
 const out={...cloud,...local};out.tasks={...(cloud.tasks||{}),...(local.tasks||{})};
 for(const task of new Set([...Object.keys(cloud.tasks||{}),...Object.keys(local.tasks||{})])){
  const a=local.tasks?.[task]||{},b=cloud.tasks?.[task]||{};
  out.tasks[task]={...b,...a,done:uniq([...(b.done||[]),...(a.done||[])]),queue:a.queue||[],current:a.current||null,tries:Number(a.tries)||0,hadWrong:!!a.hadWrong};
 }
 out.awards={tasks:{},examPoints:Math.max(point(local.awards?.examPoints),point(cloud.awards?.examPoints))};
 for(const task of new Set([...Object.keys(cloud.awards?.tasks||{}),...Object.keys(local.awards?.tasks||{})]))out.awards.tasks[task]=Math.max(point(local.awards?.tasks?.[task]),point(cloud.awards?.tasks?.[task]));
 out.exam={...(cloud.exam||{}),...(local.exam||{}),bestPercent:Math.max(Number(local.exam?.bestPercent)||0,Number(cloud.exam?.bestPercent)||0),stars:Math.max(Number(local.exam?.stars)||0,Number(cloud.exam?.stars)||0),session:local.exam?.session||null};
 return out
}
function restoreFromCloud(progress,p){
 const cloud=progress?.finnischVerben?.groups;if(!cloud||typeof cloud!=='object')return false;
 const local=state(p);let changed=false;
 for(const [id,meta] of Object.entries(cloud)){
  const n=String(Number(id)||Number(String(id).replace(/^0+/,''))||0);if(!n||n==='0')continue;
  const old=local[n]||{},next={...old,currentRun:Math.max(Number(old.currentRun)||1,Number(meta.currentRun)||1),runs:{...(old.runs||{})}};
  for(const [runId,cloudRun] of Object.entries(meta.runs||{}))next.runs[runId]=mergeRun(next.runs[runId]||{},cloudRun||{});
  const before=JSON.stringify(old),after=JSON.stringify(next);if(before!==after){local[n]=next;changed=true}
 }
 if(changed){saveState(p,local);window.dispatchEvent(new CustomEvent('SP_FI_PROGRESS_RESTORED'))}
 return changed
}
function metadata(p=profile()){
 const s=state(p),verbs=window.SP_FI_VERBS||[],out={};
 for(let i=0;i<verbs.length;i+=20){const id=Math.floor(i/20)+1,part=verbs.slice(i,i+20),gs=s[id]||s[String(id)]||{};out[String(id).padStart(2,'0')]={verbs:part.map(v=>({de:v.de,fi:v.fi})),currentRun:Number(gs.currentRun)||1,runs:gs.runs||{}}}
 return out
}
async function sync(){
 if(syncing||isPreview())return;const p=profile();if(!p)return;syncing=true;
 try{
  const progress=await getProgress(),id=ids(p)[0];if(!id)return;
  restoreFromCloud(progress,p);
  const local=localPoints(p),oldFi=point(progress?.finnischVerben?.totalPoints),target=Math.max(local,oldFi);
  const existing=Math.max(point(progress?.ranking?.points),point(progress?.totals?.points),point(progress?.pointsTotal),point(progress?.lifetimePoints),point(progress?.punkteGesamt),point(localStorage.getItem('SP_POINTS_TOTAL')));
  const base=Math.max(standardPoints(progress),Math.max(0,existing-oldFi));
  const rankingPoints=base+target,c=course(p);
  const finnischVerben={...(progress.finnischVerben||{}),title:'Finnische Verben',totalPoints:target,groups:metadata(p),updatedAt:new Date().toISOString()};
  const patch={finnischVerben,ranking:{...(progress.ranking||{}),points:rankingPoints,updatedAt:new Date().toISOString()},totals:{...(progress.totals||{}),points:rankingPoints,updatedAt:new Date().toISOString()},lifetimePoints:rankingPoints,pointsTotal:rankingPoints,punkteGesamt:rankingPoints,studentId:id,userId:id,docId:id,canonicalStudentId:id,aliasIds:ids(p),studentName:displayName(p),email:p.email||progress.email||'',kurs:c||progress.kurs||'',kursnummer:c||progress.kursnummer||'',courseCode:c||progress.courseCode||'',lastActive:serverTimestamp(),updatedAt:serverTimestamp(),lastActiveAt:new Date().toISOString(),lastPage:location.pathname};
  await setDoc(doc(db,'progress',id),patch,{merge:true});
  try{localStorage.setItem('SP_POINTS_TOTAL',String(rankingPoints));localStorage.setItem('SP_FI_VERBEN_FIREBASE_SYNC',new Date().toISOString())}catch{}
  window.SP_FI_VERBEN_FIREBASE_SYNC={ok:true,finnishVerbPoints:target,rankingPoints,at:new Date().toISOString()}
 }catch(error){console.warn('Finnische Verben-Punkte konnten nicht mit Firebase/Rangliste synchronisiert werden',error);window.SP_FI_VERBEN_FIREBASE_SYNC={ok:false,error:String(error?.message||error),at:new Date().toISOString()}}
 finally{syncing=false}
}
function schedule(delay=700){clearTimeout(timer);timer=setTimeout(sync,delay)}
window.addEventListener('load',()=>schedule(800));window.addEventListener('pageshow',()=>schedule(500));window.addEventListener('pagehide',()=>schedule(0));document.addEventListener('click',()=>schedule(900));document.addEventListener('keydown',e=>{if(e.key==='Enter')schedule(900)});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')schedule(0)});new MutationObserver(()=>schedule(1000)).observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>schedule(0),1400);
window.SPFinnishVerbFirebaseSync={sync,schedule,restoreFromCloud};
