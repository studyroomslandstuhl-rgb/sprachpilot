(function(){
  const MAP={
    'anfangen':'https://sprachpilot.b-cdn.net/Neu/anfangen.webp',
    'ausleihen':'https://sprachpilot.b-cdn.net/Neu/ausleihen.webp',
    'besuchen':'https://sprachpilot.b-cdn.net/Neu/besuchen.webp',
    'enden':'https://sprachpilot.b-cdn.net/Neu/enden.webp',
    'nehmen':'https://sprachpilot.b-cdn.net/Neu/nehmen.webp',
    'öffnen':'https://sprachpilot.b-cdn.net/Neu/oeffnen.webp',
    'oeffnen':'https://sprachpilot.b-cdn.net/Neu/oeffnen.webp',
    'planen':'https://sprachpilot.b-cdn.net/Neu/planen.webp',
    'schließen':'https://sprachpilot.b-cdn.net/Neu/schliessen.webp',
    'schliessen':'https://sprachpilot.b-cdn.net/Neu/schliessen.webp',
    'spazieren gehen':'https://sprachpilot.b-cdn.net/Neu/spazierengehen.webp',
    'spazierengehen':'https://sprachpilot.b-cdn.net/Neu/spazierengehen.webp',
    'vereinbaren':'https://sprachpilot.b-cdn.net/Neu/vereinbaren.webp'
  };
  const oldImageBox=window.imageBox;
  const oldHydrate=window.hydrateImages;
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
  function key(v){return String(v||'').trim().toLowerCase()}
  function srcFor(v){return MAP[key(v)]||''}
  window.imageBox=function(v,small=false){
    const src=srcFor(v);
    if(!src&&typeof oldImageBox==='function')return oldImageBox(v,small);
    const cls=small?'mem-img-holder':'img-holder';
    if(!src)return `<span class="${cls}"><span class="image-fallback">Bild</span></span>`;
    return `<span class="${cls} image-loaded" data-selected-bunny="1"><img src="${src}" alt="${esc(v)}" loading="lazy" decoding="async"></span>`;
  };
  window.hydrateImages=function(root=document){
    if(typeof oldHydrate==='function')oldHydrate(root);
    [...root.querySelectorAll('[data-verb]')].forEach(box=>{
      const v=box.getAttribute('data-verb')||'';
      const src=srcFor(v);
      if(!src)return;
      box.dataset.loaded='1';
      box.classList.add('image-loaded');
      box.classList.remove('image-missing');
      box.innerHTML='';
      const img=document.createElement('img');
      img.alt=v;
      img.loading='lazy';
      img.decoding='async';
      img.src=src;
      box.appendChild(img);
    });
  };
  window.renderAndHydrate=function(){setTimeout(()=>window.hydrateImages(document),80)};
})();