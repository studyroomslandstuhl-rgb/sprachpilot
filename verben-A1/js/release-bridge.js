(function(){
  let courseReleaseData=null;
  function safeJson(s,fallback){try{return JSON.parse(s||"")||fallback}catch(e){return fallback}}
  function profile(){try{return window.profile||JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")||{}}catch(e){return {}}}
  function courseCode(){const p=profile();return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||""}
  function loadLocalReleaseData(){
    const p=profile();
    return p.assignments||safeJson(localStorage.getItem("SP_COURSE_RELEASES"),{})||{};
  }
  async function loadRemoteReleaseData(){
    const code=courseCode();
    if(!code||!window.db)return null;
    try{
      const snap=await db.collection("courses").doc(String(code)).get();
      if(snap.exists){
        courseReleaseData=snap.data()||{};
        localStorage.setItem("SP_COURSE_RELEASES",JSON.stringify(courseReleaseData));
        try{const p=profile();p.assignments=courseReleaseData;localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));}catch(e){}
        return courseReleaseData;
      }
    }catch(e){console.warn("Verben-Freigabe konnte nicht geladen werden",e)}
    return null;
  }
  function releaseData(){return courseReleaseData||loadLocalReleaseData()||{}}
  function valueAt(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=="object"||!(p in cur))return undefined;cur=cur[p]}return cur}
  function explicitEnabled(data,verb){
    const paths=[
      ["enabledWords",verb],
      ["enabledWords",`verben-A1/${verb}`],
      ["enabledWords",`Verben A1/${verb}`],
      ["releases","verben-A1","words",verb],
      ["releases","Verben A1","words",verb]
    ];
    for(const p of paths){const v=valueAt(data,p);if(v!==undefined)return v===true;}
    return undefined;
  }
  function hasVerbControls(data){
    if(!data||typeof data!=="object")return false;
    const ew=data.enabledWords||{};
    if(Object.keys(ew).some(k=>String(k).includes("verben-A1/")||String(k).includes("Verben A1/")||(typeof ALL_VERBS!=="undefined"&&ALL_VERBS.some(x=>x.v===k))))return true;
    if(valueAt(data,["releases","verben-A1","words"])||valueAt(data,["releases","Verben A1","words"]))return true;
    return false;
  }
  function moduleOpen(data){
    const candidates=[valueAt(data,["enabledModules","Verben A1"]),valueAt(data,["releases","Verben A1","enabled"]),valueAt(data,["releases","verben-A1","enabled"])];
    if(candidates.some(v=>v===false))return false;
    if(candidates.some(v=>v===true))return true;
    return true;
  }
  function releasedVerbList(){
    const all=(typeof ALL_VERBS!=="undefined"?ALL_VERBS:[]).map(x=>x.v);
    const data=releaseData();
    if(!moduleOpen(data))return [];
    if(!hasVerbControls(data))return all;
    return all.filter(v=>explicitEnabled(data,v)===true);
  }
  function patchUnusedVerbs(){
    if(typeof window.unusedVerbs!=="function"||window.unusedVerbs.__releasePatched)return;
    const old=window.unusedVerbs;
    window.unusedVerbs=function(){
      const allowed=new Set(releasedVerbList());
      return old.apply(this,arguments).filter(v=>allowed.has(v));
    };
    window.unusedVerbs.__releasePatched=true;
  }
  function cleanState(){
    if(!window.state)return;
    const allowed=new Set(releasedVerbList());
    if(!allowed.size && hasVerbControls(releaseData())){
      state.known=[];state.unsure=[];state.unknown=[];state.active=[];state.learned=[];state.practicePool=[];state.assessmentBatch=[];state.assessed=[];state.currentPackageVerbs=[];
    }else if(allowed.size){
      ["known","unsure","unknown","active","learned","practicePool","assessmentBatch","assessed","currentPackageVerbs"].forEach(k=>{if(Array.isArray(state[k]))state[k]=state[k].filter(v=>allowed.has(v));});
    }
    try{if(typeof saveState==="function")saveState()}catch(e){}
  }
  function patchAll(){patchUnusedVerbs();}
  courseReleaseData=loadLocalReleaseData();
  patchAll();
  document.addEventListener("DOMContentLoaded",patchAll);
  loadRemoteReleaseData().then(()=>{patchAll();cleanState();}).catch(()=>{});
  setTimeout(patchAll,250);
  setTimeout(patchAll,1000);
  window.spReleasedVerbList=releasedVerbList;
})();
