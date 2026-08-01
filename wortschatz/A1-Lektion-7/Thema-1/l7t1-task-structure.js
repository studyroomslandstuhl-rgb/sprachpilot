(function(){
'use strict';
if(window.__SP_L7T1_TASK_STRUCTURE_2)return;
window.__SP_L7T1_TASK_STRUCTURE_2=true;

const REMOVE_IDS=new Set([
 'partnerinterview',
 'dialoge-ergaenzen',
 'hoeren-wuensche',
 'eigene-faehigkeiten',
 'eigene-plaene'
]);

function normalize(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ');
}
function taskIndex(tasks,ids){
 const set=new Set(Array.isArray(ids)?ids:[ids]);
 const indexes=tasks.map((task,index)=>set.has(task?.id)?index:-1).filter(index=>index>=0);
 return indexes.length?Math.min(...indexes):tasks.length;
}
function removeTasks(tasks,ids){
 const set=new Set(Array.isArray(ids)?ids:[ids]);
 return tasks.filter(task=>!set.has(task?.id));
}
function itemCopies(task,label){
 if(!task||!Array.isArray(task.items))return[];
 return task.items.map(item=>({
  ...item,
  kind:item.kind||task.kind,
  context:item.context||label
 }));
}
function modalTableTask(){
 return{
  id:'koennen-wollen-formen',
  icon:'🧠',
  kind:'conjugation-table',
  title:'können und wollen',
  description:'Ordne die Verbformen den Personalpronomen zu.',
  items:[{
   prompt:'Ziehe alle Formen von „können“ und „wollen“ an die richtige Stelle.',
   rows:[
    {pronoun:'ich',koennen:'kann',wollen:'will'},
    {pronoun:'du',koennen:'kannst',wollen:'willst'},
    {pronoun:'er / sie / es',koennen:'kann',wollen:'will'},
    {pronoun:'wir',koennen:'können',wollen:'wollen'},
    {pronoun:'ihr',koennen:'könnt',wollen:'wollt'},
    {pronoun:'sie / Sie',koennen:'können',wollen:'wollen'}
   ]
  }]
 };
}
function questionTask(first,second){
 const firstItems=itemCopies(first,'Ja-/Nein-Frage');
 const secondItems=itemCopies(second,'W-Frage');
 const kinds=new Set([...firstItems,...secondItems].map(item=>item.kind).filter(Boolean));
 const task={
  id:'fragen-bilden',
  icon:first?.icon||second?.icon||'❓',
  title:'Fragen bilden',
  description:'Ordne Ja-/Nein-Fragen und W-Fragen.',
  items:[...firstItems,...secondItems]
 };
 if(kinds.size===1)task.kind=[...kinds][0];
 return task;
}
function modalChoiceTask(verbTask,politeTask){
 const firstItems=itemCopies(verbTask,'Wähle die passende Verbform.');
 const politeItems=itemCopies(politeTask,'Unterscheide „wollen“ und „möchten“.');
 const items=[...firstItems,...politeItems];
 const kinds=new Set(items.map(item=>item.kind).filter(Boolean));
 const output={
  id:'modalverb-waehlen',
  icon:verbTask?.icon||politeTask?.icon||'🔤',
  title:'können, wollen oder möchten?',
  description:'Wähle das passende Modalverb und die richtige Form.',
  items
 };
 if(kinds.size===1)output.kind=[...kinds][0];
 const hasMoechten=normalize(JSON.stringify(output.items)).includes('mocht');
 if(!hasMoechten){
  output.items.push(
   {kind:'choice',prompt:'Ich ___ gern einen Tee.',context:'Höflicher Wunsch',answer:'möchte',options:['möchte','will','kann','möchten'],hint:'„möchten“ drückt hier einen höflichen Wunsch aus.'},
   {kind:'choice',prompt:'Du ___ Klavier spielen. Das ist dein Wunsch.',context:'Höflicher Wunsch',answer:'möchtest',options:['möchtest','möchte','willst','kannst'],hint:'Bei „du“ heißt die Form „möchtest“.'},
   {kind:'choice',prompt:'Wir ___ bitte zwei Eintrittskarten.',context:'Höflicher Wunsch',answer:'möchten',options:['möchten','wollen','können','möchtet'],hint:'Bei „wir“ heißt die Form „möchten“.'},
   {kind:'choice',prompt:'___ ihr am Wochenende Ski fahren?',context:'Höfliche Frage',answer:'Möchtet',answers:['Möchtet','möchtet'],options:['Möchtet','Wollt','Könnt','Möchten'],hint:'Bei „ihr“ heißt die Form „möchtet“.'}
  );
 }
 return output;
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))throw new Error('Die L7T1-Aufgabenstruktur konnte nicht geladen werden.');
 let tasks=[...theme.tasks];

 const modalPosition=taskIndex(tasks,['koennen-formen','wollen-formen']);
 tasks=removeTasks(tasks,['koennen-formen','wollen-formen']);
 tasks.splice(Math.min(modalPosition,tasks.length),0,modalTableTask());

 const verbTask=tasks.find(task=>task.id==='verbform-waehlen');
 const politeTask=tasks.find(task=>task.id==='wollen-moechten');
 tasks=removeTasks(tasks,['verbform-waehlen','wollen-moechten']);
 let modalIndex=tasks.findIndex(task=>task.id==='koennen-wollen-formen');
 tasks.splice(modalIndex+1,0,modalChoiceTask(verbTask,politeTask));

 const yesNo=tasks.find(task=>task.id==='ja-nein-fragen');
 const wQuestions=tasks.find(task=>task.id==='w-fragen');
 if(yesNo||wQuestions){
  const questionPosition=taskIndex(tasks,['ja-nein-fragen','w-fragen']);
  tasks=removeTasks(tasks,['ja-nein-fragen','w-fragen']);
  tasks.splice(Math.min(questionPosition,tasks.length),0,questionTask(yesNo,wQuestions));
 }

 tasks=tasks.filter(task=>!REMOVE_IDS.has(task?.id));

 const combinations=tasks.find(task=>task.id==='nomen-verben-verbinden');
 if(combinations){
  tasks=removeTasks(tasks,'nomen-verben-verbinden');
  modalIndex=tasks.findIndex(task=>task.id==='koennen-wollen-formen');
  tasks.splice(Math.max(0,modalIndex),0,combinations);
 }

 const exam=tasks.find(task=>task?.exam||task?.id==='pruefung');
 if(exam){
  tasks=tasks.filter(task=>task!==exam);
  exam.exam=true;
  tasks.push(exam);
 }

 tasks.forEach((task,index)=>{task.order=index+1});
 theme.tasks=tasks;
 theme.contentRevision='l7t1-confirmed-task-merges-2026-08-01-v2';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
