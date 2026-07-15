(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  function clean(v){return String(v||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(png|jpe?g|webp|gif|svg)$/i,'')}
  function bunny(v){const n=clean(v);return n?CDN+n+'.webp':''}
  function patchWord(w){if(w&&typeof w==='object'){const base=w.image||w.img||w.id||w.word;if(base&&!String(base).includes('sprachpilot-logo'))w.image=bunny(base);if(w.img)w.img=bunny(w.img)}}
  function patchArray(name){const a=window[name];if(Array.isArray(a))a.forEach(patchWord)}
  ['WORDS','NOUNS','PLURAL_NOUNS','FLASHCARD_WORDS','ARTICLE_WRITE_WORDS','COLORS','ADJECTIVES','FURNITURE','PRODUCTS'].forEach(patchArray);
  window.l4Bunny=bunny;
  const oldFix=window.fixImg;
  window.fixImg=function(img){
    const src=img&&img.getAttribute&&img.getAttribute('src');
    const next=bunny(src);
    if(next&&src!==next){img.src=next;return}
    if(typeof oldFix==='function')return oldFix(img);
    if(img){img.classList.add('missing');img.alt='Bild fehlt'}
  };
  window.imgTag=function(w,cls='task-img'){
    const src=bunny((w&&w.image)||(w&&w.img)||(w&&w.id));
    return src?`<img class="${cls}" src="${src}" onerror="fixImg(this)" alt="">`:`<div class="${cls} missing">Bild fehlt</div>`;
  };
  window.roomImg=function(id,label=true){
    const w=(typeof wordById==='function'?wordById(id):null)||{};
    const src=bunny(w.image||id);
    return `<div class="imgbox"><img src="${src}" onerror="fixImg(this)" alt="">${label?`<div class="label">${w.full||w.word||id}</div>`:''}</div>`;
  };
  window.placeImg=function(id,label){return `<div class="imgbox"><img src="${bunny(id)}" onerror="fixImg(this)" alt=""></div>`};
  window.img=function(name,cls='task-img'){return `<img class="${cls}" src="${bunny(name)}" onerror="fixImg(this)" alt="">`};
  window.colorImg=function(c,cls='task-img'){return `<img class="${cls} color-img" src="${bunny((c&&c.img)||(c&&c.id))}" onerror="fixImg(this)" alt="">`};

  function htmlEscape(value){return String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
  function textOf(html){const el=document.createElement('div');el.innerHTML=html;return String(el.textContent||'').trim()}
  function valueAfterLabel(text){const index=String(text||'').indexOf(':');return index>=0?String(text).slice(index+1).trim():String(text||'').trim()}
  function shortReason(text){
    const value=String(text||'');
    if(/keine Antwort/i.test(value))return'Es wurde keine Antwort geschrieben.';
    if(/Plural/i.test(value))return'Die Pluralform ist falsch.';
    if(/Kategorie/i.test(value))return'Die Kategorie ist falsch.';
    if(/Pronomen|Nomen muss/i.test(value))return'Nomen oder Pronomen ist falsch.';
    if(/Bild/i.test(value))return'Das falsche Bild wurde gewählt.';
    if(/Artikel/i.test(value)&&/Nomen ist richtig/i.test(value))return'Der Artikel ist falsch.';
    if(/nicht korrekt geschrieben|Schreib/i.test(value))return'Die Schreibweise ist falsch.';
    if(/Artikel und Wort/i.test(value))return'Artikel oder Wort ist falsch.';
    return'Die Antwort stimmt nicht vollständig.';
  }
  function compactExamFeedback(root=document){
    if(!/\/A1-Lektion-4\/Thema-2\/pruefung\.html$/i.test(location.pathname))return;
    if(!document.getElementById('l4t2-exam-feedback-style')){
      const style=document.createElement('style');style.id='l4t2-exam-feedback-style';
      style.textContent='.solution-box.l4t2-compact-feedback{text-align:left;line-height:1.45}.solution-box.l4t2-compact-feedback div+div{margin-top:5px}.solution-box.l4t2-compact-feedback b{color:#7f1d1d}';
      document.head.appendChild(style);
    }
    const boxes=[];
    if(root&&root.matches&&root.matches('.solution-box'))boxes.push(root);
    if(root&&root.querySelectorAll)root.querySelectorAll('.solution-box').forEach(box=>boxes.push(box));
    boxes.forEach(box=>{
      if(box.dataset.compactFeedback==='1')return;
      const parts=box.innerHTML.split(/<br\s*\/?\s*>/i);
      if(parts.length<3)return;
      const correct=valueAfterLabel(textOf(parts[0]));
      const user=valueAfterLabel(textOf(parts[1]));
      const reason=shortReason(valueAfterLabel(textOf(parts[2])));
      box.innerHTML=`<div><b>Richtige Lösung:</b> ${htmlEscape(correct)}</div><div><b>Deine Lösung:</b> ${htmlEscape(user||'–')}</div><div><b>Warum falsch:</b> ${htmlEscape(reason)}</div>`;
      box.dataset.compactFeedback='1';
      box.classList.add('l4t2-compact-feedback');
    });
  }

  function rewrite(root=document){
    try{['WORDS','NOUNS','PLURAL_NOUNS','FLASHCARD_WORDS','ARTICLE_WRITE_WORDS','COLORS','ADJECTIVES','FURNITURE','PRODUCTS'].forEach(patchArray)}catch(e){}
    try{root.querySelectorAll&&root.querySelectorAll('img').forEach(img=>{const src=img.getAttribute('src');const next=bunny(src);if(next&&src!==next&&!String(src||'').includes('sprachpilot-logo'))img.setAttribute('src',next)})}catch(e){}
    try{compactExamFeedback(root)}catch(e){}
  }
  rewrite();
  window.addEventListener('load',()=>{rewrite();setTimeout(rewrite,100);setTimeout(rewrite,500);setTimeout(rewrite,1200)});
  new MutationObserver(m=>m.forEach(x=>x.addedNodes&&x.addedNodes.forEach(n=>{if(n.nodeType===1)rewrite(n)}))).observe(document.documentElement,{childList:true,subtree:true});
})();