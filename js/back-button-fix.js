(function(){
  'use strict';
  if(window.__SP_BACK_BUTTON_FIX_V4)return;
  window.__SP_BACK_BUTTON_FIX_V4=true;

  const HUB='/verben-bereich/';
  let navigationStarted=false;
  let fixScheduled=false;
  const syncState={chain:Promise.resolve(),latest:new Map(),sent:new Map()};

  function moduleTarget(path,query,text){
    const group=Math.max(0,Number(query.get('group'))||0);
    const task=query.get('task')||'';
    const overview=query.get('view')==='overview';

    if(path.includes('/perfekt/')){
      if(/verben-bereich/i.test(text))return HUB;
      if(overview||/perfekt/i.test(text))return '/perfekt/';
      if(task&&group)return `/perfekt/?group=${group}`;
      return HUB;
    }

    if(path.includes('/verben/')){
      if(/verben-bereich/i.test(text))return HUB;
      if(overview||/^\s*(?:←\s*)?verben\s*$/i.test(text))return '/verben/';
      if(task&&group)return `/verben/?group=${group}`;
      return HUB;
    }

    return '';
  }

  function targetFor(el){
    const stored=String(el?.dataset?.spBackTarget||'');
    if(stored)return stored;

    const path=location.pathname;
    const query=new URLSearchParams(location.search);
    const text=String(el?.textContent||'').trim();
    const module=moduleTarget(path,query,text);
    if(module)return module;

    let match=path.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/?(?:index\.html)?$/i);
    if(match)return '../index.html';
    match=path.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/[^/]+$/i);
    if(match)return 'index.html';
    match=path.match(/^\/wortschatz\/(A\d-Lektion-\d+)\/?(?:index\.html)?$/i);
    if(match)return '/wortschatz/';
    if(path.includes('/verben-A1/')||path.includes('/fragen-A1/'))return '/student-dashboard/index.html';
    return '/student-dashboard/index.html';
  }

  function isBack(el){
    return !!el&&(/zurück|zurueck|←/i.test(String(el.textContent||'').trim())||el?.dataset?.spFastBack==='1');
  }

  function isStatisticsControl(el){
    if(!el)return false;
    const text=String(el.textContent||'').replace(/\s+/g,' ').trim();
    const href=String(el.getAttribute?.('href')||'');
    return /^statistik$/i.test(text)||/(?:^|\/)statistik\.html(?:[?#]|$)/i.test(href);
  }

  function removeStatisticsControls(){
    document.querySelectorAll('a,button').forEach(el=>{
      if(isStatisticsControl(el))el.remove();
    });
  }

  function beginNavigation(){
    if(navigationStarted)return;
    navigationStarted=true;
    window.__SP_NAVIGATING=true;
    window.SP_NO_FIREBASE_SYNC=true;
    window.SP_PERFORMANCE_MODE=true;
    try{if(Array.isArray(window.SP_PROGRESS_QUEUE))window.SP_PROGRESS_QUEUE.length=0}catch(e){}
    try{document.documentElement.dataset.spNavigating='1'}catch(e){}
  }

  function syncKey(method,payload={}){
    const topic=payload.topicId||payload.themeId||[payload.module,payload.level,payload.lesson,payload.theme].filter(Boolean).join(':');
    const file=payload.file||payload.taskKey||payload.taskTitle||'task';
    return `${method}:${topic}:${file}`;
  }

  function syncSignature(method,payload={}){
    if(method==='recordThemeReset')return `${Date.now()}:${Math.random()}`;
    return [payload.percent,payload.progress,payload.scorePercent,payload.score,payload.done,payload.total,payload.completed,payload.stars].map(value=>String(value??'')).join('|');
  }

  function wrapProgressApi(api){
    if(!api||typeof api!=='object'||api.__spNavigationPerformanceV2)return api;
    ['recordTaskProgress','recordExamResult','recordThemeReset'].forEach(method=>{
      const original=api[method];
      if(typeof original!=='function')return;
      api[method]=function(payload={}){
        if(window.__SP_NAVIGATING)return Promise.resolve(null);
        const key=syncKey(method,payload);
        const signature=syncSignature(method,payload);
        if(method!=='recordThemeReset'&&(syncState.sent.get(key)===signature||syncState.latest.get(key)===signature))return Promise.resolve(null);
        syncState.latest.set(key,signature);
        const execute=async()=>{
          if(window.__SP_NAVIGATING)return null;
          if(method!=='recordThemeReset'&&syncState.latest.get(key)!==signature)return null;
          syncState.sent.set(key,signature);
          try{return await original.call(api,payload)}catch(error){console.warn('SPProgress sync failed',error);return null}
        };
        syncState.chain=syncState.chain.then(execute,execute);
        return syncState.chain;
      };
    });
    Object.defineProperty(api,'__spNavigationPerformanceV2',{value:true,configurable:true});
    return api;
  }

  function installProgressGate(){
    let current=window.SPProgress;
    try{
      const descriptor=Object.getOwnPropertyDescriptor(window,'SPProgress');
      if(!descriptor||descriptor.configurable){
        current=wrapProgressApi(current);
        Object.defineProperty(window,'SPProgress',{
          configurable:true,
          enumerable:true,
          get(){return current},
          set(value){current=wrapProgressApi(value)}
        });
        return;
      }
    }catch(e){}
    wrapProgressApi(current);
    [250,900,2200,5000].forEach(delay=>setTimeout(()=>wrapProgressApi(window.SPProgress),delay));
  }

  function fastNavigate(event,el){
    if(navigationStarted||!isBack(el))return;
    if(event.type==='click'&&event.button!==undefined&&event.button!==0)return;
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const target=targetFor(el);
    if(!target)return;
    beginNavigation();
    event.preventDefault();
    event.stopPropagation();
    if(typeof event.stopImmediatePropagation==='function')event.stopImmediatePropagation();
    location.assign(target);
  }

  function normalizeBack(el,target){
    el.dataset.spBackTarget=target;
    el.dataset.spFastBack='1';
    if(el.tagName==='A')el.setAttribute('href',target);
    if(el.textContent!=='← Zurück')el.textContent='← Zurück';
    el.setAttribute('aria-label','Zurück');
    el.setAttribute('title','Zurück');
  }

  function fix(){
    fixScheduled=false;
    removeStatisticsControls();
    document.querySelectorAll('a,button').forEach(el=>{
      if(!isBack(el))return;
      const target=targetFor(el);
      if(!target)return;
      normalizeBack(el,target);
    });
  }

  function scheduleFix(){
    if(fixScheduled)return;
    fixScheduled=true;
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(fix);else setTimeout(fix,0);
  }

  installProgressGate();
  document.addEventListener('click',event=>{
    const el=event.target.closest?.('a,button');
    if(el?.dataset.spFastBack==='1'||isBack(el))fastNavigate(event,el);
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const el=event.target.closest?.('a,button');
    if(el?.dataset.spFastBack==='1'||isBack(el))fastNavigate(event,el);
  },true);
  document.addEventListener('DOMContentLoaded',scheduleFix);
  if(document.readyState!=='loading')scheduleFix();
  setTimeout(scheduleFix,300);
  setTimeout(scheduleFix,1200);
  try{new MutationObserver(scheduleFix).observe(document.documentElement,{childList:true,subtree:true,characterData:true})}catch(e){}
})();