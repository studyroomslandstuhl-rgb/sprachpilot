(function(){
'use strict';
if(window.__SP_L7_CARD_STANDARD_4)return;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
window.__SP_L7_CARD_STANDARD_4=true;
document.documentElement.setAttribute('data-sp-card-lesson','7');
document.body.classList.add('sp-l7-card-standard');

const CSS=[
 '/wortschatz/A1-Lektion-6/Thema-4/style.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-revision2.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-user.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-compact-v2.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-card-image-standard.css?v=20260730-card300',
 '/css/sp-card-standard-colors.css?v=2'
];
CSS.forEach(href=>{
 if(document.querySelector(`link[href^="${href.split('?')[0]}"]`))return;
 const link=document.createElement('link');
 link.rel='stylesheet';
 link.href=href;
 document.head.appendChild(link);
});

const style=document.createElement('style');
style.id='sp-l7-card-standard-style';
style.textContent=`
body.sp-l7-card-standard{background:linear-gradient(180deg,var(--lesson-bg),#fff)!important}
body.sp-l7-card-standard .l7-page{width:min(980px,calc(100% - 18px));padding-top:10px}
body.sp-l7-card-standard .l7-instruction{display:none!important}
body.sp-l7-card-standard .l7-card:has(#taskArea){padding:22px}
body.sp-l7-card-standard #taskArea>.l7-question-card{max-width:none;margin:0;padding:0;border:0;background:transparent;box-shadow:none}
body.sp-l7-card-standard #taskArea>.l7-question-card>.l7-image,
body.sp-l7-card-standard #taskArea>.l7-question-card>.eyebrow,
body.sp-l7-card-standard #taskArea>.l7-question-card>h2,
body.sp-l7-card-standard #taskArea>.l7-question-card>.l7-audio{display:none!important}
body.sp-l7-card-standard .l7-learning.sp-standard-learning{max-width:none;margin:0;padding:0;border:0;background:transparent;text-align:center}
body.sp-l7-card-standard .l7-answer-box{max-width:690px;margin:14px auto;text-align:left}
body.sp-l7-card-standard .l7-answer-box>div{display:flex;gap:8px}
body.sp-l7-card-standard .l7-answer-box input{width:100%;padding:13px;border:2px solid var(--lesson-line);border-radius:14px;font-size:17px}
body.sp-l7-card-standard .l7-answer-box .l7-btn,body.sp-l7-card-standard .l7-answer-box button{flex:0 0 auto}
body.sp-l7-card-standard [data-action="reveal"],body.sp-l7-card-standard [data-action="card-next"],body.sp-l7-card-standard .card-next{display:none!important}

/* Rückseite exakt wie L6T4: kleines Bild links, Informationen rechts. */
body.sp-l7-card-standard .flip-back{justify-content:center!important;overflow:hidden!important}
body.sp-l7-card-standard .flip-back>.flip-back-grid{width:100%!important;display:grid!important;grid-template-columns:120px minmax(0,1fr)!important;gap:12px!important;align-items:center!important}
body.sp-l7-card-standard .flip-back-image{width:120px!important;height:120px!important;min-width:120px!important;min-height:120px!important;overflow:hidden!important;border-radius:16px!important}
body.sp-l7-card-standard .flip-back-image>.visual{width:120px!important;height:120px!important;min-width:120px!important;min-height:120px!important;max-width:120px!important;max-height:120px!important;margin:0!important;padding:0!important;border-radius:16px!important;overflow:hidden!important;background:#fff!important}
body.sp-l7-card-standard .flip-back-image>.visual img{display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:center!important;margin:0!important;padding:0!important}
body.sp-l7-card-standard .flip-back-image>.visual>:not(img):not(.image-fallback){display:none!important}
body.sp-l7-card-standard .flip-back-image .image-fallback{font-size:0!important;color:transparent!important;width:100%!important;height:100%!important}
body.sp-l7-card-standard .flip-back-info{min-width:0!important;display:grid!important;gap:7px!important;justify-items:stretch!important}
body.sp-l7-card-standard .flip-back-info>.flip-word{font-size:25px!important;line-height:1.15!important;margin:0!important;overflow-wrap:anywhere!important}
body.sp-l7-card-standard .flip-back-info>.back-translation{width:100%!important;margin:0!important;padding:8px 9px!important}
body.sp-l7-card-standard .flip-back-info>.card-details{max-width:none!important;display:grid!important;gap:7px!important;margin:0!important}
body.sp-l7-card-standard .flip-back-info>.card-details>div{padding:8px 9px!important}
body.sp-l7-card-standard .flip-back-info>.card-listen-btn{justify-self:center!important;margin-top:0!important}
body.sp-l7-card-standard .flip-back>.flip-word,
body.sp-l7-card-standard .flip-back>.card-translation-box,
body.sp-l7-card-standard .flip-back>.card-details,
body.sp-l7-card-standard .flip-back>.l7-card-back{display:none!important}

body.sp-l7-card-standard .l7-progress-row.task-progress-row{margin:0 0 8px}
body.sp-l7-card-standard .l7-progress.sp-standard-progress{height:14px;border-radius:999px;background:var(--lesson-soft);overflow:hidden;margin-bottom:18px}
body.sp-l7-card-standard .l7-progress.sp-standard-progress span{height:100%;display:block;background:var(--lesson-main-dark)}
@media(max-width:700px){
 body.sp-l7-card-standard .l7-answer-box>div{display:grid}
 body.sp-l7-card-standard .flip-back>.flip-back-grid{grid-template-columns:1fr!important;gap:8px!important}
 body.sp-l7-card-standard .flip-back-image{width:100px!important;height:100px!important;min-width:100px!important;min-height:100px!important;margin:0 auto!important}
 body.sp-l7-card-standard .flip-back-image>.visual{width:100px!important;height:100px!important;min-width:100px!important;min-height:100px!important;max-width:100px!important;max-height:100px!important}
 body.sp-l7-card-standard .flip-back-info>.flip-word{font-size:23px!important}
}
`;
document.head.appendChild(style);

function translationLabel(scope){
 return scope?.querySelector('.card-translation-box span')?.textContent?.trim()||
  window.L7TranslationStandard?.native({})?.label||'Muttersprache';
}
function makeTranslation(text,label){
 const box=document.createElement('div');
 box.className='card-translation-box';
 const span=document.createElement('span');
 span.textContent=label||'Muttersprache';
 const strong=document.createElement('strong');
 strong.textContent=String(text||'');
 box.append(span,strong);
 return box;
}
function cleanVisual(source,small=false,pure=false){
 const visual=document.createElement('div');
 visual.className=`visual${small?' small-visual':''}${pure?' pure-visual':''}`;
 const sourceImage=source?.matches?.('img')?source:source?.querySelector?.('img');
 if(sourceImage){
  const image=sourceImage.cloneNode(true);
  image.removeAttribute('id');
  image.hidden=false;
  visual.appendChild(image);
 }
 const fallback=document.createElement('div');
 fallback.className='image-fallback blank';
 fallback.hidden=!!sourceImage;
 fallback.setAttribute('aria-label','Bild nicht verfügbar');
 visual.appendChild(fallback);
 return visual;
}
function detailValue(details,pattern){
 if(!details)return'';
 for(const child of details.children||[]){
  const label=String(child.querySelector?.('span')?.textContent||'').trim();
  if(pattern.test(label))return String(child.querySelector?.('strong')?.textContent||child.textContent||'').replace(label,'').trim();
 }
 return'';
}
function makeDetails(details){
 const box=document.createElement('div');
 box.className='card-details';
 const plural=detailValue(details,/plural/i);
 const example=detailValue(details,/beispiel/i);
 if(plural){
  const item=document.createElement('div');
  item.innerHTML='<span>Plural</span><strong></strong>';
  item.querySelector('strong').textContent=plural.replace('kein Plural üblich','kein Plural');
  box.appendChild(item);
 }
 const exampleItem=document.createElement('div');
 exampleItem.innerHTML='<span>Beispiel</span><strong></strong>';
 exampleItem.querySelector('strong').textContent=example;
 box.appendChild(exampleItem);
 return box;
}
function styleAudio(button){
 if(!button)return null;
 button.classList.add('btn','secondary','card-listen-btn');
 button.classList.remove('ghost');
 button.textContent='🔊 Anhören';
 button.type='button';
 return button;
}
function styleActions(scope){
 const mic=scope?.querySelector('[data-action="card-mic"],[data-action="mic"],#cardMicBtn');
 const write=scope?.querySelector('[data-action="card-write"],[data-action="write"],#cardWriteBtn');
 if(!mic&&!write)return null;
 const actions=document.createElement('div');
 actions.className='actions card-actions';
 if(mic){
  mic.classList.add('btn');
  mic.classList.remove('secondary','ghost');
  mic.textContent='🎤 Sprechen';
  mic.type='button';
  actions.appendChild(mic);
 }
 if(write){
  write.classList.add('btn','secondary');
  write.classList.remove('ghost');
  write.textContent='✍️ Schreiben';
  write.type='button';
  actions.appendChild(write);
 }
 return actions;
}
function prepareAnswer(scope){
 const answer=scope?.querySelector('#cardAnswerBox,.card-answer-box,.l7-answer-box');
 if(!answer)return null;
 answer.id='cardAnswerBox';
 answer.hidden=true;
 const label=answer.querySelector('label');
 if(label)label.textContent='Wort schreiben';
 answer.querySelectorAll('button').forEach(button=>button.classList.add('btn'));
 return answer;
}
function createCard(data){
 const wrap=document.createElement('div');
 wrap.className='flip-wrap';
 const card=document.createElement('div');
 card.id='verbFlipCard';
 card.className='flip-card';
 card.tabIndex=0;
 card.setAttribute('role','button');
 card.setAttribute('aria-label','Karte umdrehen');
 card.dataset.spCardReady='1';

 const front=document.createElement('div');
 front.className='flip-face flip-front';
 front.append(cleanVisual(data.image,false,false),makeTranslation(data.meaning,data.label));

 const back=document.createElement('div');
 back.className='flip-face flip-back';
 const grid=document.createElement('div');
 grid.className='flip-back-grid';
 const imageBox=document.createElement('div');
 imageBox.className='flip-back-image';
 imageBox.appendChild(cleanVisual(data.image,true,true));
 const info=document.createElement('div');
 info.className='flip-back-info';
 const word=document.createElement('div');
 word.className='flip-word';
 word.textContent=String(data.word||'');
 const translation=makeTranslation(data.meaning,data.label);
 translation.classList.add('back-translation');
 info.append(word,translation,makeDetails(data.details));
 if(data.audio)info.appendChild(styleAudio(data.audio));
 grid.append(imageBox,info);
 back.appendChild(grid);
 card.append(front,back);
 wrap.appendChild(card);
 return wrap;
}
function normalizeHeading(){
 const taskArea=document.getElementById('taskArea');
 const section=taskArea?.closest('.l7-card,.card')||document.querySelector('.card');
 if(!section)return;
 if(!section.querySelector(':scope > .task-title-block')){
  const heading=document.createElement('div');
  heading.className='task-title-block';
  heading.innerHTML='<span class="task-number">Aufgabe 1</span><h1>Karteikarten</h1>';
  section.insertBefore(heading,section.firstChild);
 }
 const row=section.querySelector(':scope > .l7-progress-row');
 if(row)row.classList.add('task-progress-row');
 const bar=row?.nextElementSibling;
 if(bar?.classList.contains('l7-progress'))bar.classList.add('sp-standard-progress','progress');
 section.querySelector(':scope > .l7-instruction')?.remove();
}
function normalizeLearning(){
 const learning=document.querySelector('#taskArea .l7-learning');
 if(!learning||learning.dataset.spStandardDone==='1')return false;
 const image=learning.querySelector('.l7-image,.card-image,.visual,img');
 const meaning=learning.querySelector('.l7-meaning,.card-translation-box strong')?.textContent?.trim()||'';
 const oldBack=learning.querySelector('#cardBack,.l7-card-back,.flip-back');
 const word=oldBack?.querySelector('.word,.flip-word')?.textContent?.trim()||'';
 const details=oldBack?.querySelector('.details,.card-details');
 const audio=learning.querySelector('[data-audio],[data-action="card-audio"],.card-listen-btn,#cardListenBtn');
 const actions=styleActions(learning);
 const answer=prepareAnswer(learning);
 if(!image||!word||!actions)return false;
 const card=createCard({image,meaning,word,details,audio,label:translationLabel(learning)});
 learning.innerHTML='';
 learning.classList.add('sp-standard-learning');
 learning.dataset.spStandardDone='1';
 learning.append(card,actions);
 if(answer)learning.appendChild(answer);
 return true;
}
function normalizeExisting(){
 const original=document.querySelector('#flipCard,#verbFlipCard');
 if(!original||original.dataset.spCardReady==='1')return false;
 const scope=original.closest('.l7-learning,.question-card,.l7-question-card,.card')||original.parentElement;
 const front=original.querySelector('.flip-front');
 const back=original.querySelector('.flip-back');
 const image=front?.querySelector('.card-image,.l7-image,.visual,img')||scope?.querySelector('.card-image,.l7-image,.visual,img');
 const meaning=front?.querySelector('.card-translation-box strong,.l7-meaning')?.textContent?.trim()||scope?.querySelector('.l7-meaning')?.textContent?.trim()||'';
 const word=back?.querySelector('.flip-word,.word')?.textContent?.trim()||'';
 const details=back?.querySelector('.card-details,.details');
 const audio=back?.querySelector('[data-audio],[data-action="card-audio"],.card-listen-btn,#cardListenBtn')||scope?.querySelector('[data-audio],[data-action="card-audio"],.card-listen-btn,#cardListenBtn');
 const actions=styleActions(scope);
 const answer=prepareAnswer(scope);
 if(!image||!word)return false;
 const replacement=createCard({image,meaning,word,details,audio,label:translationLabel(front||scope)});
 const oldWrap=original.closest('.flip-wrap')||original;
 oldWrap.replaceWith(replacement);
 if(actions)replacement.insertAdjacentElement('afterend',actions);
 if(answer)(actions||replacement).insertAdjacentElement('afterend',answer);
 scope?.querySelectorAll(':scope > .l7-image,:scope > .card-image,:scope > .l7-meaning,:scope > .l7-card-back,:scope > .card-translation-box,:scope > .l7-actions').forEach(element=>{
  if(!element.closest('.flip-wrap')&&!element.closest('.card-actions'))element.remove();
 });
 return true;
}
function flipOnly(card){
 if(!card.classList.contains('flipped'))card.classList.add('flipped');
 const feedback=document.getElementById('feedback')||document.querySelector('.feedback,#taskArea .l7-hint');
 if(feedback&&!feedback.textContent.trim())feedback.innerHTML='<div class="hint">Sprich das Wort oder schreibe es. Erst eine richtige Antwort geht weiter.</div>';
 document.querySelectorAll('[data-action="card-next"],#cardAfter button,.card-next').forEach(element=>element.remove());
}
document.addEventListener('click',event=>{
 const write=event.target.closest?.('[data-action="card-write"],[data-action="write"],#cardWriteBtn');
 if(write){
  const box=document.getElementById('cardAnswerBox')||write.closest('.question-card,.l7-question-card,.l7-learning')?.querySelector('.l7-answer-box,.card-answer-box');
  if(box){box.hidden=false;setTimeout(()=>box.querySelector('input')?.focus(),20);}
 }
 const card=event.target.closest?.('#verbFlipCard');
 if(!card||event.target.closest('button,input,textarea,audio,a'))return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 flipOnly(card);
},true);
document.addEventListener('keydown',event=>{
 if(event.key!=='Enter'&&event.key!==' ')return;
 const card=event.target.closest?.('#verbFlipCard');
 if(!card||event.target.closest('button,input,textarea,audio,a'))return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 flipOnly(card);
},true);

let scheduled=false;
function apply(){
 scheduled=false;
 normalizeHeading();
 if(!normalizeLearning())normalizeExisting();
 document.querySelectorAll('[data-action="reveal"],[data-action="card-next"],.card-next').forEach(element=>element.remove());
}
function schedule(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(apply);
}
const root=document.getElementById('app')||document.body;
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
[0,60,180,500,1200,2500].forEach(delay=>setTimeout(schedule,delay));
})();
