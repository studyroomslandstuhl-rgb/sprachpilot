(function(){
'use strict';
if(window.L7T1_CARD_RULES_INSTALLED)return;
window.L7T1_CARD_RULES_INSTALLED=true;
document.body.classList.add('l7t1-card-rules');

const EXAMPLES=Object.freeze({
 'prima':'Das Essen schmeckt prima.',
 'das Team':'Wir arbeiten im Team.',
 'wecken':'Meine Mutter weckt mich um sieben Uhr.',
 'das Frühstück':'Das Frühstück ist fertig.',
 'fertig sein':'Ich bin mit der Aufgabe fertig.',
 'los sein':'Was ist los?',
 'schreiben':'Ich schreibe einen Brief.',
 'die Mathematik':'Mathematik ist heute einfach.',
 'der Test':'Wir schreiben heute einen Test.',
 'pünktlich':'Ali kommt pünktlich zum Unterricht.',
 'auf keinen Fall':'Ich komme auf keinen Fall zu spät.',
 'auf jeden Fall':'Ich komme auf jeden Fall mit.',
 'schmecken':'Der Kuchen schmeckt gut.',
 'nach Hause':'Ich gehe nach Hause.',
 'die Schule':'Die Kinder gehen in die Schule.',
 'können':'Ich kann gut schwimmen.',
 'krank':'Maria ist heute krank.',
 'der Arzt':'Der Arzt untersucht den Patienten.',
 'die Ärztin':'Die Ärztin arbeitet im Krankenhaus.',
 'backen':'Wir backen einen Kuchen.',
 'singen':'Jana kann gut singen.',
 'reiten':'Anna möchte reiten.',
 'das Klavier':'Das Klavier steht im Wohnzimmer.',
 'malen':'Mina malt ein Bild.',
 'der Ski':'Die Skier stehen im Keller.',
 'das Tennis':'Wir spielen am Samstag Tennis.',
 'wollen':'Wir wollen heute grillen.',
 'möchten':'Ich möchte einen Tee.',
 'endlich':'Der Bus kommt endlich.',
 'das Lied':'Wir hören ein Lied.',
 'üben':'Ich übe jeden Tag Deutsch.',
 'der Text':'Ich lese den Text.',
 'die Übung':'Die Übung ist leicht.',
 'der Brief':'Ich schreibe einen Brief.',
 'der Film':'Der Film beginnt um acht Uhr.',
 'die Grammatik':'Wir üben die Grammatik.',
 'das Spiel':'Das Spiel macht Spaß.',
 'das Fahrrad':'Mein Fahrrad ist neu.',
 'die Gitarre':'Er spielt Gitarre.',
 'der Kuchen':'Der Kuchen schmeckt prima.',
 'die Hausaufgabe':'Die Hausaufgabe ist schwer.',
 'der Freund':'Mein Freund kommt heute.',
 'hören':'Ich höre ein Lied.',
 'machen':'Wir machen eine Übung.',
 'lesen':'Ich lese ein Buch.',
 'sehen':'Wir sehen einen Film.',
 'spielen':'Wir spielen Tennis.',
 'fahren':'Ich fahre mit dem Fahrrad.',
 'treffen':'Ich treffe meine Freunde.',
 'gehen':'Wir gehen nach Hause.',
 'sprechen':'Wir sprechen Deutsch.',
 'tanzen':'Wir tanzen zur Musik.',
 'wandern':'Wir wandern am Wochenende.',
 'grillen':'Wir grillen im Garten.',
 'schwimmen':'Ich schwimme gern.',
 'stricken':'Meine Oma strickt einen Schal.',
 'jonglieren':'Er kann gut jonglieren.',
 'kochen':'Wir kochen eine Suppe.',
 'fotografieren':'Sie fotografiert die Stadt.',
 'einkaufen':'Ich kaufe im Supermarkt ein.',
 'aufstehen':'Ich stehe um sieben Uhr auf.'
});

const style=document.createElement('style');
style.id='l7t1-card-rules-style';
style.textContent=`
body.l7t1-card-rules .flip-card{height:500px}
body.l7t1-card-rules .card-back-grid{width:100%;display:grid;grid-template-columns:120px minmax(0,1fr);gap:12px;align-items:center}
body.l7t1-card-rules .card-back-image{width:120px;height:120px;min-height:0;max-height:none;margin:0;border:2px solid var(--lesson-line);border-radius:16px;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center}
body.l7t1-card-rules .card-back-image img{width:100%;height:100%;max-height:none;object-fit:contain;display:block}
body.l7t1-card-rules .card-back-info{display:grid;gap:8px;min-width:0;width:100%}
body.l7t1-card-rules .card-back-info .card-translation-box{margin:0}
body.l7t1-card-rules .card-example-box{width:100%;padding:10px;border-radius:13px;background:#fff}
body.l7t1-card-rules .card-example-box span{display:block;font-size:13px;color:var(--muted)}
body.l7t1-card-rules .card-example-box strong{display:block;margin-top:4px;font-size:17px;line-height:1.35}
body.l7t1-card-rules .card-answer-hint{max-width:690px;margin:12px auto 0}
@media(max-width:760px){
 body.l7t1-card-rules .flip-card{height:560px}
 body.l7t1-card-rules .card-back-grid{grid-template-columns:1fr;gap:8px}
 body.l7t1-card-rules .card-back-image{width:100px;height:100px;margin:0 auto}
}
`;
document.head.appendChild(style);

function removeSkipControls(scope=document){
 scope.querySelectorAll('[data-action="card-next"]').forEach(button=>button.remove());
}

function unwrapImageLink(box){
 const link=box?.querySelector('a.bunny-image-link');
 if(!link)return;
 while(link.firstChild)link.parentNode.insertBefore(link.firstChild,link);
 link.remove();
}

function ensureAnswerHint(card){
 const question=card.closest('.question-card');
 if(!question)return;
 let hint=question.querySelector('.card-answer-hint');
 if(!card.classList.contains('flipped')){
  hint?.remove();
  return;
 }
 if(hint)return;
 hint=document.createElement('div');
 hint.className='hint card-answer-hint';
 hint.textContent='Sprich das Wort oder schreibe es. Erst eine richtige Antwort geht weiter.';
 const actions=question.querySelector('.card-actions');
 if(actions)actions.insertAdjacentElement('afterend',hint);
 else question.appendChild(hint);
}

function exampleBox(wordText){
 const item=(window.L7T1_VOCAB||[]).find(entry=>String(entry.word||'').trim()===wordText);
 const example=String(item?.example||EXAMPLES[wordText]||'').trim();
 if(!example)return null;
 const box=document.createElement('div');
 box.className='card-example-box';
 const label=document.createElement('span');
 label.textContent='Beispiel';
 const text=document.createElement('strong');
 text.textContent=example;
 box.append(label,text);
 return box;
}

function standardizeBack(card){
 const back=card.querySelector('.flip-back');
 if(!back||back.dataset.cardRulesReady==='1')return;
 const frontImage=card.querySelector('.flip-front .card-image');
 const frontMeaning=card.querySelector('.flip-front .card-translation-box');
 unwrapImageLink(frontImage);
 const info=document.createElement('div');
 info.className='card-back-info';
 [...back.children].forEach(child=>info.appendChild(child));
 const word=info.querySelector('.flip-word');
 if(frontMeaning){
  const meaning=frontMeaning.cloneNode(true);
  meaning.classList.add('card-back-meaning');
  if(word)word.insertAdjacentElement('afterend',meaning);
  else info.prepend(meaning);
 }
 const example=exampleBox(String(word?.textContent||'').trim());
 const audio=info.querySelector('.card-listen-btn');
 if(example){
  if(audio)audio.insertAdjacentElement('beforebegin',example);
  else info.appendChild(example);
 }
 const grid=document.createElement('div');
 grid.className='card-back-grid';
 if(frontImage){
  const image=frontImage.cloneNode(true);
  image.classList.remove('card-image');
  image.classList.add('card-back-image');
  grid.appendChild(image);
 }
 grid.appendChild(info);
 back.appendChild(grid);
 back.dataset.cardRulesReady='1';
}

function bindKeyboard(card){
 if(card.dataset.cardRulesKeyboard==='1')return;
 card.dataset.cardRulesKeyboard='1';
 card.setAttribute('role','button');
 card.setAttribute('aria-label','Karte umdrehen');
 card.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  if(event.target.closest('button,input,textarea,audio,a'))return;
  event.preventDefault();
  card.click();
 });
}

function applyRules(){
 removeSkipControls(document);
 const card=document.getElementById('flipCard');
 if(!card)return;
 bindKeyboard(card);
 standardizeBack(card);
 ensureAnswerHint(card);
}

document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target:null;
 const skip=target?.closest('[data-action="card-next"]');
 if(!skip)return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 skip.remove();
},true);

let scheduled=false;
const scheduleApply=()=>{
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
  scheduled=false;
  applyRules();
 });
};

const observer=new MutationObserver(scheduleApply);
observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
applyRules();
})();
