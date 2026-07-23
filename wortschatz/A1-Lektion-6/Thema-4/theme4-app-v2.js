(function(){
'use strict';
const params=new URLSearchParams(location.search);
const taskId=params.get('task')||'cards';
const task=window.L6T4_DATA?.tasks?.find(item=>item.id===taskId);
const meta=L6T4_TASKS.find(item=>item.id===taskId);
const area=document.getElementById('area');
const FILE=`task-${taskId}`;
let currentIndex=null;
let recognition=null;
let orderSelection=[];
let specialStage={index:null,mode:'choice'};

function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function bunnyUrl(file){return window.L6T4Bunny?.url(file)||`https://sprachpilot.b-cdn.net/${String(file||'').split('/').map(encodeURIComponent).join('/')}`}
function imageBlock(file,alt='',small=false,pure=false){
 if(!file)return'';
 const source=bunnyUrl(file);
 return`<div class="visual ${small?'small-visual':''} ${pure?'pure-visual':''}"><img data-bunny-file="${esc(file)}" src="${esc(source)}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-fallback blank" hidden aria-label="Bild nicht verfügbar"></div></div>`;
}
function audioBlock(file){
 if(!file)return'';
 const source=bunnyUrl(file);
 return`<div class="audio-file-panel"><audio controls preload="none" src="${esc(source)}" data-bunny-audio="${esc(file)}"></audio><div class="audio-load-error" hidden>Die Audiodatei ist noch nicht in Bunny Storage verfügbar.</div></div>`;
}
function accepted(item){
 const values=[item.answer,...(item.answers||[])];
 if(taskId==='cards'){
  const withoutArticle=String(item.word||'').replace(/^(der|die|das)\s+/i,'');
  values.push(item.word,withoutArticle);
 }
 return values.filter(Boolean);
}
function state(){return l6t4Load(FILE,task.items.length)}
function current(){
 const saved=state();
 currentIndex=saved.current===null||saved.current===undefined?l6t4NextIndex(FILE,task.items.length):saved.current;
 if(specialStage.index!==currentIndex)specialStage={index:currentIndex,mode:'choice'};
 return task.items[currentIndex];
}
function top(){return`${l6t4Progress(FILE,task.items.length)}<div class="task-instruction">${esc(task.description||'Bearbeite die Aufgabe.')}</div>`}
function genericHint(item){
 if(item.kind==='audio-double')return'Höre das Geräusch noch einmal. Nach der Auswahl musst du die Aktivität selbst schreiben.';
 if(item.kind==='audio-reaction')return'Höre auf die Frage oder Aussage und antworte mit einem passenden vollständigen Redemittel.';
 if(item.kind==='image-choice'||item.pureImage)return'Achte auf die Handlung und auf den Sinn des Satzes.';
 if(item.kind==='order')return'Das Subjekt steht zuerst. Das Verb steht im Aussagesatz auf Position 2.';
 const solution=String(item.answer||item.word||'');
 return solution?`Die Lösung beginnt mit „${solution.charAt(0)}“.`:'Lies die Aufgabe noch einmal.';
}
function hint(item){
 const tries=state().tries||0;
 if(tries===1)return'<div class="no">Noch nicht richtig. Versuche es noch einmal.</div>';
 if(tries===2)return`<div class="hint"><strong>Hinweis:</strong> ${esc(item.hint||genericHint(item))}</div>`;
 if(tries>=3)return`<div class="no"><strong>Mögliche Lösung:</strong> ${esc(item.answer||item.word)}<br>Gib die richtige Antwort jetzt selbst ein. Die Aufgabe kommt später noch einmal.</div>`;
 return'';
}
function feedbackHtml(item){return`<div id="feedback" class="feedback">${hint(item)}</div><div id="tech"></div>`}
function technical(message){const target=document.getElementById('tech');if(target)target.innerHTML=`<div class="hint">${esc(message)}</div>`}
function dialogLine(text){return esc(text).replace(/___/g,'<span class="dialog-gap">___</span>')}
function dialogHtml(lines){
 if(!Array.isArray(lines)||!lines.length)return'';
 const speakers=[];
 return`<div class="chat-window">${lines.map(line=>{
  let speakerIndex=speakers.indexOf(line.speaker);
  if(speakerIndex<0){speakers.push(line.speaker);speakerIndex=speakers.length-1}
  const side=line.side==='right'?'right':'left';
  return`<div class="chat-row ${side} speaker-${speakerIndex%2}"><div class="chat-name">${esc(line.speaker)}</div><div class="chat-bubble">${dialogLine(line.text)}</div></div>`;
 }).join('')}</div>`;
}
function optionGrid(options){return`<div class="option-grid compact-options">${l6t4Shuffle(options||[]).map(option=>`<button class="option" type="button" data-answer="${esc(option)}">${esc(option)}</button>`).join('')}</div>`}
function imageOptions(options){return`<div class="image-choice-grid compact-image-grid">${l6t4Shuffle(options||[]).map(option=>`<button class="image-option" type="button" data-answer="${esc(option.label)}">${imageBlock(option.image,option.label,true,true)}<span class="sr-only">${esc(option.label)}</span></button>`).join('')}</div>`}
function answerInput(label='Schreibe deine Antwort.',withMic=false){return`<div class="answer-area"><label for="answerInput">${esc(label)}</label><div class="answer-row"><input id="answerInput" autocomplete="off" autocapitalize="sentences"><button class="btn" type="button" data-action="check-input">Prüfen</button>${withMic?'<button class="btn secondary" type="button" data-action="mic">🎤 Sprechen</button>':''}</div></div>`}
function bindAudioErrors(){
 area.querySelectorAll('audio').forEach(audio=>audio.addEventListener('error',()=>{audio.hidden=true;const error=audio.nextElementSibling;if(error)error.hidden=false},{once:true}));
}
function bindInputs(){document.getElementById('answerInput')?.addEventListener('keydown',event=>{if(event.key==='Enter')checkInput(event.target.value)})}

function render(){
 stopMic();
 if(!task||!meta){area.innerHTML='<div class="finish-box"><h2>Aufgabe nicht gefunden</h2><a class="btn" href="index.html">Zur Übersicht</a></div>';return}
 if(task.exam&&!l6t4ExamUnlocked()){area.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><h2>Prüfung noch gesperrt</h2><p>Schließe zuerst alle anderen Aufgaben zu 100% ab.</p><a class="btn" href="index.html">Zur Übersicht</a></div>';return}
 const saved=state();
 if(saved.done.length>=task.items.length){finish();return}
 const item=current();
 if(!item){l6t4Storage().removeItem(l6t4TaskKey(FILE));currentIndex=l6t4NextIndex(FILE,task.items.length);return render()}
 orderSelection=[];
 l6t4Header(meta.title);
 document.title=`${meta.title} · L6T4`;
 if(task.kind==='cards')renderCard(item);else renderQuestion(item);
 window.L6T4Bunny?.enforce(area);
 bindAudioErrors();
 bindInputs();
}
function renderCard(item){
 const plural=item.plural?`<div><span>Plural</span><strong>${esc(item.plural)}</strong></div>`:'';
 area.innerHTML=`${top()}<div class="flip-wrap"><div id="verbFlipCard" class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-face flip-front">${imageBlock(item.image,item.word)}</div><div class="flip-face flip-back"><div class="flip-word">${esc(item.word)}</div><div class="flip-note">Lösung</div><div class="card-details">${plural}<div><span>Beispiel</span><strong>${esc(item.example||'')}</strong></div></div><button type="button" class="btn secondary card-listen-btn" id="cardListenBtn">🔊 Anhören</button></div></div></div><div class="hint card-translation">Bedeutung: <b>${esc(item.meaning)}</b></div><div class="actions card-actions"><button id="cardMicBtn" type="button" class="btn">Sprechen</button><button id="cardWriteBtn" type="button" class="btn secondary">Schreiben</button></div><div id="cardMicStatus" class="small card-mic-status"></div><div id="cardAnswerBox" class="card-answer-box" hidden>${answerInput('Wort schreiben')}</div><div id="feedback" class="feedback">${hint(item)}</div><div id="tech"></div><div id="cardAfter" class="actions card-actions"></div>`;
 const card=document.getElementById('verbFlipCard');
 card?.addEventListener('click',reveal);
 card?.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();reveal()}});
 document.getElementById('cardListenBtn')?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();l6t4Say(item.word)});
 document.getElementById('cardMicBtn')?.addEventListener('click',()=>startMic(item));
 document.getElementById('cardWriteBtn')?.addEventListener('click',openCardWrite);
}
function renderQuestion(item){
 let body='';
 const dialogue=dialogHtml(item.dialog);
 const visual=item.image?imageBlock(item.image,item.prompt,false,!!item.pureImage):'';
 let media='';
 if(item.kind==='audio-choice'||item.kind==='audio-double'||item.kind==='audio-reaction')media=audioBlock(item.audioFile);
 else if(item.audio)media=`<div class="audio-panel"><button class="btn secondary" type="button" data-action="tts" data-audio="${esc(item.audio)}">🔊 Anhören</button></div>`;
 if(item.kind==='choice'||!item.kind)body=optionGrid(item.options);
 else if(item.kind==='image-choice')body=imageOptions(item.options);
 else if(item.kind==='input')body=answerInput('Schreibe die vollständige Antwort.');
 else if(item.kind==='audio-choice')body=optionGrid(item.options);
 else if(item.kind==='audio-reaction')body=`<div class="reaction-instruction">Antworte passend. Inhalt und Formulierung werden mit den hinterlegten richtigen Antworten verglichen.</div>${answerInput('Deine passende Antwort',true)}`;
 else if(item.kind==='audio-double'){
  if(specialStage.mode==='choice')body=`<div class="double-step"><strong>Schritt 1 von 2:</strong> Wähle die Aktivität.</div>${optionGrid(item.options)}`;
  else body=`<div class="double-step success-step"><strong>Schritt 2 von 2:</strong> Schreibe jetzt selbst, was du gehört hast.</div>${answerInput('Aktivität schreiben',true)}`;
 }
 else if(item.kind==='order')body=`<div class="order-answer" id="orderAnswer"><span>Klicke die Wörter in der richtigen Reihenfolge an.</span></div><div class="token-grid">${l6t4Shuffle(item.tokens||[]).map((token,index)=>`<button class="token" type="button" data-token="${esc(token)}" data-token-index="${index}">${esc(token)}</button>`).join('')}</div><div class="actions centered"><button class="btn" type="button" data-action="check-order">Prüfen</button><button class="btn secondary" type="button" data-action="undo-order">Zurück</button><button class="btn ghost" type="button" data-action="reset-order">Neu</button></div>`;
 else if(item.kind==='speak')body=answerInput('Schreibe oder sprich deine Antwort.',true);
 const title=item.onlyImagePrompt?'':`<h2 class="question">${esc(item.prompt||'')}</h2>`;
 area.innerHTML=`${top()}<div class="question-card">${dialogue}${visual}${media}${title}${body}${feedbackHtml(item)}</div>`;
}
function isCorrect(item,value){return l6t4Exact(value,accepted(item))}
function registerWrong(item){
 l6t4RegisterAttempt(FILE,task.items.length,currentIndex,false);
 l6t4Wrong(FILE,task.items.length);
 specialStage={index:currentIndex,mode:'choice'};
 render();
}
function handleChoice(value){
 const item=current();
 if(item.kind==='audio-double'&&specialStage.mode==='choice'){
  if(isCorrect(item,value)){
   specialStage={index:currentIndex,mode:'write'};
   renderQuestion(item);
   window.L6T4Bunny?.enforce(area);
   bindAudioErrors();
   bindInputs();
   setTimeout(()=>document.getElementById('answerInput')?.focus(),30);
  }else registerWrong(item);
  return;
 }
 checkInput(value);
}
function checkInput(value){
 const item=current();
 if(!String(value||'').trim())return;
 const correct=isCorrect(item,value);
 l6t4RegisterAttempt(FILE,task.items.length,currentIndex,correct);
 if(correct){markRight();return}
 l6t4Wrong(FILE,task.items.length);
 specialStage={index:currentIndex,mode:'choice'};
 render();
}
function markRight(){
 const saved=state();
 const repeated=saved.hadWrong||saved.tries>0;
 l6t4Right(FILE,task.items.length);
 area.querySelectorAll('button,input,textarea,audio').forEach(element=>element.disabled=true);
 const feedback=document.getElementById('feedback');
 if(feedback)feedback.innerHTML=`<div class="ok">Richtig.${repeated?' Die Aufgabe kommt am Ende noch einmal.':''}</div>`;
 specialStage={index:null,mode:'choice'};
 setTimeout(render,650);
}
function reveal(){
 const item=current();
 const card=document.getElementById('verbFlipCard');
 if(card?.classList.contains('flipped'))return;
 card?.classList.add('flipped');
 l6t4RegisterAttempt(FILE,task.items.length,currentIndex,false);
 l6t4Wrong(FILE,task.items.length);
 const after=document.getElementById('cardAfter');
 if(after){
  after.innerHTML='<button type="button" class="btn" id="cardHelpNext">Weiter</button>';
  document.getElementById('cardHelpNext').onclick=()=>{l6t4Right(FILE,task.items.length);specialStage={index:null,mode:'choice'};render()};
 }
}
function openCardWrite(){
 const box=document.getElementById('cardAnswerBox');
 if(box)box.hidden=false;
 setTimeout(()=>document.getElementById('answerInput')?.focus(),30);
}
function startMic(item=current()){
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition){technical('Das Mikrofon wird nicht unterstützt. Bitte schreibe die Antwort.');document.getElementById('answerInput')?.focus();return}
 stopMic();
 let received=false,failed=false;
 try{recognition=new Recognition()}catch(e){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Antwort.');return}
 recognition.lang='de-DE';
 recognition.interimResults=false;
 recognition.maxAlternatives=5;
 technical('Ich höre zu …');
 recognition.onresult=event=>{
  received=true;
  const alternatives=Array.from(event.results[0]||[]).map(result=>result.transcript);
  const exact=alternatives.find(value=>isCorrect(item,value));
  const input=document.getElementById('answerInput');
  if(input)input.value=exact||alternatives[0]||'';
  checkInput(exact||alternatives[0]||'');
 };
 recognition.onerror=()=>{failed=true;technical('Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe die Antwort.')};
 recognition.onend=()=>{recognition=null;if(!received&&!failed)technical('Ich konnte nichts erkennen. Bitte schreibe die Antwort.')};
 try{recognition.start()}catch(e){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Antwort.')}
}
function stopMic(){if(recognition)try{recognition.abort()}catch(e){}recognition=null}
function selectToken(button){if(button.disabled)return;orderSelection.push(button.dataset.token);button.disabled=true;updateOrder()}
function updateOrder(){const target=document.getElementById('orderAnswer');if(target)target.innerHTML=orderSelection.length?orderSelection.map(token=>`<span>${esc(token)}</span>`).join(' '):'<span>Klicke die Wörter in der richtigen Reihenfolge an.</span>'}
function undoOrder(){
 if(!orderSelection.length)return;
 orderSelection.pop();
 const buttons=[...area.querySelectorAll('[data-token]')],used={};
 orderSelection.forEach(token=>used[token]=(used[token]||0)+1);
 buttons.forEach(button=>{const token=button.dataset.token;if(used[token]){button.disabled=true;used[token]--}else button.disabled=false});
 updateOrder();
}
function resetOrder(){orderSelection=[];area.querySelectorAll('[data-token]').forEach(button=>button.disabled=false);updateOrder()}
function finish(){
 const next=l6t4NextTask(taskId);
 const suffix=next.includes('?')?'&v=l6t4-revision2':'?v=l6t4-revision2';
 l6t4Complete(area,next==='index.html'?next:next+suffix,task.exam?'Du hast die Themenprüfung abgeschlossen.':'Du hast diese Aufgabe fehlerfrei abgeschlossen.');
}
area.addEventListener('click',event=>{
 const button=event.target.closest('button');
 if(!button)return;
 if(button.dataset.answer!==undefined)return handleChoice(button.dataset.answer);
 if(button.dataset.token!==undefined)return selectToken(button);
 const action=button.dataset.action;
 if(action==='check-input')return checkInput(document.getElementById('answerInput')?.value||'');
 if(action==='mic')return startMic();
 if(action==='tts')return l6t4Say(button.dataset.audio||'',()=>technical('Die Audioausgabe funktioniert hier nicht.'));
 if(action==='check-order')return checkInput(orderSelection.join(' '));
 if(action==='undo-order')return undoOrder();
 if(action==='reset-order')return resetOrder();
});
window.addEventListener('beforeunload',stopMic);
render();
})();