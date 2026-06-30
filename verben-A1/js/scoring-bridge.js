(function(){
  function run(){try{return window.SprachPilotScoring&&SprachPilotScoring.currentRun?SprachPilotScoring.currentRun('verben-a1'):1}catch(e){return 1}}
  function markTask(skill){
    try{
      if(!skill||!window.taskDone||!taskDone(skill))return;
      const key='SP_VERBEN_A1_REWARD_'+skill+'_RUN_'+run();
      if(localStorage.getItem(key)==='1')return;
      localStorage.setItem(key,'1');
      if(window.SprachPilotScoring&&SprachPilotScoring.awardTask){
        SprachPilotScoring.awardTask(skill+'.html',{info:{moduleKey:'verben',scope:'verben-a1',title:'Verben A1',lesson:'',theme:''},title:(window.VERB_SKILL_LABELS&&VERB_SKILL_LABELS[skill])||skill});
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
        try{const ex=window.state&&state.exam?state.exam:{};const percent=Number(ex.score||0);if(window.SprachPilotScoring&&SprachPilotScoring.awardExam)SprachPilotScoring.awardExam({percent,score:percent},{info:{moduleKey:'verben',scope:'verben-a1',title:'Verben A1',lesson:'',theme:''}})}catch(e){console.warn('Verben Prüfung Punkte Fehler',e)}
        return out;
      };
      window.renderVerbExamResult.__spScoring=true;
    }
  }
  function patchReset(){
    if(typeof window.resetCurrentPackage==='function'&&!window.resetCurrentPackage.__spScoring){
      const old=window.resetCurrentPackage;
      window.resetCurrentPackage=function(){
        if(window.SprachPilotScoring&&SprachPilotScoring.resetScope){
          SprachPilotScoring.resetScope({moduleKey:'verben',scope:'verben-a1',title:'Verben A1',lesson:'',theme:''}).finally(()=>old.apply(this,arguments));
          return;
        }
        return old.apply(this,arguments);
      };
      window.resetCurrentPackage.__spScoring=true;
    }
  }
  function patchAll(){patchFinish();patchExam();patchReset()}
  patchAll();document.addEventListener('DOMContentLoaded',patchAll);setTimeout(patchAll,250);setTimeout(patchAll,1000);
})();
