(function(){
  if(window.__SP_L3T1_IMAGE_FIX)return;
  window.__SP_L3T1_IMAGE_FIX=true;

  const CDN='https://sprachpilot.b-cdn.net/';

  function ascii(value){
    return String(value||'').trim().toLowerCase()
      .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  function basename(value){
    return String(value||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(webp|png|jpe?g)$/i,'');
  }
  function uniq(list){return [...new Set((list||[]).filter(Boolean))]}
  function candidates(word){
    const stems=uniq([
      word&&word.id,
      basename(word&&word.image),
      ascii(word&&word.word),
      ascii(word&&word.full)
    ].flatMap(v=>{
      const s=ascii(v);
      if(!s)return[];
      return [s,s.replace(/-/g,'_'),s.replace(/_/g,'-')];
    }));
    return uniq(stems.flatMap(stem=>[
      CDN+stem+'.webp',
      CDN+stem+'.png',
      CDN+stem+'.jpg'
    ]));
  }
  function wordForImage(img){
    try{
      const src=img.getAttribute('src')||'';
      const stem=ascii(basename(src));
      if(typeof WORDS!=='undefined'&&Array.isArray(WORDS)){
        return WORDS.find(w=>ascii(w.id)===stem||ascii(basename(w.image))===stem||ascii(w.word)===stem)||null;
      }
    }catch(e){}
    return null;
  }
  function setCandidates(img,word){
    if(!img)return;
    const list=candidates(word||wordForImage(img));
    if(!list.length)return;
    img.dataset.l3t1Candidates=JSON.stringify(list);
    img.dataset.l3t1Index='0';
    img.onerror=function(){window.fixImg(this)};
    if(img.src!==list[0])img.src=list[0];
  }
  window.fixImg=function(img){
    if(!img)return;
    let list=[];
    try{list=JSON.parse(img.dataset.l3t1Candidates||'[]')}catch(e){}
    if(!list.length){setCandidates(img,wordForImage(img));return}
    const next=Number(img.dataset.l3t1Index||0)+1;
    if(next<list.length){img.dataset.l3t1Index=String(next);img.src=list[next];return}
    img.onerror=null;
    img.removeAttribute('src');
    img.alt=img.alt||'Bild nicht verfügbar';
    img.classList.add('image-missing');
  };
  function patchWords(){
    try{
      if(typeof WORDS==='undefined'||!Array.isArray(WORDS))return false;
      WORDS.forEach(w=>{
        const list=candidates(w);
        if(list.length){w.image=list[0];w.imageCandidates=list;}
      });
      return true;
    }catch(e){return false}
  }
  function patchImages(root=document){
    root.querySelectorAll('img').forEach(img=>{
      const raw=img.getAttribute('src')||'';
      if(img.closest('.brand,.logo'))return;
      if(!img.classList.contains('food-img')&&!/\/bilder\//i.test(raw)&&!img.closest('#area,.memory-grid,.choice-grid,.word-row'))return;
      const word=wordForImage(img);
      if(word||/\/bilder\//i.test(raw)||img.classList.contains('food-img'))setCandidates(img,word);
    });
  }
  function install(){patchWords();patchImages(document)}
  install();
  document.addEventListener('DOMContentLoaded',install);
  setTimeout(install,100);
  setTimeout(install,500);
  setTimeout(install,1500);
  try{new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1)patchImages(n.matches&&n.matches('img')?n.parentNode:n)}))).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();