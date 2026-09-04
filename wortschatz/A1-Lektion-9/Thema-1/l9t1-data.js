(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const img=id=>`${CDN}${id}.webp`,aud=id=>`${AUDIO}${id}.mp3`;
const core=window.L9_THEMES?.[1]?.coreVocabulary||[];
const byId=id=>core.find(x=>x.id===id)||{};
const label=id=>byId(id).full||byId(id).word||id;
const MEANINGS={
 muessen:'Dieses Verb sagt: Etwas ist notwendig. Man hat keine Wahl.',
 man:'Dieses Wort benutzt man, wenn man allgemein über Menschen spricht und keine bestimmte Person meint.',
 zuerst:'Dieses Wort zeigt: Das ist der erste Schritt.',
 danach:'Dieses Wort zeigt: Dieser Schritt kommt nach einem anderen Schritt.',
 dann:'Dieses Wort zeigt: Jetzt kommt der nächste Schritt.',
 zum_schluss:'Diese Wörter zeigen: Das ist der letzte Schritt.',
 fuehrerschein:'Ein Dokument. Es zeigt, dass eine Person Auto fahren darf.',
 ticket:'Eine Fahrkarte oder Eintrittskarte. Man kauft sie, bevor man fährt oder irgendwo hineingeht.',
 amt:'Eine öffentliche Stelle. Dort erledigt man offizielle Sachen und bekommt Dokumente.',
 gueltig:'Ein Dokument kann benutzt werden. Das Datum ist noch nicht vorbei.',
 mieten:'Man benutzt etwas für eine bestimmte Zeit und bezahlt dafür. Es gehört einem aber nicht.',
 auslaendisch:'Etwas kommt aus einem anderen Land.',
 europaeisch:'Etwas kommt aus Europa oder gehört zu Europa.',
 europaeische_union:'Eine Gruppe von europäischen Ländern, die zusammenarbeiten.',
 jung:'Eine Person ist noch nicht alt.',
 fahrt:'Die Zeit oder der Weg, wenn man mit Auto, Bus, Bahn oder Fahrrad von einem Ort zu einem anderen fährt.',
 fahrkarte:'Ein Ticket für Bus, Bahn oder Zug.',
 antrag:'Ein Formular oder Dokument, das man ausfüllt, wenn man etwas braucht, zum Beispiel Geld, Hilfe oder eine Wohnung.',
 ausweis:'Ein kleines offizielles Dokument mit Namen und oft Foto. Man zeigt damit, wer man ist.',
 papiere:'Mehrere offizielle Dokumente, die man für eine Sache braucht.',
 automat:'Eine Maschine. Man bedient sie selbst und bekommt zum Beispiel ein Ticket oder Geld.',
 ziel:'Der Ort, zu dem man fahren oder gehen möchte.',
 erwachsener:'Ein Mann, der kein Kind mehr ist.',
 erwachsene:'Eine Frau, die kein Kind mehr ist.',
 autovermietung:'Eine Firma, bei der man ein Auto für eine bestimmte Zeit mieten kann.',
 unterlagen:'Dokumente und Papiere, die man für einen Antrag oder Termin braucht.',
 dokument:'Ein offizielles oder wichtiges Papier mit Informationen.',
 wechselgeld:'Geld, das man zurückbekommt, wenn man mehr bezahlt als etwas kostet.',
 ausfuellen:'Man schreibt die notwendigen Informationen in ein Formular.',
 mitbringen:'Man nimmt etwas von zu Hause oder von einem anderen Ort mit zu einem Termin.',
 unterschreiben:'Man schreibt seinen Namen unten auf ein Dokument.',
 bar:'Man bezahlt mit Münzen oder Geldscheinen, nicht mit Karte.',
 funktionieren:'Eine Maschine oder ein Gerät arbeitet richtig.',
 waehlen:'Man entscheidet sich für eine Möglichkeit.',
 auswaehlen:'Man entscheidet sich für eine Sache aus mehreren Möglichkeiten.',
 abholen:'Man geht zu einem Ort und nimmt etwas oder jemanden mit, das oder der dort wartet.',
 wiederholen:'Man sagt oder macht etwas noch einmal.',
 stempeln:'Ein Amt oder eine Person macht mit einem Stempel ein offizielles Zeichen auf ein Papier.',
 einen_antrag_stellen:'Man bittet eine Behörde offiziell um etwas und gibt dafür einen Antrag ab.',
 einen_antrag_ausfuellen:'Man schreibt alle notwendigen Informationen in einen Antrag.'
};
core.forEach(x=>{x.meaning=MEANINGS[x.id]||x.example||''});
const VOCAB_IDS=['fuehrerschein','ticket','amt','gueltig','mieten','auslaendisch','europaeisch','europaeische_union','jung','fahrt','fahrkarte','antrag','ausweis','papiere','automat','ziel','erwachsener','erwachsene','autovermietung','unterlagen','dokument','wechselgeld','ausfuellen','mitbringen','unterschreiben','bar','funktionieren','waehlen','auswaehlen','abholen','wiederholen','stempeln','einen_antrag_stellen','einen_antrag_ausfuellen','man','zuerst','danach','dann','zum_schluss','muessen'];
function choiceImages(id,alts){return {id,prompt:'Hör zu. Welches Bild passt?',audio:aud(id),spoken:label(id),answer:id,options:[id,...alts],hint:`Das gesuchte Wort ist: ${MEANINGS[id]}`}}
const listen=[
 choiceImages('fuehrerschein',['ausweis','fahrkarte','antrag']),choiceImages('ausweis',['fuehrerschein','dokument','ticket']),choiceImages('antrag',['dokument','unterlagen','fahrkarte']),choiceImages('fahrkarte',['ticket','fuehrerschein','wechselgeld']),
 choiceImages('amt',['autovermietung','automat','europaeische_union']),choiceImages('autovermietung',['amt','automat','fahrt']),choiceImages('wechselgeld',['ticket','fahrkarte','papiere']),choiceImages('ziel',['fahrt','amt','ticket']),
 choiceImages('dokument',['antrag','ausweis','unterlagen']),choiceImages('unterlagen',['papiere','dokument','antrag']),choiceImages('abholen',['mitbringen','mieten','waehlen']),choiceImages('stempeln',['unterschreiben','ausfuellen','wiederholen']),
 choiceImages('ausfuellen',['unterschreiben','stempeln','waehlen']),choiceImages('unterschreiben',['stempeln','ausfuellen','mitbringen']),choiceImages('waehlen',['auswaehlen','mieten','abholen']),choiceImages('mieten',['abholen','mitbringen','waehlen']),
 choiceImages('gueltig',['auslaendisch','europaeisch','jung']),choiceImages('europaeische_union',['amt','autovermietung','ziel'])
];
const defs=[
 ['antrag',['der Antrag','der Ausweis','die Fahrt','das Wechselgeld']],['ausweis',['der Ausweis','der Führerschein','das Dokument','das Ticket']],['stempeln',['stempeln','unterschreiben','ausfüllen','abholen']],['abholen',['abholen','mitbringen','mieten','wiederholen']],['fahrkarte',['die Fahrkarte','die Fahrt','das Ziel','die Autovermietung']],
 ['fuehrerschein',['der Führerschein','der Ausweis','das Ticket','der Antrag']],['amt',['das Amt','der Automat','die Autovermietung','die Europäische Union']],['gueltig',['gültig','ausländisch','europäisch','jung']],['mieten',['mieten','abholen','auswählen','mitbringen']],['auslaendisch',['ausländisch','europäisch','gültig','bar']],
 ['europaeische_union',['die Europäische Union','die Autovermietung','das Amt','die Fahrt']],['wechselgeld',['das Wechselgeld','das Ticket','die Unterlagen','die Papiere']],['unterlagen',['die Unterlagen','das Dokument','der Antrag','das Ziel']],['unterschreiben',['unterschreiben','stempeln','ausfüllen','wählen']],['ausfuellen',['ausfüllen','unterschreiben','wiederholen','abholen']],
 ['automat',['der Automat','das Amt','das Ziel','das Dokument']],['ziel',['das Ziel','die Fahrt','die Fahrkarte','das Ticket']],['bar',['bar','gültig','jung','europäisch']],['wiederholen',['wiederholen','abholen','auswählen','mieten']],['einen_antrag_stellen',['einen Antrag stellen','einen Antrag ausfüllen','die Papiere unterschreiben','den Ausweis mitbringen']]
].map(([id,options])=>({id,prompt:MEANINGS[id],answer:label(id),options,hint:`Achte auf diese Information: ${MEANINGS[id]}`}));
const speakIds=['fuehrerschein','ticket','amt','gueltig','mieten','auslaendisch','europaeisch','europaeische_union','fahrt','fahrkarte','antrag','ausweis','automat','ziel','autovermietung','unterlagen','dokument','wechselgeld','ausfuellen','abholen'];
const speak=speakIds.map(id=>({id,prompt:'Was ist das? Sprich oder schreibe das Wort.',image:img(id),answer:label(id),hint:MEANINGS[id]}));
const forms=[['ich','muss'],['du','musst'],['er / sie / es','muss'],['wir','müssen'],['ihr','müsst'],['sie / Sie','müssen'],['man','muss']].map(([pronoun,answer],i)=>({id:`f${i}`,pronoun,answer,hint:i===1?'Bei du endet die Form auf -st.':i===4?'Bei ihr steht: müsst.':'Vergleiche die Form mit dem Pronomen.'}));
const gaps=[
 ['Maria','morgen ihr Kind vom Kindergarten','muss','abholen','abholen'],['Morgen','Ali seinen Ausweis zum Amt','muss','mitbringen','mitbringen'],['Man','den Antrag vollständig','muss','ausfüllen','ausfuellen'],['In der Autovermietung','wir die Papiere','müssen','unterschreiben','unterschreiben'],
 ['Der Mitarbeiter','das Dokument','muss','stempeln','stempeln'],['Am Automaten','du zuerst das Ziel','musst','wählen','waehlen'],['Ihr','danach Erwachsene','müsst','auswählen','auswaehlen'],['Heute','man ein Auto','muss','mieten','mieten'],
 ['Die Kundin','das Auto um 16 Uhr','muss','abholen','abholen'],['Am Schalter','Sie Ihren Namen','müssen','wiederholen','wiederholen'],['Wir','morgen unsere Unterlagen','müssen','mitbringen','mitbringen'],['Zuerst','man die Papiere','muss','unterschreiben','unterschreiben'],
 ['Der Automat','heute wieder','muss','funktionieren','funktionieren'],['Danach','du das richtige Ticket','musst','auswählen','auswaehlen'],['Meine Eltern','das Dokument noch einmal','müssen','unterschreiben','unterschreiben'],['Beim Amt','ich einen Antrag','muss','ausfüllen','ausfuellen'],
 ['Man','vor der Fahrt das Ziel','muss','wählen','waehlen'],['Morgen','wir den Mietwagen','müssen','abholen','abholen'],['Die Mitarbeiterin','meine Papiere','muss','stempeln','stempeln'],['Zum Schluss','ihr die Angaben noch einmal','müsst','wiederholen','wiederholen']
].map((x,i)=>({id:`g${i}`,left:x[0],middle:x[1],modal:x[2],verb:x[3],image:img(x[4]),hint:`Achte auf das Subjekt und auf das Verb am Satzende.`}));
const modals=[
 ['Ich habe morgen einen Termin beim Amt. Ich ___ meinen Ausweis mitbringen.','muss',['muss','kann','will','mag','möchte']],
 ['Mein Auto ist kaputt. Ich ___ heute mit dem Bus fahren.','kann',['muss','kann','will','mag','möchte']],
 ['Anna hat einen Plan für Samstag. Sie ___ ihre Freundin besuchen.','will',['muss','kann','will','mag','möchte']],
 ['Im Café: „Was ___ Sie trinken?“','möchten',['müssen','können','wollen','mögen','möchten']],
 ['Paul trinkt jeden Morgen Kaffee. Er ___ Kaffee sehr.','mag',['muss','kann','will','mag','möchte']],
 ['Wir haben gleich einen Termin. Wir ___ jetzt losfahren.','müssen',['müssen','können','wollen','mögen','möchten']],
 ['Mira spricht drei Sprachen. Sie ___ gut Deutsch sprechen.','kann',['muss','kann','will','mag','möchte']],
 ['Tom hat nächstes Jahr einen Plan. Er ___ den Führerschein machen.','will',['muss','kann','will','mag','möchte']],
 ['Im Restaurant: „Ich ___ bitte eine Suppe.“','möchte',['muss','kann','will','mag','möchte']],
 ['Wir essen gern Pizza. Wir ___ Pizza.','mögen',['müssen','können','wollen','mögen','möchten']],
 ['Ihr habt morgen Prüfung. Ihr ___ heute noch lernen.','müsst',['müsst','könnt','wollt','mögt','möchtet']],
 ['Ihr habt genug Geld. Ihr ___ das Ticket am Automaten kaufen.','könnt',['müsst','könnt','wollt','mögt','möchtet']],
 ['Ihr plant eine Reise. Ihr ___ nächste Woche nach Berlin fahren.','wollt',['müsst','könnt','wollt','mögt','möchtet']],
 ['Im Café: „Was ___ ihr bestellen?“','möchtet',['müsst','könnt','wollt','mögt','möchtet']],
 ['Die Kinder essen gern Eis. Sie ___ Eis.','mögen',['müssen','können','wollen','mögen','möchten']],
 ['Man hat einen Termin bei der Behörde. Man ___ pünktlich sein.','muss',['muss','kann','will','mag','möchte']],
 ['Man hat online einen Termin gebucht. Man ___ die Bestätigung auf dem Handy zeigen.','kann',['muss','kann','will','mag','möchte']],
 ['Sara hat heute Zeit. Sie ___ ihren Antrag heute ausfüllen.','will',['muss','kann','will','mag','möchte']],
 ['Am Schalter: „Ich ___ einen Antrag stellen.“','möchte',['muss','kann','will','mag','möchte']],
 ['Herr Klein fährt sehr gern Auto. Er ___ lange Fahrten.','mag',['muss','kann','will','mag','möchte']]
].map((x,i)=>({id:`m${i}`,prompt:x[0],answer:x[1],options:x[2],hint:'Lies den ganzen Kontext. Ist es notwendig, möglich, ein Plan, eine Vorliebe oder ein höflicher Wunsch?'}));
const sequences=[
 {id:'waschmaschine',title:'Waschmaschine benutzen',audio:aud('l9t1_anleitung_waschmaschine'),spoken:'Zuerst legt man die Wäsche in die Maschine. Danach gibt man Waschmittel hinein. Dann wählt man das Waschprogramm. Zum Schluss drückt man auf Start.',steps:[['waesche_einlegen','Die Kleidung kommt in die Waschmaschine.'],['waschmittel_einfuellen','Man gibt Waschmittel in das Fach.'],['waschprogramm_waehlen','Man stellt das passende Programm ein.'],['start_druecken','Man startet die Maschine.']]},
 {id:'kaffeemaschine',title:'Kaffeemaschine benutzen',audio:aud('l9t1_anleitung_kaffeemaschine'),spoken:'Zuerst füllt man Wasser ein. Danach gibt man Kaffee in die Maschine. Dann stellt man eine Tasse darunter. Zum Schluss startet man die Kaffeemaschine.',steps:[['wasser_einfuellen','Man füllt den Wassertank.'],['kaffee_einfuellen','Der Kaffee kommt in die Maschine.'],['tasse_hinstellen','Man stellt eine Tasse unter den Auslauf.'],['kaffeemaschine_starten','Man schaltet die Maschine ein.']]},
 {id:'fahrkartenautomat',title:'Fahrkartenautomat bedienen',audio:aud('l9t1_anleitung_fahrkartenautomat'),spoken:'Zuerst wählt man das Ziel. Danach wählt man Erwachsene aus. Dann bezahlt man bar. Zum Schluss nimmt man die Fahrkarte.',steps:[['ziel','Man entscheidet, wohin die Fahrt geht.'],['erwachsener','Man wählt die passende Personengruppe.'],['bar','Man bezahlt mit Geldscheinen oder Münzen.'],['fahrkarte','Man nimmt das Ticket aus dem Automaten.']]},
 {id:'tanken',title:'Ein Auto tanken',audio:aud('l9t1_anleitung_tanken'),spoken:'Zuerst öffnet man den Tankdeckel. Danach nimmt man die Zapfpistole. Dann tankt man das Auto. Zum Schluss bezahlt man an der Kasse.',steps:[['tankdeckel_oeffnen','Man öffnet den Zugang zum Tank.'],['zapfpistole_nehmen','Man nimmt die Zapfpistole aus der Säule.'],['auto_tanken','Man füllt Kraftstoff in das Auto.'],['an_kasse_bezahlen','Man bezahlt den Kraftstoff.']]},
 {id:'kindergeld',title:'Kindergeld beantragen',audio:aud('l9t1_anleitung_kindergeld'),spoken:'Zuerst holt man den Antrag für Kindergeld. Danach füllt man den Antrag aus. Dann legt man die notwendigen Unterlagen dazu. Zum Schluss schickt man alles an die Familienkasse.',steps:[['kindergeld_antrag_holen','Man besorgt das Formular.'],['einen_antrag_ausfuellen','Man trägt die persönlichen Angaben ein.'],['unterlagen','Man legt die benötigten Dokumente dazu.'],['antrag_abschicken','Man sendet Antrag und Unterlagen an die Familienkasse.']]}
].map(s=>({...s,steps:s.steps.map(([image,text],i)=>({id:`${s.id}-${i}`,image:img(image),text}))}));
const writing=[
 {id:'w-fahrkarte',title:'Fahrkarte kaufen',steps:[['ziel','Zuerst muss man das Ziel wählen.'],['erwachsener','Dann muss man Erwachsene auswählen.'],['ticket_art_waehlen','Danach muss man das Ticket auswählen.'],['bar','Dann muss man bar bezahlen.'],['wechselgeld','Danach muss man das Wechselgeld nehmen.'],['fahrkarte','Zum Schluss muss man die Fahrkarte nehmen.']]},
 {id:'w-auto',title:'Auto mieten',steps:[['autovermietung','Zuerst muss man zur Autovermietung gehen.'],['fuehrerschein','Dann muss man den Führerschein zeigen.'],['gueltig','Danach muss man prüfen, ob der Führerschein gültig ist.'],['papiere','Dann muss man die Papiere unterschreiben.'],['bar','Danach muss man bezahlen.'],['abholen','Zum Schluss muss man das Auto abholen.']]},
 {id:'w-antrag',title:'Antrag stellen',steps:[['antrag','Zuerst muss man den Antrag holen.'],['ausfuellen','Dann muss man den Antrag ausfüllen.'],['unterlagen','Danach muss man die Unterlagen mitbringen.'],['unterschreiben','Dann muss man den Antrag unterschreiben.'],['stempeln','Danach muss die Behörde das Dokument stempeln.'],['dokument','Zum Schluss muss man das Dokument abholen.']]}
].map(s=>({...s,steps:s.steps.map(([image,answer],i)=>({id:`${s.id}-${i}`,image:img(image),answer,hint:'Benutze man + müssen und das Reihenfolgewort am Anfang.'}))}));
const cloze=[
 {title:'Am Fahrkartenautomaten',parts:['Zuerst ',' das Ziel wählen. Dann muss ',' Erwachsene auswählen. Danach muss man bar ',' . Zum Schluss nimmt man die ',' .'],answers:['muss man','man','bezahlen','Fahrkarte']},
 {title:'Bei der Autovermietung',parts:['Man ',' einen gültigen Führerschein mitbringen. Danach muss man die ',' unterschreiben. Dann kann man das Auto ',' . Zum Schluss bekommt man das Auto bei der ',' .'],answers:['muss','Papiere','abholen','Autovermietung']},
 {title:'Beim Amt',parts:['Ich muss einen ',' stellen. Zuerst muss ich das Formular ',' . Danach muss ich meinen ',' mitbringen. Zum Schluss muss ich das Dokument ',' .'],answers:['Antrag','ausfüllen','Ausweis','unterschreiben']},
 {title:'Ein Dokument',parts:['Das Amt sagt: „Sie ',' Ihre Unterlagen mitbringen.“ Danach prüft die Mitarbeiterin das ',' . Wenn alles richtig ist, kann sie es ',' . Zum Schluss kann man das Dokument ',' .'],answers:['müssen','Dokument','stempeln','abholen']},
 {title:'Eine Fahrt',parts:['Vor der Fahrt muss ',' das Ziel auswählen. Dann muss man ein ',' kaufen. Wenn man zu viel Geld gibt, bekommt man ',' . Das Ticket muss noch ',' sein.'],answers:['man','Ticket','Wechselgeld','gültig']}
];
const perfect=[['müssen','hat gemusst'],['mieten','hat gemietet'],['ausfüllen','hat ausgefüllt'],['mitbringen','hat mitgebracht'],['unterschreiben','hat unterschrieben'],['funktionieren','hat funktioniert'],['wählen','hat gewählt'],['auswählen','hat ausgewählt'],['abholen','hat abgeholt'],['wiederholen','hat wiederholt'],['stempeln','hat gestempelt'],['einen Antrag stellen','hat einen Antrag gestellt'],['einen Antrag ausfüllen','hat einen Antrag ausgefüllt']];
const exam=[];
defs.slice(0,6).forEach((x,i)=>exam.push({id:`ev${i}`,kind:'choice',prompt:x.prompt,options:x.options,answer:x.answer,hint:x.hint}));
perfect.forEach((x,i)=>exam.push({id:`ep${i}`,kind:'input',prompt:`Perfekt: ${x[0]}`,answer:x[1],hint:'Denke an haben + Partizip II.'}));
forms.forEach((x,i)=>exam.push({id:`ef${i}`,kind:'input',prompt:`Konjugiere müssen: ${x.pronoun} ___`,answer:x.answer,hint:x.hint}));
modals.slice(0,4).forEach((x,i)=>exam.push({id:`em${i}`,kind:'choice',prompt:x.prompt,options:x.options,answer:x.answer,hint:x.hint}));
exam.push({id:'es1',kind:'input',prompt:'Schreibe vollständig: zuerst / man / das Ziel / müssen / wählen',answer:'Zuerst muss man das Ziel wählen.',answers:['Zuerst muss man das Ziel wählen'],hint:'Zuerst + muss + man + ... + Infinitiv.'});
exam.push({id:'es2',kind:'input',prompt:'Schreibe vollständig: zum Schluss / man / die Fahrkarte / müssen / nehmen',answer:'Zum Schluss muss man die Fahrkarte nehmen.',answers:['Zum Schluss muss man die Fahrkarte nehmen'],hint:'Zum Schluss + muss + man + ... + Infinitiv.'});
window.L9T1={
 title:'Was muss man machen?',goal:'Lerne den Wortschatz, konjugiere müssen und verstehe Anweisungen mit man.',cards:VOCAB_IDS.map(id=>({...byId(id),meaning:MEANINGS[id]})),listen,defs,speak,forms,gaps,modals,sequences,writing,cloze,exam,
 tasks:[
  {id:'karteikarten',icon:'🃏',title:'Karteikarten',description:'Lerne den Wortschatz.',kind:'cards'},
  {id:'hoeren-bild',icon:'🎧',title:'Hören & Bild',description:'Hör zu und wähle das passende Bild.',kind:'listen'},
  {id:'bedeutung-wort',icon:'🧩',title:'Bedeutung finden',description:'Lies die Bedeutung und wähle das Wort.',kind:'defs'},
  {id:'bild-sprechen',icon:'🎤',title:'Bild & Sprechen',description:'Sieh das Bild und sprich oder schreibe das Wort.',kind:'speak'},
  {id:'muessen-tabelle',icon:'✍️',title:'müssen konjugieren',description:'Fülle die Tabelle aus.',kind:'forms'},
  {id:'muessen-saetze',icon:'🖼️',title:'müssen + Verb',description:'Ergänze müssen und das Verb vom Bild.',kind:'gaps'},
  {id:'modal-kontext',icon:'💬',title:'Welches Modalverb?',description:'Lies den Kontext und wähle die richtige Form.',kind:'modals'},
  {id:'anweisungen-hoeren',icon:'🎧',title:'Anweisungen ordnen',description:'Hör zu und bring Bilder und Sätze in die richtige Reihenfolge.',kind:'sequences'},
  {id:'anleitung-schreiben',icon:'📝',title:'Anleitung schreiben',description:'Schreibe die Schritte mit man und müssen.',kind:'writing'},
  {id:'lueckentexte',icon:'📄',title:'Anweisungen im Text',description:'Lies die Texte und fülle die Lücken aus.',kind:'cloze'},
  {id:'pruefung',icon:'⭐',title:'Prüfung',description:'Zeig, was du kannst.',kind:'exam',exam:true}
 ]
};
})();