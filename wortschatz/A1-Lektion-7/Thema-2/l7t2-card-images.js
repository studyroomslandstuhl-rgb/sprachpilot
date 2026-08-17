(function(){
'use strict';
if(window.__SP_L7T2_CARD_IMAGES_V1)return;
window.__SP_L7T2_CARD_IMAGES_V1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-2/'))return;

const CDN='https://sprachpilot.b-cdn.net/';
const preloaded=new Map();

function basename(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function url(file,bust=''){const name=basename(file);return name?CDN+encodeURIComponent(name)+(bust?`?spimg=${encodeURIComponent(bust)}`:''):''}
function esc(value){return String(value||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function fallbackFor(img){const next=img?.nextElementSibling;return next?.classList?.contains('l7-image-fallback')||next?.classList?.contains('image-fallback')?next:null}
function show(img){if(!img)return;img.hidden=false;const fallback=fallbackFor(img);if(fallback)fallback.hidden=true}
function fallback(img){if(!img)return;img.hidden=true;const box=fallbackFor(img);if(box)box.hidden=false}
function preload(file){
 const name=basename(file);if(!name)return Promise.resolve(false);
 if(preloaded.has(name))return preloaded.get(name);
 const promise=new Promise(resolve=>{
  const image=new Image();image.decoding='async';
  image.onload=()=>resolve(true);image.onerror=()=>resolve(false);image.src=url(name);
 });
 preloaded.set(name,promise);return promise;
}
function retry(img){
 const file=basename(img.dataset.spBunnyFile||img.currentSrc||img.src||'');if(!file)return fallback(img);
 const count=Number(img.dataset.spBunnyRetry||0);
 if(count>=2)return fallback(img);
 img.dataset.spBunnyRetry=String(count+1);
 img.hidden=false;
 setTimeout(()=>{img.src=url(file,`${count+1}-${Date.now()}`)},180*(count+1));
}
function patchImage(img){
 if(!(img instanceof HTMLImageElement)||!img.closest('#app'))return;
 if(img.closest('.l7-brand,.brand,.topbar,.l7-topbar'))return;
 const file=basename(img.dataset.spBunnyFile||img.currentSrc||img.src||'');if(!file)return;
 img.dataset.spBunnyFile=file;
 img.loading='eager';img.decoding='async';
 img.onerror=function(){retry(this)};
 img.onload=function(){this.dataset.spBunnyRetry='0';show(this)};
 show(img);
 const wanted=url(file);
 if(!img.src||basename(img.src)!==file)img.src=wanted;
 else if(img.complete&&img.naturalWidth===0)retry(img);
}
function patchAll(root=document){root.querySelectorAll?.('#app img').forEach(patchImage)}
function imageHtml(file,alt='Bild'){
 const name=basename(file);if(!name)return'';
 preload(name);
 return `<div class="l7-image"><img src="${url(name)}" data-sp-bunny-file="${esc(name)}" loading="eager" decoding="async" alt="${esc(alt)}" onload="window.L7T2CardImages.show(this)" onerror="window.L7T2CardImages.fail(this)"><div class="l7-image-fallback" hidden><strong>${esc(alt)}</strong><span>Nutze die Erklärung.</span></div></div>`;
}
function installRenderer(){
 if(!window.L7S)return false;
 window.L7S.image=imageHtml;
 window.L7S.__l7t2BunnyImages=true;
 return true;
}
function collectThemeImages(theme){
 const files=[];
 (theme?.tasks||[]).forEach(task=>(task?.items||[]).forEach(item=>{if(item?.image)files.push(basename(item.image));if(item?.img)files.push(basename(item.img))}));
 [...new Set(files.filter(Boolean))].forEach(preload);
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{collectThemeImages(theme);return theme});
window.L7T2CardImages={preload,patchAll,patchImage,imageHtml,installRenderer,show,fail:retry,base:CDN};

const observer=new MutationObserver(mutations=>{
 for(const mutation of mutations){for(const node of mutation.addedNodes){if(node.nodeType!==1)continue;if(node.matches?.('img'))patchImage(node);patchAll(node)}}
});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{patchAll(document);setTimeout(()=>patchAll(document),100);setTimeout(()=>patchAll(document),500)});
patchAll(document);
})();
