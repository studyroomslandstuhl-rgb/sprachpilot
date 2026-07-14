(function(){
  const bunny='https://sprachpilot.b-cdn.net/';
  function exactFile(w){
    const raw=String((w&&w.image)||(w&&w.id?String(w.id)+'.webp':'')).split('/').pop();
    const base=raw.replace(/\.(webp|png|jpe?g|gif|svg)$/i,'');
    return base+'.webp';
  }
  function exactUrl(file){
    const raw=String(file||'').split('/').pop();
    const base=raw.replace(/\.(webp|png|jpe?g|gif|svg)$/i,'');
    return bunny+base+'.webp';
  }
  function connectImage(el){
    if(!el||el.tagName!=='IMG')return;
    const file=el.dataset.l6t2Image;
    if(!file||el.dataset.l6t2Connected==='1')return;
    const url=exactUrl(file);
    el.dataset.l6t2Connected='1';
    if(el.getAttribute('src')!==url)el.setAttribute('src',url);
  }
  function connectAll(root=document){
    if(root&&root.tagName==='IMG')connectImage(root);
    if(root&&root.querySelectorAll)root.querySelectorAll('img[data-l6t2-image]').forEach(connectImage);
  }
  let scheduled=false,pendingRoot=null;
  function schedule(root){
    pendingRoot=root||document;
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;const target=pendingRoot;pendingRoot=null;connectAll(target)});
  }
  window.l6t2ImageUrl=function(w){return bunny+exactFile(w)};
  window.img=img=function(w){return window.l6t2ImageUrl(w)};
  window.visual=visual=function(w){
    const file=exactFile(w);
    return `<div class="task-img-box"><img src="${bunny+file}" alt="${full(w)}" data-l6t2-image="${file}" data-l6t2-connected="1" loading="eager" decoding="async" onerror="this.parentElement.textContent='Bild fehlt: ${file}'"></div>`;
  };
  window.miniVisual=miniVisual=function(w){
    const file=exactFile(w);
    return `<img src="${bunny+file}" alt="${full(w)}" data-l6t2-image="${file}" data-l6t2-connected="1" loading="lazy" decoding="async" onerror="this.replaceWith(document.createTextNode('Bild fehlt: ${file}'))">`;
  };
  function start(){connectAll()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.l6t2ConnectImages=(root=document)=>schedule(root);
})();