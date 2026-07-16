(function(){
  var tasks=[
    ['karteikarten.html','Karteikarten'],
    ['artikel.html','Artikel'],
    ['bild-wort.html','Bild → Wort'],
    ['komposita-artikel.html','Artikel von Komposita'],
    ['komposita-bauen.html','Komposita bauen'],
    ['svo.html','Subjekt · Verb · Objekt'],
    ['nom-akk.html','Nominativ oder Akkusativ'],
    ['akkusativ-bestimmt.html','der · den · die · das'],
    ['akkusativ-unbestimmt.html','ein · einen · eine'],
    ['meinen-deinen.html','mein · dein · Ihr'],
    ['akkusativ-praepositionen.html','Akkusativpräpositionen · optional'],
    ['bilddialoge.html','Bilddialoge · Artikel und Nomen'],
    ['dialoge-planen.html','Dialoge planen'],
    ['nachrichten-rf.html','Nachrichten R/F'],
    ['fehler-finden.html','Fehler finden'],
    ['satz-bauen.html','Satz bauen'],
    ['pruefung.html','Prüfung']
  ];
  function apply(lesson){
    if(!lesson||!Array.isArray(lesson.themes))return;
    var theme=lesson.themes.find(function(t){return t.key==='Thema-3'});
    if(theme)theme.tasks=tasks;
  }
  if(typeof L6_LESSON!=='undefined')apply(L6_LESSON);
  if(typeof RELEASE_CATALOG!=='undefined'&&RELEASE_CATALOG&&Array.isArray(RELEASE_CATALOG.lessons)){
    apply(RELEASE_CATALOG.lessons.find(function(l){return l.key==='A1-Lektion-6'}));
  }
  window.L6_T3_TASKS=tasks;
})();