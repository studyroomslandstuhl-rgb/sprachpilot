(function(){
'use strict';
const FILE='plural-sprechen.html';
const items=window.L6T4PluralItems||[];
const total=items.length;
const area=document.getElementById('area');
let currentIndex=0;
let recognition=null;
let writeOpen=false;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function accepted(item){
 if(item.noPlural)return['kein Plural','keinen Plural','keine Pluralform','hat keinen Plural'];
 const withoutArticle=String(item.plural||'').replace(/^die\s+/i,'');
 return[item.plural,withoutArticle];
}
function solution(item){return item.noPlural?'kein Plural':item.plural}
function help(item,tries){
 if(tries===1)return'<div class="no">Noch nicht richtig. Versuche es noch einmal.</div>';
 if(tries===2)return'<div class="hint">Prüfe den Artikel, den Umlaut und die Endung.</div>';
 if(tries>=3)return`<div class="no">Lösung: <b>${esc(solution(item))}</b><br>Das Wort kommt am Ende noch einmal.</div>`;
 return'';
}
function heading(){return'<div class="task-title-block"><span class="task-number">Aufgabe 6</span><h1>Plural</h1></div>'}
function render(message=''){
 stopMic();
 const state=l6t4Load(FILE,total);
 if(state.done.length>=total){l6t4Complete(area,'task.html?task=sound-activity&v=l6t4-user1','Du hast alle Pluralformen fehlerfrei wiederholt.');return}
 currentIndex=l6t4NextIndex(FILE,total);
 const item=items[currentIndex];
 l6t4Header('Plural');
 document.title='Aufgabe 6 · Plural';
 area.innerHTML=`${heading()}${l6t4Progress(FILE,total)}<div class="task-instruction">Sieh oder höre das Nomen. Sprich oder schreibe die Pluralform mit Artikel. Bei Nomen ohne Plural: <b>kein Plural</b>.</div><div class="plural-card"><div class="singular-label">Singular</div><div class="singular">${esc(item.singular)}</div><div class="plural-question">Der Plural</div><div class="actions centered" style="margin-top:20px"><button class="btn secondary" type="button" data-action="listen">🔊 Singular hören</button><button class="btn" type="button" data-action="mic">🎤 Plural sprechen</button><button class="btn secondary" type="button" data-action="write">✍️ Schreiben</button></div><div id="micStatus" class="mic-status"></div></div><div id="writeBox" class="write-panel" ${writeOpen?'':'hidden'}><label for="pluralAnswer">Pluralform mit Artikel</label><div class="answer-row"><input id="pluralAnswer" autocomplete="off" placeholder="z. B. die Bücher"><button class="btn" type="button" data-action="check">Kontrollieren</button></div></div><div id="feedback" class="feedback">${message||help(item,state.tries||0)}</div>`;
 const input=document.getElementById('pluralAnswer');
 input?.addEventListener('keydown',event=>{if(event.key==='Enter')checkWritten()});
 if(writeOpen)setTimeout(()=>input?.focus(),30);
}
function openWriting(message=''){
 writeOpen=true;
 render(message||document.getElementById('feedback')?.innerHTML||'');
}
function startMic(){
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition){openWriting('<div class="hint">Das Mikrofon wird nicht unterstützt. Bitte schreibe die Pluralform.</div>');return}
 stopMic();let received=false,failed=false;
 try{recognition=new Recognition()}catch(error){openWriting('<div class="hint">Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Pluralform.</div>');return}
 recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;
 const status=document.getElementById('micStatus');if(status)status.textContent='Ich höre …';
 recognition.onresult=event=>{received=true;const alternatives=Array.from(event.results?.[0]||[]).map(result=>result.transcript).filter(Boolean);checkSpoken(alternatives)};
 recognition.onerror=()=>{failed=true;openWriting('<div class="hint">Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe die Pluralform.</div>')};
 recognition.onend=()=>{recognition=null;if(!received&&!failed)openWriting('<div class="hint">Ich konnte nichts erkennen. Bitte schreibe die Pluralform.</div>')};
 try{recognition.start()}catch(error){openWriting('<div class="hint">Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Pluralform.</div>')}
}
function stopMic(){if(recognition)try{recognition.abort()}catch(error){}recognition=null}
function checkSpoken(alternatives){
 const item=items[currentIndex],correct=(alternatives||[]).some(value=>l6t4Exact(value,accepted(item)));
 l6t4RegisterAttempt(FILE,total,currentIndex,correct);
 if(correct)return markCorrect();
 const tries=l6t4Wrong(FILE,total);writeOpen=false;render(help(item,tries));
}
function checkWritten(){
 const input=document.getElementById('pluralAnswer'),item=items[currentIndex];if(!input||!input.value.trim())return;
 const correct=l6t4Exact(input.value,accepted(item));l6t4RegisterAttempt(FILE,total,currentIndex,correct);
 if(correct)return markCorrect();
 const tries=l6t4Wrong(FILE,total);const feedback=document.getElementById('feedback');if(feedback)feedback.innerHTML=help(item,tries);input.focus();
}
function markCorrect(){
 const state=l6t4Load(FILE,total),repeated=state.hadWrong||state.tries>0;l6t4Right(FILE,total);
 const feedback=document.getElementById('feedback');if(feedback)feedback.innerHTML=`<div class="ok">Richtig: ${esc(solution(items[currentIndex]))}.${repeated?' Das Wort kommt am Ende noch einmal.':''}</div>`;
 writeOpen=false;setTimeout(render,700);
}
area.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 const action=button.dataset.action;
 if(action==='listen')return l6t4Say(items[currentIndex].singular);
 if(action==='mic')return startMic();
 if(action==='write')return openWriting();
 if(action==='check')return checkWritten();
});
window.addEventListener('beforeunload',stopMic);render();
})();