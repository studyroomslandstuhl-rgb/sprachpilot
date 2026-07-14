// Verben A1: stabile lokale Speicherung pro Schüler.
// Eine spätere Profil-Synchronisierung darf den Speicherschlüssel nicht mehr wechseln.
(function(){
  window.__SP_VERB_STATE_LOADED=false;

  function readJsonValue(value,fallback){try{return JSON.parse(value||'')||fallback}catch(e){return fallback}}
  function readJsonKey(key,fallback){return readJsonValue(localStorage.getItem(key),fallback)}
  function normId(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function uniq(list){return [...new Set((list||[]).filter(Boolean).map(String))]}
  function prof(){try{return typeof profile!=='undefined'&&profile?profile:(readJsonKey('SP_USER_PROFILE',null)||readJsonKey('SP_STUDENT_PROFILE',{})||{})}catch(e){return readJsonKey('SP_USER_PROFILE',{})||{}}}
  function emailOf(p=prof()){return String(p.email||'').trim().toLowerCase()}
  function roleOf(p=prof()){const role=String(p.loginRole||p.role||localStorage.getItem('SP_LOGIN_ROLE')||'student').trim().toLowerCase();return role==='teacher'||role==='lehrer'?'teacher':'student'}
  function courseOf(p=prof()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function ownerSignature(p=prof()){
    const email=emailOf(p);
    if(email)return roleOf(p)+'|'+email;
    const person=normId(p.vorname||p.firstName||p.name||'student');
    return roleOf(p)+'|'+person;
  }
  function fallbackId(p=prof()){
    const course=normId(p.courseDocId||courseOf(p)||'kurs');
    const person=normId(emailOf(p)||p.vorname||p.firstName||p.name||'student');
    return course&&person?course+'_'+person:'';
  }
  function profileIds(p=prof()){return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,fallbackId(p)]).filter(id=>id&&id!=='guest')}
  function persistedOwnerId(){
    const currentSig=ownerSignature();
    const storedSig=String(localStorage.getItem('SP_VERB_OWNER_SIGNATURE')||'');
    const storedId=String(localStorage.getItem('SP_VERB_OWNER_ID')||'').trim();
    return storedId&&(!storedSig||!currentSig||storedSig===currentSig)?storedId:'';
  }
  function canonicalStudentId(){
    const p=prof(),signature=ownerSignature(p);
    let id=persistedOwnerId();
    if(!id)id=fallbackId(p)||profileIds(p)[0]||String(localStorage.getItem('SP_STUDENT_ID')||'').trim()||'guest';
    try{
      localStorage.setItem('SP_VERB_OWNER_ID',id);
      localStorage.setItem('SP_VERB_OWNER_SIGNATURE',signature);
      localStorage.setItem('SP_STUDENT_ID',id);
    }catch(e){}
    return id;
  }
  function idCandidates(){
    const p=prof();
    return uniq([canonicalStudentId(),persistedOwnerId(),fallbackId(p),...profileIds(p),localStorage.getItem('SP_STUDENT_ID')]).filter(id=>id&&id!=='guest');
  }
  function canonicalKey(){return 'SP_VERBS_'+canonicalStudentId()}
  function candidateKeys(){return uniq(idCandidates().map(id=>'SP_VERBS_'+id))}
  function backupKeys(){return ['SP_VERBS_LAST_STATE','SP_VERBS_BACKUP_STATE','SP_VERBS_SESSION_STATE','SP_VERBS_SESSION_BACKUP']}
  function isState(value){return value&&typeof value==='object'&&!Array.isArray(value)}
  function firstPackage(src){
    if(!src||typeof src!=='object')return [];
    const lists=[src.currentPackageVerbs,src.active,src.assessmentBatch,src.practicePool];
    for(const list of lists){const out=uniq(Array.isArray(list)?list:[]).slice(0,20);if(out.length)return out}
    return [];
  }
  function arrayCount(value){return Array.isArray(value)?value.length:Object.keys(value&&typeof value==='object'?value:{}).length}
  function nestedTrueCount(value){
    let count=0;
    Object.values(value&&typeof value==='object'?value:{}).forEach(row=>Object.values(row&&typeof row==='object'?row:{}).forEach(v=>{if(v===true)count++}));
    return count;
  }
  function stateWeight(src){
    if(!isState(src))return 0;
    let done=0;
    Object.values(src.taskDoneSets&&typeof src.taskDoneSets==='object'?src.taskDoneSets:{}).forEach(list=>{done+=arrayCount(list)});
    return firstPackage(src).length*20+done*10+nestedTrueCount(src.skillDone)*5+arrayCount(src.known)*30+arrayCount(src.learned)*30+arrayCount(src.archivedPackages)*100+arrayCount(src.assessed)+Number(src.exam&&src.exam.score||0);
  }
  function stamp(src){
    if(!src||typeof src!=='object')return 0;
    const values=[src.localUpdatedAt,src.firebaseUpdatedAt,src.updatedAtMs,src.savedAt];
    for(const value of values){const n=Number(value);if(Number.isFinite(n)&&n>0)return n}
    const parsed=Date.parse(src.updatedAt||src.lastActiveAt||'');
    return Number.isFinite(parsed)?parsed:0;
  }
  function ownerMatches(src,sourceKey){
    if(!isState(src))return false;
    const signature=ownerSignature();
    if(src.ownerSignature&&String(src.ownerSignature)===signature)return true;
    if(src.ownerEmail&&emailOf()&&String(src.ownerEmail).toLowerCase()===emailOf())return true;
    if(src.ownerId&&idCandidates().includes(String(src.ownerId)))return true;
    if(candidateKeys().includes(sourceKey))return true;
    return !src.ownerId&&!src.ownerSignature&&!src.ownerEmail;
  }
  function collectLocalCandidates(){
    const entries=[];
    candidateKeys().forEach((key,index)=>{
      const value=readJsonKey(key,null);
      if(isState(value)&&ownerMatches(value,key))entries.push({value,key,index,time:stamp(value),weight:stateWeight(value),canonical:key===canonicalKey()});
    });
    backupKeys().forEach((key,index)=>{
      const value=key==='SP_VERBS_SESSION_BACKUP'?readJsonValue(sessionStorage.getItem(key),null):readJsonKey(key,null);
      if(isState(value)&&ownerMatches(value,key))entries.push({value,key,index:index+100,time:stamp(value),weight:stateWeight(value),canonical:false});
    });
    return entries;
  }
  function readLocalStable(){
    const entries=collectLocalCandidates();
    if(!entries.length)return {};
    const meaningful=entries.filter(entry=>entry.weight>0);
    const pool=meaningful.length?meaningful:entries;
    pool.sort((a,b)=>(b.time-a.time)||(b.weight-a.weight)||Number(b.canonical)-Number(a.canonical)||(a.index-b.index));
    return pool[0].value||{};
  }
  function ensureArrays(){
    ['known','learned','unsure','unknown','active','practicePool','assessmentBatch','assessed','currentPackageVerbs','memoryDone','openCards','archivedPackages'].forEach(key=>{state[key]=Array.isArray(state[key])?state[key]:[]});
    ['weak','skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets','taskErrorSets','alertsShown','taskRewardsShown'].forEach(key=>{state[key]=state[key]&&typeof state[key]==='object'&&!Array.isArray(state[key])?state[key]:{}});
  }
  function arrayStore(value){return uniq(Array.isArray(value)?value:Object.values(value||{}))}
  function normalizeTaskStores(pkg){
    if(!pkg.length)return;
    const allowed=new Set(pkg);
    state.taskDoneSets=state.taskDoneSets&&typeof state.taskDoneSets==='object'&&!Array.isArray(state.taskDoneSets)?state.taskDoneSets:{};
    Object.keys(state.taskDoneSets).forEach(key=>{state.taskDoneSets[key]=arrayStore(state.taskDoneSets[key]).filter(item=>allowed.has(String(item).split(':')[0]))});
    state.taskErrorSets=state.taskErrorSets&&typeof state.taskErrorSets==='object'&&!Array.isArray(state.taskErrorSets)?state.taskErrorSets:{};
    Object.keys(state.taskErrorSets).forEach(key=>{state.taskErrorSets[key]=arrayStore(state.taskErrorSets[key]).filter(v=>allowed.has(String(v)))});
    state.taskQueues=state.taskQueues&&typeof state.taskQueues==='object'&&!Array.isArray(state.taskQueues)?state.taskQueues:{};
    Object.keys(state.taskQueues).forEach(key=>{
      const seen=new Set();
      state.taskQueues[key]=(Array.isArray(state.taskQueues[key])?state.taskQueues[key]:Object.values(state.taskQueues[key]||{})).filter(item=>{
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
    if(pkg.length){
      const allowed=new Set(pkg);
      state.active=pkg.slice();
      state.currentPackageVerbs=pkg.slice();
      state.assessmentBatch=pkg.slice();
      if(!Array.isArray(state.practicePool)||!state.practicePool.length)state.practicePool=pkg.slice();
      else state.practicePool=uniq(state.practicePool).filter(v=>allowed.has(v));
      state.unsure=uniq(state.unsure).filter(v=>allowed.has(v));
      state.unknown=uniq(state.unknown).filter(v=>allowed.has(v)&&!state.unsure.includes(v));
      if(!state.unsure.length&&!state.unknown.length)state.unknown=pkg.slice();
      normalizeTaskStores(pkg);
    }
    state.assessed=uniq(state.assessed);
    try{if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){}
  }
  function snapshotForWrite(src=state){
    return {...(src||{}),ownerId:canonicalStudentId(),ownerSignature:ownerSignature(),ownerEmail:emailOf(),localUpdatedAt:Number(src&&src.localUpdatedAt||Date.now())};
  }
  function writeLocal(src=state){
    const snapshot=snapshotForWrite(src);
    const text=JSON.stringify(snapshot);
    try{candidateKeys().forEach(key=>localStorage.setItem(key,text))}catch(e){}
    try{localStorage.setItem(canonicalKey(),text)}catch(e){}
    try{localStorage.setItem('SP_VERBS_LAST_STATE',text)}catch(e){}
    try{localStorage.setItem('SP_VERBS_BACKUP_STATE',text)}catch(e){}
    try{sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',text)}catch(e){}
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
    state.ownerSignature=ownerSignature();
    state.ownerEmail=emailOf();
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
    status:function(){return {status:'local-stable-v3',loaded:window.__SP_VERB_STATE_LOADED===true,id:canonicalStudentId(),keys:candidateKeys(),active:state&&state.active?state.active:[],taskDoneSets:state&&state.taskDoneSets?state.taskDoneSets:{},time:new Date().toISOString()}},
    debug:function(){alert(JSON.stringify(this.status(),null,2))}
  };
  window.addEventListener('pagehide',()=>{try{saveState()}catch(e){}});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')try{saveState()}catch(e){}});
  installFastImages();
})();