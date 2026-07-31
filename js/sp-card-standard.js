(function(){
'use strict';
if(window.SPCardStandard)return;

function esc(value){
  return String(value??'').replace(/[&<>"']/g,function(char){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
  });
}
function fallbackNormalize(value){
  return String(value||'').trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss')
    .replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
}
function defaultSpeak(text,failed){
  if(!('speechSynthesis' in window)){if(failed)failed();return;}
  try{
    speechSynthesis.cancel();
    var utterance=new SpeechSynthesisUtterance(String(text||''));
    utterance.lang='de-DE';
    utterance.rate=.84;
    utterance.onerror=function(){if(failed)failed();};
    speechSynthesis.speak(utterance);
  }catch(error){if(failed)failed();}
}

function mount(config){
  config=config||{};
  var area=typeof config.area==='string'?document.querySelector(config.area):config.area;
  if(!area)throw new Error('SPCardStandard: Aufgabenbereich fehlt.');
  if(!config.state)throw new Error('SPCardStandard: Fortschrittsadapter fehlt.');

  var state=config.state;
  var currentItem=null;
  var recognition=null;
  var autoScrollTimer=null;
  var normalize=typeof config.normalize==='function'?config.normalize:fallbackNormalize;

  function words(){return typeof config.words==='function'?(config.words()||[]):(config.words||[]);}
  function full(item){
    if(typeof config.full==='function')return String(config.full(item)||'');
    return String(item?.full||((item?.article?item.article+' ':'')+(item?.word||''))||'');
  }
  function word(item){return String(typeof config.word==='function'?config.word(item):(item?.word||full(item))||'');}
  function plural(item){return String(typeof config.plural==='function'?config.plural(item):(item?.plural||'')||'');}
  function example(item){return String(typeof config.example==='function'?config.example(item):(item?.sentence||item?.example||'')||'');}
  function translation(item){return String(typeof config.translation==='function'?config.translation(item):(item?.translation||item?.meaning||'')||'');}
  function languageName(){return String(typeof config.languageName==='function'?config.languageName():(config.languageName||'Muttersprache'));}
  function imageSource(item){
    try{if(typeof config.image==='function')return String(config.image(item)||'');}catch(error){}
    return String(item?.image||item?.img||'');
  }
  function renderVisual(item,small,pure){
    if(typeof config.visual==='function'){
      var custom=config.visual(item,{small:!!small,pure:!!pure});
      if(custom)return custom;
    }
    var source=imageSource(item);
    if(!source)return '<div class="image-fallback blank" aria-label="Bild nicht verfügbar"></div>';
    return '<div class="visual '+(small?'small-visual ':'')+(pure?'pure-visual':'')+'"><img src="'+esc(source)+'" alt="'+esc(full(item))+'" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-fallback blank" hidden aria-label="Bild nicht verfügbar"></div></div>';
  }
  function progress(){
    var raw=typeof state.progress==='function'?(state.progress()||{}):{};
    var total=Number(raw.total||words().length||0);
    var done=Number(raw.done||0);
    return {total:total,done:done,tries:Number(raw.tries||0),hadWrong:!!raw.hadWrong};
  }
  function getCurrent(){
    currentItem=typeof state.current==='function'?state.current():null;
    return currentItem;
  }
  function accepted(item){
    if(typeof config.answers==='function')return (config.answers(item)||[]).filter(Boolean);
    var complete=full(item),withoutArticle=complete.replace(/^(der|die|das)\s+/i,'');
    return [complete,word(item),withoutArticle].concat(Array.isArray(item?.aliases)?item.aliases:[]).filter(Boolean);
  }
  function isCorrect(item,value){
    if(typeof config.accept==='function')return !!config.accept(item,value);
    var normalized=normalize(value);
    return accepted(item).some(function(solution){return normalize(solution)===normalized;});
  }
  function taskHeading(){return '<div class="task-title-block"><span class="task-number">Aufgabe 1</span><h1>Karteikarten</h1></div>';}
  function progressHtml(){
    var saved=progress(),percent=saved.total?Math.round(saved.done/saved.total*100):0;
    return '<div class="task-progress-row"><span>'+saved.done+' fehlerfrei · '+Math.max(0,saved.total-saved.done)+' übrig</span><strong>'+percent+'%</strong></div><div class="progress"><div class="bar" style="width:'+percent+'%"></div></div>';
  }
  function genericHint(item){
    var solution=full(item);
    return solution?'Die Lösung beginnt mit „'+solution.charAt(0)+'“.':'Lies die Aufgabe noch einmal.';
  }
  function feedbackHint(item){
    var tries=progress().tries;
    if(tries===1)return '<div class="no">Noch nicht richtig. Prüfe beide Antworten und versuche es erneut.</div>';
    if(tries===2)return '<div class="hint"><strong>Hinweis:</strong> '+esc(genericHint(item))+'</div>';
    if(tries>=3)return '<div class="no"><strong>Lösung:</strong> '+esc(full(item))+'<br>Die Aufgabe kommt am Ende noch einmal.</div>';
    return '';
  }
  function answerInput(){
    return '<div class="write-panel" id="writePanel"><div class="answer-area"><label for="answerInput">Wort schreiben</label><div class="answer-row"><input id="answerInput" autocomplete="off" autocapitalize="sentences"><button class="btn" type="button" data-action="check-input">Kontrollieren</button></div></div></div>';
  }
  function playAudio(item){
    if(typeof config.audio==='function'){
      try{config.audio(item);return;}catch(error){}
    }
    defaultSpeak(full(item),function(){technical('Die Audiofunktion ist nicht verfügbar. Lies das Wort.');});
  }
  function renderCard(item){
    var p=plural(item),meaning=translation(item),sample=example(item);
    var pluralHtml=p?'<div><span>Plural</span><strong>'+esc(p.replace('kein Plural üblich','kein Plural'))+'</strong></div>':'';
    area.innerHTML=taskHeading()+progressHtml()+
      '<div class="flip-wrap"><div id="verbFlipCard" class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen">'+
      '<div class="flip-face flip-front">'+renderVisual(item,false,false)+'<div class="card-translation-box"><span>'+esc(languageName())+'</span><strong>'+esc(meaning)+'</strong></div></div>'+
      '<div class="flip-face flip-back"><div class="flip-back-grid"><div class="flip-back-image">'+renderVisual(item,true,true)+'</div><div class="flip-back-info"><div class="flip-word">'+esc(full(item))+'</div><div class="card-translation-box back-translation"><span>'+esc(languageName())+'</span><strong>'+esc(meaning)+'</strong></div><div class="card-details">'+pluralHtml+'<div><span>Beispiel</span><strong>'+esc(sample)+'</strong></div></div><button type="button" class="btn secondary card-listen-btn" id="cardListenBtn">🔊 Anhören</button></div></div></div></div></div>'+
      '<div class="actions card-actions"><button id="cardMicBtn" type="button" class="btn">🎤 Sprechen</button><button id="cardWriteBtn" type="button" class="btn secondary">✍️ Schreiben</button></div>'+
      '<div id="cardAnswerBox" hidden>'+answerInput()+'</div><div id="feedback" class="feedback">'+feedbackHint(item)+'</div><div id="tech"></div><div id="cardAfter" class="actions card-actions"></div>';

    var card=document.getElementById('verbFlipCard');
    card?.addEventListener('click',function(event){if(event.target.closest('button,input,textarea,audio,a'))return;flipOnly();});
    card?.addEventListener('keydown',function(event){if(event.key!=='Enter'&&event.key!==' ')return;if(event.target.closest('button,input,textarea,audio,a'))return;event.preventDefault();flipOnly();});
    document.getElementById('cardListenBtn')?.addEventListener('click',function(event){event.preventDefault();event.stopPropagation();playAudio(item);});
    document.getElementById('cardMicBtn')?.addEventListener('click',function(){startMic(item);});
    document.getElementById('cardWriteBtn')?.addEventListener('click',openWrite);
    document.getElementById('answerInput')?.addEventListener('keydown',function(event){if(event.key==='Enter')checkInput(event.target.value);});
  }
  function flipOnly(){
    var card=document.getElementById('verbFlipCard');
    if(card&&!card.classList.contains('flipped'))card.classList.add('flipped');
    var feedback=document.getElementById('feedback');
    if(feedback&&!feedback.textContent.trim())feedback.innerHTML='<div class="hint">Sprich das Wort oder schreibe es. Erst eine richtige Antwort geht weiter.</div>';
    var after=document.getElementById('cardAfter');if(after)after.innerHTML='';
  }
  function openWrite(){
    var box=document.getElementById('cardAnswerBox');if(box)box.hidden=false;
    setTimeout(function(){document.getElementById('answerInput')?.focus();},30);
  }
  function technical(message){var target=document.getElementById('tech');if(target)target.innerHTML='<div class="hint">'+esc(message)+'</div>';}
  function checkInput(value){
    var item=currentItem||getCurrent();
    if(!item||!String(value||'').trim())return;
    if(isCorrect(item,value)){markRight();return;}
    if(typeof state.wrong==='function')state.wrong();
    render();
  }
  function markRight(){
    var before=progress(),repeated=before.hadWrong||before.tries>0;
    if(typeof state.right==='function')state.right();
    area.querySelectorAll('button,input,textarea,audio').forEach(function(element){element.disabled=true;});
    var feedback=document.getElementById('feedback');
    if(feedback)feedback.innerHTML='<div class="ok">Richtig.'+(repeated?' Der Dialog kommt am Ende noch einmal.':'')+'</div>';
    setTimeout(render,650);
  }
  function startMic(item){
    var Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!Recognition){technical('Das Mikrofon wird nicht unterstützt. Bitte schreibe die Antwort.');openWrite();return;}
    stopMic();var received=false,failed=false;
    try{recognition=new Recognition();}catch(error){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Antwort.');openWrite();return;}
    recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;
    technical('Ich höre zu …');
    recognition.onresult=function(event){
      received=true;
      var alternatives=Array.from(event.results[0]||[]).map(function(result){return result.transcript;});
      var exact=alternatives.find(function(value){return isCorrect(item,value);});
      checkInput(exact||alternatives[0]||'');
    };
    recognition.onerror=function(){failed=true;technical('Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe die Antwort.');openWrite();};
    recognition.onend=function(){recognition=null;if(!received&&!failed){technical('Ich konnte nichts erkennen. Bitte schreibe die Antwort.');openWrite();}};
    try{recognition.start();}catch(error){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Antwort.');openWrite();}
  }
  function stopMic(){if(recognition)try{recognition.abort();}catch(error){}recognition=null;}
  function finish(){
    area.innerHTML='<div class="finish-box"><div class="finish-icon">✓</div><h2>Geschafft!</h2><p>Du hast diese Aufgabe fehlerfrei abgeschlossen.</p><div class="actions"><a class="btn" href="'+esc(config.nextPage||'index.html')+'">Weiter →</a><a class="btn secondary" href="index.html">Zur Übersicht</a></div></div>';
  }
  function scrollToCard(){clearTimeout(autoScrollTimer);autoScrollTimer=setTimeout(function(){var target=area.querySelector('.flip-wrap');target?.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'});},180);}
  function render(){
    stopMic();
    var saved=progress();
    if(saved.total>0&&saved.done>=saved.total){finish();return;}
    var item=getCurrent();
    if(!item){
      if(typeof state.resetCurrent==='function'){state.resetCurrent();item=getCurrent();}
      if(!item){area.innerHTML='<div class="no">Die Karte konnte nicht geladen werden.</div>';return;}
    }
    renderCard(item);scrollToCard();
  }
  area.addEventListener('click',function(event){var button=event.target.closest('button');if(button?.dataset.action==='check-input')checkInput(document.getElementById('answerInput')?.value||'');});
  window.addEventListener('beforeunload',stopMic);
  render();
  return {render:render,stop:stopMic};
}

window.SPCardStandard={mount:mount,escape:esc,normalize:fallbackNormalize};
})();
