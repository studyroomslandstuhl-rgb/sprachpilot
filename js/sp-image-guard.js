(function(){
  if(window.__SP_IMAGE_GUARD__)return;
  window.__SP_IMAGE_GUARD__=true;

  const CDN='https://sprachpilot.b-cdn.net/';
  const seen=new WeakMap();

  function cleanText(s){return String(s||'').trim()}
  function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
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
  function candidates(img){
    const src=img.getAttribute('src')||'';
    const alt=cleanText(img.getAttribute('alt')||img.dataset.word||img.getAttribute('aria-label'));
    const base=fileBase(src);
    const keys=uniq([
      img.dataset.word,img.dataset.verb,img.dataset.l5t3Word,img.dataset.id,
      alt,base,slug(alt,'_'),slug(alt,'-'),slug(base,'_'),slug(base,'-')
    ]);
    const list=[];
    list.push(...attrList(img,'data-candidates','|'));
    list.push(...attrList(img,'data-alt','|'));
    list.push(...readJsonAttr(img,'data-fallbacks'));
    if(src)list.push(src);
    keys.forEach(k=>{
      if(!k)return;
      list.push(CDN+k+'.webp',CDN+k+'.png',CDN+k+'.jpg');
      list.push('/assets/img/'+k+'.webp','/assets/img/'+k+'.png','/assets/img/'+k+'.jpg');
      const p=location.pathname.split('/').slice(0,-1).join('/')+'/';
      list.push(p+k+'.webp',p+k+'.png',p+k+'.jpg');
      list.push(p+'bilder/'+k+'.webp',p+'bilder/'+k+'.png',p+'bilder/'+k+'.jpg');
      list.push('../bilder/'+k+'.webp','../bilder/'+k+'.png','../bilder/'+k+'.jpg');
    });
    return uniq(list).filter(x=>x!==src||!seen.has(img));
  }
  function placeholder(img){
    if(!img.isConnected)return;
    if(img.dataset.spImageMissing==='1')return;
    img.dataset.spImageMissing='1';
    img.classList.add('sp-image-missing','missing');
    if(!img.getAttribute('alt'))img.alt='Bild fehlt';
  }
  function tryLoad(img){
    if(!img||img.tagName!=='IMG'||!img.isConnected)return false;
    const list=candidates(img);
    const idx=seen.get(img)||0;
    const next=list[idx];
    if(!next){placeholder(img);return false;}
    seen.set(img,idx+1);
    img.dataset.spImageGuard='1';
    img.loading='eager';
    img.decoding='async';
    try{img.fetchPriority='high'}catch(e){}
    if(img.getAttribute('src')!==next)img.src=next;
    return true;
  }
  function inspect(root){
    const imgs=(root&&root.querySelectorAll)?root.querySelectorAll('img'):document.querySelectorAll('img');
    imgs.forEach(img=>{
      if(!img.dataset.spImageGuard){
        img.dataset.spImageGuard='1';
        if(img.loading==='lazy')img.loading='eager';
      }
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
})();