(function(){
'use strict';
if(window.__SP_L7T4_RESTRUCTURE_V1)return;window.__SP_L7T4_RESTRUCTURE_V1=true;
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,' ').trim();
const pick=(tasks,id)=>tasks.find(t=>t?.id===id)||null;
const choice=(term,answer,wrong1,wrong2)=>({prompt:`Was bedeutet „${term}“?`,options:[answer,wrong1,wrong2],answer,hint:`„${term}“ passt zu: ${answer}.`});
const spelling=(context,answer)=>({context,prompt:'Welches Wort ist falsch geschrieben? Schreibe es richtig.',answer,hint:`Achte genau auf die Schreibweise von „${answer}“.`});
const AUDIO='https://sprachpilot.b-cdn.net/audio/l7t4_krankmeldung_sekretariat_01.mp3';

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const old=Array.isArray(theme?.tasks)?theme.tasks:[];
 const cards=pick(old,'karteikarten')||old.find(t=>t?.kind==='cards');
 const exam=old.find(t=>t?.exam)||old[old.length-1];
 const cardItems=Array.isArray(cards?.items)?cards.items:[];
 const imageFor=word=>{const n=norm(word),item=cardItems.find(x=>norm(x?.word||x?.answer||x?.full)===n||norm(x?.word||x?.answer||x?.full).includes(n));return item?.image||''};
 const articleItems=[
  ['Mädchen','das','die Mädchen'],['Junge','der','die Jungen'],['Klasse','die','die Klassen'],['Schwimmbad','das','die Schwimmbäder'],['Eintritt','der','die Eintritte'],['Grundschule','die','die Grundschulen'],['Unterricht','der','kein Plural'],['Leitung','die','die Leitungen'],['Schule','die','die Schulen'],['Arzt','der','die Ärzte'],['Ärztin','die','die Ärztinnen'],['Ausflug','der','die Ausflüge']
 ].map(([word,article,plural])=>({word,article,plural,image:imageFor(word),prompt:'Schreibe den Artikel und den Plural.',answer:`${article} ${word} | ${plural}`,hint:`Artikel: ${article}. Plural: ${plural}.`}));

 const meaningItems=[
  choice('Bescheid sagen','eine Person informieren','eine Person abholen','eine Person besuchen'),
  choice('fehlen','nicht da sein','zu spät sein','fertig sein'),
  choice('sich entschuldigen','sagen, dass etwas leidtut','eine Frage stellen','eine Person einladen'),
  choice('losfahren','eine Fahrt beginnt','eine Fahrt endet','zu Fuß gehen'),
  choice('zurückkommen','wieder an den Startort kommen','zum Arzt gehen','zu Hause bleiben'),
  choice('mitkommen','zusammen mit anderen gehen oder fahren','allein warten','eine Nachricht schreiben'),
  choice('krank','nicht gesund','sehr pünktlich','sehr hungrig'),
  choice('schade','etwas ist nicht gut oder traurig','etwas ist sehr einfach','etwas ist kostenlos'),
  choice('Gute Besserung!','Wunsch für eine kranke Person','Begrüßung am Telefon','Frage nach dem Preis'),
  choice('Eintritt','Geld für den Eingang','Treffpunkt vor der Schule','Zeit für den Unterricht'),
  choice('Ausflug','eine gemeinsame Fahrt oder ein gemeinsamer Besuch','ein Test in Mathematik','ein Termin beim Arzt'),
  choice('Unterricht','Zeit zum Lernen mit Lehrkraft','Pause am Nachmittag','Fahrt mit dem Bus'),
  choice('können','eine Fähigkeit oder Möglichkeit haben','etwas unbedingt wollen','etwas gestern machen'),
  choice('wollen','einen Wunsch oder Plan haben','etwas schon gemacht haben','nicht gesund sein'),
  choice('möchten','höflich etwas wünschen','etwas verbieten','etwas vergessen'),
  choice('pünktlich','zur richtigen Zeit','sehr langsam','gar nicht'),
  choice('auf jeden Fall','sicher / bestimmt','vielleicht nicht','gestern Abend'),
  choice('auf keinen Fall','sicher nicht','sehr gern','ein bisschen'),
  choice('Partizip II','Verbform, die man im Perfekt braucht','Pluralform eines Nomens','Fragewort für Personen'),
  choice('gefahren','Partizip II von fahren','Partizip II von gehen','Partizip II von backen'),
  choice('gegangen','Partizip II von gehen','Partizip II von kommen','Partizip II von bleiben'),
  choice('geblieben','Partizip II von bleiben','Partizip II von fahren','Partizip II von tanzen'),
  choice('gebacken','Partizip II von backen','Partizip II von schwimmen','Partizip II von kommen'),
  choice('geschwommen','Partizip II von schwimmen','Partizip II von wandern','Partizip II von wollen')
 ];

 const clozeItems=[
  {title:'E-Mail an die Schule',text:'Guten Morgen Frau Müller,\nmeine Tochter Sara kann heute {{0}} zur Schule kommen. Sie ist {{1}}. Wir gehen heute zum {{2}}. Bitte sagen Sie der Lehrerin {{3}}. Vielen Dank und {{4}}.',blanks:[
   {options:['nicht','gern','wieder'],answer:'nicht'},{options:['krank','pünktlich','fertig'],answer:'krank'},{options:['Arzt','Bahnhof','Schwimmbad'],answer:'Arzt'},{options:['Bescheid','Frühstück','Unterricht'],answer:'Bescheid'},{options:['auf Wiederhören','Gute Nacht','bis gestern'],answer:'auf Wiederhören'}]},
  {title:'Dialog 1 · Kind krank',text:'A: Guten Morgen, {{0}} Hassan Ali.\nB: Guten Morgen. Was ist los?\nA: Meine Tochter kann heute nicht kommen. Sie ist {{1}}.\nB: Das tut mir {{2}}. Ich sage Frau Müller {{3}}.\nA: Vielen Dank.\nB: Gute {{4}}!',blanks:[
   {options:['hier spricht','ich heiße nicht','da fährt'],answer:'hier spricht'},{options:['krank','kostenlos','fertig'],answer:'krank'},{options:['leid','Spaß','Frühstück'],answer:'leid'},{options:['Bescheid','Gitarre','Mathematik'],answer:'Bescheid'},{options:['Besserung','Abfahrt','Klasse'],answer:'Besserung'}]},
  {title:'Dialog 2 · Deutschkurs',text:'A: Guten Morgen, hier spricht Omar Hassan. Ich kann heute nicht zum Deutschkurs {{0}}.\nB: Was ist los?\nA: Ich bin {{1}} und habe einen Termin beim {{2}}.\nB: Danke für die {{3}}. Gute Besserung!\nA: Vielen Dank. Auf Wiederhören.',blanks:[
   {options:['kommen','gekommen','kommt'],answer:'kommen'},{options:['krank','teuer','pünktlich'],answer:'krank'},{options:['Arzt','Bus','Team'],answer:'Arzt'},{options:['Information','Eintritt','Grundschule'],answer:'Information'}]},
  {title:'Dialog 3 · Ausflug',text:'A: Guten Morgen. Mein Sohn Karim kann am Freitag beim Ausflug nicht {{0}}.\nB: Oh, das ist {{1}}. Was ist los?\nA: Er ist krank.\nB: Ich sage dem Lehrer {{2}}. Gute {{3}} für Karim!\nA: Vielen Dank.',blanks:[
   {options:['mitkommen','zurückkommen','losfahren'],answer:'mitkommen'},{options:['schade','kostenlos','professionell'],answer:'schade'},{options:['Bescheid','Unterricht','Eintritt'],answer:'Bescheid'},{options:['Besserung','Schule','Klasse'],answer:'Besserung'}]}
 ];

 const readings=[
  {title:'1 · Ausflug in den Zoo',text:'Liebe Eltern, die Klasse 3a fährt am Freitag in den Zoo. Treffpunkt ist um 7:45 Uhr vor der Schule. Der Bus fährt um 8 Uhr los. Bitte geben Sie Ihrem Kind Frühstück und Wasser mit. Wir kommen um 16 Uhr zurück. Der Eintritt kostet vier Euro.',questions:[
   {q:'Wann ist der Ausflug?',options:['am Freitag','am Dienstag','am Montag'],answer:'am Freitag'},
   {q:'Wo ist der Treffpunkt?',options:['vor der Schule','am Bahnhof','im Schwimmbad'],answer:'vor der Schule'},
   {q:'Was brauchen die Kinder?',options:['Frühstück und Wasser','nur ein Buch','Sportschuhe und Gitarre'],answer:'Frühstück und Wasser'},
   {q:'Wie viel kostet der Eintritt?',options:['4 Euro','2 Euro','kostenlos'],answer:'4 Euro'}]},
  {title:'2 · Schwimmbad',text:'Am Dienstag geht die Klasse 2b ins Schwimmbad. Der Unterricht beginnt normal um 8 Uhr. Die Kinder brauchen Badesachen und ein Handtuch. Um 13 Uhr sind alle wieder in der Schule. Der Eintritt ist kostenlos.',questions:[
   {q:'An welchem Tag geht die Klasse ins Schwimmbad?',options:['Dienstag','Mittwoch','Freitag'],answer:'Dienstag'},
   {q:'Wann beginnt der Unterricht?',options:['8 Uhr','9 Uhr','10 Uhr'],answer:'8 Uhr'},
   {q:'Was müssen die Kinder mitbringen?',options:['Badesachen und Handtuch','Frühstück und Buch','Geld und Gitarre'],answer:'Badesachen und Handtuch'},
   {q:'Kostet der Eintritt Geld?',options:['Nein, er ist kostenlos.','Ja, drei Euro.','Ja, fünf Euro.'],answer:'Nein, er ist kostenlos.'}]},
  {title:'3 · Unterricht am Donnerstag',text:'Am Donnerstag gibt es am Nachmittag keinen Unterricht. Die Schule endet für alle Klassen um 12:30 Uhr. Bitte holen Sie jüngere Kinder pünktlich ab.',questions:[
   {q:'Gibt es am Donnerstagnachmittag Unterricht?',options:['Nein.','Ja.','Nur für Klasse 3a.'],answer:'Nein.'},
   {q:'Wann endet die Schule?',options:['12:30 Uhr','13:30 Uhr','15 Uhr'],answer:'12:30 Uhr'},
   {q:'Für wen gilt die Information?',options:['für alle Klassen','nur für eine Klasse','nur für Lehrer'],answer:'für alle Klassen'}]},
  {title:'4 · Treffpunkt Bahnhof',text:'Die Klasse 4a trifft sich am Montag um 8:15 Uhr am Bahnhof. Der Zug fährt um 8:40 Uhr. Die Kinder sollen pünktlich sein. Sie kommen um 14:20 Uhr zurück.',questions:[
   {q:'Wo trifft sich die Klasse?',options:['am Bahnhof','vor der Schule','beim Arzt'],answer:'am Bahnhof'},
   {q:'Wann fährt der Zug?',options:['8:40 Uhr','8:15 Uhr','9 Uhr'],answer:'8:40 Uhr'},
   {q:'Wann kommt die Klasse zurück?',options:['14:20 Uhr','16 Uhr','12:30 Uhr'],answer:'14:20 Uhr'}]},
  {title:'5 · Deutschkurs beginnt später',text:'Frau Klein ist krank. Deshalb beginnt der Deutschkurs heute erst um 10 Uhr. Der Unterricht endet wie immer um 13 Uhr. Bitte kommen Sie pünktlich.',questions:[
   {q:'Warum beginnt der Kurs später?',options:['Frau Klein ist krank.','Es gibt einen Ausflug.','Der Eintritt ist teuer.'],answer:'Frau Klein ist krank.'},
   {q:'Wann beginnt der Kurs?',options:['10 Uhr','8 Uhr','13 Uhr'],answer:'10 Uhr'},
   {q:'Wann endet der Kurs?',options:['13 Uhr','10 Uhr','16 Uhr'],answer:'13 Uhr'}]},
  {title:'6 · Krankmeldung Sara',text:'Guten Morgen Frau Müller, meine Tochter Sara Ali aus der Klasse 3a kann heute und morgen nicht zur Schule kommen. Sie ist krank und hat heute einen Termin beim Arzt. Viele Grüße, Hassan Ali.',questions:[
   {q:'Wer ist krank?',options:['Sara Ali','Hassan Ali','Frau Müller'],answer:'Sara Ali'},
   {q:'In welche Klasse geht Sara?',options:['3a','2b','4a'],answer:'3a'},
   {q:'Wie lange fehlt Sara?',options:['heute und morgen','nur am Freitag','eine Woche'],answer:'heute und morgen'},
   {q:'Wohin geht Sara heute?',options:['zum Arzt','zum Bahnhof','ins Schwimmbad'],answer:'zum Arzt'}]},
  {title:'7 · Nachricht an den Deutschkurs',text:'Guten Morgen, ich kann heute nicht zum Deutschkurs kommen. Ich bin krank. Morgen möchte ich wiederkommen. Entschuldigen Sie bitte mein Fehlen. Viele Grüße, Omar Hassan.',questions:[
   {q:'Wer kann heute nicht kommen?',options:['Omar Hassan','Sara Ali','Frau Klein'],answer:'Omar Hassan'},
   {q:'Warum kommt Omar nicht?',options:['Er ist krank.','Er ist im Schwimmbad.','Er fährt in den Zoo.'],answer:'Er ist krank.'},
   {q:'Wann möchte er wiederkommen?',options:['morgen','nächste Woche','am Montag'],answer:'morgen'}]},
  {title:'8 · Ausflug am Mittwoch',text:'Am Mittwoch macht die Klasse 3b einen Ausflug. Die Kinder treffen sich um 8:30 Uhr im Klassenraum. Um 9 Uhr fährt der Bus los. Die Rückkehr ist um 15:30 Uhr. Jedes Kind braucht Wasser und ein kleines Frühstück.',questions:[
   {q:'Wann ist der Ausflug?',options:['Mittwoch','Freitag','Dienstag'],answer:'Mittwoch'},
   {q:'Wo ist der Treffpunkt?',options:['im Klassenraum','am Bahnhof','beim Arzt'],answer:'im Klassenraum'},
   {q:'Wann fährt der Bus los?',options:['9 Uhr','8:30 Uhr','15:30 Uhr'],answer:'9 Uhr'},
   {q:'Was sollen die Kinder mitbringen?',options:['Wasser und Frühstück','nur Geld','ein Klavier'],answer:'Wasser und Frühstück'}]},
  {title:'9 · Paul fehlt',text:'Guten Morgen, mein Sohn Paul Marin geht in die Klasse 2b. Er kann heute nicht zur Schule kommen. Er hat um 9:30 Uhr einen Termin bei der Ärztin. Morgen kommt er wieder. Vielen Dank, Elena Marin.',questions:[
   {q:'Wie heißt das Kind?',options:['Paul Marin','Omar Hassan','Karim Ali'],answer:'Paul Marin'},
   {q:'Warum fehlt Paul?',options:['Er hat einen Termin bei der Ärztin.','Er hat einen Ausflug.','Er muss arbeiten.'],answer:'Er hat einen Termin bei der Ärztin.'},
   {q:'Wann ist der Termin?',options:['9:30 Uhr','8 Uhr','14 Uhr'],answer:'9:30 Uhr'},
   {q:'Wann kommt Paul wieder?',options:['morgen','heute Nachmittag','nächste Woche'],answer:'morgen'}]},
  {title:'10 · Information der Schule',text:'Liebe Eltern, am Freitag endet der Unterricht schon um 11:45 Uhr. Am Nachmittag ist die Schule geschlossen. Die Kinder bekommen vorher noch ein Mittagessen. Bitte holen Sie Ihr Kind pünktlich ab.',questions:[
   {q:'Wann endet der Unterricht?',options:['11:45 Uhr','12:30 Uhr','14 Uhr'],answer:'11:45 Uhr'},
   {q:'Ist die Schule am Nachmittag offen?',options:['Nein.','Ja.','Nur bis 16 Uhr.'],answer:'Nein.'},
   {q:'Was bekommen die Kinder vorher?',options:['ein Mittagessen','einen Eintritt','Badesachen'],answer:'ein Mittagessen'}]}
 ];

 const spellingItems=[
  spelling('Der Ausflug ist am Freidag.','Freitag'),spelling('Die Klasse trift sich vor der Schule.','trifft'),spelling('Der Bus fährt um acht Ur los.','Uhr'),spelling('Wir kommen um 16 Uhr zurük.','zurück'),spelling('Der Eintrit kostet vier Euro.','Eintritt'),spelling('Meine Tochter ist krang.','krank'),spelling('Ich sage der Lerhrerin Bescheid.','Lehrerin'),spelling('Gute Beserung!','Besserung'),spelling('Mein Sohn geht in die Klase 2b.','Klasse'),spelling('Vielen Dank für die Informazion.','Information'),
  spelling('Ich kann sehr gut schwimen.','schwimmen'),spelling('Wir wollen morgen Tenis spielen.','Tennis'),spelling('Bitte komm pünktlih zum Unterricht.','pünktlich'),spelling('Ich habe heute ein Früstück gegessen.','Frühstück'),spelling('Gestern bin ich nach Berlin gefaren.','gefahren'),spelling('Wir sind am Abend spaziren gegangen.','spazieren'),spelling('Sara ist lange im Café gebliben.','geblieben'),spelling('Am Samstag haben wir getanzt und gelacht.','Samstag'),spelling('Meine Freundin hat Brot gebaken.','gebacken'),spelling('Der Matematikkurs beginnt um neun Uhr.','Mathematikkurs')
 ];

 const listenItems=[
  {audio:AUDIO,prompt:'Warum ruft Hassan Ali in der Schule an?',options:['Seine Tochter ist krank.','Er fragt nach dem Eintritt.','Er möchte einen Ausflug buchen.'],answer:'Seine Tochter ist krank.',hint:'Achte auf den Grund der Krankmeldung.'},
  {audio:AUDIO,prompt:'In welche Klasse geht Sara?',options:['in die Klasse 3a','in die Klasse 2b','in die Klasse 4a'],answer:'in die Klasse 3a',hint:'Höre auf die Klassenangabe.'},
  {audio:AUDIO,prompt:'Was macht Frau Klein nach dem Telefonat?',options:['Sie sagt Frau Müller Bescheid.','Sie fährt zum Arzt.','Sie holt Sara ab.'],answer:'Sie sagt Frau Müller Bescheid.',hint:'Achte auf die Reaktion des Sekretariats.'}
 ];

 const dialogItems=[
  {title:'Dialog 1 · Tochter krank',turns:[['Eltern','Guten Morgen, hier spricht Hassan Ali.'],['Sekretariat','Guten Morgen. Was ist los?'],['Eltern','Meine Tochter Sara kann heute nicht zur Schule kommen. Sie ist krank.'],['Sekretariat','{{gap}}'],['Eltern','Vielen Dank. Auf Wiederhören.']],options:['Das tut mir leid. Ich sage Frau Müller Bescheid. Gute Besserung!','Der Eintritt kostet vier Euro.','Der Bus fährt um acht Uhr los.'],answer:'Das tut mir leid. Ich sage Frau Müller Bescheid. Gute Besserung!'},
  {title:'Dialog 2 · Sohn hat Arzttermin',turns:[['Vater','Guten Morgen. Mein Sohn Paul aus der Klasse 2b fehlt heute.'],['Sekretariat','Warum kann er nicht kommen?'],['Vater','{{gap}}'],['Sekretariat','Danke für die Information. Ich sage dem Lehrer Bescheid.']],options:['Er hat heute einen Termin beim Arzt.','Er fährt heute mit der Klasse in den Zoo.','Er möchte Tennis spielen.'],answer:'Er hat heute einen Termin beim Arzt.'},
  {title:'Dialog 3 · Deutschkurs',turns:[['Omar','Guten Morgen, hier spricht Omar Hassan.'],['Kursbüro','Guten Morgen, Herr Hassan.'],['Omar','Ich kann heute nicht zum Deutschkurs kommen. Ich bin krank.'],['Kursbüro','{{gap}}'],['Omar','Danke. Morgen komme ich wieder.']],options:['Danke für die Information. Gute Besserung!','Wann fährt der Bus los?','Bitte bringen Sie Badesachen mit.'],answer:'Danke für die Information. Gute Besserung!'},
  {title:'Dialog 4 · zwei Tage fehlen',turns:[['Mutter','Meine Tochter kann heute und morgen nicht zur Schule kommen.'],['Sekretariat','Ist sie krank?'],['Mutter','Ja, sie hat Fieber.'],['Sekretariat','{{gap}}']],options:['Das tut mir leid. Gute Besserung für Ihre Tochter.','Der Treffpunkt ist am Bahnhof.','Der Unterricht kostet drei Euro.'],answer:'Das tut mir leid. Gute Besserung für Ihre Tochter.'},
  {title:'Dialog 5 · Rückfrage nach Name und Klasse',turns:[['Sekretariat','Grundschule am Park, guten Morgen.'],['Vater','Guten Morgen. Mein Kind kann heute nicht kommen.'],['Sekretariat','{{gap}}'],['Vater','Karim Ali, Klasse 3b.']],options:['Wie heißt Ihr Kind und in welche Klasse geht es?','Wie viel kostet der Eintritt?','Wann kommen Sie zurück?'],answer:'Wie heißt Ihr Kind und in welche Klasse geht es?'},
  {title:'Dialog 6 · Gespräch beenden',turns:[['Sekretariat','Ich sage der Lehrerin Bescheid.'],['Mutter','Vielen Dank.'],['Sekretariat','Gute Besserung für Ihre Tochter.'],['Mutter','{{gap}}']],options:['Danke. Auf Wiederhören.','Ich fahre um acht Uhr los.','Der Eintritt ist kostenlos.'],answer:'Danke. Auf Wiederhören.'}
 ];

 const guidedPhone=[
  {context:'Du bist Hassan Ali. Du rufst morgens in der Schule an.',prompt:'Wie beginnst du das Telefonat?',answer:'Guten Morgen, hier spricht Hassan Ali.',answers:['Guten Morgen, hier spricht Hassan Ali'],hint:'Beginne mit „Guten Morgen, hier spricht …“.'},
  {context:'Deine Tochter heißt Sara Ali.',prompt:'Wie nennst du dein Kind?',answer:'Meine Tochter heißt Sara Ali.',answers:['Meine Tochter heißt Sara Ali'],hint:'Nutze „Meine Tochter heißt …“.'},
  {context:'Sara ist in der Klasse 3a.',prompt:'Wie sagst du die Klasse?',answer:'Sie geht in die Klasse 3a.',answers:['Sie geht in die Klasse 3a'],hint:'Nutze „Sie geht in die Klasse …“.'},
  {context:'Sara kann heute nicht kommen.',prompt:'Wie meldest du sie ab?',answer:'Sie kann heute nicht zur Schule kommen.',answers:['Sie kann heute nicht zur Schule kommen'],hint:'Nutze „kann heute nicht zur Schule kommen“.'},
  {context:'Der Grund ist Krankheit und ihr geht zum Arzt.',prompt:'Nenne den Grund und den Plan.',answer:'Sie ist krank. Wir gehen heute zum Arzt.',answers:['Sie ist krank. Wir gehen heute zum Arzt'],hint:'Zwei kurze Sätze: krank + Arzt.'},
  {context:'Du arbeitest im Sekretariat.',prompt:'Wie reagierst du höflich?',answer:'Das tut mir leid. Ich sage der Lehrerin Bescheid.',answers:['Das tut mir leid. Ich sage der Lehrerin Bescheid'],hint:'Reaktion + Bescheid sagen.'},
  {context:'Du bist wieder der Vater.',prompt:'Wie bedankst du dich?',answer:'Vielen Dank für die Information.',answers:['Vielen Dank für die Information'],hint:'Nutze „Vielen Dank …“.'},
  {context:'Das Telefonat ist zu Ende.',prompt:'Wie verabschiedest du dich?',answer:'Auf Wiederhören.',answers:['Auf Wiederhören'],hint:'Am Telefon sagt man „Auf Wiederhören“.'}
 ];

 const criteria20=[
  {title:'Nachricht 1 · heute krank',scenario:'Du kannst heute nicht zum Deutschkurs kommen. Du bist krank. Morgen kommst du wieder. Entschuldige dein Fehlen und schreibe einen Gruß mit deinem Namen.',criteria:[
   {label:'Begrüßung',patterns:['guten morgen','hallo']},{label:'heute nicht zum Deutschkurs kommen',patterns:['heute nicht zum deutschkurs kommen','heute nicht in den deutschkurs kommen']},{label:'Grund: krank',patterns:['bin krank','ich bin krank']},{label:'morgen wiederkommen',patterns:['morgen komme ich wieder','komme morgen wieder']},{label:'Entschuldigung',patterns:['entschuldigen sie','entschuldigung','tut mir leid']},{label:'Gruß / Name',patterns:['viele grusse','viele grüße','mit freundlichen grussen','mit freundlichen grüßen']}],model:'Guten Morgen,\nich kann heute nicht zum Deutschkurs kommen. Ich bin krank. Morgen komme ich wieder. Entschuldigen Sie bitte mein Fehlen.\nViele Grüße\nOmar Hassan'},
  {title:'Nachricht 2 · Arzttermin',scenario:'Du fehlst Montag und Dienstag im Deutschkurs. Du hast einen Arzttermin. Am Mittwoch kommst du wieder. Entschuldige dein Fehlen und verabschiede dich höflich.',criteria:[
   {label:'Montag und Dienstag fehlen',patterns:['montag und dienstag','am montag und dienstag']},{label:'Arzttermin',patterns:['termin beim arzt','arzttermin','termin bei der arztin','termin bei der ärztin']},{label:'Mittwoch wiederkommen',patterns:['mittwoch komme ich wieder','am mittwoch komme ich wieder']},{label:'Entschuldigung',patterns:['entschuldigen sie','entschuldigung','tut mir leid']},{label:'Gruß',patterns:['viele grusse','viele grüße','freundliche grusse','freundliche grüße']}],model:'Guten Morgen,\nich kann am Montag und Dienstag nicht zum Deutschkurs kommen. Ich habe einen Termin beim Arzt. Am Mittwoch komme ich wieder. Entschuldigen Sie bitte mein Fehlen.\nViele Grüße\nElena Marin'}
 ];

 const criteria22=[
  {title:'Situation 1 · krankes Kind',scenario:'Melde dein krankes Kind telefonisch oder schriftlich von der Schule ab.',criteria:[{label:'Begrüßung',patterns:['guten morgen','hallo']},{label:'Name',patterns:['hier spricht','ich heisse','ich heiße']},{label:'Kind',patterns:['mein sohn','meine tochter','mein kind']},{label:'kann nicht kommen',patterns:['nicht zur schule kommen','heute nicht kommen']},{label:'Grund krank',patterns:['ist krank','fieber','arzt']},{label:'Abschluss',patterns:['auf wiederhoren','auf wiederhören','vielen dank']}],model:'Guten Morgen, hier spricht Hassan Ali. Meine Tochter Sara geht in die Klasse 3a. Sie kann heute nicht zur Schule kommen. Sie ist krank. Vielen Dank. Auf Wiederhören.'},
  {title:'Situation 2 · selbst im Deutschkurs fehlen',scenario:'Melde dich selbst vom Deutschkurs ab.',criteria:[{label:'Begrüßung',patterns:['guten morgen','hallo']},{label:'Name',patterns:['hier spricht','ich heisse','ich heiße']},{label:'Deutschkurs',patterns:['deutschkurs']},{label:'nicht kommen',patterns:['nicht kommen','nicht zum deutschkurs']},{label:'Grund',patterns:['krank','arzt']},{label:'Abschluss',patterns:['vielen dank','auf wiederhoren','auf wiederhören','viele grusse','viele grüße']}],model:'Guten Morgen, hier spricht Omar Hassan. Ich kann heute nicht zum Deutschkurs kommen. Ich bin krank. Vielen Dank für die Information. Auf Wiederhören.'},
  {title:'Situation 3 · Ausflug',scenario:'Dein Kind kann beim Ausflug nicht mitkommen.',criteria:[{label:'Begrüßung',patterns:['guten morgen','hallo']},{label:'Kind nennen',patterns:['mein sohn','meine tochter','mein kind']},{label:'Ausflug',patterns:['ausflug']},{label:'nicht mitkommen',patterns:['nicht mitkommen','kann nicht mitkommen']},{label:'Grund',patterns:['krank','arzt']},{label:'Abschluss',patterns:['vielen dank','auf wiederhoren','auf wiederhören']}],model:'Guten Morgen. Mein Sohn Karim kann am Freitag beim Ausflug nicht mitkommen. Er ist krank. Vielen Dank. Auf Wiederhören.'},
  {title:'Situation 4 · Uhrzeit und Treffpunkt',scenario:'Frage nach Treffzeit, Treffpunkt und Abfahrt eines Ausflugs.',criteria:[{label:'Begrüßung',patterns:['guten morgen','hallo']},{label:'Treffzeit fragen',patterns:['wann ist der treffpunkt','wann treffen']},{label:'Treffpunkt fragen',patterns:['wo ist der treffpunkt','wo treffen']},{label:'Abfahrt fragen',patterns:['wann fahrt','wann fährt','wann geht es los']},{label:'Dank',patterns:['vielen dank','danke']}],model:'Guten Morgen. Ich habe eine Frage zum Ausflug. Wann ist der Treffpunkt? Wo treffen sich die Kinder? Wann fährt der Bus los? Vielen Dank.'},
  {title:'Situation 5 · Sekretariat reagiert',scenario:'Du arbeitest im Sekretariat. Reagiere auf eine Krankmeldung.',criteria:[{label:'höfliche Reaktion',patterns:['tut mir leid','schade']},{label:'Bescheid sagen',patterns:['bescheid']},{label:'Gute Besserung',patterns:['gute besserung']},{label:'Verabschiedung',patterns:['auf wiederhoren','auf wiederhören'] }],model:'Das tut mir leid. Ich sage der Lehrerin Bescheid. Gute Besserung für Ihre Tochter. Auf Wiederhören.'}
 ];

 const oldOrder=pick(old,'redemittel-ordnen');
 const oldPhoneCloze=pick(old,'telefonluecken');
 const oldMeeting=pick(old,'dialog-treffpunkt');
 const rebuilt=[
  cards,
  {id:'artikel',title:'Artikel und Plural zum Bild',description:'Sieh das Bild an. Schreibe den richtigen Artikel und den Plural.',icon:'🔤',kind:'article-plural',items:articleItems},
  {id:'wort-bedeutung',title:'Wort und Bedeutung',description:'Wähle die passende Bedeutung. Wiederhole auch Wörter aus Thema 1–3.',icon:'💡',kind:'choice',items:meaningItems},
  oldOrder,
  oldPhoneCloze,
  {id:'krankmeldung-lueckentext',title:'Krankmeldung im Kontext',description:'Ergänze die E-Mail und die Dialoge mit passenden Redemitteln.',icon:'📝',kind:'multi-cloze',items:clozeItems},
  {id:'lesen-richtig-falsch',title:'Lesen: 10 Texte',description:'Lies 10 kurze A1-Texte. Beantworte zu jedem Text mehrere Fragen.',icon:'📖',kind:'reading-pack',items:readings},
  {id:'rechtschreibung',title:'Rechtschreibung im Kontext',description:'Finde den Rechtschreibfehler. Die Sätze wiederholen Wörter aus Thema 1–4.',icon:'✍️',kind:'input',items:spellingItems},
  {id:'hoeren-sekretariat',title:'Hören: Krankmeldung im Sekretariat',description:'Höre einen Dialog und beantworte drei unterschiedliche A1-Fragen.',icon:'🎧',kind:'choice',items:listenItems},
  {id:'hoerdialog-ordnen',title:'Dialoge: Krankmelden',description:'Lies echte Dialoge im Gesprächs-Layout und wähle jeweils die passende fehlende Äußerung.',icon:'💬',kind:'dialog-bubbles',items:dialogItems},
  {id:'telefonat-sprechen',title:'Krankmeldung Schritt für Schritt',description:'Baue ein vollständiges Telefonat Schritt für Schritt auf. Jede Äußerung wird kontrolliert.',icon:'☎️',kind:'input',items:guidedPhone},
  oldMeeting,
  {id:'nachricht-deutschkurs',title:'Nachricht an den Deutschkurs',description:'Schreibe eine kurze Nachricht. Alle Pflichtinformationen werden kontrolliert.',icon:'💌',kind:'criteria-write',items:criteria20},
  {id:'eigener-dialog',title:'Eigener Dialog',description:'Wähle eine Situation und schreibe einen vollständigen A1-Dialog. Die Pflichtteile werden kontrolliert.',icon:'🗣️',kind:'criteria-write',items:criteria22},
  exam
 ].filter(Boolean);
 theme.tasks=rebuilt;
 theme.contentRevision='l7t4-restructure-20260819-v1';
 window.L7_THEME=theme;
 return theme;
});
})();