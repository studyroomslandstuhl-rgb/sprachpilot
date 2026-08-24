(function(){
'use strict';
if(window.__SP_RELEASE_CATALOG_L3_L7_LOADER)return;window.__SP_RELEASE_CATALOG_L3_L7_LOADER=true;
function merge(){
 const source=window.SP_A1_RELEASE_CATALOG_L3_L7?.lessons;
 const target=window.RELEASE_CATALOG?.lessons;
 if(!Array.isArray(source)||!Array.isArray(target))return false;
 const replacements=new Map(source.map(item=>[item.key,item]));
 window.RELEASE_CATALOG.lessons=target.map(item=>replacements.get(item.key)||item);
 for(const item of source)if(!window.RELEASE_CATALOG.lessons.some(row=>row.key===item.key))window.RELEASE_CATALOG.lessons.push(item);
 return true;
}
function startMergeWatch(){
 if(merge())return;
 let tries=0;const timer=setInterval(()=>{tries++;if(merge()||tries>120)clearInterval(timer)},100);
}
if(window.SP_A1_RELEASE_CATALOG_L3_L7)startMergeWatch();
else{
 const s=document.createElement('script');s.src='/shared/release-catalog-a1-l3-l7.js?v=1';s.onload=startMergeWatch;s.onerror=()=>console.warn('Freigabe-Katalog L3–L7 konnte nicht geladen werden');document.head.appendChild(s);
}
window.addEventListener('SP_RELEASE_EDITOR_READY',merge);
})();