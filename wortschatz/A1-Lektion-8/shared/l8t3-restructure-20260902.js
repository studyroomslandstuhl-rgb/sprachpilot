(function(){
'use strict';
if(window.__SP_L8T3_RESTRUCTURE_20260902_V6)return;
window.__SP_L8T3_RESTRUCTURE_20260902_V6=true;

const I=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const C=(prompt,options,answer,context='',hint='')=>({type:'choice',prompt,options,answer,context,hint});
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function safeTask(task){if(!task||typeof task!=='object')return null;if(!Array.isArray(task.items))task.items=[];return task}

function conjugationTask(){
 const rows=[
  ['sein','ich','war'],['sein','du','warst'],['sein','er / sie / es','war'],['sein','wir','waren'],['sein','ihr','wart'],['sein','sie / Sie','waren'],
  ['haben','ich','hatte'],['haben','du','hattest'],['haben','er / sie / es','hatte'],['haben','wir','hatten'],['haben','ihr','hattet'],['haben','sie / Sie','hatten']
 ];
 return {
  id:'sein-haben-praeteritum-tabellen',
  title:'war und hatte konjugieren',
  kind:'conjugation-tables',icon:'🧮',emoji:'🧮',spL8T3Tables:true,
  instruction:'Fülle beide Tabellen aus. Konjugiere sein und haben im Präteritum.',
  items:rows.map(([verb,pronoun,form])=>({type:'input',verb,pronoun,form,answer:[form]}))
 };
}

function formsTask(){
 const rows=[
  ['Ich ___ viel Spaß.','hatte','Spaß hat man.'],
  ['Er ___ heute sehr spät.','war','Eine Person ist/war spät.'],
  ['Wir ___ keine Zeit.','hatten','Zeit hat man.'],
  ['Du ___ gestern sehr müde.','warst','Eine Person ist/war müde.'],
  ['Meine Kollegin ___ viel Berufserfahrung.','hatte','Berufserfahrung hat man.'],
  ['Ihr ___ ein gutes Team.','wart','Ein Team sein: ihr wart.'],
  ['Ihr ___ bei der Arbeit viel Stress.','hattet','Stress hat man.'],
  ['Der Chef ___ sehr professionell.','war','Eine Person ist/war professionell.'],
  ['Die Kollegen ___ wenig Zeit für Pausen.','hatten','Zeit hat man.'],
  ['Sie ___ immer sehr nett.','waren','Mehrere Personen sind/waren nett.'],
  ['Ich ___ früher Kellnerin.','war','Beruf mit sein: ich war.'],
  ['Du ___ damals keinen Spaß bei der Arbeit.','hattest','Spaß hat man.'],
  ['Das Café ___ sehr klein.','war','Ein Ort ist/war klein.'],
  ['Wir ___ viele nette Kollegen.','hatten','Kollegen hat man.'],
  ['Sie ___ früher Arbeiterin.','war','Eine Person + Beruf: sie war.'],
  ['Ihr ___ noch keine Berufserfahrung.','hattet','Berufserfahrung hat man.'],
  ['Meine Arbeit ___ einfach.','war','Eine Arbeit ist/war einfach.'],
  ['Die Arbeitstage ___ sehr lang.','waren','Mehrzahl + sein: waren.'],
  ['Meine Kollegen ___ schon viel Erfahrung.','hatten','Erfahrung hat man.'],
  ['Sie ___ einen sehr guten Chef.','hatten','Einen Chef hat man.']
 ];
 return {
  id:'war-oder-hatte-richtige-form',
  title:'war oder hatte? Richtige Form',
  kind:'input',icon:'🧩',emoji:'🧩',
  instruction:'Lies den Satz. Entscheide zwischen sein und haben und schreibe die richtige Präteritumform.',
  intro:'Du brauchst nicht immer nur war oder hatte. Achte auf das Subjekt: war, warst, waren, wart oder hatte, hattest, hatten, hattet.',
  items:rows.map(([prompt,answer,hint])=>I(prompt,answer,'',hint))
 };
}

function contextTask(){
 return {
  id:'sein-haben-fuenf-texte',title:'Früher oder heute? Fünf Texte',kind:'input',icon:'🕰️',emoji:'🕰️',
  instruction:'Lies fünf kurze Texte und setze die passende Form von sein oder haben ein.',
  intro:'Achte auf die Zeit: früher, damals oder vor ... → Präteritum. Heute oder jetzt → Präsens. Entscheide danach zwischen sein und haben.',
  items:[
   I('Text 1: Ergänze die Lücke.','war','Früher arbeitete Maria in einem großen Restaurant. Die Arbeit ___ sehr stressig. Heute arbeitet sie in einem kleinen Café und die Arbeit ist ruhig.','Früher + Beschreibung → war.'),
   I('Text 2: Ergänze die Lücke.','hatte','Mein erster Job war in einer Bäckerei. Ich war neu und ich ___ noch keine Berufserfahrung. Heute habe ich schon viel Erfahrung.','Früher + Erfahrung haben → hatte.'),
   I('Text 3: Ergänze die Lücke.','habe','Heute arbeite ich in einem Café. Mein Team ist nett und ich ___ viel Spaß bei der Arbeit. Früher hatte ich oft Stress.','Heute + Spaß haben → habe.'),
   I('Text 4: Ergänze die Lücke.','war','Vor zwei Jahren ___ ich Kellnerin in einem Restaurant. Heute bin ich Köchin und arbeite in einer Kantine.','Vor zwei Jahren + Beruf → war.'),
   I('Text 5: Ergänze die Lücke.','ist','Paul arbeitet jetzt in einem Architekturbüro. Sein Chef ___ sehr professionell und das Team ist freundlich. Früher war sein Chef oft unfreundlich.','Jetzt + Beschreibung → ist.')
  ]
 };
}

function extendWorkTask(task){
 if(!task)return null;
 const extra=[
  C('Was bedeutet „früher“?',['in der Vergangenheit','jetzt','morgen'],'in der Vergangenheit'),
  C('Was bedeutet „oft“?',['viele Male','kein Mal','nur einmal im Jahr'],'viele Male'),
  C('Was bedeutet „manchmal“?',['nicht immer, aber ab und zu','immer','nie'],'nicht immer, aber ab und zu'),
  C('Was bedeutet „wenig“?',['nicht viel','sehr viel','alles'],'nicht viel'),
  C('Was passt am besten?',['Spaß haben','Stress machen','Beruf sein'],'Spaß haben','Die Arbeit macht mir Freude.'),
  C('Was passt am besten?',['schlecht','toll','professionell'],'schlecht','Der Chef hilft nie und das Team ist unfreundlich.'),
  C('Was passt am besten?',['professionell','wenig','früher'],'professionell','Sie arbeitet sehr genau und zuverlässig.')
 ];
 task.items=[...(task.items||[]).slice(0,8),...extra];
 return task;
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=theme.tasks.map(safeTask).filter(Boolean);
 const keep1=safeTask(old[0]);
 const keep5=extendWorkTask(safeTask(old[4]));
 const keep12=safeTask(old[11]);
 const exam=safeTask(old.find(t=>t?.exam));
 const candidates=[keep1,conjugationTask(),formsTask(),contextTask(),keep5,keep12];
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
 theme.subtitle='sein und haben im Präteritum konjugieren und Wortschatz zur Arbeit anwenden.';
 theme.contentRevision='l8t3-restructure-20260902-v6';
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
window.L8T3Restructure20260902={apply,version:6};
})();
