import { db, doc, authReady } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import '/shared/points-recalculator.js?v=20260829-stall1';
import { runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const VERSION=1;
const L8T1='wortschatz-a1-lektion-8-thema-1';
const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0};
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
function profile(){return getActiveProfile?.()||{}}
function canonicalId(){const p=profile();return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||'').trim()}
function stored(data={}){return Math.max(point(data?.ranking?.points),point(data?.totals?.points),point(data?.pointsTotal),point(data?.lifetimePoints),point(data?.punkteGesamt),point(data?.points))}
function evidence(data={}){try{return Math.max(0,Number(window.SPPointRecalculator?.calculate?.(data)?.total)||0)}catch(e){return 0}}
function millis(value){
  if(!value)return 0;
  try{if(typeof value.toMillis==='function')return Number(value.toMillis())||0}catch(e){}
  if(typeof value==='object'&&Number.isFinite(Number(value.seconds)))return Number(value.seconds)*1000+Math.floor(Number(value.nanoseconds||0)/1e6);
  const n=Date.parse(String(value));return Number.isFinite(n)?n:0;
}
function topics(data={}){
  const out=[];
  for(const module of ['wortschatz','fragen','verben','perfekt','grammatik']){
    for(const [key,topic] of Object.entries(data?.[module]||{})){
      if(!topic||typeof topic!=='object'||Array.isArray(topic)||!topic.tasks)continue;
      out.push({module,key,topic});
    }
  }
  return out;
}
function awardKey(module,topicKey,taskKey,run){return clean(`task-${module}-${topicKey}-${taskKey}-run-${run}`)}
function collectRepair(data,repair={}){
  const before=stored(data),verified=evidence(data),awards={...(repair.awards||{})};
  if(before<=0||before<=verified)return{add:0,awards,newAwards:{},before,verified,reason:'no-stall'};
  const cutoff=Math.max(millis(data?.metadata?.pointDeltaLastAt),millis(data?.metadata?.pointCoreDeltaLastAt));
  const newAwards={};let add=0;
  for(const {module,key,topic} of topics(data)){
    const isNewL8T1=module==='wortschatz'&&(String(key)===L8T1||String(topic.topicId||topic.themeId||'')===L8T1);
    for(const [taskKey,task] of Object.entries(topic.tasks||{})){
      if(!task||typeof task!=='object'||task.completed!==true)continue;
      const completedAt=millis(task.completedAt);
      if(!completedAt)continue;
      // Normalfall: nur Aufgaben nach dem letzten nachweislich erfolgreichen globalen Punktedelta.
      // L8T1-Fallback: dieses neue Thema schrieb kurzzeitig fertige Aufgaben ohne Delta-Bridge.
      if(cutoff>0&&completedAt<=cutoff)continue;
      if(cutoff<=0&&!isNewL8T1)continue;
      for(const [runRaw,valueRaw] of Object.entries(task.pointsByRun||{})){
        const value=point(valueRaw),run=Math.max(1,Math.min(3,Number(runRaw)||1));if(value<=0)continue;
        const id=awardKey(module,key,taskKey,run);if(awards[id])continue;
        awards[id]={points:value,completedAt,topic:key,task:taskKey,run};newAwards[id]=awards[id];add+=value;
      }
    }
  }
  return{add:Math.round(add),awards,newAwards,before,verified,cutoff,reason:add>0?'repairable-awards':'no-repairable-awards'};
}

export async function repairStalledPoints(){
  const id=canonicalId();if(!id)return{ok:false,reason:'student-id-missing'};
  try{await authReady}catch(e){}
  try{
    const ref=doc(db,'progress',id);
    const result=await runTransaction(db,async tx=>{
      const snap=await tx.get(ref);if(!snap.exists())return{ok:false,reason:'progress-missing'};
      const data=snap.data()||{},oldRepair=data?.metadata?.pointStallRepairV1||{},plan=collectRepair(data,oldRepair);
      if(plan.add<=0)return{ok:true,repaired:0,total:plan.before,evidence:plan.verified,reason:plan.reason};
      const total=plan.before+plan.add;
      tx.update(ref,{
        pointsTotal:total,lifetimePoints:total,punkteGesamt:total,
        'totals.points':total,'ranking.points':total,
        'metadata.pointStallRepairV1':{
          version:VERSION,awards:plan.awards,lastAdded:plan.add,totalAdded:point(oldRepair.totalAdded)+plan.add,
          sourceStored:plan.before,sourceEvidence:plan.verified,cutoffMillis:plan.cutoff||0,repairedAt:serverTimestamp()
        }
      });
      return{ok:true,repaired:plan.add,total,evidence:plan.verified,awards:Object.keys(plan.newAwards).length};
    });
    if(result?.repaired>0){
      try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(point(localStorage.getItem('SP_POINTS_TOTAL')),point(result.total))))}catch(e){}
      try{window.dispatchEvent(new CustomEvent('SP_POINT_STALL_REPAIRED',{detail:result}))}catch(e){}
    }
    return result;
  }catch(error){console.warn('Festgefahrene Punkte konnten nicht automatisch repariert werden',error);return{ok:false,reason:error?.message||String(error)}}
}

window.SPRepairStalledPoints=repairStalledPoints;
