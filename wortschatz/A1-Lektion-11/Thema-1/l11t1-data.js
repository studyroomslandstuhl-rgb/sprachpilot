(function(){'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const raw=[
['werkstatt','die Werkstatt','die Werkstätten','🏭','both'],
['tankstelle','die Tankstelle','die Tankstellen','⛽','both'],
['museum','das Museum','die Museen','🏛️','both'],
['ampel','die Ampel','die Ampeln','🚦','both'],
['bahnhof','der Bahnhof','die Bahnhöfe','🚉','both'],
['metzgerei','die Metzgerei','die Metzgereien','🥩','both'],
['post','die Post','','📮','both'],
['hotel','das Hotel','die Hotels','🏨','both'],
['schluessel','der Schlüssel','die Schlüssel','🔑','book'],
['autobahn','die Autobahn','die Autobahnen','🛣️','book'],
['bruecke','die Brücke','die Brücken','🌉','book'],
['weg','der Weg','die Wege','🛤️','book'],
['stadtplan','der Stadtplan','die Stadtpläne','🗺️','book'],
['flugzeug','das Flugzeug','die Flugzeuge','✈️','book'],
['buecherei','die Bücherei','die Büchereien','📚','class'],
['baumarkt','der Baumarkt','die Baumärkte','🛠️','class'],
['bushaltestelle','die Bushaltestelle','die Bushaltestellen','🚌','class'],
['schule','die Schule','die Schulen','🏫','class'],
['apotheke','die Apotheke','die Apotheken','⚕️','class'],
['kindergarten','der Kindergarten','die Kindergärten','🧸','class'],
['kino','das Kino','die Kinos','🎬','class'],
['laden','der Laden','die Läden','🏪','class','_laden.webp'],
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
['fliegen','fliegen','','✈️','book'],
['abbiegen','abbiegen','','↪️','class'],
['geradeaus','geradeaus','','⬆️','both'],
['links','links','','⬅️','both'],
['rechts','rechts','','➡️','both'],
['in_der_naehe','in der Nähe','','📍','class'],
['fremd','fremd','','❓','book']
];
const cards=raw.map(x=>({id:x[0],full:x[1],plural:x[2],emoji:x[3],source:x[4],article:/^(der|die|das) /.test(x[1])?x[1].split(' ')[0]:'',image:CDN+(x[5]||x[0]+'.webp'),audio:AUDIO+x[0]+'.mp3'}));
const phrases=[
'Entschuldigung, wo ist …?',
'Ich suche …',
'Wo finde ich …?',
'Ist hier … in der Nähe?',
'Gibt es hier … in der Nähe?'
];
const tasks=[
{id:'karteikarten',title:'Karteikarten',icon:'🃏',cardText:'Lerne die Wörter mit Bild und Ton.'},
{id:'bild-wort',title:'Bild – Wort',icon:'🖼️',cardText:'Wähle das passende Wort zum Bild.'},
{id:'artikel-plural',title:'Artikel und Plural',icon:'🔤',cardText:'Ergänze Artikel und Plural.'},
{id:'orte-zuordnen',title:'Orte in der Stadt',icon:'🏙️',cardText:'Ordne Situationen dem richtigen Ort zu.'},
{id:'orientierung',title:'Nach dem Weg fragen',icon:'📍',cardText:'Ergänze passende Redemittel.'},
{id:'wegbeschreibung',title:'Wegbeschreibung',icon:'🧭',cardText:'Verstehe links, rechts, geradeaus und abbiegen.'},
{id:'pruefung',title:'Prüfung',icon:'⭐',exam:true,cardText:'Löse gemischte Aufgaben zu Thema 1.'}
];
window.L11T1={cards,phrases,tasks,CDN,AUDIO};
})();