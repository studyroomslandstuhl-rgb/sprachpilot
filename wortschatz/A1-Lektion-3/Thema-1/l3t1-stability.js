(function(){
  if(window.__SP_L3T1_STABILITY_V1)return;
  window.__SP_L3T1_STABILITY_V1=true;

  function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
  function writeJson(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}
  function run(){
    try{
      if(typeof window.activeWords!=='function'||typeof window.load!=='function'||typeof window.save!=='function')return false;
      const words=window.activeWords();
      if(!Array.isArray(words)||!words.length)return false;
      const ids=new Set(words.map(w=>w&&w.id).filter(Boolean));
      const total=words.length;
      const state=window.load()||{};
      state.tasks=state.tasks&&typeof state.tasks==='object'?state.tasks:{};
      state.doneTasks=state.doneTasks&&typeof state.doneTasks==='object'?state.doneTasks:{};
      const taskDefs=Array.isArray(window.TASKS)?window.TASKS:[];
      const vocabFiles=taskDefs.filter(t=>t&&t.type==='vocab'&&t.file).map(t=>t.file);
      let allVocabDone=vocabFiles.length>0;

      vocabFiles.forEach(file=>{
        const task=state.tasks[file]&&typeof state.tasks[file]==='object'?state.tasks[file]:{done:[],bad:[]};
        task.done=[...new Set((Array.isArray(task.done)?task.done:[]).filter(id=>ids.has(id)))];
        task.bad=[...new Set((Array.isArray(task.bad)?task.bad:[]).filter(id=>ids.has(id)&&!task.done.includes(id)))];
        state.tasks[file]=task;
        const complete=task.done.length>=total;
        if(!complete){delete state.doneTasks[file];allVocabDone=false}
        const standard={
          total,
          queue:[],
          done:task.done.slice(),
          current:null,
          tries:0,
          completed:complete,
          percent:total?Math.round(task.done.length/total*100):0
        };
        writeJson('SP_TASK_STATE_'+file,standard);
      });

      if(!allVocabDone){
        delete state.doneTasks['pruefung.html'];
        localStorage.removeItem('SP_EXAM_UNLOCKED_L3_T1');
        localStorage.removeItem('SP_TASK_STATE_pruefung.html');
      }
      window.save(state);
      window.singularWords=function(){return window.activeWords()};
      return true;
    }catch(e){console.warn('L3T1 Stabilisierung fehlgeschlagen',e);return false}
  }

  if(!run()){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
    else setTimeout(run,0);
  }
})();