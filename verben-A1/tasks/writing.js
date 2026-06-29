function writeVerb(){
  rememberPhase("schreiben");
  const v=nextFromTaskQueue("schreiben");if(!v){renderHome();return}
  ensureAttempt("schreiben",v);
  $("app").innerHTML=`<h2>Schreiben</h2>${taskProgressHtml("schreiben","Schreiben")}${imageBox(v)}<div class="native-word">${safeText(nativeWord(v))}</div><input id="writeInput" placeholder="deutsches Verb"><button class="success" onclick="checkWriteVerb('${safeText(v)}')">Kontrollieren</button><div id="fb"></div>`;
  renderAndHydrate();setTimeout(()=>$('writeInput')?.focus(),50)
}
function checkWriteVerb(v){
  const good=clean($("writeInput").value)===clean(v);
  if(good){handleCorrectAnswer("schreiben",v,writeVerb,800,"fb")}
  else{handleWrongAnswer("schreiben",v,v,"Schreibweise des Verbs","fb")}
}
