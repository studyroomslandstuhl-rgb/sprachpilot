// SprachPilot · Wortschatz A1 Lektion 5 · Mein Tag
// Daten nach Foto-Hörgeschichte und Teilen A–E. Keine Aufgabenlogik.
(function(){
const IMG={
  supermarkt:"/wortschatz/A1-Lektion-3/bilder/supermarkt.png",pizza:"/wortschatz/A1-Lektion-3/bilder/pizza.png",geschaeft:"/wortschatz/A1-Lektion-3/bilder/geschaeft.png",
  arbeiten:"/verben-A1/bilder/arbeiten.png",spielen:"/verben-A1/bilder/spielen.png",essen:"/verben-A1/bilder/essen.png",schlafen:"/verben-A1/bilder/schlafen.png",trinken:"/verben-A1/bilder/trinken.png",
  fragen:"/verben-A1/bilder/fragen.png",antworten:"/verben-A1/bilder/antworten.png",machen:"/verben-A1/bilder/machen.png",gehen:"/verben-A1/bilder/gehen.png",kochen:"/verben-A1/bilder/kochen.png",hoeren:"/verben-A1/bilder/hoeren.png",bringen:"/verben-A1/bilder/bringen.png",oeffnen:"/verben-A1/bilder/oeffnen.png",schliessen:"/verben-A1/bilder/schliessen.png"
};
const PARTS={
  "Thema-1":{id:"Thema-1",label:"Foto-Hörgeschichte",title:"Mein Tag",desc:"Verben und kleine Sätze aus der Foto-Hörgeschichte."},
  "Thema-2":{id:"Thema-2",label:"Teil A",title:"Tagesablauf und Aktivitäten",desc:"Früh, Supermarkt, arbeiten, spielen, essen und gern."},
  "Thema-3":{id:"Thema-3",label:"Teil B",title:"Uhrzeit",desc:"spät, Viertel, vor, nach, halb, Uhr, kurz und gleich."},
  "Thema-4":{id:"Thema-4",label:"Teil C",title:"Wochentage und Termine",desc:"Kurszeiten, Wochentage, Hausaufgaben und Wochenende."},
  "Thema-5":{id:"Thema-5",label:"Teil D",title:"Tageszeiten",desc:"Morgen, Mittag, Abend, Nachmittag, Vormittag, Nacht und Freizeit."},
  "Thema-6":{id:"Thema-6",label:"Teil E",title:"Öffnungszeiten und Kita",desc:"geöffnet, geschlossen, Bibliothek, Praxis, Kita, bringen und abholen."}
};
const RAW=`
Thema-1|Foto 1|machen||machen|||verb|machen|Lara macht eine Präsentation.|to do / to make|делать|yapmak|
Thema-1|Foto 1|praesentation|die|Präsentation|die Präsentationen|-en|noun||Lara macht eine Präsentation.|presentation|презентация|sunum|
Thema-1|Foto 2|fruehstuecken||frühstücken|||verb||Lara frühstückt.|to have breakfast|завтракать|kahvaltı yapmak|
Thema-1|Foto 2|einkaufen||einkaufen|||verb|supermarkt|Lara kauft ein.|to shop|покупать / ходить за покупками|alışveriş yapmak|Supermarkt-Bild als Einkaufsbild
Thema-1|Foto 2|hoeren||hören|||verb|hoeren|Lara hört Musik.|to hear / to listen|слышать / слушать|duymak / dinlemek|
Thema-1|Foto 2|kochen||kochen|||verb|kochen|Lara kocht das Abendessen.|to cook|готовить|yemek pişirmek|
Thema-1|Foto 2|spazieren_gehen||spazieren gehen|||verb|gehen|Lara geht spazieren.|to go for a walk|гулять|yürüyüşe çıkmak|Gehen-Bild als Übergangslösung
Thema-1|Foto 2|aufraeumen||aufräumen|||verb||Lara räumt die Küche auf.|to tidy up|убирать|toplamak / düzenlemek|
Thema-1|Foto 2|aufstehen||aufstehen|||verb||Lara steht um Viertel nach sieben auf.|to get up|вставать|kalkmak|
Thema-1|Foto 3|gehen||gehen|||verb|gehen|Lara geht zum Deutschkurs.|to go|идти|gitmek|
Thema-1|Foto 3|oder||oder|||conjunction||Lara geht spazieren oder kauft ein.|or|или|veya|
Thema-1|Foto 3|muede||müde|||adjective||Sofia ist am Abend müde.|tired|усталый|yorgun|
Thema-1|Foto 3|anrufen||anrufen|||verb||Lara ruft ihre Familie an.|to call|звонить|aramak|
Thema-2|A1|frueh||früh|||adverb||Lara steht früh auf.|early|рано|erken|
Thema-2|A1|supermarkt|der|Supermarkt|die Supermärkte|-e/Umlaut|noun|supermarkt|Sie kauft im Supermarkt ein.|supermarket|супермаркет|süpermarket|
Thema-2|A2|fernsehen||fernsehen|||verb||Sie sieht fern.|to watch TV|смотреть телевизор|televizyon izlemek|
Thema-2|A2|mit||mit|||preposition||Sie frühstückt mit Lara und Lili.|with|с|ile|
Thema-2|A2|arbeiten||arbeiten|||verb|arbeiten|Sie arbeitet lange.|to work|работать|çalışmak|
Thema-2|A2|lange||lange|||adverb||Sofia arbeitet lange.|long / for a long time|долго|uzun süre|
Thema-2|A2|spielen||spielen|||verb|spielen|Sie spielt mit Lili.|to play|играть|oynamak|
Thema-2|A2|essen||essen|||verb|essen|Sofia isst mit Lara und Lili.|to eat|есть / кушать|yemek|
Thema-2|A3|gern||gern|||adverb||Stehst du gern früh auf?|gladly / like to|охотно / с удовольствием|severek|
Thema-3|B1|spaet||spät|||adverb||Wie spät ist es?|late|поздно|geç|
Thema-3|B1|schon||schon|||adverb||Ist es schon zwölf?|already|уже|zaten|
Thema-3|B1|erst||erst|||adverb||Es ist erst elf.|only / not until|только|daha / sadece|
Thema-3|B1|viertel|das|Viertel|die Viertel|-|noun||Es ist Viertel vor zwölf.|quarter|четверть|çeyrek|
Thema-3|B1|vor||vor|||preposition||Es ist Viertel vor zwölf.|before / to|до|kala / önce|
Thema-3|B1|nach||nach|||preposition||Es ist Viertel nach eins.|after / past|после|geçe / sonra|
Thema-3|B1|halb||halb|||time||Es ist halb zwei.|half|половина|yarım|
Thema-3|B1|uhr|die|Uhr|die Uhren|-en|noun||Es ist ein Uhr.|clock / o'clock|часы / час|saat|
Thema-3|B3|kurz||kurz|||adverb||Es ist kurz vor zwölf.|shortly / just|незадолго|az kala|
Thema-3|B3|gleich||gleich|||adverb||Es ist gleich zwölf.|soon / almost|скоро / почти|hemen / neredeyse|
Thema-4|C1|intensivkurs|der|Intensivkurs|die Intensivkurse|-e|noun||Ich mache einen Intensivkurs.|intensive course|интенсивный курс|yoğun kurs|
Thema-4|C1|anfangen||anfangen|||verb||Der Deutschkurs fängt morgen an.|to begin|начинаться / начинать|başlamak|
Thema-4|C1|am||am|||preposition||Ich mache am Freitag einen Intensivkurs.|on / at the|в / на|-de / -da|
Thema-4|C1|montag|der|Montag|die Montage|-e|noun||Fangen die Kurse am Montag an?|Monday|понедельник|pazartesi|
Thema-4|C1|freitag|der|Freitag|die Freitage|-e|noun||Was machst du am Freitag?|Friday|пятница|cuma|
Thema-4|C1|donnerstag|der|Donnerstag|die Donnerstage|-e|noun||Was machst du am Donnerstag?|Thursday|четверг|perşembe|
Thema-4|C1|mittwoch|der|Mittwoch|die Mittwoche|-e|noun||Was macht Tim am Mittwoch?|Wednesday|среда|çarşamba|
Thema-4|C1|dienstag|der|Dienstag|die Dienstage|-e|noun||Nein, erst am Dienstag.|Tuesday|вторник|salı|
Thema-4|C1|wann||wann|||question||Wann fängt der Deutschkurs an?|when|когда|ne zaman|
Thema-4|C1|um||um|||preposition||Der Kurs fängt um halb neun an.|at|в / около|saat ...de|
Thema-4|C2|enden||enden|||verb||Wann endet der Kurs?|to end|заканчиваться|bitmek|
Thema-4|C2|von_bis||von ... bis ...|||phrase||Der Kurs ist von neun bis zwölf.|from ... to ...|с ... до ...|...den ...e kadar|
Thema-4|C2|party|die|Party|die Partys|-s|noun||Ich mache am Freitag eine Party.|party|вечеринка|parti|
Thema-4|C2|zeit|die|Zeit||Sg.|noun||Hast du Zeit?|time|время|zaman|
Thema-4|C2|fussball|der|Fußball||Sg.|noun||Ich spiele Fußball.|football / soccer|футбол|futbol|
Thema-4|C2|samstag|der|Samstag|die Samstage|-e|noun||Heute ist Samstag.|Saturday|суббота|cumartesi|
Thema-4|C2|sonntag|der|Sonntag|die Sonntage|-e|noun||Am Sonntag?|Sunday|воскресенье|pazar|
Thema-4|C3|hausaufgabe|die|Hausaufgabe|die Hausaufgaben|-n|noun||Sina macht Hausaufgaben.|homework|домашнее задание|ev ödevi|
Thema-4|C3|mama|die|Mama|die Mamas|-s|noun||Tim ruft Mama an.|mom|мама|anne|
Thema-4|C3|schlafen||schlafen|||verb|schlafen|Schläfst du schon?|to sleep|спать|uyumak|
Thema-4|C4|wochenende|das|Wochenende|die Wochenenden|-n|noun||Julia steht am Wochenende früh auf.|weekend|выходные|hafta sonu|
Thema-4|C4|naechst||nächst-|||determiner||Der Terminkalender für nächste Woche.|next|следующий|gelecek|
Thema-4|C4|woche|die|Woche|die Wochen|-n|noun||Nächste Woche habe ich einen Termin.|week|неделя|hafta|
Thema-5|D1|mittag|der|Mittag|die Mittage|-e|noun||Am Mittag isst er mit Nina.|noon / midday|полдень / обеденное время|öğle|
Thema-5|D1|morgen|der|Morgen|die Morgen|-|noun||Am Morgen frühstückt Robert.|morning|утро|sabah|
Thema-5|D1|abend|der|Abend|die Abende|-e|noun||Am Abend spielt er Fußball.|evening|вечер|akşam|
Thema-5|D1|nachmittag|der|Nachmittag|die Nachmittage|-e|noun||Am Nachmittag macht er Sport.|afternoon|день / после обеда|öğleden sonra|
Thema-5|D1|vormittag|der|Vormittag|die Vormittage|-e|noun||Am Vormittag räumt er auf.|morning / before noon|утро / до полудня|öğleden önce|
Thema-5|D2|nacht|die|Nacht|die Nächte|-e/Umlaut|noun||In der Nacht chattet Robert.|night|ночь|gece|
Thema-5|D2|kino|das|Kino|die Kinos|-s|noun||Am Abend geht er ins Kino.|cinema|кинотеатр|sinema|
Thema-5|D2|sport|der|Sport||Sg.|noun||Am Nachmittag macht Robert Sport.|sport|спорт|spor|
Thema-5|D2|trinken||trinken|||verb|trinken|Er trinkt nur Kaffee.|to drink|пить|içmek|
Thema-5|D2|pizza|die|Pizza|die Pizzen|-en|noun|pizza|Er isst eine Pizza.|pizza|пицца|pizza|
Thema-5|D2|chatten||chatten|||verb||In der Nacht chattet Robert.|to chat|чатиться / переписываться|sohbet etmek|
Thema-6|E1|geoeffnet||geöffnet|||adjective|oeffnen|Bis 17 Uhr geöffnet.|open|открыто|açık|gleiches Bild wie öffnen
Thema-6|E1|termin|der|Termin|die Termine|-e|noun||Der Termin ist um 17 Uhr.|appointment|термин / встреча|randevu|
Thema-6|E1|kindergarten|der|Kindergarten|die Kindergärten|-/Umlaut|noun||Der Kindergarten ist bis 17 Uhr geöffnet.|kindergarten|детский сад|anaokulu|
Thema-6|E1|geschaeft|das|Geschäft|die Geschäfte|-er/Umlaut|noun|geschaeft|Am Samstag ist das Geschäft geöffnet.|shop / store|магазин|mağaza|
Thema-6|E1|bibliothek|die|Bibliothek|die Bibliotheken|-en|noun||Die Bibliothek ist von Montag bis Freitag geöffnet.|library|библиотека|kütüphane|
Thema-6|E1|geschlossen||geschlossen|||adjective|schliessen|An Feiertagen ist die Bibliothek geschlossen.|closed|закрыто|kapalı|gleiches Bild wie schließen
Thema-6|E1|oeffnen||öffnen|||verb|oeffnen|Die Bibliothek öffnet um 13 Uhr.|to open|открывать|açmak|
Thema-6|E1|schliessen||schließen|||verb|schliessen|Die Praxis schließt um 16 Uhr 30.|to close|закрывать|kapatmak|
Thema-6|E1|praxis|die|Praxis|die Praxen|-en|noun||Die Praxis schließt um 16 Uhr 30.|doctor's office / practice|практика / врачебный кабинет|muayenehane|
Thema-6|E2|tag|der|Tag|die Tage|-e|noun||Ich habe die Kinder den ganzen Tag.|day|день|gün|
Thema-6|E2|jed||jed-|||determiner||Ich habe die Kinder jeden Morgen.|each / every|каждый|her|
Thema-6|E2|kita|die|Kita|die Kitas|-s|noun||Tom und Luka gehen in die Kita.|daycare|детский сад|kreş|Kurzform von Kindertagesstätte
Thema-6|E2|bringen||bringen|||verb|bringen|Um 7.15 Uhr bringt Vera die Kinder in die Kita.|to bring|приносить / приводить|getirmek|
Thema-6|E2|abholen||abholen|||verb||Um 17 Uhr holt sie die Kinder ab.|to pick up|забирать|almak|
Thema-6|E2|mehr||mehr|||adverb||Ich hätte gern mehr Zeit für mich.|more|больше|daha fazla|
Thema-6|E2|beispiel|das|Beispiel|die Beispiele|-e|noun||Das ist ein Beispiel.|example|пример|örnek|
Thema-6|E2|zum_beispiel||zum Beispiel|||phrase||Zum Beispiel möchte ich mal wieder ins Kino gehen.|for example|например|örneğin|Abkürzung: z. B.
Thema-6|E2|wieder||wieder|||adverb||Ich möchte mal wieder ins Kino gehen.|again|снова|tekrar|
Thema-6|E2|freund|der|Freund|die Freunde|-e|noun||Mein Freund fragt: Hast du Zeit?|male friend / boyfriend|друг|arkadaş / erkek arkadaş|
Thema-6|E2|freundin|die|Freundin|die Freundinnen|-nen|noun||Meine Freundin fragt: Hast du Zeit?|female friend / girlfriend|подруга|arkadaş / kız arkadaş|
Thema-6|E2|fragen||fragen|||verb|fragen|Meine Freundinnen fragen: Wann hast du Zeit?|to ask|спрашивать|sormak|
Thema-6|E2|antworten||antworten|||verb|antworten|Ich antworte: Heute nicht.|to answer|отвечать|cevap vermek|
Thema-6|E2|total||total|||adverb||Ich bin total fertig.|totally / very|совсем / очень|tamamen / çok|
`.trim();
function rowToWord(line){const c=line.split("|");const [part,section,id,article,word,plural,pluralGroup,type,imgKey,sentence,en,ru,tr,note]=c;const image=IMG[imgKey]||null;return {id,section,word,article,full:article?`${article} ${word}`:word,plural,pluralGroup,type,image,imageNeeded:!image,imageNote:note||"",sentence,note:note||"",tr:{en,ru,tr}}}
const allWords=RAW.split(/\n+/).filter(Boolean).map(rowToWord);
const parts=Object.values(PARTS).map(p=>{const words=allWords.filter(w=>w&&w.id&&RAW.includes(p.id+"|")&&w.id);const partWords=allWords.filter(w=>RAW.split(/\n+/).find(line=>line.startsWith(p.id+"|")&&line.includes("|"+w.id+"|")));return {...p,words:partWords,wordCount:partWords.length,chips:partWords.slice(0,5).map(w=>w.word)}});
window.SP_A1_LEKTION5_WORTSCHATZ={level:"A1",lessonId:"A1-Lektion-5",lessonNumber:5,lessonTitle:"Mein Tag",parts};
window.SP_A1_LEKTION5_WORDS=parts.flatMap(p=>p.words.map(w=>({...w,part:p.id,partLabel:p.label,partTitle:p.title})));
window.SP_A1_LEKTION5_MISSING_IMAGES=window.SP_A1_LEKTION5_WORDS.filter(w=>w.imageNeeded);
})();
