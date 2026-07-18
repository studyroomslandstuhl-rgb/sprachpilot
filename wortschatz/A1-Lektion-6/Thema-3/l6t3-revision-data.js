(function(){
'use strict';
const SUB='Subjekt';
const OBJ='Aktion auf Objekt';
const SEIN='keine Aktion auf Objekt';

const compoundArticle=[
['Wohnung','Zimmer','das','Wohnzimmer'],['schlafen','Zimmer','das','Schlafzimmer'],['Bad','Zimmer','das','Badezimmer'],['Kinder','Zimmer','das','Kinderzimmer'],['Küche','Tisch','der','Küchentisch'],['schreiben','Tisch','der','Schreibtisch'],['Kleider','Schrank','der','Kleiderschrank'],['kühlen','Schrank','der','Kühlschrank'],['Haus','Tür','die','Haustür'],['Wohnung','Tür','die','Wohnungstür'],['Zimmer','Tür','die','Zimmertür'],['Bücher','Regal','das','Bücherregal'],['Wand','Lampe','die','Wandlampe'],['stehen','Lampe','die','Stehlampe'],['Teppich','Boden','der','Teppichboden'],['waschen','Maschine','die','Waschmaschine'],['Besichtigung','Termin','der','Besichtigungstermin'],['Deutsch','Kurs','der','Deutschkurs']
].map((x,i)=>({id:'ca'+(i+1),left:x[0],right:x[1],article:x[2],word:x[3],full:x[2]+' '+x[3]}));

const compoundBuild=[
['Apfel','Saft','der','Apfelsaft','apfel.webp','saft.webp'],['Orange','Saft','der','Orangensaft','orange.webp','saft.webp'],['Tomate','Salat','der','Tomatensalat','tomate.webp','salat.webp'],['Kartoffel','Salat','der','Kartoffelsalat','kartoffel.webp','salat.webp'],['Käse','Brot','das','Käsebrot','kaese.webp','brot.webp'],['Schinken','Brot','das','Schinkenbrot','schinken.webp','brot.webp'],['Frühstück','Tisch','der','Frühstückstisch','fruehstueck.webp','tisch.webp'],['essen','Tisch','der','Esstisch','essen.webp','tisch.webp'],['Garten','Stuhl','der','Gartenstuhl','garten.webp','stuhl.webp'],['Küche','Schrank','der','Küchenschrank','kueche.webp','schrank.webp'],['Bad','Wanne','die','Badewanne','bad.webp','badewanne.webp'],['waschen','Becken','das','Waschbecken','waschen.webp','waschbecken.webp'],['Elektro','Gerät','das','Elektrogerät','strom.webp','elektrogeraet.webp'],['Werk','Tag','der','Werktag','arbeit.webp','tag.webp'],['Sprache','Kurs','der','Sprachkurs','sprache.webp','kurs.webp'],['Kurs','Raum','der','Kursraum','kurs.webp','raum.webp'],['Wohnung','Suche','die','Wohnungssuche','wohnung.webp','suchen.webp'],['Einkauf','Liste','die','Einkaufsliste','einkaufen.webp','liste.webp']
].map((x,i)=>({id:'cb'+(i+1),left:x[0],right:x[1],article:x[2],word:x[3],full:x[2]+' '+x[3],leftImage:x[4],rightImage:x[5]}));

const svoRaw=[
['Am Samstag',null,'bringt','verb','Anna','sub','einen Salat','obj','mit','verb'],
['Heute',null,'kauft','verb','Familie Klein','sub','den Kühlschrank','obj'],
['Im Wohnzimmer',null,'stellt','verb','Tom','sub','den Tisch','obj','auf','verb'],
['Die Lehrerin','sub','lädt','verb','den Teilnehmer','obj','ein','verb'],
['Nach dem Kurs',null,'holt','verb','Mila','sub','die Einladung','obj','ab','verb'],
['Der Mann','sub','liest','verb','die Speisekarte','obj'],
['Sara','sub','schreibt','verb','heute',null,'eine Nachricht','obj'],
['Die Mutter','sub','macht','verb','das Fenster','obj','auf','verb'],
['Anna','sub','sucht','verb','den Teppich','obj','im Flur',null],
['Der Deutschkurs','sub','plant','verb','einen Ausflug','obj'],
['Der Kellner','sub','bringt','verb','das Getränk','obj'],
['Bogdan','sub','kauft','verb','die Äpfel','obj','ein','verb'],
['Die Studentin','sub','schreibt','verb','eine Einladung','obj'],
['Die Familie','sub','sagt','verb','den Besichtigungstermin','obj','ab','verb'],
['Nina','sub','räumt','verb','die Küche','obj','auf','verb'],
['Der Vater','sub','macht','verb','die Lampe','obj','an','verb'],
['Leo','sub','bereitet','verb','das Picknick','obj','vor','verb'],
['Der Schüler','sub','nimmt','verb','den Bus','obj'],
['Die Lehrerin','sub','schreibt','verb','am Montag',null,'eine Nachricht','obj'],
['Mila','sub','sucht','verb','die Wohnungstür','obj']
];
const svoItems=svoRaw.map((row,i)=>{
 const segments=[];
 for(let n=0;n<row.length;n+=2)segments.push({text:row[n],role:row[n+1]});
 return{id:'s'+String(i+1).padStart(2,'0'),segments,sentence:segments.map(x=>x.text).join(' ')+'.'};
});

const nomAkkItems=[
['Am Samstag bringt Anna einen Salat mit.','Anna','Nominativ',SUB],
['Am Samstag bringt Anna einen Salat mit.','einen Salat','Akkusativ',OBJ],
['Heute kauft Familie Klein den Kühlschrank.','Familie Klein','Nominativ',SUB],
['Heute kauft Familie Klein den Kühlschrank.','den Kühlschrank','Akkusativ',OBJ],
['Die Lehrerin lädt den Teilnehmer ein.','Die Lehrerin','Nominativ',SUB],
['Die Lehrerin lädt den Teilnehmer ein.','den Teilnehmer','Akkusativ',OBJ],
['Mila holt die Einladung ab.','Mila','Nominativ',SUB],
['Mila holt die Einladung ab.','die Einladung','Akkusativ',OBJ],
['Der Mann liest die Speisekarte.','Der Mann','Nominativ',SUB],
['Der Mann liest die Speisekarte.','die Speisekarte','Akkusativ',OBJ],
['Der Deutschkurs plant einen Ausflug.','Der Deutschkurs','Nominativ',SUB],
['Der Deutschkurs plant einen Ausflug.','einen Ausflug','Akkusativ',OBJ],
['Bogdan kauft die Äpfel ein.','Bogdan','Nominativ',SUB],
['Bogdan kauft die Äpfel ein.','die Äpfel','Akkusativ',OBJ],
['Die Familie sagt den Besichtigungstermin ab.','Die Familie','Nominativ',SUB],
['Die Familie sagt den Besichtigungstermin ab.','den Besichtigungstermin','Akkusativ',OBJ],
['Das Sofa ist bequem.','Das Sofa','Nominativ',SEIN],
['Die Einladung ist wichtig.','Die Einladung','Nominativ',SEIN],
['Die Lehrerin schreibt eine Nachricht.','die Lehrerin','Nominativ',SUB],
['Die Lehrerin schreibt eine Nachricht.','eine Nachricht','Akkusativ',OBJ]
].map((x,i)=>({id:'n'+String(i+1).padStart(2,'0'),sentence:x[0],target:x[1],case:x[2],reason:x[3]}));

const definiteItems=[
['Anna nimmt ___ Apfel auf dem Tisch.','den','Akkusativ',OBJ,'Anna nimmt den Apfel auf dem Tisch.'],
['___ Kühlschrank in unserer Küche ist neu.','der','Nominativ',SUB,'Der Kühlschrank in unserer Küche ist neu.'],
['Tom öffnet ___ Wohnungstür.','die','Akkusativ',OBJ,'Tom öffnet die Wohnungstür.'],
['___ Wohnzimmer ist groß und modern.','das','Nominativ',SUB,'Das Wohnzimmer ist groß und modern.'],
['Sara liest ___ Nachricht von der Lehrerin.','die','Akkusativ',OBJ,'Sara liest die Nachricht von der Lehrerin.'],
['___ Besichtigungstermin ist am Freitag.','der','Nominativ',SUB,'Der Besichtigungstermin ist am Freitag.'],
['Leo bringt ___ Käsebrot für Mila mit.','das','Akkusativ',OBJ,'Leo bringt das Käsebrot für Mila mit.'],
['___ Lampe neben dem Bett ist an.','die','Nominativ',SUB,'Die Lampe neben dem Bett ist an.'],
['Nina öffnet ___ Schrank in der Küche.','den','Akkusativ',OBJ,'Nina öffnet den Schrank in der Küche.'],
['___ Getränk auf dem Tisch ist kalt.','das','Nominativ',SUB,'Das Getränk auf dem Tisch ist kalt.'],
['Der Kellner bringt ___ Speisekarte.','die','Akkusativ',OBJ,'Der Kellner bringt die Speisekarte.'],
['___ Deutschkurs macht einen Ausflug.','der','Nominativ',SUB,'Der Deutschkurs macht einen Ausflug.'],
['Mila macht ___ Fenster im Schlafzimmer zu.','das','Akkusativ',OBJ,'Mila macht das Fenster im Schlafzimmer zu.'],
['___ Teppich im Wohnzimmer ist rot.','der','Nominativ',SUB,'Der Teppich im Wohnzimmer ist rot.'],
['Anna lädt ___ Teilnehmerin aus ihrem Kurs ein.','die','Akkusativ',OBJ,'Anna lädt die Teilnehmerin aus ihrem Kurs ein.'],
['___ Einladung liegt auf dem Küchentisch.','die','Nominativ',SUB,'Die Einladung liegt auf dem Küchentisch.'],
['Bogdan kauft ___ Käse auf der Einkaufsliste.','den','Akkusativ',OBJ,'Bogdan kauft den Käse auf der Einkaufsliste.'],
['___ Sofa im Wohnzimmer ist bequem.','das','Nominativ',SUB,'Das Sofa im Wohnzimmer ist bequem.'],
['Die Mutter putzt ___ Badezimmer.','das','Akkusativ',OBJ,'Die Mutter putzt das Badezimmer.'],
['___ Party beginnt um 19 Uhr.','die','Nominativ',SUB,'Die Party beginnt um 19 Uhr.']
].map((x,i)=>({id:'d'+String(i+1).padStart(2,'0'),q:x[0],answer:x[1],case:x[2],reason:x[3],solution:x[4]}));

const indefiniteItems=[
['Anna kauft ___ Apfel für das Picknick.','einen','Akkusativ',OBJ,'Anna kauft einen Apfel für das Picknick.'],
['In der Wohnung steht ___ Kühlschrank.','ein','Nominativ',SUB,'In der Wohnung steht ein Kühlschrank.'],
['Das Haus hat ___ Wohnungstür aus Holz.','eine','Akkusativ',OBJ,'Das Haus hat eine Wohnungstür aus Holz.'],
['Familie Klein hat ___ Wohnzimmer und zwei Schlafzimmer.','ein','Akkusativ',OBJ,'Familie Klein hat ein Wohnzimmer und zwei Schlafzimmer.'],
['Sara schreibt ___ Nachricht an die Lehrerin.','eine','Akkusativ',OBJ,'Sara schreibt eine Nachricht an die Lehrerin.'],
['Ich brauche ___ Besichtigungstermin.','einen','Akkusativ',OBJ,'Ich brauche einen Besichtigungstermin.'],
['Leo macht ___ Käsebrot für die Pause.','ein','Akkusativ',OBJ,'Leo macht ein Käsebrot für die Pause.'],
['Neben dem Bett steht ___ Lampe.','eine','Nominativ',SUB,'Neben dem Bett steht eine Lampe.'],
['Für die Küche kaufen wir ___ Schrank.','einen','Akkusativ',OBJ,'Für die Küche kaufen wir einen Schrank.'],
['Am Imbiss kauft Tom ___ Getränk.','ein','Akkusativ',OBJ,'Am Imbiss kauft Tom ein Getränk.'],
['Der Kellner bringt uns ___ Speisekarte.','eine','Akkusativ',OBJ,'Der Kellner bringt uns eine Speisekarte.'],
['In Saarbrücken gibt es ___ Deutschkurs am Abend.','einen','Akkusativ',OBJ,'In Saarbrücken gibt es einen Deutschkurs am Abend.'],
['Mila öffnet ___ Fenster.','ein','Akkusativ',OBJ,'Mila öffnet ein Fenster.'],
['Im Flur liegt ___ Teppich.','ein','Nominativ',SUB,'Im Flur liegt ein Teppich.'],
['Anna lädt ___ Teilnehmerin zu ihrer Party ein.','eine','Akkusativ',OBJ,'Anna lädt eine Teilnehmerin zu ihrer Party ein.'],
['Ben schreibt ___ Einladung.','eine','Akkusativ',OBJ,'Ben schreibt eine Einladung.'],
['Bogdan kauft ___ Salat für das Frühstück.','einen','Akkusativ',OBJ,'Bogdan kauft einen Salat für das Frühstück.'],
['Im Wohnzimmer steht ___ Sofa.','ein','Nominativ',SUB,'Im Wohnzimmer steht ein Sofa.'],
['Die Wohnung hat ___ Badezimmer.','ein','Akkusativ',OBJ,'Die Wohnung hat ein Badezimmer.'],
['Am Samstag feiern wir ___ Party.','eine','Akkusativ',OBJ,'Am Samstag feiern wir eine Party.']
].map((x,i)=>({id:'i'+String(i+1).padStart(2,'0'),q:x[0],answer:x[1],case:x[2],reason:x[3],solution:x[4]}));

const possessiveItems=[
['Ich','Ich nehme ___ Apfel.','meinen',['mein','meinen','meine'],'Akkusativ',OBJ,'Ich nehme meinen Apfel.'],
['Ich','___ Kühlschrank steht in der Küche.','mein',['mein','meinen','meine'],'Nominativ',SUB,'Mein Kühlschrank steht in der Küche.'],
['Du','Du öffnest ___ Wohnungstür.','deine',['dein','deinen','deine'],'Akkusativ',OBJ,'Du öffnest deine Wohnungstür.'],
['Du','___ Wohnzimmer ist groß.','dein',['dein','deinen','deine'],'Nominativ',SUB,'Dein Wohnzimmer ist groß.'],
['Sie','Sie lesen ___ Nachricht.','Ihre',['Ihr','Ihren','Ihre'],'Akkusativ',OBJ,'Sie lesen Ihre Nachricht.'],
['Sie','___ Besichtigungstermin ist um 15 Uhr.','Ihr',['Ihr','Ihren','Ihre'],'Nominativ',SUB,'Ihr Besichtigungstermin ist um 15 Uhr.'],
['Ich','Ich bringe ___ Käsebrot mit.','mein',['mein','meinen','meine'],'Akkusativ',OBJ,'Ich bringe mein Käsebrot mit.'],
['Du','___ Lampe steht neben dem Bett.','deine',['dein','deinen','deine'],'Nominativ',SUB,'Deine Lampe steht neben dem Bett.'],
['Sie','Sie öffnen ___ Schrank.','Ihren',['Ihr','Ihren','Ihre'],'Akkusativ',OBJ,'Sie öffnen Ihren Schrank.'],
['Ich','___ Getränk steht auf dem Tisch.','mein',['mein','meinen','meine'],'Nominativ',SUB,'Mein Getränk steht auf dem Tisch.'],
['Du','Du liest ___ Speisekarte.','deine',['dein','deinen','deine'],'Akkusativ',OBJ,'Du liest deine Speisekarte.'],
['Sie','___ Deutschkurs macht einen Ausflug.','Ihr',['Ihr','Ihren','Ihre'],'Nominativ',SUB,'Ihr Deutschkurs macht einen Ausflug.'],
['Ich','Ich mache ___ Fenster zu.','mein',['mein','meinen','meine'],'Akkusativ',OBJ,'Ich mache mein Fenster zu.'],
['Du','___ Teppich liegt im Wohnzimmer.','dein',['dein','deinen','deine'],'Nominativ',SUB,'Dein Teppich liegt im Wohnzimmer.'],
['Sie','Sie laden ___ Teilnehmerin ein.','Ihre',['Ihr','Ihren','Ihre'],'Akkusativ',OBJ,'Sie laden Ihre Teilnehmerin ein.'],
['Ich','___ Einladung liegt auf dem Tisch.','meine',['mein','meinen','meine'],'Nominativ',SUB,'Meine Einladung liegt auf dem Tisch.'],
['Du','Du kaufst ___ Salat.','deinen',['dein','deinen','deine'],'Akkusativ',OBJ,'Du kaufst deinen Salat.'],
['Sie','___ Sofa steht im Wohnzimmer.','Ihr',['Ihr','Ihren','Ihre'],'Nominativ',SUB,'Ihr Sofa steht im Wohnzimmer.'],
['Ich','Ich putze ___ Badezimmer.','mein',['mein','meinen','meine'],'Akkusativ',OBJ,'Ich putze mein Badezimmer.'],
['Du','___ Party beginnt um 19 Uhr.','deine',['dein','deinen','deine'],'Nominativ',SUB,'Deine Party beginnt um 19 Uhr.']
].map((x,i)=>({id:'p'+String(i+1).padStart(2,'0'),owner:x[0],q:x[1],answer:x[2],options:x[3],case:x[4],reason:x[5],solution:x[6]}));

const imageDialogs=[
['salat.webp',['Mila: Was bringst du zum Picknick mit?','Ben: Ich bringe Brot und Käse mit.','Mila: Hast du auch etwas Frisches dabei?','Ben: Ja, ich bringe auch ___ mit.'],'einen Salat','unbestimmter Artikel','Akkusativ',OBJ],
['einladung.webp',['Sara: Anna macht am Freitag eine Party.','Tom: Woher weißt du das?','Sara: Sie hat uns geschrieben.','Tom: Ach so, du liest gerade ___.'],'die Einladung','bestimmter Artikel','Akkusativ',OBJ],
['ausflug.webp',['Lea: Was macht der Deutschkurs am Sonntag?','Amir: Wir fahren zusammen in den Park.','Lea: Schön! Dann plant der Kurs ___.'],'einen Ausflug','unbestimmter Artikel','Akkusativ',OBJ],
['speisekarte.webp',['Nina: Weißt du schon, was du bestellst?','Leo: Noch nicht.','Nina: Dann schau zuerst hier.','Leo: Ja, ich lese erst ___.'],'die Speisekarte','bestimmter Artikel','Akkusativ',OBJ],
['cola.webp',['Ben: Wir haben Hamburger und Pommes.','Mila: Aber wir brauchen noch Getränke.','Ben: Was kaufst du?','Mila: Ich kaufe ___.'],'eine Cola','unbestimmter Artikel','Akkusativ',OBJ],
['kuehlschrank.webp',['Tom: Was ist neu in eurer Küche?','Sara: Dort steht ein großes Gerät für Lebensmittel.','Tom: Ach so, das ist ___.'],'der Kühlschrank','bestimmter Artikel','Nominativ',SUB],
['lampe.webp',['Lea: Im Schlafzimmer ist es dunkel.','Amir: Neben dem Bett steht doch ___.','Lea: Stimmt. Mach sie bitte an.'],'eine Lampe','unbestimmter Artikel','Nominativ',SUB],
['teppich.webp',['Nina: Das Wohnzimmer wirkt noch leer.','Leo: Wir können etwas auf den Boden legen.','Nina: Gute Idee. Dort passt ___.'],'ein Teppich','unbestimmter Artikel','Nominativ',SUB],
['hamburger.webp',['Ben: Was nimmst du im Restaurant?','Mila: Heute möchte ich keinen Salat.','Ben: Und was bestellst du dann?','Mila: Ich nehme ___.'],'einen Hamburger','unbestimmter Artikel','Akkusativ',OBJ],
['getraenk.webp',['Sara: Was bestellst du, Tom?','Tom: Ich bestelle ___.','Sara: Gut, ich habe auch Durst.'],'ein Getränk','unbestimmter Artikel','Akkusativ',OBJ],
['fenster.webp',['Lea: Hier ist es sehr warm.','Amir: Soll ich etwas aufmachen?','Lea: Ja, bitte.','Amir: Ich mache ___ auf.'],'das Fenster','bestimmter Artikel','Akkusativ',OBJ],
['schrank.webp',['Nina: Wo sind die Teller?','Leo: Sie sind in der Küche.','Nina: Welchen Schrank öffnest du?','Leo: Ich öffne ___.'],'den Küchenschrank','bestimmter Artikel','Akkusativ',OBJ],
['termin.webp',['Ben: Kommst du am Freitag pünktlich zur Party?','Mila: Leider nicht. Ich habe vorher ___.','Ben: Kein Problem, dann kommst du später.'],'einen Besichtigungstermin','unbestimmter Artikel','Akkusativ',OBJ],
['brot.webp',['Sara: Können wir schon frühstücken?','Tom: Ja, auf dem Tisch liegt ___.','Sara: Prima, dann hole ich den Käse.'],'das Brot','bestimmter Artikel','Nominativ',SUB],
['kaese.webp',['Lea: Was kaufst du für das Picknick?','Amir: Ich kaufe Brot und ___.','Lea: Gut, ich bringe die Getränke mit.'],'Käse','kein Artikel','Akkusativ',OBJ],
['stuhl.webp',['Nina: Acht Gäste kommen, aber wir haben nur sechs Plätze.','Leo: Dann brauchen wir noch ___.','Nina: Stimmt, ich hole zwei aus der Küche.'],'Stühle','kein Artikel','Akkusativ',OBJ],
['party.webp',['Ben: Warum steht hier Musik und Essen bereit?','Mila: Anna lädt heute den ganzen Kurs ein.','Ben: Ach so, dann ist heute ___.'],'die Party','bestimmter Artikel','Nominativ',SUB],
['wohnung.webp',['Sara: Warum liest Familie Klein so viele Anzeigen?','Tom: Sie möchte bald umziehen.','Sara: Dann sucht die Familie ___.'],'eine Wohnung','unbestimmter Artikel','Akkusativ',OBJ],
['nachricht.webp',['Lea: Die Lehrerin hat einen neuen Termin.','Amir: Wie sagt sie uns Bescheid?','Lea: Sie schreibt ___.'],'eine Nachricht','unbestimmter Artikel','Akkusativ',OBJ],
['picknick.webp',['Nina: Was macht der Kurs am Samstag im Park?','Leo: Wir essen zusammen und jeder bringt etwas mit.','Nina: Schön, dann macht der Kurs ___.'],'ein Picknick','unbestimmter Artikel','Akkusativ',OBJ]
].map((x,i)=>({id:'bd'+String(i+1).padStart(2,'0'),image:x[0],dialog:x[1],answer:x[2],articleType:x[3],case:x[4],reason:x[5]}));

function chat(id,title,audio,messages,qs){
 return{id,title,audio,messages:messages.map(x=>({side:x[0],name:x[1],text:x[2]})),qs};
}
const chatDialogs=[
chat('cd01','Picknick im Park','a1-l6-t3-dialog-01.mp3',[
['right','Mila','Hallo Ben, hast du am Samstag Zeit?'],
['left','Ben','Ja. Was möchtest du machen?'],
['right','Mila','Wir machen ein Picknick im Park. Ich kaufe Brot und Getränke.'],
['left','Ben','Prima. Dann bringe ich einen Salat und Käsebrot mit.'],
['right','Mila','Super, dann ist alles fertig.']
],[['Ben findet ein Picknick langweilig.',false],['Ben bringt einen Salat mit.',true],['Mila kauft die Getränke.',true]]),
chat('cd02','Party am Freitag','a1-l6-t3-dialog-02.mp3',[
['right','Sara','Tom, kommst du am Freitag zu Leas Party?'],
['left','Tom','Ich komme später. Ich habe zuerst einen Besichtigungstermin.'],
['right','Sara','Die Party beginnt um 19 Uhr. Was bringst du mit?'],
['left','Tom','Ich bringe Pommes mit. Kannst du Lea Bescheid sagen?'],
['right','Sara','Na klar, ich schreibe ihr sofort.']
],[['Tom hat am Freitag einen Termin.',true],['Die Party beginnt am Morgen.',false],['Tom bringt Pommes mit.',true]]),
chat('cd03','Ausflug mit dem Kurs','a1-l6-t3-dialog-03.mp3',[
['right','Nina','Amir, kommst du am Sonntag mit zum Ausflug?'],
['left','Amir','Ja, gern. Wohin fahren wir?'],
['right','Nina','Zuerst fahren wir mit dem Bus in den Park. Dann machen wir ein Picknick.'],
['left','Amir','Das klingt gut. Ich bringe Brot und Käse mit.'],
['right','Nina','Prima. Ich kaufe die Getränke.']
],[['Der Kurs fährt mit dem Bus.',true],['Amir bringt Getränke mit.',false],['Nach der Fahrt macht der Kurs ein Picknick.',true]]),
chat('cd04','Im Restaurant','a1-l6-t3-dialog-04.mp3',[
['right','Leo','Mila, weißt du schon, was du nimmst?'],
['left','Mila','Ja. Ich nehme Pommes und eine Cola. Und du?'],
['right','Leo','Ich lese noch die Speisekarte.'],
['left','Mila','Nimmst du einen Salat?'],
['right','Leo','Ja, zuerst einen Salat und danach einen Hamburger.']
],[['Leo liest die Speisekarte.',true],['Mila nimmt einen Hamburger.',false],['Leo nimmt zuerst einen Salat.',true]]),
chat('cd05','Einladung schreiben','a1-l6-t3-dialog-05.mp3',[
['right','Anna','Ben, kannst du mir kurz helfen? Ich schreibe die Einladung für die Party.'],
['left','Ben','Gern. Welche Adresse soll ich schreiben?'],
['right','Anna','Die neue Adresse steht in meinem Profil.'],
['left','Ben','Gut. Wen lädst du ein?'],
['right','Anna','Ich lade den ganzen Deutschkurs ein.']
],[['Anna schreibt eine Einladung.',true],['Ben kennt die Adresse schon.',false],['Anna lädt nur Ben ein.',false]]),
chat('cd06','Einkauf für Samstag','a1-l6-t3-dialog-06.mp3',[
['right','Sara','Tom, was brauchen wir für Samstag?'],
['left','Tom','Wir brauchen Brot, Käse und einen Salat.'],
['right','Sara','Ich kaufe Brot und Käse. Kannst du den Salat mitbringen?'],
['left','Tom','Ja, und ich bringe auch Ketchup mit.'],
['right','Sara','Perfekt. Dann ist die Einkaufsliste fertig.']
],[['Sara kauft Brot und Käse.',true],['Tom bringt Ketchup mit.',true],['Sie planen für Sonntag.',false]])
];

const messageThreads=[
chat('cm01','Treffen vor dem Ausflug','',[
['left','Mila','Hallo Amir, treffen wir uns morgen vor dem Ausflug am Bahnhof?'],
['right','Amir','Ja. Der Ausflug beginnt um 9 Uhr. Ich bin schon um 8:45 Uhr da.'],
['left','Mila','Gut. Ich bringe die Einladung und die Fahrkarten mit.'],
['right','Amir','Prima. Soll ich Getränke kaufen?'],
['left','Mila','Ja, bitte Wasser und Apfelsaft.']
],[['Der Ausflug beginnt um 9 Uhr.',true],['Amir kauft die Fahrkarten.',false],['Mila bringt die Einladung mit.',true]]),
chat('cm02','Party in der neuen Wohnung','',[
['left','Lea','Endlich ist unsere neue Wohnung fertig. Kommst du am Samstag zur Party?'],
['right','Tom','Na klar. Wie ist die Adresse?'],
['left','Lea','Gartenstraße 12. Die Adresse steht auch in der Einladung.'],
['right','Tom','Gut. Soll ich etwas mitbringen?'],
['left','Lea','Ja, bitte einen Kartoffelsalat.']
],[['Die Party ist am Samstag.',true],['Die Wohnung ist in der Bahnhofstraße.',false],['Tom bringt einen Kartoffelsalat mit.',true]]),
chat('cm03','Termin und Kurs','',[
['left','Nina','Mein Besichtigungstermin ist am Montag um 10 Uhr.'],
['right','Sara','Aber unser Deutschkurs beginnt auch um 10 Uhr.'],
['left','Nina','Stimmt. Dann sage ich den Termin sofort ab.'],
['right','Sara','Gut. Gehen wir danach zusammen zum Kurs?'],
['left','Nina','Ja, gern.']
],[['Der Termin und der Kurs beginnen gleichzeitig.',true],['Nina sagt den Kurs ab.',false],['Sara und Nina gehen zusammen zum Kurs.',true]]),
chat('cm04','Einkauf im Supermarkt','',[
['left','Ben','Ich bin gerade im Supermarkt. Was brauchen wir für das Picknick?'],
['right','Mila','Bitte Brot, Käse und Getränke.'],
['left','Ben','Brauchen wir auch einen Salat?'],
['right','Mila','Ja, und bitte Ketchup.'],
['left','Ben','Alles klar. Dann ist die Einkaufsliste fertig.']
],[['Ben ist im Supermarkt.',true],['Mila kauft den Salat.',false],['Ketchup steht zusätzlich auf der Liste.',true]]),
chat('cm05','Nachricht an den Kurs','',[
['left','Lehrerin Eva','Hallo zusammen, unser Ausflug ist am Freitag.'],
['right','Omar','Wohin fahren wir?'],
['left','Lehrerin Eva','Zuerst fahren wir in die Stadt. Danach besuchen wir die Bibliothek.'],
['right','Omar','Wann treffen wir uns?'],
['left','Lehrerin Eva','Um 8:30 Uhr vor der Schule.']
],[['Der Ausflug ist am Freitag.',true],['Der Kurs besucht zuerst die Bibliothek.',false],['Omar fragt nach der Uhrzeit.',true]]),
chat('cm06','Restaurant am Abend','',[
['left','Anna','Ich bin schon im Restaurant. Kommst du gleich?'],
['right','Leo','Ja, in zehn Minuten. Was nimmst du?'],
['left','Anna','Ich nehme einen Hamburger und eine Cola.'],
['right','Leo','Gut. Kannst du mir eine Speisekarte geben?'],
['left','Anna','Na klar. Ich warte auf dich.']
],[['Anna ist im Restaurant.',true],['Anna nimmt einen Salat.',false],['Leo kommt später.',true]])
];

const sentencePrompts=[
['du','nehmen','nehmen.webp','der Kaffee','kaffee.webp','?','Nimmst du den Kaffee?'],
['Anna','kaufen','einkaufen.webp','die Cola','cola.webp','.','Anna kauft die Cola.'],
['Tom','essen','essen.webp','der Hamburger','hamburger.webp','?','Isst Tom den Hamburger?'],
['Mila','mitbringen','mitbringen.webp','ein Salat','salat.webp','.','Mila bringt einen Salat mit.'],
['du','lesen','lesen.webp','die Speisekarte','speisekarte.webp','?','Liest du die Speisekarte?'],
['wir','planen','ausflug.webp','ein Ausflug','ausflug.webp','.','Wir planen einen Ausflug.'],
['Sara','einladen','einladen.webp','ihre Freunde','freunde.webp','?','Lädt Sara ihre Freunde ein?'],
['Leo','schreiben','schreiben.webp','eine Einladung','einladung.webp','.','Leo schreibt eine Einladung.'],
['Ben','trinken','trinken.webp','das Getränk','getraenk.webp','?','Trinkt Ben das Getränk?'],
['die Mutter','aufmachen','fenster.webp','das Fenster','fenster.webp','.','Die Mutter macht das Fenster auf.'],
['Nina','aufräumen','aufraeumen.webp','die Küche','kueche.webp','.','Nina räumt die Küche auf.'],
['ihr','kaufen','einkaufen.webp','das Käsebrot','kaesebrot.webp','?','Kauft ihr das Käsebrot?'],
['Tom','mitbringen','mitbringen.webp','der Ketchup','ketchup.webp','.','Tom bringt den Ketchup mit.'],
['die Lehrerin','schreiben','schreiben.webp','eine Nachricht','nachricht.webp','.','Die Lehrerin schreibt eine Nachricht.'],
['du','öffnen','aufmachen.webp','der Schrank','schrank.webp','?','Öffnest du den Schrank?'],
['Anna','suchen','suchen.webp','die Wohnungstür','wohnungstuer.webp','.','Anna sucht die Wohnungstür.'],
['wir','vorbereiten','picknick.webp','das Picknick','picknick.webp','.','Wir bereiten das Picknick vor.'],
['der Kellner','bringen','mitbringen.webp','die Speisekarte','speisekarte.webp','.','Der Kellner bringt die Speisekarte.'],
['Mila','absagen','absagen.webp','der Termin','termin.webp','.','Mila sagt den Termin ab.'],
['du','bestellen','bestellen.webp','ein Getränk','getraenk.webp','?','Bestellst du ein Getränk?']
].map((x,i)=>({id:'sb'+String(i+1).padStart(2,'0'),subject:x[0],verb:x[1],verbImage:x[2],object:x[3],objectImage:x[4],punct:x[5],solution:x[6]}));

window.L6T3RevisionData={
 reasons:{sub:SUB,obj:OBJ,sein:SEIN},
 compoundArticle,compoundBuild,svoItems,nomAkkItems,definiteItems,indefiniteItems,possessiveItems,imageDialogs,chatDialogs,messageThreads,sentencePrompts
};
})();