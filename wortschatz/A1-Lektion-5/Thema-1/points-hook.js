(function(){
'use strict';

const cfg=window.SP_L5_THEME||{};
const theme=String((cfg.id||'Thema-1').match(/\d+/)?.[0]||'1');
const themeKey=cfg.key||`SP_L5_T${theme}_V1`;
const topicTitle=cfg.sub||cfg.title||`A1 Lektion 5 · Thema ${theme}`;
const isL5T4=theme==='4'&&/\/wortschatz\/A1-Lektion-5\/Thema-4\//i.test(location.pathname);

if(isL5T4){
  if(window.__SP_L5T4_CENTRAL_PROGRESS_V1)return;
  window.__SP_L5T4_CENTRAL_PROGRESS_V1=true;
  window.__SP_L5_POINTS_READY=true;

  const TOPIC_ID='wortschatz-a1-lektion-5-thema-4';
  const STORE_VERSION=1;
  const STORE_PREFIX='SP_L5_T4_LOCAL_V1_';
  const TEMP_ID_KEY='SP_L5_T4_TEMP_OWNER_V1';
  const TASK_TITLES={
    'karteikarten.html':'Karteikarten',
    'artikel.html':'Artikel',
    'hoeren-schreiben.html':'Hören/Schreiben',
    'hoeren-bild.html':'Hören/Bild',
    'bild-wort.html':'Bild/Wort',
    'hoeren.html':'Hören',
    'schilder.html':'Schilder',
    'lesen.html':'Lesen: Noras Tag',
    'tv-programm.html':'TV-Programm',
    'zuordnen.html':'Zuordnen',
    'saetze-bauen.html':'Sätze bauen',
    'mini-dialoge.html':'Mini-Dialoge',
    'jede-zeit.html':'jeden / jede / jedes',
    'pruefung.html':'Prüfung'
  };
  const ALIASES={
    'zuordnen-v5.html':'zuordnen.html',
    'zuordnen-v6.html':'zuordnen.html',
    'zuordnen-v7.html':'zuordnen.html'
  };
  const KNOWN_TOTALS={
    'artikel.html':12,
    'hoeren-schreiben.html':13,
    'hoeren.html':13,
    'schilder.html':10,
    'lesen.html':6,
    'tv-programm.html':6,
    'zuordnen.html':10,
    'saetze-bauen.html':8,
    'mini-dialoge.html':8,
    'jede-zeit.html':16,
    'pruefung.html':12
  };
  const pending=new Map();
  let progressLoading=false;
  let flushTimer=null;

  function parse(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
  function clean(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9@._-]+/g,'_').replace(/^_+|_+$/g,'')}
  function activeProfile(){
    return parse(localStorage.getItem('SP_USER_PROFILE'))||
      parse(localStorage.getItem('SP_STUDENT_PROFILE'))||
      parse(localStorage.getItem('SP_PROFILE_BACKUP'))||
      parse(localStorage.getItem('SP_STUDENT_PROFILE_BACKUP'))||{};
  }
  function stableOwner(){
    const p=activeProfile();
    return [p.authUid,p.canonicalStudentId,p.docId,p.studentId,p.uid,p.userId,p.id,localStorage.getItem('SP_STUDENT_AUTH_UID'),localStorage.getItem('SP_STUDENT_ID'),p.email]
      .map(clean).find(Boolean)||'';
  }
  function tempOwner(){
    let id=clean(sessionStorage.getItem(TEMP_ID_KEY));
    if(id)return id;
    try{id='session_'+crypto.randomUUID().replace(/-/g,'')}catch(e){id='session_'+Date.now().toString(36)+Math.random().toString(36).slice(2)}
    try{sessionStorage.setItem(TEMP_ID_KEY,id)}catch(e){}
    return id;
  }
  function owner(){return stableOwner()||tempOwner()}
  function storeKey(){return STORE_PREFIX+owner()}
  function mergeRuns(target={},source={}){
    const out={...(target||{})};
    for(const [key,value] of Object.entries(source||{}))out[key]=Math.max(Number(out[key]||0),Number(value||0));
    return out;
  }
  function mergeStores(target,source){
    if(!source||typeof source!=='object')return target;
    target=target&&typeof target==='object'?target:blankStore();
    target.tasks=target.tasks&&typeof target.tasks==='object'?target.tasks:{};
    for(const [file,raw] of Object.entries(source.tasks||{})){
      const total=Number(raw?.total||KNOWN_TOTALS[file]||0);
      const incoming=normalizeState(raw,total),current=target.tasks[file]?normalizeState(target.tasks[file],total):null;
      if(stateScore(incoming)>stateScore(current))target.tasks[file]=incoming;
    }
    target.points=target.points&&typeof target.points==='object'?target.points:{taskRuns:{},examRuns:{},total:0};
    target.points.taskRuns=target.points.taskRuns&&typeof target.points.taskRuns==='object'?target.points.taskRuns:{};
    for(const [file,runs] of Object.entries(source.points?.taskRuns||{}))target.points.taskRuns[file]=mergeRuns(target.points.taskRuns[file],runs);
    target.points.examRuns=mergeRuns(target.points.examRuns,source.points?.examRuns);
    if(Number(source.exam?.bestPercent||0)>Number(target.exam?.bestPercent||0))target.exam=clone(source.exam);
    recalcLocalPoints(target);
    return target;
  }
  function migrateTempOwnerStore(){
    const stable=stableOwner();
    if(!stable)return;
    const temp=tempOwner();
    if(!temp||temp===stable)return;
    const targetKey=STORE_PREFIX+stable,tempKey=STORE_PREFIX+temp;
    const source=parse(localStorage.getItem(tempKey));
    if(!source)return;
    const target=parse(localStorage.getItem(targetKey))||{version:STORE_VERSION,owner:stable,tasks:{},points:{taskRuns:{},examRuns:{},total:0},exam:null};
    const merged=mergeStores(target,source);
    merged.owner=stable;merged.version=STORE_VERSION;merged.updatedAt=new Date().toISOString();
    try{localStorage.setItem(targetKey,JSON.stringify(merged));localStorage.removeItem(tempKey)}catch(e){}
  }
  function canonicalFile(file){
    const name=String(file||'').split('?')[0].split('#')[0].split('/').pop();
    return ALIASES[name]||name;
  }
  function clone(value){try{return JSON.parse(JSON.stringify(value))}catch(e){return value}}
  function blankStore(){return{version:STORE_VERSION,owner:owner(),tasks:{},points:{taskRuns:{},examRuns:{},total:0},exam:null,updatedAt:new Date().toISOString()}}
  function readStore(){
    migrateTempOwnerStore();
    const raw=parse(localStorage.getItem(storeKey()));
    const out=raw&&typeof raw==='object'?raw:blankStore();
    out.version=STORE_VERSION;
    out.owner=owner();
    out.tasks=out.tasks&&typeof out.tasks==='object'?out.tasks:{};
    out.points=out.points&&typeof out.points==='object'?out.points:{taskRuns:{},examRuns:{},total:0};
    out.points.taskRuns=out.points.taskRuns&&typeof out.points.taskRuns==='object'?out.points.taskRuns:{};
    out.points.examRuns=out.points.examRuns&&typeof out.points.examRuns==='object'?out.points.examRuns:{};
    return out;
  }
  function writeStore(store){
    store.version=STORE_VERSION;
    store.owner=owner();
    store.updatedAt=new Date().toISOString();
    try{localStorage.setItem(storeKey(),JSON.stringify(store))}catch(e){console.warn('L5T4 local progress',e)}
    return store;
  }
  function normalizeState(raw,total){
    total=Math.max(0,Number(total)||Number(raw?.total)||0);
    const done=[...new Set((Array.isArray(raw?.done)?raw.done:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<total))];
    let current=raw?.current===null||raw?.current===undefined?null:Number(raw.current);
    if(!Number.isInteger(current)||current<0||current>=total||done.includes(current))current=null;
    let queue=[...new Set((Array.isArray(raw?.queue)?raw.queue:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<total&&!done.includes(i)&&i!==current))];
    if(!queue.length&&done.length<total&&current===null)queue=[...Array(total).keys()].filter(i=>!done.includes(i)).sort(()=>Math.random()-.5);
    return{
      total,
      done,
      queue,
      current,
      tries:Math.max(0,Number(raw?.tries)||0),
      hadWrong:raw?.hadWrong===true,
      wrongItems:Array.isArray(raw?.wrongItems)?[...new Set(raw.wrongItems.map(String))]:[],
      lastWrongItem:String(raw?.lastWrongItem||'')
    };
  }
  function stateScore(st){return st?st.done.length*1000+(st.current!==null?10:0)+Math.min(9,st.tries||0):-1}
  function legacyKeys(file){
    const canonical=canonicalFile(file);
    const names=[canonical,...Object.entries(ALIASES).filter(([,v])=>v===canonical).map(([k])=>k)];
    const keys=[];
    for(const name of names)keys.push(themeKey+'_'+name);
    for(let i=0;i<localStorage.length;i++){
      const key=String(localStorage.key(i)||'');
      if(!key.startsWith(themeKey))continue;
      if(canonical==='zuordnen.html'){
        if(/zuordnen(?:[-_]v\d+)?(?:\.html)?$/i.test(key)||/zuordnen(?:[-_]v\d+)?/i.test(key))keys.push(key);
      }else if(names.some(name=>key.endsWith('_'+name)||key===themeKey+'_'+name))keys.push(key);
    }
    return [...new Set(keys)];
  }
  function migrateOne(file,total){
    const canonical=canonicalFile(file);
    const store=readStore();
    let best=store.tasks[canonical]?normalizeState(store.tasks[canonical],total):null;
    const oldKeys=legacyKeys(canonical);
    for(const key of oldKeys){
      const candidate=normalizeState(parse(localStorage.getItem(key)),total);
      if(stateScore(candidate)>stateScore(best))best=candidate;
    }
    if(!best)best=normalizeState(null,total);
    store.tasks[canonical]=best;
    noteTaskPoints(store,canonical,best);
    writeStore(store);
    // Nach erfolgreicher Übernahme existiert nur noch der zentrale L5T4-Speicher.
    for(const key of oldKeys){try{localStorage.removeItem(key)}catch(e){}}
    return clone(best);
  }
  function currentRun(){
    return Math.max(1,Math.min(3,Math.round(Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC_ID)||1)||1)));
  }
  function taskPointsForRun(run){return run===1?5:run===2?10:run===3?15:0}
  function examMaxForRun(run){return run===1?100:run===2?200:run===3?300:0}
  function recalcLocalPoints(store){
    let total=0;
    for(const runs of Object.values(store.points.taskRuns||{}))for(const value of Object.values(runs||{}))total+=Math.max(0,Number(value)||0);
    for(const value of Object.values(store.points.examRuns||{}))total+=Math.max(0,Number(value)||0);
    store.points.total=total;
    try{localStorage.setItem('SP_L5_T4_POINTS_LOCAL_'+owner(),String(total))}catch(e){}
  }
  function noteTaskPoints(store,file,state){
    if(file==='pruefung.html'||!state?.total||state.done.length<state.total)return;
    const run=String(currentRun());
    store.points.taskRuns[file]=store.points.taskRuns[file]||{};
    if(!store.points.taskRuns[file][run])store.points.taskRuns[file][run]=taskPointsForRun(Number(run));
    recalcLocalPoints(store);
  }
  function noteExamPoints(store,result){
    const run=currentRun();
    const percent=Math.max(0,Math.min(100,Math.round(Number(result?.percent)||0)));
    const earned=Math.round(examMaxForRun(run)*percent/100);
    store.points.examRuns[String(run)]=Math.max(Number(store.points.examRuns[String(run)]||0),earned);
    store.exam={...(store.exam||{}),lastPercent:percent,bestPercent:Math.max(Number(store.exam?.bestPercent||0),percent),lastScore:Number(result?.score||0),maxScore:Number(result?.maxScore||result?.total||100),stars:Number(result?.stars||0),updatedAt:new Date().toISOString()};
    recalcLocalPoints(store);
  }
  function loadTaskCentral(file,total){return migrateOne(canonicalFile(file),total)}
  function saveTaskCentral(file,state){
    const canonical=canonicalFile(file);
    const store=readStore();
    const normalized=normalizeState(state,state?.total);
    store.tasks[canonical]=normalized;
    noteTaskPoints(store,canonical,normalized);
    writeStore(store);
    try{window.dispatchEvent(new CustomEvent('sprachpilot-progress',{detail:{file:canonical,st:clone(normalized)}}))}catch(e){}
    if(canonical!=='pruefung.html')queueTaskSync(canonical,normalized);
    return clone(normalized);
  }
  function markTaskDoneCentral(file,total){
    return saveTaskCentral(file,{total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false});
  }
  function nextIndexCentral(file,total,sequential=false){
    const canonical=canonicalFile(file);
    let st=loadTaskCentral(canonical,total);
    if(st.current===null||st.current===undefined){
      if(sequential){
        const next=[...Array(total).keys()].find(i=>!st.done.includes(i));
        st.current=next===undefined?null:next;
      }else{
        if(!st.queue.length&&st.done.length<total)st.queue=[...Array(total).keys()].filter(i=>!st.done.includes(i)).sort(()=>Math.random()-.5);
        while(st.queue.length&&st.done.includes(st.queue[0]))st.queue.shift();
        st.current=st.queue.length?st.queue.shift():null;
      }
      st.tries=0;st.hadWrong=false;
      saveTaskCentral(canonical,st);
    }
    return st.current;
  }
  function markRightCentral(file,total){
    const canonical=canonicalFile(file);
    const st=loadTaskCentral(canonical,total),c=st.current;
    if(c!==null&&c!==undefined){
      if(st.hadWrong||st.tries>0){
        if(!st.done.includes(c)&&!st.queue.includes(c))st.queue.push(c);
      }else if(!st.done.includes(c))st.done.push(c);
    }
    st.current=null;st.tries=0;st.hadWrong=false;
    saveTaskCentral(canonical,st);
    return st.done.length>=total;
  }
  function markWrongCentral(file,total){
    const canonical=canonicalFile(file);
    const st=loadTaskCentral(canonical,total);
    st.tries=(st.tries||0)+1;st.hadWrong=true;
    saveTaskCentral(canonical,st);
    return st.tries;
  }
  function pctCentral(file,total){
    if(!total)return 0;
    const st=loadTaskCentral(canonicalFile(file),total);
    return Math.min(100,Math.round(st.done.length/total*100)||0);
  }
  function progressHtmlCentral(file,total){
    const st=loadTaskCentral(file,total),d=Math.min(st.done.length,total),p=pctCentral(file,total);
    return `<div class="small">${d} richtig · ${Math.max(0,total-d)} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`;
  }
  function canSync(){
    if(window.__SP_NAVIGATING||window.SP_NO_FIREBASE_SYNC||window.SP_PERFORMANCE_MODE)return false;
    const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
    if(['teacher','lehrer','admin','owner','superadmin'].includes(role))return false;
    if(localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1')return false;
    return true;
  }
  function loadProgress(){
    if(progressLoading||window.SPProgress||!canSync())return;
    progressLoading=true;
    const s=document.createElement('script');
    s.type='module';
    s.src='/js/progress.js?v=20260826-l5t4-central1';
    s.onload=()=>{progressLoading=false;flush()};
    s.onerror=()=>{progressLoading=false};
    document.head.appendChild(s);
  }
  function payload(file,state){
    const total=Number(state?.total||0),done=Array.isArray(state?.done)?state.done.length:0,percent=total?Math.round(done/total*100):0;
    return{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'4',topicId:TOPIC_ID,title:topicTitle,file,taskKey:file,taskTitle:TASK_TITLES[file]||file.replace('.html',''),percent,completed:percent>=100,total,done,countAttempt:false};
  }
  function queueProgress(method,p,key){
    if(!canSync())return;
    pending.set(method+':'+(key||p.file||'theme'),{method,payload:p});
    clearTimeout(flushTimer);
    flushTimer=setTimeout(flush,500);
  }
  function flush(){
    if(!canSync()||!pending.size)return;
    if(!window.SPProgress){loadProgress();return}
    const items=[...pending.values()];
    pending.clear();
    for(const item of items){
      try{
        const fn=window.SPProgress[item.method];
        if(typeof fn==='function')Promise.resolve(fn(item.payload)).catch(e=>console.warn('L5T4 Firebase sync',e));
      }catch(e){console.warn('L5T4 Firebase sync',e)}
    }
  }
  function queueTaskSync(file,state){
    if(!state?.total)return;
    const p=payload(file,state);
    if(p.percent<=0)return;
    const sig=`${p.percent}:${p.done}:${p.total}`;
    const sigKey=`SP_L5_T4_SYNC_${owner()}_${file}`;
    if(localStorage.getItem(sigKey)===sig)return;
    try{localStorage.setItem(sigKey,sig)}catch(e){}
    queueProgress('recordTaskProgress',p,file);
  }
  function syncExamCentral(result){
    const store=readStore();
    noteExamPoints(store,result||{});
    writeStore(store);
    const percent=Math.max(0,Math.min(100,Math.round(Number(result?.percent)||0)));
    const p={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'4',topicId:TOPIC_ID,title:topicTitle,file:'pruefung.html',taskKey:'pruefung.html',taskTitle:'Prüfung',percent,scorePercent:percent,score:Number(result?.score||0),maxScore:Number(result?.maxScore||result?.total||100),stars:Number(result?.stars||(percent>=100?3:percent>=70?2:percent>=50?1:0))};
    queueProgress('recordExamResult',p,'pruefung.html');
  }
  function knownTotals(){
    const totals={...KNOWN_TOTALS};
    try{
      if(typeof WORDS!=='undefined'&&Array.isArray(WORDS)){
        totals['karteikarten.html']=WORDS.length;
        totals['hoeren-bild.html']=WORDS.filter(w=>w&&w.image).length;
        totals['bild-wort.html']=WORDS.filter(w=>w&&(w.image||w.cue)).length;
      }
    }catch(e){}
    return totals;
  }
  function syncAll(){
    const totals=knownTotals();
    for(const [file,total] of Object.entries(totals)){
      if(file==='pruefung.html')continue;
      const st=loadTaskCentral(file,total);
      if(st.done.length)queueTaskSync(file,st);
    }
    setTimeout(flush,50);
  }
  function resetThemeCentral(){
    if(!confirm('Fortschritte in diesem Thema löschen?'))return;
    const store=readStore();
    store.tasks={};
    store.exam=null;
    writeStore(store);
    // Alte Einzel-/Versionsschlüssel dürfen nach einem Reset nichts zurückholen.
    const oldKeys=[];
    for(let i=0;i<localStorage.length;i++){const key=String(localStorage.key(i)||'');if(key.startsWith(themeKey+'_'))oldKeys.push(key)}
    oldKeys.forEach(key=>{try{localStorage.removeItem(key)}catch(e){}});
    queueProgress('recordThemeReset',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'4',topicId:TOPIC_ID,title:topicTitle},'theme-reset');
    setTimeout(()=>location.href='index.html',300);
  }
  function bind(name,fn){window[name]=fn;try{globalThis[name]=fn}catch(e){}}
  bind('taskKey',file=>storeKey()+'::'+canonicalFile(file));
  bind('loadTask',loadTaskCentral);
  bind('saveTask',saveTaskCentral);
  bind('markTaskDone',markTaskDoneCentral);
  bind('spNextIndex',(file,total)=>nextIndexCentral(file,total,false));
  bind('spNextSequentialIndex',(file,total)=>nextIndexCentral(file,total,true));
  bind('spMarkRight',markRightCentral);
  bind('spMarkWrong',markWrongCentral);
  bind('pctFor',pctCentral);
  bind('spProgressHtml',progressHtmlCentral);
  bind('resetThemeProgress',resetThemeCentral);
  bind('syncExam',syncExamCentral);

  window.L5T4Progress={canonicalFile,loadTask:loadTaskCentral,saveTask:saveTaskCentral,pct:pctCentral,syncAll,flush,storeKey,owner,localPoints:()=>readStore().points};
  window.SP_L5_POINTS_FLUSH=flush;

  setTimeout(syncAll,700);
  window.addEventListener('SP_PROFILE_SYNCED',()=>{migrateTempOwnerStore();setTimeout(syncAll,0)});
  window.addEventListener('SP_STUDENT_IDENTITY_NORMALIZED',()=>{migrateTempOwnerStore();setTimeout(syncAll,0)});
  window.addEventListener('online',()=>setTimeout(syncAll,0));
  return;
}

if(window.__SP_L5_POINTS_READY)return;
window.__SP_L5_POINTS_READY=true;
if(!window.__SP_L5_BUNNY_AUDIO_ALL3&&!document.querySelector('script[data-sp-l5-bunny]')){
  const audioScript=document.createElement('script');
  audioScript.src='/wortschatz/A1-Lektion-5/l5-bunny-words.js?v=l5-bunny-all3';
  audioScript.dataset.spL5Bunny='1';
  document.head.appendChild(audioScript);
}

const TASK_TITLES={
  'karteikarten.html':'Karteikarten','bild-wort.html':'Bild → Wort','wort-bild.html':'Wort → Bild','hoeren-schreiben.html':'Hören → Schreiben','trennbare-verben.html':'Trennbare Verben erkennen','trennbare-verben-im-satz.html':'Sätze bauen','marias-tag.html':'Marias Tag','was-machst-du-gern.html':'Was machst du gern?','ja-nein-fragen.html':'Ja-/Nein-Fragen','verb-passt.html':'Mini-Situationen','pruefung.html':'Prüfung',
  'hoeren.html':'Hören','sehen-schreiben.html':'Sehen → Schreiben','sprechen.html':'Sprechen','formell-informell.html':'formell ↔ informell','frage-antwort.html':'Frage / Antwort','schon-erst.html':'schon / erst','artikel.html':'Artikel der Zeitwörter','plural.html':'Plural der Zeitwörter',
  'sortieren.html':'Gruppen','um-am.html':'Präpositionen','hoeren-waehlen.html':'Hören','saetze-bauen.html':'Sätze bauen','plan-lesen.html':'Plan lesen','dialoge.html':'Dialoge','schreiben.html':'Schreiben'
};
let progressLoading=false;
let syncTimer=null;
const pending=new Map();
function cleanId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item'}
function topicId(){return cleanId(['wortschatz','A1','lektion','5','thema',theme].join('_'))}
function loadProgress(){if(progressLoading||window.SPProgress||window.__SP_NAVIGATING)return;progressLoading=true;const s=document.createElement('script');s.type='module';s.src='/js/progress.js?v=11';document.head.appendChild(s)}
function payload(file,percent,total,done){return{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme,topicId:topicId(),title:topicTitle,file,taskKey:file,taskTitle:TASK_TITLES[file]||file.replace('.html',''),percent:Math.max(0,Math.min(100,Math.round(Number(percent)||0))),completed:Number(percent)>=100,total:Number(total||0),done:Number(done||0),countAttempt:false}}
function stateKey(file){return themeKey+'_'+file}
function parseState(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
function stateFor(file){return parseState(localStorage.getItem(stateKey(file)))}
function doneCount(st){return Array.isArray(st&&st.done)?st.done.length:0}
function totalCount(st){return Number(st&&st.total||0)}
function percent(st){const total=totalCount(st);return total?Math.round(doneCount(st)/total*100):0}
function shouldQueue(file,st){const pct=percent(st),total=totalCount(st);if(!total||pct<=0||window.__SP_NAVIGATING)return false;const sig=[file,pct,doneCount(st),total].join(':'),key=`SP_L5_POINTS_SIG_${topicId()}_${file}`;if((sessionStorage.getItem(key)||localStorage.getItem(key)||'')===sig)return false;try{sessionStorage.setItem(key,sig);localStorage.setItem(key,sig)}catch(e){}return true}
function queue(method,p){if(window.__SP_NAVIGATING)return;pending.set(method+':'+p.file,{method,payload:p});clearTimeout(syncTimer);syncTimer=setTimeout(flush,2400)}
function flush(){if(window.__SP_NAVIGATING||!pending.size)return;loadProgress();const items=[...pending.values()];pending.clear();let attempts=0;const run=()=>{if(window.__SP_NAVIGATING)return;if(window.SPProgress){items.forEach(item=>{try{const fn=window.SPProgress[item.method];if(typeof fn==='function')fn(item.payload)}catch(e){console.warn('SPProgress',e)}});return}attempts++;if(attempts<20)setTimeout(run,300)};run()}
function syncTask(file,st){if(!shouldQueue(file,st))return;queue('recordTaskProgress',payload(file,percent(st),totalCount(st),doneCount(st)))}
const oldSave=window.saveTask;
if(typeof oldSave==='function')window.saveTask=function(file,st){oldSave(file,st);try{syncTask(file,st)}catch(e){}};
const oldMark=window.markTaskDone;
window.markTaskDone=function(file,total){if(typeof oldMark==='function'&&oldMark!==window.markTaskDone)oldMark(file,total);else if(typeof window.saveTask==='function')window.saveTask(file,{total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false});try{syncTask(file,stateFor(file))}catch(e){}};
window.syncExam=function(result){const pct=Math.max(0,Math.min(100,Math.round(Number(result&&result.percent)||0)));const p=payload('pruefung.html',pct,Number(result&&result.maxScore||result&&result.total||100),Math.round(Number(result&&result.maxScore||result&&result.total||100)*pct/100));p.score=Number(result&&result.score||0);p.maxScore=Number(result&&result.maxScore||result&&result.total||100);p.scorePercent=pct;p.stars=Number(result&&result.stars||(pct>=100?3:pct>=70?2:pct>=50?1:0));queue('recordExamResult',p)};
window.SP_L5_POINTS_FLUSH=flush;
})();