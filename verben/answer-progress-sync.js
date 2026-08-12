(function(){
'use strict';
if(window.__SP_VERB_ANSWER_PROGRESS_SYNC_V1)return;
window.__SP_VERB_ANSWER_PROGRESS_SYNC_V1=true;
const E=window.VerbGroupsEngine;
if(!E)return;
const nativeRight=typeof E.markRight==='function'?E.markRight.bind(E):null;
const nativeWrong=typeof E.markWrong==='function'?E.markWrong.bind(E):null;
function syncNow(){
 try{E.save?.()}catch(e){}
 setTimeout(()=>{try{window.SPVerbFirebaseRankingSync?.schedule?.(0)}catch(e){}},0);
}
if(nativeRight)E.markRight=function(groupId,task){const result=nativeRight(groupId,task);syncNow();return result};
if(nativeWrong)E.markWrong=function(groupId,task){const result=nativeWrong(groupId,task);syncNow();return result};
window.addEventListener('pagehide',syncNow);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')syncNow()});
})();
