(function(){
  const BASE_COLOR_IDS=new Set(['rot','blau','gruen','gelb','orange','weiss','schwarz','grau','braun','rosa','lila','tuerkis']);
  const ADJECTIVE_IDS=new Set(['schoen','haesslich','hell','dunkel','gross','klein','breit','schmal','teuer','billig','neu','alt','modern','altmodisch','sauber','schmutzig','bequem','unbequem']);
  const REACTION_IDS=new Set(['sehr-gut','gut','ganz-gut','es-geht','nicht-so-gut']);
  const UPLOADED_IDS=new Set([...BASE_COLOR_IDS,...ADJECTIVE_IDS,...REACTION_IDS]);
  const originalSpeak=typeof window.speak==='function'?window.speak.bind(window):null;

  function normalize(value){return String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.!?]/g,'').replace(/\s+/g,' ')}
  function allItems(){
    const colors=typeof COLORS!=='undefined'&&Array.isArray(COLORS)?COLORS:[];
    const adjectives=typeof ADJECTIVES!=='undefined'&&Array.isArray(ADJECTIVES)?ADJECTIVES:[];
    const reactions=typeof REACTIONS!=='undefined'&&Array.isArray(REACTIONS)?REACTIONS:[];
    return [...colors,...adjectives,...reactions];
  }
  function itemById(id){return allItems().find(item=>item&&item.id===id)||null}
  function itemByWord(word){const target=normalize(word);return allItems().find(item=>normalize(item&&item.word)===target)||null}
  function isUploaded(item){return !!(item&&UPLOADED_IDS.has(item.id))}
  function fallbackSpeak(text,slow){if(originalSpeak)return originalSpeak(text,!!slow);return false}
  function playItem(item,slow=false,statusId='audioStatus'){
    if(!item)return false;
    const text=item.word||item.full||'';
    if(isUploaded(item)&&window.L4T2Audio)return L4T2Audio.play(item,!!slow,statusId,text);
    return fallbackSpeak(text,slow);
  }
  function playId(id,slow=false,statusId='audioStatus'){return playItem(itemById(id),slow,statusId)}
  function playWord(word,slow=false,statusId='audioStatus'){const item=itemByWord(word);if(item)return playItem(item,slow,statusId);return fallbackSpeak(word,slow)}
  function stop(){if(window.L4T2Audio)L4T2Audio.stop();else try{speechSynthesis.cancel()}catch(e){}}
  function buttons(item,statusId='audioStatus'){
    if(!item)return '';
    const id=String(item.id||'').replace(/'/g,"\\'"),sid=String(statusId||'audioStatus').replace(/'/g,"\\'");
    return `<div class="actions l4t3-audio-actions"><button type="button" class="btn" onclick="event.stopPropagation();L4T3Audio.playId('${id}',false,'${sid}')">🔊 Hören</button><button type="button" class="btn secondary" onclick="event.stopPropagation();L4T3Audio.playId('${id}',true,'${sid}')">Langsam</button></div>`;
  }
  function icon(item,statusId='audioStatus'){
    if(!item)return '';
    const id=String(item.id||'').replace(/'/g,"\\'"),sid=String(statusId||'audioStatus').replace(/'/g,"\\'");
    return `<button type="button" class="l4t3-audio-icon" aria-label="Anhören" title="Anhören" onclick="event.preventDefault();event.stopPropagation();L4T3Audio.playId('${id}',false,'${sid}')">🔊</button>`;
  }
  window.speak=function(text,slow=false){const item=itemByWord(text);if(item&&isUploaded(item))return playItem(item,slow,'audioStatus');return fallbackSpeak(text,slow)};
  if(!document.getElementById('l4t3-audio-style')){
    const style=document.createElement('style');style.id='l4t3-audio-style';style.textContent='.l4t3-audio-actions{margin:10px 0;justify-content:center}.l4t3-audio-icon{display:inline-flex;align-items:center;justify-content:center;margin-left:6px;padding:4px 7px;border:1px solid #e4bd20;border-radius:9px;background:#fff8cf;cursor:pointer;font-size:16px;line-height:1}.l4t3-audio-icon:hover{background:#ffef9a}.audio-status{min-height:24px;margin:8px 0;text-align:center;font-weight:800;color:#7a5100}.audio-status.error{color:#9b1c1c}';document.head.appendChild(style);
  }
  window.L4T3Audio={baseColorIds:[...BASE_COLOR_IDS],uploadedIds:[...UPLOADED_IDS],itemById,itemByWord,isUploaded,playItem,playId,playWord,buttons,icon,stop};
})();
