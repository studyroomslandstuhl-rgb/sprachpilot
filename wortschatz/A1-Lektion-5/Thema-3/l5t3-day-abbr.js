(function(){
  const ABBR={montag:'Mo.',dienstag:'Di.',mittwoch:'Mi.',donnerstag:'Do.',freitag:'Fr.',samstag:'Sa.',sonntag:'So.',wochenende:'Sa.+So.'};
  const oldImg=window.imgHtml;
  const oldBig=window.bigImgHtml;
  function abbrHtml(w,big=false){
    const t=ABBR[w?.id];
    if(!t)return null;
    return big?`<div class="placeholder-img">${t}</div>`:`<div class="word-placeholder">${t}</div>`;
  }
  window.imgHtml=function(w){return abbrHtml(w,false)||(oldImg?oldImg(w):'')};
  window.bigImgHtml=function(w){return abbrHtml(w,true)||(oldBig?oldBig(w):'')};
})();