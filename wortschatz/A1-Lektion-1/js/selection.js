import { isCorrect, safeText } from "../shared/normalize.js";
import { imagePath } from "../shared/images.js";

export function renderSelection({app, verbs, translations, lang, progress, onChange, onDone}){
  const already = new Set([...progress.known, ...progress.unsure, ...progress.unknown]);
  const next = progress.activeVerbs.find(v => !already.has(v));
  if(!next){ onDone(); return; }

  const native = translations?.[lang]?.[next] || translations?.Englisch?.[next] || next;
  let flipped = false;
  let rated = false;

  function finish(level, message){
    if(rated) return;
    rated = true;

    progress.known = progress.known.filter(x => x !== next);
    progress.unsure = progress.unsure.filter(x => x !== next);
    progress.unknown = progress.unknown.filter(x => x !== next);

    if(level === "known") progress.known.push(next);
    if(level === "unsure") progress.unsure.push(next);
    if(level === "unknown") progress.unknown.push(next);

    progress.seenAssignedVerbs = [...new Set([...(progress.seenAssignedVerbs||[]), next])];

    const feedback = app.querySelector("#feedback");
    feedback.innerHTML = `${message}<button class="success" id="nextBtn">Weiter</button>`;
    app.querySelector("#nextBtn").onclick = () => onChange(progress);
  }

  app.innerHTML = `
    <h2>Verb einschätzen</h2>
    <p class="small">Kennst du das Verb? Schreib es auf Deutsch, ohne die Karte umzudrehen.</p>

    <div class="study" id="studyCard">
      <img class="img" src="${imagePath(next)}" onerror="this.style.display='none'">

      <div id="frontSide">
        <div class="small">${safeText(lang)}</div>
        <div class="native">${safeText(native)}</div>
      </div>

      <div id="backSide" style="display:none">
        <div class="small">Deutsch</div>
        <div class="german">${safeText(next)}</div>
      </div>
    </div>

    <input id="answer" placeholder="Deutsches Verb schreiben">

    <button class="success" id="checkBtn">Kontrollieren</button>
    <button class="secondary" id="flipBtn">Karte umdrehen</button>
    <button id="dontKnowBtn">Ich weiß es nicht</button>

    <div id="feedback"></div>
  `;

  app.querySelector("#flipBtn").onclick = () => {
    if(rated) return;
    flipped = true;
    app.querySelector("#backSide").style.display = "block";
    finish("unsure", `<div class="info">Dieses Verb kommt in die Übung.</div>`);
  };

  app.querySelector("#dontKnowBtn").onclick = () => {
    finish("unknown", `<div class="no">Dieses Verb kommt in die Übung.<br>Richtig: <strong>${safeText(next)}</strong></div>`);
  };

  app.querySelector("#checkBtn").onclick = () => {
    if(rated) return;
    const answer = app.querySelector("#answer").value;
    if(!flipped && isCorrect(answer,next)){
      finish("known", `<div class="ok">Richtig. Dieses Verb gilt als bekannt.</div>`);
    }else{
      app.querySelector("#backSide").style.display = "block";
      finish("unknown", `<div class="no">Dieses Verb kommt in die Übung.<br>Richtig: <strong>${safeText(next)}</strong></div>`);
    }
  };
}
