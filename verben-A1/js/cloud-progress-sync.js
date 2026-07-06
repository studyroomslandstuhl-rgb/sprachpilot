// Robuste Firebase-Synchronisierung für Verben A1.
(function(){
  function safeJsonValue(v,f){try{return JSON.parse(v||'')||f}catch(e){return f}}
  function safeJsonKey(k,f){return safeJsonValue(localStorage.getItem(k),f)}
  function normId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
  function prof(){try{return typeof profile!=='undefined'&&profile?profile:(safeJsonKey('SP_USER_PROFILE',null)||safeJsonKey('SP_STUDENT_PROFILE',{})||{})}catch(e){return safeJsonKey('SP_USER_PROFILE',{})||{}}}
  function courseOf(p=prof()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function emailOf(p=prof()){return String(p.email||'').trim().toLowerCase()}
  function fallbackId(p=prof()){const c=normId(p.courseDocId||courseOf(p)||'kurs'),e=normId(emailOf(p)||p.vorname||p.firstName||'student');return c&&e?c+'_'+e:''}
  function idCandidates(){const p=prof();return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)]).filter(id=>id&&id!=='guest')}
  function canonicalStudentId(){return idCandidates()[0]||fallbackId()||'guest'}
  function stateKeys(){const ids=idCandidates();return uniq([...ids.map(id=>'SP_VERBS_'+id),'SP_VERBS_LAST_STATE','SP_VERBS_BACKUP_STATE'])}
  function allLocalKeys(){let out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^SP_VERBS_/.test(k)&&!/PENDING|STATUS|DEBUG/.test(k))out.push(k)}}catch(e){}return uniq([...stateKeys(),...out])}
  function isState(x){return x&&typeof x==='object'&&(Array.isArray(x.known)||Array.isArray(x.learned)||Array.isArray(x.active)||x.skillDone||x.skillAttempts||x.exam)}
  function union(){return uniq([].concat(...Array.from(arguments).map(a=>Array.isArray(a)?a:[])))}
  function obj(a,b){return {...(a&&typeof a==='object'?a:{}),...(b&&typeof b==='object'?b:{})}}
  function deep(a,b){const out=obj(a,b);Object.keys(a||{}).forEach(k=>out[k]=obj(a[k],out[k]));Object.keys(b||{}).forEach(k=>out[k]=obj(out[k],b[k]));return out}
  function betterExam(a,b){a=a||{};b=b||{};const as=Number(a.score||0),bs=Number(b.score||0);return (b.passed&&!a.passed)||bs>as?obj(a,b):obj(b,a)}
  function mergeStates(a,b){a=a||{};b=b||{};const out={...a,...b};['known','learned','assessed','assessmentBatch','currentPackageVerbs','unsure','unknown','active','practicePool','memoryDone','openCards'].forEach(k=>out[k]=union(a[k],b[k]));out.archivedPackages=union(a.archivedPackages,b.archivedPackages);['weak','alertsShown','taskRewardsShown','taskQueues','taskDoneSets'].forEach(k=>out[k]=obj(a[k],b[k]));['skillDone','skillAttempts','skillSuccess'].forEach(k=>out[k]=deep(a[k],b[k]));out.exam=betterExam(a.exam,b.exam);return out}
  function stateFromVerben(v){v=v||{};const st=v.state&&typeof v.state==='object'?v.state:{};return mergeStates(st,{known:union(v.known,st.known),learned:union(v.learnedVerbs,st.learned),active:union(v.activeVerbs,st.active),unsure:union(v.unsure,st.unsure),unknown:union(v.unknown,st.unknown),assessed:union(v.assessed,st.assessed),currentPackageVerbs:union(v.currentPackageVerbs,st.currentPackageVerbs),exam:v.exam||st.exam||{}})}
  function readLocalMerged(){let out={};allLocalKeys().forEach(k=>{const x=safeJsonKey(k,null);if(isState(x))out=mergeStates(out,x)});return out}
  function normalizeState(){try{if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){}try{state.known=union(state.known,state.learned);state.learned=union(state.learned,state.known);state.unsure=uniq(state.unsure).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));state.unknown=uniq(state.unknown).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&!state.unsure.includes(v));state.active=uniq(state.active).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&((state.unsure||[]).includes(v)||(state.unknown||[]).includes(v)));state.assessmentBatch=uniq(state.assessmentBatch).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));state.currentPackageVerbs=uniq(state.currentPackageVerbs).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));state.assessed=uniq(state.assessed)}catch(e){}}
  function writeLocal(st=state){const text=JSON.stringify(st||{});stateKeys().forEach(k=>{try{localStorage.setItem(k,text)}catch(e){}});try{sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',text)}catch(e){}}
  function ts(){try{return firebase.firestore.FieldValue.serverTimestamp()}catch(e){return new Date().toISOString()}}
  function clean(v){if(v===undefined||typeof v==='function')return undefined;if(v===null||typeof v==='string'||typeof v==='boolean')return v;if(typeof v==='number')return Number.isFinite(v)?v:0;if(Array.isArray(v))return v.map(clean).filter(x=>x!==undefined);if(typeof v==='object'){if(typeof v.toDate==='function'||v._methodName||v._delegate)return v;const out={};Object.keys(v).forEach(k=>{const c=clean(v[k]);if(c!==undefined)out[k]=c});return out}return String(v||'')}
  function progressPercent(){try{return typeof overall==='function'?Number(overall()||0):0}catch(e){return 0}}
  function starCount(){try{return typeof totalStars==='function'?Number(totalStars()||0):0}catch(e){return 0}}
  async function readCloudMerged(){let merged={};if(typeof db!=='undefined'&&db){for(const id of idCandidates()){try{const snap=await db.collection('progress').doc(id).get();const exists=typeof snap.exists==='function'?snap.exists():!!snap.exists;if(!exists)continue;const data=snap.data?snap.data():{};merged=mergeStates(merged,stateFromVerben(data.verben||{}))}catch(e){console.warn('Verben Cloud lesen fehlgeschlagen',e)}}}return merged}
  async function writeCloud(){
    if(typeof db==='undefined'||!db||canonicalStudentId()==='guest')return false;
    normalizeState();writeLocal(state);
    const p=prof(),sid=canonicalStudentId(),course=courseOf(p),s=clean(state),points=Number(localStorage.getItem('SP_POINTS_TOTAL')||0),progress=progressPercent(),stars=starCount();
    const verben={progress,progressPercent:progress,stars,activeVerbs:s.active||[],learnedVerbs:s.learned||[],known:s.known||[],unsure:s.unsure||[],unknown:s.unknown||[],assessed:s.assessed||[],currentPackageVerbs:s.currentPackageVerbs||[],exam:s.exam||{},state:s,updatedAt:ts()};
    const progressDoc=clean({studentId:sid,userId:sid,docId:sid,email:emailOf(p),studentName:[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' '),kurs:course,kursnummer:course,courseCode:course,courseDocId:p.courseDocId||'',verben,lifetimePoints:points,pointsTotal:points,punkteGesamt:points,lastPage:location.pathname,lastActiveAt:ts(),updatedAt:ts()});
    const studentDoc=clean({studentId:sid,userId:sid,docId:sid,email:emailOf(p),vorname:p.vorname||p.firstName||p.name||'',nachname:p.nachname||p.lastName||'',muttersprache:p.muttersprache||p.fremdsprache||'',kurs:course,kursnummer:course,courseCode:course,courseDocId:p.courseDocId||'',verbenFortschritt:progress,lastActivity:ts(),lastActiveAt:ts(),updatedAt:ts(),active:true,role:'student',loginRole:'student',isStudent:true,isTeacher:false});
    try{await db.collection('progress').doc(sid).set(progressDoc,{merge:true});await db.collection('students').doc(sid).set(studentDoc,{merge:true});localStorage.setItem('SP_VERBS_SAVE_STATUS',JSON.stringify({status:'ok',time:new Date().toISOString(),id:sid,known:(s.known||[]).length,learned:(s.learned||[]).length,active:(s.active||[]).length,progress}));window.dispatchEvent(new CustomEvent('SP_PROGRESS_SYNCED'));return true}catch(e){localStorage.setItem('SP_VERBS_SAVE_STATUS',JSON.stringify({status:'error',time:new Date().toISOString(),id:sid,error:e.code||e.message||String(e)}));console.warn('Verben Cloud speichern fehlgeschlagen',e);return false}
  }
  function dedupeVerbList(list){const seen=new Set();return (list||[]).filter(v=>{v=String(v||'');if(!v||seen.has(v))return false;seen.add(v);return true})}
  function installOverviewDedupe(){try{
    if(typeof verbsByStatus==='function'){
      verbsByStatus=function(){normalizeState();const learned=new Set(dedupeVerbList([...(state.learned||[]),...(state.known||[])]));const active=dedupeVerbList([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[])]).filter(v=>!learned.has(v));const activeSet=new Set(active);const all=dedupeVerbList((ALL_VERBS||[]).map(item=>item.v));const newList=all.filter(v=>!learned.has(v)&&!activeSet.has(v));return{active,learned:[...learned],new:newList}}
    }
  }catch(e){}}
  if(typeof firebaseStudentId==='function')firebaseStudentId=canonicalStudentId;
  if(typeof storageKey==='function')storageKey=function(){return 'SP_VERBS_'+canonicalStudentId()};
  loadState=async function(){
    let local=readLocalMerged();if(isState(local))state=mergeStates(state||{},local);
    try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();writeLocal(state);
    let cloud=await readCloudMerged();state=mergeStates(state||{},cloud);
    try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();writeLocal(state);installOverviewDedupe();setTimeout(writeCloud,500);
  };
  saveState=function(){try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();state.localUpdatedAt=Date.now();writeLocal(state);sendProgress()};
  let timer=null;sendProgress=function(){clearTimeout(timer);timer=setTimeout(writeCloud,300)};
  window.flushVerbProgress=function(){clearTimeout(timer);return writeCloud()};
  window.addEventListener('online',()=>writeCloud());window.addEventListener('pagehide',()=>{try{saveState();writeCloud()}catch(e){}});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){try{saveState();writeCloud()}catch(e){}}});
  setTimeout(()=>{try{const backup=readLocalMerged();if(isState(backup)){state=mergeStates(state||{},backup);normalizeState();writeLocal(state)}installOverviewDedupe()}catch(e){}},300);
  setTimeout(installOverviewDedupe,1000);
  window.spVerbCloudSync={id:canonicalStudentId,ids:idCandidates,flush:writeCloud,status:function(){return safeJsonKey('SP_VERBS_SAVE_STATUS',{})},debug:function(){alert(JSON.stringify(this.status(),null,2))}};
})();