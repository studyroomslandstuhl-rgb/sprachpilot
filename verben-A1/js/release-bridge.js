(function(){
  if(window.__SP_VERB_RELEASE_BRIDGE_V2)return;
  window.__SP_VERB_RELEASE_BRIDGE_V2=true;

  let remoteData=null;
  let loaded=false;
  let loadPromise=null;

  function readJson(key,fallback={}){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch(e){return fallback}}
  function profileData(){try{return typeof profile!=='undefined'&&profile?profile:(readJson('SP_USER_PROFILE',null)||readJson('SP_STUDENT_PROFILE',{}))}catch(e){return readJson('SP_USER_PROFILE',{})}}
  function stateData(){try{return typeof state!=='undefined'?state:null}catch(e){return null}}
  function isTeacher(){const p=profileData();const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||p.role||'').toLowerCase();return role==='teacher'||role==='lehrer'||p.teacherPreview===true||p.isTeacher===true||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
  function hasReleaseData(d){return !!(d&&(d.enabledWords||d.releases||d.enabledModules||d.settings||d.defaultLocked!==undefined||d.releaseMode||d.verbenA1AssessmentEnabled!==undefined))}
  function localReleaseData(){const p=profileData();if(hasReleaseData(p.assignments))return p.assignments;const cached=readJson('SP_COURSE_RELEASES',{});return hasReleaseData(cached)?cached:{}}
  function releaseData(){if(isTeacher())return{releaseMode:'all',defaultLocked:false};return hasReleaseData(remoteData)?remoteData:localReleaseData()}
  function get(obj,path){let cur=obj;for(const part of path){if(!cur||typeof cur!=='object'||!(part in cur))return undefined;cur=cur[part]}return cur}
  function uniq(list){return [...new Set((list||[]).filter(Boolean).map(String))]}
  function allVerbs(){let source=[];try{source=typeof ALL_VERBS!=='undefined'?ALL_VERBS:(window.ALL_VERBS||[])}catch(e){source=window.ALL_VERBS||[]}return uniq(source.map(x=>x&&x.v).filter(Boolean))}
  function courseCodes(){const p=profileData();const raw=[p.kurs,p.kursnummer,p.courseCode,p.courseDocId,p.courseId,p.courseName,p.name,p.code,p.id,localStorage.getItem('SP_COURSE_CODE')].map(v=>String(v||'').trim()).filter(Boolean);const out=[];raw.forEach(v=>out.push(v,v.toUpperCase(),v.toLowerCase(),v.replace(/\s+/g,''),v.toLowerCase().replace(/\s+/g,'')));return uniq(out)}
  function saveReleaseData(data){try{localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(data||{}));const p=profileData();p.assignments=data||{};localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(p))}catch(e){}}
  function database(){try{if(typeof db!=='undefined'&&db)return db}catch(e){}return window.db||null}
  async function readDoc(store,id){try{const snap=await store.collection('courses').doc(String(id)).get();return snap.exists?Object.assign({id:snap.id},snap.data()||{}):null}catch(e){return null}}
  async function readQuery(store,field,value){try{const snap=await store.collection('courses').where(field,'==',String(value)).limit(1).get();return snap&&!snap.empty?Object.assign({id:snap.docs[0].id},snap.docs[0].data()||{}):null}catch(e){return null}}
  async function loadReleaseData(){
    if(loaded)return releaseData();
    if(loadPromise)return loadPromise;
    loadPromise=(async()=>{
      if(isTeacher()){remoteData={releaseMode:'all',defaultLocked:false};loaded=true;return remoteData}
      const fallback=localReleaseData();
      const store=database();
      if(!store){remoteData=fallback;loaded=true;return remoteData}
      const codes=courseCodes();
      for(const code of codes){const found=await readDoc(store,code);if(hasReleaseData(found)){remoteData=found;saveReleaseData(found);loaded=true;return found}}
      const fields=['courseCode','kurs','kursnummer','courseDocId','courseId','id','name','courseName','code'];
      for(const field of fields){for(const code of codes){const found=await readQuery(store,field,code);if(hasReleaseData(found)){remoteData=found;saveReleaseData(found);loaded=true;return found}}}
      remoteData=fallback;loaded=true;return remoteData;
    })();
    return loadPromise;
  }
  function explicitWordValue(data,verb){const words=data&&data.enabledWords;if(Array.isArray(words))return words.includes(verb)||words.includes('verben-A1/'+verb)||words.includes('Verben A1/'+verb);const paths=[['enabledWords',verb],['enabledWords','verben-A1/'+verb],['enabledWords','Verben A1/'+verb],['releases','verben-A1','words',verb],['releases','Verben A1','words',verb]];for(const path of paths){const value=get(data,path);if(value!==undefined)return value===true}return undefined}
  function releaseControlsWords(data){const words=data&&data.enabledWords||{};const names=new Set(allVerbs());if(Array.isArray(words)&&words.length)return true;if(Object.keys(words).some(k=>k.includes('verben-A1/')||k.includes('Verben A1/')||names.has(k)))return true;return !!(get(data,['releases','verben-A1','words'])||get(data,['releases','Verben A1','words']))}
  function moduleOpen(data){const values=[get(data,['enabledModules','Verben A1']),get(data,['enabledModules','verben-A1']),get(data,['releases','Verben A1','enabled']),get(data,['releases','verben-A1','enabled'])];return !values.some(v=>v===false)}
  function releasedVerbs(){const all=allVerbs();if(isTeacher())return all;const data=releaseData();if(!hasReleaseData(data))return all;if(!moduleOpen(data))return[];if(releaseControlsWords(data))return all.filter(v=>explicitWordValue(data,v)===true);if(data.releaseMode==='all'||data.releaseMode==='open'||data.defaultLocked===false)return all.filter(v=>explicitWordValue(data,v)!==false);return all}
  function assessmentEnabled(){const data=releaseData();if(!hasReleaseData(data))return true;const values=[get(data,['settings','verben-A1','assessmentEnabled']),get(data,['settings','Verben A1','assessmentEnabled']),data.verbenA1AssessmentEnabled,get(data,['releases','verben-A1','assessmentEnabled']),get(data,['releases','Verben A1','assessmentEnabled'])];for(const value of values)if(value!==undefined)return value!==false;return true}
  function defaultExam(){return{passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false}}
  function packageSignature(S){return uniq([...(S.active||[]),...(S.currentPackageVerbs||[]),...(S.assessmentBatch||[])]).sort().join('|')}
  function filterArray(list,allowed){return uniq(list).filter(v=>allowed.has(v))}
  function syncState(){
    const S=stateData();
    if(!S||isTeacher()||!hasReleaseData(releaseData()))return false;
    const allowedList=releasedVerbs();
    const allowed=new Set(allowedList);
    const beforePackage=packageSignature(S);
    let before='';try{before=JSON.stringify(S)}catch(e){}
    ['known','learned','unsure','unknown','active','practicePool','assessmentBatch','assessed','currentPackageVerbs'].forEach(key=>{S[key]=filterArray(S[key]||[],allowed)});
    const mastered=new Set([...(S.known||[]),...(S.learned||[])]);
    S.active=filterArray([...(S.active||[]),...(S.unsure||[]),...(S.unknown||[]),...(S.currentPackageVerbs||[]),...(S.assessmentBatch||[])],allowed).filter(v=>!mastered.has(v)).slice(0,20);
    S.unsure=filterArray(S.unsure||[],allowed).filter(v=>S.active.includes(v));
    S.unknown=filterArray(S.unknown||[],allowed).filter(v=>S.active.includes(v)&&!S.unsure.includes(v));
    S.currentPackageVerbs=S.active.slice();
    S.assessmentBatch=S.active.slice();
    S.practicePool=filterArray(S.practicePool||[],allowed).filter(v=>S.active.includes(v));
    Object.keys(S.taskDoneSets||{}).forEach(key=>{const raw=Array.isArray(S.taskDoneSets[key])?S.taskDoneSets[key]:Object.values(S.taskDoneSets[key]||{});S.taskDoneSets[key]=raw.filter(x=>S.active.includes(String(x||'').split(':')[0]))});
    Object.keys(S.taskQueues||{}).forEach(key=>{const raw=Array.isArray(S.taskQueues[key])?S.taskQueues[key]:Object.values(S.taskQueues[key]||{});S.taskQueues[key]=raw.filter(x=>x&&S.active.includes(x.v))});
    ['skillDone','skillAttempts','skillSuccess','weak'].forEach(key=>{Object.keys(S[key]||{}).forEach(v=>{if(!allowed.has(v))delete S[key][v]})});
    if(S.currentVerb&&!S.active.includes(S.currentVerb))S.currentVerb='';
    if(S.currentTask&&S.currentTask.v&&!S.active.includes(S.currentTask.v))S.currentTask=null;
    const afterPackage=packageSignature(S);
    if(beforePackage&&beforePackage!==afterPackage){S.exam=defaultExam();S.currentTask=null;S.memoryCards=[];S.memoryDone=[];S.openCards=[];S.first=null;S.lock=false}
    if(S.exam&&Array.isArray(S.exam.items))S.exam.items=S.exam.items.filter(item=>item&&(!item.v||S.active.includes(item.v)));
    S._releaseFingerprint=JSON.stringify({verbs:allowedList.slice().sort(),assessment:assessmentEnabled()});
    let after='';try{after=JSON.stringify(S)}catch(e){}
    const changed=before!==after;
    if(changed&&typeof saveState==='function')saveState();
    return changed;
  }
  function install(){
    window.spReleasedVerbList=releasedVerbs;
    window.spStrictReleasedVerbList=releasedVerbs;
    window.releasedAssessmentVerbs=releasedVerbs;
    window.spVerbAssessmentEnabled=assessmentEnabled;
    window.spVerbPracticeTargetCount=()=>Math.min(20,releasedVerbs().length);
    window.spSyncVerbRelease=syncState;
    window.spVerbReleaseDebug=()=>({loaded,teacher:isTeacher(),codes:courseCodes(),released:releasedVerbs(),assessmentEnabled:assessmentEnabled(),data:releaseData(),state:stateData()?{active:state.active,currentPackageVerbs:state.currentPackageVerbs,phase:state.phase,releaseFingerprint:state._releaseFingerprint}:null});
    syncState();
  }
  function refreshVisibleHome(){try{const S=stateData();if(!S)return;if(S.phase==='taskOverview'&&typeof renderTaskOverview==='function')renderTaskOverview();else if(S.phase==='home'&&typeof renderVerbIndexPage==='function')renderVerbIndexPage()}catch(e){}}

  install();
  window.spVerbReleaseReady=loadReleaseData().then(data=>{install();refreshVisibleHome();return data}).catch(()=>{loaded=true;install();return releaseData()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else setTimeout(install,0);
  setTimeout(install,300);
  setTimeout(install,1200);
  setTimeout(install,3000);
})();