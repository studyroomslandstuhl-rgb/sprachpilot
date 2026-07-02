// Robuste Firebase-Synchronisierung für Verben A1.
// Ziel: Gerätewechsel, Cache-Löschen und Dashboard/Rangliste ohne Fortschrittsverlust.
(function(){
  function safeJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"")||fallback}catch(e){return fallback}}
  function normId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
  function uniq(arr){return Array.from(new Set((arr||[]).filter(Boolean).map(String)))}
  function prof(){try{return typeof profile!=="undefined"&&profile?profile:(safeJson("SP_USER_PROFILE",safeJson("SP_STUDENT_PROFILE",{}))||{})}catch(e){return safeJson("SP_USER_PROFILE",safeJson("SP_STUDENT_PROFILE",{}))||{}}}
  function courseOf(p){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem("SP_COURSE_CODE")||"").trim()}
  function emailOf(p){return String(p.email||"").trim().toLowerCase()}
  function fallbackId(p){const c=normId(p.courseDocId||courseOf(p)||"kurs");const e=normId(emailOf(p)||p.vorname||p.firstName||"student");return c&&e?c+"_"+e:""}
  function idCandidates(){
    const p=prof();
    return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem("SP_STUDENT_ID"),fallbackId(p)]);
  }
  function canonicalStudentId(){return idCandidates()[0]||"guest"}
  function pendingKey(){return "SP_VERBS_PENDING_SYNC_"+canonicalStudentId()}
  function ts(){try{return firebase.firestore.FieldValue.serverTimestamp()}catch(e){return new Date().toISOString()}}
  function num(x){const n=Number(x);return Number.isFinite(n)?n:0}
  function clean(v){
    if(v===undefined||typeof v==="function")return undefined;
    if(v===null||typeof v==="string"||typeof v==="boolean")return v;
    if(typeof v==="number")return Number.isFinite(v)?v:0;
    if(Array.isArray(v))return v.map(clean).filter(x=>x!==undefined);
    if(typeof v==="object"){
      if(typeof v.toDate==="function"||typeof v.isEqual==="function")return v;
      const out={};
      Object.keys(v).forEach(k=>{const c=clean(v[k]);if(c!==undefined)out[k]=c});
      return out;
    }
    return String(v||"");
  }
  function union(a,b){return uniq([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])])}
  function mergeObj(a,b){return {...(a&&typeof a==="object"?a:{}),...(b&&typeof b==="object"?b:{})}}
  function mergeSkillMap(a,b){
    const out=mergeObj(a,b);
    Object.keys(a||{}).forEach(v=>out[v]=mergeObj(a[v],out[v]));
    Object.keys(b||{}).forEach(v=>out[v]=mergeObj(out[v],b[v]));
    return out;
  }
  function betterExam(a,b){
    a=a||{};b=b||{};
    const as=num(a.score),bs=num(b.score);
    if((b.passed&&!a.passed)||bs>as)return mergeObj(a,b);
    return mergeObj(b,a);
  }
  function mergeStates(base,inc){
    base=base||{};inc=inc||{};
    const out={...base,...inc};
    ["known","unsure","unknown","active","learned","practicePool","archivedPackages","assessmentBatch","assessed","currentPackageVerbs","memoryDone","openCards"].forEach(k=>out[k]=union(base[k],inc[k]));
    ["weak","taskQueues","taskDoneSets","alertsShown","taskRewardsShown"].forEach(k=>out[k]=mergeObj(base[k],inc[k]));
    ["skillDone","skillAttempts","skillSuccess"].forEach(k=>out[k]=mergeSkillMap(base[k],inc[k]));
    out.exam=betterExam(base.exam,inc.exam);
    return out;
  }
  function localKeys(){return uniq(idCandidates().map(id=>"SP_VERBS_"+id))}
  function readLocalMerged(){let out={};localKeys().forEach(k=>{out=mergeStates(out,safeJson(k,{}))});return out}
  function cleanCurrentState(){
    try{if(typeof normalizeVerbStatusLists==="function")normalizeVerbStatusLists()}catch(e){}
    const raw={...state};
    try{if(typeof releaseFilterVerbs==="function"){
      ["known","unsure","unknown","active","learned","practicePool","assessmentBatch","assessed","currentPackageVerbs"].forEach(k=>raw[k]=releaseFilterVerbs(raw[k]||[]));
    }}catch(e){}
    return clean(raw);
  }
  function progressPercent(){try{return typeof overall==="function"?num(overall()):0}catch(e){return 0}}
  function starCount(){try{return typeof totalStars==="function"?num(totalStars()):0}catch(e){return 0}}
  function packageVerbs(){try{return typeof currentPackageAllVerbs==="function"?currentPackageAllVerbs():(state.currentPackageVerbs||[])}catch(e){return state.currentPackageVerbs||[]}}
  function buildPayload(fullState){
    const p=prof(),sid=canonicalStudentId(),course=courseOf(p),cleanState=fullState||cleanCurrentState();
    const points=num(localStorage.getItem("SP_POINTS_TOTAL")),progress=progressPercent(),stars=starCount();
    const verben={progress,progressPercent:progress,stars,activeVerbs:cleanState.active||[],learnedVerbs:cleanState.learned||[],known:cleanState.known||[],unsure:cleanState.unsure||[],unknown:cleanState.unknown||[],assessed:cleanState.assessed||[],currentPackageVerbs:packageVerbs(),exam:cleanState.exam||{},state:cleanState,updatedAt:ts()};
    return {
      progressDoc:clean({studentId:sid,userId:sid,docId:sid,email:emailOf(p),studentName:[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" "),kurs:course,kursnummer:course,courseCode:course,courseDocId:p.courseDocId||"",verben,lifetimePoints:points,pointsTotal:points,punkteGesamt:points,totals:{points,updatedAt:new Date().toISOString()},lastPage:location.pathname,lastActiveAt:ts(),updatedAt:ts()}),
      studentDoc:clean({studentId:sid,userId:sid,docId:sid,email:emailOf(p),vorname:p.vorname||p.firstName||p.name||"",nachname:p.nachname||p.lastName||"",muttersprache:p.muttersprache||p.fremdsprache||"",kurs:course,kursnummer:course,courseCode:course,courseDocId:p.courseDocId||"",verbenFortschritt:progress,lastActivity:ts(),lastActiveAt:ts(),updatedAt:ts(),active:true,role:"student",loginRole:"student",isStudent:true,isTeacher:false}),
      minimalProgress:clean({studentId:sid,userId:sid,docId:sid,email:emailOf(p),kurs:course,kursnummer:course,courseCode:course,verben:{progress,progressPercent:progress,stars,activeVerbs:cleanState.active||[],learnedVerbs:cleanState.learned||[],known:cleanState.known||[],unsure:cleanState.unsure||[],unknown:cleanState.unknown||[],assessed:cleanState.assessed||[],currentPackageVerbs:packageVerbs(),exam:cleanState.exam||{},updatedAt:ts()},lastPage:location.pathname,lastActiveAt:ts(),updatedAt:ts()})
    };
  }
  function markPending(){try{localStorage.setItem(pendingKey(),JSON.stringify({at:new Date().toISOString(),sid:canonicalStudentId()}))}catch(e){}}
  function clearPending(){try{localStorage.removeItem(pendingKey())}catch(e){}}
  async function writeCloud(){
    if(typeof db==="undefined"||!db||!prof())return false;
    const sid=canonicalStudentId();
    if(!sid||sid==="guest")return false;
    const payload=buildPayload();
    let progressOk=false,studentOk=false;
    try{await db.collection("progress").doc(sid).set(payload.progressDoc,{merge:true});progressOk=true}
    catch(e){console.warn("Verben Fortschritt voll konnte nicht gespeichert werden",e);try{await db.collection("progress").doc(sid).set(payload.minimalProgress,{merge:true});progressOk=true}catch(e2){console.warn("Verben Fortschritt minimal konnte nicht gespeichert werden",e2)}}
    try{await db.collection("students").doc(sid).set(payload.studentDoc,{merge:true});studentOk=true}
    catch(e){console.warn("Schüler-Aktivität konnte nicht gespeichert werden",e)}
    if(progressOk&&studentOk){clearPending();return true}
    markPending();return false;
  }

  if(typeof firebaseStudentId==="function")firebaseStudentId=canonicalStudentId;
  if(typeof storageKey==="function")storageKey=function(){return "SP_VERBS_"+canonicalStudentId()};

  const oldLoad=typeof loadState==="function"?loadState:null;
  if(oldLoad&&!oldLoad.__cloudSync){
    loadState=async function(){
      try{await oldLoad.apply(this,arguments)}catch(e){console.warn("Alter Verben-Ladevorgang fehlgeschlagen",e)}
      let merged=mergeStates(state||{},readLocalMerged());
      if(typeof db!=="undefined"&&db){
        for(const id of idCandidates()){
          try{
            const snap=await db.collection("progress").doc(id).get();
            const exists=typeof snap.exists==="function"?snap.exists():!!snap.exists;
            if(!exists)continue;
            const data=snap.data?snap.data():{};
            const v=data.verben||{};
            merged=mergeStates(merged,v.state||{});
          }catch(e){console.warn("Progress-Lesen fehlgeschlagen",id,e)}
        }
      }
      state=mergeStates(state||{},merged);
      try{if(typeof migrateState==="function")migrateState()}catch(e){}
      try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch(e){}
      setTimeout(writeCloud,300);
    };
    loadState.__cloudSync=true;
  }

  let timer=null;
  sendProgress=function(){clearTimeout(timer);markPending();timer=setTimeout(writeCloud,500)};
  function flush(){try{writeCloud()}catch(e){}}
  window.addEventListener("online",flush);
  window.addEventListener("pagehide",flush);
  document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden")flush()});
  setTimeout(function(){if(localStorage.getItem(pendingKey()))flush()},1200);
  window.spVerbCloudSync={id:canonicalStudentId,ids:idCandidates,flush};
})();
