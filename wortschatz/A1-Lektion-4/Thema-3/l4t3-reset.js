(function(){
  'use strict';
  const MODE_KEY='SP_L4_T3_COLOR_MODE_V1';
  function mode(){
    try{
      const query=new URLSearchParams(location.search).get('colors');
      if(query==='basis'||query==='advanced')return query;
      return localStorage.getItem(MODE_KEY)==='advanced'?'advanced':'basis';
    }catch(e){return 'basis'}
  }
  function isProgressKey(key){
    key=String(key||'');
    return key.startsWith('SP_L4_T3_V2_')||
      key.startsWith('SP_L4_T3_EXAM')||
      key.startsWith('SP_L4_T3_PREVIEW_')||
      (key.startsWith('SP_TASK_STATE_')&&/L4[_-]?T3|L4.*THEMA.?3/i.test(key))||
      (key.startsWith('SP_TASK_PROGRESS_')&&/L4[_-]?T3|L4.*THEMA.?3/i.test(key));
  }
  function clearStorage(storage){
    const keys=[];
    for(let i=0;i<storage.length;i++){
      const key=storage.key(i);
      if(isProgressKey(key))keys.push(key);
    }
    keys.forEach(key=>storage.removeItem(key));
    return keys.length;
  }
  function clearAll(){
    const removed=clearStorage(localStorage)+clearStorage(sessionStorage);
    try{localStorage.removeItem('SP_L4_T3_V2_EXAM_UNLOCKED_basis')}catch(e){}
    try{localStorage.removeItem('SP_L4_T3_V2_EXAM_UNLOCKED_advanced')}catch(e){}
    return removed;
  }
  function resetAll(){
    if(!confirm('Möchten Sie wirklich alle sichtbaren Fortschritte in L4T3 löschen? Bereits verdiente Punkte bleiben erhalten.'))return false;
    clearAll();
    location.href='index.html?colors='+encodeURIComponent(mode())+'&v=l4t3-reset2&reset='+Date.now();
    return true;
  }
  window.L4T3Reset={clearAll,resetAll,isProgressKey};
  window.resetThemeProgress=resetAll;
})();
