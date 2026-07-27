(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;
const removed=new Set(['nächste woche','nächstes wochenende','nächsten samstag']);
const clean=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.…!?,;:„“"']/g,'').replace(/\s+/g,' ');
const isRemoved=value=>removed.has(clean(value));
data.vocabulary=(data.vocabulary||[]).filter(item=>!isRemoved(item.word)&&!isRemoved(item.id));
const cards=(data.tasks||[]).find(item=>item.id==='cards');
if(cards)cards.items=(cards.items||[]).filter(item=>!isRemoved(item.word)&&!isRemoved(item.id));
(data.overviewGroups||[]).forEach(group=>{group.words=(group.words||[]).filter(word=>!isRemoved(word))});
data.imageItems=(data.imageItems||[]).filter(item=>!isRemoved(item.word));
if(data.imageFile&&typeof data.imageFile==='object')Object.keys(data.imageFile).forEach(word=>{if(isRemoved(word))delete data.imageFile[word]});
})();
