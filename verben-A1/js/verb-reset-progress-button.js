(function(){
  if(window.__SP_VERB_RESET_PROGRESS_BUTTON__)return;
  window.__SP_VERB_RESET_PROGRESS_BUTTON__=true;

  function resetVerbenProgress(){
    if(!confirm('Möchtest du wirklich alle Verben-Fortschritte löschen? Deine Punkte bleiben erhalten.'))return;
    try{
      const resetAt=typeof window.spAllowVerbProgressReset==='function'?window.spAllowVerbProgressReset():Date.now();
      if(typeof resetAllVerbProgressKeepPoints==='function')resetAllVerbProgressKeepPoints();
      else if(typeof state!=='undefined'&&state){
        state.phase='home';state.index=0;
        state.known=[];state.learned=[];state.unsure=[];state.unknown=[];state.active=[];state.practicePool=[];state.archivedPackages=[];state.assessmentBatch=[];state.assessed=[];state.currentPackageVerbs=[];
        state.weak={};state.currentGame='';state.currentVerb='';state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.first=null;state.openCards=[];state.lock=false;
        state.skillDone={};state.skillAttempts={};state.skillSuccess={};state.taskQueues={};state.taskDoneSets={};state.taskErrorSets={};state.packageNo=1;state.assessmentStart=0;state.assessmentTries=0;state.revealed=false;
        state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false};
      }
      if(typeof state!=='undefined'&&state)state.explicitResetAt=resetAt;
      if(typeof saveState==='function')saveState();
      if(typeof spSyncDashboardSummary==='function')spSyncDashboardSummary();
      if(typeof window.flushVerbProgress==='function')window.flushVerbProgress();
    }catch(e){console.warn('Verben-Fortschritte löschen fehlgeschlagen',e)}
    try{history.replaceState(null,'','/verben-A1/')}catch(e){}
    if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();else location.href='/verben-A1/';
  }

  function install(){
    const nav=document.querySelector('#spHeader .nav, header .nav');
    if(!nav)return;
    if(nav.querySelector('.sp-reset-verbs-progress'))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='btn danger-btn sp-reset-verbs-progress';
    btn.textContent='Fortschritte löschen';
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();resetVerbenProgress()},true);
    nav.appendChild(btn);
  }

  window.spResetVerbenProgress=resetVerbenProgress;
  document.addEventListener('DOMContentLoaded',function(){setTimeout(install,80);setTimeout(install,400);setTimeout(install,1200)},{once:true});
  setTimeout(install,80);setTimeout(install,400);setTimeout(install,1200);
  try{new MutationObserver(function(){setTimeout(install,0)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();