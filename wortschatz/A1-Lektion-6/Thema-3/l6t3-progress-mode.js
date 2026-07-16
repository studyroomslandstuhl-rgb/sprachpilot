(function(){
  const MODE_FILES=new Set(['svo.html','nom-akk.html','akkusativ-bestimmt.html','akkusativ-unbestimmt.html','meinen-deinen.html','akkusativ-praepositionen.html','bilddialoge.html','pruefung.html']);
  const original=window.taskKey;
  if(typeof original==='function'&&window.L6T3){
    window.taskKey=function(file){
      const base=original(file);
      return MODE_FILES.has(file)?base+'_'+(L6T3.apEnabled()?'ap':'basis'):base;
    };
  }
  if(window.L6T3){
    window.L6T3.refreshRelease=async function(callback){
      for(let i=0;i<30&&!window.SprachPilotRelease;i++)await new Promise(resolve=>setTimeout(resolve,100));
      try{
        if(window.SprachPilotRelease&&typeof SprachPilotRelease.refresh==='function')await SprachPilotRelease.refresh();
      }catch(e){}
      if(typeof callback==='function')callback();
    };
  }
})();