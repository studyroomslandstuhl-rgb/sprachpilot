(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  function clean(v){return String(v||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(png|jpe?g|webp|gif|svg)$/i,'')}
  function bunny(v){const n=clean(v);return n?CDN+n+'.webp':''}
  function patchWord(w){if(w&&typeof w==='object'){const base=w.image||w.img||w.id||w.word;if(base&&!String(base).includes('sprachpilot-logo'))w.image=bunny(base);if(w.img)w.img=bunny(w.img)}}
  function patchArray(name){const a=window[name];if(Array.isArray(a))a.forEach(patchWord)}
  ['WORDS','NOUNS','PLURAL_NOUNS','FLASHCARD_WORDS','ARTICLE_WRITE_WORDS','COLORS','ADJECTIVES','FURNITURE','PRODUCTS'].forEach(patchArray);
  window.l4Bunny=bunny;
  const oldFix=window.fixImg;
  window.fixImg=function(img){
    const src=img&&img.getAttribute&&img.getAttribute('src');
    const next=bunny(src);
    if(next&&src!==next){img.src=next;return}
    if(typeof oldFix==='function')return oldFix(img);
    if(img){img.classList.add('missing');img.alt='Bild fehlt'}
  };
  window.imgTag=function(w,cls='task-img'){
    const src=bunny((w&&w.image)||(w&&w.img)||(w&&w.id));
    return src?`<img class="${cls}" src="${src}" onerror="fixImg(this)" alt="">`:`<div class="${cls} missing">Bild fehlt</div>`;
  };
  window.roomImg=function(id,label=true){
    const w=(typeof wordById==='function'?wordById(id):null)||{};
    const src=bunny(w.image||id);
    return `<div class="imgbox"><img src="${src}" onerror="fixImg(this)" alt="">${label?`<div class="label">${w.full||w.word||id}</div>`:''}</div>`;
  };
  window.placeImg=function(id,label){return `<div class="imgbox"><img src="${bunny(id)}" onerror="fixImg(this)" alt=""></div>`};
  window.img=function(name,cls='task-img'){return `<img class="${cls}" src="${bunny(name)}" onerror="fixImg(this)" alt="">`};
  window.colorImg=function(c,cls='task-img'){return `<img class="${cls} color-img" src="${bunny((c&&c.img)||(c&&c.id))}" onerror="fixImg(this)" alt="">`};
  function rewrite(root=document){
    try{['WORDS','NOUNS','PLURAL_NOUNS','FLASHCARD_WORDS','ARTICLE_WRITE_WORDS','COLORS','ADJECTIVES','FURNITURE','PRODUCTS'].forEach(patchArray)}catch(e){}
    try{root.querySelectorAll&&root.querySelectorAll('img').forEach(img=>{const src=img.getAttribute('src');const next=bunny(src);if(next&&src!==next&&!String(src||'').includes('sprachpilot-logo'))img.setAttribute('src',next)})}catch(e){}
  }
  rewrite();
  window.addEventListener('load',()=>{rewrite();setTimeout(rewrite,100);setTimeout(rewrite,500);setTimeout(rewrite,1200)});
  new MutationObserver(m=>m.forEach(x=>x.addedNodes&&x.addedNodes.forEach(n=>{if(n.nodeType===1)rewrite(n)}))).observe(document.documentElement,{childList:true,subtree:true});
})();