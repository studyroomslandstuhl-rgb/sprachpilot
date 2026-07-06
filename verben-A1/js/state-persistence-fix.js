// Verhindert, dass ein alter Firebase-Stand lokale neue Verben überschreibt.
(function(){
  function u(list){return [...new Set((list||[]).filter(Boolean))]}
  function union(){return u([].concat(...Array.from(arguments).map(a=>Array.isArray(a)?a:[])))}
  function mergeMap(a,b){return {...(a||{}),...(b||{})}}
  function mergeNested(a,b){const out={...(a||{})};Object.keys(b||{}).forEach(k=>out[k]={...(out[k]||{}),...(b[k]||{})});return out}
  function cleanVerbState(){
    if(typeof state==='undefined')return;
    state.known=u(state.known);
    state.learned=union(state.learned,state.known);
    state.known=union(state.known,state.learned);
    state.unsure=u(state.unsure).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
    state.unknown=u(state.unknown).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&!state.unsure.includes(v));
    state.active=u(state.active).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&((state.unsure||[]).includes(v)||(state.unknown||[]).includes(v)));
    state.assessmentBatch=u(state.assessmentBatch).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
    state.currentPackageVerbs=u(state.currentPackageVerbs).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
    state.assessed=u(state.assessed);
  }
  function mergeState(local,remote){
    local=local||{};remote=remote||{};
    const merged={...remote,...local};
    ['known','learned','assessed','assessmentBatch','currentPackageVerbs','memoryDone','openCards','unsure','unknown','active','practicePool'].forEach(k=>merged[k]=union(remote[k],local[k]));
    merged.archivedPackages=union(remote.archivedPackages,local.archivedPackages);
    ['weak','alertsShown','taskRewardsShown'].forEach(k=>merged[k]=mergeMap(remote[k],local[k]));
    ['skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets'].forEach(k=>merged[k]=mergeNested(remote[k],local[k]));
    return merged;
  }
  const oldNormalize=typeof normalizeVerbStatusLists==='function'?normalizeVerbStatusLists:null;
  normalizeVerbStatusLists=function(){if(oldNormalize)oldNormalize();cleanVerbState()};
  loadState=async function(){
    let local=null;
    try{local=JSON.parse(localStorage.getItem(storageKey())||'null');if(local)state={...state,...local}}catch(e){}
    migrateState();
    const sid=firebaseStudentId();
    if(sid&&db){
      try{
        const snap=await db.collection('progress').doc(sid).get();
        if(snap.exists){
          const data=snap.data()||{};
          const remote=(data.verben&&data.verben.state)||null;
          if(remote){state=mergeState(local||state,remote);migrateState();localStorage.setItem(storageKey(),JSON.stringify(state));if(typeof sendProgress==='function')sendProgress()}
        }
      }catch(e){console.warn('Firebase Laden fehlgeschlagen',e)}
    }
  };
  saveState=function(){migrateState();state.localUpdatedAt=Date.now();localStorage.setItem(storageKey(),JSON.stringify(state));if(typeof sendProgress==='function')sendProgress()};
  window.addEventListener('pagehide',()=>{try{saveState();if(typeof window.flushVerbProgress==='function')window.flushVerbProgress()}catch(e){}});
})();