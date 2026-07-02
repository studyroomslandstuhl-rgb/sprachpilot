(function(){
  const LABELS={noun:'Nomen',adverb:'Adverbien',time:'Zeitwörter',adjective:'Adjektive',verb:'Verben',phrase:'Ausdrücke'};
  const ORDER=['noun','adverb','time','adjective','verb','phrase'];
  function grouped(){
    const g={};
    (window.WORDS||[]).forEach(w=>{(g[w.type||'other']||(g[w.type||'other']=[])).push(w)});
    return ORDER.filter(k=>g[k]).map(k=>[LABELS[k]||k,g[k]]).concat(Object.keys(g).filter(k=>!ORDER.includes(k)).map(k=>[LABELS[k]||'Andere Wörter',g[k]]));
  }
  window.renderOverview=function(el){
    el.innerHTML=grouped().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b><div class="native-trans"><b>Muttersprache:</b> ${tr(w)}</div><span class="tag">${label}</span><div class="small">${w.sentence||''}</div></div></div>`).join('')}</section>`).join('');
  };
  window.renderStats=function(el){
    const st=loadTask('karteikarten.html',WORDS.length);
    el.innerHTML=grouped().map(([label,items])=>`<section class="type-block"><div class="type-title">${label}</div>${items.map(w=>{const i=WORDS.indexOf(w);return`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b><div class="native-trans"><b>Muttersprache:</b> ${tr(w)}</div><span class="tag">${label}</span><span class="small ${st.done.includes(i)?'ok':'todo'}">${st.done.includes(i)?'gelernt':'noch offen'}</span></div></div>`}).join('')}</section>`).join('');
  };
})();