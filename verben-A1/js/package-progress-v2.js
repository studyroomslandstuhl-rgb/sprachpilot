(function(){
  if(window.__SP_VERB_PACKAGE_PROGRESS_V2)return;
  window.__SP_VERB_PACKAGE_PROGRESS_V2=true;

  function uniq(list){return [...new Set((list||[]).filter(Boolean))]}
  function skills(){try{return typeof VERB_SKILLS!=='undefined'&&Array.isArray(VERB_SKILLS)?VERB_SKILLS:[]}catch(e){return[]}}
  function activeVerbs(){try{return typeof currentPracticeVerbs==='function'?uniq(currentPracticeVerbs()).slice(0,20):[]}catch(e){return[]}}
  function skillName(skill){try{return typeof skillKey==='function'?skillKey(skill):skill}catch(e){return skill}}
  function doneKey(skill){try{return typeof taskDoneSetKey==='function'?taskDoneSetKey(skill):'done_'+skillName(skill)}catch(e){return'done_'+skillName(skill)}}
  function doneVerbs(skill,active){
    const set=new Set(active||activeVerbs());
    const raw=state&&state.taskDoneSets&&state.taskDoneSets[doneKey(skill)];
    const list=Array.isArray(raw)?raw:Object.values(raw||{});
    return uniq(list.map(x=>String(x||'').split(':')[0]).filter(v=>set.has(v)));
  }
  function legacyDone(skill,verb){
    try{
      const data=state&&state.skillDone&&state.skillDone[verb];
      if(!data)return false;
      return data[skillName(skill)]===true||data[skill]===true;
    }catch(e){return false}
  }
  function migrateLegacyProgress(){
    try{
      if(typeof state==='undefined'||!state||!skills().length)return false;
      const active=activeVerbs();
      state.taskDoneSets=state.taskDoneSets&&typeof state.taskDoneSets==='object'&&!Array.isArray(state.taskDoneSets)?state.taskDoneSets:{};
      let changed=false;
      skills().forEach(skill=>{
        const key=doneKey(skill);
        const completed=new Set(doneVerbs(skill,active));
        active.forEach(v=>{if(legacyDone(skill,v))completed.add(v)});
        const next=[...completed].map((v,i)=>v+':'+i);
        const old=Array.isArray(state.taskDoneSets[key])?state.taskDoneSets[key]:Object.values(state.taskDoneSets[key]||{});
        if(JSON.stringify(old)!==JSON.stringify(next)){state.taskDoneSets[key]=next;changed=true}
      });
      state.exam=state.exam&&typeof state.exam==='object'?state.exam:{};
      if(Number(state.exam.score||0)>=100&&!state.exam.passed){state.exam.passed=true;state.exam.score=100;state.exam.stars=Math.max(3,Number(state.exam.stars||0));changed=true}
      if(state.packageProgressVersion!==2){state.packageProgressVersion=2;changed=true}
      if(changed&&typeof saveState==='function')saveState();
      return changed;
    }catch(e){console.warn('Verben-Fortschrittsmigration fehlgeschlagen',e);return false}
  }
  function canonicalVerbPercent(verb){
    const list=skills();
    if(!list.length)return 0;
    const done=list.filter(skill=>doneVerbs(skill,[verb]).includes(verb)).length;
    return Math.round(done*100/list.length);
  }
  function canonicalOverall(){
    migrateLegacyProgress();
    const list=skills(),active=activeVerbs();
    const total=list.length*active.length;
    if(!total)return 0;
    let done=0;
    list.forEach(skill=>{done+=doneVerbs(skill,active).length});
    return Math.max(0,Math.min(100,Math.round(done*100/total)));
  }
  function canonicalTasksDone(){
    migrateLegacyProgress();
    const list=skills(),active=activeVerbs();
    return active.length>0&&list.length>0&&list.every(skill=>doneVerbs(skill,active).length===active.length);
  }
  function canonicalExamPassed(){
    try{return !!(state&&state.exam&&Number(state.exam.score||0)>=100)}catch(e){return false}
  }
  function remainingReleasedVerbs(){
    try{
      const released=typeof window.spReleasedVerbList==='function'?window.spReleasedVerbList():(typeof releasedVerbList==='function'?releasedVerbList():[]);
      const mastered=typeof spMasteredVerbSet==='function'?spMasteredVerbSet():new Set([...(state.known||[]),...(state.learned||[])]);
      const active=new Set(activeVerbs());
      return uniq(released).filter(v=>!mastered.has(v)&&!active.has(v));
    }catch(e){return[]}
  }
  function startPackageWithoutAssessment(){
    try{
      if(typeof window.spVerbAssessmentEnabled!=='function'||window.spVerbAssessmentEnabled()!==false)return false;
      if(activeVerbs().length){if(typeof goTaskOverview==='function')goTaskOverview();return true}
      const next=remainingReleasedVerbs().slice(0,20);
      if(!next.length){if(typeof renderAllVerbsCompletedPage==='function')renderAllVerbsCompletedPage();return true}
      state.active=next.slice();state.unknown=next.slice();state.unsure=[];state.currentPackageVerbs=next.slice();state.assessmentBatch=next.slice();state.practicePool=next.slice();state.assessed=uniq([...(state.assessed||[]),...next]);state.phase='taskOverview';
      if(typeof resetPackageTasks==='function')resetPackageTasks();
      state.active=next.slice();state.unknown=next.slice();state.currentPackageVerbs=next.slice();state.assessmentBatch=next.slice();state.practicePool=next.slice();state.phase='taskOverview';
      if(typeof saveState==='function')saveState();
      if(typeof spSyncDashboardSummary==='function')spSyncDashboardSummary();
      if(typeof goTaskOverview==='function')goTaskOverview();
      return true;
    }catch(e){console.warn('Verben-Paket ohne Einschätzung konnte nicht gestartet werden',e);return false}
  }
  function wrapRenderer(name){
    const old=window[name];
    if(typeof old!=='function'||old.__spPackageV2)return;
    const wrapped=function(){migrateLegacyProgress();return old.apply(this,arguments)};
    wrapped.__spPackageV2=true;
    window[name]=wrapped;
  }
  function wrapAssessment(){
    const old=window.handleAssessmentClick;
    if(typeof old!=='function'||old.__spPackageV2)return;
    const wrapped=function(){if(startPackageWithoutAssessment())return;return old.apply(this,arguments)};
    wrapped.__spPackageV2=true;
    window.handleAssessmentClick=wrapped;
  }
  function install(){
    window.spMigrateVerbPackageProgress=migrateLegacyProgress;
    window.verbPercent=canonicalVerbPercent;
    window.overall=canonicalOverall;
    window.allPracticeTasksDone=canonicalTasksDone;
    window.packageExamPassed=canonicalExamPassed;
    window.spStartVerbPackageWithoutAssessment=startPackageWithoutAssessment;
    wrapRenderer('renderTaskOverview');
    wrapRenderer('renderVerbIndexPage');
    wrapRenderer('renderVerbOverview');
    wrapAssessment();
    migrateLegacyProgress();
  }

  install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else setTimeout(install,0);
  setTimeout(install,300);
  setTimeout(install,1200);
})();