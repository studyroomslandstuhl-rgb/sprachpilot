(function(){'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const raw=[
['werkstatt','die Werkstatt','die Werkstätten','🏭','book'],
['tankstelle','die Tankstelle','die Tankstellen','⛽','book'],
['museum','das Museum','die Museen','🏛️','book'],
['ampel','die Ampel','die Ampeln','🚦','book'],
['bahnhof','der Bahnhof','die Bahnhöfe','🚉','book'],
['metzgerei','die Metzgerei','die Metzgereien','🥩','book'],
['post','die Post','','📮','book'],
['hotel','das Hotel','die Hotels','🏨','book'],
['schluessel','der Schlüssel','die Schlüssel','🔑','book','der_schluessel.webp'],
['autobahn','die Autobahn','die Autobahnen','🛣️','book'],
['bruecke','die Brücke','die Brücken','🌉','book','die_bruecke.webp'],
['weg','der Weg','die Wege','🛤️','book'],
['stadtplan','der Stadtplan','die Stadtpläne','🗺️','book'],
['flugzeug','das Flugzeug','die Flugzeuge','✈️','book','das_flugzeug.webp'],
['fliegen','fliegen','','✈️','book'],
['geradeaus','geradeaus','','⬆️','book'],
['links','links','','⬅️','book'],
['rechts','rechts','','➡️','book'],
['fremd','fremd','','❓','book'],
['buecherei','die Bücherei','die Büchereien','📚','class'],
['baumarkt','der Baumarkt','die Baumärkte','🛠️','class'],
['bushaltestelle','die Bushaltestelle','die Bushaltestellen','🚌','class'],
['schule','die Schule','die Schulen','🏫','class'],
['apotheke','die Apotheke','die Apotheken','⚕️','class'],
['kindergarten','der Kindergarten','die Kindergärten','🧸','class'],
['kino','das Kino','die Kinos','🎬','class'],
['supermarkt','der Supermarkt','die Supermärkte','🛒','class'],
['geschaeft','das Geschäft','die Geschäfte','🏬','class'],
['bank','die Bank','die Banken','🏦','class'],
['restaurant','das Restaurant','die Restaurants','🍽️','class'],
['polizei','die Polizei','','👮','class'],
['krankenhaus','das Krankenhaus','die Krankenhäuser','🏥','class'],
['spielplatz','der Spielplatz','die Spielplätze','🛝','class'],
['fussballplatz','der Fußballplatz','die Fußballplätze','⚽','class'],
['praxis','die Praxis','die Praxen','🩺','class'],
['cafe','das Café','die Cafés','☕','class'],
['markt','der Markt','die Märkte','🧺','class'],
['baeckerei','die Bäckerei','die Bäckereien','🥐','class'],
['erste','erste','','1️⃣','class'],
['zweite','zweite','','2️⃣','class'],
['dritte','dritte','','3️⃣','class'],
['vierte','vierte','','4️⃣','class'],
['abbiegen','abbiegen','','↪️','class'],
['in_der_naehe','in der Nähe','','📍','class']
];
const cards=raw.map(x=>({id:x[0],full:x[1],plural:x[2],emoji:x[3],source:x[4],article:/^(der|die|das) /.test(x[1])?x[1].split(' ')[0]:'',image:CDN+(x[5]||x[0]+'.webp'),audio:AUDIO+x[0]+'.mp3'}));
const phrases=['Entschuldigung, wo ist …?','Ich suche …','Wo finde ich …?','Ist hier … in der Nähe?','Gibt es hier … in der Nähe?'];
const tasks=[
{id:'karteikarten',title:'Karteikarten',icon:'🃏',cardText:'Lerne die Wörter mit Bild, Übersetzung, Sprechen und Schreiben.'},
{id:'bild-wort',title:'Bild – Wort',icon:'🖼️',cardText:'Sieh das Bild. Wähle das richtige Wort.'},
{id:'wort-bild',title:'Wort – Bild',icon:'🔎',cardText:'Lies das Wort. Wähle das richtige Bild.'},
{id:'hoeren-bild',title:'Hören – Bild',icon:'🎧',cardText:'Höre das Wort. Wähle das richtige Bild.'},
{id:'memory',title:'Memory: Bild und Wort',icon:'🧠',cardText:'Finde die passenden Paare aus Bild und Wort.'},
{id:'ort-finden',title:'Wo kann man das machen?',icon:'🏙️',cardText:'Lies die Frage. Wähle den passenden Ort.'},
{id:'satzbausteine',title:'Fragen und Wegbeschreibungen',icon:'🧩',cardText:'Bringe die Bausteine in die richtige Reihenfolge. 20 Items.'},
{id:'luecken-dialoge',title:'Dialoge mit Bild-Lücken',icon:'💬',cardText:'Schreibe die passenden Wörter in die Lücken. Die Bilder helfen dir. 20 Items.'},
{id:'dialog-reihenfolge',title:'Dialoge ordnen',icon:'↕️',cardText:'Bringe die gemischten Dialogzeilen in eine logische Reihenfolge.'},
{id:'pruefung',title:'Prüfung',icon:'⭐',exam:true,cardText:'Löse gemischte Aufgaben zu Thema 1.'}
];
window.L11T1={cards,phrases,tasks,CDN,AUDIO};
})();
