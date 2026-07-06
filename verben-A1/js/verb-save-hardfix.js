// Hardfix: Verben-Fortschritt darf nach Reload nicht auf 0 zurückfallen.
(function(){
  function j(v,f){try{return JSON.parse(v||'')||f}catch(e){return f}}
  function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
  function normId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function prof(){try{return typeof profile!=='undefined'&&profile?profile:(j(localStorage.getItem('SP_USER_PROFILE'),null)||j(localStorage.getItem('SP_STUDENT_PROFILE'),{})||{})}catch(e){return j(localStorage.getItem('SP_USER_PROFILE'),{})||{}}}
  function course(p=prof()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
  function email(p=prof()){return String(p.email||'').trim().toLowerCase()}
  function fallbackId(p=prof()){const c=normId(p.courseDocId||course(p)||'kurs'),e=normId(email(p)||p.vorname||p.firstName||'student');return c&&e?c+'_'+e:''}
  function ids(){const p=prof();return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)]).filter(x=>x&&x!=='guest')}
  function sid(){return ids()[0]||fallbackId()||'guest'}
  function localKeys(){return uniq([...ids().map(id=>'SP_VERBS_'+id),'SP_VERBS_LAST_STATE','SP_VERBS_BACKUP_STATE'])}
  function isVerbState(x){return x&&typeof x==='object'&&(Array.isArray(x.known)||Array.isArray(x.learned)||Array.isArray(x.active)||x.skillDone||x.skillAttempts||x.exam)}
  function allLocalKeys(){const keys=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^SP_VERBS_/.test(k)&&!/PENDING|STATUS|DEBUG/.test(k))keys.push(k)}}catch(e){}return uniq([...localKeys(),...keys])}
  function union(){return uniq([].concat(...Array.from(arguments).map(x=>Array.isArray(x)?x:[])))}
  function obj(a,b){return {...(a&&typeof a==='object'?a:{}),...(b&&typeof b==='object'?b:{})}}
  function deep(a,b){const out=obj(a,b);Object.keys(a||{}).forEach(k=>out[k]=obj(a[k],out[k]));Object.keys(b||{}).forEach(k=>out[k]=obj(out[k],b[k]));return out}
  function betterExam(a,b){a=a||{};b=b||{};const ap=Number(a.score||0),bp=Number(b.score||0);return bp>ap||b.passed&&!a.passed?obj(a,b):obj(b,a)}
  function merge(a,b){a=a||{};b=b||{};const out={...a,...b};['known','learned','assessed','assessmentBatch','currentPackageVerbs','unsure','unknown','active','practicePool','memoryDone','openCards'].forEach(k=>out[k]=union(a[k],b[k]));out.archivedPackages=union(a.archivedPackages,b.archivedPackages);['weak','alertsShown','taskRewardsShown','taskQueues','taskDoneSets'].forEach(k=>out[k]=obj(a[k],b[k]));['skillDone','skillAttempts','skillSuccess'].forEach(k=>out[k]=deep(a[k],b[k]));out.exam=betterExam(a.exam,b.exam);return out}
  function stateFromVerben(v){v=v||{};const st=v.state&&typeof v.state==='object'?v.state:{};return merge(st,{known:union(v.known,st.known),learned:union(v.learnedVerbs,st.learned),active:union(v.activeVerbs,st.active),unsure:union(v.unsure,st.unsure),unknown:union(v.unknown,st.unknown),assessed:union(v.assessed,st.assessed),currentPackageVerbs:union(v.currentPackageVerbs,st.currentPackageVerbs),exam:v.exam||st.exam||{}})}
  function readLocal(){let out={};allLocalKeys().forEach(k=>{const x=j(localStorage.getItem(k),null);if(isVerbState(x))out=merge(out,x)});return out}
  function normalizeState(){
    if(typeof state==='undefined')return;
    state.known=union(state.known,state.learned);
    state.learned=union(state.learned,state.known);
    state.unsure=uniq(state.unsure).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
    state.unknown=uniq(state.unknown).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&!state.unsure.includes(v));
    state.active=uniq(state.active).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&((state.unsure||[]).includes(v)||(state.unknown||[]).includes(v)));
    state.assessmentBatch=uniq(state.assessmentBatch).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
    state.currentPackageVerbs=uniq(state.currentPackageVerbs).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
    state.assessed=uniq(state.assessed);
  }
  function writeLocal(st){const text=JSON.stringify(st||state||{});localKeys().forEach(k=>{try{localStorage.setItem(k,text)}catch(e){}});try{sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',text)}catch(e){}}
  async function readCloud(){let out={};if(typeof db==='undefined'||!db)return out;for(const id of ids()){try{const snap=await db.collection('progress').doc(id).get();const exists=typeof snap.exists==='function'?snap.exists():!!snap.exists;if(exists){const data=snap.data?snap.data():{};out=merge(out,stateFromVerben(data.verben||{}))}}catch(e){console.warn('Verben Cloud lesen fehlgeschlagen',e)}}return out}
  function progress(){try{return typeof overall==='function'?Number(overall()||0):0}catch(e){return 0}}
  function stars(){try{return typeof totalStars==='function'?Number(totalStars()||0):0}catch(e){return 0}}
  function now(){try{return firebase.firestore.FieldValue.serverTimestamp()}catch(e){return new Date().toISOString()}}
  function clean(x){if(x===undefined||typeof x==='function')return undefined;if(x===null||typeof x==='string'||typeof x==='boolean')return x;if(typeof x==='number')return Number.isFinite(x)?x:0;if(Array.isArray(x))return x.map(clean).filter(v=>v!==undefined);if(typeof x==='object'){if(typeof x.toDate==='function'||x._methodName||x._delegate)return x;const o={};Object.keys(x).forEach(k=>{const v=clean(x[k]);if(v!==undefined)o[k]=v});return o}return String(x||'')}
  async function writeCloud(){
    if(typeof db==='undefined'||!db||sid()==='guest')return false;
    normalizeState();writeLocal(state);
    const p=prof(),id=sid(),c=course(p),s=clean(state),points=Number(localStorage.getItem('SP_POINTS_TOTAL')||0),prog=progress(),star=stars();
    const verben={progress:prog,progressPercent:prog,stars:star,activeVerbs:s.active||[],learnedVerbs:s.learned||[],known:s.known||[],unsure:s.unsure||[],unknown:s.unknown||[],assessed:s.assessed||[],currentPackageVerbs:s.currentPackageVerbs||[],exam:s.exam||{},state:s,updatedAt:now()};
    const progressDoc=clean({studentId:id,userId:id,docId:id,email:email(p),studentName:[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' '),kurs:c,kursnummer:c,courseCode:c,courseDocId:p.courseDocId||'',verben,lifetimePoints:points,pointsTotal:points,punkteGesamt:points,lastPage:location.pathname,lastActiveAt:now(),updatedAt:now()});
    const studentDoc=clean({studentId:id,userId:id,docId:id,email:email(p),vorname:p.vorname||p.firstName||p.name||'',nachname:p.nachname||p.lastName||'',muttersprache:p.muttersprache||'',kurs:c,kursnummer:c,courseCode:c,courseDocId:p.courseDocId||'',verbenFortschritt:prog,lastActivity:now(),updatedAt:now(),active:true,role:'student',loginRole:'student',isStudent:true,isTeacher:false});
    try{await db.collection('progress').doc(id).set(progressDoc,{merge:true});await db.collection('students').doc(id).set(studentDoc,{merge:true});localStorage.setItem('SP_VERBS_SAVE_STATUS',JSON.stringify({status:'ok',at:new Date().toISOString(),id,known:(s.known||[]).length,learned:(s.learned||[]).length,active:(s.active||[]).length,progress:prog}));return true}catch(e){localStorage.setItem('SP_VERBS_SAVE_STATUS',JSON.stringify({status:'error',at:new Date().toISOString(),id,error:e.code||e.message||String(e)}));console.warn('Verben speichern fehlgeschlagen',e);return false}
  }
  if(typeof firebaseStudentId==='function')firebaseStudentId=sid;
  if(typeof storageKey==='function')storageKey=function(){return 'SP_VERBS_'+sid()};
  const oldNormalize=typeof normalizeVerbStatusLists==='function'?normalizeVerbStatusLists:null;
  normalizeVerbStatusLists=function(){if(oldNormalize)oldNormalize();normalizeState()};
  const oldLoad=typeof loadState==='function'?loadState:null;
  loadState=async function(){
    let local=readLocal();
    if(isVerbState(local))state=merge(state,local);
    try{if(typeof migrateState==='function')migrateState()}catch(e){}
    let cloud=await readCloud();
    state=merge(state,cloud);
    try{if(typeof migrateState==='function')migrateState()}catch(e){}
    normalizeState();writeLocal(state);
    setTimeout(writeCloud,500);
  };
  saveState=function(){try{if(typeof migrateState==='function')migrateState()}catch(e){}normalizeState();state.localUpdatedAt=Date.now();writeLocal(state);if(typeof sendProgress==='function')sendProgress()};
  let timer=null;
  sendProgress=function(){clearTimeout(timer);timer=setTimeout(writeCloud,300)};
  window.flushVerbProgress=function(){clearTimeout(timer);return writeCloud()};
  window.spVerbHardSave={readLocal,writeCloud,flush:writeCloud,status:()=>j(localStorage.getItem('SP_VERBS_SAVE_STATUS'),{})};
  window.addEventListener('pagehide',()=>{try{saveState();writeCloud()}catch(e){}});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){try{saveState();writeCloud()}catch(e){}}});
})();