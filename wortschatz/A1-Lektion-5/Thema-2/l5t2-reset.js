(function(){
  const TOPIC={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:'2',topicId:'wortschatz-a1-lektion-5-thema-2',title:'A1 Lektion 5 · Thema 2'};
  const KEY='SP_L5_T2_V1';
  const FILES=['karteikarten.html','artikel.html','plural.html','sehen-schreiben.html','hoeren-schreiben.html','sprechen.html','formell-informell.html','frage-antwort.html','uhrzeit-waehlen.html','schon-erst.html','pruefung.html'];
  function clearLocal(){
    try{
      FILES.forEach(f=>localStorage.removeItem(KEY+'_'+f));
      Object.keys(localStorage).forEach(k=>{
        if(k.startsWith(KEY+'_'))localStorage.removeItem(k);
        if(/^SP_L5_T2_V\d+_/.test(k))localStorage.removeItem(k);
      });
    }catch(e){}
  }
  function wait(ms){return new Promise(r=>setTimeout(r,ms))}
  async function progressApi(){
    for(let i=0;i<12;i++){
      if(window.SPProgress&&typeof window.SPProgress.recordThemeReset==='function')return window.SPProgress;
      await wait(150);
    }
    try{await import('/js/progress.js?v=6')}catch(e){}
    for(let i=0;i<12;i++){
      if(window.SPProgress&&typeof window.SPProgress.recordThemeReset==='function')return window.SPProgress;
      await wait(150);
    }
    return null;
  }
  window.resetThemeProgress=async function(){
    if(!confirm('Fortschritte in diesem Thema löschen? Die bisher gesammelten Punkte bleiben erhalten.'))return;
    try{
      const api=await progressApi();
      if(api)await api.recordThemeReset(TOPIC);
    }catch(e){console.warn('L5T2 reset sync failed',e)}
    clearLocal();
    sessionStorage.setItem('SP_TOPIC_HYDRATE_RELOAD_'+TOPIC.topicId,'1');
    location.href='index.html?reset=1';
  };
})();