(function(){
  const BASE='/verben-A1/';
  const TASK_PHASES=new Set(['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren','pruefung']);
  const HASH_TO_TASK={
    'karteikarte':'karteikarte','memory':'memory','bild-verb':'bild_verb','bild_verb':'bild_verb','verb-bild':'verb_bild','verb_bild':'verb_bild','schreiben':'schreiben',
    'hoeren-schreiben':'hoeren_schreiben','hoeren_schreiben':'hoeren_schreiben','hoeren-sprechen':'hoeren_sprechen','hoeren_sprechen':'hoeren_sprechen',
    'bild-sprechen':'bild_sprechen','bild_sprechen':'bild_sprechen','satz-puzzle':'satz_puzzle','satz_puzzle':'satz_puzzle','konjugieren':'konjugieren','pruefung':'pruefung'
  };
  const TASK_TO_URL={karteikarte:'karteikarte',memory:'memory',bild_verb:'bild-verb',verb_bild:'verb-bild',schreiben:'schreiben',hoeren_schreiben:'hoeren-schreiben',hoeren_sprechen:'hoeren-sprechen',bild_sprechen:'bild-sprechen',satz_puzzle:'satz-puzzle',konjugieren:'konjugieren',pruefung:'pruefung'};
  function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
  function qs(){return new URLSearchParams(location.search||'')}
  function hashValue(){return String(location.hash||'').replace(/^#/,'')}
  function viewParam(){return qs().get('view')||''}
  function taskParam(){const t=qs().get('task')||'';return HASH_TO_TASK[t]||t}
  function legacyView(){const h=hashValue();if(['aufgaben','taskOverview','task-overview','tasks'].includes(h))return 'aufgaben';if(h==='overview')return 'overview';if(h==='chooser')return 'chooser';if(h==='assessment')return 'assessment';return ''}
  function legacyTask(){return HASH_TO_TASK[hashValue()]||''}
  function routeUrl(view){return BASE+(view?'?view='+encodeURIComponent(view):'')}
  function taskUrl(task){return BASE+'?task='+encodeURIComponent(TASK_TO_URL[task]||task)}
  function setCleanUrl(view,task,replace){
    const next=task?taskUrl(task):routeUrl(view);
    const now=location.pathname+location.search+location.hash;
    if(now===next)return;
    try{(replace?history.replaceState:history.pushState).call(history,null,'',next)}catch(e){location.href=next}
  }
  function stateArr(k){try{return Array.isArray(state&&state[k])?state[k]:[]}catch(e){return[]}}
  function activeVerbs(){
    let out=[];
    try{if(typeof currentPracticeVerbs==='function')out.push(...currentPracticeVerbs())}catch(e){}
    out.push(...stateArr('active'),...stateArr('unsure'),...stateArr('unknown'),...stateArr('currentPackageVerbs'),...stateArr('assessmentBatch'));
    try{if(typeof state!=='undefined'&&state.currentVerb)out.push(state.currentVerb)}catch(e){}
    try{if(typeof state!=='undefined'&&state.currentTask&&state.currentTask.v)out.push(state.currentTask.v)}catch(e){}
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
    try{state.phase='taskOverview';state.currentGame='';state.currentVerb='';state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;saveQuiet()}catch(e){}
  }
  function simplifyHeader(root){
    const r=root||document;
    try{
      r.querySelectorAll('header .nav .sp-nav-link, header .nav .danger-btn').forEach(el=>el.remove());
      r.querySelectorAll('header .nav a, header .nav button').forEach(el=>{
        const t=String(el.textContent||'').trim();
        if(t&&t!=='← Zurück'&&t!=='Zurück')el.remove();
      });
    }catch(e){}
  }
  function normalizeStaticLinks(root){
    const r=root||document;
    try{
      r.querySelectorAll('a[href="#aufgaben"],a[href="/verben-A1/?view=aufgaben"]').forEach(a=>a.href=routeUrl('aufgaben'));
      r.querySelectorAll('a[href="/verben-A1/"],a[href="/verben-A1"]').forEach(a=>a.href=BASE);
      r.querySelectorAll('a[href^="#"]').forEach(a=>{const h=(a.getAttribute('href')||'').replace(/^#/,'');const task=HASH_TO_TASK[h];if(task)a.href=taskUrl(task)});
    }catch(e){}
    simplifyHeader(r);
  }
  function renderIndex(){if(typeof renderVerbIndexPage==='function'){renderVerbIndexPage();normalizeStaticLinks(document)}}
  function showTaskOverview(replace){
    ensurePracticeState();
    setCleanUrl('aufgaben',null,replace);
    if(hasPracticeVerbs()&&typeof renderTaskOverview==='function'){renderTaskOverview();normalizeStaticLinks(document);return}
    renderIndex();
  }
  function goIndex(replace){setCleanUrl('',null,replace);renderIndex()}
  function goChooser(replace){setCleanUrl('chooser',null,replace);if(typeof renderVerbChooser==='function'){renderVerbChooser();normalizeStaticLinks(document)}else renderIndex()}
  function goAssessment(replace){setCleanUrl('assessment',null,replace);try{if(typeof startAssessment==='function'){startAssessment(true);normalizeStaticLinks(document);return}}catch(e){}renderIndex()}
  function goOverview(replace){setCleanUrl('overview',null,replace);if(typeof renderVerbOverview==='function'){renderVerbOverview();normalizeStaticLinks(document)}else renderIndex()}
  function goTask(task,replace){
    if(!task)return showTaskOverview(replace);
    setCleanUrl(null,task,replace);
    if(!hasPracticeVerbs()){renderIndex();return}
    if(task==='pruefung'){
      try{if(typeof allPracticeTasksDone==='function'&&allPracticeTasksDone()&&typeof startVerbExam==='function'){startVerbExam();normalizeStaticLinks(document);return}}catch(e){}
      showTaskOverview(true);return;
    }
    if(typeof openVerbTask==='function'){openVerbTask(task);normalizeStaticLinks(document);return}
    showTaskOverview(true);
  }
  window.goTaskOverview=function(){showTaskOverview(false)};
  window.startPractice=function(){try{if(typeof spEnsureState==='function')spEnsureState()}catch(e){}if(hasPracticeVerbs()){showTaskOverview(false);return}goIndex(false)};
  window.closeVerbTaskAndRenderHome=function(){closeTaskForOverview();showTaskOverview(false)};
  window.goVerbHome=window.closeVerbTaskAndRenderHome;
  window.spGoBack=function(){
    const task=taskParam()||legacyTask();
    const isTask=!!task||!!(typeof state!=='undefined'&&(TASK_PHASES.has(state.phase)||state.currentTask||state.currentVerb));
    if(isTask){closeTaskForOverview();showTaskOverview(false);return}
    const view=viewParam()||legacyView();
    if(view==='aufgaben'||(typeof state!=='undefined'&&state.phase==='taskOverview')){goIndex(false);return}
    goIndex(false);
  };
  window.handleAssessmentClick=function(){goAssessment(false)};
  const originalRenderHeader=window.renderHeader;
  if(typeof originalRenderHeader==='function')window.renderHeader=function(){originalRenderHeader.apply(this,arguments);simplifyHeader(document)};
  const originalRenderHome=window.renderHome;
  window.renderHome=function(){goIndex(true)};
  window.renderSafeHomeFallback=function(error){try{localStorage.setItem('SP_VERBS_LAST_BOOT_ERROR',String(error&&error.stack||error||'unknown'))}catch(e){}goIndex(true)};
  const oldRoute=window.routeVerbenHash;
  window.routeVerbenHash=function(){
    const task=taskParam()||legacyTask();
    const view=viewParam()||legacyView();
    if(task){goTask(task,true);return}
    if(view==='aufgaben'){showTaskOverview(true);return}
    if(view==='chooser'){goChooser(true);return}
    if(view==='assessment'){goAssessment(true);return}
    if(view==='overview'){goOverview(true);return}
    if(location.hash){goIndex(true);return}
    goIndex(true);
  };
  document.addEventListener('click',function(e){
    const el=e.target&&e.target.closest?e.target.closest('a,button'):null;if(!el)return;
    const text=String(el.textContent||'').replace(/\s+/g,' ').trim();
    if(el.classList&&el.classList.contains('sp-nav-back')){e.preventDefault();e.stopPropagation();window.spGoBack();return}
    if(el.matches&&el.matches('a[href]')){
      const href=el.getAttribute('href')||'';
      const u=new URL(el.href,location.origin);
      if(href==='#aufgaben'||(u.pathname===BASE&&u.searchParams.get('view')==='aufgaben')){e.preventDefault();e.stopPropagation();showTaskOverview(false);return}
      if(u.pathname===BASE&&u.searchParams.get('task')){e.preventDefault();e.stopPropagation();goTask(HASH_TO_TASK[u.searchParams.get('task')]||u.searchParams.get('task'),false);return}
      if((href===BASE||href==='/verben-A1'||href==='/verben-A1/')&&u.pathname===BASE&&!u.search){e.preventDefault();e.stopPropagation();goIndex(false);return}
    }
    if(text==='Aufgabenübersicht'||text==='Üben'||text==='Starten'){const card=el.closest&&el.closest('.verb-practice-card');if(text!=='Starten'||card){e.preventDefault();e.stopPropagation();showTaskOverview(false);return}}
    if(text==='Einschätzen'||text==='Verben einschätzen'){e.preventDefault();e.stopPropagation();goAssessment(false);return}
    if(text==='Wählen'||text==='Verben wählen'){e.preventDefault();e.stopPropagation();goChooser(false);return}
    if(text==='Übersicht'){e.preventDefault();e.stopPropagation();goOverview(false);return}
  },true);
  window.addEventListener('popstate',function(){if(typeof window.routeVerbenHash==='function')window.routeVerbenHash()});
  document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){simplifyHeader(document);normalizeStaticLinks(document);if(viewParam()==='aufgaben'||legacyView()==='aufgaben')showTaskOverview(true)},80)},{once:true});
  try{new MutationObserver(function(){simplifyHeader(document)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();