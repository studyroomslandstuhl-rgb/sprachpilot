(function(){
'use strict';
if(window.__SP_L7T1_NOUN_PLURAL_FIX_1)return;
window.__SP_L7T1_NOUN_PLURAL_FIX_1=true;

function normalize(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ');
}
function fullWord(item){
 const direct=String(item?.full||item?.word||item?.answer||item?.term||'').trim();
 const article=String(item?.article||'').trim();
 if(article&&!/^(der|die|das)\s/i.test(direct))return `${article} ${direct}`.trim();
 return direct;
}
function explicitWordType(item){
 return String(item?.category||item?.wordType||item?.partOfSpeech||item?.pos||item?.type||'').trim().toLowerCase();
}
function isNounCard(item){
 const type=explicitWordType(item);
 if(/(^|\b)(verb|verben)(\b|$)/i.test(type))return false;
 if(/(^|\b)(noun|nomen|substantiv)(\b|$)/i.test(type))return true;
 return /^(der|die|das)\s+\S+/i.test(fullWord(item));
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cardsTask=theme.tasks.find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''));
 const articleTask=theme.tasks.find(task=>task?.id==='artikel-plural');
 if(!cardsTask||!Array.isArray(cardsTask.items)||!articleTask||!Array.isArray(articleTask.items))return theme;

 const allowedNouns=new Set(
  cardsTask.items
   .filter(isNounCard)
   .map(item=>normalize(fullWord(item)))
   .filter(Boolean)
 );

 articleTask.items=articleTask.items.filter(item=>{
  const singular=String(item?.singularAnswer||item?.word||item?.full||item?.answer||'').split('|')[0].trim();
  return allowedNouns.has(normalize(singular));
 });
 articleTask.kind='noun-plural';
 articleTask.title='Artikel und Plural';
 articleTask.description='Schreibe das Nomen mit Artikel und Plural.';
 theme.nounPluralFixRevision='l7t1-noun-plural-only-2026-08-25-v1';
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
