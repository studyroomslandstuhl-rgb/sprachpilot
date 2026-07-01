(function(){
  const cfg=window.SP_L5_THEME||{key:'SP_L5_T1_V1'};
  const TASK_TOTALS={
    'karteikarten.html':21,
    'bild-wort.html':15,
    'wort-bild.html':15,
    'hoeren-schreiben.html':21,
    'trennbare-verben.html':15,
    'trennbare-verben-im-satz.html':12,
    'marias-tag.html':11,
    'was-machst-du-gern.html':5,
    'ja-nein-fragen.html':6,
    'verb-passt.html':8,
    'pruefung.html':20
  };
  function ensureGuard(){
    if(window.__spL5PointsGuardAdded)return;
    window.__spL5PointsGuardAdded=true;
    const s=document.createElement('script');
    s.src='/js/sp-progress-guard.js?v=points-safe';
    document.head.appendChild(s);
    const p=document.createElement('script');
    p.type='module';
    p.src='/js/progress.js?v=l5t1-2';
    document.head.appendChild(p);
  }
  function queue(method,payload){
    ensureGuard();
    if(window.SPProgress&&typeof window.SPProgress[method]==='function'){
      try{window.SPProgress[method](payload);}catch(e){console.warn('SPProgress',e);}
      return;
    }
    window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];
    window.SP_PROGRESS_QUEUE.push({method,payload});
  }
  function payload(file,total,done){
    return {module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'1',title:'A1 Lektion 5 · Thema 1',file,taskKey:file,taskTitle:title(file),percent:total?Math.round((done||0)/total*100):100,completed:!total||done>=total,total:Number(total||0),done:Number(done||0)};
  }
  function title(file){return ({'karteikarten.html':'Karteikarten','bild-wort.html':'Bild → Wort','wort-bild.html':'Wort → Bild','hoeren-schreiben.html':'Hören → Schreiben','trennbare-verben.html':'Trennbare Verben erkennen','trennbare-verben-im-satz.html':'Sätze bauen','marias-tag.html':'Marias Tag','was-machst-du-gern.html':'Was machst du gern?','ja-nein-fragen.html':'Ja-/Nein-Fragen','verb-passt.html':'Mini-Situationen','pruefung.html':'Prüfung'})[file]||file;}
  function stateKey(file){return cfg.key+'_'+file;}
  function sync(file){
    try{
      const st=JSON.parse(localStorage.getItem(stateKey(file))||'null');
      if(!st||!st.total||!Array.isArray(st.done))return;
      if(st.done.length>=st.total)queue(file==='pruefung.html'?'recordExamResult':'recordTaskProgress',payload(file,st.total,st.done.length));
    }catch(e){}
  }
  function syncAllCompleted(){Object.keys(TASK_TOTALS).forEach(sync)}
  ensureGuard();
  const oldSave=window.saveTask;
  if(typeof oldSave==='function'){
    window.saveTask=function(file,st){oldSave(file,st);try{if(st&&Array.isArray(st.done)&&st.done.length>=st.total)sync(file);}catch(e){}};
  }
  const oldComplete=window.complete;
  if(typeof oldComplete==='function'){
    window.complete=function(area,file,next){sync(file);return oldComplete(area,file,next);};
  }
  window.markTaskDone=function(file,total){let st=window.loadTask(file,total);st.done=[...Array(total).keys()];st.queue=[];st.current=null;st.tries=0;st.hadWrong=false;window.saveTask(file,st);sync(file)};
  window.spNextSequentialIndex=function(file,total){let st=window.loadTask(file,total);if(st.done.length>=total)return null;if(st.current===null||st.current===undefined){st.current=st.done.length;st.tries=0;st.hadWrong=false;window.saveTask(file,st)}return st.current};
  window.shuffle=function(a){return[...a].sort(()=>Math.random()-.5)};
  window.exactAnswer=function(ans,sol){if(Array.isArray(sol))return sol.some(s=>window.exactAnswer(ans,s));return window.simple(ans)===window.simple(sol)};
  window.instruction=function(text){return `<div class="task-instruction">${text}</div>`};
  window.exampleBox=function(html){return `<div class="example-box"><b>Beispiel:</b><br>${html}</div>`};
  const oldHeader=window.header;
  if(typeof oldHeader==='function'){
    window.header=function(title,showReset){
      oldHeader(title,showReset);
      const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
      let href='index.html';
      if(showReset||page==='index.html')href='../index.html';
      if(page==='statistik.html')href='uebersicht.html';
      if(page==='uebersicht.html')href='index.html';
      const back=document.querySelector('.sp-page-nav a.btn.secondary,.nav a.btn.secondary');
      if(back)back.href=href;
    };
  }
  setTimeout(syncAllCompleted,800);
  setTimeout(syncAllCompleted,2500);
})();
