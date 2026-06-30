// SprachPilot · Wortschatz A1 Lektion 5 · Mein Tag
// Daten nach 4 Lernteilen: Alltag/trennbare Verben, Uhrzeit, Tage/Tageszeiten/Zeitpräpositionen, Kurse/Familie/Öffnungszeiten.
// Standardsprachen: Englisch, Russisch, Türkisch, Ukrainisch, Arabisch, Japanisch, Rumänisch.
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
Thema-1|A|machen||machen|||verb|machen|Was machen Sie gern?|to do / to make|делать|yapmak|робити|يفعل / يصنع|する|a face / a realiza|
Thema-1|A|praesentation|die|Präsentation|die Präsentationen|-en|noun||Lara macht eine Präsentation.|presentation|презентация|sunum|презентація|عرض تقديمي|プレゼンテーション|prezentare|
Thema-1|A|fruehstuecken||frühstücken|||verb||Lara frühstückt.|to have breakfast|завтракать|kahvaltı yapmak|снідати|يتناول الفطور|朝食を食べる|a lua micul dejun|
Thema-1|A|einkaufen||einkaufen|||verb||Lara kauft ein.|to shop|покупать / ходить за покупками|alışveriş yapmak|робити покупки|يتسوق|買い物をする|a face cumpărături|
Thema-1|A|hoeren||hören|||verb|hoeren|Lara hört Musik.|to hear / to listen|слышать / слушать|duymak / dinlemek|чути / слухати|يسمع / يستمع|聞く|a auzi / a asculta|
Thema-1|A|kochen||kochen|||verb|kochen|Lara kocht das Abendessen.|to cook|готовить|yemek pişirmek|готувати|يطبخ|料理する|a găti|
Thema-1|A|spazieren_gehen||spazieren gehen|||verb||Lara geht spazieren.|to go for a walk|гулять|yürüyüşe çıkmak|гуляти|يتمشى|散歩する|a se plimba|
Thema-1|A|aufraeumen||aufräumen|||verb||Lara räumt die Küche auf.|to tidy up|убирать|toplamak / düzenlemek|прибирати|يرتب|片付ける|a face ordine|
Thema-1|A|aufstehen||aufstehen|||verb||Lara steht früh auf.|to get up|вставать|kalkmak|вставати|ينهض|起きる|a se scula|
Thema-1|A|gehen||gehen|||verb|gehen|Lara geht zum Deutschkurs.|to go|идти|gitmek|йти|يذهب|行く|a merge|
Thema-1|A|muede||müde|||adjective||Ich bin müde.|tired|усталый|yorgun|втомлений|متعب|疲れた|obosit|
Thema-1|A|anrufen||anrufen|||verb||Lara ruft ihre Familie an.|to call|звонить|aramak|телефонувати|يتصل|電話する|a suna|
Thema-1|A|frueh||früh|||adverb||Lara steht früh auf.|early|рано|erken|рано|مبكرًا|早く|devreme|
Thema-1|A|supermarkt|der|Supermarkt|die Supermärkte|-e/Umlaut|noun|supermarkt|Sie kauft im Supermarkt ein.|supermarket|супермаркет|süpermarket|супермаркет|سوبرماركت|スーパーマーケット|supermarket|
Thema-1|A|fernsehen||fernsehen|||verb||Sie sieht fern.|to watch TV|смотреть телевизор|televizyon izlemek|дивитися телевізор|يشاهد التلفاز|テレビを見る|a se uita la televizor|
Thema-1|A|arbeiten||arbeiten|||verb|arbeiten|Sie arbeitet lange.|to work|работать|çalışmak|працювати|يعمل|働く|a lucra|
Thema-1|A|lange||lange|||adverb||Sofia arbeitet lange.|long / for a long time|долго|uzun süre|довго|لمدة طويلة|長く|mult timp|
Thema-1|A|spielen||spielen|||verb|spielen|Sie spielt mit Lili.|to play|играть|oynamak|грати|يلعب|遊ぶ|a se juca|
Thema-1|A|essen||essen|||verb|essen|Sofia isst mit Lara und Lili.|to eat|есть / кушать|yemek|їсти|يأكل|食べる|a mânca|
Thema-1|A|schlafen||schlafen|||verb|schlafen|Schläfst du schon?|to sleep|спать|uyumak|спати|ينام|寝る|a dormi|
Thema-1|A|gern||gern|||adverb||Stehst du gern früh auf?|gladly / like to|охотно / с удовольствием|severek|охоче / із задоволенням|بسرور / يحب أن|喜んで / 好きで|cu plăcere / îi place să|
Thema-2|B|spaet||spät|||adverb||Wie spät ist es?|late|поздно|geç|пізно|متأخر|遅い|târziu|
Thema-2|B|schon||schon|||adverb||Ist es schon zwölf?|already|уже|zaten|вже|بالفعل|もう|deja|
Thema-2|B|erst||erst|||adverb||Es ist erst elf.|only / not until|только|daha / sadece|лише / тільки|فقط / ليس قبل|まだ / たった|abia / doar|
Thema-2|B|viertel|das|Viertel|die Viertel|-|noun||Es ist Viertel vor zwölf.|quarter|четверть|çeyrek|чверть|ربع|4分の1|sfert|
Thema-2|B|vor||vor|||preposition||Es ist Viertel vor zwölf.|before / to|до|kala / önce|до|قبل|前|înainte / fără|
Thema-2|B|nach||nach|||preposition||Es ist Viertel nach eins.|after / past|после|geçe / sonra|після|بعد|後|după|
Thema-2|B|halb||halb|||time||Es ist halb zwei.|half|половина|yarım|половина|نصف|半分 / 半|jumătate|
Thema-2|B|uhr|die|Uhr|die Uhren|-en|noun||Es ist ein Uhr.|clock / o'clock|часы / час|saat|годинник / година|ساعة|時計 / 時|ceas / ora|
Thema-2|B|kurz||kurz|||adverb||Es ist kurz vor zwölf.|shortly / just|незадолго|az kala|незадовго|قبل قليل / تقريبًا|少し前|cu puțin înainte|
Thema-2|B|gleich||gleich|||adverb||Es ist gleich zwölf.|soon / almost|скоро / почти|hemen / neredeyse|скоро / майже|قريبًا / تقريبًا|もうすぐ / ほぼ|imediat / aproape|
Thema-3|C/D/Grammatik|tag|der|Tag|die Tage|-e|noun||Ich habe die Kinder den ganzen Tag.|day|день|gün|день|يوم|日|zi|
Thema-3|C/D/Grammatik|montag|der|Montag|die Montage|-e|noun||Fangen die Kurse am Montag an?|Monday|понедельник|pazartesi|понеділок|الاثنين|月曜日|luni|
Thema-3|C/D/Grammatik|dienstag|der|Dienstag|die Dienstage|-e|noun||Nein, erst am Dienstag.|Tuesday|вторник|salı|вівторок|الثلاثاء|火曜日|marți|
Thema-3|C/D/Grammatik|mittwoch|der|Mittwoch|die Mittwoche|-e|noun||Was macht Tim am Mittwoch?|Wednesday|среда|çarşamba|середа|الأربعاء|水曜日|miercuri|
Thema-3|C/D/Grammatik|donnerstag|der|Donnerstag|die Donnerstage|-e|noun||Was machst du am Donnerstag?|Thursday|четверг|perşembe|четвер|الخميس|木曜日|joi|
Thema-3|C/D/Grammatik|freitag|der|Freitag|die Freitage|-e|noun||Was machst du am Freitag?|Friday|пятница|cuma|пʼятниця|الجمعة|金曜日|vineri|
Thema-3|C/D/Grammatik|samstag|der|Samstag|die Samstage|-e|noun||Heute ist Samstag.|Saturday|суббота|cumartesi|субота|السبت|土曜日|sâmbătă|
Thema-3|C/D/Grammatik|sonntag|der|Sonntag|die Sonntage|-e|noun||Am Sonntag?|Sunday|воскресенье|pazar|неділя|الأحد|日曜日|duminică|
Thema-3|C/D/Grammatik|wochenende|das|Wochenende|die Wochenenden|-n|noun||Am Wochenende schlafe ich lange.|weekend|выходные|hafta sonu|вихідні|نهاية الأسبوع|週末|weekend|
Thema-3|C/D/Grammatik|woche|die|Woche|die Wochen|-n|noun||Nächste Woche habe ich einen Termin.|week|неделя|hafta|тиждень|أسبوع|週|săptămână|
Thema-3|C/D/Grammatik|naechst||nächst-|||determiner||Der Terminkalender für nächste Woche.|next|следующий|gelecek|наступний|التالي|次の|următor|
Thema-3|C/D/Grammatik|wann||wann|||question||Wann fängt der Deutschkurs an?|when|когда|ne zaman|коли|متى|いつ|când|
Thema-3|C/D/Grammatik|zeit|die|Zeit||Sg.|noun||Hast du Zeit?|time|время|zaman|час|وقت|時間|timp|
Thema-3|C/D/Grammatik|jed||jed-|||determiner||Ich habe die Kinder jeden Morgen.|each / every|каждый|her|кожен|كل|毎〜 / それぞれ|fiecare|
Thema-3|C/D/Grammatik|mittag|der|Mittag|die Mittage|-e|noun||Am Mittag isst er mit Nina.|noon / midday|полдень / обеденное время|öğle|полудень / обід|الظهر|正午 / 昼|amiază|
Thema-3|C/D/Grammatik|morgen|der|Morgen|die Morgen|-|noun||Am Morgen frühstückt Robert.|morning|утро|sabah|ранок|الصباح|朝|dimineață|
Thema-3|C/D/Grammatik|abend|der|Abend|die Abende|-e|noun||Am Abend spielt er Fußball.|evening|вечер|akşam|вечір|المساء|夕方 / 夜|seară|
Thema-3|C/D/Grammatik|nachmittag|der|Nachmittag|die Nachmittage|-e|noun||Am Nachmittag macht er Sport.|afternoon|день / после обеда|öğleden sonra|після обіду|بعد الظهر|午後|după-amiază|
Thema-3|C/D/Grammatik|vormittag|der|Vormittag|die Vormittage|-e|noun||Am Vormittag räumt er auf.|morning / before noon|утро / до полудня|öğleden önce|до обіду|قبل الظهر|午前|înainte de prânz|
Thema-3|C/D/Grammatik|nacht|die|Nacht|die Nächte|-e/Umlaut|noun||In der Nacht chattet Robert.|night|ночь|gece|ніч|الليل|夜|noapte|
Thema-3|C/D/Grammatik|am||am|||preposition||Am Montag habe ich Kurs.|on / at the|в / на|-de / -da|у / в|في / على|〜に|la / în|
Thema-3|C/D/Grammatik|um||um|||preposition||Der Kurs fängt um halb neun an.|at|в / около|saat ...de|о / близько|في الساعة|〜に|la|
Thema-3|C/D/Grammatik|bis||bis|||preposition||Der Kindergarten ist bis 17 Uhr geöffnet.|until / to|до|kadar|до|حتى|〜まで|până la|
Thema-3|C/D/Grammatik|von_bis||von ... bis ...|||phrase||Der Kurs ist von neun bis zwölf.|from ... to ...|с ... до ...|...den ...e kadar|з ... до ...|من ... إلى ...|〜から〜まで|de la ... până la ...|
Thema-3|C/D/Grammatik|am_morgen||am Morgen|||phrase||Am Morgen frühstücke ich.|in the morning|утром|sabah|вранці|في الصباح|朝に|dimineața|
Thema-3|C/D/Grammatik|am_vormittag||am Vormittag|||phrase||Am Vormittag lerne ich Deutsch.|in the morning / before noon|до полудня|öğleden önce|до обіду|قبل الظهر|午前中に|înainte de prânz|
Thema-3|C/D/Grammatik|am_mittag||am Mittag|||phrase||Am Mittag mache ich Pause.|at noon|в полдень|öğlen|опівдні|عند الظهر|正午に|la amiază|
Thema-3|C/D/Grammatik|am_nachmittag||am Nachmittag|||phrase||Am Nachmittag mache ich Sport.|in the afternoon|после обеда|öğleden sonra|після обіду|بعد الظهر|午後に|după-amiaza|
Thema-3|C/D/Grammatik|am_abend||am Abend|||phrase||Am Abend sehe ich fern.|in the evening|вечером|akşam|увечері|في المساء|夕方に / 夜に|seara|
Thema-3|C/D/Grammatik|in_der_nacht||in der Nacht|||phrase||In der Nacht schlafe ich.|at night|ночью|gece|вночі|في الليل|夜に|noaptea|
Thema-3|C/D/Grammatik|am_montag||am Montag|||phrase||Am Montag habe ich Deutschkurs.|on Monday|в понедельник|pazartesi günü|у понеділок|يوم الاثنين|月曜日に|luni|
Thema-3|C/D/Grammatik|am_wochenende||am Wochenende|||phrase||Am Wochenende habe ich Zeit.|at the weekend|на выходных|hafta sonu|на вихідних|في نهاية الأسبوع|週末に|în weekend|
Thema-3|C/D/Grammatik|von_montag_bis_freitag||von Montag bis Freitag|||phrase||Die Bibliothek ist von Montag bis Freitag geöffnet.|from Monday to Friday|с понедельника по пятницу|pazartesiden cumaya kadar|з понеділка до пʼятниці|من الاثنين إلى الجمعة|月曜日から金曜日まで|de luni până vineri|
Thema-4|C/E|intensivkurs|der|Intensivkurs|die Intensivkurse|-e|noun||Ich mache einen Intensivkurs.|intensive course|интенсивный курс|yoğun kurs|інтенсивний курс|دورة مكثفة|集中コース|curs intensiv|
Thema-4|C/E|anfangen||anfangen|||verb||Der Deutschkurs fängt morgen an.|to begin|начинаться / начинать|başlamak|починатися / починати|يبدأ|始まる / 始める|a începe|
Thema-4|C/E|enden||enden|||verb||Wann endet der Kurs?|to end|заканчиваться|bitmek|закінчуватися|ينتهي|終わる|a se termina|
Thema-4|C/E|party|die|Party|die Partys|-s|noun||Ich mache am Freitag eine Party.|party|вечеринка|parti|вечірка|حفلة|パーティー|petrecere|
Thema-4|C/E|fussball|der|Fußball||Sg.|noun||Ich spiele Fußball.|football / soccer|футбол|futbol|футбол|كرة القدم|サッカー|fotbal|
Thema-4|C/E|hausaufgabe|die|Hausaufgabe|die Hausaufgaben|-n|noun||Sina macht Hausaufgaben.|homework|домашнее задание|ev ödevi|домашнє завдання|واجب منزلي|宿題|temă pentru acasă|
Thema-4|C/E|mama|die|Mama|die Mamas|-s|noun||Tim ruft Mama an.|mom|мама|anne|мама|أمي|ママ / お母さん|mama|
Thema-4|C/E|kino|das|Kino|die Kinos|-s|noun||Am Abend geht er ins Kino.|cinema|кинотеатр|sinema|кінотеатр|سينما|映画館|cinema|
Thema-4|C/E|sport|der|Sport||Sg.|noun||Am Nachmittag macht Robert Sport.|sport|спорт|spor|спорт|رياضة|スポーツ|sport|
Thema-4|C/E|trinken||trinken|||verb|trinken|Er trinkt nur Kaffee.|to drink|пить|içmek|пити|يشرب|飲む|a bea|
Thema-4|C/E|pizza|die|Pizza|die Pizzen|-en|noun|pizza|Er isst eine Pizza.|pizza|пицца|pizza|піца|بيتزا|ピザ|pizza|
Thema-4|C/E|chatten||chatten|||verb||In der Nacht chattet Robert.|to chat|чатиться / переписываться|sohbet etmek|чатитися / переписуватися|يدردش|チャットする|a conversa pe chat|
Thema-4|C/E|geoeffnet||geöffnet|||adjective|oeffnen|Bis 17 Uhr geöffnet.|open|открыто|açık|відчинено|مفتوح|開いている|deschis|gleiches Bild wie öffnen
Thema-4|C/E|geschlossen||geschlossen|||adjective|schliessen|An Feiertagen ist die Bibliothek geschlossen.|closed|закрыто|kapalı|зачинено|مغلق|閉まっている|închis|gleiches Bild wie schließen
Thema-4|C/E|oeffnen||öffnen|||verb|oeffnen|Die Bibliothek öffnet um 13 Uhr.|to open|открывать|açmak|відчиняти / відкривати|يفتح|開ける / 開く|a deschide|
Thema-4|C/E|schliessen||schließen|||verb|schliessen|Die Praxis schließt um 16 Uhr 30.|to close|закрывать|kapatmak|зачиняти / закривати|يغلق|閉める / 閉まる|a închide|
Thema-4|C/E|termin|der|Termin|die Termine|-e|noun||Der Termin ist um 17 Uhr.|appointment|термин / встреча|randevu|зустріч / запис|موعد|予約 / 予定|programare|
Thema-4|C/E|kindergarten|der|Kindergarten|die Kindergärten|-/Umlaut|noun||Der Kindergarten ist bis 17 Uhr geöffnet.|kindergarten|детский сад|anaokulu|дитячий садок|روضة أطفال|幼稚園|grădiniță|
Thema-4|C/E|geschaeft|das|Geschäft|die Geschäfte|-er/Umlaut|noun|geschaeft|Am Samstag ist das Geschäft geöffnet.|shop / store|магазин|mağaza|магазин|متجر|店|magazin|
Thema-4|C/E|bibliothek|die|Bibliothek|die Bibliotheken|-en|noun||Die Bibliothek ist von Montag bis Freitag geöffnet.|library|библиотека|kütüphane|бібліотека|مكتبة|図書館|bibliotecă|
Thema-4|C/E|praxis|die|Praxis|die Praxen|-en|noun||Die Praxis schließt um 16 Uhr 30.|doctor's office / practice|практика / врачебный кабинет|muayenehane|лікарський кабінет / практика|عيادة|医院 / 診療所|cabinet medical|
Thema-4|C/E|kita|die|Kita|die Kitas|-s|noun||Tom und Luka gehen in die Kita.|daycare|детский сад|kreş|дитячий садок / ясла|حضانة|保育園|creșă / grădiniță|Kurzform von Kindertagesstätte
Thema-4|C/E|bringen||bringen|||verb|bringen|Um 7.15 Uhr bringt Vera die Kinder in die Kita.|to bring|приносить / приводить|getirmek|приносити / приводити|يحضر / يجلب|持ってくる / 連れてくる|a aduce|
Thema-4|C/E|abholen||abholen|||verb||Um 17 Uhr holt sie die Kinder ab.|to pick up|забирать|almak|забирати|يصطحب / يأخذ|迎えに行く|a lua / a ridica|
Thema-4|C/E|mehr||mehr|||adverb||Ich hätte gern mehr Zeit für mich.|more|больше|daha fazla|більше|أكثر|もっと|mai mult|
Thema-4|C/E|beispiel|das|Beispiel|die Beispiele|-e|noun||Das ist ein Beispiel.|example|пример|örnek|приклад|مثال|例|exemplu|
Thema-4|C/E|zum_beispiel||zum Beispiel|||phrase||Zum Beispiel möchte ich mal wieder ins Kino gehen.|for example|например|örneğin|наприклад|على سبيل المثال|例えば|de exemplu|Abkürzung: z. B.
Thema-4|C/E|wieder||wieder|||adverb||Ich möchte mal wieder ins Kino gehen.|again|снова|tekrar|знову|مرة أخرى|また|din nou|
Thema-4|C/E|freund|der|Freund|die Freunde|-e|noun||Mein Freund fragt: Hast du Zeit?|male friend / boyfriend|друг|arkadaş / erkek arkadaş|друг / хлопець|صديق|友達 / 彼氏|prieten / iubit|
Thema-4|C/E|freundin|die|Freundin|die Freundinnen|-nen|noun||Meine Freundin fragt: Hast du Zeit?|female friend / girlfriend|подруга|arkadaş / kız arkadaş|подруга / дівчина|صديقة|友達 / 彼女|prietenă / iubită|
Thema-4|C/E|fragen||fragen|||verb|fragen|Meine Freundinnen fragen: Wann hast du Zeit?|to ask|спрашивать|sormak|питати|يسأل|質問する / 尋ねる|a întreba|
Thema-4|C/E|antworten||antworten|||verb|antworten|Ich antworte: Heute nicht.|to answer|отвечать|cevap vermek|відповідати|يجيب|答える|a răspunde|
Thema-4|C/E|total||total|||adverb||Ich bin total fertig.|totally / very|совсем / очень|tamamen / çok|цілком / дуже|تمامًا / جدًا|完全に / とても|total / foarte|
`.trim();
function rowToWord(line){const c=line.split("|");const [part,section,id,article,word,plural,pluralGroup,type,imgKey,sentence,en,ru,tr,uk,ar,ja,ro,note]=c;const image=IMG[imgKey]||null;return {id,section,word,article,full:article?`${article} ${word}`:word,plural,pluralGroup,type,image,imageNeeded:!image,imageNote:note||"",sentence,note:note||"",tr:{en,ru,tr,uk,ar,ja,ro}}}
const lines=RAW.split(/\n+/).filter(Boolean);
const parts=Object.values(PARTS).map(p=>{const partWords=lines.filter(line=>line.startsWith(p.id+"|")).map(rowToWord);return {...p,words:partWords,wordCount:partWords.length,chips:partWords.slice(0,5).map(w=>w.word)}});
window.SP_A1_LEKTION5_WORTSCHATZ={level:"A1",lessonId:"A1-Lektion-5",lessonNumber:5,lessonTitle:"Mein Tag",standardLanguages:["en","ru","tr","uk","ar","ja","ro"],parts};
window.SP_A1_LEKTION5_WORDS=parts.flatMap(p=>p.words.map(w=>({...w,part:p.id,partLabel:p.label,partTitle:p.title})));
window.SP_A1_LEKTION5_MISSING_IMAGES=window.SP_A1_LEKTION5_WORDS.filter(w=>w.imageNeeded);
})();
