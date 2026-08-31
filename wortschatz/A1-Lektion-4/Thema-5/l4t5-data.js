(function(){
'use strict';
if(window.__SP_L4T5_DATA_V1)return;window.__SP_L4T5_DATA_V1=true;
const V=[
 {term:'die Kleinanzeige',detail:'Eine kurze Anzeige: Jemand verkauft oder sucht etwas.',example:'Ich sehe eine Kleinanzeige für ein Sofa.'},
 {term:'noch da',detail:'Etwas ist noch nicht verkauft.',example:'Ist das Sofa noch da?'},
 {term:'verkaufen',detail:'Etwas gegen Geld geben.',example:'Ich verkaufe einen Tisch.'},
 {term:'kaufen',detail:'Etwas bezahlen und bekommen.',example:'Ich möchte die Lampe kaufen.'},
 {term:'der Preis',plural:'die Preise',detail:'So viel kostet etwas.',example:'Wie hoch ist der Preis?'},
 {term:'die Adresse',plural:'die Adressen',detail:'Straße, Hausnummer und Ort.',example:'Wie ist Ihre Adresse?'},
 {term:'die Telefonnummer',plural:'die Telefonnummern',detail:'Nummer zum Anrufen.',example:'Wie ist Ihre Telefonnummer?'},
 {term:'der Termin',plural:'die Termine',detail:'Eine vereinbarte Zeit.',example:'Passt Ihnen Dienstag um 18 Uhr?'},
 {term:'abholen',detail:'Zu einem Ort gehen oder fahren und etwas mitnehmen.',example:'Wann kann ich den Tisch abholen?'},
 {term:'passen',detail:'Eine Zeit ist möglich und gut.',example:'Dienstag um 18 Uhr passt gut.'},
 {term:'leider',detail:'Das sagt man bei einer negativen Information höflich.',example:'Leider ist der Schrank schon verkauft.'},
 {term:'reservieren',detail:'Etwas bleibt für eine Person frei.',example:'Können Sie die Lampe bis morgen reservieren?'}
];
const C=(prompt,options,answer,context='',hint='')=>({type:'choice',prompt,options,answer,context,hint});
const I=(prompt,answers,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answers)?answers:[answers],context,hint});
const O=(prompt,text,context='',hint='')=>({type:'order',prompt,tokens:text.replace(/[?.!]$/,'').split(/\s+/),answer:[text.replace(/[?.!]$/,''),text],context,hint});
const H=(audio,prompt,options,answer)=>({type:'choice',audio,prompt,options,answer});
const F=(prompt,starter,min=3,context='')=>({type:'free',prompt,starter,min,context});
const TASKS=[
 {id:'cards',title:'Karteikarten',icon:'🃏',kind:'cards',instruction:'Lerne wichtige Wörter und Redemittel für Kleinanzeigen und Telefonate.',items:V},
 {id:'listen',title:'Hören: Telefonate',icon:'🎧',kind:'choice',instruction:'Höre kurze Telefonate und finde die wichtige Information.',items:[
  H('Guten Tag. Ich rufe wegen des Sofas an. Ist es noch da? Ja, das Sofa ist noch da.','Was möchte die Person wissen?',['ob das Sofa noch da ist','wie das Wetter ist','wann der Kurs beginnt'],'ob das Sofa noch da ist'),
  H('Was kostet der Tisch? Er kostet 45 Euro.','Wie viel kostet der Tisch?',['45 Euro','54 Euro','14 Euro'],'45 Euro'),
  H('Wann kann ich die Lampe abholen? Heute ab 18 Uhr.','Wann ist die Abholung möglich?',['heute ab 18 Uhr','morgen um 8 Uhr','nur am Montag'],'heute ab 18 Uhr'),
  H('Wie ist Ihre Adresse? Gartenstraße 12 in Saarlouis.','Welche Information hört man?',['eine Adresse','einen Preis','eine Telefonnummer'],'eine Adresse'),
  H('Passt Ihnen Samstag um 10 Uhr? Nein, leider nicht. Samstag um 14 Uhr passt gut.','Wann ist der Termin?',['Samstag um 14 Uhr','Samstag um 10 Uhr','Sonntag um 14 Uhr'],'Samstag um 14 Uhr'),
  H('Ist der Schrank noch da? Nein, leider. Er ist schon verkauft.','Was ist richtig?',['Der Schrank ist schon verkauft.','Der Schrank kostet nichts.','Der Schrank ist reserviert.'],'Der Schrank ist schon verkauft.'),
  H('Können Sie den Stuhl bis morgen reservieren? Ja, gern.','Was soll die Verkäuferin machen?',['den Stuhl reservieren','den Stuhl wegwerfen','den Stuhl reparieren'],'den Stuhl reservieren'),
  H('Meine Telefonnummer ist null eins sieben sechs, vier fünf drei zwei acht eins.','Was hört man?',['eine Telefonnummer','eine Uhrzeit','einen Preis'],'eine Telefonnummer')
 ]},
 {id:'available',title:'Ist es noch da?',icon:'✅',kind:'choice',instruction:'Wähle eine passende Antwort auf eine Frage aus einer Kleinanzeige.',items:[
  C('Welche Antwort passt?',['Ja, das Sofa ist noch da.','Ja, ich bin ein Sofa.','Nein, ich wohne Sofa.'],'Ja, das Sofa ist noch da.','„Guten Tag, ist das Sofa noch da?“'),
  C('Welche Antwort passt?',['Nein, leider ist es schon verkauft.','Nein, es ist Dienstag.','Nein, der Preis wohnt hier.'],'Nein, leider ist es schon verkauft.','„Ist der Tisch noch zu haben?“'),
  C('Welche Frage passt?',['Ist die Lampe noch da?','Wo arbeitet die Lampe?','Wie alt bist du Lampe?'],'Ist die Lampe noch da?','Du siehst eine Kleinanzeige für eine Lampe und möchtest sie kaufen.'),
  C('Welche Frage ist höflich?',['Ist der Schrank noch verfügbar?','Gib Schrank!','Schrank da?'],'Ist der Schrank noch verfügbar?'),
  C('Welche Antwort bedeutet JA?',['Ja, Sie können ihn noch kaufen.','Leider ist er verkauft.','Nein, er ist nicht mehr da.'],'Ja, Sie können ihn noch kaufen.'),
  C('Welche Antwort bedeutet NEIN?',['Leider ist die Kommode schon verkauft.','Ja, die Kommode ist noch da.','Sie können sie morgen abholen.'],'Leider ist die Kommode schon verkauft.'),
  C('Was bedeutet „noch da“?',['noch nicht verkauft','sehr teuer','kaputt'],'noch nicht verkauft'),
  C('Was bedeutet „schon verkauft“?',['Eine andere Person hat es gekauft.','Es ist kostenlos.','Es kommt morgen.'],'Eine andere Person hat es gekauft.')
 ]},
 {id:'details',title:'Preis, Adresse und Abholung',icon:'💶',kind:'choice',instruction:'Finde die passende Frage oder Antwort für die Situation.',items:[
  C('Welche Frage passt?',['Was kostet der Tisch?','Wo kostet der Tisch?','Wann heißt der Tisch?'],'Was kostet der Tisch?','Du möchtest den Preis wissen.'),
  C('Welche Antwort passt?',['Er kostet 30 Euro.','Er ist 30 Uhr.','Er wohnt 30 Euro.'],'Er kostet 30 Euro.','„Was kostet der Stuhl?“'),
  C('Welche Frage passt?',['Wie ist Ihre Adresse?','Wie kostet Ihre Adresse?','Wann ist Ihre Adresse alt?'],'Wie ist Ihre Adresse?','Du möchtest wissen, wo du die Kommode abholen kannst.'),
  C('Welche Frage passt?',['Wann kann ich das Sofa abholen?','Wann kann ich das Sofa kosten?','Wo kann ich das Sofa Uhr?'],'Wann kann ich das Sofa abholen?'),
  C('Welche Antwort passt?',['Heute ab 17 Uhr.','17 Euro Straße.','Ich bin heute Sofa.'],'Heute ab 17 Uhr.','„Wann kann ich die Lampe abholen?“'),
  C('Welche Frage passt?',['Können Sie mir Ihre Telefonnummer geben?','Wie viel Uhr ist Ihre Telefonnummer?','Ist Ihre Telefonnummer ein Sofa?'],'Können Sie mir Ihre Telefonnummer geben?'),
  C('Welche Frage passt?',['Können Sie den Tisch bis morgen reservieren?','Können Sie morgen einen Tisch sein?','Sind Sie reservieren?'],'Können Sie den Tisch bis morgen reservieren?'),
  C('Welche Antwort passt?',['Ja, ich reserviere ihn bis morgen.','Ja, der Preis ist Dienstag.','Nein, ich Adresse.'],'Ja, ich reserviere ihn bis morgen.','„Können Sie den Stuhl reservieren?“')
 ]},
 {id:'appointment',title:'Einen Termin vereinbaren',icon:'📅',kind:'order',instruction:'Ordne Wörter zu einer passenden Frage oder Antwort.',items:[
  O('Ordne die Frage.','Wann kann ich das Sofa abholen?'),
  O('Ordne die Frage.','Passt Ihnen Dienstag um 18 Uhr?'),
  O('Ordne die Antwort.','Ja, Dienstag um 18 Uhr passt gut.'),
  O('Ordne die Antwort.','Leider kann ich am Dienstag nicht.'),
  O('Ordne die Frage.','Geht es auch am Mittwoch?'),
  O('Ordne die Antwort.','Am Mittwoch bin ich ab 17 Uhr zu Hause.'),
  O('Ordne die Frage.','Kann ich morgen um 10 Uhr kommen?'),
  O('Ordne den Satz.','Dann bis morgen um 10 Uhr.')
 ]},
 {id:'read-ad',title:'Kleinanzeigen lesen',icon:'📄',kind:'choice',instruction:'Lies kurze Anzeigen und finde Preis, Zustand, Ort und Abholzeit.',items:[
  C('Was wird verkauft?',['ein Sofa','ein Fahrrad','eine Lampe'],'ein Sofa','SOFA, grau, sehr guter Zustand, 80 €. Abholung in Saarlouis. Tel. 0176 123456.'),
  C('Was kostet das Sofa?',['80 Euro','18 Euro','8 Euro'],'80 Euro','SOFA, grau, sehr guter Zustand, 80 €. Abholung in Saarlouis.'),
  C('Wo ist die Abholung?',['in Saarlouis','in Berlin','in der Schule'],'in Saarlouis','SOFA, grau, sehr guter Zustand, 80 €. Abholung in Saarlouis.'),
  C('Wann kann man die Lampe abholen?',['ab 17 Uhr','nur morgens um 7 Uhr','am Sonntag um 8 Uhr'],'ab 17 Uhr','LAMPE, weiß, 12 €. Abholung Mo–Fr ab 17 Uhr. Bitte Nachricht schreiben.'),
  C('Wie soll man wegen der Lampe Kontakt aufnehmen?',['eine Nachricht schreiben','einen Brief per Post schicken','zur Schule gehen'],'eine Nachricht schreiben','LAMPE, weiß, 12 €. Abholung Mo–Fr ab 17 Uhr. Bitte Nachricht schreiben.'),
  C('Was ist kostenlos?',['ein kleiner Tisch','das Sofa','die Lampe'],'ein kleiner Tisch','KLEINER TISCH zu verschenken. Gebrauchsspuren, aber stabil. Abholung Samstag 10–13 Uhr.'),
  C('Wann kann man den kostenlosen Tisch abholen?',['Samstag 10–13 Uhr','Montag 8–9 Uhr','heute Nacht'],'Samstag 10–13 Uhr','KLEINER TISCH zu verschenken. Abholung Samstag 10–13 Uhr.'),
  C('Was bedeutet „zu verschenken“?',['Man bezahlt nichts.','Es kostet 100 Euro.','Es ist schon verkauft.'],'Man bezahlt nichts.','KLEINER TISCH zu verschenken.')
 ]},
 {id:'dialog',title:'Telefonat ordnen',icon:'☎️',kind:'order',instruction:'Baue typische Sätze für ein vollständiges Telefonat.',items:[
  O('Ordne die Begrüßung.','Guten Tag, ich rufe wegen Ihrer Kleinanzeige an.'),
  O('Ordne die Frage.','Ist das Sofa noch da?'),
  O('Ordne die Frage.','Was kostet das Sofa?'),
  O('Ordne die Frage.','Wann kann ich es abholen?'),
  O('Ordne die Frage.','Wie ist Ihre Adresse?'),
  O('Ordne die Frage.','Passt Ihnen heute um 18 Uhr?'),
  O('Ordne die Antwort.','Ja, 18 Uhr passt sehr gut.'),
  O('Ordne den Abschied.','Vielen Dank, dann bis später.')
 ]},
 {id:'message',title:'Kurze Nachricht schreiben',icon:'✍️',kind:'input',instruction:'Ergänze eine kurze Nachricht zu einer Kleinanzeige.',items:[
  I('Guten Tag, ist das Sofa noch ___?',['da','verfügbar'],'Du schreibst wegen einer Kleinanzeige.'),
  I('Wie hoch ist der ___?',['Preis']),
  I('Wann kann ich das Sofa ___?',['abholen']),
  I('Wie ist Ihre ___?',['Adresse']),
  I('Können Sie den Tisch bis morgen ___?',['reservieren']),
  I('Dienstag um 18 Uhr ___ gut.',['passt']),
  I('___ kann ich heute nicht kommen.',['Leider']),
  I('Vielen Dank für Ihre ___.',['Antwort','Informationen'])
 ]},
 {id:'roleplay',title:'Selbst telefonieren',icon:'🎤',kind:'free',instruction:'Schreibe oder sprich selbst. Nutze mindestens drei vollständige Sätze oder Fragen.',items:[
  F('Du möchtest ein gebrauchtes Sofa kaufen. Frage, ob es noch da ist, nach dem Preis und nach der Abholung.','Guten Tag, ich rufe wegen ...',3,'Situation: Sofa, 80 €, Abholung nach Vereinbarung.'),
  F('Du verkaufst eine Lampe. Antworte auf Fragen zu Preis, Adresse und Termin.','Ja, die Lampe ...',3,'Situation: Lampe, 15 €, Abholung morgen ab 17 Uhr.')
 ]},
 {id:'exam',title:'Prüfung',icon:'⭐',exam:true,kind:'choice',instruction:'Teste Telefon, Kleinanzeigen, Preis, Adresse und Termin.',items:[]}
];
const EXAM_POOL=[
 C('Was sagst du zuerst am Telefon?',['Guten Tag, ich rufe wegen Ihrer Kleinanzeige an.','Gib Sofa.','Wo Wetter?'],'Guten Tag, ich rufe wegen Ihrer Kleinanzeige an.'),
 C('Du möchtest wissen, ob das Sofa verkauft ist.',['Ist das Sofa noch da?','Was ist Ihre Adresse?','Wie spät ist es?'],'Ist das Sofa noch da?'),
 C('Welche Frage fragt nach Geld?',['Was kostet der Tisch?','Wann kann ich kommen?','Wie ist Ihre Adresse?'],'Was kostet der Tisch?'),
 C('Welche Frage fragt nach dem Ort?',['Wie ist Ihre Adresse?','Was kostet die Lampe?','Ist der Stuhl noch da?'],'Wie ist Ihre Adresse?'),
 C('Welche Frage fragt nach der Zeit?',['Wann kann ich es abholen?','Was kostet es?','Wie heißt es?'],'Wann kann ich es abholen?'),
 C('„Leider schon verkauft“ bedeutet:',['Man kann es nicht mehr kaufen.','Es ist kostenlos.','Es ist reserviert für dich.'],'Man kann es nicht mehr kaufen.'),
 C('„zu verschenken“ bedeutet:',['kostenlos','sehr teuer','kaputt'],'kostenlos'),
 C('Welche Antwort ist höflich?',['Leider passt mir 18 Uhr nicht.','Nein!','18 Uhr schlecht.'],'Leider passt mir 18 Uhr nicht.'),
 C('Welche Antwort bestätigt einen Termin?',['Ja, Dienstag um 17 Uhr passt gut.','Ich bin eine Adresse.','Der Preis ist Dienstag.'],'Ja, Dienstag um 17 Uhr passt gut.'),
 C('Was macht man beim Abholen?',['Man nimmt die gekaufte Sache mit.','Man lernt Deutsch.','Man schreibt eine Prüfung.'],'Man nimmt die gekaufte Sache mit.'),
 C('Was kann man reservieren?',['eine Sache bis zu einem Termin','eine Hausnummer','das Wetter'],'eine Sache bis zu einem Termin'),
 C('Was ist eine Kleinanzeige?',['eine kurze Verkaufs- oder Suchanzeige','eine Grammatikregel','eine Fahrkarte'],'eine kurze Verkaufs- oder Suchanzeige'),
 C('Welche Frage ist richtig?',['Können Sie den Tisch bis morgen reservieren?','Können Sie bis morgen Tisch sein?','Reservieren Sie wie viel Uhr Preis?'],'Können Sie den Tisch bis morgen reservieren?'),
 C('Welche Reihenfolge ist logisch?',['Begrüßung – Frage – Termin – Abschied','Abschied – Termin – Begrüßung','Preis – Wetter – Schule'],'Begrüßung – Frage – Termin – Abschied'),
 C('„Samstag 10–13 Uhr“ informiert über:',['eine Abholzeit','einen Preis','eine Telefonnummer'],'eine Abholzeit'),
 C('„80 €“ informiert über:',['den Preis','die Adresse','den Termin'],'den Preis'),
 C('„Gartenstraße 12“ ist:',['eine Adresse','ein Preis','eine Uhrzeit'],'eine Adresse'),
 C('„0176 123456“ ist:',['eine Telefonnummer','ein Preis','eine Postleitzahl'],'eine Telefonnummer'),
 C('Was passt als Abschluss?',['Vielen Dank, auf Wiederhören.','Gib her.','Ich bin fertig Sofa.'],'Vielen Dank, auf Wiederhören.'),
 C('Welche Nachricht ist verständlich?',['Guten Tag, ist die Lampe noch da? Wann kann ich sie abholen?','Lampe ich wann.','Da Preis du.'],'Guten Tag, ist die Lampe noch da? Wann kann ich sie abholen?')
];
TASKS.find(t=>t.exam).items=EXAM_POOL;
window.L4T5_DATA={vocab:V,tasks:TASKS,topicId:'wortschatz-a1-lektion-4-thema-5'};
})();