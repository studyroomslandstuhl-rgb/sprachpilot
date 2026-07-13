// Zentrale Speicherlogik für Verben A1.
// Lokal ist die sofortige Wahrheit; Firebase kann später synchronisieren, darf lokale Fortschritte aber nicht zurücksetzen.
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
  function idCandidates(){const p=prof();return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)]).filter(id=>id&&id!=='guest')}
  function canonicalStudentId(){return idCandidates()[0]||fallbackId()||'guest'}
  function canonicalKey(){return 'SP_VERBS_'+canonicalStudentId()}
  function backupKeys(){return ['SP_VERBS_LAST_STATE','SP_VERBS_BACKUP_STATE','SP_VERBS_SESSION_STATE','SP_VERBS_SESSION_BACKUP']}
  function allLocalKeys(){let out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^SP_VERBS_/.test(k)&&!/PENDING|STATUS|DEBUG|SAVE_STATUS/.test(k))out.push(k)}}catch(e){}return uniq([canonicalKey(),...backupKeys(),...out])}
  function isState(x){return x&&typeof x==='object'&&(Array.isArray(x.known)||Array.isArray(x.learned)||Array.isArray(x.active)||Array.isArray(x.unsure)||Array.isArray(x.unknown)||x.skillDone||x.skillAttempts||x.exam||x.manualVerbSelection)}
  function union(){return uniq([].concat(...Array.from(arguments).map(a=>Array.isArray(a)?a:[])))}
  function obj(a,b){return {...(a&&typeof a==='object'&&!Array.isArray(a)?a:{}),...(b&&typeof b==='object'&&!Array.isArray(b)?b:{})}}
  function boolObj(a,b){const out={};Object.keys(a||{}).forEach(k=>out[k]=!!a[k]);Object.keys(b||{}).forEach(k=>out[k]=!!b[k]||!!out[k]);return out}
  function numberObj(a,b){const out={};Object.keys(a||{}).forEach(k=>out[k]=Number(a[k]||0));Object.keys(b||{}).forEach(k=>out[k]=Math.max(Number(out[k]||0),Number(b[k]||0)));return out}
  function nestedBool(a,b){const out={};[a,b].forEach(src=>{Object.keys(src||{}).forEach(v=>{out[v]=boolObj(out[v],src[v])})});return out}
  function nestedNumber(a,b){const out={};[a,b].forEach(src=>{Object.keys(src||{}).forEach(v=>{out[v]=numberObj(out[v],src[v])})});return out}
  function objectOfArrays(a,b){const out={};[a,b].forEach(src=>{Object.keys(src||{}).forEach(k=>{out[k]=union(out[k],Array.isArray(src[k])?src[k]:Object.values(src[k]||{}))})});return out}
  function taskQueuesMerge(a,b){
    const out={};
    [a,b].forEach(src=>{Object.keys(src||{}).forEach(k=>{
      const list=Array.isArray(src[k])?src[k]:Object.values(src[k]||{});
      const seen=new Set((out[k]||[]).map(x=>x&&x.v?x.v+':'+(x.slot||0):JSON.stringify(x)));
      out[k]=out[k]||[];
      list.forEach(x=>{if(!x)return;const item=typeof x==='object'?x:{v:String(x),slot:0};const id=(item.v||'')+':'+(item.slot||0);if(item.v&&!seen.has(id)){seen.add(id);out[k].push(item)}});
    })});
    return out;
  }
  function betterExam(a,b){a=a||{};b=b||{};const as=Number(a.score||0),bs=Number(b.score||0);return (b.passed&&!a.passed)||bs>as?obj(a,b):obj(b,a)}
  function mergeStates(a,b){
    a=a||{};b=b||{};
    const out={...a,...b};
    ['known','learned','assessed','assessmentBatch','currentPackageVerbs','unsure','unknown','active','practicePool','memoryDone','openCards','archivedPackages'].forEach(k=>out[k]=union(a[k],b[k]));
    ['weak','alertsShown','taskRewardsShown'].forEach(k=>out[k]=obj(a[k],b[k]));
    out.skillDone=nestedBool(a.skillDone,b.skillDone);
    out.skillAttempts=nestedNumber(a.skillAttempts,b.skillAttempts);
    out.skillSuccess=nestedNumber(a.skillSuccess,b.skillSuccess);
    out.taskDoneSets=objectOfArrays(a.taskDoneSets,b.taskDoneSets);
    out.taskQueues=taskQueuesMerge(a.taskQueues,b.taskQueues);
    out.exam=betterExam(a.exam,b.exam);
    out.manualVerbSelection=!!(a.manualVerbSelection||b.manualVerbSelection);
    return out;
  }
  function readLocalMerged(){let out={};allLocalKeys().forEach(k=>{const x=readJsonKey(k,null);if(isState(x))out=mergeStates(out,x)});try{const s=readJsonValue(sessionStorage.getItem('SP_VERBS_SESSION_BACKUP'),null);if(isState(s))out=mergeStates(out,s)}catch(e){}return out}
  function ensureArrays(){['known','learned','unsure','unknown','active','practicePool','assessmentBatch','assessed','currentPackageVerbs','memoryDone','openCards','archivedPackages'].forEach(k=>{state[k]=Array.isArray(state[k])?state[k]:[]});['weak','skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets','alertsShown','taskRewardsShown'].forEach(k=>{state[k]=state[k]&&typeof state[k]==='object'&&!Array.isArray(state[k])?state[k]:{}})}
  function normalizeTaskStores(){
    state.taskDoneSets=state.taskDoneSets&&typeof state.taskDoneSets==='object'&&!Array.isArray(state.taskDoneSets)?state.taskDoneSets:{};
    Object.keys(state.taskDoneSets).forEach(k=>{state.taskDoneSets[k]=union(Array.isArray(state.taskDoneSets[k])?state.taskDoneSets[k]:Object.values(state.taskDoneSets[k]||{}))});
    state.taskQueues=state.taskQueues&&typeof state.taskQueues==='object'&&!Array.isArray(state.taskQueues)?state.taskQueues:{};
    Object.keys(state.taskQueues).forEach(k=>{state.taskQueues[k]=taskQueuesMerge({},{[k]:state.taskQueues[k]})[k]||[]});
  }
  function normalizeState(){
    try{ensureArrays();if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){ensureArrays()}
    try{
      normalizeTaskStores();
      state.known=union(state.known,state.learned);
      state.learned=union(state.learned,state.known);
      const base=union(state.active,state.unsure,state.unknown,state.currentPackageVerbs,state.assessmentBatch).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
      state.active=base;
      if(state.manualVerbSelection){
        state.unsure=[];
        state.unknown=base.slice();
        state.assessmentBatch=base.slice();
        state.currentPackageVerbs=base.slice();
        if(!state.practicePool.length)state.practicePool=base.slice();
      }else{
        state.unsure=union(state.unsure,base).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
        state.unknown=uniq(state.unknown).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&!state.unsure.includes(v));
        state.assessmentBatch=union(state.assessmentBatch,base);
        state.currentPackageVerbs=union(state.currentPackageVerbs,state.assessmentBatch,base);
      }
      state.assessed=uniq(state.assessed);
    }catch(e){}
  }
  function writeLocal(st=state){const text=JSON.stringify(st||{});try{localStorage.setItem(canonicalKey(),text)}catch(e){}try{localStorage.setItem('SP_VERBS_LAST_STATE',text)}catch(e){}try{localStorage.setItem('SP_VERBS_BACKUP_STATE',text)}catch(e){}try{sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',text)}catch(e){}try{localStorage.setItem('SP_STUDENT_ID',canonicalStudentId())}catch(e){}}
  function installFastImages(){try{window.preloadActiveImages=function(){};window.loadImageBlobUrl=function(){return Promise.reject(new Error('disabled'))}}catch(e){}}
  if(typeof firebaseStudentId==='function')firebaseStudentId=canonicalStudentId;if(typeof storageKey==='function')storageKey=canonicalKey;
  loadState=async function(){const local=readLocalMerged();if(isState(local))state=mergeStates(state||{},local);try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();window.__SP_VERB_STATE_LOADED=true;writeLocal(state);installFastImages();try{if(typeof window.spSyncVerbRelease==='function')window.spSyncVerbRelease()}catch(e){}};
  saveState=function(){window.__SP_VERB_STATE_LOADED=true;try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();state.localUpdatedAt=Date.now();writeLocal(state)};
  sendProgress=function(){};window.flushVerbProgress=function(){window.__SP_VERB_STATE_LOADED=true;writeLocal(state);return Promise.resolve(true)};window.spVerbStorageSchedule=function(){window.__SP_VERB_STATE_LOADED=true;writeLocal(state)};window.spVerbStorageFlush=window.flushVerbProgress;window.spVerbCloudSync={id:canonicalStudentId,ids:idCandidates,flush:window.flushVerbProgress,status:function(){return {status:'local-stable',loaded:window.__SP_VERB_STATE_LOADED===true,id:canonicalStudentId(),manual:!!(state&&state.manualVerbSelection),active:state&&state.active?state.active:[],taskDoneSets:state&&state.taskDoneSets?state.taskDoneSets:{},time:new Date().toISOString()}},debug:function(){alert(JSON.stringify(this.status(),null,2))}};
  installFastImages();
})();