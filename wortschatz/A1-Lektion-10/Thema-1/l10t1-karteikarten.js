(function(){
'use strict';
const taskId=String(new URLSearchParams(location.search).get('task')||'karteikarten').toLowerCase();
if(taskId!=='karteikarten'&&taskId!=='cards')return;
if(window.__SP_L10T1_KARTEIKARTEN_L8_V1)return;
window.__SP_L10T1_KARTEIKARTEN_L8_V1=true;

document.documentElement.setAttribute('data-sp-card-lesson','10');

const D=window.L10T1||{cards:[]};
const cards=Array.isArray(D.cards)?D.cards:[];
const root=document.getElementById('app');
const KEY='SP_L10_T1_karteikarten';
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const SCHEMA='L10T1_KARTEIKARTEN_L8_V1';
const total=cards.length;
let recognition=null;
let busy=false;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFC').trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const shuffle=values=>{const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const validIndex=i=>Number.isInteger(Number(i))&&Number(i)>=0&&Number(i)<total;
const unique=a=>[...new Set((a||[]).map(Number).filter(Number.isInteger))];

function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function teacherPreview(){
 try{
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_USER_ROLE')||'').toLowerCase();
  const context=String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();
  const p=profile();
  const explicit=p.previewOnly===true||p.teacherPreview===true||p.studentCoursePreview===true;
  const flag=sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1';
  return ['teacher','lehrer','admin','owner','superadmin'].includes(role)&&(flag||context==='teacher-student-preview'||explicit);
 }catch(e){return false}
}
const store=teacherPreview()?sessionStorage:localStorage;
function runNo(){try{return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}catch(e){return 1}}

function blank(){return{schema:SCHEMA,_run:runNo(),total,done:[],queue:shuffle([...Array(total).keys()]),reviewQueue:[],current:null,review:{},tries:{},firstSeen:[],firstCorrect:0,answers:{},updatedAt:new Date().toISOString()}}
function normalizeState(raw){
 const x=raw&&typeof raw==='object'&&raw.schema===SCHEMA&&Number(raw._run||1)===runNo()&&Number(raw.total)===total?raw:{};
 const base=blank();
 const done=unique(x.done).filter(validIndex);
 const review={};
 for(const [k,v] of Object.entries(x.review&&typeof x.review==='object'?x.review:{})){
  const i=Number(k),stage=Number(v);if(validIndex(i)&&!done.includes(i)&&stage>0)review[i]=stage;
 }
 const tries={};
 for(const [k,v] of Object.entries(x.tries&&typeof x.tries==='object'?x.tries:{})){
  const i=Number(k),n=Number(v);if(validIndex(i)&&n>0)tries[i]=n;
 }
 const current=validIndex(x.current)&&!done.includes(Number(x.current))?Number(x.current):null;
 const reviewQueue=unique([...(x.reviewQueue||[]),...Object.keys(review).filter(k=>Number(review[k])===2).map(Number)]).filter(i=>validIndex(i)&&!done.includes(i)&&i!==current);
 const queue=unique(x.queue).filter(i=>validIndex(i)&&!done.includes(i)&&i!==current&&!reviewQueue.includes(i));
 const missing=[...Array(total).keys()].filter(i=>!done.includes(i)&&i!==current&&!queue.includes(i)&&!reviewQueue.includes(i));
 queue.push(...shuffle(missing));
 return{...base,...x,schema:SCHEMA,_run:runNo(),total,done,queue,reviewQueue,current,review,tries,firstSeen:unique(x.firstSeen).filter(validIndex),firstCorrect:Math.max(0,Number(x.firstCorrect)||0),answers:x.answers&&typeof x.answers==='object'?x.answers:{}};
}
function load(){try{return normalizeState(JSON.parse(store.getItem(KEY)||'null'))}catch(e){return blank()}}
function save(state){const out=normalizeState(state);out.updatedAt=new Date().toISOString();try{store.setItem(KEY,JSON.stringify(out))}catch(e){};return out}
function first(state,index,ok){if(!state.firstSeen.includes(index)){state.firstSeen.push(index);if(ok)state.firstCorrect++}}
function nextIndex(){
 let state=load();
 if(validIndex(state.current)&&!state.done.includes(Number(state.current)))return Number(state.current);
 while(state.queue.length&&state.done.includes(state.queue[0]))state.queue.shift();
 if(!state.queue.length)while(state.reviewQueue.length&&state.done.includes(state.reviewQueue[0]))state.reviewQueue.shift();
 if(!state.queue.length&&!state.reviewQueue.length){
  const missing=[...Array(total).keys()].filter(i=>!state.done.includes(i));
  if(missing.length)state.queue=shuffle(missing.filter(i=>Number(state.review?.[i]||0)!==2));
  if(!state.queue.length)state.reviewQueue=shuffle(missing);
 }
 const next=state.queue.length?state.queue.shift():state.reviewQueue.shift();
 state.current=validIndex(next)?Number(next):null;
 save(state);
 return state.current;
}
function wrong(index,answer){
 let state=load(),i=Number(index);if(!validIndex(i))return{state,tries:0,stage:0};
 first(state,i,false);state.current=i;state.answers[i]=answer;state.tries[i]=Number(state.tries[i]||0)+1;if(!state.review[i])state.review[i]=1;state=save(state);
 return{state,tries:state.tries[i],stage:Number(state.review[i]||1)};
}
function right(index,answer){
 let state=load(),i=Number(index);if(!validIndex(i))return{state,needsReview:false};
 first(state,i,true);state.answers[i]=answer;
 const stage=Number(state.review[i]||0),tries=Number(state.tries[i]||0);let needsReview=false;
 if(stage===2){delete state.review[i];delete state.tries[i];state.reviewQueue=state.reviewQueue.filter(x=>Number(x)!==i);if(!state.done.includes(i))state.done.push(i)}
 else if(stage===1||tries>0){state.review[i]=2;state.tries[i]=0;state.queue=state.queue.filter(x=>Number(x)!==i);if(!state.reviewQueue.includes(i))state.reviewQueue.push(i);needsReview=true}
 else{delete state.review[i];delete state.tries[i];if(!state.done.includes(i))state.done.push(i)}
 state.current=null;state=save(state);return{state,needsReview};
}
function equal(answer,expected){const a=norm(answer);return(Array.isArray(expected)?expected:[expected]).some(x=>norm(x)===a)}

function motherLang(){
 const p=profile(),raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();
 if(/uk|ua|ukrain/.test(raw))return{code:'uk',label:'Ukrainisch'};
 if(/ru|russ/.test(raw))return{code:'ru',label:'Russisch'};
 if(/tr|türk|turk/.test(raw))return{code:'tr',label:'Türkisch'};
 if(/ar|arab/.test(raw))return{code:'ar',label:'Arabisch'};
 if(/ja|japan/.test(raw))return{code:'ja',label:'Japanisch'};
 if(/ro|rum|roman/.test(raw))return{code:'ro',label:'Rumänisch'};
 if(/pl|pol/.test(raw))return{code:'pl',label:'Polnisch'};
 if(/ku|kurd/.test(raw))return{code:'ku',label:'Kurdisch'};
 return{code:'en',label:'Englisch'};
}
function cardTranslation(card){
 const lang=motherLang();
 const objects=[card?.translations,card?.tr,card?.translation,card?.i18n];
 for(const obj of objects){
  if(typeof obj==='string'&&obj.trim())return{label:lang.label,text:obj.trim()};
  if(obj&&typeof obj==='object'&&typeof obj[lang.code]==='string'&&obj[lang.code].trim())return{label:lang.label,text:obj[lang.code].trim()};
 }
 return{label:lang.label,text:''};
}
function imageUrl(card){const raw=String(card?.image||card?.img||'').trim();if(!raw)return'';if(/^https?:\/\//i.test(raw))return raw;return`https://sprachpilot.b-cdn.net/${raw.split('/').filter(Boolean).map(encodeURIComponent).join('/')}`}
function cardAccepted(card){return[card?.full,card?.term,card?.word,...(card?.answers||[]),...(card?.accepted||[])].filter(Boolean)}

let activeAudio=null;
function tts(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
function say(text,audioFile){
 if(activeAudio){try{activeAudio.pause();activeAudio.currentTime=0}catch(e){}activeAudio=null}
 if(audioFile){const raw=String(audioFile||''),src=/^https?:\/\//i.test(raw)?raw:`https://sprachpilot.b-cdn.net/audio/${raw.replace(/^audio\//i,'')}`;const a=new Audio(src);activeAudio=a;a.onerror=()=>{if(activeAudio===a)activeAudio=null;tts(text)};a.onended=()=>{if(activeAudio===a)activeAudio=null};a.play().catch(()=>tts(text));return}
 tts(text);
}
function feedback(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`}
function previewNote(){return teacherPreview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function taskHead(state){const pct=total?Math.min(100,Math.round((state.done?.length||0)/total*100)):0;return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe 1</span><h1>Karteikarten</h1><p>🃏 Lerne die Wörter.</p></div><div class="l8-progress-row"><span>${state.done.length} von ${total} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`}
function finish(){if(!root)return;root.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast die Aufgabe zu 100 % abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}
function fatal(text){if(root)root.innerHTML=`<div class="l8-wrap"><section class="l8-card"><h2>Karteikarten</h2><p>${esc(text)}</p><div class="l8-row"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}

function dictate(target,onText){
 const R=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!R){feedback('warn','Das Mikrofon wird auf diesem Gerät nicht unterstützt. Bitte schreibe deine Antwort.');target?.focus?.();return}
 if(recognition)try{recognition.abort()}catch(e){}
 try{recognition=new R()}catch(e){feedback('warn','Das Mikrofon konnte nicht gestartet werden. Bitte schreibe deine Antwort.');target?.focus?.();return}
 recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;
 feedback('warn','Ich höre zu …');
 recognition.onresult=e=>{const values=Array.from(e.results?.[0]||[]).map(x=>x.transcript).filter(Boolean);onText(values)};
 recognition.onerror=()=>{feedback('warn','Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe deine Antwort.');target?.focus?.()};
 recognition.onend=()=>{recognition=null};
 try{recognition.start()}catch(e){feedback('warn','Das Mikrofon konnte nicht gestartet werden. Bitte schreibe deine Antwort.')}
}

function renderCards(){
 if(!root)return;
 if(!total)return fatal('Die Karten konnten nicht geladen werden.');
 let state=load(),idx=nextIndex();
 if(idx==null||idx<0)return finish();
 state=load();
 const card=cards[idx];
 if(!card)return fatal('Die Karte konnte nicht geladen werden.');
 const src=imageUrl(card),translation=cardTranslation(card),term=String(card.full||card.term||card.word||''),plural=String(card.plural||'');
 root.innerHTML=`<div class="l8-wrap l8-card-standard">${previewNote()}${taskHead(state)}<section class="l8-card l8-card-stage"><div class="l8-flip-wrap"><div class="l8-flip-card" id="l8FlipCard" tabindex="0" role="button" aria-label="Karte umdrehen"><div class="l8-flip-face l8-flip-front">${src?`<div class="l8-card-visual"><img src="${esc(src)}" alt="" loading="eager" decoding="async" onerror="this.hidden=true"></div>`:'<div class="l8-card-visual l8-card-blank">Bild nicht verfügbar</div>'}<div class="l8-card-translation"><span>${esc(translation.label)}</span><strong>${esc(translation.text||'Wie heißt das auf Deutsch?')}</strong></div></div><div class="l8-flip-face l8-flip-back"><div class="l8-flip-back-grid">${src?`<div class="l8-back-image"><img src="${esc(src)}" alt="" loading="eager" decoding="async"></div>`:''}<div class="l8-back-info"><div class="l8-flip-word">${esc(term)}</div>${translation.text?`<div class="l8-card-translation"><span>${esc(translation.label)}</span><strong>${esc(translation.text)}</strong></div>`:''}${plural?`<div class="l8-card-detail"><span>Plural</span><strong>${esc(plural)}</strong></div>`:''}<button class="l8-btn l8-audio l8-card-listen" id="cardListen" type="button">🔊 Anhören</button></div></div></div></div></div><div class="l8-row l8-center-actions l8-card-actions"><button class="l8-btn primary" id="cardMic" type="button">🎤 Sprechen</button><button class="l8-btn" id="cardWrite" type="button">✍️ Schreiben</button></div><div class="l8-card-write" id="cardWriteBox" hidden><div class="l8-answer-row"><input class="l8-input" id="cardInput" autocomplete="off" placeholder="Wort schreiben"><button class="l8-btn primary" id="cardCheck" type="button">Prüfen</button></div></div><div id="feedback"></div></section></div>`;

 const flip=()=>{
  const node=document.getElementById('l8FlipCard');if(!node||node.classList.contains('flipped'))return;
  node.classList.add('flipped','is-flipped');
  const r=wrong(idx,'Karte umgedreht'),n=r.tries;
  feedback(n===1?'bad':'warn',n===1?'Du hast die Lösung angesehen. Sprich oder schreibe das Wort jetzt selbst.':n===2?'Achte auf Artikel und genaue Wortform.':`Lösung: ${term}. Gib sie jetzt selbst ein.`);
 };
 const checkValue=value=>{
  if(!String(value||'').trim()||busy)return;
  if(equal(value,cardAccepted(card))){
   busy=true;const r=right(idx,value);feedback('good',r.needsReview?'Richtig. Diese Karte kommt am Ende noch einmal.':'Richtig!');
   setTimeout(()=>{busy=false;renderCards()},550);
  }else{
   const r=wrong(idx,value),n=r.tries;
   if(n===1)feedback('bad','Noch nicht richtig. Versuch es noch einmal.');
   else if(n===2)feedback('warn','Achte auf Artikel und genaue Wortform.');
   else feedback('warn',`Lösung: ${term}. Gib sie jetzt selbst ein.`);
  }
 };
 const flipNode=document.getElementById('l8FlipCard');
 flipNode.onclick=e=>{if(!e.target.closest('button,input'))flip()};
 flipNode.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}};
 document.getElementById('cardListen').onclick=e=>{e.stopPropagation();say(term,card.audio)};
 const input=document.getElementById('cardInput');
 document.getElementById('cardWrite').onclick=()=>{document.getElementById('cardWriteBox').hidden=false;input.focus({preventScroll:true})};
 document.getElementById('cardCheck').onclick=()=>checkValue(input.value);
 input.onkeydown=e=>{if(e.key==='Enter')checkValue(e.target.value)};
 document.getElementById('cardMic').onclick=()=>dictate(input,values=>checkValue(values.find(v=>equal(v,cardAccepted(card)))||values[0]||''));
 setTimeout(()=>window.SPCardTaskStandard?.normalizeCard?.(),0);
 setTimeout(()=>window.SPCardTaskStandard?.autoScrollToImage?.(true),140);
}

try{save(load());renderCards()}catch(error){console.error('L10T1 Karteikarten failed',error);fatal('Die Karteikarten konnten nicht geladen werden.')}
})();
