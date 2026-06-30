import('/js/topbar-standard.js?v=6').catch(function(){});
(function(){
  let remoteData=null;
  function safeJson(s,f){try{return JSON.parse(s||"")||f}catch(e){return f}}
  function profile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")||{}}catch(e){return {}}}
  function courseCode(){const p=profile();return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||""}
  function localData(){const p=profile();return remoteData||p.assignments||safeJson(localStorage.getItem("SP_COURSE_RELEASES"),{})||{}}
  async function refresh(){const code=courseCode();if(!code)return null;try{const mod=await import('/js/firebase.js');const snap=await mod.getDoc(mod.doc(mod.db,'courses',String(code)));if(snap.exists()){remoteData=snap.data()||{};localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(remoteData));const p=profile();p.assignments=remoteData;localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));return remoteData;}}catch(e){console.warn('Freigaben konnten nicht aktualisiert werden',e)}return null;}
  function val(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
  function isLockedByDefault(data){return data&&((data.releaseMode==='locked')||data.defaultLocked===true)}
  function ctxFromPath(){const p=location.pathname;let m=p.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/(.*)$/i);if(m)return {module:'wortschatz',lesson:m[1],theme:m[2],file:(m[3]||'index.html').split('/').pop()||'index.html',kind:'task'};m=p.match(/\/wortschatz\/(A\d-Lektion-\d+)\/?(?:index\.html)?$/i);if(m)return {module:'wortschatz',lesson:m[1],theme:'',file:'index.html',kind:'lesson'};if(/\/wortschatz\/?(?:index\.html)?$/i.test(p))return {module:'wortschatz',lesson:'',theme:'',file:'index.html',kind:'module'};return {module:'',lesson:'',theme:'',file:p.split('/').pop()||'index.html',kind:''};}
  function moduleReleased(ctx,data){const m=ctx.module==='wortschatz'?'Wortschatz':ctx.module;const keys=[["enabledModules",m],["releases",m,"enabled"],["releases",ctx.module,"enabled"]];for(const p of keys){const v=val(data,p);if(v!==undefined)return v===true;}return !isLockedByDefault(data);}
  function lessonReleased(ctx,data){if(!ctx.lesson)return moduleReleased(ctx,data);const keys=[["enabledLessons",ctx.lesson],["enabledLessons",ctx.module+'/'+ctx.lesson],["releases",ctx.module,"lessons",ctx.lesson,"enabled"],["releases","Wortschatz","lessons",ctx.lesson,"enabled"]];for(const p of keys){const v=val(data,p);if(v!==undefined)return v===true;}return moduleReleased(ctx,data)&&!isLockedByDefault(data);}
  function themeReleased(ctx,data){if(!ctx.theme)return lessonReleased(ctx,data);const keys=[["enabledThemes",ctx.lesson+'/'+ctx.theme],["enabledThemes",ctx.module+'/'+ctx.lesson+'/'+ctx.theme],["enabledThemes",ctx.theme],["releases",ctx.module,"lessons",ctx.lesson,"themes",ctx.theme,"enabled"],["releases","Wortschatz","lessons",ctx.lesson,"themes",ctx.theme,"enabled"]];for(const p of keys){const v=val(data,p);if(v!==undefined)return v===true;}return lessonReleased(ctx,data)&&!isLockedByDefault(data);}
  function taskPaths(file,ctx=ctxFromPath()){return [["enabledTasks",ctx.module+'/'+ctx.lesson+'/'+ctx.theme+'/'+file],["enabledTasks",ctx.lesson+'/'+ctx.theme+'/'+file],["enabledTasks",ctx.theme+'/'+file],["enabledTasks",file],["releases",ctx.module,"lessons",ctx.lesson,"themes",ctx.theme,"tasks",file],["releases","Wortschatz","lessons",ctx.lesson,"themes",ctx.theme,"tasks",file]];}
  function hasTaskControls(data,ctx=ctxFromPath()){const et=data.enabledTasks||{};const prefixes=[ctx.module+'/'+ctx.lesson+'/'+ctx.theme+'/',ctx.lesson+'/'+ctx.theme+'/',ctx.theme+'/'];if(Object.keys(et).some(k=>prefixes.some(p=>String(k).startsWith(p))))return true;if(val(data,["releases",ctx.module,"lessons",ctx.lesson,"themes",ctx.theme,"tasks"]))return true;if(val(data,["releases","Wortschatz","lessons",ctx.lesson,"themes",ctx.theme,"tasks"]))return true;return false;}
  function taskReleased(file,ctx=ctxFromPath(),data=localData()){if(!file||/^(statistik|uebersicht)\.html$/i.test(file))return true;if(ctx.kind==='lesson'||(!ctx.theme&&file==='index.html'))return lessonReleased(ctx,data);if(file==='index.html')return themeReleased(ctx,data);if(!themeReleased(ctx,data))return false;for(const p of taskPaths(file,ctx)){const v=val(data,p);if(v!==undefined)return v===true;}if(hasTaskControls(data,ctx))return false;return !isLockedByDefault(data);}
  function filterTasks(tasks,ctx=ctxFromPath(),data=localData()){return (tasks||[]).filter(t=>taskReleased(Array.isArray(t)?t[0]:(t.file||t.href),ctx,data))}
  function examUnlocked(tasks,percentFn,ctx=ctxFromPath(),data=localData()){const rel=filterTasks(tasks,ctx,data).filter(t=>!String(Array.isArray(t)?t[0]:(t.file||t.href)).includes('pruefung'));if(!rel.length)return true;return rel.every(t=>{const file=Array.isArray(t)?t[0]:(t.file||t.href);const total=Array.isArray(t)?t[1]:(t.total||1);return Number(percentFn(file,total))>=100});}
  function lessonCtx(lesson){return {module:'wortschatz',lesson:String(lesson||''),theme:'',file:'index.html',kind:'lesson'};}
  function applyLessonButtons(data=localData()){
    if(!/\/wortschatz\/?(?:index\.html)?$/i.test(location.pathname))return;
    document.querySelectorAll('.lesson-btn[data-lesson]').forEach(a=>{
      const lesson=a.dataset.lesson;const label=(a.textContent||'').replace('Gesperrt','').replace('Offen','').replace('🔒','').replace('✅','').trim();const open=lessonReleased(lessonCtx(lesson),data);
      a.textContent=label;a.classList.toggle('open',open);a.classList.toggle('locked',!open);a.dataset.releaseOpen=open?'1':'0';
      a.onclick=function(e){if(a.dataset.releaseOpen!=='1'){e.preventDefault();alert('Diese Lektion ist für deinen Kurs noch nicht freigeschaltet.');}};
    });
  }
  function blockCurrentIfNeeded(data=localData()){
    const ctx=ctxFromPath();if(ctx.module!=='wortschatz')return;
    applyLessonButtons(data);
    if(ctx.kind==='module')return;
    const allowed=ctx.kind==='lesson'?lessonReleased(ctx,data):taskReleased(ctx.file,ctx,data);
    if(allowed)return;
    const target=document.getElementById('area')||document.querySelector('.card')||document.querySelector('main')||document.body;
    const href=ctx.kind==='lesson'?'../index.html':(ctx.kind==='task'?'../index.html':'/index.html');
    target.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><div class="question">Gesperrt</div><p class="small">Dieser Bereich ist für deinen Kurs nicht freigegeben.</p><div class="actions finish-actions"><a class="btn secondary" href="'+href+'">← Zurück</a></div></div>';
  }
  window.SprachPilotRelease={refresh,ctxFromPath,taskReleased,filterTasks,examUnlocked,blockCurrentIfNeeded,localData,themeReleased,lessonReleased,moduleReleased,applyLessonButtons};
  document.addEventListener('DOMContentLoaded',()=>{applyLessonButtons();blockCurrentIfNeeded();refresh().then(d=>{if(d){applyLessonButtons(d);blockCurrentIfNeeded(d);}});});
  setTimeout(()=>{applyLessonButtons();blockCurrentIfNeeded();},250);
  setTimeout(()=>{refresh().then(d=>{if(d){applyLessonButtons(d);blockCurrentIfNeeded(d);}});},1000);
})();