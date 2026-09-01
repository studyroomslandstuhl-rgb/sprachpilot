(function(){
'use strict';
if(window.__SP_L8T2_DIALOG_GRAMMAR_20260901)return;
window.__SP_L8T2_DIALOG_GRAMMAR_20260901=true;

const CDN='https://sprachpilot.b-cdn.net/';
const IMG=id=>CDN+id+'.webp';
const blank=(image,answers)=>({image:IMG(image),answers:Array.isArray(answers)?answers:[answers]});
const dialog=(lines,blanks)=>({type:'dialog-blanks',lines,blanks});

const TASK3=[
 dialog(['A: Seit wann arbeitest du im Café?','B: Ich arbeite seit {{0}} hier.','A: Wie lange hat deine Ausbildung gedauert?','B: Drei {{1}}.'],[blank('jahr','einem Jahr'),blank('jahr','Jahre')]),
 dialog(['A: Wann hast du im Restaurant angefangen?','B: Vor zwei {{0}}.','A: Wie lange hast du dort gearbeitet?','B: Zwei {{1}}.'],[blank('monat','Monaten'),blank('monat','Monate')]),
 dialog(['A: Seit wann bist du bei dieser Firma?','B: Seit vier {{0}}.','A: Wie lange war dein Praktikum?','B: Vier {{1}}.'],[blank('tag','Tagen'),blank('tag','Tage')]),
 dialog(['A: Seit wann besuchst du den Kurs?','B: Seit {{0}}.','A: Wie lange dauert der Kurs insgesamt?','B: Sechs {{1}}.'],[blank('woche','einer Woche'),blank('woche','Wochen')]),
 dialog(['A: Wann war dein Bewerbungsgespräch?','B: Vor {{0}}.','A: Wie lange hat das Gespräch gedauert?','B: Eine {{1}}.'],[blank('stunde','einer Stunde'),blank('stunde','Stunde')]),
 dialog(['A: Wann hat die Chefin angerufen?','B: Vor fünf {{0}}.','A: Wie lange hat das Telefonat gedauert?','B: Zehn {{1}}.'],[blank('minute','Minuten'),blank('minute','Minuten')]),
 dialog(['A: Seit wann wartest du?','B: Seit dreißig {{0}}.','A: Wie lange dauert das Laden?','B: Nur zehn {{1}}.'],[blank('sekunde','Sekunden'),blank('sekunde','Sekunden')]),
 dialog(['A: Seit wann lernst du Deutsch?','B: Seit drei {{0}}.','A: Wie lange war dein erster Deutschkurs?','B: Ein {{1}}.','A: Und wann hat der neue Kurs angefangen?','B: Vor zwei {{2}}.'],[blank('jahr','Jahren'),blank('jahr','Jahr'),blank('monat','Monaten')]),
 dialog(['A: Wie lange arbeitest du schon in Köln?','B: Seit sechs {{0}}.','A: Wie lange hast du vorher in Bonn gearbeitet?','B: Zwei {{1}}.','A: Wann bist du nach Köln gekommen?','B: Vor sechs {{2}}.'],[blank('monat','Monaten'),blank('monat','Monate'),blank('monat','Monaten')]),
 dialog(['A: Seit wann machst du das Praktikum?','B: Seit fünf {{0}}.','A: Wie lange dauert es noch?','B: Drei {{1}}.','A: Wann hast du angefangen?','B: Vor fünf {{2}}.'],[blank('woche','Wochen'),blank('woche','Wochen'),blank('woche','Wochen')]),
 dialog(['A: Wann hast du die Ausbildung beendet?','B: Vor {{0}}.','A: Wie lange hat sie gedauert?','B: Drei {{1}}.','A: Seit wann arbeitest du als Koch?','B: Seit {{2}}.'],[blank('jahr','einem Jahr'),blank('jahr','Jahre'),blank('jahr','einem Jahr')]),
 dialog(['A: Seit wann arbeitest du heute?','B: Seit {{0}}.','A: Wie lange arbeitest du heute insgesamt?','B: Acht {{1}}.'],[blank('stunde','einer Stunde'),blank('stunde','Stunden')]),
 dialog(['A: Wann ist die Pause zu Ende?','B: In fünf {{0}}.','A: Wie lange dauert die Pause?','B: Fünfzehn {{1}}.'],[blank('minute','Minuten'),blank('minute','Minuten')]),
 dialog(['A: Seit wann wohnt deine Kollegin hier?','B: Seit {{0}}.','A: Wie lange hat sie vorher in Berlin gewohnt?','B: Vier {{1}}.'],[blank('monat','einem Monat'),blank('jahr','Jahre')]),
 dialog(['A: Wann hast du die Bewerbung geschickt?','B: Vor drei {{0}}.','A: Wie lange hast du auf die Antwort gewartet?','B: Drei {{1}}.'],[blank('tag','Tagen'),blank('tag','Tage')]),
 dialog(['A: Seit wann ist dein Chef im Urlaub?','B: Seit {{0}}.','A: Wie lange bleibt er weg?','B: Zwei {{1}}.'],[blank('woche','einer Woche'),blank('woche','Wochen')]),
 dialog(['A: Wann hast du heute angefangen?','B: Vor zwei {{0}}.','A: Wie lange hast du schon gearbeitet?','B: Zwei {{1}}.'],[blank('stunde','Stunden'),blank('stunde','Stunden')]),
 dialog(['A: Seit wann kennst du das Team?','B: Seit zehn {{0}}.','A: Wie lange war dein erster Arbeitstag?','B: Acht {{1}}.'],[blank('tag','Tagen'),blank('stunde','Stunden')]),
 dialog(['A: Wann hat das Praktikum begonnen?','B: Vor {{0}}.','A: Wie lange dauert es?','B: Einen {{1}}.','A: Seit wann bist du also hier?','B: Seit {{2}}.'],[blank('monat','einem Monat'),blank('monat','Monat'),blank('monat','einem Monat')]),
 dialog(['A: Seit wann wartet ihr auf den Bus?','B: Seit zwanzig {{0}}.','A: Wie lange dauert die Fahrt?','B: Vierzig {{1}}.','A: Wann ist der letzte Bus abgefahren?','B: Vor zwanzig {{2}}.'],[blank('minute','Minuten'),blank('minute','Minuten'),blank('minute','Minuten')])
];

const TASK5=[
 dialog(['A: Seit wann arbeitest du in diesem Café?','B: Ich arbeite {{0}} hier.','A: Wie lange hat deine Ausbildung gedauert?','B: {{1}}.'],[blank('jahr',['seit zwei Jahren','seit 2 Jahren']),blank('jahr',['drei Jahre','3 Jahre'])]),
 dialog(['A: Wann hast du bei der Firma angefangen?','B: {{0}}.','A: Wie lange arbeitest du schon dort?','B: {{1}}.'],[blank('monat',['vor sechs Monaten','vor 6 Monaten']),blank('monat',['seit sechs Monaten','seit 6 Monaten'])]),
 dialog(['A: Wie lange warst du im Praktikum?','B: {{0}}.','A: Wann war das Praktikum fertig?','B: {{1}}.'],[blank('woche',['vier Wochen','4 Wochen']),blank('woche',['vor zwei Wochen','vor 2 Wochen'])]),
 dialog(['A: Seit wann lernst du Deutsch?','B: {{0}}.','A: Wie lange hat dein erster Kurs gedauert?','B: {{1}}.','A: Wann hast du den Kurs beendet?','B: {{2}}.'],[blank('jahr',['seit drei Jahren','seit 3 Jahren']),blank('monat',['sechs Monate','6 Monate']),blank('jahr',['vor zwei Jahren','vor 2 Jahren'])]),
 dialog(['A: Wann bist du nach Köln gekommen?','B: {{0}}.','A: Wie lange wohnst du schon in Köln?','B: {{1}}.'],[blank('jahr',['vor fünf Jahren','vor 5 Jahren']),blank('jahr',['seit fünf Jahren','seit 5 Jahren'])]),
 dialog(['A: Wie lange hat das Bewerbungsgespräch gedauert?','B: {{0}}.','A: Wann hat die Chefin angerufen?','B: {{1}}.'],[blank('minute',['zwanzig Minuten','20 Minuten']),blank('minute',['vor zehn Minuten','vor 10 Minuten'])]),
 dialog(['A: Seit wann wartest du auf den Chef?','B: {{0}}.','A: Wie lange dauert die Besprechung später?','B: {{1}}.'],[blank('minute',['seit fünf Minuten','seit 5 Minuten']),blank('stunde',['eine Stunde','1 Stunde'])]),
 dialog(['A: Wann hast du die Ausbildung angefangen?','B: {{0}}.','A: Wie lange hat sie gedauert?','B: {{1}}.','A: Seit wann arbeitest du als Kellner?','B: {{2}}.'],[blank('jahr',['vor vier Jahren','vor 4 Jahren']),blank('jahr',['zwei Jahre','2 Jahre']),blank('jahr',['seit zwei Jahren','seit 2 Jahren'])]),
 dialog(['A: Wie lange hast du in Berlin gearbeitet?','B: {{0}}.','A: Wann bist du nach Hamburg gezogen?','B: {{1}}.'],[blank('jahr',['drei Jahre','3 Jahre']),blank('jahr',['vor einem Jahr','vor 1 Jahr'])]),
 dialog(['A: Seit wann bist du in Teilzeit?','B: {{0}}.','A: Wie lange warst du vorher in Vollzeit?','B: {{1}}.'],[blank('monat',['seit acht Monaten','seit 8 Monaten']),blank('jahr',['zwei Jahre','2 Jahre'])]),
 dialog(['A: Wann hast du die Bewerbung geschickt?','B: {{0}}.','A: Wie lange wartest du schon auf eine Antwort?','B: {{1}}.'],[blank('tag',['vor drei Tagen','vor 3 Tagen']),blank('tag',['seit drei Tagen','seit 3 Tagen'])]),
 dialog(['A: Wie lange dauert dein Praktikum?','B: {{0}}.','A: Seit wann machst du es schon?','B: {{1}}.'],[blank('monat',['zwei Monate','2 Monate']),blank('woche',['seit drei Wochen','seit 3 Wochen'])]),
 dialog(['A: Wann hast du deinen neuen Kollegen kennengelernt?','B: {{0}}.','A: Wie lange arbeitet ihr schon zusammen?','B: {{1}}.'],[blank('woche',['vor vier Wochen','vor 4 Wochen']),blank('woche',['seit vier Wochen','seit 4 Wochen'])]),
 dialog(['A: Wie lange war dein Deutschkurs?','B: {{0}}.','A: Wann hat der nächste Kurs angefangen?','B: {{1}}.'],[blank('monat',['fünf Monate','5 Monate']),blank('monat',['vor einem Monat','vor 1 Monat'])]),
 dialog(['A: Seit wann arbeitet Maria im Restaurant?','B: {{0}}.','A: Wann hat sie ihre Ausbildung beendet?','B: {{1}}.'],[blank('jahr',['seit einem Jahr','seit 1 Jahr']),blank('jahr',['vor einem Jahr','vor 1 Jahr'])]),
 dialog(['A: Wann war dein erster Arbeitstag?','B: {{0}}.','A: Wie lange arbeitest du heute schon?','B: {{1}}.'],[blank('stunde',['vor sechs Stunden','vor 6 Stunden']),blank('stunde',['seit sechs Stunden','seit 6 Stunden'])]),
 dialog(['A: Wie lange hast du gestern gearbeitet?','B: {{0}}.','A: Seit wann arbeitest du heute?','B: {{1}}.'],[blank('stunde',['acht Stunden','8 Stunden']),blank('stunde',['seit zwei Stunden','seit 2 Stunden'])]),
 dialog(['A: Wann hat Amir seine Ausbildung angefangen?','B: {{0}}.','A: Wie lange hat die Ausbildung gedauert?','B: {{1}}.','A: Seit wann arbeitet er im Krankenhaus?','B: {{2}}.'],[blank('jahr',['vor vier Jahren','vor 4 Jahren']),blank('jahr',['drei Jahre','3 Jahre']),blank('jahr',['seit einem Jahr','seit 1 Jahr'])]),
 dialog(['A: Seit wann wohnt Aylin in Köln?','B: {{0}}.','A: Wie lange hat sie vorher in Düsseldorf gewohnt?','B: {{1}}.','A: Wann ist sie nach Köln gezogen?','B: {{2}}.'],[blank('jahr',['seit zwei Jahren','seit 2 Jahren']),blank('jahr',['zwei Jahre','2 Jahre']),blank('jahr',['vor zwei Jahren','vor 2 Jahren'])]),
 dialog(['A: Wie lange warst du bei deinem alten Arbeitgeber?','B: {{0}}.','A: Wann hast du die neue Stelle angefangen?','B: {{1}}.','A: Seit wann bist du dort?','B: {{2}}.'],[blank('jahr',['fünf Jahre','5 Jahre']),blank('monat',['vor drei Monaten','vor 3 Monaten']),blank('monat',['seit drei Monaten','seit 3 Monaten'])])
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task3=theme.tasks.find(task=>task?.id==='zeitwoerter-seit-vor');
 if(task3){
  task3.title='Zeitangaben: Formen';
  task3.instruction='Ergänze die Lücken.';
  task3.kind='dialog-blanks';
  task3.icon='✍️';task3.emoji='✍️';
  delete task3.intro;
  task3.items=TASK3.map(item=>({type:item.type,lines:[...item.lines],blanks:item.blanks.map(b=>({...b,answers:[...b.answers]}))}));
 }
 const practice=theme.tasks.filter(task=>!task?.exam);
 const task5=practice[4];
 if(task5){
  task5.title='Seit, vor oder Dauer?';
  task5.instruction='Ergänze die passenden Zeitangaben.';
  task5.kind='dialog-blanks';
  task5.icon='✍️';task5.emoji='✍️';
  delete task5.intro;
  task5.items=TASK5.map(item=>({type:item.type,lines:[...item.lines],blanks:item.blanks.map(b=>({...b,answers:[...b.answers]}))}));
 }
 theme.contentRevision='l8t2-dialog-grammar-20260901-v1';
 return theme;
}

window.L8_T2_DIALOG_GRAMMAR_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_DIALOG_GRAMMAR_READY;
window.L8T2DialogGrammar={apply};
})();
