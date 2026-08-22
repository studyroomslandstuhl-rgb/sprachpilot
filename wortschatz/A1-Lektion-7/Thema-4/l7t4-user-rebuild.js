(function(){
'use strict';
if(window.__SP_L7T4_USER_REBUILD_V1)return;window.__SP_L7T4_USER_REBUILD_V1=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,' ').trim();
const slug=v=>String(v||'').trim().toLowerCase().replace(/^(der|die|das)\s+/i,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const audioFor=v=>AUDIO+encodeURIComponent(slug(v))+'.mp3';
const q=(prompt,answer,wrong1,wrong2)=>({q:prompt,options:[answer,wrong1,wrong2],answer});
const meaning=(term,answer,wrong1,wrong2)=>({prompt:`Was bedeutet ${term}?`,options:[answer,wrong1,wrong2],answer,hint:`Die passende Bedeutung ist: ${answer}.`});
const imageFallback={maedchen:'maedchen.webp',junge:'junge.webp',klasse:'klasse.webp',schwimmbad:'schwimmbad.webp',eintritt:'eintritt.webp',grundschule:'grundschule.webp',unterricht:'unterricht.webp',leitung:'leitung.webp',schule:'schule.webp',arzt:'arzt.webp',aerztin:'aerztin.webp',ausflug:'ausflug.webp',schade:'schade.webp',losfahren:'losfahren.webp',zurueckkommen:'zurueckkommen.webp',mitkommen:'mitkommen.webp',krank:'krank.webp',bescheid_sagen:'bescheid_sagen.webp',fehlen:'fehlen.webp',gute_besserung:'gute_besserung.webp'};
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const old=Array.isArray(theme?.tasks)?theme.tasks:[];
 const cards=old.find(t=>t?.id==='karteikarten'||t?.kind==='cards'||/karteikarten/i.test(t?.title||''));
 const exam=old.find(t=>t?.exam)||old[old.length-1];
 if(!cards||!exam)return theme;
 cards.id='karteikarten';cards.title='Karteikarten';cards.description='Lerne die Wörter.';cards.kind='cards';
 const cardItems=Array.isArray(cards.items)?cards.items:[];
 const imageFor=word=>{
  const n=norm(word),found=cardItems.find(x=>{const value=norm(x?.word||x?.answer||x?.full||x?.term||'');return value===n||value.includes(n)||n.includes(value)});
  const current=String(found?.image||found?.img||'').trim();if(current)return current;
  return imageFallback[slug(word)]||`${slug(word)}.webp`;
 };

 const articleItems=[
  ['Mädchen','das Mädchen','die Mädchen'],['Junge','der Junge','die Jungen'],['Klasse','die Klasse','die Klassen'],['Schwimmbad','das Schwimmbad','die Schwimmbäder'],['Eintritt','der Eintritt','die Eintritte'],['Grundschule','die Grundschule','die Grundschulen'],['Unterricht','der Unterricht','kein Plural'],['Leitung','die Leitung','die Leitungen'],['Schule','die Schule','die Schulen'],['Arzt','der Arzt','die Ärzte'],['Ärztin','die Ärztin','die Ärztinnen'],['Ausflug','der Ausflug','die Ausflüge']
 ].map(([word,singular,plural])=>({word,singular,plural,image:imageFor(word),answer:`${singular} | ${plural}`}));

 const meaningItems=[
  meaning('„Mädchen“','ein weibliches Kind','ein männliches Kind','eine Lehrkraft'),
  meaning('„Junge“','ein männliches Kind','eine erwachsene Frau','eine Schulklasse'),
  meaning('„Klasse“','eine Gruppe von Schülerinnen und Schülern','ein Raum zum Schwimmen','eine Fahrkarte'),
  meaning('„Schwimmbad“','ein Ort zum Schwimmen','ein Ort zum Bücherleihen','ein Büro in der Schule'),
  meaning('„Eintritt“','Geld oder Ticket, damit man hineingehen darf','die Zeit, wann der Unterricht endet','ein Termin beim Arzt'),
  meaning('„Grundschule“','eine Schule für jüngere Kinder','eine Sprachschule für Erwachsene','ein Schwimmbad'),
  meaning('„Unterricht“','Zeit zum Lernen mit einer Lehrkraft','eine Fahrt am Wochenende','eine Pause ohne Lehrkraft'),
  meaning('„Leitung“','die Person oder das Team, das die Schule führt','eine Schülerin aus der Klasse','die Bushaltestelle vor der Schule'),
  meaning('„Schule“','ein Ort zum Lernen','ein Ort zum Einkaufen','ein Arzttermin'),
  meaning('„Arzt“','ein Mann, der kranke Menschen behandelt','ein Mann, der einen Bus fährt','ein Mann, der Unterricht bekommt'),
  meaning('„Ärztin“','eine Frau, die kranke Menschen behandelt','eine Frau, die ein Museum besucht','eine Frau aus dem Sekretariat'),
  meaning('„Ausflug“','eine gemeinsame Fahrt oder ein gemeinsamer Besuch','eine normale Unterrichtsstunde','eine Krankmeldung'),
  meaning('„schade“','man findet etwas bedauerlich','man findet etwas sehr teuer','man ist ganz sicher'),
  meaning('„losfahren“','eine Fahrt beginnen','nach Hause zurückkommen','zu Fuß stehen bleiben'),
  meaning('„zurückkommen“','wieder an einen Ort kommen','eine Fahrt beginnen','jemanden anrufen'),
  meaning('„mitkommen“','zusammen mit anderen gehen oder fahren','allein zu Hause bleiben','eine Nachricht löschen'),
  meaning('„krank“','nicht gesund','sehr pünktlich','sehr teuer'),
  meaning('„Bescheid sagen“','jemanden informieren','jemanden abholen','jemanden untersuchen'),
  meaning('„fehlen“','nicht da sein','zu früh da sein','einen Eintritt bezahlen'),
  meaning('„Gute Besserung!“','ein Wunsch für eine kranke Person','eine Begrüßung am Morgen','eine Frage nach der Uhrzeit'),
  meaning('„Guten Morgen, hier spricht …“','eine Begrüßung am Telefon','eine Bitte um Eintritt','eine Verabschiedung am Abend'),
  meaning('„Mein Sohn heißt …“','den Namen des Sohnes nennen','die Klasse der Tochter nennen','nach dem Lehrer fragen'),
  meaning('„Meine Tochter heißt …“','den Namen der Tochter nennen','den Treffpunkt nennen','nach dem Eintritt fragen'),
  meaning('„Er/Sie geht in die Klasse …“','sagen, welche Klasse ein Kind besucht','sagen, wann ein Bus fährt','sagen, wie viel etwas kostet'),
  meaning('„Mein Kind kann heute nicht zur Schule kommen.“','ein Kind für heute abmelden','ein Kind zum Ausflug anmelden','nach Hausaufgaben fragen'),
  meaning('„Wir gehen heute zum Arzt.“','einen Arztbesuch ankündigen','einen Ausflug ankündigen','den Unterricht absagen'),
  meaning('„Das tut mir leid.“','Mitgefühl zeigen','nach dem Preis fragen','eine Uhrzeit nennen'),
  meaning('„Ich sage der Lehrerin Bescheid.“','die Lehrerin informieren','die Lehrerin abholen','die Lehrerin untersuchen'),
  meaning('„Ich sage dem Lehrer Bescheid.“','den Lehrer informieren','den Lehrer bezahlen','den Lehrer krankmelden'),
  meaning('„Vielen Dank für die Information.“','sich für eine Information bedanken','eine Information ablehnen','um eine Information bitten'),
  meaning('„Auf Wiederhören.“','sich am Telefon verabschieden','jemanden begrüßen','einen Arzttermin machen')
 ];

 const dictationWords=[
  ['Mädchen','Mädchen'],['Junge','Junge'],['Klasse','Klasse'],['Schwimmbad','Schwimmbad'],['Eintritt','Eintritt'],['Grundschule','Grundschule'],['Unterricht','Unterricht'],['Leitung','Leitung'],['Schule','Schule'],['Arzt','Arzt'],['Ärztin','Ärztin'],['Ausflug','Ausflug'],['schade','schade'],['losfahren','losfahren'],['zurückkommen','zurückkommen'],['mitkommen','mitkommen'],['krank','krank'],['Bescheid sagen','Bescheid sagen'],['fehlen','fehlen'],['Gute Besserung','Gute Besserung']
 ].map(([spoken,answer])=>({audio:audioFor(spoken),answer,answers:[answer]}));

 function audioOptions(correct,others,position){let values=[correct,...others.filter(x=>x!==correct)].slice(0,4);const first=values.shift();values.splice(Math.max(0,Math.min(3,position)),0,first);return values.map(value=>({value,audio:audioFor(value)}))}
 const imageAudioSource=[
  ['Mädchen',['Junge','Klasse','Schule']],['Junge',['Mädchen','Arzt','Unterricht']],['Klasse',['Schule','Grundschule','Leitung']],['Schwimmbad',['Schule','Unterricht','Ausflug']],['Eintritt',['Ausflug','Unterricht','Arzt']],['Grundschule',['Schwimmbad','Klasse','Schule']],['Unterricht',['Eintritt','Ausflug','Leitung']],['Leitung',['Ärztin','Klasse','Schule']],['Schule',['Grundschule','Schwimmbad','Unterricht']],['Arzt',['Ärztin','Junge','Eintritt']],['Ärztin',['Arzt','Mädchen','Leitung']],['Ausflug',['Eintritt','Unterricht','Schwimmbad']]
 ];
 const imageAudioItems=imageAudioSource.map(([answer,others],index)=>({image:imageFor(answer),answer,options:audioOptions(answer,others,(index+1)%4)}));

 const phraseItems=[
  {answer:'Bescheid sagen',mode:'syllables',tokens:['scheid','gen','Be','sa']},
  {answer:'Gute Besserung',mode:'syllables',tokens:['rung','Gu','Bes','te','se']},
  {answer:'schade',mode:'syllables',tokens:['de','scha']},
  {answer:'Ich bin krank.',mode:'words',tokens:['krank.','Ich','bin']},
  {answer:'Ich fahre los.',mode:'words',tokens:['los.','fahre','Ich']},
  {answer:'Ich mache einen Ausflug.',mode:'words',tokens:['Ausflug.','einen','Ich','mache']},
  {answer:'Ich gehe zum Arzt.',mode:'words',tokens:['Arzt.','Ich','zum','gehe']},
  {answer:'Ich gehe in die Schule.',mode:'words',tokens:['Schule.','die','Ich','in','gehe']},
  {answer:'Mein Kind geht in die zweite Klasse.',mode:'words',tokens:['zweite','Mein','Klasse.','geht','die','Kind','in']},
  {answer:'Meine Tochter geht in die Grundschule.',mode:'words',tokens:['Grundschule.','geht','Meine','in','Tochter','die']},
  {answer:'Mein Sohn geht in die Schule.',mode:'words',tokens:['Schule.','Mein','in','geht','Sohn','die']}
 ];

 const phoneGapItems=[
  {text:'Sekretariat: Guten Morgen, Grundschule am Park.\nHassan Ali: Guten Morgen, {{0}} Hassan Ali. Meine Tochter Sara kann heute nicht zur Schule {{1}}.\nSekretariat: Ist sie krank?\nHassan Ali: Ja, sie ist {{2}}. Wir gehen heute zum {{3}}.\nSekretariat: Ich sage Frau Müller {{4}}. Gute Besserung!',blanks:[
   {answer:'hier spricht',options:['hier spricht','hier fährt','ich kommen']},{answer:'kommen',options:['kommen','gekommen','kommt']},{answer:'krank',options:['krank','pünktlich','kostenlos']},{answer:'Arzt',options:['Arzt','Bahnhof','Eintritt']},{answer:'Bescheid',options:['Bescheid','Unterricht','Klasse']}]},
  {text:'Kursbüro: Sprachschule Aktiv, guten Morgen.\nOmar Hassan: Guten Morgen. Ich kann heute nicht zum Deutschkurs {{0}}. Ich bin {{1}} und muss zu Hause {{2}}.\nKursbüro: Das tut mir leid.\nOmar Hassan: Morgen komme ich {{3}}.\nKursbüro: Gute {{4}}!',blanks:[
   {answer:'kommen',options:['kommen','kommt','gekommen']},{answer:'krank',options:['krank','fertig','teuer']},{answer:'bleiben',options:['bleiben','fahren','schwimmen']},{answer:'wieder',options:['wieder','gestern','nie']},{answer:'Besserung',options:['Besserung','Leitung','Grundschule']}]},
  {text:'Sekretariat: Guten Morgen.\nElena Marin: Mein Sohn Paul aus der Klasse 2b kann heute nicht zur Schule {{0}}.\nSekretariat: Ist Paul krank?\nElena Marin: Nein, er hat um halb zehn einen {{1}} beim Arzt. Morgen {{2}} er wieder zur Schule.\nSekretariat: Alles klar. Ich sage Herrn Becker {{3}}.\nElena Marin: Vielen {{4}}.',blanks:[
   {answer:'kommen',options:['kommen','gekommen','kommt']},{answer:'Termin',options:['Termin','Eintritt','Ausflug']},{answer:'kommt',options:['kommt','kommen','kam']},{answer:'Bescheid',options:['Bescheid','Schwimmbad','Frühstück']},{answer:'Dank',options:['Dank','Arzt','Unterricht']}]},
  {text:'Kursbüro: Guten Morgen, Sprachschule Dialog.\nAmina Saleh: Ich kann am Montag nicht zum Deutschkurs {{0}}.\nKursbüro: Was ist der Grund?\nAmina Saleh: Ich habe am Montagmorgen einen Termin bei der {{1}}. Am Dienstag komme ich {{2}}.\nKursbüro: Danke. Ich gebe der Kursleiterin {{3}}.\nAmina Saleh: Vielen Dank und auf {{4}}.',blanks:[
   {answer:'kommen',options:['kommen','kommt','gekommen']},{answer:'Ärztin',options:['Ärztin','Leitung','Klasse']},{answer:'wieder',options:['wieder','los','schade']},{answer:'Bescheid',options:['Bescheid','Eintritt','Schule']},{answer:'Wiederhören',options:['Wiederhören','Besserung','Ausflug']}]},
  {text:'Sekretariat: Grundschule am Park, guten Morgen.\nSamir Ali: Mein Sohn Karim geht in die Klasse 3b. Er kann am Freitag beim Ausflug nicht {{0}}.\nSekretariat: Was ist los?\nSamir Ali: Karim ist {{1}}.\nSekretariat: Das ist {{2}}. Ich sage der Lehrerin {{3}}. Gute Besserung!\nSamir Ali: Vielen {{4}}.',blanks:[
   {answer:'mitkommen',options:['mitkommen','losfahren','zurückkommen']},{answer:'krank',options:['krank','pünktlich','kostenlos']},{answer:'schade',options:['schade','prima','fertig']},{answer:'Bescheid',options:['Bescheid','Eintritt','Unterricht']},{answer:'Dank',options:['Dank','Junge','Arzt']}]}
 ];

 const shortMessages=[
  {format:'sms',from:'Frau Müller',text:'Guten Morgen. Der Unterricht endet heute schon um 12 Uhr. Bitte holen Sie Ihr Kind pünktlich ab.',questions:[q('Was müssen die Eltern heute beachten?','Das Kind früher abholen.','Das Kind erst um 16 Uhr abholen.','Das Kind zum Schwimmbad bringen.')]},
  {format:'sms',from:'Sekretariat',text:'Die Klasse 3a fährt morgen ins Museum. Treffpunkt ist um 8:15 Uhr vor der Schule.',questions:[q('Wo sollen die Kinder morgen zuerst sein?','vor der Schule','im Museum','am Bahnhof')]},
  {format:'email',from:'schule@beispiel.de',subject:'Schwimmbad',text:'Am Dienstag gehen wir schwimmen. Bitte geben Sie Ihrem Kind Badesachen und ein Handtuch mit.',questions:[q('Was braucht das Kind am Dienstag?','Badesachen und ein Handtuch','ein Wörterbuch und einen Stift','vier Euro Eintritt')]},
  {format:'sms',from:'Herr Becker',text:'Paul fehlt heute. Bitte bringen Sie die Hausaufgaben morgen mit.',questions:[q('Wann sollen die Hausaufgaben kommen?','morgen','heute Abend','nächste Woche')]},
  {format:'email',from:'bibliothek@schule.de',subject:'Bibliotheksbesuch',text:'Wir besuchen am Donnerstag die Bibliothek. Die Kinder brauchen ihren Bibliotheksausweis, aber kein Geld.',questions:[q('Was sollen die Kinder dabeihaben?','den Bibliotheksausweis','Eintrittsgeld','Sportschuhe')]},
  {format:'sms',from:'Frau Klein',text:'Sara ist wieder gesund und kommt morgen in die Schule. Heute bleibt sie noch zu Hause.',questions:[q('Wann ist Sara wieder im Unterricht?','morgen','heute','am Wochenende')]},
  {format:'email',from:'klasse3b@schule.de',subject:'Ausflug',text:'Der Bus fährt am Freitag um Viertel nach acht. Bitte seien Sie zehn Minuten früher vor der Schule.',questions:[q('Wann fährt der Bus?','8:15 Uhr','8:05 Uhr','8:30 Uhr')]},
  {format:'sms',from:'Sekretariat',text:'Frau Müller ist krank. Die Klasse 2b hat heute trotzdem Unterricht bei Herrn Klein.',questions:[q('Was passiert mit dem Unterricht der Klasse 2b?','Er findet bei einem anderen Lehrer statt.','Er fällt heute aus.','Er beginnt erst morgen.')]},
  {format:'email',from:'sport@schule.de',subject:'Sporttag',text:'Zum Sporttag brauchen die Kinder Sportsachen und Wasser. Schulbücher bleiben zu Hause.',questions:[q('Was gehört nicht in die Tasche?','Schulbücher','Wasser','Sportsachen')]},
  {format:'sms',from:'Grundschule am Park',text:'Das Schulfest beginnt Samstag um 14 Uhr. Eltern und Geschwister sind herzlich eingeladen.',questions:[q('Wer darf zum Schulfest kommen?','auch Familienmitglieder','nur Schülerinnen und Schüler','nur Lehrkräfte')]}
 ];

 const errorItems=[
  ['Der Ausflug ist am Freidag.','Freidag','Freitag'],['Die Klasse trift sich vor der Schule.','trift','trifft'],['Der Bus fährt um acht Ur los.','Ur','Uhr'],['Wir kommen um 16 Uhr zurük.','zurük','zurück'],['Der Eintrit kostet vier Euro.','Eintrit','Eintritt'],['Meine Tochter ist krang.','krang','krank'],['Ich sage der Lerhrerin Bescheid.','Lerhrerin','Lehrerin'],['Gute Beserung!','Beserung','Besserung'],['Mein Sohn geht in die Klase 2b.','Klase','Klasse'],['Vielen Dank für die Informazion.','Informazion','Information'],['Ich kann sehr gut schwimen.','schwimen','schwimmen'],['Wir wollen morgen Tenis spielen.','Tenis','Tennis'],['Bitte komm pünktlih zum Unterricht.','pünktlih','pünktlich'],['Ich habe heute Früstück gegessen.','Früstück','Frühstück'],['Gestern bin ich nach Berlin gefaren.','gefaren','gefahren'],['Wir sind am Abend spaziren gegangen.','spaziren','spazieren'],['Sara ist lange im Café gebliben.','gebliben','geblieben'],['Meine Freundin hat Brot gebaken.','gebaken','gebacken'],['Die Kinder sind im See geschwomt.','geschwomt','geschwommen'],['Omar hat einen Brief geschriben.','geschriben','geschrieben']
 ].map(([sentence,wrongWord,answer])=>({sentence,wrongWord,answer}));

 const dialogueItems=[
  {turns:[['Sekretariat','Grundschule am Park, guten Morgen.'],['Vater','Guten Morgen. Mein Kind kann heute nicht kommen.'],['Sekretariat','{{gap}}'],['Vater','Karim Ali.']],options:['Wie heißt Ihr Kind?','Wie heißen Sie?','Wie heißt die Lehrerin?'],answer:'Wie heißt Ihr Kind?'},
  {turns:[['Mutter','Mein Sohn heißt Karim Ali.'],['Sekretariat','{{gap}}'],['Mutter','Er geht in die Klasse 3b.']],options:['In welche Klasse geht Karim?','In welcher Klasse gehen Sie?','Wie heißt seine Klasse?'],answer:'In welche Klasse geht Karim?'},
  {turns:[['Mutter','Meine Tochter ist krank.'],['Sekretariat','{{gap}}'],['Mutter','Vielen Dank.']],options:['Das tut mir leid. Gute Besserung!','Das tut mir leid. Ich bin auch krank.','Gute Besserung für mich.'],answer:'Das tut mir leid. Gute Besserung!'},
  {turns:[['Sekretariat','Ich sage der Lehrerin Bescheid.'],['Mutter','{{gap}}']],options:['Vielen Dank.','Ihnen auch gute Besserung.','Ebenfalls.'],answer:'Vielen Dank.'},
  {turns:[['Omar','Ich kann heute nicht zum Deutschkurs kommen.'],['Kursbüro','{{gap}}'],['Omar','Ich bin krank.']],options:['Was ist los?','Wann kommen Sie gestern?','Wo ist Ihr Deutschkurs?'],answer:'Was ist los?'},
  {turns:[['Vater','Karim kann am Freitag beim Ausflug nicht mitkommen.'],['Sekretariat','{{gap}}'],['Vater','Er ist krank.']],options:['Warum kann er nicht mitkommen?','Wann kann er nicht mitkommen?','Wo kann er nicht mitkommen?'],answer:'Warum kann er nicht mitkommen?'},
  {turns:[['Mutter','Paul hat um halb zehn einen Termin beim Arzt.'],['Sekretariat','{{gap}}'],['Mutter','Ja, morgen ist er wieder da.']],options:['Kommt er morgen wieder?','Kommt der Arzt morgen wieder?','Kommen Sie morgen wieder?'],answer:'Kommt er morgen wieder?'},
  {turns:[['Sekretariat','Ich habe Frau Müller informiert.'],['Vater','{{gap}}']],options:['Vielen Dank.','Ihnen auch.','Gute Besserung für Sie.'],answer:'Vielen Dank.'}
 ];

 const schoolEmails=[
  {from:'Frau Müller <klasse3a@schule.de>',subject:'Ausflug in den Zoo',text:'Liebe Eltern, am Freitag macht die Klasse 3a einen Ausflug in den Zoo. Wir treffen uns um Viertel vor acht vor der Schule. Der Bus fährt um 8 Uhr los. Bitte geben Sie Ihrem Kind eine Flasche Wasser und ein kleines Frühstück mit. Süßigkeiten und Schulbücher brauchen die Kinder nicht. Um 16 Uhr sind wir wieder an der Schule.',questions:[q('Was machen die Kinder am Freitag?','Sie machen einen Ausflug.','Sie haben normalen Unterricht bis 16 Uhr.','Sie gehen ins Schwimmbad.'),q('Wann treffen sich die Kinder?','7:45 Uhr','8:00 Uhr','8:15 Uhr'),q('Was sollen die Kinder mitbringen?','Wasser','Süßigkeiten','Schulbücher')]},
  {from:'Herr Becker <klasse2b@schule.de>',subject:'Besuch im Museum',text:'Am Mittwoch besuchen wir das Stadtmuseum. Der Unterricht beginnt wie immer um 8 Uhr. Um 9 Uhr gehen wir gemeinsam von der Schule los. Der Eintritt kostet drei Euro. Um halb eins sind wir wieder in der Schule.',questions:[q('Wann verlässt die Klasse die Schule?','9:00 Uhr','8:00 Uhr','12:30 Uhr'),q('Wofür brauchen die Kinder drei Euro?','für den Eintritt','für den Bus','für das Mittagessen'),q('Wo ist die Klasse um 12:30 Uhr?','wieder in der Schule','noch im Museum','am Bahnhof')]},
  {from:'Frau Klein <sport@schule.de>',subject:'Schwimmbad am Dienstag',text:'Am Dienstag findet der Sportunterricht im Schwimmbad statt. Die Kinder treffen sich direkt dort um halb neun. Sie brauchen Badesachen und ein Handtuch. Sportschuhe sind nicht nötig. Der Unterricht endet um Viertel vor zwölf.',questions:[q('Wann treffen sich die Kinder?','8:30 Uhr','8:15 Uhr','9:30 Uhr'),q('Was brauchen sie für den Unterricht?','Badesachen und Handtuch','Sportschuhe und Ball','Schulbücher'),q('Wann ist der Unterricht zu Ende?','11:45 Uhr','12:15 Uhr','10:45 Uhr')]},
  {from:'Schulbibliothek <bibliothek@schule.de>',subject:'Besuch in der Bibliothek',text:'Die Klasse 4a geht am Donnerstag in die Bibliothek. Jedes Kind soll den Bibliotheksausweis mitbringen. Geld wird nicht gebraucht. Die Kinder dürfen dort ein Buch auswählen und ausleihen. Vor dem Mittagessen sind alle wieder in der Schule.',questions:[q('Was müssen die Kinder dabeihaben?','den Bibliotheksausweis','fünf Euro','Sportsachen'),q('Was machen die Kinder in der Bibliothek?','Sie können ein Buch ausleihen.','Sie schreiben einen Test.','Sie essen dort zu Mittag.'),q('Brauchen die Kinder Geld?','Nein.','Ja, für den Eintritt.','Ja, für ein Buch.')]},
  {from:'Klassenleitung <klasse4b@schule.de>',subject:'Übernachtung in der Schule',text:'Am Freitag übernachtet die Klasse 4b in der Schule. Beginn ist um 18 Uhr, am Samstag endet die Aktion um 9 Uhr. Die Kinder schlafen in der Turnhalle und brauchen einen Schlafsack, eine Taschenlampe und Schlafsachen. Das Abendessen bekommt die Klasse in der Schule.',questions:[q('Wann werden die Kinder abgeholt?','am Samstag um 9 Uhr','am Freitag um 18 Uhr','am Samstag um 18 Uhr'),q('Was sollen sie mitbringen?','einen Schlafsack','ein Abendessen','Schulbücher'),q('Wo schlafen die Kinder?','in der Turnhalle','in der Bibliothek','im Klassenraum')]},
  {from:'Schulleitung <info@schule.de>',subject:'Schulfest',text:'Unser Schulfest ist am Samstag. Es beginnt um 14 Uhr auf dem Schulhof. Eltern und Geschwister sind herzlich eingeladen. Die Schule verkauft Getränke. Wer möchte, kann einen Kuchen für das Kuchenbuffet mitbringen. Um 18 Uhr endet das Fest.',questions:[q('Wer kann zum Fest kommen?','auch Eltern und Geschwister','nur Kinder','nur Lehrkräfte'),q('Wo findet das Fest statt?','auf dem Schulhof','im Schwimmbad','im Museum'),q('Was können Familien freiwillig mitbringen?','einen Kuchen','Getränke für alle','Schulbücher')]},
  {from:'Frau Müller <elternabend@schule.de>',subject:'Elternabend',text:'Der nächste Elternabend ist am Dienstag um halb sieben abends im Raum 204. Wir sprechen über den Ausflug im Juni und über die Hausaufgaben. Die Kinder müssen nicht mitkommen. Bitte sagen Sie Bescheid, wenn Sie nicht teilnehmen können.',questions:[q('Wann beginnt der Elternabend?','18:30 Uhr','17:30 Uhr','19:30 Uhr'),q('Wer soll teilnehmen?','die Eltern','nur die Kinder','die ganze Klasse mit Kindern'),q('Worüber wird gesprochen?','über Ausflug und Hausaufgaben','über Schwimmunterricht','über einen Arzttermin')]},
  {from:'Sportteam <sporttag@schule.de>',subject:'Sporttag am Montag',text:'Am Montag ist Sporttag auf dem Sportplatz. Alle Kinder kommen um 8 Uhr direkt zum Sportplatz. Sie brauchen Sportsachen, eine Flasche Wasser und ein Frühstück. Schulbücher bleiben zu Hause. Bei starkem Regen findet normaler Unterricht in der Schule statt.',questions:[q('Wohin gehen die Kinder bei gutem Wetter?','direkt zum Sportplatz','zuerst ins Klassenzimmer','ins Schwimmbad'),q('Was bleibt zu Hause?','die Schulbücher','das Wasser','die Sportsachen'),q('Was passiert bei starkem Regen?','Es gibt normalen Unterricht.','Der Sporttag findet im Museum statt.','Die Kinder haben frei.')]},
  {from:'Projektteam <projekt@schule.de>',subject:'Projekttag',text:'Am Mittwoch ist Projekttag. Die Kinder wählen zwischen Garten und Kochen. Bitte geben Sie Ihrem Kind ein altes T-Shirt mit, weil die Kleidung schmutzig werden kann. Der Projekttag endet um Viertel nach eins. Ein Mittagessen gibt es an diesem Tag nicht.',questions:[q('Warum brauchen die Kinder ein altes T-Shirt?','Die Kleidung kann schmutzig werden.','Sie gehen schwimmen.','Sie schlafen in der Schule.'),q('Wann endet der Projekttag?','13:15 Uhr','12:45 Uhr','14:15 Uhr'),q('Was gibt es an diesem Tag nicht?','Mittagessen','Projekte','Unterricht am Vormittag')]},
  {from:'Herr Becker <theater@schule.de>',subject:'Theaterbesuch am Freitag',text:'Am Freitag fährt die Klasse mit dem Zug ins Theater. Treffpunkt ist um zehn vor neun vor der Schule. Der Zug fährt um Viertel nach neun. Die Eintrittskarten sind schon bezahlt. Um halb drei kommen wir wieder zurück.',questions:[q('Wann ist der Treffpunkt?','8:50 Uhr','9:10 Uhr','9:15 Uhr'),q('Wann fährt der Zug?','9:15 Uhr','8:50 Uhr','9:45 Uhr'),q('Müssen die Kinder Geld für die Eintrittskarte mitbringen?','Nein.','Ja, unbedingt.','Nur drei Euro.')]}
 ];

 const emailClozeItems=[
  {from:'Maria Becker',subject:'Krankmeldung',text:'Sehr {{0}} Frau Müller,\n\nich kann heute {{1}} nicht zum Deutschkurs kommen. Ich bin {{2}}. Morgen komme ich {{3}}.\n\nMit freundlichen {{4}}\nMaria Becker',blanks:[{answer:'geehrte'},{answer:'leider'},{answer:'krank'},{answer:'wieder'},{answer:'Grüßen'}]},
  {from:'Ahmed Yilmaz',subject:'Arzttermin',text:'Sehr {{0}} Frau Müller,\n\nam Dienstag kann ich nicht am Deutschkurs {{1}}. Ich habe einen {{2}} beim Arzt. Am Mittwoch bin ich wieder im {{3}}.\n\nMit freundlichen {{4}}\nAhmed Yilmaz',blanks:[{answer:'geehrte'},{answer:'teilnehmen'},{answer:'Termin'},{answer:'Kurs'},{answer:'Grüßen'}]},
  {from:'Elena Marin',subject:'Kind krank',text:'Sehr {{0}} Frau Müller,\n\nmeine Tochter ist {{1}}. Deshalb muss ich heute zu Hause {{2}} und kann nicht zum Deutschkurs kommen. Morgen gebe ich Ihnen {{3}}, ob ich wieder kommen kann.\n\nViele {{4}}\nElena Marin',blanks:[{answer:'geehrte'},{answer:'krank'},{answer:'bleiben'},{answer:'Bescheid'},{answer:'Grüße'}]},
  {from:'Paul Novak',subject:'Termin beim Zahnarzt',text:'Sehr {{0}} Frau Müller,\n\nich kann am Donnerstag nicht zum Kurs {{1}}. Ich habe am Vormittag einen Termin beim {{2}}. Am Freitag komme ich wieder zum {{3}}.\n\nMit freundlichen {{4}}\nPaul Novak',blanks:[{answer:'geehrte'},{answer:'kommen'},{answer:'Zahnarzt'},{answer:'Unterricht'},{answer:'Grüßen'}]},
  {from:'Amina Saleh',subject:'Krankmeldung für zwei Tage',text:'Sehr {{0}} Frau Müller,\n\nich bin krank und kann heute und morgen nicht zum Deutschkurs {{1}}. Ich gehe heute zur {{2}}. Am Mittwoch möchte ich wieder {{3}}.\n\nVielen Dank und freundliche {{4}}\nAmina Saleh',blanks:[{answer:'geehrte'},{answer:'kommen'},{answer:'Ärztin'},{answer:'teilnehmen'},{answer:'Grüße'}]}
 ];

 exam.title='Prüfung';exam.description='Bearbeite die Prüfung.';exam.exam=true;
 const rebuilt=[
  cards,
  {id:'artikel',title:'Artikel und Plural',description:'Sieh das Bild an und schreibe Artikel und Plural.',instruction:'Sieh das Bild an. Schreibe den richtigen Artikel und den Plural.',icon:'🔤',kind:'article-plural',items:articleItems},
  {id:'wort-bedeutung',title:'Bedeutung',description:'Finde die passende Bedeutung.',instruction:'',icon:'💡',kind:'meaning-choice',items:meaningItems},
  {id:'hoerdiktat',title:'Hördiktat',description:'Höre und schreibe das Wort.',instruction:'Höre das Wort und schreibe es.',icon:'🎧',kind:'listen-write',items:dictationWords},
  {id:'bild-hoeren',title:'Hören zum Bild',description:'Höre und wähle.',instruction:'Sieh das Bild an. Höre die vier Varianten und wähle die richtige.',icon:'🔊',kind:'image-audio-choice',items:imageAudioItems},
  {id:'redemittel-ordnen',title:'Redemittel ordnen',description:'Ordne die Redewendungen.',instruction:'Ordne die Redewendungen.',icon:'🧩',kind:'phrase-order',items:phraseItems},
  {id:'telefonluecken',title:'Telefonatlücken',description:'Ergänze die Telefonate.',instruction:'Ergänze die Telefonate.',icon:'☎️',kind:'phone-gap-two-stage',items:phoneGapItems},
  {id:'lesen-richtig-falsch',title:'Nachrichten lesen',description:'Lies die Nachricht. Antworte A, B oder C.',instruction:'Lies die Nachricht. Antworte A, B oder C.',icon:'📱',kind:'message-reading',items:shortMessages},
  {id:'rechtschreibung',title:'Fehler korrigieren',description:'Finde die Rechtschreibfehler.',instruction:'1. Klicke das falsche Wort an. 2. Schreibe die richtige Form.',icon:'🛠️',kind:'error-correct',items:errorItems},
  {id:'hoeren-sekretariat',title:'Hören Krankmeldungen',description:'Höre und antworte.',instruction:'Höre den Dialog und wähle A, B oder C.',icon:'🎧',kind:'audio-pack',items:[]},
  {id:'hoerdialog-ordnen',title:'Dialoge',description:'Wähle die passende Äußerung.',instruction:'Lies die Dialoge und wähle die passende Äußerung.',icon:'💬',kind:'dialog-bubbles',items:dialogueItems},
  {id:'nachrichten-schule',title:'Nachrichten aus der Schule',description:'Antworte auf die Fragen.',instruction:'Lies den Text und wähle A, B oder C.',icon:'✉️',kind:'school-email-reading',items:schoolEmails},
  {id:'email-ergaenzen',title:'E-Mail ergänzen',description:'Ergänze die E-Mail.',instruction:'Ergänze die E-Mail.',icon:'📧',kind:'email-input-cloze',items:emailClozeItems},
  exam
 ];
 theme.tasks=rebuilt;
 theme.contentRevision='l7t4-user-rebuild-20260822-v1';window.L7_THEME=theme;return theme;
});
})();
