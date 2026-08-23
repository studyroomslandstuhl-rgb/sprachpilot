(function(){
'use strict';
if(window.__SP_L7T4_CARD_IMAGE_SYNC_V1)return;
window.__SP_L7T4_CARD_IMAGE_SYNC_V1=true;

function norm(value){
 return String(value||'')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/ß/g,'ss')
  .replace(/^(der|die|das)\s+/,'')
  .replace(/[„“”"'`´.,!?;:()\/…|]+/g,' ')
  .replace(/\s+/g,' ')
  .trim();
}

function cardKeys(card){
 return [card?.word,card?.full,card?.term,card?.front,card?.label]
  .filter(Boolean)
  .map(norm)
  .filter(Boolean);
}

function exactCardMap(cards){
 const map=new Map();
 for(const card of cards||[]){
  for(const key of cardKeys(card)){
   if(!map.has(key))map.set(key,card);
  }
 }
 return map;
}

function singularFromCard(card,key){
 const values=[card?.full,card?.word,card?.term,card?.front,card?.label].filter(Boolean);
 return values.find(value=>/^(der|die|das)\s+/i.test(String(value).trim())&&norm(value)===key)||'';
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cards=theme.tasks.find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''));
 if(!cards||!Array.isArray(cards.items))return theme;
 const byWord=exactCardMap(cards.items);

 const article=theme.tasks.find(task=>task?.id==='artikel');
 if(article&&Array.isArray(article.items)){
  article.items.forEach(item=>{
   const key=norm(item?.word||item?.singular||'');
   const card=byWord.get(key);
   if(!card)return;
   const image=String(card.image||card.img||'').trim();
   if(image)item.image=image;
   const singular=singularFromCard(card,key);
   if(singular)item.singular=singular;
   if(card.plural)item.plural=card.plural;
   item.answer=`${item.singular} | ${item.plural}`;
  });
 }

 const imageAudio=theme.tasks.find(task=>task?.id==='bild-hoeren');
 if(imageAudio&&Array.isArray(imageAudio.items)){
  imageAudio.items.forEach(item=>{
   const card=byWord.get(norm(item?.answer||item?.word||''));
   const image=String(card?.image||card?.img||'').trim();
   if(image)item.image=image;
  });
 }

 theme.cardImageSyncRevision='l7t4-card-image-sync-20260823-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
