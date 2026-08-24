(function(){
'use strict';
if(window.SP_A1_RELEASE_CATALOG_L3_L7)return;
const task=(file,title,extra)=>[file,title,extra||null];
const theme=(key,title,tasks)=>({key,title,tasks});
const lessons=[
 {key:'A1-Lektion-3',title:'A1 Lektion 3 · Einkaufen',themes:[
  theme('Thema-1','Thema 1 · Lebensmittel & Getränke',[
   task('karteikarten.html','Karteikarten'),task('artikel.html','Artikel'),task('ein-eine.html','ein / eine'),task('kein-keine.html','kein / keine'),task('plural.html','Plural'),task('plural-drag-drop.html','Pluralgruppen'),task('bild-wort.html','Bild → Wort'),task('wort-bild.html','Wort → Bild'),task('hoeren.html','Hören'),task('drag-drop-artikel.html','Artikel zuordnen'),task('fragen-mit-fragewort.html','Fragen mit Fragewort'),task('fragen-ohne-fragewort.html','Ja/Nein-Fragen'),task('memory.html','Memory'),task('schreiben.html','Schreiben'),task('sprechen.html','Sprechen')
  ]),
  theme('Thema-2','Thema 2 · Mengen & Verpackungen',[
   task('karteikarten.html','Karteikarten'),task('bild-wort.html','Bild → Wort'),task('wort-bild.html','Wort → Bild'),task('artikel.html','Artikel'),task('ein-eine.html','ein / eine'),task('kein-keine.html','kein / keine'),task('plural.html','Plural'),task('plural-drag-drop.html','Pluralgruppen'),task('verpackungen.html','Verpackungen'),task('was-kostet.html','Was kostet …?'),task('was-kosten.html','Was kosten …?'),task('wie-viel-kostet.html','Wie viel kostet …?'),task('wie-viel-kosten.html','Wie viel kosten …?'),task('frage-und-antwort.html','Frage & Antwort'),task('fragen-mit-fragewort.html','Fragen mit Fragewort'),task('fragen-ohne-fragewort.html','Ja/Nein-Fragen'),task('preis-auswaehlen.html','Preis auswählen'),task('preis-hoeren.html','Preis hören'),task('preis-schreiben.html','Preis schreiben'),task('preis-sprechen.html','Preis sprechen'),task('memory.html','Memory'),task('schreiben.html','Schreiben'),task('sprechen.html','Sprechen')
  ])
 ]},
 {key:'A1-Lektion-4',title:'A1 Lektion 4 · Wohnen',themes:[
  theme('Thema-1','Thema 1 · Wohnung & Zimmer',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('bild-wort.html','Bild → Wort'),task('wort-bild.html','Wort → Bild'),task('artikel.html','Artikel'),task('plural.html','Plural'),task('memory.html','Memory'),task('schreiben.html','Schreiben'),task('sprechen.html','Sprechen')
  ]),
  theme('Thema-2','Thema 2 · Möbel & Elektrogeräte',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('artikel-klick.html','Artikel klicken'),task('artikel.html','Artikel zuordnen'),task('plural.html','Plural'),task('bild-wort.html','Bild → Wort'),task('wort-bild.html','Wort → Bild'),task('kategorien.html','Kategorien'),task('dialoge.html','Dialoge')
  ]),
  theme('Thema-3','Thema 3 · Farben & Adjektive',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('farben.html','Farben erkennen'),task('memory.html','Gegenteile-Memory'),task('gegenteile.html','Gegenteile'),task('kein.html','nicht / kein'),task('reaktionen.html','Reaktionen'),task('gefallen.html','Gefallen'),task('farben-kombinieren.html','Farben kombinieren'),task('saetze-bauen.html','Sätze bauen'),task('schreiben.html','Schreiben'),task('pruefung.html','Prüfung',{exam:true})
  ]),
  theme('Thema-4','Thema 4 · Wohnung suchen',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('paare.html','Paare'),task('anzeige-lesen.html','Anzeige lesen'),task('welche-anzeige.html','Passende Anzeige finden'),task('schreiben.html','Schreiben')
  ]),
  theme('Thema-5','Thema 5 · Am Telefon',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('rollenspiel.html','Rollenspiel'),task('schreiben.html','Schreiben'),task('sprechen.html','Sprechen')
  ])
 ]},
 {key:'A1-Lektion-5',title:'A1 Lektion 5 · Mein Tag',themes:[
  theme('Thema-1','Thema 1 · Alltag und trennbare Verben',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('bild-wort.html','Bild → Wort'),task('wort-bild.html','Wort → Bild'),task('schreiben.html','Schreiben'),task('sprechen.html','Sprechen')
  ]),
  theme('Thema-2','Thema 2 · Uhrzeit',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('uhrzeit.html','Uhrzeit'),task('schreiben.html','Schreiben'),task('sprechen.html','Sprechen')
  ]),
  theme('Thema-3','Thema 3 · Tage, Tageszeiten und Präpositionen',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('tage.html','Tage und Tageszeiten'),task('praepositionen.html','Präpositionen'),task('schreiben.html','Schreiben'),task('pruefung.html','Prüfung',{exam:true})
  ]),
  theme('Thema-4','Thema 4 · Kurse, Familie und Öffnungszeiten',[
   task('karteikarten.html','Karteikarten'),task('hoeren.html','Hören'),task('lesen.html','Lesen'),task('dialoge.html','Dialoge'),task('schreiben.html','Schreiben')
  ])
 ]},
 {key:'A1-Lektion-6',title:'A1 Lektion 6 · Wetter',themes:[
  theme('Thema-1','Thema 1 · Wetter',[
   task('karteikarten.html','Karteikarten'),task('artikel.html','Artikel'),task('hoeren-schreiben.html','Hören und schreiben'),task('hoeren-bild.html','Hören und Bild wählen'),task('nomen-satz-a.html','Nomen → Satz A'),task('nomen-satz-b.html','Nomen → Satz B'),task('geraeusche.html','Geräusche'),task('geraeusche-satz.html','Geräusch → Satz'),task('wetter-saetze.html','Wettersätze'),task('hoeren.html','Wetterbericht hören'),task('pruefung.html','Prüfung',{exam:true})
  ]),
  theme('Thema-2','Thema 2 · Himmelsrichtungen, Länder & Jahreszeiten',[
   task('karteikarten.html','Karteikarten'),task('bild-wort.html','Bild → Wort'),task('hoeren-schreiben.html','Hören und schreiben'),task('kategorien-drag.html','Kategorien zuordnen'),task('praepositionen.html','Präpositionen'),task('praepositionen-drag.html','Präpositionen zuordnen'),task('fehler-finden.html','Fehler finden'),task('postkarte.html','Postkarte'),task('saetze-bauen.html','Sätze bauen'),task('pruefung.html','Prüfung',{exam:true})
  ]),
  theme('Thema-3','Thema 3 · Restaurant, Akkusativ & Planen',[
   task('karteikarten.html','Karteikarten'),task('artikel.html','Artikel'),task('bild-wort.html','Bild → Wort'),task('komposita-bauen.html','Komposita bauen'),task('komposita-artikel.html','Komposita und Artikel'),task('akkusativ-bestimmt.html','Akkusativ: bestimmter Artikel'),task('akkusativ-unbestimmt.html','Akkusativ: unbestimmter Artikel'),task('meinen-deinen.html','meinen / deinen'),task('svo.html','Subjekt – Verb – Objekt'),task('nom-akk.html','Nominativ oder Akkusativ'),task('dialoge-planen.html','Dialoge planen'),task('nachrichten-rf.html','Nachrichten: richtig oder falsch'),task('fehler-finden.html','Fehler finden'),task('satz-bauen.html','Satz bauen'),task('pruefung.html','Prüfung',{exam:true})
  ]),
  theme('Thema-4','Thema 4 · Freizeit & Alltag',[
   task('task.html?task=cards','Karteikarten'),task('task.html?task=image-word','Bild → Wort'),task('task.html?task=word-image','Wort → Bild'),task('task.html?task=listen-image','Hören → Bild'),task('task.html?task=article','Artikel'),task('plural-sprechen.html','Plural sprechen'),task('task.html?task=sound-activity','Geräusch → Aktivität'),task('task.html?task=noun-verb','Nomen und Verb'),task('task.html?task=nehmen','nehmen'),task('task.html?task=yes-no-doch','Ja / Nein / Doch'),task('task.html?task=doch-answer','Mit „doch“ antworten'),task('task.html?task=dialog-rf','Dialog: richtig oder falsch'),task('aufgabe13-dialoge-20260728.html','Dialoge'),task('task.html?task=phrases','Redemittel'),task('task.html?task=gaps','Lücken ergänzen'),task('task.html?task=listen-abc','Hören A/B/C'),task('task.html?task=phrase-reaction','Passende Reaktion'),task('task.html?task=finden','finden'),task('task.html?task=questions','Fragen'),task('task.html?task=singular-plural','Singular und Plural'),task('task.html?task=exam','Prüfung',{exam:true})
  ])
 ]},
 {key:'A1-Lektion-7',title:'A1 Lektion 7 · Fähigkeiten, Vergangenheit und Schule',themes:[
  theme('Thema-1','Thema 1 · können, wollen und möchten',[
   task('task.html?task=karteikarten','Karteikarten'),task('task.html?task=bild-erklaerung-wort','Bild – Erklärung – Wort'),task('task.html?task=artikel-plural','Artikel und Plural'),task('task.html?task=koennen-formen','können – Formen'),task('task.html?task=wollen-formen','wollen – Formen'),task('task.html?task=verbform-waehlen','Verbform wählen'),task('task.html?task=aussagen-ordnen','Aussagen ordnen'),task('task.html?task=ja-nein-fragen','Ja/Nein-Fragen'),task('task.html?task=w-fragen','W-Fragen'),task('task.html?task=faehigkeiten-abstufen','Wie gut kannst du das?'),task('task.html?task=bildimpulse','Bildimpulse'),task('task.html?task=fragen-antworten','Fragen und Antworten'),task('task.html?task=partnerinterview','Partnerinterview'),task('task.html?task=wollen-moechten','wollen oder möchten'),task('task.html?task=dialoge-ergaenzen','Dialoge ergänzen'),task('task.html?task=hoeren-wuensche','Hören: Wünsche'),task('task.html?task=eigene-faehigkeiten','Eigene Fähigkeiten'),task('task.html?task=eigene-plaene','Eigene Pläne'),task('__exam__','Prüfung',{exam:true})
  ]),
  theme('Thema-2','Thema 2 · Perfekt mit haben',[
   task('task.html?task=karteikarten','Karteikarten'),task('task.html?task=infinitiv-partizip','Infinitiv – Partizip II'),task('task.html?task=memory','Memory'),task('task.html?task=endung-sortieren','Endungen sortieren'),task('task.html?task=endung-markieren','Endungen markieren'),task('task.html?task=silben-ordnen','Silben ordnen'),task('task.html?task=partizip-waehlen','Partizip II wählen'),task('task.html?task=partizip-schreiben','Partizip II schreiben'),task('task.html?task=hoeren-partizip','Partizip II hören'),task('task.html?task=fehler-korrigieren','Fehler korrigieren'),task('task.html?task=haben-konjugieren','haben konjugieren'),task('task.html?task=satzklammer','Satzklammer'),task('task.html?task=saetze-ordnen','Sätze ordnen'),task('task.html?task=saetze-bilden','Sätze bilden'),task('task.html?task=zeitangaben','Zeitangaben'),task('task.html?task=dialogluecken','Dialoglücken'),task('task.html?task=fragen-antworten','Fragen und Antworten'),task('task.html?task=lesen-tagesrueckblick','Tagesrückblick lesen'),task('task.html?task=hoeren-rueckblick','Rückblick hören'),task('task.html?task=eigene-saetze','Eigene Sätze'),task('__exam__','Prüfung',{exam:true})
  ]),
  theme('Thema-3','Thema 3 · Perfekt mit sein',[
   task('task.html?task=karteikarten','Karteikarten'),task('task.html?task=t3-partizip-finden-v2','Partizip II finden'),task('task.html?task=t3-memory-v2','Memory'),task('task.html?task=t3-partizip-bauen-v2','Partizip II bauen'),task('task.html?task=t3-endungen-v2','Endungen'),task('task.html?task=t3-partizip-schreiben-v2','Partizip II schreiben'),task('task.html?task=t3-hoeren-partizip-v2','Partizip II hören'),task('task.html?task=t3-sein-v2','sein konjugieren'),task('task.html?task=t3-grammatik-v2','Perfekt-Grammatik'),task('task.html?task=t3-saetze-v2','Sätze ordnen'),task('task.html?task=t3-saetze-schreiben-v2','Sätze schreiben'),task('task.html?task=t3-haben-sein-v2','haben oder sein'),task('task.html?task=t3-text-umschreiben-v2','Text umschreiben'),task('task.html?task=t3-fehler-korrigieren-v2','Fehler korrigieren'),task('task.html?task=t3-lesen-v2','Lesen'),task('task.html?task=t3-lueckentext-v2','Lückentext'),task('task.html?task=t3-schon-einmal-v1','Was hast du schon einmal gemacht?'),task('__exam__','Prüfung',{exam:true})
  ]),
  theme('Thema-4','Thema 4 · Kommunikation in der Schule',[
   task('task.html?task=karteikarten','Karteikarten'),task('task.html?task=artikel','Artikel und Plural'),task('task.html?task=wort-bedeutung','Bedeutung'),task('task.html?task=hoerdiktat','Hördiktat'),task('task.html?task=bild-hoeren','Bild und Hören'),task('task.html?task=redemittel-ordnen','Redemittel ordnen'),task('task.html?task=telefonluecken','Telefonatlücken'),task('task.html?task=lesen-richtig-falsch','Nachrichten lesen'),task('task.html?task=rechtschreibung','Fehler korrigieren'),task('task.html?task=hoeren-sekretariat','Hören Krankmeldungen'),task('task.html?task=hoerdialog-ordnen','Dialoge'),task('task.html?task=nachrichten-schule','Nachrichten aus der Schule'),task('task.html?task=email-ergaenzen','E-Mail ergänzen'),task('__exam__','Prüfung',{exam:true})
  ])
 ]}
];
const catalog={lessons};
window.SP_A1_RELEASE_CATALOG_L3_L7=catalog;
if(window.RELEASE_CATALOG&&Array.isArray(window.RELEASE_CATALOG.lessons)){
 const replace=new Map(lessons.map(item=>[item.key,item]));
 window.RELEASE_CATALOG.lessons=window.RELEASE_CATALOG.lessons.map(item=>replace.get(item.key)||item);
 for(const item of lessons)if(!window.RELEASE_CATALOG.lessons.some(row=>row.key===item.key))window.RELEASE_CATALOG.lessons.push(item);
}
})();