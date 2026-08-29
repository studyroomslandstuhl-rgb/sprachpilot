(function(){
'use strict';
if(window.__SP_L8T1_OVERVIEW_EXTRA_20260829)return;window.__SP_L8T1_OVERVIEW_EXTRA_20260829=true;
const wanted=new Set(['eigener','eigene','eigenes','eigenen','arbeiten als','arbeiten bei']);
const noAudio=new Set(['arbeiten als','arbeiten bei']);
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
function decorate(){
 document.getElementById('sp-l8-eigen-grammar')?.remove();
 document.querySelectorAll('.l8-overview-word').forEach(row=>{
  const title=row.querySelector('h3');if(!title)return;const key=norm(title.textContent);if(!wanted.has(key))return;
  row.classList.add('sp-l8-overview-no-image');row.querySelector('.l8-overview-image')?.remove();
  if(noAudio.has(key)){row.classList.add('sp-l8-overview-no-audio');row.querySelector('.l8-overview-audio')?.remove()}
 })
}
const style=document.createElement('style');style.textContent=`.l8-overview-word.sp-l8-overview-no-image{grid-template-columns:minmax(0,1fr) 110px!important}.l8-overview-word.sp-l8-overview-no-image .l8-overview-content{padding-left:8px}.l8-overview-word.sp-l8-overview-no-image.sp-l8-overview-no-audio{grid-template-columns:minmax(0,1fr)!important}@media(max-width:720px){.l8-overview-word.sp-l8-overview-no-image{grid-template-columns:minmax(0,1fr)!important}.l8-overview-word.sp-l8-overview-no-image .l8-overview-audio{grid-column:1!important}}`;document.head.appendChild(style);
const root=document.getElementById('app');if(root)new MutationObserver(decorate).observe(root,{childList:true,subtree:true});window.addEventListener('load',()=>{decorate();setTimeout(decorate,150);setTimeout(decorate,700)});
})();