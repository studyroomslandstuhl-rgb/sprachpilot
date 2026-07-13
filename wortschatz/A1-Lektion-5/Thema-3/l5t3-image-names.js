(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  const IMG={
    montag:CDN+'kalender.webp',dienstag:CDN+'kalender.webp',mittwoch:CDN+'kalender.webp',donnerstag:CDN+'kalender.webp',freitag:CDN+'kalender.webp',samstag:CDN+'kalender.webp',sonntag:CDN+'kalender.webp',
    morgen:'/assets/img/der_morgen.png',vormittag:'/assets/img/der_vormittag.png',mittag:'/assets/img/der_mittag.png',nachmittag:'/assets/img/der_nachmittag.png',abend:'/assets/img/der_abend.png',nacht:'/assets/img/die_nacht.png',mitternacht:'/assets/img/die_mitternacht.png',
    wochenende:CDN+'wochenende.webp',
    aufstehen:CDN+'aufstehen.webp',aufraeumen:CDN+'aufraeumen.webp','aufräumen':CDN+'aufraeumen.webp',fernsehen:CDN+'fernsehen.webp',anrufen:CDN+'anrufen.webp',anfangen:CDN+'anfangen.webp',arbeiten:CDN+'arbeiten.webp',lernen:CDN+'lernen.webp'
  };
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
  function slug(s,sep='-'){return String(s||'').toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,sep).replace(new RegExp('^'+sep+'|'+sep+'$','g'),'')}
  function list(w){
    const id=String(w&&w.id||''),word=String(w&&w.word||id);
    const out=[];
    if(w&&w.image)out.push(w.image);
    if(IMG[id])out.push(IMG[id]);
    if(IMG[word])out.push(IMG[word]);
    [id,slug(id),slug(id,'_'),slug(word),slug(word,'_')].filter(Boolean).forEach(x=>{out.push(CDN+x+'.webp',CDN+x+'.png')});
    return [...new Set(out.filter(Boolean))];
  }
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{const l=list(w);if(l.length)w.image=l[0];});
  window.spL5T3ImageFallback=function(img,label){
    try{const rest=JSON.parse(img.getAttribute('data-fallbacks')||'[]');const next=rest.shift();if(next){img.setAttribute('data-fallbacks',JSON.stringify(rest));img.src=next;return}}catch(e){}
    const ph=document.createElement('div');ph.className=img.classList.contains('task-img')?'placeholder-img':'word-placeholder';ph.textContent=label||'Bild';img.replaceWith(ph);
  };
  window.imgHtml=function(w){const l=list(w),first=l.shift()||'';return `<img src="${esc(first)}" data-fallbacks='${esc(JSON.stringify(l))}' onerror="spL5T3ImageFallback(this,'${esc((w&&w.word)||(w&&w.id)||'Bild')}')" alt="${esc((w&&w.word)||'Bild')}" loading="lazy">`};
  window.bigImgHtml=function(w){const l=list(w),first=l.shift()||'';return `<img class="task-img" src="${esc(first)}" data-fallbacks='${esc(JSON.stringify(l))}' onerror="spL5T3ImageFallback(this,'${esc((w&&w.word)||(w&&w.id)||'Bild')}')" alt="${esc((w&&w.word)||'Bild')}" loading="lazy">`};
})();