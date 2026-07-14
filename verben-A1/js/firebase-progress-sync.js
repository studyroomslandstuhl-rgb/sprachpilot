// Verben A1: Firebase ist ein Backup. Ein vorhandener lokaler Fortschritt hat Vorrang.
(function(){
  if(window.__SP_VERB_FIREBASE_PROGRESS_SYNC)return;
  window.__SP_VERB_FIREBASE_PROGRESS_SYNC=true;

  let firebaseMod=null;
  let saveTimer=null;
  let loadingRemote=false;
  let lastSavedText='';

  function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(e){return fallback}}
  function normId(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function uniq(list){return [...new Set((list||[]).filter(Boolean).map(String))]}
  function profileData(){try{return typeof profile!=='undefined'&&profile?profile:(readJson('SP_USER_PROFILE',null)||readJson('SP_STUDENT_PROFILE',{})||{})}catch(e){return readJson('SP_USER_PROFILE',{})||{}}}
  function emailOf(p=profileData()){return String(p.email||'').trim().toLowerCase()}
  function roleOf(p=profileData()){const role=String(p.loginRole||p.role||localStorage.getItem('SP_LOGIN_ROLE')||'student').toLowerCase();return role==='teacher'||role==='lehrer'?'teacher':'student'}
  function ownerSignature(p=profileData()){return roleOf(p)+'|'+(emailOf(p)||normId(p.vorname||p.firstName||p.name||'student'))}
  function courseOf(p=profileData()){return String(p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function fallbackId(p=profileData()){const course=normId(courseOf(p)||'kurs'),person=normId(emailOf(p)||p.vorname||p.firstName||p.name||'student');return course&&person?course+'_'+person:''}
  function persistedOwnerId(){
    const id=String(localStorage.getItem('SP_VERB_OWNER_ID')||'').trim();
    const savedSig=String(localStorage.getItem('SP_VERB_OWNER_SIGNATURE')||'');
    const sig=ownerSignature();
    return id&&(!savedSig||!sig||savedSig===sig)?id:'';
  }
  function studentId(){
    const p=profileData();
    return persistedOwnerId()||fallbackId(p)||String(p.docId||p.studentId||p.userId||p.uid||p.id||localStorage.getItem('SP_STUDENT_ID')||'').trim();
  }
  function idCandidates(){
    const p=profileData();
    return uniq([studentId(),persistedOwnerId(),fallbackId(p),p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID')]).filter(id=>id&&id!=='guest');
  }
  function isTeacherPreview(){const p=profileData();const role=roleOf(p);return role==='teacher'||p.teacherPreview===true||p.isTeacher===true||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
  function canSync(){return !!studentId()&&!isTeacherPreview()&&!window.SP_NO_FIREBASE_SYNC&&!window.SP_PERFORMANCE_MODE}
  async function firebase(){
    if(firebaseMod)return firebaseMod;
    firebaseMod=await import('/js/firebase.js?v=verbs-progress-3');
    try{if(firebaseMod.authReady)await Promise.race([firebaseMod.authReady,new Promise(resolve=>setTimeout(resolve,2500))])}catch(e){}
    return firebaseMod;
  }

  function union(){return uniq([].concat(...Array.from(arguments).map(value=>Array.isArray(value)?value:[])))}
  function objectValue(value){return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}
  function mergeObjects(remote,local){return {...objectValue(remote),...objectValue(local)}}
  function arrayStore(value){return Array.isArray(value)?value:Object.values(objectValue(value))}
  function mergeArrayObjects(remote,local){
    const out={};
    [remote,local].forEach(src=>Object.keys(objectValue(src)).forEach(key=>{out[key]=union(out[key],arrayStore(src[key]))}));
    return out;
  }
  function mergeNestedBooleans(remote,local){
    const out={};
    [remote,local].forEach(src=>Object.keys(objectValue(src)).forEach(verb=>{
      out[verb]=out[verb]||{};
      Object.keys(objectValue(src[verb])).forEach(skill=>{out[verb][skill]=!!(out[verb][skill]||src[verb][skill])});
    }));
    return out;
  }
  function mergeNestedNumbers(remote,local){
    const out={};
    [remote,local].forEach(src=>Object.keys(objectValue(src)).forEach(verb=>{
      out[verb]=out[verb]||{};
      Object.keys(objectValue(src[verb])).forEach(skill=>{out[verb][skill]=Math.max(Number(out[verb][skill]||0),Number(src[verb][skill]||0))});
    }));
    return out;
  }
  function packageOf(src){
    if(!src||typeof src!=='object')return [];
    for(const list of [src.currentPackageVerbs,src.active,src.assessmentBatch,src.practicePool]){
      const pkg=uniq(Array.isArray(list)?list:[]).slice(0,20);
      if(pkg.length)return pkg;
    }
    return [];
  }
  function samePackage(a,b){a=uniq(a).sort();b=uniq(b).sort();return a.length===b.length&&a.every((value,index)=>value===b[index])}
  function countDoneSets(src){let count=0;Object.values(objectValue(src&&src.taskDoneSets)).forEach(list=>{count+=arrayStore(list).length});return count}
  function stateWeight(src){
    if(!src||typeof src!=='object')return 0;
    return packageOf(src).length*20+countDoneSets(src)*10+union(src.known,src.learned).length*30+arrayStore(src.archivedPackages).length*100+Number(src.exam&&src.exam.score||0);
  }
  function stateStamp(src){return Math.max(Number(src&&src.localUpdatedAt||0),Number(src&&src.firebaseUpdatedAt||0),Number(src&&src.updatedAtMs||0))}
  function mergeArchives(remote,local){
    const out=[],seen=new Set();
    [remote,local].forEach(list=>arrayStore(list).forEach(item=>{
      if(!item||typeof item!=='object')return;
      const verbs=Array.isArray(item.verbs)?item.verbs:(Array.isArray(item.practiced)?item.practiced:[]);
      const key=JSON.stringify([item.completedAt||item.date||'',Number(item.examScore||0),verbs]);
      if(seen.has(key))return;
      seen.add(key);out.push(item);
    }));
    return out;
  }
  function betterExam(remote,local){
    remote=objectValue(remote);local=objectValue(local);
    const remoteScore=Number(remote.score||0),localScore=Number(local.score||0);
    return remoteScore>localScore?{...local,...remote}:{...remote,...local};
  }
  function protectKnown(remoteKnown,localKnown,activePackage){
    const active=new Set(activePackage);
    return union(localKnown,(remoteKnown||[]).filter(v=>!active.has(v)));
  }
  function filterStoresToPackage(out,pkg){
    if(!pkg.length)return;
    const allowed=new Set(pkg);
    Object.keys(objectValue(out.taskDoneSets)).forEach(key=>{out.taskDoneSets[key]=arrayStore(out.taskDoneSets[key]).filter(item=>allowed.has(String(item).split(':')[0]))});
    Object.keys(objectValue(out.taskErrorSets)).forEach(key=>{out.taskErrorSets[key]=arrayStore(out.taskErrorSets[key]).filter(v=>allowed.has(String(v)))});
    Object.keys(objectValue(out.taskQueues)).forEach(key=>{const seen=new Set();out.taskQueues[key]=arrayStore(out.taskQueues[key]).filter(item=>item&&allowed.has(item.v)&&!seen.has(item.v)&&(seen.add(item.v)||true))});
  }
  function mergeRemoteIntoLocal(local,remote){
    local=local&&typeof local==='object'?local:{};
    remote=remote&&typeof remote==='object'?remote:{};
    if(!stateWeight(local))return {...remote,ownerId:studentId(),ownerSignature:ownerSignature(),ownerEmail:emailOf()};

    const localPkg=packageOf(local),remotePkg=packageOf(remote);
    const same=localPkg.length&&samePackage(localPkg,remotePkg);
    const out={...remote,...local};
    const protectedKnown=protectKnown(union(remote.known,remote.learned),union(local.known,local.learned),localPkg);
    out.known=protectedKnown;
    out.learned=protectedKnown.slice();
    out.archivedPackages=mergeArchives(remote.archivedPackages,local.archivedPackages);
    out.assessed=union(remote.assessed,local.assessed);
    out.weak=mergeObjects(remote.weak,local.weak);
    out.alertsShown=mergeObjects(remote.alertsShown,local.alertsShown);
    out.taskRewardsShown=mergeObjects(remote.taskRewardsShown,local.taskRewardsShown);

    if(same){
      out.skillDone=mergeNestedBooleans(remote.skillDone,local.skillDone);
      out.skillAttempts=mergeNestedNumbers(remote.skillAttempts,local.skillAttempts);
      out.skillSuccess=mergeNestedNumbers(remote.skillSuccess,local.skillSuccess);
      out.taskDoneSets=mergeArrayObjects(remote.taskDoneSets,local.taskDoneSets);
      out.taskErrorSets=mergeArrayObjects(remote.taskErrorSets,local.taskErrorSets);
      out.taskQueues=Object.keys(objectValue(local.taskQueues)).length?objectValue(local.taskQueues):objectValue(remote.taskQueues);
      out.exam=betterExam(remote.exam,local.exam);
    }else{
      out.skillDone=objectValue(local.skillDone);
      out.skillAttempts=objectValue(local.skillAttempts);
      out.skillSuccess=objectValue(local.skillSuccess);
      out.taskDoneSets=objectValue(local.taskDoneSets);
      out.taskErrorSets=objectValue(local.taskErrorSets);
      out.taskQueues=objectValue(local.taskQueues);
      out.exam=objectValue(local.exam);
    }

    out.active=localPkg.slice();
    out.currentPackageVerbs=localPkg.slice();
    out.assessmentBatch=localPkg.slice();
    out.practicePool=Array.isArray(local.practicePool)&&local.practicePool.length?local.practicePool.filter(v=>localPkg.includes(v)):localPkg.slice();
    out.unsure=uniq(local.unsure).filter(v=>localPkg.includes(v));
    out.unknown=uniq(local.unknown).filter(v=>localPkg.includes(v)&&!out.unsure.includes(v));
    out.localUpdatedAt=Math.max(Number(local.localUpdatedAt||0),Number(remote.localUpdatedAt||0));
    out.firebaseUpdatedAt=Math.max(Number(local.firebaseUpdatedAt||0),Number(remote.firebaseUpdatedAt||0));
    out.ownerId=studentId();out.ownerSignature=ownerSignature();out.ownerEmail=emailOf();
    filterStoresToPackage(out,localPkg);
    return out;
  }
  function compactState(src){
    const keep=['phase','known','learned','unsure','unknown','active','practicePool','archivedPackages','assessmentBatch','assessed','currentPackageVerbs','weak','skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets','taskErrorSets','alertsShown','taskRewardsShown','packageNo','assessmentStart','assessmentTries','revealed','exam','manualVerbSelection','localUpdatedAt','firebaseUpdatedAt','ownerId','ownerSignature','ownerEmail'];
    const out={};keep.forEach(key=>{if(src&&src[key]!==undefined)out[key]=src[key]});return out;
  }
  async function readRemote(){
    if(!canSync())return null;
    const mod=await firebase();
    const candidates=[];
    for(const id of idCandidates()){
      try{
        const snap=await Promise.race([mod.getDoc(mod.doc(mod.db,'progress',id)),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),2200))]);
        if(!snap.exists())continue;
        const data=snap.data()||{};
        const remote=data.verbenA1&&data.verbenA1.state;
        if(remote)candidates.push({remote,id,time:stateStamp(remote)||Number(data.verbenA1&&data.verbenA1.updatedAtMs||0),weight:stateWeight(remote),primary:id===studentId()});
      }catch(e){}
    }
    if(!candidates.length)return null;
    candidates.sort((a,b)=>Number(b.primary)-Number(a.primary)||(b.time-a.time)||(b.weight-a.weight));
    return candidates[0].remote;
  }
  async function writeRemoteNow(){
    if(!canSync()||loadingRemote||typeof state==='undefined'||!state)return;
    const mod=await firebase(),id=studentId();
    if(!id)return;
    const p=profileData(),snapshot=compactState(state);
    snapshot.firebaseUpdatedAt=Date.now();snapshot.ownerId=id;snapshot.ownerSignature=ownerSignature();snapshot.ownerEmail=emailOf();
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
  function scheduleRemoteSave(){if(!canSync())return;clearTimeout(saveTimer);saveTimer=setTimeout(()=>writeRemoteNow().catch(e=>console.warn('Verben Firebase speichern fehlgeschlagen',e)),900)}

  const oldLoadState=window.loadState||loadState;
  const oldSaveState=window.saveState||saveState;
  window.loadState=loadState=async function(){
    if(typeof oldLoadState==='function')await oldLoadState();
    if(!canSync())return;
    loadingRemote=true;
    try{
      const remote=await readRemote();
      if(remote){
        state=mergeRemoteIntoLocal(state||{},remote);
        try{if(typeof migrateState==='function')migrateState()}catch(e){}
        window.__SP_VERB_STATE_LOADED=true;
        if(typeof oldSaveState==='function')oldSaveState();
      }
    }catch(e){console.warn('Verben Firebase laden fehlgeschlagen',e)}
    finally{loadingRemote=false;scheduleRemoteSave()}
  };
  window.saveState=saveState=function(){if(typeof oldSaveState==='function')oldSaveState();scheduleRemoteSave()};
  const oldFlush=window.flushVerbProgress;
  window.flushVerbProgress=function(){try{if(typeof oldFlush==='function')oldFlush()}catch(e){}return writeRemoteNow().catch(e=>console.warn('Verben Firebase Direkt-Speichern fehlgeschlagen',e))};
})();