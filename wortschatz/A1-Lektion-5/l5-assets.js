(function(){
  const EXTRA={
    machen:'/assets/img/machen.png',
    praesentation:'/assets/img/praesentation.png',
    fruehstuecken:'/assets/img/fruehstuecken.png',
    einkaufen:'/assets/img/einkaufen.png',
    hoeren:'/assets/img/hoeren.png',
    kochen:'/assets/img/kochen.png',
    spazieren_gehen:'/assets/img/spazierengehen.png',
    aufraeumen:'/assets/img/aufraeumen.png',
    aufstehen:'/assets/img/aufstehen.png',
    gehen:'/assets/img/gehen.png',
    muede:'/assets/img/muede.png',
    anrufen:'/assets/img/anrufen.png',
    frueh:'/assets/img/frueh.png',
    supermarkt:'/assets/img/supermarkt.png',
    fernsehen:'/assets/img/fernsehen.png',
    arbeiten:'/assets/img/arbeiten.png',
    lange:'/assets/img/lange.png',
    spielen:'/assets/img/spielen.png',
    essen:'/assets/img/essen.png',
    schlafen:'/assets/img/schlafen.png',
    gern:'/assets/img/gern.png',
    nicht_gern:'/assets/img/nichtgern.png',
    anfangen:'/assets/img/anfangen.png',
    enden:'/assets/img/enden.png',
    trinken:'/assets/img/trinken.png',
    chatten:'/assets/img/chatten.png',
    oeffnen:'/assets/img/oeffnen.png',
    schliessen:'/assets/img/schliessen.png',
    geoeffnet:'/assets/img/oeffnen.png',
    geschlossen:'/assets/img/schliessen.png',
    bringen:'/assets/img/bringen.png',
    abholen:'/assets/img/abholen.png',
    fragen:'/assets/img/fragen.png',
    antworten:'/assets/img/antworten.png'
  };
  function uniq(a){return a.filter(Boolean).filter((x,i,r)=>r.indexOf(x)===i)}
  function compactId(id){return String(id||'').replace(/_/g,'')}
  function candidates(w){
    const id=w&&w.id;
    const list=[EXTRA[id]];
    if(w&&w.type==='verb')list.push('/assets/img/'+id+'.png','/assets/img/'+compactId(id)+'.png');
    if(id==='aufraeumen')list.push('/assets/img/aufraumen.png');
    if(id==='anrufen')list.push('/assets/img/telefonieren.png');
    if(w&&w.image)list.push(w.image);
    return uniq(list);
  }
  window.spL5ImageCandidates=candidates;
  window.displayImage=function(w){return candidates(w)[0]||''};
  window.hasGoodImage=function(w){return !!candidates(w).length};
  window.fixImg=function(img){
    const alts=(img.dataset.alt||'').split('|').filter(Boolean);
    const i=Number(img.dataset.i||0)+1;
    if(i<alts.length){img.dataset.i=String(i);img.src=alts[i];return;}
    const ph=document.createElement('div');ph.className='word-placeholder';ph.textContent='kein Bild';img.replaceWith(ph);
  };
  window.imgHtml=function(w){
    const alts=candidates(w);
    return alts.length?`<img src="${alts[0]}" data-alt="${alts.join('|')}" data-i="0" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`;
  };
  window.bigImgHtml=function(w){
    const alts=candidates(w);
    return alts.length?`<img class="task-img" src="${alts[0]}" data-alt="${alts.join('|')}" data-i="0" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`;
  };
  window.renderOverview=function(target){target.innerHTML=byType().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>`<div class="word-row">${window.imgHtml(w)}<div><b>${full(w)}</b><br><span class="small">${w.plural?`Plural: ${w.plural}`:'kein Plural'}</span>${nativeTrHtml(w)}<span class="tag">${w.section||''}</span>${window.hasGoodImage(w)?'':'<span class="tag">Bild fehlt</span>'}<div class="small">${w.sentence||''}</div></div></div>`).join('')}</section>`).join('')};
  window.renderStats=function(target){const st=loadTask('karteikarten.html',WORDS.length);target.innerHTML=byType().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>{const idx=WORDS.indexOf(w),ok=st.done.includes(idx);return`<div class="word-row">${window.imgHtml(w)}<div><b>${full(w)}</b>${nativeTrHtml(w)}<span class="small ${ok?'ok':'todo'}">${ok?'gelernt':'noch offen'}</span><br><span class="small">Karteikarten-Fortschritt wird gespeichert.</span></div></div>`}).join('')}</section>`).join('')};
})();