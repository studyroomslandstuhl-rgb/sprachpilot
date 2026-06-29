function flashcards(){
  rememberPhase("karteikarte");
  const v=nextFromTaskQueue("karteikarte");if(!v){renderHome();return}
  state.currentVerb=v;saveState();
  $("app").innerHTML=`<h2>Karteikarten</h2>${taskProgressHtml("karteikarte","Karteikarten")}<div class="assessment-card"><div class="small">${safeText(nativeLang())}</div><div class="native-word">${safeText(nativeWord(v))}</div>${imageBox(v)}<p class="small">Sage das deutsche Verb.</p><div class="actions"><button class="success mic-btn" onclick="startVerbMic('flashInput',()=>checkFlashAnswer('${safeText(v)}'))">🎤 Sprechen</button><button class="secondary" onclick="showFlashInput()">Ich kann nicht sprechen</button><button class="secondary" onclick="showFlashSolution('${safeText(v)}')">Karte umdrehen</button></div><input id="flashInput" class="hidden" placeholder="Schreiben Sie die Antwort hier"><button id="flashCheck" class="success hidden" onclick="checkFlashAnswer('${safeText(v)}')">Kontrollieren</button><div id="micStatus" class="small"></div><div id="fb"></div><div id="flashSolution"></div></div>`;
  renderAndHydrate();
}
function showFlashInput(){
  const input=$("flashInput"); if(input)input.classList.remove("hidden");
  const btn=$("flashCheck"); if(btn)btn.classList.remove("hidden");
  setTimeout(()=>input?.focus(),50);
}
function showFlashSolution(v){
  if(state.currentTask){state.currentTask.hadWrong=true;state.currentTask.tries=Math.max(state.currentTask.tries||0,3)}
  $("flashSolution").innerHTML=`<div class="helped"><div class="small">Lösung</div><div class="german-word">${safeText(v)}</div><p>Schreibe das Verb jetzt selbst. Die Lösung wird nicht automatisch eingetragen.</p></div>`;
  showFlashInput();saveState();
}
function checkFlashAnswer(v){
  showFlashInput();
  const good=clean($("flashInput").value)===clean(v);
  if(good){finishAfterCorrect("karteikarte",v,flashcards)}
  else{taskWrong("karteikarte",v,"das deutsche Verb")}
}
