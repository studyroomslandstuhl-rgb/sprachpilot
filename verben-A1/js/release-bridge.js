(function(){
  let courseReleaseData=null;
  let remoteLoaded=false;
  function safeJson(s,fallback){try{return JSON.parse(s||"")||fallback}catch(e){return fallback}}
  function profile(){try{return window.profile||JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")||{}}catch(e){return {}}}
  function courseCode(){const p=profile();return String(p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||"").trim()}
  function loadLocalReleaseData(){const p=profile();return p.assignments||safeJson(localStorage.getItem("SP_COURSE_RELEASES"),{})||{};}
  async function tryCourseDoc(code){
    if(!code||!window.db)return null;
    try{const snap=await db.collection("courses").doc(String(code)).get();if(snap.exists)return snap.data()||{}}catch(e){}
    return null;
  }
  async function tryCourseQuery(field,code){
    if(!code||!window.db)return null;
    try{const snap=await db.collection("courses").where(field,"==",String(code)).limit(1).get();if(snap&&!snap.empty)return snap.docs[0].data()||{}}catch(e){}
    return null;
  }
  async function loadRemoteReleaseData(){
    const code=courseCode();if(!code||!window.db)return null;
    try{
      const candidates=[code,code.toUpperCase(),code.toLowerCase()].filter((v,i,a)=>v&&a.indexOf(v)===i);
      for(const c of candidates){const d=await tryCourseDoc(c);if(d){courseReleaseData=d;break;}}
      if(!courseReleaseData){
        for(const field of ["courseCode","kurs","kursnummer","name","courseName","code"]){
          const d=await tryCourseQuery(field,code);if(d){courseReleaseData=d;break;}
        }
      }
      if(courseReleaseData){
        remoteLoaded=true;
        localStorage.setItem("SP_COURSE_RELEASES",JSON.stringify(courseReleaseData));
        try{const p=profile();p.assignments=courseReleaseData;localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));}catch(e){}
        return courseReleaseData;
      }
    }catch(e){console.warn("Verben-Freigabe konnte nicht geladen werden",e)}
    remoteLoaded=true;
    return null;
  }
  function releaseData(){return courseReleaseData||loadLocalReleaseData()||{}}
  function valueAt(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=="object"||!(p in cur))return undefined;cur=cur[p]}return cur}
  function allVerbNames(){return (typeof ALL_VERBS!=="undefined"?ALL_VERBS:[]).map(x=>x.v).filter(Boolean)}
  function explicitEnabled(data,verb){
    const paths=[["enabledWords",verb],["enabledWords",`verben-A1/${verb}`],["enabledWords",`Verben A1/${verb}`],["releases","verben-A1","words",verb],["releases","Verben A1","words",verb]];
    for(const p of paths){const v=valueAt(data,p);if(v!==undefined)return v===true;}
    return undefined;
  }
  function hasVerbControls(data){
    if(!data||typeof data!=="object")return false;
    const ew=data.enabledWords||{};
    if(Object.keys(ew).some(k=>String(k).includes("verben-A1/")||String(k).includes("Verben A1/")||allVerbNames().includes(k)))return true;
    if(valueAt(data,["releases","verben-A1","words"])||valueAt(data,["releases","Verben A1","words"]))return true;
    return false;
  }
  function moduleOpen(data){
    const candidates=[valueAt(data,["enabledModules","Verben A1"]),valueAt(data,["releases","Verben A1","enabled"]),valueAt(data,["releases","verben-A1","enabled"] )];
    if(candidates.some(v=>v===false))return false;
    if(candidates.some(v=>v===true))return true;
    return true;
  }
  function isDefaultLocked(data){return data.defaultLocked!==false && data.releaseMode!=="open" && data.releaseMode!=="all"}
  function assessmentEnabled(data=releaseData()){
    const paths=[["settings","verben-A1","assessmentEnabled"],["settings","Verben A1","assessmentEnabled"],["verbenA1AssessmentEnabled"],["releases","verben-A1","assessmentEnabled"],["releases","Verben A1","assessmentEnabled"]];
    for(const p of paths){const v=valueAt(data,p);if(v!==undefined)return v!==false;}
    return true;
  }
  function releasedVerbList(){
    const all=allVerbNames();
    const data=releaseData();
    if(!moduleOpen(data))return [];
    const controls=hasVerbControls(data);
    if(isDefaultLocked(data)||controls){
      return all.filter(v=>explicitEnabled(data,v)===true);
    }
    return all.filter(v=>explicitEnabled(data,v)!==false);
  }
  function allowedSet(){return new Set(releasedVerbList())}
  function isVerbReleased(v){return allowedSet().has(v)}
  function filterList(list){const allowed=allowedSet();return (list||[]).filter(v=>allowed.has(v))}
  function uniqueListLocal(arr){return [...new Set((arr||[]).filter(Boolean))]}
  function firstReleasedPracticeList(){const target=(typeof PRACTICE_TARGET_COUNT!=="undefined"?PRACTICE_TARGET_COUNT:20);return releasedVerbList().slice(0,target)}
  function seedFirstReleasedPackageIfNeeded(){
    if(assessmentEnabled(releaseData()))return false;
    if(!window.state)return false;
    const list=firstReleasedPracticeList();
    if(!list.length)return false;
    const before=JSON.stringify({currentPackageVerbs:state.currentPackageVerbs,assessmentBatch:state.assessmentBatch,assessed:state.assessed,active:state.active,unsure:state.unsure,known:state.known,phase:state.phase,currentVerb:state.currentVerb});
    state.currentPackageVerbs=list.slice();state.assessmentBatch=list.slice();state.assessed=uniqueListLocal([...(state.assessed||[]),...list]);state.known=(state.known||[]).filter(v=>!list.includes(v));state.unsure=uniqueListLocal([...(state.unsure||[]),...list]).filter(v=>!(state.learned||[]).includes(v));state.unknown=(state.unknown||[]).filter(v=>!state.unsure.includes(v));state.active=uniqueListLocal([...(state.active||[]),...list]).filter(v=>state.unsure.includes(v)||state.unknown.includes(v));
    if(state.phase==="assessment"){state.phase="home";state.currentVerb="";state.revealed=false;}
    const changed=before!==JSON.stringify({currentPackageVerbs:state.currentPackageVerbs,assessmentBatch:state.assessmentBatch,assessed:state.assessed,active:state.active,unsure:state.unsure,known:state.known,phase:state.phase,currentVerb:state.currentVerb});
    if(changed){try{if(typeof saveState==="function")saveState()}catch(e){}}
    return changed;
  }
  function cleanState(){
    if(!window.state)return;
    const allowed=allowedSet();
    ["known","unsure","unknown","active","learned","practicePool","assessmentBatch","assessed","currentPackageVerbs"].forEach(k=>{if(Array.isArray(state[k]))state[k]=state[k].filter(v=>allowed.has(v));});
    if(state.currentVerb&&!allowed.has(state.currentVerb))state.currentVerb="";
    if(state.currentTask&&state.currentTask.v&&!allowed.has(state.currentTask.v))state.currentTask=null;
    seedFirstReleasedPackageIfNeeded();
    try{if(typeof saveState==="function")saveState()}catch(e){}
  }
  function patchUnusedVerbs(){
    if(typeof window.unusedVerbs==="function"&&!window.unusedVerbs.__releasePatched){const old=window.unusedVerbs;window.unusedVerbs=function(){if(!assessmentEnabled(releaseData()))return [];return filterList(old.apply(this,arguments));};window.unusedVerbs.__releasePatched=true;}
  }
  function patchPracticeVerbs(){
    if(typeof window.currentPracticeVerbs==="function"&&!window.currentPracticeVerbs.__releasePatched){const old=window.currentPracticeVerbs;window.currentPracticeVerbs=function(){seedFirstReleasedPackageIfNeeded();return filterList(old.apply(this,arguments));};window.currentPracticeVerbs.__releasePatched=true;}
    if(typeof window.currentPackageAllVerbs==="function"&&!window.currentPackageAllVerbs.__releasePatched){const old=window.currentPackageAllVerbs;window.currentPackageAllVerbs=function(){seedFirstReleasedPackageIfNeeded();return filterList(old.apply(this,arguments));};window.currentPackageAllVerbs.__releasePatched=true;}
  }
  function patchOverview(){
    if(typeof window.verbsByStatus==="function"&&!window.verbsByStatus.__releasePatched){
      const old=window.verbsByStatus;
      window.verbsByStatus=function(){const g=old.apply(this,arguments)||{};Object.keys(g).forEach(k=>{if(Array.isArray(g[k]))g[k]=filterList(g[k])});return g};
      window.verbsByStatus.__releasePatched=true;
    }
  }
  function patchAssessment(){
    if(typeof window.startAssessment==="function"&&!window.startAssessment.__releasePatched){const oldStart=window.startAssessment;window.startAssessment=function(){if(!assessmentEnabled(releaseData())){seedFirstReleasedPackageIfNeeded();if(typeof renderHome==="function")renderHome();return;}return oldStart.apply(this,arguments);};window.startAssessment.__releasePatched=true;}
    if(typeof window.handleAssessmentClick==="function"&&!window.handleAssessmentClick.__releasePatched){const oldClick=window.handleAssessmentClick;window.handleAssessmentClick=function(){if(!assessmentEnabled(releaseData())){seedFirstReleasedPackageIfNeeded();if(typeof renderHome==="function")renderHome();return;}return oldClick.apply(this,arguments);};window.handleAssessmentClick.__releasePatched=true;}
    if(typeof window.markAssessment==="function"&&!window.markAssessment.__releasePatched){const old=window.markAssessment;window.markAssessment=function(level){const v=state.currentVerb||((typeof currentAssessmentVerb==="function")?currentAssessmentVerb():"");if(v&&!isVerbReleased(v)){cleanState();if(typeof renderAssessment==="function")renderAssessment();return;}return old.apply(this,arguments);};window.markAssessment.__releasePatched=true;}
    if(typeof window.renderAssessment==="function"&&!window.renderAssessment.__releasePatched){const old=window.renderAssessment;window.renderAssessment=function(){if(!assessmentEnabled(releaseData())){seedFirstReleasedPackageIfNeeded();if(typeof renderHome==="function")renderHome();return;}cleanState();return old.apply(this,arguments);};window.renderAssessment.__releasePatched=true;}
  }
  function patchRenderHome(){
    if(typeof window.renderHome==="function"&&!window.renderHome.__releaseAssessmentPatched){const old=window.renderHome;window.renderHome=function(){cleanState();seedFirstReleasedPackageIfNeeded();return old.apply(this,arguments);};window.renderHome.__releaseAssessmentPatched=true;}
  }
  function rerender(){try{cleanState();if(!assessmentEnabled(releaseData()))seedFirstReleasedPackageIfNeeded();if(state&&state.phase==="assessment"&&typeof renderAssessment==="function")renderAssessment();else if(typeof renderHome==="function")renderHome()}catch(e){}}
  function patchAll(){patchUnusedVerbs();patchPracticeVerbs();patchOverview();patchAssessment();patchRenderHome();cleanState();}
  courseReleaseData=loadLocalReleaseData();
  patchAll();document.addEventListener("DOMContentLoaded",patchAll);
  loadRemoteReleaseData().then(()=>{patchAll();cleanState();rerender();}).catch(()=>{});
  setTimeout(patchAll,100);setTimeout(patchAll,300);setTimeout(patchAll,800);setTimeout(patchAll,1500);setTimeout(patchAll,3000);
  window.spReleasedVerbList=releasedVerbList;window.spIsVerbReleased=isVerbReleased;window.spVerbAssessmentEnabled=function(){return assessmentEnabled(releaseData())};window.spSeedFirstReleasedVerbPackage=seedFirstReleasedPackageIfNeeded;window.spVerbReleaseDebug=function(){return {course:courseCode(),remoteLoaded,hasControls:hasVerbControls(releaseData()),defaultLocked:isDefaultLocked(releaseData()),released:releasedVerbList(),data:releaseData()}};
})();