(function(){
'use strict';
if(window.__SP_L8T3_RESTRUCTURE_20260902_V5)return;
window.__SP_L8T3_RESTRUCTURE_20260902_V5=true;

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

function mixedQuestionsTask(){
 return {
  id:'fragen-wortschatz-l8t1-t3',
  title:'15 Fragen rund um Arbeit und Alltag',
  kind:'choice',icon:'🧭',emoji:'🧭',
  instruction:'Lies die Frage und wähle die passende Antwort.',
  intro:'Hier kannst du Wörter aus Lektion 8 · Thema 1, 2 und 3 benutzen.',
  items:[
   C('Was macht ein Architekt?',['Er plant Gebäude.','Er kocht im Restaurant.','Er verkauft Medikamente.'],'Er plant Gebäude.'),
   C('Wo arbeitet eine Kellnerin meistens?',['im Restaurant oder Café','in der Grundschule','auf dem Flughafen'],'im Restaurant oder Café'),
   C('Was bedeutet „Berufserfahrung“?',['Man hat schon in einem Beruf gearbeitet.','Man beginnt heute die Schule.','Man hat immer frei.'],'Man hat schon in einem Beruf gearbeitet.'),
   C('Welche Antwort passt? „Seit wann arbeitest du hier?“',['Seit zwei Jahren.','Vor zwei Jahren.','Zwei Stunden lang.'],'Seit zwei Jahren.'),
   C('Welche Antwort passt? „Wann hast du deine Ausbildung gemacht?“',['Vor drei Jahren.','Seit drei Jahren.','Noch drei Jahre.'],'Vor drei Jahren.'),
   C('Was passt zu „viel Stress“?',['Die Arbeit ist oft anstrengend.','Ich habe immer Urlaub.','Die Arbeit dauert nur fünf Minuten.'],'Die Arbeit ist oft anstrengend.'),
   C('Was passt zu einem guten Team?',['Die Kollegen helfen einander.','Niemand spricht miteinander.','Alle arbeiten allein und streiten.'],'Die Kollegen helfen einander.'),
   C('Was bedeutet „professionell“ bei der Arbeit?',['Man arbeitet zuverlässig und gut.','Man kommt nie zur Arbeit.','Man kennt die Arbeit nicht.'],'Man arbeitet zuverlässig und gut.'),
   C('Was ist das Gegenteil von „wenig Erfahrung“?',['viel Erfahrung','schlechte Pause','kurze Ausbildung'],'viel Erfahrung'),
   C('Welche Person arbeitet in einer Küche?',['der Koch / die Köchin','der Architekt / die Architektin','der Arbeiter / die Arbeiterin'],'der Koch / die Köchin'),
   C('Welche Aussage passt zu „Spaß haben“?',['Die Arbeit macht mir Freude.','Ich habe keine Zeit.','Mein Chef ist schlecht.'],'Die Arbeit macht mir Freude.'),
   C('Welcher Satz passt zu einer früheren Arbeit?',['Früher war mein Chef sehr nett.','Morgen war mein Chef sehr nett.','Seit morgen war mein Chef nett.'],'Früher war mein Chef sehr nett.'),
   C('Was kann man über einen Arbeitsplatz sagen?',['Die Arbeit ist einfach oder stressig.','Der Arbeitsplatz trinkt Kaffee.','Der Arbeitsplatz macht eine Ausbildung.'],'Die Arbeit ist einfach oder stressig.'),
   C('Welche Frage passt zur Antwort „Ich war Arbeiterin.“?',['Was warst du früher von Beruf?','Seit wann bist du hier?','Wie heißt dein Kollege?'],'Was warst du früher von Beruf?'),
   C('Welche Antwort passt zu „Wie war deine Arbeit früher?“',['Sie war interessant, aber manchmal stressig.','Ich bin seit zwei Jahren.','Vor drei Kollegen.'],'Sie war interessant, aber manchmal stressig.')
  ]
 };
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=theme.tasks.map(safeTask).filter(Boolean);
 const keep1=safeTask(old[0]);
 const keep5=safeTask(old[4]);
 const keep12=safeTask(old[11]);
 const exam=safeTask(old.find(t=>t?.exam));
 const candidates=[keep1,conjugationTask(),formsTask(),mixedQuestionsTask(),keep5,keep12];
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
 theme.subtitle='sein und haben im Präteritum konjugieren und Wortschatz aus Thema 1–3 anwenden.';
 theme.contentRevision='l8t3-restructure-20260902-v5';
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
window.L8T3Restructure20260902={apply,version:5};
})();
