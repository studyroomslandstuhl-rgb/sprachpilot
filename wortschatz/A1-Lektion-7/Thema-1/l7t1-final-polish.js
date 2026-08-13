(function(){
'use strict';
if(window.__SP_L7T1_FINAL_POLISH_1)return;
window.__SP_L7T1_FINAL_POLISH_1=true;

const LEVELS=Object.freeze({
 'gar nicht':'😭',
 'nicht so gut':'🙁',
 'gut':'🙂',
 'sehr gut':'🤩'
});

const ABILITY_ROWS=[
 ['Maria','gar nicht','kochen','kochen.webp','Maria kann gar nicht kochen.'],
 ['Du','nicht so gut','Tennis spielen','tennis_spielen.webp','Du kannst nicht so gut Tennis spielen.'],
 ['Sofia','gut','singen','lied.webp','Sofia kann gut singen.'],
 ['Paul','sehr gut','Ski fahren','ski_fahren.webp','Paul kann sehr gut Ski fahren.'],
 ['Anna','gar nicht','jonglieren','jonglieren.webp','Anna kann gar nicht jonglieren.'],
 ['Ihr','nicht so gut','Gitarre spielen','gitarre_spielen.webp','Ihr könnt nicht so gut Gitarre spielen.'],
 ['Lara','gut','reiten','reiten.webp','Lara kann gut reiten.'],
 ['Wir','sehr gut','fotografieren','fotografieren.webp','Wir können sehr gut fotografieren.'],
 ['Mia','gar nicht','Klavier spielen','klavier_spielen.webp','Mia kann gar nicht Klavier spielen.'],
 ['Omar','nicht so gut','malen','malen.webp','Omar kann nicht so gut malen.'],
 ['Die Kinder','gut','Fahrrad fahren','fahrrad_fahren.webp','Die Kinder können gut Fahrrad fahren.'],
 ['Jonas','sehr gut','Tennis spielen','tennis_spielen.webp','Jonas kann sehr gut Tennis spielen.'],
 ['Ich','gar nicht','Ski fahren','ski_fahren.webp','Ich kann gar nicht Ski fahren.'],
 ['Amir','nicht so gut','jonglieren','jonglieren.webp','Amir kann nicht so gut jonglieren.'],
 ['Nina','sehr gut','Gitarre spielen','gitarre_spielen.webp','Nina kann sehr gut Gitarre spielen.']
];

function abilityTask(){
 return{
  id:'faehigkeit-saetze-schreiben',
  icon:'✍️',
  kind:'ability-write',
  title:'Sätze mit können',
  description:'Schreibe die Sätze mit „können“.',
  items:ABILITY_ROWS.map(([subject,level,activity,image,answer])=>({
   subject,level,emoji:LEVELS[level],activity,image,answer,
   answers:[answer,answer.replace(/[.!?]+$/,'')],
   noHelp:true,noAudio:true
  }))
 };
}

function cleanVariant(value){
 const text=String(value||'').trim();
 if(!text)return'';
 const cleaned=text
  .replace(/^Variante\s+\d+\s*(?:[·|—-]\s*)?/i,'')
  .replace(/\s*(?:[·|—-]\s*)Variante\s+\d+\s*$/i,'')
  .trim();
 return cleaned;
}
function stripVariantNotes(task){
 (task?.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  if(typeof item.context==='string'){
   const cleaned=cleanVariant(item.context);
   if(cleaned)item.context=cleaned;else delete item.context;
  }
  if(typeof item.label==='string'&&/^Variante\s+\d+$/i.test(item.label.trim()))delete item.label;
  if(typeof item.note==='string'&&/^Variante\s+\d+$/i.test(item.note.trim()))delete item.note;
 });
}

function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let tasks=[...theme.tasks];
 const exam=tasks.find(task=>task?.exam||task?.id==='pruefung');
 const learning=tasks.filter(task=>task!==exam);

 // Die vom Nutzer vor dieser Änderung als Aufgabe 11 bezeichnete Aufgabe entfernen.
 const oldTask11=learning[10]||null;
 if(oldTask11)tasks=tasks.filter(task=>task!==oldTask11);

 // Bisherige Aufgabe 9 (Fragen ordnen/markieren) durch die Schreibaufgabe ersetzen.
 const oldNine=tasks.findIndex(task=>task?.id==='fragen-ordnen-markieren');
 const replacement=abilityTask();
 if(oldNine>=0)tasks.splice(oldNine,1,replacement);
 else tasks.splice(Math.min(8,tasks.length),0,replacement);

 tasks.forEach(stripVariantNotes);

 if(exam){
  tasks=tasks.filter(task=>task!==exam);
  exam.exam=true;
  tasks.push(exam);
 }
 tasks.forEach((task,index)=>{task.order=index+1});
 theme.tasks=tasks;
 theme.abilityEmojis={...LEVELS};
 theme.finalPolishRevision='l7t1-final-polish-2026-08-13-v1';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
