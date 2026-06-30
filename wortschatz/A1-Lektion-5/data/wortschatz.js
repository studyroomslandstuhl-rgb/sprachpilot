// SprachPilot · Wortschatz A1 Lektion 5 · Mein Tag
// Daten nach Lernteilen: Alltag/trennbare Verben, Uhrzeit, Tage, Tageszeiten, Zeitpräpositionen, Öffnungszeiten.
(function(){
const IMG={
  supermarkt:"/wortschatz/A1-Lektion-3/bilder/supermarkt.png",pizza:"/wortschatz/A1-Lektion-3/bilder/pizza.png",geschaeft:"/wortschatz/A1-Lektion-3/bilder/geschaeft.png",
  arbeiten:"/verben-A1/bilder/arbeiten.png",spielen:"/verben-A1/bilder/spielen.png",essen:"/verben-A1/bilder/essen.png",schlafen:"/verben-A1/bilder/schlafen.png",trinken:"/verben-A1/bilder/trinken.png",
  fragen:"/verben-A1/bilder/fragen.png",antworten:"/verben-A1/bilder/antworten.png",machen:"/verben-A1/bilder/machen.png",gehen:"/verben-A1/bilder/gehen.png",kochen:"/verben-A1/bilder/kochen.png",hoeren:"/verben-A1/bilder/hoeren.png",bringen:"/verben-A1/bilder/bringen.png",oeffnen:"/verben-A1/bilder/oeffnen.png",schliessen:"/verben-A1/bilder/schliessen.png"
};
const PARTS={
  "Thema-1":{id:"Thema-1",label:"Teil 1",title:"Alltag und trennbare Verben",desc:"Tagesablauf beschreiben: aufstehen, einkaufen, aufräumen, fernsehen und anrufen."},
  "Thema-2":{id:"Thema-2",label:"Teil 2",title:"Uhrzeit",desc:"Wie spät ist es? Uhrzeiten mit halb, Viertel, vor, nach, kurz und gleich."},
  "Thema-3":{id:"Thema-3",label:"Teil 3",title:"Tage",desc:"Wochentage, Wochenende, Kurszeiten und einfache Termine verstehen."},
  "Thema-4":{id:"Thema-4",label:"Teil 4",title:"Tageszeiten",desc:"Am Morgen, am Mittag, am Abend und in der Nacht über Aktivitäten sprechen."},
  "Thema-5":{id:"Thema-5",label:"Teil 5",title:"Zeitpräpositionen",desc:"am, um, von ... bis ... und in der Nacht in einfachen Sätzen üben."},
  "Thema-6":{id:"Thema-6",label:"Teil 6",title:"Öffnungszeiten",desc:"Schilder und Zeiten verstehen: geöffnet, geschlossen, Praxis, Bibliothek und Kita."}
};
const RAW=`
Thema-1|A|machen||machen|||verb|machen|Was machen Sie gern?|to do / to make|делать|yapmak|
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
Thema-1|A|mit||mit|||preposition||Sie frühstückt mit Lara und Lili.|with|с|ile|
Thema-1|A|arbeiten||arbeiten|||verb|arbeiten|Sie arbeitet lange.|to work|работать|çalışmak|
Thema-1|A|lange||lange|||adverb||Sofia arbeitet lange.|long / for a long time|долго|uzun süre|
Thema-1|A|spielen||spielen|||verb|spielen|Sie spielt mit Lili.|to play|играть|oynamak|
Thema-1|A|essen||essen|||verb|essen|Sofia isst mit Lara und Lili.|to eat|есть / кушать|yemek|
Thema-1|A|gern||gern|||adverb||Stehst du gern früh auf?|gladly / like to|охотно / с удовольствием|severek|
Thema-1|A|oder||oder|||conjunction||Ich koche oder sehe fern.|or|или|veya|
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
Thema-3|C|intensivkurs|der|Intensivkurs|die Intensivkurse|-e|noun||Ich mache einen Intensivkurs.|intensive course|интенсивный курс|yoğun kurs|
Thema-3|C|anfangen||anfangen|||verb||Der Deutschkurs fängt morgen an.|to begin|начинаться / начинать|başlamak|
Thema-3|C|enden||enden|||verb||Wann endet der Kurs?|to end|заканчиваться|bitmek|
Thema-3|C|montag|der|Montag|die Montage|-e|noun||Fangen die Kurse am Montag an?|Monday|понедельник|pazartesi|
Thema-3|C|dienstag|der|Dienstag|die Dienstage|-e|noun||Nein, erst am Dienstag.|Tuesday|вторник|salı|
Thema-3|C|mittwoch|der|Mittwoch|die Mittwoche|-e|noun||Was macht Tim am Mittwoch?|Wednesday|среда|çarşamba|
Thema-3|C|donnerstag|der|Donnerstag|die Donnerstage|-e|noun||Was machst du am Donnerstag?|Thursday|четверг|perşembe|
Thema-3|C|freitag|der|Freitag|die Freitage|-e|noun||Was machst du am Freitag?|Friday|пятница|cuma|
Thema-3|C|samstag|der|Samstag|die Samstage|-e|noun||Heute ist Samstag.|Saturday|суббота|cumartesi|
Thema-3|C|sonntag|der|Sonntag|die Sonntage|-e|noun||Am Sonntag?|Sunday|воскресенье|pazar|
Thema-3|C|wochenende|das|Wochenende|die Wochenenden|-n|noun||Am Wochenende schlafe ich lange.|weekend|выходные|hafta sonu|
Thema-3|C|woche|die|Woche|die Wochen|-n|noun||Nächste Woche habe ich einen Termin.|week|неделя|hafta|
Thema-3|C|naechst||nächst-|||determiner||Der Terminkalender für nächste Woche.|next|следующий|gelecek|
Thema-3|C|wann||wann|||question||Wann fängt der Deutschkurs an?|when|когда|ne zaman|
Thema-3|C|party|die|Party|die Partys|-s|noun||Ich mache am Freitag eine Party.|party|вечеринка|parti|
Thema-3|C|zeit|die|Zeit||Sg.|noun||Hast du Zeit?|time|время|zaman|
Thema-3|C|fussball|der|Fußball||Sg.|noun||Ich spiele Fußball.|football / soccer|футбол|futbol|
Thema-3|C|hausaufgabe|die|Hausaufgabe|die Hausaufgaben|-n|noun||Sina macht Hausaufgaben.|homework|домашнее задание|ev ödevi|
Thema-3|C|mama|die|Mama|die Mamas|-s|noun||Tim ruft Mama an.|mom|мама|anne|
Thema-3|C|schlafen||schlafen|||verb|schlafen|Schläfst du schon?|to sleep|спать|uyumak|
Thema-4|D|mittag|der|Mittag|die Mittage|-e|noun||Am Mittag isst er mit Nina.|noon / midday|полдень / обеденное время|öğle|
Thema-4|D|morgen|der|Morgen|die Morgen|-|noun||Am Morgen frühstückt Robert.|morning|утро|sabah|
Thema-4|D|abend|der|Abend|die Abende|-e|noun||Am Abend spielt er Fußball.|evening|вечер|akşam|
Thema-4|D|nachmittag|der|Nachmittag|die Nachmittage|-e|noun||Am Nachmittag macht er Sport.|afternoon|день / после обеда|öğleden sonra|
Thema-4|D|vormittag|der|Vormittag|die Vormittage|-e|noun||Am Vormittag räumt er auf.|morning / before noon|утро / до полудня|öğleden önce|
Thema-4|D|nacht|die|Nacht|die Nächte|-e/Umlaut|noun||In der Nacht chattet Robert.|night|ночь|gece|
Thema-4|D|kino|das|Kino|die Kinos|-s|noun||Am Abend geht er ins Kino.|cinema|кинотеатр|sinema|
Thema-4|D|sport|der|Sport||Sg.|noun||Am Nachmittag macht Robert Sport.|sport|спорт|spor|
Thema-4|D|trinken||trinken|||verb|trinken|Er trinkt nur Kaffee.|to drink|пить|içmek|
Thema-4|D|pizza|die|Pizza|die Pizzen|-en|noun|pizza|Er isst eine Pizza.|pizza|пицца|pizza|
Thema-4|D|chatten||chatten|||verb||In der Nacht chattet Robert.|to chat|чатиться / переписываться|sohbet etmek|
Thema-5|Grammatik|am||am|||preposition||Am Montag habe ich Kurs.|on / at the|в / на|-de / -da|
Thema-5|Grammatik|um||um|||preposition||Der Kurs fängt um halb neun an.|at|в / около|saat ...de|
Thema-5|Grammatik|bis||bis|||preposition||Der Kindergarten ist bis 17 Uhr geöffnet.|until / to|до|kadar|
Thema-5|Grammatik|von_bis||von ... bis ...|||phrase||Der Kurs ist von neun bis zwölf.|from ... to ...|с ... до ...|...den ...e kadar|
Thema-5|Grammatik|am_morgen||am Morgen|||phrase||Am Morgen frühstücke ich.|in the morning|утром|sabah|
Thema-5|Grammatik|am_vormittag||am Vormittag|||phrase||Am Vormittag lerne ich Deutsch.|in the morning / before noon|до полудня|öğleden önce|
Thema-5|Grammatik|am_mittag||am Mittag|||phrase||Am Mittag mache ich Pause.|at noon|в полдень|öğlen|
Thema-5|Grammatik|am_nachmittag||am Nachmittag|||phrase||Am Nachmittag mache ich Sport.|in the afternoon|после обеда|öğleden sonra|
Thema-5|Grammatik|am_abend||am Abend|||phrase||Am Abend sehe ich fern.|in the evening|вечером|akşam|
Thema-5|Grammatik|in_der_nacht||in der Nacht|||phrase||In der Nacht schlafe ich.|at night|ночью|gece|
Thema-5|Grammatik|am_montag||am Montag|||phrase||Am Montag habe ich Deutschkurs.|on Monday|в понедельник|pazartesi günü|
Thema-5|Grammatik|am_wochenende||am Wochenende|||phrase||Am Wochenende habe ich Zeit.|at the weekend|на выходных|hafta sonu|
Thema-5|Grammatik|von_montag_bis_freitag||von Montag bis Freitag|||phrase||Die Bibliothek ist von Montag bis Freitag geöffnet.|from Monday to Friday|с понедельника по пятницу|pazartesiden cumaya kadar|
Thema-6|E|geoeffnet||geöffnet|||adjective|oeffnen|Bis 17 Uhr geöffnet.|open|открыто|açık|gleiches Bild wie öffnen
Thema-6|E|geschlossen||geschlossen|||adjective|schliessen|An Feiertagen ist die Bibliothek geschlossen.|closed|закрыто|kapalı|gleiches Bild wie schließen
Thema-6|E|oeffnen||öffnen|||verb|oeffnen|Die Bibliothek öffnet um 13 Uhr.|to open|открывать|açmak|
Thema-6|E|schliessen||schließen|||verb|schliessen|Die Praxis schließt um 16 Uhr 30.|to close|закрывать|kapatmak|
Thema-6|E|termin|der|Termin|die Termine|-e|noun||Der Termin ist um 17 Uhr.|appointment|термин / встреча|randevu|
Thema-6|E|kindergarten|der|Kindergarten|die Kindergärten|-/Umlaut|noun||Der Kindergarten ist bis 17 Uhr geöffnet.|kindergarten|детский сад|anaokulu|
Thema-6|E|geschaeft|das|Geschäft|die Geschäfte|-er/Umlaut|noun|geschaeft|Am Samstag ist das Geschäft geöffnet.|shop / store|магазин|mağaza|
Thema-6|E|bibliothek|die|Bibliothek|die Bibliotheken|-en|noun||Die Bibliothek ist von Montag bis Freitag geöffnet.|library|библиотека|kütüphane|
Thema-6|E|praxis|die|Praxis|die Praxen|-en|noun||Die Praxis schließt um 16 Uhr 30.|doctor's office / practice|практика / врачебный кабинет|muayenehane|
Thema-6|E|tag|der|Tag|die Tage|-e|noun||Ich habe die Kinder den ganzen Tag.|day|день|gün|
Thema-6|E|jed||jed-|||determiner||Ich habe die Kinder jeden Morgen.|each / every|каждый|her|
Thema-6|E|kita|die|Kita|die Kitas|-s|noun||Tom und Luka gehen in die Kita.|daycare|детский сад|kreş|Kurzform von Kindertagesstätte
Thema-6|E|bringen||bringen|||verb|bringen|Um 7.15 Uhr bringt Vera die Kinder in die Kita.|to bring|приносить / приводить|getirmek|
Thema-6|E|abholen||abholen|||verb||Um 17 Uhr holt sie die Kinder ab.|to pick up|забирать|almak|
Thema-6|E|mehr||mehr|||adverb||Ich hätte gern mehr Zeit für mich.|more|больше|daha fazla|
Thema-6|E|beispiel|das|Beispiel|die Beispiele|-e|noun||Das ist ein Beispiel.|example|пример|örnek|
Thema-6|E|zum_beispiel||zum Beispiel|||phrase||Zum Beispiel möchte ich mal wieder ins Kino gehen.|for example|например|örneğin|Abkürzung: z. B.
Thema-6|E|wieder||wieder|||adverb||Ich möchte mal wieder ins Kino gehen.|again|снова|tekrar|
Thema-6|E|freund|der|Freund|die Freunde|-e|noun||Mein Freund fragt: Hast du Zeit?|male friend / boyfriend|друг|arkadaş / erkek arkadaş|
Thema-6|E|freundin|die|Freundin|die Freundinnen|-nen|noun||Meine Freundin fragt: Hast du Zeit?|female friend / girlfriend|подруга|arkadaş / kız arkadaş|
Thema-6|E|fragen||fragen|||verb|fragen|Meine Freundinnen fragen: Wann hast du Zeit?|to ask|спрашивать|sormak|
Thema-6|E|antworten||antworten|||verb|antworten|Ich antworte: Heute nicht.|to answer|отвечать|cevap vermek|
Thema-6|E|total||total|||adverb||Ich bin total fertig.|totally / very|совсем / очень|tamamen / çok|
`.trim();
function rowToWord(line){const c=line.split("|");const [part,section,id,article,word,plural,pluralGroup,type,imgKey,sentence,en,ru,tr,note]=c;const image=IMG[imgKey]||null;return {id,section,word,article,full:article?`${article} ${word}`:word,plural,pluralGroup,type,image,imageNeeded:!image,imageNote:note||"",sentence,note:note||"",tr:{en,ru,tr}}}
const allWords=RAW.split(/\n+/).filter(Boolean).map(rowToWord);
const lines=RAW.split(/\n+/).filter(Boolean);
const parts=Object.values(PARTS).map(p=>{const partWords=lines.filter(line=>line.startsWith(p.id+"|")).map(rowToWord);return {...p,words:partWords,wordCount:partWords.length,chips:partWords.slice(0,5).map(w=>w.word)}});
window.SP_A1_LEKTION5_WORTSCHATZ={level:"A1",lessonId:"A1-Lektion-5",lessonNumber:5,lessonTitle:"Mein Tag",parts};
window.SP_A1_LEKTION5_WORDS=parts.flatMap(p=>p.words.map(w=>({...w,part:p.id,partLabel:p.label,partTitle:p.title})));
window.SP_A1_LEKTION5_MISSING_IMAGES=window.SP_A1_LEKTION5_WORDS.filter(w=>w.imageNeeded);
})();
