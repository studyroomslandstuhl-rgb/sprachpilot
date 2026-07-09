(function(){
  const BASE='https://sprachpilot.b-cdn.net/Neu/';
  function safeTextLocal(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
  function norm(s){return String(s||'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
  function verbStem(v){
    const entry=(typeof ALL_VERBS!=='undefined'?ALL_VERBS:[]).find(x=>x&&x.v===v);
    return norm((entry&&entry.img)||v);
  }
  function verbUrl(v){const stem=verbStem(v);return stem?BASE+stem+'.webp':''}
  window.spVerbNeuImageUrl=verbUrl;
  window.imageBox=function(v,small=false){const cls=small?'mem-img-holder':'img-holder';return `<span class="${cls}" data-verb="${safeTextLocal(v)}"><span class="image-fallback">Bild</span></span>`}
  window.hydrateImages=function(root=document){
    const boxes=[...root.querySelectorAll('[data-verb]')].filter(box=>box.dataset.loaded!=='1').slice(0,180);
    boxes.forEach(box=>{
      box.dataset.loaded='1';
      const v=box.getAttribute('data-verb')||'';
      const src=verbUrl(v);
      if(!src){box.innerHTML='<span class="image-fallback">Bild fehlt</span>';return}
      const img=document.createElement('img');
      img.alt=safeTextLocal(v);img.loading='lazy';img.decoding='async';
      img.onload=()=>box.classList.add('image-loaded');
      img.onerror=()=>{box.innerHTML='<span class="image-fallback">Bild fehlt</span>';box.classList.add('image-missing')};
      box.textContent='';box.appendChild(img);img.src=src;
    });
  }
  window.renderAndHydrate=function(){setTimeout(()=>window.hydrateImages(document),80)}
})();