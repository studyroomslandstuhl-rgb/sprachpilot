(function(){
'use strict';
if(window.__SP_L8T2_OVERVIEW_GRAMMAR_V2)return;window.__SP_L8T2_OVERVIEW_GRAMMAR_V2=true;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function theme(){return window.L8_THEME||window.L8_ALL_THEMES?.[2]||window.L8_ALL_THEMES?.['2']}
function grouped(rows){const out=[];for(const row of rows){const title=String(row?.group||'Grammatische Strukturen');let group=out.find(item=>item.title===title);if(!group){group={title,rows:[]};out.push(group)}group.rows.push(row)}return out}
function item(row){return`<article class="l8t2-grammar-item"><h4>${esc(row.title)}</h4>${row.text?`<p>${esc(row.text)}</p>`:''}</article>`}
function render(){
 if(document.getElementById('l8t2GrammarOverview'))return true;
 const intro=document.querySelector('.l8-overview-intro');if(!intro)return false;
 intro.querySelector('p')?.remove();
 const rows=theme()?.grammarOverview||[];if(!rows.length)return true;
 const section=document.createElement('section');section.id='l8t2GrammarOverview';section.className='l8-card l8t2-grammar-overview';
 section.innerHTML=`<div class="l8-overview-eyebrow">GRAMMATIK</div><h2>Grammatische Strukturen</h2><div class="l8t2-grammar-groups">${grouped(rows).map(group=>`<div class="l8t2-grammar-group"><h3>${esc(group.title)}</h3><div class="l8t2-grammar-grid">${group.rows.map(item).join('')}</div></div>`).join('')}</div>`;
 intro.insertAdjacentElement('afterend',section);return true;
}
const style=document.createElement('style');style.textContent=`
.l8t2-grammar-overview h2{margin:4px 0 18px;color:var(--lesson-main-dark);font-size:29px}.l8t2-grammar-groups{display:grid;gap:20px}.l8t2-grammar-group h3{margin:0 0 10px;color:var(--lesson-main-dark);font-size:21px}.l8t2-grammar-grid{display:grid;gap:10px}.l8t2-grammar-item{border:2px solid var(--lesson-line);border-radius:18px;padding:14px 16px;background:var(--lesson-soft)}.l8t2-grammar-item h4{margin:0;color:var(--lesson-main-dark);font-size:20px}.l8t2-grammar-item p{margin:7px 0 0;line-height:1.45}
`;document.head.appendChild(style);
Promise.resolve(window.L8_T2_OVERVIEW_CONFIG_READY||window.L8_T2_CURRENT_READY).then(()=>{if(render())return;let n=0;const t=setInterval(()=>{if(render()||++n>80)clearInterval(t)},50)}).catch(()=>{});
})();
