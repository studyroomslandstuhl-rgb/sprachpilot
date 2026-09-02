(function(){
'use strict';
if(window.__SP_L8T3_RESTRUCTURE_20260902_V9)return;
window.__SP_L8T3_RESTRUCTURE_20260902_V9=true;

const I=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const C=(prompt,options,answer,context='',hint='')=>({type:'choice',prompt,options,answer,context,hint});
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function safeTask(task){if(!task||typeof task!=='object')return null;if(!Array.isArray(task.items))task.items=[];return task}

function conjugationTask(){
 const rows=[
  ['sein','ich','war'],['sein','du','warst'],['sein','er / sie / es','war'],['sein','wir','waren'],['sein','ihr','wart'],['sein','sie / Sie','waren'],
  ['haben','ich','hatte'],['haben','du','hattest'],['haben','er / sie / es','hatte'],['haben','wir','hatten'],['haben','ihr','hattet'],['haben','sie / Sie','hatten']
 ];
 return {id:'sein-haben-praeteritum-tabellen',title:'war und hatte konjugieren',kind:'conjugation-tables',icon:'🧮',emoji:'🧮',spL8T3Tables:true,instruction:'Fülle beide Tabellen aus. Konjugiere sein und haben im Präteritum.',items:rows.map(([verb,pronoun,form])=>({type:'input',verb,pronoun,form,answer:[form]}))};
}

function formsTask(){
 const rows=[
  ['Ich ___ viel Spaß.','hatte','Spaß hat man.'],['Er ___ heute sehr spät.','war','Eine Person ist/war spät.'],['Wir ___ keine Zeit.','hatten','Zeit hat man.'],['Du ___ gestern sehr müde.','warst','Eine Person ist/war müde.'],['Meine Kollegin ___ viel Berufserfahrung.','hatte','Berufserfahrung hat man.'],['Ihr ___ ein gutes Team.','wart','Ein Team sein: ihr wart.'],['Ihr ___ bei der Arbeit viel Stress.','hattet','Stress hat man.'],['Der Chef ___ sehr professionell.','war','Eine Person ist/war professionell.'],['Die Kollegen ___ wenig Zeit für Pausen.','hatten','Zeit hat man.'],['Sie ___ immer sehr nett.','waren','Mehrere Personen sind/waren nett.'],['Ich ___ früher Kellnerin.','war','Beruf mit sein: ich war.'],['Du ___ damals keinen Spaß bei der Arbeit.','hattest','Spaß hat man.'],['Das Café ___ sehr klein.','war','Ein Ort ist/war klein.'],['Wir ___ viele nette Kollegen.','hatten','Kollegen hat man.'],['Sie ___ früher Arbeiterin.','war','Eine Person + Beruf: sie war.'],['Ihr ___ noch keine Berufserfahrung.','hattet','Berufserfahrung hat man.'],['Meine Arbeit ___ einfach.','war','Eine Arbeit ist/war einfach.'],['Die Arbeitstage ___ sehr lang.','waren','Mehrzahl + sein: waren.'],['Meine Kollegen ___ schon viel Erfahrung.','hatten','Erfahrung hat man.'],['Sie ___ einen sehr guten Chef.','hatten','Einen Chef hat man.']
 ];
 return {id:'war-oder-hatte-richtige-form',title:'war oder hatte? Richtige Form',kind:'input',icon:'🧩',emoji:'🧩',instruction:'Lies den Satz. Entscheide zwischen sein und haben und schreibe die richtige Präteritumform.',intro:'Du brauchst nicht immer nur war oder hatte. Achte auf das Subjekt: war, warst, waren, wart oder hatte, hattest, hatten, hattet.',items:rows.map(([prompt,answer,hint])=>I(prompt,answer,'',hint))};
}

function dialogClozeTask(){
 const items=[
  {answer:['war'],verb:'sein',time:'letztes Jahr'},{answer:['hattet'],verb:'haben',time:'letztes Jahr'},{answer:['hatten'],verb:'haben',time:'letztes Jahr'},
  {answer:['war'],verb:'sein',time:'früher'},{answer:['hattest'],verb:'haben',time:'damals'},{answer:['hatte'],verb:'haben',time:'damals'},
  {answer:['ist'],verb:'sein',time:'heute'},{answer:['habt'],verb:'haben',time:'jetzt'},{answer:['haben'],verb:'haben',time:'heute'},
  {answer:['war'],verb:'sein',time:'vor drei Jahren'},{answer:['waren'],verb:'sein',time:'damals'},{answer:['hatten'],verb:'haben',time:'damals'},
  {answer:['war'],verb:'sein',time:'früher'},{answer:['ist'],verb:'sein',time:'heute'},{answer:['haben'],verb:'haben',time:'heute'}
 ];
 const dialogues=[
  {title:'Urlaub am Meer',icon:'🏖️',clue:'letztes Jahr',lines:[
   {speaker:'Mia',text:'Wie war euer Urlaub letztes Jahr?'},
   {speaker:'Omar',before:'Der Urlaub ',blank:0,after:' toll.'},
   {speaker:'Mia',before:'',blank:1,after:' ihr viel Stress mit der Reise?'},
   {speaker:'Omar',before:'Nein, wir ',blank:2,after:' keinen Stress.'}
  ]},
  {title:'Mein erster Job',icon:'🍽️',clue:'früher · damals',lines:[
   {speaker:'Sara',text:'Was warst du früher von Beruf?'},
   {speaker:'Nina',before:'Früher ',blank:3,after:' ich Kellnerin.'},
   {speaker:'Sara',before:'',blank:4,after:' du damals schon Berufserfahrung?'},
   {speaker:'Nina',before:'Nein, damals ',blank:5,after:' ich keine Erfahrung.'}
  ]},
  {title:'Arbeit heute',icon:'☕',clue:'heute · jetzt',lines:[
   {speaker:'Leo',text:'Wie ist deine Arbeit heute?'},
   {speaker:'Amir',before:'Heute ',blank:6,after:' mein Team sehr nett.'},
   {speaker:'Leo',before:'',blank:7,after:' ihr jetzt viel Stress?'},
   {speaker:'Amir',before:'Nein, wir ',blank:8,after:' heute viel Spaß.'}
  ]},
  {title:'Ausbildung',icon:'🎓',clue:'vor drei Jahren · damals',lines:[
   {speaker:'Elena',text:'Wie war deine Ausbildung vor drei Jahren?'},
   {speaker:'Paul',before:'Sie ',blank:9,after:' sehr interessant.'},
   {speaker:'Elena',before:'',blank:10,after:' eure Lehrer damals nett?'},
   {speaker:'Paul',before:'Ja, wir ',blank:11,after:' damals ein gutes Team.'}
  ]},
  {title:'Früher und heute',icon:'🔄',clue:'früher · heute',lines:[
   {speaker:'Lina',text:'Wie war dein Chef früher?'},
   {speaker:'Ben',before:'Früher ',blank:12,after:' er sehr streng.'},
   {speaker:'Lina',before:'Und wie ',blank:13,after:' er heute?'},
   {speaker:'Ben',before:'Heute ',blank:14,after:' wir wenig Stress und viel Spaß.'}
  ]}
 ];
 return {
  id:'dialoge-sein-haben-zeitwoerter',title:'Dialoge: früher oder heute?',kind:'dialog-cloze',icon:'🗣️',emoji:'🗣️',spL8T3DialogCloze:true,
  instruction:'Lies den Dialog. Achte auf die Zeitwörter und die Bedeutung. Schreibe die richtige Form von sein oder haben.',
  intro:'Schreibe nur die Verbform, zum Beispiel: war, hatte, ist, habe, waren, hatten.',items,dialogues
 };
}

function refineWorkTask(task){
 if(!task)return null;
 task.items=[
  C('Ich habe vier Jahre als Köchin gearbeitet. Was habe ich?',['Berufserfahrung','Ausbildung','Studium'],'Berufserfahrung'),
  C('Heute arbeite ich als Architektin. ___ war ich Kellnerin.',['früher','seit','vor'],'früher'),
  C('An einigen Tagen ist viel los, an anderen Tagen ist es ruhig. Was passt?',['manchmal','immer','nie'],'manchmal'),
  C('Fast jeden Tag arbeite ich bis 18 Uhr. Was passt?',['oft','selten','nie'],'oft'),
  C('Ich habe nur zehn Minuten Pause. Wie viel Pause habe ich?',['wenig','genug','viel'],'wenig'),
  C('Mein Chef erklärt alles klar, arbeitet genau und bleibt höflich. Wie arbeitet er?',['professionell','einfach','schlecht'],'professionell'),
  C('Die Aufgabe ist nicht schwer. Ich weiß sofort, was ich machen muss. Wie ist die Aufgabe?',['einfach','professionell','stressig'],'einfach'),
  C('Das Team hilft nicht, der Chef ist unfreundlich und die Arbeit macht keinen Spaß. Wie ist die Arbeit?',['schlecht','toll','professionell'],'schlecht'),
  C('Mein Team ist nett, die Arbeit interessant und ich gehe gern zur Arbeit. Wie finde ich die Arbeit?',['toll','einfach','wenig'],'toll'),
  C('Ich lache viel mit meinen Kollegen und gehe gern zur Arbeit. Was passt?',['Spaß haben','Stress haben','Berufserfahrung haben'],'Spaß haben'),
  C('Heute sind 50 Gäste da, ich habe keine Pause und muss sehr schnell arbeiten. Was habe ich?',['Stress','Erfahrung','Spaß'],'Stress'),
  C('Ich verkaufe Kaffee, Tee und Kuchen. Viele Gäste kommen am Nachmittag. Wo arbeite ich?',['Café','Restaurant','Büro'],'Café'),
  C('Abends bestellen die Gäste Vorspeise, Hauptgericht und Getränke am Tisch. Wo arbeite ich?',['Restaurant','Café','Kantine'],'Restaurant'),
  C('Sie plant Häuser, zeichnet Räume und arbeitet oft im Büro. Was ist sie von Beruf?',['Architektin','Arbeiterin','Kellnerin'],'Architektin'),
  C('Er nimmt Bestellungen auf und bringt Essen und Getränke an den Tisch. Was ist er von Beruf?',['Kellner','Koch','Arbeiter'],'Kellner')
 ];
 return task;
}

function makeSentence(parts,tense){
 const sentence=parts.map(x=>x.text).join(' ')+'.';
 return {type:'sentence-analysis',sentence,tense,segments:parts,tokens:parts.map(x=>x.text),answer:[sentence.replace(/[.!?]$/,''),sentence]};
}
function sentenceTask(){
 const rows=[
  makeSentence([{text:'Heute',role:null},{text:'arbeite',role:'verb'},{text:'ich',role:'sub'},{text:'in einem Café',role:null}],'Präsens'),
  makeSentence([{text:'Meine Kollegin',role:'sub'},{text:'arbeitet',role:'verb'},{text:'oft',role:null},{text:'im Restaurant',role:null}],'Präsens'),
  makeSentence([{text:'Wir',role:'sub'},{text:'haben',role:'verb'},{text:'heute',role:null},{text:'wenig Stress',role:null}],'Präsens'),
  makeSentence([{text:'Der Chef',role:'sub'},{text:'ist',role:'verb'},{text:'sehr professionell',role:null}],'Präsens'),
  makeSentence([{text:'Ihr',role:'sub'},{text:'habt',role:'verb'},{text:'viel Spaß',role:null},{text:'bei der Arbeit',role:null}],'Präsens'),
  makeSentence([{text:'Ich',role:'sub'},{text:'habe',role:'verb'},{text:'vor zwei Jahren',role:null},{text:'im Restaurant',role:null},{text:'gearbeitet',role:'verb'}],'Perfekt'),
  makeSentence([{text:'Meine Kollegin',role:'sub'},{text:'hat',role:'verb'},{text:'eine Ausbildung',role:null},{text:'gemacht',role:'verb'}],'Perfekt'),
  makeSentence([{text:'Wir',role:'sub'},{text:'haben',role:'verb'},{text:'schon',role:null},{text:'viel Berufserfahrung',role:null},{text:'gesammelt',role:'verb'}],'Perfekt'),
  makeSentence([{text:'Der Koch',role:'sub'},{text:'hat',role:'verb'},{text:'gestern',role:null},{text:'lange',role:null},{text:'gearbeitet',role:'verb'}],'Perfekt'),
  makeSentence([{text:'Die Architektin',role:'sub'},{text:'hat',role:'verb'},{text:'in einem großen Büro',role:null},{text:'gearbeitet',role:'verb'}],'Perfekt'),
  makeSentence([{text:'Früher',role:null},{text:'war',role:'verb'},{text:'ich',role:'sub'},{text:'Kellnerin',role:null}],'Präteritum'),
  makeSentence([{text:'Du',role:'sub'},{text:'hattest',role:'verb'},{text:'damals',role:null},{text:'wenig Berufserfahrung',role:null}],'Präteritum'),
  makeSentence([{text:'Unser Team',role:'sub'},{text:'war',role:'verb'},{text:'früher',role:null},{text:'sehr klein',role:null}],'Präteritum'),
  makeSentence([{text:'Wir',role:'sub'},{text:'hatten',role:'verb'},{text:'oft',role:null},{text:'viel Stress',role:null}],'Präteritum'),
  makeSentence([{text:'Die Kollegen',role:'sub'},{text:'waren',role:'verb'},{text:'immer',role:null},{text:'sehr nett',role:null}],'Präteritum')
 ];
 return {id:'saetze-bauen-subjekt-verb-zeitform-v2',title:'Sätze bauen',kind:'sentence-analysis',icon:'🧱',emoji:'🧱',spL8T3SentenceAnalysis:true,instruction:'Baue den Satz. Markiere danach Subjekt und Verb und wähle die Zeitform.',items:rows};
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=theme.tasks.map(safeTask).filter(Boolean);
 const keep1=safeTask(old[0]);
 const keep5=refineWorkTask(safeTask(old[4]));
 const exam=safeTask(old.find(t=>t?.exam));
 const candidates=[keep1,conjugationTask(),formsTask(),dialogClozeTask(),keep5,sentenceTask()];
 if(exam&&!candidates.includes(exam))candidates.push(exam);
 const seen=new Set();
 theme.tasks=candidates.filter(task=>{if(!task)return false;const key=String(task.id||'');if(key&&seen.has(key))return false;if(key)seen.add(key);return true});
 theme.title='Meine Arbeit früher';
 theme.subtitle='sein und haben im Präteritum konjugieren und Wortschatz zur Arbeit anwenden.';
 theme.contentRevision='l8t3-restructure-20260902-v9';
 return theme;
}

const previous=window.L8_CONTENT_READY;
window.L8_T3_RESTRUCTURE_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=themeOf(all,3);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;
 return themes;
}).catch(error=>{console.error('L8T3 Umbau konnte nicht angewendet werden',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_RESTRUCTURE_READY;
window.L8T3Restructure20260902={apply,version:9};
})();
