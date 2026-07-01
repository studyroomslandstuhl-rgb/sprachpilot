(function(){
  const EXTRA={
    machen:'/assets/img/machen.png',
    praesentation:'/assets/img/praesentation.png',
    fruehstuecken:'/assets/img/fruehstuecken.png',
    einkaufen:'/assets/img/einkaufen.png',
    hoeren:'/assets/img/hoeren.png',
    kochen:'/assets/img/kochen.png',
    aufraeumen:'/assets/img/aufraumen.png',
    aufstehen:'/assets/img/aufstehen.png',
    gehen:'/assets/img/gehen.png',
    muede:'/assets/img/muede.png',
    anrufen:'/assets/img/anrufen.png',
    frueh:'/assets/img/frueh.png',
    fernsehen:'/assets/img/fernsehen.png',
    arbeiten:'/assets/img/arbeiten.png',
    spielen:'/assets/img/spielen.png',
    essen:'/assets/img/essen.png',
    schlafen:'/assets/img/schlafen.png'
  };
  const BAD=new Set(['spazieren_gehen']);
  window.displayImage=function(w){return EXTRA[w&&w.id]||w&&w.image||''};
  window.hasGoodImage=function(w){return !!(w&&!BAD.has(w.id)&&window.displayImage(w))};
  window.imgHtml=function(w){return window.hasGoodImage(w)?`<img src="${window.displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`};
  window.bigImgHtml=function(w){return window.hasGoodImage(w)?`<img class="task-img" src="${window.displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`};
  window.renderOverview=function(target){target.innerHTML=byType().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>`<div class="word-row">${window.imgHtml(w)}<div><b>${full(w)}</b><br><span class="small">${w.plural?`Plural: ${w.plural}`:'kein Plural'}</span>${nativeTrHtml(w)}<span class="tag">${w.section||''}</span>${window.hasGoodImage(w)?'':'<span class="tag">Bild fehlt</span>'}<div class="small">${w.sentence||''}</div></div></div>`).join('')}</section>`).join('')};
  window.renderStats=function(target){const st=loadTask('karteikarten.html',WORDS.length);target.innerHTML=byType().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>{const idx=WORDS.indexOf(w),ok=st.done.includes(idx);return`<div class="word-row">${window.imgHtml(w)}<div><b>${full(w)}</b>${nativeTrHtml(w)}<span class="small ${ok?'ok':'todo'}">${ok?'gelernt':'noch offen'}</span><br><span class="small">Karteikarten-Fortschritt wird gespeichert.</span></div></div>`}).join('')}</section>`).join('')};
})();