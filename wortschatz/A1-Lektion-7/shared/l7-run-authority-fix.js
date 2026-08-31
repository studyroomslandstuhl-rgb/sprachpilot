(function(){
'use strict';
if(window.__SP_L7_RUN_AUTHORITY_FIX_V1)return;window.__SP_L7_RUN_AUTHORITY_FIX_V1=true;
const base=window.L7ThemeScore;
if(!base)return;
const now=()=>new Date().toISOString();
function practiceTasks(){return (window.L7_THEME?.tasks||[]).filter(task=>task&&!task.exam&&Array.isArray(task.items)&&task.items.length>0)}
function mergeArray(a=[],b=[]){return [...new Set([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])].map(Number).filter(Number.isInteger))]}
function mergeState(a,b){
 if(!a)return b;if(!b)return a;
 const total=Math.max(Number(a.total)||0,Number(b.total)||0),done=mergeArray(a.done,b.done).filter(i=>i>=0&&(!total||i<total)),firstSeen=mergeArray(a.firstSeen,b.firstSeen).filter(i=>i>=0&&(!total||i<total));
 return {...a,...b,total,done:done.sort((x,y)=>x-y),firstSeen:firstSeen.sort((x,y)=>x-y),queue:total?[...Array(total).keys()].filter(i=>!done.includes(i)):[],current:null,tries:0,hadWrong:false,wrongTries:{...(a.wrongTries||{}),...(b.wrongTries||{})},answers:{...(a.answers||{}),...(b.answers||{})},firstCorrect:Math.max(Number(a.firstCorrect)||0,Number(b.firstCorrect)||0)}
}
function previousRunComplete(ledger,targetRun){
 const prev=ledger?.runs?.[String(targetRun-1)]||ledger?.runs?.[targetRun-1];if(!prev)return false;
 const required=practiceTasks().map(task=>String(task.id));if(!required.length)return false;
 const tasks=prev.tasks||{},practiceDone=required.every(id=>tasks[id]&&(tasks[id].completed===true||Number(tasks[id].percent)>=100));
 const examDone=prev.examAttempted===true||Number(prev.examBestPercent)>0||prev.completed===true;
 return practiceDone&&examDone;
}
function highestProvenRun(ledger){
 const wanted=Math.max(1,Math.min(3,Number(ledger?.currentRun)||1));let proven=1;
 for(let run=2;run<=wanted;run++){if(!previousRunComplete(ledger,run))break;proven=run}
 return proven;
}
function mergeTask(target={},source={},run=1){const percent=Math.max(Number(target.percent)||0,Number(source.percent)||0),completed=!!(target.completed||source.completed||percent>=100);return {...target,...source,percent,completed,done:Math.max(Number(target.done)||0,Number(source.done)||0),total:Math.max(Number(target.total)||0,Number(source.total)||0),points:completed?base.taskPoints(run):0,updatedAt:now()}}
function foldInvalidRuns(ledger,targetRun){
 ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};const target=ledger.runs[String(targetRun)]||{tasks:{},examBestPercent:0,examPoints:0,examStars:0,examAttempted:false,completed:false,startedAt:now(),updatedAt:now()};target.tasks=target.tasks&&typeof target.tasks==='object'?target.tasks:{};
 for(const [key,row] of Object.entries({...ledger.runs})){const run=Number(key);if(!Number.isFinite(run)||run<=targetRun)continue;for(const [id,item] of Object.entries(row?.tasks||{}))target.tasks[id]=mergeTask(target.tasks[id]||{},item||{},targetRun);delete ledger.runs[key]}
 ledger.runs[String(targetRun)]=target;
 if(ledger.clientStates&&typeof ledger.clientStates==='object')for(const [compound,record] of Object.entries({...ledger.clientStates})){const cut=compound.indexOf(':');if(cut<0)continue;const run=Number(compound.slice(0,cut));if(!Number.isFinite(run)||run<=targetRun)continue;const id=compound.slice(cut+1),to=`${targetRun}:${id}`,old=ledger.clientStates[to],state=mergeState(old?.state,record?.state);if(state)ledger.clientStates[to]={state,updatedAt:Math.max(Number(old?.updatedAt)||0,Number(record?.updatedAt)||0,Date.now())};delete ledger.clientStates[compound]}
 if(ledger.pending&&typeof ledger.pending==='object'){
  const tasks={};for(const [compound,value] of Object.entries(ledger.pending.tasks||{})){const cut=compound.indexOf(':');if(cut<0){tasks[compound]=value;continue}const run=Number(compound.slice(0,cut)),id=compound.slice(cut+1);tasks[`${run>targetRun?targetRun:run}:${id}`]=value}ledger.pending.tasks=tasks;
  const exams={};for(const [run,value] of Object.entries(ledger.pending.exams||{}))if(Number(run)<=targetRun)exams[run]=value;ledger.pending.exams=exams;
 }
 ledger.currentRun=targetRun;return ledger;
}
function stampAuthority(ledger,reason,bump=true){ledger.runAuthorityEpoch=Math.max(1,Number(ledger.runAuthorityEpoch)||0)+(bump?1:0);ledger.runAuthorityAt=now();ledger.runAuthorityReason=reason;ledger.runAuthorityPruneAbove=Math.max(1,Math.min(3,Number(ledger.currentRun)||1));ledger.expectedPracticeTaskIds=practiceTasks().map(task=>String(task.id));return ledger}
function repair(theme,{forceStamp=false}={}){
 theme=Number(theme||document.body.dataset.theme||0);if(!theme||window.L7S?.preview?.())return null;
 let ledger=base.read(theme),wanted=Math.max(1,Math.min(3,Number(ledger.currentRun)||1)),proven=highestProvenRun(ledger),changed=false;
 ledger.expectedPracticeTaskIds=practiceTasks().map(task=>String(task.id));
 if(proven<wanted){ledger=foldInvalidRuns(ledger,proven);stampAuthority(ledger,'invalid-device-run-split-repaired',true);changed=true}
 else if(forceStamp||!Number(ledger.runAuthorityEpoch)){stampAuthority(ledger,wanted>1?'validated-existing-repeat':'authoritative-run-1',false);changed=true}
 if(changed){base.write(theme,ledger);try{window.SPAccountProgressSync?.flush?.()}catch(e){}}
 return ledger;
}
const originalRecordState=base.recordState?.bind(base);if(originalRecordState)base.recordState=function(theme,id,state){repair(theme);const result=originalRecordState(theme,id,state);repair(theme);return result};
const originalInit=base.initOverview?.bind(base);if(originalInit)base.initOverview=async function(theme){repair(theme);const result=await originalInit(theme);repair(theme);base.renderSummary?.(theme);return base.summary?.(theme)||result};
const originalStartRepeat=base.startRepeat?.bind(base);if(originalStartRepeat)base.startRepeat=function(theme,skipConfirm=false){theme=Number(theme);repair(theme,{forceStamp:true});const before=base.read(theme),beforeEpoch=Math.max(1,Number(before.runAuthorityEpoch)||1),ok=originalStartRepeat(theme,skipConfirm);if(ok){const ledger=base.read(theme);ledger.runAuthorityEpoch=Math.max(beforeEpoch+1,Number(ledger.runAuthorityEpoch)||0);ledger.runAuthorityAt=now();ledger.runAuthorityReason='explicit-repeat-start';ledger.runAuthorityPruneAbove=Math.max(1,Math.min(3,Number(ledger.currentRun)||1));ledger.expectedPracticeTaskIds=practiceTasks().map(task=>String(task.id));base.write(theme,ledger);try{window.SPAccountProgressSync?.flush?.()}catch(e){}}return ok};
repair(Number(document.body.dataset.theme||0));
window.SPL7RunAuthorityFix={repair,previousRunComplete,highestProvenRun};
})();