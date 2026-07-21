(function(){
  'use strict';
  const MODE_FILES=new Set(['svo.html','nom-akk.html','akkusativ-bestimmt.html','akkusativ-unbestimmt.html','meinen-deinen.html','akkusativ-praepositionen.html','pruefung.html']);
  const STABLE_FILES=new Set(['bilddialoge.html']);
  const original=window.taskKey;

  function readState(key){
    try{
      const value=JSON.parse(localStorage.getItem(key)||'null');
      return value&&Array.isArray(value.done)&&Array.isArray(value.queue)?value:null;
    }catch(e){return null}
  }
  function stateScore(value){
    if(!value)return -1;
    return (value.done?.length||0)*100000+(value.current!==null&&value.current!==undefined?1000:0)+(Number(value.dialogStage)||0)*100+(Number(value.tries)||0);
  }
  function migrateStable(base){
    const candidates=[base,base+'_basis',base+'_ap'];
    let best=null;
    for(const key of candidates){
      const value=readState(key);
      if(value&&(!best||stateScore(value)>stateScore(best)))best=value;
    }
    if(best){
      const current=readState(base);
      if(!current||stateScore(best)>stateScore(current)){
        try{localStorage.setItem(base,JSON.stringify(best))}catch(e){}
      }
    }
  }

  if(typeof original==='function'&&window.L6T3){
    window.taskKey=function(file){
      const base=original(file);
      if(STABLE_FILES.has(file)){
        migrateStable(base);
        return base;
      }
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