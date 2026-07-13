(function(){
  if(window.__SP_L6T1_STABILITY_FIX)return;
  window.__SP_L6T1_STABILITY_FIX=true;

  const TOPIC_ID='wortschatz-a1-lektion-6-thema-1';
  const PAYLOAD_BASE={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:1,title:'A1 Lektion 6 · Thema 1 Wetter',topicId:TOPIC_ID};
  const TASK_NAMES={
    'karteikarten.html':'Karteikarten','artikel.html':'Artikel','hoeren-schreiben.html':'Hoeren/Schreiben','hoeren-bild.html':'Hoeren/Karte','nomen-satz-a.html':'Wort -> Satz','nomen-satz-b.html':'Satz hoeren -> Wort','geraeusche.html':'Geraeusche','geraeusche-satz.html':'Geraeusch -> Satz','wetter-saetze.html':'Saetze schreiben','hoeren.html':'Hoeren','pruefung.html':'Pruefung'
  };

  function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return {}}}
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
  function dashHref(){return String(localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase()==='teacher'?'/teacher/index.html':'/student-dashboard/index.html'}
  function logout(){try{if(typeof window.logout==='function'){window.logout();return}}catch(e){} location.href='/index.html'}
  window.spL6T1Logout=logout;

  window.header=function(title,showReset){
    const h=document.querySelector('.topbar')||document.getElementById('spHeader');
    if(!h)return;
    const p=readProfile();
    const name=[p.vorname||p.firstName||p.name||'',p.nachname||p.lastName||''].filter(Boolean).join(' ').trim()||'Schueler/in';
    const course=p.kurs||p.kursnummer||p.courseCode||'';
    h.className='topbar';
    h.style.display='';h.style.height='';h.style.minHeight='';h.style.margin='';h.style.padding='';h.style.overflow='';
    h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${esc(title||'Aufgabe')} · A1 Lektion 6 · Thema 1</div></div></a><div class="account-tools"><span class="account-pill">${esc(name)}${course?' · '+esc(course):''}</span><a class="account-link" href="${dashHref()}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a><button class="account-link account-btn" onclick="spL6T1Logout()">Abmelden</button></div></div><nav class="nav"><a class="btn secondary" href="index.html">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a>${showReset?'<button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button>':''}</nav>`;
  };

  function taskKeyFallback(file){
    try{if(typeof window.taskKey==='function')return window.taskKey(file)}catch(e){}
    try{if(window.CFG&&CFG.key)return CFG.key+'_'+file}catch(e){}
    return 'SP_L6_T1_V1_BOOK_'+file;
  }
  function doneArray(total){total=Math.max(1,Math.round(Number(total)||100));return Array.from({length:total},(_,i)=>i)}
  function localState(file,total){
    const key=taskKeyFallback(file);
    try{const st=JSON.parse(localStorage.getItem(key)||'null');if(st&&typeof st==='object')return st}catch(e){}
    return {total:Number(total||0)||0,done:[],queue:[],current:null,tries:0,hadWrong:false};
  }
  function writeAllLocal(file,st){
    const total=Number(st&&st.total||0)||0;
    const done=Array.isArray(st&&st.done)?st.done.length:Number(st&&st.done||0)||0;
    const percent=total?Math.round(Math.min(done,total)*100/total):0;
    const clean={...(st||{}),total,percent,completed:percent>=100,updatedAt:new Date().toISOString()};
    try{localStorage.setItem(taskKeyFallback(file),JSON.stringify(clean))}catch(e){}
    try{localStorage.setItem('SP_TASK_STATE_'+file,JSON.stringify(clean))}catch(e){}
    try{localStorage.setItem('SP_TASK_STATE_'+String(file).replace(/\.html$/,''),JSON.stringify(clean))}catch(e){}
    return clean;
  }
  function syncFirebase(file,st){
    if(!file||!st)return;
    const total=Number(st.total||0)||0;
    const done=Array.isArray(st.done)?st.done.length:Number(st.done||0)||0;
    const percent=total?Math.round(Math.min(done,total)*100/total):0;
    const payload={...PAYLOAD_BASE,file,taskKey:file,taskTitle:TASK_NAMES[file]||String(file).replace(/\.html$/,''),percent,done:Math.min(done,total),total,completed:percent>=100};
    try{
      if(window.SPProgress&&typeof SPProgress.recordTaskProgress==='function'){SPProgress.recordTaskProgress(payload);return;}
      window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];
      window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload});
      import('/js/progress.js?v=l6t1-stability-1').catch(()=>{});
    }catch(e){}
  }

  const oldSave=window.saveTask;
  window.saveTask=function(file,st){
    let out;
    try{if(typeof oldSave==='function')out=oldSave(file,st)}catch(e){}
    const clean=writeAllLocal(file,st);
    syncFirebase(file,clean);
    return out;
  };

  const oldLoad=window.loadTask;
  window.loadTask=function(file,total){
    let st=null;
    try{if(typeof oldLoad==='function')st=oldLoad(file,total)}catch(e){}
    const backup=localState(file,total);
    if(!st||!Array.isArray(st.done)||(Array.isArray(backup.done)&&backup.done.length>st.done.length))st=backup;
    st.total=Number(total||st.total||0)||0;
    return writeAllLocal(file,st);
  };

  const oldRight=window.spMarkRight;
  window.spMarkRight=function(file,total){
    let out;
    try{if(typeof oldRight==='function')out=oldRight(file,total)}catch(e){}
    try{const st=window.loadTask(file,total);writeAllLocal(file,st);syncFirebase(file,st)}catch(e){}
    return out;
  };

  const oldDone=window.markTaskDone;
  window.markTaskDone=function(file,total){
    let out;
    try{if(typeof oldDone==='function')out=oldDone(file,total)}catch(e){}
    const t=Number(total||0)||100;
    const st={total:t,done:doneArray(t),queue:[],current:null,tries:0,hadWrong:false,completed:true,percent:100};
    writeAllLocal(file,st);syncFirebase(file,st);
    return out;
  };
})();