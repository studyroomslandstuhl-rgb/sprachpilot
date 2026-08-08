(function(){
'use strict';
if(window.__SP_L7_SCOPE_MINIMUM_3)return;
window.__SP_L7_SCOPE_MINIMUM_3=true;

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
function withoutOpenEnding(value){
 return String(value||'').trim().replace(/\s*(?:\.{2,}|…+)\s*$/u,'').trim();
}
function prepareCardAnswers(item){
 const values=[item?.answer,item?.word,item?.full,item?.term,...(Array.isArray(item?.answers)?item.answers:[])];
 const answers=[];
 for(const value of values){
  const text=String(value||'').trim();
  if(!text)continue;
  answers.push(text);
  const withoutEnding=withoutOpenEnding(text);
  if(withoutEnding&&withoutEnding!==text)answers.push(withoutEnding);
 }
 const visible=fullWord(item);
 if(visible){
  answers.push(visible);
  const withoutEnding=withoutOpenEnding(visible);
  if(withoutEnding&&withoutEnding!==visible)answers.push(withoutEnding);
 }
 item.answers=[...new Set(answers)];
 if(!item.answer&&visible)item.answer=visible;
 return item;
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

// Nur der eigentliche Aufgabeninhalt entscheidet, ob ein Wort zu einem anderen Thema gehört.
// Beispiele, Hinweise und Übersetzungen dürfen eine korrekte L7T1-Aufgabe nicht löschen.
function scopePayload(item){
 if(!item||typeof item!=='object')return item;
 const keys=['prompt','answer','answers','word','full','term','options','tokens','rows','dialog','question','questions'];
 const output={};
 keys.forEach(key=>{if(item[key]!=null)output[key]=item[key]});
 return output;
}
function filterThemeOne(theme){
 if(Number(document.body.dataset.theme||1)!==1)return;
 for(const task of theme.tasks||[]){
  if(!Array.isArray(task.items))continue;
  if(isCards(task)){
   task.items=task.items.filter(item=>!exactForeignWord(fullWord(item))).map(prepareCardAnswers);
  }else{
   task.items=task.items.filter(item=>{
    try{return!containsForeignTerm(JSON.stringify(scopePayload(item)))}catch(error){return true}
   });
  }
 }
}
function variantLabel(number){return`Variante ${number}`}
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
const MODAL_FALLBACKS=[
 {prompt:'Ich ___ gut singen.',answer:'kann',options:['kann','will','möchte','können'],hint:'Bei „ich“ heißt die Form von „können“: kann.'},
 {prompt:'Du ___ heute Tennis spielen. Das ist dein Plan.',answer:'willst',options:['willst','kannst','möchtest','wollen'],hint:'Bei „du“ heißt die Form von „wollen“: willst.'},
 {prompt:'Ich ___ gern einen Tee.',answer:'möchte',options:['möchte','will','kann','möchten'],hint:'„möchte“ drückt hier einen höflichen Wunsch aus.'},
 {prompt:'Wir ___ gut Fahrrad fahren.',answer:'können',options:['können','wollen','möchten','kann'],hint:'Bei „wir“ heißt die Form von „können“: können.'},
 {prompt:'Ihr ___ am Wochenende Ski fahren. Das ist euer Plan.',answer:'wollt',options:['wollt','könnt','möchtet','wollen'],hint:'Bei „ihr“ heißt die Form von „wollen“: wollt.'},
 {prompt:'___ du Klavier spielen?',answer:'Kannst',answers:['Kannst','kannst'],options:['Kannst','Willst','Möchtest','Können'],hint:'Bei „du“ heißt die Form von „können“: kannst.'},
 {prompt:'Frau Klein ___ einen Kaffee.',answer:'möchte',options:['möchte','will','kann','möchten'],hint:'Ein höflicher Wunsch: möchte.'},
 {prompt:'Anna und Ben ___ heute einen Film sehen. Das ist ihr Plan.',answer:'wollen',options:['wollen','können','möchten','will'],hint:'Bei „sie“ im Plural heißt die Form von „wollen“: wollen.'}
];
function fallbackItem(task,index){
 const kind=task?.kind||'choice';
 const sentence=SENTENCES[index%SENTENCES.length];
 if(kind==='order')return{kind:'order',prompt:'Ordne den Satz.',tokens:[...sentence[1]],answer:sentence[0],context:`Zusatzfrage ${index+1}`};
 if(/modal|koennen|wollen|verbform/i.test(String(task?.id||''))){
  const base=deepCopy(MODAL_FALLBACKS[index%MODAL_FALLBACKS.length]);
  base.kind=kind==='input'?'input':'choice';
  base.context=`Zusatzfrage ${index+1}`;
  if(base.kind==='input')delete base.options;
  return base;
 }
 if(kind==='speak')return{kind:'speak',prompt:'Sprich einen vollständigen Satz über eine Fähigkeit oder einen Plan.',open:true,answer:index%2?'Ich kann gut singen.':'Ich will Tennis spielen.',minWords:4,context:`Zusatzfrage ${index+1}`};
 // Für fachfremde leere Aufgaben wird bewusst kein erfundener „kann“-Inhalt erzeugt.
 return null;
}
function ensureMinimum(task){
 if(isCards(task))return;
 if(!Array.isArray(task.items))task.items=[];
 if(task.items.length>=MIN_QUESTIONS)return;
 const source=task.items.map(deepCopy);
 if(!source.length){
  while(task.items.length<MIN_QUESTIONS){
   const fallback=fallbackItem(task,task.items.length);
   if(!fallback)break;
   task.items.push(fallback);
  }
  if(!task.items.length)task.__spMissingContent=true;
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
 theme.scopeRevision='l7t1-scope-content-filter-fix-2026-08-08';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
