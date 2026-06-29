function speakTextVerb(t,slow=false){
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(t||""));
    u.lang="de-DE";u.rate=slow?0.45:0.92;u.pitch=1;u.volume=1;
    const voices=speechSynthesis.getVoices? speechSynthesis.getVoices():[];
    const de=voices.find(v=>v.lang==="de-DE")||voices.find(v=>String(v.lang||"").startsWith("de"));
    if(de)u.voice=de;
    speechSynthesis.speak(u)
  }catch(e){alert("Hören wird auf diesem Gerät nicht unterstützt.")}
}
function hearWrite(){
  rememberPhase("hoeren_schreiben");
  const v=nextFromTaskQueue("hoeren_schreiben");if(!v){renderHome();return}
  $("app").innerHTML=`<h2>Hören → Schreiben</h2>${taskProgressHtml("hoeren_schreiben","Hören → Schreiben")}<div class="actions"><button onclick="speakTextVerb('${safeText(v)}')">🔊 Hören</button><button class="secondary" onclick="speakTextVerb('${safeText(v)}',true)">🐢 Langsam</button></div><input id="hearInput" placeholder="Verb schreiben"><button class="success" onclick="checkHearWrite('${safeText(v)}')">Prüfen</button><div id="fb"></div>`;
}
function checkHearWrite(v){const good=clean($("hearInput").value)===clean(v);$("fb").innerHTML=good?"<div class='ok'>Richtig.</div>":`<div class='no'>Falsch. Richtig ist: <strong>${safeText(v)}</strong></div>`;addEncounter(v,"hoeren_schreiben",good);finishQueuedVerb("hoeren_schreiben",v,good);setTimeout(hearWrite,800)}
function hearSpeak(){
  rememberPhase("hoeren_sprechen");
  const v=nextFromTaskQueue("hoeren_sprechen");if(!v){renderHome();return}
  $("app").innerHTML=`<h2>Hören → Sprechen</h2>${taskProgressHtml("hoeren_sprechen","Hören → Sprechen")}<div class="actions"><button onclick="speakTextVerb('${safeText(v)}')">🔊 Hören</button><button class="secondary" onclick="speakTextVerb('${safeText(v)}',true)">🐢 Langsam</button></div><p class="small">Sprich das Verb. Wenn das Mikro nicht geht, schreibe es.</p><div class="actions"><button class="success mic-btn" onclick="startVerbMic('speakFallback',()=>checkHearSpeak('${safeText(v)}'))">🎤 Sprechen</button><button class="secondary" onclick="showFallbackInput('speakFallback')">Ich kann nicht sprechen</button></div><input id="speakFallback" class="hidden" placeholder="Falls Mikro nicht geht: Verb schreiben"><button class="success hidden" id="speakCheck" onclick="checkHearSpeak('${safeText(v)}')">Prüfen</button><div id="micStatus" class="small"></div><div id="fb"></div>`;
}
function showFallbackInput(id){const input=$(id);if(input)input.classList.remove("hidden");const btn=$("speakCheck");if(btn)btn.classList.remove("hidden");setTimeout(()=>input?.focus(),50)}
function startVerbMic(inputId,onDone){
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){showFallbackInput(inputId);$("micStatus").innerHTML="Mikro nicht verfügbar. Bitte schreiben.";return}
  const rec=new SpeechRecognition();rec.lang="de-DE";rec.interimResults=false;rec.maxAlternatives=1;
  $("micStatus").innerHTML="Ich höre …";
  rec.onresult=e=>{const txt=e.results[0][0].transcript||"";const input=$(inputId);if(input){input.classList.remove("hidden");input.value=txt}if($("speakCheck"))$("speakCheck").classList.remove("hidden");$("micStatus").innerHTML="Erkannt: "+safeText(txt);if(typeof onDone==="function")setTimeout(onDone,250)};
  rec.onerror=()=>{showFallbackInput(inputId);$("micStatus").innerHTML="Mikrofehler. Bitte schreiben."};
  rec.onend=()=>{};rec.start();
}
function checkHearSpeak(v){const good=clean($("speakFallback").value)===clean(v);$("fb").innerHTML=good?"<div class='ok'>Richtig.</div>":`<div class='no'>Richtig wäre: <strong>${safeText(v)}</strong></div>`;addEncounter(v,"hoeren_sprechen",good);finishQueuedVerb("hoeren_sprechen",v,good);setTimeout(hearSpeak,800)}
