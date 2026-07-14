(function(){
  'use strict';

  const CATEGORY_GROUPS=['Himmelsrichtungen','Länder','Jahreszeiten'];
  const PREP_OPTIONS=['in','in der','in den','im','um','am'];

  const PREP_ONLY=[
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

  const PREP_IMAGE=[
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

  const PREP_DRAG=[
    {word:'Japan',a:'in'},{word:'Deutschland',a:'in'},{word:'Vietnam',a:'in'},
    {word:'Polen',a:'in'},{word:'Frankreich',a:'in'},{word:'Rumänien',a:'in'},
    {word:'Schweiz',a:'in der'},{word:'Türkei',a:'in der'},{word:'Ukraine',a:'in der'},
    {word:'USA',a:'in den'},{word:'Montag',a:'am'},{word:'Morgen',a:'am'},
    {word:'Abend',a:'am'},{word:'10 Uhr',a:'um'},{word:'8 Uhr',a:'um'},
    {word:'Herbst',a:'im'},{word:'Norden',a:'im'},{word:'Winter',a:'im'}
  ];

  const PREP_ERRORS=[
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

  function allWords(){
    try{return typeof window.words==='function'?window.words():(Array.isArray(window.WORDS)?window.WORDS:[])}catch(e){return Array.isArray(window.WORDS)?window.WORDS:[]}
  }
  function sentenceTotal(){try{return Array.isArray(window.SENTENCES)?window.SENTENCES.length:10}catch(e){return 10}}
  function taskPercent(file,total){try{return typeof window.pctFor==='function'?window.pctFor(file,total):0}catch(e){return 0}}

  function allTasks(){
    const count=allWords().length;
    return [
      ['karteikarten.html',count,'Karteikarten'],
      ['bild-wort.html',count,'Bild → Wort'],
      ['hoeren-bild.html',count,'Hören → Bild'],
      ['kategorien-drag.html',allWords().filter(w=>CATEGORY_GROUPS.includes(w.group)).length,'Kategorien · 2 Teile'],
      ['praepositionen.html',PREP_ONLY.length,'Richtige Präposition'],
      ['praepositionen-bild.html',PREP_IMAGE.length,'Bild → Präposition'],
      ['praepositionen-drag.html',PREP_DRAG.length,'Präpositionen zuordnen · 2 Teile'],
      ['fehler-finden.html',PREP_ERRORS.length,'Fehler finden und korrigieren'],
      ['postkarte.html',2,'Postkarten ergänzen'],
      ['saetze-bauen.html',sentenceTotal(),'Sätze bauen'],
      ['pruefung.html',20,'Prüfung']
    ];
  }
  function nonExamTasks(){return allTasks().filter(t=>t[0]!=='pruefung.html')}
  function examUnlocked(){return nonExamTasks().every(t=>taskPercent(t[0],t[1])>=100)}
  function topicComplete(){return allTasks().every(t=>taskPercent(t[0],t[1])>=100)}
  function repeatScope(){return 'wortschatz-a1-lektion-6-thema-2'}
  function currentRun(){return Math.max(1,Math.round(Number(localStorage.getItem('SP_SCORE_RUN_'+repeatScope())||1)||1)}
  function taskPoints(){const run=currentRun();return run===1?5:run===2?10:run===3?15:0}

  window.L6T2_CATEGORY_GROUPS=CATEGORY_GROUPS;
  window.L6T2_CATEGORY_WORDS=()=>allWords().filter(w=>CATEGORY_GROUPS.includes(w.group));
  window.L6T2_PREP_OPTIONS=PREP_OPTIONS;
  window.PREP_ONLY_ITEMS=PREP_ONLY;
  window.PREP_IMAGE_ITEMS=PREP_IMAGE;
  window.PREP_DRAG_ITEMS=PREP_DRAG;
  window.PREP_ERROR_ITEMS=PREP_ERRORS;
  window.L6T2_TASK_ICONS={'karteikarten.html':'🃏','bild-wort.html':'🖼️','hoeren-bild.html':'🎧','kategorien-drag.html':'🧺','praepositionen.html':'📍','praepositionen-bild.html':'🖼️','praepositionen-drag.html':'🧲','fehler-finden.html':'🛠️','postkarte.html':'✉️','saetze-bauen.html':'🧩','pruefung.html':'⭐'};
  window.l6t2AllTasks=allTasks;
  window.l6t2NonExamTasks=nonExamTasks;
  window.l6t2ExamUnlocked=examUnlocked;
  window.l6t2TopicComplete=topicComplete;
  window.l6t2RepeatScope=repeatScope;
  window.l6t2CurrentRun=currentRun;
  window.l6t2TaskPoints=taskPoints;
  window.SP_L6T2_EXTRA_READY=true;
})();