(function(){
'use strict';
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
if(window.__SP_L8T2_CARD_NEXT_20260902)return;
window.__SP_L8T2_CARD_NEXT_20260902=true;

function installNext(){
 const feedback=document.getElementById('feedback');
 if(!feedback||!feedback.querySelector('.l8-feedback.good'))return;
 if(document.getElementById('l8t2CardNext'))return;
 const wrap=document.createElement('div');
 wrap.className='l8-row l8-center-actions sp-l8t2-card-next-wrap';
 const btn=document.createElement('button');
 btn.id='l8t2CardNext';
 btn.type='button';
 btn.className='l8-btn primary';
 btn.textContent='Weiter';
 btn.onclick=()=>{
  btn.disabled=true;
  try{window.L8UI?.taskPage?.()}catch(error){console.error('L8T2 nächste Karte',error)}
 };
 wrap.appendChild(btn);
 feedback.insertAdjacentElement('afterend',wrap);
}

const root=document.getElementById('app');
if(root)new MutationObserver(installNext).observe(root,{childList:true,subtree:true});
[0,80,200,500].forEach(ms=>setTimeout(installNext,ms));

const style=document.createElement('style');
style.textContent=`
.sp-l8t2-card-next-wrap{max-width:620px;margin:10px auto 0!important}
.sp-l8t2-card-next-wrap .l8-btn{min-width:180px;min-height:48px}
`;
document.head.appendChild(style);
})();
