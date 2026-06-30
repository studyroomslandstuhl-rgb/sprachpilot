(function(){
  const INFO={moduleKey:'fragen',scope:'fragen-a1',title:'Fragen A1',lesson:'',theme:''};
  function run(){try{return window.SprachPilotScoring&&SprachPilotScoring.currentRun?SprachPilotScoring.currentRun(INFO.scope):1}catch(e){return 1}}
  function awardExercise(ex){
    try{
      if(!ex||ex==='exam')return;
      const progress=Number((window.exerciseProgress||{})[ex]||0);
      if(progress<100)return;
      const key='SP_FRAGEN_A1_REWARD_'+ex+'_RUN_'+run();
      if(localStorage.getItem(key)==='1')return;
      if(window.SprachPilotScoring&&SprachPilotScoring.awardTask){
        SprachPilotScoring.awardTask(ex+'.html',{info:INFO,title:(window.EXERCISE_NAMES&&EXERCISE_NAMES[ex])||ex}).then(delta=>{if(delta>0)localStorage.setItem(key,'1')}).catch(()=>{});
      }
    }catch(e){console.warn('Fragen Aufgabe Punkte Fehler',e)}
  }
  function scanExercises(){try{(window.EXERCISES||[]).forEach(awardExercise)}catch(e){}}
  function patchUpdateAll(){
    if(typeof window.updateAll==='function'&&!window.updateAll.__spScoring){
      const old=window.updateAll;
      window.updateAll=function(){const out=old.apply(this,arguments);scanExercises();return out};
      window.updateAll.__spScoring=true;
    }
  }
  function patchFinishExam(){
    if(typeof window.finishExam==='function'&&!window.finishExam.__spScoring){
      const old=window.finishExam;
      window.finishExam=function(){
        const before=window.examFinished;
        const out=old.apply(this,arguments);
        try{
          if(!before){
            const attempts=Number(window.examAttempts||0);
            const correct=Number(window.examCorrect||0);
            const percent=attempts?Math.round(correct*100/attempts):0;
            if(window.SprachPilotScoring&&SprachPilotScoring.awardExam){
              SprachPilotScoring.awardExam({percent,score:percent},{info:INFO});
            }
          }
        }catch(e){console.warn('Fragen Prüfung Punkte Fehler',e)}
        return out;
      };
      window.finishExam.__spScoring=true;
    }
  }
  function patchReset(){
    if(typeof window.resetEverything==='function'&&!window.resetEverything.__spScoring){
      window.resetEverything=function(){
        if(!confirm('Möchten Sie wirklich von 0 anfangen?'))return;
        if(!confirm('Sind Sie ganz sicher? Alle lokalen Daten auf diesem Gerät werden gelöscht. Punkte bleiben im Account gespeichert.'))return;
        const finishLocalReset=()=>{
          try{Object.keys(localStorage).forEach(k=>{if(k.startsWith('A1_'))localStorage.removeItem(k)});}catch(e){}
          location.reload();
        };
        if(window.SprachPilotScoring&&SprachPilotScoring.resetScope){
          SprachPilotScoring.resetScope(INFO).finally(finishLocalReset);
        }else{
          finishLocalReset();
        }
      };
      window.resetEverything.__spScoring=true;
    }
  }
  function patchAll(){patchUpdateAll();patchFinishExam();patchReset();scanExercises()}
  patchAll();document.addEventListener('DOMContentLoaded',patchAll);setTimeout(patchAll,250);setTimeout(patchAll,1000);setTimeout(patchAll,2000);
})();