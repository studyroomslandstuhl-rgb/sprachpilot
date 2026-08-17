import { db, doc, updateDoc, increment, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';

if(!window.__SP_POINT_DELTA_BRIDGE_V1){
  window.__SP_POINT_DELTA_BRIDGE_V1=true;

  const locks=new Map();
  const MODULE_ALIASES={'fragen-a1':'fragen','verben-a1':'verben','irregulare-verben':'verben'};
  const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
  const clean=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
  const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0};
  function moduleKey(v){const k=clean(v||'wortschatz');return MODULE_ALIASES[k]||k}
  function topicId(p={}){return p.topicId||p.themeId||clean([p.module||'wortschatz',p.level||'A1','lektion',p.lesson||p.lektion||'', 'thema',p.theme||p.thema||''].filter(Boolean).join('_'))}
  function stored(r={}){return Math.max(point(r?.ranking?.points),point(r?.totals?.points),point(r?.pointsTotal),point(r?.lifetimePoints),point(r?.punkteGesamt),point(localStorage.getItem('SP_POINTS_TOTAL')))}
  function currentId(result={}){const p=getActiveProfile?.()||{};return result.studentId||result.userId||result.docId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||''}
  function taskRunAward(progress,module,id,rawKey,run){const topic=progress?.[module]?.[id]||{},key=clean(rawKey),a=point(topic?.lifetime?.taskPointRuns?.[key]?.[String(run)]),b=point(topic?.tasks?.[rawKey]?.pointsByRun?.[String(run)]),c=point(topic?.tasks?.[key]?.pointsByRun?.[String(run)]);return Math.max(a,b,c)}
  function examRunAward(progress,module,id,run){return point(progress?.[module]?.[id]?.lifetime?.examPointRuns?.[String(run)])}
  async function applyGap(result,beforeStored,delta,detail){
    if(!result||delta<=0)return result;
    const after=stored(result),desired=Math.max(after,beforeStored+delta),gap=Math.max(0,desired-after),id=currentId(result);
    if(gap<=0||!id)return result;
    try{
      await updateDoc(doc(db,'progress',id),{
        pointsTotal:increment(gap),lifetimePoints:increment(gap),punkteGesamt:increment(gap),
        'totals.points':increment(gap),'ranking.points':increment(gap),
        'metadata.pointDeltaBridgeVersion':1,'metadata.pointDeltaLastAt':serverTimestamp()
      });
      result.pointsTotal=desired;result.lifetimePoints=desired;result.punkteGesamt=desired;
      result.totals={...(result.totals||{}),points:desired};result.ranking={...(result.ranking||{}),points:desired};
      try{localStorage.setItem('SP_POINTS_TOTAL',String(desired))}catch(e){}
      try{window.dispatchEvent(new CustomEvent('SP_POINT_DELTA_APPLIED',{detail:{...detail,delta:gap,total:desired}}))}catch(e){}
    }catch(error){console.warn('Punkte-Delta konnte nicht ergänzt werden',error)}
    return result;
  }
  function patch(){
    const api=window.SPProgress;if(!api||api.__deltaBridgeV1)return false;
    const rawTask=api.recordTaskProgress?.bind(api),rawExam=api.recordExamResult?.bind(api);
    if(typeof rawTask!=='function'||typeof rawExam!=='function')return false;
    api.recordTaskProgress=async function(payload={}){
      const module=moduleKey(payload.module||'wortschatz'),id=topicId({...payload,module}),run=api.currentRun?.(id)||1,rawKey=payload.file||payload.taskKey||payload.taskTitle||'task',lock=`task|${module}|${id}|${clean(rawKey)}|${run}`;
      if(locks.has(lock))return locks.get(lock);
      const job=(async()=>{
        let before={};try{before=await api.loadCurrentStudentProgress?.()||{}}catch(e){}
        const beforeTotal=stored(before),already=taskRunAward(before,module,id,rawKey,run),completed=!!payload.completed||clamp(payload.percent??payload.progress??0)>=100,delta=completed&&already<=0?point(api.taskPointsForRun?.(run)):0;
        const result=await rawTask(payload);return applyGap(result,beforeTotal,delta,{type:'task',module,topicId:id,task:rawKey,run});
      })().finally(()=>locks.delete(lock));locks.set(lock,job);return job;
    };
    api.recordExamResult=async function(payload={}){
      const module=moduleKey(payload.module||'wortschatz'),id=topicId({...payload,module}),run=api.currentRun?.(id)||1,lock=`exam|${module}|${id}|${run}`;
      if(locks.has(lock))return locks.get(lock);
      const job=(async()=>{
        let before={};try{before=await api.loadCurrentStudentProgress?.()||{}}catch(e){}
        const beforeTotal=stored(before),oldAward=examRunAward(before,module,id,run),pct=clamp(payload.percent??payload.scorePercent??payload.score??0),earned=point(api.examEarnedForRun?.(run,pct)),delta=Math.max(0,earned-oldAward);
        const result=await rawExam(payload);return applyGap(result,beforeTotal,delta,{type:'exam',module,topicId:id,run,percent:pct});
      })().finally(()=>locks.delete(lock));locks.set(lock,job);return job;
    };
    api.__deltaBridgeV1=true;window.SPProgress=api;return true;
  }
  if(!patch()){
    let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>40)clearInterval(timer)},100);
  }
}
