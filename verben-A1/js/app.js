function spUniq(a){return [...new Set((a||[]).filter(Boolean))]}
function spReadJson(k,f){try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}}
function spGet(o,path){let c=o;for(const p of path){if(!c||typeof c!=='object'||!(p in c))return undefined;c=c[p]}return c}
function spAllVerbData(){try{return typeof ALL_VERBS!=='undefined'?ALL_VERBS:[]}catch(e){return[]}}
function spAllVerbNames(){return spUniq(spAllVerbData().map(x=>x&&x.v).filter(Boolean)).sort((a,b)=>a.localeCompare(b,'de'))}
function spArchivedLearnedVerbs(){const out=[];(state.archivedPackages||[]).forEach(p=>{if(Array.isArray(p.verbs))out.push(...p.verbs);if(Array.isArray(p.practiced))out.push(...p.practiced)});return spUniq(out)}
function spMasteredVerbSet(){return new Set(spUniq([...(state.known||[]),...(state.learned||[]),...spArchivedLearnedVerbs()]))}
function spReleaseData(){const p=profile||spReadJson('SP_USER_PROFILE',null)||spReadJson('SP_STUDENT_PROFILE',{})||{};return p.assignments||spReadJson('SP_COURSE_RELEASES',{})||{}}
function spHasReleaseData(d){return !!(d&&(d.enabledWords||d.releases||d.enabledModules||d.defaultLocked!==undefined||d.releaseMode||d.settings||d.verbenA1AssessmentEnabled!==undefined))}
function spReleaseControlsWords(d){const ew=d.enabledWords||{},names=new Set(spAllVerbNames());if(Array.isArray(ew)&&ew.length)return true;if(Object.keys(ew).some(k=>k.includes('verben-A1/')||k.includes('Verben A1/')||names.has(k)))return true;return !!(spGet(d,['releases','verben-A1','words'])||spGet(d,['releases','Verben A1','words']))}
function spWordReleased(d,v){const ew=d.enabledWords;if(Array.isArray(ew))return ew.includes(v)||ew.includes('verben-A1/'+v)||ew.includes('Verben A1/'+v);const paths=[['enabledWords',v],['enabledWords','verben-A1/'+v],['enabledWords','Verben A1/'+v],['releases','verben-A1','words',v],['releases','Verben A1','words',v]];for(const p of paths){const x=spGet(d,p);if(x!==undefined)return x===true}return undefined}
function releasedVerbList(){const all=spAllVerbNames(),d=spReleaseData();if(!all.length)return[];if(!spHasReleaseData(d))return all;const closed=[spGet(d,['enabledModules','Verben A1']),spGet(d,['enabledModules','verben-A1']),spGet(d,['releases','Verben A1','enabled']),spGet(d,['releases','verben-A1','enabled'])].some(x=>x===false);if(closed)return[];if(spReleaseControlsWords(d))return all.filter(v=>spWordReleased(d,v)===true);if(d.releaseMode==='all'||d.releaseMode==='open'||d.defaultLocked===false)return all.filter(v=>spWordReleased(d,v)!==false);return all}
function spAllowedSet(){return new Set(releasedVerbList())}
function spEnsureState(){
  migrateState();
  const allowed=spAllowedSet(),mastered=spMasteredVerbSet();
  const restrict=a=>spUniq(a).filter(v=>(!allowed.size||allowed.has(v))&&!mastered.has(v));
  state.known=spUniq(state.known).filter(v=>!allowed.size||allowed.has(v));
  state.learned=spUniq(state.learned).filter(v=>!allowed.size||allowed.has(v));
  state.unsure=restrict(state.unsure);
  state.unknown=restrict(state.unknown).filter(v=>!state.unsure.includes(v));
  state.active=restrict([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[]),...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[])]);
  state.unsure=state.unsure.filter(v=>state.active.includes(v));
  state.unknown=state.unknown.filter(v=>state.active.includes(v)&&!state.unsure.includes(v));
  state.currentPackageVerbs=state.active.slice();
  state.assessmentBatch=state.active.slice();
  state.practicePool=restrict(state.practicePool||[]).filter(v=>state.active.includes(v));
  state.active.forEach(ensureSkillState);
}
function currentPracticeVerbs(){spEnsureState();return state.active.slice()}
function currentPackageAllVerbs(){spEnsureState();return spUniq([...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...(state.active||[])])}
function currentAssessmentCount(){return currentPackageAllVerbs().length}
function remainingUnlearnedVerbs(){spEnsureState();const mastered=spMasteredVerbSet(),active=new Set(currentPracticeVerbs());return releasedVerbList().filter(v=>!mastered.has(v)&&!active.has(v))}
function unusedVerbs(){spEnsureState();const mastered=spMasteredVerbSet(),active=new Set(currentPracticeVerbs()),assessed=new Set(state.assessed||[]);return releasedVerbList().filter(v=>!mastered.has(v)&&!active.has(v)&&!assessed.has(v))}
function allReleasedVerbsLearned(){const released=releasedVerbList();if(!released.length)return false;const mastered=spMasteredVerbSet();return released.every(v=>mastered.has(v))}
function spSyncDashboardSummary(){try{const released=releasedVerbList(),mastered=spMasteredVerbSet(),learned=released.filter(v=>mastered.has(v)),active=currentPracticeVerbs();const percent=released.length?Math.round(learned.length*100/released.length):0;localStorage.setItem('SP_VERBS_DASHBOARD_SUMMARY',JSON.stringify({released,learned,active,percent:Math.max(0,Math.min(100,percent)),completed:released.length>0&&learned.length>=released.length,updatedAt:Date.now()}))}catch(e){}}
window.spStrictReleasedVerbList=releasedVerbList;
window.spReleasedVerbList=releasedVerbList;
window.releasedAssessmentVerbs=releasedVerbList;
window.spVerbAssessmentEnabled=()=>true;
window.spVerbPracticeTargetCount=()=>{const n=remainingUnlearnedVerbs().length+currentPracticeVerbs().length;return Math.min(PRACTICE_TARGET_COUNT,n||PRACTICE_TARGET_COUNT)};
window.spSyncVerbRelease=function(){spEnsureState();saveState();spSyncDashboardSummary()};

function logoHtml(){return '<img class="brand-logo" src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot">'}
function renderHeader(){
  const h=$('spHeader');if(!h)return;
  const name=profile?[safeText(profile.vorname||profile.firstName||profile.name||''),safeText(profile.nachname||profile.lastName||'')].filter(Boolean).join(' ').trim():'';
  const kurs=profile?safeText(profile.kurs||profile.kursnummer||profile.courseCode||''):'';
  h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html">${logoHtml()}<div><h1>SprachPilot</h1><div class="subtitle">Verben A1</div></div></a><div class="account-tools"><span class="account-pill">${name||'Schüler/in'}${kurs?' · '+kurs:''}</span><a class="account-link" href="/student-dashboard/index.html">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a><button class="account-link account-btn" onclick="spVerbLogout()">Abmelden</button></div></div><nav class="nav"><button class="btn secondary sp-nav-back" onclick="spGoBack()">← Zurück</button><a class="btn secondary sp-nav-link" href="/verben-A1/">Verben</a><a class="btn secondary sp-nav-link" href="#aufgaben">Aufgabenübersicht</a><button class="btn secondary sp-nav-link" onclick="renderVerbOverview()">Übersicht</button><button class="btn secondary sp-nav-link" onclick="renderStudentDashboard()">Statistik</button><button class="btn secondary sp-nav-link" onclick="handleAssessmentClick()">Verben einschätzen</button><button class="btn secondary sp-nav-link" onclick="renderVerbChooser()">Verben wählen</button><button class="btn danger-btn sp-nav-link" onclick="resetCurrentPackage()">Fortschritte löschen</button></nav>`;
}
function spVerbLogout(){localStorage.removeItem('SP_USER_PROFILE');localStorage.removeItem('SP_STUDENT_PROFILE');localStorage.removeItem('SP_KEEP_LOGGED_IN');localStorage.removeItem('SP_LOGIN_ROLE');location.href='/index.html'}
function clearHash(){clearVerbHash(true)}
function isTaskPhase(){return ['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren','pruefung'].includes(state.phase)||!!state.currentTask}
function returnCurrentTaskToQueue(){try{const t=state.currentTask;if(!t||!t.skill||!t.v)return;const qKey=taskQueueKey(t.skill),dKey=taskDoneSetKey(t.skill);const done=(state.taskDoneSets&&state.taskDoneSets[dKey]||[]).some(k=>String(k).split(':')[0]===t.v);state.taskQueues=state.taskQueues||{};state.taskQueues[qKey]=state.taskQueues[qKey]||[];if(!done&&!state.taskQueues[qKey].some(x=>x&&x.v===t.v))state.taskQueues[qKey].unshift({v:t.v,slot:t.slot||0})}catch(e){}}
function closeOpenVerbTask(){returnCurrentTaskToQueue();state.phase='taskOverview';state.currentGame='';state.currentVerb='';state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;saveState();spSyncDashboardSummary()}
function goStudentDashboard(){location.href='/student-dashboard/index.html'}
function goVerbIndex(){clearHash();renderVerbIndexPage()}
function goTaskOverview(){if(location.hash!=='#aufgaben')history.pushState(null,'','#aufgaben');renderTaskOverview()}
function startPractice(){spEnsureState();if(currentPracticeVerbs().length){goTaskOverview();return}renderVerbIndexPage()}
function spGoBack(){if(isTaskPhase()){closeOpenVerbTask();goTaskOverview();return}if(state.phase==='taskOverview'){goVerbIndex();return}if(state.phase==='overview'||state.phase==='chooser'||state.phase==='home'){goVerbIndex();return}goStudentDashboard()}
function closeVerbTaskAndRenderHome(){closeOpenVerbTask();goTaskOverview()}
function goVerbHome(){closeVerbTaskAndRenderHome()}
function renderSideMenu(){}

function taskLabel(skill){return VERB_SKILL_LABELS[skill]||skill}
function taskDesc(skill){return {karteikarte:'Lerne das Verb mit Bild.',memory:'Finde Bild und Verb.',bild_verb:'Sieh das Bild und wähle das Verb.',verb_bild:'Lies das Verb und wähle das Bild.',schreiben:'Schreibe das Verb zum Bild.',hoeren_schreiben:'Höre und schreibe das Verb.',hoeren_sprechen:'Höre und sprich das Verb.',bild_sprechen:'Sieh das Bild und sprich das Verb.',satz_puzzle:'Höre und baue den Satz.',konjugieren:'Schreibe die richtige Form.'}[skill]||'Übe das Verb.'}
function iconFor(skill){return {karteikarte:'🃏',memory:'🧠',bild_verb:'🖼️',verb_bild:'🔁',schreiben:'✍️',hoeren_schreiben:'👂',hoeren_sprechen:'🎤',bild_sprechen:'🗣️',satz_puzzle:'🧩',konjugieren:'🔤'}[skill]||'▶'}
function taskHref(skill){return '#'+(PHASE_HASHES[skill]||skill)}
function taskCard(skill,i){const done=taskDone(skill),p=queuedProgress(skill);return `<a class="module task-card ${done?'done-card':''}" href="${taskHref(skill)}"><div><div class="num">${i+1}. ${safeText(taskLabel(skill))}</div></div><div class="icon big-icon">${iconFor(skill)}</div><p>${safeText(taskDesc(skill))}</p><div><div class="progress"><div class="bar" style="width:${done?100:p.pct}%"></div></div><div class="small">${done?'100%':p.pct+'%'}</div><div class="start">Starten</div></div></a>`}
function examCard(){const ready=allPracticeTasksDone(),passed=state.exam&&state.exam.passed;return `<a class="module task-card ${passed?'done-card':''} ${ready?'':'disabled-card'}" ${ready?'href="#pruefung"':'aria-disabled="true"'}><div><div class="num">11. Prüfung</div></div><div class="icon big-icon">⭐</div><p>Prüfe die aktiven Verben.</p><div><div class="progress"><div class="bar" style="width:${passed?100:0}%"></div></div><div class="small">${passed?'100%':ready?'offen':'gesperrt'}</div><div class="start">Starten</div></div></a>`}
function renderTaskOverview(){
  const app=$('app');if(!app)return;
  spEnsureState();
  if(packageExamPassed()&&allPracticeTasksDone()&&currentPracticeVerbs().length){markCurrentPackageLearned();renderVerbIndexPage();return}
  const active=currentPracticeVerbs();
  if(!active.length){renderVerbIndexPage();return}
  state.phase='taskOverview';state.currentTask=null;
  if(!state.practicePool.length)buildPracticePool();
  saveState();spSyncDashboardSummary();
  const pct=overall(),packageCount=currentPackageAllVerbs().length||active.length;
  app.classList.remove('card');
  app.innerHTML=`<section class="card progress-card"><div class="circle">${pct}%</div><div class="progress-main"><p class="eyebrow">Aufgabenübersicht</p><h2>Dein Fortschritt</h2><div class="small">${packageCount} Verben im Paket · ${active.length} Verben zu üben · ${state.exam&&state.exam.passed?'Prüfung 100%':allPracticeTasksDone()?'Prüfung offen':'Prüfung gesperrt'}</div><div class="progress"><div class="bar" style="width:${pct}%"></div></div></div></section><section class="card"><div class="grid task-grid">${VERB_SKILLS.map(taskCard).join('')}${examCard()}</div></section>`;
  renderAndHydrate();
}
function openVerbTask(skill){spEnsureState();if(!currentPracticeVerbs().length){renderVerbIndexPage();return}try{if(skill==='karteikarte'){flashcards();return}if(skill==='memory'){memory();return}if(skill==='bild_verb'){quiz();return}if(skill==='verb_bild'){verbToImage();return}if(skill==='schreiben'){writeVerb();return}if(skill==='hoeren_schreiben'){hearWrite();return}if(skill==='hoeren_sprechen'){hearSpeak();return}if(skill==='bild_sprechen'){imageSpeak();return}if(skill==='satz_puzzle'){sentencePuzzle();return}if(skill==='konjugieren'){conjugationTask();return}}catch(e){console.error('Verben task failed',skill,e);try{localStorage.setItem('SP_VERBS_LAST_TASK_ERROR',skill+': '+(e&&e.stack||e))}catch(x){}const app=$('app');if(app)app.innerHTML=`<section class="card"><h2>Aufgabe konnte nicht geöffnet werden</h2><p class="small">${safeText(skill)}</p><p class="small">${safeText(String(e&&e.message||e||''))}</p><div class="actions"><a class="btn secondary" href="#aufgaben">Zur Aufgabenübersicht</a></div></section>`}}
function openNextTask(){goTaskOverview()}
function allPracticeTasksDone(){return VERB_SKILLS.every(taskDone)}
function packageExamPassed(){return !!(state.exam&&state.exam.passed&&Number(state.exam.score)===100)}
function markCurrentPackageLearned(){const verbs=currentPracticeVerbs();if(!verbs.length)return false;state.learned=spUniq([...(state.learned||[]),...verbs]);state.known=spUniq([...(state.known||[]),...verbs]);state.archivedPackages=state.archivedPackages||[];state.archivedPackages.push({type:'completed',date:new Date().toISOString(),verbs:verbs.slice()});state.unsure=[];state.unknown=[];state.active=[];state.practicePool=[];state.currentPackageVerbs=[];state.assessmentBatch=[];state.assessed=[];resetPackageTasks();saveState();spSyncDashboardSummary();return true}
function resetAllVerbProgressKeepPoints(){const alertsShown=state.alertsShown||{},taskRewardsShown=state.taskRewardsShown||{};state.phase='home';state.index=0;state.known=[];state.learned=[];state.unsure=[];state.unknown=[];state.active=[];state.practicePool=[];state.archivedPackages=[];state.assessmentBatch=[];state.assessed=[];state.currentPackageVerbs=[];state.weak={};state.currentGame='';state.currentVerb='';state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.first=null;state.openCards=[];state.lock=false;state.skillDone={};state.skillAttempts={};state.skillSuccess={};state.taskQueues={};state.taskDoneSets={};state.alertsShown=alertsShown;state.taskRewardsShown=taskRewardsShown;state.packageNo=1;state.assessmentStart=0;state.assessmentTries=0;state.revealed=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false};clearHash()}
function resetCurrentPackage(){if(!confirm('Alle Verben wieder auf „nicht gelernt“ setzen? Punkte bleiben erhalten.'))return;resetAllVerbProgressKeepPoints();saveState();spSyncDashboardSummary();renderVerbIndexPage()}
function handleAssessmentClick(){spEnsureState();if(allReleasedVerbsLearned()){renderAllVerbsCompletedPage();return}try{startAssessment(true)}catch(e){console.error('Assessment failed',e);renderVerbChooser()}}
function renderAllVerbsCompletedPage(){const app=$('app');if(!app)return;app.classList.remove('card');state.phase='home';saveState();spSyncDashboardSummary();app.innerHTML='<section class="card completion-card"><div class="finish-icon">✓</div><h2>Du hast alle Verben gelernt.</h2><p class="small">Komm später zurück, um neue Verben zu lernen.</p><div class="actions"><button class="btn secondary" onclick="renderVerbIndexPage()">Zur Verben-Seite</button></div></section>'}
function renderNoReleasedPage(){const app=$('app');if(!app)return;app.classList.remove('card');state.phase='home';saveState();spSyncDashboardSummary();app.innerHTML='<section class="card"><h2>Keine freigegebenen Verben gefunden</h2><p class="small">Es sind noch keine Verben für deinen Kurs freigegeben.</p><div class="actions"><a class="btn secondary" href="/student-dashboard/index.html">Zum Dashboard</a></div></section>'}
function renderVerbIndexPage(){
  const app=$('app');if(!app)return;
  if(location.hash)clearVerbHash(true);
  spEnsureState();
  if(packageExamPassed()&&allPracticeTasksDone()&&currentPracticeVerbs().length){markCurrentPackageLearned();spEnsureState()}
  const released=releasedVerbList(),active=currentPracticeVerbs(),mastered=spMasteredVerbSet();
  if(!released.length){renderNoReleasedPage();return}
  if(allReleasedVerbsLearned()){renderAllVerbsCompletedPage();return}
  state.phase='home';saveState();spSyncDashboardSummary();
  const learnedCount=released.filter(v=>mastered.has(v)).length;
  const remainingCount=Math.max(0,released.length-learnedCount-active.length);
  const canPractice=active.length>0;
  app.classList.remove('card');
  app.innerHTML=`<section class="card verb-index-card"><p class="eyebrow">Verben A1</p><h2>Was möchtest du machen?</h2><p class="small verb-index-summary"><span>${released.length} freigegebene Verben</span><span>${learnedCount} gelernt</span><strong>${active.length} zum Üben</strong><span>${remainingCount} noch offen</span></p><div class="grid verb-start-grid">${canPractice?`<button type="button" class="module task-card verb-action-card verb-practice-card" onclick="startPractice()"><div class="verb-action-visual"><span class="verb-action-symbol">▶</span></div><div class="num">Üben</div><p>Aufgaben mit deinen unsicheren Verben starten.</p><div class="start">Starten</div></button>`:`<button type="button" class="module task-card verb-action-card disabled-card" disabled><div class="verb-action-visual"><span class="verb-action-symbol">▶</span></div><div class="num">Üben</div><p>Erst Verben einschätzen oder wählen.</p><div class="start">Noch gesperrt</div></button>`}<button type="button" class="module task-card verb-action-card" onclick="handleAssessmentClick()"><div class="verb-action-visual"><span class="verb-action-symbol">?</span></div><div class="num">Einschätzen</div><p>Neue Verben prüfen: ich kann / unsicher / ich kann nicht.</p><div class="start">Starten</div></button><button type="button" class="module task-card verb-action-card" onclick="renderVerbChooser()"><div class="verb-action-visual"><span class="verb-action-symbol">✓</span></div><div class="num">Wählen</div><p>Freigegebene, noch nicht gelernte Verben selbst auswählen.</p><div class="start">Auswählen</div></button></div></section>`;
}
function renderHome(){renderVerbIndexPage()}
function verbStatus(v){const mastered=spMasteredVerbSet();if(mastered.has(v))return{label:'gelernt / ich kann',cls:'status-known'};if((state.unsure||[]).includes(v))return{label:'unsicher',cls:'status-unsure'};if((state.unknown||[]).includes(v))return{label:'ich kann nicht',cls:'status-unknown'};if((state.active||[]).includes(v))return{label:'aktiv',cls:'status-active'};return{label:'noch nicht gelernt',cls:'status-new'}}
function verbSentence(v){return (window.VERB_SENTENCES&&window.VERB_SENTENCES[v])||(typeof sentenceForVerb==='function'?sentenceForVerb(v):'')}
function renderVerbOverview(){
  const app=$('app');if(!app)return;
  spEnsureState();state.phase='overview';
  const released=releasedVerbList(),mastered=spMasteredVerbSet(),active=currentPracticeVerbs(),A=new Set(active);
  const groups=[['Aktive Verben · gerade lernen',active,true],['Gelernt / ich kann',released.filter(v=>mastered.has(v)),false],['Noch nicht gelernt',released.filter(v=>!mastered.has(v)&&!A.has(v)),false]];
  function card(v){const st=verbStatus(v),s=verbSentence(v);return `<div class="verb-overview-card ${st.cls}">${imageBox(v,true)}<div class="verb-name">${safeText(v)}</div><div class="verb-status">${safeText(st.label)}</div>${s?`<div class="verb-sentence">${safeText(s)}</div>`:''}</div>`}
  app.classList.remove('card');
  app.innerHTML=`<section class="card"><p class="eyebrow">Verben</p><h2>Verben-Übersicht</h2><p class="small">Nur freigegebene Verben.</p>${groups.map(g=>`<details class="verb-overview-details" ${g[2]?'open':''}><summary>${safeText(g[0])} <span class="small">${g[1].length}</span></summary><div class="verb-overview-grid">${g[1].map(card).join('')||'<p class="small">Keine Verben.</p>'}</div></details>`).join('')}<div class="actions"><button class="btn secondary" onclick="renderVerbIndexPage()">Zur Verben-Seite</button></div></section>`;
  saveState();spSyncDashboardSummary();renderAndHydrate();
}
function renderVerbChooser(){const app=$('app');if(!app)return;spEnsureState();if(allReleasedVerbsLearned()){renderAllVerbsCompletedPage();return}state.phase='chooser';const mastered=spMasteredVerbSet();const activeSet=new Set(currentPracticeVerbs());const verbs=releasedVerbList().filter(v=>!mastered.has(v)&&!activeSet.has(v));const selected=new Set();app.classList.add('card');app.innerHTML=`<section class="card"><h2>Verben wählen</h2><p class="small">Wähle 1 bis 20 freigegebene, noch nicht gelernte Verben. Gelernte Verben erscheinen hier nicht.</p><div class="actions"><input id="manualVerbSearch" oninput="spFilterManualVerbs()" placeholder="Verb suchen" style="max-width:320px"><span class="badge"><span id="manualVerbCount">${selected.size}</span>/20 gewählt</span></div>${verbs.length?`<div class="verb-choice-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:14px">${verbs.map(v=>`<button type="button" class="btn secondary" data-verb-choice="${safeText(v)}" style="text-align:left;white-space:normal"><b>${safeText(v)}</b></button>`).join('')}</div>`:'<div class="empty">Keine freigegebenen Verben zum Lernen gefunden.</div>'}<div class="actions" style="margin-top:16px"><button class="btn green" onclick="spSaveManualVerbs()">Auswahl speichern</button><button class="btn secondary" onclick="renderVerbIndexPage()">Zur Verben-Seite</button></div></section>`;saveState()}
function spFilterManualVerbs(){const q=String(($('manualVerbSearch')||{}).value||'').trim().toLowerCase();document.querySelectorAll('[data-verb-choice]').forEach(el=>{el.style.display=!q||String(el.textContent||'').toLowerCase().includes(q)?'block':'none'})}
function spToggleManualVerb(v){const box=[...document.querySelectorAll('[data-verb-choice]')].find(el=>el.getAttribute('data-verb-choice')===v);if(!box)return;const n=document.querySelectorAll('[data-verb-choice].selected').length;if(box.classList.contains('selected'))box.classList.remove('selected');else{if(n>=20){alert('Du kannst maximal 20 Verben wählen.');return}box.classList.add('selected')}const c=$('manualVerbCount');if(c)c.textContent=document.querySelectorAll('[data-verb-choice].selected').length}
function spSaveManualVerbs(){const allowed=spAllowedSet(),mastered=spMasteredVerbSet(),activeSet=new Set(currentPracticeVerbs());const chosen=[...document.querySelectorAll('[data-verb-choice].selected')].map(el=>el.getAttribute('data-verb-choice')).filter(v=>(!allowed.size||allowed.has(v))&&!mastered.has(v)&&!activeSet.has(v)).slice(0,20);if(!chosen.length){alert('Bitte wähle mindestens ein freigegebenes Verb.');return}const merged=spUniq([...currentPracticeVerbs(),...chosen]);state.phase='home';state.active=merged.slice();state.unknown=spUniq([...(state.unknown||[]),...chosen]);state.unsure=state.unsure||[];state.currentPackageVerbs=merged.slice();state.assessmentBatch=merged.slice();state.practicePool=merged.slice();state.currentTask=null;state.taskQueues={};state.taskDoneSets={};state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false};saveState();spSyncDashboardSummary();renderVerbIndexPage()}
document.addEventListener('click',e=>{const b=e.target&&e.target.closest?e.target.closest('[data-verb-choice]'):null;if(!b)return;e.preventDefault();spToggleManualVerb(b.getAttribute('data-verb-choice'))},true);
function routeVerbenHash(){const hp=phaseFromHash();if(hp==='taskOverview'){renderTaskOverview();return}if(VERB_SKILLS.includes(hp)){openVerbTask(hp);return}if(hp==='pruefung'){if(allPracticeTasksDone())startVerbExam();else renderTaskOverview();return}if(hp==='overview'){renderVerbOverview();return}if(hp==='chooser'){renderVerbChooser();return}if(hp==='assessment'){try{renderAssessment(true);return}catch(e){renderVerbIndexPage();return}}renderVerbIndexPage()}
function renderSafeHomeFallback(error){try{localStorage.setItem('SP_VERBS_LAST_BOOT_ERROR',String(error&&error.stack||error||'unknown'))}catch(e){}try{routeVerbenHash()}catch(e){try{renderVerbChooser()}catch(x){goStudentDashboard()}}}
async function boot(){if(!loadProfile())return;renderHeader();await loadState();spEnsureState();saveState();renderHeader();renderSideMenu();routeVerbenHash();spSyncDashboardSummary();renderAndHydrate()}
window.addEventListener('hashchange',()=>{if(!profile)return;routeVerbenHash()});
document.addEventListener('DOMContentLoaded',()=>boot().catch(renderSafeHomeFallback));