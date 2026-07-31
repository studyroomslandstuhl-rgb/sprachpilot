(function(){
'use strict';
if(window.__SP_L7_CARD_SCROLL_1)return;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
window.__SP_L7_CARD_SCROLL_1=true;

let scheduled=false;
let scrollTimer=null;
let lastCard=null;
let lastSignature='';

function currentCard(){
 return document.querySelector('#verbFlipCard[data-sp-card-ready="1"],#flipCard[data-sp-card-ready="1"],#verbFlipCard,#flipCard');
}
function signature(card){
 const word=String(card.querySelector('.flip-word,.word')?.textContent||'').trim();
 const image=String(card.querySelector('img')?.currentSrc||card.querySelector('img')?.src||'');
 const progress=String(document.querySelector('.task-progress-row,.l7-progress-row')?.textContent||'').replace(/\s+/g,' ').trim();
 return [word,image,progress].join('|');
}
function scrollToCard(card){
 const currentSignature=signature(card);
 if(card===lastCard&&currentSignature===lastSignature)return;
 lastCard=card;
 lastSignature=currentSignature;
 clearTimeout(scrollTimer);
 scrollTimer=setTimeout(()=>{
  if(!card.isConnected){lastCard=null;lastSignature='';schedule();return;}
  const target=card.closest('.flip-wrap')||card;
  target.style.scrollMarginTop='14px';
  try{target.scrollIntoView({behavior:'smooth',block:'start',inline:'nearest'});}catch(error){target.scrollIntoView(true);}
 },180);
}
function apply(){
 scheduled=false;
 const card=currentCard();
 if(!card)return;
 scrollToCard(card);
}
function schedule(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(apply);
}

const observe=()=>{
 const root=document.getElementById('app')||document.body;
 if(!root)return;
 new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
 schedule();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
window.addEventListener('load',schedule,{once:true});
[80,220,500,1000,1800,3000].forEach(delay=>setTimeout(schedule,delay));
})();
