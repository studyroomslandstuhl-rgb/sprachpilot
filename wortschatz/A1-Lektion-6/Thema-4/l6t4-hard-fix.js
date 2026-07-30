(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;

const normalize=value=>String(value??'')
 .trim()
 .toLowerCase()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'')
 .replace(/ß/g,'ss')
 .replace(/[.,!?;:“”"'…]/g,'')
 .replace(/\s+/g,' ');

/* „Ich glaube“ ausdrücklich mit und ohne Satzzeichen bzw. Auslassungspunkte akzeptieren. */
const cards=(data.tasks||[]).find(task=>task?.id==='cards'||task?.kind==='cards');
if(cards&&Array.isArray(cards.items)){
 const item=cards.items.find(entry=>normalize(entry?.word)==='ich glaube');
 if(item){
  item.answer='Ich glaube';
  item.answers=[...new Set([...(item.answers||[]),'Ich glaube','Ich glaube.','Ich glaube …','Ich glaube...','ich glaube'])];
 }
}

/* Dieselben Varianten auch in allen anderen geführten Aufgaben zulassen. */
(data.tasks||[]).forEach(task=>(task.items||[]).forEach(item=>{
 const candidates=[item?.answer,item?.word,...(item?.answers||[])];
 if(candidates.some(value=>normalize(value)==='ich glaube')){
  item.answers=[...new Set([...(item.answers||[]),'Ich glaube','Ich glaube.','Ich glaube …','Ich glaube...','ich glaube'])];
 }
}));

/* Robuste Vergleichsfunktion. */
window.l6t4Exact=function(value,solutions){
 const input=normalize(value);
 const list=Array.isArray(solutions)?solutions:[solutions];
 if(input==='ich glaube'&&list.some(solution=>normalize(solution)==='ich glaube'))return true;
 return list.some(solution=>normalize(solution)===input);
};

/* Bunny-Audios liegen im Audio-Ordner, nicht direkt im Hauptverzeichnis. */
const CDN='https://sprachpilot.b-cdn.net/';
function encodePath(path){
 return String(path||'').split('/').filter(Boolean).map(part=>encodeURIComponent(decodeURIComponent(part))).join('/');
}
function audioCandidates(file){
 const raw=String(file||'').trim();
 if(!raw)return[];
 if(/^https?:\/\//i.test(raw))return[raw];
 const clean=raw.replace(/^\/+/, '').replace(/^(?:audio\/)+/i,'');
 const paths=[
  `Audio/${clean}`,
  `audio/${clean}`,
  `Audio/L6T4/${clean}`,
  `audio/L6T4/${clean}`,
  clean
 ];
 return [...new Set(paths)].map(path=>CDN+encodePath(path));
}

/* Alle .mp3-Verweise zentral auf Bunny Audio umleiten. */
const originalBunnyUrl=window.L6T4Bunny?.url?.bind(window.L6T4Bunny);
if(window.L6T4Bunny&&originalBunnyUrl){
 window.L6T4Bunny.url=function(file){
  if(/\.mp3(?:$|[?#])/i.test(String(file||''))){
   return audioCandidates(file)[0]||originalBunnyUrl(file);
  }
  return originalBunnyUrl(file);
 };
}

/* Falls die Groß-/Kleinschreibung des Bunny-Ordners abweicht, automatisch weiterschalten. */
document.addEventListener('error',event=>{
 const audio=event.target;
 if(!(audio instanceof HTMLMediaElement)||audio.tagName!=='AUDIO')return;
 const file=audio.dataset.bunnyAudio||audio.getAttribute('data-bunny-audio')||'';
 const urls=audioCandidates(file);
 if(urls.length<2)return;
 const current=String(audio.currentSrc||audio.src||'');
 let index=urls.findIndex(url=>url===current);
 if(index<0)index=Number(audio.dataset.bunnyAudioAttempt||0);
 const next=index+1;
 if(next>=urls.length)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 audio.dataset.bunnyAudioAttempt=String(next);
 audio.hidden=false;
 const errorBox=audio.nextElementSibling;
 if(errorBox)errorBox.hidden=true;
 audio.src=urls[next];
 audio.load();
},true);

/* Veraltete Medienfelder niemals innerhalb der Prüfung anzeigen. */
function clean(){
 if(new URLSearchParams(location.search).get('task')!=='exam')return;
 document.querySelectorAll('audio,.audio-file-panel,.audio-panel,.audio-load-error,.image-fallback').forEach(node=>node.remove());
}
clean();
new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});
})();