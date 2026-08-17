(function(){
'use strict';
if(window.__SP_L7T1_PERFEKT_TASKS_V1)return;
window.__SP_L7T1_PERFEKT_TASKS_V1=true;

const CHOICE_ITEMS=[
 ['arbeiten','gearbeitet',['gearbeiten','arbeitet','gearbetit','gearbeitet']],
 ['wecken','geweckt',['geweckt','gewecken','weckt','gewecket']],
 ['schreiben','geschrieben',['geschreibt','schreibt','geschreiben','geschrieben']],
 ['schmecken','geschmeckt',['geschmeckt','geschmecken','schmeckt','geschmecket']],
 ['backen','gebacken',['gebacken','gebacket','backt','gebackent']],
 ['singen','gesungen',['gesingt','singt','gesungen','gesingen']],
 ['reiten','geritten',['gereitet','reitet','geriten','geritten']],
 ['malen','gemalt',['gemalen','malt','gemaltet','gemalt']],
 ['üben','geübt',['geüben','übt','geübtet','geübt']],
 ['hören','gehört',['gehören','hört','gehöret','gehört']],
 ['machen','gemacht',['gemachen','macht','gemachtet','gemacht']],
 ['lesen','gelesen',['gelest','liest','geleset','gelesen']],
 ['sehen','gesehen',['geseht','sieht','gesieht','gesehen']],
 ['spielen','gespielt',['gespielen','spielt','gespielet','gespielt']],
 ['fahren','gefahren',['gefahrt','fährt','gefähren','gefahren']]
].map(([infinitive,answer,options])=>({
 kind:'choice',
 prompt:infinitive,
 context:'Welche Perfektform ist richtig?',
 answer,
 options,
 hint:'Achte auf die Form des Partizips II.'
}));

const MEMORY_PAIRS=[
 ['arbeiten','gearbeitet'],
 ['wecken','geweckt'],
 ['schreiben','geschrieben'],
 ['backen','gebacken'],
 ['singen','gesungen'],
 ['reiten','geritten'],
 ['malen','gemalt'],
 ['üben','geübt'],
 ['hören','gehört'],
 ['machen','gemacht'],
 ['lesen','gelesen'],
 ['sehen','gesehen']
].map(([infinitive,perfekt],index)=>({id:`paar-${index+1}`,infinitive,perfekt}));

function choiceTask(){return{
 id:'perfekt-form-waehlen',
 icon:'✓',
 kind:'choice',
 title:'Perfektform finden',
 description:'Du siehst einen Infinitiv. Wähle aus vier Formen die richtige Perfektform.',
 items:CHOICE_ITEMS
}}
function memoryTask(){return{
 id:'perfekt-memory',
 icon:'🧠',
 kind:'memory-pairs',
 title:'Infinitiv & Perfekt – Memory',
 description:'Finde die passenden Paare: Infinitiv und Perfektform.',
 items:MEMORY_PAIRS
}}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cards=theme.tasks.find(task=>task?.id==='karteikarten');
 const remove=new Set(['bild-erklaerung-wort','artikel-plural','perfekt-form-waehlen','perfekt-memory']);
 const exam=theme.tasks.find(task=>task?.exam||task?.id==='pruefung');
 const rest=theme.tasks.filter(task=>task!==cards&&task!==exam&&!remove.has(task?.id));
 const tasks=[];
 if(cards){
  cards.title='Karteikarten';
  cards.description='Lerne die Wörter mit Bild oder Bedeutung, Audio und Lösung auf der Rückseite.';
  tasks.push(cards);
 }
 tasks.push(choiceTask(),memoryTask(),...rest);
 if(exam){exam.exam=true;tasks.push(exam)}
 tasks.forEach((task,index)=>task.order=index+1);
 theme.tasks=tasks;
 theme.contentRevision='l7t1-perfekt-tasks-2-3-v1';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
