(function(){
  var releaseReady=!window.spVerbReleaseReady;
  if(window.spVerbReleaseReady&&typeof window.spVerbReleaseReady.then==='function'){
    window.spVerbReleaseReady.finally(function(){releaseReady=true;setTimeout(function(){try{if(typeof renderHome==='function')renderHome()}catch(e){}},50)});
  }

  function allVerbNames(){return (window.ALL_VERBS||[]).map(function(x){return x&&x.v}).filter(Boolean)}
  function allowedList(){
    if(!releaseReady&&window.spVerbReleaseReady)return null;
    try{if(typeof window.spStrictReleasedVerbList==='function')return window.spStrictReleasedVerbList().filter(Boolean)}catch(e){}
    return allVerbNames();
  }
  function allowedSet(){var a=allowedList();return a?new Set(a):null}
  function targetCount(){var a=allowedList()||[];var n=typeof PRACTICE_TARGET_COUNT!=='undefined'?PRACTICE_TARGET_COUNT:20;return Math.min(n,a.length)}
  function assessmentOn(){try{return typeof window.spVerbAssessmentEnabled==='function'?window.spVerbAssessmentEnabled()!==false:true}catch(e){return true}}
  function filt(arr,A){return (arr||[]).filter(function(v){return A.has(v)})}
  function uniq(arr){return Array.from(new Set((arr||[]).filter(Boolean)))}

  function strictSync(){
    var A=allowedSet();
    if(!A||typeof state==='undefined')return false;
    try{if(typeof window.spSyncVerbRelease==='function')window.spSyncVerbRelease()}catch(e){}
    var before='';try{before=JSON.stringify(state)}catch(e){}
    ['known','unsure','unknown','active','learned','practicePool','assessmentBatch','assessed','currentPackageVerbs'].forEach(function(k){if(Array.isArray(state[k]))state[k]=filt(state[k],A)});
    Object.keys(state.taskQueues||{}).forEach(function(k){state.taskQueues[k]=(state.taskQueues[k]||[]).filter(function(x){return x&&A.has(x.v)})});
    Object.keys(state.taskDoneSets||{}).forEach(function(k){state.taskDoneSets[k]=(state.taskDoneSets[k]||[]).filter(function(x){return A.has(String(x).split(':')[0])})});
    ['skillDone','skillAttempts','skillSuccess','weak'].forEach(function(k){Object.keys(state[k]||{}).forEach(function(v){if(!A.has(v))delete state[k][v]})});
    if(state.currentVerb&&!A.has(state.currentVerb))state.currentVerb='';
    if(state.currentTask&&state.currentTask.v&&!A.has(state.currentTask.v))state.currentTask=null;
    if(state.exam&&Array.isArray(state.exam.items))state.exam.items=state.exam.items.filter(function(x){return x&&(!x.v||A.has(x.v))});
    try{if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){}
    var after='';try{after=JSON.stringify(state)}catch(e){}
    if(before!==after){try{if(typeof saveState==='function')saveState()}catch(e){}}
    return before!==after;
  }

  function patchCoreLists(){
    if(typeof currentPracticeVerbs==='function'&&!currentPracticeVerbs.__strictReleased){
      var oldPractice=currentPracticeVerbs;
      currentPracticeVerbs=function(){strictSync();var A=allowedSet();var out=oldPractice.apply(this,arguments)||[];return A?out.filter(function(v){return A.has(v)}):out};
      currentPracticeVerbs.__strictReleased=true;
    }
    if(typeof currentPackageAllVerbs==='function'&&!currentPackageAllVerbs.__strictReleased){
      var oldPackage=currentPackageAllVerbs;
      currentPackageAllVerbs=function(){strictSync();var A=allowedSet();var out=oldPackage.apply(this,arguments)||[];return A?uniq(out).filter(function(v){return A.has(v)}):uniq(out)};
      currentPackageAllVerbs.__strictReleased=true;
    }
    if(typeof verbsByStatus==='function'&&!verbsByStatus.__strictReleased){
      verbsByStatus=function(){strictSync();var allowed=allowedList()||[];var A=new Set(allowed);var learned=new Set([].concat(state.learned||[],state.known||[]).filter(function(v){return A.has(v)}));var active=uniq([].concat(state.active||[],state.unsure||[],state.unknown||[])).filter(function(v){return A.has(v)&&!learned.has(v)});var AS=new Set(active);return {active:active,learned:Array.from(learned),new:allowed.filter(function(v){return !learned.has(v)&&!AS.has(v)})}};
      verbsByStatus.__strictReleased=true;
    }
  }

  function loading(){var app=document.getElementById('app');if(app)app.innerHTML='<section class="card"><h2>Verben werden geladen …</h2><p class="small">Die Kursfreigabe wird geprüft.</p></section>'}
  function taskGrid(){return '<section class="card"><div class="grid task-grid">'+taskCard('karteikarte','🃏','flashcards',1)+taskCard('memory','🧠','memory',2)+taskCard('bild_verb','🖼️','quiz',3)+taskCard('verb_bild','🔁','verbToImage',4)+taskCard('schreiben','✍️','writeVerb',5)+taskCard('hoeren_schreiben','👂','hearWrite',6)+taskCard('hoeren_sprechen','🎤','hearSpeak',7)+taskCard('bild_sprechen','🗣️','imageSpeak',8)+taskCard('satz_puzzle','🧩','sentencePuzzle',9)+taskCard('konjugieren','🔤','conjugationTask',10)+examCard()+'</div></section>'}

  function patchOverview(){
    if(typeof renderVerbOverview!=='function'||renderVerbOverview.__strictReleased)return;
    renderVerbOverview=function(){
      if(!releaseReady&&window.spVerbReleaseReady){loading();return window.spVerbReleaseReady.then(function(){releaseReady=true;renderVerbOverview()})}
      strictSync();
      try{if(typeof clearVerbHash==='function')clearVerbHash(true)}catch(e){}
      var app=document.getElementById('app');if(!app)return;
      if(typeof state!=='undefined')state.phase='home';
      var g=typeof verbsByStatus==='function'?verbsByStatus():{active:[],learned:[],new:allowedList()||[]};
      app.classList.remove('card');
      app.innerHTML='<section class="card"><h2>Verben-Übersicht</h2><p class="small">Nur die für deinen Kurs freigegebenen Verben.</p>'+verbOverviewDetails('Aktive Verben · gerade lernen',g.active,true,'Diese Verben sind aktuell offen.')+verbOverviewDetails('Gelernt / ich kann',g.learned,false,'Diese Verben kannst du schon.')+verbOverviewDetails('Noch nicht gelernt',g.new,false,'Diese Verben sind freigegeben, aber noch nicht gelernt.')+'<div class="actions"><button class="btn secondary" onclick="renderHome()">Zur Aufgabenübersicht</button></div></section>';
      try{if(typeof saveState==='function')saveState();if(typeof renderAndHydrate==='function')renderAndHydrate()}catch(e){}
    };
    renderVerbOverview.__strictReleased=true;
  }

  function patchHome(){
    if(typeof renderHome!=='function'||renderHome.__strictReleased)return;
    var oldHome=renderHome;
    renderHome=function(){
      if(!releaseReady&&window.spVerbReleaseReady){loading();return window.spVerbReleaseReady.then(function(){releaseReady=true;renderHome()})}
      strictSync();
      var app=document.getElementById('app');if(app)app.classList.remove('card');
      if(typeof state!=='undefined'){state.phase='home';state.currentTask=null}
      var allowed=allowedList()||[];
      if(!allowed.length){if(app)app.innerHTML='<section class="card"><h2>Keine Verben freigegeben</h2><p class="small">Für deinen Kurs sind aktuell keine Verben A1 freigeschaltet.</p></section>';try{if(typeof saveState==='function')saveState()}catch(e){}return;}
      var target=targetCount();
      var practice=typeof currentPracticeVerbs==='function'?currentPracticeVerbs().length:0;
      var unused=typeof unusedVerbs==='function'?unusedVerbs().length:0;
      if(practice===0&&unused>0&&typeof startAssessment==='function'){return startAssessment(true);}
      if(assessmentOn()&&practice<target&&unused>0&&typeof startAssessment==='function'){return startAssessment();}
      if(((practice>=target&&target>0)||(practice>0&&unused===0))&&typeof taskCard==='function'&&typeof examCard==='function'){
        if(app)app.innerHTML=(typeof statusBox==='function'?statusBox():'')+taskGrid();
        try{if(typeof preloadActiveImages==='function')preloadActiveImages();if(typeof saveState==='function')saveState();if(typeof renderAndHydrate==='function')renderAndHydrate()}catch(e){}
        return;
      }
      if(practice===0&&unused===0){if(app)app.innerHTML='<section class="card"><h2>Keine aktiven Übungsverben</h2><p class="small">Alle freigegebenen Verben sind bereits eingeschätzt. Der TN hat keine Verben als unsicher oder „kann ich nicht“ markiert.</p></section>';try{if(typeof saveState==='function')saveState()}catch(e){}return;}
      return oldHome.apply(this,arguments);
    };
    renderHome.__strictReleased=true;
  }

  function patchAssessmentStart(){
    if(typeof startAssessment==='function'&&!startAssessment.__strictReleased){
      var oldStart=startAssessment;
      startAssessment=function(force){
        if(!releaseReady&&window.spVerbReleaseReady){loading();return window.spVerbReleaseReady.then(function(){releaseReady=true;startAssessment(force)})}
        strictSync();
        if(!(allowedList()||[]).length){return renderHome()}
        return oldStart.call(this,force===true);
      };
      startAssessment.__strictReleased=true;
    }
  }

  function autoStartWhenEmpty(){
    try{
      if(!releaseReady)return;
      if(typeof state==='undefined'||state.phase!=='home')return;
      if(typeof currentPracticeVerbs!=='function'||typeof unusedVerbs!=='function'||typeof startAssessment!=='function')return;
      strictSync();
      if(currentPracticeVerbs().length===0&&unusedVerbs().length>0)startAssessment(true);
    }catch(e){}
  }

  function patchAll(){patchCoreLists();patchAssessmentStart();patchHome();patchOverview();strictSync();setTimeout(autoStartWhenEmpty,80)}
  patchAll();
  document.addEventListener('DOMContentLoaded',patchAll);
  window.addEventListener('SP_PROFILE_SYNCED',patchAll);
  setTimeout(patchAll,100);setTimeout(patchAll,500);setTimeout(patchAll,1500);
})();
