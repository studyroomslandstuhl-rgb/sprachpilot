(function(){
'use strict';
if(window.__SP_VERB_UI_STANDARD_UPDATES_V7)return;
window.__SP_VERB_UI_STANDARD_UPDATES_V7=true;
const E=window.VerbGroupsEngine;
if(!E)return;

const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
function route(){const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||''}}
function shuffle(a){a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function bunnyPlay(verb,button){
 const api=window.SPVerbBunnyAllInfinitives;
 try{
  if(api){const resolved=api.resolveVerb?.(verb)||verb;if(api.play?.(resolved,false,button))return;if(api.computerSpeak?.(resolved,false))return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(verb);u.lang='de-DE';u.rate=.92;speechSynthesis.speak(u);
 }catch(e){}
}
function sentenceSpeak(sentence){
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sentence);u.lang='de-DE';u.rate=.88;speechSynthesis.speak(u)}catch(e){}
}

// Im deutschen Verbenbereich gibt es genau einen Zurück-Knopf.
// Aufgabe -> Gruppe, Gruppe -> Verbenübersicht, Verbenübersicht -> Startseite.
function fixSingleBackButton(){
 const r=route(),topnav=document.querySelector('.topnav');if(!topnav)return;
 const back=topnav.querySelector('a.btn.secondary');
 if(back){
  back.textContent='Zurück';
  back.href=r.task&&r.group?`/verben/?group=${r.group}`:r.group?'/verben/':'/index.html';
 }
 topnav.querySelector('[data-action="group"]')?.remove();
 document.querySelector('.task-page-head [data-action="group"]')?.remove();
}

// Beim Umdrehen einer Karte gibt es keinen Weiter-Knopf. Die Karte muss beantwortet werden.
function fixCardReveal(){
 const r=route();if(r.task!=='cards')return;
 document.querySelector('#cardHelpNext')?.remove();
}

// Bild → Hören: vier Hörmöglichkeiten, danach auswählen.
function enhanceAudioChoices(){
 const r=route();if(r.task!=='change')return;
 const grid=document.querySelector('.question-card .option-grid');
 if(!grid||grid.dataset.audioChoicesReady==='1')return;
 const buttons=[...grid.querySelectorAll(':scope > .option[data-action="answer"]')];
 if(buttons.length!==4)return;
 grid.dataset.audioChoicesReady='1';grid.classList.add('audio-choice-grid');
 buttons.forEach((answer,index)=>{
  const verb=answer.dataset.answer||'';
  const row=document.createElement('div');row.className='audio-choice-row';
  const play=document.createElement('button');play.type='button';play.className='btn secondary audio-choice-play';play.textContent=`🔊 Hören ${index+1}`;
  play.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();bunnyPlay(verb,play)});
  answer.textContent='Auswählen';answer.classList.add('audio-choice-select');
  grid.insertBefore(row,answer);row.append(play,answer);
 });
}

// Aufgabe 12 bleibt "Satz ergänzen". Die eigentliche Satzlogik kommt zentral aus sentence-task-a1-fix.js.
// Hier wird bewusst kein eigener Satz und kein Satzbaustein-Fallback mehr erzeugt.
function targetSentence(verb){
 const central=String(E.sentence?.(verb)||window.SP_VERB_SENTENCES?.[verb]||'').trim();
 return central;
}
function sentenceTokens(sentence){
 return sentence.match(/[A-Za-zÄÖÜäöüß]+(?:['’-][A-Za-zÄÖÜäöüß]+)*|\d+(?::\d+)?|[^\sA-Za-zÄÖÜäöüß\d]/g)||[];
}
function enhanceSentenceBlocks(){return}

function enhance(){fixSingleBackButton();fixCardReveal();enhanceAudioChoices()}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);schedule();

const style=document.createElement('style');
style.textContent=`
.audio-choice-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
.audio-choice-row{display:grid;gap:8px;padding:10px;border:2px solid var(--line,#d9eef7);border-radius:18px;background:#fff}
.audio-choice-row .btn,.audio-choice-row .option{width:100%;margin:0;min-height:52px}
@media(max-width:560px){.audio-choice-grid{grid-template-columns:1fr!important}}
`;
document.head.appendChild(style);
})();
