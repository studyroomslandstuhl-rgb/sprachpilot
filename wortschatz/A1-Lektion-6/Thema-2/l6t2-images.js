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
    if(!file)return;
    const url=exactUrl(file);
    if(el.src!==url)el.src=url;
  }
  function connectAll(root=document){
    if(root&&root.tagName==='IMG')connectImage(root);
    if(root&&root.querySelectorAll)root.querySelectorAll('img[data-l6t2-image]').forEach(connectImage);
  }
  window.l6t2ImageUrl=function(w){return bunny+exactFile(w)};
  window.img=img=function(w){return window.l6t2ImageUrl(w)};
  window.visual=visual=function(w){
    const file=exactFile(w);
    return `<div class="task-img-box"><img src="${bunny+file}" alt="${full(w)}" data-l6t2-image="${file}" onerror="this.parentElement.textContent='Bild fehlt: ${file}'"></div>`;
  };
  window.miniVisual=miniVisual=function(w){
    const file=exactFile(w);
    return `<img src="${bunny+file}" alt="${full(w)}" data-l6t2-image="${file}" onerror="this.replaceWith(document.createTextNode('Bild fehlt: ${file}'))">`;
  };
  const observer=new MutationObserver(list=>list.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)connectAll(n)})));
  function start(){connectAll();observer.observe(document.documentElement,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.l6t2ConnectImages=()=>connectAll();
})();