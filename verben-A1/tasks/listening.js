function speakTextVerb(t,slow=false){
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(t||""));
    u.lang="de-DE";u.rate=slow?0.38:0.98;u.pitch=1;u.volume=1;
    const voices=speechSynthesis.getVoices? speechSynthesis.getVoices():[];
    const de=voices.find(v=>v.lang==="de-DE"&&/google|microsoft|anna|katja|deutsch|german/i.test(v.name||""))||voices.find(v=>v.lang==="de-DE")||voices.find(v=>String(v.lang||"").startsWith("de"));
    if(de)u.voice=de;
    speechSynthesis.speak(u)
  }catch(e){alert("Hören wird auf diesem Gerät nicht unterstützt.")}
}
function hearWrite(){
  rememberPhase("hoeren_schreiben");
  const v=nextFromTaskQueue("hoeren_schreiben");if(!v){renderHome();return}
  ensureAttempt("hoeren_schreiben",v);
  $("app").innerHTML=`<h2>Hören → Schreiben</h2>${taskProgressHtml("hoeren_schreiben","Hören → Schreiben")}<div class="actions"><button onclick="speakTextVerb('${safeText(v)}')">🔊 Hören</button><button class="secondary" onclick="speakTextVerb('${safeText(v)}',true)">🐢 Langsam</button></div><input id="hearInput" placeholder="Verb schreiben"><button class="success" onclick="checkHearWrite('${safeText(v)}')">Kontrollieren</button><div id="fb"></div>`;
}
function checkHearWrite(v){
  const good=clean($("hearInput").value)===clean(v);
  if(good){handleCorrectAnswer("hoeren_schreiben",v,hearWrite,800,"fb")}
  else{handleWrongAnswer("hoeren_schreiben",v,v,"gehörtes Verb und Schreibweise","fb")}
}
function hearSpeak(){
  rememberPhase("hoeren_sprechen");
  const v=nextFromTaskQueue("hoeren_sprechen");if(!v){renderHome();return}
  ensureAttempt("hoeren_sprechen",v);
  $("app").innerHTML=`<h2>Hören → Sprechen</h2>${taskProgressHtml("hoeren_sprechen","Hören → Sprechen")}<div class="actions"><button onclick="speakTextVerb('${safeText(v)}')">🔊 Hören</button><button class="secondary" onclick="speakTextVerb('${safeText(v)}',true)">🐢 Langsam</button></div><p class="small">Sprich das Verb. Wenn das Mikro nicht geht, schreibe es.</p><div class="actions"><button class="success mic-btn" onclick="startVerbMic('speakFallback',()=>checkHearSpeak('${safeText(v)}'))">🎤 Sprechen</button><button class="secondary" onclick="showFallbackInput('speakFallback')">Ich kann nicht sprechen</button></div><input id="speakFallback" class="hidden" placeholder="Falls Mikro nicht geht: Verb schreiben"><button class="success hidden" id="speakCheck" onclick="checkHearSpeak('${safeText(v)}')">Kontrollieren</button><div id="micStatus" class="small"></div><div id="fb"></div>`;
}
function showFallbackInput(id){const input=$(id);if(input)input.classList.remove("hidden");const btn=$("speakCheck")||$("flashCheck");if(btn)btn.classList.remove("hidden");setTimeout(()=>input?.focus(),50)}
function startVerbMic(inputId,onDone){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){showFallbackInput(inputId);if($("micStatus"))$("micStatus").innerHTML="Mikro nicht verfügbar. Bitte schreiben.";return}
  const rec=new SpeechRecognition();rec.lang="de-DE";rec.interimResults=false;rec.maxAlternatives=1;
  if($("micStatus"))$("micStatus").innerHTML="Ich höre …";
  rec.onresult=e=>{const txt=e.results[0][0].transcript||"";const input=$(inputId);if(input){input.classList.remove("hidden");input.value=txt}const btn=$("speakCheck")||$("flashCheck");if(btn)btn.classList.remove("hidden");if($("micStatus"))$("micStatus").innerHTML="Erkannt: "+safeText(txt);if(typeof onDone==="function")setTimeout(onDone,250)};
  rec.onerror=()=>{showFallbackInput(inputId);if($("micStatus"))$("micStatus").innerHTML="Mikrofehler. Bitte schreiben."};
  rec.onend=()=>{};rec.start();
}
function checkHearSpeak(v){
  const good=clean($("speakFallback").value)===clean(v);
  if(good){handleCorrectAnswer("hoeren_sprechen",v,hearSpeak,800,"fb")}
  else{handleWrongAnswer("hoeren_sprechen",v,v,"Aussprache oder Schreibweise des Verbs","fb")}
}
