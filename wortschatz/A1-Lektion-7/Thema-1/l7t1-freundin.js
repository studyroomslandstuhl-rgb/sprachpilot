(function(){
'use strict';
if(window.__SP_L7T1_FREUNDIN_1)return;window.__SP_L7T1_FREUNDIN_1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const FRIENDIN={
 word:'die Freundin',full:'die Freundin',answer:'die Freundin',answers:['die Freundin','Freundin'],
 article:'die',category:'noun',type:'noun',plural:'die Freundinnen',image:'freundin.webp',audio:'freundin',
 meaning:'female friend',
 translations:{en:'female friend',ru:'подруга',tr:'kız arkadaş / kadın arkadaş',uk:'подруга',ar:'صديقة',ja:'女友達',ro:'prietenă',pl:'przyjaciółka',ku:'hevala jin'},
 example:'Ich treffe meine Freundin.'
};
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ');
const has=(items,predicate)=>Array.isArray(items)&&items.some(predicate);

function addCard(task){
 if(!task)return;
 task.items=Array.isArray(task.items)?task.items:[];
 if(!has(task.items,item=>norm(item?.full||item?.word||item?.term||item?.answer)==='die freundin'))task.items.push({...FRIENDIN});
}
function addArticlePlural(task){
 if(!task)return;
 task.items=Array.isArray(task.items)?task.items:[];
 if(!has(task.items,item=>norm(item?.prompt||'').includes('freundin'))){
  task.items.push({
   prompt:'Freundin: Schreibe den Singular und den Plural mit Artikel.',
   context:'Beispiel: Buch → das Buch – die Bücher',
   answer:'die Freundin – die Freundinnen',
   answers:['die Freundin – die Freundinnen','die Freundin, die Freundinnen','die Freundin; die Freundinnen','die Freundin die Freundinnen'],
   hint:'Beginne mit „die Freundin“',image:'freundin.webp'
  });
 }
}
function addMeaning(task){
 if(!task)return;
 task.items=Array.isArray(task.items)?task.items:[];
 if(!has(task.items,item=>norm(item?.answer)==='die freundin')){
  task.items.push({
   answer:'die Freundin',prompt:'eine weibliche Person, mit der man befreundet ist',
   options:['der Freund','die Freundin','die Ärztin','die Schule'],image:'freundin.webp',
   hint:'Das gesuchte Wort beginnt mit „F“. '
  });
 }
}
function addCombination(task){
 if(!task)return;
 task.items=Array.isArray(task.items)?task.items:[];
 if(!has(task.items,item=>norm(item?.prompt||'').startsWith('freundin'))){
  task.items.push({prompt:'Freundin …',context:'Welches Verb passt?',answer:'treffen',options:['treffen','spielen','fahren','backen'],hint:'Die richtige Verbindung lautet: Freundin treffen.'});
 }
}
function patch(theme){
 const tasks=Array.isArray(theme?.tasks)?theme.tasks:[];
 const cards=tasks.find(t=>t?.id==='karteikarten'||t?.kind==='cards'||/karteikart/i.test(t?.title||''));
 addCard(cards);
 addArticlePlural(tasks.find(t=>t?.id==='artikel-plural'));
 addMeaning(tasks.find(t=>t?.id==='bild-erklaerung-wort'));
 addCombination(tasks.find(t=>t?.id==='nomen-verben-verbinden'));
 if(Array.isArray(window.L7T1_VOCAB)&&!has(window.L7T1_VOCAB,item=>norm(item?.full||item?.word)==='die freundin'))window.L7T1_VOCAB.push({...FRIENDIN});
 return theme;
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(patch);
})();
