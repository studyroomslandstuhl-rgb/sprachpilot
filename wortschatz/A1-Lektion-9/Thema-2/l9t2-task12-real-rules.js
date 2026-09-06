(function(){
'use strict';
const D=window.L9T2;if(!D)return;

/* Aufgabe 12: echte Regeln aus offiziellen Quellen, sprachlich auf etwa B1 vereinfacht.
   Didaktik: kurze Hauptsätze. Keine wortgleichen Fragen. Fragen prüfen Bedeutung
   über Synonyme, Umschreibungen und kleine Situationen. */
D.ruleReadings=[
 {
  id:'bad01',
  title:'Freibad Winnweiler – Besuch und Zutritt',
  text:'Im Freibad gelten feste Regeln. Alle Gäste beachten die Hinweise des Personals. Rauchen ist in den Umkleiden, bei den Toiletten und am Wasser verboten. Rund um das Kleinkinderbecken gilt das Rauchverbot auch. Gefundene Sachen bringt man zum Personal. Fotos von anderen Badegästen brauchen deren Zustimmung. Kinder unter zehn Jahren kommen nur mit einer erwachsenen Begleitperson ins Bad. Jeder Gast braucht eine gültige Eintrittskarte. Den Bon behält man bis zum Ende. Das Personal kann den Bon kontrollieren.',
  questions:[
   {q:'Eine Mitarbeiterin sagt: „Bitte verlassen Sie diesen Bereich.“ Was macht ein Gast?',answer:'Er folgt der Anweisung.',options:['Er folgt der Anweisung.','Er ignoriert sie.','Er fragt andere Gäste.','Er bleibt immer dort.']},
   {q:'Paul möchte direkt neben dem Kinderbecken eine Zigarette rauchen. Ist das möglich?',answer:'nein',options:['nein','ja','nur am Abend','nur ohne Kinder']},
   {q:'Mina findet ein Handy auf der Wiese. Was ist richtig?',answer:'Sie gibt es beim Personal ab.',options:['Sie gibt es beim Personal ab.','Sie nimmt es mit nach Hause.','Sie legt es ins Wasser.','Sie verkauft es.']},
   {q:'Lea möchte fremde Besucher filmen. Was braucht sie zuerst?',answer:'deren Erlaubnis',options:['deren Erlaubnis','eine neue Eintrittskarte','einen Führerschein','einen Termin']},
   {q:'Noah ist neun Jahre alt. Er möchte ins Freibad. Was fehlt ihm ohne Eltern?',answer:'eine erwachsene Begleitung',options:['eine erwachsene Begleitung','ein Buch','ein Vertrag','eine Anmeldung']},
   {q:'Nach dem Bezahlen steckt Amir den Kassenzettel ein. Wofür kann er ihn später brauchen?',answer:'für eine Kontrolle',options:['für eine Kontrolle','für die Dusche','für ein Essen','für eine Liege']}
  ]
 },
 {
  id:'bad02',
  title:'Freibad Winnweiler – Vor und im Wasser',
  text:'Vor dem Schwimmen duschen sich die Badegäste. Straßenschuhe bleiben außerhalb der Barfußbereiche. Im Nassbereich trägt man Badekleidung. Jeans und normale T-Shirts gehören dort nicht hin. Das Sprungbrett ist nicht immer geöffnet. Das Aufsichtspersonal gibt es frei. Auf dem Brett steht nur eine Person. Im Wasser darunter braucht man freien Platz. Bei Gewitter verlassen alle Gäste sofort die Becken. Das Personal kann das Baden ebenfalls stoppen. Schwimmflossen, Schnorchel und andere Geräte brauchen vorher die Erlaubnis der Aufsicht.',
  questions:[
   {q:'Sara kommt aus der Umkleide und möchte sofort ins Becken. Welcher Schritt fehlt?',answer:'duschen',options:['duschen','essen','telefonieren','bezahlen']},
   {q:'Tom läuft mit normalen Schuhen in einen Bereich für nackte Füße. Ist das erlaubt?',answer:'nein',options:['nein','ja','nur bei Regen','nur für Erwachsene']},
   {q:'Mia trägt Jeans und möchte in den nassen Bereich am Becken. Passt ihre Kleidung?',answer:'nein',options:['nein','ja','nur morgens','nur im Winter']},
   {q:'Das Sprungbrett ist geschlossen. Was entscheidet über die Nutzung?',answer:'die Aufsicht',options:['die Aufsicht','die anderen Gäste','die Kasse','die Kinder']},
   {q:'Draußen beginnt ein starkes Gewitter. Was ist jetzt richtig?',answer:'raus aus dem Wasser',options:['raus aus dem Wasser','weiterschwimmen','unter dem Brett warten','ins Kinderbecken wechseln']},
   {q:'Ben bringt Schwimmflossen mit. Was soll er vor der Nutzung tun?',answer:'beim Personal nachfragen',options:['beim Personal nachfragen','eine zweite Karte kaufen','einen Vertrag schreiben','zur Kasse laufen']}
  ]
 },
 {
  id:'bad03',
  title:'Freibad Winnweiler – Rutsche und Verhalten',
  text:'Die große Wasserrutsche ist ab sechs Jahren erlaubt. Kinder unter acht Jahren brauchen dort die Aufsicht einer erziehungsberechtigten Person. Auf der Rutsche sitzt man. Nach der Fahrt verlässt man das Landebecken sofort. Rund um die Schwimmbecken ist Rennen verboten. Andere Gäste darf man nicht unter Wasser drücken. Auch Schubsen ins Becken ist verboten. Ballspiele finden nur in bestimmten Bereichen statt. Stühle und Liegen bleiben frei für die aktuelle Nutzung. Eine Reservierung ist nicht erlaubt. Essen und Getränke gehören nur in die dafür bestimmten Bereiche. Im Kleinkinderbereich achten die begleitenden Erwachsenen selbst auf die Kinder.',
  questions:[
   {q:'Lina ist fünf. Sie möchte auf die große Rutsche. Darf sie?',answer:'nein',options:['nein','ja','nur allein','nur im Stehen']},
   {q:'Ein siebenjähriges Kind nutzt die Rutsche. Wer muss dort aufpassen?',answer:'eine verantwortliche erwachsene Person',options:['eine verantwortliche erwachsene Person','ein anderes Kind','niemand','die Person an der Kasse']},
   {q:'Paul möchte im Stehen rutschen. Ist diese Position erlaubt?',answer:'nein',options:['nein','ja','nur einmal','nur mit Eltern']},
   {q:'Zwei Freunde machen ein Wettrennen direkt neben dem Becken. Passt das zu den Regeln?',answer:'nein',options:['nein','ja','nur mit Badeschuhen','nur Erwachsene']},
   {q:'Eine Gruppe möchte Fußball spielen. Wo ist das möglich?',answer:'auf einer dafür bestimmten Fläche',options:['auf einer dafür bestimmten Fläche','überall im Bad','im Schwimmerbecken','auf der Rutsche']},
   {q:'Eva legt morgens ein Handtuch auf eine Liege und geht lange weg. Darf sie den Platz so sichern?',answer:'nein',options:['nein','ja','nur bis Mittag','nur für Kinder']}
  ]
 },
 {
  id:'bib01',
  title:'Stadtbibliothek Köln – Regeln im Haus',
  text:'In der Stadtbibliothek brauchen alle Besucher Ruhe. Laute Gespräche stören andere Menschen. Essen, Trinken und Rauchen sind im Haus nicht erlaubt. So bleiben Bücher und andere Medien sauber. Tiere bleiben normalerweise draußen. Assistenzhunde dürfen mitkommen. Kinder unter sieben Jahren besuchen die Bibliothek mit einer erwachsenen Person. Garderobenschränke werden nur während des Besuchs benutzt. Vor dem Verlassen leert man den Schrank. Den Schlüssel lässt man dort. Die Hinweise des Bibliothekspersonals gelten für alle Besucher.',
  questions:[
   {q:'Zwei Freunde sprechen sehr laut zwischen den Regalen. Was sollten sie ändern?',answer:'leiser sprechen',options:['leiser sprechen','lauter sprechen','Musik anmachen','nach Hause telefonieren']},
   {q:'Nora möchte beim Lesen Saft trinken. Passt das zu den Hausregeln?',answer:'nein',options:['nein','ja','nur am Computer','nur morgens']},
   {q:'Welche Ausnahme gibt es bei Tieren?',answer:'Ein Assistenzhund darf hinein.',options:['Ein Assistenzhund darf hinein.','Jeder Hund darf hinein.','Nur Katzen dürfen hinein.','Alle Tiere dürfen hinein.']},
   {q:'Ein sechsjähriges Kind steht allein am Eingang. Was braucht es für den Besuch?',answer:'eine erwachsene Begleitung',options:['eine erwachsene Begleitung','einen Führerschein','einen Termin','eine Fahrkarte']},
   {q:'Ali benutzt ein Schließfach. Er möchte nach Hause. Was macht er vorher?',answer:'Er nimmt seine Sachen heraus und lässt den Schlüssel dort.',options:['Er nimmt seine Sachen heraus und lässt den Schlüssel dort.','Er nimmt den Schlüssel mit.','Er lässt alle Sachen im Fach.','Er gibt den Schlüssel einem Freund.']},
   {q:'Eine Bibliotheksmitarbeiterin erklärt eine Hausregel. Wie reagiert ein Besucher richtig?',answer:'Er hält sich daran.',options:['Er hält sich daran.','Er ignoriert die Regel.','Er diskutiert mit anderen Gästen.','Er nimmt den Schlüssel mit.']}
  ]
 },
 {
  id:'amt01',
  title:'Bürgeramt Berlin – Termin und Warten',
  text:'Für viele Anliegen im Bürgeramt ist ein Termin nötig. Terminkunden kommen ungefähr fünf Minuten früher. Die Vorgangsnummer liegt am besten schon bereit. Danach wartet man im Wartebereich. Auf einem Bildschirm erscheint die nächste Nummer. Für mehrere Personen mit eigenen Anliegen braucht man mehrere Termine. Bei einem nachgewiesenen dringenden Fall ist auch ein Besuch am selben Tag möglich. Dabei kann eine längere Wartezeit entstehen. Einige Dienstleistungen funktionieren auch schriftlich oder online. Ein persönlicher Besuch ist dafür nicht nötig.',
  questions:[
   {q:'Marias Termin beginnt um 10:00 Uhr. Welche Ankunftszeit passt am besten?',answer:'09:55 Uhr',options:['09:55 Uhr','10:45 Uhr','11:00 Uhr','erst nach einem Anruf']},
   {q:'Auf dem Bildschirm erscheinen verschiedene Zahlen. Welche Information sollte Omar griffbereit haben?',answer:'seine eigene Vorgangsnummer',options:['seine eigene Vorgangsnummer','seine Kontonummer','seine Telefonnummer','seine Hausnummer']},
   {q:'Fatima hat sich angemeldet. Ihr Aufruf kommt noch nicht. Wo bleibt sie?',answer:'im Bereich für wartende Besucher',options:['im Bereich für wartende Besucher','an der Kasse','vor dem Gebäude','im Unterricht']},
   {q:'Eine Mutter und ihr erwachsener Sohn haben zwei verschiedene Anliegen. Was ist sinnvoll?',answer:'für jede Person einen Termin buchen',options:['für jede Person einen Termin buchen','nur einen Termin buchen','ohne Termin kommen','drei Termine buchen']},
   {q:'Ein Problem ist dringend und offiziell nachgewiesen. Welche Möglichkeit gibt es?',answer:'noch am selben Tag vorsprechen',options:['noch am selben Tag vorsprechen','automatisch einen Ausweis bekommen','immer eine Woche warten','gar nicht ins Amt gehen']},
   {q:'Anna möchte eine Leistung nutzen. Diese Leistung gibt es auch digital. Muss sie dafür unbedingt zum Schalter?',answer:'nein',options:['nein','ja','nur mit Kindern','nur am Montag']}
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
