(function(){
  let activeRecognition=null;

  function findStatus(){return document.getElementById('micStatus')||document.querySelector('.mic-status')||document.getElementById('fb')}
  function setStatus(message,type){const el=findStatus();if(el)el.innerHTML='<div class="hint mic-hint '+(type||'')+'">'+message+'</div>'}
  function restoreButton(btn){if(!btn)return;btn.disabled=false;btn.textContent=btn.dataset.oldText||'🎤 Sprechen';btn.removeAttribute('aria-busy')}
  function showWriteFallback(message){
    setStatus(message||'Mikrofon funktioniert hier nicht zuverlässig. Bitte schreibe die Antwort.','mic-fallback');
    ['box','writeBox','answerBox'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('hidden')});
    document.querySelectorAll('.hidden').forEach(el=>{if(el.querySelector('input,textarea'))el.classList.remove('hidden')});
    const input=document.querySelector('input:not([type]),input[type="text"],textarea');
    if(input)setTimeout(()=>input.focus(),40);
  }
  function speechCtor(){return window.SpeechRecognition||window.webkitSpeechRecognition||null}
  function bestTranscript(event){
    try{
      const list=event.results&&event.results[0];
      if(!list||!list.length)return '';
      let best=list[0];
      for(let i=1;i<list.length;i++){if((list[i].confidence||0)>(best.confidence||0))best=list[i]}
      return String(best.transcript||'').trim();
    }catch(e){return ''}
  }
  function errorText(error){
    if(error==='not-allowed'||error==='permission-denied')return 'Mikrofon ist blockiert. Bitte erlaube das Mikrofon im Browser oder schreibe die Antwort.';
    if(error==='service-not-allowed')return 'Spracherkennung ist auf diesem Gerät blockiert. Bitte schreibe die Antwort.';
    if(error==='audio-capture')return 'Kein Mikrofon gefunden. Bitte schreibe die Antwort.';
    if(error==='network')return 'Spracherkennung braucht Internet und ist gerade nicht erreichbar. Bitte schreibe die Antwort.';
    if(error==='no-speech')return 'Ich habe nichts erkannt. Bitte versuche es noch einmal oder schreibe die Antwort.';
    return 'Mikrofon hat nicht funktioniert. Bitte versuche es noch einmal oder schreibe die Antwort.';
  }
  function stopActive(){try{if(activeRecognition)activeRecognition.abort()}catch(e){}activeRecognition=null}
  async function checkPermission(){
    try{
      if(!navigator.permissions||!navigator.permissions.query)return 'unknown';
      const res=await navigator.permissions.query({name:'microphone'});
      return res&&res.state?res.state:'unknown';
    }catch(e){return 'unknown'}
  }
  async function start(btn,callback,options){
    options=options||{};
    const cb=typeof callback==='function'?callback:function(txt){const input=document.querySelector('input:not([type]),input[type="text"],textarea');if(input)input.value=txt};
    const SR=speechCtor();
    if(!window.isSecureContext){showWriteFallback('Mikrofon funktioniert nur über eine sichere HTTPS-Verbindung. Bitte schreibe die Antwort.');return null}
    if(!SR){showWriteFallback('Dieses Handy oder dieser Browser unterstützt Spracherkennung nicht. Bitte schreibe die Antwort.');return null}
    stopActive();
    if(btn){btn.dataset.oldText=btn.dataset.oldText||btn.textContent;btn.disabled=true;btn.textContent='Ich höre ...';btn.setAttribute('aria-busy','true')}
    const permission=await checkPermission();
    if(permission==='denied'){restoreButton(btn);showWriteFallback('Mikrofon ist im Browser blockiert. Bitte erlaube es in den Einstellungen oder schreibe die Antwort.');return null}
    let recognition;
    try{recognition=new SR()}catch(e){restoreButton(btn);showWriteFallback('Spracherkennung konnte nicht gestartet werden. Bitte schreibe die Antwort.');return null}
    activeRecognition=recognition;
    let finished=false;
    let heardSomething=false;
    let timer=null;
    function done(){
      if(finished)return;
      finished=true;
      clearTimeout(timer);
      if(activeRecognition===recognition)activeRecognition=null;
      restoreButton(btn);
    }
    recognition.lang=options.lang||'de-DE';
    recognition.continuous=false;
    recognition.interimResults=false;
    recognition.maxAlternatives=5;
    recognition.onstart=function(){setStatus('Bitte sprich jetzt deutlich auf Deutsch.','mic-listening')};
    recognition.onaudiostart=function(){heardSomething=true;setStatus('Ich höre ...','mic-listening')};
    recognition.onspeechstart=function(){heardSomething=true;setStatus('Sprache erkannt, einen Moment ...','mic-listening')};
    recognition.onresult=function(event){
      const text=bestTranscript(event);
      done();
      if(text){setStatus('Erkannt: '+text,'mic-result');cb(text,event)}
      else showWriteFallback('Ich konnte nichts erkennen. Bitte schreibe die Antwort.');
    };
    recognition.onnomatch=function(){done();showWriteFallback('Ich konnte das Wort nicht erkennen. Bitte versuche es noch einmal oder schreibe die Antwort.')};
    recognition.onerror=function(event){done();showWriteFallback(errorText(event&&event.error))};
    recognition.onend=function(){if(!finished){done();if(!heardSomething)showWriteFallback('Ich habe nichts gehört. Bitte versuche es noch einmal oder schreibe die Antwort.')}};
    timer=setTimeout(function(){try{recognition.stop()}catch(e){}if(!finished){done();showWriteFallback('Das Mikrofon hat zu lange nichts erkannt. Bitte versuche es noch einmal oder schreibe die Antwort.')}},Number(options.timeoutMs||9000));
    try{recognition.start()}catch(e){done();showWriteFallback('Mikrofon konnte nicht gestartet werden. Bitte kurz warten und noch einmal tippen oder die Antwort schreiben.')}
    return recognition;
  }
  window.spShowMicWriteFallback=showWriteFallback;
  window.spStartMicRobust=start;
  window.startMic=function(btn,cb){return start(btn,cb)};
})();
