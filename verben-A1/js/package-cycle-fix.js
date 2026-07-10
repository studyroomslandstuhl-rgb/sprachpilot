(function(){
  function safeCall(fn){try{return typeof fn==='function'?fn():null}catch(e){return null}}
  function defaultExam(){return {passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false}}
  function activePackageVerbs(){try{return typeof currentPracticeVerbs==='function'?currentPracticeVerbs().slice(0,20):[]}catch(e){return[]}}
  function releasedCount(){try{return typeof releasedVerbList==='function'?(releasedVerbList()||[]).length:0}catch(e){return 0}}
  function masteredCount(){try{const released=typeof releasedVerbList==='function'?(releasedVerbList()||[]):[];const mastered=typeof spMasteredVerbSet==='function'?spMasteredVerbSet():new Set();return released.filter(v=>mastered.has(v)).length}catch(e){return 0}}
  function remainingAfterCurrent(){try{return typeof remainingUnlearnedVerbs==='function'?(remainingUnlearnedVerbs()||[]):[]}catch(e){return[]}}
  function isPackagePassed(){try{return typeof packageExamPassed==='function'&&packageExamPassed()&&typeof allPracticeTasksDone==='function'&&allPracticeTasksDone()&&activePackageVerbs().length>0}catch(e){return false}}
  function completeCurrentPackage(){
    const verbs=activePackageVerbs();
    if(!verbs.length)return 0;
    try{
      state.learned=spUniq([...(state.learned||[]),...verbs]);
      state.known=spUniq([...(state.known||[]),...verbs]);
      state.archivedPackages=state.archivedPackages||[];
      state.archivedPackages.push({type:'completed-package',date:new Date().toISOString(),verbs:verbs.slice(),count:verbs.length});
      state.unsure=spUniq(state.unsure||[]).filter(v=>!verbs.includes(v));
      state.unknown=spUniq(state.unknown||[]).filter(v=>!verbs.includes(v));
      state.active=[];
      state.practicePool=[];
      state.currentPackageVerbs=[];
      state.assessmentBatch=[];
      state.assessed=[];
      state.currentGame='';
      state.currentVerb='';
      state.currentTask=null;
      state.memoryCards=[];
      state.memoryDone=[];
      state.openCards=[];
      state.first=null;
      state.lock=false;
      if(typeof resetPackageTasks==='function')resetPackageTasks();
      else{state.taskQueues={};state.taskDoneSets={};state.exam=defaultExam()}
      state.exam=defaultExam();
      state.phase='packageComplete';
      if(typeof saveState==='function')saveState();
      if(typeof spSyncDashboardSummary==='function')spSyncDashboardSummary();
      try{if(typeof window.flushVerbProgress==='function')window.flushVerbProgress()}catch(e){}
    }catch(e){try{console.error('Verben Paketabschluss fehlgeschlagen',e)}catch(x){}}
    return verbs.length;
  }
  function renderPackageChoicePage(completedCount){
    const app=document.getElementById('app');if(!app)return;
    const total=releasedCount(),learned=masteredCount(),remaining=remainingAfterCurrent();
    app.classList.remove('card');
    if(!remaining.length){
      app.innerHTML=`<section class="card completion-card"><div class="finish-icon">✓</div><p class="eyebrow">Verben A1</p><h2>Du hast alle freigegebenen Verben gelernt.</h2><p class="small">${learned}/${total} Verben sind gelernt. Komm später zurück, wenn neue Verben freigegeben werden.</p><div class="actions finish-actions"><button class="btn secondary" onclick="goOverviewView()">Übersicht</button><button class="btn secondary" onclick="goVerbIndex()">Zur Verben-Seite</button></div></section>`;
      return;
    }
    app.innerHTML=`<section class="card completion-card"><div class="finish-icon">✓</div><p class="eyebrow">Paket abgeschlossen</p><h2>${completedCount||20} Verben gelernt.</h2><p class="small">Du kannst jetzt neue Verben einschätzen oder selbst 1 bis 20 Verben auswählen.</p><p class="small verb-index-summary"><span>${total} freigegebene Verben</span><span>${learned} gelernt</span><strong>${remaining.length} noch offen</strong></p><div class="grid verb-start-grid"><a class="module task-card verb-action-card" href="/verben-A1/?view=assessment"><div class="verb-action-visual"><span class="verb-action-symbol">?</span></div><div class="num">Neue Verben einschätzen</div><p>Neue Wörter prüfen: ich kann / unsicher / ich kann nicht.</p><div class="start">Starten</div></a><a class="module task-card verb-action-card" href="/verben-A1/?view=chooser"><div class="verb-action-visual"><span class="verb-action-symbol">✓</span></div><div class="num">Verben auswählen</div><p>Freigegebene, noch nicht gelernte Verben selbst auswählen.</p><div class="start">Auswählen</div></a></div><div class="actions finish-actions"><button class="btn secondary" onclick="goOverviewView()">Übersicht</button></div></section>`;
  }
  window.spCompleteCurrentPackageAndShowOptions=function(){const count=completeCurrentPackage();renderPackageChoicePage(count);return count};
  const oldRenderTaskOverview=window.renderTaskOverview;
  window.renderTaskOverview=function(){if(isPackagePassed()){window.spCompleteCurrentPackageAndShowOptions();return}return oldRenderTaskOverview.apply(this,arguments)};
  const oldRenderVerbIndexPage=window.renderVerbIndexPage;
  window.renderVerbIndexPage=function(){if(isPackagePassed()){window.spCompleteCurrentPackageAndShowOptions();return}return oldRenderVerbIndexPage.apply(this,arguments)};
  window.renderVerbExamResult=function(){
    const ex=state.exam||{};
    const total=(ex.items||[]).length||1;
    const right=(ex.answers||[]).filter(a=>a.good).length;
    const score=Math.round(right*100/total);
    ex.score=score;ex.stars=score===100?3:score>=70?2:score>=50?1:0;ex.passed=score===100;state.exam=ex;state.phase='home';
    if(typeof saveState==='function')saveState();
    if(score===100){window.spCompleteCurrentPackageAndShowOptions();return}
    const stars='⭐'.repeat(ex.stars)+'☆'.repeat(3-ex.stars);
    const app=document.getElementById('app');
    if(app)app.innerHTML=`<h2>Prüfung beendet</h2><div class="assessment-card"><div class="german-word">${score}%</div><div class="stars">${stars}</div><p>${right}/${total} richtig</p></div><div class='no'>Du brauchst 100%, damit neue Verben freigeschaltet werden.</div><button class='warning' onclick='startVerbExam()'>Prüfung wiederholen</button><button class="secondary" onclick="goTaskOverview()">Zur Aufgabenübersicht</button>`;
  };
})();