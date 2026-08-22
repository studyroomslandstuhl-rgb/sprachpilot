(function(){
'use strict';
if(window.__SP_L7_CARD_SCROLL_2)return;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
window.__SP_L7_CARD_SCROLL_2=true;

let scheduled=false;
let scrollTimer=null;
let initialScrollDone=false;

function currentCard(){
 return document.querySelector('#verbFlipCard[data-sp-card-ready="1"],#flipCard[data-sp-card-ready="1"],#verbFlipCard,#flipCard');
}
function scrollToCard(card){
 if(initialScrollDone||!card)return;
 clearTimeout(scrollTimer);
 scrollTimer=setTimeout(()=>{
  if(initialScrollDone||!card.isConnected){schedule();return;}
  const target=card.closest('.flip-wrap')||card;
  target.style.scrollMarginTop='14px';
  initialScrollDone=true;
  try{target.scrollIntoView({behavior:'smooth',block:'start',inline:'nearest'});}catch(error){target.scrollIntoView(true);}
 },180);
}
function apply(){
 scheduled=false;
 if(initialScrollDone)return;
 const card=currentCard();
 if(!card)return;
 scrollToCard(card);
}
function schedule(){
 if(scheduled||initialScrollDone)return;
 scheduled=true;
 requestAnimationFrame(apply);
}

const observe=()=>{
 const root=document.getElementById('app')||document.body;
 if(!root)return;
 const observer=new MutationObserver(()=>{if(initialScrollDone){observer.disconnect();return}schedule()});
 observer.observe(root,{childList:true,subtree:true});
 schedule();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
window.addEventListener('load',schedule,{once:true});
[80,220,500,1000].forEach(delay=>setTimeout(schedule,delay));
})();
