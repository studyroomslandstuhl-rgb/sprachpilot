(function(){
'use strict';
if(window.__SP_VERB_UI_STANDARD_UPDATES_V5)return;
window.__SP_VERB_UI_STANDARD_UPDATES_V5=true;
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

const A1_SENTENCES={
 lieben:'Maria liebt ihre Familie.',
 kaufen:'Ich kaufe Brot.',
 verstehen:'Maria versteht die Frage.',
 brauchen:'Ich brauche Hilfe.',
 hören:'Maria hört Musik.',
 lernen:'Ich lerne Deutsch.',
 wohnen:'Maria wohnt in Berlin.',
 bringen:'Ich bringe Wasser.',
 sein:'Maria ist zu Hause.',
 schreiben:'Ich schreibe eine Nachricht.',
 fotografieren:'Maria fotografiert die Natur.',
 telefonieren:'Maria telefoniert mit ihrer Mutter.',
 kochen:'Ich koche Suppe.',
 leben:'Maria lebt in Deutschland.',
 kommen:'Der Bus kommt um acht Uhr.',
 buchstabieren:'Ich buchstabiere meinen Namen.',
 gehen:'Maria geht zur Schule.',
 schwimmen:'Ich schwimme im Schwimmbad.',
 suchen:'Maria sucht ihre Schlüssel.',
 bestellen:'Ich bestelle einen Kaffee.'
};
function targetSentence(groupId,verb){
 const special=A1_SENTENCES[verb];if(special)return special;
 const stored=String(window.SP_VERB_SENTENCES?.[verb]||'').trim();
 if(stored&&!/Ich lerne das Verb/i.test(stored))return stored;
 const useThird=(Math.abs((groupId||1)+(E.GROUPS?.[groupId-1]?.verbs?.indexOf(verb)||0))%2)===0;
 return useThird?`Maria ${E.displayForm(verb,2)}.`:`Ich ${E.displayForm(verb,0)}.`;
}
function sentenceTokens(sentence){
 return sentence.match(/[A-Za-zÄÖÜäöüß]+(?:['’-][A-Za-zÄÖÜäöüß]+)*|\d+(?::\d+)?|[^\sA-Za-zÄÖÜäöüß\d]/g)||[];
}

// Satz bauen: sinnvoller A1-Satz aus gemischten Bausteinen.
// "Satz hören" ist reine Hilfe: kein Fehler, keine Wiederholung, keine negative Wertung.
function enhanceSentenceBlocks(){
 const r=route();if(r.task!=='sentence'||!r.group)return;
 const card=document.querySelector('.question-card');
 if(!card||card.dataset.fullSentenceBlocks==='2')return;
 const verb=E.taskState(r.group,'sentence')?.current;if(!verb)return;
 const form=card.querySelector('.answer-form');if(!form)return;
 card.dataset.fullSentenceBlocks='2';form.hidden=true;
 const sentence=targetSentence(r.group,verb);
 const question=card.querySelector('.question');if(question)question.textContent='Bringe die Wörter in die richtige Reihenfolge.';
 const source=shuffle(sentenceTokens(sentence).map((text,i)=>({id:i,text})));
 const wrap=document.createElement('div');wrap.className='sentence-block-builder';
 wrap.innerHTML='<div class="sentence-help"><button type="button" class="btn secondary" id="sentenceListen">🔊 Satz hören</button><span class="small">Hilfe</span></div><div class="sentence-built" aria-live="polite"><span class="small">Baue den Satz.</span></div><div class="sentence-bank"></div><div class="sentence-block-actions"><button type="button" class="btn" id="sentenceCheck">Kontrollieren</button><button type="button" class="btn secondary" id="sentenceReset">Zurücksetzen</button></div><div class="sentence-block-feedback"></div>';
 form.before(wrap);
 const built=wrap.querySelector('.sentence-built'),bank=wrap.querySelector('.sentence-bank'),feedback=wrap.querySelector('.sentence-block-feedback');
 let chosen=[];
 function draw(){
  built.innerHTML=chosen.length?chosen.map((t,i)=>`<button type="button" class="sentence-token chosen" data-chosen="${i}">${t.text}</button>`).join(''):'<span class="small">Baue den Satz.</span>';
  bank.innerHTML=source.filter(t=>!chosen.includes(t)).map(t=>`<button type="button" class="sentence-token" data-token="${t.id}">${t.text}</button>`).join('');
  built.querySelectorAll('[data-chosen]').forEach(b=>b.onclick=()=>{chosen.splice(Number(b.dataset.chosen),1);draw()});
  bank.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{const t=source.find(x=>x.id===Number(b.dataset.token));if(t){chosen.push(t);draw()}});
 }
 function value(){return chosen.map(x=>x.text).join(' ').replace(/\s+([.,!?;:])/g,'$1').trim()}
 function showWrong(n){feedback.className='sentence-block-feedback feedback no';feedback.innerHTML=n===1?'Da ist noch ein Fehler.':n===2?'Tipp: Höre den Satz und prüfe die Reihenfolge.':`Lösung: <strong>${sentence}</strong>`}
 wrap.querySelector('#sentenceListen').onclick=()=>sentenceSpeak(sentence);
 wrap.querySelector('#sentenceCheck').onclick=()=>{
  const val=value();
  if(norm(val)===norm(sentence)){
   feedback.className='sentence-block-feedback feedback ok';feedback.textContent='Richtig!';
   const pi=E.personFor(r.group,'sentence',verb),expected=E.displayForm(verb,pi),input=form.querySelector('#answerInput'),check=form.querySelector('[data-action="check-input"]');
   if(input)input.value=expected;
   if(check)check.click();
   return;
  }
  showWrong(E.markWrong(r.group,'sentence'));chosen=[];draw();
 };
 wrap.querySelector('#sentenceReset').onclick=()=>{chosen=[];draw()};
 draw();
}

function enhance(){fixSingleBackButton();fixCardReveal();enhanceAudioChoices();enhanceSentenceBlocks()}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);schedule();

const style=document.createElement('style');
style.textContent=`
.audio-choice-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
.audio-choice-row{display:grid;gap:8px;padding:10px;border:2px solid var(--line,#d9eef7);border-radius:18px;background:#fff}
.audio-choice-row .btn,.audio-choice-row .option{width:100%;margin:0;min-height:52px}
.sentence-block-builder{display:grid;gap:16px;margin-top:18px}
.sentence-help{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}
.sentence-built,.sentence-bank{min-height:72px;padding:14px;border:2px solid var(--line,#d9eef7);border-radius:18px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;background:#fff}
.sentence-built{background:#f7fbfd}
.sentence-token{border:2px solid #b9dce7;border-radius:12px;background:#fff;padding:10px 14px;font:inherit;font-weight:800;color:#17324d;cursor:pointer}
.sentence-token.chosen{background:#eef8fb}
.sentence-block-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.sentence-block-feedback{text-align:center}
@media(max-width:560px){.audio-choice-grid{grid-template-columns:1fr!important}.sentence-token{padding:9px 11px}}
`;
document.head.appendChild(style);
})();
