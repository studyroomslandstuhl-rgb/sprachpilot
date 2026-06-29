function flashcards(){
  rememberPhase("karteikarte");
  const v=nextFromTaskQueue("karteikarte");if(!v){renderHome();return}
  state.currentVerb=v;ensureAttempt("karteikarte",v);saveState();
  $("app").innerHTML=`<h2>Karteikarten</h2>${taskProgressHtml("karteikarte","Karteikarten")}<div class="assessment-card flash-card-standard"><div class="small">${safeText(nativeLang())}</div><div class="native-word">${safeText(nativeWord(v))}</div>${imageBox(v)}<p class="small">Sage das deutsche Verb.</p><div class="actions"><button class="success mic-btn" onclick="startVerbMic('flashInput',()=>checkFlashAnswer('${safeText(v)}'))">🎤 Sprechen</button><button class="secondary" onclick="showFlashWrite()">Ich kann nicht sprechen</button><button class="warning" onclick="showFlashAnswer('${safeText(v)}')">Karte umdrehen</button></div><input id="flashInput" class="hidden" placeholder="Verb schreiben"><button id="flashCheck" class="success hidden" onclick="checkFlashAnswer('${safeText(v)}')">Kontrollieren</button><div id="micStatus" class="small"></div><div id="flashAnswer"></div><div id="fb"></div></div>`;
  renderAndHydrate();
}
function showFlashWrite(){const input=$("flashInput");if(input)input.classList.remove("hidden");const btn=$("flashCheck");if(btn)btn.classList.remove("hidden");setTimeout(()=>input?.focus(),50)}
function showFlashAnswer(v){
  markHelped("karteikarte",v);showFlashWrite();
  $("flashAnswer").innerHTML=`<div class="reveal-card"><div class="small">Deutsch</div><div class="german-word">${safeText(v)}</div><p class="small">Schreibe das Verb selbst. Die Lösung wird nicht automatisch eingetragen.</p></div>`;
}
function checkFlashAnswer(v){
  showFlashWrite();
  const ok=clean($("flashInput").value)===clean(v);
  if(ok){handleCorrectAnswer("karteikarte",v,flashcards,700,"fb")}
  else{handleWrongAnswer("karteikarte",v,v,"Schreibweise des Verbs","fb")}
}
