export function renderHearSpeak(ctx){
  const v = ctx.nextPracticeVerb("hearSpeak");
  ctx.app.innerHTML = `<h2>Hören → Sprechen</h2><button id="play">Verb hören</button><button class="success" id="done">Ich habe gesprochen</button><p class="small">Mikrofonprüfung kann später hier vertieft werden.</p>`;
  ctx.app.querySelector("#play").onclick=()=>{const u=new SpeechSynthesisUtterance(v);u.lang="de-DE";speechSynthesis.speak(u);};
  ctx.app.querySelector("#done").onclick=()=>ctx.finishTask(v,"hearSpeak",true);
}
