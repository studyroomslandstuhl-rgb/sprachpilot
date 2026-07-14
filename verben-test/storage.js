function primaryOwnerId(){
  const direct=String(profile?.docId||profile?.studentId||profile?.userId||profile?.uid||profile?.id||'').trim();
  if(direct)return direct.replaceAll('/','-');
  return legacyOwnerId();
}
function legacyOwnerId(){
  const course=profile?.courseDocId||profile?.courseCode||profile?.kurs||profile?.kursnummer||'kurs';
  const person=profile?.email||profile?.vorname||profile?.firstName||'student';
  return slug(course+'_'+person,'-')||'guest';
}
function ownerCandidates(){return uniq([primaryOwnerId(),legacyOwnerId()]).filter(id=>id&&id!=='guest')}
ownerId=function(){return primaryOwnerId()||'guest'};
storageKey=function(){return `SP_VERBEN_TEST_V1_${ownerId()}`};
backupKey=function(){return `SP_VERBEN_TEST_BACKUP_V1_${ownerId()}`};
function candidateLocalKeys(){return uniq(ownerCandidates().flatMap(id=>[`SP_VERBEN_TEST_V1_${id}`,`SP_VERBEN_TEST_BACKUP_V1_${id}`]))}
function readLocalCandidate(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
function stateRank(value){const normalized=normalizeState(value||defaultState());return[stateWeight(normalized),Number(normalized.revision||0),Number(normalized.updatedAt||0)]}
function compareRank(a,b){const ar=stateRank(a),br=stateRank(b);for(let i=0;i<ar.length;i++){if(ar[i]!==br[i])return ar[i]-br[i]}return 0}
function mergeArchives(a,b){const map=new Map();[...(a||[]),...(b||[])].forEach(item=>{if(!item||typeof item!=='object')return;const id=String(item.id||item.completedAt||JSON.stringify(item.verbs||[]));const old=map.get(id);if(!old||Number(item.completedAt||0)>=Number(old.completedAt||0))map.set(id,clone(item))});return [...map.values()]}
function mergeSamePackage(a,b){
  const newer=Number(a.revision||0)>Number(b.revision||0)||Number(a.updatedAt||0)>=Number(b.updatedAt||0)?a:b;
  const older=newer===a?b:a;
  const out=clone(newer);
  out.verbs=uniq([...(a.verbs||[]),...(b.verbs||[])]).slice(0,PACKAGE_SIZE);
  out.taskProgress={};out.taskPoints={};out.taskRuntime=clone(newer.taskRuntime||{});
  TASKS.forEach(task=>{
    out.taskProgress[task.id]=uniq([...(a.taskProgress?.[task.id]||[]),...(b.taskProgress?.[task.id]||[])]).filter(v=>out.verbs.includes(v));
    out.taskPoints[task.id]=out.taskProgress[task.id].length===out.verbs.length&&out.verbs.length?5:Math.max(Number(a.taskPoints?.[task.id]||0),Number(b.taskPoints?.[task.id]||0));
  });
  out.examBest=Math.max(Number(a.examBest||0),Number(b.examBest||0));
  out.examAttempts=Math.max(Number(a.examAttempts||0),Number(b.examAttempts||0));
  out.examRun=newer.examRun||older.examRun||null;
  out.revision=Math.max(Number(a.revision||0),Number(b.revision||0));
  return out;
}
function mergeStates(local,remote){
  local=normalizeState(local||defaultState());remote=normalizeState(remote||defaultState());
  const out=compareRank(local,remote)>=0?clone(local):clone(remote);
  out.learned=uniq([...(local.learned||[]),...(remote.learned||[])]).filter(v=>catalogByVerb.has(v));
  out.archives=mergeArchives(local.archives,remote.archives);
  const lp=local.activePackage,rp=remote.activePackage;
  if(lp&&rp&&lp.id===rp.id)out.activePackage=mergeSamePackage(lp,rp);
  else if(lp&&rp)out.activePackage=compareRank(local,remote)>=0?clone(lp):clone(rp);
  else out.activePackage=clone(lp||rp||null);
  const newerAssessment=Number(local.updatedAt||0)>=Number(remote.updatedAt||0)?local.assessment:remote.assessment;
  out.assessment=clone(newerAssessment||{queue:[],index:0,selected:[]});
  out.revision=Math.max(Number(local.revision||0),Number(remote.revision||0));
  out.updatedAt=Math.max(Number(local.updatedAt||0),Number(remote.updatedAt||0));
  return normalizeState(out);
}
loadLocal=function(){
  const candidates=candidateLocalKeys().map(readLocalCandidate).filter(Boolean);
  if(!candidates.length)return normalizeState(defaultState());
  return normalizeState(candidates.reduce((best,item)=>compareRank(item,best)>0?item:best,candidates[0]));
};
persistLocal=function(){
  state=normalizeState(state);state.revision++;state.updatedAt=now();if(state.activePackage)state.activePackage.revision=(state.activePackage.revision||0)+1;
  const text=JSON.stringify(state);
  localStorage.setItem(storageKey(),text);localStorage.setItem(backupKey(),text);
  const legacy=legacyOwnerId();if(legacy&&legacy!==ownerId())localStorage.setItem(`SP_VERBEN_TEST_BACKUP_V1_${legacy}`,text);
  scheduleRemoteSave();
};
saveRemote=async function(){
  if(isTeacher()||!profile||window.SP_NO_FIREBASE_SYNC)return;
  const tools=await firebaseTools(),id=ownerId();if(!id||id==='guest')return;
  const snapshot=clone(state);
  await tools.setDoc(tools.doc(tools.db,'progress',id),{courseCode:profile.courseCode||profile.kurs||profile.kursnummer||'',email:profile.email||'',verbenTestV1:{state:snapshot,revision:snapshot.revision,updatedAtMs:now()},lastPage:location.pathname,lastActive:tools.serverTimestamp(),updatedAt:tools.serverTimestamp()},{merge:true});
};
restoreRemoteIfNeeded=async function(){
  if(remoteLoaded||isTeacher()||!profile||window.SP_NO_FIREBASE_SYNC)return;remoteLoaded=true;
  try{
    const tools=await firebaseTools();let remote=null;
    for(const id of ownerCandidates()){
      try{const snap=await Promise.race([tools.getDoc(tools.doc(tools.db,'progress',id)),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),2200))]);if(!snap.exists())continue;const candidate=snap.data()?.verbenTestV1?.state;if(candidate)remote=remote?mergeStates(remote,candidate):normalizeState(candidate)}catch(e){}
    }
    if(!remote){scheduleRemoteSave();return}
    const merged=mergeStates(state,remote),changed=JSON.stringify(merged)!==JSON.stringify(state);
    state=merged;if(changed){persistLocal();renderRoute()}else if(state.revision>=remote.revision)scheduleRemoteSave();
  }catch(e){}
};
window.VERBEN_TEST_STORAGE={ownerId,ownerCandidates,mergeStates,keys:candidateLocalKeys};
