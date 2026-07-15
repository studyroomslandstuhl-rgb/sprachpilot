(function(){
  const AUDIO_CDN="https://sprachpilot.b-cdn.net/audio/";
  let currentAudio=null;
  function groupOf(w){
    if(typeof window.spT2Group==="function")return window.spT2Group(w);
    return w&&(w.releaseGroup||w.wordGroup||w.group||(w.set==="plus"?"extra":"book"))||"";
  }
  function has(w){return !!(w&&w.id&&(groupOf(w)==="book"||w.category==="Möbel"))}
  function url(w){return has(w)?AUDIO_CDN+encodeURIComponent(w.id)+".mp3":""}
  function findWord(id){
    if(typeof window.wordById==="function")return window.wordById(id);
    return Array.isArray(window.WORDS)?window.WORDS.find(function(w){return w&&w.id===id}):null;
  }
  function statusElement(statusId){return document.getElementById(statusId||"audioStatus")}
  function setStatus(statusId,text,isError){
    const el=statusElement(statusId);if(!el)return;
    el.textContent=text||"";
    if(isError)el.classList.add("error");else el.classList.remove("error");
  }
  function stop(){
    if(!currentAudio)return;
    try{currentAudio.pause();currentAudio.currentTime=0}catch(e){}
    currentAudio=null;
  }
  function play(w,slow,statusId){
    const src=url(w);if(!src)return false;
    stop();setStatus(statusId,"",false);
    const audio=new Audio(src);
    audio.preload="auto";audio.playbackRate=slow?0.75:1;
    audio.onplay=function(){setStatus(statusId,slow?"Langsame Wiedergabe läuft …":"Wiedergabe läuft …",false)};
    audio.onended=function(){setStatus(statusId,"",false);currentAudio=null};
    audio.onerror=function(){setStatus(statusId,"Audio konnte nicht geladen werden.",true);currentAudio=null};
    currentAudio=audio;
    try{
      const promise=audio.play();
      if(promise&&typeof promise.catch==="function")promise.catch(function(){setStatus(statusId,"Audio konnte nicht abgespielt werden.",true);currentAudio=null});
    }catch(e){setStatus(statusId,"Audio konnte nicht abgespielt werden.",true);currentAudio=null}
    return true;
  }
  function playById(id,slow,statusId){return play(findWord(id),!!slow,statusId||"audioStatus")}
  function safeId(id){return String(id||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'")}
  function buttons(w,statusId){
    if(!has(w))return "";
    const id=safeId(w.id),sid=safeId(statusId||"audioStatus");
    return '<div class="actions l4t2-audio-actions">'+
      '<button type="button" class="btn" onclick="L4T2Audio.playById(\''+id+'\',false,\''+sid+'\')">🔊 Hören</button>'+
      '<button type="button" class="btn secondary" onclick="L4T2Audio.playById(\''+id+'\',true,\''+sid+'\')">Langsam</button>'+
      '</div>';
  }
  function iconButton(w,statusId){
    if(!has(w))return "";
    const id=safeId(w.id),sid=safeId(statusId||"audioStatus");
    return '<button type="button" class="l4t2-audio-icon" aria-label="Wort anhören" title="Wort anhören" onclick="event.stopPropagation();L4T2Audio.playById(\''+id+'\',false,\''+sid+'\')">🔊</button>';
  }
  if(!document.getElementById("l4t2-audio-style")){
    const style=document.createElement("style");style.id="l4t2-audio-style";
    style.textContent=".audio-status{min-height:24px;margin:8px 0;text-align:center;font-weight:800;color:#7a5100}.audio-status.error{color:#9b1c1c}.l4t2-audio-actions{margin:10px 0}.l4t2-audio-icon{display:inline-flex;align-items:center;justify-content:center;margin-left:6px;padding:4px 7px;border:1px solid #e4bd20;border-radius:9px;background:#fff8cf;cursor:pointer;font-size:16px;line-height:1;touch-action:manipulation}.l4t2-audio-icon:hover{background:#ffef9a}";
    document.head.appendChild(style);
  }
  window.L4T2Audio={has:has,url:url,play:play,playById:playById,buttons:buttons,iconButton:iconButton,stop:stop};
})();