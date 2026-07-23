(function(){
  'use strict';
  const MODE_FILES=new Set(['svo.html','nom-akk.html','akkusativ-bestimmt.html','akkusativ-unbestimmt.html','meinen-deinen.html','akkusativ-praepositionen.html','pruefung.html']);
  const STABLE_FILES=new Set(['bilddialoge.html']);
  const originalTaskKey=window.taskKey;
  const migratedKeys=new Set();
  let cachedMode=null;
  let refreshStarted=false;

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
    if(migratedKeys.has(base))return;
    migratedKeys.add(base);
    const candidates=[base,base+'_basis',base+'_ap'];
    let best=null;
    for(const key of candidates){
      const value=readState(key);
      if(value&&(!best||stateScore(value)>stateScore(best)))best=value;
    }
    if(!best)return;
    const current=readState(base);
    if(!current||stateScore(best)>stateScore(current)){
      try{localStorage.setItem(base,JSON.stringify(best))}catch(e){}
    }
  }

  const originalApEnabled=window.L6T3&&typeof L6T3.apEnabled==='function'?L6T3.apEnabled.bind(L6T3):()=>false;
  function currentMode(force=false){
    if(force)cachedMode=null;
    if(cachedMode===null)cachedMode=originalApEnabled()?'ap':'basis';
    return cachedMode;
  }

  if(window.L6T3){
    window.L6T3.apEnabled=function(){return currentMode()}
  }

  if(typeof originalTaskKey==='function'&&window.L6T3){
    window.taskKey=function(file){
      const base=originalTaskKey(file);
      if(STABLE_FILES.has(file)){
        migrateStable(base);
        return base;
      }
      return MODE_FILES.has(file)?base+'_'+currentMode():base;
    };
  }

  async function refreshWhenReady(callback,attempt=0,beforeMode=currentMode(true)){
    if(refreshStarted)return;
    const release=window.SprachPilotRelease;
    if(!release||typeof release.refresh!=='function'){
      if(attempt<5)setTimeout(()=>refreshWhenReady(callback,attempt+1,beforeMode),120*(attempt+1));
      return;
    }
    refreshStarted=true;
    try{await release.refresh()}catch(e){}
    const afterMode=currentMode(true);
    if(afterMode!==beforeMode&&typeof callback==='function')callback();
  }

  if(window.L6T3){
    window.L6T3.refreshRelease=function(callback){
      refreshStarted=false;
      refreshWhenReady(callback);
    };
  }

  window.addEventListener('storage',event=>{
    if(event.key==='SP_COURSE_RELEASES'||event.key==='SP_USER_PROFILE'||event.key==='SP_STUDENT_PROFILE')cachedMode=null;
  });
})();