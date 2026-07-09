(function(){
  const BASE='https://sprachpilot.b-cdn.net/Neu/';
  function cleanName(name){return String(name||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(webp|png|jpe?g|gif|svg)$/i,'')}
  function norm(id){return cleanName(id).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
  function bunny(id){const n=norm(id);return n?BASE+n+'.webp':''}
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{w.image=bunny(w.id||w.word)});
  window.cdnImg=function(w){return bunny(w&&w.id||w&&w.image||w&&w.word)};
  window.imgHtml=imgHtml=function(w){return `<img src="${cdnImg(w)}" onerror="fixImg(this,'${String(w?.word||'').replace(/'/g,'&#039;')}')" alt="">`};
  window.bigImgHtml=bigImgHtml=function(w){return `<img class="task-img" src="${cdnImg(w)}" onerror="fixBigImg(this,'${String(w?.word||'').replace(/'/g,'&#039;')}')" alt="">`};
})();