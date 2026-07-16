(function(){
  'use strict';
  const PREFIX='SP_L4_T3_';
  function isPreview(){
    try{
      const a=localStorage.getItem('SP_TEACHER_PREVIEW');
      const b=sessionStorage.getItem('SP_TEACHER_PREVIEW');
      if(a==='1'||b==='1')return true;
      const parsed=JSON.parse(a||b||'null');
      return !!(parsed&&parsed.teacherPreview===true);
    }catch(e){return false}
  }
  if(isPreview()&&!window.__l4t3PreviewStoragePatched){
    window.__l4t3PreviewStoragePatched=true;
    const get=Storage.prototype.getItem;
    const set=Storage.prototype.setItem;
    const remove=Storage.prototype.removeItem;
    const key=k=>'SP_L4_T3_PREVIEW_'+String(k||'');
    Storage.prototype.getItem=function(k){
      if(this===localStorage&&String(k||'').startsWith(PREFIX))return get.call(sessionStorage,key(k));
      return get.call(this,k);
    };
    Storage.prototype.setItem=function(k,v){
      if(this===localStorage&&String(k||'').startsWith(PREFIX))return set.call(sessionStorage,key(k),v);
      return set.call(this,k,v);
    };
    Storage.prototype.removeItem=function(k){
      if(this===localStorage&&String(k||'').startsWith(PREFIX))return remove.call(sessionStorage,key(k));
      return remove.call(this,k);
    };
  }
  function fallbackSpeak(text,slow){
    if(typeof window.speak==='function'){
      try{return window.speak(text,!!slow)}catch(e){}
    }
    return false;
  }
  if(!window.L4T3Audio){
    window.L4T3Audio={
      stop(){try{speechSynthesis.cancel()}catch(e){}},
      playItem(item,slow){return fallbackSpeak((item&&(item.word||item.full))||'',slow)},
      playId(id,slow){
        try{
          const lists=[];
          if(typeof COLORS!=='undefined')lists.push(...COLORS);
          if(typeof ADJECTIVES!=='undefined')lists.push(...ADJECTIVES);
          if(typeof REACTIONS!=='undefined')lists.push(...REACTIONS);
          const item=lists.find(x=>x&&x.id===id);
          return this.playItem(item,slow);
        }catch(e){return false}
      },
      playWord(word,slow){return fallbackSpeak(word,slow)},
      buttons(item,statusId){
        if(!item)return '';
        const id=String(item.id||'').replace(/'/g,"\\'");
        return '<div class="actions"><button type="button" class="btn" onclick="L4T3Audio.playId(\''+id+'\',false)">🔊 Hören</button><button type="button" class="btn secondary" onclick="L4T3Audio.playId(\''+id+'\',true)">Langsam</button></div>';
      }
    };
  }
  function loadThemeScore(){
    if(window.L4T3ThemeScore||document.querySelector('script[data-l4t3-theme-score]'))return;
    if(document.readyState==='loading'){
      document.write('<script data-l4t3-theme-score="1" src="l4t3-theme-score.js?v=1"><\/script>');
      return;
    }
    const script=document.createElement('script');
    script.src='l4t3-theme-score.js?v=1';
    script.dataset.l4t3ThemeScore='1';
    document.head.appendChild(script);
  }
  loadThemeScore();
  function showFailure(message){
    const area=document.getElementById('area');
    if(!area)return;
    area.innerHTML='<div class="no"><b>Die Aufgabe konnte nicht gestartet werden.</b><br>'+String(message||'Bitte lade die Seite neu.')+'</div><div class="actions"><button class="btn" type="button" onclick="location.reload()">Neu laden</button><a class="btn secondary" href="index.html?v=l4t3-ledger1">Zum Thema</a></div>';
  }
  window.addEventListener('error',function(event){
    console.error(event.error||event.message);
    const area=document.getElementById('area');
    if(area&&!area.children.length)showFailure(event.message||'JavaScript-Fehler');
  });
  setTimeout(function(){
    const headerEl=document.querySelector('header.topbar');
    if(headerEl&&!headerEl.textContent.trim()&&typeof window.header==='function'){
      try{window.header('Farben & Adjektive')}catch(e){}
    }
    const area=document.getElementById('area');
    if(area&&!area.textContent.trim()&&!area.children.length)showFailure('Die Inhalte wurden nicht geladen.');
  },1800);
})();
