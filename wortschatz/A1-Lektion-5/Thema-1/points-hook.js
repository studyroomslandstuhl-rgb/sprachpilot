(function(){
  const cfg=window.SP_L5_THEME||{key:'SP_L5_T1_V1'};
  function ensureGuard(){
    if(window.__spL5PointsGuardAdded)return;
    window.__spL5PointsGuardAdded=true;
    const s=document.createElement('script');
    s.src='/js/sp-progress-guard.js?v=points-safe';
    document.head.appendChild(s);
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
    return {module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'1',title:'A1 Lektion 5 · Thema 1',file,taskKey:file,percent:total?Math.round((done||0)/total*100):100,completed:!total||done>=total,total:Number(total||0),done:Number(done||0)};
  }
  function stateKey(file){return cfg.key+'_'+file;}
  function sync(file){
    try{
      const st=JSON.parse(localStorage.getItem(stateKey(file))||'null');
      if(!st||!st.total||!Array.isArray(st.done))return;
      if(st.done.length>=st.total)queue('recordTaskProgress',payload(file,st.total,st.done.length));
    }catch(e){}
  }
  ensureGuard();
  const oldSave=window.saveTask;
  if(typeof oldSave==='function'){
    window.saveTask=function(file,st){oldSave(file,st);try{if(st&&Array.isArray(st.done)&&st.done.length>=st.total)sync(file);}catch(e){}};
  }
  const oldComplete=window.complete;
  if(typeof oldComplete==='function'){
    window.complete=function(area,file,next){sync(file);return oldComplete(area,file,next);};
  }
})();
