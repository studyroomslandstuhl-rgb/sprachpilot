(function(){
'use strict';
const D=window.L9T2;if(!D)return;
const RF=['Richtig','Falsch'];
const q=(text,answer)=>({q:text,answer,options:[...RF]});

/* Aufgabe 12: echte Regeln aus offiziellen Quellen, sprachlich vereinfacht.
   Didaktik: kurze Hauptsätze. Aussagen benutzen bekannten Wortschatz aus L3–L9.
   Keine Aussage kopiert die entscheidende Formulierung wortwörtlich aus dem Text. */
D.ruleReadings=[
 {
  id:'bad01',
  title:'Freibad Winnweiler – Besuch und Zutritt',
  text:'Im Freibad gelten feste Regeln. Alle Gäste beachten die Hinweise des Personals. Rauchen ist in den Umkleiden, bei den Toiletten und am Wasser verboten. Rund um das Kleinkinderbecken gilt das Rauchverbot auch. Gefundene Sachen bringt man zum Personal. Fotos von anderen Badegästen brauchen deren Zustimmung. Kinder unter zehn Jahren kommen nur mit einer erwachsenen Begleitperson ins Bad. Jeder Gast braucht eine gültige Eintrittskarte. Den Bon behält man bis zum Ende. Das Personal kann den Bon kontrollieren.',
  questions:[
   q('Eine Mitarbeiterin sagt zu Tom: „Gehen Sie bitte hier weg.“ Tom bleibt einfach dort.','Falsch'),
   q('Paul steht direkt beim Kinderbecken. Dort darf er keine Zigarette rauchen.','Richtig'),
   q('Mina findet ein Handy auf der Wiese. Sie gibt es bei einer Mitarbeiterin ab.','Richtig'),
   q('Lea kennt die Frau neben ihr nicht. Sie darf sofort ein Foto von ihr machen.','Falsch'),
   q('Noah ist neun Jahre alt. Er darf ohne Erwachsene allein ins Freibad.','Falsch'),
   q('Amir hat bezahlt. Er behält den Zettel. Später kann er ihn einem Mitarbeiter zeigen.','Richtig')
  ]
 },
 {
  id:'bad02',
  title:'Freibad Winnweiler – Vor und im Wasser',
  text:'Vor dem Schwimmen duschen sich die Badegäste. Straßenschuhe bleiben außerhalb der Barfußbereiche. Im Nassbereich trägt man Badekleidung. Jeans und normale T-Shirts gehören dort nicht hin. Das Sprungbrett ist nicht immer geöffnet. Das Aufsichtspersonal gibt es frei. Auf dem Brett steht nur eine Person. Im Wasser darunter braucht man freien Platz. Bei Gewitter verlassen alle Gäste sofort die Becken. Das Personal kann das Baden ebenfalls stoppen. Schwimmflossen, Schnorchel und andere Geräte brauchen vorher die Erlaubnis der Aufsicht.',
  questions:[
   q('Sara geht zuerst unter die Dusche. Danach geht sie schwimmen.','Richtig'),
   q('Tom darf mit seinen Schuhen von der Straße bis direkt an das Becken gehen.','Falsch'),
   q('Mia trägt eine Jeans. So darf sie in den nassen Bereich am Becken.','Falsch'),
   q('Das Sprungbrett ist geschlossen. Die Kinder dürfen es selbst öffnen.','Falsch'),
   q('Es gibt ein starkes Gewitter. Ben geht aus dem Wasser.','Richtig'),
   q('Ben möchte Schwimmflossen benutzen. Er fragt vorher das Personal.','Richtig')
  ]
 },
 {
  id:'bad03',
  title:'Freibad Winnweiler – Rutsche und Verhalten',
  text:'Die große Wasserrutsche ist ab sechs Jahren erlaubt. Kinder unter acht Jahren brauchen dort die Aufsicht einer erziehungsberechtigten Person. Auf der Rutsche sitzt man. Nach der Fahrt verlässt man das Landebecken sofort. Rund um die Schwimmbecken ist Rennen verboten. Andere Gäste darf man nicht unter Wasser drücken. Auch Schubsen ins Becken ist verboten. Ballspiele finden nur in bestimmten Bereichen statt. Stühle und Liegen bleiben frei für die aktuelle Nutzung. Eine Reservierung ist nicht erlaubt. Essen und Getränke gehören nur in die dafür bestimmten Bereiche. Im Kleinkinderbereich achten die begleitenden Erwachsenen selbst auf die Kinder.',
  questions:[
   q('Lina ist fünf Jahre alt. Sie darf die große Rutsche benutzen.','Falsch'),
   q('Mia ist sieben. An der Rutsche ist eine erwachsene Person bei ihr.','Richtig'),
   q('Paul benutzt die Rutsche im Sitzen.','Richtig'),
   q('Zwei Freunde machen direkt neben dem Becken ein Wettrennen.','Falsch'),
   q('Eine Gruppe spielt mit dem Ball nur auf einem Platz für Ballspiele.','Richtig'),
   q('Eva legt morgens ein Handtuch auf eine Liege. Dann geht sie lange weg. Die Liege bleibt für sie reserviert.','Falsch')
  ]
 },
 {
  id:'bib01',
  title:'Stadtbibliothek Köln – Regeln im Haus',
  text:'In der Stadtbibliothek brauchen alle Besucher Ruhe. Laute Gespräche stören andere Menschen. Essen, Trinken und Rauchen sind im Haus nicht erlaubt. So bleiben Bücher und andere Medien sauber. Tiere bleiben normalerweise draußen. Assistenzhunde dürfen mitkommen. Kinder unter sieben Jahren besuchen die Bibliothek mit einer erwachsenen Person. Garderobenschränke werden nur während des Besuchs benutzt. Vor dem Verlassen leert man den Schrank. Den Schlüssel lässt man dort. Die Hinweise des Bibliothekspersonals gelten für alle Besucher.',
  questions:[
   q('Tom und Ali sprechen leise zwischen den Büchern.','Richtig'),
   q('Nora liest ein Buch und trinkt dabei Saft.','Falsch'),
   q('Anna kommt mit ihrem normalen Hund. Der Hund darf mit hinein.','Falsch'),
   q('Mia ist sechs Jahre alt. Ihre Mutter kommt mit in die Bibliothek.','Richtig'),
   q('Ali geht nach Hause. Seine Jacke bleibt im Schrank. Den Schlüssel nimmt er mit.','Falsch'),
   q('Eine Mitarbeiterin sagt: „Sprechen Sie bitte leise.“ Tom spricht danach leiser.','Richtig')
  ]
 },
 {
  id:'amt01',
  title:'Bürgeramt Berlin – Termin und Warten',
  text:'Für viele Anliegen im Bürgeramt ist ein Termin nötig. Terminkunden kommen ungefähr fünf Minuten früher. Die Vorgangsnummer liegt am besten schon bereit. Danach wartet man im Wartebereich. Auf einem Bildschirm erscheint die nächste Nummer. Für mehrere Personen mit eigenen Anliegen braucht man mehrere Termine. Bei einem nachgewiesenen dringenden Fall ist auch ein Besuch am selben Tag möglich. Dabei kann eine längere Wartezeit entstehen. Einige Dienstleistungen funktionieren auch schriftlich oder online. Ein persönlicher Besuch ist dafür nicht nötig.',
  questions:[
   q('Alis Termin ist um 10 Uhr. Er kommt um 9:55 Uhr.','Richtig'),
   q('Omar sieht seine Nummer noch nicht auf dem Bildschirm. Er geht sofort zum Schalter.','Falsch'),
   q('Fatima ist noch nicht dran. Sie wartet im Wartebereich.','Richtig'),
   q('Eine Mutter und ihr Sohn haben zwei verschiedene Sachen für das Amt. Ein Termin reicht für beide.','Falsch'),
   q('Ein Problem ist sehr dringend. Ein Besuch am gleichen Tag kann möglich sein.','Richtig'),
   q('Anna kann ihren Antrag online machen. Trotzdem muss sie persönlich zum Amt fahren.','Falsch')
  ]
 }
];

const task=(D.tasks||[]).find(x=>x.id==='regeln-lesen');
if(task){
 task.title='Regeln lesen';
 task.description='Lies den Text. Ist der Satz richtig oder falsch?';
 task.instruction='Lies den Text. Ist der Satz richtig oder falsch?';
 task.icon='📚';
}
})();
