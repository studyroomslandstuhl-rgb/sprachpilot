(function(){
  const INFO={moduleKey:'verben',scope:'verben-a1',title:'Verben A1',lesson:'',theme:''};
  function run(){try{return window.SprachPilotScoring&&SprachPilotScoring.currentRun?SprachPilotScoring.currentRun(INFO.scope):1}catch(e){return 1}}
  function markTask(skill){
    try{
      if(!skill||!window.taskDone||!taskDone(skill))return;
      const key='SP_VERBEN_A1_REWARD_'+skill+'_RUN_'+run();
      if(localStorage.getItem(key)==='1')return;
      if(window.SprachPilotScoring&&SprachPilotScoring.awardTask){
        SprachPilotScoring.awardTask(skill+'.html',{info:INFO,title:(window.VERB_SKILL_LABELS&&VERB_SKILL_LABELS[skill])||skill}).then(delta=>{if(delta>0)localStorage.setItem(key,'1')}).catch(()=>{});
      }
    }catch(e){console.warn('Verben Aufgabe Punkte Fehler',e)}
  }
  function patchFinish(){
    if(typeof window.finishQueuedVerb==='function'&&!window.finishQueuedVerb.__spScoring){
      const old=window.finishQueuedVerb;
      window.finishQueuedVerb=function(skill,v,good){
        const out=old.apply(this,arguments);
        if(good!==false)markTask((typeof skillKey==='function'?skillKey(skill):skill));
        return out;
      };
      window.finishQueuedVerb.__spScoring=true;
    }
  }
  function patchExam(){
    if(typeof window.renderVerbExamResult==='function'&&!window.renderVerbExamResult.__spScoring){
      const old=window.renderVerbExamResult;
      window.renderVerbExamResult=function(){
        const out=old.apply(this,arguments);
        try{const ex=window.state&&state.exam?state.exam:{};const percent=Number(ex.score||0);if(window.SprachPilotScoring&&SprachPilotScoring.awardExam)SprachPilotScoring.awardExam({percent,score:percent},{info:INFO})}catch(e){console.warn('Verben Prüfung Punkte Fehler',e)}
        return out;
      };
      window.renderVerbExamResult.__spScoring=true;
    }
  }
  function patchReset(){
    if(typeof window.resetCurrentPackage==='function'&&!window.resetCurrentPackage.__spScoring){
      window.resetCurrentPackage=function(){
        if(!confirm('Alle Verben wieder auf „nicht eingeschätzt“ setzen? Punkte bleiben erhalten.'))return;
        const finishLocalReset=()=>{
          try{
            if(typeof migrateState==='function')migrateState();
            if(typeof resetAllVerbProgressKeepPoints==='function')resetAllVerbProgressKeepPoints();
            if(typeof saveState==='function')saveState();
            if(typeof renderHome==='function')renderHome();
          }catch(e){console.warn('Verben Reset Fehler',e)}
        };
        if(window.SprachPilotScoring&&SprachPilotScoring.resetScope){
          SprachPilotScoring.resetScope(INFO).finally(finishLocalReset);
        }else{
          finishLocalReset();
        }
      };
      window.resetCurrentPackage.__spScoring=true;
    }
  }
  function patchAll(){patchFinish();patchExam();patchReset()}
  patchAll();document.addEventListener('DOMContentLoaded',patchAll);setTimeout(patchAll,250);setTimeout(patchAll,1000);
})();