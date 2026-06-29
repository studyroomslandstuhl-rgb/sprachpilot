let puzzleTarget="";
function sentencePuzzle(){
  rememberPhase("satz_puzzle");
  const v=nextFromTaskQueue("satz_puzzle");if(!v){renderHome();return}
  ensureAttempt("satz_puzzle",v);
  puzzleTarget=sentenceForVerb(v);const words=shuffle(puzzleTarget.replace(/[.!?]/g,"").split(/\s+/));
  $("app").innerHTML=`<h2>Satz-Puzzle</h2>${taskProgressHtml("satz_puzzle","Satz-Puzzle")}${imageBox(v)}<p class="small">Höre den Satz und baue ihn.</p><button class="secondary" onclick="speakTextVerb(puzzleTarget)">🔊 Satz hören</button><div id="puzzleAnswer" class="puzzle-answer"></div><div id="puzzleBank" class="puzzle-bank">${words.map(w=>`<button class="word-chip" onclick="movePuzzleWord(this)">${safeText(w)}</button>`).join("")}</div><button class="success" onclick="checkPuzzle('${safeText(v)}')">Kontrollieren</button><button class="secondary" onclick="resetPuzzleWords()">Neu mischen</button><div id="fb"></div>`;
  renderAndHydrate();
}
function movePuzzleWord(btn){btn.classList.toggle("answer");const target=btn.parentElement.id==="puzzleBank"?$("puzzleAnswer"):$("puzzleBank");target.appendChild(btn)}
function resetPuzzleWords(){const v=state.currentTask&&state.currentTask.v;if(!v)return;const words=shuffle(puzzleTarget.replace(/[.!?]/g,"").split(/\s+/));$("puzzleAnswer").innerHTML="";$("puzzleBank").innerHTML=words.map(w=>`<button class="word-chip" onclick="movePuzzleWord(this)">${safeText(w)}</button>`).join("")}
function checkPuzzle(v){
  const answer=[...$("puzzleAnswer").querySelectorAll("button")].map(b=>b.textContent).join(" ");const good=clean(answer)===clean(puzzleTarget);
  if(good){handleCorrectAnswer("satz_puzzle",v,sentencePuzzle,900,"fb")}
  else{handleWrongAnswer("satz_puzzle",v,puzzleTarget,"Wortreihenfolge im Satz","fb")}
}
