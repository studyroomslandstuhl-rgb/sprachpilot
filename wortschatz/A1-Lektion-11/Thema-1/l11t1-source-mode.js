(function(){
'use strict';
const KEY='SP_L11_T1_SOURCE_MODE_V2';
function readStored(){
 try{const v=localStorage.getItem(KEY);if(v==='book'||v==='all')return v}catch(e){}
 try{const v=sessionStorage.getItem(KEY);if(v==='book'||v==='all')return v}catch(e){}
 return null;
}
function persist(v){
 try{localStorage.setItem(KEY,v)}catch(e){}
 try{sessionStorage.setItem(KEY,v)}catch(e){}
}
function mode(){
 try{
  const q=new URLSearchParams(location.search).get('words');
  if(q==='book'||q==='all'){persist(q);return q}
 }catch(e){}
 return readStored()||'all';
}
function setMode(v){
 const next=v==='book'?'book':'all';
 persist(next);
 const u=new URL(location.href);
 u.searchParams.set('words',next);
 u.searchParams.set('v','20260916-source3');
 location.href=u.pathname+u.search;
}
function activeCards(){
 const list=window.L11T1?.cards||[];
 return mode()==='book'?list.filter(x=>x.source==='book'):list.slice();
}
function label(){return mode()==='book'?'Buch':'Buch + Unterricht'}
function counts(){const list=window.L11T1?.cards||[];const book=list.filter(x=>x.source==='book').length;return{book,all:list.length}}
function selectorHtml(){
 const m=mode(),c=counts();
 return `<section class="l8-card l11-source-selector" data-source-mode="${m}"><div><h2>Welche Wörter möchtest du trainieren?</h2><p class="l8-small">Diese Auswahl wird für das ganze Thema gespeichert und in allen Aufgaben verwendet.</p></div><div class="l11-source-buttons"><button type="button" data-l11-source="book" class="l11-source-btn book ${m==='book'?'active':''}" aria-pressed="${m==='book'}">Buch · ${c.book}</button><button type="button" data-l11-source="all" class="l11-source-btn all ${m==='all'?'active':''}" aria-pressed="${m==='all'}">Buch + Unterricht · ${c.all}</button></div><div class="l11-source-current">Aktiv: <strong>${label()}</strong></div></section>`
}
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-l11-source]');
 if(!btn)return;
 e.preventDefault();
 setMode(btn.dataset.l11Source);
});
window.L11T1SourceMode={mode,setMode,activeCards,label,counts,selectorHtml,key:KEY};
})();