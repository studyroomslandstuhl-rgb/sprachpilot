// EINZIGE zentrale Speicherlogik für Verben A1.
// Auf Übungsseiten: lokal speichern, keine Hintergrund-Firebase, keine schweren Bild-Fallbacks.
(function(){
  function safeJsonValue(v,f){try{return JSON.parse(v||'')||f}catch(e){return f}}
  function safeJsonKey(k,f){return safeJsonValue(localStorage.getItem(k),f)}
  function normId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
  function prof(){try{return typeof profile!=='undefined'&&profile?profile:(safeJsonKey('SP_USER_PROFILE',null)||safeJsonKey('SP_STUDENT_PROFILE',{})||{})}catch(e){return safeJsonKey('SP_USER_PROFILE',{})||{}}}
  function courseOf(p=prof()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function emailOf(p=prof()){return String(p.email||'').trim().toLowerCase()}
  function fallbackId(p=prof()){const c=normId(p.courseDocId||courseOf(p)||'kurs'),e=normId(emailOf(p)||p.vorname||p.firstName||p.name||'student');return c&&e?c+'_'+e:''}
  function idCandidates(){const p=prof();return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)]).filter(id=>id&&id!=='guest')}
  function canonicalStudentId(){return idCandidates()[0]||fallbackId()||'guest'}
  function canonicalKey(){return 'SP_VERBS_'+canonicalStudentId()}
  function backupKeys(){return ['SP_VERBS_LAST_STATE','SP_VERBS_BACKUP_STATE','SP_VERBS_SESSION_STATE']}
  function allLocalKeys(){let out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^SP_VERBS_/.test(k)&&!/PENDING|STATUS|DEBUG|SAVE_STATUS/.test(k))out.push(k)}}catch(e){}return uniq([canonicalKey(),...backupKeys(),...out])}
  function isState(x){return x&&typeof x==='object'&&(Array.isArray(x.known)||Array.isArray(x.learned)||Array.isArray(x.active)||Array.isArray(x.unsure)||Array.isArray(x.unknown)||x.skillDone||x.skillAttempts||x.exam)}
  function union(){return uniq([].concat(...Array.from(arguments).map(a=>Array.isArray(a)?a:[])))}
  function obj(a,b){return {...(a&&typeof a==='object'?a:{}),...(b&&typeof b==='object'?b:{})}}
  function deep(a,b){const out=obj(a,b);Object.keys(a||{}).forEach(k=>out[k]=obj(a[k],out[k]));Object.keys(b||{}).forEach(k=>out[k]=obj(out[k],b[k]));return out}
  function betterExam(a,b){a=a||{};b=b||{};const as=Number(a.score||0),bs=Number(b.score||0);return (b.passed&&!a.passed)||bs>as?obj(a,b):obj(b,a)}
  function mergeStates(a,b){
    a=a||{};b=b||{};
    const out={...a,...b};
    ['known','learned','assessed','assessmentBatch','currentPackageVerbs','unsure','unknown','active','practicePool','memoryDone','openCards','archivedPackages'].forEach(k=>out[k]=union(a[k],b[k]));
    ['weak','alertsShown','taskRewardsShown'].forEach(k=>out[k]=obj(a[k],b[k]));
    ['skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets'].forEach(k=>out[k]=deep(a[k],b[k]));
    out.exam=betterExam(a.exam,b.exam);
    return out;
  }
  function readLocalMerged(){let out={};allLocalKeys().forEach(k=>{const x=safeJsonKey(k,null);if(isState(x))out=mergeStates(out,x)});try{const s=safeJsonValue(sessionStorage.getItem('SP_VERBS_SESSION_BACKUP'),null);if(isState(s))out=mergeStates(out,s)}catch(e){}return out}
  function normalizeState(){
    try{if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){}
    try{
      state.known=union(state.known,state.learned);
      state.learned=union(state.learned,state.known);
      state.unsure=uniq(state.unsure).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
      state.unknown=uniq(state.unknown).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&!state.unsure.includes(v));
      state.active=uniq(state.active).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&((state.unsure||[]).includes(v)||(state.unknown||[]).includes(v)));
      state.assessmentBatch=uniq(state.assessmentBatch).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
      state.currentPackageVerbs=uniq(state.currentPackageVerbs).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
      state.assessed=uniq(state.assessed);
    }catch(e){}
  }
  function writeLocal(st=state){
    const text=JSON.stringify(st||{});
    try{localStorage.setItem(canonicalKey(),text)}catch(e){}
    try{localStorage.setItem('SP_VERBS_LAST_STATE',text)}catch(e){}
    try{localStorage.setItem('SP_VERBS_BACKUP_STATE',text)}catch(e){}
    try{sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',text)}catch(e){}
    try{localStorage.setItem('SP_STUDENT_ID',canonicalStudentId())}catch(e){}
  }
  function installFastImages(){
    try{
      window.preloadActiveImages=function(){};
      window.loadImageBlobUrl=function(){return Promise.reject(new Error('disabled'))};
      window.hydrateImages=function(root=document){
        const boxes=[...root.querySelectorAll('[data-verb]')].filter(box=>!box.dataset.loaded);
        const visible=boxes.filter(box=>!box.closest('details:not([open])')).slice(0,60);
        visible.forEach(box=>{
          box.dataset.loaded='1';
          const v=box.getAttribute('data-verb')||'';
          let file='';
          try{file=(typeof imageFileCandidates==='function'?imageFileCandidates(v)[0]:'')||''}catch(e){}
          if(!file){box.innerHTML="<span class='image-fallback'>Bild</span>";return;}
          const img=document.createElement('img');
          img.alt=v;
          img.loading='lazy';
          img.decoding='async';
          img.onerror=function(){box.innerHTML="<span class='image-fallback'>Bild fehlt</span>";box.classList.add('image-missing')};
          img.onload=function(){box.classList.add('image-loaded')};
          img.src='/assets/img/'+file+(file.includes('?')?'&':'?')+'v=fast14';
          box.textContent='';
          box.appendChild(img);
        });
      };
      window.renderAndHydrate=function(){setTimeout(()=>window.hydrateImages(document),120)};
      document.addEventListener('toggle',e=>{if(e.target&&e.target.matches&&e.target.matches('details[open]'))setTimeout(()=>window.hydrateImages(e.target),80)},true);
    }catch(e){}
  }
  if(typeof firebaseStudentId==='function')firebaseStudentId=canonicalStudentId;
  if(typeof storageKey==='function')storageKey=canonicalKey;
  loadState=async function(){
    const local=readLocalMerged();
    if(isState(local))state=mergeStates(state||{},local);
    try{if(typeof migrateState==='function')migrateState()}catch(e){}
    normalizeState();
    writeLocal(state);
    installFastImages();
  };
  saveState=function(){
    try{if(typeof migrateState==='function')migrateState()}catch(e){}
    normalizeState();
    state.localUpdatedAt=Date.now();
    writeLocal(state);
  };
  sendProgress=function(){};
  window.flushVerbProgress=function(){writeLocal(state);return Promise.resolve(true)};
  window.spVerbStorageSchedule=function(){writeLocal(state)};
  window.spVerbStorageFlush=window.flushVerbProgress;
  window.spVerbCloudSync={id:canonicalStudentId,ids:idCandidates,flush:window.flushVerbProgress,status:function(){return {status:'local-only',id:canonicalStudentId(),time:new Date().toISOString()}},debug:function(){alert(JSON.stringify(this.status(),null,2))}};
  installFastImages();
})();