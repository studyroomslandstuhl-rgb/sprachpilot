(function(){
let remoteData=null;let refreshPromise=null;let releaseApi=null;let linkObserver=null;
function safeJson(s,f){try{return JSON.parse(s||'')||f}catch(e){return f}}
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')||JSON.parse(localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return {}}}
function norm(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,'')}
function courseCode(){const p=profile();return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function courseValues(data={}){return [data.courseCode,data.kurs,data.kursnummer,data.course,data.courseDocId,data.id,data.code].map(norm).filter(Boolean)}
function cacheMatches(data){const code=norm(courseCode());if(!code)return false;const marker=norm(localStorage.getItem('SP_RELEASE_CACHE_COURSE')||'');return marker===code||courseValues(data).includes(code)}
function cachedData(){const p=profile(),a=p.assignments||null,b=safeJson(localStorage.getItem('SP_COURSE_RELEASES'),null);if(a&&cacheMatches(a))return a;if(b&&cacheMatches(b))return b;return {}}
function localData(){return remoteData||cachedData()||{}}
function hasData(data){return !!(data&&typeof data==='object'&&Object.keys(data).length)}
function val(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
function explicit(paths,data){const values=paths.map(p=>val(data,p)).filter(v=>v!==undefined);if(values.some(v=>v===true))return true;if(values.some(v=>v===false))return false;return undefined}
function locked(data){return !data||data.defaultLocked!==false&&data.releaseMode!=='open'&&data.releaseMode!=='all'}
async function api(){if(releaseApi)return releaseApi;releaseApi=await import('/js/course-releases.js?v=release-core-20260824a');return releaseApi}
function remember(data){
  if(!data)return null;remoteData=data;
  try{
    const p=profile(),canonical=String(data.courseCode||data.kurs||data.kursnummer||p.courseCode||p.kurs||p.kursnummer||'').trim();
    p.assignments=data;
    if(canonical){p.courseCode=canonical;p.kurs=canonical;p.kursnummer=canonical;localStorage.setItem('SP_COURSE_CODE',canonical)}
    if(data.id||data.courseDocId)p.courseDocId=data.courseDocId||data.id;
    localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(data));
    localStorage.setItem('SP_RELEASE_CACHE_COURSE',canonical||String(data.id||p.courseDocId||''));
    localStorage.setItem('SP_RELEASE_SYNC_AT',String(Date.now()));
    localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));
    localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(p));
  }catch(e){}
  return data;
}
async function refresh(){
 if(refreshPromise)return refreshPromise;
 refreshPromise=(async()=>{
  try{
   const mod=await api();
   const data=await mod.loadCourseRelease(profile());
   if(hasData(data)){remember(data);return data}
  }catch(e){console.warn('Freigaben konnten nicht aktuell vom Server geladen werden',e)}
  return cachedData();
 })().finally(()=>{refreshPromise=null});
 return refreshPromise;
}
function canonicalTaskFile(value,search=''){
 let raw=String(value||'').trim();if(!raw)return'';
 let base='',params=null;
 try{
  const url=new URL(raw,location.href);base=decodeURIComponent(url.pathname.split('/').filter(Boolean).pop()||'index.html');params=url.searchParams;
 }catch(e){
  const split=raw.split('?');base=decodeURIComponent(split[0].split('/').filter(Boolean).pop()||'index.html');params=new URLSearchParams(split[1]||search||'');
 }
 if(base.toLowerCase()==='task.html'){
  const id=String(params?.get('task')||new URLSearchParams(search||'').get('task')||'').trim();
  if(id)return 'task.html?task='+encodeURIComponent(id);
 }
 return base||'index.html'
}
function ctxFromPath(){const p=location.pathname;let m=p.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/(.*)$/i);if(m)return{module:'wortschatz',lesson:m[1],theme:m[2],file:canonicalTaskFile(m[3]||'index.html',location.search),kind:'task'};m=p.match(/\/wortschatz\/(A\d-Lektion-\d+)\/?(?:index\.html)?$/i);if(m)return{module:'wortschatz',lesson:m[1],theme:'',file:'index.html',kind:'lesson'};if(/\/wortschatz\/?(?:index\.html)?$/i.test(p))return{module:'wortschatz',lesson:'',theme:'',file:'index.html',kind:'module'};return{module:'',lesson:'',theme:'',file:canonicalTaskFile(p,location.search),kind:''}}
function localModuleReleased(data){const v=explicit([['enabledModules','Wortschatz'],['enabledModules','wortschatz'],['releases','Wortschatz','enabled'],['releases','wortschatz','enabled']],data);if(v!==undefined)return v;return !locked(data)}
function localLessonReleased(ctx,data){if(!ctx.lesson)return localModuleReleased(data);const v=explicit([['enabledLessons',ctx.lesson],['enabledLessons','Wortschatz/'+ctx.lesson],['enabledLessons','wortschatz/'+ctx.lesson],['releases','wortschatz','lessons',ctx.lesson,'enabled'],['releases','Wortschatz','lessons',ctx.lesson,'enabled']],data);if(v!==undefined)return v;return localModuleReleased(data)&&!locked(data)}
function localThemeReleased(ctx,data){if(!ctx.theme)return localLessonReleased(ctx,data);const v=explicit([['enabledThemes',ctx.lesson+'/'+ctx.theme],['enabledThemes','Wortschatz/'+ctx.lesson+'/'+ctx.theme],['enabledThemes','wortschatz/'+ctx.lesson+'/'+ctx.theme],['releases','wortschatz','lessons',ctx.lesson,'themes',ctx.theme,'enabled'],['releases','Wortschatz','lessons',ctx.lesson,'themes',ctx.theme,'enabled']],data);if(v!==undefined)return v;return localLessonReleased(ctx,data)&&!locked(data)}
function moduleReleased(ctx,data=localData()){try{if(releaseApi?.moduleOpen)return releaseApi.moduleOpen(data,'Wortschatz')}catch(e){}return localModuleReleased(data)}
function lessonReleased(ctx,data=localData()){try{if(releaseApi?.lessonOpen)return releaseApi.lessonOpen(data,'Wortschatz',ctx.lesson)}catch(e){}return localLessonReleased(ctx,data)}
function themeReleased(ctx,data=localData()){try{if(releaseApi?.themeOpen)return releaseApi.themeOpen(data,'Wortschatz',ctx.lesson,ctx.theme)}catch(e){}return localThemeReleased(ctx,data)}
function taskFile(t){return canonicalTaskFile(Array.isArray(t)?t[0]:(t&&t.file)||(t&&t.href)||t||'')}
function taskPaths(file,ctx){return [
 ['enabledTasks',ctx.lesson+'/'+ctx.theme+'/'+file],
 ['enabledTasks','wortschatz/'+ctx.lesson+'/'+ctx.theme+'/'+file],
 ['enabledTasks','Wortschatz/'+ctx.lesson+'/'+ctx.theme+'/'+file],
 ['releases','wortschatz','lessons',ctx.lesson,'themes',ctx.theme,'tasks',file],
 ['releases','Wortschatz','lessons',ctx.lesson,'themes',ctx.theme,'tasks',file]
]}
function taskExplicitValue(file,ctx,data){return explicit(taskPaths(canonicalTaskFile(file),ctx),data)}
function taskReleased(file,ctx=ctxFromPath(),data=localData()){
 file=canonicalTaskFile(file);
 if(!file||/^(statistik|uebersicht|übersicht)\.html$/i.test(file))return true;
 if(ctx.kind==='lesson'||(!ctx.theme&&file==='index.html'))return lessonReleased(ctx,data);
 if(file==='index.html')return themeReleased(ctx,data);
 if(!themeReleased(ctx,data))return false;
 try{if(releaseApi?.taskOpen)return releaseApi.taskOpen(data,'Wortschatz',ctx.lesson,ctx.theme,file)}catch(e){}
 const v=taskExplicitValue(file,ctx,data);return v===undefined?true:v===true
}
function filterTasks(tasks,ctx=ctxFromPath(),data=localData()){return (tasks||[]).filter(t=>taskReleased(taskFile(t),ctx,data))}
function examUnlocked(tasks,percentFn,ctx=ctxFromPath(),data=localData()){const rel=filterTasks(tasks,ctx,data).filter(t=>!/(pruefung|prüfung|exam|__exam__)/i.test(taskFile(t)));if(!rel.length)return true;return rel.every(t=>Number(percentFn(taskFile(t),Array.isArray(t)?t[1]:(t.total||1)))>=100)}
function lessonCtx(lesson){return{module:'wortschatz',lesson:String(lesson||''),theme:'',file:'index.html',kind:'lesson'}}
function cleanLabel(a){return(a.textContent||'').replace('Gesperrt','').replace('Offen','').replace('🔒','').replace('✅','').trim()}
function applyLessonButtons(data=localData()){if(!/\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname))return;document.querySelectorAll('.lesson-btn[data-lesson]').forEach(a=>{const clone=a.cloneNode(true),lesson=clone.dataset.lesson,label=cleanLabel(clone),open=lessonReleased(lessonCtx(lesson),data);clone.textContent=label;clone.classList.toggle('open',open);clone.classList.toggle('locked',!open);clone.dataset.releaseOpen=open?'1':'0';if(open){clone.setAttribute('href','./'+lesson+'/')}else{clone.removeAttribute('href')}clone.style.display='';clone.onclick=function(e){if(clone.dataset.releaseOpen!=='1'){e.preventDefault();alert('Diese Lektion ist für deinen Kurs noch nicht freigeschaltet.')}};a.replaceWith(clone)})}
function sameThemeTaskFromHref(href,ctx){
 if(!href||href==='#'||!ctx.lesson||!ctx.theme)return'';
 try{
  const url=new URL(href,location.href),needle=`/wortschatz/${ctx.lesson}/${ctx.theme}/`;
  if(!url.pathname.includes(needle))return'';
  const file=canonicalTaskFile(url.href);
  if(!file||file==='index.html'||/^(statistik|uebersicht|übersicht)\.html$/i.test(file))return'';
  return file;
 }catch(e){return''}
}
function ensureReleaseStyle(){if(document.getElementById('sp-release-task-style'))return;const s=document.createElement('style');s.id='sp-release-task-style';s.textContent='.sp-release-task-locked{opacity:.55!important;filter:saturate(.55);cursor:not-allowed!important}.sp-release-task-locked .start,.sp-release-task-locked .l7-module-bottom strong{font-size:0}.sp-release-task-locked .start:after,.sp-release-task-locked .l7-module-bottom strong:after{content:"Gesperrt";font-size:initial}';document.head.appendChild(s)}
function applyTaskLinks(data=localData()){
 const ctx=ctxFromPath();if(ctx.module!=='wortschatz'||!ctx.lesson||!ctx.theme||ctx.file!=='index.html')return;
 ensureReleaseStyle();
 document.querySelectorAll('a[href].module,a[href].l7-module,a[href].task-card,.grid a[href],#taskGrid a[href],#tasksGrid a[href]').forEach(a=>{
  const source=a.dataset.spReleaseHref||a.getAttribute('href')||'',file=sameThemeTaskFromHref(source,ctx);if(!file)return;
  const open=taskReleased(file,ctx,data);a.dataset.spReleaseOpen=open?'1':'0';
  if(open){if(a.dataset.spReleaseHref)a.setAttribute('href',a.dataset.spReleaseHref);delete a.dataset.spReleaseHref;a.classList.remove('sp-release-task-locked');a.removeAttribute('aria-disabled')}
  else{if(!a.dataset.spReleaseHref)a.dataset.spReleaseHref=a.getAttribute('href')||'';a.setAttribute('href','#');a.classList.add('sp-release-task-locked');a.setAttribute('aria-disabled','true')}
 })
}
function observeTaskLinks(data=localData()){
 const ctx=ctxFromPath();if(ctx.module!=='wortschatz'||!ctx.theme||ctx.file!=='index.html'||linkObserver)return;
 let timer=null;linkObserver=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>applyTaskLinks(localData()),40)});linkObserver.observe(document.documentElement,{childList:true,subtree:true});applyTaskLinks(data)
}
function blockCurrentIfNeeded(data=localData()){const ctx=ctxFromPath();if(ctx.module!=='wortschatz')return;applyLessonButtons(data);applyTaskLinks(data);if(ctx.kind==='module'||ctx.kind==='lesson'||ctx.file==='index.html')return;const allowed=taskReleased(ctx.file,ctx,data);if(allowed)return;const target=document.getElementById('area')||document.querySelector('.card')||document.querySelector('main')||document.body;target.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><div class="question">Gesperrt</div><p class="small">Diese Aufgabe ist für deinen Kurs nicht freigegeben.</p><div class="actions finish-actions"><a class="btn secondary" href="index.html">← Zurück</a></div></div>'}
window.SprachPilotRelease={refresh,ctxFromPath,canonicalTaskFile,taskReleased,filterTasks,examUnlocked,blockCurrentIfNeeded,localData,themeReleased,lessonReleased,moduleReleased,applyLessonButtons,applyTaskLinks};
document.addEventListener('click',event=>{const a=event.target?.closest?.('a[data-sp-release-open="0"]');if(!a)return;event.preventDefault();event.stopPropagation();alert('Diese Aufgabe ist für deinen Kurs noch nicht freigegeben.')},true);
document.addEventListener('DOMContentLoaded',()=>{
 const cached=localData();if(hasData(cached)){applyLessonButtons(cached);applyTaskLinks(cached)}observeTaskLinks(cached);
 refresh().then(d=>{if(d){applyLessonButtons(d);applyTaskLinks(d);blockCurrentIfNeeded(d);try{window.dispatchEvent(new CustomEvent('SP_RELEASES_UPDATED',{detail:{course:courseCode(),fresh:true}}))}catch(e){}}});
});
})();