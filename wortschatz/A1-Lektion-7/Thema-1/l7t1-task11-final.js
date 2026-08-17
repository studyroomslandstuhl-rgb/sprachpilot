(function(){
'use strict';
if(window.__SP_L7T1_TASK11_FINAL_1)return;
window.__SP_L7T1_TASK11_FINAL_1=true;

const LEVELS=Object.freeze({
 'gar nicht':'😭',
 'nicht so gut':'🙁',
 'gut':'🙂',
 'sehr gut':'🤩'
});

const ROWS=Object.freeze([
 ['Lena','backen','gut','Lena kann gut backen.'],
 ['Tom','singen','sehr gut','Tom kann sehr gut singen.'],
 ['Mia','reiten','nicht so gut','Mia kann nicht so gut reiten.'],
 ['Paul','Klavier spielen','gar nicht','Paul kann gar nicht Klavier spielen.'],
 ['Anna','malen','sehr gut','Anna kann sehr gut malen.'],
 ['Du','Ski fahren','gut','Du kannst gut Ski fahren.'],
 ['Wir','Tennis spielen','nicht so gut','Wir können nicht so gut Tennis spielen.'],
 ['Ihr','Gitarre spielen','sehr gut','Ihr könnt sehr gut Gitarre spielen.'],
 ['Omar','jonglieren','gar nicht','Omar kann gar nicht jonglieren.'],
 ['Die Kinder','Fahrrad fahren','gut','Die Kinder können gut Fahrrad fahren.'],
 ['Sofia','fotografieren','sehr gut','Sofia kann sehr gut fotografieren.'],
 ['Ich','Französisch sprechen','nicht so gut','Ich kann nicht so gut Französisch sprechen.'],
 ['Jonas','schwimmen','gar nicht','Jonas kann gar nicht schwimmen.'],
 ['Nina','lesen','gut','Nina kann gut lesen.'],
 ['Amir','schreiben','sehr gut','Amir kann sehr gut schreiben.']
]);

function cleanAnswers(answer){
 const withoutPunctuation=String(answer||'').replace(/[.!?]+$/,'');
 return [...new Set([answer,withoutPunctuation].filter(Boolean))];
}
function buildItems(){
 return ROWS.map(([subject,activity,level,answer],index)=>{
  const emoji=LEVELS[level];
  return{
   id:`wie-gut-${index+1}`,
   kind:'input',
   subject,
   activity,
   level,
   emoji,
   prompt:`${subject} / ${activity} / ${emoji}`,
   answer,
   answers:cleanAnswers(answer),
   hint:`Baue den Satz so: Person + richtige Form von „können“ + ${level} + Aktivität.`,
   noAudio:true
  };
 });
}
function isWieGut(task){
 const id=String(task?.id||'').toLowerCase();
 const title=String(task?.title||'').trim().toLowerCase();
 return id==='faehigkeiten-abstufen'||title==='wie gut?'||title==='wie gut';
}
function apply(task){
 task.kind='input';
 task.title='Wie gut?';
 task.description='Schreibe einen vollständigen Satz mit „können“.';
 task.items=buildItems();
 task.emojiScale={...LEVELS};
 task.task11Revision='l7t1-task11-final-2026-08-17-v1';
}
function audit(task){
 const items=Array.isArray(task?.items)?task.items:[];
 return{
  count:items.length,
  allHaveEmoji:items.length===15&&items.every(item=>Boolean(item.emoji)&&String(item.prompt||'').includes(item.emoji)),
  uniquePrompts:new Set(items.map(item=>item.prompt)).size===items.length,
  uniqueAnswers:new Set(items.map(item=>item.answer)).size===items.length,
  prompts:items.map(item=>item.prompt)
 };
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const matches=theme.tasks.filter(isWieGut);
 matches.forEach(apply);
 const task11=theme.tasks[10];
 if(task11&&isWieGut(task11))apply(task11);
 const target=(task11&&isWieGut(task11))?task11:matches[0];
 window.L7T1Task11Audit=target?audit(target):{count:0,allHaveEmoji:false,uniquePrompts:false,uniqueAnswers:false,prompts:[]};
 theme.task11Revision='l7t1-task11-final-2026-08-17-v1';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
