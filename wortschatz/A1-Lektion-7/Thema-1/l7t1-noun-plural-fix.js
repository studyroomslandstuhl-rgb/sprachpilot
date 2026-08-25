(function(){
'use strict';
if(window.__SP_L7T1_NOUN_PLURAL_FIX_2)return;
window.__SP_L7T1_NOUN_PLURAL_FIX_2=true;

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
function firstValue(...values){
 for(const value of values){
  if(value!==undefined&&value!==null&&String(value).trim())return String(value).trim();
 }
 return'';
}
function singularOf(item){
 const direct=firstValue(item?.singularAnswer,item?.singular,item?.full,item?.word,item?.answer,item?.term).split('|')[0].trim();
 const article=String(item?.article||'').trim();
 if(article&&direct&&!/^(der|die|das)\s/i.test(direct))return`${article} ${direct}`.trim();
 return direct;
}
function pluralOf(item){
 return firstValue(item?.pluralAnswer,item?.plural,item?.pluralForm,item?.forms?.plural,item?.pluralWord);
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cardsTask=theme.tasks.find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''));
 const articleTask=theme.tasks.find(task=>task?.id==='artikel-plural');
 if(!cardsTask||!Array.isArray(cardsTask.items)||!articleTask||!Array.isArray(articleTask.items))return theme;

 const nounCards=cardsTask.items.filter(isNounCard);
 const nounMap=new Map(nounCards.map(card=>[normalize(fullWord(card)),card]).filter(([key])=>key));

 articleTask.items=articleTask.items.filter(item=>{
  const sourceSingular=singularOf(item);
  const card=nounMap.get(normalize(sourceSingular));
  if(!card)return false;
  const singular=fullWord(card)||sourceSingular;
  const plural=firstValue(pluralOf(item),pluralOf(card));
  item.singularAnswer=singular;
  if(plural)item.pluralAnswer=plural;
  return true;
 });
 articleTask.kind='noun-plural';
 articleTask.title='Artikel und Plural';
 articleTask.description='Schreibe das Nomen mit Artikel und Plural.';
 theme.nounPluralFixRevision='l7t1-noun-plural-only-2026-08-25-v2';
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
