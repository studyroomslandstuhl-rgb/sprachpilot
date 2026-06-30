(function(){
  try{
    if(window.ALL_VERBS){
      const existing=new Set(window.ALL_VERBS.map(x=>x.v));
      [{v:'vergeben',img:'vergeben'},{v:'verbringen',img:'verbringen'}].forEach(item=>{if(!existing.has(item.v)){window.ALL_VERBS.push(item);existing.add(item.v);}});
    }
    if(typeof STRONG_IRREGULAR_VERBS==='undefined')return;
    ['anfangen','beginnen','fernsehen','aussterben','begraben','verbiegen','mitgeben','mitnehmen','vergeben'].forEach(v=>STRONG_IRREGULAR_VERBS.add(v));
  }catch(e){console.warn('Neue Verben konnten nicht klassifiziert werden',e)}
})();
