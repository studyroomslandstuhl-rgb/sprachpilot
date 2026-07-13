(function(){
  if(window.__SP_L5T3_STABILITY_FIX)return;
  window.__SP_L5T3_STABILITY_FIX=true;

  const CDN='https://sprachpilot.b-cdn.net/';
  const IMG={
    montag:CDN+'kalender.webp',dienstag:CDN+'kalender.webp',mittwoch:CDN+'kalender.webp',donnerstag:CDN+'kalender.webp',freitag:CDN+'kalender.webp',samstag:CDN+'kalender.webp',sonntag:CDN+'kalender.webp',
    morgen:'/assets/img/der_morgen.png',vormittag:'/assets/img/der_vormittag.png',mittag:'/assets/img/der_mittag.png',nachmittag:'/assets/img/der_nachmittag.png',abend:'/assets/img/der_abend.png',nacht:'/assets/img/die_nacht.png',
    wochenende:CDN+'wochenende.webp',
    aufstehen:CDN+'aufstehen.webp',aufraeumen:CDN+'aufraeumen.webp','aufräumen':CDN+'aufraeumen.webp',fernsehen:CDN+'fernsehen.webp',anrufen:CDN+'anrufen.webp',anfangen:CDN+'anfangen.webp',arbeiten:CDN+'arbeiten.webp',lernen:CDN+'lernen.webp'
  };
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
  function slug(s){return String(s||'').toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function rawSlug(s){return String(s||'').toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
  function candidates(w){
    const id=String(w&&w.id||'');
    const word=String(w&&w.word||id);
    const list=[];
    if(w&&w.image)list.push(w.image);
    if(IMG[id])list.push(IMG[id]);
    if(IMG[word])list.push(IMG[word]);
    [id,slug(id),rawSlug(id),slug(word),rawSlug(word)].filter(Boolean).forEach(x=>{list.push(CDN+x+'.webp',CDN+x+'.png')});
    return [...new Set(list.filter(Boolean))];
  }
  function imgTag(w,cls){
    const urls=candidates(w);
    const label=esc((w&&w.word)||(w&&w.id)||'Bild');
    const first=urls.shift()||'';
    const rest=esc(JSON.stringify(urls));
    return `<img${cls?' class="'+cls+'"':''} src="${esc(first)}" data-fallbacks='${rest}' onerror="spL5T3ImageFallback(this,'${label}')" alt="${label}" loading="eager">`;
  }
  window.spL5T3ImageFallback=window.spL5T3ImageFallback||function(img,label){
    try{
      const rest=JSON.parse(img.getAttribute('data-fallbacks')||'[]');
      const next=rest.shift();
      if(next){img.setAttribute('data-fallbacks',JSON.stringify(rest));img.src=next;return;}
    }catch(e){}
    const ph=document.createElement('div');
    ph.className=img.classList.contains('task-img')?'placeholder-img':'word-placeholder';
    ph.textContent=label||'Bild';
    img.replaceWith(ph);
  };
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{const c=candidates(w);if(c.length&&!w.image)w.image=c[0]});
  if(typeof window.spL5T3HydrateImages==='function'){
    setTimeout(()=>window.spL5T3HydrateImages(document),0);
    setTimeout(()=>window.spL5T3HydrateImages(document),120);
  }else{
    window.imgHtml=function(w){return imgTag(w,'')};
    window.bigImgHtml=function(w){return imgTag(w,'task-img')};
  }

  const oldHeader=window.header;
  window.header=function(title,showReset){
    if(typeof oldHeader==='function')oldHeader(title,showReset);
    const h=document.querySelector('.topbar');
    const nav=h&&h.querySelector('.nav');
    if(!nav)return;
    if(!nav.querySelector('[href="uebersicht.html"]')){
      const a=document.createElement('a');
      a.className='btn secondary';
      a.href='uebersicht.html';
      a.textContent='Übersicht';
      const reset=nav.querySelector('button.danger,.danger');
      if(reset)nav.insertBefore(a,reset);else nav.appendChild(a);
    }
  };
})();