(function(){
'use strict';
const BUNNY='https://sprachpilot.b-cdn.net/';
const card=(id,full,term,plural,meaning,gap)=>({id,full,term,word:term,plural,type:'noun',image:BUNNY+id+'.webp',imageKey:id,article:full.split(' ')[0],meaning,gap});
const cards=[
 card('mund','der Mund','Mund','die Münder','Mit diesem Körperteil spreche und esse ich.','Der ___ ist unter der Nase.'),
 card('arm','der Arm','Arm','die Arme','Er ist zwischen Schulter und Hand.','Der ___ ist zwischen Schulter und Hand.'),
 card('ohr','das Ohr','Ohr','die Ohren','Mit diesem Körperteil höre ich.','Das ___ ist links oder rechts am Kopf.'),
 card('auge','das Auge','Auge','die Augen','Mit diesem Körperteil sehe ich.','Das ___ ist im Gesicht.'),
 card('zahn','der Zahn','Zahn','die Zähne','Er ist im Mund und hilft beim Kauen.','Der ___ ist im Mund.'),
 card('fuss','der Fuß','Fuß','die Füße','Er ist unten am Bein. Ich stehe darauf.','Der ___ ist unten am Bein.'),
 card('hand','die Hand','Hand','die Hände','Sie ist am Ende des Arms. Ich greife damit.','Die ___ ist am Ende des Arms.'),
 card('kopf','der Kopf','Kopf','die Köpfe','Er ist ganz oben am Körper.','Der ___ ist ganz oben am Körper.'),
 card('nase','die Nase','Nase','die Nasen','Mit diesem Körperteil rieche ich.','Die ___ ist in der Mitte des Gesichts.'),
 card('bein','das Bein','Bein','die Beine','Es trägt den Körper und ist zwischen Körper und Fuß.','Das ___ ist zwischen Körper und Fuß.'),
 card('hals','der Hals','Hals','die Hälse','Er ist zwischen Kopf und Brust.','Der ___ ist zwischen Kopf und Brust.'),
 card('ruecken','der Rücken','Rücken','die Rücken','Er ist hinten am Oberkörper.','Der ___ ist hinten am Oberkörper.'),
 card('bauch','der Bauch','Bauch','die Bäuche','Er ist vorne unter der Brust.','Der ___ ist vorne unter der Brust.'),
 card('knie','das Knie','Knie','die Knie','Es ist in der Mitte des Beins.','Das ___ ist in der Mitte des Beins.'),
 card('nacken','der Nacken','Nacken','die Nacken','Er ist hinten zwischen Kopf und Rücken.','Der ___ ist hinten zwischen Kopf und Rücken.'),
 card('po','der Po','Po','die Pos','Auf diesem Körperteil sitze ich.','Der ___ ist der Körperteil, auf dem ich sitze.'),
 card('gesicht','das Gesicht','Gesicht','die Gesichter','Dazu gehören Augen, Nase und Mund.','Das ___ hat Augen, Nase und Mund.'),
 card('haar','das Haar','Haar','die Haare','Es wächst auf dem Kopf.','Das ___ wächst auf dem Kopf.'),
 card('augenbraue','die Augenbraue','Augenbraue','die Augenbrauen','Sie ist über dem Auge.','Die ___ ist über dem Auge.'),
 card('stirn','die Stirn','Stirn','die Stirnen','Sie ist im Gesicht über den Augen.','Die ___ ist über den Augen.'),
 card('wimper','die Wimper','Wimper','die Wimpern','Sie wächst am Rand des Augenlids.','Die ___ wächst am Augenlid.'),
 card('zunge','die Zunge','Zunge','die Zungen','Sie ist im Mund. Ich schmecke damit.','Die ___ ist im Mund.'),
 card('backe','die Backe','Backe','die Backen','Sie ist links oder rechts im Gesicht.','Die ___ ist links oder rechts im Gesicht.'),
 card('lippe','die Lippe','Lippe','die Lippen','Sie ist am Mund.','Die ___ ist am Mund.'),
 card('kinn','das Kinn','Kinn','die Kinne','Es ist im Gesicht unter dem Mund.','Das ___ ist unter dem Mund.'),
 card('augenlid','das Augenlid','Augenlid','die Augenlider','Es bedeckt das Auge beim Schließen.','Das ___ bedeckt das Auge beim Schließen.'),
 card('schnurrbart','der Schnurrbart','Schnurrbart','die Schnurrbärte','Er wächst zwischen Nase und Oberlippe.','Der ___ wächst zwischen Nase und Oberlippe.'),
 card('bart','der Bart','Bart','die Bärte','Er wächst bei manchen Männern im Gesicht.','Der ___ wächst im Gesicht.'),
 card('zeh','der Zeh','Zeh','die Zehen','Er ist am Fuß. Ein Fuß hat fünf davon.','Der ___ ist am Fuß.'),
 card('ellbogen','der Ellbogen','Ellbogen','die Ellbogen','Er ist in der Mitte des Arms.','Der ___ ist in der Mitte des Arms.'),
 card('brust','die Brust','Brust','die Brüste','Sie ist vorne am Oberkörper, über dem Bauch.','Die ___ ist über dem Bauch.'),
 card('finger','der Finger','Finger','die Finger','Er ist an der Hand. Eine Hand hat fünf davon.','Der ___ ist an der Hand.'),
 card('schulter','die Schulter','Schulter','die Schultern','Sie verbindet Arm und Oberkörper.','Die ___ verbindet Arm und Oberkörper.'),
 card('nagel','der Nagel','Nagel','die Nägel','Er wächst am Finger oder Zeh.','Der ___ wächst am Finger oder Zeh.')
];
const tasks=[
 {id:'karteikarten',kind:'cards',title:'Karteikarten',icon:'🃏',text:'Lerne alle Wörter mit Bild, Übersetzung, Artikel und Plural.'},
 {id:'bild-wort',kind:'image-choice',title:'Bild → Wort',icon:'🖼️',text:'Sieh das Bild und wähle das richtige Wort aus vier Antworten.'},
 {id:'wort-bild',kind:'word-image',title:'Wort → Bild',icon:'🔎',text:'Lies das Wort und wähle das richtige Bild aus vier Bildern.'},
 {id:'artikel',kind:'noun-article',title:'Artikel',icon:'🔤',text:'Sieh das Bild und wähle der, die oder das.'},
 {id:'plural',kind:'noun-plural',title:'Plural schreiben',icon:'🔢',text:'Sieh das Bild und schreibe die richtige Pluralform.'},
 {id:'hoeren-bild',kind:'listen',title:'Hören → Bild',icon:'🎧',text:'Höre das Wort und wähle das richtige Bild.'},
 {id:'hoeren-schreiben',kind:'writing',title:'Hören → Schreiben',icon:'✍️',text:'Höre das Wort und schreibe es richtig.'},
 {id:'memory',kind:'memory',title:'Memory',icon:'🧩',text:'Finde zu jedem Wort das passende Bild.'},
 {id:'lueckentext',kind:'gaps',title:'Lückentext',icon:'📝',text:'Ergänze in jedem Satz das passende Körperteil.'},
 {id:'bedeutung-waehlen',kind:'defs',title:'Bedeutung wählen',icon:'💡',text:'Lies die Bedeutung und wähle das richtige Wort.'},
 {id:'bedeutung-schreiben',kind:'writing-defs',title:'Bedeutung schreiben',icon:'⌨️',text:'Lies die Bedeutung und schreibe das richtige Wort.'},
 {id:'pruefung',kind:'exam',title:'Prüfung',icon:'⭐',text:'Zeige, dass du die Wörter sicher kannst.',exam:true}
];
window.L10T1={cards,tasks,defs:cards,gaps:cards,listen:cards,exam:cards};
})();
