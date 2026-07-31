(function(){
'use strict';
if(window.__SP_L7_CARD_EXACT_1)return;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
window.__SP_L7_CARD_EXACT_1=true;

let scheduled=false;
let lastCard=null;
let scrollTimer=null;

const style=document.createElement('style');
style.id='sp-l7-card-exact-style';
style.textContent=`
body.sp-l7-card-standard .flip-back{justify-content:center!important}
body.sp-l7-card-standard .flip-back-grid{
 width:100%!important;
 display:grid!important;
 grid-template-columns:120px minmax(0,1fr)!important;
 gap:12px!important;
 align-items:center!important;
}
body.sp-l7-card-standard .flip-back-image .visual{
 width:120px!important;
 height:120px!important;
 min-height:0!important;
 max-width:120px!important;
 margin:0!important;
 border:0!important;
 border-radius:16px!important;
 background:#fff!important;
 overflow:hidden!important;
}
body.sp-l7-card-standard .flip-back-image .visual img{
 width:100%!important;
 height:100%!important;
 object-fit:contain!important;
 object-position:center!important;
 display:block!important;
}
body.sp-l7-card-standard .flip-back-info{
 min-width:0!important;
 display:grid!important;
 gap:7px!important;
 justify-items:stretch!important;
}
body.sp-l7-card-standard .flip-back .flip-word{
 font-size:25px!important;
 line-height:1.15!important;
 overflow-wrap:anywhere!important;
 text-align:center!important;
}
body.sp-l7-card-standard .flip-back .back-translation{
 width:100%!important;
 margin:0!important;
 padding:8px 9px!important;
}
body.sp-l7-card-standard .flip-back .back-translation strong{font-size:17px!important}
body.sp-l7-card-standard .flip-back .card-details{
 width:100%!important;
 max-width:none!important;
 display:grid!important;
 gap:7px!important;
}
body.sp-l7-card-standard .flip-back .card-details>div{padding:8px 9px!important}
body.sp-l7-card-standard .flip-back .card-listen-btn{
 justify-self:center!important;
 margin-top:0!important;
}
body.sp-l7-card-standard #feedback .hint{text-align:center!important}
@media(max-width:640px){
 body.sp-l7-card-standard .flip-back-grid{grid-template-columns:1fr!important;gap:8px!important}
 body.sp-l7-card-standard .flip-back-image .visual{
  width:100px!important;
  height:100px!important;
  max-width:100px!important;
  margin:0 auto!important;
 }
 body.sp-l7-card-standard .flip-back .flip-word{font-size:23px!important}
 body.sp-l7-card-standard .flip-back .back-translation strong{font-size:16px!important}
 body.sp-l7-card-standard .flip-back .card-details>div{padding:7px 9px!important}
}
`;
document.head.appendChild(style);

function cleanVisualClasses(){
 document.querySelectorAll('#verbFlipCard .visual').forEach(visual=>{
  visual.classList.remove('l7-image','card-image','l7-learning');
 });
}

function setShortInstruction(){
 const card=document.getElementById('verbFlipCard');
 if(!card?.classList.contains('flipped'))return;
 const feedback=document.getElementById('feedback');
 if(!feedback)return;
 const text=String(feedback.textContent||'').replace(/\s+/g,' ').trim();
 if(!text||/Sprich das Wort|Erst eine richtige Antwort|Sprich oder schreib das Wort/i.test(text)){
  feedback.innerHTML='<div class="hint">Sprich oder schreib das Wort.</div>';
 }
}

function autoScroll(){
 const card=document.getElementById('verbFlipCard');
 const target=card?.closest('.flip-wrap')||card;
 if(!target||target===lastCard)return;
 lastCard=target;
 clearTimeout(scrollTimer);
 scrollTimer=setTimeout(()=>{
  if(!document.contains(target))return;
  target.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'});
 },180);
}

function apply(){
 scheduled=false;
 cleanVisualClasses();
 setShortInstruction();
 autoScroll();
}
function schedule(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(apply);
}

const root=document.getElementById('app')||document.body;
new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
[0,80,220,600,1400,3000].forEach(delay=>setTimeout(schedule,delay));
})();
