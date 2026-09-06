(function(){
'use strict';
const D=window.L9T2;if(!D)return;

/* Aufgabe 12: echte Regeln aus offiziellen Quellen, sprachlich auf etwa B1 vereinfacht.
   Didaktik: kurze Hauptsätze. Keine wortgleichen Fragen. Die Fragen benutzen nur
   einfachen, bereits bekannten Wortschatz aus Lektion 3 bis Lektion 9. */
D.ruleReadings=[
 {
  id:'bad01',
  title:'Freibad Winnweiler – Besuch und Zutritt',
  text:'Im Freibad gelten feste Regeln. Alle Gäste beachten die Hinweise des Personals. Rauchen ist in den Umkleiden, bei den Toiletten und am Wasser verboten. Rund um das Kleinkinderbecken gilt das Rauchverbot auch. Gefundene Sachen bringt man zum Personal. Fotos von anderen Badegästen brauchen deren Zustimmung. Kinder unter zehn Jahren kommen nur mit einer erwachsenen Begleitperson ins Bad. Jeder Gast braucht eine gültige Eintrittskarte. Den Bon behält man bis zum Ende. Das Personal kann den Bon kontrollieren.',
  questions:[
   {q:'Eine Mitarbeiterin sagt zu Tom: „Gehen Sie bitte hier weg.“ Was muss Tom machen?',answer:'weggehen',options:['weggehen','warten','lachen','bezahlen']},
   {q:'Paul hat eine Zigarette. Er steht direkt beim Kinderbecken. Darf er dort rauchen?',answer:'nein',options:['nein','ja','nur am Abend','nur am Montag']},
   {q:'Mina sieht ein Handy auf der Wiese. Wem soll sie das Handy geben?',answer:'dem Personal',options:['dem Personal','einem Freund','einem Kind','niemandem']},
   {q:'Lea will ein Foto von einer fremden Frau machen. Was soll Lea zuerst machen?',answer:'die Frau fragen',options:['die Frau fragen','eine Fahrkarte kaufen','zur Kasse gehen','das Handy ausmachen']},
   {q:'Noah ist neun Jahre alt. Er kommt allein zum Freibad. Darf er allein hinein?',answer:'nein',options:['nein','ja','nur morgens','nur am Wochenende']},
   {q:'Amir hat schon bezahlt. Später fragt ein Mitarbeiter nach seinem Zettel. Was macht Amir?',answer:'den Zettel zeigen',options:['den Zettel zeigen','den Zettel wegwerfen','noch einmal bezahlen','nach Hause gehen']}
  ]
 },
 {
  id:'bad02',
  title:'Freibad Winnweiler – Vor und im Wasser',
  text:'Vor dem Schwimmen duschen sich die Badegäste. Straßenschuhe bleiben außerhalb der Barfußbereiche. Im Nassbereich trägt man Badekleidung. Jeans und normale T-Shirts gehören dort nicht hin. Das Sprungbrett ist nicht immer geöffnet. Das Aufsichtspersonal gibt es frei. Auf dem Brett steht nur eine Person. Im Wasser darunter braucht man freien Platz. Bei Gewitter verlassen alle Gäste sofort die Becken. Das Personal kann das Baden ebenfalls stoppen. Schwimmflossen, Schnorchel und andere Geräte brauchen vorher die Erlaubnis der Aufsicht.',
  questions:[
   {q:'Sara war noch nicht unter der Dusche. Darf sie schon schwimmen?',answer:'nein',options:['nein','ja','nur kurz','nur mit Schuhen']},
   {q:'Tom kommt mit seinen Schuhen von der Straße. Darf er damit bis zum Becken gehen?',answer:'nein',options:['nein','ja','nur bei Regen','nur am Abend']},
   {q:'Mia hat eine Jeans an. Kann sie so ins Wasser gehen?',answer:'nein',options:['nein','ja','nur morgens','nur im Winter']},
   {q:'Das Sprungbrett ist zu. Wer kann sagen: „Jetzt dürft ihr springen.“?',answer:'das Personal',options:['das Personal','die Kinder','die Gäste','die Kasse']},
   {q:'Es gibt ein starkes Gewitter. Bleibt Ben im Wasser?',answer:'nein',options:['nein','ja','nur fünf Minuten','nur mit einem Freund']},
   {q:'Ben will Schwimmflossen benutzen. Was macht er zuerst?',answer:'das Personal fragen',options:['das Personal fragen','eine zweite Karte kaufen','einen Vertrag schreiben','das Handy laden']}
  ]
 },
 {
  id:'bad03',
  title:'Freibad Winnweiler – Rutsche und Verhalten',
  text:'Die große Wasserrutsche ist ab sechs Jahren erlaubt. Kinder unter acht Jahren brauchen dort die Aufsicht einer erziehungsberechtigten Person. Auf der Rutsche sitzt man. Nach der Fahrt verlässt man das Landebecken sofort. Rund um die Schwimmbecken ist Rennen verboten. Andere Gäste darf man nicht unter Wasser drücken. Auch Schubsen ins Becken ist verboten. Ballspiele finden nur in bestimmten Bereichen statt. Stühle und Liegen bleiben frei für die aktuelle Nutzung. Eine Reservierung ist nicht erlaubt. Essen und Getränke gehören nur in die dafür bestimmten Bereiche. Im Kleinkinderbereich achten die begleitenden Erwachsenen selbst auf die Kinder.',
  questions:[
   {q:'Lina ist fünf Jahre alt. Darf sie die große Rutsche benutzen?',answer:'nein',options:['nein','ja','nur allein','nur am Abend']},
   {q:'Mia ist sieben. Sie möchte zur Rutsche. Kann sie dort allein bleiben?',answer:'nein',options:['nein','ja','nur kurz','nur morgens']},
   {q:'Paul steht auf der Rutsche. Ist das richtig?',answer:'nein',options:['nein','ja','nur einmal','nur mit Freunden']},
   {q:'Zwei Freunde laufen sehr schnell direkt neben dem Becken. Dürfen sie das?',answer:'nein',options:['nein','ja','nur mit Schuhen','nur am Abend']},
   {q:'Eine Gruppe hat einen Ball. Darf sie überall im Freibad Fußball spielen?',answer:'nein',options:['nein','ja','nur im Wasser','nur auf der Rutsche']},
   {q:'Eva legt ein Handtuch auf eine Liege und geht lange weg. Darf die Liege für sie frei bleiben?',answer:'nein',options:['nein','ja','nur bis Mittag','nur am Wochenende']}
  ]
 },
 {
  id:'bib01',
  title:'Stadtbibliothek Köln – Regeln im Haus',
  text:'In der Stadtbibliothek brauchen alle Besucher Ruhe. Laute Gespräche stören andere Menschen. Essen, Trinken und Rauchen sind im Haus nicht erlaubt. So bleiben Bücher und andere Medien sauber. Tiere bleiben normalerweise draußen. Assistenzhunde dürfen mitkommen. Kinder unter sieben Jahren besuchen die Bibliothek mit einer erwachsenen Person. Garderobenschränke werden nur während des Besuchs benutzt. Vor dem Verlassen leert man den Schrank. Den Schlüssel lässt man dort. Die Hinweise des Bibliothekspersonals gelten für alle Besucher.',
  questions:[
   {q:'Tom und Ali reden sehr laut. Was sollen sie machen?',answer:'leise sprechen',options:['leise sprechen','lauter sprechen','Musik anmachen','lachen']},
   {q:'Nora hat Durst. Sie möchte ihre Flasche öffnen. Darf sie dort trinken?',answer:'nein',options:['nein','ja','nur morgens','nur am Computer']},
   {q:'Anna kommt mit einem normalen Hund. Darf der Hund mit hinein?',answer:'nein',options:['nein','ja','nur am Samstag','nur am Morgen']},
   {q:'Mia ist sechs Jahre alt. Sie kommt ohne Mutter oder Vater. Darf sie allein hinein?',answer:'nein',options:['nein','ja','nur mit einer Fahrkarte','nur mit einem Handy']},
   {q:'Ali will nach Hause. Seine Jacke liegt noch im Schrank. Was muss er vorher machen?',answer:'die Jacke nehmen und den Schlüssel dort lassen',options:['die Jacke nehmen und den Schlüssel dort lassen','den Schlüssel mitnehmen','die Jacke im Schrank lassen','den Schrank abschließen und gehen']},
   {q:'Eine Mitarbeiterin sagt: „Sprechen Sie bitte leise.“ Was macht Tom?',answer:'leise sprechen',options:['leise sprechen','laut sprechen','weggehen','das Handy anmachen']}
  ]
 },
 {
  id:'amt01',
  title:'Bürgeramt Berlin – Termin und Warten',
  text:'Für viele Anliegen im Bürgeramt ist ein Termin nötig. Terminkunden kommen ungefähr fünf Minuten früher. Die Vorgangsnummer liegt am besten schon bereit. Danach wartet man im Wartebereich. Auf einem Bildschirm erscheint die nächste Nummer. Für mehrere Personen mit eigenen Anliegen braucht man mehrere Termine. Bei einem nachgewiesenen dringenden Fall ist auch ein Besuch am selben Tag möglich. Dabei kann eine längere Wartezeit entstehen. Einige Dienstleistungen funktionieren auch schriftlich oder online. Ein persönlicher Besuch ist dafür nicht nötig.',
  questions:[
   {q:'Alis Termin ist um 10 Uhr. Er ist um 9:55 Uhr da. Ist das eine gute Zeit?',answer:'ja',options:['ja','nein','nur am Montag','nur ohne Termin']},
   {q:'Omar sieht viele Nummern auf dem Bildschirm. Wie weiß er: Jetzt bin ich dran?',answer:'Er schaut auf seine Nummer.',options:['Er schaut auf seine Nummer.','Er fragt jeden Besucher.','Er geht sofort zum Schalter.','Er ruft laut seinen Namen.']},
   {q:'Fatima ist noch nicht dran. Soll sie schon zum Schalter gehen?',answer:'nein',options:['nein','ja','nur mit einem Freund','nur am Morgen']},
   {q:'Eine Mutter und ihr Sohn brauchen beide etwas vom Amt. Reicht ein Termin für beide?',answer:'nein',options:['nein','ja','nur am Freitag','nur mit Ausweis']},
   {q:'Das Problem ist sehr dringend. Kann man vielleicht noch heute zum Amt?',answer:'ja',options:['ja','nein','nur nächste Woche','nur ohne Unterlagen']},
   {q:'Anna kann ihren Antrag online machen. Muss sie dafür zum Amt fahren?',answer:'nein',options:['nein','ja','nur morgens','nur mit Kindern']}
  ]
 }
];

const task=(D.tasks||[]).find(x=>x.id==='regeln-lesen');
if(task){
 task.title='Regeln lesen';
 task.description='Lies die Regeln und antworte.';
 task.instruction='Lies die Regeln und antworte.';
 task.icon='📚';
}
})();
