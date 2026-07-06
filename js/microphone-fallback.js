(function(){
  function showWriteFallback(msg){
    try{
      const status=document.getElementById('micStatus')||document.querySelector('.mic-status')||document.getElementById('fb');
      if(status)status.innerHTML='<div class="hint">'+(msg||'Mikrofon funktioniert hier nicht. Bitte schreiben Sie die Antwort.')+'</div>';
      ['box','writeBox','answerBox'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('hidden')});
      const hidden=document.querySelectorAll('.hidden');
      hidden.forEach(el=>{if(el.querySelector('input,textarea'))el.classList.remove('hidden')});
      const inp=document.querySelector('input:not([type]), input[type="text"], textarea');
      if(inp) setTimeout(()=>inp.focus(),30);
    }catch(e){}
  }
  function makeMic(btn,cb){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){showWriteFallback();return null}
    let r;
    try{r=new SR()}catch(e){showWriteFallback();return null}
    r.lang='de-DE';r.interimResults=false;r.maxAlternatives=3;
    if(btn){btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='Ich höre …'}
    r.onresult=e=>{try{const txt=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:'';if(txt&&typeof cb==='function')cb(txt);else showWriteFallback('Ich konnte nichts erkennen. Bitte schreiben Sie die Antwort.')}catch(err){showWriteFallback()}};
    r.onerror=()=>showWriteFallback('Mikrofon ist blockiert oder nicht verfügbar. Bitte schreiben Sie die Antwort.');
    r.onend=()=>{if(btn){btn.disabled=false;btn.textContent=btn.dataset.oldText||'🎤 Sprechen'}};
    try{r.start()}catch(e){showWriteFallback()}
    return r;
  }
  window.spStartMicSafe=makeMic;
  setTimeout(()=>{
    const old=window.startMic;
    window.startMic=function(btn,cb){return makeMic(btn,cb||function(txt){const inp=document.querySelector('input:not([type]), input[type="text"], textarea');if(inp)inp.value=txt}) || (typeof old==='function'?old(btn,cb):null)};
  },50);
  setTimeout(()=>{
    const old=window.startMic;
    window.startMic=function(btn,cb){return makeMic(btn,cb||function(txt){const inp=document.querySelector('input:not([type]), input[type="text"], textarea');if(inp)inp.value=txt}) || (typeof old==='function'?old(btn,cb):null)};
  },1000);
})();