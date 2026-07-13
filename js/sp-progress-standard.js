(function(){
  if(window.__SP_PROGRESS_STANDARD_V3)return;
  window.__SP_PROGRESS_STANDARD_V3=true;

  let refreshRunning=false;
  let refreshQueued=false;
  let percentCache=new Map();
  let percentCacheAt=0;

  function cleanId(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item'}
  function clamp(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(100,Math.round(n))):0}
  function readJson(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch(e){return fallback}}
  function writeJson(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}
  function clearPercentCache(){percentCache.clear();percentCacheAt=Date.now()}
  function fileName(file){const raw=String(file||location.pathname.split('/').pop()||'').split('?')[0].split('#')[0];return raw||'index.html'}
  function pathInfo(){
    const path=String(location.pathname||'');
    const w=path.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\//i);
    if(w)return {module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:w[1].replace(/.*Lektion-/i,''),theme:w[2].replace(/.*Thema-/i,''),topicId:cleanId('wortschatz '+w[1]+' '+w[2]),title:w[1]+' · '+w[2]};
    if(path.includes('/verben-A1/'))return {module:'verben',moduleTitle:'Verben',level:'A1',lesson:'',theme:'',topicId:'verben-a1',title:'Verben A1'};
    if(path.includes('/fragen-A1/')||path.includes('/fragen/'))return {module:'fragen',moduleTitle:'Fragen',level:'A1',lesson:'',theme:'',topicId:'fragen-a1',title:'Fragen A1'};
    return {module:'allgemein',moduleTitle:'Allgemein',level:'',lesson:'',theme:'',topicId:cleanId(path),title:path};
  }
  function stateKey(file){return 'SP_TASK_STATE_'+fileName(file)}
  function doneArray(total){total=Math.max(1,Math.round(Number(total)||100));return Array.from({length:total},(_,i)=>i)}
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
    let best=percentFromState(readJson(stateKey(f),null),total);
    best=Math.max(best,percentFromState(readJson('SP_TASK_STATE_'+cleanId(f),null),total));
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
    const now=Date.now();
    if(now-percentCacheAt>500){percentCache.clear();percentCacheAt=now}
    const key=fileName(file)+'|'+String(total||'');
    if(percentCache.has(key))return percentCache.get(key);
    const value=Math.max(directPercent(file,total),legacyPercent(file,total));
    percentCache.set(key,value);
    return value;
  }
  function payload(file,percent,total,done){const info=pathInfo();const f=fileName(file);return {...info,file:f,taskKey:f,taskTitle:f.replace(/\.html$/i,'').replace(/-/g,' '),percent:clamp(percent),completed:clamp(percent)>=100,total:Number(total||100),done:Number(done||0)}}
  function queueFirebase(file,percent,total,done){
    if(clamp(percent)<=0)return;
    const data=payload(file,percent,total,done);
    try{
      if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')window.SPProgress.recordTaskProgress(data);
      else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload:data});import('/js/progress.js?v=standard-progress').catch(function(){})}
    }catch(e){}
  }
  function saveState(file,state){
    const f=fileName(file);
    const total=Number(state&&state.total)||Number(state&&state.done&&state.done.length)||100;
    const pct=percentFromState(state,total);
    const old=readJson(stateKey(f),{});
    const oldPct=percentFromState(old,total);
    const merged={...(old||{}),...(state||{}),total:Math.max(Number(old&&old.total||0),Number(total||0))||total};
    if(pct>=oldPct){writeJson(stateKey(f),merged);clearPercentCache();queueFirebase(f,pct,merged.total,Array.isArray(merged.done)?merged.done.length:Number(merged.done||0));scheduleRefresh()}
  }
  function markComplete(file,total){
    const f=fileName(file);
    total=Math.max(1,Math.round(Number(total)||Number((readJson(stateKey(f),{})||{}).total)||100));
    const state={total,queue:[],done:doneArray(total),current:null,tries:0,completed:true,percent:100,updatedAt:new Date().toISOString()};
    writeJson(stateKey(f),state);
    clearPercentCache();
    queueFirebase(f,100,total,total);
    scheduleRefresh();
    return state;
  }
  function guessTotal(file,total){
    if(Number(total)>0)return Number(total);
    try{if(typeof window.getTotal==='function'){const n=Number(window.getTotal(fileName(file)));if(n>0)return n}}catch(e){}
    try{const st=readJson(stateKey(file),null);if(Number(st&&st.total)>0)return Number(st.total)}catch(e){}
    try{if(Array.isArray(window.WORDS)&&window.WORDS.length)return window.WORDS.length}catch(e){}
    return 100;
  }
  function updateCard(card,file){
    const total=guessTotal(file);
    const pct=standardPercent(file,total);
    if(pct<=0)return;
    const width=pct+'%';
    const bar=card.querySelector('.bar');
    if(bar&&bar.style.width!==width)bar.style.width=width;
    const smalls=Array.from(card.querySelectorAll('.small'));
    const percentSmall=smalls.find(el=>/%|offen|gesperrt|richtig|übrig/i.test(String(el.textContent||'')));
    if(percentSmall&&percentSmall.textContent!==width)percentSmall.textContent=width;
    const start=card.querySelector('.start');
    if(start&&pct>=100&&!/Prüfung gesperrt|gesperrt/i.test(start.textContent||'')&&start.textContent!=='Fertig')start.textContent='Fertig';
  }
  function refreshVisibleProgress(){
    if(refreshRunning)return;
    refreshRunning=true;
    try{
      document.querySelectorAll('a.module[href],button.module[data-file],.task-card[href]').forEach(card=>{
        const href=card.getAttribute('href')||card.getAttribute('data-file')||'';
        if(!href||href==='#')return;
        const file=fileName(href.split('/').pop());
        if(!/\.html$/i.test(file))return;
        updateCard(card,file);
      });
    }catch(e){}finally{refreshRunning=false}
  }
  function scheduleRefresh(){
    if(refreshQueued)return;
    refreshQueued=true;
    const run=()=>{refreshQueued=false;refreshVisibleProgress()};
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(run);else setTimeout(run,50);
  }
  function patchFunction(name,wrapper){
    const fn=window[name];
    if(typeof fn!=='function'||fn.__spStandard)return false;
    const patched=wrapper(fn);patched.__spStandard=true;window[name]=patched;return true;
  }
  function patch(){
    patchFunction('pctFor',old=>function(file,total){return Math.max(clamp(old.apply(this,arguments)),standardPercent(file,total))});
    patchFunction('pct',old=>function(file,total){return Math.max(clamp(old.apply(this,arguments)),standardPercent(file,total))});
    patchFunction('taskPercent',old=>function(file,total){return Math.max(clamp(old.apply(this,arguments)),standardPercent(file,total))});
    patchFunction('complete',old=>function(area,file,next){markComplete(file,guessTotal(file));return old.apply(this,arguments)});
    patchFunction('finishTask',old=>function(file){markComplete(file,guessTotal(file));return old.apply(this,arguments)});
    patchFunction('done',old=>function(file,total){markComplete(file,guessTotal(file,total));return old.apply(this,arguments)});
    patchFunction('markTaskDone',old=>function(file,total){markComplete(file,guessTotal(file,total));return old.apply(this,arguments)});
    patchFunction('saveTask',old=>function(file,state){saveState(file,state);return old.apply(this,arguments)});
    patchFunction('resetOneTask',old=>function(file){try{localStorage.removeItem(stateKey(file));clearPercentCache()}catch(e){}return old.apply(this,arguments)});
    scheduleRefresh();
  }
  window.SPProgressStandard={taskPercent:standardPercent,markComplete,saveState,stateKey,pathInfo,refreshVisibleProgress,scheduleRefresh};
  patch();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);else setTimeout(patch,0);
  setTimeout(patch,250);setTimeout(patch,1000);setTimeout(patch,2200);setTimeout(scheduleRefresh,3200);
  try{new MutationObserver(scheduleRefresh).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();