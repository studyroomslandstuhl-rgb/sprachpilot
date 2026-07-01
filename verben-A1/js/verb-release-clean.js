(function(){
function cleanVerbReleaseState(){
  if(!window.state||!window.spStrictReleasedVerbList)return false;
  var allowed=window.spStrictReleasedVerbList();
  if(!allowed.length)return false;
  var s=new Set(allowed);var changed=false;
  ['known','unsure','unknown','active','learned','practicePool','assessmentBatch','assessed','currentPackageVerbs'].forEach(function(k){
    if(Array.isArray(state[k])){var before=state[k].join('|');state[k]=state[k].filter(function(v){return s.has(v)});if(before!==state[k].join('|'))changed=true;}
  });
  if(state.currentVerb&&!s.has(state.currentVerb)){state.currentVerb='';changed=true;}
  if(state.currentTask&&state.currentTask.v&&!s.has(state.currentTask.v)){state.currentTask=null;changed=true;}
  state.taskQueues={};state.taskDoneSets={};state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;
  if(changed&&typeof saveState==='function')saveState();
  return changed;
}
window.cleanVerbReleaseState=cleanVerbReleaseState;
function run(){if(cleanVerbReleaseState()&&typeof renderHome==='function')renderHome();}
document.addEventListener('DOMContentLoaded',function(){setTimeout(run,800)});
setTimeout(run,2500);setTimeout(run,6000);
})();