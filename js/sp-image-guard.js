(function(){
  if(location.pathname.includes('/wortschatz/A1-Lektion-6/Thema-2/'))return;
  if(window.__SP_IMAGE_GUARD__)return;
  window.__SP_IMAGE_GUARD__=true;

  const CDN='https://sprachpilot.b-cdn.net/';
  const seen=new WeakMap();

  function cleanText(s){return String(s||'').trim()}
  function uniq(a){return [...new Set(a.filter(Boolean).map(String))]}
  function fileBase(src){
    try{
      const u=new URL(src,location.href);
      const name=(u.pathname.split('/').pop()||'').replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i,'');
      return decodeURIComponent(name);
    }catch(e){return ''}
  }
  function slug(s,sep){
    return String(s||'').toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,sep).replace(new RegExp('^'+sep+'|'+sep+'$','g'),'');
  }
  function readJsonAttr(el,name){
    try{const v=el.getAttribute(name);return v?JSON.parse(v):[]}catch(e){return []}
  }
  function attrList(el,name,sep){
    const v=el.getAttribute(name)||'';
    return v?v.split(sep).map(x=>x.trim()).filter(Boolean):[];
  }
  function sameUrl(a,b){
    try{return new URL(a,location.href).href===new URL(b,location.href).href}catch(e){return a===b}
  }
  function isBunny(src){return /^https:\/\/sprachpilot\.b-cdn\.net\//i.test(String(src||''))}
  function shouldIgnore(img){
    const src=String(img.getAttribute('src')||'');
    if(/\/assets\/logo\//i.test(src))return true;
    if(/sprachpilot-logo/i.test(src))return true;
    if(img.closest('.logo,.brand'))return true;
    return false;
  }
  function bunnyUrl(name){
    const key=slug(name,'_');
    return key?CDN+key+'.webp':'';
  }
  function candidates(img){
    const src=img.getAttribute('src')||'';
    const alt=cleanText(img.getAttribute('alt')||img.dataset.word||img.dataset.verb||img.dataset.l5t3Word||img.getAttribute('aria-label'));
    const base=fileBase(src);
    const keys=uniq([
      img.dataset.word,img.dataset.verb,img.dataset.l5t3Word,img.dataset.id,
      alt,base,slug(alt,'_'),slug(alt,'-'),slug(base,'_'),slug(base,'-')
    ]);
    const list=[];
    list.push(...attrList(img,'data-candidates','|'));
    list.push(...attrList(img,'data-alt','|'));
    list.push(...readJsonAttr(img,'data-fallbacks'));
    keys.forEach(k=>{const u=bunnyUrl(k);if(u)list.push(u)});
    return uniq(list).filter(x=>!src||!sameUrl(x,src));
  }
  function placeholder(img){
    if(!img.isConnected)return;
    if(img.dataset.spImageMissing==='1')return;
    img.dataset.spImageMissing='1';
    img.classList.add('sp-image-missing','missing');
    if(!img.getAttribute('alt'))img.alt='Bild fehlt';
  }
  function forceBunny(img){
    if(!img||img.tagName!=='IMG'||shouldIgnore(img))return false;
    const src=img.getAttribute('src')||'';
    if(!src||isBunny(src))return false;
    const base=fileBase(src)||img.dataset.word||img.dataset.verb||img.dataset.id||img.getAttribute('alt')||'';
    const next=bunnyUrl(base);
    if(!next||sameUrl(next,src))return false;
    img.dataset.spOriginalSrc=src;
    img.dataset.spImageGuard='1';
    img.loading='eager';
    img.decoding='async';
    try{img.fetchPriority='high'}catch(e){}
    img.src=next;
    return true;
  }
  function tryLoad(img){
    if(!img||img.tagName!=='IMG'||!img.isConnected||shouldIgnore(img))return false;
    const list=candidates(img);
    const idx=seen.get(img)||0;
    const next=list[idx];
    if(!next){placeholder(img);return false;}
    seen.set(img,idx+1);
    img.dataset.spImageGuard='1';
    img.loading='eager';
    img.decoding='async';
    try{img.fetchPriority='high'}catch(e){}
    img.src=next;
    return true;
  }
  function inspect(root){
    const imgs=(root&&root.querySelectorAll)?root.querySelectorAll('img'):document.querySelectorAll('img');
    imgs.forEach(img=>{
      if(shouldIgnore(img))return;
      if(!img.dataset.spImageGuard){
        img.dataset.spImageGuard='1';
        if(img.loading==='lazy')img.loading='eager';
      }
      forceBunny(img);
      if(img.complete&&img.naturalWidth===0)tryLoad(img);
    });
  }
  document.addEventListener('error',e=>{
    const img=e.target;
    if(!img||img.tagName!=='IMG')return;
    if(tryLoad(img)){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);
  const mo=new MutationObserver(list=>{
    for(const m of list){
      m.addedNodes&&m.addedNodes.forEach(n=>{
        if(n.nodeType!==1)return;
        if(n.tagName==='IMG')inspect({querySelectorAll:()=>[n]});else inspect(n);
      });
    }
  });
  function start(){
    inspect(document);
    mo.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>inspect(document),100);
    setTimeout(()=>inspect(document),700);
    setTimeout(()=>inspect(document),1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.spImageGuardRefresh=()=>inspect(document);
  window.spBunnyImageUrl=bunnyUrl;
})();