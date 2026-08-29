import '/shared/dativ-points-extension.js?v=2';
import { getActiveRole } from '/js/auth.js?v=login-main-4';

if(!window.__SP_AUTHORITATIVE_POINT_REPAIR_V1){
  window.__SP_AUTHORITATIVE_POINT_REPAIR_V1=true;
  const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
  let running=false,timer=null;

  function rewriteProfileKey(key,total){
    try{
      const raw=localStorage.getItem(key);if(!raw)return;
      const value=JSON.parse(raw);if(!value||typeof value!=='object')return;
      value.points=total;value.rankingPoints=total;value.pointsTotal=total;value.lifetimePoints=total;value.punkteGesamt=total;
      value.ranking={...(value.ranking||{}),points:total};
      value.totals={...(value.totals||{}),points:total};
      localStorage.setItem(key,JSON.stringify(value));
    }catch(e){}
  }
  function applyLocal(total,version){
    try{
      localStorage.setItem('SP_POINTS_TOTAL',String(total));
      localStorage.removeItem('SP_POINT_DELTA_PENDING_V2');
      localStorage.setItem('SP_AUTHORITATIVE_POINT_VERSION',String(version));
      localStorage.setItem('SP_AUTHORITATIVE_POINT_TOTAL',String(total));
    }catch(e){}
    ['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_ACTIVE_PROFILE'].forEach(key=>rewriteProfileKey(key,total));
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
      const version=Number(audit.authoritativeExactVersion||audit.b1RecalculationVersion||0);
      if(version<1)return false;
      const total=point(audit.authoritativeExactPoints??progress?.totals?.points??progress?.pointsTotal);
      applyLocal(total,version);
      try{window.dispatchEvent(new CustomEvent('SP_AUTHORITATIVE_POINTS_APPLIED',{detail:{total,version}}))}catch(e){}
      return true;
    }catch(error){
      console.warn('Autoritativer Punktestand konnte noch nicht übernommen werden',error);
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
  window.SPAuthoritativePointRepair={run,schedule};
}
