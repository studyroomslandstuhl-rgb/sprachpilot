// Zusätzlicher Schutz: Ein intakter Fortschritt darf beim Neuladen nicht auf 0 fallen.
(function(){
  if(window.__SP_VERB_PERSISTENCE_GUARD)return;
  window.__SP_VERB_PERSISTENCE_GUARD=true;

  function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(e){return fallback}}
  function profileData(){try{return typeof profile!=='undefined'&&profile?profile:(readJson('SP_USER_PROFILE',null)||readJson('SP_STUDENT_PROFILE',{})||{})}catch(e){return readJson('SP_USER_PROFILE',{})||{}}}
  function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function signature(){const p=profileData(),role=String(p.loginRole||p.role||localStorage.getItem('SP_LOGIN_ROLE')||'student').toLowerCase(),email=String(p.email||'').trim().toLowerCase();return (role==='teacher'||role==='lehrer'?'teacher':'student')+'|'+(email||norm(p.vorname||p.firstName||p.name||'student'))}
  function key(){return 'SP_VERBS_DURABLE_'+norm(signature())}
  function uniq(list){return [...new Set((list||[]).filter(Boolean).map(String))]}
  function obj(value){return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}
  function arr(value){return Array.isArray(value)?value:Object.values(obj(value))}
  function clone(value){try{return JSON.parse(JSON.stringify(value))}catch(e){return value}}
  function packageOf(src){if(!src||typeof src!=='object')return[];for(const list of [src.currentPackageVerbs,src.active,src.assessmentBatch,src.practicePool]){const pkg=uniq(Array.isArray(list)?list:[]).slice(0,20);if(pkg.length)return pkg}return[]}
  function samePackage(a,b){a=uniq(a).sort();b=uniq(b).sort();return a.length===b.length&&a.every((value,index)=>value===b[index])}
  function doneCount(src){let count=0;Object.values(obj(src&&src.taskDoneSets)).forEach(list=>{count+=arr(list).length});return count}
  function skillDoneCount(src){let count=0;Object.values(obj(src&&src.skillDone)).forEach(row=>Object.values(obj(row)).forEach(value=>{if(value===true)count++}));return count}
  function weight(src){if(!src||typeof src!=='object')return 0;return packageOf(src).length*10+doneCount(src)*20+skillDoneCount(src)*5+uniq([...(src.known||[]),...(src.learned||[])]).length*30+arr(src.archivedPackages).length*100+Number(src.exam&&src.exam.score||0)}
  function resetAt(src){return Math.max(Number(src&&src.explicitResetAt||0),Number(localStorage.getItem('SP_VERBS_EXPLICIT_RESET_AT')||0))}
  function readSnapshot(){const snapshot=readJson(key(),null);if(!snapshot||snapshot.signature!==signature()||!snapshot.state)return null;return snapshot}
  function writeSnapshot(src){
    if(!src||typeof src!=='object')return;
    const snapshot={signature:signature(),savedAt:Date.now(),weight:weight(src),done:doneCount(src),package:packageOf(src),state:clone(src)};
    try{localStorage.setItem(key(),JSON.stringify(snapshot))}catch(e){}
  }
  function shouldRestore(current,snapshot){
    if(!snapshot||!snapshot.state)return false;
    const saved=snapshot.state,currentReset=resetAt(current);
    if(currentReset&&currentReset>=Number(snapshot.savedAt||0))return false;
    const currentPkg=packageOf(current),savedPkg=packageOf(saved);
    if(currentPkg.length&&savedPkg.length&&!samePackage(currentPkg,savedPkg))return false;
    const currentDone=doneCount(current),savedDone=Number(snapshot.done||doneCount(saved));
    const currentWeight=weight(current),savedWeight=Number(snapshot.weight||weight(saved));
    if(savedDone>0&&currentDone===0)return true;
    if(savedWeight>=200&&currentWeight<savedWeight*.35)return true;
    if(!currentPkg.length&&savedPkg.length&&savedWeight>currentWeight)return true;
    return false;
  }
  function restoreSnapshot(snapshot){
    if(!snapshot||!snapshot.state)return false;
    const currentPhase=state&&state.phase;
    state={...(state||{}),...clone(snapshot.state)};
    if(currentPhase&&currentPhase!=='home')state.phase=currentPhase;
    state.persistenceRecoveredAt=Date.now();
    return true;
  }

  const oldLoad=window.loadState||loadState;
  const oldSave=window.saveState||saveState;

  window.loadState=loadState=async function(){
    if(typeof oldLoad==='function')await oldLoad();
    const snapshot=readSnapshot();
    if(shouldRestore(state,snapshot))restoreSnapshot(snapshot);
    if(typeof oldSave==='function')oldSave();
    writeSnapshot(state);
  };
  window.saveState=saveState=function(){
    const snapshot=readSnapshot();
    if(shouldRestore(state,snapshot))restoreSnapshot(snapshot);
    if(typeof oldSave==='function')oldSave();
    writeSnapshot(state);
  };
  window.spAllowVerbProgressReset=function(){
    const at=Date.now();
    try{localStorage.setItem('SP_VERBS_EXPLICIT_RESET_AT',String(at))}catch(e){}
    try{if(typeof state!=='undefined'&&state)state.explicitResetAt=at}catch(e){}
    return at;
  };
  window.spVerbPersistenceGuard={key,signature,weight:()=>weight(state),done:()=>doneCount(state),snapshot:readSnapshot,flush:()=>{saveState();return true}};
  window.addEventListener('pagehide',()=>{try{saveState()}catch(e){}});
})();