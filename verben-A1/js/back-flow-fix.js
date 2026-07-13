(function(){
  const BASE='/verben-A1/';
  function nav(){return document.querySelector('header .nav')}
  function makeBtn(label,fn){
    const b=document.createElement('button');
    b.type='button';
    b.className='btn secondary sp-nav-link';
    b.textContent=label;
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();fn()},true);
    return b;
  }
  function makeResetBtn(){
    const b=document.createElement('button');
    b.type='button';
    b.className='btn danger-btn sp-reset-verbs-progress';
    b.textContent='Fortschritte löschen';
    b.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      if(typeof window.spResetVerbenProgress==='function')window.spResetVerbenProgress();
      else if(typeof resetCurrentPackage==='function')resetCurrentPackage();
    },true);
    return b;
  }
  function viewParam(){try{return new URLSearchParams(location.search||'').get('view')||''}catch(e){return''}}
  function setOverviewUrl(replace=true){
    const next=BASE+'?view=aufgaben';
    if(location.pathname+location.search===next)return;
    try{(replace?history.replaceState:history.pushState).call(history,null,'',next)}catch(e){}
  }
  function readJson(v,f){try{return JSON.parse(v||'')||f}catch(e){return f}}
  function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
  function allStoredVerbStates(){
    const out=[];
    try{
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i)||'';
        if(/^SP_VERBS_/.test(k)&&!/PENDING|STATUS|DEBUG|SAVE_STATUS/.test(k)){const x=readJson(localStorage.getItem(k),null);if(x&&typeof x==='object')out.push(x)}
      }
      ['SP_VERBS_LAST_STATE','SP_VERBS_BACKUP_STATE'].forEach(k=>{const x=readJson(localStorage.getItem(k),null);if(x&&typeof x==='object')out.push(x)});
      const s=readJson(sessionStorage.getItem('SP_VERBS_SESSION_BACKUP'),null);if(s&&typeof s==='object')out.push(s);
    }catch(e){}
    return out;
  }
  function collectVerbsFromState(st){
    let out=[];
    ['active','unsure','unknown','currentPackageVerbs','assessmentBatch','practicePool'].forEach(k=>{if(Array.isArray(st&&st[k]))out.push(...st[k])});
    const done=st&&st.taskDoneSets&&typeof st.taskDoneSets==='object'?st.taskDoneSets:{};
    Object.values(done).forEach(list=>{(Array.isArray(list)?list:Object.values(list||{})).forEach(x=>out.push(String(x||'').split(':')[0]))});
    const queues=st&&st.taskQueues&&typeof st.taskQueues==='object'?st.taskQueues:{};
    Object.values(queues).forEach(list=>{(Array.isArray(list)?list:Object.values(list||{})).forEach(x=>{if(x&&typeof x==='object')out.push(x.v);else out.push(x)})});
    return uniq(out.map(String));
  }
  function restoreActiveForOverview(){
    try{
      if(typeof currentPracticeVerbs==='function'&&currentPracticeVerbs().length)return currentPracticeVerbs();
    }catch(e){}
    try{
      const mastered=new Set(typeof spMasteredVerbSet==='function'?[...spMasteredVerbSet()]:[...(state.known||[]),...(state.learned||[])]);
      const released=typeof releasedVerbList==='function'?releasedVerbList():[];
      const allowed=new Set(released||[]);
      let verbs=[];
      verbs.push(...collectVerbsFromState(state||{}));
      allStoredVerbStates().forEach(st=>verbs.push(...collectVerbsFromState(st)));
      verbs=uniq(verbs).filter(v=>(!allowed.size||allowed.has(v))&&!mastered.has(v)).slice(0,20);
      if(!verbs.length)return [];
      state.active=verbs.slice();
      state.currentPackageVerbs=verbs.slice();
      state.assessmentBatch=verbs.slice();
      state.practicePool=state.practicePool&&state.practicePool.length?state.practicePool.filter(v=>verbs.includes(v)):verbs.slice();
      state.unknown=uniq([...(state.unknown||[]),...verbs]).filter(v=>verbs.includes(v));
      verbs.forEach(v=>{try{if(typeof ensureSkillState==='function')ensureSkillState(v)}catch(e){}});
      try{if(typeof saveState==='function')saveState()}catch(e){}
      return verbs;
    }catch(e){return []}
  }
  function renderEmptyTaskOverview(){
    const app=document.getElementById('app');if(!app)return;
    try{state.phase='taskOverview';state.currentTask=null;if(typeof saveState==='function')saveState()}catch(e){}
    setOverviewUrl(true);
    app.classList.remove('card');
    app.innerHTML='<section class="card progress-card"><div class="circle">0%</div><div class="progress-main"><p class="eyebrow">Aufgabenübersicht</p><h2>Keine aktiven Verben</h2><p class="small">Wähle 1 bis 20 Verben oder starte die Einschätzung. Danach bleibt diese Seite auch beim Neuladen erhalten.</p><div class="actions"><a class="btn green" href="/verben-A1/?view=assessment">Einschätzung starten</a><a class="btn secondary" href="/verben-A1/?view=chooser">Verben wählen</a></div></div></section>';
  }
  function simplifyHeader(){
    const n=nav();if(!n)return;
    try{
      [...n.querySelectorAll('a,button')].forEach(el=>{
        const t=String(el.textContent||'').replace(/\s+/g,' ').trim();
        if(t.includes('Zurück')){el.classList.add('sp-nav-back');return}
        if(t==='Übersicht'){el.classList.add('sp-overview-link');el.onclick=null;el.setAttribute('type','button');return}
        if(t==='Fortschritte löschen'||el.classList.contains('sp-reset-verbs-progress')){el.classList.add('sp-reset-verbs-progress','danger-btn');return}
        el.remove();
      });
      if(!n.querySelector('.sp-nav-back'))n.prepend(makeBtn('← Zurück',()=>{if(typeof spGoBack==='function')spGoBack()}));
      let overview=n.querySelector('.sp-overview-link');
      if(!overview){overview=makeBtn('Übersicht',()=>{if(typeof goOverviewView==='function')goOverviewView();else if(typeof renderVerbOverview==='function')renderVerbOverview()});overview.classList.add('sp-overview-link');n.appendChild(overview)}
      if(!n.querySelector('.sp-reset-verbs-progress'))n.appendChild(makeResetBtn());
    }catch(e){}
  }
  function maybeFinishScreen(){
    try{
      const sk=state&&state.lastCompletedTaskSkill;
      if(sk&&typeof renderTaskFinishScreen==='function'){renderTaskFinishScreen(sk);return true}
    }catch(e){}
    return false;
  }
  const originalRenderHome=window.renderHome;
  if(typeof originalRenderHome==='function'){
    window.renderHome=function(){if(maybeFinishScreen())return;return originalRenderHome.apply(this,arguments)};
  }
  const originalRenderTaskOverview=window.renderTaskOverview;
  if(typeof originalRenderTaskOverview==='function'){
    window.renderTaskOverview=function(){
      setOverviewUrl(true);
      const verbs=restoreActiveForOverview();
      if(verbs.length)return originalRenderTaskOverview.apply(this,arguments);
      renderEmptyTaskOverview();
    };
  }
  const originalRoute=window.routeVerbenHash;
  if(typeof originalRoute==='function'){
    window.routeVerbenHash=function(){
      if(viewParam()==='aufgaben'){if(typeof window.renderTaskOverview==='function')window.renderTaskOverview();return}
      return originalRoute.apply(this,arguments);
    };
  }
  document.addEventListener('click',function(e){
    const el=e.target&&e.target.closest?e.target.closest('a,button'):null;if(!el)return;
    if(el.classList&&el.classList.contains('sp-nav-back')){e.preventDefault();e.stopPropagation();if(typeof spGoBack==='function')spGoBack();return}
    if(el.classList&&el.classList.contains('sp-overview-link')){e.preventDefault();e.stopPropagation();if(typeof goOverviewView==='function')goOverviewView();else if(typeof renderVerbOverview==='function')renderVerbOverview();return}
    if(el.classList&&el.classList.contains('sp-reset-verbs-progress')){e.preventDefault();e.stopPropagation();if(typeof window.spResetVerbenProgress==='function')window.spResetVerbenProgress();else if(typeof resetCurrentPackage==='function')resetCurrentPackage();return}
  },true);
  document.addEventListener('DOMContentLoaded',function(){setTimeout(simplifyHeader,80);setTimeout(simplifyHeader,400);setTimeout(function(){if(viewParam()==='aufgaben'&&typeof window.renderTaskOverview==='function')window.renderTaskOverview()},140)},{once:true});
  try{new MutationObserver(simplifyHeader).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();