(function(){
'use strict';
if(window.__SP_VERB_SENTENCE_BUILDER_V3)return;
window.__SP_VERB_SENTENCE_BUILDER_V3=true;
const E=window.VerbGroupsEngine;
if(!E)return;

// Die bestehende Prüf-/Fehlerlogik bleibt erhalten. Für Aufgabe 12 wird nur die
// Darstellung ersetzt; bei der dritten Hilfe wird der vollständige Satz gezeigt.
const previousQuestion=E.question.bind(E);
E.question=function(groupId,task,verb,personOverride=null){
 const q=previousQuestion(groupId,task,verb,personOverride);
 if(task==='sentence'){
  let sentence=String(q?.sentence||E.sentence?.(verb)||window.SP_VERB_SENTENCES?.[verb]||'').trim();
  if(!sentence){
   // Reiner Sicherheitsfallback für künftig neu ergänzte Verben. Er verhindert,
   // dass Aufgabe 12 jemals wieder zur alten Lückentext-/Eingabeansicht zurückfällt.
   const form=E.displayForm?.(verb,0)||verb;
   sentence=`Ich ${form}.`;
   q.answer=form;
   q.generatedSentenceFallback=true;
   console.warn('Für dieses Verb fehlt noch ein eigener A1-Satz:',verb)
  }
  q.sentence=sentence;q.writeAnswer=sentence;q.verb=verb
 }
 return q
};

const route=()=>{const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||''}};
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const tokenise=sentence=>String(sentence||'').match(/[A-Za-zÄÖÜäöüß]+(?:['’-][A-Za-zÄÖÜäöüß]+)*|\d+(?::\d+)?|[^\sA-Za-zÄÖÜäöüß\d]/g)||[];
const sameOrder=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
function speak(sentence){
 try{
  if(!('speechSynthesis'in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(sentence);u.lang='de-DE';u.rate=.88;speechSynthesis.speak(u)
 }catch{}
}
function currentData(){
 const r=route();if(r.task!=='sentence'||!r.group)return null;
 const st=E.taskState(r.group,'sentence'),verb=st?.current;
 if(!verb)return null;
 const q=E.question(r.group,'sentence',verb);
 const sentence=String(q?.sentence||'').trim();
 if(!sentence)return null;
 const tokens=tokenise(sentence);if(!tokens.length)return null;
 return{r,verb,q,sentence,tokens}
}
function renderBuilder(card,data){
 if(card.dataset.sentenceBuilderReady==='1')return;
 card.dataset.sentenceBuilderReady='1';
 const shuffled=shuffle(data.tokens.map((token,index)=>({token,index})));
 const chosen=[];
 card.innerHTML=`
  <div class="sp-sentence-builder">
   <div class="sp-sentence-instruction">Bringe die Wörter<br>in die richtige<br>Reihenfolge.</div>
   <div class="sp-sentence-help-row"><button type="button" class="btn secondary" id="spSentenceListen">🔊 Satz hören</button><span>Hilfe</span></div>
   <div class="sp-sentence-answer" id="spSentenceAnswer"><span>Baue den Satz.</span></div>
   <div class="sp-sentence-token-box" id="spSentenceTokens"></div>
   <input id="answerInput" type="hidden" value="__sp_sentence_wrong__">
   <button type="button" class="btn sp-sentence-check" data-action="check-input">Kontrollieren</button>
   <div id="feedback"></div>
  </div>`;
 const pool=card.querySelector('#spSentenceTokens'),answer=card.querySelector('#spSentenceAnswer'),hidden=card.querySelector('#answerInput');
 function update(){
  answer.innerHTML=chosen.length?chosen.map((item,pos)=>`<button type="button" class="sp-sentence-chip selected" data-selected-pos="${pos}">${item.token}</button>`).join(' '):'<span>Baue den Satz.</span>';
  pool.innerHTML=shuffled.map(item=>`<button type="button" class="sp-sentence-chip" data-token-index="${item.index}" ${chosen.some(x=>x.index===item.index)?'disabled':''}>${item.token}</button>`).join('');
  const built=chosen.map(x=>x.token);
  hidden.value=sameOrder(built,data.tokens)?String(data.q?.answer||'__sp_sentence_correct__'):'__sp_sentence_wrong__';
  answer.querySelectorAll('[data-selected-pos]').forEach(btn=>btn.addEventListener('click',()=>{chosen.splice(Number(btn.dataset.selectedPos),1);update()}));
  pool.querySelectorAll('[data-token-index]').forEach(btn=>btn.addEventListener('click',()=>{
   const index=Number(btn.dataset.tokenIndex),item=shuffled.find(x=>x.index===index);if(!item)return;chosen.push(item);update()
  }));
 }
 // Hörhilfe ist ausdrücklich nur Hilfe: kein markWrong(), kein Versuch, keine Wiederholung.
 card.querySelector('#spSentenceListen').addEventListener('click',()=>speak(data.sentence));
 update();
}
function enhance(){
 const data=currentData();if(!data)return;
 const card=document.querySelector('.question-card');if(!card)return;
 renderBuilder(card,data)
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);schedule();

const style=document.createElement('style');
style.textContent=`
.sp-sentence-builder{display:grid;justify-items:center;gap:22px;text-align:center;padding:14px 4px 8px}
.sp-sentence-instruction{font-size:clamp(30px,6vw,46px);font-weight:900;line-height:1.08;color:#17354b;letter-spacing:-.02em}
.sp-sentence-help-row{display:flex;align-items:center;gap:14px;font-size:24px;color:#738095}
.sp-sentence-help-row .btn{min-height:62px;padding:12px 26px;font-size:22px;font-weight:800;border-radius:22px}
.sp-sentence-answer{width:min(100%,480px);min-height:132px;padding:18px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;border:3px solid #c9ebf5;border-radius:28px;background:#f8fcfe;color:#718096;font-size:24px}
.sp-sentence-token-box{width:min(100%,480px);min-height:160px;padding:28px 22px;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:12px;border:3px solid #c9ebf5;border-radius:28px;background:#fff}
.sp-sentence-chip{appearance:none;border:3px solid #c9ebf5;border-radius:18px;background:#fff;color:#17354b;padding:12px 18px;font:inherit;font-size:25px;font-weight:850;line-height:1;box-shadow:none;cursor:pointer}
.sp-sentence-chip.selected{background:#eef9fc}
.sp-sentence-chip:disabled{opacity:.25;cursor:default}
.sp-sentence-check{min-width:286px;min-height:70px;font-size:25px!important;border-radius:24px!important}
.sp-sentence-builder #feedback{width:min(100%,480px)}
@media(max-width:560px){
 .sp-sentence-builder{gap:18px}
 .sp-sentence-help-row{gap:10px;font-size:20px}
 .sp-sentence-help-row .btn{font-size:20px;padding:10px 18px}
 .sp-sentence-answer{min-height:120px}
 .sp-sentence-token-box{min-height:150px;padding:24px 14px}
 .sp-sentence-chip{font-size:22px;padding:11px 15px}
}
`;
document.head.appendChild(style);
})();
