(function(){
'use strict';
if(window.SPL7ScoreReconcile)return;
const clean=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function api(){
 try{
  if(!window.SPProgress?.idCandidates)await import('/js/progress.js?v=20260831-central6');
  await import('/js/point-delta-bridge.js?v=20260831-central6');
 }catch(e){}
 return window.SPProgress||null
}
async function cloudProgress(P){
 try{
  const F=await import('/js/firebase.js');
  for(const id of P?.idCandidates?.()||[]){
   if(!id)continue;
   try{const s=await F.getDocFromServer(F.doc(F.db,'progress',String(id)));if(s.exists())return s.data()||{}}catch(e){}
  }
 }catch(e){}
 return null
}
function cloudTask(topic,id){return topic?.tasks?.[`task.html?task=${id}`]||topic?.tasks?.[id]||null}
function taskAward(topic,id,run){const raw=`task.html?task=${id}`,task=cloudTask(topic,id);return Math.max(Number(task?.pointsByRun?.[String(run)]||0),Number(topic?.lifetime?.taskPointRuns?.[clean(raw)]?.[String(run)]||0))}
async function run(theme){
 theme=Number(theme);const S=window.L7ThemeScore;if(!theme||!S||window.L7S?.preview?.())return false;
 const P=await api();if(!P)return false;const cloud=await cloudProgress(P),ledger=S.read(theme),topic=cloud?.wortschatz?.[S.topicId(theme)]||{};let changed=false;
 ledger.pending=ledger.pending||{tasks:{},exams:{}};ledger.pending.tasks=ledger.pending.tasks||{};ledger.pending.exams=ledger.pending.exams||{};
 for(const [runKey,data] of Object.entries(ledger.runs||{})){
  const runNo=Math.max(1,Math.min(3,Number(runKey)||1));
  for(const [id,item] of Object.entries(data?.tasks||{})){
   const ct=cloudTask(topic,id),missingProgress=!ct||Number(ct.percent||0)<Number(item.percent||0),missingAward=!!item.completed&&taskAward(topic,id,runNo)<Math.max(Number(item.points||0),Number(S.taskPoints?.(runNo)||0));
   if(missingProgress||missingAward){ledger.pending.tasks[`${runNo}:${id}`]=true;changed=true}
  }
  const cloudExam=Math.max(Number(topic?.exam?.bestPercent||0),Number(topic?.exam?.percent||0)),cloudAward=Number(topic?.lifetime?.examPointRuns?.[String(runNo)]||0);
  if(Number(data?.examBestPercent||0)>cloudExam||Number(data?.examPoints||0)>cloudAward){ledger.pending.exams[String(runNo)]=true;changed=true}
 }
 if(changed){S.write(theme,ledger);setTimeout(()=>S.syncFirebase(theme),50)}
 return changed
}
window.SPL7ScoreReconcile={run};
})();