function writeVerb(){
  rememberPhase("schreiben");
  const v=nextFromTaskQueue("schreiben");if(!v){renderHome();return}
  $("app").innerHTML=`<h2>Schreiben</h2>${taskProgressHtml("schreiben","Schreiben")}${imageBox(v)}<div class="native-word">${safeText(nativeWord(v))}</div><input id="writeInput" placeholder="deutsches Verb" onkeydown="if(event.key==='Enter')checkWriteVerb('${safeText(v)}')"><button class="success" onclick="checkWriteVerb('${safeText(v)}')">Kontrollieren</button><div id="fb"></div>`;
  renderAndHydrate();setTimeout(()=>$("writeInput")?.focus(),50)
}
function checkWriteVerb(v){
  if(clean($("writeInput").value)===clean(v)){finishAfterCorrect("schreiben",v,writeVerb)}
  else{taskWrong("schreiben",v,"das deutsche Verb")}
}
