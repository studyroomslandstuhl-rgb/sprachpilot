(function(){
'use strict';
window.L7_STRUCTURE={
 lesson:'A1-Lektion-7',
 level:'A1',
 status:'interactive-v1-complete',
 interactiveStatus:'built-v1',
 contentRoot:'wortschatz/A1-Lektion-7/',
 sharedFiles:['shared/l7-style.css','shared/l7-state.js','shared/l7-ui.js','shared/l7-boot.js'],
 totals:{themes:4,tasks:85,items:678},
 globalRules:{
  articlesAndPlurals:true,
  repeatWrongAtEnd:true,
  blockUntilCorrect:true,
  threeStageHelp:true,
  correctAnswerStillRequiredAfterSolution:true,
  writingFallbackForSpeaking:true,
  microphoneTechnicalErrorCountsWrong:false,
  teacherPreviewScores:false,
  savePartialProgress:true,
  examRequiresAllTasksAt100:true,
  passive:false,
  closedTasksNeedOneAnswer:true,
  solutionsRequired:true,
  unclearWordsExcluded:['Direktometer']
 },
 themes:[
  {
   id:'Thema-1',
   title:'können, wollen und möchten',
   contentSource:'Thema-1/INHALTE.md',
   overview:'Thema-1/index.html',
   taskPage:'Thema-1/task.html',
   dataSource:'Thema-1/data-loader.js',
   taskCount:19,
   itemCount:148,
   grammar:['können','wollen','Modalverb auf Position 2','Infinitiv am Satzende','Ja-/Nein-Fragen','W-Fragen','wollen oder möchten'],
   taskOrder:['karteikarten','bild-erklaerung-wort','artikel-plural','koennen-formen','wollen-formen','verbform-waehlen','aussagen-ordnen','ja-nein-fragen','w-fragen','faehigkeiten-abstufen','bildimpulse','fragen-antworten','partnerinterview','wollen-moechten','dialoge-ergaenzen','hoeren-wuensche','eigene-faehigkeiten','eigene-plaene','pruefung']
  },
  {
   id:'Thema-2',
   title:'Perfekt mit haben',
   contentSource:'Thema-2/INHALTE.md',
   overview:'Thema-2/index.html',
   taskPage:'Thema-2/task.html',
   dataSource:'Thema-2/data-loader.js',
   taskCount:21,
   itemCount:234,
   grammar:['haben im Perfekt','Partizip II','Endung -t','Endung -en','Partizip am Satzende','Zeitangaben'],
   restrictions:['nur Perfekt mit haben','keine Bewegungsverben mit sein'],
   taskOrder:['karteikarten','infinitiv-partizip','memory','endung-sortieren','endung-markieren','silben-ordnen','partizip-waehlen','partizip-schreiben','hoeren-partizip','fehler-korrigieren','haben-konjugieren','satzklammer','saetze-ordnen','saetze-bilden','zeitangaben','dialogluecken','fragen-antworten','lesen-tagesrueckblick','hoeren-rueckblick','eigene-saetze','pruefung']
  },
  {
   id:'Thema-3',
   title:'Perfekt mit sein und Bewegungsverben',
   contentSource:'Thema-3/INHALTE.md',
   overview:'Thema-3/index.html',
   taskPage:'Thema-3/task.html',
   dataSource:'Thema-3/data-loader.js',
   taskCount:22,
   itemCount:146,
   grammar:['sein im Perfekt','gegangen','gefahren','gekommen','geflogen','gewandert','haben oder sein'],
   restrictions:['zuerst nur Perfekt mit sein','haben/sein erst in der zweiten Phase'],
   taskOrder:['karteikarten','infinitiv-partizip','sein-konjugieren','hilfsverb-sein','partizip-waehlen','saetze-ordnen','bild-satz','bildimpulse','saetze-bilden','ja-nein-fragen','w-fragen','dialoge','hoeren-bewegung','haben-sein-sortieren','hilfsverb-waehlen','hilfsverb-schreiben','gemischte-saetze','fehler-korrigieren','lesen-wochenende','hoeren-was-passiert','eigene-saetze','pruefung']
  },
  {
   id:'Thema-4',
   title:'Kommunikation in der Schule',
   contentSource:'Thema-4/INHALTE.md',
   overview:'Thema-4/index.html',
   taskPage:'Thema-4/task.html',
   dataSource:'Thema-4/data-loader.js',
   taskCount:23,
   itemCount:150,
   grammar:['können in Mitteilungen','Perfekt als Wiederholung','Artikel','Singular und Plural'],
   taskOrder:['karteikarten','artikel','plural-sprechen','wort-bedeutung','redemittel-ordnen','lesen-richtig-falsch','lesen-abc','informationen-markieren','ueberschrift','rechtschreibung','informationen-schreiben','hoeren-sekretariat','hoerdialog-ordnen','telefonluecken','telefonat-sprechen','dialog-deutschkurs','dialog-schulausflug','dialog-treffpunkt','entschuldigung-schule','nachricht-deutschkurs','entschuldigung-pruefen','eigener-dialog','pruefung']
  }
 ]
};
})();