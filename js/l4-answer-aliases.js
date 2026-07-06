(function(){
  function alias(s){return String(s||'').replace(/\bbadezimmer\b/gi,'Bad').replace(/\bBadezimmer\b/g,'Bad')}
  function patch(){
    try{
      if(typeof window.simple==='function'&&!window.simple.__badAlias){
        const old=window.simple;
        window.simple=function(x){return old(alias(x)).replace(/\bbadezimmer\b/g,'bad')};
        window.simple.__badAlias=true;
      }
    }catch(e){}
    try{
      if(typeof window.normalizeText==='function'&&!window.normalizeText.__badAlias){
        const old=window.normalizeText;
        window.normalizeText=function(x){return old(alias(x)).replace(/\bbadezimmer\b/g,'bad')};
        window.normalizeText.__badAlias=true;
      }
    }catch(e){}
    try{
      if(typeof window.eq==='function'&&!window.eq.__badAlias){
        const old=window.eq;
        window.eq=function(a,b){return old(a,b)||old(alias(a),alias(b))};
        window.eq.__badAlias=true;
      }
    }catch(e){}
  }
  patch();setTimeout(patch,200);setTimeout(patch,800);setTimeout(patch,1600);
})();