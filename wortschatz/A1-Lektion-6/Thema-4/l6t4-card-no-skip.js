(function(){
'use strict';
if(window.__L6T4_CARD_NO_SKIP_20260730)return;
window.__L6T4_CARD_NO_SKIP_20260730=true;

function isCardEventTarget(event){
 const card=event.target.closest?.('#verbFlipCard');
 if(!card)return null;
 if(event.target.closest?.('button,input,textarea,audio,a'))return null;
 return card;
}

function flipOnly(card){
 if(!card.classList.contains('flipped'))card.classList.add('flipped');
 const feedback=document.getElementById('feedback');
 if(feedback&&!feedback.textContent.trim()){
  feedback.innerHTML='<div class="hint">Sprich das Wort oder schreibe es. Erst eine richtige Antwort geht weiter.</div>';
 }
 const after=document.getElementById('cardAfter');
 if(after)after.innerHTML='';
}

document.addEventListener('click',event=>{
 const card=isCardEventTarget(event);
 if(!card)return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 flipOnly(card);
},true);

document.addEventListener('keydown',event=>{
 if(event.key!=='Enter'&&event.key!==' ')return;
 const card=isCardEventTarget(event);
 if(!card)return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 flipOnly(card);
},true);
})();
