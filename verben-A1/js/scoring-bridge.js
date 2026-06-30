(function(){
  const INFO={moduleKey:'verben',scope:'verben-a1',title:'Verben A1',lesson:'',theme:''};
  const SKILLS=['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren'];
  function run(){try{return window.SprachPilotScoring&&SprachPilotScoring.currentRun?SprachPilotScoring.currentRun(INFO.scope):Number(localStorage.getItem('SP_SCORE_RUN_'+INFO.scope)||1)||1}catch(e){return 1}}
  function skillName(skill){try{return typeof skillKey==='function'?skillKey(skill):skill}catch(e){return skill}}
  function rewardKey(skill){return 'SP_VERBEN_A1_REWARD_'+skill+'_RUN_'+run()}
  function pendingKey(){return 'SP_VERBEN_A1_PENDING_REWARDS'}
  function pending(){try{return JSON.parse(localStorage.getItem(pendingKey())||'[]')||[]}catch(e){return []}}
  function savePending(list){try{localStorage.setItem(pendingKey(),JSON.stringify([...new Set((list||[]).filter(Boolean))]))}catch(e){}}
  function queue(skill){const sk=skillName(skill);if(!sk)return;const list=pending();if(!list.includes(sk))list.push(sk);savePending(list)}
  function ready(){return !!(window.SprachPilotScoring&&SprachPilotScoring.awardTask)}
  function taskIsDone(skill){try{return typeof taskDone==='function'&&taskDone(skillName(skill))}catch(e){return false}}
  function markTask(skill){
    const sk=skillName(skill);
    if(!sk)return;
    if(!taskIsDone(sk))return;
    if(localStorage.getItem(rewardKey(sk))==='1')return;
    if(!ready()){queue(sk);return;}
    try{
      SprachPilotScoring.awardTask(sk+'.html',{info:INFO,title:(window.VERB_SKILL_LABELS&&VERB_SKILL_LABELS[sk])||sk}).then(delta=>{
        if(delta>0)localStorage.setItem(rewardKey(sk),'1');
        const list=pending().filter(x=>x!==sk);savePending(list);
        if(delta>0&&typeof renderHome==='function'&&window.state&&state.phase==='home')setTimeout(renderHome,50);
      }).catch(()=>{queue(sk)});
    }catch(e){console.warn('Verben Aufgabe Punkte Fehler',e);queue(sk)}
  }
  function scanDoneTasks(){SKILLS.forEach(markTask);pending().forEach(markTask)}
  function ensureScoringLoaded(){
    if(ready())return;
    try{import('/js/scoring.js?v=4').then(()=>setTimeout(scanDoneTasks,100)).catch(()=>{})}catch(e){}
  }
  function patchFinish(){
    if(typeof window.finishQueuedVerb==='function'&&!window.finishQueuedVerb.__spScoring){
      const old=window.finishQueuedVerb;
      window.finishQueuedVerb=function(skill,v,good){
        const out=old.apply(this,arguments);
        if(good!==false){const sk=skillName(skill);setTimeout(()=>markTask(sk),0);setTimeout(()=>markTask(sk),300);}
        return out;
      };
      window.finishQueuedVerb.__spScoring=true;
    }
  }
  function patchSaveState(){
    if(typeof window.saveState==='function'&&!window.saveState.__spScoringScan){
      const old=window.saveState;
      window.saveState=function(){const out=old.apply(this,arguments);setTimeout(scanDoneTasks,50);return out};
      window.saveState.__spScoringScan=true;
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
        const finishLocalReset=()=>{try{if(typeof migrateState==='function')migrateState();if(typeof resetAllVerbProgressKeepPoints==='function')resetAllVerbProgressKeepPoints();if(typeof saveState==='function')saveState();if(typeof renderHome==='function')renderHome()}catch(e){console.warn('Verben Reset Fehler',e)}};
        if(window.SprachPilotScoring&&SprachPilotScoring.resetScope){SprachPilotScoring.resetScope(INFO).finally(finishLocalReset)}else{finishLocalReset()}
      };
      window.resetCurrentPackage.__spScoring=true;
    }
  }
  function patchAll(){ensureScoringLoaded();patchFinish();patchSaveState();patchExam();patchReset();scanDoneTasks()}
  patchAll();document.addEventListener('DOMContentLoaded',patchAll);setTimeout(patchAll,100);setTimeout(patchAll,500);setTimeout(patchAll,1500);setInterval(()=>{ensureScoringLoaded();scanDoneTasks()},5000);
  window.spVerbScoreScan=scanDoneTasks;
})();