function quiz(){
  rememberPhase("bild_verb");
  const v=nextFromTaskQueue("bild_verb");if(!v){renderHome();return}
  const options=shuffle([v,...shuffle(ALL_VERBS.map(x=>x.v).filter(x=>x!==v)).slice(0,3)]);
  $("app").innerHTML=`<h2>Bild → Verb</h2>${taskProgressHtml("bild_verb","Bild → Verb")}${imageBox(v)}<div class="quiz-options text-options">${options.map(o=>`<button class="quiz-option" onclick="checkImageToVerb('${safeText(v)}','${safeText(o)}')">${safeText(o)}</button>`).join("")}</div><div id="fb"></div>`;
  renderAndHydrate()
}
function checkImageToVerb(v,o){const good=v===o;$("fb").innerHTML=good?"<div class='ok'>Richtig.</div>":`<div class='no'>Falsch. Richtig ist: <strong>${safeText(v)}</strong></div>`;addEncounter(v,"bild_verb",good);finishQueuedVerb("bild_verb",v,good);setTimeout(quiz,700)}
