import { isCorrect, shuffle, safeText } from "../../shared/normalize.js";
import { imagePath } from "../../shared/images.js";
export function renderFlashcards(ctx){
  const pool = ctx.progress.activeVerbs.filter(v => !ctx.progress.known.includes(v));
  const v = pool[0] || ctx.progress.activeVerbs[0];
  const native = ctx.translations?.[ctx.lang]?.[v] || ctx.translations?.Englisch?.[v] || v;
  ctx.app.innerHTML = `
    <h2>Karteikarten</h2>
    <div class="study">
      <img class="img" src="${imagePath(v)}" onerror="this.style.display='none'">
      <div class="native">${safeText(native)}</div>
      <input id="answer" placeholder="Deutsches Verb">
      <button class="success" id="check">Prüfen</button>
    </div><div id="feedback"></div>`;
  ctx.app.querySelector("#check").onclick=()=>{
    const good = isCorrect(ctx.app.querySelector("#answer").value,v);
    ctx.finishTask(v,"flashcards",good);
  };
}
