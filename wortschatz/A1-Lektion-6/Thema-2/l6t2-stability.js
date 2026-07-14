(function(){
  if(window.__L6T2_STABILITY_V1)return;
  window.__L6T2_STABILITY_V1=true;

  const BUILD='l6t2-stable1';
  const TOPIC='wortschatz-a1-lektion-6-thema-2';
  const KEY_PREFIX='SP_L6_T2_V1_';
  const FIXED_TOTALS={
    'kategorien-drag.html':21,
    'praepositionen.html':18,
    'praepositionen-bild.html':21,
    'praepositionen-drag.html':18,
    'fehler-finden.html':20,
    'postkarte.html':2,
    'saetze-bauen.html':10,
    'pruefung.html':20
  };
  const WORD_TASKS=new Set(['karteikarten.html','bild-wort.html','hoeren-bild.html']);
  const TASK_FILES=['karteikarten.html','bild-wort.html','hoeren-bild.html','kategorien-drag.html','praepositionen.html','praepositionen-bild.html','praepositionen-drag.html','fehler-finden.html','postkarte.html','saetze-bauen.html','pruefung.html'];

  function fileName(){return String(location.pathname.split('/').pop()||'index.html').split('?')[0]||'index.html'}
  function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
  function topicRun(){return Math.max(1,Math.round(Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1)}
  function pointsPerTask(){const r=topicRun();return r===1?5:r===2?10:r===3?15:0}
  function taskTitle(file){try{const row=(window.TASKS||[]).find(t=>t[0]===file);if(row)return row[2]}catch(e){}return file.replace(/\.html$/,'').replace(/-/g,' ')}
  function totalFor(file){
    if(WORD_TASKS.has(file)){try{const n=Number(window.words&&window.words().length);if(n>0)return n}catch(e){}return 32}
    try{const row=(window.TASKS||[]).find(t=>t[0]===file);if(row&&Number(row[1])>0)return Number(row[1])}catch(e){}
    return Number(FIXED_TOTALS[file]||0)
  }
  function stateKey(file){try{if(typeof window.taskKey==='function')return window.taskKey(file)}catch(e){}return KEY_PREFIX+file}
  function allDone(total){return Array.from({length:total},(_,i)=>i)}
  function clearCaches(){try{if(typeof window.clearTaskCaches==='function')window.clearTaskCaches()}catch(e){}}
  function readState(file){try{return JSON.parse(localStorage.getItem(stateKey(file))||'null')}catch(e){return null}}
  function writeState(file,state){try{localStorage.setItem(stateKey(file),JSON.stringify(state));clearCaches()}catch(e){}}

  function repairState(file,total){
    if(!total)return null;
    const old=readState(file);
    if(!old||typeof old!=='object')return null;
    const oldTotal=Math.max(0,Number(old.total)||0);
    const oldDone=[...new Set((Array.isArray(old.done)?old.done:[]).filter(Number.isInteger))];
    const wasComplete=old.completed===true||(oldTotal>0&&oldDone.length>=oldTotal);
    let done=wasComplete?allDone(total):oldDone.filter(i=>i>=0&&i<total);
    const current=Number.isInteger(old.current)&&old.current>=0&&old.current<total&&!done.includes(old.current)?old.current:null;
    let queue=(Array.isArray(old.queue)?old.queue:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<total&&!done.includes(i)&&i!==current);
    const used=new Set([...done,...queue,...(current===null?[]:[current])]);
    queue=[...new Set([...queue,...allDone(total).filter(i=>!used.has(i))])];
    const next={total,done,queue,current,tries:Number(old.tries||0),hadWrong:!!old.hadWrong};
    if(wasComplete){next.current=null;next.queue=[];next.tries=0;next.hadWrong=false}
    if(JSON.stringify(old)!==JSON.stringify(next))writeState(file,next);
    return next;
  }

  function syncTaskNow(file,state){
    if(!state)return;
    const total=Number(state.total)||totalFor(file),done=Array.isArray(state.done)?state.done.length:Number(state.done||0),percent=total?Math.round(done/total*100):0;
    const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:2,topicId:TOPIC,title:'A1 Lektion 6 · Thema 2',file,taskTitle:taskTitle(file),percent,done,total,completed:percent>=100,allowDecrease:true,run:topicRun(),pointsPerTask:pointsPerTask()};
    const run=api=>{try{if(api&&typeof api.recordTaskProgress==='function')return api.recordTaskProgress(payload)}catch(e){}};
    try{
      if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')run(window.SPProgress);
      else import('/js/progress.js?v=l6t2-stable1').then(run).catch(()=>{});
    }catch(e){}
  }

  function forceComplete(file,total){
    if(!file||file==='pruefung.html'||!total)return;
    const state={total,done:allDone(total),queue:[],current:null,tries:0,hadWrong:false};
    writeState(file,state);
    syncTaskNow(file,state);
  }

  function ensureHeader(){
    const h=document.querySelector('header.topbar,.topbar');
    if(!h||String(h.textContent||'').trim())return;
    const p=profile();
    const name=[p.vorname||p.firstName||'',p.nachname||p.lastName||''].filter(Boolean).join(' ').trim()||'Schüler/in';
    const role=String(localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();
    const dashboard=role==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';
    const file=fileName(),isIndex=file==='index.html'||file==='';
    const title=isIndex?'Himmelsrichtungen · Länder · Jahreszeiten':document.title;
    const back=isIndex?'../':'index.html?v='+BUILD;
    h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${title} · A1 Lektion 6 · Thema 2</div></div></a><div class="account-tools"><span class="account-pill">${name}</span><a class="account-link" href="${dashboard}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><a class="btn secondary" href="${back}">← Zurück</a><a class="btn secondary" href="uebersicht.html?v=${BUILD}">Übersicht</a>${isIndex?'<button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button>':''}</nav>`;
  }

  function ensureTask10(){
    const grid=document.getElementById('staticTaskGrid'),exam=document.getElementById('examCard');
    if(!grid||document.querySelector('[data-file="saetze-bauen.html"]'))return;
    const card=document.createElement('a');
    card.className='module';card.id='task10Card';card.dataset.file='saetze-bauen.html';card.href='saetze-bauen.html?v='+BUILD;
    card.innerHTML='<div class="num">10. Sätze bauen</div><div class="big-icon">🧩</div><p class="small">Wörter in die richtige Reihenfolge bringen.</p><div class="progress"><div class="bar" style="width:0%"></div></div><div class="small task-percent">0%</div><div class="start">Starten</div>';
    grid.insertBefore(card,exam||null);
  }

  function patchFunctions(){
    if(typeof window.complete==='function'&&!window.complete.__l6t2Stable){
      const old=window.complete;
      window.complete=function(area,file,next){
        const total=totalFor(file);
        try{const st=readState(file);if(st&&Array.isArray(st.done)&&st.done.length>=total)forceComplete(file,total)}catch(e){}
        return old.apply(this,arguments);
      };
      window.complete.__l6t2Stable=true;
    }
    if(typeof window.markTaskDone==='function'&&!window.markTaskDone.__l6t2Stable){
      const old=window.markTaskDone;
      window.markTaskDone=function(file,total){const out=old.apply(this,arguments);forceComplete(file,Number(total)||totalFor(file));return out};
      window.markTaskDone.__l6t2Stable=true;
    }
    if(typeof window.saveTask==='function'&&!window.saveTask.__l6t2Stable){
      const old=window.saveTask;
      window.saveTask=function(file,state){const out=old.apply(this,arguments);const total=Number(state&&state.total)||totalFor(file);const done=Array.isArray(state&&state.done)?state.done.length:Number(state&&state.done||0);if(file!=='pruefung.html'&&total>0&&done>=total)forceComplete(file,total);return out};
      window.saveTask.__l6t2Stable=true;
    }
  }

  function repairAll(){
    TASK_FILES.forEach(file=>repairState(file,totalFor(file)));
    ensureTask10();
    ensureHeader();
    patchFunctions();
  }

  ensureHeader();
  repairAll();
  document.addEventListener('DOMContentLoaded',repairAll);
  window.addEventListener('pageshow',repairAll);
  setTimeout(repairAll,100);
  setTimeout(repairAll,500);
  setTimeout(repairAll,1400);
  try{new MutationObserver(()=>{ensureHeader();ensureTask10();const file=fileName();if(file!=='index.html'&&file!=='pruefung.html'){const box=document.querySelector('.finish-box');if(box&&/Geschafft|abgeschlossen/i.test(box.textContent||''))forceComplete(file,totalFor(file))}}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();