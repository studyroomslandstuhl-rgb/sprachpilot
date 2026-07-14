// Verben A1: stabile Aufgaben-Navigation ohne Rücksprung zur Übersicht.
(function(){
  if(window.__SP_VERB_TASK_ROUTE_STABLE)return;
  window.__SP_VERB_TASK_ROUTE_STABLE=true;

  const ALIASES={
    'bild-verb':'bild_verb','verb-bild':'verb_bild',
    'hoeren-schreiben':'hoeren_schreiben','hoeren-sprechen':'hoeren_sprechen',
    'bild-sprechen':'bild_sprechen','satz-puzzle':'satz_puzzle'
  };
  const SLUGS={
    karteikarte:'karteikarte',memory:'memory',bild_verb:'bild-verb',verb_bild:'verb-bild',
    schreiben:'schreiben',hoeren_schreiben:'hoeren-schreiben',hoeren_sprechen:'hoeren-sprechen',
    bild_sprechen:'bild-sprechen',satz_puzzle:'satz-puzzle',konjugieren:'konjugieren',pruefung:'pruefung'
  };
  let opening=false;
  let reopenAttempts=0;

  function params(){try{return new URLSearchParams(location.search||'')}catch(e){return new URLSearchParams()}}
  function taskFromUrl(){const raw=params().get('task')||'';return ALIASES[raw]||raw}
  function validTask(task){try{return task==='pruefung'||(Array.isArray(VERB_SKILLS)&&VERB_SKILLS.includes(task))}catch(e){return false}}
  function taskUrl(task){return '/verben-A1/?task='+encodeURIComponent(SLUGS[task]||String(task||'').replaceAll('_','-'))}
  function setTaskUrl(task,replace){const url=taskUrl(task);try{(replace?history.replaceState:history.pushState).call(history,null,'',url)}catch(e){location.href=url}}
  function app(){return document.getElementById('app')}
  function showError(task,error){
    const root=app();if(!root)return;
    root.classList.add('card');
    root.innerHTML='<h2>Aufgabe konnte nicht geöffnet werden</h2><p class="small">'+safeText(task)+'</p><p class="small">'+safeText(String(error&&error.message||error||'Unbekannter Fehler'))+'</p><div class="actions"><button class="btn secondary" onclick="location.reload()">Neu laden</button><a class="btn secondary" href="/verben-A1/?view=aufgaben">Zur Aufgabenübersicht</a></div>';
    try{localStorage.setItem('SP_VERBS_LAST_TASK_ROUTE_ERROR',task+': '+String(error&&error.stack||error))}catch(e){}
  }
  function ensureActive(){
    try{
      if(typeof spEnsureState==='function')spEnsureState();
      let active=typeof currentPracticeVerbs==='function'?currentPracticeVerbs():[];
      if(active.length)return active;
      const restored=[...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...(state.practicePool||[]),...(state.unsure||[]),...(state.unknown||[])];
      const unique=[...new Set(restored.filter(Boolean))].slice(0,20);
      if(unique.length){
        state.active=unique.slice();
        state.currentPackageVerbs=unique.slice();
        state.assessmentBatch=unique.slice();
        if(!Array.isArray(state.practicePool)||!state.practicePool.length)state.practicePool=unique.slice();
        if(typeof saveState==='function')saveState();
      }
      return unique;
    }catch(e){return []}
  }
  function prepareTask(skill){
    if(!ensureActive().length)return false;
    try{
      if(typeof ensureProgressObjects==='function')ensureProgressObjects();
      state.lastCompletedTaskSkill='';
      if(state.currentTask&&state.currentTask.skill!==skill)state.currentTask=null;
      if(!Array.isArray(state.practicePool)||!state.practicePool.length){
        if(typeof buildPracticePool==='function')buildPracticePool();
        else state.practicePool=ensureActive().slice();
      }
      if(skill!=='memory'&&typeof taskDone==='function'&&!taskDone(skill)){
        const qKey=typeof taskQueueKey==='function'?taskQueueKey(skill):'queue_'+skill;
        const queue=state.taskQueues&&state.taskQueues[qKey];
        if(!state.currentTask&&(!Array.isArray(queue)||!queue.length)){
          state.taskQueues=state.taskQueues||{};
          delete state.taskQueues[qKey];
          if(typeof initTaskQueue==='function')initTaskQueue(skill);
        }
      }
      if(typeof saveState==='function')saveState();
      return true;
    }catch(e){return true}
  }
  function directOpen(task){
    if(task==='pruefung'){
      if(typeof allPracticeTasksDone==='function'&&allPracticeTasksDone()){
        if(typeof startVerbExam==='function')startVerbExam();
      }else{
        const root=app();if(root)root.innerHTML='<section class="card"><h2>Prüfung gesperrt</h2><p class="small">Bearbeite zuerst alle Aufgaben zu 100 %.</p><div class="actions"><a class="btn secondary" href="/verben-A1/?view=aufgaben">Zur Aufgabenübersicht</a></div></section>';
      }
      return;
    }
    if(typeof taskDone==='function'&&taskDone(task)){
      if(typeof renderTaskFinishScreen==='function')renderTaskFinishScreen(task);
      return;
    }
    prepareTask(task);
    if(typeof openVerbTask!=='function')throw new Error('openVerbTask fehlt');
    openVerbTask(task);
  }
  function openTask(task,replace=true){
    if(!validTask(task)||opening)return false;
    opening=true;
    try{
      setTaskUrl(task,replace);
      directOpen(task);
      reopenAttempts=0;
      return true;
    }catch(e){showError(task,e);return false}
    finally{opening=false}
  }
  function reopenCurrentTask(){
    const task=taskFromUrl();
    if(!validTask(task))return false;
    if(reopenAttempts>=2){showError(task,new Error('Die Aufgabe wurde unerwartet geschlossen.'));return true}
    reopenAttempts++;
    setTimeout(()=>openTask(task,true),0);
    return true;
  }

  const originalRoute=window.routeVerbenHash;
  window.routeVerbenHash=function(){
    const task=taskFromUrl();
    if(validTask(task)){openTask(task,true);return}
    if(typeof originalRoute==='function')return originalRoute.apply(this,arguments);
  };

  const originalHome=window.renderHome;
  window.renderHome=function(){
    if(reopenCurrentTask())return;
    if(typeof originalHome==='function')return originalHome.apply(this,arguments);
  };

  const originalOverview=window.renderTaskOverview;
  window.renderTaskOverview=function(){
    const task=taskFromUrl();
    if(validTask(task)){
      if(typeof taskDone==='function'&&task!=='pruefung'&&taskDone(task)&&typeof renderTaskFinishScreen==='function'){renderTaskFinishScreen(task);return}
      if(reopenCurrentTask())return;
    }
    if(typeof originalOverview==='function')return originalOverview.apply(this,arguments);
  };

  document.addEventListener('click',function(e){
    const link=e.target&&e.target.closest?e.target.closest('a[href*="/verben-A1/"][href*="task="]'):null;
    if(!link)return;
    let task='';
    try{const url=new URL(link.getAttribute('href'),location.href);const raw=url.searchParams.get('task')||'';task=ALIASES[raw]||raw}catch(x){}
    if(!validTask(task))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openTask(task,false);
  },true);

  window.addEventListener('popstate',function(){const task=taskFromUrl();if(validTask(task))openTask(task,true)});
  window.spOpenVerbTaskStable=openTask;
})();