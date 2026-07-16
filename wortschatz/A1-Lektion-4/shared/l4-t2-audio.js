(function(){
  const AUDIO_CDN="https://sprachpilot.b-cdn.net/audio/";
  let player=null;
  let playToken=0;

  function groupOf(w){
    if(typeof window.spT2Group==="function")return window.spT2Group(w);
    return w&&(w.releaseGroup||w.wordGroup||w.group||(w.set==="plus"?"extra":"book"))||"";
  }

  function has(w){return !!(w&&(w.audioFile||w.audio||w.audioId||w.id||w.word||w.full))}

  function germanAscii(value){
    return String(value||"")
      .replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")
      .replace(/Ä/g,"Ae").replace(/Ö/g,"Oe").replace(/Ü/g,"Ue");
  }

  function slug(value,separator){
    return germanAscii(value).toLowerCase().trim()
      .replace(/[^a-z0-9]+/g,separator)
      .replace(new RegExp("^"+separator+"|"+separator+"$","g"),"");
  }

  function stripExtension(value){return String(value||"").replace(/^.*\//,"").replace(/\.mp3$/i,"")}

  function candidates(w){
    if(!has(w))return [];
    const explicit=[stripExtension(w.audioFile),stripExtension(w.audio),stripExtension(w.audioId),stripExtension(w.id)].filter(Boolean);
    const raw=explicit.length?explicit:[
      germanAscii(w.word||"").toLowerCase(),
      slug(w.word||"","-"),
      slug(w.word||"","_"),
      germanAscii(w.full||"").toLowerCase(),
      slug(w.full||"","-"),
      slug(w.full||"","_")
    ].filter(Boolean);
    const names=[];
    raw.forEach(function(name){name=String(name).trim();if(name&&!names.includes(name))names.push(name)});
    return names.map(function(name){return AUDIO_CDN+encodeURIComponent(name)+".mp3"});
  }

  function statusElement(statusId){return document.getElementById(statusId||"audioStatus")}
  function setStatus(statusId,text,isError){const el=statusElement(statusId);if(!el)return;el.textContent=text||"";el.classList.toggle("error",!!isError)}

  function browserSpeak(text,slow,statusId){
    if(!text||!("speechSynthesis" in window))return false;
    try{
      speechSynthesis.cancel();
      const utterance=new SpeechSynthesisUtterance(String(text));
      utterance.lang="de-DE";
      utterance.rate=slow?0.65:0.92;
      utterance.onstart=function(){setStatus(statusId,slow?"Langsame Wiedergabe läuft …":"Wiedergabe läuft …",false)};
      utterance.onend=function(){setStatus(statusId,"",false)};
      utterance.onerror=function(){setStatus(statusId,"Audio konnte nicht geladen werden.",true)};
      speechSynthesis.speak(utterance);
      return true;
    }catch(e){return false}
  }

  function getPlayer(){
    if(player&&document.documentElement.contains(player))return player;
    player=document.getElementById("l4t2AudioPlayer");
    if(!player){player=document.createElement("audio");player.id="l4t2AudioPlayer";player.preload="auto";player.setAttribute("playsinline","");player.style.display="none";document.body.appendChild(player)}
    return player;
  }

  function stop(){
    playToken++;
    try{if("speechSynthesis" in window)speechSynthesis.cancel()}catch(e){}
    const audio=getPlayer();
    try{audio.pause();audio.removeAttribute("src");audio.load()}catch(e){}
  }

  function play(w,slow,statusId,fallbackText){
    const urls=candidates(w);
    if(!urls.length)return browserSpeak(fallbackText,slow,statusId);
    const token=++playToken,audio=getPlayer();let index=0;
    function failed(){if(fallbackText&&browserSpeak(fallbackText,slow,statusId))return;setStatus(statusId,"Audio konnte nicht geladen werden.",true);try{audio.pause();audio.removeAttribute("src");audio.load()}catch(e){}}
    function tryNext(){
      if(token!==playToken)return;
      if(index>=urls.length){failed();return}
      const src=urls[index++];setStatus(statusId,"Audio wird geladen …",false);
      try{
        audio.pause();audio.src=src;audio.playbackRate=slow?0.75:1;audio.currentTime=0;audio.onerror=tryNext;
        audio.onplay=function(){if(token===playToken)setStatus(statusId,slow?"Langsame Wiedergabe läuft …":"Wiedergabe läuft …",false)};
        audio.onended=function(){if(token===playToken)setStatus(statusId,"",false)};
        const promise=audio.play();
        if(promise&&typeof promise.catch==="function")promise.catch(function(err){if(token!==playToken)return;if(err&&err.name==="NotAllowedError")setStatus(statusId,"Bitte tippe noch einmal auf Anhören.",true);else tryNext()});
      }catch(e){tryNext()}
    }
    tryNext();return true;
  }

  function safe(value){return String(value||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'")}
  function dataFor(w){return " data-audio-id='"+safe(w.id||"")+"' data-audio-word='"+safe(w.word||"")+"' data-audio-full='"+safe(w.full||"")+"' data-audio-file='"+safe(w.audioFile||w.audio||"")+"' data-audio-category='"+safe(w.category||"")+"' data-audio-group='"+safe(groupOf(w))+"'"}
  function wordFromButton(btn){return{id:btn.dataset.audioId||"",word:btn.dataset.audioWord||"",full:btn.dataset.audioFull||"",audioFile:btn.dataset.audioFile||"",category:btn.dataset.audioCategory||"",group:btn.dataset.audioGroup||""}}
  function playButton(btn,slow,statusId){const w=wordFromButton(btn);return play(w,!!slow,statusId||"audioStatus",w.full||w.word)}

  function buttons(w,statusId){
    if(!has(w))return "";
    const sid=safe(statusId||"audioStatus"),data=dataFor(w);
    return '<div class="actions l4t2-audio-actions"><button type="button" class="btn"'+data+' onclick="event.stopPropagation();L4T2Audio.playButton(this,false,\''+sid+'\')">🔊 Hören</button><button type="button" class="btn secondary"'+data+' onclick="event.stopPropagation();L4T2Audio.playButton(this,true,\''+sid+'\')">Langsam</button></div>';
  }

  function iconButton(w,statusId){
    if(!has(w))return "";
    const sid=safe(statusId||"audioStatus"),data=dataFor(w);
    return '<button type="button" class="l4t2-audio-icon"'+data+' aria-label="Wort anhören" title="Wort anhören" onclick="event.stopPropagation();L4T2Audio.playButton(this,false,\''+sid+'\')">🔊</button>';
  }

  if(!document.getElementById("l4t2-audio-style")){
    const style=document.createElement("style");style.id="l4t2-audio-style";
    style.textContent=".audio-status{min-height:24px;margin:8px 0;text-align:center;font-weight:800;color:#7a5100}.audio-status.error{color:#9b1c1c}.l4t2-audio-actions{margin:10px 0}.l4t2-audio-icon{display:inline-flex;align-items:center;justify-content:center;margin-left:6px;padding:4px 7px;border:1px solid #e4bd20;border-radius:9px;background:#fff8cf;cursor:pointer;font-size:16px;line-height:1;touch-action:manipulation}.l4t2-audio-icon:hover{background:#ffef9a}";document.head.appendChild(style);
  }

  window.L4T2Audio={has:has,candidates:candidates,play:play,playButton:playButton,buttons:buttons,iconButton:iconButton,stop:stop};
})();