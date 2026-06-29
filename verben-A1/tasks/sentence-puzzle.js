let puzzleTarget="";
function sentencePuzzle(){
  rememberPhase("satz_puzzle");
  const v=nextFromTaskQueue("satz_puzzle");if(!v){renderHome();return}
  puzzleTarget=sentenceForVerb(v);const words=shuffle(puzzleTarget.replace(/[.!?]/g,"").split(/\s+/));
  $("app").innerHTML=`<h2>Satz-Puzzle</h2>${taskProgressHtml("satz_puzzle","Satz-Puzzle")}${imageBox(v)}<p class="small">Höre den Satz und baue ihn.</p><button class="secondary" onclick="speakTextVerb(puzzleTarget)">🔊 Satz hören</button><div id="puzzleAnswer" class="puzzle-answer"></div><div id="puzzleBank" class="puzzle-bank">${words.map(w=>`<button class="word-chip" onclick="movePuzzleWord(this)">${safeText(w)}</button>`).join("")}</div><button class="success" onclick="checkPuzzle('${safeText(v)}')">Kontrollieren</button><button class="secondary" onclick="remixPuzzle()">Neu mischen</button><div id="fb"></div>`;
  renderAndHydrate();
}
function remixPuzzle(){
  const bank=$("puzzleBank"), answer=$("puzzleAnswer");
  if(!bank||!answer)return;
  [...answer.querySelectorAll("button")].forEach(b=>{b.classList.remove("answer");bank.appendChild(b)});
  [...bank.querySelectorAll("button")].sort(()=>Math.random()-.5).forEach(b=>bank.appendChild(b));
}
function movePuzzleWord(btn){btn.classList.toggle("answer");const target=btn.parentElement.id==="puzzleBank"?$("puzzleAnswer"):$("puzzleBank");target.appendChild(btn)}
function checkPuzzle(v){
  const answer=[...$("puzzleAnswer").querySelectorAll("button")].map(b=>b.textContent).join(" ");
  if(clean(answer)===clean(puzzleTarget)){finishAfterCorrect("satz_puzzle",v,sentencePuzzle)}
  else{taskWrong("satz_puzzle",puzzleTarget,"Wortreihenfolge")}
}
