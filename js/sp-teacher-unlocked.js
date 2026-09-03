(function(){
  if(window.__SP_TEACHER_UNLOCKED__)return;
  window.__SP_TEACHER_UNLOCKED__=true;

  const realSet=Storage.prototype.setItem;
  const realGet=Storage.prototype.getItem;
  const realRemove=Storage.prototype.removeItem;
  const TEST_PREFIX='SP_TEACHER_TEST_PROGRESS_';

  function rawGet(storage,key){try{return realGet.call(storage,key)}catch(e){return null}}
  function readJson(storage,key){try{return JSON.parse(rawGet(storage,key)||'null')||{}}catch(e){return{}}}
  function role(){return String(rawGet(localStorage,'SP_LOGIN_ROLE')||rawGet(localStorage,'SP_ACTIVE_ROLE')||rawGet(localStorage,'SP_AUTH_ROLE')||rawGet(localStorage,'SP_LOGIN_CONTEXT')||'').toLowerCase()}
  function teacherProfile(){const teacher=readJson(localStorage,'SP_TEACHER_PROFILE');if(Object.keys(teacher).length)return teacher;return readJson(localStorage,'SP_USER_PROFILE')}
  function userProfile(){return readJson(localStorage,'SP_USER_PROFILE')}
  function isTeacher(){const r=role(),p=teacherProfile(),pr=String(p.role||p.loginRole||p.type||'').toLowerCase();return ['teacher','lehrer','admin','owner'].includes(r)||['teacher','lehrer','admin','owner'].includes(pr)||p.isTeacher===true||p.teacher===true||p.admin===true||p.owner===true}
  function isLearningPage(){return /\/(wortschatz|verben|verben-A1|fragen|fragen-A1|perfekt|grammatik)(?:\/|$)/i.test(String(location.pathname||''))}
  if(!isTeacher())return;

  function previewData(){const session=rawGet(sessionStorage,'SP_TEACHER_PREVIEW');if(session){if(session==='1')return{teacherPreview:true,courseCode:rawGet(sessionStorage,'SP_PREVIEW_COURSE')||rawGet(localStorage,'SP_PREVIEW_COURSE')||''};try{const parsed=JSON.parse(session);if(parsed&&parsed.teacherPreview===true)return parsed}catch(e){}}const local=rawGet(localStorage,'SP_TEACHER_PREVIEW');if(local==='1')return{teacherPreview:true,courseCode:rawGet(localStorage,'SP_PREVIEW_COURSE')||''};try{const parsed=JSON.parse(local||'null');if(parsed&&parsed.teacherPreview===true)return parsed}catch(e){}return{}}
  function clean(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')||'kurs'}
  function courseKey(){const preview=previewData(),p=userProfile(),teacher=teacherProfile();return clean(preview.courseCode||preview.kurs||rawGet(localStorage,'SP_PREVIEW_COURSE')||p.courseCode||p.kurs||p.kursnummer||teacher.courseCode||teacher.kurs||teacher.kursnummer||'kurs')}
  function shouldRedirectKey(key){const k=String(key||'');return /^(SP_(?:L\d|TASK_|THEME_|SCORE_RUN_|PROGRESS_|DASHBOARD_PROGRESS|POINTS_|COURSE_LEADERBOARD|EXAM_)|A1_ACTIVE_SESSION)/i.test(k)||/EXAM_HISTORY|EXAM_UNLOCK|LEADERBOARD|RANKING/i.test(k)}
  function testKey(key){return TEST_PREFIX+courseKey()+'_'+String(key||'')}
  function isPreviewProgressKey(key){const k=String(key||'');return k.startsWith(TEST_PREFIX)||k.startsWith('SP_TEACHER_PREVIEW_PROGRESS_')||k.startsWith('SP_L7_PREVIEW_')||k.startsWith('SP_L8_PREVIEW_')||k.startsWith('SP_TEACHER_TEST_')}
  function isSessionProgressKey(key){const k=String(key||'');return isPreviewProgressKey(k)||shouldRedirectKey(k)||/^SP_(?:TASK_STATE_|TASK_|THEME_|SCORE_RUN_|L\d|PROGRESS_|POINTS_|EXAM_)/i.test(k)}

  if(!window.__SP_TEACHER_TEST_STORAGE_PATCH__){
    window.__SP_TEACHER_TEST_STORAGE_PATCH__=true;
    Storage.prototype.setItem=function(key,value){if(this===localStorage&&isTeacher()&&isLearningPage()&&shouldRedirectKey(key))return realSet.call(sessionStorage,testKey(key),value);return realSet.call(this,key,value)};
    Storage.prototype.getItem=function(key){if(this===localStorage&&isTeacher()&&isLearningPage()&&shouldRedirectKey(key))return realGet.call(sessionStorage,testKey(key));return realGet.call(this,key)};
    Storage.prototype.removeItem=function(key){if(this===localStorage&&isTeacher()&&isLearningPage()&&shouldRedirectKey(key))return realRemove.call(sessionStorage,testKey(key));return realRemove.call(this,key)};
  }

  window.spTeacherCanSeeAll=true;
  window.spIsTeacherUnrestricted=function(){return true};
  window.spCanSaveStudentProgress=function(){return false};
  window.spCanWriteFirebaseProgress=function(){return false};

  function collectKeys(storage,predicate){const keys=[];for(let i=0;i<storage.length;i++){const key=String(storage.key(i)||'');if(predicate(key))keys.push(key)}return keys}
  function clearTeacherProgressStorage(){const sessionKeys=collectKeys(sessionStorage,isSessionProgressKey),localProgressKeys=collectKeys(localStorage,key=>isPreviewProgressKey(key)||shouldRedirectKey(key));let removed=0;for(const key of sessionKeys){try{realRemove.call(sessionStorage,key);removed++}catch(e){}}for(const key of localProgressKeys){try{realRemove.call(localStorage,key);removed++}catch(e){}}const sessionRest=collectKeys(sessionStorage,key=>shouldRedirectKey(key)||isPreviewProgressKey(key)),localRest=collectKeys(localStorage,key=>shouldRedirectKey(key)||isPreviewProgressKey(key));for(const key of sessionRest){try{realRemove.call(sessionStorage,key);removed++}catch(e){}}for(const key of localRest){try{realRemove.call(localStorage,key);removed++}catch(e){}}try{delete window.SP_L7_LOCAL_SCORE_QUEUE}catch(e){}try{delete window.SP_PROGRESS_QUEUE}catch(e){}try{window.__SP_TEACHER_PROGRESS_RESET_AT=Date.now()}catch(e){}return removed}
  function resetTeacherProgress(){if(!isTeacher())return false;if(!confirm('Fortschritte löschen und die Aufgabe neu starten? Teilnehmerdaten bleiben unverändert.'))return false;clearTeacherProgressStorage();try{window.dispatchEvent(new CustomEvent('SP_TEACHER_TEST_PROGRESS_RESET'))}catch(e){}const url=new URL(location.href);url.searchParams.set('teacherReset',String(Date.now()));location.replace(url.href);return true}
  window.spResetTeacherTestProgress=resetTeacherProgress;
  window.spClearTeacherTestProgress=clearTeacherProgressStorage;
  window.spResetTeacherProgress=resetTeacherProgress;
  window.spClearTeacherProgress=clearTeacherProgressStorage;

  function replaceReset(holder,name){try{if(!holder||typeof holder[name]!=='function'||holder[name].__teacherProgressReset)return;const patched=function(){return resetTeacherProgress()};patched.__teacherProgressReset=true;holder[name]=patched}catch(e){}}
  function patchFunctions(){
    try{window.isExamUnlocked=function(){return true}}catch(e){}
    try{window.allPrereqComplete=function(){return true}}catch(e){}
    try{window.examUnlocked=function(){return true}}catch(e){}
    try{window.unlocked=function(){return true}}catch(e){}
    try{window.l6t4ExamUnlocked=function(){return true}}catch(e){}
    try{window.l6t3ExamUnlocked=function(){return true}}catch(e){}
    ['resetThemeProgress','resetCurrentPackage','resetEverything','resetProgress','clearProgress'].forEach(name=>replaceReset(window,name));
    replaceReset(window.L7S,'reset');replaceReset(window.L8S,'reset');replaceReset(window.L7ThemeScore,'resetPractice');replaceReset(window.L8ThemeScore,'resetPractice');
    if(typeof window.pctFor==='function'&&!window.pctFor.__teacherUnlocked){const old=window.pctFor,patched=function(file,total){if(String(file||'').includes('pruefung')||String(file||'').includes('exam'))return old(file,total)||0;return Math.max(old(file,total)||0,100)};patched.__teacherUnlocked=true;window.pctFor=patched}
    if(typeof window.pct==='function'&&!window.pct.__teacherUnlocked){const old=window.pct,patched=function(file,total){if(String(file||'').includes('pruefung')||String(file||'').includes('exam'))return old(file,total)||0;return Math.max(old(file,total)||0,100)};patched.__teacherUnlocked=true;window.pct=patched}
  }

  function buttonClass(nav){if(nav.querySelector('.l7-btn'))return'l7-btn';if(nav.querySelector('.btn'))return'btn';return'btn'}
  function styleResetButton(button){if(!button)return;button.style.setProperty('background','#ffe1e1','important');button.style.setProperty('color','#9b1c12','important');button.style.setProperty('border','2px solid #ffc1b8','important');button.style.setProperty('box-shadow','none','important')}
  function injectResetButton(){if(!isLearningPage())return;const nav=document.querySelector('.l7-topbar nav,.topbar nav,header.topbar nav,nav.nav,nav');if(!nav)return;[...nav.querySelectorAll('button')].forEach(button=>{if(button.id==='spTeacherTestReset')return;if(/fortschritt.*löschen|fortschritte.*löschen|zurücksetzen/i.test(String(button.textContent||'')))button.style.display='none'});let button=document.getElementById('spTeacherTestReset');if(button){button.textContent='Fortschritte löschen';styleResetButton(button);return}button=document.createElement('button');button.id='spTeacherTestReset';button.type='button';button.className=buttonClass(nav);button.textContent='Fortschritte löschen';styleResetButton(button);button.addEventListener('click',resetTeacherProgress);nav.appendChild(button)}
  function unlockDom(){document.querySelectorAll('.locked,.exam-locked,[aria-disabled="true"]').forEach(el=>{el.classList.remove('locked','exam-locked');el.removeAttribute('aria-disabled');el.style.pointerEvents='';el.style.opacity='';const start=el.querySelector?.('.start');if(start&&/gesperrt|fertig/i.test(start.textContent||''))start.textContent='Testen';const p=el.querySelector?.('p');if(p&&/gesperrt|freigeschaltet|100/i.test(p.textContent||''))p.textContent='Lehreransicht: frei zum Testen.'});document.querySelectorAll('.module.done,.task-card.done').forEach(el=>{el.classList.remove('done');el.style.pointerEvents='';const start=el.querySelector?.('.start');if(start)start.textContent='Testen'});document.querySelectorAll('a.module,a.task-card').forEach(a=>{a.style.pointerEvents='';a.removeAttribute('aria-disabled')})}

  let runQueued=false;
  function run(){runQueued=false;patchFunctions();unlockDom();injectResetButton()}
  function scheduleRun(delay=0){if(runQueued)return;runQueued=true;setTimeout(run,delay)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>scheduleRun(0),{once:true});else scheduleRun(0);
  window.addEventListener('load',()=>scheduleRun(0),{once:true});
  [120,500,1200,2500].forEach(t=>setTimeout(()=>scheduleRun(0),t));
  try{
    let observerTimer=null;
    const observer=new MutationObserver(()=>{clearTimeout(observerTimer);observerTimer=setTimeout(()=>scheduleRun(0),80)});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>{try{observer.disconnect()}catch(e){}clearTimeout(observerTimer)},4500);
  }catch(e){}
})();
