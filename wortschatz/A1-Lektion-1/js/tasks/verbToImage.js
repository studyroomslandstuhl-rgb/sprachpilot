import { isCorrect, shuffle, safeText } from "../../shared/normalize.js";
import { imagePath } from "../../shared/images.js";
export function renderVerbToImage(ctx){
  const v = ctx.nextPracticeVerb("verbToImage");
  const options = shuffle([v, ...shuffle(ctx.progress.activeVerbs.filter(x=>x!==v)).slice(0,3)]);
  ctx.app.innerHTML = `<h2>Verb → Bild</h2><h3>${safeText(v)}</h3>
    <div class="grid">${options.map(o=>`<button class="verb-card" data-v="${o}"><img class="img" src="${imagePath(o)}" onerror="this.style.display='none'"></button>`).join("")}</div>`;
  ctx.app.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>ctx.finishTask(v,"verbToImage",b.dataset.v===v));
}
