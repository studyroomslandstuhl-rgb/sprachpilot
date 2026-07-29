(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data||!Array.isArray(data.tasks))return;
const simple=value=>String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'…]/g,'').replace(/\s+/g,' ');
const cards=data.tasks.find(task=>task.id==='cards'||task.kind==='cards');
if(!cards||!Array.isArray(cards.items))return;
const cardWords=[];
cards.items.forEach(item=>{const word=String(item?.word||item?.answer||'').trim();if(word&&!cardWords.some(value=>simple(value)===simple(word)))cardWords.push(word)});
const groups=Array.isArray(data.overviewGroups)?data.overviewGroups:[];
const existing=new Set(groups.flatMap(group=>group.words||[]).map(simple));
const missing=cardWords.filter(word=>!existing.has(simple(word)));
if(missing.length)groups.push({title:'Weitere Karteikarten',icon:'🃏',words:missing});
data.overviewGroups=groups;
window.L6T4_CARD_OVERVIEW_WORDS=cardWords;
})();