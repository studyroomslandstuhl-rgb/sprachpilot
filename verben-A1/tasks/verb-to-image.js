function verbToImage(){
  rememberPhase("verb_bild");
  const v=nextFromTaskQueue("verb_bild");if(!v){renderHome();return}
  const options=verbOptions(v,4);
  $("app").innerHTML=`<h2>Verb → Bild</h2>${taskProgressHtml("verb_bild","Verb → Bild")}<div class="german-word">${safeText(v)}</div><div class="quiz-options image-options">${options.map(o=>`<button class="quiz-option bild-option" onclick="checkVerbToImage('${safeText(v)}','${safeText(o)}')">${imageBox(o,true)}</button>`).join("")}</div><div id="fb"></div>`;
  renderAndHydrate()
}
function checkVerbToImage(v,o){
  if(v===o){finishAfterCorrect("verb_bild",v,verbToImage)}
  else{taskWrong("verb_bild",v,"Verb und Bild")}
}
