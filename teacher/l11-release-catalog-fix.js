(function(){
'use strict';
if(window.__SP_MODERN_RELEASE_CATALOG_FIX_20260916)return;
window.__SP_MODERN_RELEASE_CATALOG_FIX_20260916=true;

const T1=[
 ['task.html?task=karteikarten','Karteikarten'],
 ['task.html?task=bild-wort','Bild – Wort'],
 ['task.html?task=wort-bild','Wort – Bild'],
 ['task.html?task=hoeren-bild','Hören – Bild'],
 ['task.html?task=memory','Memory: Bild und Wort'],
 ['task.html?task=ort-finden','Wo kann man das machen?'],
 ['task.html?task=satzbausteine','Fragen und Wegbeschreibungen'],
 ['task.html?task=luecken-dialoge','Dialoge mit Bild-Lücken'],
 ['task.html?task=dialog-reihenfolge','Dialoge ordnen'],
 ['task.html?task=pruefung','Prüfung']
];
const T2=[
 ['task.html?task=karteikarten','Karteikarten'],
 ['task.html?task=bild-wort','Bild – Wort'],
 ['task.html?task=wort-bild','Wort – Bild'],
 ['task.html?task=hoeren-bild','Hören – Bild'],
 ['task.html?task=memory','Memory'],
 ['task.html?task=fahren-mit','fahren mit'],
 ['task.html?task=fahren-zu','fahren zu'],
 ['task.html?task=mit-und-zu','fahren mit + fahren zu'],
 ['task.html?task=pruefung','Prüfung']
];

function uniqPaths(paths){
 const seen=new Set();
 return (paths||[]).filter(p=>{const k=JSON.stringify(p);if(seen.has(k))return false;seen.add(k);return true});
}
function modernAlias(file){
 const raw=String(file||'').trim();
 if(!raw||raw.startsWith('task.html?task='))return raw;
 const m=raw.match(/(?:^|\/)([^/?#]+)\.html(?:[?#].*)?$/i);
 if(!m)return raw;
 const id=m[1].toLowerCase();
 if(['index','uebersicht','statistik'].includes(id))return raw;
 return 'task.html?task='+encodeURIComponent(id);
}
function installTaskAliases(){
 if(typeof taskReleasePaths!=='function'||taskReleasePaths.__modernAliases20260916)return false;
 const original=taskReleasePaths;
 const wrapped=function(lessonKey,themeKey,file){
   const base=original(lessonKey,themeKey,file)||[];
   const alias=modernAlias(file);
   if(!alias||alias===file)return base;
   const extra=original(lessonKey,themeKey,alias)||[];
   return uniqPaths(base.concat(extra));
 };
 wrapped.__modernAliases20260916=true;
 wrapped.__original=original;
 try{taskReleasePaths=wrapped;}catch(e){window.taskReleasePaths=wrapped;}
 return true;
}
function patchCatalog(){
 if(typeof RELEASE_CATALOG==='undefined'||!RELEASE_CATALOG?.lessons)return false;
 const lesson=RELEASE_CATALOG.lessons.find(l=>l&&l.key==='A1-Lektion-11');
 if(!lesson)return false;
 const t1=(lesson.themes||[]).find(t=>t&&t.key==='Thema-1');
 const t2=(lesson.themes||[]).find(t=>t&&t.key==='Thema-2');
 if(t1){t1.title='Thema 1 · In der Stadt unterwegs';t1.tasks=T1.slice();}
 if(t2){t2.title='Thema 2 · Verkehrsmittel';t2.tasks=T2.slice();}
 lesson.title='A1 Lektion 11';
 return true;
}
function patch(){
 const a=patchCatalog();
 const b=installTaskAliases();
 if(a&&b){window.__SP_MODERN_RELEASE_CATALOG_READY=true;return true;}
 return false;
}

if(!patch()){
 let tries=0;
 const timer=setInterval(()=>{tries++;if(patch()||tries>300)clearInterval(timer)},100);
 window.addEventListener('beforeunload',()=>clearInterval(timer),{once:true});
}
})();
