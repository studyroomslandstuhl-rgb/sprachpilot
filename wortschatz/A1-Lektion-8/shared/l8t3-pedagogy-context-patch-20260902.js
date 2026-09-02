(function(){
'use strict';
if(window.__SP_L8T3_PEDAGOGY_CONTEXT_PATCH_20260902_V1)return;
window.__SP_L8T3_PEDAGOGY_CONTEXT_PATCH_20260902_V1=true;

const C=(prompt,options,answer,extra={})=>({type:'choice',prompt,options,answer,...extra});
const I=(prompt,answer,hint='',extra={})=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],hint,...extra});
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}

function improveListening(task){
 if(!task)return;
 const dialogues=[
  {
   title:'Dialog 1 · Sara',
   audio:'Nina: Wie war deine Arbeit im Restaurant früher? Sara: Nicht leicht. Abends sind viele Gäste gleichzeitig gekommen. Ich habe sehr schnell gearbeitet und hatte kaum Zeit für eine Pause. Heute bin ich in einem kleinen Café. Dort kommen weniger Gäste auf einmal und ich kann mit den Menschen sprechen. Nina: Möchtest du wieder im Restaurant arbeiten? Sara: Nein, im Café gefällt es mir besser.',
   qs:[
    C('Sara hat heute einen ruhigeren Arbeitstag als früher.',['Falsch','Richtig'],'Richtig'),
    C('Warum gefällt Sara die heutige Arbeit besser?',['Sie kann sich mehr Zeit für Menschen nehmen.','Sie arbeitet heute gar nicht mehr.','Sie muss heute viel schneller arbeiten.'],'Sie kann sich mehr Zeit für Menschen nehmen.'),
    I('Was war früher am Abend schwierig?',['zu viele Gäste','viele Gäste','kaum Zeit für eine Pause','wenig Zeit für eine Pause','viel Arbeit'],'Denke an die Situation im Restaurant, nicht an ein einzelnes Wort.')
   ]
  },
  {
   title:'Dialog 2 · Karim',
   audio:'Mila: Wie war dein erster Job? Karim: Ich war in einer Werkstatt. Am Anfang war vieles neu für mich und ich hatte wenig Erfahrung. Ich habe oft Fragen gestellt. Mein Chef war schnell ungeduldig. Heute bin ich in einer anderen Firma. Meine Kollegen erklären mir neue Aufgaben und wir arbeiten oft zusammen. Mila: Gehst du heute lieber zur Arbeit? Karim: Ja.',
   qs:[
    C('Karim hat sich im ersten Job sicher gefühlt.',['Richtig','Falsch'],'Falsch'),
    C('Was hilft Karim heute besonders?',['Er bekommt Unterstützung im Team.','Er arbeitet ohne Kollegen.','Er hat keine neuen Aufgaben.'],'Er bekommt Unterstützung im Team.'),
    I('Warum geht Karim heute lieber zur Arbeit?',['weil die Kollegen helfen','weil seine Kollegen helfen','weil er Hilfe bekommt','weil das Team ihm hilft'],'Verbinde mehrere Informationen aus dem Dialog.')
   ]
  },
  {
   title:'Dialog 3 · Nina',
   audio:'Omar: Du bist heute Köchin. Was hast du vorher gemacht? Nina: Früher war ich Arbeiterin in einer großen Firma. Ich habe jeden Tag fast dieselben Aufgaben gemacht. Die Arbeit war für mich langweilig und ich hatte wenig Spaß. Danach habe ich eine Ausbildung gemacht. Heute koche ich in einem Restaurant. Kein Tag ist gleich und ich lerne oft etwas Neues. Omar: War der Wechsel richtig? Nina: Ja.',
   qs:[
    C('Nina hat ihren Beruf gewechselt.',['Falsch','Richtig'],'Richtig'),
    C('Was gefällt Nina an der heutigen Arbeit?',['Die Tage sind abwechslungsreicher.','Sie macht jeden Tag genau dasselbe.','Sie lernt nichts Neues mehr.'],'Die Tage sind abwechslungsreicher.'),
    I('Warum war die frühere Arbeit für Nina nicht gut?',['sie war langweilig','die Arbeit war langweilig','immer gleiche Aufgaben','sie hatte wenig Spaß'],'Erkläre die Bedeutung mit eigenen kurzen Worten.')
   ]
  },
  {
   title:'Dialog 4 · Amir',
   audio:'Lea: Wie war deine Arbeit vor zwei Jahren? Amir: Damals war mein Büro sehr klein. Wir waren nur drei Personen und hatten sehr viele Aufgaben. Oft hatte jeder mehrere Aufgaben gleichzeitig. Heute bin ich in einem größeren Team. Wir teilen die Aufgaben und helfen uns. Lea: Ist die Arbeit heute leichter? Amir: Ja, deutlich.',
   qs:[
    C('Früher hatte eine Person mehr Arbeit als heute.',['Richtig','Falsch'],'Richtig'),
    C('Was hat die Arbeit für Amir verbessert?',['Mehr Personen teilen die Aufgaben.','Jeder macht heute alles allein.','Das Büro hat heute keine Aufgaben.'],'Mehr Personen teilen die Aufgaben.'),
    I('Wie war die Arbeit früher für Amir?',['anstrengend','stressig','viel Arbeit','zu viel Arbeit'],'Schließe aus Teamgröße und Aufgabenmenge auf die Arbeitssituation.')
   ]
  },
  {
   title:'Dialog 5 · Elena',
   audio:'Paul: Wie war dein erster Job? Elena: Ich war 18 und habe in einem Café gearbeitet. Am Anfang war vieles neu und ich hatte wenig Erfahrung. Eine Kollegin hat mir oft gezeigt, was ich machen soll. Heute arbeite ich in einem Restaurant. Viele Aufgaben mache ich schon allein, und neue Kollegen fragen manchmal mich. Paul: Das heißt, du hast viel gelernt? Elena: Ja.',
   qs:[
    C('Elena kann heute selbstständiger arbeiten als früher.',['Falsch','Richtig'],'Richtig'),
    C('Woran erkennt man, dass Elena heute erfahrener ist?',['Neue Kollegen fragen sie um Hilfe.','Sie braucht bei jeder Aufgabe Hilfe.','Sie arbeitet heute zum ersten Mal.'],'Neue Kollegen fragen sie um Hilfe.'),
    I('Was war am Anfang anders als heute?',['sie brauchte Hilfe','Elena brauchte Hilfe','sie hatte wenig Erfahrung','vieles war neu'],'Vergleiche den ersten Job mit ihrer Situation heute.')
   ]
  }
 ];
 const items=[];
 dialogues.forEach(d=>d.qs.forEach(q=>items.push({...q,context:d.title,audio:d.audio})));
 task.items=items;
 task.title='Arbeit früher und heute: 5 Hördialoge';
 task.kind='listening';task.icon='🎧';task.emoji='🎧';
 task.instruction='Höre den Dialog, verstehe die Situation und beantworte alle drei Fragen.';
 task.intro='Die Fragen wiederholen nicht einfach den Hörtext. Nutze Zusammenhang und Bedeutung.';
}

function timeTask(){
 const G='Gegenwart',V='Vergangenheit';
 const rows=[
  ['Heute ist mein Chef freundlich.',G],
  ['Jetzt habe ich viel Berufserfahrung.',G],
  ['Meine Kollegen sind heute im Büro.',G],
  ['Wir haben heute wenig Stress.',G],
  ['Du bist jetzt Kellnerin.',G],
  ['Ihr habt heute viel Zeit.',G],
  ['Das Café ist heute sehr voll.',G],
  ['Sie haben jetzt ein gutes Team.',G],
  ['Meine Arbeit ist heute einfach.',G],
  ['Ich habe heute viel Spaß bei der Arbeit.',G],
  ['Früher war mein Chef streng.',V],
  ['Vor zwei Jahren hatte ich keine Berufserfahrung.',V],
  ['Gestern waren meine Kollegen im Restaurant.',V],
  ['Damals hatten wir viel Stress.',V],
  ['Du warst früher Arbeiterin.',V],
  ['Ihr hattet gestern wenig Zeit.',V],
  ['Das Café war damals sehr klein.',V],
  ['Sie hatten früher ein großes Team.',V],
  ['Meine Arbeit war früher schwer.',V],
  ['Ich hatte damals wenig Spaß bei der Arbeit.',V]
 ];
 return {
  id:'gegenwart-vergangenheit-sortieren',title:'Gegenwart oder Vergangenheit?',kind:'time-sort',icon:'🕒',emoji:'🕒',spL8T3TimeSort:true,
  instruction:'Lies den Satz und ordne ihn der Gegenwart oder Vergangenheit zu.',
  intro:'Achte auf Zeitwörter und Verbformen. Präteritum kommt hier nur bei sein und haben vor.',
  items:rows.map(([sentence,answer])=>({sentence,answer:[answer]}))
 };
}

function imageTask(){
 const CDN='https://sprachpilot.b-cdn.net/';
 const rows=[
  ['berufserfahrung.webp','Welches Wort passt zum Bild?',['die Ausbildung','die Erfahrung','der Stress'],'die Erfahrung'],
  ['cafe.webp','Welcher Ort passt zum Bild?',['das Restaurant','das Büro','das Café'],'das Café'],
  ['stress.webp','Welches Wort beschreibt die Situation?',['der Spaß','die Erfahrung','der Stress'],'der Stress'],
  ['kellner.webp','Welcher Beruf passt?',['der Architekt','der Kellner','der Arbeiter'],'der Kellner'],
  ['kellnerin.webp','Welcher Beruf passt?',['die Arbeiterin','die Kellnerin','die Architektin'],'die Kellnerin'],
  ['restaurant.webp','Welcher Ort passt?',['das Café','das Restaurant','das Büro'],'das Restaurant'],
  ['architekt.webp','Welcher Beruf passt?',['der Arbeiter','der Kellner','der Architekt'],'der Architekt'],
  ['architektin.webp','Welcher Beruf passt?',['die Architektin','die Kellnerin','die Arbeiterin'],'die Architektin'],
  ['arbeiter.webp','Welcher Beruf passt?',['der Kellner','der Arbeiter','der Architekt'],'der Arbeiter'],
  ['arbeiterin.webp','Welcher Beruf passt?',['die Kellnerin','die Architektin','die Arbeiterin'],'die Arbeiterin'],
  ['kollege.webp','Welche Person passt?',['der Gast','der Kollege','der Kunde'],'der Kollege'],
  ['professionell.webp','Wie arbeitet die Person?',['schlecht','professionell','wenig'],'professionell'],
  ['einfach.webp','Wie ist die Aufgabe?',['stressig','schlecht','einfach'],'einfach'],
  ['schlecht.webp','Wie ist die Situation?',['toll','professionell','schlecht'],'schlecht'],
  ['spass_haben.webp','Was passt zur Situation?',['Stress haben','Spaß haben','wenig arbeiten'],'Spaß haben']
 ];
 return {
  id:'wortschatz-bild-verstehen',title:'Wortschatz mit Bildern',kind:'image-vocab',icon:'🖼️',emoji:'🖼️',spL8T3ImageVocab:true,
  instruction:'Schau auf das Bild und wähle das passende Wort aus Thema 3.',
  items:rows.map(([file,prompt,options,answer])=>({image:CDN+file,prompt,options,answer:[answer]}))
 };
}

function vocabListeningTask(){
 const rows=[
  ['Ich arbeite seit sechs Jahren in meinem Beruf und kenne viele Aufgaben schon sehr gut.','Was hat die Person wahrscheinlich?',['Stress','Erfahrung','wenig Zeit'],'Erfahrung'],
  ['Heute kommen sehr viele Gäste gleichzeitig. Ich habe keine Pause und muss alles schnell machen.','Was beschreibt die Situation?',['Spaß haben','Stress','Erfahrung'],'Stress'],
  ['Meine Pause dauert heute nur fünf Minuten.','Welches Wort passt?',['wenig','oft','toll'],'wenig'],
  ['Montag, Dienstag, Mittwoch, Donnerstag und Freitag arbeite ich bis achtzehn Uhr.','Welches Wort beschreibt das am besten?',['manchmal','oft','schlecht'],'oft'],
  ['An zwei Tagen in der Woche esse ich in der Kantine. An den anderen Tagen nehme ich Essen mit.','Welches Wort passt?',['immer','manchmal','professionell'],'manchmal'],
  ['Mein Chef erklärt ruhig, arbeitet genau und spricht freundlich mit Kunden.','Wie arbeitet der Chef?',['schlecht','professionell','einfach'],'professionell'],
  ['Ich lese die Aufgabe einmal und weiß sofort, was ich machen soll.','Wie ist die Aufgabe für mich?',['einfach','stressig','professionell'],'einfach'],
  ['Niemand hilft mir, mein Chef ist unfreundlich und ich gehe ungern zur Arbeit.','Wie finde ich die Arbeit?',['toll','schlecht','einfach'],'schlecht'],
  ['Mein Team ist nett, die Aufgaben sind interessant und ich gehe jeden Morgen gern zur Arbeit.','Wie finde ich die Arbeit?',['wenig','toll','schlecht'],'toll'],
  ['Ich lache viel mit meinem Team und freue mich auf die gemeinsame Pause.','Was passt?',['Stress haben','Spaß haben','wenig Zeit haben'],'Spaß haben'],
  ['Hier bestellen die Gäste Kaffee, Tee und Kuchen. Viele sitzen nur kurz am Tisch.','Welcher Ort passt?',['Restaurant','Café','Büro'],'Café'],
  ['Die Gäste bestellen Vorspeise, Hauptgericht und Getränke. Danach bezahlen sie am Tisch.','Welcher Ort passt?',['Café','Restaurant','Werkstatt'],'Restaurant'],
  ['Er nimmt Bestellungen auf, bringt Getränke und später das Essen an den Tisch.','Welcher Beruf passt?',['Architekt','Arbeiter','Kellner'],'Kellner'],
  ['Sie plant Häuser, zeichnet Räume und spricht mit Kunden über neue Gebäude.','Welcher Beruf passt?',['Arbeiterin','Architektin','Kellnerin'],'Architektin'],
  ['Sie arbeitet in einer großen Fabrik und hilft bei der Produktion.','Welcher Beruf passt?',['Kellnerin','Arbeiterin','Architektin'],'Arbeiterin']
 ];
 return {
  id:'wortschatz-hoeren-verstehen',title:'Wortschatz hören und verstehen',kind:'listening',icon:'🎙️',emoji:'🎙️',
  instruction:'Höre die Situation und wähle das passende Wort. Das Lösungswort wird nicht vorgelesen.',
  items:rows.map(([audio,prompt,options,answer])=>C(prompt,options,answer,{audio}))
 };
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 improveListening(theme.tasks.find(t=>String(t?.id)==='hoeren-arbeit-frueher-heute-fuenf-dialoge'));
 const ids=new Set(['gegenwart-vergangenheit-sortieren','wortschatz-bild-verstehen','wortschatz-hoeren-verstehen']);
 const base=theme.tasks.filter(t=>!ids.has(String(t?.id||'')));
 const exam=base.find(t=>t?.exam)||null;
 const normal=base.filter(t=>!t?.exam);
 theme.tasks=[...normal,timeTask(),imageTask(),vocabListeningTask(),...(exam?[exam]:[])];
 theme.contentRevision=String(theme.contentRevision||'l8t3')+'-context-learning-v1';
 return theme;
}

const previous=window.L8_CONTENT_READY;
window.L8_T3_PEDAGOGY_CONTEXT_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=themeOf(all,3);apply(theme);
 if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;
 return themes;
}).catch(error=>{console.error('L8T3 Kontext-Patch konnte nicht angewendet werden',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_PEDAGOGY_CONTEXT_READY;
window.L8T3PedagogyContextPatch20260902={apply,version:1};
})();
