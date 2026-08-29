import '/shared/dativ-points-extension.js?v=2';
import { getActiveRole } from '/js/auth.js?v=login-main-4';

if(!window.__SP_AUTHORITATIVE_POINT_REPAIR_V2){
  window.__SP_AUTHORITATIVE_POINT_REPAIR_V2=true;
  const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
  let running=false,timer=null;

  function readObject(key){
    try{const value=JSON.parse(localStorage.getItem(key)||'null');return value&&typeof value==='object'?value:{}}catch(e){return{}}
  }
  function recordPoints(value={}){
    return Math.max(
      point(value.points),point(value.rankingPoints),point(value.pointsTotal),point(value.lifetimePoints),point(value.punkteGesamt),
      point(value?.ranking?.points),point(value?.totals?.points),point(value?.metadata?.pointAudit?.preservedPoints),
      point(value?.metadata?.pointAudit?.preservedHistoricalFloor),point(value?.metadata?.pointAudit?.finalPoints)
    );
  }
  function localFloor(){
    let best=point(localStorage.getItem('SP_POINTS_TOTAL'));
    for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_ACTIVE_PROFILE'])best=Math.max(best,recordPoints(readObject(key)));
    return best;
  }
  function rewriteProfileKey(key,total){
    try{
      const raw=localStorage.getItem(key);if(!raw)return;
      const value=JSON.parse(raw);if(!value||typeof value!=='object')return;
      const safe=Math.max(recordPoints(value),point(total));
      value.points=safe;value.rankingPoints=safe;value.pointsTotal=safe;value.lifetimePoints=safe;value.punkteGesamt=safe;
      value.ranking={...(value.ranking||{}),points:safe};
      value.totals={...(value.totals||{}),points:safe};
      localStorage.setItem(key,JSON.stringify(value));
    }catch(e){}
  }
  function applyLocal(total,version){
    const safe=Math.max(point(total),localFloor());
    try{
      localStorage.setItem('SP_POINTS_TOTAL',String(safe));
      localStorage.setItem('SP_AUTHORITATIVE_POINT_VERSION',String(version));
      localStorage.setItem('SP_AUTHORITATIVE_POINT_TOTAL',String(safe));
      localStorage.setItem('SP_POINT_NO_LOWERING_V2','1');
    }catch(e){}
    ['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_ACTIVE_PROFILE'].forEach(key=>rewriteProfileKey(key,safe));
    return safe;
  }
  function cloudFloor(progress={}){
    const audit=progress?.metadata?.pointAudit||{};
    return Math.max(
      recordPoints(progress),point(audit.finalPoints),point(audit.preservedHistoricalFloor),point(audit.preservedPoints),
      point(audit.authoritativeExactPoints),point(audit.reconstructedPoints)
    );
  }
  async function run(){
    if(running)return false;
    const role=String(getActiveRole?.()||'').toLowerCase();
    if(['teacher','lehrer','admin','owner'].includes(role))return false;
    const api=window.SPProgress;if(!api?.loadCurrentStudentProgress)return false;
    running=true;
    try{
      const progress=await api.loadCurrentStudentProgress()||{};
      const audit=progress?.metadata?.pointAudit||{};
      const version=Number(audit.reconciliationVersion||audit.authoritativeExactVersion||audit.b1RecalculationVersion||0);
      if(version<1)return false;
      const safe=applyLocal(cloudFloor(progress),version);
      try{window.dispatchEvent(new CustomEvent('SP_AUTHORITATIVE_POINTS_APPLIED',{detail:{total:safe,version,loweringDisabled:true}}))}catch(e){}
      return true;
    }catch(error){
      console.warn('Punktestand konnte noch nicht sicher übernommen werden',error);
      return false;
    }finally{running=false}
  }
  function schedule(delay=700){clearTimeout(timer);timer=setTimeout(()=>run(),delay)}
  function waitAndRun(tries=0){
    if(window.SPProgress?.loadCurrentStudentProgress){schedule(100);return}
    if(tries<80)setTimeout(()=>waitAndRun(tries+1),100);
  }
  window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>schedule(150));
  window.addEventListener('online',()=>schedule(300));
  window.addEventListener('focus',()=>schedule(300));
  waitAndRun();
  window.SPAuthoritativePointRepair={run,schedule,localFloor};
}