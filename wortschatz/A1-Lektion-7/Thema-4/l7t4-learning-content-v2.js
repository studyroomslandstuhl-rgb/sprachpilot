(function(){
'use strict';
if(window.__SP_L7T4_LEARNING_CONTENT_V2)return;window.__SP_L7T4_LEARNING_CONTENT_V2=true;
const clean=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
const byId=(theme,id)=>(theme.tasks||[]).find(t=>t?.id===id);
const put=(answer,wrong1,wrong2,pos)=>{const a=[wrong1,wrong2];a.splice(Math.max(0,Math.min(2,pos)),0,answer);return a};
const meanings=[
 ['das Mädchen','kleine Frau','kleiner Mann','eine Gruppe von Kindern in der Schule'],
 ['der Junge','kleiner Mann','kleine Frau','eine kurze Reise'],
 ['die Klasse','Gruppe von Kindern in der Schule','ein Ort, wo man schwimmen kann','Preis für ein Ticket'],
 ['das Schwimmbad','ein Ort, wo man schwimmen kann','ein Ort, wo man lernt','eine kurze Reise'],
 ['der Eintritt','Preis für ein Ticket','anfangen zu fahren','Informationen geben'],
 ['die Grundschule','Schule für die 1. bis 4. Klasse','ein Ort, wo man schwimmen kann','eine Gruppe von Erwachsenen im Deutschkurs'],
 ['der Unterricht','Lernen in der Gruppe mit dem Lehrer oder der Lehrerin, zum Beispiel Mathematikunterricht, Englischunterricht oder Deutschunterricht','eine kurze Reise','Preis für ein Ticket'],
 ['die Leitung','der Chef oder in der Schule der Schuldirektor','eine Person, die hilft, wenn man krank ist (Mann)','eine Gruppe von Kindern in der Schule'],
 ['die Schule','ein Ort, wo man lernt','ein Ort, wo man schwimmen kann','Preis für ein Ticket'],
 ['der Arzt','eine Person, die hilft, wenn man krank ist (Mann)','eine Person, die hilft, wenn man krank ist (Frau)','der Chef in der Schule'],
 ['die Ärztin','eine Person, die hilft, wenn man krank ist (Frau)','eine Person, die hilft, wenn man krank ist (Mann)','eine kleine Frau'],
 ['der Ausflug','eine kurze Reise','Lernen in der Gruppe','Preis für ein Ticket'],
 ['losfahren','anfangen zu fahren','für kurze Zeit weggehen und dann wiederkommen','zusammengehen'],
 ['zurückkommen','für kurze Zeit weggehen und dann wiederkommen','anfangen zu fahren','nicht da sein'],
 ['mitkommen','zusammengehen','nicht da sein','Informationen geben'],
 ['fehlen','nicht da sein','sich nicht gut fühlen','zusammengehen'],
 ['krank','sich nicht gut fühlen','nicht da sein','anfangen zu fahren'],
 ['Bescheid sagen','Informationen geben','zusammengehen','eine kurze Reise machen'],
 ['Gute Besserung!','Man wünscht einer Person, dass sie gesund wird.','Man sagt, dass etwas Schlechtes passiert ist.','Man gibt Informationen.'],
 ['schade','Wenn etwas Schlechtes passiert und man traurig ist.','Wenn man anfängt zu fahren.','Wenn man zusammengeht.']
];
const nounArticles={
 'madchen':'das Mädchen','junge':'der Junge','klasse':'die Klasse','schwimmbad':'das Schwimmbad','eintritt':'der Eintritt','grundschule':'die Grundschule','unterricht':'der Unterricht','leitung':'die Leitung','schule':'die Schule','arzt':'der Arzt','arztin':'die Ärztin','ausflug':'der Ausflug'
};
function nounKey(value){return clean(value).replace(/^(der|die|das)\s+/,'').replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u')}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const meaningTask=byId(theme,'wort-bedeutung');
 if(meaningTask){
  meaningTask.items=meanings.map(([term,answer,w1,w2],i)=>({prompt:`Was bedeutet „${term}“?`,options:put(answer,w1,w2,[1,2,0][i%3]),answer,preserveOrder:true}));
 }
 const dictation=byId(theme,'hoerdiktat');
 if(dictation){
  dictation.items=(dictation.items||[]).map(item=>{
   const key=nounKey(item.answer||item.word||'');const full=nounArticles[key];
   if(!full)return item;
   return {...item,answer:full,answers:[full],requiresArticle:true}
  });
  dictation.description='Höre und schreibe das Wort mit Artikel.';
  dictation.instruction='Höre das Wort und schreibe Nomen immer mit Artikel.';
 }
 const imageAudio=byId(theme,'bild-hoeren');
 if(imageAudio){
  const seen=new Set();
  imageAudio.items=(imageAudio.items||[]).filter(item=>{const key=String(item.image||'').trim().toLowerCase();if(!key||seen.has(key))return false;seen.add(key);return true}).map((item,i)=>{
   const opts=[...(item.options||[])],correctIndex=opts.findIndex(o=>clean(o?.value)===clean(item.answer));
   if(correctIndex>=0){const correct=opts.splice(correctIndex,1)[0],target=[1,2,3,0][i%4];opts.splice(Math.min(target,opts.length),0,correct)}
   return {...item,options:opts,preserveOrder:true}
  });
 }
 theme.contentRevision='l7t4-learning-content-v2-20260822';window.L7_THEME=theme;return theme
});
})();