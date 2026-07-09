(function(){
  const TASK_PHASES=new Set(['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren','pruefung']);
  function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
  function arr(k){return Array.isArray(window.state&&state[k])?state[k]:[]}
  function releasedSafe(){
    try{if(typeof releasedVerbList==='function')return releasedVerbList()}catch(e){}
    try{return uniq((window.ALL_VERBS||[]).map(x=>x&&x.v))}catch(e){return[]}
  }
  function masteredSafe(){
    const out=[...arr('known'),...arr('learned')];
    (arr('archivedPackages')).forEach(p=>{if(p&&Array.isArray(p.verbs))out.push(...p.verbs);if(p&&Array.isArray(p.practiced))out.push(...p.practiced)});
    return new Set(uniq(out));
  }
  function activeSafe(){
    const released=new Set(releasedSafe()),mastered=masteredSafe();
    return uniq([...arr('active'),...arr('unsure'),...arr('unknown'),...arr('currentPackageVerbs'),...arr('assessmentBatch')]).filter(v=>(!released.size||released.has(v))&&!mastered.has(v));
  }
  function remainingSafe(){
    const mastered=masteredSafe(),active=new Set(activeSafe());
    return releasedSafe().filter(v=>!mastered.has(v)&&!active.has(v));
  }
  function saveQuiet(){try{if(typeof saveState==='function')saveState()}catch(e){}}
  function clearOpenTaskOnly(){
    try{
      if(typeof returnCurrentTaskToQueue==='function')returnCurrentTaskToQueue();
      state.phase='home';state.currentGame='';state.currentVerb='';state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;
      saveQuiet();
    }catch(e){}
  }
  function clearHash(){try{if(typeof clearVerbHash==='function')clearVerbHash(true);else if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
  function completePage(){
    const app=document.getElementById('app');if(!app)return;
    app.classList.remove('card');
    app.innerHTML='<section class="card completion-card"><div class="finish-icon">✓</div><h2>Du hast alle Verben gelernt.</h2><p class="small">Komm später zurück, um neue Verben zu lernen.</p><div class="actions"><button class="btn secondary" onclick="renderVerbOverview()">Übersicht ansehen</button></div></section>';
  }
  function noReleasePage(){
    const app=document.getElementById('app');if(!app)return;
    app.classList.remove('card');
    app.innerHTML='<section class="card"><h2>Keine freigegebenen Verben gefunden</h2><p class="small">Öffne einmal das Dashboard, damit die Kursfreigabe geladen wird. Danach zurück zu Verben.</p><div class="actions"><a class="btn secondary" href="/student-dashboard/index.html">Zum Dashboard</a></div></section>';
  }
  function startTasksOrFallback(active){
    try{state.active=active.slice();if(!state.practicePool||!state.practicePool.length)state.practicePool=active.slice();saveQuiet()}catch(e){}
    try{if(typeof window.__spOriginalRenderTaskOverview==='function'){window.__spOriginalRenderTaskOverview();return true}}catch(e){console.warn(e)}
    return false;
  }
  function startAssessmentOrFallback(){
    try{if(typeof startAssessment==='function'){startAssessment(true);return true}}catch(e){console.warn(e)}
    const app=document.getElementById('app');if(app){app.classList.remove('card');app.innerHTML='<section class="card"><h2>Neue Verben einschätzen</h2><p class="small">Die Einschätzung konnte nicht automatisch geöffnet werden.</p><div class="actions"><button class="btn green" onclick="startAssessment(true)">Einschätzung starten</button><button class="btn secondary" onclick="renderVerbChooser()">Verben wählen</button></div></section>'}
    return false;
  }
  function routeVerbs(){
    clearHash();
    try{if(typeof normalizeAppVerbState==='function')normalizeAppVerbState()}catch(e){}
    const released=releasedSafe(),active=activeSafe(),remaining=remainingSafe();
    if(active.length){startTasksOrFallback(active);return}
    if(remaining.length){startAssessmentOrFallback();return}
    if(released.length){completePage();return}
    noReleasePage();
  }
  function appShowsBadFallback(){const app=document.getElementById('app');return !!(app&&/Verben konnten nicht/.test(app.textContent||''))}
  function routeIfNeeded(){
    if(appShowsBadFallback()){routeVerbs();return}
    const active=activeSafe(),remaining=remainingSafe(),released=releasedSafe();
    if(active.length||remaining.length||released.length)routeVerbs();
  }
  if(typeof renderTaskOverview==='function'&&!window.__spOriginalRenderTaskOverview)window.__spOriginalRenderTaskOverview=renderTaskOverview;
  if(typeof renderHome==='function'&&!window.__spOriginalRenderHome)window.__spOriginalRenderHome=renderHome;
  window.renderHome=function(){clearOpenTaskOnly();routeVerbs()};
  window.renderSafeHomeFallback=function(error){try{localStorage.setItem('SP_VERBS_LAST_BOOT_ERROR',String(error&&error.stack||error||'unknown'))}catch(e){}routeVerbs()};
  window.renderTaskOverview=function(){const active=activeSafe();if(active.length){startTasksOrFallback(active);return}routeVerbs()};
  window.closeVerbTaskAndRenderHome=function(){clearOpenTaskOnly();routeVerbs()};
  window.spGoBack=function(){
    const fromTask=!!(window.state&&(TASK_PHASES.has(state.phase)||state.currentTask));
    clearOpenTaskOnly();clearHash();
    if(fromTask&&activeSafe().length){startTasksOrFallback(activeSafe());return}
    location.href='/student-dashboard/index.html';
  };
  document.addEventListener('DOMContentLoaded',function(){setTimeout(routeIfNeeded,0);setTimeout(routeIfNeeded,250);setTimeout(routeIfNeeded,900);},{once:true});
  try{new MutationObserver(function(){if(appShowsBadFallback())routeVerbs()}).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true,characterData:true})}catch(e){}
})();