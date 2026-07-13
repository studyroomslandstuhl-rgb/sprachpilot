(function(){
  if(window.__SP_L3T1_IMAGE_FIX_V3)return;
  window.__SP_L3T1_IMAGE_FIX_V3=true;

  const CDN='https://sprachpilot.b-cdn.net/';

  function ascii(value){
    return String(value||'').trim().toLowerCase()
      .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  function basename(value){return String(value||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(webp|png|jpe?g)$/i,'')}
  function uniq(list){return [...new Set((list||[]).filter(Boolean))]}
  function getWords(){try{return typeof WORDS!=='undefined'&&Array.isArray(WORDS)?WORDS:[]}catch(e){return[]}}
  function candidates(word){
    if(!word)return[];
    const id=ascii(word.id||basename(word.image)||word.word);
    const original=String(word.originalImage||word.image||'');
    return uniq([
      id?CDN+id+'.webp':'',
      original,
      id?CDN+id+'.png':''
    ]);
  }
  function wordForImage(img){
    const stem=ascii(basename(img&&img.getAttribute&&img.getAttribute('src')));
    return getWords().find(w=>ascii(w.id)===stem||ascii(basename(w.image))===stem||ascii(w.word)===stem)||null;
  }
  function setCandidates(img,word){
    if(!img||img.dataset.l3t1Ready==='1')return;
    const list=candidates(word||wordForImage(img));
    if(!list.length)return;
    img.dataset.l3t1Ready='1';
    img.dataset.l3t1Candidates=JSON.stringify(list);
    img.dataset.l3t1Index='0';
    img.onerror=function(){window.fixImg(this)};
    if(img.getAttribute('src')!==list[0])img.src=list[0];
  }
  window.fixImg=function(img){
    if(!img)return;
    let list=[];
    try{list=JSON.parse(img.dataset.l3t1Candidates||'[]')}catch(e){}
    if(!list.length){
      img.dataset.l3t1Ready='';
      setCandidates(img,wordForImage(img));
      return;
    }
    const next=Number(img.dataset.l3t1Index||0)+1;
    if(next<list.length){img.dataset.l3t1Index=String(next);img.src=list[next];return}
    img.onerror=null;
    img.classList.add('image-missing');
    img.alt=img.alt||'Bild nicht verfügbar';
  };
  function patchWords(){
    getWords().forEach(w=>{
      if(!w.originalImage)w.originalImage=w.image||'';
      const list=candidates(w);
      if(list.length)w.image=list[0];
    });
  }
  function patchVisibleImages(){
    document.querySelectorAll('img.food-img,img.choice-img,#area img,.memory-card img').forEach(img=>setCandidates(img,wordForImage(img)));
  }
  function install(){patchWords();patchVisibleImages()}

  install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else requestAnimationFrame(install);
})();