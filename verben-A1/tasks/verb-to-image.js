function verbToImage(){
  rememberPhase("verb_bild");
  const v=nextFromTaskQueue("verb_bild");if(!v){renderHome();return}
  ensureAttempt("verb_bild",v);
  const options=optionVerbs(v,4);
  $("app").innerHTML=`<h2>Verb → Bild</h2>${taskProgressHtml("verb_bild","Verb → Bild")}<div class="german-word">${safeText(v)}</div><div class="quiz-options image-options">${options.map(o=>`<button class="quiz-option bild-option" onclick="checkVerbToImage('${safeText(v)}','${safeText(o)}')">${imageBox(o,true)}</button>`).join("")}</div><div id="fb"></div>`;
  renderAndHydrate()
}
function checkVerbToImage(v,o){
  if(v===o){handleCorrectAnswer("verb_bild",v,verbToImage,700,"fb")}
  else{handleWrongAnswer("verb_bild",v,"das richtige Bild zu „"+v+"“" ,"das passende Bild","fb")}
}
