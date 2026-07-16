(function(){
  const MODE_FILES=new Set(['svo.html','nom-akk.html','akkusativ-bestimmt.html','akkusativ-unbestimmt.html','meinen-deinen.html','akkusativ-praepositionen.html','bilddialoge.html','pruefung.html']);
  const original=window.taskKey;
  if(typeof original!=='function'||!window.L6T3)return;
  window.taskKey=function(file){
    const base=original(file);
    return MODE_FILES.has(file)?base+'_'+(L6T3.apEnabled()?'ap':'basis'):base;
  };
})();