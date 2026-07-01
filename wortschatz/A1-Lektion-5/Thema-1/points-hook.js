(function(){
  const cfg=window.SP_L5_THEME||{key:'SP_L5_T1_V1'};
  function loadProgress(){
    if(window.__spL5ProgressLoading)return;
    window.__spL5ProgressLoading=true;
    const s=document.createElement('script');
    s.type='module';
    s.src='/js/progress.js?v=l5t1-light';
    document.head.appendChild(s);
  }
  function queue(method,payload){
    if(window.SPProgress&&typeof window.SPProgress[method]==='function'){
      try{window.SPProgress[method](payload);}catch(e){console.warn('SPProgress',e);}
      return;
    }
    window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];
    window.SP_PROGRESS_QUEUE.push({method,payload});
    loadProgress();
  }
  function title(file){return ({'karteikarten.html':'Karteikarten','bild-wort.html':'Bild → Wort','wort-bild.html':'Wort → Bild','hoeren-schreiben.html':'Hören → Schreiben','trennbare-verben.html':'Trennbare Verben erkennen','trennbare-verben-im-satz.html':'Sätze bauen','marias-tag.html':'Marias Tag','was-machst-du-gern.html':'Was machst du gern?','ja-nein-fragen.html':'Ja-/Nein-Fragen','verb-passt.html':'Mini-Situationen','pruefung.html':'Prüfung'})[file]||file;}
  function payload(file,total,done){return {module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'1',title:'A1 Lektion 5 · Thema 1',file,taskKey:file,taskTitle:title(file),percent:total?Math.round((done||0)/total*100):100,completed:!total||done>=total,total:Number(total||0),done:Number(done||0)};}
  function stateKey(file){return cfg.key+'_'+file;}
  function sync(file){
    try{
      const st=JSON.parse(localStorage.getItem(stateKey(file))||'null');
      if(!st||!st.total||!Array.isArray(st.done))return;
      if(st.done.length>=st.total)queue(file==='pruefung.html'?'recordExamResult':'recordTaskProgress',payload(file,st.total,st.done.length));
    }catch(e){}
  }
  const oldSave=window.saveTask;
  if(typeof oldSave==='function'){
    window.saveTask=function(file,st){oldSave(file,st);try{if(st&&Array.isArray(st.done)&&st.done.length>=st.total)sync(file);}catch(e){}};
  }
  const oldComplete=window.complete;
  if(typeof oldComplete==='function'){
    window.complete=function(area,file,next){sync(file);return oldComplete(area,file,next);};
  }
  window.markTaskDone=function(file,total){let st=window.loadTask(file,total);st.done=[...Array(total).keys()];st.queue=[];st.current=null;st.tries=0;st.hadWrong=false;window.saveTask(file,st);sync(file)};
  window.spNextSequentialIndex=window.spNextSequentialIndex||function(file,total){let st=window.loadTask(file,total);if(st.done.length>=total)return null;if(st.current===null||st.current===undefined){st.current=st.done.length;st.tries=0;st.hadWrong=false;window.saveTask(file,st)}return st.current};
  window.shuffle=window.shuffle||function(a){return[...a].sort(()=>Math.random()-.5)};
})();
