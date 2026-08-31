import '/js/account-progress-cloud-core.js?v=20260831-central6';

const core=window.SPAccountProgressCloudCore;
if(!core||core.__l7RunAuthorityMergeV1){}
else{
  core.__l7RunAuthorityMergeV1=true;
  const originalMergeValues=core.mergeValues.bind(core);
  const parse=(raw,fallback=null)=>{try{return JSON.parse(String(raw||''))}catch(e){return fallback}};
  const isLedger=value=>!!(value&&typeof value==='object'&&!Array.isArray(value)&&/^A1-L7-T\d+$/i.test(String(value.themeKey||''))&&value.runs&&typeof value.runs==='object');
  const runPoints=run=>Number(run)===1?5:Number(run)===2?10:Number(run)===3?15:0;
  const stable=value=>{try{return JSON.stringify(value)}catch(e){return String(value)}};
  function union(a=[],b=[]){const out=[],seen=new Set();for(const value of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){const key=stable(value);if(seen.has(key))continue;seen.add(key);out.push(value)}return out}
  function mergeState(a,b){
    if(!a)return b;if(!b)return a;
    const total=Math.max(Number(a.total)||0,Number(b.total)||0);
    const done=union(a.done,b.done).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&(!total||i<total));
    const firstSeen=union(a.firstSeen,b.firstSeen).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&(!total||i<total));
    const answers={...(a.answers&&typeof a.answers==='object'?a.answers:{}),...(b.answers&&typeof b.answers==='object'?b.answers:{})};
    const wrongTries={...(a.wrongTries&&typeof a.wrongTries==='object'?a.wrongTries:{}),...(b.wrongTries&&typeof b.wrongTries==='object'?b.wrongTries:{})};
    const queue=total?[...Array(total).keys()].filter(i=>!done.includes(i)):union(a.queue,b.queue).filter(i=>!done.includes(i));
    return {...a,...b,total,done:[...new Set(done)].sort((x,y)=>x-y),firstSeen:[...new Set(firstSeen)].sort((x,y)=>x-y),queue,current:null,tries:0,hadWrong:false,wrongTries,answers,firstCorrect:Math.max(Number(a.firstCorrect)||0,Number(b.firstCorrect)||0)};
  }
  function mergeTask(a={},b={},targetRun=1){
    const percent=Math.max(Number(a.percent)||0,Number(b.percent)||0),completed=!!(a.completed||b.completed||percent>=100),done=Math.max(Number(a.done)||0,Number(b.done)||0),total=Math.max(Number(a.total)||0,Number(b.total)||0);
    return {...a,...b,percent,completed,done,total,points:completed?runPoints(targetRun):0,updatedAt:new Date().toISOString()};
  }
  function foldAbove(ledger,targetRun){
    ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};
    const key=String(targetRun),target=ledger.runs[key]&&typeof ledger.runs[key]==='object'?ledger.runs[key]:{tasks:{},examBestPercent:0,examPoints:0,examStars:0,examAttempted:false,completed:false};
    target.tasks=target.tasks&&typeof target.tasks==='object'?target.tasks:{};
    for(const [runKey,row] of Object.entries({...ledger.runs})){
      const run=Number(runKey);if(!Number.isFinite(run)||run<=targetRun||!row||typeof row!=='object')continue;
      for(const [id,item] of Object.entries(row.tasks||{}))target.tasks[id]=mergeTask(target.tasks[id]||{},item||{},targetRun);
      // Eine Prüfung aus einem ungültig entstandenen höheren Lauf wird nicht als neue Prüfung gewertet.
      delete ledger.runs[runKey];
    }
    target.updatedAt=new Date().toISOString();ledger.runs[key]=target;
    if(ledger.clientStates&&typeof ledger.clientStates==='object'){
      const states={...ledger.clientStates};
      for(const [compound,record] of Object.entries(states)){
        const cut=compound.indexOf(':');if(cut<0)continue;const run=Number(compound.slice(0,cut));if(!Number.isFinite(run)||run<=targetRun)continue;
        const id=compound.slice(cut+1),targetKey=`${targetRun}:${id}`,old=states[targetKey];
        const state=mergeState(old?.state,record?.state);
        if(state)states[targetKey]={state,updatedAt:Math.max(Number(old?.updatedAt)||0,Number(record?.updatedAt)||0,Date.now())};
        delete states[compound];
      }
      ledger.clientStates=states;
    }
    if(ledger.pending&&typeof ledger.pending==='object'){
      const tasks={};for(const [compound,value] of Object.entries(ledger.pending.tasks||{})){const cut=compound.indexOf(':');if(cut<0){tasks[compound]=value;continue}const run=Number(compound.slice(0,cut)),id=compound.slice(cut+1);tasks[`${run>targetRun?targetRun:run}:${id}`]=value}ledger.pending.tasks=tasks;
      const exams={};for(const [run,value] of Object.entries(ledger.pending.exams||{})){if(Number(run)<=targetRun)exams[run]=value}ledger.pending.exams=exams;
    }
    ledger.currentRun=targetRun;
    ledger.lifetimePoints=Object.entries(ledger.runs).reduce((sum,[run,row])=>sum+Object.values(row?.tasks||{}).reduce((s,item)=>s+Math.max(0,Number(item?.points)||0),0)+Math.max(0,Number(row?.examPoints)||0),0)+Math.max(0,Number(ledger.carriedPoints)||0);
    return ledger;
  }
  function applyAuthority(merged,a,b){
    if(!isLedger(merged))return merged;
    const ae=Math.max(0,Number(a?.runAuthorityEpoch)||0),be=Math.max(0,Number(b?.runAuthorityEpoch)||0);
    if(!ae&&!be)return merged;
    let chosen;
    if(ae>be)chosen=a;else if(be>ae)chosen=b;else{
      const at=Date.parse(String(a?.runAuthorityAt||a?.updatedAt||''))||0,bt=Date.parse(String(b?.runAuthorityAt||b?.updatedAt||''))||0;
      chosen=bt>=at?b:a;
    }
    const target=Math.max(1,Math.min(3,Number(chosen?.currentRun)||1));
    merged.runAuthorityEpoch=Math.max(ae,be);
    merged.runAuthorityAt=chosen?.runAuthorityAt||chosen?.updatedAt||new Date().toISOString();
    merged.runAuthorityReason=chosen?.runAuthorityReason||merged.runAuthorityReason||'account-run-authority';
    merged.runAuthorityPruneAbove=target;
    return foldAbove(merged,target);
  }
  core.mergeValues=function(aRaw,bRaw){
    const raw=originalMergeValues(aRaw,bRaw),a=parse(aRaw,null),b=parse(bRaw,null),merged=parse(raw,null);
    if(isLedger(merged)&&(isLedger(a)||isLedger(b))){try{return JSON.stringify(applyAuthority(merged,a||{},b||{}))}catch(e){return raw}}
    return raw;
  };
}