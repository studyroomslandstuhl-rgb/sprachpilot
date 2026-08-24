(function(){
'use strict';
if(window.__SP_RELEASE_CATALOG_L3_L7_LOADER_V2)return;window.__SP_RELEASE_CATALOG_L3_L7_LOADER_V2=true;
function merge(){
 const source=window.SP_A1_RELEASE_CATALOG_L3_L7?.lessons;
 const target=window.RELEASE_CATALOG?.lessons;
 if(!Array.isArray(source)||!Array.isArray(target))return false;
 const replacements=new Map(source.map(item=>[item.key,item]));
 window.RELEASE_CATALOG.lessons=target.map(item=>replacements.get(item.key)||item);
 for(const item of source)if(!window.RELEASE_CATALOG.lessons.some(row=>row.key===item.key))window.RELEASE_CATALOG.lessons.push(item);
 window.RELEASE_CATALOG.version='a1-l3-l7-real-20260824-v2';
 return true;
}
function patchRenderer(){
 const raw=window.renderReleaseEditor;if(typeof raw!=='function'||raw.__spRealCatalogV2)return false;
 function wrapped(){merge();return raw.apply(this,arguments)}wrapped.__spRealCatalogV2=true;window.renderReleaseEditor=wrapped;return true
}
function startMergeWatch(){
 merge();patchRenderer();
 let tries=0;const timer=setInterval(()=>{tries++;merge();patchRenderer();if(tries>1500)clearInterval(timer)},10);
}
if(window.SP_A1_RELEASE_CATALOG_L3_L7)startMergeWatch();
else{
 const s=document.createElement('script');s.src='/shared/release-catalog-a1-l3-l7.js?v=20260824-2';s.onload=startMergeWatch;s.onerror=()=>console.warn('Freigabe-Katalog L3–L7 konnte nicht geladen werden');document.head.appendChild(s);
}
window.SPApplyRealReleaseCatalogL3L7=()=>{const ok=merge();patchRenderer();return ok};
window.addEventListener('SP_RELEASE_EDITOR_READY',()=>window.SPApplyRealReleaseCatalogL3L7());
})();