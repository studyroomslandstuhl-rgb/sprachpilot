import { db, doc, getDoc, updateDoc, increment, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';

if(!window.__SP_POINT_DELTA_BRIDGE_V2){
  window.__SP_POINT_DELTA_BRIDGE_V2=true;
  const PENDING_KEY='SP_POINT_DELTA_PENDING_V2';
  const locks=new Map();
  const MODULE_ALIASES={'fragen-a1':'fragen','verben-a1':'verben','irregulare-verben':'verben'};
  const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
  const clean=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
  const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0};
  function moduleKey(v){const k=clean(v||'wortschatz');return MODULE_ALIASES[k]||k}
  function topicId(p={}){return p.topicId||p.themeId||clean([p.module||'wortschatz',p.level||'A1','lektion',p.lesson||p.lektion||'','thema',p.theme||p.thema||''].filter(Boolean).join('_'))}
  function storedRecord(r={}){return Math.max(point(r?.ranking?.points),point(r?.totals?.points),point(r?.pointsTotal),point(r?.lifetimePoints),point(r?.punkteGesamt))}
  function stored(r={}){return Math.max(storedRecord(r),point(localStorage.getItem('SP_POINTS_TOTAL')))}
  function currentId(result={}){const p=getActiveProfile?.()||{};return result.studentId||result.userId||result.docId||p.docId||p.studentId||p.userId||localStorage.getItem('SP_STUDENT_ID')||''}
  function taskRunAward(progress,module,id,rawKey,run){const topic=progress?.[module]?.[id]||{},key=clean(rawKey),a=point(topic?.lifetime?.taskPointRuns?.[key]?.[String(run)]),b=point(topic?.tasks?.[rawKey]?.pointsByRun?.[String(run)]),c=point(topic?.tasks?.[key]?.pointsByRun?.[String(run)]);return Math.max(a,b,c)}
  function examRunAward(progress,module,id,run){return point(progress?.[module]?.[id]?.lifetime?.examPointRuns?.[String(run)])}
  function setLocalTotal(v){try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(point(localStorage.getItem('SP_POINTS_TOTAL')),point(v))))}catch(e){}}
  function savePending(entry){try{localStorage.setItem(PENDING_KEY,JSON.stringify(entry))}catch(e){}}
  function clearPending(){try{localStorage.removeItem(PENDING_KEY)}catch(e){}}
  function pending(){try{return JSON.parse(localStorage.getItem(PENDING_KEY)||'null')}catch(e){return null}}
  async function incrementTo(id,desired,detail={}){
    if(!id||desired<=0)return false;
    try{
      const snap=await getDoc(doc(db,'progress',id));if(!snap.exists())return false;
      const current=storedRecord(snap.data()||{}),gap=Math.max(0,Math.round(desired-current));
      if(gap>0){
        await updateDoc(doc(db,'progress',id),{
          pointsTotal:increment(gap),lifetimePoints:increment(gap),punkteGesamt:increment(gap),
          'totals.points':increment(gap),'ranking.points':increment(gap),
          'metadata.pointDeltaBridgeVersion':2,'metadata.pointDeltaLastAt':serverTimestamp()
        });
      }
      setLocalTotal(desired);clearPending();
      try{window.dispatchEvent(new CustomEvent('SP_POINT_DELTA_APPLIED',{detail:{...detail,delta:gap,total:desired}}))}catch(e){}
      return true;
    }catch(error){console.warn('Punkte-Delta konnte nicht ergänzt werden',error);savePending({id,desired,detail,at:Date.now()});return false}
  }
  async function repairPending(){
    const p=pending();if(!p?.id||!p?.desired)return true;
    return incrementTo(String(p.id),point(p.desired),p.detail||{type:'pending'});
  }
  async function verifyTask(api,module,id,rawKey,run,expectedAward){
    try{const cloud=await api.loadCurrentStudentProgress?.()||{};return taskRunAward(cloud,module,id,rawKey,run)>=expectedAward}catch(e){return false}
  }
  async function verifyExam(api,module,id,run,expectedAward){
    try{const cloud=await api.loadCurrentStudentProgress?.()||{};return examRunAward(cloud,module,id,run)>=expectedAward}catch(e){return false}
  }
  async function applyGap(result,beforeStored,delta,detail){
    if(!result||delta<=0)return result;
    const after=storedRecord(result),desired=Math.max(after,beforeStored+delta),id=currentId(result);
    if(desired<=after){setLocalTotal(desired);return result}
    savePending({id,desired,detail,at:Date.now()});
    const ok=await incrementTo(id,desired,detail);if(!ok)return null;
    result.pointsTotal=desired;result.lifetimePoints=desired;result.punkteGesamt=desired;
    result.totals={...(result.totals||{}),points:desired};result.ranking={...(result.ranking||{}),points:desired};
    return result;
  }
  function patch(){
    const api=window.SPProgress;if(!api||api.__deltaBridgeV2)return false;
    const rawTask=api.recordTaskProgress?.bind(api),rawExam=api.recordExamResult?.bind(api);
    if(typeof rawTask!=='function'||typeof rawExam!=='function')return false;
    api.recordTaskProgress=async function(payload={}){
      const completed=!!payload.completed||clamp(payload.percent??payload.progress??0)>=100;
      if(!completed)return rawTask(payload);
      const module=moduleKey(payload.module||'wortschatz'),id=topicId({...payload,module}),run=api.currentRun?.(id)||1,rawKey=payload.file||payload.taskKey||payload.taskTitle||'task',lock=`task|${module}|${id}|${clean(rawKey)}|${run}`;
      if(locks.has(lock))return locks.get(lock);
      const job=(async()=>{
        await repairPending();
        let before={};try{before=await api.loadCurrentStudentProgress?.()||{}}catch(e){}
        const beforeTotal=stored(before),already=taskRunAward(before,module,id,rawKey,run),expected=point(api.taskPointsForRun?.(run)),delta=already<=0?expected:0;
        const result=await rawTask(payload);if(!result)return null;
        if(delta>0&&!(await verifyTask(api,module,id,rawKey,run,expected)))return null;
        return applyGap(result,beforeTotal,delta,{type:'task',module,topicId:id,task:rawKey,run});
      })().finally(()=>locks.delete(lock));locks.set(lock,job);return job;
    };
    api.recordExamResult=async function(payload={}){
      const module=moduleKey(payload.module||'wortschatz'),id=topicId({...payload,module}),run=api.currentRun?.(id)||1,lock=`exam|${module}|${id}|${run}`;
      if(locks.has(lock))return locks.get(lock);
      const job=(async()=>{
        await repairPending();
        let before={};try{before=await api.loadCurrentStudentProgress?.()||{}}catch(e){}
        const beforeTotal=stored(before),oldAward=examRunAward(before,module,id,run),pct=clamp(payload.percent??payload.scorePercent??payload.score??0),earned=point(api.examEarnedForRun?.(run,pct)),delta=Math.max(0,earned-oldAward);
        const result=await rawExam(payload);if(!result)return null;
        if(delta>0&&!(await verifyExam(api,module,id,run,earned)))return null;
        return applyGap(result,beforeTotal,delta,{type:'exam',module,topicId:id,run,percent:pct});
      })().finally(()=>locks.delete(lock));locks.set(lock,job);return job;
    };
    api.__deltaBridgeV2=true;window.SPProgress=api;repairPending();return true;
  }
  if(!patch()){
    let tries=0;const timer=setInterval(()=>{tries++;if(patch()||tries>40)clearInterval(timer)},100);
  }
  window.addEventListener('online',()=>repairPending());
}
