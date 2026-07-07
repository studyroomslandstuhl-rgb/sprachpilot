// EINZIGE zentrale Speicherlogik für Verben A1.
// Zuständig für: storageKey, firebaseStudentId, loadState, saveState, lokale Sicherung und optionalen Cloud-Sync.
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
  function mergeStates(remote,local){
    remote=remote||{};local=local||{};
    const out={...remote,...local};
    ['known','learned','assessed','assessmentBatch','currentPackageVerbs','unsure','unknown','active','practicePool','memoryDone','openCards','archivedPackages'].forEach(k=>out[k]=union(remote[k],local[k]));
    ['weak','alertsShown','taskRewardsShown'].forEach(k=>out[k]=obj(remote[k],local[k]));
    ['skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets'].forEach(k=>out[k]=deep(remote[k],local[k]));
    out.exam=betterExam(remote.exam,local.exam);
    return out;
  }
  function stateFromVerben(v){v=v||{};const st=v.state&&typeof v.state==='object'?v.state:{};return mergeStates(st,{known:union(v.known,st.known),learned:union(v.learnedVerbs,st.learned),active:union(v.activeVerbs,st.active),unsure:union(v.unsure,st.unsure),unknown:union(v.unknown,st.unknown),assessed:union(v.assessed,st.assessed),currentPackageVerbs:union(v.currentPackageVerbs,st.currentPackageVerbs),exam:v.exam||st.exam||{}})}
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
  function canCloud(){
    if(window.SP_PERFORMANCE_MODE||window.SP_NO_FIREBASE_SYNC)return false;
    if(typeof window.spCanWriteFirebaseProgress==='function'&&window.spCanWriteFirebaseProgress()===false)return false;
    return typeof db!=='undefined'&&!!db&&canonicalStudentId()!=='guest';
  }
  function canCloudRead(local){
    const hasLocal=isState(local)&&(['known','learned','active','unsure','unknown','assessed'].some(k=>(local[k]||[]).length)||local.skillDone||local.exam?.passed);
    return typeof db!=='undefined'&&!!db&&canonicalStudentId()!=='guest'&&!hasLocal;
  }
  function ts(){try{return firebase.firestore.FieldValue.serverTimestamp()}catch(e){return new Date().toISOString()}}
  function clean(v){if(v===undefined||typeof v==='function')return undefined;if(v===null||typeof v==='string'||typeof v==='boolean')return v;if(typeof v==='number')return Number.isFinite(v)?v:0;if(Array.isArray(v))return v.map(clean).filter(x=>x!==undefined);if(typeof v==='object'){if(typeof v.toDate==='function'||v._methodName||v._delegate)return v;const out={};Object.keys(v).forEach(k=>{const c=clean(v[k]);if(c!==undefined)out[k]=c});return out}return String(v||'')}
  function progressPercent(){try{return typeof overall==='function'?Number(overall()||0):0}catch(e){return 0}}
  function starCount(){try{return typeof totalStars==='function'?Number(totalStars()||0):0}catch(e){return 0}}
  async function readCloudMerged(){let merged={};if(typeof db!=='undefined'&&db){for(const id of idCandidates().slice(0,2)){try{const snap=await db.collection('progress').doc(id).get();const exists=typeof snap.exists==='function'?snap.exists():!!snap.exists;if(!exists)continue;const data=snap.data?snap.data():{};merged=mergeStates(merged,stateFromVerben(data.verben||{}))}catch(e){console.warn('Verben Cloud lesen fehlgeschlagen',e)}}}return merged}
  let timer=null,lastCloudSig='',writeRunning=false;
  function cloudSig(s=state){try{return JSON.stringify({known:(s.known||[]).length,learned:(s.learned||[]).length,active:(s.active||[]).length,unsure:(s.unsure||[]).length,unknown:(s.unknown||[]).length,assessed:(s.assessed||[]).length,skillDone:s.skillDone||{},exam:s.exam||{},progress:progressPercent(),stars:starCount()})}catch(e){return String(Date.now())}}
  async function writeCloud(force=false){
    if(!canCloud()||writeRunning)return false;
    normalizeState();writeLocal(state);
    const sig=cloudSig(state);if(!force&&sig===lastCloudSig)return false;lastCloudSig=sig;writeRunning=true;
    const p=prof(),sid=canonicalStudentId(),course=courseOf(p),s=clean(state),points=Number(localStorage.getItem('SP_POINTS_TOTAL')||0),progress=progressPercent(),stars=starCount();
    const verben={progress,progressPercent:progress,stars,activeVerbs:s.active||[],learnedVerbs:s.learned||[],known:s.known||[],unsure:s.unsure||[],unknown:s.unknown||[],assessed:s.assessed||[],currentPackageVerbs:s.currentPackageVerbs||[],exam:s.exam||{},state:s,updatedAt:ts()};
    const progressDoc=clean({studentId:sid,userId:sid,docId:sid,email:emailOf(p),studentName:[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' '),kurs:course,kursnummer:course,courseCode:course,courseDocId:p.courseDocId||'',verben,lifetimePoints:points,pointsTotal:points,punkteGesamt:points,lastPage:location.pathname,lastActiveAt:ts(),updatedAt:ts()});
    const studentDoc=clean({studentId:sid,userId:sid,docId:sid,email:emailOf(p),vorname:p.vorname||p.firstName||p.name||'',nachname:p.nachname||p.lastName||'',muttersprache:p.muttersprache||p.fremdsprache||'',kurs:course,kursnummer:course,courseCode:course,courseDocId:p.courseDocId||'',verbenFortschritt:progress,lastActivity:ts(),lastActiveAt:ts(),updatedAt:ts(),active:true,role:'student',loginRole:'student',isStudent:true,isTeacher:false});
    try{await db.collection('progress').doc(sid).set(progressDoc,{merge:true});await db.collection('students').doc(sid).set(studentDoc,{merge:true});localStorage.setItem('SP_VERBS_SAVE_STATUS',JSON.stringify({status:'ok',time:new Date().toISOString(),id:sid,known:(s.known||[]).length,learned:(s.learned||[]).length,active:(s.active||[]).length,progress}));window.dispatchEvent(new CustomEvent('SP_PROGRESS_SYNCED'));return true}catch(e){localStorage.setItem('SP_VERBS_SAVE_STATUS',JSON.stringify({status:'error',time:new Date().toISOString(),id:sid,error:e.code||e.message||String(e)}));console.warn('Verben Cloud speichern fehlgeschlagen',e);return false}finally{writeRunning=false}
  }
  function scheduleCloud(){clearTimeout(timer);timer=setTimeout(()=>writeCloud(false),3500)}
  function flushCloud(){clearTimeout(timer);return writeCloud(true)}
  function installOverviewDedupe(){try{if(typeof verbsByStatus==='function'){verbsByStatus=function(){normalizeState();const learned=new Set(uniq([...(state.learned||[]),...(state.known||[])]));const active=uniq([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[])]).filter(v=>!learned.has(v));const activeSet=new Set(active);const all=uniq((ALL_VERBS||[]).map(item=>item.v));const newList=all.filter(v=>!learned.has(v)&&!activeSet.has(v));return{active,learned:[...learned],new:newList}}}}catch(e){}
  }
  if(typeof firebaseStudentId==='function')firebaseStudentId=canonicalStudentId;
  if(typeof storageKey==='function')storageKey=canonicalKey;
  loadState=async function(){
    let local=readLocalMerged();
    if(isState(local))state=mergeStates(state||{},local);
    try{if(typeof migrateState==='function')migrateState()}catch(e){}
    normalizeState();writeLocal(state);
    if(canCloudRead(local)){
      const cloud=await readCloudMerged();
      if(isState(cloud)){state=mergeStates(cloud,state||{});try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();writeLocal(state)}
    }
    installOverviewDedupe();
  };
  saveState=function(){try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();state.localUpdatedAt=Date.now();writeLocal(state);scheduleCloud()};
  sendProgress=scheduleCloud;
  window.flushVerbProgress=flushCloud;
  window.spVerbStorageSchedule=scheduleCloud;
  window.spVerbStorageFlush=flushCloud;
  window.spVerbCloudSync={id:canonicalStudentId,ids:idCandidates,flush:flushCloud,status:function(){return safeJsonKey('SP_VERBS_SAVE_STATUS',{})},debug:function(){alert(JSON.stringify(this.status(),null,2))}};
})();