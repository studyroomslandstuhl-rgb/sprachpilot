(function(){
  let remoteData=null;
  function safeJson(s,f){try{return JSON.parse(s||"")||f}catch(e){return f}}
  function profile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")||{}}catch(e){return {}}}
  function courseCode(){const p=profile();return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||""}
  function localData(){const p=profile();return remoteData||p.assignments||safeJson(localStorage.getItem("SP_COURSE_RELEASES"),{})||{}}
  async function refresh(){
    const code=courseCode();if(!code)return null;
    try{const mod=await import('/js/firebase.js');const snap=await mod.getDoc(mod.doc(mod.db,'courses',String(code)));if(snap.exists()){remoteData=snap.data()||{};localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(remoteData));const p=profile();p.assignments=remoteData;localStorage.setItem('SP_USER_PROFILE',JSON.stringify(p));return remoteData;}}catch(e){console.warn('Freigaben konnten nicht aktualisiert werden',e)}
    return null;
  }
  function val(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
  function ctxFromPath(){
    const p=location.pathname;
    const m=p.match(/\/wortschatz\/(A\d-Lektion-\d+)\/(Thema-\d+)\/(.*)$/i);
    if(m)return {module:'wortschatz',lesson:m[1],theme:m[2],file:(m[3]||'index.html').split('/').pop()||'index.html'};
    return {module:'',lesson:'',theme:'',file:p.split('/').pop()||'index.html'};
  }
  function taskPaths(file,ctx=ctxFromPath()){
    return [
      ['enabledTasks',`${ctx.module}/${ctx.lesson}/${ctx.theme}/${file}`],
      ['enabledTasks',`${ctx.lesson}/${ctx.theme}/${file}`],
      ['enabledTasks',`${ctx.theme}/${file}`],
      ['enabledTasks',file],
      ['releases',ctx.module,'lessons',ctx.lesson,'themes',ctx.theme,'tasks',file],
      ['releases','Wortschatz','lessons',ctx.lesson,'themes',ctx.theme,'tasks',file]
    ];
  }
  function hasTaskControls(data,ctx=ctxFromPath()){
    const et=data.enabledTasks||{};
    const prefixes=[`${ctx.module}/${ctx.lesson}/${ctx.theme}/`,`${ctx.lesson}/${ctx.theme}/`,`${ctx.theme}/`];
    if(Object.keys(et).some(k=>prefixes.some(p=>String(k).startsWith(p))))return true;
    if(val(data,['releases',ctx.module,'lessons',ctx.lesson,'themes',ctx.theme,'tasks']))return true;
    if(val(data,['releases','Wortschatz','lessons',ctx.lesson,'themes',ctx.theme,'tasks']))return true;
    return false;
  }
  function taskReleased(file,ctx=ctxFromPath(),data=localData()){
    if(!file||/^(index|statistik|uebersicht)\.html$/i.test(file))return true;
    for(const p of taskPaths(file,ctx)){const v=val(data,p);if(v!==undefined)return v===true;}
    return hasTaskControls(data,ctx)?false:true;
  }
  function filterTasks(tasks,ctx=ctxFromPath(),data=localData()){
    return (tasks||[]).filter(t=>taskReleased(Array.isArray(t)?t[0]:(t.file||t.href),ctx,data));
  }
  function examUnlocked(tasks,percentFn,ctx=ctxFromPath(),data=localData()){
    const rel=filterTasks(tasks,ctx,data).filter(t=>!String(Array.isArray(t)?t[0]:(t.file||t.href)).includes('pruefung'));
    if(!rel.length)return true;
    return rel.every(t=>{const file=Array.isArray(t)?t[0]:(t.file||t.href);const total=Array.isArray(t)?t[1]:(t.total||1);return Number(percentFn(file,total))>=100});
  }
  function blockCurrentIfNeeded(data=localData()){
    const ctx=ctxFromPath();
    if(ctx.module!=='wortschatz'||!ctx.lesson||!ctx.theme)return;
    if(taskReleased(ctx.file,ctx,data))return;
    const target=document.getElementById('area')||document.querySelector('.card')||document.querySelector('main')||document.body;
    target.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><div class="question">Aufgabe gesperrt</div><p class="small">Diese Aufgabe ist für deinen Kurs nicht freigegeben.</p><div class="actions finish-actions"><a class="btn secondary" href="index.html">← Zurück zum Thema</a></div></div>';
  }
  window.SprachPilotRelease={refresh,ctxFromPath,taskReleased,filterTasks,examUnlocked,blockCurrentIfNeeded,localData};
  document.addEventListener('DOMContentLoaded',()=>{blockCurrentIfNeeded();refresh().then(d=>{if(d)blockCurrentIfNeeded(d);});});
  setTimeout(()=>blockCurrentIfNeeded(),250);
})();
