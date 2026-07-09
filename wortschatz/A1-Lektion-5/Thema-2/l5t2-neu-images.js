(function(){
  const BASE='https://sprachpilot.b-cdn.net/Neu/';
  function cleanName(name){return String(name||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(webp|png|jpe?g|gif|svg)$/i,'')}
  function norm(id){return cleanName(id).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
  function bunny(id){const n=norm(id);return n?BASE+n+'.webp':''}
  function setImg(w){if(!w)return;w.image=bunny(w.id||w.image||w.word)}
  if(typeof WORDS!=='undefined'&&Array.isArray(WORDS))WORDS.forEach(setImg);
  if(typeof TIME_NOUNS!=='undefined'&&Array.isArray(TIME_NOUNS))TIME_NOUNS.forEach(setImg);
  window.displayImage=function(w){return bunny(w&&w.id||w&&w.image||w&&w.word)};
  window.imgHtml=imgHtml=function(w){const src=window.displayImage(w);return src?`<img src="${src}" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`};
  window.bigImgHtml=bigImgHtml=function(w){const src=window.displayImage(w);return src?`<img class="task-img" src="${src}" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`};
})();