function buildVerbExamItems(){
  const verbs=shuffle(state.active||[]);
  const items=[];
  verbs.slice(0,4).forEach(v=>items.push({type:"image_write",v,tries:0,hadWrong:false}));
  verbs.slice(4,7).forEach(v=>items.push({type:"listen_write",v,tries:0,hadWrong:false}));
  verbs.slice(7,12).forEach(v=>items.push({type:"conjugate",v,subj:shuffle(CONJ_SUBJECTS)[0],tries:0,hadWrong:false}));
  verbs.slice(12,15).forEach(v=>items.push({type:"sentence_write",v,sentence:sentenceForVerb(v),tries:0,hadWrong:false}));
  return shuffle(items).slice(0,12);
}
function startVerbExam(){
  if(!allPracticeTasksDone()){$("app").innerHTML=`<h2>Prüfung gesperrt</h2><div class="no">Mache zuerst alle Aufgaben auf 100%.</div><button class="secondary" onclick="renderHome()">Zur Übersicht</button>`;return}
  rememberPhase("pruefung");
  state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:buildVerbExamItems()};
  saveState();renderVerbExam();
}
function resumeVerbExam(){if(state.exam&&state.exam.items&&state.exam.items.length&&state.exam.current<state.exam.items.length)renderVerbExam();else renderVerbExamResult()}
function renderVerbExam(){
  state.phase="pruefung";saveState();
  const ex=state.exam;const item=ex.items[ex.current];
  if(!item){renderVerbExamResult();return}
  let body="";
  if(item.type==="image_write")body=`${imageBox(item.v)}<p class="small">Schreibe das Verb.</p><input id="examInput" placeholder="Verb schreiben" onkeydown="if(event.key==='Enter')checkVerbExamAnswer()">`;
  if(item.type==="listen_write")body=`<p class="small">Höre und schreibe das Verb.</p><div class="actions"><button class="secondary" onclick="speakTextVerb('${safeText(item.v)}')">🔊 Hören</button><button class="secondary" onclick="speakTextVerb('${safeText(item.v)}',true)">🐢 Langsam</button></div><input id="examInput" placeholder="Verb schreiben" onkeydown="if(event.key==='Enter')checkVerbExamAnswer()">`;
  if(item.type==="conjugate")body=`${imageBox(item.v)}<p class="small">Schreibe die richtige Form.</p><div class="assessment-card"><div class="german-word sentence-gap">${safeText(conjugationSentence(item.v,item.subj))}</div></div><input id="examInput" placeholder="Verbform schreiben" onkeydown="if(event.key==='Enter')checkVerbExamAnswer()">`;
  if(item.type==="sentence_write")body=`${imageBox(item.v)}<p class="small">Höre den Satz und schreibe ihn.</p><button class="secondary" onclick="speakTextVerb('${safeText(item.sentence)}')">🔊 Satz hören</button><input id="examInput" placeholder="Satz schreiben" onkeydown="if(event.key==='Enter')checkVerbExamAnswer()">`;
  $("app").innerHTML=`<h2>Prüfung ⭐</h2><div class="task-progress"><div class="task-progress-title"><span>Aufgabe ${ex.current+1}/${ex.items.length} · ${Math.round(ex.current*100/ex.items.length)}%</span></div><div class="task-progress-line"><div class="task-progress-fill" style="width:${Math.round(ex.current*100/ex.items.length)}%"></div></div></div>${body}<button class="success" onclick="checkVerbExamAnswer()">Kontrollieren</button><div id="fb"></div>`;
  renderAndHydrate();setTimeout(()=>$("examInput")?.focus(),50);
}
function examSolution(item){
  if(item.type==="image_write"||item.type==="listen_write")return item.v;
  if(item.type==="conjugate")return conjugationSolution(item.v,item.subj);
  if(item.type==="sentence_write")return item.sentence;
  return item.v;
}
function checkVerbExamAnswer(){
  const ex=state.exam;const item=ex.items[ex.current];const sol=examSolution(item);const answer=$("examInput").value;
  const good=clean(answer)===clean(sol);
  if(!good){
    item.tries=(item.tries||0)+1;item.hadWrong=true;
    $("fb").innerHTML=`<div class="no">${safeText(feedbackForTry(item.tries,sol,"Form, Wort oder Satz"))}</div>`;
    saveState();return;
  }
  ex.answers.push({type:item.type,v:item.v,good:!item.hadWrong,answer,solution:sol});
  $("fb").innerHTML=item.hadWrong?"<div class='helped'>Richtig, aber mit Hilfe. In der Prüfung zählt diese Antwort als Fehler.</div>":"<div class='ok'>Richtig.</div>";
  ex.current+=1;saveState();setTimeout(renderVerbExam,700);
}
function starLine(n){return "⭐".repeat(n)+"☆".repeat(3-n)}
function renderVerbExamResult(){
  const ex=state.exam||{};const total=(ex.items||[]).length||1;const right=(ex.answers||[]).filter(a=>a.good).length;const score=Math.round(right*100/total);
  ex.score=score;ex.stars=score===100?3:score>=70?2:score>=50?1:0;ex.passed=score===100;state.exam=ex;state.phase="home";saveState();
  const stars=starLine(ex.stars);
  $("app").innerHTML=`<h2>Prüfung beendet</h2><div class="assessment-card"><div class="stars">${stars}</div><div class="german-word">${score}%</div><p>${right}/${total} richtig beim ersten Versuch.</p>${score===100?"<div class='ok'>100% erreicht. Du kannst jetzt neue Verben einschätzen.</div>":"<div class='no'>Für neue Verben brauchst du 100% in der Prüfung.</div>"}</div><div class="actions"><button class="success" onclick="startVerbExam()">Prüfung wiederholen</button><button class="secondary" onclick="renderHome()">Zur Übersicht</button>${score===100?"<button class='secondary' onclick='handleAssessmentClick()'>Neue Verben einschätzen</button>":""}</div>`;
}
