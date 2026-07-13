(function(){
  if(window.__SP_PROGRESS_STANDARD_V1)return;
  window.__SP_PROGRESS_STANDARD_V1=true;

  function cleanId(value){
    return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
  }
  function clamp(value){
    const n=Number(value);
    return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):0;
  }
  function readJson(key,fallback=null){
    try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}
  }
  function writeJson(key,value){
    try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}
  }
  function fileName(file){
    const raw=String(file||location.pathname.split('/').pop()||'').split('?')[0].split('#')[0];
    return raw||'index.html';
  }
  function pathInfo(){
    const path=String(location.pathname||'');
    const w=path.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\//i);
    if(w){
      return {module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:w[1].replace(/.*Lektion-/i,''),theme:w[2].replace(/.*Thema-/i,''),topicId:cleanId('wortschatz '+w[1]+' '+w[2]),title:w[1]+' · '+w[2]};
    }
    const v=path.includes('/verben-A1/');
    if(v)return {module:'verben',moduleTitle:'Verben',level:'A1',lesson:'',theme:'',topicId:'verben-a1',title:'Verben A1'};
    const f=path.includes('/fragen-A1/')||path.includes('/fragen/');
    if(f)return {module:'fragen',moduleTitle:'Fragen',level:'A1',lesson:'',theme:'',topicId:'fragen-a1',title:'Fragen A1'};
    return {module:'allgemein',moduleTitle:'Allgemein',level:'',lesson:'',theme:'',topicId:cleanId(path),title:path};
  }
  function stateKey(file){return 'SP_TASK_STATE_'+fileName(file)}
  function doneArray(total){
    total=Math.max(1,Math.round(Number(total)||100));
    return Array.from({length:total},(_,i)=>i);
  }
  function percentFromState(st,total){
    if(!st||typeof st!=='object')return 0;
    if(st.completed===true||st.done===true||st.finished===true)return 100;
    if(st.percent!==undefined||st.progress!==undefined||st.progressPercent!==undefined)return clamp(st.percent??st.progress??st.progressPercent);
    const t=Number(st.total||total||0);
    const done=Array.isArray(st.done)?st.done.length:Number(st.done||st.completedCount||0);
    if(t>0&&done>=0)return clamp(done/t*100);
    return 0;
  }
  function directPercent(file,total){
    const f=fileName(file);
    const direct=readJson(stateKey(f),null);
    let best=percentFromState(direct,total);
    const clean=cleanId(f);
    const alt=readJson('SP_TASK_STATE_'+clean,null);
    best=Math.max(best,percentFromState(alt,total));
    return best;
  }
  function legacyPercent(file,total){
    const f=fileName(file);
    const candidates=[f,cleanId(f),f.replace(/\.html$/i,''),cleanId(f.replace(/\.html$/i,''))];
    let best=0;
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||'';
      if(!/^(SP_|A1_|L\d|sprachpilot)/i.test(key))continue;
      const obj=readJson(key,null);
      if(!obj||typeof obj!=='object'||Array.isArray(obj))continue;
      for(const name of candidates){
        best=Math.max(best,percentFromState(obj[name],total));
        best=Math.max(best,percentFromState(obj.tasks&&obj.tasks[name],total));
        if(obj.doneTasks&&obj.doneTasks[name])best=100;
        if(obj.done&&obj.done[name])best=100;
        if(obj.completed&&obj.completed[name])best=100;
      }
    }
    return best;
  }
  function standardPercent(file,total){
    return Math.max(directPercent(file,total),legacyPercent(file,total));
  }
  function payload(file,percent,total,done){
    const info=pathInfo();
    const f=fileName(file);
    return {...info,file:f,taskKey:f,taskTitle:f.replace(/\.html$/i,'').replace(/-/g,' '),percent:clamp(percent),completed:clamp(percent)>=100,total:Number(total||100),done:Number(done||0)};
  }
  function queueFirebase(file,percent,total,done){
    if(clamp(percent)<=0)return;
    const data=payload(file,percent,total,done);
    try{
      if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')window.SPProgress.recordTaskProgress(data);
      else{
        window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];
        window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload:data});
        import('/js/progress.js?v=standard-progress').catch(function(){});
      }
    }catch(e){}
  }
  function saveState(file,state){
    const f=fileName(file);
    const total=Number(state&&state.total)||Number(state&&state.done&&state.done.length)||100;
    const pct=percentFromState(state,total);
    const old=readJson(stateKey(f),{});
    const oldPct=percentFromState(old,total);
    const merged={...(old||{}),...(state||{}),total:Math.max(Number(old&&old.total||0),Number(total||0))||total};
    if(pct>=oldPct){
      writeJson(stateKey(f),merged);
      queueFirebase(f,pct,merged.total,Array.isArray(merged.done)?merged.done.length:Number(merged.done||0));
    }
  }
  function markComplete(file,total){
    const f=fileName(file);
    total=Math.max(1,Math.round(Number(total)||Number((readJson(stateKey(f),{})||{}).total)||100));
    const state={total,queue:[],done:doneArray(total),current:null,tries:0,completed:true,percent:100,updatedAt:new Date().toISOString()};
    writeJson(stateKey(f),state);
    queueFirebase(f,100,total,total);
    return state;
  }
  function guessTotal(file,total){
    if(Number(total)>0)return Number(total);
    try{if(typeof window.getTotal==='function'){const n=Number(window.getTotal(fileName(file)));if(n>0)return n}}catch(e){}
    try{const st=readJson(stateKey(file),null);if(Number(st&&st.total)>0)return Number(st.total)}catch(e){}
    try{if(Array.isArray(window.WORDS)&&window.WORDS.length)return window.WORDS.length}catch(e){}
    return 100;
  }
  function patchFunction(name,wrapper){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__spStandard)return false;
    const patched=wrapper(fn);
    patched.__spStandard=true;
    window[name]=patched;
    return true;
  }
  function patch(){
    patchFunction('pctFor',old=>function(file,total){return Math.max(clamp(old.apply(this,arguments)),standardPercent(file,total))});
    patchFunction('pct',old=>function(file,total){return Math.max(clamp(old.apply(this,arguments)),standardPercent(file,total))});
    patchFunction('taskPercent',old=>function(file,total){return Math.max(clamp(old.apply(this,arguments)),standardPercent(file,total))});
    patchFunction('complete',old=>function(area,file,next){const total=guessTotal(file);markComplete(file,total);return old.apply(this,arguments)});
    patchFunction('finishTask',old=>function(file){const total=guessTotal(file);markComplete(file,total);return old.apply(this,arguments)});
    patchFunction('done',old=>function(file,total){markComplete(file,guessTotal(file,total));return old.apply(this,arguments)});
    patchFunction('markTaskDone',old=>function(file,total){markComplete(file,guessTotal(file,total));return old.apply(this,arguments)});
    patchFunction('saveTask',old=>function(file,state){saveState(file,state);return old.apply(this,arguments)});
    patchFunction('resetOneTask',old=>function(file){try{localStorage.removeItem(stateKey(file))}catch(e){}return old.apply(this,arguments)});
  }
  window.SPProgressStandard={taskPercent:standardPercent,markComplete,saveState,stateKey,pathInfo};
  patch();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else setTimeout(patch,0);
  setTimeout(patch,250);
  setTimeout(patch,1000);
  setTimeout(patch,2200);
})();
