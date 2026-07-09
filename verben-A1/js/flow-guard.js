(function(){
  const TASK_PHASES=new Set(['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren','pruefung']);
  function uniq(a){return [...new Set((a||[]).filter(Boolean))]}
  function allVerbData(){try{return typeof ALL_VERBS!=='undefined'?ALL_VERBS:[]}catch(e){return[]}}
  function allVerbNames(){return uniq(allVerbData().map(x=>x&&x.v).filter(Boolean)).sort((a,b)=>a.localeCompare(b,'de'))}
  function arr(k){try{return Array.isArray(state&&state[k])?state[k]:[]}catch(e){return[]}}
  function appGet(o,path){let c=o;for(const p of path){if(!c||typeof c!=='object'||!(p in c))return undefined;c=c[p]}return c}
  function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}}
  function profileSafe(){try{return profile||readJSON('SP_USER_PROFILE',null)||readJSON('SP_STUDENT_PROFILE',{})||{}}catch(e){return {}}}
  function releaseDataSafe(){const p=profileSafe();return p.assignments||readJSON('SP_COURSE_RELEASES',{})||{}}
  function hasReleaseData(d){return !!(d&&(d.enabledWords||d.releases||d.enabledModules||d.defaultLocked!==undefined||d.releaseMode||d.settings||d.verbenA1AssessmentEnabled!==undefined))}
  function releaseControlsWords(d){const ew=d.enabledWords||{},names=new Set(allVerbNames());if(Array.isArray(ew)&&ew.length)return true;if(Object.keys(ew).some(k=>k.includes('verben-A1/')||k.includes('Verben A1/')||names.has(k)))return true;return !!(appGet(d,['releases','verben-A1','words'])||appGet(d,['releases','Verben A1','words']))}
  function wordReleased(d,v){const ew=d.enabledWords;if(Array.isArray(ew))return ew.includes(v)||ew.includes('verben-A1/'+v)||ew.includes('Verben A1/'+v);const paths=[['enabledWords',v],['enabledWords','verben-A1/'+v],['enabledWords','Verben A1/'+v],['releases','verben-A1','words',v],['releases','Verben A1','words',v]];for(const p of paths){const x=appGet(d,p);if(x!==undefined)return x===true}return undefined}
  function releasedSafe(){
    const all=allVerbNames(),d=releaseDataSafe();
    if(!all.length)return [];
    if(!hasReleaseData(d))return all;
    const closed=[appGet(d,['enabledModules','Verben A1']),appGet(d,['enabledModules','verben-A1']),appGet(d,['releases','Verben A1','enabled']),appGet(d,['releases','verben-A1','enabled'])].some(x=>x===false);
    if(closed)return [];
    if(releaseControlsWords(d))return all.filter(v=>wordReleased(d,v)===true);
    if(d.releaseMode==='all'||d.releaseMode==='open'||d.defaultLocked===false)return all.filter(v=>wordReleased(d,v)!==false);
    return all;
  }
  function masteredSafe(){const out=[...arr('known'),...arr('learned')];arr('archivedPackages').forEach(p=>{if(p&&Array.isArray(p.verbs))out.push(...p.verbs);if(p&&Array.isArray(p.practiced))out.push(...p.practiced)});return new Set(uniq(out))}
  function activeSafe(){const released=new Set(releasedSafe()),mastered=masteredSafe();return uniq([...arr('active'),...arr('unsure'),...arr('unknown'),...arr('currentPackageVerbs'),...arr('assessmentBatch')]).filter(v=>(!released.size||released.has(v))&&!mastered.has(v))}
  function remainingSafe(){const mastered=masteredSafe(),active=new Set(activeSafe()),assessed=new Set(arr('assessed'));return releasedSafe().filter(v=>!mastered.has(v)&&!active.has(v)&&!assessed.has(v))}
  function saveQuiet(){try{if(typeof saveState==='function')saveState()}catch(e){}}
  function clearOpenTaskOnly(){try{if(typeof returnCurrentTaskToQueue==='function')returnCurrentTaskToQueue();state.phase='home';state.currentGame='';state.currentVerb='';state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;saveQuiet()}catch(e){}}
  function clearHash(){try{if(typeof clearVerbHash==='function')clearVerbHash(true);else if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function ensureHeader(){
    const h=document.getElementById('spHeader');if(!h||h.innerHTML.trim())return;
    const p=profileSafe(),name=[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ')||'Schüler/in',kurs=p.kurs||p.kursnummer||p.courseCode||'';
    h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><img class="brand-logo" src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>SprachPilot</h1><div class="subtitle">Verben A1</div></div></a><div class="account-tools"><span class="account-pill">${esc(name)}${kurs?' · '+esc(kurs):''}</span><a class="account-link" href="/student-dashboard/index.html">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><button class="btn secondary" onclick="spGoBack()">← Zurück</button><button class="btn secondary" onclick="renderVerbOverview()">Übersicht</button><button class="btn secondary" onclick="renderStudentDashboard()">Statistik</button><button class="btn secondary" onclick="startAssessment(true)">Verben einschätzen</button><button class="btn secondary" onclick="renderVerbChooser()">Verben wählen</button></nav>`;
  }
  function completePage(){const app=document.getElementById('app');if(!app)return;app.classList.remove('card');app.innerHTML='<section class="card completion-card"><div class="finish-icon">✓</div><h2>Du hast alle Verben gelernt.</h2><p class="small">Komm später zurück, um neue Verben zu lernen.</p><div class="actions"><button class="btn secondary" onclick="renderVerbOverview()">Übersicht ansehen</button></div></section>'}
  function noReleasePage(){const app=document.getElementById('app');if(!app)return;app.classList.remove('card');app.innerHTML='<section class="card"><h2>Keine freigegebenen Verben gefunden</h2><p class="small">Öffne einmal das Dashboard, damit die Kursfreigabe geladen wird. Danach zurück zu Verben.</p><div class="actions"><a class="btn secondary" href="/student-dashboard/index.html">Zum Dashboard</a></div></section>'}
  function startTasksOrFallback(active){try{state.active=active.slice();if(!state.practicePool||!state.practicePool.length)state.practicePool=active.slice();saveQuiet()}catch(e){}try{if(typeof window.__spOriginalRenderTaskOverview==='function'){window.__spOriginalRenderTaskOverview();return true}}catch(e){console.warn(e)}const app=document.getElementById('app');if(app){app.classList.remove('card');app.innerHTML='<section class="card"><h2>Aufgaben</h2><p class="small">Aktive Verben sind gespeichert. Öffne die Aufgabenübersicht.</p><div class="actions"><button class="btn green" onclick="renderTaskOverview()">Aufgaben öffnen</button></div></section>'}return false}
  function startAssessmentOrFallback(){try{if(typeof startAssessment==='function'){startAssessment(true);return true}}catch(e){console.warn(e)}const app=document.getElementById('app');if(app){app.classList.remove('card');app.innerHTML='<section class="card"><h2>Neue Verben einschätzen</h2><p class="small">Die Einschätzung konnte nicht automatisch geöffnet werden.</p><div class="actions"><button class="btn green" onclick="startAssessment(true)">Einschätzung starten</button><button class="btn secondary" onclick="renderVerbChooser()">Verben wählen</button></div></section>'}return false}
  function installGlobals(){
    window.spStrictReleasedVerbList=releasedSafe;window.spReleasedVerbList=releasedSafe;window.releasedAssessmentVerbs=releasedSafe;
    window.spVerbPracticeTargetCount=function(){const r=[...activeSafe(),...remainingSafe()];return Math.min(20,r.length||20)};
    window.unusedVerbs=function(){const mastered=masteredSafe(),active=new Set(activeSafe()),assessed=new Set(arr('assessed'));return releasedSafe().filter(v=>!mastered.has(v)&&!active.has(v)&&!assessed.has(v))};
  }
  function routeVerbs(){clearHash();installGlobals();ensureHeader();try{if(typeof normalizeAppVerbState==='function')normalizeAppVerbState()}catch(e){}const released=releasedSafe(),active=activeSafe(),remaining=remainingSafe();if(active.length){startTasksOrFallback(active);return}if(remaining.length){startAssessmentOrFallback();return}if(released.length){completePage();return}noReleasePage()}
  function appBlankOrBad(){const app=document.getElementById('app');const txt=String(app&&app.textContent||'').trim();return !txt||/Verben konnten nicht/.test(txt)}
  function routeIfNeeded(){if(appBlankOrBad()){routeVerbs();return}const active=activeSafe(),remaining=remainingSafe(),released=releasedSafe();if(active.length||remaining.length||released.length)routeVerbs()}
  if(typeof renderTaskOverview==='function'&&!window.__spOriginalRenderTaskOverview)window.__spOriginalRenderTaskOverview=renderTaskOverview;
  if(typeof renderHome==='function'&&!window.__spOriginalRenderHome)window.__spOriginalRenderHome=renderHome;
  installGlobals();
  window.renderHome=function(){clearOpenTaskOnly();routeVerbs()};
  window.renderSafeHomeFallback=function(error){try{localStorage.setItem('SP_VERBS_LAST_BOOT_ERROR',String(error&&error.stack||error||'unknown'))}catch(e){}routeVerbs()};
  window.renderTaskOverview=function(){installGlobals();const active=activeSafe();if(active.length){startTasksOrFallback(active);return}routeVerbs()};
  window.closeVerbTaskAndRenderHome=function(){clearOpenTaskOnly();routeVerbs()};
  window.spGoBack=function(){const fromTask=!!(TASK_PHASES.has(String(state&&state.phase||''))||arr('currentTask').length);clearOpenTaskOnly();clearHash();if(fromTask&&activeSafe().length){startTasksOrFallback(activeSafe());return}location.href='/student-dashboard/index.html'};
  routeIfNeeded();setTimeout(routeIfNeeded,0);setTimeout(routeIfNeeded,250);setTimeout(routeIfNeeded,900);setTimeout(routeIfNeeded,1800);
  document.addEventListener('DOMContentLoaded',function(){setTimeout(routeIfNeeded,0);setTimeout(routeIfNeeded,250);setTimeout(routeIfNeeded,900)},{once:true});
  try{new MutationObserver(function(){if(appBlankOrBad())routeVerbs()}).observe(document.getElementById('app')||document.documentElement,{childList:true,subtree:true,characterData:true})}catch(e){}
})();