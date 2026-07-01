(function(){
  if(!document.currentScript)return;

  var releaseData=null;
  var releaseLoaded=false;

  function parseJson(key){try{return JSON.parse(localStorage.getItem(key)||'null')||{}}catch(e){return {}}}
  function getDb(){try{if(typeof db!=='undefined'&&db)return db}catch(e){}return window.db||null}
  function getState(){try{if(typeof state!=='undefined'&&state)return state}catch(e){return null}return null}
  function getProfile(){try{if(typeof profile!=='undefined'&&profile)return profile}catch(e){}return window.profile||parseJson('SP_USER_PROFILE')||parseJson('SP_STUDENT_PROFILE')||{}}
  function isTeacher(){
    var p=getProfile();
    var role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||p.role||p.loginRole||'').toLowerCase();
    return role==='teacher'||role==='lehrer'||p.teacherPreview===true||p.isTeacher===true;
  }
  function allVerbs(){return (window.ALL_VERBS||[]).map(function(x){return x&&x.v}).filter(Boolean)}
  function uniq(list){return Array.from(new Set((list||[]).filter(Boolean)))}
  function hasRelease(d){return !!(d&&(d.enabledWords||d.releases||d.enabledModules||d.settings||d.releaseMode||d.defaultLocked!==undefined||d.verbenA1AssessmentEnabled!==undefined||d.assignments))}
  function getPath(obj,path){var cur=obj;for(var i=0;i<path.length;i++){if(!cur||typeof cur!=='object'||!(path[i] in cur))return undefined;cur=cur[path[i]]}return cur}
  function setLocalRelease(data){
    try{
      localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(data||{}));
      var p=getProfile();
      p.assignments=data||{};
      p.courseCode=p.courseCode||data.courseCode||data.code||data.kurs||data.kursnummer||'';
      p.courseDocId=p.courseDocId||data.courseDocId||data.id||data.__docId||'';
      localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));
      localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(p));
    }catch(e){}
  }
  function localRelease(){
    var p=getProfile();
    if(hasRelease(p.assignments))return p.assignments;
    var cached=parseJson('SP_COURSE_RELEASES');
    return hasRelease(cached)?cached:{};
  }
  function addCourseValues(src,out){
    if(!src)return;
    ['courseDocId','courseCode','kurs','kursnummer','courseId','id','__docId','code','name','courseName'].forEach(function(k){
      var v=String(src[k]||'').trim();
      if(v)out.push(v,v.toLowerCase(),v.toUpperCase(),v.replace(/\s+/g,''),v.toLowerCase().replace(/\s+/g,''));
    });
  }
  async function readStudent(dbx){
    var p=getProfile();
    var id=p.studentId||p.userId||p.docId||localStorage.getItem('SP_STUDENT_ID')||'';
    if(!dbx||!id)return null;
    try{var snap=await dbx.collection('students').doc(String(id)).get();return snap.exists?Object.assign({__studentId:snap.id},snap.data()||{}):null}catch(e){return null}
  }
  async function readCourseById(dbx,id){
    try{var snap=await dbx.collection('courses').doc(String(id)).get();return snap.exists?Object.assign({id:snap.id,__docId:snap.id},snap.data()||{}):null}catch(e){return null}
  }
  async function readCourseByField(dbx,field,value){
    try{var qs=await dbx.collection('courses').where(field,'==',String(value)).limit(1).get();if(qs&&!qs.empty){var d=qs.docs[0];return Object.assign({id:d.id,__docId:d.id},d.data()||{})}}catch(e){}
    return null;
  }
  async function loadRelease(){
    if(isTeacher()){releaseData={releaseMode:'all',defaultLocked:false};releaseLoaded=true;return releaseData}
    var dbx=getDb();
    var fallback=localRelease();
    if(!dbx){releaseData=fallback;releaseLoaded=true;return releaseData}
    var p=getProfile();
    var student=await readStudent(dbx);
    var values=[];
    addCourseValues(p,values);addCourseValues(p.assignments,values);addCourseValues(student,values);
    if(student&&hasRelease(student.assignments)){
      fallback=Object.assign({courseCode:student.courseCode||student.kurs||student.kursnummer||'',courseDocId:student.courseDocId||''},student.assignments||{});
      setLocalRelease(fallback);
    }
    values=uniq(values.map(function(v){return String(v||'').trim()}).filter(Boolean));
    for(var i=0;i<values.length;i++){var byId=await readCourseById(dbx,values[i]);if(hasRelease(byId)){releaseData=byId;releaseLoaded=true;setLocalRelease(byId);return byId}}
    var fields=['courseDocId','courseCode','code','kurs','kursnummer','courseId','id','name','courseName'];
    for(var f=0;f<fields.length;f++)for(var j=0;j<values.length;j++){var found=await readCourseByField(dbx,fields[f],values[j]);if(hasRelease(found)){releaseData=found;releaseLoaded=true;setLocalRelease(found);return found}}
    releaseData=fallback;releaseLoaded=true;return releaseData;
  }
  function data(){return isTeacher()?{releaseMode:'all',defaultLocked:false}:(hasRelease(releaseData)?releaseData:localRelease())}
  function moduleOpen(d){var values=[getPath(d,['enabledModules','Verben A1']),getPath(d,['enabledModules','verben-A1']),getPath(d,['releases','Verben A1','enabled']),getPath(d,['releases','verben-A1','enabled'])];return !values.some(function(v){return v===false})}
  function verbValue(d,verb){
    var ew=d.enabledWords;
    if(Array.isArray(ew))return ew.includes(verb)||ew.includes('verben-A1/'+verb)||ew.includes('Verben A1/'+verb)?true:undefined;
    var paths=[['enabledWords',verb],['enabledWords','verben-A1/'+verb],['enabledWords','Verben A1/'+verb],['releases','verben-A1','words',verb],['releases','Verben A1','words',verb]];
    for(var i=0;i<paths.length;i++){var v=getPath(d,paths[i]);if(v!==undefined)return v===true}
    return undefined;
  }
  function hasVerbControls(d){
    var ew=d.enabledWords||{};var names=allVerbs();
    if(Array.isArray(ew)&&ew.length)return true;
    if(Object.keys(ew).some(function(k){return names.indexOf(k)>=0||k.indexOf('verben-A1/')>=0||k.indexOf('Verben A1/')>=0}))return true;
    return !!(getPath(d,['releases','verben-A1','words'])||getPath(d,['releases','Verben A1','words']));
  }
  function releasedVerbs(){
    var names=allVerbs();var d=data();
    if(isTeacher())return names;
    if(!hasRelease(d)||!moduleOpen(d))return [];
    if(hasVerbControls(d))return names.filter(function(v){return verbValue(d,v)===true});
    if(d.releaseMode==='all'||d.releaseMode==='open'||d.defaultLocked===false)return names.filter(function(v){return verbValue(d,v)!==false});
    return [];
  }
  function assessmentEnabled(){
    var d=data();
    var values=[getPath(d,['settings','verben-A1','assessmentEnabled']),getPath(d,['settings','Verben A1','assessmentEnabled']),d.verbenA1AssessmentEnabled,getPath(d,['releases','verben-A1','assessmentEnabled']),getPath(d,['releases','Verben A1','assessmentEnabled'])];
    for(var i=0;i<values.length;i++)if(values[i]!==undefined)return values[i]!==false;
    return true;
  }
  function target(){return Math.min(20,releasedVerbs().length)}
  function filter(list){var allowed=new Set(releasedVerbs());return (list||[]).filter(function(v){return allowed.has(v)})}
  function resetQueues(S){S.practicePool=[];S.taskQueues={};S.taskDoneSets={};S.currentTask=null;S.memoryCards=[];S.memoryDone=[];S.openCards=[];S.first=null;S.lock=false;S.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0}}
  function seedIfAssessmentOff(S){
    if(assessmentEnabled())return;
    var list=releasedVerbs().slice(0,20);if(!list.length)return;
    S.currentPackageVerbs=list.slice();S.assessmentBatch=list.slice();S.assessed=list.slice();S.known=filter(S.known||[]);S.learned=filter(S.learned||[]);S.unsure=list.filter(function(v){return !(S.known||[]).includes(v)&&!(S.learned||[]).includes(v)});S.unknown=[];S.active=S.unsure.length?S.unsure.slice():list.slice();S.currentVerb='';
  }
  function syncRelease(){
    var S=getState();if(!S||isTeacher()||(!releaseLoaded&&!hasRelease(releaseData)))return false;
    var allowed=new Set(releasedVerbs());var fp=JSON.stringify({verbs:Array.from(allowed),assessment:assessmentEnabled(),course:(data().id||data().courseDocId||'')});var old=S._releaseFingerprint||'';var before='';try{before=JSON.stringify(S)}catch(e){}
    ['known','unsure','unknown','active','learned','practicePool','assessmentBatch','assessed','currentPackageVerbs'].forEach(function(k){if(Array.isArray(S[k]))S[k]=S[k].filter(function(v){return allowed.has(v)})});
    Object.keys(S.taskQueues||{}).forEach(function(k){S.taskQueues[k]=(S.taskQueues[k]||[]).filter(function(x){return x&&allowed.has(x.v)})});
    Object.keys(S.taskDoneSets||{}).forEach(function(k){S.taskDoneSets[k]=(S.taskDoneSets[k]||[]).filter(function(x){return allowed.has(String(x).split(':')[0])})});
    ['skillDone','skillAttempts','skillSuccess','weak'].forEach(function(k){Object.keys(S[k]||{}).forEach(function(v){if(!allowed.has(v))delete S[k][v]})});
    if(S.currentVerb&&!allowed.has(S.currentVerb))S.currentVerb='';if(S.currentTask&&S.currentTask.v&&!allowed.has(S.currentTask.v))S.currentTask=null;if(S.exam&&Array.isArray(S.exam.items))S.exam.items=S.exam.items.filter(function(x){return x&&(!x.v||allowed.has(x.v))});
    if(old&&old!==fp)resetQueues(S);S._releaseFingerprint=fp;seedIfAssessmentOff(S);
    try{if(typeof normalizeVerbStatusLists==='function')normalizeVerbStatusLists()}catch(e){}
    var after='';try{after=JSON.stringify(S)}catch(e){}if(before!==after)try{if(typeof saveState==='function')saveState()}catch(e){}return before!==after;
  }
  function taskGridHtml(){
    if(typeof taskCard!=='function'||typeof examCard!=='function')return '';
    return taskCard('karteikarte','K','flashcards',1)+taskCard('memory','M','memory',2)+taskCard('bild_verb','B','quiz',3)+taskCard('verb_bild','V','verbToImage',4)+taskCard('schreiben','S','writeVerb',5)+taskCard('hoeren_schreiben','H','hearWrite',6)+taskCard('hoeren_sprechen','SP','hearSpeak',7)+taskCard('bild_sprechen','BS','imageSpeak',8)+taskCard('satz_puzzle','P','sentencePuzzle',9)+taskCard('konjugieren','KG','conjugationTask',10)+examCard();
  }
  function renderBridgeHome(){
    var app=document.getElementById('app');var S=getState();if(!app||!S)return false;
    var allowed=releasedVerbs();var t=target();var pc=typeof currentPracticeVerbs==='function'?currentPracticeVerbs().length:0;
    if(typeof clearVerbHash==='function')try{clearVerbHash(true)}catch(e){}
    try{app.classList.remove('card')}catch(e){}
    S.phase='home';S.currentTask=null;syncRelease();pc=typeof currentPracticeVerbs==='function'?currentPracticeVerbs().length:0;
    var box=typeof statusBox==='function'?statusBox():'';
    if(!allowed.length){app.innerHTML=box+'<section class="card"><h2>Keine Verben freigegeben</h2><p class="small">Für deinen Kurs sind aktuell keine Verben A1 freigeschaltet.</p></section>';try{if(typeof saveState==='function')saveState()}catch(e){}return true}
    if(pc>=t&&t>0){app.innerHTML=box+'<section class="card"><div class="grid task-grid">'+taskGridHtml()+'</div></section>';try{if(typeof saveState==='function')saveState()}catch(e){}return true}
    if(pc<t){var missing=t-pc;app.innerHTML=box+'<section class="card"><h2>Verben einschätzen</h2><p class="small">Für deinen Kurs sind '+t+' Verben freigegeben. Aktuell hast du '+pc+'/'+t+' Übungsverben. Schätze weiter ein, bis noch '+missing+' Übungsverben dazukommen.</p><div class="actions"><button class="btn green" onclick="handleAssessmentClick()">Verben einschätzen fortsetzen</button></div></section>';try{if(typeof saveState==='function')saveState()}catch(e){}return true}
    return false;
  }
  function patch(){
    if(typeof window.currentPracticeVerbs==='function'&&!window.currentPracticeVerbs.__releaseClean){var old1=window.currentPracticeVerbs;window.currentPracticeVerbs=function(){syncRelease();return filter(old1())};window.currentPracticeVerbs.__releaseClean=true}
    if(typeof window.currentPackageAllVerbs==='function'&&!window.currentPackageAllVerbs.__releaseClean){var old2=window.currentPackageAllVerbs;window.currentPackageAllVerbs=function(){syncRelease();return filter(old2())};window.currentPackageAllVerbs.__releaseClean=true}
    if(typeof window.unusedVerbs==='function'&&!window.unusedVerbs.__releaseClean){var old3=window.unusedVerbs;window.unusedVerbs=function(){return assessmentEnabled()?filter(old3()):[]};window.unusedVerbs.__releaseClean=true}
    if(typeof window.statusBox==='function'&&!window.statusBox.__releaseClean){var oldStatus=window.statusBox;window.statusBox=function(){var html=oldStatus();try{return html.replace('/'+PRACTICE_TARGET_COUNT+' Verben zu üben','/'+target()+' Verben zu üben')}catch(e){return html}};window.statusBox.__releaseClean=true}
    if(typeof window.renderHome==='function'&&!window.renderHome.__releaseClean){var oldHome=window.renderHome;window.renderHome=function(){if(!releaseLoaded&&window.spVerbReleaseReady){var app=document.getElementById('app');if(app)app.innerHTML='<section class="card"><h2>Verben werden geladen</h2><p class="small">Die aktuelle Kursfreigabe wird geprüft.</p></section>';return window.spVerbReleaseReady.then(function(){syncRelease();return renderBridgeHome()||oldHome()})}syncRelease();return renderBridgeHome()||oldHome()};window.renderHome.__releaseClean=true}
  }
  function afterLoad(){patch();syncRelease();try{if(typeof renderHome==='function'&&getState()&&state.phase==='home')renderHome()}catch(e){}}
  releaseData=localRelease();
  window.spReleasedVerbList=releasedVerbs;window.spStrictReleasedVerbList=releasedVerbs;window.spVerbAssessmentEnabled=assessmentEnabled;window.spVerbPracticeTargetCount=target;window.spSyncVerbRelease=syncRelease;
  window.spVerbReleaseDebug=function(){var d=data();return {loaded:releaseLoaded,teacher:isTeacher(),courseId:d.id||d.__docId||d.courseDocId||'',released:releasedVerbs(),target:target(),assessmentEnabled:assessmentEnabled(),data:d,state:getState()?{active:state.active,currentPackageVerbs:state.currentPackageVerbs,phase:state.phase,releaseFingerprint:state._releaseFingerprint}:null}};
  window.spVerbReleaseReady=loadRelease().then(function(){afterLoad();return data()}).catch(function(e){console.warn('Verben-Freigabe konnte nicht geladen werden',e);releaseLoaded=true;afterLoad();return data()});
  patch();document.addEventListener('DOMContentLoaded',afterLoad);setTimeout(afterLoad,250);setTimeout(afterLoad,1000);setTimeout(afterLoad,3000);
})();