(function(){
'use strict';
if(window.__SP_L8T3_OVERVIEW_GRAMMAR_20260831_V2)return;window.__SP_L8T3_OVERVIEW_GRAMMAR_20260831_V2=true;
if(Number(document.body?.dataset?.theme)!==3||document.body?.dataset?.page!=='overview')return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SEIN=[['ich','war'],['du','warst'],['er / sie / es','war'],['wir','waren'],['ihr','wart'],['sie / Sie','waren']];
const HABEN=[['ich','hatte'],['du','hattest'],['er / sie / es','hatte'],['wir','hatten'],['ihr','hattet'],['sie / Sie','hatten']];
const rows=list=>list.map(([p,f])=>`<div class="l8t3-conj-row"><span>${esc(p)}</span><strong>${esc(f)}</strong></div>`).join('');
function render(){
 const page=document.querySelector('.l8-overview-page');if(!page)return false;
 page.querySelector('.l8-overview-intro')?.remove();
 if(document.getElementById('l8t3-grammar'))return true;
 const firstGroup=page.querySelector('.l8-overview-group');if(!firstGroup)return false;
 const section=document.createElement('section');section.className='l8-card l8t3-grammar';section.id='l8t3-grammar';section.innerHTML=`
  <h2>Grammatik: Präteritum</h2>
  <div class="l8t3-formula"><strong>sein → war</strong><span>haben → hatte</span></div>
  <div class="l8t3-conj-grid">
   <div class="l8t3-conj"><h3>sein</h3>${rows(SEIN)}</div>
   <div class="l8t3-conj"><h3>haben</h3>${rows(HABEN)}</div>
  </div>
  <div class="l8t3-rule"><strong>Merke:</strong> <span>ich = er / sie / es</span><br><b>war · hatte</b> — keine zusätzliche Personalendung.</div>`;
 firstGroup.before(section);return true;
}
const style=document.createElement('style');style.textContent=`
.l8t3-grammar h2{margin:0 0 14px;color:var(--lesson-main-dark);font-size:29px}.l8t3-formula{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 16px}.l8t3-formula strong,.l8t3-formula span{padding:9px 13px;border-radius:999px;background:var(--lesson-soft);color:var(--lesson-main-dark);font-size:17px}.l8t3-conj-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.l8t3-conj{border:2px solid var(--lesson-line);border-radius:18px;padding:14px;background:#fff}.l8t3-conj h3{margin:0 0 8px;color:var(--lesson-main-dark);font-size:20px}.l8t3-conj-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:6px 2px;border-top:1px solid var(--lesson-line);font-size:17px}.l8t3-conj-row:first-of-type{border-top:0}.l8t3-conj-row strong{color:var(--lesson-main-dark)}.l8t3-rule{margin-top:14px;padding:12px 15px;border-radius:16px;background:var(--lesson-soft);font-size:17px;line-height:1.5}.l8t3-rule span{font-weight:900;color:var(--lesson-main-dark)}@media(max-width:650px){.l8t3-conj-grid{grid-template-columns:1fr}.l8t3-grammar h2{font-size:25px}}
`;document.head.appendChild(style);
const root=document.getElementById('app');if(root)new MutationObserver(()=>render()).observe(root,{childList:true,subtree:true});[0,50,150,400,900].forEach(ms=>setTimeout(render,ms));
})();