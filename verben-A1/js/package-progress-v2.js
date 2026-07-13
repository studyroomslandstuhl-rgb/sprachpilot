(function(){
  if(window.__SP_VERB_PACKAGE_PROGRESS_V2)return;
  window.__SP_VERB_PACKAGE_PROGRESS_V2=true;

  function uniq(list){return [...new Set((list||[]).filter(Boolean))]}
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
      if(typeof state==='undefined'||!state||!Array.isArray(window.VERB_SKILLS)&&typeof VERB_SKILLS==='undefined')return false;
      const skills=typeof VERB_SKILLS!=='undefined'?VERB_SKILLS:window.VERB_SKILLS;
      const active=activeVerbs();
      state.taskDoneSets=state.taskDoneSets&&typeof state.taskDoneSets==='object'&&!Array.isArray(state.taskDoneSets)?state.taskDoneSets:{};
      let changed=false;
      skills.forEach(skill=>{
        const key=doneKey(skill);
        const existing=doneVerbs(skill,active);
        const completed=new Set(existing);
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
    const skills=typeof VERB_SKILLS!=='undefined'?VERB_SKILLS:[];
    if(!skills.length)return 0;
    const done=skills.filter(skill=>doneVerbs(skill,[verb]).includes(verb)).length;
    return Math.round(done*100/skills.length);
  }
  function canonicalOverall(){
    migrateLegacyProgress();
    const skills=typeof VERB_SKILLS!=='undefined'?VERB_SKILLS:[];
    const active=activeVerbs();
    const total=skills.length*active.length;
    if(!total)return 0;
    let done=0;
    skills.forEach(skill=>{done+=doneVerbs(skill,active).length});
    return Math.max(0,Math.min(100,Math.round(done*100/total)));
  }
  function canonicalTasksDone(){
    migrateLegacyProgress();
    const skills=typeof VERB_SKILLS!=='undefined'?VERB_SKILLS:[];
    const active=activeVerbs();
    return active.length>0&&skills.length>0&&skills.every(skill=>doneVerbs(skill,active).length===active.length);
  }
  function canonicalExamPassed(){
    try{return !!(state&&state.exam&&(state.exam.passed===true||Number(state.exam.score||0)>=100)&&Number(state.exam.score||100)>=100)}catch(e){return false}
  }
  function wrapRenderer(name){
    const old=window[name];
    if(typeof old!=='function'||old.__spPackageV2)return;
    const wrapped=function(){migrateLegacyProgress();return old.apply(this,arguments)};
    wrapped.__spPackageV2=true;
    window[name]=wrapped;
  }
  function install(){
    window.spMigrateVerbPackageProgress=migrateLegacyProgress;
    window.verbPercent=canonicalVerbPercent;
    window.overall=canonicalOverall;
    window.allPracticeTasksDone=canonicalTasksDone;
    window.packageExamPassed=canonicalExamPassed;
    wrapRenderer('renderTaskOverview');
    wrapRenderer('renderVerbIndexPage');
    wrapRenderer('renderVerbOverview');
    migrateLegacyProgress();
  }

  install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else setTimeout(install,0);
  setTimeout(install,300);
  setTimeout(install,1200);
})();