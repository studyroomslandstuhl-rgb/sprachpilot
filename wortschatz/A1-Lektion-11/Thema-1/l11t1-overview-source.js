(function(){
'use strict';
function apply(){
 const wrap=document.querySelector('.l8-overview-page');if(!wrap)return;
 if(!document.querySelector('.l11-source-selector')&&window.L11T1SourceMode){
  const intro=wrap.querySelector('.l8-overview-intro');
  const box=document.createElement('div');box.innerHTML=window.L11T1SourceMode.selectorHtml();
  intro?.after(box.firstElementChild);
 }
 document.querySelectorAll('.l8-overview-word').forEach(row=>{
  const detail=String(row.querySelector('.l8-overview-detail')?.textContent||'').trim();
  row.classList.remove('source-book','source-class','source-both','source-phrase');
  if(detail==='Buch')row.classList.add('source-book');
  else if(detail==='Unterricht')row.classList.add('source-class');
  else if(detail==='Buch + Unterricht')row.classList.add('source-both');
  else if(detail==='Redemittel')row.classList.add('source-phrase');
 });
 if(!document.querySelector('.l11-source-legend')){
  const selector=document.querySelector('.l11-source-selector');
  if(selector){const legend=document.createElement('div');legend.className='l11-source-legend';legend.innerHTML='<span class="book">Buch</span><span class="class">Unterricht</span><span class="both">Buch + Unterricht</span><span class="phrase">Redemittel</span>';selector.appendChild(legend)}
 }
}
new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
[0,80,250,700].forEach(ms=>setTimeout(apply,ms));
})();
