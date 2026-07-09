(function(){
  const TASK_PHASES=new Set(['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren','pruefung']);
  const TASK_HASHES=new Set(['karteikarte','memory','bild-verb','bild_verb','verb-bild','verb_bild','schreiben','hoeren-schreiben','hoeren_schreiben','hoeren-sprechen','hoeren_sprechen','bild-sprechen','bild_sprechen','satz-puzzle','satz_puzzle','konjugieren','pruefung']);
  function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
  function hashValue(){return String(location.hash||'').replace(/^#/,'')}
  function overviewHash(){return ['aufgaben','taskOverview','task-overview','tasks'].includes(hashValue())}
  function taskHash(){return TASK_HASHES.has(hashValue())}
  function stateArr(k){try{return Array.isArray(window.state&&state[k])?state[k]:[]}catch(e){return[]}}
  function activeVerbs(){
    let out=[];
    try{if(typeof currentPracticeVerbs==='function')out.push(...currentPracticeVerbs())}catch(e){}
    out.push(...stateArr('active'),...stateArr('unsure'),...stateArr('unknown'),...stateArr('currentPackageVerbs'),...stateArr('assessmentBatch'));
    try{if(window.state&&state.currentVerb)out.push(state.currentVerb)}catch(e){}
    try{if(window.state&&state.currentTask&&state.currentTask.v)out.push(state.currentTask.v)}catch(e){}
    return uniq(out).slice(0,20);
  }
  function hasPracticeVerbs(){return activeVerbs().length>0}
  function saveQuiet(){try{if(typeof saveState==='function')saveState()}catch(e){}try{if(typeof spSyncDashboardSummary==='function')spSyncDashboardSummary()}catch(e){}}
  function ensurePracticeState(){
    const verbs=activeVerbs();
    if(!verbs.length)return verbs;
    try{
      state.active=verbs.slice();
      state.currentPackageVerbs=verbs.slice();
      state.assessmentBatch=verbs.slice();
      state.unsure=uniq([...(state.unsure||[]),...verbs]).filter(v=>verbs.includes(v));
      if(!Array.isArray(state.practicePool)||!state.practicePool.length)state.practicePool=verbs.slice();
      verbs.forEach(v=>{try{if(typeof ensureSkillState==='function')ensureSkillState(v)}catch(e){}});
      saveQuiet();
    }catch(e){}
    return verbs;
  }
  function closeTaskForOverview(){
    try{if(typeof returnCurrentTaskToQueue==='function')returnCurrentTaskToQueue()}catch(e){}
    ensurePracticeState();
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
    ensurePracticeState();
    if(location.hash!=='#aufgaben')history.replaceState(null,'','#aufgaben');
    if(hasPracticeVerbs()&&typeof renderTaskOverview==='function'){renderTaskOverview();return}
    if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();
  }
  window.goTaskOverview=function(){showTaskOverview()};
  window.startPractice=function(){
    try{if(typeof spEnsureState==='function')spEnsureState()}catch(e){}
    if(hasPracticeVerbs()){showTaskOverview();return}
    if(typeof renderVerbIndexPage==='function')renderVerbIndexPage();
  };
  window.closeVerbTaskAndRenderHome=function(){closeTaskForOverview();showTaskOverview()};
  window.goVerbHome=window.closeVerbTaskAndRenderHome;
  window.spGoBack=function(){
    const isTask=taskHash()||!!(window.state&&(TASK_PHASES.has(state.phase)||state.currentTask||state.currentVerb));
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
  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest?e.target.closest('.sp-nav-back'):null;
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    window.spGoBack();
  },true);
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){if(overviewHash())showTaskOverview()},80)},{once:true});
})();