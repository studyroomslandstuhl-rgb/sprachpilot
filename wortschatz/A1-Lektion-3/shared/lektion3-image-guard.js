(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  function clean(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
  function localPath(w){return '../bilder/'+clean(w&&w.id||w&&w.word)+'.png'}
  function bunnyPath(w){return CDN+clean(w&&w.id||w&&w.word)+'.webp'}
  function ensureImages(list){
    if(!Array.isArray(list))return;
    list.forEach(w=>{if(w&&!w.image)w.image=localPath(w)})
  }
  ensureImages(window.WORDS);
  ensureImages(window.EXTRA_WORDS);
  ensureImages(window.BASE_WORDS);
  const oldFix=window.fixImg;
  window.fixImg=function(img){
    if(!img)return;
    const tries=Number(img.dataset.try||'0');
    const row=img.closest('.word-row,.choice,.card,.module')||document;
    const label=(img.getAttribute('alt')||row.textContent||'').trim();
    const guessed=clean(label.split('\n')[0]);
    img.dataset.try=String(tries+1);
    if(tries===0){
      const src=img.getAttribute('src')||'';
      const file=src.split('/').pop()||'';
      img.src=CDN+file.replace(/\.png$/i,'.webp');
      return;
    }
    if(tries===1&&guessed){img.src='../bilder/'+guessed+'.png';return;}
    if(tries===2&&guessed){img.src=CDN+guessed+'.webp';return;}
    if(typeof oldFix==='function'){try{oldFix(img);return}catch(e){}}
    img.style.display='none';
  };
  const css=document.createElement('style');
  css.textContent='.word-row img,.food-img,.choice img{object-fit:contain!important;background:#fff;max-width:100%;max-height:100%;}';
  document.head.appendChild(css);
})();