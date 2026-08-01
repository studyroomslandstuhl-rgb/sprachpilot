(function(){
'use strict';
if(window.__SP_L7_SCOPE_MINIMUM_1)return;
window.__SP_L7_SCOPE_MINIMUM_1=true;

const MIN_QUESTIONS=15;
const T1_FOREIGN_TERMS=[
 'das buch','buch',
 'schade','der kilometer','kilometer',
 'die kommunikation','kommunikation','das mädchen','mädchen','der junge','junge','die klasse','klasse',
 'das schwimmbad','schwimmbad','der eintritt','eintritt','die grundschule','grundschule',
 'der unterricht','unterricht','die leitung','leitung','losfahren','zurückkommen','mitkommen',
 'krank','die schule','schule','der arzt','arzt','die ärztin','ärztin','der schulausflug','schulausflug',
 'bescheid sagen','fehlen','sich entschuldigen','entschuldigen','gute besserung','leidtun',
 'gelernt','gemacht','geschrieben','gehört','gespielt','gesehen','gelesen','gekauft','gesprochen',
 'gearbeitet','getroffen','gefrühstückt','geschlafen','gekocht','gegessen','getrunken','gesagt',
 'gelebt','gekostet','gegrillt','gesucht','gewohnt',
 'gegangen','gefahren','gekommen','geflogen','gewandert'
].map(normalize);

function normalize(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function deepCopy(value){
 try{return JSON.parse(JSON.stringify(value))}catch(error){return{...value}}
}
function fullWord(item){
 const direct=String(item?.full||item?.word||item?.answer||item?.term||'').trim();
 const article=String(item?.article||'').trim();
 if(article&&!/^(der|die|das)\s/i.test(direct))return`${article} ${direct}`.trim();
 return direct;
}
function exactForeignWord(value){
 const word=normalize(value);
 if(!word)return false;
 return T1_FOREIGN_TERMS.some(term=>word===term||word===`der ${term}`||word===`die ${term}`||word===`das ${term}`);
}
function containsForeignTerm(value){
 const text=` ${normalize(value)} `;
 return T1_FOREIGN_TERMS.some(term=>text.includes(` ${term} `));
}
function isCards(task){
 return task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||'');
}
function filterThemeOne(theme){
 if(Number(document.body.dataset.theme||1)!==1)return;
 for(const task of theme.tasks||[]){
  if(!Array.isArray(task.items))continue;
  if(isCards(task)){
   task.items=task.items.filter(item=>!exactForeignWord(fullWord(item)));
  }else{
   task.items=task.items.filter(item=>{
    try{return!containsForeignTerm(JSON.stringify(item))}catch(error){return true}
   });
  }
 }
}
function variantLabel(number){
 return`Variante ${number}`;
}
function cloneVariant(item,number){
 const copy=deepCopy(item);
 const existing=String(copy.context||'').trim();
 copy.context=existing?`${existing} · ${variantLabel(number)}`:variantLabel(number);
 copy.__spVariant=number;
 return copy;
}
const SENTENCES=[
 ['Ich kann gut singen.',['Ich','kann','gut','singen','.']],
 ['Wir wollen heute Tennis spielen.',['Wir','wollen','heute','Tennis','spielen','.']],
 ['Kannst du Klavier spielen?',['Kannst','du','Klavier','spielen','?']],
 ['Was möchtest du machen?',['Was','möchtest','du','machen','?']],
 ['Er kann sehr gut malen.',['Er','kann','sehr','gut','malen','.']],
 ['Wollt ihr Fahrrad fahren?',['Wollt','ihr','Fahrrad','fahren','?']]
];
function fallbackItem(task,index){
 const kind=task?.kind||'choice';
 const sentence=SENTENCES[index%SENTENCES.length];
 if(kind==='order')return{kind:'order',prompt:'Ordne den Satz.',tokens:[...sentence[1]],answer:sentence[0],context:`Zusatzfrage ${index+1}`};
 if(kind==='input')return{kind:'input',prompt:'Schreibe das passende Modalverb.',context:`Ich ___ gut ${index%2?'singen':'malen'}.`,answer:'kann',answers:['kann'],hint:'Bei „ich“ heißt die Form „kann“.'};
 if(kind==='speak')return{kind:'speak',prompt:`Sprich einen Satz mit „${index%2?'können':'wollen'}“.`,open:true,answer:index%2?'Ich kann gut singen.':'Ich will Tennis spielen.',minWords:4};
 return{kind:'choice',prompt:`Welche Form passt? Ich ___ gut ${index%2?'singen':'malen'}.`,answer:'kann',options:['kann','will','können','wollen'],hint:'Bei „ich“ heißt die Form „kann“.',context:`Zusatzfrage ${index+1}`};
}
function ensureMinimum(task){
 if(isCards(task))return;
 if(!Array.isArray(task.items))task.items=[];
 if(task.items.length>=MIN_QUESTIONS)return;
 const source=task.items.map(deepCopy);
 if(!source.length){
  while(task.items.length<MIN_QUESTIONS)task.items.push(fallbackItem(task,task.items.length));
  return;
 }
 let variant=1;
 while(task.items.length<MIN_QUESTIONS){
  const base=source[(task.items.length-source.length)%source.length];
  task.items.push(cloneVariant(base,variant++));
 }
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))throw new Error('Die L7-Inhalte konnten nicht geprüft werden.');
 filterThemeOne(theme);
 for(const task of theme.tasks)ensureMinimum(task);
 theme.minimumQuestions=MIN_QUESTIONS;
 theme.scopeRevision='l7-four-theme-distribution-2026-08-01';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
