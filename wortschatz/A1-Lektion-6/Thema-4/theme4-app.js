(function(){
'use strict';

const params=new URLSearchParams(location.search);
const taskId=params.get('task')||'cards';
const task=window.L6T4_DATA?.tasks?.find(item=>item.id===taskId);
const meta=L6T4_TASKS.find(item=>item.id===taskId);
const area=document.getElementById('area');
const FILE=`task-${taskId}`;
const CDN='https://sprachpilot.b-cdn.net/';
let currentIndex=null;
let orderSelection=[];
let recognition=null;

function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function imageUrl(file){return CDN+encodeURIComponent(file||'')}
function imageBlock(file,alt='',small=false){
 if(!file)return'';
 return `<div class="visual ${small?'small-visual':''}"><img src="${imageUrl(file)}" alt="${esc(alt)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-fallback" hidden><strong>${esc(alt||'Bild')}</strong><span>Nutze die Erklärung und die Aufgabe.</span></div></div>`
}
function accepted(item){
 const list=[item.answer,...(item.answers||[])];
 if(taskId==='cards'){
  const withoutArticle=String(item.word||'').replace(/^(der|die|das)\s+/i,'');
  list.push(item.word,withoutArticle)
 }
 return list.filter(Boolean)
}
function current(){
 const state=l6t4Load(FILE,task.items.length);
 if(state.current===null||state.current===undefined)currentIndex=l6t4NextIndex(FILE,task.items.length);
 else currentIndex=state.current;
 return task.items[currentIndex]
}
function hint(item){
 const tries=l6t4Load(FILE,task.items.length).tries||0;
 if(tries===1)return'<div class="no">Noch nicht richtig. Versuche es noch einmal.</div>';
 if(tries===2)return`<div class="hint"><strong>Hinweis:</strong> ${esc(item.hint||genericHint(item))}</div>`;
 if(tries>=3)return`<div class="no"><strong>Lösung:</strong> ${esc(item.answer||item.word)}<br>Gib die richtige Antwort jetzt selbst ein. Die Aufgabe kommt später noch einmal.</div>`;
 return''
}
function genericHint(item){
 const solution=String(item.answer||item.word||'');
 if(item.kind==='order')return'Das Subjekt steht zuerst. Das Verb steht im Aussagesatz auf Position 2.';
 if(item.kind==='image-choice')return'Achte genau auf die Aktivität im Bild.';
 if(solution)return`Die Lösung beginnt mit „${solution.charAt(0)}“.`;
 return'Lies die Aufgabe noch einmal.'
}
function technical(message){
 const box=document.getElementById('tech');
 if(box)box.innerHTML=`<div class="hint">${esc(message)}</div>`
}
function feedbackHtml(item){return`<div id="feedback" class="feedback">${hint(item)}</div><div id="tech"></div>`}
function top(){return`${l6t4Progress(FILE,task.items.length)}<div class="task-instruction">${esc(task.description||'Bearbeite die Aufgabe.')}</div>`}
function showAudio(text){return`<button class="btn secondary" type="button" data-action="audio" data-audio="${esc(text)}">🔊 Anhören</button>`}
function render(){
 if(!task||!meta){area.innerHTML='<div class="finish-box"><h2>Aufgabe nicht gefunden</h2><a class="btn" href="index.html">Zur Übersicht</a></div>';return}
 if(task.exam&&!l6t4ExamUnlocked()){area.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><h2>Prüfung noch gesperrt</h2><p>Schließe zuerst alle anderen Aufgaben zu 100% ab.</p><a class="btn" href="index.html">Zur Übersicht</a></div>';return}
 const state=l6t4Load(FILE,task.items.length);
 if(state.done.length>=task.items.length){finish();return}
 const item=current();
 if(!item){l6t4Storage().removeItem(l6t4TaskKey(FILE));currentIndex=l6t4NextIndex(FILE,task.items.length);return render()}
 orderSelection=[];
 l6t4Header(meta.title);
 document.title=`${meta.title} · L6T4`;
 if(task.kind==='cards')renderCard(item);else renderQuestion(item)
}
function renderCard(item){
 const plural=item.plural?`<div><span>Plural</span><strong>${esc(item.plural)}</strong></div>`:'';
 area.innerHTML=`${top()}
 <div class="learning-card">
  ${imageBlock(item.image,item.word)}
  <p class="eyebrow">Was ist das auf Deutsch?</p>
  <div class="meaning">${esc(item.meaning)}</div>
  <div class="actions centered">
   ${showAudio(item.word)}
   <button class="btn" type="button" data-action="mic">🎤 Sprechen</button>
   <button class="btn secondary" type="button" data-action="write">✍️ Schreiben</button>
   <button class="btn ghost" type="button" data-action="reveal">Lösung zeigen</button>
  </div>
  <div id="writeArea" class="answer-area">
   <label for="answerInput">Deutsches Wort</label>
   <div class="answer-row"><input id="answerInput" autocomplete="off"><button class="btn" data-action="check-input" type="button">Prüfen</button></div>
  </div>
  <div id="cardBack" class="card-back" hidden>
   <div class="card-word">${esc(item.word)}</div>
   <div class="card-details"><div><span>Bedeutung</span><strong>${esc(item.meaning)}</strong></div>${plural}<div><span>Beispiel</span><strong>${esc(item.example||'')}</strong></div></div>
  </div>
  ${feedbackHtml(item)}
 </div>`;
 bindEnter()
}
function renderQuestion(item){
 let body='';
 const audio=item.audio?`<div class="audio-panel">${showAudio(item.audio)}<span>Du kannst den Hörtext mehrmals hören.</span></div>`:'';
 const visual=item.image?imageBlock(item.image,item.prompt):'';
 if(item.kind==='choice'||!item.kind){
  body=`<div class="option-grid">${(item.options||[]).map(option=>`<button class="option" type="button" data-answer="${esc(option)}">${esc(option)}</button>`).join('')}</div>`
 }else if(item.kind==='image-choice'){
  body=`<div class="image-choice-grid">${(item.options||[]).map(option=>`<button class="image-option" type="button" data-answer="${esc(option.label)}">${imageBlock(option.image,option.label,true)}<span class="sr-only">${esc(option.label)}</span></button>`).join('')}</div>`
 }else if(item.kind==='input'){
  body=inputBox('Schreibe die vollständige Antwort.')
 }else if(item.kind==='order'){
  const tokens=l6t4Shuffle(item.tokens||[]);
  body=`<div class="order-answer" id="orderAnswer"><span>Klicke die Wörter in der richtigen Reihenfolge an.</span></div><div class="token-grid">${tokens.map((token,index)=>`<button class="token" type="button" data-token="${esc(token)}" data-token-index="${index}">${esc(token)}</button>`).join('')}</div><div class="actions centered"><button class="btn" type="button" data-action="check-order">Prüfen</button><button class="btn secondary" type="button" data-action="undo-order">Zurück</button><button class="btn ghost" type="button" data-action="reset-order">Neu</button></div>`
 }else if(item.kind==='free'){
  body=`<div class="free-box"><label for="freeAnswer">Deine Antwort</label><textarea id="freeAnswer" rows="6" placeholder="${esc(item.example||'Schreibe vollständige Sätze.')}"></textarea><p class="small">Mindestens ${item.minWords||4} Wörter.</p><button class="btn" type="button" data-action="save-free">Speichern und weiter</button></div>`
 }else if(item.kind==='speak'){
  body=`<div class="speech-box"><p>Sprich eine vollständige Antwort oder schreibe sie.</p><div class="actions centered"><button class="btn" type="button" data-action="mic">🎤 Antwort sprechen</button><button class="btn secondary" type="button" data-action="write">✍️ Stattdessen schreiben</button></div>${inputBox('Schreibe deine vollständige Antwort.')}</div>`
 }
 area.innerHTML=`${top()}<div class="question-card">${visual}${audio}<p class="eyebrow">Aufgabe ${l6t4Load(FILE,task.items.length).done.length+1}</p><h2 class="question">${esc(item.prompt)}</h2>${body}${feedbackHtml(item)}</div>`;
 bindEnter()
}
function inputBox(label){return`<div id="writeArea" class="answer-area"><label for="answerInput">${esc(label)}</label><div class="answer-row"><input id="answerInput" autocomplete="off"><button class="btn" data-action="check-input" type="button">Prüfen</button></div></div>`}
function bindEnter(){const input=document.getElementById('answerInput');input?.addEventListener('keydown',event=>{if(event.key==='Enter')check(input.value)})}
function check(value){
 const item=current();
 if(!String(value||'').trim())return;
 const isCorrect=l6t4Exact(value,accepted(item));
 l6t4RegisterAttempt(FILE,task.items.length,currentIndex,isCorrect);
 if(isCorrect){right();return}
 l6t4Wrong(FILE,task.items.length);
 render()
}
function right(){
 if(taskId==='cards'){const back=document.getElementById('cardBack');if(back)back.hidden=false}
 const state=l6t4Load(FILE,task.items.length),repeated=state.hadWrong||state.tries>0;
 l6t4Right(FILE,task.items.length);
 area.querySelectorAll('button,input,textarea').forEach(element=>element.disabled=true);
 const feedback=document.getElementById('feedback');
 if(feedback)feedback.innerHTML=`<div class="ok">Richtig.${repeated?' Die Aufgabe kommt am Ende noch einmal.':''}</div>`;
 setTimeout(render,700)
}
function reveal(){
 const item=current();
 l6t4RegisterAttempt(FILE,task.items.length,currentIndex,false);
 const state=l6t4Load(FILE,task.items.length);
 while((state.tries||0)<3){state.tries=(state.tries||0)+1;state.hadWrong=true}
 l6t4Save(FILE,state);
 const back=document.getElementById('cardBack');if(back)back.hidden=false;
 const feedback=document.getElementById('feedback');if(feedback)feedback.innerHTML=hint(item);
 document.getElementById('answerInput')?.focus()
}
function saveFree(){
 const item=current(),field=document.getElementById('freeAnswer'),value=String(field?.value||'').trim();
 const words=value.split(/\s+/).filter(Boolean).length;
 if(words<(item.minWords||4)){
  const feedback=document.getElementById('feedback');
  if(feedback)feedback.innerHTML=`<div class="hint">Schreibe mindestens ${item.minWords||4} Wörter und vollständige Sätze.</div>`;
  field?.focus();return
 }
 l6t4RegisterAttempt(FILE,task.items.length,currentIndex,true);
 l6t4MarkFreeRight(FILE,task.items.length);
 area.querySelectorAll('button,input,textarea').forEach(element=>element.disabled=true);
 const feedback=document.getElementById('feedback');if(feedback)feedback.innerHTML='<div class="ok">Gespeichert.</div>';
 setTimeout(render,600)
}
function selectToken(button){if(button.disabled)return;orderSelection.push(button.dataset.token);button.disabled=true;updateOrder()}
function updateOrder(){const target=document.getElementById('orderAnswer');if(target)target.innerHTML=orderSelection.length?orderSelection.map(token=>`<span>${esc(token)}</span>`).join(' '):'<span>Klicke die Wörter in der richtigen Reihenfolge an.</span>'}
function undoOrder(){
 if(!orderSelection.length)return;
 orderSelection.pop();
 const buttons=[...area.querySelectorAll('[data-token]')],used={};
 orderSelection.forEach(token=>used[token]=(used[token]||0)+1);
 buttons.forEach(button=>{const token=button.dataset.token;if(used[token]){button.disabled=true;used[token]--}else button.disabled=false});
 updateOrder()
}
function resetOrder(){orderSelection=[];area.querySelectorAll('[data-token]').forEach(button=>button.disabled=false);updateOrder()}
function startMic(){
 const item=current(),Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition){technical('Das Mikrofon wird nicht unterstützt. Bitte schreibe die Antwort.');document.getElementById('answerInput')?.focus();return}
 stopMic();
 let received=false,failed=false;
 try{recognition=new Recognition()}catch(e){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Antwort.');return}
 recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;
 technical('Ich höre zu …');
 recognition.onresult=event=>{received=true;const alternatives=Array.from(event.results[0]||[]).map(result=>result.transcript);const exact=alternatives.find(value=>l6t4Exact(value,accepted(item)));check(exact||alternatives[0]||'')};
 recognition.onerror=()=>{failed=true;technical('Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe die Antwort.');document.getElementById('answerInput')?.focus()};
 recognition.onend=()=>{recognition=null;if(!received&&!failed){technical('Ich konnte nichts erkennen. Bitte schreibe die Antwort.');document.getElementById('answerInput')?.focus()}};
 try{recognition.start()}catch(e){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Antwort.')}
}
function stopMic(){if(recognition)try{recognition.abort()}catch(e){}recognition=null}
function finish(){
 const next=l6t4NextTask(taskId),suffix=next.includes('?')?'&v=l6t4-build1':'?v=l6t4-build1';
 l6t4Complete(area,next==='index.html'?next:next+suffix,task.exam?'Du hast die Themenprüfung abgeschlossen.':'Du hast diese Aufgabe fehlerfrei abgeschlossen.')
}
area.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.answer!==undefined)return check(button.dataset.answer);
 if(button.dataset.token!==undefined)return selectToken(button);
 const action=button.dataset.action;
 if(action==='check-input')return check(document.getElementById('answerInput')?.value);
 if(action==='audio')return l6t4Say(button.dataset.audio,()=>technical('Das Hören funktioniert hier nicht. Lies die Aufgabe.'));
 if(action==='mic')return startMic();
 if(action==='write')return document.getElementById('answerInput')?.focus();
 if(action==='reveal')return reveal();
 if(action==='check-order')return check(orderSelection.join(' '));
 if(action==='undo-order')return undoOrder();
 if(action==='reset-order')return resetOrder();
 if(action==='save-free')return saveFree()
});
window.addEventListener('beforeunload',stopMic);
render();
})();