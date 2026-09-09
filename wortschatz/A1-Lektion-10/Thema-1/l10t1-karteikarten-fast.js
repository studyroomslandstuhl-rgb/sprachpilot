(function(){
'use strict';
const D=window.L10T1||{};
const cards=Array.isArray(D.cards)?D.cards:[];
const root=document.getElementById('app');
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const LEGACY_KEY='SP_L10_T1_karteikarten';
const total=cards.length;
const preview=()=>{try{const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}catch(e){return false}};
const owner=()=>{try{const p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{};return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}catch(e){return'student'}};
const storage=()=>preview()?sessionStorage:localStorage;
const stateKey=()=>preview()?`SP_L10_PREVIEW_T1_karteikarten`:`SP_L10_${owner()}_T1_karteikarten`;
const labels={en:'Englisch',ru:'Russisch',uk:'Ukrainisch',tr:'Türkisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
const langCode=String(window.L10T1Translations?.code||'en');
const langLabel=labels[langCode]||'Englisch';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFC').trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const equal=(v,card)=>[card.full,card.term,card.word].filter(Boolean).some(x=>norm(v)===norm(x));
const run=()=>Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function blank(){return{schema:2,_run:run(),total,done:[],queue:shuffle([...Array(total).keys()]),review:[],tries:{},current:null,updatedAt:Date.now()}}
function load(){try{const store=storage(),key=stateKey();let rawText=store.getItem(key);if(!rawText&&!preview()&&owner()==='student')rawText=localStorage.getItem(LEGACY_KEY);const raw=JSON.parse(rawText||'null');if(!raw||Number(raw.schema)!==2||Number(raw._run)!==run()||Number(raw.total)!==total)return blank();raw.done=Array.isArray(raw.done)?raw.done.filter(i=>Number.isInteger(i)&&i>=0&&i<total):[];raw.queue=Array.isArray(raw.queue)?raw.queue.filter(i=>Number.isInteger(i)&&i>=0&&i<total&&!raw.done.includes(i)):[];raw.review=Array.isArray(raw.review)?raw.review.filter(i=>Number.isInteger(i)&&i>=0&&i<total&&!raw.done.includes(i)):[];raw.tries=raw.tries&&typeof raw.tries==='object'?raw.tries:{};if(raw.current!=null&&(!Number.isInteger(raw.current)||raw.current<0||raw.current>=total||raw.done.includes(raw.current)))raw.current=null;return raw}catch(e){return blank()}}
let state=load(),syncTimer=0,importing=false;
function queueProgress(){
 if(preview()||!total)return;
 const percent=Math.max(0,Math.min(100,Math.round(state.done.length/total*100)));
 if(percent<=0)return;
 const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:10,theme:1,topicId:TOPIC,title:'A1 Lektion 10 · Thema 1',file:'task.html?task=karteikarten',taskKey:'karteikarten',taskTitle:'Karteikarten',run:run(),total,done:state.done.length,percent,completed:percent>=100};
 const send=()=>{if(window.SPProgress?.recordTaskProgress)window.SPProgress.recordTaskProgress(payload).catch(()=>{});else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload});if(!importing){importing=true;import('/js/progress.js?v=20260831-central6').catch(()=>{}).finally(()=>{importing=false})}}};
 clearTimeout(syncTimer);syncTimer=setTimeout(send,120);
}
function save(){state.schema=2;state._run=run();state.total=total;state.updatedAt=Date.now();try{storage().setItem(stateKey(),JSON.stringify(state))}catch(e){}queueProgress()}
function nextIndex(){if(Number.isInteger(state.current)&&!state.done.includes(state.current))return state.current;while(state.queue.length&&state.done.includes(state.queue[0]))state.queue.shift();while(!state.queue.length&&state.review.length&&state.done.includes(state.review[0]))state.review.shift();if(!state.queue.length&&!state.review.length){const missing=[...Array(total).keys()].filter(i=>!state.done.includes(i));if(!missing.length)return null;state.queue=shuffle(missing)}state.current=state.queue.length?state.queue.shift():state.review.shift();save();return state.current}
function markWrong(i){const n=Number(state.tries[i]||0)+1;state.tries[i]=n;if(!state.review.includes(i))state.review.push(i);save();return n}
function markRight(i){const hadWrong=Number(state.tries[i]||0)>0;state.current=null;if(hadWrong&&state.review.includes(i)){state.review=state.review.filter(x=>x!==i);state.queue.push(i);state.tries[i]=0;save();return true}state.review=state.review.filter(x=>x!==i);delete state.tries[i];if(!state.done.includes(i))state.done.push(i);save();return false}
function pct(){return total?Math.round(state.done.length/total*100):0}
function taskHead(){return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe 1</span><h1>Karteikarten</h1><p>🃏 Lerne die Wörter.</p></div><div class="l8-progress-row"><span>${state.done.length} von ${total} fertig</span><strong>${pct()}%</strong></div><div class="l8-progress"><div style="width:${pct()}%"></div></div></section>`}
function feedback(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`}
function preloadNext(){const pool=[...state.queue,...state.review];const idx=pool.find(i=>Number.isInteger(i)&&!state.done.includes(i));if(idx==null)return;const src=cards[idx]?.image;if(!src)return;const img=new Image();img.decoding='async';img.src=src}
function say(card){const text=card.full||card.term||card.word||'';const src=card.audio||`https://sprachpilot.b-cdn.net/audio/${encodeURIComponent(card.id)}.mp3`;let fallback=false;const tts=()=>{if(fallback)return;fallback=true;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}};try{const a=new Audio(src);a.preload='none';a.onerror=tts;a.play().catch(tts)}catch(e){tts()}}
function finish(){root.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast die Karteikarten zu 100 % abgeschlossen.</p><div class="l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}
function render(){const idx=nextIndex();if(idx==null)return finish();const card=cards[idx];const src=String(card.image||`https://sprachpilot.b-cdn.net/${card.id}.webp`);const translation=String(card.translation||'');const term=String(card.full||card.term||card.word||'');const plural=String(card.plural||'');root.innerHTML=`<div class="l8-wrap">${taskHead()}<section class="l8-card l8-card-stage"><div class="l8-flip-wrap"><div class="l8-flip-card" id="studyCard" tabindex="0" role="button" aria-label="Karte umdrehen"><div class="l8-flip-face l8-flip-front"><div class="l8-card-visual"><img id="frontImg" src="${esc(src)}" alt="" decoding="async" fetchpriority="high"></div><div class="l8-card-translation"><span>${esc(langLabel)}</span><strong>${esc(translation||'Wie heißt das auf Deutsch?')}</strong></div></div><div class="l8-flip-face l8-flip-back"><div class="l8-flip-back-grid"><div class="l8-back-image"><img src="${esc(src)}" alt="" decoding="async"></div><div class="l8-back-info"><div class="l8-flip-word">${esc(term)}</div>${translation?`<div class="l8-card-translation"><span>${esc(langLabel)}</span><strong>${esc(translation)}</strong></div>`:''}${plural?`<div class="l8-card-detail"><span>Plural</span><strong>${esc(plural)}</strong></div>`:''}<button class="l8-btn l8-card-listen" id="cardListen" type="button">🔊 Anhören</button></div></div></div></div></div><div class="l8-card-actions"><button class="btn" id="cardMic" type="button">🎤 Sprechen</button><button class="btn" id="cardWrite" type="button">✍️ Schreiben</button></div><div class="l8-card-write" id="cardWriteBox" hidden><div class="l8-answer-row"><input class="l8-input" id="cardInput" autocomplete="off" autocapitalize="off" placeholder="Wort schreiben"><button class="l8-btn primary" id="cardCheck" type="button">Prüfen</button></div></div><div id="feedback"></div></section></div>`;
 const study=document.getElementById('studyCard');
 let flipped=false;
 const flip=()=>{if(flipped)return;flipped=true;study.classList.add('flipped');const n=markWrong(idx);feedback(n===1?'bad':'warn',n===1?'Du hast die Lösung angesehen. Sprich oder schreibe das Wort jetzt selbst.':n===2?'Achte auf den Artikel und die genaue Wortform.':`Lösung: ${term}. Gib sie jetzt selbst ein.`)};
 study.onclick=e=>{if(e.target.closest('button,input'))return;flip()};study.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}};
 document.getElementById('cardListen').onclick=e=>{e.stopPropagation();say(card)};
 const check=value=>{if(!String(value||'').trim())return;if(equal(value,card)){const reviewAgain=markRight(idx);feedback('good',reviewAgain?'Richtig. Diese Karte kommt am Ende noch einmal.':'Richtig!');setTimeout(render,260)}else{const n=markWrong(idx);feedback(n===1?'bad':'warn',n===1?'Noch nicht richtig. Versuch es noch einmal.':n===2?'Achte auf den Artikel und die genaue Wortform.':`Lösung: ${term}. Gib sie jetzt selbst ein.`)}};
 document.getElementById('cardWrite').onclick=()=>{const box=document.getElementById('cardWriteBox');box.hidden=false;document.getElementById('cardInput').focus({preventScroll:true})};
 document.getElementById('cardCheck').onclick=()=>check(document.getElementById('cardInput').value);document.getElementById('cardInput').onkeydown=e=>{if(e.key==='Enter')check(e.target.value)};
 document.getElementById('cardMic').onclick=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){feedback('warn','Das Mikrofon wird von diesem Browser nicht unterstützt. Bitte schreibe das Wort.');return}let r;try{r=new R()}catch(e){feedback('warn','Das Mikrofon konnte nicht gestartet werden.');return}r.lang='de-DE';r.interimResults=false;r.maxAlternatives=5;feedback('warn','Ich höre zu …');r.onresult=e=>{const values=Array.from(e.results?.[0]||[]).map(x=>x.transcript).filter(Boolean);check(values.find(v=>equal(v,card))||values[0]||'')};r.onerror=()=>feedback('warn','Das Mikrofon hat nicht funktioniert. Bitte schreibe das Wort.');try{r.start()}catch(e){feedback('warn','Das Mikrofon konnte nicht gestartet werden.')}};
 requestAnimationFrame(preloadNext);
}
if(!root||!total){if(root)root.innerHTML='<div class="l8-wrap"><section class="l8-card l8-finish"><h2>Karteikarten konnten nicht geladen werden.</h2><p><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></p></section></div>';return}
render();
})();
