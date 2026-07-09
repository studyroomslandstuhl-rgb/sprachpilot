function releasedAssessmentVerbs(){
  if(typeof window.spStrictReleasedVerbList==="function")return window.spStrictReleasedVerbList();
  return ALL_VERBS.map(x=>x.v).filter(Boolean);
}
function masteredAssessmentVerbs(){
  const archived=[];
  (state.archivedPackages||[]).forEach(p=>{
    if(Array.isArray(p.verbs))archived.push(...p.verbs);
    if(Array.isArray(p.practiced))archived.push(...p.practiced);
  });
  return [...new Set([...(state.known||[]),...(state.learned||[]),...archived].filter(Boolean))];
}
function assessmentTargetCount(){
  const mastered=new Set(masteredAssessmentVerbs());
  const n=releasedAssessmentVerbs().filter(v=>!mastered.has(v)).length;
  return Math.min(PRACTICE_TARGET_COUNT,n||PRACTICE_TARGET_COUNT);
}
function assessmentViewRequested(){try{return new URLSearchParams(location.search||"").get("view")==="assessment"||(location.hash||"").replace(/^#/,"")==="assessment"}catch(e){return false}}
function taskOverviewUrl(){return "/verben-A1/?view=aufgaben"}
function goAssessmentTasks(){if(typeof goTaskOverview==="function"){goTaskOverview();return}location.href=taskOverviewUrl()}
function renderAssessmentBlocked(message){
  const app=$("app");if(!app)return;
  app.classList.remove("card");
  state.phase="assessment";saveState();
  app.innerHTML=`<section class="card"><p class="eyebrow">Verben A1</p><h2>Neue Verben einschätzen</h2><p class="small">${safeText(message||"Du hast schon genug Verben zum Üben.")}</p><div class="actions"><button class="btn green" onclick="goAssessmentTasks()">Aufgaben starten</button><button class="btn secondary" onclick="renderVerbOverview()">Übersicht</button></div></section>`;
}
function unusedVerbs(){
  normalizeVerbStatusLists();
  const mastered=new Set(masteredAssessmentVerbs());
  const used=[...mastered,...(state.unsure||[]),...(state.unknown||[]),...(state.active||[]),...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[])];
  const usedSet=new Set(used.filter(Boolean));
  return releasedAssessmentVerbs().filter(v=>!usedSet.has(v));
}
function currentAssessmentVerb(){const list=unusedVerbs();return list.length?list[0]:null}
function startAssessment(force=false){
  if(typeof window.spSyncVerbRelease==="function")window.spSyncVerbRelease();
  if(!force&&typeof window.spVerbAssessmentEnabled==="function"&&!window.spVerbAssessmentEnabled()){renderHome();return}
  normalizeVerbStatusLists();
  const target=assessmentTargetCount();
  const activeCount=currentPracticeVerbs().length;
  if(!target){renderAssessmentBlocked("Es sind keine freigegebenen Verben für die Einschätzung vorhanden.");return}
  if(activeCount>=target&&!packageExamPassed()){
    renderAssessmentBlocked(`Du hast bereits ${activeCount} Verben zum Üben. Du musst nicht zuerst weitere Verben wählen oder einschätzen. Starte direkt die Aufgaben.`);
    return;
  }
  const appNode=$("app"); if(appNode) appNode.classList.add("card");
  state.phase="assessment";state.revealed=false;state.assessmentStart=Date.now();state.assessmentTries=0;saveState();
  try{if(history&&location.search!=="?view=assessment")history.replaceState(null,"","/verben-A1/?view=assessment")}catch(e){}
  renderAssessment(force);
}
function renderAssessment(force=false){
  if(typeof window.spSyncVerbRelease==="function")window.spSyncVerbRelease();
  if(!force&&typeof window.spVerbAssessmentEnabled==="function"&&!window.spVerbAssessmentEnabled()){renderHome();return}
  normalizeVerbStatusLists();
  const target=assessmentTargetCount();
  const v=currentAssessmentVerb();
  if(!v || currentPracticeVerbs().length>=target){
    resetPackageTasks();buildPracticePool();
    if(!currentPracticeVerbs().length){state.assessmentBatch=[];state.currentPackageVerbs=[];resetPackageTasks();state.phase="home";saveState();renderVerbIndexPage();return}
    state.phase="taskOverview";saveState();goAssessmentTasks();return
  }
  if(masteredAssessmentVerbs().includes(v)){state.currentVerb="";saveState();renderAssessment(force);return}
  if(state.currentVerb!==v){state.assessmentStart=Date.now();state.assessmentTries=0;state.revealed=false;}
  state.currentVerb=v;saveState();
  const imgHtml=typeof imageBox==="function"?imageBox(v):"";
  $("app").innerHTML=`<h2>Neue Verben einschätzen</h2><p class="small">Schreibe das deutsche Verb. Schnell + richtig = kann ich. Langsam oder nach Fehler = unsicher. Lösung zeigen oder „Ich weiß es nicht“ = kann ich nicht.</p><div class="assessment-box"><div class="assessment-card"><div class="small">Muttersprache: ${safeText(nativeLang())}</div><div class="native-word">${safeText(nativeWord(v))}</div>${imgHtml}<div class="assessment-timer">⏱ Ziel: unter ${ASSESSMENT_FAST_SECONDS} Sekunden</div></div><input id="assessmentInput" autocomplete="off" placeholder="Deutsches Verb schreiben …" onkeydown="if(event.key==='Enter')checkAssessmentAnswer()"><div id="assessmentFeedback"></div><div class="actions"><button class="success" onclick="checkAssessmentAnswer()">Kontrollieren</button><button class="warning" onclick="revealAssessmentVerb()">Karte umdrehen / Lösung zeigen</button><button class="danger" onclick="markAssessment('unknown')">Ich weiß es nicht</button></div></div><p class="small">Eingeschätzt in diesem Block: ${currentAssessmentCount()} · Übungsverben: ${Math.min(currentPracticeVerbs().length,target)}/${target}</p>`;
  if(typeof renderAndHydrate==="function")renderAndHydrate();
  setTimeout(()=>$('assessmentInput')?.focus(),50);
}
function addUnique(arr,v){if(!arr.includes(v))arr.push(v)}
function removeFromAll(v){[state.known,state.unsure,state.unknown,state.active,state.learned].forEach(a=>{let i=a.indexOf(v);while(i>=0){a.splice(i,1);i=a.indexOf(v)}})}
function markAssessment(level){
  const allowed=new Set(releasedAssessmentVerbs());
  const v=state.currentVerb||currentAssessmentVerb();if(!v||!allowed.has(v)){renderAssessment();return;}
  if(masteredAssessmentVerbs().includes(v)){state.currentVerb="";saveState();renderAssessment();return}
  removeFromAll(v);
  addUnique(state.assessmentBatch,v);
  addUnique(state.currentPackageVerbs,v);
  if(level==="known"){addUnique(state.known,v);addUnique(state.learned,v)}
  if(level==="unsure"){addUnique(state.unsure,v);addUnique(state.active,v)}
  if(level==="unknown"){addUnique(state.unknown,v);addUnique(state.active,v)}
  normalizeVerbStatusLists();
  ensureSkillState(v);
  state.assessmentTries=0;state.revealed=false;state.currentVerb="";
  const target=assessmentTargetCount();
  if(currentPracticeVerbs().length>=target||unusedVerbs().length===0){resetPackageTasks();buildPracticePool();if(!currentPracticeVerbs().length){state.assessmentBatch=[];state.currentPackageVerbs=[];resetPackageTasks();state.phase="home";saveState();renderVerbIndexPage();return}state.phase="taskOverview";saveState();goAssessmentTasks();return}
  saveState();renderAssessment();
}
function checkAssessmentAnswer(){
  const v=state.currentVerb;const input=$("assessmentInput");const answer=input?input.value:"";const seconds=(Date.now()-(state.assessmentStart||Date.now()))/1000;const correct=clean(answer)===clean(v);
  if(correct){
    const fast=seconds<=ASSESSMENT_FAST_SECONDS && !state.revealed && !state.assessmentTries;
    $("assessmentFeedback").innerHTML=fast?`<div class="ok">Richtig und schnell (${seconds.toFixed(1)} s). Das Verb wird als „ich kann“ gespeichert.</div>`:`<div class="helped">Richtig (${seconds.toFixed(1)} s). Das Verb wird als „unsicher“ gespeichert.</div>`;
    setTimeout(()=>markAssessment(fast?"known":"unsure"),450);
    return;
  }
  state.assessmentTries=(state.assessmentTries||0)+1;saveState();
  const msg=standardFeedback(state.assessmentTries,v,"Schreibweise des Verbs");
  $("assessmentFeedback").innerHTML=`<div class="no">${safeText(msg)}</div>`;
}
function revealAssessmentVerb(){
  state.revealed=true;saveState();
  $("assessmentFeedback").innerHTML=`<div class="reveal-card"><div class="small">Deutsch</div><div class="german-word">${safeText(state.currentVerb)}</div><p>Dieses Verb wird als <strong>kann ich nicht</strong> markiert.</p><button class="danger" onclick="markAssessment('unknown')">Weiter</button></div>`
}
window.spOpenAssessmentFromUrl=function(){startAssessment(true)};