import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';

const D=window.L10T1||{cards:[],tasks:[]};
const cards=D.cards||[];
const root=document.getElementById('app');
const taskId=String(new URLSearchParams(location.search).get('task')||'');
const task=(D.tasks||[]).find(t=>t.id===taskId)||{};
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const KEY=`SP_L10_T1_${taskId}`;
const byId=Object.fromEntries(cards.map(x=>[x.id,x]));
const total=cards.length;
let busy=false;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function run(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}
function base(){return{_run:run(),order:shuffle(cards.map(x=>x.id)),done:[],firstCorrect:[],total,updatedAt:Date.now()}}
function load(){let s=null;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){};if(!s||Number(s._run||1)!==run()||!Array.isArray(s.order)||s.order.length!==total||cards.some(c=>!s.order.includes(c.id)))s=base();s.done=Array.isArray(s.done)?s.done.filter(id=>byId[id]):[];s.firstCorrect=Array.isArray(s.firstCorrect)?s.firstCorrect:[];s.total=total;save(s);return s}
let state=load();
function save(s=state){s._run=run();s.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function current(){const id=state.order.find(id=>!state.done.includes(id));return id?byId[id]:null}
function pct(){return total?Math.round(state.done.length/total*100):0}
function header(){return renderSpHeader({subtitle:`${task.title||'Hören'} · A1 Lektion 10 · Thema 1`,color:{main:'#F4A3A3',dark:'#A86464',soft:'#FDF1F1',line:'#F3C9C9'}})}
function head(){const n=(D.tasks||[]).findIndex(t=>t.id===taskId)+1;return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${n}</span><h1>${esc(task.title||'Hören')}</h1><p>${esc(task.icon||'🎧')} ${esc(task.text||'Höre genau zu.')}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${total} fertig</span><strong>${pct()}%</strong></div><div class="l8-progress"><div style="width:${pct()}%"></div></div></section>`}
function shell(content){root.innerHTML=`<div class="l10-task-page">${header()}<div class="l8-wrap">${head()}${content}<footer>© SprachPilot</footer></div></div>`;bindSpHeader(root);setTimeout(()=>window.SPTaskAutoScroll?.schedule?.(0,'render'),30)}
function fallbackSpeech(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.82;speechSynthesis.speak(u)}catch(e){}}
function playAudio(item){const text=item.full||item.term||'';const url=item.audio||`https://sprachpilot.b-cdn.net/audio/${encodeURIComponent(item.id)}.mp3`;let settled=false;let a=null;let timer=null;const fallback=()=>{if(settled)return;settled=true;try{a?.pause()}catch(e){}fallbackSpeech(text)};try{a=new Audio(url);a.preload='none';a.addEventListener('playing',()=>{settled=true;if(timer)clearTimeout(timer)},{once:true});a.addEventListener('error',()=>{if(timer)clearTimeout(timer);fallback()},{once:true});timer=setTimeout(fallback,1400);a.play().catch(()=>{if(timer)clearTimeout(timer);fallback()})}catch(e){fallback()}}
function feedback(text,ok){const box=document.getElementById('feedback');if(!box)return;box.className=`l8-feedback ${ok?'good':'bad'}`;box.textContent=text}
function mark(item){if(!state.done.includes(item.id))state.done.push(item.id);if(!state.firstCorrect.includes(item.id))state.firstCorrect.push(item.id);save();busy=true;setTimeout(()=>{busy=false;render()},420)}
function finish(){shell(`<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast diese Aufgabe zu 100% abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn" href="./">Zur Übersicht</a></div></section>`)}
function optionsFor(item){return shuffle([item,...shuffle(cards.filter(x=>x.id!==item.id)).slice(0,3)])}
function renderImageChoice(item){const opts=optionsFor(item);shell(`<section class="l8-card l8-exercise"><div class="l10-question-label">Höre das Wort. Welches Bild passt?</div><div class="l10-audio-stage"><button class="l8-btn primary" id="listenBtn" type="button">🔊 Anhören</button></div><div class="l10-options l8-options">${opts.map(o=>`<button class="l8-option l10-image-choice" data-id="${esc(o.id)}" type="button"><img src="${esc(o.image)}" alt="" loading="lazy" decoding="async" onerror="this.remove()"></button>`).join('')}</div><div id="feedback" aria-live="polite"></div></section>`);document.getElementById('listenBtn').onclick=()=>playAudio(item);document.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{if(busy)return;if(b.dataset.id===item.id){b.classList.add('correct');feedback('Richtig!',true);mark(item)}else{b.classList.add('wrong');feedback('Noch einmal.',false)}})}
function renderWrite(item){shell(`<section class="l8-card l8-exercise"><div class="l10-question-label">Höre und schreibe das Wort.</div><div class="l10-audio-stage"><button class="l8-btn primary" id="listenBtn" type="button">🔊 Anhören</button></div><div class="l8-answer-row"><input class="l8-input" id="answerInput" autocomplete="off" placeholder="Wort schreiben"><button class="l8-btn primary" id="checkBtn" type="button">Prüfen</button></div><div id="feedback" aria-live="polite"></div></section>`);document.getElementById('listenBtn').onclick=()=>playAudio(item);const input=document.getElementById('answerInput');const check=()=>{if(busy||!String(input.value||'').trim())return;const n=norm(input.value);if(n===norm(item.term)||n===norm(item.full)){feedback(`Richtig: ${item.full}`,true);mark(item)}else feedback('Noch einmal.',false)};document.getElementById('checkBtn').onclick=check;input.onkeydown=e=>{if(e.key==='Enter')check()};input.focus({preventScroll:true});setTimeout(()=>playAudio(item),180)}
function render(){const item=current();if(!item)return finish();if(taskId==='hoeren-bild')return renderImageChoice(item);return renderWrite(item)}
render();
