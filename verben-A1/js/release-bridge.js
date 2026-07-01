(function(){
  var releaseData=null;
  var releaseLoaded=false;
  var releaseLoading=null;

  function json(key){try{return JSON.parse(localStorage.getItem(key)||'null')||{}}catch(e){return {}}}
  function dbRef(){try{if(typeof db!=='undefined'&&db)return db}catch(e){} return window.db||null}
  function prof(){try{if(typeof profile!=='undefined'&&profile)return profile}catch(e){} return window.profile||json('SP_USER_PROFILE')||json('SP_STUDENT_PROFILE')||{}}
  function isTeacher(){var r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();var p=prof();return r==='teacher'||r==='lehrer'||p.role==='teacher'||p.teacherPreview===true||p.isTeacher===true||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
  function hasData(d){return !!(d&&(d.enabledWords||d.releases||d.enabledModules||d.settings||d.defaultLocked!==undefined||d.releaseMode||d.verbenA1AssessmentEnabled!==undefined))}
  function localData(){var p=prof();if(hasData(p.assignments))return p.assignments;var s=json('SP_COURSE_RELEASES');return hasData(s)?s:{}}
  function saveRelease(d){try{localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(d||{}));var p=prof();p.assignments=d||{};localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(p))}catch(e){}}
  function get(o,path){var c=o;for(var i=0;i<path.length;i++){if(!c||typeof c!=='object'||!(path[i] in c))return undefined;c=c[path[i]]}return c}
  function allVerbs(){return (window.ALL_VERBS||[]).map(function(x){return x&&x.v}).filter(Boolean)}
  function unique(list){return Array.from(new Set((list||[]).filter(Boolean)))}
  function courseCodes(){var p=prof();var raw=[p.kurs,p.kursnummer,p.courseCode,p.courseDocId,p.courseId,p.courseName,p.name,p.code,p.id,localStorage.getItem('SP_COURSE_CODE')].map(function(x){return String(x||'').trim()}).filter(Boolean);var out=[];raw.forEach(function(x){out.push(x,x.toUpperCase(),x.toLowerCase(),x.replace(/\s+/g,''),x.toLowerCase().replace(/\s+/g,''))});return unique(out)}
  async function getDoc(database,id){try{var s=await database.collection('courses').doc(String(id)).get();return s.exists?Object.assign({id:s.id},s.data()||{}):null}catch(e){return null}}
  async function getQuery(database,field,val){try{var s=await database.collection('courses').where(field,'==',String(val)).limit(1).get();return s&&!s.empty?Object.assign({id:s.docs[0].id},s.docs[0].data()||{}):null}catch(e){return null}}
  async function loadRemote(){
    if(isTeacher()){releaseData={releaseMode:'all',defaultLocked:false};releaseLoaded=true;return releaseData}
    var database=dbRef();
    var fallback=localData();
    if(!database){releaseData=fallback;releaseLoaded=true;return releaseData}
    var codes=courseCodes();
    for(var i=0;i<codes.length;i++){var d=await getDoc(database,codes[i]);if(hasData(d)){releaseData=d;releaseLoaded=true;saveRelease(d);return d}}
    var fields=['courseCode','kurs','kursnummer','courseDocId','courseId','id','name','courseName','code'];
    for(var f=0;f<fields.length;f++){for(var j=0;j<codes.length;j++){var q=await getQuery(database,fields[f],codes[j]);if(hasData(q)){releaseData=q;releaseLoaded=true;saveRelease(q);return q}}}
    releaseData=fallback;releaseLoaded=true;return releaseData;
  }
  function data(){if(isTeacher())return {releaseMode:'all',defaultLocked:false};return hasData(releaseData)?releaseData:localData()}
  function enabledValue(d,v){
    var ew=d.enabledWords;
    if(Array.isArray(ew)){if(ew.indexOf(v)>=0||ew.indexOf('verben-A1/'+v)>=0||ew.indexOf('Verben A1/'+v)>=0)return true}
    var paths=[['enabledWords',v],['enabledWords','verben-A1/'+v],['enabledWords','Verben A1/'+v],['releases','verben-A1','words',v],['releases','Verben A1','words',v]];
    for(var i=0;i<paths.length;i++){var x=get(d,paths[i]);if(x!==undefined)return x===true}
    return undefined;
  }
  function hasVerbControls(d){
    var ew=d.enabledWords||{};if(Array.isArray(ew)&&ew.length)return true;
    var names=allVerbs();
    if(Object.keys(ew).some(function(k){return k.indexOf('verben-A1/')>=0||k.indexOf('Verben A1/')>=0||names.indexOf(k)>=0}))return true;
    return !!(get(d,['releases','verben-A1','words'])||get(d,['releases','Verben A1','words']))
  }
  function moduleOpen(d){
    var vals=[get(d,['enabledModules','Verben A1']),get(d,['enabledModules','verben-A1']),get(d,['releases','Verben A1','enabled']),get(d,['releases','verben-A1','enabled'])];
    if(vals.some(function(x){return x===false}))return false;
    if(vals.some(function(x){return x===true}))return true;
    return true;
  }
  function released(){
    var names=allVerbs();
    if(isTeacher())return names;
    var d=data();
    if(!hasData(d)||!moduleOpen(d))return [];
    var controls=hasVerbControls(d);
    if(d.releaseMode==='all'||d.releaseMode==='open'||(d.defaultLocked===false&&!controls))return names.filter(function(v){return enabledValue(d,v)!==false});
    return names.filter(function(v){return enabledValue(d,v)===true});
  }
  function assessmentOn(){
    var d=data();
    var vals=[get(d,['settings','verben-A1','assessmentEnabled']),get(d,['settings','Verben A1','assessmentEnabled']),d.verbenA1AssessmentEnabled,get(d,['releases','verben-A1','assessmentEnabled']),get(d,['releases','Verben A1','assessmentEnabled'])];
    for(var i=0;i<vals.length;i++){if(vals[i]!==undefined)return vals[i]!==false}
    return true;
  }
  function targetCount(){var n=released().length;return Math.min(20,n)}
  function filterList(list){var s=new Set(released());return (list||[]).filter(function(v){return s.has(v)})}
  function filterQueue(q,allowed){return (q||[]).filter(function(x){return x&&allowed.has(x.v)})}
  function filterDoneKeys(q,allowed){return (q||[]).filter(function(k){return allowed.has(String(k).split(':')[0])})}
  function filterObjectKeys(obj,allowed){Object.keys(obj||{}).forEach(function(k){if(!allowed.has(k))delete obj[k]})}
  function resetQueues(){if(!window.state)return;state.practicePool=[];state.taskQueues={};state.taskDoneSets={};state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0}}
  function seedPackageWhenAssessmentOff(){
    if(assessmentOn()||!window.state)return false;
    var list=released().slice(0,20);
    if(!list.length)return false;
    state.currentPackageVerbs=list.slice();
    state.assessmentBatch=list.slice();
    state.assessed=list.slice();
    state.known=filterList(state.known||[]);
    state.learned=filterList(state.learned||[]);
    state.unsure=list.filter(function(v){return !(state.known||[]).includes(v)&&!(state.learned||[]).includes(v)});
    state.unknown=[];
    state.active=state.unsure.slice();
    state.currentVerb='';
    if(!state.active.length&&list.length)state.active=list.slice();
    return true;
  }
  function syncState(){
    if(!window.state||isTeacher()||(!releaseLoaded&&!hasData(releaseData)))return false;
    var allowed=new Set(released());
    var fingerprint=JSON.stringify({verbs:Array.from(allowed),assessment:assessmentOn()});
    var oldFingerprint=state._releaseFingerprint||'';
    var before='';try{before=JSON.stringify(state)}catch(e){}
    ['known','unsure','unknown','active','learned','practicePool','assessmentBatch','assessed','currentPackageVerbs'].forEach(function(k){if(Array.isArray(state[k]))state[k]=state[k].filter(function(v){return allowed.has(v)})});
    if(state.taskQueues){Object.keys(state.taskQueues).forEach(function(k){state.taskQueues[k]=filterQueue(state.taskQueues[k],allowed)})}
    if(state.taskDoneSets){Object.keys(state.taskDoneSets).forEach(function(k){state.taskDoneSets[k]=filterDoneKeys(state.taskDoneSets[k],allowed)})}
    filterObjectKeys(state.skillDone,allowed);filterObjectKeys(state.skillAttempts,allowed);filterObjectKeys(state.skillSuccess,allowed);filterObjectKeys(state.weak,allowed);
    if(state.currentVerb&&!allowed.has(state.currentVerb))state.currentVerb='';
    if(state.currentTask&&state.currentTask.v&&!allowed.has(state.currentTask.v))state.currentTask=null;
    if(state.exam&&Array.isArray(state.exam.items)){state.exam.items=state.exam.items.filter(function(x){return x&&(!x.v||allowed.has(x.v))});if(state.exam.current>=state.exam.items.length)state.exam.current=0}
    if(oldFingerprint&&oldFingerprint!==fingerprint)resetQueues();
    state._releaseFingerprint=fingerprint;
    seedPackageWhenAssessmentOff();
    try{if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){}
    var after='';try{after=JSON.stringify(state)}catch(e){}
    if(before!==after){try{if(typeof saveState==='function')saveState()}catch(e){}}
    return before!==after;
  }
  function patchFunctions(){
    if(typeof window.unusedVerbs==='function'&&!window.unusedVerbs.__releaseBridge){var oldUnused=window.unusedVerbs;window.unusedVerbs=function(){if(!assessmentOn())return [];return filterList(oldUnused())};window.unusedVerbs.__releaseBridge=true}
    if(typeof window.currentPracticeVerbs==='function'&&!window.currentPracticeVerbs.__releaseBridge){var oldPractice=window.currentPracticeVerbs;window.currentPracticeVerbs=function(){syncState();return filterList(oldPractice())};window.currentPracticeVerbs.__releaseBridge=true}
    if(typeof window.currentPackageAllVerbs==='function'&&!window.currentPackageAllVerbs.__releaseBridge){var oldPackage=window.currentPackageAllVerbs;window.currentPackageAllVerbs=function(){syncState();return filterList(oldPackage())};window.currentPackageAllVerbs.__releaseBridge=true}
    if(typeof window.handleAssessmentClick==='function'&&!window.handleAssessmentClick.__releaseBridge){var oldHandle=window.handleAssessmentClick;window.handleAssessmentClick=function(){var run=function(){syncState();if(!assessmentOn()){seedPackageWhenAssessmentOff();if(typeof renderHome==='function')renderHome();return}return oldHandle.apply(this,arguments)}.bind(this);if(!releaseLoaded&&window.spVerbReleaseReady)return window.spVerbReleaseReady.then(run);return run()};window.handleAssessmentClick.__releaseBridge=true}
    if(typeof window.renderHome==='function'&&!window.renderHome.__releaseBridge){var oldRender=window.renderHome;window.renderHome=function(){var args=arguments,ctx=this;if(!releaseLoaded&&window.spVerbReleaseReady){var app=document.getElementById('app');if(app)app.innerHTML='<section class="card"><h2>Verben werden geladen …</h2><p class="small">Die aktuelle Kursfreigabe wird geprüft.</p></section>';return window.spVerbReleaseReady.then(function(){syncState();return oldRender.apply(ctx,args)})}syncState();return oldRender.apply(ctx,args)};window.renderHome.__releaseBridge=true}
  }
  function afterLoad(){patchFunctions();syncState();try{if(typeof renderHome==='function'&&window.state&&state.phase==='home')renderHome()}catch(e){}}

  releaseData=localData();
  window.spReleasedVerbList=released;
  window.spStrictReleasedVerbList=released;
  window.spVerbAssessmentEnabled=assessmentOn;
  window.spVerbPracticeTargetCount=targetCount;
  window.spSyncVerbRelease=syncState;
  window.spVerbReleaseDebug=function(){return {loaded:releaseLoaded,teacher:isTeacher(),codes:courseCodes(),released:released(),target:targetCount(),assessmentEnabled:assessmentOn(),data:data(),state:window.state?{active:state.active,currentPackageVerbs:state.currentPackageVerbs,phase:state.phase,releaseFingerprint:state._releaseFingerprint}:null}};
  releaseLoading=loadRemote().then(function(){afterLoad();return data()}).catch(function(e){releaseLoaded=true;afterLoad();return data()});
  window.spVerbReleaseReady=releaseLoading;
  patchFunctions();
  document.addEventListener('DOMContentLoaded',afterLoad);
  setTimeout(afterLoad,250);setTimeout(afterLoad,1000);setTimeout(afterLoad,3000);
})();