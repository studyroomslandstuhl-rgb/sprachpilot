function imageSpeak(){
  rememberPhase("bild_sprechen");
  const v=nextFromTaskQueue("bild_sprechen");if(!v){renderHome();return}
  ensureAttempt("bild_sprechen",v);
  $("app").innerHTML=`<h2>Bild → Sprechen</h2>${taskProgressHtml("bild_sprechen","Bild → Sprechen")}${imageBox(v)}<p class="small">Sage das Verb. Wenn das Mikro nicht geht, schreibe es.</p><div class="actions"><button class="success mic-btn" onclick="startVerbMic('imageSpeakInput',()=>checkImageSpeak('${safeText(v)}'))">🎤 Sprechen</button><button class="secondary" onclick="showFallbackInput('imageSpeakInput')">Ich kann nicht sprechen</button></div><input id="imageSpeakInput" class="hidden" placeholder="Verb schreiben"><button class="success hidden" id="speakCheck" onclick="checkImageSpeak('${safeText(v)}')">Kontrollieren</button><div id="micStatus" class="small"></div><div id="fb"></div>`;
  renderAndHydrate()
}
function checkImageSpeak(v){
  const good=clean($("imageSpeakInput").value)===clean(v);
  if(good){handleCorrectAnswer("bild_sprechen",v,imageSpeak,800,"fb")}
  else{handleWrongAnswer("bild_sprechen",v,v,"Verb zum Bild","fb")}
}
