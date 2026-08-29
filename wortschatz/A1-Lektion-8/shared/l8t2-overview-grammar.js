(function(){
'use strict';
if(window.__SP_L8T2_OVERVIEW_GRAMMAR_V1)return;window.__SP_L8T2_OVERVIEW_GRAMMAR_V1=true;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function theme(){return window.L8_THEME||window.L8_ALL_THEMES?.[2]||window.L8_ALL_THEMES?.['2']}
function render(){
 if(document.getElementById('l8t2GrammarOverview'))return true;
 const intro=document.querySelector('.l8-overview-intro');if(!intro)return false;
 const rows=theme()?.grammarOverview||[];if(!rows.length)return true;
 const section=document.createElement('section');section.id='l8t2GrammarOverview';section.className='l8-card l8t2-grammar-overview';
 section.innerHTML=`<div class="l8-overview-eyebrow">GRAMMATIK</div><h2>Wichtige Strukturen</h2><p class="l8t2-grammar-note">Diese Strukturen sind keine neuen Wörter. Deshalb brauchen sie keine Bilder.</p><div class="l8t2-grammar-grid">${rows.map(row=>`<article class="l8t2-grammar-item"><h3>${esc(row.title)}</h3><p>${esc(row.text)}</p><div class="l8t2-grammar-example">${esc(row.example)}</div></article>`).join('')}</div>`;
 intro.insertAdjacentElement('afterend',section);return true;
}
const style=document.createElement('style');style.textContent=`
.l8t2-grammar-overview h2{margin:4px 0 8px;color:var(--lesson-main-dark);font-size:29px}.l8t2-grammar-note{margin:0 0 15px;color:var(--lesson-muted);font-size:16px}.l8t2-grammar-grid{display:grid;gap:12px}.l8t2-grammar-item{border:2px solid var(--lesson-line);border-radius:18px;padding:14px 16px;background:var(--lesson-soft)}.l8t2-grammar-item h3{margin:0 0 6px;color:var(--lesson-main-dark);font-size:20px}.l8t2-grammar-item p{margin:0;line-height:1.45}.l8t2-grammar-example{margin-top:8px;padding:9px 11px;border-radius:12px;background:#fff;font-weight:800}
`;document.head.appendChild(style);
Promise.resolve(window.L8_T2_CURRENT_READY).then(()=>{if(render())return;let n=0;const t=setInterval(()=>{if(render()||++n>80)clearInterval(t)},50)}).catch(()=>{});
})();
