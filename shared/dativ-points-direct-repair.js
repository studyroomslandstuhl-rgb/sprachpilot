import '/shared/points-recalculator.js?v=20260829-dativ-direct2';
import '/shared/dativ-points-extension.js?v=4';
import { db, doc, getDocFromServer, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js?v=login-main-4';

const PREFIX='SP_DATIVVERBEN_V2_';
let running=null;

const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0};
const levelOf=(signature,group={})=>String(group.level||signature||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0]||'';
const profile=()=>getActiveProfile?.()||{};
const slugPart=value=>String(value||'').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_').replace(/^_+|_+$/g,'');
const slug=p=>[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname]
  .filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
const stateKey=p=>PREFIX+slug(p);
const canonicalId=p=>String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim();
const courseKey=p=>String(p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim();
const displayName=p=>[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ').trim()||p.displayName||p.email||'Schüler/in';

function candidateStateKeys(p=profile()){
  const exact=stateKey(p),keys=[];
  try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith(PREFIX))keys.push(key)}}catch(e){}
  const emailToken=slugPart(p.email);
  const courseTokens=[p.courseDocId,p.courseCode,p.kurs,p.kursnummer,p.course,localStorage.getItem('SP_COURSE_CODE')].map(slugPart).filter(Boolean);
  const emailMatches=emailToken?keys.filter(key=>slugPart(key.slice(PREFIX.length)).includes(emailToken)):[];
  const courseMatches=courseTokens.length?emailMatches.filter(key=>courseTokens.some(token=>slugPart(key.slice(PREFIX.length)).includes(token))):emailMatches;
  const safeFallback=courseMatches.length?courseMatches:(emailMatches.length===1?emailMatches:[]);
  return [...new Set([exact,...safeFallback])];
}
function rawGroupPoints(group={}){
  let total=0;
  for(const [runId,run] of Object.entries(group.runs||{})){
    const runNo=Math.max(1,Math.min(3,Number(runId)||1));
    for(const value of Object.values(run?.awards?.tasks||{}))total+=point(value)||runNo*5;
    total+=point(run?.awards?.examPoints);
  }
  return total;
}
function localGroupsForProfile(p=profile()){
  const out={};
  for(const key of candidateStateKeys(p)){
    let data=null;try{data=JSON.parse(localStorage.getItem(key)||'null')}catch{}
    for(const [signature,group] of Object.entries(data?.groups||{})){
      if(!group||typeof group!=='object')continue;
      const level=levelOf(signature,group);if(!level)continue;
      const old=out[signature];
      if(!old||rawGroupPoints(group)>=rawGroupPoints(old))out[signature]={...group,level,signature:group.signature||signature,localStorageKey:key};
    }
  }
  return out;
}
function storedPoints(data={}){
  return Math.max(
    point(data?.ranking?.points),point(data?.totals?.points),point(data.pointsTotal),point(data.lifetimePoints),
    point(data.punkteGesamt),point(data.points)
  );
}
async function waitCalculator(){
  for(let i=0;i<120;i++){
    if(window.SPPointRecalculator?.__dativverbenV2&&window.SPPointRecalculator?.groupPoints)return true;
    await new Promise(resolve=>setTimeout(resolve,25));
  }
  return false;
}
function dativPointsFromGroups(groups={}){
  const byLevel=new Map();
  for(const [signature,group] of Object.entries(groups||{})){
    const level=levelOf(signature,group);if(!level)continue;
    const value=point(window.SPPointRecalculator?.groupPoints?.(group)?.points);
    byLevel.set(level,Math.max(byLevel.get(level)||0,value));
  }
  return [...byLevel.values()].reduce((sum,value)=>sum+point(value),0);
}
function mergeGroupEvidence(server={},local={}){
  const merged={...(server||{})};
  for(const [signature,group] of Object.entries(local||{})){
    const level=levelOf(signature,group);if(!level)continue;
    const key=`local-${level.toLowerCase()}-${signature}`;
    const old=merged[key];
    const oldPoints=old?point(window.SPPointRecalculator?.groupPoints?.(old)?.points):0;
    const newPoints=point(window.SPPointRecalculator?.groupPoints?.(group)?.points);
    if(!old||newPoints>=oldPoints){
      const {localStorageKey,...safeGroup}=group;
      merged[key]={...safeGroup,level,signature:group.signature||signature,source:'local-dativ-state-v2'};
    }
  }
  return merged;
}
async function mirror(id,p,points){
  const course=courseKey(p);if(!course)return false;
  const payload={
    studentId:id,
    authUid:String(p.authUid||'').trim(),
    displayName:displayName(p),
    courseKey:course,
    courseCode:String(p.courseCode||p.kurs||p.kursnummer||course).trim(),
    points,
    version:6,
    pointAuditVersion:9,
    dativverbenSynced:true,
    dativverbenDirectRepair:true,
    updatedAt:serverTimestamp()
  };
  try{await setDoc(doc(db,'studentRankings',id),payload,{merge:true})}catch(error){console.warn('Dativ-Punkte konnten nicht in studentRankings gespiegelt werden',error)}
  try{
    await setDoc(doc(db,'students',id),{
      pointsTotal:points,lifetimePoints:points,punkteGesamt:points,rankingPoints:points,
      pointAuditVersion:9,dativverbenDirectRepair:true,updatedAt:serverTimestamp()
    },{merge:true});
  }catch(error){console.warn('Dativ-Punkte konnten nicht zusätzlich im Teilnehmerprofil gespiegelt werden',error)}
  return true;
}

async function doRepair(){
  const role=String(getActiveRole?.()||'').toLowerCase();
  if(['teacher','lehrer','admin','owner'].includes(role))return{ok:false,skipped:true,reason:'teacher-preview'};
  const p=profile(),id=canonicalId(p);if(!id)return{ok:false,skipped:true,reason:'student-id-missing'};
  const groups=localGroupsForProfile(p);if(!Object.keys(groups).length)return{ok:false,skipped:true,reason:'local-dativ-state-missing'};
  if(!(await waitCalculator()))return{ok:false,reason:'calculator-not-ready'};
  const localPoints=dativPointsFromGroups(groups);if(localPoints<=0)return{ok:true,skipped:true,reason:'no-local-dativ-points',points:0};

  let snap;
  try{snap=await getDocFromServer(doc(db,'progress',id))}catch(error){return{ok:false,reason:'progress-read-failed',error}}
  const server=snap.exists()?(snap.data()||{}):{};
  const serverDativBefore=point(window.SPPointRecalculator?.dativverbenPoints?.(server));
  const evidence=mergeGroupEvidence(server?.metadata?.dativverbenGroups||{},groups);
  const patched={...server,metadata:{...(server.metadata||{}),dativverbenGroups:evidence}};
  const exact=point(window.SPPointRecalculator?.calculate?.(patched)?.total);
  const missing=Math.max(0,localPoints-serverDativBefore);
  const before=storedPoints(server);
  const total=Math.max(before,exact,before+missing);
  const now=new Date().toISOString();
  const metadata={
    ...(server.metadata||{}),
    dativverbenGroups:evidence,
    pointAudit:{
      ...(server?.metadata?.pointAudit||{}),version:9,autoLoweringDisabled:true,
      dativverbenDirectRepair:true,dativverbenLocalPoints:localPoints,dativverbenServerPointsBefore:serverDativBefore,
      dativverbenDeltaApplied:missing,evidencePoints:exact,preservedPoints:total,lastEvidenceCheckAt:now
    }
  };
  const payload={
    canonicalStudentId:id,studentId:id,userId:id,docId:id,
    totals:{...(server.totals||{}),points:total,updatedAt:now},
    lifetimePoints:total,pointsTotal:total,punkteGesamt:total,
    ranking:{...(server.ranking||{}),points:total,updatedAt:now},
    metadata,lastActive:serverTimestamp(),updatedAt:serverTimestamp(),lastActiveAt:now
  };
  try{await setDoc(doc(db,'progress',id),payload,{merge:true})}
  catch(error){console.warn('Direkte Dativ-Punktereparatur konnte den kanonischen Fortschritt nicht schreiben',error);return{ok:false,reason:'progress-write-failed',error,localPoints,serverDativBefore}}
  try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(total,point(localStorage.getItem('SP_POINTS_TOTAL')))));localStorage.setItem('SP_DATIV_DIRECT_REPAIR_AT',now)}catch(e){}
  await mirror(id,p,total);
  try{window.dispatchEvent(new CustomEvent('SP_DATIV_POINTS_DIRECT_REPAIRED',{detail:{points:total,localDativPoints:localPoints,serverDativBefore,delta:missing,at:Date.now()}}))}catch(e){}
  return{ok:true,points:total,localDativPoints:localPoints,serverDativBefore,delta:missing,sourceKeys:[...new Set(Object.values(groups).map(group=>group.localStorageKey).filter(Boolean))]};
}

export async function repairDativPoints(){
  if(running)return running;
  running=doRepair().finally(()=>{running=null});
  return running;
}
export function localDativPointState(){
  const p=profile(),groups=localGroupsForProfile(p);
  return{key:stateKey(p),candidateKeys:candidateStateKeys(p),groups,points:window.SPPointRecalculator?.groupPoints?dativPointsFromGroups(groups):0};
}

window.SPDativDirectPointRepair={repair:repairDativPoints,localState:localDativPointState,stateKey:()=>stateKey(profile())};
