(function(){
  const TASK_PHASES=new Set(['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren','pruefung']);
  function hashValue(){return String(location.hash||'').replace(/^#/,'')}
  function overviewHash(){return ['aufgaben','taskOverview','task-overview','tasks'].includes(hashValue())}
  function taskHash(){
    const h=hashValue();
    if(!h)return false;
    if(h==='pruefung')return true;
    try{
      return (window.VERB_SKILLS||[]).some(skill=>{
        const mapped=(window.PHASE_HASHES&&window.PHASE_HASHES[skill])||skill;
        return h===mapped||h===skill;
      });
    }catch(e){return false}
  }
  function activeCount(){try{return typeof currentPracticeVerbs==='function'?currentPracticeVerbs().length:0}catch(e){return 0}}
  function saveQuiet(){try{if(typeof saveState==='function')saveState()}catch(e){}try{if(typeof spSyncDashboardSummary==='function')spSyncDashboardSummary()}catch(e){}}
  function closeTaskForOverview(){
    try{if(typeof returnCurrentTaskToQueue==='function')returnCurrentTaskToQueue()}catch(e){}
    try{
      state.phase='taskOverview';
      state.currentGame='';
      state.currentVerb='';
      state.currentTask=null;
      state.memoryCards=[];
      state.memoryDone=[];
      state.openCards=[];
      state.first=null;
      state.lock=false;
      saveQuiet();
    }catch(e){}
  }
  function showTaskOverview(){
    if(location.hash!=='#aufgaben')history.replaceState(null,'','#aufgaben');
    if(activeCount()>0&&typeof renderTaskOverview==='function'){renderTaskOverview();return}
    if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();
  }
  window.goTaskOverview=function(){showTaskOverview()};
  window.startPractice=function(){
    try{if(typeof spEnsureState==='function')spEnsureState()}catch(e){}
    if(activeCount()>0){showTaskOverview();return}
    if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();
  };
  window.closeVerbTaskAndRenderHome=function(){closeTaskForOverview();showTaskOverview()};
  window.goVerbHome=window.closeVerbTaskAndRenderHome;
  window.spGoBack=function(){
    const isTask=taskHash()||!!(window.state&&(TASK_PHASES.has(state.phase)||state.currentTask));
    if(isTask){closeTaskForOverview();showTaskOverview();return}
    if(overviewHash()||(window.state&&state.phase==='taskOverview')){if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();return}
    if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();
  };
  const oldRoute=window.routeVerbenHash;
  window.routeVerbenHash=function(){
    if(overviewHash()){showTaskOverview();return}
    if(typeof oldRoute==='function')return oldRoute.apply(this,arguments);
    if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();
  };
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){if(overviewHash())showTaskOverview()},80)},{once:true});
})();