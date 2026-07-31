(function(){
'use strict';
if(window.__SP_L7_CARD_STANDARD_1)return;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
window.__SP_L7_CARD_STANDARD_1=true;
document.documentElement.setAttribute('data-sp-card-lesson','7');
document.body.classList.add('sp-l7-card-standard');

const CSS=[
 '/wortschatz/A1-Lektion-6/Thema-4/style.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-revision2.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-user.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-compact-v2.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-card-image-standard.css?v=20260730-card300',
 '/css/sp-card-standard-colors.css?v=1'
];
CSS.forEach(href=>{
 if(document.querySelector(`link[href^="${href.split('?')[0]}"]`))return;
 const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);
});
const style=document.createElement('style');
style.id='sp-l7-card-standard-style';
style.textContent=`
body.sp-l7-card-standard{background:linear-gradient(180deg,var(--lesson-bg),#fff)!important}
body.sp-l7-card-standard .l7-page{width:min(980px,calc(100% - 18px));padding-top:12px}
body.sp-l7-card-standard .l7-instruction{display:none!important}
body.sp-l7-card-standard #taskArea>.l7-question-card>.l7-image,
body.sp-l7-card-standard #taskArea>.l7-question-card>.eyebrow,
body.sp-l7-card-standard #taskArea>.l7-question-card>h2{display:none!important}
body.sp-l7-card-standard .l7-question-card{max-width:none;margin:0;padding:0;border:0;background:transparent;box-shadow:none}
body.sp-l7-card-standard .l7-learning.sp-standard-learning{max-width:none;margin:0;padding:0;border:0;background:transparent;text-align:center}
body.sp-l7-card-standard .l7-answer-box{max-width:690px;margin:14px auto;text-align:left}
body.sp-l7-card-standard .l7-answer-box>div{display:flex;gap:8px}
body.sp-l7-card-standard .l7-answer-box input{width:100%;padding:13px;border:2px solid var(--lesson-line);border-radius:14px;font-size:17px}
body.sp-l7-card-standard .l7-answer-box .btn{flex:0 0 auto}
body.sp-l7-card-standard .visual.l7-image{width:100%;max-width:none;margin:0;border:0;border-radius:18px;background:#fff;overflow:hidden}
body.sp-l7-card-standard .visual.l7-image img{width:100%;height:100%;aspect-ratio:auto;object-fit:contain}
body.sp-l7-card-standard .flip-back-image .visual.l7-image{height:100%}
body.sp-l7-card-standard .flip-back-image .visual.l7-image img{height:100%}
body.sp-l7-card-standard .l7-progress-row.task-progress-row{margin:0 0 8px}
body.sp-l7-card-standard .l7-progress.sp-standard-progress{height:14px;border-radius:999px;background:var(--lesson-soft);overflow:hidden;margin-bottom:18px}
body.sp-l7-card-standard .l7-progress.sp-standard-progress span{height:100%;display:block;background:var(--lesson-main-dark)}
body.sp-l7-card-standard .card-actions .l7-btn{font-family:inherit}
@media(max-width:700px){body.sp-l7-card-standard .l7-answer-box>div{display:grid}}
`;
document.head.appendChild(style);

function makeTranslation(text){
 const box=document.createElement('div');box.className='card-translation-box';
 const label=document.createElement('span');label.textContent='Muttersprache';
 const strong=document.createElement('strong');strong.textContent=String(text||'');
 box.append(label,strong);return box;
}
function makeVisual(source,small,pure){
 const clone=source?.cloneNode(true)||document.createElement('div');
 clone.classList.add('visual');
 if(small)clone.classList.add('small-visual');
 if(pure)clone.classList.add('pure-visual');
 clone.removeAttribute('id');
 return clone;
}
function buttonClass(button,secondary=false){
 if(!button)return;
 button.classList.add('btn');
 if(secondary)button.classList.add('secondary');
}
function normalizeHeading(){
 const taskArea=document.getElementById('taskArea');
 if(!taskArea)return;
 const section=taskArea.closest('.l7-card,.card')||taskArea.parentElement;
 if(!section)return;
 if(!section.querySelector(':scope > .task-title-block')){
  const heading=document.createElement('div');heading.className='task-title-block';
  heading.innerHTML='<span class="task-number">Aufgabe 1</span><h1>Karteikarten</h1>';
  section.insertBefore(heading,section.firstChild);
 }
 const row=section.querySelector(':scope > .l7-progress-row');
 if(row)row.classList.add('task-progress-row');
 const bar=row?.nextElementSibling;
 if(bar?.classList.contains('l7-progress'))bar.classList.add('sp-standard-progress','progress');
 section.querySelector(':scope > .l7-instruction')?.remove();
}
function standardizeShared(){
 const learning=document.querySelector('#taskArea .l7-learning');
 if(!learning||learning.dataset.spCardStandard==='1')return false;
 const sourceImage=learning.querySelector('.l7-image');
 const meaning=learning.querySelector('.l7-meaning')?.textContent?.trim()||'';
 const oldBack=learning.querySelector('#cardBack');
 const word=oldBack?.querySelector('.word')?.textContent?.trim()||'';
 const details=oldBack?.querySelector('.details');
 const audio=learning.querySelector('[data-audio]');
 const mic=learning.querySelector('[data-action="mic"]');
 const write=learning.querySelector('[data-action="write"]');
 const answer=learning.querySelector('.l7-answer-box');
 if(!sourceImage||!oldBack||!mic||!write)return false;

 const wrap=document.createElement('div');wrap.className='flip-wrap';
 const card=document.createElement('div');card.id='verbFlipCard';card.className='flip-card';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Karte umdrehen');
 const front=document.createElement('div');front.className='flip-face flip-front';front.append(makeVisual(sourceImage,false,false),makeTranslation(meaning));
 const back=document.createElement('div');back.className='flip-face flip-back';
 const grid=document.createElement('div');grid.className='flip-back-grid';
 const imageBox=document.createElement('div');imageBox.className='flip-back-image';imageBox.append(makeVisual(sourceImage,true,true));
 const info=document.createElement('div');info.className='flip-back-info';
 const wordBox=document.createElement('div');wordBox.className='flip-word';wordBox.textContent=word;
 const backMeaning=makeTranslation(meaning);backMeaning.classList.add('back-translation');
 const cardDetails=document.createElement('div');cardDetails.className='card-details';
 if(details){[...details.children].forEach(child=>cardDetails.appendChild(child.cloneNode(true)));}
 if(!cardDetails.children.length){const item=document.createElement('div');item.innerHTML='<span>Beispiel</span><strong></strong>';cardDetails.appendChild(item);}
 if(audio){buttonClass(audio,true);audio.classList.add('card-listen-btn');audio.textContent='🔊 Anhören';info.append(wordBox,backMeaning,cardDetails,audio);}
 else info.append(wordBox,backMeaning,cardDetails);
 grid.append(imageBox,info);back.appendChild(grid);card.append(front,back);wrap.appendChild(card);

 const actions=document.createElement('div');actions.className='actions card-actions';
 buttonClass(mic,false);buttonClass(write,true);mic.textContent='🎤 Sprechen';write.textContent='✍️ Schreiben';
 actions.append(mic,write);
 if(answer){answer.querySelector('label')?.replaceChildren(document.createTextNode('Wort schreiben'));answer.querySelector('button')?.classList.add('btn');}
 learning.innerHTML='';learning.classList.add('sp-standard-learning');learning.dataset.spCardStandard='1';
 learning.append(wrap,actions);if(answer)learning.appendChild(answer);
 return true;
}
function standardizeExistingFlip(){
 const card=document.querySelector('#flipCard,#verbFlipCard');
 if(!card)return false;
 card.id='verbFlipCard';card.classList.add('flip-card');card.setAttribute('role','button');card.setAttribute('aria-label','Karte umdrehen');card.tabIndex=0;
 card.querySelector('.flip-front')?.classList.add('flip-face');
 card.querySelector('.flip-back')?.classList.add('flip-face');
 card.querySelector('.card-back-grid')?.classList.add('flip-back-grid');
 card.querySelector('.card-back-image')?.classList.add('flip-back-image');
 card.querySelector('.card-back-info')?.classList.add('flip-back-info');
 card.querySelector('.card-back-info .word,.flip-back .word')?.classList.add('flip-word');
 card.querySelectorAll('.card-actions,.l7-actions').forEach(el=>el.classList.add('actions','card-actions'));
 card.closest('.question-card,.l7-question-card')?.querySelectorAll('[data-action="mic"],[data-action="write"],[data-audio]').forEach(button=>{
  const secondary=button.dataset.action==='write'||button.dataset.audio!==undefined;buttonClass(button,secondary);
  if(button.dataset.action==='mic')button.textContent='🎤 Sprechen';
  if(button.dataset.action==='write')button.textContent='✍️ Schreiben';
  if(button.dataset.audio!==undefined){button.textContent='🔊 Anhören';button.classList.add('card-listen-btn');}
 });
 document.querySelectorAll('[data-action="card-next"]').forEach(el=>el.remove());
 return true;
}
function feedbackTarget(){return document.getElementById('feedback')||document.querySelector('.feedback,#taskArea .l7-hint');}
function flipOnly(card){
 if(!card.classList.contains('flipped'))card.classList.add('flipped');
 const feedback=feedbackTarget();
 if(feedback&&!feedback.textContent.trim())feedback.innerHTML='<div class="hint">Sprich das Wort oder schreibe es. Erst eine richtige Antwort geht weiter.</div>';
 document.querySelectorAll('[data-action="card-next"],#cardAfter button').forEach(el=>el.remove());
}
document.addEventListener('click',event=>{
 const card=event.target.closest?.('#verbFlipCard');if(!card||event.target.closest('button,input,textarea,audio,a'))return;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();flipOnly(card);
},true);
document.addEventListener('keydown',event=>{
 if(event.key!=='Enter'&&event.key!==' ')return;
 const card=event.target.closest?.('#verbFlipCard');if(!card||event.target.closest('button,input,textarea,audio,a'))return;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();flipOnly(card);
},true);

let scheduled=false;
function apply(){scheduled=false;normalizeHeading();if(!standardizeShared())standardizeExistingFlip();document.querySelectorAll('[data-action="card-next"]').forEach(el=>el.remove());}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply);}
const root=document.getElementById('app')||document.body;
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
[0,80,250,700,1500].forEach(delay=>setTimeout(schedule,delay));
})();
