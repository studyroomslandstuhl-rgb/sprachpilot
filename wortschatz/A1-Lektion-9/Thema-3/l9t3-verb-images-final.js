(function(){
'use strict';
const D=window.L9T3;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const img=id=>`${CDN}${id}.webp`;
const rows=[
 ['g01','In diesem Café','man draußen','darf','rauchen','rauchen'],
 ['g02','Auf diesem Parkplatz','du zwei Stunden','darfst','parken','parken'],
 ['g03','Im Flugzeug','ich meinen Laptop','darf','mitnehmen','mitnehmen'],
 ['g04','Am Schalter','wir die Unterlagen','dürfen','abgeben','abgeben'],
 ['g05','Im Bürgeramt','Sie einen neuen Ausweis','dürfen','beantragen','beantragen'],
 ['g06','Zum Termin','ihr eure Pässe','dürft','mitbringen','mitbringen'],
 ['g07','Dieses Formular','man hier','darf','ausfüllen','ausfuellen'],
 ['g08','Unten auf dem Dokument','du','darfst','unterschreiben','unterschreiben'],
 ['g09','Am Schalter','der Mitarbeiter das Dokument','darf','stempeln','stempeln'],
 ['g10','Am Automaten','ich mein Ziel','darf','wählen','waehlen'],
 ['g11','In der Liste','ihr einen Termin','dürft','auswählen','auswaehlen'],
 ['g12','Für das Wochenende','wir ein Auto','dürfen','mieten','mieten'],
 ['g13','Am Schalter','Sie Ihren Namen','dürfen','wiederholen','wiederholen'],
 ['g14','Im Unterricht','du die Aufgabe noch einmal','darfst','erklären','erklaeren'],
 ['g15','Vor der Prüfung','ihr die Handys','dürft','ausmachen','ausmachen'],
 ['g16','Im Kurs','wir der Lehrerin','dürfen','zuhören','zuhoeren'],
 ['g17','Nach der Pause','ihr wieder','dürft','aufstehen','aufstehen'],
 ['g18','Auf dem Spielplatz','die Kinder laut','dürfen','lachen','lachen'],
 ['g19','Vor dem Schalter','man kurz','darf','warten','warten'],
 ['g20','An der Autovermietung','Sie das Gepäck ins Auto','dürfen','laden','laden']
];
D.gaps=rows.map(x=>({
 id:x[0],left:x[1],middle:x[2],modal:x[3],verb:x[4],image:img(x[5]),
 hint:'Das Bild zeigt das Verb. Achte zusätzlich auf das Subjekt und die richtige Form von dürfen.'
}));
})();