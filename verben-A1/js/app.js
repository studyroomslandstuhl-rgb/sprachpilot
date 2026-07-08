function logoHtml(){
  return `<img class="brand-logo" src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot">`;
}

function renderHeader(){
  const h=$("spHeader"); if(!h)return;
  const name=profile?`${safeText(profile.vorname||"")} ${safeText(profile.nachname||"")}`.trim():"";
  const kurs=profile?safeText(profile.kurs||profile.kursnummer||profile.courseCode||""):"";
  h.innerHTML=`
    <div class="topbar-main">
      <a class="brand" href="/index.html">
        ${logoHtml()}
        <div><h1>SprachPilot</h1><div class="subtitle">Verben A1</div></div>
      </a>
      <div class="account-tools">
        <span class="account-pill">${name||"Schüler/in"}${kurs?" · "+kurs:""}</span>
        <a class="account-link" href="/student-dashboard/index.html">Dashboard</a>
        <a class="account-link" href="/profile/index.html">Profil</a>
        <button class="account-link account-btn" onclick="spVerbLogout()">Abmelden</button>
      </div>
    </div>
    <nav class="nav">
      <button class="btn secondary" onclick="spGoBack()">← Zurück</button>
      <button class="btn secondary" onclick="renderVerbOverview()">Übersicht</button>
      <button class="btn secondary" onclick="renderStudentDashboard()">Statistik</button>
      <button class="btn secondary" onclick="handleAssessmentClick()">Weitere Verben einschätzen</button>
      <button class="btn secondary" onclick="renderVerbChooser()">Verben wählen</button>
      <button class="btn danger-btn" onclick="resetCurrentPackage()">Fortschritte löschen</button>
    </nav>`;
}

function spVerbLogout(){
  localStorage.removeItem("SP_USER_PROFILE");
  localStorage.removeItem("SP_STUDENT_PROFILE");
  localStorage.removeItem("SP_KEEP_LOGGED_IN");
  localStorage.removeItem("SP_LOGIN_ROLE");
  location.href="/index.html";
}
function spGoBack(){
  if(location.hash){clearVerbHash(true);renderHome();return}
  location.href="/student-dashboard/index.html";
}
function renderSideMenu(){const m=$("spMenu");if(m)m.innerHTML=""}
function uniqueAppList(a){return [...new Set((a||[]).filter(Boolean))]}
function readAppJson(k,f){try{return JSON.parse(localStorage.getItem(k)||"")||f}catch(e){return f}}
function appProfile(){try{return profile||readAppJson("SP_USER_PROFILE",null)||readAppJson("SP_STUDENT_PROFILE",{})||{}}catch(e){return {}}}
function appGet(o,path){let c=o;for(const p of path){if(!c||typeof c!=="object"||!(p in c))return undefined;c=c[p]}return c}
function releaseData(){const p=appProfile();return p.assignments||readAppJson("SP_COURSE_RELEASES",{})||{}}
function hasReleaseData(d){return !!(d&&(d.enabledWords||d.releases||d.enabledModules||d.defaultLocked!==undefined||d.releaseMode||d.settings||d.verbenA1AssessmentEnabled!==undefined))}
function allVerbNames(){return uniqueAppList((window.ALL_VERBS||[]).map(x=>x&&x.v).filter(Boolean)).sort((a,b)=>a.localeCompare(b,"de"))}
function releaseControlsWords(d){const ew=d.enabledWords||{},names=new Set(allVerbNames());if(Array.isArray(ew)&&ew.length)return true;if(Object.keys(ew).some(k=>k.includes("verben-A1/")||k.includes("Verben A1/")||names.has(k)))return true;return !!(appGet(d,["releases","verben-A1","words"])||appGet(d,["releases","Verben A1","words"]))}
function wordReleased(d,v){
  const ew=d.enabledWords;
  if(Array.isArray(ew))return ew.includes(v)||ew.includes("verben-A1/"+v)||ew.includes("Verben A1/"+v);
  const paths=[["enabledWords",v],["enabledWords","verben-A1/"+v],["enabledWords","Verben A1/"+v],["releases","verben-A1","words",v],["releases","Verben A1","words",v]];
  for(const p of paths){const x=appGet(d,p);if(x!==undefined)return x===true}
  return undefined;
}
function releasedVerbList(){
  const d=releaseData(),all=allVerbNames();
  if(!hasReleaseData(d))return [];
  const closed=[appGet(d,["enabledModules","Verben A1"]),appGet(d,["enabledModules","verben-A1"]),appGet(d,["releases","Verben A1","enabled"]),appGet(d,["releases","verben-A1","enabled"])].some(x=>x===false);
  if(closed)return [];
  if(releaseControlsWords(d))return all.filter(v=>wordReleased(d,v)===true);
  if(d.releaseMode==="all"||d.releaseMode==="open"||d.defaultLocked===false)return all.filter(v=>wordReleased(d,v)!==false);
  return [];
}
function allowedSet(){return new Set(releasedVerbList())}
function filterReleased(list){const A=allowedSet();return A.size?(list||[]).filter(v=>A.has(v)):[]}
window.spStrictReleasedVerbList=function(){return releasedVerbList()};
window.spReleasedVerbList=window.spStrictReleasedVerbList;
window.spVerbAssessmentEnabled=function(){return true};
window.spVerbPracticeTargetCount=function(){return Math.min(PRACTICE_TARGET_COUNT,releasedVerbList().length||PRACTICE_TARGET_COUNT)};
window.spSyncVerbRelease=function(){normalizeAppVerbState();saveState()};

function normalizeAppVerbState(){
  migrateState();
  const A=allowedSet();
  if(!A.size)return;
  const learned=new Set(uniqueAppList([...(state.known||[]),...(state.learned||[])]).filter(v=>A.has(v)));
  ["known","learned","unsure","unknown","active","practicePool","assessmentBatch","assessed","currentPackageVerbs"].forEach(k=>state[k]=Array.isArray(state[k])?state[k].filter(v=>A.has(v)):[]);
  const active=uniqueAppList([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[]),...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[])]).filter(v=>A.has(v)&&!learned.has(v));
  state.active=active;
  if(state.manualVerbSelection){state.unknown=active.slice();state.unsure=[];state.currentPackageVerbs=active.slice();state.assessmentBatch=active.slice();state.practicePool=active.slice()}
}
function currentPracticeVerbs(){normalizeAppVerbState();const A=allowedSet(),learned=new Set([...(state.known||[]),...(state.learned||[])]);return uniqueAppList([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[])]).filter(v=>A.has(v)&&!learned.has(v))}
function currentPackageAllVerbs(){normalizeAppVerbState();return filterReleased(uniqueAppList([...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...(state.active||[]),...(state.unsure||[]),...(state.unknown||[])]))}
function masteredVerbSet(){return new Set(uniqueAppList([...(state.known||[]),...(state.learned||[])]))}
function unusedVerbs(){normalizeAppVerbState();const A=releasedVerbList(),learned=masteredVerbSet(),used=new Set(uniqueAppList([...(state.assessed||[]),...(state.assessmentBatch||[]),...(state.currentPackageVerbs||[]),...(state.active||[]),...(state.unsure||[]),...(state.unknown||[])]));return A.filter(v=>!learned.has(v)&&!used.has(v))}

function verbStatus(v){
  if((state.learned||[]).includes(v)||(state.known||[]).includes(v))return {label:"gelernt / ich kann",cls:"status-known",short:"ich kann"};
  if((state.unsure||[]).includes(v))return {label:"unsicher",cls:"status-unsure",short:"unsicher"};
  if((state.unknown||[]).includes(v))return {label:"ich kann nicht",cls:"status-unknown",short:"ich kann nicht"};
  if((state.active||[]).includes(v))return {label:"aktiv",cls:"status-active",short:"aktiv"};
  return {label:"noch nicht gelernt",cls:"status-new",short:"neu"};
}
function verbMetaInfo(v){return [(window.VERB_LEVELS&&VERB_LEVELS[v])||"A1"]}
function verbSentence(v){return (window.VERB_SENTENCES&&window.VERB_SENTENCES[v])||(typeof sentenceForVerb==="function"?sentenceForVerb(v):"")}
function verbsByStatus(){const allowed=releasedVerbList(),learned=filterReleased([...(state.learned||[]),...(state.known||[])]),active=currentPracticeVerbs(),L=new Set(learned),A=new Set(active);return {active,learned,new:allowed.filter(v=>!L.has(v)&&!A.has(v))}}
function verbOverviewCard(v){const st=verbStatus(v),sentence=verbSentence(v);return `<div class="verb-overview-card ${st.cls}">${imageBox(v,true)}<div class="verb-name">${safeText(v)}</div><div class="verb-status">${safeText(st.label)}</div>${sentence?`<div class="verb-sentence">${safeText(sentence)}</div>`:""}</div>`}
function verbOverviewGrid(verbs){return `<div class="verb-overview-grid">${verbs.map(verbOverviewCard).join("")||"<p class='small'>Keine Verben.</p>"}</div>`}
function verbOverviewDetails(title,verbs,open,note){return `<details class="verb-overview-details" ${open?"open":""}><summary>${safeText(title)} <span class="small">${verbs.length}</span></summary>${note?`<p class="small">${safeText(note)}</p>`:""}${verbOverviewGrid(verbs)}</details>`}
function renderVerbOverview(){clearVerbHash(true);const app=$("app");if(!app)return;state.phase="home";normalizeAppVerbState();const g=verbsByStatus();app.classList.remove("card");app.innerHTML=`<section class="card"><h2>Verben-Übersicht</h2><p class="small">Nur freigegebene Verben.</p>${verbOverviewDetails("Aktive Verben · gerade lernen",g.active,true,"Diese Verben sind aktuell offen.")}${verbOverviewDetails("Gelernt / ich kann",g.learned,false,"Diese Verben kommen nicht mehr in Aufgaben vor.")}${verbOverviewDetails("Noch nicht gelernt",g.new,false,"Diese Verben sind freigegeben, aber noch nicht gelernt.")}<div class="actions"><button class="btn secondary" onclick="renderHome()">Zur Aufgabenübersicht</button></div></section>`;saveState();renderAndHydrate()}

function statusBox(){
  const pct=overall(),practiceCount=currentPracticeVerbs().length,packageCount=currentPackageAllVerbs().length,knownInPackage=currentPackageAllVerbs().filter(v=>(state.known||[]).includes(v)||(state.learned||[]).includes(v)).length;
  const examTxt=state.exam&&state.exam.passed?"Prüfung 100%":(allPracticeTasksDone()?"Prüfung offen":"Prüfung gesperrt");
  return `<section class="card progress-card"><div class="circle">${pct}%</div><div class="progress-main"><h2>Dein Fortschritt</h2><div class="small">${packageCount} Verben im Paket · ${knownInPackage} ich kann · ${practiceCount} Verben zu üben · ${examTxt}</div><div class="progress"><div class="bar" style="width:${pct}%"></div></div></div></section>`;
}
function taskDescription(skill){return {karteikarte:"Lerne das Verb mit Bild.",memory:"Finde Bild und Verb.",bild_verb:"Sieh das Bild und wähle das Verb.",verb_bild:"Lies das Verb und wähle das Bild.",schreiben:"Schreibe das Verb zum Bild.",hoeren_schreiben:"Höre und schreibe das Verb.",hoeren_sprechen:"Höre und sprich das Verb.",bild_sprechen:"Sieh das Bild und sprich das Verb.",satz_puzzle:"Höre und baue den Satz.",konjugieren:"Schreibe die richtige Form."}[skill]||"Übe das Verb."}
function taskCard(skill,icon,fn,num){const done=taskDone(skill),p=queuedProgress(skill);return `<button class="module task-card ${done?"done-card":""}" onclick="${fn}()"><div><div class="num">${num}. ${VERB_SKILL_LABELS[skill]}</div></div><div class="icon big-icon">${icon}</div><p>${taskDescription(skill)}</p><div><div class="progress"><div class="bar" style="width:${done?100:p.pct}%"></div></div><div class="small">${done?"100%":p.pct+"%"}</div><div class="start">Starten</div></div></button>`}
function examCard(){const ready=allPracticeTasksDone(),passed=state.exam&&state.exam.passed;return `<button class="module task-card ${passed?"done-card":""}" ${ready?"onclick=\"startVerbExam()\"":"disabled"}><div><div class="num">11. Prüfung</div></div><div class="icon big-icon">⭐</div><p>Prüfe die aktiven Verben.</p><div><div class="progress"><div class="bar" style="width:${passed?100:0}%"></div></div><div class="small">${passed?"100%":ready?"offen":"gesperrt"}</div><div class="start">Starten</div></div></button>`}
function taskGrid(){return taskCard("karteikarte","🃏","flashcards",1)+taskCard("memory","🧠","memory",2)+taskCard("bild_verb","🖼️","quiz",3)+taskCard("verb_bild","🔁","verbToImage",4)+taskCard("schreiben","✍️","writeVerb",5)+taskCard("hoeren_schreiben","👂","hearWrite",6)+taskCard("hoeren_sprechen","🎤","hearSpeak",7)+taskCard("bild_sprechen","🗣️","imageSpeak",8)+taskCard("satz_puzzle","🧩","sentencePuzzle",9)+taskCard("konjugieren","🔤","conjugationTask",10)+examCard()}
function renderTaskOverview(){const app=$("app");if(!app)return;app.classList.remove("card");state.phase="home";state.currentTask=null;buildPracticePool();app.innerHTML=`${statusBox()}<section class="card"><div class="grid task-grid">${taskGrid()}</div></section>`;saveState();renderAndHydrate()}
function recoverActiveVerbsForCurrentPackage(){normalizeAppVerbState();return true}
function clearPracticeProgressForVerbs(verbs){(verbs||[]).forEach(v=>{if(state.skillDone)delete state.skillDone[v];if(state.skillAttempts)delete state.skillAttempts[v];if(state.skillSuccess)delete state.skillSuccess[v];if(state.weak)delete state.weak[v]})}
function resetPackageTasks(){state.practicePool=[];state.taskQueues={};state.taskDoneSets={};state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0}}
function packageExamPassed(){return !!(state.exam&&state.exam.passed&&Number(state.exam.score)===100)}
function allPracticeTasksDone(){return VERB_SKILLS.every(taskDone)}
function markCurrentPackageLearned(){const verbs=currentPracticeVerbs();if(!verbs.length)return false;state.learned=uniqueAppList([...(state.learned||[]),...verbs]);state.known=uniqueAppList([...(state.known||[]),...verbs]);state.archivedPackages=state.archivedPackages||[];state.archivedPackages.push({type:"completed",date:new Date().toISOString(),verbs:verbs.slice()});state.unsure=[];state.unknown=[];state.active=[];state.currentPackageVerbs=[];state.assessmentBatch=[];state.manualVerbSelection=false;resetPackageTasks();saveState();return true}
function resetAllVerbProgressKeepPoints(){const alertsShown=state.alertsShown||{},taskRewardsShown=state.taskRewardsShown||{};state.phase="home";state.index=0;state.known=[];state.unsure=[];state.unknown=[];state.active=[];state.learned=[];state.practicePool=[];state.archivedPackages=[];state.assessmentBatch=[];state.assessed=[];state.currentPackageVerbs=[];state.weak={};state.currentGame="";state.currentVerb="";state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.first=null;state.openCards=[];state.lock=false;state.skillDone={};state.skillAttempts={};state.skillSuccess={};state.taskQueues={};state.taskDoneSets={};state.alertsShown=alertsShown;state.taskRewardsShown=taskRewardsShown;state.packageNo=1;state.assessmentStart=0;state.assessmentTries=0;state.revealed=false;state.manualVerbSelection=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0};clearVerbHash(true)}
function resetCurrentPackage(){if(!confirm("Alle Verben wieder auf ‚nicht gelernt‘ setzen? Punkte bleiben erhalten."))return;resetAllVerbProgressKeepPoints();saveState();renderHome()}
function handleAssessmentClick(){if(typeof startAssessment==="function")startAssessment(true);else renderHome()}
function escVerbText(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function renderVerbChooser(){
  const app=$("app");if(!app)return;
  const verbs=releasedVerbList();
  const selected=new Set(currentPracticeVerbs().slice(0,20));
  app.classList.add("card");
  app.innerHTML=`<section class="card"><h2>Verben wählen</h2><p class="small">Wähle 1 bis 20 freigegebene deutsche Verben. Sie werden als „ich kann nicht“ gespeichert.</p><div class="actions"><input id="manualVerbSearch" oninput="spFilterManualVerbs()" placeholder="Verb suchen" style="max-width:320px"><span class="badge"><span id="manualVerbCount">${selected.size}</span>/20 gewählt</span></div>${verbs.length?`<div class="verb-choice-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:14px">${verbs.map(v=>`<button type="button" class="btn secondary ${selected.has(v)?"selected":""}" data-verb-choice="${escVerbText(v)}" style="text-align:left;white-space:normal"><b>${escVerbText(v)}</b></button>`).join("")}</div>`:`<div class="empty">Keine freigegebenen Verben gefunden.</div>`}<div class="actions" style="margin-top:16px"><button class="btn green" onclick="spSaveManualVerbs()">Auswahl speichern</button><button class="btn secondary" onclick="renderHome()">Zurück</button></div></section>`;
}
function spFilterManualVerbs(){const q=String(($('manualVerbSearch')||{}).value||'').trim().toLowerCase();document.querySelectorAll('[data-verb-choice]').forEach(el=>{el.style.display=!q||String(el.textContent||'').toLowerCase().includes(q)?'block':'none'})}
function spToggleManualVerb(v){const box=[...document.querySelectorAll('[data-verb-choice]')].find(el=>el.getAttribute('data-verb-choice')===v);if(!box)return;const n=document.querySelectorAll('[data-verb-choice].selected').length;if(box.classList.contains('selected'))box.classList.remove('selected');else{if(n>=20){alert('Du kannst maximal 20 Verben wählen.');return}box.classList.add('selected')}const c=$('manualVerbCount');if(c)c.textContent=document.querySelectorAll('[data-verb-choice].selected').length}
function spSaveManualVerbs(){const A=allowedSet();const chosen=[...document.querySelectorAll('[data-verb-choice].selected')].map(el=>el.getAttribute('data-verb-choice')).filter(v=>A.has(v)).slice(0,20);if(!chosen.length){alert('Bitte wähle mindestens ein freigegebenes Verb.');return}state.manualVerbSelection=true;state.phase='home';state.active=chosen.slice();state.unknown=chosen.slice();state.unsure=[];state.currentPackageVerbs=chosen.slice();state.assessmentBatch=chosen.slice();state.practicePool=chosen.slice();state.currentTask=null;state.taskQueues={};state.taskDoneSets={};state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0};saveState();renderTaskOverview()}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest?e.target.closest('[data-verb-choice]'):null;if(!b)return;e.preventDefault();spToggleManualVerb(b.getAttribute('data-verb-choice'))},true);
function renderHome(){
  clearVerbHash(true);
  const app=$("app");if(!app)return;
  normalizeAppVerbState();
  if(packageExamPassed()&&allPracticeTasksDone()){markCurrentPackageLearned();}
  if(currentPracticeVerbs().length){renderTaskOverview();return}
  if(unusedVerbs().length){handleAssessmentClick();return}
  if(!releasedVerbList().length){app.classList.remove("card");app.innerHTML='<section class="card"><h2>Keine freigegebenen Verben gefunden</h2><p class="small">Öffne einmal das Dashboard, damit die Kursfreigabe geladen wird. Danach zurück zu Verben.</p></section>';return}
  app.classList.remove("card");app.innerHTML='<section class="card"><h2>Alle freigegebenen Verben sind fertig</h2><p class="small">Alle aktuell freigegebenen Verben sind gelernt. Mit „Fortschritte löschen“ beginnt alles wieder von vorne.</p></section>';saveState();
}
function openNextTask(){const order=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle","konjugieren"];for(const s of order){if(!taskDone(s)){({karteikarte:flashcards,memory, bild_verb:quiz, verb_bild:verbToImage, schreiben:writeVerb, hoeren_schreiben:hearWrite, hoeren_sprechen:hearSpeak, bild_sprechen:imageSpeak, satz_puzzle:sentencePuzzle, konjugieren:conjugationTask})[s]();return}}renderHome()}
function resumePhase(){if(state.phase==="assessment"){renderAssessment();return true}if(state.phase==="memory"&&state.memoryCards&&state.memoryCards.length){renderMemory();return true}const map={karteikarte:flashcards,bild_verb:quiz,verb_bild:verbToImage,schreiben:writeVerb,hoeren_schreiben:hearWrite,hoeren_sprechen:hearSpeak,bild_sprechen:imageSpeak,satz_puzzle:sentencePuzzle,konjugieren:conjugationTask,pruefung:resumeVerbExam};if(state.phase&&map[state.phase]){map[state.phase]();return true}return false}
async function boot(){if(!loadProfile())return;renderHeader();await loadState();renderHeader();renderSideMenu();try{if(location.hash&&phaseFromHash()!=="home"){state.phase=phaseFromHash();if(!resumePhase())renderHome()}else renderHome()}catch(e){console.warn(e);const app=$("app");if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p class="small">Bitte Seite neu laden.</p></section>'}renderAndHydrate()}
window.addEventListener("hashchange",()=>{if(!profile)return;const hp=phaseFromHash();if(hp==="home"){renderHome();return}state.phase=hp;if(!resumePhase())renderHome()});
document.addEventListener("DOMContentLoaded",boot);
