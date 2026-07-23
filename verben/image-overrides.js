(function(){
'use strict';

const IMAGE_URLS=Object.freeze({
 'öffnen':'https://sprachpilot.b-cdn.net/Neu/oeffnen.webp',
 'oeffnen':'https://sprachpilot.b-cdn.net/Neu/oeffnen.webp',
 'offnen':'https://sprachpilot.b-cdn.net/Neu/oeffnen.webp',
 'schließen':'https://sprachpilot.b-cdn.net/Neu/schliessen.webp',
 'schliessen':'https://sprachpilot.b-cdn.net/Neu/schliessen.webp',
 'planen':'https://sprachpilot.b-cdn.net/Neu/planen.webp',
 'spazieren gehen':'https://sprachpilot.b-cdn.net/Neu/spazierengehen.webp',
 'spazierengehen':'https://sprachpilot.b-cdn.net/Neu/spazierengehen.webp',
 'spazieren_gehen':'https://sprachpilot.b-cdn.net/Neu/spazierengehen.webp',
 'vereinbaren':'https://sprachpilot.b-cdn.net/Neu/vereinbaren.webp',
 'nehmen':'https://sprachpilot.b-cdn.net/Neu/nehmen.webp',
 'enden':'https://sprachpilot.b-cdn.net/Neu/enden.webp',
 'besuchen':'https://sprachpilot.b-cdn.net/Neu/besuchen.webp',
 'ausleihen':'https://sprachpilot.b-cdn.net/Neu/ausleihen.webp',
 'anfangen':'https://sprachpilot.b-cdn.net/Neu/anfangen.webp'
});

const normalize=value=>String(value||'').trim().toLowerCase();
const fileKey=value=>normalize(value)
 .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
 .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const previous=typeof window.SP_VERB_IMAGE_OVERRIDE==='function'?window.SP_VERB_IMAGE_OVERRIDE:null;

function resolveImage(value){
 const direct=IMAGE_URLS[normalize(value)]||IMAGE_URLS[fileKey(value)];
 return direct||(previous?previous(value):null)||null;
}

window.SP_VERB_IMAGE_URLS=IMAGE_URLS;
window.SP_VERB_IMAGE_OVERRIDE=resolveImage;

function patchEngine(name){
 const engine=window[name];
 if(!engine||typeof engine.imageUrl!=='function'||engine.__imageOverridesInstalled)return;
 const original=engine.imageUrl.bind(engine);
 engine.imageUrl=value=>resolveImage(value)||original(value);
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
