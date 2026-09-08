const D=window.L10T1||{cards:[],tasks:[]};
const cards=Array.isArray(D.cards)?D.cards:[];
const root=document.getElementById('app');
const KEY='SP_L10_T1_karteikarten';
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const total=cards.length;
const byId=Object.fromEntries(cards.map(x=>[x.id,x]));
let recognition=null;
let busy=false;

// Lektion 10 hat überall dieselbe Pastellrosa-Palette.
document.documentElement.setAttribute('data-sp-card-lesson','10');
const COLORS={
 '--lesson-main':'#F4A3A3','--lesson-main-dark':'#A86464','--lesson-dark':'#A86464',
 '--lesson-main-light':'#F9DEDE','--lesson-soft':'#FDF1F1','--lesson-main-soft':'#FDF1F1',
 '--lesson-line':'#F3C9C9','--lesson-bg':'#FFF9F9','--lesson-text':'#4E3030','--lesson-ink':'#4E3030',
 '--lesson-muted':'#806767','--lesson-on-main':'#572F2F'
};
Object.entries(COLORS).forEach(([k,v])=>document.documentElement.style.setProperty(k,v));

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const isTeacher=(()=>{try{return ['teacher','lehrer','admin','owner','superadmin'].includes(String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase())||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}catch(e){return false}})();
const stateStore=isTeacher?sessionStorage:localStorage;

function run(){try{return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}catch(e){return 1}}
function base(){return{_run:run(),order:shuffle(cards.map(x=>x.id)),done:[],firstCorrect:[],total,updatedAt:Date.now()}}
function save(s=state){s._run=run();s.total=total;s.updatedAt=Date.now();try{stateStore.setItem(KEY,JSON.stringify(s))}catch(e){}}
function load(){
 let s=null;
 try{s=JSON.parse(stateStore.getItem(KEY)||'null')}catch(e){}
 if(!s||Number(s._run||1)!==run()||!Array.isArray(s.order)||s.order.length!==total||cards.some(c=>!s.order.includes(c.id)))s=base();
 s.done=Array.isArray(s.done)?s.done.filter(id=>byId[id]):[];
 s.firstCorrect=Array.isArray(s.firstCorrect)?s.firstCorrect.filter(id=>byId[id]):[];
 s.total=total;
 save(s);
 return s;
}
let state=load();
function current(){const id=state.order.find(id=>!state.done.includes(id));return id?byId[id]:null}
function pct(){return total?Math.round(state.done.length/total*100):0}
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function languageLabel(){const p=profile(),raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/uk|ua|ukrain/.test(raw))return'Ukrainisch';if(/ru|russ/.test(raw))return'Russisch';if(/tr|türk|turk/.test(raw))return'Türkisch';if(/ar|arab/.test(raw))return'Arabisch';if(/ja|japan/.test(raw))return'Japanisch';if(/ro|rum|rom/.test(raw))return'Rumänisch';if(/pl|pol/.test(raw))return'Polnisch';if(/ku|kurd/.test(raw))return'Kurdisch';return'Englisch'}
function head(){return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe 1</span><h1>Karteikarten</h1><p>🃏 Lerne die Wörter.</p></div><div class="l8-progress-row"><span>${state.done.length} von ${total} fertig</span><strong>${pct()}%</strong></div><div class="l8-progress"><div style="width:${pct()}%"></div></div></section>`}
function shell(content){
 if(!root)return;
 root.innerHTML=`<div class="l10-task-page"><div class="l8-wrap">${head()}${content}</div></div>`;
 setTimeout(()=>window.SPCardTaskStandard?.normalizeCard?.(),0);
 setTimeout(()=>window.SPTaskAutoScroll?.schedule?.(0,'render'),40);
}
function fatal(text){if(root)root.innerHTML=`<div class="l10-task-page"><div class="l8-wrap"><section class="l8-card"><h2>Karteikarten</h2><p>${esc(text)}</p><p><a class="l8-btn" href="./">Zurück zur Themenübersicht</a></p></section></div></div>`}
function fallbackSpeech(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.82;speechSynthesis.speak(u)}catch(e){}}
function playAudio(item){const text=item.full||item.term||'';const url=item.audio||`https://sprachpilot.b-cdn.net/audio/${encodeURIComponent(item.id)}.mp3`;let settled=false,a=null,timer=null;const fallback=()=>{if(settled)return;settled=true;try{a?.pause()}catch(e){}fallbackSpeech(text)};try{a=new Audio(url);a.preload='none';a.addEventListener('playing',()=>{settled=true;if(timer)clearTimeout(timer)},{once:true});a.addEventListener('error',()=>{if(timer)clearTimeout(timer);fallback()},{once:true});timer=setTimeout(fallback,1200);a.play().catch(()=>{if(timer)clearTimeout(timer);fallback()})}catch(e){fallback()}}
function accepted(item,value){const n=norm(value);return n===norm(item.full)||n===norm(item.term)}
function feedback(text,type=''){const box=document.getElementById('feedback');if(!box)return;box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`}
function markDone(item,firstCorrect=false){if(busy)return;busy=true;if(!state.done.includes(item.id))state.done.push(item.id);if(firstCorrect&&!state.firstCorrect.includes(item.id))state.firstCorrect.push(item.id);save();setTimeout(()=>{busy=false;render()},320)}
function finish(){shell(`<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast alle ${total} Karteikarten bearbeitet.</p><div class="l8-row l8-center-actions"><a class="l8-btn" href="./">Zur Übersicht</a><a class="l8-btn primary" href="task.html?task=bild-wort">Weiter</a></div></section>`)}
function startRecognition(item){
 const R=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!R){feedback('Sprechen wird von diesem Browser nicht unterstützt. Bitte schreibe das Wort.','warn');return}
 if(recognition)try{recognition.abort()}catch(e){}
 recognition=new R();recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;
 const mic=document.getElementById('cardMic');if(mic)mic.textContent='🎤 …';
 recognition.onresult=e=>{const vals=Array.from(e.results?.[0]||[]).map(x=>x.transcript).filter(Boolean);if(vals.some(v=>accepted(item,v))){feedback('Richtig!','good');markDone(item,true)}else feedback('Noch einmal.','bad')};
 recognition.onerror=()=>feedback('Das Mikrofon hat nicht funktioniert. Bitte schreibe das Wort.','warn');
 recognition.onend=()=>{recognition=null;const m=document.getElementById('cardMic');if(m)m.textContent='🎤 Sprechen'};
 try{recognition.start()}catch(e){feedback('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe das Wort.','warn')}
}
function render(){
 if(!root)return;
 if(!total){fatal('Die Karten konnten nicht geladen werden. Bitte lade die Seite neu.');return}
 const item=current();if(!item)return finish();
 const lang=languageLabel(),translation=item.translation||'–';
 shell(`<section class="l8-card l8-card-stage"><div class="l8-flip-wrap flip-wrap"><div class="l8-flip-card flip-card" id="studyCard" tabindex="0" role="button" aria-label="Karte umdrehen"><div class="l8-flip-face l8-flip-front flip-face flip-front"><div class="l8-card-visual visual"><img src="${esc(item.image)}" alt="" loading="eager" decoding="async"></div><div class="l8-card-translation card-translation-box"><span>${esc(lang)}</span><strong>${esc(translation)}</strong></div></div><div class="l8-flip-face l8-flip-back flip-face flip-back"><div class="l8-flip-back-grid flip-back-grid"><div class="l8-back-image flip-back-image"><div class="visual"><img src="${esc(item.image)}" alt="" loading="eager" decoding="async"></div></div><div class="l8-back-info flip-back-info"><div class="l8-flip-word flip-word">${esc(item.full)}</div><div class="l8-card-translation card-translation-box back-translation"><span>${esc(lang)}</span><strong>${esc(translation)}</strong></div><div class="card-details"><div class="l8-card-detail"><span>Plural</span><strong>${esc(item.plural)}</strong></div></div><button class="l8-btn l8-audio l8-card-listen btn secondary card-listen-btn" id="cardListen" type="button">🔊 Anhören</button></div></div></div></div></div><div class="l8-row l8-center-actions l8-card-actions actions card-actions"><button class="l8-btn primary btn" id="cardMic" type="button">🎤 Sprechen</button><button class="l8-btn btn secondary" id="cardWrite" type="button">✍️ Schreiben</button></div><div class="l8-card-write l7-answer-box" id="cardWriteBox" hidden><div class="l8-answer-row"><input class="l8-input" id="cardInput" autocomplete="off" placeholder="Wort schreiben"><button class="l8-btn primary btn" id="cardCheck" type="button">Prüfen</button></div></div><div id="feedback"></div></section>`);
 const card=document.getElementById('studyCard');
 const flip=()=>card?.classList.add('flipped','is-flipped');
 if(card){card.onclick=e=>{if(e.target.closest('button,input'))return;flip()};card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}}}
 const listen=document.getElementById('cardListen');if(listen)listen.onclick=e=>{e.stopPropagation();playAudio(item)};
 const write=document.getElementById('cardWrite');if(write)write.onclick=()=>{const box=document.getElementById('cardWriteBox');box.hidden=false;document.getElementById('cardInput')?.focus({preventScroll:true})};
 const check=()=>{const input=document.getElementById('cardInput');if(!String(input?.value||'').trim())return;if(accepted(item,input.value)){feedback('Richtig!','good');markDone(item,true)}else feedback('Noch einmal.','bad')};
 const checkBtn=document.getElementById('cardCheck');if(checkBtn)checkBtn.onclick=check;
 const input=document.getElementById('cardInput');if(input)input.onkeydown=e=>{if(e.key==='Enter')check()};
 const mic=document.getElementById('cardMic');if(mic)mic.onclick=()=>startRecognition(item);
 document.querySelectorAll('.l8-card-visual img,.l8-back-image img').forEach(img=>img.onerror=()=>{img.style.visibility='hidden'});
 setTimeout(()=>window.SPCardTaskStandard?.normalizeCard?.(),0);
}

try{render()}catch(error){console.error('L10T1 Karteikarten render failed',error);fatal('Die Karten konnten nicht geladen werden. Bitte lade die Seite neu.')}
