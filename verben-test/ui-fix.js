(function(){
  'use strict';

  var TASK_EMOJI={
    'karteikarten':'🔄',
    'bild-verb':'🖼️',
    'verb-bild':'🧩',
    'hoeren-schreiben':'🎧',
    'schreiben':'✍️',
    'satz-bauen':'🧱',
    'konjugieren':'🔤'
  };
  var NEU_BASE='https://sprachpilot.b-cdn.net/Neu/';
  var NEU_IMAGE_MAP={
    'klopfen':'klopfen.webp',
    'riechen':'riechen.webp',
    'stinken':'stinken.webp',
    'schauen':'schauen.webp',
    'gucken':'gucken.webp',
    'wuerfeln':'wuerfeln.webp',
    'wuerfeln':'wuerfeln.webp',
    'wandern':'wandern.webp',
    'schweigen':'schweigen.webp',
    'vernichten':'vernichten.webp',
    'erleben':'erleben.webp'
  };

  function imageSlug(value){
    return String(value||'')
      .trim()
      .toLowerCase()
      .replace(/ä/g,'ae')
      .replace(/ö/g,'oe')
      .replace(/ü/g,'ue')
      .replace(/ß/g,'ss')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'_')
      .replace(/^_|_$/g,'');
  }

  function wantedImageUrl(alt){
    var key=imageSlug(alt);
    if(NEU_IMAGE_MAP[key])return NEU_BASE+NEU_IMAGE_MAP[key];
    return 'https://sprachpilot.b-cdn.net/'+encodeURIComponent(key+'.webp');
  }

  function fixBunnyImage(img){
    if(!img||!img.alt||img.dataset.spBunnyFixed==='1')return;
    try{
      var url=new URL(img.currentSrc||img.src,location.href);
      if(url.hostname!=='sprachpilot.b-cdn.net')return;
      var wanted=wantedImageUrl(img.alt);
      if(!wanted||url.href===wanted)return;
      img.dataset.spBunnyFixed='1';
      img.src=wanted;
    }catch(e){}
  }

  function removeActionButtons(){
    document.querySelectorAll('.nav a').forEach(function(link){
      if(link.textContent.trim()==='Aufgabenübersicht')link.remove();
    });
    document.querySelectorAll('main .task-head a').forEach(function(link){
      var text=link.textContent.trim();
      if(text==='Übersicht'||text==='Aufgabenübersicht')link.remove();
    });
  }

  function applyTaskEmojis(){
    document.querySelectorAll('a.module[data-task]').forEach(function(card){
      var icon=card.querySelector('.icon');
      var emoji=TASK_EMOJI[card.dataset.task];
      if(icon&&emoji)icon.textContent=emoji;
    });
  }

  function cleanup(){
    removeActionButtons();
    applyTaskEmojis();
    document.querySelectorAll('img').forEach(fixBunnyImage);
  }

  document.addEventListener('error',function(event){
    if(event.target&&event.target.tagName==='IMG')fixBunnyImage(event.target);
  },true);

  new MutationObserver(cleanup).observe(document.documentElement,{childList:true,subtree:true});
  cleanup();
})();