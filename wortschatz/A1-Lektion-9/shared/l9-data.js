(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const media=id=>({image:`${CDN}${id}.webp`,audio:`${AUDIO}${id}.mp3`});
const noun=(id,article,wordValue,plural,section,example='')=>({id,article,word:wordValue,full:`${article} ${wordValue}`,plural,section,type:'noun',example,...media(id)});
const word=(id,wordValue,type,section,{perfect='',example=''}={})=>({id,word:wordValue,full:wordValue,article:'',plural:'',section,type,perfect,example,...media(id)});

const t1Core=[
 word('muessen','müssen','modal','Grammatik',{perfect:'hat gemusst',example:'Was muss man hier machen?'}),
 word('man','man','pronoun','Grammatik',{example:'Man muss den Antrag ausfüllen.'}),
 word('zuerst','zuerst','adverb','Reihenfolge',{example:'Zuerst muss man das Ziel wählen.'}),
 word('danach','danach','adverb','Reihenfolge',{example:'Danach muss man Erwachsene auswählen.'}),
 word('dann','dann','adverb','Reihenfolge',{example:'Dann muss man bezahlen.'}),
 word('zum_schluss','zum Schluss','phrase','Reihenfolge',{example:'Zum Schluss muss man die Fahrkarte nehmen.'}),
 noun('fuehrerschein','der','Führerschein','die Führerscheine','Dokumente & Mobilität','Der Führerschein ist gültig.'),
 noun('ticket','das','Ticket','die Tickets','Dokumente & Mobilität','Ich brauche ein Ticket.'),
 noun('amt','das','Amt','die Ämter','Behörde','Ich muss zum Amt.'),
 word('gueltig','gültig','adjective','Eigenschaften',{example:'Der Führerschein ist noch gültig.'}),
 word('mieten','mieten','verb','Handlungen',{perfect:'hat gemietet',example:'Man kann ein Auto mieten.'}),
 word('auslaendisch','ausländisch','adjective','Eigenschaften',{example:'Das ist ein ausländischer Führerschein.'}),
 word('europaeisch','europäisch','adjective','Eigenschaften',{example:'Das ist ein europäischer Führerschein.'}),
 noun('europaeische_union','die','Europäische Union','kein Plural','Behörde & Europa','Deutschland ist in der Europäischen Union.'),
 word('jung','jung','adjective','Eigenschaften',{example:'Die Person ist noch jung.'}),
 noun('fahrt','die','Fahrt','die Fahrten','Mobilität','Die Fahrt dauert 20 Minuten.'),
 noun('fahrkarte','die','Fahrkarte','die Fahrkarten','Mobilität','Ich kaufe eine Fahrkarte.'),
 noun('antrag','der','Antrag','die Anträge','Dokumente & Behörde','Ich stelle einen Antrag.'),
 noun('ausweis','der','Ausweis','die Ausweise','Dokumente & Behörde','Bitte bringen Sie den Ausweis mit.'),
 noun('papiere','die','Papiere','nur Plural','Dokumente & Behörde','Man muss die Papiere unterschreiben.'),
 noun('automat','der','Automat','die Automaten','Mobilität','Der Automat funktioniert.'),
 noun('ziel','das','Ziel','die Ziele','Mobilität','Wählen Sie zuerst das Ziel.'),
 noun('erwachsener','der','Erwachsene','die Erwachsenen','Personen','Wählen Sie Erwachsener oder Kind aus.'),
 noun('erwachsene','die','Erwachsene','die Erwachsenen','Personen','Die Erwachsene kauft eine Fahrkarte.'),
 noun('autovermietung','die','Autovermietung','die Autovermietungen','Mobilität','Das Auto ist bei der Autovermietung.'),
 noun('unterlagen','die','Unterlagen','nur Plural','Dokumente & Behörde','Welche Unterlagen muss ich mitbringen?'),
 noun('dokument','das','Dokument','die Dokumente','Dokumente & Behörde','Das Dokument ist wichtig.'),
 noun('wechselgeld','das','Wechselgeld','kein Plural','Bezahlen','Der Automat gibt Wechselgeld.'),
 word('ausfuellen','ausfüllen','verb','Handlungen',{perfect:'hat ausgefüllt',example:'Man muss den Antrag ausfüllen.'}),
 word('mitbringen','mitbringen','verb','Handlungen',{perfect:'hat mitgebracht',example:'Man muss den Ausweis mitbringen.'}),
 word('unterschreiben','unterschreiben','verb','Handlungen',{perfect:'hat unterschrieben',example:'Man muss die Papiere unterschreiben.'}),
 word('bar','bar','adverb','Bezahlen',{example:'Man kann bar bezahlen.'}),
 word('funktionieren','funktionieren','verb','Handlungen',{perfect:'hat funktioniert',example:'Der Automat funktioniert.'}),
 word('waehlen','wählen','verb','Handlungen',{perfect:'hat gewählt',example:'Man muss zuerst das Ziel wählen.'}),
 word('auswaehlen','auswählen','verb','Handlungen',{perfect:'hat ausgewählt',example:'Danach muss man Erwachsene auswählen.'}),
 word('abholen','abholen','verb','Handlungen',{perfect:'hat abgeholt',example:'Man muss das Auto abholen.'}),
 word('wiederholen','wiederholen','verb','Handlungen',{perfect:'hat wiederholt',example:'Können Sie das bitte wiederholen?'}),
 word('stempeln','stempeln','verb','Handlungen',{perfect:'hat gestempelt',example:'Die Behörde hat das Dokument gestempelt.'}),
 word('einen_antrag_stellen','einen Antrag stellen','phrase','Feste Verbindungen',{perfect:'hat einen Antrag gestellt',example:'Ich muss einen Antrag stellen.'}),
 word('einen_antrag_ausfuellen','einen Antrag ausfüllen','phrase','Feste Verbindungen',{perfect:'hat einen Antrag ausgefüllt',example:'Ich muss einen Antrag ausfüllen.'})
];

const t2Core=[
 word('leiser','leiser','adverb','Imperativ & Sprechen',{example:'Sprich bitte leiser.'}),
 word('erklaeren','erklären','verb','Imperativ & Handlungen',{perfect:'hat erklärt',example:'Erklären Sie das bitte noch einmal.'}),
 word('laut','laut','adverb','Imperativ & Sprechen',{example:'Sprich bitte nicht so laut.'}),
 word('ausmachen','ausmachen','verb','Imperativ & Handlungen',{perfect:'hat ausgemacht',example:'Mach bitte das Handy aus.'}),
 word('zuhoeren','zuhören','verb','Imperativ & Handlungen',{perfect:'hat zugehört',example:'Hör bitte zu.'}),
 word('aufstehen','aufstehen','verb','Imperativ & Handlungen',{perfect:'ist aufgestanden',example:'Steh bitte auf.'}),
 word('warten','warten','verb','Imperativ & Handlungen',{perfect:'hat gewartet',example:'Warten Sie bitte hier.'}),
 noun('gebuehr','die','Gebühr','die Gebühren','Sprachschule','Die Gebühr ist 50 Euro.'),
 noun('kasse','die','Kasse','die Kassen','Sprachschule','Bezahlen Sie bitte an der Kasse.'),
 word('lachen','lachen','verb','Imperativ & Handlungen',{perfect:'hat gelacht',example:'Die Kursteilnehmer lachen.'}),
 word('aufhoeren','aufhören','verb','Imperativ & Handlungen',{perfect:'hat aufgehört',example:'Hör bitte auf.'}),
 word('doch','doch','modalpartikel','Modalpartikeln',{example:'Komm doch bitte rein.'}),
 word('bitte','bitte','modalpartikel','Modalpartikeln',{example:'Warten Sie bitte hier.'}),
 word('mal','mal','modalpartikel','Modalpartikeln',{example:'Hör mal zu.'}),
 noun('anmeldung','die','Anmeldung','die Anmeldungen','Sprachschule','Die Anmeldung ist im ersten Stock.'),
 noun('kursgebuehr','die','Kursgebühr','die Kursgebühren','Sprachschule','Die Kursgebühr bezahlt man an der Kasse.'),
 noun('stock','der','Stock','die Stockwerke','Ort','Der Unterricht ist im zweiten Stock.'),
 noun('unterricht','der','Unterricht','kein Plural','Sprachschule','Der Unterricht beginnt um neun.'),
 noun('sprachschule','die','Sprachschule','die Sprachschulen','Sprachschule','Ich lerne Deutsch in einer Sprachschule.')
];

const t3Core=[
 noun('moment','der','Moment','die Momente','Regeln & Situationen','Einen Moment, bitte.'),
 word('beantragen','beantragen','verb','Handlungen',{perfect:'hat beantragt',example:'Ich möchte einen Ausweis beantragen.'}),
 word('duerfen','dürfen','modal','Grammatik',{perfect:'hat gedurft',example:'Darf man hier parken?'}),
 word('achtung','Achtung!','interjection','Regeln & Schilder',{example:'Achtung! Hier darf man nicht rauchen.'}),
 noun('zigarette','die','Zigarette','die Zigaretten','Regeln','Hier sind Zigaretten verboten.'),
 word('rauchen','rauchen','verb','Handlungen',{perfect:'hat geraucht',example:'Man darf hier nicht rauchen.'}),
 word('langsam','langsam','adverb','Regeln',{example:'Fahren Sie bitte langsam.'}),
 noun('parkplatz','der','Parkplatz','die Parkplätze','Regeln','Hier ist ein Parkplatz.'),
 word('parken','parken','verb','Handlungen',{perfect:'hat geparkt',example:'Darf man hier parken?'}),
 word('erlaubt','erlaubt','adjective','Regeln',{example:'Parken ist hier erlaubt.'}),
 word('verboten','verboten','adjective','Regeln',{example:'Rauchen ist hier verboten.'}),
 noun('gepaeck','das','Gepäck','kein Plural','Reise & Regeln','Das Gepäck ist schwer.'),
 word('abgeben','abgeben','verb','Handlungen',{perfect:'hat abgegeben',example:'Man muss das Gepäck abgeben.'}),
 word('mitnehmen','mitnehmen','verb','Handlungen',{perfect:'hat mitgenommen',example:'Darf ich den Laptop mitnehmen?'}),
 noun('laptop','der','Laptop','die Laptops','Reise & Regeln','Der Laptop ist im Gepäck.'),
 noun('regel','die','Regel','die Regeln','Regeln','Das sind die Regeln.')
];

const t4Core=[
 word('allein','allein','adverb','Personen',{example:'Die Person kommt allein.'}),
 noun('behoerde','die','Behörde','die Behörden','Behörde','Ich habe einen Termin bei der Behörde.'),
 noun('meldebehoerde','die','Meldebehörde','die Meldebehörden','Behörde','Ich bin wegen der Anmeldung bei der Meldebehörde.'),
 noun('anmeldung_behoerde','die','Anmeldung','die Anmeldungen','Behörde','Ich bin wegen der Anmeldung hier.'),
 noun('person','die','Person','die Personen','Personendaten','Die Person füllt das Formular aus.'),
 noun('geburtsname','der','Geburtsname','die Geburtsnamen','Personendaten','Wie ist Ihr Geburtsname?'),
 noun('geschlecht','das','Geschlecht','die Geschlechter','Personendaten','Bitte geben Sie das Geschlecht an.')
];

const t5Core=[
 noun('buergeramt','das','Bürgeramt','die Bürgerämter','Behörden','Für viele Anmeldungen geht man zum Bürgeramt.'),
 noun('buergerbuero','das','Bürgerbüro','die Bürgerbüros','Behörden','Das Bürgerbüro hilft bei vielen Anliegen.'),
 noun('meldebehoerde_t5','die','Meldebehörde','die Meldebehörden','Behörden','Bei der Meldebehörde meldet man den Wohnsitz an.'),
 noun('auslaenderbehoerde','die','Ausländerbehörde','die Ausländerbehörden','Behörden','Ich habe einen Termin bei der Ausländerbehörde.'),
 noun('standesamt','das','Standesamt','die Standesämter','Behörden','Das Standesamt stellt Urkunden aus.'),
 noun('jobcenter','das','Jobcenter','die Jobcenter','Behörden','Ich habe einen Termin beim Jobcenter.'),
 noun('agentur_fuer_arbeit','die','Agentur für Arbeit','die Agenturen für Arbeit','Behörden','Die Agentur für Arbeit hilft bei der Arbeitssuche.'),
 noun('finanzamt','das','Finanzamt','die Finanzämter','Behörden','Das Finanzamt ist für Steuern zuständig.'),
 noun('sozialamt','das','Sozialamt','die Sozialämter','Behörden','Ich brauche Informationen vom Sozialamt.'),
 noun('jugendamt','das','Jugendamt','die Jugendämter','Behörden','Das Jugendamt hilft Familien.'),
 noun('fahrerlaubnisbehoerde','die','Fahrerlaubnisbehörde','die Fahrerlaubnisbehörden','Behörden','Ich brauche einen Termin bei der Fahrerlaubnisbehörde.'),
 noun('kfz_zulassungsstelle','die','Kfz-Zulassungsstelle','die Kfz-Zulassungsstellen','Behörden','Ich möchte mein Auto anmelden.'),
 noun('gesundheitsamt','das','Gesundheitsamt','die Gesundheitsämter','Behörden','Ich habe einen Termin beim Gesundheitsamt.'),
 noun('reisepass','der','Reisepass','die Reisepässe','Unterlagen','Bitte bringen Sie den Reisepass mit.'),
 noun('aufenthaltstitel','der','Aufenthaltstitel','die Aufenthaltstitel','Unterlagen','Ich möchte meinen Aufenthaltstitel verlängern.'),
 noun('geburtsurkunde','die','Geburtsurkunde','die Geburtsurkunden','Unterlagen','Ich brauche eine Geburtsurkunde.'),
 noun('heiratsurkunde','die','Heiratsurkunde','die Heiratsurkunden','Unterlagen','Bitte bringen Sie die Heiratsurkunde mit.'),
 noun('meldebescheinigung','die','Meldebescheinigung','die Meldebescheinigungen','Unterlagen','Ich brauche eine Meldebescheinigung.'),
 noun('wohnungsgeberbestaetigung','die','Wohnungsgeberbestätigung','die Wohnungsgeberbestätigungen','Unterlagen','Für die Anmeldung brauche ich eine Wohnungsgeberbestätigung.'),
 noun('mietvertrag','der','Mietvertrag','die Mietverträge','Unterlagen','Ich habe den Mietvertrag dabei.'),
 noun('arbeitsvertrag','der','Arbeitsvertrag','die Arbeitsverträge','Unterlagen','Bitte bringen Sie den Arbeitsvertrag mit.'),
 noun('passfoto','das','Passfoto','die Passfotos','Unterlagen','Ich brauche ein Passfoto.'),
 noun('steuer_id','die','Steuer-ID','die Steuer-IDs','Unterlagen','Wie lautet Ihre Steuer-ID?'),
 noun('fahrzeugpapiere','die','Fahrzeugpapiere','nur Plural','Unterlagen','Bitte bringen Sie die Fahrzeugpapiere mit.'),
 noun('versicherungsnachweis','der','Versicherungsnachweis','die Versicherungsnachweise','Unterlagen','Für die Anmeldung brauche ich einen Versicherungsnachweis.')
];

window.L9_THEMES={
 1:{
  title:'Was muss man machen?',subtitle:'müssen · man · Behörde · Fahrkarte · Anleitungen',chips:['müssen','man','zuerst · danach · dann · zum Schluss','Behörde','Anleitungen'],
  grammar:{modal:'müssen',forms:['ich muss','du musst','er/sie/es muss','wir müssen','ihr müsst','sie/Sie müssen','man muss'],statement:'Subjekt + müssen + weitere Satzteile + Infinitiv am Ende',yesNo:'Müssen + Subjekt + weitere Satzteile + Infinitiv?',wQuestion:'Fragewort + müssen + Subjekt + weitere Satzteile + Infinitiv?',man:'man = Menschen allgemein; das Verb steht in der 3. Person Singular: man muss.',sequence:['zuerst','danach','dann','zum Schluss']},
  coreVocabulary:t1Core,
  examples:['Was muss ich in der Behörde machen?','Ich muss einen Antrag stellen.','Ich muss einen Antrag ausfüllen.','Man muss zuerst das Ziel wählen.','Danach muss man Erwachsene auswählen.','Dann muss man bezahlen.','Zum Schluss muss man die Fahrkarte nehmen.'],
  tasks:['Karteikarten: Wortschatz + Perfektformen','Bild oder Erklärung → Wort','Nomen: Artikel und Plural','Verben: Infinitiv und Perfekt','müssen vollständig konjugieren','man + muss','Aussagen mit müssen','Fragen mit müssen','Reihenfolge: zuerst – danach – dann – zum Schluss','Anweisungen am Fahrkartenautomaten verstehen','Behördengespräch: Was muss ich machen?','Anleitung hören und Schritte ordnen','Eigene kurze Anleitung geben','Themenprüfung']
 },
 2:{
  title:'Mach das bitte!',subtitle:'Imperativ bilden und verstehen · du, ihr, Sie · doch, bitte, mal',chips:['Imperativ','du · ihr · Sie','doch · bitte · mal','Anweisungen'],
  coreVocabulary:t2Core,
  tasks:['Karteikarten: Wortschatz + Perfektformen','Imperativ oder Aussagesatz?','du · ihr · Sie unterscheiden','du-Imperativ bilden','ihr-Imperativ bilden','Sie-Imperativ bilden','dieselbe Anweisung in du / ihr / Sie','trennbare Verben im Imperativ','Imperativform aus dem Kontext auswählen','gehörte Anweisung verstehen','passende Anweisung auswählen','doch · bitte · mal ergänzen','Sprachschule: Dialoge ergänzen','eigene Anweisungen sprechen oder schreiben','Mischaufgabe Imperativ','Themenprüfung']
 },
 3:{
  title:'Was darf man?',subtitle:'dürfen · müssen · erlaubt und verboten · Regeln',chips:['dürfen','müssen','darf nicht ≠ muss nicht','erlaubt · verboten','Regeln'],
  grammar:{modal:'dürfen',forms:['ich darf','du darfst','er/sie/es darf','wir dürfen','ihr dürft','sie/Sie dürfen','man darf'],contrasts:['ich darf = erlaubt','ich darf nicht = verboten','ich muss = notwendig','ich muss nicht = nicht notwendig']},
  coreVocabulary:t3Core,
  examples:['Ich darf hier parken.','Ich darf hier nicht parken.','Ich muss hier warten.','Ich muss hier nicht warten.'],
  tasks:['Karteikarten: Wortschatz + Perfektformen','dürfen vollständig konjugieren','man darf / man darf nicht','Aussagen und Fragen mit dürfen','erlaubt oder verboten','Schilder und Regeln verstehen','darf / darf nicht / muss / muss nicht','Bedeutung: erlaubt / verboten / notwendig / nicht notwendig','dürfen oder müssen aus dem Kontext','Regel-Dialoge ergänzen','Gepäck: abgeben oder mitnehmen','eigene Regeln formulieren','Mischaufgabe dürfen + müssen','Themenprüfung']
 },
 4:{
  title:'Bei der Behörde',subtitle:'Anmeldung · Personendaten · verstehen und um Hilfe bitten',chips:['Meldebehörde','Anmeldung','Personendaten','Hilfe','nachfragen'],
  coreVocabulary:t4Core,
  examples:['Guten Tag. Ich möchte mich anmelden.','Ich verstehe das nicht.','Können Sie das bitte wiederholen?','Können Sie bitte langsamer sprechen?','Was bedeutet das?'],
  tasks:['Karteikarten: neuer Wortschatz','Personendaten erkennen','Frage und persönliche Angabe verbinden','Anmeldung: Anliegen verstehen','typische Fragen am Schalter','passende Antwort auswählen','Nichtverstehen ausdrücken','um Hilfe / Wiederholung / Erklärung bitten','Dialogbausteine ordnen','Lückendialog: Meldebehörde','Hören: Gespräch am Schalter','Angaben und Unterlagen erkennen','Gespräch mit Auswahlhilfen','Sprechen mit Schreib-Fallback','Rollenspiel Bürger/in – Mitarbeiter/in','Themenprüfung']
 },
 5:{
  title:'Welche Behörde brauche ich?',subtitle:'wichtige Behörden · Unterlagen · Anliegen · Verständigung',chips:['Behörden','Unterlagen','Anliegen','müssen · dürfen','Gespräch'],
  coreVocabulary:t5Core,
  examples:['Welche Behörde brauche ich?','Welche Unterlagen brauche ich?','Muss ich den Ausweis mitbringen?','Mir fehlt noch ein Dokument.','Können Sie mir bitte helfen?'],
  tasks:['Karteikarten: Behörden','Karteikarten: Unterlagen','Beschreibung → Behörde','Erklärung → Unterlage','Behörde und Anliegen verbinden','Behörde und typische Unterlagen verbinden','Welche Behörde brauche ich?','Welche Unterlagen brauche ich?','muss / muss nicht / darf / darf nicht im Behördenkontext','Dokument vorhanden / fehlt / mitbringen','Frage und Antwort verbinden','Dialoge am Schalter','Hören: Behörde und Unterlagen','Ablauf: zuerst – danach – dann – zum Schluss','um Hilfe / Erklärung / Wiederholung bitten','Rollenspiel mit Behörde und Unterlagenkarte','freie Sprechaufgabe mit Schreib-Fallback','Behörde – Anliegen – Unterlagen','Themenprüfung']
 }
};
window.L9_T1_WORDS=t1Core;
window.L9_T2_WORDS=t2Core;
window.L9_T3_WORDS=t3Core;
window.L9_T4_WORDS=t4Core;
window.L9_T5_WORDS=t5Core;
})();