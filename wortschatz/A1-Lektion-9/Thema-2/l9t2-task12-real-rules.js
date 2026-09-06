(function(){
'use strict';
const D=window.L9T2;if(!D)return;

/* Aufgabe 12: inhaltlich vereinfacht nach der Haus- und Badeordnung
   für das Freibad der Verbandsgemeinde Winnweiler, gültig ab 01.04.2026.
   Die Regeln sind auf etwa B1 vereinfacht, aber inhaltlich nicht erweitert. */
D.ruleReadings=[
 {
  id:'bad01',
  title:'Freibad Winnweiler – Besuch und Zutritt',
  text:'Im Freibad müssen alle Gäste die Regeln beachten und auf das Personal hören. Rauchen ist im Umkleidebereich, im Sanitärbereich und im Badebereich nicht erlaubt. Auch rund um das Kleinkinderbecken darf man nicht rauchen. Wer im Bad etwas findet, muss den Gegenstand beim Personal abgeben. Andere Personen darf man nur fotografieren oder filmen, wenn sie damit einverstanden sind. Kinder unter zehn Jahren dürfen das Freibad nur mit einer erwachsenen Begleitperson besuchen. Außerdem muss jeder Gast eine gültige Eintrittskarte haben und den Eintrittsbon aufbewahren, falls das Personal ihn sehen möchte.',
  questions:[
   {q:'Wer entscheidet im Bad, wenn es eine Anweisung gibt?',answer:'das Personal',options:['das Personal','die anderen Gäste','die Kinder','niemand']},
   {q:'Wo ist eine Zigarette nicht erlaubt?',answer:'im Badebereich',options:['im Badebereich','auf einem erlaubten Raucherplatz','außerhalb des Badebereichs','nur auf dem Parkplatz']},
   {q:'Was macht man mit einer Sache, die man im Freibad findet?',answer:'beim Personal abgeben',options:['beim Personal abgeben','mit nach Hause nehmen','ins Wasser legen','an der Kasse verkaufen']},
   {q:'Wann darf man fremde Badegäste fotografieren?',answer:'wenn sie zustimmen',options:['wenn sie zustimmen','immer','nur am Morgen','nur Kinder']},
   {q:'Ein Kind ist neun Jahre alt. Was braucht es für den Freibadbesuch?',answer:'eine erwachsene Begleitperson',options:['eine erwachsene Begleitperson','nur eine Fahrkarte','keine Begleitung','einen Führerschein']},
   {q:'Warum soll man den Bon nach dem Bezahlen behalten?',answer:'Das Personal kann ihn kontrollieren.',options:['Das Personal kann ihn kontrollieren.','Man braucht ihn zum Duschen.','Man kann damit Essen kaufen.','Man bekommt damit ein Handtuch.']}
  ]
 },
 {
  id:'bad02',
  title:'Freibad Winnweiler – Vor und im Wasser',
  text:'Bevor man in ein Becken geht, muss man sich waschen. In den Barfußbereichen sind Straßenschuhe nicht erlaubt. Im Nassbereich trägt man Badekleidung; normale Straßenkleidung wie Jeans oder T-Shirts gilt dort nicht als Badekleidung. Das Sprungbrett darf man nur benutzen, wenn das Aufsichtspersonal es freigegeben hat. Auf dem Sprungbrett darf immer nur eine Person stehen, und der Bereich im Wasser muss frei sein. Bei Gewitter oder wenn das Personal es sagt, müssen alle Gäste die Becken sofort verlassen. Schwimmflossen, Schnorchelgeräte und andere Sport- oder Spielgeräte darf man nur benutzen, wenn das Aufsichtspersonal zustimmt.',
  questions:[
   {q:'Was muss man machen, bevor man schwimmen geht?',answer:'sich waschen',options:['sich waschen','etwas essen','die Schuhe anlassen','ein Foto machen']},
   {q:'Welche Schuhe darf man im Bereich für nackte Füße nicht tragen?',answer:'Straßenschuhe',options:['Straßenschuhe','Badeschuhe','keine Schuhe','Schwimmflossen']},
   {q:'Kann man mit Jeans im Nassbereich bleiben?',answer:'nein',options:['nein','ja, immer','nur am Wochenende','nur bei Regen']},
   {q:'Wann kann man vom Sprungbrett springen?',answer:'wenn das Personal es erlaubt',options:['wenn das Personal es erlaubt','immer','wenn zwei Personen oben stehen','nur nach dem Essen']},
   {q:'Was muss man bei einem Gewitter tun?',answer:'das Becken sofort verlassen',options:['das Becken sofort verlassen','weiter schwimmen','unter dem Sprungbrett warten','ins Kleinkinderbecken gehen']},
   {q:'Du möchtest mit Schwimmflossen ins Wasser. Was brauchst du vorher?',answer:'die Zustimmung des Personals',options:['die Zustimmung des Personals','eine neue Eintrittskarte','einen Vertrag','eine Anmeldung beim Amt']}
  ]
 },
 {
  id:'bad03',
  title:'Freibad Winnweiler – Rutsche und Verhalten',
  text:'Die große Wasserrutsche ist für Kinder ab sechs Jahren. Kinder unter acht Jahren müssen dabei von ihren Eltern oder einer anderen erziehungsberechtigten Person beaufsichtigt werden. Auf der Rutsche ist nur Sitzen erlaubt, und nach dem Rutschen muss man das Landebecken sofort verlassen. Rund um die Schwimmbecken darf man nicht rennen. Andere Gäste darf man nicht unter Wasser drücken oder ins Becken stoßen. Ballspiele sind nur in den dafür vorgesehenen Bereichen erlaubt. Stühle und Liegen darf man nicht reservieren. Essen und Getränke sind nur in den ausgewiesenen Bereichen erlaubt. Im Kleinkinderbereich müssen die begleitenden Erwachsenen selbst auf die kleinen Kinder achten.',
  questions:[
   {q:'Ein Kind ist fünf Jahre alt. Darf es die große Rutsche benutzen?',answer:'nein',options:['nein','ja','nur allein','nur im Stehen']},
   {q:'Wer muss bei einem siebenjährigen Kind an der Rutsche aufpassen?',answer:'eine erziehungsberechtigte Person',options:['eine erziehungsberechtigte Person','ein anderes Kind','niemand','der Kassierer']},
   {q:'Wie darf man die Rutsche benutzen?',answer:'im Sitzen',options:['im Sitzen','im Stehen','auf dem Bauch','zu zweit']},
   {q:'Darf man direkt am Becken schnell laufen?',answer:'nein',options:['nein','ja','nur mit Schuhen','nur Erwachsene']},
   {q:'Wo darf man mit einem Ball spielen?',answer:'nur in vorgesehenen Bereichen',options:['nur in vorgesehenen Bereichen','überall','im Schwimmerbecken','auf der Rutsche']},
   {q:'Kann man morgens eine Liege mit einem Handtuch für später sichern?',answer:'nein',options:['nein','ja','nur für Kinder','nur bis Mittag']}
  ]
 }
];

const task=(D.tasks||[]).find(x=>x.id==='regeln-lesen');
if(task){
 task.title='Regeln im Freibad';
 task.description='Lies die Badeordnung und antworte.';
 task.instruction='Lies die Badeordnung und antworte.';
 task.icon='🏊';
}
})();
