(function(){
'use strict';
var root=document.getElementById('app');
var D=window.L9T2;
if(!root)return;
if(!D||!Array.isArray(D.cards)||!D.cards.length){
 root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h1>Karteikarten</h1><p>Keine Kartendaten gefunden.</p></section></div>';
 return;
}
var task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
var recognition=null;
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function norm(v){return String(v==null?'':v).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){var p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){var r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return ['teacher','lehrer','admin','owner','superadmin'].indexOf(r)>=0||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function storage(){return preview()?sessionStorage:localStorage}
function key(){return 'SP_L9_'+pid()+'_T2_karteikarten'}
function load(){
 var s={done:[],wrong:{},review:{},reviewFirstCorrect:{}};
 try{var raw=JSON.parse(storage().getItem(key())||'{}');Object.assign(s,raw||{})}catch(e){}
 var ids=D.cards.map(function(x){return x.id});
 s.done=Array.from(new Set((s.done||[]).filter(function(id){return ids.indexOf(id)>=0})));s.wrong=s.wrong||{};s.review=s.review||{};s.reviewFirstCorrect=s.reviewFirstCorrect||{};
 return s;
}
function save(s){try{storage().setItem(key(),JSON.stringify(s));window.dispatchEvent(new Event('storage'))}catch(e){}}
function previewNote(){return preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function head(){var s=load(),n=D.cards.length,p=n?Math.round(s.done.length/n*100):0;return '<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe 1</span><h1>Karteikarten</h1><p>🃏 Lerne die Wörter.</p></div><div class="l8-progress-row"><span>'+s.done.length+' von '+n+' fertig</span><strong>'+p+'%</strong></div><div class="l8-progress"><div style="width:'+p+'%"></div></div></section>'}
function accepted(card){return [card.full||card.word].concat(card.answers||[],card.accepted||[]).filter(Boolean)}
function nextId(){var s=load(),open=D.cards.map(function(x){return x.id}).filter(function(id){return s.done.indexOf(id)<0});if(!open.length)return null;for(var i=0;i<open.length;i++)if(!s.reviewFirstCorrect[open[i]])return open[i];return open[0]}
function wrong(card){var s=load();s.wrong[card.id]=(Number(s.wrong[card.id])||0)+1;s.review[card.id]=true;save(s);return s.wrong[card.id]}
function right(card){var s=load();if(s.review[card.id]&&!s.reviewFirstCorrect[card.id]){s.reviewFirstCorrect[card.id]=true;delete s.wrong[card.id];save(s);return true}if(s.done.indexOf(card.id)<0)s.done.push(card.id);delete s.wrong[card.id];delete s.review[card.id];delete s.reviewFirstCorrect[card.id];save(s);return false}
function langLabel(){var c=window.L9T2Translations&&window.L9T2Translations.code;return {en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'}[c]||'Englisch'}
function help(card,n){if(n===1)return '<div class="l8-feedback bad">Noch nicht richtig. Versuch es noch einmal.</div>';if(n===2)return '<div class="l8-feedback warn"><strong>Hinweis:</strong> '+esc(card.meaning||card.example||'Schau dir das Bild noch einmal genau an.')+'</div>';return '<div class="l8-feedback warn"><strong>Lösung:</strong> '+esc(card.full||card.word)+'<br>Sprich oder schreibe das Wort jetzt selbst.</div>'}
function feedback(type,text){var b=document.getElementById('feedback');if(b)b.innerHTML='<div class="l8-feedback '+type+'">'+text+'</div>'}
function speak(text){try{if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;window.speechSynthesis.speak(u)}catch(e){}}
function audio(card){var src=String(card.audio||'');if(!src){speak(card.full||card.word);return}try{var a=new Audio(src);a.onerror=function(){speak(card.full||card.word)};var p=a.play();if(p&&p.catch)p.catch(function(){speak(card.full||card.word)})}catch(e){speak(card.full||card.word)}}
function check(card,value){if(!String(value||'').trim())return;var v=norm(value),ok=accepted(card).some(function(a){return norm(a)===v});if(ok){var again=right(card);feedback('good',again?'Richtig. Diese Karte kommt später noch einmal.':'Richtig!');setTimeout(draw,500)}else{var n=wrong(card);var b=document.getElementById('feedback');if(b)b.innerHTML=help(card,n)}}
function mic(card){var R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){document.getElementById('cardWrite').click();return}try{if(recognition)recognition.abort();recognition=new R();recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;recognition.onresult=function(e){var vals=[];for(var i=0;i<e.results[0].length;i++)vals.push(e.results[0][i].transcript);var hit=vals.find(function(v){return accepted(card).some(function(a){return norm(a)===norm(v)})});check(card,hit||vals[0]||'')};recognition.onerror=function(){document.getElementById('cardWrite').click()};recognition.start()}catch(e){document.getElementById('cardWrite').click()}}
function finish(){root.innerHTML='<div class="l8-wrap">'+previewNote()+head()+'<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast diese Aufgabe zu 100% abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="./index.html">Zur Übersicht</a></div></section></div>';window.__L9T2_BOOT_OK=true}
function draw(){
 var id=nextId();if(!id){finish();return}var card=D.cards.find(function(x){return x.id===id});if(!card){finish();return}
 var term=String(card.full||card.word||''),tr=String(card.translation||''),plural=String(card.plural||''),example=String(card.example||''),src=String(card.image||''),lang=langLabel();
 root.innerHTML='<div class="l8-wrap l8-card-standard">'+previewNote()+head()+'<section class="l8-card l8-card-stage"><div class="l8-flip-wrap flip-wrap"><div class="l8-flip-card flip-card" id="l8FlipCard" tabindex="0" role="button" aria-label="Karte umdrehen"><div class="l8-flip-face l8-flip-front flip-face flip-front"><div class="l8-card-visual visual">'+(src?'<img src="'+esc(src)+'" alt="">':'')+'</div><div class="l8-card-translation card-translation-box"><span>'+esc(lang)+'</span><strong>'+esc(tr||'Wie heißt das auf Deutsch?')+'</strong></div></div><div class="l8-flip-face l8-flip-back flip-face flip-back"><div class="l8-flip-back-grid flip-back-grid"><div class="l8-back-image flip-back-image"><div class="visual">'+(src?'<img src="'+esc(src)+'" alt="">':'')+'</div></div><div class="l8-back-info flip-back-info"><div class="l8-flip-word flip-word">'+esc(term)+'</div>'+(tr?'<div class="l8-card-translation card-translation-box back-translation"><span>'+esc(lang)+'</span><strong>'+esc(tr)+'</strong></div>':'')+'<div class="card-details">'+(plural?'<div class="l8-card-detail"><span>Plural</span><strong>'+esc(plural)+'</strong></div>':'')+(example?'<div class="l8-card-detail"><span>Beispiel</span><strong>'+esc(example)+'</strong></div>':'')+'</div><button class="l8-btn l8-audio l8-card-listen btn secondary card-listen-btn" id="cardListen" type="button">🔊 Anhören</button></div></div></div></div></div><div class="l8-row l8-center-actions l8-card-actions actions card-actions"><button class="l8-btn primary btn" id="cardMic" type="button">🎤 Sprechen</button><button class="l8-btn btn secondary" id="cardWrite" type="button">✍️ Schreiben</button></div><div class="l8-card-write l7-answer-box" id="cardWriteBox" hidden><div class="l8-answer-row"><input class="l8-input" id="cardInput" autocomplete="off" placeholder="Wort schreiben"><button class="l8-btn primary btn" id="cardCheck" type="button">Prüfen</button></div></div><div id="feedback"></div></section></div>';
 window.__L9T2_BOOT_OK=true;
 var flip=document.getElementById('l8FlipCard');var doFlip=function(){if(flip.classList.contains('flipped'))return;flip.classList.add('flipped');var n=wrong(card);document.getElementById('feedback').innerHTML=help(card,n)};flip.onclick=doFlip;flip.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();doFlip()}};
 document.getElementById('cardListen').onclick=function(e){e.stopPropagation();audio(card)};
 document.getElementById('cardWrite').onclick=function(){var b=document.getElementById('cardWriteBox');b.hidden=false;document.getElementById('cardInput').focus()};
 document.getElementById('cardCheck').onclick=function(){check(card,document.getElementById('cardInput').value)};
 document.getElementById('cardInput').onkeydown=function(e){if(e.key==='Enter')check(card,e.target.value)};
 document.getElementById('cardMic').onclick=function(){mic(card)};
 if(window.SPCardTaskStandard&&window.SPCardTaskStandard.autoScrollToImage)setTimeout(function(){window.SPCardTaskStandard.autoScrollToImage(true)},30);
}
draw();
})();