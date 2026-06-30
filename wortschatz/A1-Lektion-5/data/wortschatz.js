// SprachPilot · Wortschatz A1 Lektion 5 · Mein Tag
// Daten nach 4 Lernteilen: Alltag/trennbare Verben, Uhrzeit, Tage/Tageszeiten/Zeitpräpositionen, Kurse/Familie/Öffnungszeiten.
(function(){
const IMG={
  supermarkt:"/wortschatz/A1-Lektion-3/bilder/supermarkt.png",pizza:"/wortschatz/A1-Lektion-3/bilder/pizza.png",geschaeft:"/wortschatz/A1-Lektion-3/bilder/geschaeft.png",
  arbeiten:"/verben-A1/bilder/arbeiten.png",spielen:"/verben-A1/bilder/spielen.png",essen:"/verben-A1/bilder/essen.png",schlafen:"/verben-A1/bilder/schlafen.png",trinken:"/verben-A1/bilder/trinken.png",
  fragen:"/verben-A1/bilder/fragen.png",antworten:"/verben-A1/bilder/antworten.png",machen:"/verben-A1/bilder/machen.png",gehen:"/verben-A1/bilder/gehen.png",kochen:"/verben-A1/bilder/kochen.png",hoeren:"/verben-A1/bilder/hoeren.png",bringen:"/verben-A1/bilder/bringen.png",oeffnen:"/verben-A1/bilder/oeffnen.png",schliessen:"/verben-A1/bilder/schliessen.png"
};
const PARTS={
  "Thema-1":{id:"Thema-1",label:"Thema 1",title:"Alltag und trennbare Verben",desc:"Tagesablauf beschreiben: aufstehen, einkaufen, aufräumen, fernsehen und anrufen."},
  "Thema-2":{id:"Thema-2",label:"Thema 2",title:"Uhrzeit",desc:"Wie spät ist es? Uhrzeiten mit halb, Viertel, vor, nach, kurz und gleich."},
  "Thema-3":{id:"Thema-3",label:"Thema 3",title:"Tage, Tageszeiten und Präpositionen",desc:"Wochentage, Tageszeiten und Zeitangaben mit am, um, von ... bis ... und in der Nacht."},
  "Thema-4":{id:"Thema-4",label:"Thema 4",title:"Kurse, Familie und Öffnungszeiten",desc:"Kurse, Termine, Familie, Kita, Praxis, Bibliothek und Öffnungszeiten verstehen."}
};
const RAW=`
Thema-1|A|machen||machen|||verb|machen|Was machen Sie gern?|to do / to make|делать|yapmak|
Thema-1|A|praesentation|die|Präsentation|die Präsentationen|-en|noun||Lara macht eine Präsentation.|presentation|презентация|sunum|
Thema-1|A|fruehstuecken||frühstücken|||verb||Lara frühstückt.|to have breakfast|завтракать|kahvaltı yapmak|
Thema-1|A|einkaufen||einkaufen|||verb|supermarkt|Lara kauft ein.|to shop|покупать / ходить за покупками|alışveriş yapmak|Supermarkt-Bild als Einkaufsbild
Thema-1|A|hoeren||hören|||verb|hoeren|Lara hört Musik.|to hear / to listen|слышать / слушать|duymak / dinlemek|
Thema-1|A|kochen||kochen|||verb|kochen|Lara kocht das Abendessen.|to cook|готовить|yemek pişirmek|
Thema-1|A|spazieren_gehen||spazieren gehen|||verb|gehen|Lara geht spazieren.|to go for a walk|гулять|yürüyüşe çıkmak|Gehen-Bild als Übergangslösung
Thema-1|A|aufraeumen||aufräumen|||verb||Lara räumt die Küche auf.|to tidy up|убирать|toplamak / düzenlemek|
Thema-1|A|aufstehen||aufstehen|||verb||Lara steht früh auf.|to get up|вставать|kalkmak|
Thema-1|A|gehen||gehen|||verb|gehen|Lara geht zum Deutschkurs.|to go|идти|gitmek|
Thema-1|A|muede||müde|||adjective||Ich bin müde.|tired|усталый|yorgun|
Thema-1|A|anrufen||anrufen|||verb||Lara ruft ihre Familie an.|to call|звонить|aramak|
Thema-1|A|frueh||früh|||adverb||Lara steht früh auf.|early|рано|erken|
Thema-1|A|supermarkt|der|Supermarkt|die Supermärkte|-e/Umlaut|noun|supermarkt|Sie kauft im Supermarkt ein.|supermarket|супермаркет|süpermarket|
Thema-1|A|fernsehen||fernsehen|||verb||Sie sieht fern.|to watch TV|смотреть телевизор|televizyon izlemek|
Thema-1|A|arbeiten||arbeiten|||verb|arbeiten|Sie arbeitet lange.|to work|работать|çalışmak|
Thema-1|A|lange||lange|||adverb||Sofia arbeitet lange.|long / for a long time|долго|uzun süre|
Thema-1|A|spielen||spielen|||verb|spielen|Sie spielt mit Lili.|to play|играть|oynamak|
Thema-1|A|essen||essen|||verb|essen|Sofia isst mit Lara und Lili.|to eat|есть / кушать|yemek|
Thema-1|A|schlafen||schlafen|||verb|schlafen|Schläfst du schon?|to sleep|спать|uyumak|
Thema-1|A|gern||gern|||adverb||Stehst du gern früh auf?|gladly / like to|охотно / с удовольствием|severek|
Thema-2|B|spaet||spät|||adverb||Wie spät ist es?|late|поздно|geç|
Thema-2|B|schon||schon|||adverb||Ist es schon zwölf?|already|уже|zaten|
Thema-2|B|erst||erst|||adverb||Es ist erst elf.|only / not until|только|daha / sadece|
Thema-2|B|viertel|das|Viertel|die Viertel|-|noun||Es ist Viertel vor zwölf.|quarter|четверть|çeyrek|
Thema-2|B|vor||vor|||preposition||Es ist Viertel vor zwölf.|before / to|до|kala / önce|
Thema-2|B|nach||nach|||preposition||Es ist Viertel nach eins.|after / past|после|geçe / sonra|
Thema-2|B|halb||halb|||time||Es ist halb zwei.|half|половина|yarım|
Thema-2|B|uhr|die|Uhr|die Uhren|-en|noun||Es ist ein Uhr.|clock / o'clock|часы / час|saat|
Thema-2|B|kurz||kurz|||adverb||Es ist kurz vor zwölf.|shortly / just|незадолго|az kala|
Thema-2|B|gleich||gleich|||adverb||Es ist gleich zwölf.|soon / almost|скоро / почти|hemen / neredeyse|
Thema-3|C/D/Grammatik|tag|der|Tag|die Tage|-e|noun||Ich habe die Kinder den ganzen Tag.|day|день|gün|
Thema-3|C/D/Grammatik|montag|der|Montag|die Montage|-e|noun||Fangen die Kurse am Montag an?|Monday|понедельник|pazartesi|
Thema-3|C/D/Grammatik|dienstag|der|Dienstag|die Dienstage|-e|noun||Nein, erst am Dienstag.|Tuesday|вторник|salı|
Thema-3|C/D/Grammatik|mittwoch|der|Mittwoch|die Mittwoche|-e|noun||Was macht Tim am Mittwoch?|Wednesday|среда|çarşamba|
Thema-3|C/D/Grammatik|donnerstag|der|Donnerstag|die Donnerstage|-e|noun||Was machst du am Donnerstag?|Thursday|четверг|perşembe|
Thema-3|C/D/Grammatik|freitag|der|Freitag|die Freitage|-e|noun||Was machst du am Freitag?|Friday|пятница|cuma|
Thema-3|C/D/Grammatik|samstag|der|Samstag|die Samstage|-e|noun||Heute ist Samstag.|Saturday|суббота|cumartesi|
Thema-3|C/D/Grammatik|sonntag|der|Sonntag|die Sonntage|-e|noun||Am Sonntag?|Sunday|воскресенье|pazar|
Thema-3|C/D/Grammatik|wochenende|das|Wochenende|die Wochenenden|-n|noun||Am Wochenende schlafe ich lange.|weekend|выходные|hafta sonu|
Thema-3|C/D/Grammatik|woche|die|Woche|die Wochen|-n|noun||Nächste Woche habe ich einen Termin.|week|неделя|hafta|
Thema-3|C/D/Grammatik|naechst||nächst-|||determiner||Der Terminkalender für nächste Woche.|next|следующий|gelecek|
Thema-3|C/D/Grammatik|wann||wann|||question||Wann fängt der Deutschkurs an?|when|когда|ne zaman|
Thema-3|C/D/Grammatik|zeit|die|Zeit||Sg.|noun||Hast du Zeit?|time|время|zaman|
Thema-3|C/D/Grammatik|jed||jed-|||determiner||Ich habe die Kinder jeden Morgen.|each / every|каждый|her|
Thema-3|C/D/Grammatik|mittag|der|Mittag|die Mittage|-e|noun||Am Mittag isst er mit Nina.|noon / midday|полдень / обеденное время|öğle|
Thema-3|C/D/Grammatik|morgen|der|Morgen|die Morgen|-|noun||Am Morgen frühstückt Robert.|morning|утро|sabah|
Thema-3|C/D/Grammatik|abend|der|Abend|die Abende|-e|noun||Am Abend spielt er Fußball.|evening|вечер|akşam|
Thema-3|C/D/Grammatik|nachmittag|der|Nachmittag|die Nachmittage|-e|noun||Am Nachmittag macht er Sport.|afternoon|день / после обеда|öğleden sonra|
Thema-3|C/D/Grammatik|vormittag|der|Vormittag|die Vormittage|-e|noun||Am Vormittag räumt er auf.|morning / before noon|утро / до полудня|öğleden önce|
Thema-3|C/D/Grammatik|nacht|die|Nacht|die Nächte|-e/Umlaut|noun||In der Nacht chattet Robert.|night|ночь|gece|
Thema-3|C/D/Grammatik|am||am|||preposition||Am Montag habe ich Kurs.|on / at the|в / на|-de / -da|
Thema-3|C/D/Grammatik|um||um|||preposition||Der Kurs fängt um halb neun an.|at|в / около|saat ...de|
Thema-3|C/D/Grammatik|bis||bis|||preposition||Der Kindergarten ist bis 17 Uhr geöffnet.|until / to|до|kadar|
Thema-3|C/D/Grammatik|von_bis||von ... bis ...|||phrase||Der Kurs ist von neun bis zwölf.|from ... to ...|с ... до ...|...den ...e kadar|
Thema-3|C/D/Grammatik|am_morgen||am Morgen|||phrase||Am Morgen frühstücke ich.|in the morning|утром|sabah|
Thema-3|C/D/Grammatik|am_vormittag||am Vormittag|||phrase||Am Vormittag lerne ich Deutsch.|in the morning / before noon|до полудня|öğleden önce|
Thema-3|C/D/Grammatik|am_mittag||am Mittag|||phrase||Am Mittag mache ich Pause.|at noon|в полдень|öğlen|
Thema-3|C/D/Grammatik|am_nachmittag||am Nachmittag|||phrase||Am Nachmittag mache ich Sport.|in the afternoon|после обеда|öğleden sonra|
Thema-3|C/D/Grammatik|am_abend||am Abend|||phrase||Am Abend sehe ich fern.|in the evening|вечером|akşam|
Thema-3|C/D/Grammatik|in_der_nacht||in der Nacht|||phrase||In der Nacht schlafe ich.|at night|ночью|gece|
Thema-3|C/D/Grammatik|am_montag||am Montag|||phrase||Am Montag habe ich Deutschkurs.|on Monday|в понедельник|pazartesi günü|
Thema-3|C/D/Grammatik|am_wochenende||am Wochenende|||phrase||Am Wochenende habe ich Zeit.|at the weekend|на выходных|hafta sonu|
Thema-3|C/D/Grammatik|von_montag_bis_freitag||von Montag bis Freitag|||phrase||Die Bibliothek ist von Montag bis Freitag geöffnet.|from Monday to Friday|с понедельника по пятницу|pazartesiden cumaya kadar|
Thema-4|C/E|intensivkurs|der|Intensivkurs|die Intensivkurse|-e|noun||Ich mache einen Intensivkurs.|intensive course|интенсивный курс|yoğun kurs|
Thema-4|C/E|anfangen||anfangen|||verb||Der Deutschkurs fängt morgen an.|to begin|начинаться / начинать|başlamak|
Thema-4|C/E|enden||enden|||verb||Wann endet der Kurs?|to end|заканчиваться|bitmek|
Thema-4|C/E|party|die|Party|die Partys|-s|noun||Ich mache am Freitag eine Party.|party|вечеринка|parti|
Thema-4|C/E|fussball|der|Fußball||Sg.|noun||Ich spiele Fußball.|football / soccer|футбол|futbol|
Thema-4|C/E|hausaufgabe|die|Hausaufgabe|die Hausaufgaben|-n|noun||Sina macht Hausaufgaben.|homework|домашнее задание|ev ödevi|
Thema-4|C/E|mama|die|Mama|die Mamas|-s|noun||Tim ruft Mama an.|mom|мама|anne|
Thema-4|C/E|kino|das|Kino|die Kinos|-s|noun||Am Abend geht er ins Kino.|cinema|кинотеатр|sinema|
Thema-4|C/E|sport|der|Sport||Sg.|noun||Am Nachmittag macht Robert Sport.|sport|спорт|spor|
Thema-4|C/E|trinken||trinken|||verb|trinken|Er trinkt nur Kaffee.|to drink|пить|içmek|
Thema-4|C/E|pizza|die|Pizza|die Pizzen|-en|noun|pizza|Er isst eine Pizza.|pizza|пицца|pizza|
Thema-4|C/E|chatten||chatten|||verb||In der Nacht chattet Robert.|to chat|чатиться / переписываться|sohbet etmek|
Thema-4|C/E|geoeffnet||geöffnet|||adjective|oeffnen|Bis 17 Uhr geöffnet.|open|открыто|açık|gleiches Bild wie öffnen
Thema-4|C/E|geschlossen||geschlossen|||adjective|schliessen|An Feiertagen ist die Bibliothek geschlossen.|closed|закрыто|kapalı|gleiches Bild wie schließen
Thema-4|C/E|oeffnen||öffnen|||verb|oeffnen|Die Bibliothek öffnet um 13 Uhr.|to open|открывать|açmak|
Thema-4|C/E|schliessen||schließen|||verb|schliessen|Die Praxis schließt um 16 Uhr 30.|to close|закрывать|kapatmak|
Thema-4|C/E|termin|der|Termin|die Termine|-e|noun||Der Termin ist um 17 Uhr.|appointment|термин / встреча|randevu|
Thema-4|C/E|kindergarten|der|Kindergarten|die Kindergärten|-/Umlaut|noun||Der Kindergarten ist bis 17 Uhr geöffnet.|kindergarten|детский сад|anaokulu|
Thema-4|C/E|geschaeft|das|Geschäft|die Geschäfte|-er/Umlaut|noun|geschaeft|Am Samstag ist das Geschäft geöffnet.|shop / store|магазин|mağaza|
Thema-4|C/E|bibliothek|die|Bibliothek|die Bibliotheken|-en|noun||Die Bibliothek ist von Montag bis Freitag geöffnet.|library|библиотека|kütüphane|
Thema-4|C/E|praxis|die|Praxis|die Praxen|-en|noun||Die Praxis schließt um 16 Uhr 30.|doctor's office / practice|практика / врачебный кабинет|muayenehane|
Thema-4|C/E|kita|die|Kita|die Kitas|-s|noun||Tom und Luka gehen in die Kita.|daycare|детский сад|kreş|Kurzform von Kindertagesstätte
Thema-4|C/E|bringen||bringen|||verb|bringen|Um 7.15 Uhr bringt Vera die Kinder in die Kita.|to bring|приносить / приводить|getirmek|
Thema-4|C/E|abholen||abholen|||verb||Um 17 Uhr holt sie die Kinder ab.|to pick up|забирать|almak|
Thema-4|C/E|mehr||mehr|||adverb||Ich hätte gern mehr Zeit für mich.|more|больше|daha fazla|
Thema-4|C/E|beispiel|das|Beispiel|die Beispiele|-e|noun||Das ist ein Beispiel.|example|пример|örnek|
Thema-4|C/E|zum_beispiel||zum Beispiel|||phrase||Zum Beispiel möchte ich mal wieder ins Kino gehen.|for example|например|örneğin|Abkürzung: z. B.
Thema-4|C/E|wieder||wieder|||adverb||Ich möchte mal wieder ins Kino gehen.|again|снова|tekrar|
Thema-4|C/E|freund|der|Freund|die Freunde|-e|noun||Mein Freund fragt: Hast du Zeit?|male friend / boyfriend|друг|arkadaş / erkek arkadaş|
Thema-4|C/E|freundin|die|Freundin|die Freundinnen|-nen|noun||Meine Freundin fragt: Hast du Zeit?|female friend / girlfriend|подруга|arkadaş / kız arkadaş|
Thema-4|C/E|fragen||fragen|||verb|fragen|Meine Freundinnen fragen: Wann hast du Zeit?|to ask|спрашивать|sormak|
Thema-4|C/E|antworten||antworten|||verb|antworten|Ich antworte: Heute nicht.|to answer|отвечать|cevap vermek|
Thema-4|C/E|total||total|||adverb||Ich bin total fertig.|totally / very|совсем / очень|tamamen / çok|
`.trim();
function rowToWord(line){const c=line.split("|");const [part,section,id,article,word,plural,pluralGroup,type,imgKey,sentence,en,ru,tr,note]=c;const image=IMG[imgKey]||null;return {id,section,word,article,full:article?`${article} ${word}`:word,plural,pluralGroup,type,image,imageNeeded:!image,imageNote:note||"",sentence,note:note||"",tr:{en,ru,tr}}}
const lines=RAW.split(/\n+/).filter(Boolean);
const parts=Object.values(PARTS).map(p=>{const partWords=lines.filter(line=>line.startsWith(p.id+"|")).map(rowToWord);return {...p,words:partWords,wordCount:partWords.length,chips:partWords.slice(0,5).map(w=>w.word)}});
window.SP_A1_LEKTION5_WORTSCHATZ={level:"A1",lessonId:"A1-Lektion-5",lessonNumber:5,lessonTitle:"Mein Tag",parts};
window.SP_A1_LEKTION5_WORDS=parts.flatMap(p=>p.words.map(w=>({...w,part:p.id,partLabel:p.label,partTitle:p.title})));
window.SP_A1_LEKTION5_MISSING_IMAGES=window.SP_A1_LEKTION5_WORDS.filter(w=>w.imageNeeded);
})();
