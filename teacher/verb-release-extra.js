(function(){
  try{
    if(typeof STRONG_IRREGULAR_VERBS==='undefined')return;
    ['anfangen','beginnen','fernsehen','aussterben','begraben','verbiegen','mitgeben','mitnehmen'].forEach(v=>STRONG_IRREGULAR_VERBS.add(v));
  }catch(e){console.warn('Neue Verben konnten nicht klassifiziert werden',e)}
})();
