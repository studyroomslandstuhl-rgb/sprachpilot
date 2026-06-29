function quiz(){
  rememberPhase("bild_verb");
  const v=nextFromTaskQueue("bild_verb");if(!v){renderHome();return}
  const options=verbOptions(v,4);
  $("app").innerHTML=`<h2>Bild → Verb</h2>${taskProgressHtml("bild_verb","Bild → Verb")}${imageBox(v)}<div class="quiz-options text-options">${options.map(o=>`<button class="quiz-option" onclick="checkImageToVerb('${safeText(v)}','${safeText(o)}')">${safeText(o)}</button>`).join("")}</div><div id="fb"></div>`;
  renderAndHydrate()
}
function checkImageToVerb(v,o){
  if(v===o){finishAfterCorrect("bild_verb",v,quiz)}
  else{taskWrong("bild_verb",v,"Bild und Verb")}
}
