(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  const IMG={
    montag:CDN+'kalender.webp',dienstag:CDN+'kalender.webp',mittwoch:CDN+'kalender.webp',donnerstag:CDN+'kalender.webp',freitag:CDN+'kalender.webp',samstag:CDN+'kalender.webp',sonntag:CDN+'kalender.webp',
    morgen:'/assets/img/der_morgen.png',vormittag:'/assets/img/der_vormittag.png',mittag:'/assets/img/der_mittag.png',nachmittag:'/assets/img/der_nachmittag.png',abend:'/assets/img/der_abend.png',nacht:'/assets/img/die_nacht.png',mitternacht:'/assets/img/die_mitternacht.png',
    wochenende:CDN+'wochenende.webp',
    aufstehen:CDN+'aufstehen.webp',aufraeumen:CDN+'aufraeumen.webp','aufräumen':CDN+'aufraeumen.webp',fernsehen:CDN+'fernsehen.webp',anrufen:CDN+'anrufen.webp',anfangen:CDN+'anfangen.webp',arbeiten:CDN+'arbeiten.webp',lernen:CDN+'lernen.webp'
  };
  const READY=new Map();
  const LOADING=new Map();
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
  function slug(s,sep='-'){return String(s||'').toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,sep).replace(new RegExp('^'+sep+'|'+sep+'$','g'),'')}
  function abs(path){return /^https?:\/\//i.test(String(path||''))||String(path||'').startsWith('/')?path:CDN+path}
  function list(w){
    const id=String(w&&w.id||''),word=String(w&&w.word||id),article=String(w&&w.article||'');
    const out=[];
    if(w&&w.image)out.push(abs(w.image));
    if(IMG[id])out.push(abs(IMG[id]));
    if(IMG[word])out.push(abs(IMG[word]));
    const stems=[id,slug(id),slug(id,'_'),word,slug(word),slug(word,'_'),article&&word?slug(article+' '+word):'',article&&word?slug(article+' '+word,'_'):''].filter(Boolean);
    stems.forEach(x=>{out.push(CDN+x+'.webp',CDN+x+'.png',CDN+x+'.jpg')});
    return [...new Set(out.filter(Boolean))];
  }
  function key(w){return String((w&&w.id)||(w&&w.word)||'')}
  function preload(w){
    const k=key(w);if(!k)return Promise.resolve('');
    if(READY.has(k))return Promise.resolve(READY.get(k));
    if(LOADING.has(k))return LOADING.get(k);
    const urls=list(w);
    const p=new Promise(resolve=>{
      let i=0;
      function next(){
        if(i>=urls.length){resolve('');return}
        const img=new Image();
        const src=urls[i++];
        img.onload=()=>{READY.set(k,src);resolve(src)};
        img.onerror=next;
        img.src=src;
      }
      next();
    }).finally(()=>LOADING.delete(k));
    LOADING.set(k,p);return p;
  }
  function hydrate(root=document){
    root.querySelectorAll('img[data-l5t3-word]').forEach(img=>{
      if(img.dataset.ready==='1')return;
      const id=img.dataset.l5t3Word;
      const w=(typeof WORDS!=='undefined'?WORDS:[]).find(x=>String(x.id)===id||String(x.word)===id)||{id,word:id};
      preload(w).then(src=>{if(src){img.dataset.ready='1';img.src=src}else spL5T3ImageFallback(img,w.word||id)})
    });
  }
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{const l=list(w);if(l.length)w.image=l[0];preload(w)});
  window.spL5T3ImageFallback=function(img,label){
    try{const rest=JSON.parse(img.getAttribute('data-fallbacks')||'[]');const next=rest.shift();if(next){img.setAttribute('data-fallbacks',JSON.stringify(rest));img.src=next;return}}catch(e){}
    const ph=document.createElement('div');ph.className=img.classList.contains('task-img')?'placeholder-img':'word-placeholder';ph.textContent=label||'Bild';img.replaceWith(ph);
  };
  window.imgHtml=function(w){const l=list(w),k=esc(key(w)),first=READY.get(key(w))||l.shift()||'';return `<img data-l5t3-word="${k}" src="${esc(first)}" data-fallbacks='${esc(JSON.stringify(l))}' onload="this.dataset.ready='1'" onerror="spL5T3ImageFallback(this,'${esc((w&&w.word)||(w&&w.id)||'Bild')}')" alt="${esc((w&&w.word)||'Bild')}" loading="eager" decoding="async">`};
  window.bigImgHtml=function(w){const l=list(w),k=esc(key(w)),first=READY.get(key(w))||l.shift()||'';setTimeout(()=>hydrate(document),30);return `<img class="task-img" data-l5t3-word="${k}" src="${esc(first)}" data-fallbacks='${esc(JSON.stringify(l))}' onload="this.dataset.ready='1'" onerror="spL5T3ImageFallback(this,'${esc((w&&w.word)||(w&&w.id)||'Bild')}')" alt="${esc((w&&w.word)||'Bild')}" loading="eager" decoding="async" fetchpriority="high">`};
  window.spL5T3HydrateImages=hydrate;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>hydrate(document));else setTimeout(()=>hydrate(document),0);
})();