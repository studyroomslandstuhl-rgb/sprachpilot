(function(){
'use strict';
if(window.__SP_DATIV_CARD_GUARD_V6)return;
window.__SP_DATIV_CARD_GUARD_V6=true;

const root=document.getElementById('app');
if(!root)return;
let bypass=false,frame=0;
const NOTE='Sieh das Bild und sprich oder schreibe das Verb. Wenn du die Karte umdrehst und die Lösung ansiehst, zählt sie nicht als richtig und kommt später noch einmal.';

function isCardTask(){
 const q=new URLSearchParams(location.search);
 return q.get('task')==='cards'&&!!q.get('group');
}
function feedback(text){
 const box=document.getElementById('feedback');
 if(!box)return;
 box.className='feedback no';
 box.textContent=text;
}
function markPeeked(flip){
 if(!flip||flip.dataset.spPeeked==='1')return;
 flip.dataset.spPeeked='1';
 setTimeout(()=>feedback('Du hast die Lösung angesehen. Dieses Verb zählt jetzt nicht als richtig und kommt später noch einmal.'),0);
}
function revealPracticeActions(){
 if(!isCardTask())return;
 const actions=document.getElementById('cardActions');
 if(actions?.hidden)actions.hidden=false;
 const note=root.querySelector('.card-learning-note');
 if(note&&note.textContent!==NOTE)note.textContent=NOTE;
}
function appClick(button){
 if(!button)return;
 bypass=true;
 try{button.click()}finally{bypass=false}
}
function repeatPeekedCard(){
 const flip=document.getElementById('verbFlipCard');
 if(!flip||flip.dataset.spPeeked!=='1')return false;
 const correct=String(flip.querySelector('.flip-word')?.textContent||'').trim();
 const input=document.getElementById('cardAnswerInput');
 const box=document.getElementById('cardAnswerBox');
 const check=document.querySelector('[data-action="card-check"]');
 if(!correct||!input||!check)return false;
 if(box)box.classList.remove('hidden');
 // Ein absichtlich falscher interner Versuch setzt die vorhandene Wiederholungslogik.
 // Danach wird die sichtbare Lösung nur zum Weitergehen verwendet; sie landet NICHT in done.
 input.value='__loesung_angesehen__';
 appClick(check);
 input.value=correct;
 appClick(check);
 feedback('Lösung angesehen – nicht als richtig gezählt. Das Verb kommt später noch einmal.');
 return true;
}
function decorate(){
 frame=0;
 revealPracticeActions();
 const flip=document.getElementById('verbFlipCard');
 if(flip?.classList.contains('flipped'))markPeeked(flip);
}
function schedule(){if(frame)return;frame=requestAnimationFrame(decorate)}

// Capture-Phase: Die Karte wird als „angesehen“ markiert, bevor die bestehende Flip-Logik läuft.
document.addEventListener('click',event=>{
 if(bypass||!isCardTask())return;
 const flip=event.target.closest?.('#verbFlipCard');
 if(flip&&!event.target.closest?.('[data-action="audio"]'))markPeeked(flip);
 const action=event.target.closest?.('[data-action]')?.dataset.action||'';
 if(!['card-check','card-mic'].includes(action))return;
 const current=document.getElementById('verbFlipCard');
 if(current?.dataset.spPeeked!=='1')return;
 event.preventDefault();event.stopImmediatePropagation();
 repeatPeekedCard();
},true);

document.addEventListener('keydown',event=>{
 if(bypass||!isCardTask())return;
 const flip=event.target?.closest?.('#verbFlipCard');
 if(flip&&(event.key==='Enter'||event.key===' '))markPeeked(flip);
 if(event.target?.id==='cardAnswerInput'&&event.key==='Enter'&&document.getElementById('verbFlipCard')?.dataset.spPeeked==='1'){
   event.preventDefault();event.stopImmediatePropagation();repeatPeekedCard();
 }
},true);

new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
window.addEventListener('popstate',schedule);
window.addEventListener('load',schedule);
schedule();
})();
