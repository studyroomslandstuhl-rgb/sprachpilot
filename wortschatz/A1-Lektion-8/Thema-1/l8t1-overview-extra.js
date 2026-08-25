(function(){
'use strict';
if(window.__SP_L8T1_OVERVIEW_EXTRA_V1)return;window.__SP_L8T1_OVERVIEW_EXTRA_V1=true;
const wanted=new Set(['eigen','eigene','eigenes','arbeiten als','arbeiten bei']);
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1'];if(!theme)return themes;const cards=(theme.tasks||[]).find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''));if(!cards||!Array.isArray(cards.items))return themes;const extras=(theme.overviewOnlyItems||[]).filter(item=>wanted.has(norm(term(item))));for(const item of extras)if(!cards.items.some(existing=>norm(term(existing))===norm(term(item))))cards.items.push({...item,__overviewOnly:true});return themes});
function decorate(){document.querySelectorAll('.l8-overview-word').forEach(row=>{const title=row.querySelector('h3');if(!title||!wanted.has(norm(title.textContent)))return;row.classList.add('sp-l8-overview-no-image');row.querySelector('.l8-overview-image')?.remove()})}
const style=document.createElement('style');style.textContent='.l8-overview-word.sp-l8-overview-no-image{grid-template-columns:minmax(0,1fr) 110px!important}.l8-overview-word.sp-l8-overview-no-image .l8-overview-content{padding-left:8px}@media(max-width:720px){.l8-overview-word.sp-l8-overview-no-image{grid-template-columns:minmax(0,1fr)!important}.l8-overview-word.sp-l8-overview-no-image .l8-overview-audio{grid-column:1!important}}';document.head.appendChild(style);
const root=document.getElementById('app');if(root)new MutationObserver(decorate).observe(root,{childList:true,subtree:true});window.addEventListener('load',()=>{decorate();setTimeout(decorate,150);setTimeout(decorate,700)});
})();