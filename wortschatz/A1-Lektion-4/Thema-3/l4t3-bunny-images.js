(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  function clean(name){return String(name||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(png|jpe?g|webp|gif|svg)$/i,'')}
  function bunny(name){const n=clean(name);return n?CDN+n+'.webp':''}
  window.img=img=function(name,cls='task-img'){
    return `<img class="${cls}" src="${bunny(name)}" onerror="fixImg(this)" alt="">`;
  };
  window.colorImg=colorImg=function(c,cls='task-img'){
    const name=(c&&c.img)||((c&&c.id)||'')+'.webp';
    return `<img class="${cls} color-img" src="${bunny(name)}" onerror="fixImg(this)" alt="">`;
  };
  function patchObject(o){
    if(!o||typeof o!=='object')return;
    ['img','image','bild','itemImg'].forEach(k=>{if(typeof o[k]==='string')o[k]=bunny(o[k])});
    if(Array.isArray(o.imgs))o.imgs=o.imgs.map(x=>bunny(x));
  }
  [window.COLORS,window.ADJECTIVES,window.FURNITURE,window.REACTIONS,window.SENTENCES,window.WRITING,window.GEFAELLEN_TASKS].forEach(arr=>{if(Array.isArray(arr))arr.forEach(patchObject)});
})();