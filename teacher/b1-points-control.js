(function(){
'use strict';
if(window.__SP_B1_POINTS_CONTROL_V1)return;
window.__SP_B1_POINTS_CONTROL_V1=true;
let timer=null;
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function state(){return window.SPTeacherDashboard?.state||null}
function summary(){
  const direct=window.SPB1PointRecalculation?.lastSummary;if(direct)return direct;
  try{return JSON.parse(sessionStorage.getItem('SP_B1_POINT_RECALC_SUMMARY')||'null')}catch{return null}
}
function render(){
  clearTimeout(timer);timer=setTimeout(()=>{
    const s=state(),app=document.getElementById('app');if(!s?.isOwner||!app||!['overview','students'].includes(s.view))return;
    const head=app.querySelector('.sp-page-head');
    if(head&&!head.querySelector('[data-b1-recalc-button]')){
      const box=document.createElement('div');box.className='sp-row-actions';
      const button=document.createElement('button');button.className='sp-button secondary';button.type='button';button.dataset.b1RecalcButton='1';button.textContent='B1-Punkte neu berechnen';
      button.onclick=async()=>{button.disabled=true;button.textContent='B1-Punkte werden berechnet …';try{await window.SPB1PointRecalculation?.run?.({force:true,refresh:true})}finally{button.disabled=false;button.textContent='B1-Punkte neu berechnen'}};
      box.appendChild(button);head.appendChild(box);
    }
    const info=summary();
    if(info&&!app.querySelector('[data-b1-recalc-summary]')){
      const card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.b1RecalcSummary='1';
      card.style.marginBottom='16px';
      card.innerHTML=`<h2>B1-Punkte geprüft</h2><p>Kurs <strong>${esc(info.course||'B174698')}</strong>: ${Number(info.processed)||0} TN geprüft · ${Number(info.updated)||0} korrigiert · ${Number(info.skipped)||0} bereits aktuell · ${Number(info.noEvidence)||0} ohne sichere Punktquelle · ${Number(info.failed)||0} Fehler.</p>`;
      head?.insertAdjacentElement('afterend',card);
    }
  },40);
}
const observer=new MutationObserver(render);observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('SP_B1_POINTS_RECALCULATED',render);
[600,1200,2500].forEach(delay=>setTimeout(render,delay));
})();
