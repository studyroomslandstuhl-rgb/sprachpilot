(function(){
'use strict';
const KEY='SP_L11_T1_SOURCE_MODE_V1';
function mode(){try{const q=new URLSearchParams(location.search).get('words');if(['book','class','all'].includes(q)){localStorage.setItem(KEY,q);return q}}catch(e){}const v=localStorage.getItem(KEY);return ['book','class','all'].includes(v)?v:'all'}
function setMode(v){const next=['book','class','all'].includes(v)?v:'all';localStorage.setItem(KEY,next);const u=new URL(location.href);u.searchParams.set('words',next);u.searchParams.set('v','20260916-source1');location.href=u.pathname+u.search}
function activeCards(){const list=window.L11T1?.cards||[],m=mode();if(m==='all')return list.slice();return list.filter(x=>x.source===m||x.source==='both')}
function label(){return mode()==='book'?'Wörter aus dem Buch':mode()==='class'?'Wörter aus dem Unterricht':'Alle Wörter'}
function counts(){const list=window.L11T1?.cards||[];return{book:list.filter(x=>x.source==='book'||x.source==='both').length,class:list.filter(x=>x.source==='class'||x.source==='both').length,all:list.length}}
function selectorHtml(){const m=mode(),c=counts();return `<section class="l8-card l11-source-selector"><div><h2>Welche Wörter möchtest du üben?</h2><p class="l8-small">Wähle Wörter aus dem Buch, Wörter aus dem Unterricht oder alle Wörter zusammen.</p></div><div class="l11-source-buttons"><button type="button" class="l11-source-btn book ${m==='book'?'active':''}" onclick="L11T1SourceMode.setMode('book')">Buch · ${c.book}</button><button type="button" class="l11-source-btn class ${m==='class'?'active':''}" onclick="L11T1SourceMode.setMode('class')">Unterricht · ${c.class}</button><button type="button" class="l11-source-btn all ${m==='all'?'active':''}" onclick="L11T1SourceMode.setMode('all')">Alle · ${c.all}</button></div><div class="l11-source-current">Aktiv: <strong>${label()}</strong></div></section>`}
window.L11T1SourceMode={mode,setMode,activeCards,label,counts,selectorHtml};
})();
