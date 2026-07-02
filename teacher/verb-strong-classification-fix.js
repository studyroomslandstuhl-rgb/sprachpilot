// Korrektur starke/unregelmäßige Verben im Lehrerdashboard
(function(){
  function patch(){
    if(typeof verbList!=='function')return false;
    var extraStrong=new Set(['backen']);
    var oldIsStrong=typeof isStrongIrregularVerb==='function'?isStrongIrregularVerb:null;
    window.isStrongIrregularVerb=function(v){
      return extraStrong.has(v)||(oldIsStrong?oldIsStrong(v):false);
    };
    window.verbGroups=function(){
      var verbs=(typeof sortedVerbs==='function'?sortedVerbs(verbList()):verbList().slice().sort(function(a,b){return a.localeCompare(b,'de',{sensitivity:'base'})}));
      return {
        weak:verbs.filter(function(v){return !window.isStrongIrregularVerb(v)}),
        strong:verbs.filter(function(v){return window.isStrongIrregularVerb(v)})
      };
    };
    return true;
  }
  if(!patch()){
    document.addEventListener('DOMContentLoaded',patch);
    setTimeout(patch,100);
    setTimeout(patch,500);
    setTimeout(patch,1500);
  }
})();
