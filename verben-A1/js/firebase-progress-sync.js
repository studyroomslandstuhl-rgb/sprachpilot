// Verben A1: Firebase-Speicher mit stabilem aktuellem Paket.
// Fortschritte desselben Pakets werden zusammengeführt; alte andere Pakete werden nicht eingemischt.
(function(){
  if(window.__SP_VERB_FIREBASE_PROGRESS_SYNC)return;
  window.__SP_VERB_FIREBASE_PROGRESS_SYNC=true;

  let firebaseMod=null;
  let saveTimer=null;
  let loadingRemote=false;
  let lastSavedText='';

  function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(e){return fallback}}
  function normId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function uniq(list){return [...new Set((list||[]).filter(Boolean).map(String))]}
  function profileData(){try{return typeof profile!=='undefined'&&profile?profile:(readJson('SP_USER_PROFILE',null)||readJson('SP_STUDENT_PROFILE',{})||{})}catch(e){return readJson('SP_USER_PROFILE',{})||{}}}
  function courseOf(p=profileData()){return String(p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function emailOf(p=profileData()){return String(p.email||'').trim().toLowerCase()}
  function fallbackId(p=profileData()){const c=normId(courseOf(p)||'kurs'),e=normId(emailOf(p)||p.vorname||p.firstName||p.name||'student');return c&&e?c+'_'+e:''}
  function idCandidates(){const p=profileData();return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,fallbackId(p),localStorage.getItem('SP_STUDENT_ID')]).filter(id=>id&&id!=='guest')}
  function studentId(){return idCandidates()[0]||fallbackId()||''}
  function isTeacherPreview(){const p=profileData();const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||p.role||'').toLowerCase();return role==='teacher'||role==='lehrer'||p.teacherPreview===true||p.isTeacher===true||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
  function canSync(){return !!studentId()&&!isTeacherPreview()&&!window.SP_NO_FIREBASE_SYNC&&!window.SP_PERFORMANCE_MODE}
  async function firebase(){
    if(firebaseMod)return firebaseMod;
    firebaseMod=await import('/js/firebase.js?v=verbs-progress-2');
    try{if(firebaseMod.authReady)await Promise.race([firebaseMod.authReady,new Promise(resolve=>setTimeout(resolve,2500))])}catch(e){}
    return firebaseMod;
  }
  function union(){return uniq([].concat(...Array.from(arguments).map(a=>Array.isArray(a)?a:[])))}
  function obj(a,b){return {...(a&&typeof a==='object'&&!Array.isArray(a)?a:{}),...(b&&typeof b==='object'&&!Array.isArray(b)?b:{})}}
  function objectOfArrays(a,b){const out={};[a,b].forEach(src=>{Object.keys(src||{}).forEach(k=>{const list=Array.isArray(src[k])?src[k]:Object.values(src[k]||{});out[k]=union(out[k],list)})});return out}
  function nestedBool(a,b){const out={};[a,b].forEach(src=>{Object.keys(src||{}).forEach(v=>{out[v]=out[v]||{};Object.keys(src[v]||{}).forEach(k=>{out[v][k]=!!(out[v][k]||src[v][k])})})});return out}
  function nestedNumber(a,b){const out={};[a,b].forEach(src=>{Object.keys(src||{}).forEach(v=>{out[v]=out[v]||{};Object.keys(src[v]||{}).forEach(k=>{out[v][k]=Math.max(Number(out[v][k]||0),Number(src[v][k]||0))})})});return out}
  function queueMerge(a,b){const out={};[a,b].forEach(src=>{Object.keys(src||{}).forEach(k=>{out[k]=out[k]||[];const seen=new Set(out[k].map(x=>x&&x.v?x.v:JSON.stringify(x)));const list=Array.isArray(src[k])?src[k]:Object.values(src[k]||{});list.forEach(x=>{if(!x)return;const item=typeof x==='object'?x:{v:String(x),slot:0};if(item.v&&!seen.has(item.v)){seen.add(item.v);out[k].push(item)}})})});return out}
  function mergeArchives(a,b){
    const out=[],seen=new Set();
    [a,b].forEach(list=>(Array.isArray(list)?list:[]).forEach(item=>{
      if(!item||typeof item!=='object')return;
      const verbs=Array.isArray(item.verbs)?item.verbs:(Array.isArray(item.practiced)?item.practiced:[]);
      const id=JSON.stringify([item.completedAt||item.date||'',Number(item.examScore||0),verbs]);
      if(seen.has(id))return;
      seen.add(id);out.push(item);
    }));
    return out;
  }
  function betterExam(a,b){a=a||{};b=b||{};const as=Number(a.score||0),bs=Number(b.score||0);if((b.passed&&!a.passed)||bs>as)return obj(a,b);return obj(b,a)}
  function stateStamp(s){return Math.max(Number(s&&s.localUpdatedAt||0),Number(s&&s.firebaseUpdatedAt||0),Number(s&&s.updatedAtMs||0))}
  function packageOf(s){
    if(!s||typeof s!=='object')return [];
    const lists=[s.currentPackageVerbs,s.active,s.assessmentBatch,s.practicePool];
    for(const list of lists){const out=uniq(Array.isArray(list)?list:[]).slice(0,20);if(out.length)return out}
    return [];
  }
  function samePackage(a,b){a=uniq(a).sort();b=uniq(b).sort();return a.length===b.length&&a.every((v,i)=>v===b[i])}
  function choosePackageState(local,remote){
    const lp=packageOf(local),rp=packageOf(remote);
    if(lp.length&&!rp.length)return local;
    if(rp.length&&!lp.length){
      const mastered=new Set(union(local&&local.known,local&&local.learned));
      if(rp.every(v=>mastered.has(v)))return local;
      return remote;
    }
    if(!lp.length&&!rp.length)return stateStamp(remote)>stateStamp(local)?remote:local;
    if(samePackage(lp,rp))return local;
    return stateStamp(remote)>stateStamp(local)?remote:local;
  }
  function copyObjectOfArrays(src){const out={};Object.keys(src||{}).forEach(k=>{out[k]=union(Array.isArray(src[k])?src[k]:Object.values(src[k]||{}))});return out}
  function copyQueues(src){const out={};Object.keys(src||{}).forEach(k=>{out[k]=queueMerge({},{[k]:src[k]})[k]||[]});return out}
  function filterPackageStores(out,pkg){
    const allowed=new Set(pkg);
    Object.keys(out.taskDoneSets||{}).forEach(k=>{out.taskDoneSets[k]=(out.taskDoneSets[k]||[]).filter(x=>allowed.has(String(x).split(':')[0]))});
    Object.keys(out.taskErrorSets||{}).forEach(k=>{out.taskErrorSets[k]=(out.taskErrorSets[k]||[]).filter(v=>allowed.has(String(v)))});
    Object.keys(out.taskQueues||{}).forEach(k=>{const seen=new Set();out.taskQueues[k]=(out.taskQueues[k]||[]).filter(x=>x&&allowed.has(x.v)&&!seen.has(x.v)&&(seen.add(x.v)||true))});
  }
  function mergeVerbStates(local,remote){
    local=local||{};remote=remote||{};
    const chosen=choosePackageState(local,remote)||local;
    const lp=packageOf(local),rp=packageOf(remote),same=samePackage(lp,rp)&&lp.length>0;
    const out={...remote,...local};
    out.known=union(remote.known,remote.learned,local.known,local.learned);
    out.learned=out.known.slice();
    out.assessed=union(remote.assessed,local.assessed);
    out.archivedPackages=mergeArchives(remote.archivedPackages,local.archivedPackages);
    out.weak=obj(remote.weak,local.weak);
    out.alertsShown=obj(remote.alertsShown,local.alertsShown);
    out.taskRewardsShown=obj(remote.taskRewardsShown,local.taskRewardsShown);
    const pkg=packageOf(chosen).filter(v=>!out.known.includes(v)).slice(0,20);
    out.active=pkg.slice();out.currentPackageVerbs=pkg.slice();out.assessmentBatch=pkg.slice();out.practicePool=pkg.slice();
    out.unsure=uniq(chosen.unsure).filter(v=>pkg.includes(v));
    out.unknown=uniq(chosen.unknown).filter(v=>pkg.includes(v)&&!out.unsure.includes(v));
    if(pkg.length&&!out.unsure.length&&!out.unknown.length)out.unknown=pkg.slice();
    if(same){
      out.skillDone=nestedBool(remote.skillDone,local.skillDone);
      out.skillAttempts=nestedNumber(remote.skillAttempts,local.skillAttempts);
      out.skillSuccess=nestedNumber(remote.skillSuccess,local.skillSuccess);
      out.taskDoneSets=objectOfArrays(remote.taskDoneSets,local.taskDoneSets);
      out.taskErrorSets=objectOfArrays(remote.taskErrorSets,local.taskErrorSets);
      out.taskQueues=queueMerge(remote.taskQueues,local.taskQueues);
      out.exam=betterExam(remote.exam,local.exam);
    }else{
      out.skillDone=obj({},chosen.skillDone);
      out.skillAttempts=obj({},chosen.skillAttempts);
      out.skillSuccess=obj({},chosen.skillSuccess);
      out.taskDoneSets=copyObjectOfArrays(chosen.taskDoneSets);
      out.taskErrorSets=copyObjectOfArrays(chosen.taskErrorSets);
      out.taskQueues=copyQueues(chosen.taskQueues);
      out.exam=obj({},chosen.exam);
    }
    out.manualVerbSelection=!!chosen.manualVerbSelection;
    out.localUpdatedAt=Math.max(Number(local.localUpdatedAt||0),Number(remote.localUpdatedAt||0));
    out.firebaseUpdatedAt=Math.max(Number(local.firebaseUpdatedAt||0),Number(remote.firebaseUpdatedAt||0));
    filterPackageStores(out,pkg);
    return out;
  }
  function compactState(src){
    const s=src||{};
    const keep=['phase','known','learned','unsure','unknown','active','practicePool','archivedPackages','assessmentBatch','assessed','currentPackageVerbs','weak','skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets','taskErrorSets','alertsShown','taskRewardsShown','packageNo','assessmentStart','assessmentTries','revealed','exam','manualVerbSelection','localUpdatedAt','firebaseUpdatedAt','ownerId'];
    const out={};keep.forEach(k=>{if(s[k]!==undefined)out[k]=s[k]});return out;
  }
  async function readRemote(){
    if(!canSync())return null;
    const mod=await firebase();
    let merged=null;
    for(const id of idCandidates()){
      try{
        const snap=await Promise.race([mod.getDoc(mod.doc(mod.db,'progress',id)),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),2500))]);
        if(!snap.exists())continue;
        const data=snap.data()||{};
        const remote=data.verbenA1&&data.verbenA1.state;
        if(remote)merged=merged?mergeVerbStates(merged,remote):remote;
      }catch(e){}
    }
    return merged;
  }
  async function writeRemoteNow(){
    if(!canSync()||loadingRemote||typeof state==='undefined'||!state)return;
    const mod=await firebase();
    const id=studentId();
    if(!id)return;
    const p=profileData();
    const snapshot=compactState(state);
    snapshot.firebaseUpdatedAt=Date.now();
    snapshot.ownerId=id;
    const text=JSON.stringify(snapshot);
    if(text===lastSavedText)return;
    await Promise.race([
      mod.setDoc(mod.doc(mod.db,'progress',id),{
        studentId:id,userId:id,docId:id,canonicalStudentId:id,aliasIds:idCandidates(),
        kurs:p.kurs||p.kursnummer||p.courseCode||'',kursnummer:p.kursnummer||p.kurs||p.courseCode||'',courseCode:p.courseCode||p.kurs||p.kursnummer||'',
        email:p.email||'',muttersprache:p.muttersprache||p.motherLanguage||'',lastPage:location.pathname,lastActive:mod.serverTimestamp(),updatedAt:mod.serverTimestamp(),
        verbenA1:{state:snapshot,updatedAt:mod.serverTimestamp(),updatedAtMs:Date.now()}
      },{merge:true}),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),3000))
    ]);
    lastSavedText=text;
    try{localStorage.setItem('SP_VERBS_FIREBASE_SYNC_AT',String(Date.now()))}catch(e){}
  }
  function scheduleRemoteSave(){
    if(!canSync())return;
    clearTimeout(saveTimer);
    saveTimer=setTimeout(()=>writeRemoteNow().catch(e=>console.warn('Verben Firebase speichern fehlgeschlagen',e)),900);
  }

  const oldLoadState=window.loadState||loadState;
  const oldSaveState=window.saveState||saveState;
  window.loadState=loadState=async function(){
    if(typeof oldLoadState==='function')await oldLoadState();
    if(!canSync())return;
    loadingRemote=true;
    try{
      const remote=await readRemote();
      if(remote){
        state=mergeVerbStates(state||{},remote);
        try{if(typeof migrateState==='function')migrateState()}catch(e){}
        window.__SP_VERB_STATE_LOADED=true;
        if(typeof oldSaveState==='function')oldSaveState();
      }
    }catch(e){console.warn('Verben Firebase laden fehlgeschlagen',e)}
    finally{loadingRemote=false;scheduleRemoteSave()}
  };
  window.saveState=saveState=function(){
    if(typeof oldSaveState==='function')oldSaveState();
    scheduleRemoteSave();
  };
  const oldFlush=window.flushVerbProgress;
  window.flushVerbProgress=function(){
    try{if(typeof oldFlush==='function')oldFlush()}catch(e){}
    return writeRemoteNow().catch(e=>console.warn('Verben Firebase Direkt-Speichern fehlgeschlagen',e));
  };
})();