(function(){
  'use strict';

  const LEDGER_KEY='SP_THEME_SCORE_A1_L4_T3_V1';
  const TOPIC_ID='wortschatz-a1-lektion-4-thema-3';
  const RUN_KEY='SP_SCORE_RUN_'+TOPIC_ID;
  const VERSION=1;
  const TASK_FILES=['karteikarten.html','hoeren.html','farben.html','memory.html','gegenteile.html','kein.html','reaktionen.html','gefallen.html','farben-kombinieren.html','saetze-bauen.html','schreiben.html'];
  const TASK_TITLES={
    'karteikarten.html':'Karteikarten','hoeren.html':'Hören','farben.html':'Farben','memory.html':'Gegenteile-Memory',
    'gegenteile.html':'Gegenteile','kein.html':'nicht / kein','reaktionen.html':'Reaktionen','gefallen.html':'Gefallen',
    'farben-kombinieren.html':'Farben kombinieren','saetze-bauen.html':'Sätze bauen','schreiben.html':'Schreiben'
  };
  let syncTimer=0;
  let syncing=false;

  function now(){return new Date().toISOString()}
  function clamp(value){return Math.max(0,Math.min(100,Math.round(Number(value)||0)))}
  function isPreview(){
    try{
      if(typeof window.spIsTeacherPreview==='function'&&window.spIsTeacherPreview())return true;
      const a=localStorage.getItem('SP_TEACHER_PREVIEW');
      const b=sessionStorage.getItem('SP_TEACHER_PREVIEW');
      if(a==='1'||b==='1')return true;
      const parsed=JSON.parse(a||b||'null');
      return !!(parsed&&parsed.teacherPreview===true);
    }catch(e){return false}
  }
  function taskPoints(run){return run===1?5:run===2?10:run===3?15:0}
  function examMax(run){return run===1?100:run===2?200:run===3?300:0}
  function blankRun(){return{tasks:{},examBestPercent:0,examPoints:0,examStars:0,completed:false,startedAt:now(),updatedAt:now()}}
  function blankLedger(){return{version:VERSION,themeKey:'A1-L4-T3',currentRun:1,runs:{'1':blankRun()},lifetimePoints:0,revision:0,lastSyncedRevision:0,pending:{tasks:{},exams:{}},migratedLegacy:false,updatedAt:now()}}
  function normalizeLedger(value){
    const ledger=value&&typeof value==='object'?value:blankLedger();
    ledger.version=VERSION;
    ledger.currentRun=Math.max(1,Math.min(3,Math.round(Number(ledger.currentRun)||1)));
    ledger.runs=ledger.runs&&typeof ledger.runs==='object'?ledger.runs:{};
    for(let run=1;run<=ledger.currentRun;run++){
      const key=String(run);
      ledger.runs[key]={...blankRun(),...(ledger.runs[key]||{})};
      ledger.runs[key].tasks=ledger.runs[key].tasks&&typeof ledger.runs[key].tasks==='object'?ledger.runs[key].tasks:{};
    }
    ledger.pending=ledger.pending&&typeof ledger.pending==='object'?ledger.pending:{tasks:{},exams:{}};
    ledger.pending.tasks=ledger.pending.tasks&&typeof ledger.pending.tasks==='object'?ledger.pending.tasks:{};
    ledger.pending.exams=ledger.pending.exams&&typeof ledger.pending.exams==='object'?ledger.pending.exams:{};
    ledger.lifetimePoints=calculateLifetime(ledger);
    return ledger;
  }
  function readLedger(){
    try{return normalizeLedger(JSON.parse(localStorage.getItem(LEDGER_KEY)||'null'))}
    catch(e){return blankLedger()}
  }
  function calculateLifetime(ledger){
    let total=0;
    Object.values(ledger.runs||{}).forEach(run=>{
      Object.values(run.tasks||{}).forEach(task=>{total+=Math.max(0,Number(task.points)||0)});
      total+=Math.max(0,Number(run.examPoints)||0);
    });
    return total;
  }
  function writeLedger(ledger,{schedule=true}={}){
    if(isPreview())return ledger;
    ledger=normalizeLedger(ledger);
    ledger.lifetimePoints=calculateLifetime(ledger);
    ledger.revision=Math.max(0,Number(ledger.revision)||0)+1;
    ledger.updatedAt=now();
    localStorage.setItem(LEDGER_KEY,JSON.stringify(ledger));
    localStorage.setItem(RUN_KEY,String(ledger.currentRun));
    try{window.dispatchEvent(new CustomEvent('l4t3-score-change',{detail:summary()}))}catch(e){}
    if(schedule)scheduleSync();
    return ledger;
  }
  function runData(ledger,run=ledger.currentRun){
    const key=String(run);
    if(!ledger.runs[key])ledger.runs[key]=blankRun();
    return ledger.runs[key];
  }
  function statePercent(state){
    const total=Math.max(0,Number(state&&state.total)||0);
    const done=Array.isArray(state&&state.done)?state.done.length:Math.max(0,Number(state&&state.done)||0);
    return total?clamp(done/total*100):clamp(state&&state.percent);
  }
  function recordTask(file,state){
    if(isPreview())return readLedger();
    const ledger=readLedger();
    const run=ledger.currentRun;
    const data=runData(ledger,run);
    const percent=statePercent(state);
    const old=data.tasks[file]||{percent:0,completed:false,points:0,total:0,done:0};
    const completed=!!old.completed||percent>=100;
    const points=completed?Math.max(Number(old.points)||0,taskPoints(run)):Number(old.points)||0;
    data.tasks[file]={
      ...old,
      file,
      title:TASK_TITLES[file]||file,
      percent:Math.max(clamp(old.percent),percent),
      completed,
      points,
      total:Math.max(Number(old.total)||0,Number(state&&state.total)||0),
      done:Math.max(Number(old.done)||0,Array.isArray(state&&state.done)?state.done.length:Number(state&&state.done)||0),
      updatedAt:now()
    };
    data.updatedAt=now();
    ledger.pending.tasks[run+':'+file]=true;
    return writeLedger(ledger);
  }
  function recordExam(result){
    if(isPreview())return readLedger();
    const ledger=readLedger();
    const run=ledger.currentRun;
    const data=runData(ledger,run);
    const percent=clamp(result&&result.percent);
    if(percent>=Number(data.examBestPercent||0)){
      data.examBestPercent=percent;
      data.examPoints=Math.round(examMax(run)*percent/100);
      data.examStars=Math.max(Number(data.examStars)||0,Number(result&&result.stars)||0);
    }
    data.completed=Number(data.examBestPercent||0)>=100;
    data.updatedAt=now();
    ledger.pending.exams[String(run)]=true;
    return writeLedger(ledger);
  }
  function taskStateCandidates(file){
    const out=[];
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i)||'';
        if(!key.startsWith('SP_L4_T3_V2_')||!key.includes(file))continue;
        try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value)out.push(value)}catch(e){}
      }
      if(typeof window.taskKey==='function'){
        const direct=JSON.parse(localStorage.getItem(window.taskKey(file))||'null');
        if(direct)out.push(direct);
      }
    }catch(e){}
    return out;
  }
  function bestExamPercentFromLegacy(){
    let best=0,stars=0;
    ['SP_L4_T3_EXAM_HISTORY_V1','SP_L4_T3_EXAM_HISTORY_V2_basis','SP_L4_T3_EXAM_HISTORY_V2_advanced'].forEach(key=>{
      try{
        const list=JSON.parse(localStorage.getItem(key)||'[]');
        (Array.isArray(list)?list:[]).forEach(item=>{
          const percent=clamp(item&&item.percent);
          if(percent>best){best=percent;stars=Number(item&&item.stars)||0}
        });
      }catch(e){}
    });
    return{percent:best,stars};
  }
  function migrateAndRecover(){
    if(isPreview())return;
    const ledger=readLedger();
    const targetRun=ledger.migratedLegacy?ledger.currentRun:1;
    const data=runData(ledger,targetRun);
    let changed=false;
    TASK_FILES.forEach(file=>{
      const candidates=taskStateCandidates(file);
      if(!candidates.length)return;
      const best=candidates.reduce((winner,state)=>statePercent(state)>statePercent(winner)?state:winner,candidates[0]);
      const percent=statePercent(best);
      if(percent<=0)return;
      const old=data.tasks[file]||{percent:0,completed:false,points:0,total:0,done:0};
      const completed=!!old.completed||percent>=100;
      data.tasks[file]={...old,file,title:TASK_TITLES[file]||file,percent:Math.max(clamp(old.percent),percent),completed,points:completed?Math.max(Number(old.points)||0,taskPoints(targetRun)):Number(old.points)||0,total:Math.max(Number(old.total)||0,Number(best.total)||0),done:Math.max(Number(old.done)||0,Array.isArray(best.done)?best.done.length:0),updatedAt:now()};
      ledger.pending.tasks[targetRun+':'+file]=true;
      changed=true;
    });
    if(!ledger.migratedLegacy){
      const legacyExam=bestExamPercentFromLegacy();
      if(legacyExam.percent>0){
        data.examBestPercent=Math.max(Number(data.examBestPercent)||0,legacyExam.percent);
        data.examPoints=Math.max(Number(data.examPoints)||0,Math.round(examMax(1)*legacyExam.percent/100));
        data.examStars=Math.max(Number(data.examStars)||0,legacyExam.stars);
        data.completed=data.examBestPercent>=100;
        ledger.pending.exams['1']=true;
        changed=true;
      }
      ledger.migratedLegacy=true;
      changed=true;
    }
    if(changed)writeLedger(ledger);else scheduleSync();
  }
  function clearVisibleProgress(){
    const protectedKeys=new Set([LEDGER_KEY,'SP_L4_T3_COLOR_MODE_V1']);
    const remove=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i)||'';
      if(protectedKeys.has(key))continue;
      if(key.startsWith('SP_L4_T3_V2_')||key.startsWith('SP_L4_T3_EXAM'))remove.push(key);
    }
    remove.forEach(key=>localStorage.removeItem(key));
  }
  function resetPractice(){
    if(!confirm('Möchten Sie den sichtbaren Lernfortschritt löschen? Die bereits verdienten Punkte bleiben erhalten.'))return false;
    clearVisibleProgress();
    location.href='index.html?v=l4t3-ledger1';
    return true;
  }
  function canStartNextRun(){
    const ledger=readLedger();
    const data=runData(ledger);
    return ledger.currentRun<3&&Number(data.examBestPercent||0)>=100;
  }
  function startNextRun(){
    const ledger=readLedger();
    const current=ledger.currentRun;
    const data=runData(ledger,current);
    if(current>=3||Number(data.examBestPercent||0)<100)return false;
    const next=current+1;
    if(!confirm('Runde '+next+' starten? In dieser Runde gibt es '+(next===2?'doppelte':'dreifache')+' Punkte.'))return false;
    ledger.currentRun=next;
    runData(ledger,next);
    clearVisibleProgress();
    writeLedger(ledger);
    location.href='index.html?v=l4t3-ledger1';
    return true;
  }
  function summary(){
    const ledger=readLedger();
    const data=runData(ledger);
    const taskTotal=Object.values(data.tasks||{}).reduce((sum,task)=>sum+(Number(task.points)||0),0);
    return{
      currentRun:ledger.currentRun,
      multiplier:ledger.currentRun,
      runTaskPoints:taskTotal,
      runExamPoints:Number(data.examPoints)||0,
      runPoints:taskTotal+(Number(data.examPoints)||0),
      lifetimePoints:Number(ledger.lifetimePoints)||0,
      examBestPercent:Number(data.examBestPercent)||0,
      canRepeat:canStartNextRun(),
      pending:!!(Object.keys(ledger.pending.tasks||{}).length||Object.keys(ledger.pending.exams||{}).length)
    };
  }
  function summaryHtml(){
    const s=summary();
    const next=s.currentRun<3?s.currentRun+1:null;
    return '<div class="score-ledger-card"><div><b>Punkterunde '+s.currentRun+' von 3</b><div class="small">Aufgaben: '+s.runTaskPoints+' Punkte · Prüfung: '+s.runExamPoints+' Punkte</div></div><div class="score-ledger-total">Gesamt: '+s.lifetimePoints+' Punkte</div>'+(s.pending?'<div class="small">Firebase-Synchronisierung vorgemerkt</div>':'')+(s.canRepeat?'<div class="actions"><button class="btn green" type="button" onclick="L4T3ThemeScore.startNextRun()">Thema wiederholen – Runde '+next+' starten</button></div>':'')+'</div>';
  }
  async function ensureProgressApi(){
    if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')return window.SPProgress;
    try{await import('/js/progress.js?v=l4t3-ledger1')}catch(e){return null}
    return window.SPProgress||null;
  }
  async function syncFirebase(){
    if(isPreview()||syncing)return false;
    const ledger=readLedger();
    const taskKeys=Object.keys(ledger.pending.tasks||{});
    const examKeys=Object.keys(ledger.pending.exams||{});
    if(!taskKeys.length&&!examKeys.length)return true;
    const api=await ensureProgressApi();
    if(!api)return false;
    syncing=true;
    let ok=true;
    try{
      for(const key of taskKeys){
        const split=key.indexOf(':');
        const run=Math.max(1,Math.min(3,Number(key.slice(0,split))||1));
        const file=key.slice(split+1);
        const data=runData(ledger,run);
        const task=data.tasks[file];
        if(!task){delete ledger.pending.tasks[key];continue}
        localStorage.setItem(RUN_KEY,String(run));
        const result=await api.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'4',theme:'3',title:'A1 Lektion 4 · Thema 3',file,taskKey:file,taskTitle:TASK_TITLES[file]||file,total:task.total||1,done:task.done||0,percent:task.percent||0,completed:!!task.completed});
        if(result)delete ledger.pending.tasks[key];else ok=false;
      }
      for(const key of examKeys){
        const run=Math.max(1,Math.min(3,Number(key)||1));
        const data=runData(ledger,run);
        if(!data.examBestPercent){delete ledger.pending.exams[key];continue}
        localStorage.setItem(RUN_KEY,String(run));
        const result=await api.recordExamResult({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'4',theme:'3',title:'A1 Lektion 4 · Thema 3',percent:data.examBestPercent,stars:data.examStars||0});
        if(result)delete ledger.pending.exams[key];else ok=false;
      }
    }catch(e){ok=false}
    finally{
      localStorage.setItem(RUN_KEY,String(ledger.currentRun));
      ledger.lastSyncedRevision=ok?ledger.revision:ledger.lastSyncedRevision;
      ledger.updatedAt=now();
      localStorage.setItem(LEDGER_KEY,JSON.stringify(normalizeLedger(ledger)));
      syncing=false;
    }
    return ok;
  }
  function scheduleSync(){
    clearTimeout(syncTimer);
    syncTimer=setTimeout(syncFirebase,900);
  }

  window.syncTask=function(file,state){return recordTask(file,state)};
  window.syncExam=function(result){return recordExam(result)};
  window.syncReset=function(){return null};
  window.resetThemeProgress=resetPractice;

  window.L4T3ThemeScore={read:readLedger,recordTask,recordExam,summary,summaryHtml,canStartNextRun,startNextRun,resetPractice,syncFirebase,taskPoints,examMax,ledgerKey:LEDGER_KEY};
  migrateAndRecover();
  window.addEventListener('online',scheduleSync);
  window.addEventListener('pagehide',()=>{try{localStorage.setItem(RUN_KEY,String(readLedger().currentRun))}catch(e){}});
  setTimeout(scheduleSync,1400);
})();
