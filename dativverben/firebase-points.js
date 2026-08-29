import '/shared/dativ-points-extension.js?v=3';
import { getActiveProfile, getActiveRole } from '/js/auth.js?v=login-main-4';
import { db, doc, setDoc, serverTimestamp } from '/js/firebase.js';

const TASKS={
  cards:'Karteikarten',
  'listen-word':'Verb hören und erkennen',
  'listen-sentence':'Bild + Verb hören',
  'listen-write':'Diktat: Verb schreiben',
  'read-choose':'Bild + Verb auswählen',
  'verb-meaning':'Verb → Bedeutung',
  'meaning-verb':'Bedeutung → Verb',
  conjugate:'Verb konjugieren',
  'read-write':'Satz aus Bausteinen',
  'dativ-use':'Lückensatz: Artikel oder Verb',
  'context-write':'Satz mit Vorgaben schreiben'
};
const PREFIX='SP_DATIVVERBEN_V2_';
const role=String(getActiveRole?.()||'').toLowerCase();
const preview=['teacher','lehrer','admin','owner'].includes(role);
let timer=null,running=false,pending=false,pendingForce=false,lastDigest='';

function profile(){return getActiveProfile?.()||{}}
function slug(){
  const p=profile();
  return [p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname]
    .filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
}
function key(){return PREFIX+slug()}
function state(){try{return JSON.parse(localStorage.getItem(key())||'null')}catch{return null}}
function levelOf(signature,group={}){return String(group.level||signature||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0]||''}
function taskInfo(task={}){
  const total=Math.max(0,Number(task.total||0));
  const done=Array.isArray(task.done)?task.done.length:Math.max(0,Number(task.done||0));
  const percent=total?Math.max(0,Math.min(100,Math.round(done/total*100))):0;
  return{total,done,percent,completed:task.completed===true||(total>0&&done>=total)};
}
function digestOf(data){
  if(!data?.groups)return'';
  const rows=[];
  for(const [signature,group] of Object.entries(data.groups)){
    rows.push(`${signature}|currentRun|${Number(group?.currentRun)||1}`);
    for(const [runId,run] of Object.entries(group?.runs||{})){
      for(const taskKey of Object.keys(TASKS)){
        const info=taskInfo(run?.tasks?.[taskKey]||{});
        const award=Number(run?.awards?.tasks?.[taskKey]||0);
        if(info.done>0||info.completed||award>0)rows.push(`${signature}|${runId}|${taskKey}|${info.done}/${info.total}|${award}`);
      }
      const pct=Math.max(0,Math.min(100,Number(run?.exam?.bestPercent||run?.exam?.percent||0)||0));
      if(pct>0||Number(run?.awards?.examPoints||0)>0)rows.push(`${signature}|${runId}|exam|${pct}|${Number(run?.awards?.examPoints||0)}`);
    }
  }
  return rows.sort().join('||');
}
async function waitReady(){
  for(let i=0;i<160;i++){
    if(window.SPProgress?.recordTaskProgress&&window.SPPointRecalculator?.__dativverbenV2)return true;
    await new Promise(resolve=>setTimeout(resolve,40));
  }
  return false;
}
function setRun(topicId,run){try{localStorage.setItem(`SP_SCORE_RUN_${topicId}`,String(Math.max(1,Math.min(3,Number(run)||1))))}catch(e){}}
function pointsOf(result={}){
  const values=[result?.ranking?.points,result?.totals?.points,result?.pointsTotal,result?.lifetimePoints,result?.punkteGesamt,localStorage.getItem('SP_POINTS_TOTAL')];
  return Math.max(0,...values.map(value=>Number(value)||0));
}
function canonicalId(result={},p=profile()){
  return String(result?.canonicalStudentId||result?.docId||result?.studentId||p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim();
}
function courseKey(p=profile(),result={}){
  return String(result?.courseCode||result?.kurs||result?.kursnummer||p.courseDocId||p.courseCode||p.kurs||p.kursnummer||'').trim();
}
function displayName(p=profile(),result={}){
  return [p.vorname||p.firstName,result?.vorname||result?.firstName,p.nachname||p.lastName,result?.nachname||result?.lastName].filter(Boolean).join(' ').trim()||result?.studentName||p.studentName||p.displayName||p.email||'Schüler/in';
}
async function mirrorRanking(result){
  if(!result)return false;
  const p=profile(),id=canonicalId(result,p),course=courseKey(p,result),points=pointsOf(result);
  if(!id||!course)return false;
  const payload={
    studentId:id,
    authUid:String(p.authUid||result.authUid||'').trim(),
    displayName:displayName(p,result),
    courseKey:course,
    courseCode:String(p.courseCode||p.kurs||p.kursnummer||result.courseCode||result.kurs||result.kursnummer||course).trim(),
    points,
    version:6,
    pointAuditVersion:Math.max(8,Number(result?.metadata?.pointAudit?.version)||0),
    dativverbenSynced:true,
    updatedAt:serverTimestamp()
  };
  try{
    await setDoc(doc(db,'studentRankings',id),payload,{merge:true});
    return true;
  }catch(error){
    console.warn('Dativverben-Punkte konnten nicht in die Rangliste gespiegelt werden',error);
    return false;
  }
}
async function sync({force=false}={}){
  if(preview)return false;
  if(running){pending=true;pendingForce=pendingForce||force;return false}
  const data=state();if(!data?.groups)return false;
  const digest=digestOf(data);if(!digest)return false;
  if(!force&&digest===lastDigest)return true;
  if(!(await waitReady()))return false;
  running=true;
  let latestResult=null;
  try{
    for(const [signature,group] of Object.entries(data.groups)){
      const level=levelOf(signature,group);if(!level)continue;
      const topicId=`dativverben-${level.toLowerCase()}`,title=`Dativverben ${level}`;
      const runs=Object.entries(group?.runs||{}).sort((a,b)=>Number(a[0])-Number(b[0]));
      for(const [runId,run] of runs){
        const runNo=Math.max(1,Math.min(3,Number(runId)||1));setRun(topicId,runNo);
        for(const [taskKey,taskTitle] of Object.entries(TASKS)){
          const task=run?.tasks?.[taskKey]||{},info=taskInfo(task),award=Number(run?.awards?.tasks?.[taskKey]||0);
          if(info.done<=0&&!info.completed&&award<=0)continue;
          const result=await window.SPProgress.recordTaskProgress({
            module:'dativverben',moduleTitle:'Dativverben',topicId,title,level,
            taskKey,taskTitle,percent:info.percent,completed:info.completed,
            total:info.total,done:info.done
          });
          if(!result)throw new Error(`Dativverben-Aufgabe konnte nicht synchronisiert werden: ${level}/${taskKey}/R${runNo}`);
          latestResult=result;
        }
        const pct=Math.max(0,Math.min(100,Number(run?.exam?.bestPercent||run?.exam?.percent||0)||0));
        if(pct>0||Number(run?.awards?.examPoints||0)>0){
          const result=await window.SPProgress.recordExamResult({
            module:'dativverben',moduleTitle:'Dativverben',topicId,title,level,
            percent:pct,stars:Number(run?.exam?.stars||0)
          });
          if(!result)throw new Error(`Dativverben-Prüfung konnte nicht synchronisiert werden: ${level}/R${runNo}`);
          latestResult=result;
        }
      }
      setRun(topicId,Math.max(1,Math.min(3,Number(group.currentRun)||1)));
    }
    if(latestResult)await mirrorRanking(latestResult);
    lastDigest=digest;
    try{sessionStorage.setItem('SP_DATIVVERBEN_FIREBASE_DIGEST',digest)}catch(e){}
    try{window.dispatchEvent(new CustomEvent('SP_DATIVVERBEN_FIREBASE_SYNCED',{detail:{points:true,progress:true,ranking:true,total:pointsOf(latestResult||{}),at:Date.now()}}))}catch(e){}
    return true;
  }catch(error){
    console.warn('Dativverben konnten noch nicht vollständig mit Firebase synchronisiert werden',error);
    return false;
  }finally{
    running=false;
    if(pending){const forceNext=pendingForce;pending=false;pendingForce=false;schedule(80,forceNext)}
  }
}
function schedule(delay=100,force=false){
  if(preview)return;
  if(running){pending=true;pendingForce=pendingForce||force;return}
  clearTimeout(timer);timer=setTimeout(()=>sync({force}),Math.max(0,Number(delay)||0));
}

if(!preview){
  // Nicht auf einen alten Session-Digest vertrauen: Beim Öffnen der Seite wird der lokale
  // Dativstand immer einmal gegen Firebase abgeglichen. So werden bereits verdiente Punkte nachgetragen.
  lastDigest='';
  const rawSet=Storage.prototype.setItem;
  if(!Storage.prototype.__spDativPointsPatched){
    Storage.prototype.setItem=function(k,v){
      const result=rawSet.call(this,k,v);
      try{if(this===localStorage&&String(k)===key())schedule(40,false)}catch(e){}
      return result;
    };
    Storage.prototype.__spDativPointsPatched=true;
  }
  window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>schedule(80,false));
  window.addEventListener('online',()=>schedule(50,true));
  window.addEventListener('focus',()=>schedule(80,true));
  window.addEventListener('SP_DATIV_FORCE_SYNC',()=>schedule(0,true));
  schedule(180,true);
}

window.SPDativFirebasePoints={sync,schedule,key,mirrorRanking};
