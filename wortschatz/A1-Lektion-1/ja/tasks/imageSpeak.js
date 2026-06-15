import { imagePath } from "../../shared/images.js";
export function renderImageSpeak(ctx){
  const v = ctx.nextPracticeVerb("imageSpeak");
  ctx.app.innerHTML = `<h2>Bild → Sprechen</h2><img class="img" src="${imagePath(v)}" onerror="this.style.display='none'"><button class="success" id="done">Ich habe gesprochen</button>`;
  ctx.app.querySelector("#done").onclick=()=>ctx.finishTask(v,"imageSpeak",true);
}
