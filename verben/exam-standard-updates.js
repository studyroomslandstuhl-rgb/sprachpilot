(function(){
'use strict';
if(window.__SP_VERB_EXAM_STANDARD_UPDATES_V2)return;
window.__SP_VERB_EXAM_STANDARD_UPDATES_V2=true;
const E=window.VerbGroupsEngine;if(!E)return;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function route(){const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||''}}
function shuffle(a){a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function examQuestion(){
 try{
  const r=route();if(r.task!=='exam'||!r.group)return null;
  const session=E.currentRun(r.group)?.exam?.session,item=session?.items?.[session.index];
  return item?E.question(r.group,item.task,item.v,item.person):null;
 }catch{return null}
}
function bunnyPlay(verb,button){
 const api=window.SPVerbBunnyAllInfinitives;
 try{
  if(api){const resolved=api.resolveVerb?.(verb)||verb;if(api.play?.(resolved,false,button))return;if(api.computerSpeak?.(resolved,false))return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(verb);u.lang='de-DE';u.rate=.92;speechSynthesis.speak(u);
 }catch{}
}
function sentenceTokens(sentence){return String(sentence||'').match(/[A-Za-zÄÖÜäöüß]+(?:['’-][A-Za-zÄÖÜäöüß]+)*|\d+(?::\d+)?|[^\sA-Za-zÄÖÜäöüß\d]/g)||[]}

function fixExamBack(){
 const r=route();if(r.task!=='exam')return;
 document.querySelectorAll('#app [data-action="group"]').forEach(b=>b.remove());
}

function enhanceAudioChoices(){
 const q=examQuestion();if(!q?.audioChoices)return;
 const grid=document.querySelector('.question-card .option-grid');
 if(!grid||grid.dataset.examAudioChoices==='1')return;
 const buttons=[...grid.querySelectorAll(':scope > .option[data-action="answer"]')];
 if(buttons.length!==4)return;
 grid.dataset.examAudioChoices='1';grid.classList.add('audio-choice-grid');
 buttons.forEach((answer,index)=>{
  const verb=answer.dataset.answer||'';
  const row=document.createElement('div');row.className='audio-choice-row';
  const play=document.createElement('button');play.type='button';play.className='btn secondary';play.textContent=`🔊 Hören ${index+1}`;
  play.onclick=e=>{e.preventDefault();e.stopPropagation();bunnyPlay(verb,play)};
  answer.textContent='Auswählen';
  answer.replaceWith(row);row.append(play,answer);
 });
}

function enhanceSentenceBlocks(){
 const q=examQuestion();if(!q?.examSentenceBlocks)return;
 const card=document.querySelector('.question-card');if(!card||card.dataset.examSentenceBlocks==='1')return;
 const form=card.querySelector('.answer-form'),input=form?.querySelector('#answerInput'),check=form?.querySelector('[data-action="check-input"]');
 if(!form||!input||!check)return;
 card.dataset.examSentenceBlocks='1';form.hidden=true;
 const source=shuffle(sentenceTokens(q.answer).map((text,i)=>({id:i,text}))),chosen=[];
 const wrap=document.createElement('div');wrap.className='sentence-block-builder exam-sentence-builder';
 wrap.innerHTML='<div class="sentence-built"><span class="small">Baue den Satz.</span></div><div class="sentence-bank"></div><div class="sentence-block-actions"><button type="button" class="btn" id="examSentenceCheck">Kontrollieren</button><button type="button" class="btn secondary" id="examSentenceReset">Zurücksetzen</button></div>';
 form.before(wrap);
 const built=wrap.querySelector('.sentence-built'),bank=wrap.querySelector('.sentence-bank');
 function draw(){
  built.innerHTML=chosen.length?chosen.map((t,i)=>`<button type="button" class="sentence-token chosen" data-chosen="${i}">${esc(t.text)}</button>`).join(''):'<span class="small">Baue den Satz.</span>';
  bank.innerHTML=source.filter(t=>!chosen.includes(t)).map(t=>`<button type="button" class="sentence-token" data-token="${t.id}">${esc(t.text)}</button>`).join('');
  built.querySelectorAll('[data-chosen]').forEach(b=>b.onclick=()=>{chosen.splice(Number(b.dataset.chosen),1);draw()});
  bank.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{const t=source.find(x=>x.id===Number(b.dataset.token));if(t){chosen.push(t);draw()}});
 }
 wrap.querySelector('#examSentenceCheck').onclick=()=>{input.value=chosen.map(x=>x.text).join(' ').replace(/\s+([.,!?;:])/g,'$1').trim();check.click()};
 wrap.querySelector('#examSentenceReset').onclick=()=>{chosen.splice(0);draw()};
 draw();
}

function openSpeechWrite(message='Bitte sprich oder schreibe die Antwort.'){
 const box=document.querySelector('#writeFallback'),status=document.querySelector('#micStatus'),input=document.querySelector('#answerInput');
 box?.classList.remove('hidden');if(status)status.textContent=message;setTimeout(()=>input?.focus(),30)
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action="mic"]');if(!button)return;
 const q=examQuestion();if(!q?.examSpeech)return;
 event.preventDefault();event.stopImmediatePropagation();
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){openSpeechWrite();return}
 try{
  const rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.continuous=false;
  const status=document.querySelector('#micStatus');if(status)status.textContent='Ich höre zu …';
  rec.onresult=e=>{const value=e.results?.[0]?.[0]?.transcript||'';if(!value){openSpeechWrite('Nichts erkannt. Bitte schreiben.');return}const input=document.querySelector('#answerInput');document.querySelector('#writeFallback')?.classList.remove('hidden');if(input)input.value=value;document.querySelector('[data-action="check-input"]')?.click()};
  rec.onerror=()=>openSpeechWrite('Mikrofon hat nicht funktioniert. Bitte schreiben.');
  rec.onnomatch=()=>openSpeechWrite('Nichts erkannt. Bitte schreiben.');
  rec.start();
 }catch{openSpeechWrite()}
},true);

function enhance(){fixExamBack();enhanceAudioChoices();enhanceSentenceBlocks()}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);schedule();

const style=document.createElement('style');
style.textContent='.exam-sentence-builder{display:grid;gap:14px;margin-top:16px}.exam-sentence-builder .sentence-block-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}';
document.head.appendChild(style);
})();