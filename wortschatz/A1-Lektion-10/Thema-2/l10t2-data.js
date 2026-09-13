(function(){'use strict';
const B='https://sprachpilot.b-cdn.net/';
const AUDIO=B+'audio/';
const v=[
['klub','der Klub','Klub','die Klubs','🏢','Eine Gruppe oder ein Ort, wo Menschen gemeinsam etwas machen.'],
['notaufnahme','die Notaufnahme','Notaufnahme','die Notaufnahmen','🏥','Hier bekommt man im Krankenhaus bei einem Notfall schnell Hilfe.'],
['bereich','der Bereich','Bereich','die Bereiche','📍','Ein Teil von einem Ort oder von einem Thema.'],
['tablette','die Tablette','Tablette','die Tabletten','💊','Ein Medikament in kleiner fester Form.'],
['wehtun','wehtun','wehtun','','🤕','Schmerzen machen. Beispiel: Mein Kopf tut weh.'],
['unfall','der Unfall','Unfall','die Unfälle','🚑','Etwas Schlimmes passiert plötzlich, zum Beispiel im Verkehr.'],
['schmerz','der Schmerz','Schmerz','die Schmerzen','😣','Ein unangenehmes Gefühl im Körper, wenn etwas wehtut.'],
['beide','beide','beide','','2️⃣','Zwei Personen oder Sachen zusammen.'],
['lustig','lustig','lustig','','😄','So, dass man lachen muss.'],
['schlimm','schlimm','schlimm','','😟','Sehr schlecht oder ernst.'],
['idee','die Idee','Idee','die Ideen','💡','Ein Gedanke oder ein Vorschlag.'],
['informieren','informieren','informieren','','ℹ️','Jemandem wichtige Informationen geben.'],
['ausfallen','ausfallen','ausfallen','','❌','Nicht stattfinden. Beispiel: Der Kurs fällt aus.'],
['nachricht','die Nachricht','Nachricht','die Nachrichten','💬','Eine kurze Information, die man jemandem schreibt oder sagt.'],
['kuss','der Kuss','Kuss','die Küsse','💋','Man berührt jemanden mit den Lippen.'],
['gesund','gesund','gesund','','❤️','Nicht krank; der Körper ist in Ordnung.'],
['hoffentlich','hoffentlich','hoffentlich','','🙏','Man wünscht, dass etwas Gutes passiert.'],
['bekannter','der Bekannte','Bekannte','die Bekannten','👨','Ein Mann, den man kennt, aber der nicht unbedingt ein Freund ist.'],
['bekannte','die Bekannte','Bekannte','die Bekannten','👩','Eine Frau, die man kennt, aber die nicht unbedingt eine Freundin ist.'],
['lied','das Lied','Lied','die Lieder','🎵','Musik mit einem Text, den man singt.'],
['schatz','der Schatz','Schatz','die Schätze','💝','Eine sehr liebe Person oder etwas sehr Wertvolles.']
].map(x=>({id:x[0],full:x[1],word:x[2],plural:x[3],emoji:x[4],meaning:x[5],article:/^(der|die|das) /.test(x[1])?x[1].split(' ')[0]:'',image:B+x[0]+'.webp',audio:AUDIO+({bekannter:'der_bekannte',bekannte:'die_bekannte'}[x[0]]||x[0])+'.mp3'}));
const nouns=v.filter(x=>x.article);
const tasks=[
{id:'karteikarten',title:'Karteikarten',icon:'🃏',cardText:'Lerne alle 21 Wörter.',text:'Sieh das Bild an, höre das Wort und lerne alle 21 Wörter.'},
{id:'wort-bedeutung',title:'Wort – Bedeutung',icon:'💡',cardText:'Wähle die passende Bedeutung.',text:'Lies das Wort. Wähle die passende Bedeutung.'},
{id:'hoeren-bild',title:'Hören – Bild',icon:'🎧',cardText:'Höre und wähle das Bild.',text:'Höre das Wort. Wähle das passende Bild.'},
{id:'artikel-plural',title:'Artikel und Plural',icon:'🔤',cardText:'Ergänze Artikel und Plural.',text:'Wähle den richtigen Artikel. Schreibe danach den Plural mit Artikel.'},
{id:'wehtun-schmerzen-basis',title:'wehtun ↔ Schmerzen',icon:'🤕',cardText:'Formuliere die Sätze um.',text:'Formuliere den Satz um. Sprich oder schreibe den neuen Satz. Benutze ich, du oder Sie.'},
{id:'possessiv-tabelle',title:'Possessivpronomen – Tabelle',icon:'📋',cardText:'Ergänze die Possessivformen.',text:'Lies das Pronomen. Ergänze beide Possessivformen im Nominativ.'},
{id:'possessiv-form',title:'Possessivpronomen – Form',icon:'🧩',cardText:'Schreibe die passende Form.',text:'Lies Person und Genus. Schreibe die passende Possessivform.'},
{id:'wehtun-schmerzen-alle',title:'wehtun ↔ Schmerzen – alle Personen',icon:'🩹',cardText:'Formuliere Sätze für alle Personen um.',text:'Formuliere den Satz um. Sprich oder schreibe den neuen Satz. Achte auf Person und Possessivform.'},
{id:'familie-luecken',title:'Lara und ihre Familie',icon:'👨‍👩‍👧‍👦',cardText:'Ergänze die Possessivformen im Text.',text:'Lies den Text über Lara in der 3. Person. Setze in jede Lücke die passende Possessivform ein.'},
{id:'biografien',title:'Biografien umschreiben',icon:'✍️',cardText:'Schreibe in der 3. Person.',text:'Lies den ganzen Ausgangstext. Schreibe ihn vollständig in der 3. Person neu: ich → er/sie, wir → sie und mein/meine/unser/unsere → sein/seine/ihr/ihre.'},
{id:'pruefung',title:'Prüfung',icon:'⭐',exam:true,cardText:'Prüfe das ganze Thema.',text:'Bearbeite 20 gemischte Prüfungsfragen aus dem ganzen Thema. Jede Antwort zählt beim ersten Versuch.'}
];
const baseTransform=[
['Meine Hand tut weh.','Ich habe Handschmerzen.'],['Mein Kopf tut weh.','Ich habe Kopfschmerzen.'],['Mein Rücken tut weh.','Ich habe Rückenschmerzen.'],['Mein Hals tut weh.','Ich habe Halsschmerzen.'],['Meine Füße tun weh.','Ich habe Fußschmerzen.'],['Meine Knie tun weh.','Ich habe Knieschmerzen.'],
['Deine Hand tut weh.','Du hast Handschmerzen.'],['Dein Kopf tut weh.','Du hast Kopfschmerzen.'],['Dein Rücken tut weh.','Du hast Rückenschmerzen.'],['Dein Hals tut weh.','Du hast Halsschmerzen.'],['Deine Füße tun weh.','Du hast Fußschmerzen.'],['Deine Knie tun weh.','Du hast Knieschmerzen.'],
['Ihre Hand tut weh.','Sie haben Handschmerzen.'],['Ihr Kopf tut weh.','Sie haben Kopfschmerzen.'],['Ihr Rücken tut weh.','Sie haben Rückenschmerzen.'],['Ihr Hals tut weh.','Sie haben Halsschmerzen.'],['Ihre Füße tun weh.','Sie haben Fußschmerzen.'],['Ihre Knie tun weh.','Sie haben Knieschmerzen.']
].flatMap((p,i)=>i%2?[{q:p[1],a:p[0]}]:[{q:p[0],a:p[1]}]);
const possRows=[['ich','mein','meine'],['du','dein','deine'],['er','sein','seine'],['sie','ihr','ihre'],['es','sein','seine'],['wir','unser','unsere'],['ihr','euer','eure'],['sie (Plural)','ihr','ihre'],['Sie','Ihr','Ihre']];
const genders=[['maskulin','m'],['feminin','f'],['neutral','n'],['Plural','p']];
const possForm=[];possRows.forEach(r=>genders.forEach(g=>possForm.push({q:r[0]+' + '+g[0],a:(g[1]==='m'||g[1]==='n')?r[1]:r[2]})));
const allTransform=[
['Mein Bauch tut weh.','Ich habe Bauchschmerzen.'],['Deine Zähne tun weh.','Du hast Zahnschmerzen.'],['Sein Rücken tut weh.','Er hat Rückenschmerzen.'],['Ihre Hand tut weh.','Sie hat Handschmerzen.'],['Sein Knie tut weh.','Es hat Knieschmerzen.'],['Unsere Köpfe tun weh.','Wir haben Kopfschmerzen.'],['Eure Hälse tun weh.','Ihr habt Halsschmerzen.'],['Ihre Füße tun weh.','Sie haben Fußschmerzen.'],['Ihr Arm tut weh.','Sie haben Armschmerzen.'],
['Anna hat Kopfschmerzen.','Annas Kopf tut weh.'],['Paul hat Rückenschmerzen.','Pauls Rücken tut weh.'],['Marias Hand tut weh.','Maria hat Handschmerzen.'],['Toms Knie tut weh.','Tom hat Knieschmerzen.'],['Lenas Hals tut weh.','Lena hat Halsschmerzen.'],
['Er hat Bauchschmerzen.','Sein Bauch tut weh.'],['Sie hat Zahnschmerzen.','Ihre Zähne tun weh.'],['Wir haben Rückenschmerzen.','Unsere Rücken tun weh.'],['Ihr habt Kopfschmerzen.','Eure Köpfe tun weh.'],['Sie haben Knieschmerzen.','Ihre Knie tun weh.'],['Du hast Armschmerzen.','Dein Arm tut weh.'],['Ich habe Halsschmerzen.','Mein Hals tut weh.'],['Sie haben Fußschmerzen.','Ihre Füße tun weh.'],['Mia hat Bauchschmerzen.','Mias Bauch tut weh.'],['Ben hat Zahnschmerzen.','Bens Zähne tun weh.']
].map((p,i)=>({q:p[0],a:p[1]}));
const family={text:[
['Das ist Lara.',''],['___ Mann heißt David.','Ihr'],['___ Tochter Emma ist acht Jahre alt.','Ihre'],['___ Sohn Leon ist fünf Jahre alt.','Ihr'],['David arbeitet im Krankenhaus. ___ Bereich ist die Notaufnahme.','Sein'],['Emma mag Musik. ___ Lieblingslied ist sehr lustig.','Ihr'],['Leon spielt Fußball. ___ Klub ist ganz in der Nähe.','Sein'],['Laras Eltern wohnen auch hier. ___ Wohnung ist groß.','Ihre'],['___ Mutter heißt Karin und ___ Vater heißt Peter.','Ihre|ihr'],['Peter hat einen Bruder. ___ Name ist Klaus.','Sein'],['Klaus und seine Frau haben zwei Kinder. ___ Kinder sind Laras Cousins.','Ihre'],['Die Familie hat auch einen Hund. ___ Name ist Bruno.','Sein'],['Bruno ist gesund. ___ Beine sind stark.','Seine'],['Lara und David arbeiten viel. ___ Wochenende ist deshalb sehr wichtig.','Ihr'],['Emma und Leon finden: ___ Familie ist lustig.','Ihre']
]};
const bios=[
{label:'Mann',from:'Ich heiße Daniel. Ich bin 31 Jahre alt. Meine Frau heißt Nora. Mein Sohn heißt Emil. Mein Beruf ist Koch. Meine Arbeit ist manchmal stressig, aber mein Team ist lustig.',to:'Er heißt Daniel. Er ist 31 Jahre alt. Seine Frau heißt Nora. Sein Sohn heißt Emil. Sein Beruf ist Koch. Seine Arbeit ist manchmal stressig, aber sein Team ist lustig.'},
{label:'Frau',from:'Ich heiße Sofia. Ich bin 27 Jahre alt. Mein Freund heißt Amir. Meine Schwester wohnt in Berlin. Mein Beruf ist Architektin. Meine Arbeit ist interessant und meine Kollegen sind nett.',to:'Sie heißt Sofia. Sie ist 27 Jahre alt. Ihr Freund heißt Amir. Ihre Schwester wohnt in Berlin. Ihr Beruf ist Architektin. Ihre Arbeit ist interessant und ihre Kollegen sind nett.'},
{label:'Paar',from:'Wir heißen Julia und Max. Wir sind verheiratet. Unsere Tochter heißt Mia. Unser Sohn heißt Ben. Unsere Wohnung ist klein, aber unser Garten ist groß. Unsere Freunde wohnen in der Nähe.',to:'Sie heißen Julia und Max. Sie sind verheiratet. Ihre Tochter heißt Mia. Ihr Sohn heißt Ben. Ihre Wohnung ist klein, aber ihr Garten ist groß. Ihre Freunde wohnen in der Nähe.'}
];
const examItems=[
{section:'Wortschatz',type:'choice',q:'Wo bekommt man im Krankenhaus bei einem Notfall schnell Hilfe?',a:'die Notaufnahme',options:['die Notaufnahme','der Klub','der Bereich','die Nachricht']},
{section:'Wortschatz',type:'choice',q:'Welches Wort bedeutet: „Der Kurs findet heute nicht statt“?',a:'ausfallen',options:['ausfallen','informieren','wehtun','gesund']},
{section:'Wortschatz',type:'choice',q:'Was bedeutet „hoffentlich“?',a:'Man wünscht, dass etwas Gutes passiert.',options:['Man wünscht, dass etwas Gutes passiert.','Man hat starke Schmerzen.','Etwas findet nicht statt.','Man muss lachen.']},
{section:'Wortschatz',type:'choice',q:'Welches Wort passt? Man gibt einer Person eine kurze Information.',a:'die Nachricht',options:['die Nachricht','der Schmerz','der Kuss','das Lied']},
{section:'Artikel und Plural',type:'input',q:'Schreibe Singular mit Artikel: ___ Bekannte (Mann)',a:'der Bekannte'},
{section:'Artikel und Plural',type:'input',q:'Schreibe den Plural mit Artikel: der Unfall',a:'die Unfälle'},
{section:'Artikel und Plural',type:'input',q:'Schreibe den Plural mit Artikel: die Tablette',a:'die Tabletten'},
{section:'Artikel und Plural',type:'input',q:'Schreibe den Plural mit Artikel: der Kuss',a:'die Küsse'},
{section:'wehtun und Schmerzen',type:'input',q:'Formuliere um: Mein Kopf tut weh.',a:'Ich habe Kopfschmerzen.'},
{section:'wehtun und Schmerzen',type:'input',q:'Formuliere um: Du hast Rückenschmerzen.',a:'Dein Rücken tut weh.'},
{section:'wehtun und Schmerzen',type:'input',q:'Formuliere um: Ihre Füße tun weh.',a:'Sie haben Fußschmerzen.'},
{section:'wehtun und Schmerzen',type:'input',q:'Formuliere um: Er hat Bauchschmerzen.',a:'Sein Bauch tut weh.'},
{section:'Possessivformen',type:'input',q:'Schreibe die Possessivform: ich + feminin',a:'meine'},
{section:'Possessivformen',type:'input',q:'Schreibe die Possessivform: ihr + Plural',a:'eure'},
{section:'Possessivformen',type:'input',q:'Ergänze: David arbeitet im Krankenhaus. ___ Bereich ist die Notaufnahme.',a:'Sein'},
{section:'Possessivformen',type:'input',q:'Ergänze: Lara und David haben zwei Kinder. ___ Kinder heißen Emma und Leon.',a:'Ihre'},
{section:'3. Person',type:'input',q:'Schreibe in der 3. Person: Meine Schwester wohnt in Berlin.',a:'Ihre Schwester wohnt in Berlin.'},
{section:'3. Person',type:'input',q:'Schreibe in der 3. Person: Mein Beruf ist Koch.',a:'Sein Beruf ist Koch.'},
{section:'3. Person',type:'input',q:'Schreibe in der 3. Person: Unsere Tochter heißt Mia.',a:'Ihre Tochter heißt Mia.'},
{section:'3. Person',type:'input',q:'Schreibe den ganzen Satz in der 3. Person: Wir sind verheiratet.',a:'Sie sind verheiratet.'}
];
window.L10T2={cards:v,flashcards:v,nouns,tasks,baseTransform,possRows,possForm,allTransform,family,bios,examItems};
})();
