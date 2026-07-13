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
  function getWords(){try{return typeof WORDS!=='undefined'&&Array.isArray(WORDS)?WORDS:[]}catch(e){return[]}}
  function wordForImage(img){
    try{
      const src=img.getAttribute('src')||'';
      const stem=ascii(basename(src));
      return getWords().find(w=>ascii(w.id)===stem||ascii(basename(w.image))===stem||ascii(w.word)===stem)||null;
    }catch(e){return null}
  }
  function handleImageError(img){
    if(!img)return;
    let list=[];
    try{list=JSON.parse(img.dataset.l3t1Candidates||'[]')}catch(e){}
    if(!list.length){setCandidates(img,wordForImage(img),true);return}
    const next=Number(img.dataset.l3t1Index||0)+1;
    if(next<list.length){img.dataset.l3t1Index=String(next);img.src=list[next];return}
    img.onerror=null;
    img.removeAttribute('src');
    img.alt=img.alt||'Bild nicht verfügbar';
    img.classList.add('image-missing');
  }
  function setCandidates(img,word,force=false){
    if(!img)return;
    if(!force&&img.dataset.l3t1Candidates)return;
    const list=candidates(word||wordForImage(img));
    if(!list.length)return;
    img.dataset.l3t1Candidates=JSON.stringify(list);
    img.dataset.l3t1Index='0';
    img.onerror=function(){handleImageError(this)};
    if(img.getAttribute('src')!==list[0])img.src=list[0];
  }
  function patchWords(){
    try{
      const words=getWords();
      if(!words.length)return false;
      words.forEach(w=>{
        const list=candidates(w);
        if(list.length){w.image=list[0];w.imageCandidates=list;}
      });
      return true;
    }catch(e){return false}
  }
  function patchImages(root=document){
    const list=root&&root.matches&&root.matches('img')?[root]:[...(root&&root.querySelectorAll?root.querySelectorAll('img'):[])];
    list.forEach(img=>{
      const raw=img.getAttribute('src')||'';
      if(img.closest('.brand,.logo'))return;
      if(!img.classList.contains('food-img')&&!/\/bilder\//i.test(raw)&&!img.closest('#area,.memory-grid,.choice-grid,.word-row'))return;
      const word=wordForImage(img);
      if(word||/\/bilder\//i.test(raw)||img.classList.contains('food-img'))setCandidates(img,word);
    });
  }
  function install(){
    window.fixImg=handleImageError;
    patchWords();
    patchImages(document);
  }
  install();
  document.addEventListener('DOMContentLoaded',install);
  setTimeout(install,100);
  setTimeout(install,500);
  setTimeout(install,1500);
  try{new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType===1)patchImages(n)}))).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();