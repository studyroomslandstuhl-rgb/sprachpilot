(function(){
'use strict';

const BUNNY='https://sprachpilot.b-cdn.net/';
const IMAGE_URLS=Object.freeze({
 'öffnen':BUNNY+'Neu/oeffnen.webp',
 'oeffnen':BUNNY+'Neu/oeffnen.webp',
 'offnen':BUNNY+'Neu/oeffnen.webp',
 'schließen':BUNNY+'Neu/schliessen.webp',
 'schliessen':BUNNY+'Neu/schliessen.webp',
 'planen':BUNNY+'Neu/planen.webp',
 'spazieren gehen':BUNNY+'Neu/spazierengehen.webp',
 'spazierengehen':BUNNY+'Neu/spazierengehen.webp',
 'spazieren_gehen':BUNNY+'Neu/spazierengehen.webp',
 'vereinbaren':BUNNY+'Neu/vereinbaren.webp',
 'nehmen':BUNNY+'Neu/nehmen.webp',
 'enden':BUNNY+'Neu/enden.webp',
 'besuchen':BUNNY+'Neu/besuchen.webp',
 'ausleihen':BUNNY+'Neu/ausleihen.webp',
 'anfangen':BUNNY+'Neu/anfangen.webp',

 'sich interessieren':BUNNY+'sich_interessieren_fuer.webp',
 'sich interessieren für':BUNNY+'sich_interessieren_fuer.webp',
 'sich_interessieren':BUNNY+'sich_interessieren_fuer.webp',
 'sich_interessieren_fuer':BUNNY+'sich_interessieren_fuer.webp',
 'wiegen':BUNNY+'wiegen.webp',
 'zwingen':BUNNY+'zwingen.webp',
 'sich erinnern':BUNNY+'sich_erinnern_an.webp',
 'sich erinnern an':BUNNY+'sich_erinnern_an.webp',
 'sich_erinnern':BUNNY+'sich_erinnern_an.webp',
 'sich_erinnern_an':BUNNY+'sich_erinnern_an.webp',
 'sich anziehen':BUNNY+'sich_anziehen.webp',
 'sich_anziehen':BUNNY+'sich_anziehen.webp',
 'sich ausziehen':BUNNY+'sich_ausziehen.webp',
 'sich_ausziehen':BUNNY+'sich_ausziehen.webp',
 'sich umziehen':BUNNY+'sich_umziehen.webp',
 'sich_umziehen':BUNNY+'sich_umziehen.webp',
 'sich duschen':BUNNY+'sich_duschen.webp',
 'sich_duschen':BUNNY+'sich_duschen.webp',
 'sich freuen':BUNNY+'sich_freuen.webp',
 'sich_freuen':BUNNY+'sich_freuen.webp',
 'sich ärgern':BUNNY+'sich_aergern.webp',
 'sich aergern':BUNNY+'sich_aergern.webp',
 'sich_aergern':BUNNY+'sich_aergern.webp'
});

const normalize=value=>String(value||'').trim().toLowerCase();
const fileKey=value=>normalize(value)
 .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
 .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const previous=typeof window.SP_VERB_IMAGE_OVERRIDE==='function'?window.SP_VERB_IMAGE_OVERRIDE:null;

function standardImage(value){
 const key=fileKey(value);
 return key?BUNNY+encodeURIComponent(key)+'.webp':null
}
function resolveImage(value){
 const normalized=normalize(value),key=fileKey(value);
 const direct=IMAGE_URLS[normalized]||IMAGE_URLS[key];
 return direct||(previous?previous(value):null)||standardImage(value)
}

window.SP_VERB_IMAGE_URLS=IMAGE_URLS;
window.SP_VERB_IMAGE_FILE_KEY=fileKey;
window.SP_VERB_IMAGE_OVERRIDE=resolveImage;

function patchEngine(name){
 const engine=window[name];
 if(!engine||typeof engine.imageUrl!=='function'||engine.__imageOverridesInstalled)return;
 engine.imageUrl=value=>resolveImage(value);
 Object.defineProperty(engine,'__imageOverridesInstalled',{value:true});
}

function imageKeyFromUrl(value){
 try{
  const url=new URL(value,location.href);
  return decodeURIComponent(url.pathname.split('/').pop()||'').replace(/\.webp$/i,'').toLowerCase();
 }catch{return''}
}

function rewriteImage(image){
 if(!(image instanceof HTMLImageElement))return;
 const target=IMAGE_URLS[imageKeyFromUrl(image.getAttribute('src')||image.src)];
 if(target&&image.src!==target)image.src=target;
}

function installDomFallback(){
 document.querySelectorAll('img[src]').forEach(rewriteImage);
 const observer=new MutationObserver(records=>{
  for(const record of records){
   if(record.type==='attributes')rewriteImage(record.target);
   for(const node of record.addedNodes||[]){
    if(node instanceof HTMLImageElement)rewriteImage(node);
    if(node.querySelectorAll)node.querySelectorAll('img[src]').forEach(rewriteImage);
   }
  }
 });
 observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
}

patchEngine('VerbGroupsEngine');
patchEngine('PerfektGroupsEngine');
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installDomFallback,{once:true});
else installDomFallback();
})();