(function(){
'use strict';
if(window.__SP_L7T4_CARD_MATCH_V1)return;
window.__SP_L7T4_CARD_MATCH_V1=true;
function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[„“”"'`´.,!?;:()\/…]+/g,' ').replace(/\s+/g,' ').trim()}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const data=window.L7T4CardContent?.data||{};
 const lookup=new Map(Object.entries(data).map(([key,value])=>[norm(key),value]));
 const cards=(theme?.tasks||[]).find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''));
 if(!cards)return theme;
 (cards.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  const candidates=[item.full,item.word,item.answer,item.term,item.prompt,item.label,item.front].filter(Boolean).map(norm);
  const entry=candidates.map(key=>lookup.get(key)).find(Boolean);if(!entry)return;
  item.kind='cards';item.type=entry.type;item.category=entry.type;item.translations={...(item.translations&&typeof item.translations==='object'?item.translations:{}),...entry.tr};
  if(entry.plural&&!item.plural)item.plural=entry.plural;
  if(entry.example&&!item.example)item.example=entry.example;
 });
 return theme;
});
})();
