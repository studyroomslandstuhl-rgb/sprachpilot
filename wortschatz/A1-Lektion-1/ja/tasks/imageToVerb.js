import { isCorrect, shuffle, safeText } from "../../shared/normalize.js";
import { imagePath } from "../../shared/images.js";
export function renderImageToVerb(ctx){
  const v = ctx.nextPracticeVerb("imageToVerb");
  const options = shuffle([v, ...shuffle(ctx.progress.activeVerbs.filter(x=>x!==v)).slice(0,3)]);
  ctx.app.innerHTML = `<h2>Bild → Verb</h2><img class="img" src="${imagePath(v)}" onerror="this.style.display='none'">
    <div class="grid">${options.map(o=>`<button data-v="${o}">${safeText(o)}</button>`).join("")}</div>`;
  ctx.app.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>ctx.finishTask(v,"imageToVerb",b.dataset.v===v));
}
