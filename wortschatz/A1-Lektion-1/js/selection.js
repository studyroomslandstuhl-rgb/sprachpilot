import { isCorrect, safeText } from "../shared/normalize.js";
import { imagePath } from "../shared/images.js";

export function renderSelection({app, verbs, translations, lang, progress, onChange, onDone}){
  const already = new Set([...progress.known, ...progress.unsure, ...progress.unknown]);
  const next = progress.activeVerbs.find(v => !already.has(v));
  if(!next){ onDone(); return; }

  const native = translations?.[lang]?.[next] || translations?.Englisch?.[next] || next;
  let flipped = false;

  app.innerHTML = `
    <h2>Verb einschätzen</h2>
    <p class="small">Kennst du das Verb? Schreib es auf Deutsch, ohne die Karte umzudrehen.</p>
    <div class="study" id="studyCard">
      <img class="img" src="${imagePath(next)}" onerror="this.style.display='none'">
      <div class="small">${safeText(lang)}</div>
      <div class="native">${safeText(native)}</div>
      <button class="secondary" id="flipBtn">Karte umdrehen</button>
      <div id="backSide" style="display:none">
        <div class="small">Deutsch</div>
        <div class="german">${safeText(next)}</div>
      </div>
    </div>
    <input id="answer" placeholder="Deutsches Verb schreiben">
    <button class="success" id="checkBtn">Überprüfen</button>
    <button id="dontKnowBtn">Ich weiß es nicht</button>
    <div id="feedback"></div>
  `;

  app.querySelector("#flipBtn").onclick = () => {
    flipped = true;
    app.querySelector("#backSide").style.display = "block";
    progress.unsure.push(next);
    progress.seenAssignedVerbs = [...new Set([...(progress.seenAssignedVerbs||[]), next])];
    onChange(progress);
  };

  app.querySelector("#dontKnowBtn").onclick = () => {
    progress.unknown.push(next);
    progress.seenAssignedVerbs = [...new Set([...(progress.seenAssignedVerbs||[]), next])];
    onChange(progress);
  };

  app.querySelector("#checkBtn").onclick = () => {
    const answer = app.querySelector("#answer").value;
    if(!flipped && isCorrect(answer,next)){
      progress.known.push(next);
    }else{
      progress.unknown.push(next);
    }
    progress.seenAssignedVerbs = [...new Set([...(progress.seenAssignedVerbs||[]), next])];
    onChange(progress);
  };
}
