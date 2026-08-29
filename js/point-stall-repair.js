import { db, doc, authReady } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import '/shared/points-recalculator.js?v=20260829-stall2';
import { runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const VERSION=2;
const L8T1='wortschatz-a1-lektion-8-thema-1';
const L8_LOCAL_KEY='SP_L8_T1_LOCAL_HUB_V1';
const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0};
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9@._-]+/g,'_').replace(/^_+|_+$/g,'');
function profile(){return getActiveProfile?.()||{}}
function canonicalId(){const p=profile();return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim()}
function stored(data={}){return Math.max(point(data?.ranking?.points),point(data?.totals?.points),point(data?.pointsTotal),point(data?.lifetimePoints),point(data?.punkteGesamt),point(data?.points))}
function evidence(data={}){try{return Math.max(0,Number(window.SPPointRecalculator?.calculate?.(data)?.total)||0)}catch(e){return 0}}
function parse(v,f=null){try{return JSON.parse(v||'')??f}catch(e){return f}}
function millis(value){
  if(!value)return 0;
  try{if(typeof value.toMillis==='function')return Number(value.toMillis())||0}catch(e){}
  if(typeof value==='object'&&Number.isFinite(Number(value.seconds)))return Number(value.seconds)*1000+Math.floor(Number(value.nanoseconds||0)/1e6);
  const n=Date.parse(String(value));return Number.isFinite(n)?n:0;
}
function topics(data={}){
  const out=[];
  for(const module of ['wortschatz','fragen','verben','perfekt','grammatik'])for(const [key,topic] of Object.entries(data?.[module]||{}))if(topic&&typeof topic==='object'&&!Array.isArray(topic)&&topic.tasks)out.push({module,key,topic});
  return out;
}
function awardKey(module,topicKey,taskKey,run){return clean(`task-${module}-${topicKey}-${taskKey}-run-${run}`)}
function taskLocalId(taskKey){
  const raw=String(taskKey||'');
  try{const u=new URL(raw,'https://sprachpilot.invalid/');return String(u.searchParams.get('task')||u.pathname.split('/').pop()||raw)}catch(e){return raw}
}
function localL8Times(){
  const master=parse(localStorage.getItem(L8_LOCAL_KEY),null),out=new Map();if(!master?.students)return out;
  const p=profile(),candidates=[p.canonicalStudentId,p.docId,p.studentId,p.userId,p.authUid,localStorage.getItem('SP_STUDENT_ID'),p.email].map(clean).filter(Boolean);
  let student=null;for(const id of candidates)if(master.students[id]){student=master.students[id];break}if(!student&&Object.keys(master.students).length===1)student=Object.values(master.students)[0];if(!student)return out;
  for(const [runRaw,run] of Object.entries(student.runs||{}))for(const [taskId,state] of Object.entries(run?.tasks||{}))out.set(`${Math.max(1,Math.min(3,Number(runRaw)||1))}|${String(taskId)}`,millis(state?.updatedAt));
  return out;
}
function collectRepair(data,repair={},localTimes=new Map()){
  const before=stored(data),verified=evidence(data),awards={...(repair.awards||{})};
  // Wenn der strukturierte Firebase-Fortschritt bereits mehr Punkte beweist als das
  // gespeicherte Dashboard-Feld, ist genau diese Differenz sicher und kann direkt gesetzt werden.
  if(verified>before)return{mode:'verified',target:Math.round(verified),add:Math.round(verified-before),awards,newAwards:{},before,verified,reason:'verified-total-higher'};
  if(before<=0)return{mode:'none',add:0,awards,newAwards:{},before,verified,reason:'no-base-total'};
  const cutoff=Math.max(millis(data?.metadata?.pointDeltaLastAt),millis(data?.metadata?.pointCoreDeltaLastAt));
  const newAwards={};let add=0;
  for(const {module,key,topic} of topics(data)){
    const isNewL8T1=module==='wortschatz'&&(String(key)===L8T1||String(topic.topicId||topic.themeId||'')===L8T1);
    for(const [taskKey,task] of Object.entries(topic.tasks||{})){
      if(!task||typeof task!=='object'||task.completed!==true)continue;
      const localId=taskLocalId(taskKey);
      for(const [runRaw,valueRaw] of Object.entries(task.pointsByRun||{})){
        const value=point(valueRaw),run=Math.max(1,Math.min(3,Number(runRaw)||1));if(value<=0)continue;
        const id=awardKey(module,key,taskKey,run);if(awards[id])continue;
        const serverTime=Math.max(millis(task.completedAt),millis(task.lastActiveAt),millis(task.updatedAt));
        const localTime=isNewL8T1?point(localTimes.get(`${run}|${localId}`)):0;
        const activityTime=Math.max(serverTime,localTime);
        // Für allgemeine Altstände reparieren wir nur Aufgaben, die nach dem letzten
        // bestätigten globalen Punktedelta abgeschlossen wurden. Für L8T1 darf der lokale
        // Themen-Hub als zusätzliche Zeitquelle dienen, weil genau dort der aktuelle Fehler lag.
        if(cutoff>0&&(!activityTime||activityTime<=cutoff))continue;
        if(cutoff<=0&&!isNewL8T1)continue;
        awards[id]={points:value,completedAt:activityTime||0,topic:key,task:taskKey,run,source:isNewL8T1&&localTime>=serverTime?'l8-local':'server'};
        newAwards[id]=awards[id];add+=value;
      }
    }
  }
  return{mode:add>0?'awards':'none',add:Math.round(add),awards,newAwards,before,verified,cutoff,reason:add>0?'repairable-awards':'no-repairable-awards'};
}

export async function repairStalledPoints(){
  const id=canonicalId();if(!id)return{ok:false,reason:'student-id-missing'};
  try{await authReady}catch(e){}
  const localTimes=localL8Times();
  try{
    const ref=doc(db,'progress',id);
    const result=await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);if(!snap.exists())return{ok:false,reason:'progress-missing'};
      const data=snap.data()||{},oldRepair=data?.metadata?.pointStallRepairV2||data?.metadata?.pointStallRepairV1||{},plan=collectRepair(data,oldRepair,localTimes);
      if(plan.add<=0)return{ok:true,repaired:0,total:plan.before,evidence:plan.verified,reason:plan.reason};
      const total=plan.mode==='verified'?plan.target:plan.before+plan.add;
      tx.update(ref,{
        pointsTotal:total,lifetimePoints:total,punkteGesamt:total,
        'totals.points':total,'ranking.points':total,
        'metadata.pointStallRepairV2':{
          version:VERSION,awards:plan.awards,lastAdded:plan.add,totalAdded:point(oldRepair.totalAdded)+plan.add,
          sourceStored:plan.before,sourceEvidence:plan.verified,cutoffMillis:plan.cutoff||0,mode:plan.mode,repairedAt:serverTimestamp()
        }
      });
      return{ok:true,repaired:plan.add,total,evidence:plan.verified,mode:plan.mode,awards:Object.keys(plan.newAwards||{}).length};
    });
    if(result?.repaired>0){
      try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(point(localStorage.getItem('SP_POINTS_TOTAL')),point(result.total))))}catch(e){}
      try{window.dispatchEvent(new CustomEvent('SP_POINT_STALL_REPAIRED',{detail:result}))}catch(e){}
    }
    return result;
  }catch(error){console.warn('Festgefahrene Punkte konnten nicht automatisch repariert werden',error);return{ok:false,reason:error?.message||String(error)}}
}

window.SPRepairStalledPoints=repairStalledPoints;
