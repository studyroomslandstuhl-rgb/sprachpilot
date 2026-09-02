(function(){
'use strict';
if(window.__SP_L8T3_RESTRUCTURE_20260902_V3)return;
window.__SP_L8T3_RESTRUCTURE_20260902_V3=true;

const I=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function safeTask(task){
 if(!task||typeof task!=='object')return null;
 if(!Array.isArray(task.items))task.items=[];
 return task;
}
function seinTask(){return {
 id:'sein-praeteritum-konjugieren',title:'sein im Präteritum: war',kind:'input',icon:'🔤',emoji:'🔤',
 instruction:'Konjugiere sein im Präteritum. Schreibe die richtige Form.',
 intro:'sein im Präteritum: ich war · du warst · er/sie/es war · wir waren · ihr wart · sie/Sie waren',
 items:[I('ich ___','war'),I('du ___','warst'),I('er / sie / es ___','war'),I('wir ___','waren'),I('ihr ___','wart'),I('sie / Sie ___','waren')]
}}
function habenTask(){return {
 id:'haben-praeteritum-konjugieren',title:'haben im Präteritum: hatte',kind:'input',icon:'🔤',emoji:'🔤',
 instruction:'Konjugiere haben im Präteritum. Schreibe die richtige Form.',
 intro:'haben im Präteritum: ich hatte · du hattest · er/sie/es hatte · wir hatten · ihr hattet · sie/Sie hatten',
 items:[I('ich ___','hatte'),I('du ___','hattest'),I('er / sie / es ___','hatte'),I('wir ___','hatten'),I('ihr ___','hattet'),I('sie / Sie ___','hatten')]
}}
function contextTask(){return {
 id:'sein-haben-fuenf-texte',title:'Früher oder heute? Fünf Texte',kind:'input',icon:'📖',emoji:'📖',
 instruction:'Lies fünf kurze Texte und setze die passende Form von sein oder haben ein.',
 intro:'Achte auf die Zeit: früher, damals oder vor ... → Präteritum. Heute oder jetzt → Präsens. Entscheide danach zwischen sein und haben.',
 items:[
  I('Text 1: Ergänze die Lücke.','war','Früher arbeitete Maria in einem großen Restaurant. Die Arbeit ___ sehr stressig. Heute arbeitet sie in einem kleinen Café und die Arbeit ist ruhig.','Früher + Beschreibung → war.'),
  I('Text 2: Ergänze die Lücke.','hatte','Mein erster Job war in einer Bäckerei. Ich war neu und ich ___ noch keine Berufserfahrung. Heute habe ich schon viel Erfahrung.','Früher + Erfahrung haben → hatte.'),
  I('Text 3: Ergänze die Lücke.','habe','Heute arbeite ich in einem Café. Mein Team ist nett und ich ___ viel Spaß bei der Arbeit. Früher hatte ich oft Stress.','Heute + Spaß haben → habe.'),
  I('Text 4: Ergänze die Lücke.','war','Vor zwei Jahren ___ ich Kellnerin in einem Restaurant. Heute bin ich Köchin und arbeite in einer Kantine.','Vor zwei Jahren + Beruf → war.'),
  I('Text 5: Ergänze die Lücke.','ist','Paul arbeitet jetzt in einem Architekturbüro. Sein Chef ___ sehr professionell und das Team ist freundlich. Früher war sein Chef oft unfreundlich.','Jetzt + Beschreibung → ist.')
 ]
}}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=theme.tasks.map(safeTask).filter(Boolean);
 const keep1=safeTask(old[0]);
 const keep5=safeTask(old[4]);
 const keep12=safeTask(old[11]);
 const exam=safeTask(old.find(t=>t?.exam));
 const candidates=[keep1,seinTask(),habenTask(),contextTask(),keep5,keep12];
 if(exam&&!candidates.includes(exam))candidates.push(exam);
 const seen=new Set();
 theme.tasks=candidates.filter(task=>{
  if(!task)return false;
  const key=String(task.id||'');
  if(key&&seen.has(key))return false;
  if(key)seen.add(key);
  return true;
 });
 theme.title='Meine Arbeit früher';
 theme.subtitle='sein und haben im Präteritum konjugieren und die richtige Form aus dem Kontext erkennen.';
 theme.contentRevision='l8t3-restructure-20260902-v3';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T3_RESTRUCTURE_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=themeOf(all,3);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;
 return themes;
}).catch(error=>{
 console.error('L8T3 Umbau konnte nicht angewendet werden',error);
 return window.L8_ALL_THEMES||{};
});
window.L8_CONTENT_READY=window.L8_T3_RESTRUCTURE_READY;
window.L8T3Restructure20260902={apply,version:3};
})();
