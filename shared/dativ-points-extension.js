(function(){
'use strict';
if(window.__SP_DATIV_POINTS_EXTENSION_V3)return;
window.__SP_DATIV_POINTS_EXTENSION_V3=true;

const positive=value=>{const n=Number(value);return Number.isFinite(n)&&n>0?n:0};
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const levelOf=(key,record={})=>{
  const direct=String(record.level||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0];
  if(direct)return direct;
  const raw=String(record.signature||key||'').toUpperCase();
  return raw.match(/(?:^|[^A-Z0-9])(A1|A2|B1|B2|C1)(?:[^A-Z0-9]|$)/)?.[1]||clean(key)||'unknown';
};

function install(){
  const api=window.SPPointRecalculator;
  if(!api){setTimeout(install,30);return}
  if(api.builtinDativverben===true){api.__dativverbenV3=true;return}
  if(api.__dativverbenV3)return;

  const baseCalculate=api.calculate.bind(api);
  const baseAudit=api.audit.bind(api);
  function dativverbenPoints(progress={}){
    const byLevel=new Map();
    for(const [key,topic] of Object.entries(progress?.dativverben||{})){
      if(!topic||typeof topic!=='object'||Array.isArray(topic))continue;
      if(!(topic.tasks||topic.lifetime||topic.exam||topic.current||topic.progressPercent!=null))continue;
      const points=positive(api.topicPoints?.(topic)?.points),level=levelOf(key,topic);
      byLevel.set(level,Math.max(byLevel.get(level)||0,points));
    }
    for(const [key,group] of Object.entries(progress?.metadata?.dativverbenGroups||{})){
      if(!group||typeof group!=='object')continue;
      const points=positive(api.groupPoints?.(group)?.points),level=levelOf(key,group);
      byLevel.set(level,Math.max(byLevel.get(level)||0,points));
    }
    return [...byLevel.values()].reduce((sum,value)=>sum+positive(value),0);
  }

  api.calculateWithoutDativverben=baseCalculate;
  api.dativverbenPoints=dativverbenPoints;
  api.calculate=function(progress={}){
    const base=baseCalculate(progress),dativ=dativverbenPoints(progress);
    return {...base,total:positive(base.total)+dativ,breakdown:{...(base.breakdown||{}),dativverben:dativ},topics:{...(base.topics||{}),dativverben:Object.entries(progress?.dativverben||{}).filter(([,topic])=>topic&&typeof topic==='object')}};
  };
  api.audit=function(progress={}){const old=baseAudit(progress),exact=api.calculate(progress),stored=positive(old.stored);return {...old,...exact,stored,difference:exact.total-stored,inflatedBy:Math.max(0,stored-exact.total)}};
  api.__dativverbenV3=true;
}

install();
})();
