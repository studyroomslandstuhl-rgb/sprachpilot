(function(){
  if(window.__SP_L6T1_SAVE_FIX)return;
  window.__SP_L6T1_SAVE_FIX=true;
  const TOPIC_ID='wortschatz-a1-lektion-6-thema-1';
  const TASK_NAMES={'karteikarten.html':'Karteikarten','artikel.html':'Artikel','hoeren-schreiben.html':'Hoeren/Schreiben','hoeren-bild.html':'Hoeren/Karte','nomen-satz-a.html':'Wort -> Satz','nomen-satz-b.html':'Satz hoeren -> Wort','geraeusche.html':'Geraeusche','geraeusche-satz.html':'Geraeusch -> Satz','wetter-saetze.html':'Saetze schreiben','hoeren.html':'Hoeren','pruefung.html':'Pruefung'};
  function payload(file,st){
    const total=Number(st&&st.total||0)||0;
    const done=Array.isArray(st&&st.done)?st.done.length:0;
    const percent=total?Math.round(Math.min(done,total)*100/total):0;
    return {module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:1,title:'A1 Lektion 6 · Thema 1 Wetter',topicId:TOPIC_ID,file,taskTitle:TASK_NAMES[file]||String(file||'Aufgabe').replace(/\.html$/,''),percent,done:Math.min(done,total),total,completed:percent>=100};
  }
  function sync(file,st){
    if(!file||!st)return;
    const p=payload(file,st);
    try{
      if(window.SPProgress&&SPProgress.recordTaskProgress){SPProgress.recordTaskProgress(p);return;}
      window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];
      window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload:p});
      import('/js/progress.js?v=l6t1-save-2').catch(()=>{});
    }catch(e){}
  }
  const oldSave=window.saveTask;
  window.saveTask=saveTask=function(file,st){
    if(typeof oldSave==='function')oldSave(file,st);else try{localStorage.setItem(taskKey(file),JSON.stringify(st))}catch(e){}
    sync(file,st);
  };
  const oldRight=window.spMarkRight;
  window.spMarkRight=spMarkRight=function(file,total){
    if(typeof oldRight==='function')oldRight(file,total);
    try{sync(file,loadTask(file,total))}catch(e){}
  };
  const oldDone=window.markTaskDone;
  window.markTaskDone=markTaskDone=function(file,total){
    if(typeof oldDone==='function')oldDone(file,total);else saveTask(file,{total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false});
    try{sync(file,loadTask(file,total))}catch(e){}
  };
})();