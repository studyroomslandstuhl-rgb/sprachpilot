function buildVerbExamItems(){
  const verbs=shuffle(currentPracticeVerbs());
  const items=[];
  verbs.slice(0,4).forEach(v=>items.push({type:"image_write",v}));
  verbs.slice(4,7).forEach(v=>items.push({type:"listen_write",v}));
  verbs.slice(7,12).forEach(v=>items.push({type:"conjugate",v,subj:shuffle(CONJ_SUBJECTS)[0]}));
  verbs.slice(12,15).forEach(v=>items.push({type:"sentence_write",v,sentence:sentenceForVerb(v)}));
  return shuffle(items).slice(0,12);
}
function startVerbExam(){
  if(!allPracticeTasksDone()){$("app").innerHTML=`<h2>Prüfung gesperrt</h2><div class="no">Mache zuerst alle Aufgaben auf 100%.</div><button class="secondary" onclick="renderHome()">Zur Übersicht</button>`;return}
  rememberPhase("pruefung");
  state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:buildVerbExamItems(),currentTry:0,hadWrong:false};
  saveState();renderVerbExam();
}
function resumeVerbExam(){if(state.exam&&state.exam.items&&state.exam.items.length&&state.exam.current<state.exam.items.length)renderVerbExam();else renderVerbExamResult()}
function renderVerbExam(){
  state.phase="pruefung";saveState();
  const ex=state.exam;const item=ex.items[ex.current];
  if(!item){renderVerbExamResult();return}
  let body="";
  if(item.type==="image_write")body=`${imageBox(item.v)}<p class="small">Schreibe das Verb.</p><input id="examInput" placeholder="Verb schreiben">`;
  if(item.type==="listen_write")body=`<p class="small">Höre und schreibe das Verb.</p><button class="secondary" onclick="speakTextVerb('${safeText(item.v)}')">🔊 Hören</button><button class="secondary" onclick="speakTextVerb('${safeText(item.v)}',true)">🐢 Langsam</button><input id="examInput" placeholder="Verb schreiben">`;
  if(item.type==="conjugate")body=`${imageBox(item.v)}<p class="small">Schreibe die richtige Form.${isSeparableVerb(item.v)?" Das trennbare Verb hat zwei Lücken.":""}</p>${conjugationSubjectHint(item.subj)}<div class="assessment-card"><div class="german-word sentence-gap">${safeText(conjugationSentence(item.v,item.subj))}</div></div>${isSeparableVerb(item.v)?'<div class="answer-line conjugation-two-inputs"><input id="examInput" placeholder="Verbform"><input id="examPrefixInput" placeholder="Prefix"></div>':'<input id="examInput" placeholder="Verbform schreiben">'}`;
  if(item.type==="sentence_write")body=`${imageBox(item.v)}<p class="small">Höre den Satz und schreibe ihn.</p><button class="secondary" onclick="speakTextVerb('${safeText(item.sentence)}')">🔊 Satz hören</button><input id="examInput" placeholder="Satz schreiben">`;
  $("app").innerHTML=`<h2>Prüfung</h2><div class="task-progress"><div class="task-progress-title"><span>Aufgabe ${ex.current+1}/${ex.items.length}</span><span>${Math.round(ex.current*100/ex.items.length)}%</span></div><div class="task-progress-line"><div class="task-progress-fill" style="width:${Math.round(ex.current*100/ex.items.length)}%"></div></div></div>${body}<button class="success" onclick="checkVerbExamAnswer()">Kontrollieren</button><div id="fb"></div>`;
  renderAndHydrate();setTimeout(()=>$('examInput')?.focus(),50);
}
function examSolution(item){
  if(item.type==="image_write"||item.type==="listen_write")return item.v;
  if(item.type==="conjugate")return conjugationSolution(item.v,item.subj);
  if(item.type==="sentence_write")return item.sentence;
  return item.v;
}
function checkVerbExamAnswer(){
  const ex=state.exam;const item=ex.items[ex.current];const sol=examSolution(item);const answer=$("examInput").value;
  const good=item.type==="conjugate"?isConjugationAnswerCorrect(item.v,item.subj,answer,$("examPrefixInput")?.value||""):clean(answer)===clean(sol);
  ex.currentTry=Number(ex.currentTry||0);
  if(good){
    const firstTry=!ex.hadWrong;
    ex.answers.push({type:item.type,v:item.v,good:firstTry,answer,solution:sol});
    $("fb").innerHTML="<div class='ok'>Richtig.</div>";
    ex.current+=1;ex.currentTry=0;ex.hadWrong=false;saveState();setTimeout(renderVerbExam,600);return;
  }
  ex.currentTry+=1;ex.hadWrong=true;saveState();
  $("fb").innerHTML=`<div class='no'>${safeText(standardFeedback(ex.currentTry,sol,"Antwort und Schreibweise"))}</div>`;
}
function renderVerbExamResult(){
  const ex=state.exam||{};const total=(ex.items||[]).length||1;const right=(ex.answers||[]).filter(a=>a.good).length;const score=Math.round(right*100/total);
  ex.score=score;ex.stars=score===100?3:score>=70?2:score>=50?1:0;ex.passed=score===100;state.exam=ex;state.phase="home";saveState();
  const stars="⭐".repeat(ex.stars)+"☆".repeat(3-ex.stars);
  $("app").innerHTML=`<h2>Prüfung beendet</h2><div class="assessment-card"><div class="german-word">${score}%</div><div class="stars">${stars}</div><p>${right}/${total} richtig</p></div>${score===100?"<div class='ok'>Super. Jetzt kannst du neue Verben einschätzen.</div><button class='success' onclick='handleAssessmentClick()'>Neue Verben einschätzen</button>":"<div class='no'>Du brauchst 100%, damit neue Verben freigeschaltet werden.</div><button class='warning' onclick='startVerbExam()'>Prüfung wiederholen</button>"}<button class="secondary" onclick="renderHome()">Zur Übersicht</button>`;
}
