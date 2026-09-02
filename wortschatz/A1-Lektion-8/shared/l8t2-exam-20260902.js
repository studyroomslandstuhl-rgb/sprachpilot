(function(){
'use strict';
if(window.__SP_L8T2_EXAM_20260902)return;
window.__SP_L8T2_EXAM_20260902=true;

const C=(prompt,options,answer,context='')=>({type:'choice',prompt,options,answer,context,hint:''});

const EXAM_ITEMS=[
 C('Was bedeutet „die Ausbildung“?',['Man lernt einen Beruf.','Man sucht eine Wohnung.','Man macht Urlaub.'],'Man lernt einen Beruf.'),
 C('Was bedeutet „die Erfahrung“?',['Man hat etwas schon gemacht und kennt es.','Man hat heute frei.','Man arbeitet nur am Abend.'],'Man hat etwas schon gemacht und kennt es.'),
 C('Welcher Plural ist richtig?',['die Berufe','die Berüfe','die Berufen'],'die Berufe','Singular: der Beruf'),
 C('Welcher Plural ist richtig?',['die Jahre','die Jahren','die Jähre'],'die Jahre','Singular: das Jahr'),
 C('Was passt?',['seit','vor','für'],'seit','Ich arbeite ___ zwei Jahren in einem Café.'),
 C('Was passt?',['vor','seit','für'],'vor','Ich habe ___ drei Jahren meine Ausbildung gemacht.'),
 C('Welche Frage passt zur Antwort „Seit Januar.“?',['Seit wann arbeitest du hier?','Wann hast du die Ausbildung beendet?','Wie alt bist du?'],'Seit wann arbeitest du hier?'),
 C('Welche Antwort passt?',['Vor einem Jahr.','Seit einem Jahr.','Für einem Jahr.'],'Vor einem Jahr.','Wann hast du dein Praktikum gemacht?'),
 C('Welcher Satz ist richtig?',['Seit Mai arbeite ich als Verkäuferin.','Seit Mai habe ich als Verkäuferin gearbeitet.','Vor Mai arbeite ich als Verkäuferin.'],'Seit Mai arbeite ich als Verkäuferin.'),
 C('Welcher Satz ist richtig?',['Vor zwei Jahren habe ich ein Praktikum gemacht.','Seit zwei Jahren habe ich ein Praktikum gemacht.','Für zwei Jahren habe ich ein Praktikum gemacht.'],'Vor zwei Jahren habe ich ein Praktikum gemacht.'),
 C('Lies den Text. Was macht Amir heute?',['Er arbeitet als Koch.','Er macht ein Praktikum.','Er sucht eine Schule.'],'Er arbeitet als Koch.','Amir hat vor drei Jahren seine Ausbildung als Koch beendet. Seit zwei Jahren arbeitet er in einem Restaurant.'),
 C('Lies den Text. Seit wann arbeitet Amir im Restaurant?',['seit zwei Jahren','vor zwei Jahren','für zwei Jahren'],'seit zwei Jahren','Amir hat vor drei Jahren seine Ausbildung als Koch beendet. Seit zwei Jahren arbeitet er in einem Restaurant.'),
 C('Lies den Text. Was hat Lea gemacht?',['ein Praktikum','eine Wohnung','einen Führerschein'],'ein Praktikum','Lea hat vor einem Jahr ein Praktikum in einem Hotel gemacht. Jetzt sucht sie eine Ausbildung.'),
 C('Lies den Text. Was sucht Lea jetzt?',['eine Ausbildung','ein Hotelzimmer','einen Arzt'],'eine Ausbildung','Lea hat vor einem Jahr ein Praktikum in einem Hotel gemacht. Jetzt sucht sie eine Ausbildung.'),
 C('Welcher Satz passt in eine formelle Bewerbung?',['Sehr geehrte Frau Müller,','Hallo Müller!','Liebe Freundin,'],'Sehr geehrte Frau Müller,'),
 C('Welcher Satz nennt Berufserfahrung?',['Ich habe bereits ein Praktikum im Verkauf gemacht.','Ich wohne in Köln.','Heute ist Dienstag.'],'Ich habe bereits ein Praktikum im Verkauf gemacht.'),
 C('Welcher Satz ist höflich?',['Ich möchte mich gern bewerben.','Gib mir die Stelle.','Ich will den Job sofort.'],'Ich möchte mich gern bewerben.'),
 C('Welcher Abschluss passt zu einer Bewerbung?',['Mit freundlichen Grüßen','Bis später!','Tschüss!'],'Mit freundlichen Grüßen'),
 C('Welche Frage passt bei einem Telefonat wegen einer Stelle?',['Ist die Stelle noch frei?','Wie alt ist Ihr Sofa?','Wo ist das Schwimmbad?'],'Ist die Stelle noch frei?'),
 C('Welche Reihenfolge ist logisch?',['Ausbildung → Praktikum/erste Erfahrung → Arbeit','Arbeit → Geburt → Ausbildung','Bewerbung → Grundschule → Geburt'],'Ausbildung → Praktikum/erste Erfahrung → Arbeit')
];

function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let exam=theme.tasks.find(t=>t?.exam);
 if(!exam){
  exam={id:'pruefung',exam:true};
  theme.tasks.push(exam);
 }
 exam.exam=true;
 exam.title='Prüfung';
 exam.kind='choice';
 exam.icon='⭐';exam.emoji='⭐';
 exam.instruction='Prüfe Wortschatz, seit/vor, Berufswege und einfache Bewerbungssätze.';
 exam.items=EXAM_ITEMS;
 theme.contentRevision='l8t2-exam-20260902-v1';
 return theme;
}

window.L8_T2_EXAM_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=themeOf(all,2);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_EXAM_READY;
window.L8T2Exam20260902={apply};
})();
