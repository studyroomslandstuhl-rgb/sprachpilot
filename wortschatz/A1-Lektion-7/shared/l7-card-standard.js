(function(){
'use strict';
if(window.__SP_L7_CARD_STANDARD_3)return;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
window.__SP_L7_CARD_STANDARD_3=true;
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
 const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);
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
body.sp-l7-card-standard .visual.l7-image,body.sp-l7-card-standard .visual.card-image{width:100%;max-width:none;margin:0;border:0;border-radius:18px;background:#fff;overflow:hidden}
body.sp-l7-card-standard .visual.l7-image img,body.sp-l7-card-standard .visual.card-image img{width:100%;height:100%;object-fit:contain;display:block}
body.sp-l7-card-standard .flip-back-image .visual{height:100%}
body.sp-l7-card-standard .l7-progress-row.task-progress-row{margin:0 0 8px}
body.sp-l7-card-standard .l7-progress.sp-standard-progress{height:14px;border-radius:999px;background:var(--lesson-soft);overflow:hidden;margin-bottom:18px}
body.sp-l7-card-standard .l7-progress.sp-standard-progress span{height:100%;display:block;background:var(--lesson-main-dark)}
body.sp-l7-card-standard [data-action="reveal"],body.sp-l7-card-standard [data-action="card-next"],body.sp-l7-card-standard .card-next{display:none!important}
@media(max-width:700px){body.sp-l7-card-standard .l7-answer-box>div{display:grid}}
`;
document.head.appendChild(style);

function translationLabel(){return window.L7TranslationStandard?.native({})?.label||'Muttersprache'}
function makeTranslation(text,label=translationLabel()){
 const box=document.createElement('div');box.className='card-translation-box';
 const span=document.createElement('span');span.textContent=label;
 const strong=document.createElement('strong');strong.textContent=String(text||'');
 box.append(span,strong);return box;
}
function cloneVisual(source,small=false,pure=false){
 let visual=source?.cloneNode(true)||document.createElement('div');
 visual.removeAttribute?.('id');
 visual.classList.add('visual');
 if(small)visual.classList.add('small-visual');
 if(pure)visual.classList.add('pure-visual');
 visual.querySelectorAll?.('[id]').forEach(element=>element.removeAttribute('id'));
 return visual;
}
function createCard({image,meaning,word,details,audio,label}){
 const wrap=document.createElement('div');wrap.className='flip-wrap';
 const card=document.createElement('div');card.id='verbFlipCard';card.className='flip-card';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Karte umdrehen');card.dataset.spCardReady='1';
 const front=document.createElement('div');front.className='flip-face flip-front';front.append(cloneVisual(image,false,false),makeTranslation(meaning,label));
 const back=document.createElement('div');back.className='flip-face flip-back';
 const grid=document.createElement('div');grid.className='flip-back-grid';
 const imageBox=document.createElement('div');imageBox.className='flip-back-image';imageBox.append(cloneVisual(image,true,true));
 const info=document.createElement('div');info.className='flip-back-info';
 const wordBox=document.createElement('div');wordBox.className='flip-word';wordBox.textContent=String(word||'');
 const backMeaning=makeTranslation(meaning,label);backMeaning.classList.add('back-translation');
 const cardDetails=document.createElement('div');cardDetails.className='card-details';
 if(details){
  const children=[...details.children];
  if(children.length)children.forEach(child=>cardDetails.appendChild(child.cloneNode(true)));
  else if(details.textContent.trim()){const item=document.createElement('div');item.innerHTML='<span>Beispiel</span><strong></strong>';item.querySelector('strong').textContent=details.textContent.trim();cardDetails.appendChild(item);}
 }
 if(!cardDetails.children.length){const item=document.createElement('div');item.innerHTML='<span>Beispiel</span><strong></strong>';cardDetails.appendChild(item);}
 if(audio){audio.classList.add('btn','secondary','card-listen-btn');audio.textContent='🔊 Anhören';}
 info.append(wordBox,backMeaning,cardDetails);if(audio)info.appendChild(audio);
 grid.append(imageBox,info);back.appendChild(grid);card.append(front,back);wrap.appendChild(card);
 return wrap;
}
function styleActions(scope){
 const mic=scope.querySelector('[data-action="card-mic"],[data-action="mic"]');
 const write=scope.querySelector('[data-action="card-write"],[data-action="write"]');
 if(!mic&&!write)return null;
 const actions=document.createElement('div');actions.className='actions card-actions';
 if(mic){mic.classList.add('btn');mic.classList.remove('secondary','ghost');mic.textContent='🎤 Sprechen';actions.appendChild(mic);}
 if(write){write.classList.add('btn','secondary');write.classList.remove('ghost');write.textContent='✍️ Schreiben';actions.appendChild(write);}
 return actions;
}
function prepareAnswer(scope){
 const answer=scope.querySelector('#cardAnswerBox,.card-answer-box,.l7-answer-box');
 if(!answer)return null;
 answer.id='cardAnswerBox';
 answer.hidden=true;
 const label=answer.querySelector('label');if(label)label.textContent='Wort schreiben';
 answer.querySelectorAll('button').forEach(button=>button.classList.add('btn'));
 return answer;
}
function normalizeHeading(){
 const taskArea=document.getElementById('taskArea');
 const section=taskArea?.closest('.l7-card,.card')||document.querySelector('.card');
 if(!section)return;
 if(!section.querySelector(':scope > .task-title-block')){
  const heading=document.createElement('div');heading.className='task-title-block';heading.innerHTML='<span class="task-number">Aufgabe 1</span><h1>Karteikarten</h1>';section.insertBefore(heading,section.firstChild);
 }
 const row=section.querySelector(':scope > .l7-progress-row');if(row)row.classList.add('task-progress-row');
 const bar=row?.nextElementSibling;if(bar?.classList.contains('l7-progress'))bar.classList.add('sp-standard-progress','progress');
 section.querySelector(':scope > .l7-instruction')?.remove();
}
function normalizeShared(){
 const learning=document.querySelector('#taskArea .l7-learning');
 if(!learning||learning.dataset.spStandardDone==='1')return false;
 const image=learning.querySelector('.l7-image,.card-image,.visual');
 const meaning=learning.querySelector('.l7-meaning,.card-translation-box strong')?.textContent?.trim()||'';
 const oldBack=learning.querySelector('#cardBack,.l7-card-back,.flip-back');
 const word=oldBack?.querySelector('.word,.flip-word')?.textContent?.trim()||'';
 const details=oldBack?.querySelector('.details,.card-details');
 const audio=learning.querySelector('[data-audio],[data-action="card-audio"],.card-listen-btn');
 const actions=styleActions(learning);
 const answer=prepareAnswer(learning);
 if(!image||!word||!actions)return false;
 const card=createCard({image,meaning,word,details,audio,label:window.L7TranslationStandard?.native({meaning})?.label||'Muttersprache'});
 learning.innerHTML='';learning.classList.add('sp-standard-learning');learning.dataset.spStandardDone='1';learning.append(card,actions);if(answer)learning.appendChild(answer);
 return true;
}
function normalizeExisting(){
 const original=document.querySelector('#flipCard,#verbFlipCard');
 if(!original||original.dataset.spCardReady==='1')return false;
 const scope=original.closest('.question-card,.l7-question-card,.l7-learning,.card')||original.parentElement;
 const front=original.querySelector('.flip-front');
 const back=original.querySelector('.flip-back');
 const image=front?.querySelector('.card-image,.l7-image,.visual,img')||scope?.querySelector('.card-image,.l7-image,.visual');
 const meaning=front?.querySelector('.card-translation-box strong,.l7-meaning')?.textContent?.trim()||scope?.querySelector('.l7-meaning')?.textContent?.trim()||'';
 const label=front?.querySelector('.card-translation-box span')?.textContent?.trim()||window.L7TranslationStandard?.native({meaning})?.label||'Muttersprache';
 const word=back?.querySelector('.flip-word,.word')?.textContent?.trim()||'';
 const details=back?.querySelector('.card-details,.details');
 const audio=back?.querySelector('[data-audio],[data-action="card-audio"],.card-listen-btn')||scope?.querySelector('[data-action="card-audio"],.card-listen-btn');
 if(!image||!word)return false;
 const replacement=createCard({image,meaning,word,details,audio,label});
 original.closest('.flip-wrap')?.replaceWith(replacement)||original.replaceWith(replacement.firstElementChild);
 const actions=styleActions(scope);const answer=prepareAnswer(scope);
 const wrap=replacement;
 if(actions&&!wrap.nextElementSibling?.classList.contains('card-actions'))wrap.insertAdjacentElement('afterend',actions);
 if(answer&&actions)actions.insertAdjacentElement('afterend',answer);
 scope?.querySelectorAll('[data-action="reveal"],[data-action="card-next"],.card-next').forEach(element=>element.remove());
 return true;
}
function flipOnly(card){
 if(!card.classList.contains('flipped'))card.classList.add('flipped');
 const feedback=document.getElementById('feedback')||document.querySelector('.feedback,#taskArea .l7-hint');
 if(feedback&&!feedback.textContent.trim())feedback.innerHTML='<div class="hint">Sprich das Wort oder schreibe es. Erst eine richtige Antwort geht weiter.</div>';
 document.querySelectorAll('[data-action="card-next"],#cardAfter button,.card-next').forEach(element=>element.remove());
}
document.addEventListener('click',event=>{
 const write=event.target.closest?.('[data-action="card-write"],[data-action="write"]');
 if(write){const box=document.getElementById('cardAnswerBox')||write.closest('.question-card,.l7-question-card,.l7-learning')?.querySelector('.l7-answer-box,.card-answer-box');if(box){box.hidden=false;setTimeout(()=>box.querySelector('input')?.focus(),20);}}
 const card=event.target.closest?.('#verbFlipCard');
 if(!card||event.target.closest('button,input,textarea,audio,a'))return;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();flipOnly(card);
},true);
document.addEventListener('keydown',event=>{
 if(event.key!=='Enter'&&event.key!==' ')return;
 const card=event.target.closest?.('#verbFlipCard');if(!card||event.target.closest('button,input,textarea,audio,a'))return;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();flipOnly(card);
},true);

let scheduled=false;
function apply(){scheduled=false;normalizeHeading();if(!normalizeShared())normalizeExisting();document.querySelectorAll('[data-action="reveal"],[data-action="card-next"],.card-next').forEach(element=>element.remove());}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
const root=document.getElementById('app')||document.body;
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
[0,60,180,500,1200,2500].forEach(delay=>setTimeout(schedule,delay));
})();
