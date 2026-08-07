(function(){
'use strict';
if(window.__SP_VERB_UI_STANDARD_UPDATES_V2)return;
window.__SP_VERB_UI_STANDARD_UPDATES_V2=true;
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

function fixCardReveal(){
 const r=route();if(r.task!=='cards')return;
 const next=document.querySelector('#cardHelpNext');
 if(next)next.remove();
}

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

function buildSentenceTarget(r){
 const current=E.taskState(r.group,'sentence')?.current;if(!current)return null;
 const pi=E.personFor(r.group,'sentence',current),answer=E.displayForm(current,pi);
 const question=document.querySelector('.question-card .question');if(!question)return null;
 let full=String(question.textContent||'').replace(/_{2,}/g,answer).replace(new RegExp(`\\s*\\(${String(current).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\)\\s*`,'i'),' ').replace(/\s+([.,!?;:])/g,'$1').replace(/\s+/g,' ').trim();
 if(!/[.!?]$/.test(full))full+='.';
 return{verb:current,answer,full,question};
}
function tokensOf(sentence){return sentence.match(/[A-Za-zÄÖÜäöüß]+(?:['’-][A-Za-zÄÖÜäöüß]+)*|\d+|[^\sA-Za-zÄÖÜäöüß\d]/g)||[]}
function enhanceSentenceBlocks(){
 const r=route();if(r.task!=='sentence'||!r.group)return;
 const card=document.querySelector('.question-card');if(!card||card.dataset.blocksReady==='1')return;
 const target=buildSentenceTarget(r);if(!target)return;
 const form=card.querySelector('.answer-form');if(!form)return;
 card.dataset.blocksReady='1';form.hidden=true;
 const targetTokens=tokensOf(target.full),bankTokens=shuffle(targetTokens.map((text,i)=>({text,i})));
 const wrap=document.createElement('div');wrap.className='sentence-block-builder';
 wrap.innerHTML='<div class="sentence-built" aria-live="polite"></div><div class="sentence-bank"></div><div class="sentence-block-actions"><button type="button" class="btn secondary sentence-reset">Zurücksetzen</button></div>';
 form.before(wrap);
 const built=wrap.querySelector('.sentence-built'),bank=wrap.querySelector('.sentence-bank');let chosen=[];
 function draw(){
  built.innerHTML=chosen.length?chosen.map((t,i)=>`<button type="button" class="sentence-token chosen" data-chosen="${i}">${t.text}</button>`).join(''):'<span class="small">Baue den Satz.</span>';
  bank.innerHTML=bankTokens.filter(t=>!chosen.includes(t)).map(t=>`<button type="button" class="sentence-token" data-token="${t.i}">${t.text}</button>`).join('');
  built.querySelectorAll('[data-chosen]').forEach(b=>b.onclick=()=>{chosen.splice(Number(b.dataset.chosen),1);draw()});
  bank.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{const t=bankTokens.find(x=>x.i===Number(b.dataset.token));if(t){chosen.push(t);draw();if(chosen.length===targetTokens.length)checkOrder()}});
 }
 function feedback(html,type='no'){const el=card.querySelector('#feedback');if(el){el.className='feedback '+type;el.innerHTML=html}}
 function checkOrder(){
  const value=chosen.map(x=>x.text).join(' ').replace(/\s+([.,!?;:])/g,'$1');
  if(norm(value)===norm(target.full)){
   const input=form.querySelector('#answerInput'),check=form.querySelector('[data-action="check-input"]');if(input)input.value=target.answer;if(check)check.click();return;
  }
  const n=E.markWrong(r.group,'sentence');
  feedback(n===1?'Da ist noch ein Fehler.':n===2?'Tipp: Prüfe die Reihenfolge im Satz.':`Lösung: <strong>${target.full}</strong>`);
  chosen=[];draw();
 }
 wrap.querySelector('.sentence-reset').onclick=()=>{chosen=[];draw()};draw();
}

function enhance(){fixCardReveal();enhanceAudioChoices();enhanceSentenceBlocks()}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);schedule();

const style=document.createElement('style');
style.textContent=`
.audio-choice-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
.audio-choice-row{display:grid;gap:8px;padding:10px;border:2px solid var(--line,#d9eef7);border-radius:18px;background:#fff}
.audio-choice-row .btn,.audio-choice-row .option{width:100%;margin:0;min-height:52px}
.sentence-block-builder{display:grid;gap:16px;margin-top:18px}
.sentence-built,.sentence-bank{min-height:72px;padding:14px;border:2px solid var(--line,#d9eef7);border-radius:18px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;background:#fff}
.sentence-built{background:#f7fbfd}
.sentence-token{border:2px solid #b9dce7;border-radius:12px;background:#fff;padding:10px 14px;font:inherit;font-weight:800;color:#17324d;cursor:pointer}
.sentence-token.chosen{background:#eef8fb}
.sentence-block-actions{text-align:center}
@media(max-width:560px){.audio-choice-grid{grid-template-columns:1fr!important}.sentence-token{padding:9px 11px}}
`;
document.head.appendChild(style);
})();