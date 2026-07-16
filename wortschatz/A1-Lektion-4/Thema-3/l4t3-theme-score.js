(function(){
  'use strict';

  const LEDGER_KEY='SP_THEME_SCORE_A1_L4_T3_V1';
  const TOPIC_ID='wortschatz-a1-lektion-4-thema-3';
  const RUN_KEY='SP_SCORE_RUN_'+TOPIC_ID;
  const MODE_KEY='SP_L4_T3_COLOR_MODE_V1';
  const VERSION=2;
  const TASK_FILES=['karteikarten.html','hoeren.html','farben.html','memory.html','gegenteile.html','kein.html','reaktionen.html','gefallen.html','farben-kombinieren.html','saetze-bauen.html','schreiben.html'];
  const MODE_TASKS=new Set(['karteikarten.html','hoeren.html','farben.html','gefallen.html','farben-kombinieren.html','saetze-bauen.html','schreiben.html']);
  const TASK_TITLES={
    'karteikarten.html':'Karteikarten','hoeren.html':'Hören','farben.html':'Farben','memory.html':'Gegenteile-Memory',
    'gegenteile.html':'Gegenteile','kein.html':'nicht / kein','reaktionen.html':'Reaktionen','gefallen.html':'Gefallen',
    'farben-kombinieren.html':'Farben kombinieren','saetze-bauen.html':'Sätze bauen','schreiben.html':'Schreiben'
  };
  let syncTimer=0;
  let syncing=false;

  function now(){return new Date().toISOString()}
  function clamp(value){return Math.max(0,Math.min(100,Math.round(Number(value)||0)))}
  function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'{}')||{}}catch(e){return{}}}
  function roleOf(profile){return String(profile&&(profile.role||profile.type||profile.typ||profile.accountType||profile.loginRole)||'').toLowerCase()}
  function activeRole(profile){
    const stored=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_AUTH_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();
    if(['student','schueler','schüler'].includes(stored))return'student';
    if(['teacher','lehrer','admin','owner'].includes(stored))return'teacher';
    const role=roleOf(profile);
    if(['student','schueler','schüler'].includes(role)||profile.isStudent===true||profile.student===true||profile.schueler===true)return'student';
    if(['teacher','lehrer','admin','owner'].includes(role)||profile.isTeacher===true||profile.teacher===true||profile.lehrer===true)return'teacher';
    if((profile.kurs||profile.kursnummer||profile.courseCode)&&(profile.muttersprache||profile.nativeLanguage||profile.language))return'student';
    return'student';
  }
  function readPreviewFlag(){
    for(const storage of [sessionStorage,localStorage]){
      try{
        const raw=storage.getItem('SP_TEACHER_PREVIEW');
        if(raw==='1')return true;
        if(raw&&raw!=='0'){
          const parsed=JSON.parse(raw);
          if(parsed&&parsed.teacherPreview===true)return true;
        }
      }catch(e){}
    }
    return false;
  }
  function clearStalePreview(){
    try{
      localStorage.removeItem('SP_TEACHER_PREVIEW');
      sessionStorage.removeItem('SP_TEACHER_PREVIEW');
      localStorage.removeItem('SP_PREVIEW_COURSE');
      sessionStorage.removeItem('SP_PREVIEW_COURSE');
      sessionStorage.removeItem('SP_TEACHER_MODE_WAS_ACTIVE');
    }catch(e){}
  }
  function isPreview(){
    try{
      if(typeof window.spIsTeacherPreview==='function')return !!window.spIsTeacherPreview();
      if(!readPreviewFlag())return false;
      if(activeRole(readProfile())!=='teacher'){
        clearStalePreview();
        return false;
      }
      return true;
    }catch(e){return false}
  }
  function currentMode(){
    try{
      const query=new URLSearchParams(location.search).get('colors');
      if(query==='basis'||query==='advanced')return query;
      return localStorage.getItem(MODE_KEY)==='advanced'?'advanced':'basis';
    }catch(e){return'basis'}
  }
  function taskPoints(run){return run===1?5:run===2?10:run===3?15:0}
  function examMax(run){return run===1?100:run===2?200:run===3?300:0}
  function blankRun(){return{tasks:{},examBestPercent:0,examPoints:0,examStars:0,completed:false,startedAt:now(),updatedAt:now()}}
  function blankLedger(){return{version:VERSION,themeKey:'A1-L4-T3',currentRun:1,runs:{'1':blankRun()},lifetimePoints:0,revision:0,lastSyncedRevision:0,pending:{tasks:{},exams:{}},migratedLegacy:false,updatedAt:now()}}
  function calculateLifetime(ledger){
    let total=0;
    Object.values(ledger.runs||{}).forEach(run=>{
      Object.values(run.tasks||{}).forEach(task=>{total+=Math.max(0,Number(task.points)||0)});
      total+=Math.max(0,Number(run.examPoints)||0);
    });
    return total;
  }
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
  function runData(ledger,run=ledger.currentRun){
    const key=String(run);
    if(!ledger.runs[key])ledger.runs[key]=blankRun();
    return ledger.runs[key];
  }
  function summaryFromLedger(ledger){
    ledger=normalizeLedger(ledger);
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
      canRepeat:ledger.currentRun<3&&Number(data.examBestPercent||0)>=100,
      pending:!!(Object.keys(ledger.pending.tasks||{}).length||Object.keys(ledger.pending.exams||{}).length),
      preview:isPreview()
    };
  }
  function writeLedger(ledger,{schedule=true,dispatch=true}={}){
    if(isPreview())return normalizeLedger(ledger);
    ledger=normalizeLedger(ledger);
    ledger.lifetimePoints=calculateLifetime(ledger);
    ledger.revision=Math.max(0,Number(ledger.revision)||0)+1;
    ledger.updatedAt=now();
    localStorage.setItem(LEDGER_KEY,JSON.stringify(ledger));
    localStorage.setItem(RUN_KEY,String(ledger.currentRun));
    if(dispatch){
      try{window.dispatchEvent(new CustomEvent('l4t3-score-change',{detail:summaryFromLedger(ledger)}))}catch(e){}
    }
    if(schedule)scheduleSync();
    return ledger;
  }
  function statePercent(state){
    const total=Math.max(0,Number(state&&state.total)||0);
    const done=Array.isArray(state&&state.done)?state.done.length:Math.max(0,Number(state&&state.done)||0);
    return total?clamp(done/total*100):clamp(state&&state.percent);
  }
  function taskSnapshot(state){
    return{
      percent:statePercent(state),
      total:Math.max(0,Number(state&&state.total)||0),
      done:Array.isArray(state&&state.done)?state.done.length:Math.max(0,Number(state&&state.done)||0)
    };
  }
  function applyTaskState(ledger,run,file,state){
    const data=runData(ledger,run);
    const snap=taskSnapshot(state);
    const old=data.tasks[file]||{percent:0,completed:false,points:0,total:0,done:0};
    const completed=!!old.completed||snap.percent>=100;
    const next={
      ...old,
      file,
      title:TASK_TITLES[file]||file,
      percent:Math.max(clamp(old.percent),snap.percent),
      completed,
      points:completed?Math.max(Number(old.points)||0,taskPoints(run)):Number(old.points)||0,
      total:Math.max(Number(old.total)||0,snap.total),
      done:Math.max(Number(old.done)||0,snap.done),
      updatedAt:now()
    };
    const changed=Number(old.percent||0)!==next.percent||!!old.completed!==next.completed||Number(old.points||0)!==next.points||Number(old.total||0)!==next.total||Number(old.done||0)!==next.done;
    if(changed){
      data.tasks[file]=next;
      data.updatedAt=now();
      ledger.pending.tasks[run+':'+file]=true;
    }
    return changed;
  }
  function recordTask(file,state){
    if(isPreview())return readLedger();
    const ledger=readLedger();
    applyTaskState(ledger,ledger.currentRun,file,state);
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
  function readState(key){
    try{
      const value=JSON.parse(localStorage.getItem(key)||'null');
      return value&&typeof value==='object'?value:null;
    }catch(e){return null}
  }
  function taskStateCandidates(file){
    const preferred=[];
    const legacy=[];
    const mode=currentMode();
    const suffix='_'+mode;
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i)||'';
        if(!key.startsWith('SP_L4_T3_V2_')||!key.includes(file))continue;
        const value=readState(key);
        if(!value)continue;
        if(!MODE_TASKS.has(file)){preferred.push(value);continue}
        if(key.endsWith(suffix))preferred.push(value);
        else if(!key.endsWith('_basis')&&!key.endsWith('_advanced'))legacy.push(value);
      }
      if(typeof window.taskKey==='function'){
        const direct=readState(window.taskKey(file));
        if(direct)preferred.push(direct);
      }
    }catch(e){}
    return preferred.length?preferred:legacy;
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
  function reconcileFromTaskStates(){
    if(isPreview())return readLedger();
    const ledger=readLedger();
    const run=ledger.currentRun;
    let changed=false;
    TASK_FILES.forEach(file=>{
      if(file==='farben-kombinieren.html'&&currentMode()!=='basis')return;
      const candidates=taskStateCandidates(file);
      if(!candidates.length)return;
      const best=candidates.reduce((winner,state)=>statePercent(state)>statePercent(winner)?state:winner,candidates[0]);
      if(statePercent(best)<=0)return;
      if(applyTaskState(ledger,run,file,best))changed=true;
    });
    if(!ledger.migratedLegacy){
      const legacyExam=bestExamPercentFromLegacy();
      const data=runData(ledger,1);
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
    return changed?writeLedger(ledger):ledger;
  }
  function clearVisibleProgress(){
    const protectedKeys=new Set([LEDGER_KEY,MODE_KEY]);
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
    location.href='index.html?colors='+currentMode()+'&v=l4t3-score-repair2';
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
    location.href='index.html?colors='+currentMode()+'&v=l4t3-score-repair2';
    return true;
  }
  function summary(){return summaryFromLedger(readLedger())}
  function summaryHtml(){
    const s=summary();
    if(s.preview)return '<div class="score-ledger-card"><div><b>Lehrer-Vorschau</b><div class="small">In der Vorschau werden keine Schülerpunkte vergeben.</div></div></div>';
    const next=s.currentRun<3?s.currentRun+1:null;
    return '<div class="score-ledger-card"><div><b>Punkterunde '+s.currentRun+' von 3</b><div class="small">Aufgaben: '+s.runTaskPoints+' Punkte · Prüfung: '+s.runExamPoints+' Punkte</div></div><div class="score-ledger-total">Gesamt: '+s.lifetimePoints+' Punkte</div>'+(s.pending?'<div class="small">Firebase-Synchronisierung vorgemerkt</div>':'')+(s.canRepeat?'<div class="actions"><button class="btn green" type="button" onclick="L4T3ThemeScore.startNextRun()">Thema wiederholen – Runde '+next+' starten</button></div>':'')+'</div>';
  }
  async function ensureProgressApi(){
    if(window.SPProgress&&typeof window.SPProgress.recordTaskProgress==='function')return window.SPProgress;
    try{await import('/js/progress.js?v=l4t3-score-repair2')}catch(e){return null}
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
      try{window.dispatchEvent(new CustomEvent('l4t3-score-change',{detail:summaryFromLedger(ledger)}))}catch(e){}
    }
    return ok;
  }
  function scheduleSync(){
    clearTimeout(syncTimer);
    syncTimer=setTimeout(syncFirebase,900);
  }
  function clearStalePreviewIfStudent(){
    if(readPreviewFlag()&&activeRole(readProfile())!=='teacher')clearStalePreview();
  }

  window.syncTask=function(file,state){return recordTask(file,state)};
  window.syncExam=function(result){return recordExam(result)};
  window.syncReset=function(){return null};
  window.resetThemeProgress=resetPractice;
  window.L4T3ThemeScore={read:readLedger,recordTask,recordExam,reconcile:reconcileFromTaskStates,summary,summaryHtml,canStartNextRun,startNextRun,resetPractice,syncFirebase,taskPoints,examMax,ledgerKey:LEDGER_KEY};

  clearStalePreviewIfStudent();
  reconcileFromTaskStates();
  window.addEventListener('online',scheduleSync);
  window.addEventListener('storage',event=>{if(event&&String(event.key||'').startsWith('SP_L4_T3_V2_'))reconcileFromTaskStates()});
  window.addEventListener('pagehide',()=>{try{localStorage.setItem(RUN_KEY,String(readLedger().currentRun))}catch(e){}});
  setTimeout(scheduleSync,1400);
})();
