(function(){
'use strict';
if(window.__SP_L8T1_OVERVIEW_EXTRA_V2)return;window.__SP_L8T1_OVERVIEW_EXTRA_V2=true;
const wanted=new Set(['eigener','eigene','eigenes','eigenen','arbeiten als','arbeiten bei']);
const noAudio=new Set(['arbeiten als','arbeiten bei']);
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1'];if(!theme)return themes;const cards=(theme.tasks||[]).find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''));if(!cards||!Array.isArray(cards.items))return themes;const extras=(theme.overviewOnlyItems||[]).filter(item=>wanted.has(norm(term(item))));for(const item of extras)if(!cards.items.some(existing=>norm(term(existing))===norm(term(item))))cards.items.push({...item,__overviewOnly:true});return themes});
function grammarBox(){
 if(document.getElementById('sp-l8-eigen-grammar'))return;
 const intro=document.querySelector('.l8-overview-intro');if(!intro)return;
 const box=document.createElement('section');box.id='sp-l8-eigen-grammar';box.className='l8-card sp-l8-eigen-grammar';box.innerHTML=`<div class="sp-l8-eigen-kicker">GRAMMATIK</div><h2>eigen-: eigener, eigene, eigenes, eigenen</h2><p><strong>Wichtig:</strong> <em>eigen-</em> steht hier vor einem Nomen. Davor steht ein Artikel oder ein Possessivwort. Lerne deshalb immer die ganze Gruppe.</p><div class="sp-l8-eigen-grid"><div><b>der</b><span>ein eigener Chef<br>mein eigener Chef</span></div><div><b>die</b><span>eine eigene Firma<br>meine eigene Firma</span></div><div><b>das</b><span>ein eigenes Büro<br>mein eigenes Büro</span></div><div><b>den</b><span>einen eigenen Arbeitsplatz<br>meinen eigenen Arbeitsplatz</span></div></div><p class="sp-l8-eigen-note">Also nicht nur „eigenes“ lernen, sondern z. B. <b>ein eigenes Büro</b> oder <b>mein eigenes Büro</b>.</p>`;
 intro.insertAdjacentElement('afterend',box);
}
function decorate(){
 grammarBox();
 document.querySelectorAll('.l8-overview-word').forEach(row=>{
  const title=row.querySelector('h3');if(!title)return;const key=norm(title.textContent);if(!wanted.has(key))return;
  row.classList.add('sp-l8-overview-no-image');row.querySelector('.l8-overview-image')?.remove();
  if(noAudio.has(key)){row.classList.add('sp-l8-overview-no-audio');row.querySelector('.l8-overview-audio')?.remove()}
 })
}
const style=document.createElement('style');style.textContent=`
.l8-overview-word.sp-l8-overview-no-image{grid-template-columns:minmax(0,1fr) 110px!important}.l8-overview-word.sp-l8-overview-no-image .l8-overview-content{padding-left:8px}.l8-overview-word.sp-l8-overview-no-image.sp-l8-overview-no-audio{grid-template-columns:minmax(0,1fr)!important}
.sp-l8-eigen-grammar h2{margin:4px 0 12px;color:var(--lesson-main-dark);font-size:27px}.sp-l8-eigen-kicker{font-size:13px;font-weight:950;letter-spacing:.08em;color:var(--lesson-main-dark)}.sp-l8-eigen-grammar p{font-size:17px;line-height:1.5}.sp-l8-eigen-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}.sp-l8-eigen-grid>div{display:grid;grid-template-columns:52px minmax(0,1fr);gap:8px;padding:12px;border:2px solid var(--lesson-line);border-radius:14px;background:var(--lesson-soft)}.sp-l8-eigen-grid b{color:var(--lesson-main-dark);font-size:18px}.sp-l8-eigen-grid span{line-height:1.45}.sp-l8-eigen-note{margin-bottom:0!important;padding-top:4px}
@media(max-width:720px){.l8-overview-word.sp-l8-overview-no-image{grid-template-columns:minmax(0,1fr)!important}.l8-overview-word.sp-l8-overview-no-image .l8-overview-audio{grid-column:1!important}.sp-l8-eigen-grid{grid-template-columns:1fr}}
`;document.head.appendChild(style);
const root=document.getElementById('app');if(root)new MutationObserver(decorate).observe(root,{childList:true,subtree:true});window.addEventListener('load',()=>{decorate();setTimeout(decorate,150);setTimeout(decorate,700)});
})();