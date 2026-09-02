(function(){
'use strict';
if(window.__SP_L8T3_RESTRUCTURE_20260902_V4)return;
window.__SP_L8T3_RESTRUCTURE_20260902_V4=true;

const I=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
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
  kind:'conjugation-tables',icon:'🔤',emoji:'🔤',spL8T3Tables:true,
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
  kind:'input',icon:'✍️',emoji:'✍️',
  instruction:'Lies den Satz. Entscheide zwischen sein und haben und schreibe die richtige Präteritumform.',
  intro:'Du brauchst nicht immer nur war oder hatte. Achte auf das Subjekt: war, warst, waren, wart oder hatte, hattest, hatten, hattet.',
  items:rows.map(([prompt,answer,hint])=>I(prompt,answer,'',hint))
 };
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=theme.tasks.map(safeTask).filter(Boolean);
 const keep1=safeTask(old[0]);
 const keep5=safeTask(old[4]);
 const keep12=safeTask(old[11]);
 const exam=safeTask(old.find(t=>t?.exam));
 const candidates=[keep1,conjugationTask(),formsTask(),keep5,keep12];
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
 theme.subtitle='sein und haben im Präteritum konjugieren und in Sätzen die richtige Form wählen.';
 theme.contentRevision='l8t3-restructure-20260902-v4';
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
window.L8T3Restructure20260902={apply,version:4};
})();
