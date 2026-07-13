(function(){
  if(window.__SP_L3T1_STABILITY_V3)return;
  window.__SP_L3T1_STABILITY_V3=true;

  function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
  function writeJson(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}
  function getTasks(){try{return typeof TASKS!=='undefined'&&Array.isArray(TASKS)?TASKS:[]}catch(e){return[]}}
  function run(){
    try{
      if(typeof activeWords!=='function'||typeof load!=='function'||typeof save!=='function')return false;
      const words=activeWords();
      if(!Array.isArray(words)||!words.length)return false;
      const wordIds=words.map(w=>w&&w.id).filter(Boolean);
      const ids=new Set(wordIds);
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
        const oldStandard=readJson('SP_TASK_STATE_'+file,{});
        const oldStandardComplete=oldStandard&&oldStandard.completed===true&&Number(oldStandard.total||0)===total;
        if(task.done.length===0&&oldStandardComplete)task.done=wordIds.slice();
        state.tasks[file]=task;
        const complete=task.done.length>=total;
        if(!complete){delete state.doneTasks[file];allVocabDone=false}
        else state.doneTasks[file]=true;
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