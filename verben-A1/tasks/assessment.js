function unusedVerbs(){
  const used=[...state.known,...state.unsure,...state.unknown,...state.active,...state.learned,...(state.assessed||[]),...(state.currentPackageVerbs||[])];
  return ALL_VERBS.map(x=>x.v).filter(v=>!used.includes(v));
}
function currentAssessmentVerb(){const list=unusedVerbs();return list.length?list[0]:null}
function startAssessment(){
  normalizeVerbStatusLists();
  if(currentPracticeVerbs().length>=PRACTICE_TARGET_COUNT && !packageExamPassed()){renderHome();return}
  const appNode=$("app"); if(appNode) appNode.classList.add("card");
  state.phase="assessment";state.revealed=false;state.assessmentStart=Date.now();state.assessmentTries=0;saveState();setVerbHashForPhase("assessment");renderAssessment();
}
function renderAssessment(){
  const v=currentAssessmentVerb();
  if(!v || currentPracticeVerbs().length>=PRACTICE_TARGET_COUNT){resetPackageTasks();buildPracticePool();if(!currentPracticeVerbs().length){state.assessmentBatch=[];state.currentPackageVerbs=[];resetPackageTasks();}state.phase="home";const appNode=$("app"); if(appNode) appNode.classList.remove("card");saveState();renderHome();return}
  if(state.currentVerb!==v){state.assessmentStart=Date.now();state.assessmentTries=0;state.revealed=false;}
  state.currentVerb=v;saveState();
  $("app").innerHTML=`<h2>Neue Verben einschätzen</h2><p class="small">Schreibe das deutsche Verb. Schnell + richtig = kann ich. Langsam oder nach Fehler = unsicher. Lösung zeigen oder „Ich weiß es nicht“ = kann ich nicht.</p><div class="assessment-box"><div class="assessment-card"><div class="small">Muttersprache: ${safeText(nativeLang())}</div><div class="native-word">${safeText(nativeWord(v))}</div><div class="assessment-timer">⏱ Ziel: unter ${ASSESSMENT_FAST_SECONDS} Sekunden</div></div><input id="assessmentInput" autocomplete="off" placeholder="Deutsches Verb schreiben …" onkeydown="if(event.key==='Enter')checkAssessmentAnswer()"><div id="assessmentFeedback"></div><div class="actions"><button class="success" onclick="checkAssessmentAnswer()">Kontrollieren</button><button class="warning" onclick="revealAssessmentVerb()">Karte umdrehen / Lösung zeigen</button><button class="danger" onclick="markAssessment('unknown')">Ich weiß es nicht</button></div></div><p class="small">Eingeschätzt in diesem Block: ${currentAssessmentCount()} · Übungsverben: ${Math.min(currentPracticeVerbs().length,PRACTICE_TARGET_COUNT)}/${PRACTICE_TARGET_COUNT}</p>`;
  setTimeout(()=>$('assessmentInput')?.focus(),50);
}
function addUnique(arr,v){if(!arr.includes(v))arr.push(v)}
function removeFromAll(v){[state.known,state.unsure,state.unknown,state.active,state.learned].forEach(a=>{let i=a.indexOf(v);while(i>=0){a.splice(i,1);i=a.indexOf(v)}})}
function markAssessment(level){
  const v=state.currentVerb||currentAssessmentVerb();if(!v)return;
  removeFromAll(v);
  addUnique(state.assessmentBatch,v);
  addUnique(state.assessed,v);
  addUnique(state.currentPackageVerbs,v);
  if(level==="known")addUnique(state.known,v);
  if(level==="unsure"){addUnique(state.unsure,v);addUnique(state.active,v)}
  if(level==="unknown"){addUnique(state.unknown,v);addUnique(state.active,v)}
  normalizeVerbStatusLists();
  ensureSkillState(v);
  state.assessmentTries=0;state.revealed=false;
  if(currentPracticeVerbs().length>=PRACTICE_TARGET_COUNT||unusedVerbs().length===0){resetPackageTasks();buildPracticePool();if(!currentPracticeVerbs().length){state.assessmentBatch=[];state.currentPackageVerbs=[];resetPackageTasks();}state.phase="home";saveState();renderHome();return}
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
