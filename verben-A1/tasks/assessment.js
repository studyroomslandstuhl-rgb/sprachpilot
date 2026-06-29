function unusedVerbs(){
  const used=[...state.known,...state.unsure,...state.unknown,...state.active,...state.learned];
  return ALL_VERBS.map(x=>x.v).filter(v=>!used.includes(v));
}
function currentAssessmentVerb(){const list=unusedVerbs();return list.length?list[0]:null}
function startAssessment(){
  if(state.active.length>=20 && !packageExamPassed()){renderHome();return}
  const appNode=$("app"); if(appNode) appNode.classList.add("card");
  state.phase="assessment";state.revealed=false;state.assessmentStart=Date.now();saveState();renderAssessment();
}
function renderAssessment(){
  const v=currentAssessmentVerb();
  if(!v || state.active.length>=20){buildPracticePool();state.phase="home";const appNode=$("app"); if(appNode) appNode.classList.remove("card");saveState();renderHome();return}
  state.currentVerb=v;state.assessmentStart=Date.now();state.revealed=false;saveState();
  $("app").innerHTML=`<h2>Neue Verben einschätzen</h2><p class="small">Schreibe das deutsche Verb. Schnell + richtig = kann ich. Langsam oder mit Fehler = unsicher. Lösung zeigen oder „Ich weiß es nicht“ = kann ich nicht.</p><div class="assessment-box"><div class="assessment-card"><div class="small">Muttersprache: ${safeText(nativeLang())}</div><div class="native-word">${safeText(nativeWord(v))}</div><div class="assessment-timer">⏱ Ziel: unter ${ASSESSMENT_FAST_SECONDS} Sekunden</div></div><input id="assessmentInput" autocomplete="off" placeholder="Deutsches Verb schreiben …" onkeydown="if(event.key==='Enter')checkAssessmentAnswer()"><div id="assessmentFeedback"></div><button class="success" onclick="checkAssessmentAnswer()">Prüfen</button><button class="warning" onclick="revealAssessmentVerb()">Karte umdrehen / Lösung zeigen</button><button class="danger" onclick="markAssessment('unknown')">Ich weiß es nicht</button></div><p class="small">Aktiver Block: ${state.active.length}/20 · Schon eingeschätzt: ${state.known.length+state.unsure.length+state.unknown.length}</p>`;
  setTimeout(()=>$('assessmentInput')?.focus(),50);
}
function addUnique(arr,v){if(!arr.includes(v))arr.push(v)}
function removeFromAll(v){[state.known,state.unsure,state.unknown,state.active].forEach(a=>{const i=a.indexOf(v);if(i>=0)a.splice(i,1)})}
function markAssessment(level){
  const v=state.currentVerb||currentAssessmentVerb();if(!v)return;
  removeFromAll(v);
  if(level==="known")addUnique(state.known,v);
  if(level==="unsure")addUnique(state.unsure,v);
  if(level==="unknown")addUnique(state.unknown,v);
  addUnique(state.active,v);
  ensureSkillState(v);
  if(state.active.length>=20||unusedVerbs().length===0){buildPracticePool();state.phase="home";saveState();renderHome();return}
  saveState();renderAssessment();
}
function checkAssessmentAnswer(){
  const v=state.currentVerb;const input=$("assessmentInput");const answer=input?input.value:"";const seconds=(Date.now()-(state.assessmentStart||Date.now()))/1000;const correct=clean(answer)===clean(v);
  if(correct&&!state.revealed&&seconds<=ASSESSMENT_FAST_SECONDS){$("assessmentFeedback").innerHTML=`<div class="ok">Richtig und schnell (${seconds.toFixed(1)} s). Das Verb kommt in den aktiven 20er-Block.</div>`;setTimeout(()=>markAssessment("known"),450)}
  else if(correct){$("assessmentFeedback").innerHTML=`<div class="helped">Richtig, aber langsam oder mit Hilfe (${seconds.toFixed(1)} s). Das Verb kommt als unsicher in den aktiven 20er-Block.</div>`;setTimeout(()=>markAssessment("unsure"),650)}
  else{$("assessmentFeedback").innerHTML=`<div class="helped">Noch nicht richtig. Das Verb kommt als unsicher in den aktiven 20er-Block.</div>`;setTimeout(()=>markAssessment("unsure"),650)}
}
function revealAssessmentVerb(){state.revealed=true;saveState();$("assessmentFeedback").innerHTML=`<div class="reveal-card"><div class="small">Deutsch</div><div class="german-word">${safeText(state.currentVerb)}</div><p>Dieses Verb wird als <strong>kann ich nicht</strong> markiert.</p><button class="danger" onclick="markAssessment('unknown')">Weiter</button></div>`}
