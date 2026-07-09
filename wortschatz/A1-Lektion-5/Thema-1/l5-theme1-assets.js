(function(){
  try{import('/js/sp-assets.js?v=4').catch(()=>{})}catch(e){}
  const BASE='https://sprachpilot.b-cdn.net/';
  function bunny(name){const s=String(name||'');if(/^https?:\/\//i.test(s))return s;return BASE+s.split('/').pop().replace(/\.(png|jpe?g|webp|gif|svg)$/i,'')+'.webp'}
  const EXTRA={
    machen:'machen.webp',
    praesentation:'https://sprachpilot.b-cdn.net/Neu/praesentation.png',
    fruehstuecken:'fruehstuecken.webp',
    einkaufen:'einkaufen.webp',
    hoeren:'hoeren.webp',
    kochen:'kochen.webp',
    aufraeumen:'aufraeumen.webp',
    aufstehen:'aufstehen.webp',
    gehen:'gehen.webp',
    muede:'muede.webp',
    anrufen:'anrufen.webp',
    frueh:'frueh.webp',
    fernsehen:'fernsehen.webp',
    arbeiten:'arbeiten.webp',
    spielen:'spielen.webp',
    essen:'essen.webp',
    schlafen:'schlafen.webp',
    lange:'lange.webp',
    gern:'gern.webp',
    nicht_gern:'nicht_gern.webp',
    spazieren_gehen:'https://sprachpilot.b-cdn.net/Neu/spazierengehen.webp'
  };
  const BAD=new Set([]);
  window.displayImage=function(w){const raw=EXTRA[w&&w.id]||w&&w.image||(w&&w.id?w.id+'.webp':'');return raw?bunny(raw):''};
  window.hasGoodImage=function(w){return !!(w&&!BAD.has(w.id)&&window.displayImage(w))};
  window.imgHtml=function(w){return window.hasGoodImage(w)?`<img src="${window.displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`};
  window.bigImgHtml=function(w){return window.hasGoodImage(w)?`<img class="task-img" src="${window.displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`};
  window.renderOverview=function(target){target.innerHTML=byType().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>`<div class="word-row">${window.imgHtml(w)}<div><b>${full(w)}</b><br><span class="small">${w.plural?`Plural: ${w.plural}`:'kein Plural'}</span>${nativeTrHtml(w)}<span class="tag">${w.section||''}</span>${window.hasGoodImage(w)?'':'<span class="tag">Bild fehlt</span>'}<div class="small">${w.sentence||''}</div></div></div>`).join('')}</section>`).join('')};
  window.renderStats=function(target){const st=loadTask('karteikarten.html',WORDS.length);target.innerHTML=byType().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>{const idx=WORDS.indexOf(w),ok=st.done.includes(idx);return`<div class="word-row">${window.imgHtml(w)}<div><b>${full(w)}</b>${nativeTrHtml(w)}<span class="small ${ok?'ok':'todo'}">${ok?'gelernt':'noch offen'}</span><br><span class="small">Karteikarten-Fortschritt wird gespeichert.</span></div></div>`}).join('')}</section>`).join('')};
})();