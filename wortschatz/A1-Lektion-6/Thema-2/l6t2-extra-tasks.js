'use strict';

var L6T2_CATEGORY_GROUPS=['Himmelsrichtungen','Länder','Jahreszeiten'];
var L6T2_PREP_OPTIONS=['in','in der','in den','im','um','am'];

var PREP_ONLY_ITEMS=[
  {prompt:'Ich lebe ___ Deutschland.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Wir leben ___ Japan.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Ali lebt ___ Vietnam.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Meine Freundin lebt ___ Polen.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Sara lebt ___ Bulgarien.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Paul lebt ___ Frankreich.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Meine Familie lebt ___ Rumänien.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Ich lebe ___ Schweiz.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Wir leben ___ Türkei.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Oksana lebt ___ Ukraine.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Meine Tante lebt ___ USA.',a:'in den',hint:'Die USA stehen im Plural: in den USA.'},
  {prompt:'___ Norden ist es kalt.',a:'im',hint:'Himmelsrichtungen stehen mit im.'},
  {prompt:'___ Süden ist es warm.',a:'im',hint:'Himmelsrichtungen stehen mit im.'},
  {prompt:'___ Frühling scheint oft die Sonne.',a:'im',hint:'Jahreszeiten stehen mit im.'},
  {prompt:'___ Herbst regnet es oft.',a:'im',hint:'Jahreszeiten stehen mit im.'},
  {prompt:'Der Kurs beginnt ___ 10 Uhr.',a:'um',hint:'Vor einer Uhrzeit steht um.'},
  {prompt:'___ Montag habe ich Deutschkurs.',a:'am',hint:'Vor einem Wochentag steht am.'},
  {prompt:'___ Morgen höre ich den Wetterbericht.',a:'am',hint:'Vor einer Tageszeit steht am.'}
];

var PREP_IMAGE_ITEMS=[
  {id:'norden',a:'im',hint:'Himmelsrichtung'},
  {id:'japan',a:'in',hint:'Land ohne Artikel'},
  {id:'sommer',a:'im',hint:'Jahreszeit'},
  {id:'schweiz',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'osten',a:'im',hint:'Himmelsrichtung'},
  {id:'deutschland',a:'in',hint:'Land ohne Artikel'},
  {id:'winter',a:'im',hint:'Jahreszeit'},
  {id:'usa',a:'in den',hint:'Land im Plural'},
  {id:'sueden',a:'im',hint:'Himmelsrichtung'},
  {id:'vietnam',a:'in',hint:'Land ohne Artikel'},
  {id:'fruehling',a:'im',hint:'Jahreszeit'},
  {id:'tuerkei',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'westen',a:'im',hint:'Himmelsrichtung'},
  {id:'polen',a:'in',hint:'Land ohne Artikel'},
  {id:'herbst',a:'im',hint:'Jahreszeit'},
  {id:'ukraine',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'oesterreich',a:'in',hint:'Land ohne Artikel'},
  {id:'bulgarien',a:'in',hint:'Land ohne Artikel'},
  {id:'spanien',a:'in',hint:'Land ohne Artikel'},
  {id:'frankreich',a:'in',hint:'Land ohne Artikel'},
  {id:'rumaenien',a:'in',hint:'Land ohne Artikel'}
];

var PREP_DRAG_ITEMS=[
  {word:'Japan',a:'in'},{word:'Deutschland',a:'in'},{word:'Vietnam',a:'in'},
  {word:'Polen',a:'in'},{word:'Frankreich',a:'in'},{word:'Rumänien',a:'in'},
  {word:'Schweiz',a:'in der'},{word:'Türkei',a:'in der'},{word:'Ukraine',a:'in der'},
  {word:'USA',a:'in den'},{word:'Montag',a:'am'},{word:'Morgen',a:'am'},
  {word:'Abend',a:'am'},{word:'10 Uhr',a:'um'},{word:'8 Uhr',a:'um'},
  {word:'Herbst',a:'im'},{word:'Norden',a:'im'},{word:'Winter',a:'im'}
];

var PREP_ERROR_ITEMS=[
  {tokens:['Ich','lebe','im','Japan.'],wrongIndex:2,answer:'in',errorType:'Präposition'},
  {tokens:['In','Herbst','regnet','es','oft.'],wrongIndex:0,answer:'Im',errorType:'Präposition'},
  {tokens:['Ich','leben','in','Deutschland.'],wrongIndex:1,answer:'lebe',errorType:'Konjugation'},
  {tokens:['Am','zehn','Uhr','beginnt','der','Kurs.'],wrongIndex:0,answer:'Um',errorType:'Präposition'},
  {tokens:['Im','Süden','ist','es','heis.'],wrongIndex:4,answer:'heiß',errorType:'Rechtschreibung'},
  {tokens:['Die','Temperaturen','bleibt','angenehm.'],wrongIndex:2,answer:'bleiben',errorType:'Konjugation'},
  {tokens:['Ich','komme','aus','die','Türkei.'],wrongIndex:3,answer:'der',errorType:'Artikel'},
  {tokens:['Wir','leben','in','den','Schweiz.'],wrongIndex:3,answer:'der',errorType:'Artikel'},
  {tokens:['Um','Montag','habe','ich','Deutschkurs.'],wrongIndex:0,answer:'Am',errorType:'Präposition'},
  {tokens:['In','der','USA','lebt','meine','Tante.'],wrongIndex:1,answer:'den',errorType:'Artikel'},
  {tokens:['Der','Wind','kommen','aus','dem','Westen.'],wrongIndex:2,answer:'kommt',errorType:'Konjugation'},
  {tokens:['Im','Winter','schneien','es.'],wrongIndex:2,answer:'schneit',errorType:'Konjugation'},
  {tokens:['Ich','lebe','im','Deutschland.'],wrongIndex:2,answer:'in',errorType:'Präposition'},
  {tokens:['Die','Temperatur','sind','plus','zehn','Grad.'],wrongIndex:2,answer:'ist',errorType:'Konjugation'},
  {tokens:['Ich','lebe','in','Rumanien.'],wrongIndex:3,answer:'Rumänien',errorType:'Rechtschreibung'},
  {tokens:['Im','Norden','scheinen','die','Sonne.'],wrongIndex:2,answer:'scheint',errorType:'Konjugation'},
  {tokens:['Heute','ist','das','Wetter','angenehme.'],wrongIndex:4,answer:'angenehm',errorType:'Adjektivendung'},
  {tokens:['Ich','komme','aus','den','Ukraine.'],wrongIndex:3,answer:'der',errorType:'Artikel'},
  {tokens:['Im','Frühling','ist','die','Tage','länger.'],wrongIndex:2,answer:'sind',errorType:'Konjugation'},
  {tokens:['Im','Osten','scheint','der','Sonne.'],wrongIndex:3,answer:'die',errorType:'Artikel'}
];

function L6T2_CATEGORY_WORDS(){
  try{return words().filter(function(w){return L6T2_CATEGORY_GROUPS.includes(w.group)})}
  catch(e){return typeof WORDS!=='undefined'?WORDS.filter(function(w){return L6T2_CATEGORY_GROUPS.includes(w.group)}):[]}
}
function l6t2WordCount(){try{return words().length}catch(e){return typeof WORDS!=='undefined'?WORDS.length:0}}
function l6t2SentenceTotal(){try{return SENTENCES.length}catch(e){return 10}}
function l6t2TaskPercent(file,total){try{return pctFor(file,total)}catch(e){return 0}}
function l6t2AllTasks(){
  var count=l6t2WordCount();
  return [
    ['karteikarten.html',count,'Karteikarten'],
    ['bild-wort.html',count,'Bild → Wort'],
    ['hoeren-bild.html',count,'Hören → Bild'],
    ['kategorien-drag.html',L6T2_CATEGORY_WORDS().length,'Kategorien · 2 Teile'],
    ['praepositionen.html',PREP_ONLY_ITEMS.length,'Richtige Präposition'],
    ['praepositionen-bild.html',PREP_IMAGE_ITEMS.length,'Bild → Präposition'],
    ['praepositionen-drag.html',PREP_DRAG_ITEMS.length,'Präpositionen zuordnen · 2 Teile'],
    ['fehler-finden.html',PREP_ERROR_ITEMS.length,'Fehler finden und korrigieren'],
    ['postkarte.html',2,'Postkarten ergänzen'],
    ['saetze-bauen.html',l6t2SentenceTotal(),'Sätze bauen'],
    ['pruefung.html',20,'Prüfung']
  ];
}
function l6t2NonExamTasks(){return l6t2AllTasks().filter(function(t){return t[0]!=='pruefung.html'})}
function l6t2ExamUnlocked(){return l6t2NonExamTasks().every(function(t){return l6t2TaskPercent(t[0],t[1])>=100})}
function l6t2TopicComplete(){return l6t2AllTasks().every(function(t){return l6t2TaskPercent(t[0],t[1])>=100})}
function l6t2RepeatScope(){return 'wortschatz-a1-lektion-6-thema-2'}
function l6t2CurrentRun(){return Math.max(1,Math.round(Number(localStorage.getItem('SP_SCORE_RUN_'+l6t2RepeatScope())||1)||1)}
function l6t2TaskPoints(){var run=l6t2CurrentRun();return run===1?5:run===2?10:run===3?15:0}
var L6T2_TASK_ICONS={'karteikarten.html':'🃏','bild-wort.html':'🖼️','hoeren-bild.html':'🎧','kategorien-drag.html':'🧺','praepositionen.html':'📍','praepositionen-bild.html':'🖼️','praepositionen-drag.html':'🧲','fehler-finden.html':'🛠️','postkarte.html':'✉️','saetze-bauen.html':'🧩','pruefung.html':'⭐'};
window.SP_L6T2_EXTRA_READY=true;