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
  function taskRows(){try{return typeof TASKS!=='undefined'&&Array.isArray(TASKS)?TASKS:[]}catch(e){return[]}}
  function topicRun(){return Math.max(1,Math.round(Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}
  function pointsPerTask(){const r=topicRun();return r===1?5:r===2?10:r===3?15:0}
  function taskTitle(file){const row=taskRows().find(t=>t[0]===file);return row?row[2]:file.replace(/\.html$/,'').replace(/-/g,' ')}
  function totalFor(file){
    if(WORD_TASKS.has(file))return 32;
    const row=taskRows().find(t=>t[0]===file);
    return row&&Number(row[1])>0?Number(row[1]):Number(FIXED_TOTALS[file]||0)
  }
  function stateKey(file){try{return typeof taskKey==='function'?taskKey(file):KEY_PREFIX+file}catch(e){return KEY_PREFIX+file}}
  function allDone(total){return Array.from({length:total},(_,i)=>i)}
  function clearCaches(){try{if(typeof clearTaskCaches==='function')clearTaskCaches()}catch(e){}}
  function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
  function readState(file){return readJson(stateKey(file))}
  function writeState(file,state){try{localStorage.setItem(stateKey(file),JSON.stringify(state));clearCaches();window.dispatchEvent(new CustomEvent('SP_L6T2_PROGRESS_CHANGED',{detail:{file,state}}))}catch(e){}}
  function baseName(file){return file.replace(/\.html$/i,'')}
  function escapeRegExp(value){return value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  function legacyKeys(file){
    const base=baseName(file);
    return [stateKey(file),'SP_TASK_STATE_'+file,'SP_TASK_STATE_'+base,'SP_TASK_'+file,'SP_TASK_'+base,'SP_L6_T2_'+file,'SP_L6_T2_'+base,'SP_L6T2_'+file,'SP_L6T2_'+base,'SP_L6_T2_V1:'+file,'SP_L6_T2_V1:'+base,'SP_L6_T2_V1|'+file,'SP_L6_T2_V1|'+base,'SP_L6_T2_TASK_'+file,'SP_L6_T2_TASK_'+base]
  }
  function isTaskStateKey(key,file){
    const k=String(key||'').toLowerCase(),f=file.toLowerCase(),base=baseName(file).toLowerCase();
    const exactFile=k.includes(f);
    const exactBase=new RegExp('(?:^|[_:|/])'+escapeRegExp(base)+'(?:$|[_:|/])').test(k);
    if(!exactFile&&!exactBase)return false;
    return k.includes('sp_task_state')||k.includes('sp_task_')||k.includes('sp_l6_t2')||k.includes('sp_l6t2')||(k.includes('lektion-6')&&k.includes('thema-2'))
  }
  function candidateEntries(file){
    const keys=new Set(legacyKeys(file));
    try{Object.keys(localStorage).forEach(key=>{if(isTaskStateKey(key,file))keys.add(key)})}catch(e){}
    return [...keys].map(key=>readJson(key)).filter(value=>value&&typeof value==='object')
  }
  function unwrapState(raw){
    if(!raw||typeof raw!=='object')return null;
    if(raw.state&&typeof raw.state==='object')return raw.state;
    if(raw.taskState&&typeof raw.taskState==='object')return raw.taskState;
    if(raw.progress&&typeof raw.progress==='object')return raw.progress;
    return raw
  }
  function snapshot(raw,total){
    const st=unwrapState(raw);if(!st)return null;
    const oldTotal=Math.max(0,Number(st.total||st.count||st.itemsTotal||0)||0);
    let rawDone=Array.isArray(st.done)?st.done:Array.isArray(st.completed)?st.completed:Array.isArray(st.completedItems)?st.completedItems:[];
    rawDone=[...new Set(rawDone.map(Number).filter(Number.isInteger))];
    const numericDone=Math.max(0,Number(Array.isArray(st.done)?0:st.done||st.doneCount||st.completedCount||0)||0);
    const doneCount=Math.max(rawDone.length,numericDone);
    let percent=Number(st.percent??st.progressPercent??st.percentage);
    if(!Number.isFinite(percent))percent=oldTotal?doneCount/oldTotal*100:0;
    const complete=st.completed===true||st.isComplete===true||percent>=99.5||(oldTotal>0&&doneCount>=oldTotal);
    percent=Math.max(0,Math.min(100,complete?100:percent));
    let done=rawDone.filter(i=>i>=0&&i<total);
    const target=Math.max(done.length,Math.min(total,complete?total:Math.round(total*percent/100)));
    for(const n of allDone(total)){if(done.length>=target)break;if(!done.includes(n))done.push(n)}
    done=[...new Set(done)].sort((a,b)=>a-b);
    const current=Number.isInteger(st.current)&&st.current>=0&&st.current<total&&!done.includes(st.current)?st.current:null;
    const queue=(Array.isArray(st.queue)?st.queue:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<total&&!done.includes(i)&&i!==current);
    return{percent,complete,done,current,queue,tries:Number(st.tries||0),hadWrong:!!st.hadWrong}
  }
  function repairState(file,total){
    if(!total)return null;
    const shots=candidateEntries(file).map(value=>snapshot(value,total)).filter(Boolean);
    if(!shots.length)return null;
    const complete=shots.some(s=>s.complete),strongest=shots.slice().sort((a,b)=>b.percent-a.percent||b.done.length-a.done.length)[0];
    let done=complete?allDone(total):[...new Set(shots.flatMap(s=>s.done))].filter(i=>i>=0&&i<total).sort((a,b)=>a-b);
    const target=Math.min(total,complete?total:Math.round(total*Math.max(...shots.map(s=>s.percent),0)/100));
    for(const n of allDone(total)){if(done.length>=target)break;if(!done.includes(n))done.push(n)}
    const current=complete?null:(strongest.current!==null&&!done.includes(strongest.current)?strongest.current:null);
    let queue=complete?[]:strongest.queue.filter(i=>!done.includes(i)&&i!==current);
    const used=new Set([...done,...queue,...(current===null?[]:[current])]);
    if(!complete)queue=[...new Set([...queue,...allDone(total).filter(i=>!used.has(i))])];
    const next={total,done,queue,current,tries:complete?0:strongest.tries,hadWrong:complete?false:strongest.hadWrong};
    if(JSON.stringify(readState(file))!==JSON.stringify(next))writeState(file,next);
    return next
  }
  function syncTaskNow(file,state){
    if(!state)return;
    const total=Number(state.total)||totalFor(file),done=Array.isArray(state.done)?state.done.length:Number(state.done||0),percent=total?Math.round(done/total*100):0;
    const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:2,topicId:TOPIC,title:'A1 Lektion 6 · Thema 2',file,taskTitle:taskTitle(file),percent,done,total,completed:percent>=100,allowDecrease:true,run:topicRun(),pointsPerTask:pointsPerTask()};
    const run=api=>{try{if(api&&typeof api.recordTaskProgress==='function')return api.recordTaskProgress(payload)}catch(e){}};
    try{if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')run(window.SPProgress);else import('/js/progress.js?v=l6t2-stable1').then(run).catch(()=>{})}catch(e){}
  }
  function forceComplete(file,total){
    if(!file||file==='pruefung.html'||!total)return;
    const state={total,done:allDone(total),queue:[],current:null,tries:0,hadWrong:false};writeState(file,state);syncTaskNow(file,state)
  }
  function ensureHeader(){
    const h=document.querySelector('header.topbar,.topbar');if(!h)return;
    if(!String(h.textContent||'').trim()){
      const p=profile(),name=[p.vorname||p.firstName||'',p.nachname||p.lastName||''].filter(Boolean).join(' ').trim()||'Schüler/in';
      const dashboard=String(localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase()==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';
      const file=fileName(),isIndex=file==='index.html'||file==='',title=isIndex?'Himmelsrichtungen · Länder · Jahreszeiten':document.title,back=isIndex?'../':'index.html?v='+BUILD;
      h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${title} · A1 Lektion 6 · Thema 2</div></div></a><div class="account-tools"><span class="account-pill">${name}</span><a class="account-link" href="${dashboard}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><a class="btn secondary" href="${back}">← Zurück</a><a class="btn secondary" href="uebersicht.html?v=${BUILD}">Übersicht</a>${isIndex?'<button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button>':''}</nav>`
    }
    h.querySelectorAll('a').forEach(a=>{const text=String(a.textContent||'').trim(),href=String(a.getAttribute('href')||'');if(/Übersicht/i.test(text))a.href='uebersicht.html?v='+BUILD;if(/Zurück/i.test(text)&&fileName()!=='index.html'&&(href==='index.html'||href.startsWith('index.html?')))a.href='index.html?v='+BUILD})
  }
  function ensureTask10(){
    const grid=document.getElementById('staticTaskGrid'),exam=document.getElementById('examCard');
    if(!grid||document.querySelector('[data-file="saetze-bauen.html"]'))return;
    const card=document.createElement('a');card.className='module';card.id='task10Card';card.dataset.file='saetze-bauen.html';card.href='saetze-bauen.html?v='+BUILD;card.innerHTML='<div class="num">10. Sätze bauen</div><div class="big-icon">🧩</div><p class="small">Wörter in die richtige Reihenfolge bringen.</p><div class="progress"><div class="bar" style="width:0%"></div></div><div class="small task-percent">0%</div><div class="start">Starten</div>';grid.insertBefore(card,exam||null)
  }
  function stableFinishLinks(){document.querySelectorAll('.finish-box a').forEach(a=>{const href=String(a.getAttribute('href')||'');if(href==='index.html'||href.startsWith('index.html?'))a.href='index.html?v='+BUILD})}
  function clearLegacyProgress(){
    const remove=new Set(['SP_L6_T2_EXAM_CURRENT_SCORE','SP_L6_T2_EXAM_CURRENT_PERCENT','SP_EXAM_UNLOCKED_L6_T2']);
    TASK_FILES.forEach(file=>legacyKeys(file).forEach(key=>remove.add(key)));
    try{Object.keys(localStorage).forEach(key=>{if(TASK_FILES.some(file=>isTaskStateKey(key,file)))remove.add(key)})}catch(e){}
    remove.forEach(key=>{try{localStorage.removeItem(key)}catch(e){}});clearCaches()
  }
  function patchFunctions(){
    if(typeof complete==='function'&&!complete.__l6t2Stable){const old=complete;window.complete=function(area,file,next){const total=totalFor(file);try{const st=repairState(file,total)||readState(file);if(st&&Array.isArray(st.done)&&st.done.length>=total)forceComplete(file,total)}catch(e){}const out=old.apply(this,arguments);stableFinishLinks();return out};window.complete.__l6t2Stable=true}
    if(typeof markTaskDone==='function'&&!markTaskDone.__l6t2Stable){const old=markTaskDone;window.markTaskDone=function(file,total){const out=old.apply(this,arguments);forceComplete(file,Number(total)||totalFor(file));return out};window.markTaskDone.__l6t2Stable=true}
    if(typeof saveTask==='function'&&!saveTask.__l6t2Stable){const old=saveTask;window.saveTask=function(file,state){const out=old.apply(this,arguments),total=Number(state&&state.total)||totalFor(file),done=Array.isArray(state&&state.done)?state.done.length:Number(state&&state.done||0);if(file!=='pruefung.html'&&total>0&&done>=total)forceComplete(file,total);return out};window.saveTask.__l6t2Stable=true}
    if(typeof resetLocalTopicTasks==='function'&&!resetLocalTopicTasks.__l6t2Stable){const old=resetLocalTopicTasks;window.resetLocalTopicTasks=function(){const out=old.apply(this,arguments);clearLegacyProgress();return out};window.resetLocalTopicTasks.__l6t2Stable=true}
  }
  function repairAll(){TASK_FILES.forEach(file=>repairState(file,totalFor(file)));ensureTask10();ensureHeader();stableFinishLinks();patchFunctions()}

  window.l6t2RepairProgress=repairAll;
  window.l6t2ClearLegacyProgress=clearLegacyProgress;
  repairAll();
  document.addEventListener('DOMContentLoaded',repairAll);
  window.addEventListener('pageshow',repairAll);
  window.addEventListener('focus',repairAll);
  setTimeout(repairAll,100);setTimeout(repairAll,500);setTimeout(repairAll,1400);
  try{new MutationObserver(()=>{ensureHeader();ensureTask10();stableFinishLinks();const file=fileName();if(file!=='index.html'&&file!=='pruefung.html'){const box=document.querySelector('.finish-box');if(box&&/Geschafft|abgeschlossen/i.test(box.textContent||''))forceComplete(file,totalFor(file))}}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();