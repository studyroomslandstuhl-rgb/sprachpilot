(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const img=id=>`${CDN}${id}.webp`;

D.exam=[
 {
  id:'exam01',kind:'input',
  prompt:'Welches Dokument ist auf dem Bild? Schreibe das Wort mit Artikel.',
  image:img('fuehrerschein'),
  answer:'der Führerschein',
  hint:'Schreibe das Nomen mit dem bestimmten Artikel.'
 },
 {
  id:'exam02',kind:'input',
  prompt:'Welche Maschine ist auf dem Bild? Schreibe das Wort mit Artikel.',
  image:img('automat'),
  answer:'der Automat',
  hint:'Schreibe das Nomen mit dem bestimmten Artikel.'
 },
 {
  id:'exam03',kind:'choice',
  prompt:'Dokumente und Papiere, die man für einen Antrag oder einen Termin braucht.',
  options:['der Antrag','die Unterlagen','das Wechselgeld','die Fahrt'],
  answer:'die Unterlagen',
  hint:'Gesucht ist ein Pluralwort für notwendige Dokumente.'
 },
 {
  id:'exam04',kind:'choice',
  prompt:'Geld, das man zurückbekommt, wenn man mehr bezahlt als etwas kostet.',
  options:['das Ticket','die Fahrkarte','das Wechselgeld','die Papiere'],
  answer:'das Wechselgeld',
  hint:'Man bekommt es nach dem Bezahlen zurück.'
 },
 {
  id:'exam05',kind:'choice',
  prompt:'Ich fahre morgen zur Behörde. Dort muss ich zeigen, wer ich bin. Was brauche ich?',
  options:['das Wechselgeld','den Ausweis','das Ziel','die Fahrt'],
  answer:'den Ausweis',
  hint:'Gesucht ist ein offizielles Dokument zur Identifikation.'
 },
 {
  id:'exam06',kind:'input',
  prompt:'Schreibe den ganzen Satz: wir / morgen / die Unterlagen / zum Amt / müssen / mitbringen',
  answer:'Wir müssen morgen die Unterlagen zum Amt mitbringen.',
  answers:['Wir müssen morgen die Unterlagen zum Amt mitbringen'],
  hint:'Das konjugierte Modalverb steht an Position 2, der Infinitiv am Ende.'
 },
 {
  id:'exam07',kind:'input',
  prompt:'Ordne und schreibe den ganzen Satz: morgen / Maria / den Antrag / müssen / ausfüllen',
  answer:'Morgen muss Maria den Antrag ausfüllen.',
  answers:['Morgen muss Maria den Antrag ausfüllen'],
  hint:'Nach „Morgen“ steht das konjugierte Verb, der Infinitiv steht am Ende.'
 },
 {
  id:'exam08',kind:'input',
  prompt:'Ergänze die richtige Form von müssen: Ich ___ morgen meinen Ausweis mitbringen.',
  answer:'muss',
  hint:'Achte auf das Pronomen ich.'
 },
 {
  id:'exam09',kind:'input',
  prompt:'Ergänze die richtige Form von müssen: Ihr ___ zuerst das Ziel wählen.',
  answer:'müsst',
  hint:'Achte auf das Pronomen ihr.'
 },
 {
  id:'exam10',kind:'input',
  prompt:'Ergänze die richtige Form von müssen: Am Schalter ___ Sie Ihren Namen wiederholen.',
  answer:'müssen',
  hint:'Achte auf die höfliche Form Sie.'
 },
 {
  id:'exam11',kind:'choice',
  prompt:'Ich habe morgen einen Termin beim Amt. Ich ___ meinen Ausweis mitbringen.',
  options:['kann','möchte','muss','mag'],
  answer:'muss',
  hint:'Der Ausweis ist für den Termin notwendig.'
 },
 {
  id:'exam12',kind:'choice',
  prompt:'Am Schalter: „Guten Tag. Ich ___ einen Antrag stellen.“',
  options:['muss','möchte','kann','mag'],
  answer:'möchte',
  hint:'Gesucht ist ein höflicher Wunsch.'
 },
 {
  id:'exam13',kind:'input',
  prompt:'Ordne und schreibe den ganzen Satz: zuerst / man / das Ziel / müssen / wählen',
  answer:'Zuerst muss man das Ziel wählen.',
  answers:['Zuerst muss man das Ziel wählen'],
  hint:'Zuerst + muss + man + weitere Satzteile + Infinitiv.'
 },
 {
  id:'exam14',kind:'input',
  prompt:'Ordne und schreibe den ganzen Satz: zum Schluss / man / die Fahrkarte / müssen / nehmen',
  answer:'Zum Schluss muss man die Fahrkarte nehmen.',
  answers:['Zum Schluss muss man die Fahrkarte nehmen'],
  hint:'Zum Schluss + muss + man + weitere Satzteile + Infinitiv.'
 },
 {
  id:'exam15',kind:'choice',
  prompt:'Du kaufst eine Fahrkarte am Automaten. Welche Reihenfolge ist richtig?',
  options:[
   'Ziel wählen → Erwachsene auswählen → bezahlen → Fahrkarte nehmen',
   'Bezahlen → Ziel wählen → Fahrkarte nehmen → Erwachsene auswählen',
   'Erwachsene auswählen → Fahrkarte nehmen → Ziel wählen → bezahlen',
   'Fahrkarte nehmen → bezahlen → Ziel wählen → Erwachsene auswählen'
  ],
  answer:'Ziel wählen → Erwachsene auswählen → bezahlen → Fahrkarte nehmen',
  hint:'Beginne mit dem Ziel und beende den Ablauf mit der Fahrkarte.'
 }
];

const examTask=(D.tasks||[]).find(t=>t.id==='pruefung'||t.kind==='exam');
if(examTask){
 examTask.id='pruefung';
 examTask.kind='exam';
 examTask.exam=true;
 examTask.icon='⭐';
 examTask.title='Prüfung';
 examTask.description='Teste dein Wissen.';
}
})();
