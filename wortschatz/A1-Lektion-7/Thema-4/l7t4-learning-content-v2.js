(function(){
'use strict';
if(window.__SP_L7T4_LEARNING_CONTENT_V3)return;window.__SP_L7T4_LEARNING_CONTENT_V3=true;
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
const byId=(theme,id)=>(theme.tasks||[]).find(t=>t?.id===id);
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;

 // Das Hördiktat prüft genau das Wort, das im Audio zu hören ist. Ein nicht gesprochenes
 // Nomen-Artikelwort darf nicht zusätzlich verlangt werden.
 const dictation=byId(theme,'hoerdiktat');
 if(dictation){
  dictation.title='Hördiktat';
  dictation.description='Höre und schreibe das Wort.';
  dictation.instruction='Höre das Wort und schreibe es.';
  dictation.items=(dictation.items||[]).map(item=>{
   const original=String((Array.isArray(item.answers)&&item.answers[0])||item.word||item.answer||'').trim();
   const withoutArticle=original.replace(/^(der|die|das)\s+/i,'').trim();
   const heard=withoutArticle||original;
   return {...item,answer:heard,answers:[heard],requiresArticle:false};
  });
 }

 // Vier Hörvarianten pro Bild, jedes Bild nur einmal. Die eigentliche Verteilung der
 // richtigen Positionen übernimmt anschließend l7t4-answer-mix.js projektkonform.
 const imageAudio=byId(theme,'bild-hoeren');
 if(imageAudio){
  const seen=new Set();
  imageAudio.items=(imageAudio.items||[]).filter(item=>{
   const key=clean(item.image||'');if(!key||seen.has(key))return false;seen.add(key);return true;
  });
 }

 // Die hochwertigen Bedeutungsdefinitionen aus l7t4-user-rebuild.js bleiben unverändert.
 theme.contentRevision='l7t4-learning-content-v3-20260822';window.L7_THEME=theme;return theme;
});
})();
