(function(){
'use strict';
function apply(){
 const E=window.PerfektGroupsEngine;
 if(!E||E.__stabilityPatched)return;
 E.__stabilityPatched=true;
 const originalExamUnlocked=E.examUnlocked.bind(E);
 E.examUnlocked=function(groupId){
  const done=E.learnDone(groupId),run=E.currentRun(groupId);
  if(run&&done&&!run.exam.unlocked){run.exam.unlocked=true;E.save()}
  return !!run&&(run.exam.unlocked||done||originalExamUnlocked(groupId))
 };
 const originalAwardExam=E.awardExam.bind(E);
 E.awardExam=function(groupId,percent){
  originalAwardExam(groupId,percent);
  const run=E.currentRun(groupId);
  if(run&&E.learnDone(groupId)){
   run.exam.unlocked=true;
   if(Number(run.exam.bestPercent||0)>=100)run.completed=true;
   E.save()
  }
 }
}
const ready=window.PERFEKT_READY;
if(ready&&typeof ready.then==='function')ready.then(apply).catch(()=>{});
else{setTimeout(apply,0);setTimeout(apply,500)}
})();
