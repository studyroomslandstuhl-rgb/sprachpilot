(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data||!Array.isArray(data.tasks))return;

const simple=value=>String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'…]/g,'').replace(/\s+/g,' ');
const cards=data.tasks.find(task=>task.id==='cards'||task.kind==='cards');
if(!cards||!Array.isArray(cards.items))return;

/* Die Karteikarten sind die einzige Wortquelle für die Übersicht. */
const canonicalItems=[];
cards.items.forEach(item=>{
 const word=String(item?.word||item?.answer||'').trim();
 if(!word||canonicalItems.some(entry=>simple(entry.word||entry.answer)===simple(word)))return;
 canonicalItems.push(item);
});
cards.items=canonicalItems;
data.vocabulary=canonicalItems;

const originalGroups=Array.isArray(data.overviewGroups)?data.overviewGroups:[];
const originalCategory=new Map();
originalGroups.forEach(group=>(group.words||[]).forEach(word=>originalCategory.set(simple(word),{title:group.title,icon:group.icon})));

const nounPattern=/^(der|die|das)\s+/i;
const activityWords=new Set(['tanzen','wandern','schwimmen','gitarre spielen','freunde treffen','fahrrad fahren','stricken','grillen','im internet surfen','gucken','würfeln','dabeihaben','glauben']);
const timeWords=new Set(['immer','oft','manchmal','selten','nie','gleich','schon','noch','nächste woche','nächstes wochenende','nächsten samstag']);
const phraseWords=new Set(['ich glaube','stimmt','oh wie dumm','na klar','auf jeden fall','leider','vielleicht','moment mal','guck mal','sag mal','kein problem','ich weiss es nicht','es gibt','es macht spass']);

function category(word){
 const key=simple(word);
 const existing=originalCategory.get(key);
 if(existing)return existing;
 if(nounPattern.test(word))return{title:'Nomen',icon:'📚'};
 if(activityWords.has(key))return{title:'Aktivitäten',icon:'🏃'};
 if(timeWords.has(key))return{title:'Häufigkeit und Zeit',icon:'🕒'};
 if(phraseWords.has(key)||/[.!…]$/.test(word))return{title:'Redemittel',icon:'💬'};
 return{title:'Weitere Wörter',icon:'📝'};
}

const groups=[];
canonicalItems.forEach(item=>{
 const word=String(item.word||item.answer||'').trim();
 const info=category(word);
 let group=groups.find(entry=>entry.title===info.title);
 if(!group){group={title:info.title,icon:info.icon,words:[]};groups.push(group)}
 group.words.push(word);
});

const order=['Aktivitäten','Nomen','Häufigkeit und Zeit','Redemittel','Weitere Wörter'];
groups.sort((a,b)=>order.indexOf(a.title)-order.indexOf(b.title));
data.overviewGroups=groups;
window.L6T4_CARD_OVERVIEW_WORDS=canonicalItems.map(item=>item.word||item.answer).filter(Boolean);
})();