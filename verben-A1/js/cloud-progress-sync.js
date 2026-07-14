// Zentrale lokale Speicherlogik für Verben A1.
// Der neueste Zustand des aktuell eingeloggten Schülers ist die Wahrheit.
// Alte Backups und Zustände anderer Schüler dürfen aktive Pakete nicht vermischen.
(function(){
  window.__SP_VERB_STATE_LOADED=false;

  function readJsonValue(v,f){try{return JSON.parse(v||'')||f}catch(e){return f}}
  function readJsonKey(k,f){return readJsonValue(localStorage.getItem(k),f)}
  function normId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
  function prof(){try{return typeof profile!=='undefined'&&profile?profile:(readJsonKey('SP_USER_PROFILE',null)||readJsonKey('SP_STUDENT_PROFILE',{})||{})}catch(e){return readJsonKey('SP_USER_PROFILE',{})||{}}}
  function courseOf(p=prof()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function emailOf(p=prof()){return String(p.email||'').trim().toLowerCase()}
  function fallbackId(p=prof()){const c=normId(p.courseDocId||courseOf(p)||'kurs'),e=normId(emailOf(p)||p.vorname||p.firstName||p.name||'student');return c&&e?c+'_'+e:''}
  function idCandidates(){const p=prof();return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,fallbackId(p),localStorage.getItem('SP_STUDENT_ID')]).filter(id=>id&&id!=='guest')}
  function canonicalStudentId(){return idCandidates()[0]||fallbackId()||'guest'}
  function canonicalKey(){return 'SP_VERBS_'+canonicalStudentId()}
  function backupKeys(){return ['SP_VERBS_LAST_STATE','SP_VERBS_BACKUP_STATE','SP_VERBS_SESSION_STATE','SP_VERBS_SESSION_BACKUP']}
  function isState(x){return x&&typeof x==='object'&&(Array.isArray(x.known)||Array.isArray(x.learned)||Array.isArray(x.active)||Array.isArray(x.unsure)||Array.isArray(x.unknown)||x.skillDone||x.skillAttempts||x.exam||x.manualVerbSelection)}
  function stamp(x){
    if(!x||typeof x!=='object')return 0;
    const values=[x.localUpdatedAt,x.firebaseUpdatedAt,x.updatedAtMs,x.savedAt];
    for(const value of values){const n=Number(value);if(Number.isFinite(n)&&n>0)return n}
    const d=Date.parse(x.updatedAt||x.lastActiveAt||'');
    return Number.isFinite(d)?d:0;
  }
  function firstPackage(src){
    if(!src||typeof src!=='object')return [];
    const lists=[src.currentPackageVerbs,src.active,src.assessmentBatch,src.practicePool];
    for(const list of lists){const out=uniq(Array.isArray(list)?list:[]).slice(0,20);if(out.length)return out}
    return [];
  }
  function readLocalStable(){
    const owner=canonicalStudentId();
    const canonical=readJsonKey(canonicalKey(),null);
    if(isState(canonical))return canonical;
    const candidates=[];
    backupKeys().forEach((key,index)=>{
      const x=key==='SP_VERBS_SESSION_BACKUP'?readJsonValue(sessionStorage.getItem(key),null):readJsonKey(key,null);
      if(!isState(x))return;
      if(x.ownerId&&String(x.ownerId)!==owner)return;
      candidates.push({x,index,time:stamp(x)});
    });
    candidates.sort((a,b)=>(b.time-a.time)||(a.index-b.index));
    return candidates[0]?.x||{};
  }
  function ensureArrays(){
    ['known','learned','unsure','unknown','active','practicePool','assessmentBatch','assessed','currentPackageVerbs','memoryDone','openCards','archivedPackages'].forEach(k=>{state[k]=Array.isArray(state[k])?state[k]:[]});
    ['weak','skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets','taskErrorSets','alertsShown','taskRewardsShown'].forEach(k=>{state[k]=state[k]&&typeof state[k]==='object'&&!Array.isArray(state[k])?state[k]:{}})
  }
  function arrayStore(value){return uniq(Array.isArray(value)?value:Object.values(value||{}))}
  function normalizeTaskStores(pkg){
    const allowed=new Set(pkg);
    state.taskDoneSets=state.taskDoneSets&&typeof state.taskDoneSets==='object'&&!Array.isArray(state.taskDoneSets)?state.taskDoneSets:{};
    Object.keys(state.taskDoneSets).forEach(k=>{
      state.taskDoneSets[k]=arrayStore(state.taskDoneSets[k]).filter(item=>allowed.has(String(item).split(':')[0]));
    });
    state.taskErrorSets=state.taskErrorSets&&typeof state.taskErrorSets==='object'&&!Array.isArray(state.taskErrorSets)?state.taskErrorSets:{};
    Object.keys(state.taskErrorSets).forEach(k=>{state.taskErrorSets[k]=arrayStore(state.taskErrorSets[k]).filter(v=>allowed.has(String(v)))});
    state.taskQueues=state.taskQueues&&typeof state.taskQueues==='object'&&!Array.isArray(state.taskQueues)?state.taskQueues:{};
    Object.keys(state.taskQueues).forEach(k=>{
      const seen=new Set();
      state.taskQueues[k]=(Array.isArray(state.taskQueues[k])?state.taskQueues[k]:Object.values(state.taskQueues[k]||{})).filter(item=>{
        if(!item||!allowed.has(item.v)||seen.has(item.v))return false;
        seen.add(item.v);return true;
      });
    });
  }
  function normalizeState(){
    ensureArrays();
    state.known=uniq([...state.known,...state.learned]);
    state.learned=state.known.slice();
    const mastered=new Set(state.known);
    let pkg=firstPackage(state).filter(v=>!mastered.has(v)).slice(0,20);
    if(!pkg.length)pkg=uniq([...state.unsure,...state.unknown]).filter(v=>!mastered.has(v)).slice(0,20);
    const allowed=new Set(pkg);
    state.active=pkg.slice();
    state.currentPackageVerbs=pkg.slice();
    state.assessmentBatch=pkg.slice();
    state.practicePool=pkg.slice();
    state.unsure=uniq(state.unsure).filter(v=>allowed.has(v));
    state.unknown=uniq(state.unknown).filter(v=>allowed.has(v)&&!state.unsure.includes(v));
    if(pkg.length&&!state.unsure.length&&!state.unknown.length)state.unknown=pkg.slice();
    state.assessed=uniq(state.assessed);
    normalizeTaskStores(pkg);
    try{if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){}
  }
  function writeLocal(st=state){
    const snapshot={...(st||{}),ownerId:canonicalStudentId()};
    const text=JSON.stringify(snapshot);
    try{localStorage.setItem(canonicalKey(),text)}catch(e){}
    try{localStorage.setItem('SP_VERBS_LAST_STATE',text)}catch(e){}
    try{localStorage.setItem('SP_VERBS_BACKUP_STATE',text)}catch(e){}
    try{sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',text)}catch(e){}
    try{localStorage.setItem('SP_STUDENT_ID',canonicalStudentId())}catch(e){}
  }
  function installFastImages(){try{window.preloadActiveImages=function(){};window.loadImageBlobUrl=function(){return Promise.reject(new Error('disabled'))}}catch(e){}}

  if(typeof firebaseStudentId==='function')firebaseStudentId=canonicalStudentId;
  if(typeof storageKey==='function')storageKey=canonicalKey;

  loadState=async function(){
    const local=readLocalStable();
    if(isState(local))state={...(state||{}),...local};
    try{if(typeof migrateState==='function')migrateState()}catch(e){}
    normalizeState();
    window.__SP_VERB_STATE_LOADED=true;
    writeLocal(state);
    installFastImages();
    try{if(typeof window.spSyncVerbRelease==='function')window.spSyncVerbRelease()}catch(e){}
  };
  saveState=function(){
    window.__SP_VERB_STATE_LOADED=true;
    try{if(typeof migrateState==='function')migrateState()}catch(e){}
    normalizeState();
    state.localUpdatedAt=Date.now();
    state.ownerId=canonicalStudentId();
    writeLocal(state);
  };
  sendProgress=function(){};
  window.flushVerbProgress=function(){window.__SP_VERB_STATE_LOADED=true;saveState();return Promise.resolve(true)};
  window.spVerbStorageSchedule=function(){window.__SP_VERB_STATE_LOADED=true;saveState()};
  window.spVerbStorageFlush=window.flushVerbProgress;
  window.spVerbCloudSync={
    id:canonicalStudentId,
    ids:idCandidates,
    flush:window.flushVerbProgress,
    status:function(){return {status:'local-stable-v2',loaded:window.__SP_VERB_STATE_LOADED===true,id:canonicalStudentId(),active:state&&state.active?state.active:[],taskDoneSets:state&&state.taskDoneSets?state.taskDoneSets:{},time:new Date().toISOString()}},
    debug:function(){alert(JSON.stringify(this.status(),null,2))}
  };
  installFastImages();
})();