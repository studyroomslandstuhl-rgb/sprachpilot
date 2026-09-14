(function(){'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const raw=[
['schritt','der Schritt','Schritt','die Schritte','👣','Eine einzelne Bewegung beim Gehen.'],
['ein_paar','ein paar','ein paar','','🔢','Eine kleine Anzahl; nicht viele.'],
['medizin','die Medizin','Medizin','','💊','Ein Mittel gegen eine Krankheit oder Beschwerden.'],
['ruhig','ruhig','ruhig','','🤫','Leise und ohne Stress oder viel Bewegung.'],
['apotheke','die Apotheke','Apotheke','die Apotheken','⚕️','Dort bekommt man Medikamente und Beratung.'],
['fieber','das Fieber','Fieber','','🌡️','Die Körpertemperatur ist zu hoch.'],
['husten','der Husten','Husten','','😷','Man muss oft kräftig Luft aus dem Mund stoßen.'],
['salbe','die Salbe','Salbe','die Salben','🧴','Ein Medikament zum Auftragen auf die Haut.'],
['verwenden','verwenden','verwenden','','🧴','Etwas für einen bestimmten Zweck benutzen.'],
['gesundheit','die Gesundheit','Gesundheit','','❤️','Der Zustand, gesund und nicht krank zu sein.'],
['schnupfen','der Schnupfen','Schnupfen','','🤧','Die Nase läuft oder ist verstopft.'],
['tun','tun','tun','','👐','Etwas machen. Perfekt: hat getan.'],
['absender','der Absender','Absender','die Absender','📤','Die Person, die einen Brief oder eine E-Mail schickt.'],
['ort','der Ort','Ort','die Orte','📍','Eine Stadt oder eine bestimmte Stelle.'],
['empfaenger','der Empfänger','Empfänger','die Empfänger','📥','Die Person, die einen Brief oder eine E-Mail bekommt.'],
['anrede','die Anrede','Anrede','die Anreden','👋','Der Anfang eines Briefes, zum Beispiel „Sehr geehrte Frau …“.'],
['datum','das Datum','Datum','die Daten','📅','Tag, Monat und Jahr.'],
['unterschrift','die Unterschrift','Unterschrift','die Unterschriften','✍️','Der handgeschriebene eigene Name unter einem Dokument.'],
['schicken','schicken','schicken','','📨','Etwas zu einer Person oder Stelle senden.'],
['sprechstunde','die Sprechstunde','Sprechstunde','die Sprechstunden','🩺','Die Zeit, in der eine Ärztin oder ein Arzt Patienten behandelt.'],
['krankmeldung','die Krankmeldung','Krankmeldung','die Krankmeldungen','📄','Eine Information oder Bescheinigung, dass man krank ist.'],
['betreff','der Betreff','Betreff','die Betreffe','🏷️','Die kurze Überschrift mit dem Thema eines Briefes oder einer E-Mail.'],
['postleitzahl','die Postleitzahl','Postleitzahl','die Postleitzahlen','🔢','Die Zahl vor dem Ortsnamen in einer Adresse.'],
['hausnummer','die Hausnummer','Hausnummer','die Hausnummern','🏠','Die Nummer eines Hauses in einer Straße.'],
['strasse','die Straße','Straße','die Straßen','🛣️','Ein Teil der Adresse; dort stehen Häuser.'],
['gruss','der Gruß','Gruß','die Grüße','👋','Der Schluss eines Briefes, zum Beispiel „Viele Grüße“.'],
['empfangen','empfangen','empfangen','','📥','Etwas oder jemanden bekommen. Perfekt: hat empfangen.'],
['attest','das Attest','Attest','die Atteste','📃','Eine schriftliche Bescheinigung vom Arzt.'],
['arztbescheinigung','die Arztbescheinigung','Arztbescheinigung','die Arztbescheinigungen','🩺','Ein Dokument vom Arzt, das eine Krankheit bestätigt.'],
['anbei','anbei','anbei','','📎','Das genannte Dokument ist mitgeschickt.'],
['gespraech','das Gespräch','Gespräch','die Gespräche','💬','Menschen sprechen miteinander.'],
['sonnenbrand','der Sonnenbrand','Sonnenbrand','die Sonnenbrände','🌞','Gerötete und schmerzende Haut nach zu viel Sonne.'],
['kuehlen','kühlen','kühlen','','🧊','Etwas kalt machen oder kalt halten.'],
['tabletten_nehmen','Tabletten nehmen','Tabletten nehmen','','💊','Tabletten schlucken und als Medizin benutzen.'],
['krankschreiben','krankschreiben','krankschreiben','','🤒','Ärztlich bestätigen, dass jemand nicht arbeiten kann.']
];
const nounIds=new Set(['schritt','medizin','apotheke','fieber','husten','salbe','gesundheit','schnupfen','absender','ort','empfaenger','anrede','datum','unterschrift','sprechstunde','krankmeldung','betreff','postleitzahl','hausnummer','strasse','gruss','attest','arztbescheinigung','gespraech','sonnenbrand']);
const verbIds=new Set(['verwenden','tun','schicken','empfangen','kuehlen','tabletten_nehmen','krankschreiben']);
const adjectiveIds=new Set(['ruhig']);
const cards=raw.map(x=>({id:x[0],full:x[1],word:x[2],plural:x[3],emoji:x[4],meaning:x[5],article:/^(der|die|das) /.test(x[1])?x[1].split(' ')[0]:'',type:nounIds.has(x[0])?'noun':verbIds.has(x[0])?'verb':adjectiveIds.has(x[0])?'adjective':'other',image:CDN+x[0]+'.webp?v=20260914-l10t3-bunny1',audioFile:x[0]+'.mp3',audio:AUDIO+x[0]+'.mp3?v=20260914-l10t3-bunny1',audioFallback:CDN+x[0]+'.mp3?v=20260914-l10t3-bunny1'}));
const nouns=cards.filter(x=>x.article&&x.plural);
const tasks=[
{id:'karteikarten',title:'Karteikarten',icon:'🃏',cardText:'Sprich oder schreibe 35 Wörter.',text:'Sprich oder schreibe das deutsche Wort.'},
{id:'wort-bedeutung',title:'Wort – Bedeutung',icon:'💡',cardText:'Wähle die richtige Bedeutung.',text:'Wähle die richtige Bedeutung.'},
{id:'hoeren-bild',title:'Hören – Bild',icon:'🎧',cardText:'Höre das Wort. Wähle das Bild.',text:'Höre. Wähle das richtige Bild.'},
{id:'artikel-plural',title:'Artikel und Plural',icon:'🔤',cardText:'Wähle den Artikel. Schreibe den Plural.',text:'Ergänze Artikel und Plural.',example:'Apotheke → die · die Apotheken'},
{id:'sollen-tabelle',title:'sollen – Tabelle',icon:'📋',cardText:'Ergänze die Formen von sollen.',text:'Konjugiere sollen.'},
{id:'sollen-saetze',title:'sollen – Sätze',icon:'🧩',cardText:'Sprich oder schreibe die richtige Form.',text:'Ergänze sollen. Sprich oder schreibe.',example:'Du ___ viel trinken. → sollst'},
{id:'arzt-empfehlungen',title:'Empfehlungen vom Arzt',icon:'🩺',cardText:'Sprich oder schreibe Empfehlungen.',text:'Formuliere mit sollen. Sprich oder schreibe.',example:'viel trinken → Sie sollen viel trinken.'},
{id:'gesundheitstipps',title:'Gesundheitstipps',icon:'💚',cardText:'Wähle den passenden Tipp.',text:'Wähle die passende Empfehlung.'},
{id:'apotheke-dialoge',title:'In der Apotheke',icon:'⚕️',cardText:'Ergänze das fehlende Wort.',text:'Ergänze das fehlende Wort.',example:'Was kann ich für Sie ___? → tun'},
{id:'briefteile',title:'Krankmeldung – Briefteile',icon:'✉️',cardText:'Wähle den passenden Briefteil.',text:'Wähle den passenden Briefteil.',example:'Wer schreibt den Brief? → der Absender'},
{id:'krankmeldung-schreiben',title:'Krankmeldung schreiben',icon:'📝',cardText:'Schreibe drei kurze Krankmeldungen.',text:'Schreibe eine kurze Krankmeldung.',example:'Ich bin krank und kann heute nicht arbeiten. Die Krankmeldung schicke ich mit.'},
{id:'pruefung',title:'Prüfung',icon:'⭐',exam:true,cardText:'Löse 20 gemischte Aufgaben.',text:'Löse 20 gemischte Aufgaben.'}
];
const sollenRows=[['ich','soll'],['du','sollst'],['er / es / sie','soll'],['wir','sollen'],['ihr','sollt'],['sie / Sie','sollen']];
const sollenSentences=[
['Ich ___ die Medizin nehmen.','soll'],['Du ___ im Bett bleiben.','sollst'],['Er ___ viel Tee trinken.','soll'],['Sie ___ die Salbe verwenden.','soll'],['Wir ___ ruhig sein.','sollen'],['Ihr ___ ein paar Schritte gehen.','sollt'],['Sie ___ zum Arzt gehen.','sollen'],['Frau Klein, Sie ___ heute zu Hause bleiben.','sollen'],['Das Kind ___ viel schlafen.','soll'],['Tom und Mia ___ keinen Sport machen.','sollen'],['Du ___ das Auge kühlen.','sollst'],['Ich ___ morgen wiederkommen.','soll'],['Ihr ___ nicht so viel sprechen.','sollt'],['Paul ___ Schmerztabletten nehmen.','soll'],['Wir ___ am Abend keinen Kaffee trinken.','sollen'],['Die Patientin ___ ihre Ohren warm halten.','soll'],['Sie ___ bei Problemen ins Krankenhaus kommen.','sollen'],['Du ___ dich ausruhen.','sollst'],['Herr Ali ___ in der Apotheke fragen.','soll'],['Die Kinder ___ viel trinken.','sollen']
].map((x,i)=>({id:'s'+i,q:x[0],a:x[1]}));
const recommendations=[
['viel Wasser trinken','Sie sollen viel Wasser trinken.'],['im Bett bleiben','Sie sollen im Bett bleiben.'],['die Medizin nehmen','Sie sollen die Medizin nehmen.'],['die Salbe verwenden','Sie sollen die Salbe verwenden.'],['ein paar Schritte gehen','Sie sollen ein paar Schritte gehen.'],['das Auge kühlen','Sie sollen das Auge kühlen.'],['ruhig sein','Sie sollen ruhig sein.'],['nicht so viel sprechen','Sie sollen nicht so viel sprechen.'],['zum Arzt gehen','Sie sollen zum Arzt gehen.'],['bei Problemen ins Krankenhaus kommen','Sie sollen bei Problemen ins Krankenhaus kommen.'],['viel Tee trinken','Sie sollen viel Tee trinken.'],['den Hals warm halten','Sie sollen den Hals warm halten.']
].map((x,i)=>({id:'r'+i,q:'Der Arzt sagt: '+x[0]+'.',a:x[1]}));
const tips=[
{q:'Kopfschmerzen',a:'viel Wasser trinken',options:['viel Wasser trinken','die Salbe verwenden','Fußball spielen','Kaffee trinken']},
{q:'Fieber',a:'im Bett bleiben',options:['im Bett bleiben','lange arbeiten','Sport machen','wenig schlafen']},
{q:'Halsschmerzen',a:'den Hals warm halten',options:['den Hals warm halten','Eis essen','laut sprechen','Fußball spielen']},
{q:'Schnupfen',a:'viel Tee trinken',options:['viel Tee trinken','abends Kaffee trinken','lange arbeiten','wenig schlafen']},
{q:'Schlafprobleme',a:'abends keinen Kaffee trinken',options:['abends keinen Kaffee trinken','Computerspiele machen','Cola trinken','spät ins Bett gehen']},
{q:'Sonnenbrand',a:'die Salbe verwenden',options:['die Salbe verwenden','viel laufen','heiß duschen','Sport machen']},
{q:'starker Husten',a:'zum Arzt gehen',options:['zum Arzt gehen','laut sprechen','rauchen','kalte Cola trinken']},
{q:'Rückenschmerzen',a:'ein paar Schritte gehen',options:['ein paar Schritte gehen','den ganzen Tag sitzen','schwere Taschen tragen','Fußball spielen']}
];
const pharmacy=[
['Guten Tag. Was kann ich für Sie ___?','tun'],['Ich habe starken ___.','Husten'],['Haben Sie auch ___?','Fieber'],['Ja, meine Temperatur ist 39 Grad. Sie sollten zum ___ gehen.','Arzt'],['Meine Tochter hat einen Sonnenbrand. Welche ___ kann ich verwenden?','Salbe'],['Nehmen Sie diese ___.','Medizin'],['Wie oft soll ich sie ___?','verwenden'],['Bleiben Sie heute ___.','ruhig'],['Bei Problemen sollen Sie ins ___ kommen.','Krankenhaus'],['Die ___ ist gleich um die Ecke.','Apotheke']
].map((x,i)=>({id:'p'+i,q:x[0],a:x[1]}));
const letterParts=[
{q:'Wer schreibt den Brief?',a:'der Absender'},{q:'Wer bekommt den Brief?',a:'der Empfänger'},{q:'Worum geht es im Brief?',a:'der Betreff'},{q:'Wie beginnt der Brief?',a:'die Anrede'},{q:'Wann wurde der Brief geschrieben?',a:'das Datum'},{q:'Welche Stadt steht beim Datum?',a:'der Ort'},{q:'Was steht nach dem Brieftext?',a:'der Gruß'},{q:'Was steht ganz am Ende?',a:'die Unterschrift'},{q:'Welche Zahl gehört zum Ort?',a:'die Postleitzahl'},{q:'Welche Nummer gehört zur Straße?',a:'die Hausnummer'},{q:'Welcher Adressteil nennt den Weg?',a:'die Straße'}
];
const sickNotes=[
{label:'Arbeit',prompt:'Sie sind bis Freitag krank. Schreiben Sie Ihrer Firma. Schreiben Sie, warum Sie fehlen und dass Sie die Krankmeldung mitschicken.',need:['krank','Freitag','Krankmeldung'],sample:'Sehr geehrte Damen und Herren, leider bin ich krank und kann bis Freitag nicht arbeiten. Die Krankmeldung schicke ich mit. Mit freundlichen Grüßen'},
{label:'Kind krank',prompt:'Ihr Kind ist krank. Schreiben Sie Ihrer Firma. Sie können heute nicht arbeiten. Die Krankmeldung schicken Sie mit.',need:['Kind','krank','Krankmeldung'],sample:'Sehr geehrte Damen und Herren, mein Kind ist krank. Deshalb kann ich heute nicht arbeiten. Die Krankmeldung schicke ich mit. Mit freundlichen Grüßen'},
{label:'Deutschkurs',prompt:'Sie sind krank. Schreiben Sie Ihrer Lehrerin. Sie können nicht zum Deutschkurs kommen. Bitten Sie um die Arbeitsblätter.',need:['krank','Deutschkurs','Arbeitsblätter'],sample:'Sehr geehrte Frau Müller, ich bin krank und kann heute nicht zum Deutschkurs kommen. Bitte schicken Sie mir die Arbeitsblätter. Viele Grüße'}
];
const examItems=[
{section:'Wortschatz',type:'choice',q:'Wo kauft man Medikamente?',a:'in der Apotheke',options:['in der Apotheke','in der Firma','im Klub','im Kurs']},
{section:'Wortschatz',type:'choice',q:'Was ist eine Salbe?',a:'Medizin für die Haut',options:['Medizin für die Haut','ein Briefteil','eine Adresse','eine Körperbewegung']},
{section:'Wortschatz',type:'input',q:'Schreibe mit Artikel: Fieber',a:'das Fieber'},
{section:'Wortschatz',type:'input',q:'Schreibe den Plural mit Artikel: die Apotheke',a:'die Apotheken'},
{section:'sollen',type:'input',q:'Ergänze: Du ___ viel trinken.',a:'sollst'},
{section:'sollen',type:'input',q:'Ergänze: Wir ___ im Bett bleiben.',a:'sollen'},
{section:'sollen',type:'input',q:'Ergänze: Ihr ___ die Medizin nehmen.',a:'sollt'},
{section:'sollen',type:'input',q:'Ergänze: Frau Klein, Sie ___ zum Arzt gehen.',a:'sollen'},
{section:'Empfehlungen',type:'input',q:'Schreibe mit sollen: Der Arzt sagt: viel Tee trinken.',a:'Sie sollen viel Tee trinken.'},
{section:'Empfehlungen',type:'input',q:'Schreibe mit sollen: Der Arzt sagt: die Salbe verwenden.',a:'Sie sollen die Salbe verwenden.'},
{section:'Empfehlungen',type:'choice',q:'Was passt bei Fieber?',a:'im Bett bleiben',options:['im Bett bleiben','Fußball spielen','Kaffee trinken','lange arbeiten']},
{section:'Empfehlungen',type:'choice',q:'Was passt bei Schlafproblemen?',a:'abends keinen Kaffee trinken',options:['abends keinen Kaffee trinken','spät ins Bett gehen','Cola trinken','Computerspiele machen']},
{section:'Krankmeldung',type:'input',q:'Wer schreibt den Brief?',a:'der Absender'},
{section:'Krankmeldung',type:'input',q:'Wer bekommt den Brief?',a:'der Empfänger'},
{section:'Krankmeldung',type:'input',q:'Was steht vor dem Brieftext und nennt das Thema?',a:'der Betreff'},
{section:'Krankmeldung',type:'input',q:'Was steht ganz am Ende unter dem Gruß?',a:'die Unterschrift'},
{section:'Krankmeldung',type:'choice',q:'Welcher Betreff passt?',a:'Krankmeldung',options:['Krankmeldung','Viele Grüße','Sehr geehrte Frau Meier','Köln, 23. Mai']},
{section:'Krankmeldung',type:'choice',q:'Welche Anrede ist formell?',a:'Sehr geehrte Frau Meier,',options:['Sehr geehrte Frau Meier,','Hallo Schatz,','Liebe Grüße','Krankmeldung']},
{section:'Krankmeldung',type:'input',q:'Ergänze: Leider bin ich krank und kann heute nicht zur ___ kommen.',a:'Arbeit'},
{section:'Krankmeldung',type:'input',q:'Ergänze: Die Krankmeldung ___ ich mit.',a:'schicke'}
];
window.L10T3={cards,nouns,tasks,sollenRows,sollenSentences,recommendations,tips,pharmacy,letterParts,sickNotes,examItems};
})();
