(function(){
'use strict';
const noun=(id,article,word,plural,section,extra=false)=>({id,article,word,full:`${article} ${word}`,plural,section,type:'noun',extra});
const word=(id,wordValue,type,section,extra=false)=>({id,word:wordValue,full:wordValue,article:'',plural:'',section,type,extra});

const t1Core=[
 word('muessen','müssen','modal','Grammatik'),word('man','man','pronoun','Grammatik'),
 word('zuerst','zuerst','adverb','Reihenfolge'),word('dann','dann','adverb','Reihenfolge'),word('danach','danach','adverb','Reihenfolge'),word('zum_schluss','zum Schluss','phrase','Reihenfolge'),
 noun('fuehrerschein','der','Führerschein','die Führerscheine','Dokumente'),noun('antrag','der','Antrag','die Anträge','Dokumente'),noun('formular','das','Formular','die Formulare','Dokumente'),
 word('ausfuellen','ausfüllen','verb','Handlungen'),word('auswaehlen','auswählen','verb','Handlungen'),word('waehlen','wählen','verb','Handlungen'),word('ankreuzen','ankreuzen','verb','Handlungen'),
 noun('papiere','die','Papiere','die Papiere','Dokumente'),noun('unterlagen','die','Unterlagen','die Unterlagen','Dokumente'),noun('dokument','das','Dokument','die Dokumente','Dokumente'),
 noun('behoerde','die','Behörde','die Behörden','Ämter'),noun('amt','das','Amt','die Ämter','Ämter'),
 noun('urkunde','die','Urkunde','die Urkunden','Dokumente'),noun('bescheinigung','die','Bescheinigung','die Bescheinigungen','Dokumente'),noun('ausweis','der','Ausweis','die Ausweise','Dokumente'),noun('reisepass','der','Reisepass','die Reisepässe','Dokumente'),
 noun('ziel','das','Ziel','die Ziele','Anleitungen'),noun('fahrkarte','die','Fahrkarte','die Fahrkarten','Anleitungen'),noun('fahrkartenautomat','der','Fahrkartenautomat','die Fahrkartenautomaten','Anleitungen'),noun('kaffeemaschine','die','Kaffeemaschine','die Kaffeemaschinen','Anleitungen'),
 noun('kind','das','Kind','die Kinder','Anleitungen'),noun('erwachsene','der/die','Erwachsene','die Erwachsenen','Anleitungen'),
 word('bezahlen','bezahlen','verb','Handlungen'),word('eingeben','eingeben','verb','Handlungen'),word('druecken','drücken','verb','Handlungen'),word('bestaetigen','bestätigen','verb','Handlungen'),word('unterschreiben','unterschreiben','verb','Handlungen'),word('mitbringen','mitbringen','verb','Behörde')
];
const t1Extra=[
 noun('auslaenderbehoerde','die','Ausländerbehörde','die Ausländerbehörden','Zusatz: Ämter',true),
 noun('jobcenter','das','Jobcenter','die Jobcenter','Zusatz: Ämter',true),
 noun('buergeramt','das','Bürgeramt','die Bürgerämter','Zusatz: Ämter',true),
 noun('buergerbuero','das','Bürgerbüro','die Bürgerbüros','Zusatz: Ämter',true),
 noun('sozialamt','das','Sozialamt','die Sozialämter','Zusatz: Ämter',true),
 noun('standesamt','das','Standesamt','die Standesämter','Zusatz: Ämter',true),
 noun('jugendamt','das','Jugendamt','die Jugendämter','Zusatz: Ämter',true),
 noun('arbeitsagentur','die','Arbeitsagentur','die Arbeitsagenturen','Zusatz: Ämter',true),
 noun('arbeitsamt','das','Arbeitsamt','die Arbeitsämter','Zusatz: Ämter',true)
];

window.L9_THEMES={
 1:{
  title:'Was muss man machen?',subtitle:'müssen · man · Reihenfolge · Anleitungen und Behörde',chips:['müssen','man','zuerst · dann · danach','Anleitungen','Behörde'],
  grammar:{
   modal:'müssen',forms:['ich muss','du musst','er/sie/es muss','wir müssen','ihr müsst','sie/Sie müssen','man muss'],
   statement:'Subjekt + müssen + weitere Satzteile + Infinitiv am Ende',
   yesNo:'Müssen + Subjekt + weitere Satzteile + Infinitiv?',
   wQuestion:'Fragewort + müssen + Subjekt + weitere Satzteile + Infinitiv?',
   man:'man = eine Person / Menschen allgemein; mit man steht das Verb in der 3. Person Singular: man muss.',
   sequence:['zuerst','dann','danach','zum Schluss']
  },
  coreVocabulary:t1Core,extraVocabulary:t1Extra,extraSelectionKey:'SP_L9_T1_EXTRA_BEHOERDEN',
  examples:[
   'Man muss zuerst das Ziel auswählen.','Dann muss man Erwachsene oder Kind auswählen.','Danach muss man bezahlen.','Zum Schluss muss man die Fahrkarte nehmen.',
   'Was muss ich für den Antrag mitbringen?','Muss man das Formular unterschreiben?'
  ],
  tasks:[
   'Karteikarten: Kernwortschatz','Optionaler Zusatzwortschatz: Ämter auswählen','Bild oder Erklärung → Wort','Artikel und Plural','müssen: Formen lernen','man: Bedeutung und Verbform','Verbform auswählen','Aussagesätze mit müssen ordnen','Ja-/Nein-Fragen mit müssen ordnen','W-Fragen mit müssen ordnen','Reihenfolge: zuerst – dann – danach – zum Schluss','Anleitung ordnen: Fahrkartenautomat','Anleitung bauen: Kaffeemaschine','Frage und Antwort verbinden','Dokumente und Behörde zuordnen','Mini-Dialog: Was muss ich mitbringen?','Eigene kurze Anleitung schreiben oder sprechen','Hören: kurze Anleitungen verstehen','Themenprüfung'
  ]
 },
 2:{title:'Mach das bitte!',subtitle:'Imperativ · Anweisungen geben und verstehen',chips:['Imperativ','du · ihr · Sie','Anweisungen','Bitte'],tasks:['Imperativformen erkennen','du-Imperativ bilden','ihr-Imperativ bilden','Sie-Imperativ bilden','Anweisungen ordnen','Schilder und kurze Hinweise verstehen','Dialoge ergänzen','Eigene Anweisung geben','Themenprüfung']},
 3:{title:'Was darf man?',subtitle:'dürfen · erlaubt und verboten · man darf / man darf nicht',chips:['dürfen','erlaubt','verboten','man darf nicht'],tasks:['dürfen konjugieren','man darf / man darf nicht','Verbform auswählen','Sätze ordnen','Fragen bilden','Schilder: erlaubt oder verboten','Situationen zuordnen','Eigene Regeln formulieren','Themenprüfung']},
 4:{title:'Auf der Behörde',subtitle:'Gespräche führen · nachfragen · Nichtverstehen ausdrücken',chips:['Behörde','Gespräch','nachfragen','verstehen'],tasks:['Wortschatz wiederholen','Typische Sätze am Schalter','Ich verstehe das nicht','Können Sie das bitte wiederholen?','Was bedeutet …?','Welche Unterlagen brauche ich?','Dialoge ordnen','Hören: Gespräch am Schalter','Rollenspiel mit Gerüst','Themenprüfung']}
};
window.L9_T1_WORDS=[...t1Core,...t1Extra];
})();