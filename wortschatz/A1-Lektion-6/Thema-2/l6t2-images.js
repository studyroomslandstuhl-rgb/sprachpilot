(function(){
  const bunny='https://sprachpilot.b-cdn.net/';
  function exactFile(w){
    const raw=String((w&&w.image)||(w&&w.id?String(w.id)+'.webp':'')).split('/').pop();
    const base=raw.replace(/\.(webp|png|jpe?g|gif|svg)$/i,'');
    return base+'.webp';
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
})();