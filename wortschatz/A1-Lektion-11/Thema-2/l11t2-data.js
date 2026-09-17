(function(){'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const raw=[
['flugzeug','das Flugzeug','die Flugzeuge','das_flugzeug.webp'],
['strassenbahn','die Straßenbahn','die Straßenbahnen','die_strassenbahn.webp'],
['zug','der Zug','die Züge','der_zug.webp'],
['u_bahn','die U-Bahn','die U-Bahnen','die_u_bahn.webp'],
['bus','der Bus','die Busse','der_bus.webp'],
['s_bahn','die S-Bahn','die S-Bahnen','die_s_bahn.webp'],
['station','die Station','die Stationen','die_station.webp'],
['fahrrad','das Fahrrad','die Fahrräder','das_fahrrad.webp'],
['auto','das Auto','die Autos','das_auto.webp']
];
const cards=raw.map(x=>({id:x[0],full:x[1],plural:x[2],article:x[1].split(' ')[0],image:CDN+x[3],audio:AUDIO+x[0]+'.mp3',type:'noun'}));
const prepositionCards=[['an','an'],['auf','auf'],['hinter','hinter'],['in','in'],['neben','neben'],['ueber','über'],['unter','unter'],['vor','vor'],['zwischen','zwischen']].map(([id,full])=>({id:'wp_'+id,full,image:CDN+id+'.webp',audio:AUDIO+id+'.mp3',type:'preposition'}));
const tasks=[
{id:'karteikarten',title:'Karteikarten',icon:'🃏',cardText:'Lerne die Verkehrsmittel und Wechselpräpositionen.'},
{id:'bild-wort',title:'Bild – Wort',icon:'🖼️',cardText:'Sieh das Bild und wähle das richtige Wort.'},
{id:'wort-bild',title:'Wort – Bild',icon:'🔎',cardText:'Lies das Wort und wähle das passende Bild.'},
{id:'hoeren-bild',title:'Hören – Bild',icon:'🎧',cardText:'Höre das Wort und wähle das passende Bild.'},
{id:'memory',title:'Memory',icon:'🧠',cardText:'Finde Bild und Wort als Paar.'},
{id:'wp-bild-hoeren',title:'Wechselpräpositionen: Bild + Hören',icon:'🎧',cardText:'Ordne jede Bildkarte der passenden Hörkarte zu.'},
{id:'praeposition-gruppen',title:'Präpositionen zuordnen',icon:'🗂️',cardText:'Ordne zu: Akkusativ, Dativ oder Wechselpräposition.'},
{id:'in-mit-artikel',title:'in + Artikel',icon:'✍️',cardText:'Bestimme wo/wohin und den Kasus. Ergänze danach in + Artikel.'},
{id:'fehler-markieren',title:'Fehler markieren und korrigieren',icon:'🛠️',cardText:'Finde den falschen Kasus, das falsche Partizip II oder Hilfsverb.'},
{id:'fahren-mit',title:'fahren mit',icon:'🚍',cardText:'Übe: Ich fahre mit dem Bus, mit dem Zug, mit der U-Bahn …'},
{id:'fahren-zu',title:'fahren zu',icon:'📍',cardText:'Übe: Ich fahre zum Bahnhof, zur Station, zur Schule …'},
{id:'mit-und-zu',title:'fahren mit + fahren zu',icon:'🧭',cardText:'Bilde vollständige Sätze mit Verkehrsmittel und Ziel.'},
{id:'pruefung',title:'Prüfung',icon:'⭐',exam:true,cardText:'Löse gemischte Aufgaben zu Thema 2.'}
];
window.L11T2={cards,prepositionCards,tasks,CDN,AUDIO};
})();
