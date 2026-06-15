import { isCorrect, shuffle, safeText } from "../../shared/normalize.js";
import { imagePath } from "../../shared/images.js";
export function renderSentencePuzzle(ctx){
  const v = ctx.nextPracticeVerb("sentencePuzzle");
  const sentence = ctx.sentences[v] || `Ich übe das Verb ${v}.`;
  const words = sentence.replace(/[.?!]/g,"").split(/\s+/);
  let answer = [];
  ctx.app.innerHTML = `<h2>Satz-Puzzle</h2><p class="small">Baue den Satz.</p>
    <div id="answer" class="answer-bank"></div>
    <div id="bank" class="word-bank">${shuffle(words).map(w=>`<span class="chip">${safeText(w)}</span>`).join("")}</div>
    <button class="success" id="check">Prüfen</button>`;
  ctx.app.querySelectorAll(".chip").forEach(chip=>chip.onclick=()=>{answer.push(chip.textContent); chip.remove(); ctx.app.querySelector("#answer").innerHTML=answer.map(w=>`<span class="chip">${safeText(w)}</span>`).join("");});
  ctx.app.querySelector("#check").onclick=()=>ctx.finishTask(v,"sentencePuzzle",answer.join(" ")===words.join(" "));
}
