import { isCorrect, safeText } from "../../shared/normalize.js";
export function renderHearWrite(ctx){
  const v = ctx.nextPracticeVerb("hearWrite");
  ctx.app.innerHTML = `<h2>Hören → Schreiben</h2><button id="play">Verb hören</button><input id="answer" placeholder="Verb schreiben"><button class="success" id="check">Prüfen</button>`;
  ctx.app.querySelector("#play").onclick=()=>{const u=new SpeechSynthesisUtterance(v);u.lang="de-DE";speechSynthesis.speak(u);};
  ctx.app.querySelector("#check").onclick=()=>ctx.finishTask(v,"hearWrite",isCorrect(ctx.app.querySelector("#answer").value,v));
}
