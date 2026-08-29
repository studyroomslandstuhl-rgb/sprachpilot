import '/shared/dativ-points-extension.js?v=2';
import { getActiveProfile, getActiveRole } from '/js/auth.js?v=login-main-4';

const TASKS={
  cards:'Karteikarten',
  'listen-word':'Verb hören und erkennen',
  'listen-sentence':'Bild + Verb hören',
  'listen-write':'Diktat: Verb schreiben',
  'read-choose':'Bild + Verb auswählen',
  'read-write':'Satz aus Bausteinen',
  'dativ-use':'Lückensatz: Artikel oder Verb',
  'context-write':'Satz mit Vorgaben schreiben'
};
const PREFIX='SP_DATIVVERBEN_V2_';
const role=String(getActiveRole?.()||'').toLowerCase();
const preview=['teacher','lehrer','admin','owner'].includes(role);
let timer=null,running=false,pending=false,lastDigest='';

function slug(){
  const p=getActiveProfile?.()||{};
  return [p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname]
    .filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
}
function key(){return PREFIX+slug()}
function state(){try{return JSON.parse(localStorage.getItem(key())||'null')}catch{return null}}
function levelOf(signature,group={}){return String(group.level||signature||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0]||''}
function completed(task={}){
  const total=Number(task.total||0),done=Array.isArray(task.done)?task.done.length:Number(task.done||0);
  return task.completed===true||(total>0&&done>=total);
}
function digestOf(data){
  if(!data?.groups)return'';
  const rows=[];
  for(const [signature,group] of Object.entries(data.groups)){
    for(const [runId,run] of Object.entries(group?.runs||{})){
      for(const taskKey of Object.keys(TASKS)){
        const task=run?.tasks?.[taskKey]||{};
        if(completed(task)||Number(run?.awards?.tasks?.[taskKey]||0)>0)rows.push(`${signature}|${runId}|${taskKey}`);
      }
      const pct=Math.max(0,Math.min(100,Number(run?.exam?.bestPercent||run?.exam?.percent||0)||0));
      if(pct>0||Number(run?.awards?.examPoints||0)>0)rows.push(`${signature}|${runId}|exam|${pct}`);
    }
  }
  return rows.sort().join('||');
}
async function waitReady(){
  for(let i=0;i<120;i++){
    if(window.SPProgress?.recordTaskProgress&&window.SPPointRecalculator?.__dativverbenV2)return true;
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  return false;
}
function setRun(topicId,run){try{localStorage.setItem(`SP_SCORE_RUN_${topicId}`,String(Math.max(1,Math.min(3,Number(run)||1))))}catch(e){}}
async function sync(){
  if(preview||running)return false;
  const data=state();if(!data?.groups)return false;
  const digest=digestOf(data);if(!digest||digest===lastDigest)return true;
  if(!(await waitReady()))return false;
  running=true;
  try{
    for(const [signature,group] of Object.entries(data.groups)){
      const level=levelOf(signature,group);if(!level)continue;
      const topicId=`dativverben-${level.toLowerCase()}`,title=`Dativverben ${level}`;
      const runs=Object.entries(group?.runs||{}).sort((a,b)=>Number(a[0])-Number(b[0]));
      for(const [runId,run] of runs){
        const runNo=Math.max(1,Math.min(3,Number(runId)||1));setRun(topicId,runNo);
        for(const [taskKey,taskTitle] of Object.entries(TASKS)){
          const task=run?.tasks?.[taskKey]||{};
          if(!completed(task)&&Number(run?.awards?.tasks?.[taskKey]||0)<=0)continue;
          const result=await window.SPProgress.recordTaskProgress({
            module:'dativverben',moduleTitle:'Dativverben',topicId,title,level,
            taskKey,taskTitle,percent:100,completed:true,
            total:Number(task.total||0),done:Array.isArray(task.done)?task.done.length:Number(task.done||task.total||0)
          });
          if(!result)throw new Error(`Dativverben-Aufgabe konnte nicht synchronisiert werden: ${level}/${taskKey}/R${runNo}`);
        }
        const pct=Math.max(0,Math.min(100,Number(run?.exam?.bestPercent||run?.exam?.percent||0)||0));
        if(pct>0||Number(run?.awards?.examPoints||0)>0){
          const result=await window.SPProgress.recordExamResult({
            module:'dativverben',moduleTitle:'Dativverben',topicId,title,level,
            percent:pct||100,stars:Number(run?.exam?.stars||0)
          });
          if(!result)throw new Error(`Dativverben-Prüfung konnte nicht synchronisiert werden: ${level}/R${runNo}`);
        }
      }
      setRun(topicId,Math.max(1,Math.min(3,Number(group.currentRun)||1)));
    }
    lastDigest=digest;
    try{sessionStorage.setItem('SP_DATIVVERBEN_FIREBASE_DIGEST',digest)}catch(e){}
    try{window.dispatchEvent(new CustomEvent('SP_DATIVVERBEN_FIREBASE_SYNCED',{detail:{points:true,at:Date.now()}}))}catch(e){}
    return true;
  }catch(error){
    console.warn('Dativverben konnten noch nicht vollständig mit Firebase synchronisiert werden',error);
    return false;
  }finally{
    running=false;
    if(pending){pending=false;schedule(250)}
  }
}
function schedule(delay=350){
  if(preview)return;
  if(running){pending=true;return}
  clearTimeout(timer);timer=setTimeout(()=>sync(),delay);
}

if(!preview){
  try{lastDigest=sessionStorage.getItem('SP_DATIVVERBEN_FIREBASE_DIGEST')||''}catch(e){}
  const rawSet=Storage.prototype.setItem;
  if(!Storage.prototype.__spDativPointsPatched){
    Storage.prototype.setItem=function(k,v){const result=rawSet.call(this,k,v);try{if(this===localStorage&&String(k)===key())schedule(400)}catch(e){}return result};
    Storage.prototype.__spDativPointsPatched=true;
  }
  window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>schedule(250));
  window.addEventListener('online',()=>schedule(250));
  window.addEventListener('focus',()=>schedule(250));
  schedule(700);
}

window.SPDativFirebasePoints={sync,schedule,key};