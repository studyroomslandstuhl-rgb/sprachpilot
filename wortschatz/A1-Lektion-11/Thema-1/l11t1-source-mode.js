(function(){
'use strict';
const KEY='SP_L11_T1_SOURCE_MODE_V2';
function mode(){
 const v=localStorage.getItem(KEY);
 return v==='book'?'book':'all';
}
function setMode(v){
 const next=v==='book'?'book':'all';
 localStorage.setItem(KEY,next);
 location.reload();
}
function activeCards(){
 const list=window.L11T1?.cards||[];
 return mode()==='book'?list.filter(x=>x.source==='book'):list.slice();
}
function label(){return mode()==='book'?'Buch':'Buch + Unterricht'}
function counts(){const list=window.L11T1?.cards||[];const book=list.filter(x=>x.source==='book').length;return{book,all:list.length}}
function selectorHtml(){
 const m=mode(),c=counts();
 return `<section class="l8-card l11-source-selector"><div><h2>Welche Wörter möchtest du trainieren?</h2><p class="l8-small">Diese Auswahl wird für das ganze Thema gespeichert und in allen Aufgaben verwendet.</p></div><div class="l11-source-buttons"><button type="button" class="l11-source-btn book ${m==='book'?'active':''}" onclick="L11T1SourceMode.setMode('book')">Buch · ${c.book}</button><button type="button" class="l11-source-btn all ${m==='all'?'active':''}" onclick="L11T1SourceMode.setMode('all')">Buch + Unterricht · ${c.all}</button></div><div class="l11-source-current">Aktiv: <strong>${label()}</strong></div></section>`
}
window.L11T1SourceMode={mode,setMode,activeCards,label,counts,selectorHtml,key:KEY};
})();