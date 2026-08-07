(function(){
'use strict';

const BUNNY='https://sprachpilot.b-cdn.net/';
const TASK_ICONS={
  'cards':'Aa',
  'meaning-to-verb':'B→V',
  'verb-to-meaning':'V→B',
  'listen':'🔊',
  'image-to-verb':'▣',
  'verb-to-image':'V→▣',
  'read-sentence':'📖',
  'verb-type':'↔',
  'change':'↔',
  'choose-form':'du',
  'write-form':'✎',
  'speak-form':'🎙',
  'speak':'🎙',
  'sentence':'…',
  'exam':'★'
};

function fileKey(value){
 return String(value||'').trim().toLowerCase()
  .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/^sich\s+/,'sich_')
  .replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
}

function srcKey(img){
 try{
  const u=new URL(img.getAttribute('src')||img.src,location.href);
  return decodeURIComponent((u.pathname.split('/').pop()||'').replace(/\.webp$/i,''));
 }catch{return''}
}

function standardUrl(key){
 key=fileKey(key);
 return key?BUNNY+encodeURIComponent(key)+'.webp':'';
}

function germanResolver(key){
 try{
  if(typeof window.SP_VERB_IMAGE_OVERRIDE==='function'){
   const url=window.SP_VERB_IMAGE_OVERRIDE(key);
   if(url)return url;
  }
 }catch(e){}
 return standardUrl(key);
}

function repairImage(img){
 if(!(img instanceof HTMLImageElement))return;
 const key=img.dataset.fiImageKey||srcKey(img);
 if(!key)return;
 img.dataset.fiImageKey=key;

 const preferred=germanResolver(key);
 if(preferred && img.src!==preferred && img.dataset.fiPreferred!=='1'){
  img.dataset.fiPreferred='1';
  img.hidden=false;
  img.style.visibility='visible';
  img.src=preferred;
 }
}

// Bildfehler früh abfangen, damit das Inline-onerror der alten Seite das Bild nicht sofort versteckt.
window.addEventListener('error',event=>{
 const img=event.target;
 if(!(img instanceof HTMLImageElement))return;
 if(!img.closest('.verb-image,.overview-verb-card,.flip-card'))return;

 const key=img.dataset.fiImageKey||srcKey(img);
 if(!key)return;
 img.dataset.fiImageKey=key;

 // Erst exakt dieselbe Auflösung wie Deutsch, danach der bekannte Neu-Ordner als Fallback.
 if(img.dataset.fiTriedGerman!=='1'){
  img.dataset.fiTriedGerman='1';
  const preferred=germanResolver(key);
  if(preferred && img.src!==preferred){
   event.stopImmediatePropagation();
   img.hidden=false;
   img.style.visibility='visible';
   img.src=preferred;
   return;
  }
 }
 if(img.dataset.fiTriedNeu!=='1'){
  img.dataset.fiTriedNeu='1';
  event.stopImmediatePropagation();
  img.hidden=false;
  img.style.visibility='visible';
  img.src=BUNNY+'Neu/'+encodeURIComponent(fileKey(key))+'.webp';
 }
},true);

function unlockLearningTasks(root=document){
 root.querySelectorAll('.task-card[data-task]').forEach(btn=>{
  const task=btn.dataset.task||'';
  if(task==='exam')return; // Prüfung bleibt wie in Deutsch bis alle Lernaufgaben fertig sind.
  btn.disabled=false;
  btn.removeAttribute('disabled');
  btn.classList.remove('locked-task');
  const icon=btn.querySelector('.task-icon');
  if(icon && icon.textContent.trim()==='🔒')icon.textContent=TASK_ICONS[task]||'•';
  const status=btn.querySelector('.task-status');
  if(status && status.textContent.trim()==='Gesperrt')status.textContent='Starten';
 });
}

function repair(root=document){
 root.querySelectorAll('img[src]').forEach(repairImage);
 unlockLearningTasks(root);
}

const observer=new MutationObserver(records=>{
 for(const record of records){
  for(const node of record.addedNodes||[]){
   if(!(node instanceof Element))continue;
   if(node.matches('img[src]'))repairImage(node);
   node.querySelectorAll?.('img[src]').forEach(repairImage);
   if(node.matches('.task-card[data-task]') || node.querySelector?.('.task-card[data-task]'))unlockLearningTasks(node.closest('main')||node);
  }
 }
});

function init(){
 repair();
 observer.observe(document.documentElement,{subtree:true,childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
