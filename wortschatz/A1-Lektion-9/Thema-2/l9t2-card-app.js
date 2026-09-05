(function(){
'use strict';
const D=window.L9T2,root=document.getElementById('app');
if(!D||!root)return;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards'){location.replace('./index.html');return}
const TOPIC='wortschatz-a1-lektion-9-thema-2';
let Progress=null,recognition=null;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){return ['teacher','lehrer','admin','owner','superadmin'].includes(String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase())||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function store(){return preview()?sessionStorage:localStorage}
function key(){return`SP_L9_${pid()}_T2_karteikarten`}
function load(){
 let s={done:[],wrong:{},review:{},reviewFirstCorrect:{}};
 try{s={...s,...JSON.parse(store().getItem(key())||'{}')}}catch(e){}
 const ids=D.cards.map(x=>x.id);
 s.done=[...new Set((s.done||[]).filter(id=>ids.includes(id)))];
 s.wrong=s.wrong||{};s.review=s.review||{};s.reviewFirstCorrect=s.reviewFirstCorrect||{};
 return s;
}
function save(s){try{store().setItem(key(),JSON.stringify(s))}catch(e){}}
function percent(){return D.cards.length?Math.round(load().done.length/D.cards.length*100):0}
function previewNote(){return preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function taskHead(){const s=load(),n=D.cards.length,p=n?Math.round(s.done.length/n*100):0;return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe 1</span><h1>Karteikarten</h1><p>🃏 Lerne die Wörter.</p></div><div class="l8-progress-row"><span>${s.done.length} von ${n} fertig</span><strong>${p}%</strong></div><div class="l8-progress"><div style="width:${p}%"></div></div></section>`}
function feedback(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${text}</div>`}
function technical(text){const box=document.getElementById('technical');if(box)box.innerHTML=`<div class="l8-feedback warn">${esc(text)}</div>`}
function helpHtml(card,n){
 const term=card.full||card.word||'';
 if(n<=0)return'';
 if(n===1)return'<div class="l8-feedback bad">Noch nicht richtig. Versuch es noch einmal.</div>';
 if(n===2)return`<div class="l8-feedback warn"><strong>Hinweis:</strong> ${esc(card.meaning||card.example||'Lies das Wort und die Situation noch einmal genau.')}</div>`;
 return`<div class="l8-feedback warn"><strong>Lösung:</strong> ${esc(term)}<br>Sprich oder schreibe das Wort jetzt selbst.</div>`;
}
function cardAccepted(card){return[card.full||card.word,...(card.answers||[]),...(card.accepted||[])].filter(Boolean)}
function cardNext(){const s=load(),open=D.cards.map(x=>x.id).filter(id=>!s.done.includes(id));if(!open.length)return null;return open.find(id=>!s.reviewFirstCorrect[id])||open[0]}
function cardWrong(card){const s=load();s.wrong[card.id]=(Number(s.wrong[card.id])||0)+1;s.review[card.id]=true;save(s);return s.wrong[card.id]}
function cardRight(card){
 const s=load();
 if(s.review[card.id]&&!s.reviewFirstCorrect[card.id]){
  s.reviewFirstCorrect[card.id]=true;delete s.wrong[card.id];save(s);return true;
 }
 if(!s.done.includes(card.id))s.done.push(card.id);
 delete s.wrong[card.id];delete s.review[card.id];delete s.reviewFirstCorrect[card.id];save(s);syncTask();return false;
}
function languageLabel(){return({en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'})[window.L9T2Translations?.code]||'Englisch'}
function imageUrl(value){const raw=String(value||'').trim();if(!raw)return'';if(/^https?:\/\//i.test(raw))return raw;return`https://sprachpilot.b-cdn.net/${raw.replace(/^\/+/, '')}`}
function audioUrl(value){const raw=String(value||'').trim();if(!raw)return'';if(/^https?:\/\//i.test(raw))return raw;return`https://sprachpilot.b-cdn.net/${raw.replace(/^\/+/, '')}`}
function speakText(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
function playAudio(src,text){const url=audioUrl(src);if(!url){speakText(text);return}try{const a=new Audio(url);a.play().catch(()=>speakText(text));a.onerror=()=>speakText(text)}catch(e){speakText(text)}}
function mic(answers,onText){
 const R=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!R){technical('Das Mikrofon wird auf diesem Gerät nicht unterstützt. Bitte schreibe deine Antwort.');return}
 if(recognition)try{recognition.abort()}catch(e){}
 try{recognition=new R()}catch(e){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe deine Antwort.');return}
 recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;technical('Ich höre zu …');
 recognition.onresult=e=>{const vals=Array.from(e.results?.[0]||[]).map(x=>x.transcript).filter(Boolean);const exact=vals.find(v=>answers.some(a=>norm(a)===norm(v)));onText(exact||vals[0]||'')};
 recognition.onerror=()=>technical('Das Mikrofon hat nicht funktioniert. Bitte schreibe deine Antwort.');recognition.onend=()=>{recognition=null};
 try{recognition.start()}catch(e){technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe deine Antwort.')}
}
async function ensureProgress(){if(Progress)return Progress;try{await import('/js/progress.js?v=20260831-central6');Progress=window.SPProgress||null;return Progress}catch(e){console.warn('L9T2 progress',e);return null}}
async function syncTask(){
 if(preview())return;
 const api=await ensureProgress();if(!api?.recordTaskProgress)return;
 const done=load().done.length,total=D.cards.length,p=total?Math.round(done/total*100):0;
 api.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:9,theme:2,topicId:TOPIC,title:'A1 Lektion 9 · Thema 2',file:'task.html?task=karteikarten',taskTitle:'Karteikarten',percent:p,completed:p>=100,total,done}).catch?.(()=>{});
}
async function hydrate(){
 if(preview())return;
 const api=await ensureProgress();if(!api?.loadCurrentStudentProgress)return;
 try{
  const all=await api.loadCurrentStudentProgress(),topic=all?.wortschatz?.[TOPIC],cloud=topic?.tasks?.['task.html?task=karteikarten']||topic?.tasks?.karteikarten;
  if(!cloud)return;
  const ids=D.cards.map(x=>x.id),n=Math.min(ids.length,Math.max(Number(cloud.done)||0,Math.round(ids.length*Number(cloud.percent||0)/100)));
  const s=load();for(const id of ids.slice(0,n))if(!s.done.includes(id))s.done.push(id);save(s);
 }catch(e){console.warn('L9T2 restore',e)}
}
function finish(){
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${taskHead()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast diese Aufgabe zu 100% abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="./index.html">Zur Übersicht</a></div></section></div>`;
 syncTask();
}
function drawCard(){
 const id=cardNext();if(!id){finish();return}
 const card=D.cards.find(x=>x.id===id);if(!card){finish();return}
 const term=String(card.full||card.word||''),translation=String(card.translation||''),plural=String(card.plural||''),example=String(card.example||''),src=imageUrl(card.image),lang=languageLabel();
 root.innerHTML=`<div class="l8-wrap l8-card-standard">${previewNote()}${taskHead()}<section class="l8-card l8-card-stage"><div class="l8-flip-wrap flip-wrap"><div class="l8-flip-card flip-card" id="l8FlipCard" tabindex="0" role="button" aria-label="Karte umdrehen"><div class="l8-flip-face l8-flip-front flip-face flip-front">${src?`<div class="l8-card-visual visual"><img src="${esc(src)}" alt="" onerror="this.hidden=true"></div>`:'<div class="l8-card-visual visual l8-card-blank">Bild nicht verfügbar</div>'}<div class="l8-card-translation card-translation-box"><span>${esc(lang)}</span><strong>${esc(translation||'Wie heißt das auf Deutsch?')}</strong></div></div><div class="l8-flip-face l8-flip-back flip-face flip-back"><div class="l8-flip-back-grid flip-back-grid">${src?`<div class="l8-back-image flip-back-image"><div class="visual"><img src="${esc(src)}" alt=""></div></div>`:''}<div class="l8-back-info flip-back-info"><div class="l8-flip-word flip-word">${esc(term)}</div>${translation?`<div class="l8-card-translation card-translation-box back-translation"><span>${esc(lang)}</span><strong>${esc(translation)}</strong></div>`:''}<div class="card-details">${plural?`<div class="l8-card-detail"><span>Plural</span><strong>${esc(plural)}</strong></div>`:''}${example?`<div class="l8-card-detail"><span>Beispiel</span><strong>${esc(example)}</strong></div>`:''}</div><button class="l8-btn l8-audio l8-card-listen btn secondary card-listen-btn" id="cardListen" type="button">🔊 Anhören</button></div></div></div></div></div><div class="l8-row l8-center-actions l8-card-actions actions card-actions"><button class="l8-btn primary btn" id="cardMic" type="button">🎤 Sprechen</button><button class="l8-btn btn secondary" id="cardWrite" type="button">✍️ Schreiben</button></div><div class="l8-card-write l7-answer-box" id="cardWriteBox" hidden><div class="l8-answer-row"><input class="l8-input" id="cardInput" autocomplete="off" placeholder="Wort schreiben"><button class="l8-btn primary btn" id="cardCheck" type="button">Prüfen</button></div></div><div id="feedback"></div><div id="technical"></div></section></div>`;
 const flip=()=>{const node=document.getElementById('l8FlipCard');if(!node||node.classList.contains('flipped'))return;node.classList.add('flipped');const n=cardWrong(card);const box=document.getElementById('feedback');if(box)box.innerHTML=helpHtml(card,n)};
 const check=value=>{if(!String(value||'').trim())return;const ok=cardAccepted(card).some(a=>norm(a)===norm(value));if(ok){const review=cardRight(card);feedback('good',review?'Richtig. Diese Karte kommt später noch einmal.':'Richtig!');setTimeout(drawCard,550)}else{const n=cardWrong(card);const box=document.getElementById('feedback');if(box)box.innerHTML=helpHtml(card,n)}};
 const flipNode=document.getElementById('l8FlipCard');flipNode.onclick=flip;flipNode.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}};
 document.getElementById('cardListen').onclick=e=>{e.stopPropagation();playAudio(card.audio,term)};
 document.getElementById('cardWrite').onclick=()=>{document.getElementById('cardWriteBox').hidden=false;document.getElementById('cardInput').focus()};
 document.getElementById('cardCheck').onclick=()=>check(document.getElementById('cardInput').value);
 document.getElementById('cardInput').onkeydown=e=>{if(e.key==='Enter')check(e.target.value)};
 document.getElementById('cardMic').onclick=()=>mic(cardAccepted(card),v=>check(v));
}
(async()=>{await hydrate();drawCard()})();
})();