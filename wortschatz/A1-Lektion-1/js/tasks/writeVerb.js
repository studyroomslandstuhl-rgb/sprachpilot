import { isCorrect, shuffle, safeText } from "../../shared/normalize.js";
import { imagePath } from "../../shared/images.js";
export function renderWriteVerb(ctx){
  const v = ctx.nextPracticeVerb("writeVerb");
  ctx.app.innerHTML = `
    <h2>Schreiben</h2>
    <img class="img" src="${imagePath(v)}" onerror="this.style.display='none'">
    <input id="answer" placeholder="Verb schreiben">
    <button class="success" id="check">Prüfen</button>`;
  ctx.app.querySelector("#check").onclick=()=>{
    ctx.finishTask(v,"writeVerb",isCorrect(ctx.app.querySelector("#answer").value,v));
  };
}
