(function(){
  if(window.__SP_L3T1_STABILITY_V2)return;
  window.__SP_L3T1_STABILITY_V2=true;

  function writeJson(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}
  function getTasks(){try{return typeof TASKS!=='undefined'&&Array.isArray(TASKS)?TASKS:[]}catch(e){return[]}}
  function run(){
    try{
      if(typeof activeWords!=='function'||typeof load!=='function'||typeof save!=='function')return false;
      const words=activeWords();
      if(!Array.isArray(words)||!words.length)return false;
      const ids=new Set(words.map(w=>w&&w.id).filter(Boolean));
      const total=words.length;
      const state=load()||{};
      state.tasks=state.tasks&&typeof state.tasks==='object'?state.tasks:{};
      state.doneTasks=state.doneTasks&&typeof state.doneTasks==='object'?state.doneTasks:{};
      const vocabFiles=getTasks().filter(t=>t&&t.type==='vocab'&&t.file).map(t=>t.file);
      let allVocabDone=vocabFiles.length>0;

      vocabFiles.forEach(file=>{
        const task=state.tasks[file]&&typeof state.tasks[file]==='object'?state.tasks[file]:{done:[],bad:[]};
        task.done=[...new Set((Array.isArray(task.done)?task.done:[]).filter(id=>ids.has(id)))];
        task.bad=[...new Set((Array.isArray(task.bad)?task.bad:[]).filter(id=>ids.has(id)&&!task.done.includes(id)))];
        state.tasks[file]=task;
        const complete=task.done.length>=total;
        if(!complete){delete state.doneTasks[file];allVocabDone=false}
        writeJson('SP_TASK_STATE_'+file,{
          total,
          queue:[],
          done:task.done.slice(),
          current:null,
          tries:0,
          completed:complete,
          percent:total?Math.round(task.done.length/total*100):0
        });
      });

      if(!allVocabDone){
        delete state.doneTasks['pruefung.html'];
        localStorage.removeItem('SP_EXAM_UNLOCKED_L3_T1');
        localStorage.removeItem('SP_TASK_STATE_pruefung.html');
      }
      save(state);
      window.singularWords=function(){return activeWords()};
      return true;
    }catch(e){console.warn('L3T1 Stabilisierung fehlgeschlagen',e);return false}
  }

  if(!run()){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
    else setTimeout(run,0);
  }
})();