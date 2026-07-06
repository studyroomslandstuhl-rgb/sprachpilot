(function(){
  window.renderOverview=function(el){
    const groups={};
    WORDS.forEach(w=>(groups[w.type]=groups[w.type]||[]).push(w));
    el.innerHTML=Object.keys(groups).map(g=>`<div class="type-block"><div class="type-title">${g}</div>${groups[g].map(w=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b><div class="small">${w.plural?`Plural: ${w.plural}`:'kein Plural'}</div>${nativeTrHtml(w)}<div class="small">${w.type}</div></div></div>`).join('')}</div>`).join('');
  };
})();