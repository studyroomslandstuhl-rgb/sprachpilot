(function(){
'use strict';
if(window.__SP_L8_PEDAGOGY_QUALITY_V1)return;
window.__SP_L8_PEDAGOGY_QUALITY_V1=true;

const clone=v=>JSON.parse(JSON.stringify(v));
const C=(type,prompt,options,answer,context='',hint='')=>({type,prompt,options,answer,context,hint});
const I=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const O=(prompt,text,context='',hint='')=>({type:'order',prompt,tokens:text.replace(/[?.!]$/,'').split(/\s+/),answer:[text.replace(/[?.!]$/,''),text],context,hint});
const F=(prompt,starter='',min=2,context='')=>({type:'free',prompt,starter,min,context});
const H=(audio,prompt,options,answer,hint='')=>({type:'choice',audio,prompt,options,answer,hint});

function examIndex(theme){const i=(theme.tasks||[]).findIndex(t=>t?.exam);return i<0?(theme.tasks||[]).length:i}
function practice(theme){return (theme.tasks||[]).filter(t=>!t?.exam)}
function ensure(theme,index,spec){
 const rows=practice(theme);let task=rows[index];
 if(!task){task={id:spec.id||`praxis-${theme.number||'x'}-${index}`,items:[]};theme.tasks.splice(examIndex(theme),0,task)}
 const keepId=task.id||spec.id;Object.assign(task,clone(spec));task.id=keepId||spec.id;task.items=clone(spec.items||[]);return task
}
function setMeta(task,{title,kind='choice',instruction,intro='',icon}){task.title=title;task.kind=kind;task.instruction=instruction;if(intro)task.intro=intro;else delete task.intro;if(icon){task.icon=icon;task.emoji=icon}}

const T2={
 biography:[
  C('choice','Wann hat Amir die Ausbildung gemacht?',['vor drei Jahren','seit drei Jahren','für drei Jahren'],'vor drei Jahren','Amir arbeitet heute als Koch. Seine Ausbildung hat er vor drei Jahren gemacht.','Perfekt + Zeitpunkt in der Vergangenheit → vor.'),
  C('choice','Wie lange arbeitet Lina schon im Café?',['seit zwei Jahren','vor zwei Jahren','für zwei Jahren'],'seit zwei Jahren','Lina arbeitet seit zwei Jahren in einem Café.','Etwas beginnt früher und dauert noch → seit.'),
  C('choice','Wie lange war das Praktikum?',['drei Monate','seit drei Monaten','vor drei Monaten'],'drei Monate','Das Praktikum war von April bis Juni. Es hat drei Monate gedauert.','Bei einer abgeschlossenen Dauer steht hier keine Präposition.'),
  C('choice','Welche Frage passt?',['Seit wann arbeitest du hier?','Wann arbeitest du hier?','Wie viel arbeitest du hier?'],'Seit wann arbeitest du hier?','Antwort: Seit Januar.','Die Antwort nennt den Beginn einer Situation, die noch dauert.'),
  C('choice','Welche Antwort passt?',['Vor einem Jahr.','Seit einem Jahr.','Für einem Jahr.'],'Vor einem Jahr.','Frage: Wann hast du deine Ausbildung beendet?','Perfekt + vergangener Zeitpunkt → vor.'),
  C('choice','Welche Antwort passt?',['Seit sechs Monaten.','Vor sechs Monaten.','Für sechs Monaten.'],'Seit sechs Monaten.','Frage: Wie lange arbeitest du schon bei der Firma?','Die Arbeit dauert noch an.'),
  C('choice','Was ist richtig?',['Ich habe vor zwei Jahren ein Praktikum gemacht.','Ich habe seit zwei Jahren ein Praktikum gemacht.','Ich habe für zwei Jahren ein Praktikum gemacht.'],'Ich habe vor zwei Jahren ein Praktikum gemacht.','','Das Praktikum ist abgeschlossen.'),
  C('choice','Was ist richtig?',['Ich arbeite seit Mai als Verkäuferin.','Ich arbeite vor Mai als Verkäuferin.','Ich arbeite seit Mai als Verkäuferin gearbeitet.'],'Ich arbeite seit Mai als Verkäuferin.','','Seit + Präsens: Die Situation dauert noch.')
 ],
 timeline:[
  O('Ordne den Satz.','Ich habe vor drei Jahren eine Ausbildung gemacht.'),
  O('Ordne den Satz.','Seit einem Jahr arbeite ich in einer Bäckerei.'),
  O('Ordne die Frage.','Seit wann arbeitest du bei der Firma?'),
  O('Ordne die Frage.','Wann hast du das Praktikum gemacht?'),
  O('Ordne den Satz.','Das Praktikum hat zwei Monate gedauert.'),
  O('Ordne den Satz.','Vor sechs Monaten habe ich eine Stelle gefunden.'),
  O('Ordne die Frage.','Wie lange arbeitest du schon als Koch?'),
  O('Ordne den Satz.','Seit Januar mache ich eine Ausbildung als Friseurin.')
 ],
 reading:[
  C('choice','Wer macht gerade eine Ausbildung?',['Marta','Omar','Lea'],'Marta','Marta, 22: Seit September mache ich eine Ausbildung als Bäckerin. Omar: Ich arbeite seit vier Jahren als Fahrer. Lea: Vor einem Jahr habe ich ein Praktikum im Hotel gemacht.'),
  C('choice','Wer hat ein Praktikum gemacht?',['Lea','Marta','Omar'],'Lea','Marta, 22: Seit September mache ich eine Ausbildung als Bäckerin. Omar: Ich arbeite seit vier Jahren als Fahrer. Lea: Vor einem Jahr habe ich ein Praktikum im Hotel gemacht.'),
  C('choice','Wie lange arbeitet Omar als Fahrer?',['seit vier Jahren','vor vier Jahren','vier Monate'],'seit vier Jahren','Omar: Ich arbeite seit vier Jahren als Fahrer.'),
  C('choice','Wann hat Lea das Praktikum gemacht?',['vor einem Jahr','seit einem Jahr','für ein Jahr'],'vor einem Jahr','Lea: Vor einem Jahr habe ich ein Praktikum im Hotel gemacht.'),
  C('choice','Was sucht Denis jetzt?',['eine Stelle','eine Schule','eine Wohnung'],'eine Stelle','Denis hat im Juni seine Ausbildung beendet. Jetzt sucht er eine Stelle als Mechatroniker.'),
  C('choice','Was hat Denis beendet?',['seine Ausbildung','seine Firma','sein Restaurant'],'seine Ausbildung','Denis hat im Juni seine Ausbildung beendet. Jetzt sucht er eine Stelle als Mechatroniker.'),
  C('choice','Was ist richtig?',['Marta lernt einen Beruf.','Marta ist seit vier Jahren Fahrerin.','Marta sucht eine Wohnung.'],'Marta lernt einen Beruf.','Marta macht eine Ausbildung als Bäckerin.'),
  C('choice','Was ist richtig?',['Leas Praktikum ist vorbei.','Lea macht das Praktikum seit heute.','Lea arbeitet seit vier Jahren als Fahrer.'],'Leas Praktikum ist vorbei.','Lea: Vor einem Jahr habe ich ein Praktikum im Hotel gemacht.')
 ],
 listening:[
  H('Ich heiße Elena. Vor zwei Jahren habe ich eine Ausbildung als Verkäuferin gemacht. Seit einem Jahr arbeite ich in einem Supermarkt.','Was hat Elena gemacht?',['eine Ausbildung','ein Studium','einen Deutschkurs'],'eine Ausbildung'),
  H('Ich heiße Elena. Vor zwei Jahren habe ich eine Ausbildung als Verkäuferin gemacht. Seit einem Jahr arbeite ich in einem Supermarkt.','Wie lange arbeitet Elena im Supermarkt?',['seit einem Jahr','vor einem Jahr','für ein Jahr'],'seit einem Jahr'),
  H('Mein Name ist Karim. Ich habe vor sechs Monaten ein Praktikum in einer Werkstatt gemacht. Jetzt suche ich eine Ausbildung als Mechatroniker.','Wo war Karims Praktikum?',['in einer Werkstatt','in einem Café','in einer Schule'],'in einer Werkstatt'),
  H('Mein Name ist Karim. Ich habe vor sechs Monaten ein Praktikum in einer Werkstatt gemacht. Jetzt suche ich eine Ausbildung als Mechatroniker.','Was sucht Karim jetzt?',['eine Ausbildung','eine Wohnung','einen Arzt'],'eine Ausbildung'),
  H('Ich bin Sofia. Seit März arbeite ich als Kellnerin. Meine Ausbildung habe ich vor drei Jahren gemacht.','Seit wann arbeitet Sofia als Kellnerin?',['seit März','vor März','für März'],'seit März'),
  H('Ich bin Sofia. Seit März arbeite ich als Kellnerin. Meine Ausbildung habe ich vor drei Jahren gemacht.','Wann hat Sofia ihre Ausbildung gemacht?',['vor drei Jahren','seit drei Jahren','drei Monate'],'vor drei Jahren'),
  H('Ich habe zwei Monate in einem Hotel gearbeitet. Das war ein Praktikum. Danach habe ich eine Stelle in einem Restaurant gefunden.','Wie lange dauerte das Praktikum?',['zwei Monate','seit zwei Monaten','vor zwei Monaten'],'zwei Monate'),
  H('Ich habe zwei Monate in einem Hotel gearbeitet. Das war ein Praktikum. Danach habe ich eine Stelle in einem Restaurant gefunden.','Was hat die Person danach gefunden?',['eine Stelle','eine Wohnung','eine Schule'],'eine Stelle')
 ],
 application:[
  C('choice','Welcher Satz passt in eine formelle Bewerbung?',['Sehr geehrte Frau Müller,','Hallo Müller!','Liebe Freundin,'],'Sehr geehrte Frau Müller,'),
  C('choice','Welcher Satz ist passend?',['Ich interessiere mich für die Stelle als Verkäuferin.','Ich will Job.','Gib mir die Stelle.'],'Ich interessiere mich für die Stelle als Verkäuferin.'),
  C('choice','Welcher Satz nennt Erfahrung?',['Ich habe ein Praktikum im Verkauf gemacht.','Ich wohne in der Bahnhofstraße.','Heute ist Montag.'],'Ich habe ein Praktikum im Verkauf gemacht.'),
  C('choice','Welcher Satz nennt die aktuelle Situation?',['Zurzeit mache ich eine Ausbildung.','Vor fünf Jahren war Dienstag.','Die Stelle kostet nichts.'],'Zurzeit mache ich eine Ausbildung.'),
  C('choice','Welcher Abschluss passt?',['Mit freundlichen Grüßen','Tschüss!','Bis später!'],'Mit freundlichen Grüßen'),
  C('choice','Was gehört in eine Bewerbung?',['Name und Kontakt','Lieblingsfarbe','Wetterbericht'],'Name und Kontakt'),
  C('choice','Welche Frage ist bei einem Telefonat passend?',['Ist die Stelle noch frei?','Wie alt ist Ihr Sofa?','Wo ist das Schwimmbad?'],'Ist die Stelle noch frei?'),
  C('choice','Welcher Satz ist höflich?',['Ich möchte mich gern bewerben.','Ich will diese Arbeit sofort.','Du gibst mir den Job.'],'Ich möchte mich gern bewerben.')
 ],
 mail:[
  O('Ordne die Anrede.','Sehr geehrte Frau Müller,'),
  O('Ordne den Satz.','Ich interessiere mich für die Stelle als Verkäuferin.'),
  O('Ordne den Satz.','Ich habe bereits ein Praktikum im Verkauf gemacht.'),
  O('Ordne den Satz.','Seit einem Jahr besuche ich einen Deutschkurs.'),
  O('Ordne den Satz.','Ich freue mich auf Ihre Antwort.'),
  O('Ordne den Gruß.','Mit freundlichen Grüßen')
 ],
 free:[
  F('Schreibe zwei Sätze über deinen beruflichen Weg. Nutze „vor“ und „seit“.','Vor ...\nSeit ...',2,'Beispiel: Vor zwei Jahren habe ich einen Deutschkurs begonnen. Seit einem Jahr arbeite ich in einer Firma.'),
  F('Schreibe eine sehr kurze Bewerbung mit Anrede und zwei Informationen.','Sehr geehrte ...\nich ...',3,'Schreibe: Warum interessierst du dich? Welche Erfahrung hast du?')
 ]
};

const T3={
 forms:[
  C('choice','Gestern ___ ich krank.',['war','hatte','bin'],'war'),C('choice','Früher ___ du viel Stress.',['hattest','warst','hast'],'hattest'),
  C('choice','Wir ___ ein gutes Team.',['waren','hatten','sind'],'waren'),C('choice','Ihr ___ einen netten Chef.',['hattet','wart','habt'],'hattet'),
  C('choice','Meine Arbeit ___ interessant.',['war','hatte','ist'],'war'),C('choice','Ich ___ keine Berufserfahrung.',['hatte','war','habe'],'hatte'),
  C('choice','Du ___ früher Kellnerin.',['warst','hattest','bist'],'warst'),C('choice','Wir ___ wenig Zeit.',['hatten','waren','haben'],'hatten'),
  C('choice','Der Chef ___ professionell.',['war','hatte','ist'],'war'),C('choice','Die Kollegen ___ viel Erfahrung.',['hatten','waren','haben'],'hatten')
 ],
 context:[
  C('choice','Was passt?',['war','hatte'],'war','Die Arbeit ___ einfach.','Mit einem Adjektiv beschreiben wir die Arbeit mit sein.'),
  C('choice','Was passt?',['war','hatte'],'hatte','Ich ___ viel Stress.','Stress hat man.'),
  C('choice','Was passt?',['war','hatte'],'war','Mein Team ___ toll.','Team + Adjektiv → sein.'),
  C('choice','Was passt?',['war','hatte'],'hatte','Wir ___ wenig Zeit.','Zeit hat man.'),
  C('choice','Was passt?',['war','hatte'],'war','Der Chef ___ schlecht.','Chef + Adjektiv → sein.'),
  C('choice','Was passt?',['war','hatte'],'hatte','Sie ___ keine Berufserfahrung.','Erfahrung hat man.'),
  C('choice','Was passt?',['war','hatte'],'war','Das Restaurant ___ sehr groß.','Ort + Adjektiv → sein.'),
  C('choice','Was passt?',['war','hatte'],'hatte','Ich ___ oft Spaß bei der Arbeit.','Spaß hat man.')
 ],
 order:[
  O('Ordne den Satz.','Früher war ich Koch in einem Restaurant.'),O('Ordne den Satz.','Ich hatte damals keine Berufserfahrung.'),
  O('Ordne den Satz.','Mein Chef war sehr professionell.'),O('Ordne den Satz.','Wir hatten oft viel Stress.'),
  O('Ordne den Satz.','Das Team war klein und nett.'),O('Ordne den Satz.','Ich hatte wenig Zeit für Pausen.'),
  O('Ordne die Frage.','Wie war deine Arbeit früher?'),O('Ordne die Frage.','Hattest du viel Berufserfahrung?')
 ],
 work:[
  C('choice','Was passt am besten?',['professionell','lecker','geöffnet'],'professionell','Der Chef erklärt alles gut und arbeitet sehr genau.'),
  C('choice','Was passt am besten?',['stressig','blau','billig'],'stressig','Es gibt sehr viel Arbeit und wenig Zeit.'),
  C('choice','Was passt am besten?',['einfach','hungrig','geschlossen'],'einfach','Die Aufgaben sind nicht schwer.'),
  C('choice','Was passt am besten?',['schlecht','sonnig','pünktlich'],'schlecht','Die Arbeit macht keinen Spaß und das Team ist unfreundlich.'),
  C('choice','Was passt am besten?',['toll','krank','teuer'],'toll','Das Team ist nett und die Arbeit macht Spaß.'),
  C('choice','Was passt?',['Berufserfahrung','Öffnungszeiten','Eintritt'],'Berufserfahrung','Ich habe schon drei Jahre als Koch gearbeitet.'),
  C('choice','Wo arbeitet ein Kellner?',['im Restaurant oder Café','in der Grundschule','im Schwimmbad'],'im Restaurant oder Café'),
  C('choice','Wo arbeitet eine Architektin oft?',['in einem Büro','in einer Bäckerei','in einer Kita'],'in einem Büro')
 ],
 compare:[
  C('choice','Welche Aussage beschreibt früher?',['Früher war mein Team klein.','Heute ist mein Team klein.','Morgen wird mein Team klein.'],'Früher war mein Team klein.'),
  C('choice','Welche Aussage beschreibt heute?',['Heute habe ich mehr Erfahrung.','Früher hatte ich mehr Erfahrung.','Gestern hatte ich keine Zeit.'],'Heute habe ich mehr Erfahrung.'),
  C('choice','Welche Kombination ist logisch?',['Früher hatte ich wenig Erfahrung. Heute habe ich viel Erfahrung.','Früher war ich viel Erfahrung. Heute bin ich Erfahrung.','Früher hatte ich Restaurant. Heute bin ich Restaurant.'],'Früher hatte ich wenig Erfahrung. Heute habe ich viel Erfahrung.'),
  C('choice','Welche Kombination ist logisch?',['Früher war die Arbeit stressig. Heute ist sie einfach.','Früher hatte die Arbeit stressig. Heute hat sie einfach.','Früher ist die Arbeit stressig. Heute war sie einfach.'],'Früher war die Arbeit stressig. Heute ist sie einfach.'),
  C('choice','Was passt?',['Damals','Morgen','Gleich'],'Damals','___ hatte ich keinen Spaß bei der Arbeit.'),
  C('choice','Was passt?',['heute','vor','seit'],'heute','Früher war ich Kellner. ___ bin ich Koch.'),
  C('choice','Was ist richtig?',['Früher war mein Chef streng.','Früher hatte mein Chef streng.','Früher ist mein Chef streng.'],'Früher war mein Chef streng.'),
  C('choice','Was ist richtig?',['Heute habe ich weniger Stress.','Heute bin ich weniger Stress.','Heute war ich weniger Stress.'],'Heute habe ich weniger Stress.')
 ],
 reading:[
  C('choice','Was war Daniel früher?',['Kellner','Architekt','Arbeiter'],'Kellner','Daniel erzählt: Früher war ich Kellner in einem kleinen Restaurant. Mein Chef war nett, aber wir hatten oft viel Stress. Ich hatte damals wenig Berufserfahrung. Heute arbeite ich als Koch und habe mehr Erfahrung.'),
  C('choice','Wie war Daniels Chef?',['nett','schlecht','arbeitslos'],'nett','Früher war ich Kellner in einem kleinen Restaurant. Mein Chef war nett.'),
  C('choice','Was hatte Daniel früher oft?',['Stress','Urlaub','Unterricht'],'Stress','Wir hatten oft viel Stress.'),
  C('choice','Wie viel Berufserfahrung hatte Daniel damals?',['wenig','sehr viel','keine Arbeit'],'wenig','Ich hatte damals wenig Berufserfahrung.'),
  C('choice','Was macht Daniel heute?',['Er arbeitet als Koch.','Er ist Kellner.','Er macht eine Ausbildung als Architekt.'],'Er arbeitet als Koch.','Heute arbeite ich als Koch und habe mehr Erfahrung.'),
  C('choice','Was ist heute anders?',['Daniel hat mehr Erfahrung.','Daniel hat keinen Beruf.','Daniel hat weniger Erfahrung.'],'Daniel hat mehr Erfahrung.','Heute arbeite ich als Koch und habe mehr Erfahrung.')
 ],
 listening:[
  H('Früher war ich Arbeiterin in einer großen Firma. Die Arbeit war einfach, aber ich hatte wenig Spaß. Heute arbeite ich in einem Café. Das Team ist toll.','Wo arbeitet die Person heute?',['in einem Café','in einer Firma','in einer Schule'],'in einem Café'),
  H('Früher war ich Arbeiterin in einer großen Firma. Die Arbeit war einfach, aber ich hatte wenig Spaß. Heute arbeite ich in einem Café. Das Team ist toll.','Wie war die frühere Arbeit?',['einfach','toll','professionell'],'einfach'),
  H('Mein erster Job war in einem Restaurant. Ich war Kellner. Der Chef war professionell, aber wir hatten sehr viel Stress.','Was war die Person?',['Kellner','Architekt','Arbeiter'],'Kellner'),
  H('Mein erster Job war in einem Restaurant. Ich war Kellner. Der Chef war professionell, aber wir hatten sehr viel Stress.','Wie war der Chef?',['professionell','schlecht','arbeitslos'],'professionell'),
  H('Ich hatte am Anfang keine Berufserfahrung. Meine Kollegen waren sehr nett und haben mir geholfen.','Was hatte die Person am Anfang nicht?',['Berufserfahrung','Kollegen','Arbeit'],'Berufserfahrung'),
  H('Ich hatte am Anfang keine Berufserfahrung. Meine Kollegen waren sehr nett und haben mir geholfen.','Wie waren die Kollegen?',['nett','schlecht','stressig'],'nett')
 ],
 free:[
  F('Schreibe mindestens zwei Sätze über eine frühere Arbeit oder ein Praktikum. Nutze „war“ und „hatte“.','Früher war ...\nIch hatte ...',2),
  F('Vergleiche früher und heute in mindestens zwei Sätzen.','Früher ...\nHeute ...',2)
 ]
};

const T4={
 vocab:[
  C('choice','Was bedeutet „Vollzeit“?',['eine Arbeit mit vielen Wochenstunden','nur am Wochenende arbeiten','eine kurze Pause'],'eine Arbeit mit vielen Wochenstunden'),
  C('choice','Was bedeutet „Teilzeit“?',['weniger Arbeitsstunden als Vollzeit','eine Arbeit ohne Geld','eine Ausbildung'],'weniger Arbeitsstunden als Vollzeit'),
  C('choice','Was bedeutet „befristet“?',['Die Stelle endet nach einer bestimmten Zeit.','Die Stelle ist immer frei.','Man arbeitet nur morgens.'],'Die Stelle endet nach einer bestimmten Zeit.'),
  C('choice','Was ist eine „Aushilfe“?',['eine Person, die zeitweise mithilft','eine Chefin','eine Schule'],'eine Person, die zeitweise mithilft'),
  C('choice','Was bedeutet „Verdienst“?',['Geld für die Arbeit','Arbeitskleidung','Arbeitsort'],'Geld für die Arbeit'),
  C('choice','Was bedeutet „Service“?',['Arbeit mit Kundinnen und Kunden','Urlaub','Ausbildung'],'Arbeit mit Kundinnen und Kunden'),
  C('choice','Was bedeutet „Stellenanzeige“?',['Information über eine freie Arbeit','eine Rechnung','ein Stundenplan'],'Information über eine freie Arbeit'),
  C('choice','Was bedeutet „Bewerbung“?',['Man möchte eine Stelle bekommen.','Man kündigt eine Wohnung.','Man kauft Möbel.'],'Man möchte eine Stelle bekommen.')
 ],
 ads:[
  C('choice','Welche Stelle passt zu Amina?',['Aushilfe im Café','Lager Vollzeit','Reinigung morgens'],'Aushilfe im Café','Amina kann montags bis freitags erst ab 16 Uhr. Sie spricht gern mit Menschen.\nA: Café sucht Aushilfe, Mo–Fr 16–20 Uhr. B: Lager, Vollzeit 7–16 Uhr. C: Reinigung, Mo–Fr 6–9 Uhr.'),
  C('choice','Welche Stelle passt zu Viktor?',['Lager Vollzeit','Aushilfe im Café','Reinigung morgens'],'Lager Vollzeit','Viktor möchte Vollzeit arbeiten und kann morgens um 7 Uhr beginnen.\nA: Café sucht Aushilfe, 16–20 Uhr. B: Lager, Vollzeit 7–16 Uhr. C: Reinigung 6–9 Uhr, Teilzeit.'),
  C('choice','Welche Stelle passt zu Sara?',['Reinigung morgens','Lager Vollzeit','Café abends'],'Reinigung morgens','Sara hat nach 10 Uhr Deutschkurs. Sie sucht eine kleine Arbeit am Morgen.\nA: Reinigung 6–9 Uhr. B: Lager 7–16 Uhr. C: Café 16–20 Uhr.'),
  C('choice','Welche Information steht in Anzeige A?',['Arbeitszeit 16–20 Uhr','Vollzeit 7–16 Uhr','Arbeit nur sonntags'],'Arbeitszeit 16–20 Uhr','Anzeige A: Café sucht Aushilfe, Montag bis Freitag 16–20 Uhr.'),
  C('choice','Welche Stelle ist Teilzeit?',['Reinigung 6–9 Uhr','Lager 7–16 Uhr','keine Stelle'],'Reinigung 6–9 Uhr','Reinigung: Montag bis Freitag 6–9 Uhr, Teilzeit.'),
  C('choice','Welche Stelle ist Vollzeit?',['Lager 7–16 Uhr','Café 16–20 Uhr','Reinigung 6–9 Uhr'],'Lager 7–16 Uhr','Lager: Montag bis Freitag 7–16 Uhr, Vollzeit.'),
  C('choice','Wo arbeitet man im Service?',['im Café','im Lager ohne Kunden','nur zu Hause'],'im Café','Café sucht Aushilfe im Service.'),
  C('choice','Welche Anzeige nennt einen Verdienst?',['„14 € pro Stunde“','„ab Montag“','„Teilzeit“'],'„14 € pro Stunde“','Anzeige: Aushilfe gesucht, 14 € pro Stunde.')
 ],
 regular:[
  C('choice','Was passt?',['montags','am Montag'],'montags','Ich arbeite ___ von 8 bis 12 Uhr.','Regelmäßig jeden Montag → montags.'),
  C('choice','Was passt?',['am Montag','montags'],'am Montag','Ich habe ___ um 10 Uhr ein Vorstellungsgespräch.','Ein konkreter Montag → am Montag.'),
  C('choice','Was passt?',['morgens','am Morgen'],'morgens','Ich arbeite immer ___.','Regelmäßig → morgens.'),
  C('choice','Was passt?',['am Morgen','morgens'],'am Morgen','Der Termin ist morgen ___.','Konkrete Zeit → am Morgen.'),
  C('choice','Was passt?',['samstags','am Samstag'],'samstags','Das Café sucht eine Aushilfe ___.','Regelmäßig jeden Samstag → samstags.'),
  C('choice','Was passt?',['am Samstag','samstags'],'am Samstag','Das Gespräch ist ___.','Ein bestimmter Samstag → am Samstag.'),
  C('choice','Was passt?',['abends','am Abend'],'abends','Ich kann nur ___ arbeiten.','Regelmäßig → abends.'),
  C('choice','Was passt?',['am Abend','abends'],'am Abend','Wir telefonieren heute ___.','Heute = konkreter Abend.')
 ],
 time:[
  C('choice','Was passt?',['für drei Monate','seit drei Monaten','vor drei Monaten'],'für drei Monate','Die Stelle ist ___ befristet.','Geplante Dauer → für.'),
  C('choice','Was passt?',['seit zwei Jahren','für zwei Jahren','vor zwei Jahre'],'seit zwei Jahren','Ich arbeite ___ bei der Firma.','Die Arbeit dauert noch an → seit.'),
  C('choice','Was passt?',['vor einer Woche','seit einer Woche','für einer Woche'],'vor einer Woche','Ich habe mich ___ beworben.','Abgeschlossener Zeitpunkt → vor.'),
  C('choice','Was passt?',['für sechs Monate','seit sechs Monaten','vor sechs Monaten'],'für sechs Monate','Der Vertrag ist ___ befristet.'),
  C('choice','Was passt?',['seit Mai','vor Mai','für Mai'],'seit Mai','Sie arbeitet ___ im Service.'),
  C('choice','Was passt?',['vor zwei Tagen','seit zwei Tagen','für zwei Tagen'],'vor zwei Tagen','Er hat die Stellenanzeige ___ gelesen.')
 ],
 listening:[
  H('Guten Tag, ich rufe wegen Ihrer Stellenanzeige an. Ist die Stelle als Aushilfe noch frei? Ja. Wir suchen jemanden für montags, mittwochs und freitags von 16 bis 20 Uhr.','Warum ruft die Person an?',['wegen einer Stellenanzeige','wegen einer Wohnung','wegen eines Arzttermins'],'wegen einer Stellenanzeige'),
  H('Guten Tag, ich rufe wegen Ihrer Stellenanzeige an. Ist die Stelle als Aushilfe noch frei? Ja. Wir suchen jemanden für montags, mittwochs und freitags von 16 bis 20 Uhr.','Wann arbeitet die Aushilfe?',['montags, mittwochs und freitags','nur sonntags','jeden Morgen'],'montags, mittwochs und freitags'),
  H('Die Stelle ist für sechs Monate befristet. Der Verdienst ist 14 Euro pro Stunde. Haben Sie schon Erfahrung im Service? Ja, ich habe ein Jahr in einem Café gearbeitet.','Wie lange ist die Stelle befristet?',['sechs Monate','ein Jahr','zwei Wochen'],'sechs Monate'),
  H('Die Stelle ist für sechs Monate befristet. Der Verdienst ist 14 Euro pro Stunde. Haben Sie schon Erfahrung im Service? Ja, ich habe ein Jahr in einem Café gearbeitet.','Wie hoch ist der Verdienst?',['14 Euro pro Stunde','16 Euro pro Stunde','sechs Euro pro Tag'],'14 Euro pro Stunde'),
  H('Können Sie am Dienstag um 10 Uhr zu einem Gespräch kommen? Ja, das passt gut. Bitte bringen Sie Ihren Lebenslauf mit.','Wann ist das Gespräch?',['am Dienstag um 10 Uhr','dienstags um 16 Uhr','am Freitag um 20 Uhr'],'am Dienstag um 10 Uhr'),
  H('Können Sie am Dienstag um 10 Uhr zu einem Gespräch kommen? Ja, das passt gut. Bitte bringen Sie Ihren Lebenslauf mit.','Was soll die Person mitbringen?',['den Lebenslauf','einen Tisch','eine Speisekarte'],'den Lebenslauf')
 ],
 dialog:[
  O('Ordne die Frage.','Ist die Stelle noch frei?'),O('Ordne den Satz.','Ich rufe wegen Ihrer Stellenanzeige an.'),
  O('Ordne die Frage.','Wie sind die Arbeitszeiten?'),O('Ordne die Frage.','Wie hoch ist der Verdienst?'),
  O('Ordne den Satz.','Ich habe schon Erfahrung im Service.'),O('Ordne die Frage.','Kann ich mich per E-Mail bewerben?'),
  O('Ordne den Satz.','Der Termin am Dienstag passt gut.'),O('Ordne den Abschied.','Vielen Dank für die Informationen.')
 ],
 message:[
  I('Ergänze: Guten Tag, ich interessiere mich ___ Ihre Stelle.',['für'],'Kurze Nachricht an einen Arbeitgeber.'),
  I('Ergänze: Ich kann montags und mittwochs ___ 16 Uhr arbeiten.',['ab'],'Kurze Nachricht an einen Arbeitgeber.'),
  I('Ergänze: Ich habe ein Jahr Erfahrung ___ Service.',['im','in dem'],'Kurze Nachricht an einen Arbeitgeber.'),
  I('Ergänze: Ist die Stelle noch ___?',['frei'],'Kurze Nachricht an einen Arbeitgeber.'),
  I('Ergänze: Ich freue mich ___ Ihre Antwort.',['auf'],'Kurze Nachricht an einen Arbeitgeber.'),
  I('Ergänze den Gruß: Mit freundlichen ___.',['Grüßen','Gruessen'],'Kurze formelle Nachricht.')
 ],
 free:[
  F('Schreibe eine kurze Nachricht zu einer Stellenanzeige. Nenne Arbeitszeit und Erfahrung.','Guten Tag,\nich interessiere mich für ...',3),
  F('Übe ein Telefonat: Schreibe mindestens drei Sätze oder Fragen, die du am Telefon sagen möchtest.','Guten Tag, ich rufe wegen ...',3)
 ]
};

function qualityT2(theme){
 const rows=practice(theme);if(rows[0]){rows[0].title='Karteikarten';rows[0].kind='cards';rows[0].icon='🃏';rows[0].emoji='🃏';rows[0].instruction='Lerne die neuen Wörter mit Bild, Übersetzung und Hören.'}
 const a=ensure(theme,3,{id:'werdegang-verstehen',items:T2.biography});setMeta(a,{title:'Werdegang verstehen',instruction:'Lies kurze Situationen und wähle die passende Zeitangabe.',icon:'🧠'});
 const b=ensure(theme,4,{id:'zeitlinie-ordnen',items:T2.timeline});setMeta(b,{title:'Zeitlinie: Sätze ordnen',kind:'order',instruction:'Ordne Wörter zu richtigen Sätzen und Fragen.',icon:'🧩'});
 const c=ensure(theme,5,{id:'lesen-berufswege',items:T2.reading});setMeta(c,{title:'Lesen: Drei Berufswege',instruction:'Lies kurze Biografien und finde die Informationen.',icon:'📖'});
 const d=ensure(theme,6,{id:'hoeren-berufswege',items:T2.listening});setMeta(d,{title:'Hören: Ausbildung und Arbeit',instruction:'Höre kurze Berufswege und beantworte die Fragen.',icon:'🎧'});
 const e=ensure(theme,7,{id:'bewerbung-saetze',items:T2.application});setMeta(e,{title:'Bewerbung: Was passt?',instruction:'Wähle passende und höfliche Sätze für Bewerbung und Telefon.',icon:'💼'});
 const f=ensure(theme,8,{id:'bewerbung-ordnen',items:T2.mail});setMeta(f,{title:'Kurze Bewerbung ordnen',kind:'order',instruction:'Baue eine einfache formelle Bewerbung Satz für Satz.',icon:'✉️'});
 const g=ensure(theme,9,{id:'meine-biografie',items:T2.free});setMeta(g,{title:'Meine Biografie',kind:'free',instruction:'Schreibe oder sprich über deinen eigenen Weg.',icon:'🎤'});
 theme.title='Ausbildung, Zeit und Bewerbung';theme.subtitle='Über Ausbildung und beruflichen Werdegang sprechen, seit/vor sicher benutzen und eine einfache Bewerbung verstehen.';
}
function qualityT3(theme){
 const rows=practice(theme);if(rows[0]){rows[0].title='Karteikarten';rows[0].kind='cards';rows[0].icon='🃏';rows[0].emoji='🃏';rows[0].instruction='Lerne Wörter für frühere Arbeit, Team und Berufserfahrung.'}
 const a=ensure(theme,1,{id:'war-hatte-formen',items:T3.forms});setMeta(a,{title:'war oder hatte? Formen',instruction:'Wähle die richtige Präteritumform.',icon:'🔤'});
 const b=ensure(theme,2,{id:'war-hatte-kontext',items:T3.context});setMeta(b,{title:'war oder hatte? Im Kontext',instruction:'Entscheide aus der Bedeutung: sein oder haben?',icon:'🧠'});
 const c=ensure(theme,3,{id:'frueher-saetze-ordnen',items:T3.order});setMeta(c,{title:'Früher: Sätze ordnen',kind:'order',instruction:'Ordne Wörter zu vollständigen Sätzen und Fragen.',icon:'🧩'});
 const d=ensure(theme,4,{id:'arbeit-beschreiben',items:T3.work});setMeta(d,{title:'Arbeit beschreiben',instruction:'Lies Situationen und wähle das passende Wort.',icon:'💬'});
 const e=ensure(theme,5,{id:'frueher-heute',items:T3.compare});setMeta(e,{title:'Früher und heute',instruction:'Vergleiche frühere und heutige Arbeit.',icon:'🔁'});
 const f=ensure(theme,6,{id:'lesen-alte-arbeit',items:T3.reading});setMeta(f,{title:'Lesen: Daniels erster Job',instruction:'Lies einen kurzen Text und finde konkrete Informationen.',icon:'📖'});
 const g=ensure(theme,7,{id:'hoeren-alte-arbeit',items:T3.listening});setMeta(g,{title:'Hören: Meine Arbeit früher',instruction:'Höre kurze Berichte über frühere Arbeit.',icon:'🎧'});
 const h=ensure(theme,8,{id:'meine-arbeit-frueher',items:T3.free});setMeta(h,{title:'Meine Arbeit früher',kind:'free',instruction:'Schreibe oder sprich selbst mit war und hatte.',icon:'🎤'});
 theme.title='Meine Arbeit früher';theme.subtitle='war und hatte im echten Kontext benutzen und frühere Arbeit mit einfachen Adjektiven beschreiben.';
}
function qualityT4(theme){
 const rows=practice(theme);if(rows[0]){rows[0].title='Karteikarten';rows[0].kind='cards';rows[0].icon='🃏';rows[0].emoji='🃏';rows[0].instruction='Lerne Wörter aus Stellenanzeigen und Bewerbung.'}
 const a=ensure(theme,1,{id:'stellenanzeigen-wortschatz',items:T4.vocab});setMeta(a,{title:'Stellenanzeigen verstehen',instruction:'Wähle die richtige Bedeutung wichtiger Wörter.',icon:'💡'});
 const b=ensure(theme,2,{id:'anzeigen-personen',items:T4.ads});setMeta(b,{title:'Welche Stelle passt?',instruction:'Lies Personen und Stellenanzeigen und ordne sinnvoll zu.',icon:'🧑‍💼'});
 const c=ensure(theme,3,{id:'regelmaessige-zeiten',items:T4.regular});setMeta(c,{title:'montags oder am Montag?',instruction:'Unterscheide regelmäßige und konkrete Zeitangaben.',icon:'📅'});
 const d=ensure(theme,4,{id:'fuer-seit-vor',items:T4.time});setMeta(d,{title:'für, seit oder vor?',instruction:'Wähle die passende Zeitangabe im Arbeitskontext.',icon:'⏳'});
 const e=ensure(theme,5,{id:'hoeren-stellenanzeige',items:T4.listening});setMeta(e,{title:'Hören: Telefon wegen einer Stelle',instruction:'Höre ein einfaches Bewerbungstelefonat und finde Informationen.',icon:'🎧'});
 const f=ensure(theme,6,{id:'telefon-dialog-ordnen',items:T4.dialog});setMeta(f,{title:'Telefonat bauen',kind:'order',instruction:'Ordne typische Sätze und Fragen für ein Telefonat.',icon:'☎️'});
 const g=ensure(theme,7,{id:'bewerbungsnachricht',items:T4.message});setMeta(g,{title:'Kurze Bewerbungsnachricht',kind:'input',instruction:'Ergänze eine einfache formelle Nachricht.',icon:'✍️'});
 const h=ensure(theme,8,{id:'selbst-bewerben',items:T4.free});setMeta(h,{title:'Jetzt selbst bewerben',kind:'free',instruction:'Schreibe oder sprich eine kurze Bewerbung bzw. ein Telefonat.',icon:'🎤'});
 theme.title='Stellenanzeigen und Arbeit suchen';theme.subtitle='Stellenanzeigen lesen, Arbeitszeiten verstehen und am Telefon oder schriftlich nach einer Stelle fragen.';
}

const previous=window.L8_CONTENT_READY;
const extras=[window.L8_T2_CURRENT_READY,window.L8_T2_VOCAB_FINAL_READY,window.L8_T3_VOCAB_READY].filter(Boolean);
window.L8_CONTENT_READY=Promise.all([Promise.resolve(previous),...extras.map(x=>Promise.resolve(x))]).then(([themes])=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const t1=all[1]||all['1'],t2=all[2]||all['2'],t3=all[3]||all['3'],t4=all[4]||all['4'];
 if(t1){const cards=practice(t1)[0];if(cards&&cards.kind==='cards'){cards.icon='🃏';cards.emoji='🃏';cards.instruction='Lerne Berufe und Wörter zur Arbeit mit Bild, Übersetzung und Hören.'}}
 if(t2)qualityT2(t2);if(t3)qualityT3(t3);if(t4)qualityT4(t4);
 const n=Number(document.body?.dataset?.theme||0);if(n&&all[n])window.L8_THEME=all[n];
 window.dispatchEvent(new CustomEvent('SP_L8_PEDAGOGY_READY',{detail:{themes:[1,2,3,4]}}));return all;
});
window.L8PedagogyQuality={version:1};
})();
