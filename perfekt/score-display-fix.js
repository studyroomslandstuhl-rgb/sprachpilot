(function(){
'use strict';
if(window.__SP_PERFEKT_SCORE_DISPLAY_FIX_V1)return;
window.__SP_PERFEKT_SCORE_DISPLAY_FIX_V1=true;
function total(){
 let floor=0,active=0;
 try{floor=Number(window.SPPerfektRegroupRecovery?.pointFloor?.())||0}catch{}
 try{active=Number(window.SPPerfektRegroupRecovery?.activePoints?.())||0}catch{}
 return Math.max(0,floor,active)
}
function apply(){
 const cards=[...document.querySelectorAll('#app .score-card')];if(!cards.length)return;
 const keep=cards[0];cards.slice(1).forEach(card=>card.remove());
 const points=total();
 keep.classList.add('compact-score','sp-perfekt-total-score');
 keep.innerHTML=`<h2>${points} Punkte</h2><span>gesamt</span>`;
}
const style=document.createElement('style');style.textContent=`
.sp-perfekt-total-score{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;min-height:0!important;padding:24px 28px!important}.sp-perfekt-total-score h2{margin:0!important}.sp-perfekt-total-score>span{font-weight:800;color:#596579}.sp-perfekt-total-score .score-total,.sp-perfekt-total-score .eyebrow,.sp-perfekt-total-score p,.sp-perfekt-total-score button{display:none!important}
@media(max-width:520px){.sp-perfekt-total-score{padding:20px 22px!important}.sp-perfekt-total-score h2{font-size:34px!important}}
`;document.head.appendChild(style);
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
window.addEventListener('pageshow',schedule);window.addEventListener('popstate',schedule);document.addEventListener('click',()=>setTimeout(schedule,60));schedule();
window.SPPerfektScoreDisplayFix={apply,total};
})();