(function(){
'use strict';
function apply(){
 const wrap=document.querySelector('.l8-overview-page');if(!wrap)return;
 const groups=[...wrap.querySelectorAll('.l8-overview-group')];
 if(groups.length>1){
  const rows=groups.flatMap(g=>[...g.querySelectorAll('.l8-overview-word')]);
  const first=groups[0],list=first.querySelector('.l8-overview-list'),head=first.querySelector('.l8-overview-group-head');
  if(head)head.innerHTML=`<h2>Wörter</h2><span>${rows.length} Wörter</span>`;
  if(list){list.innerHTML='';rows.forEach(r=>list.appendChild(r))}
  groups.slice(1).forEach(g=>g.remove());
 }
 document.querySelectorAll('.l8-overview-word').forEach(row=>{
  const detail=String(row.querySelector('.l8-overview-detail')?.textContent||'').trim();
  row.classList.remove('source-book','source-class');
  if(detail==='Buch')row.classList.add('source-book');
  else if(detail==='Unterricht')row.classList.add('source-class');
 });
 if(!document.querySelector('.l11-source-legend')){
  const intro=document.querySelector('.l8-overview-intro');
  if(intro){const legend=document.createElement('div');legend.className='l11-source-legend';legend.innerHTML='<span class="book">Buch</span><span class="class">Unterricht</span>';intro.appendChild(legend)}
 }
}
new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
[0,80,250,700].forEach(ms=>setTimeout(apply,ms));
})();