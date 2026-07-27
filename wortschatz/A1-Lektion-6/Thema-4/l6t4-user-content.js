(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data||data.__userRevision20260727)return;
data.__userRevision20260727=true;
const task=id=>(data.tasks||[]).find(item=>item.id===id);
const C=(prompt,answer,options,hint='',extra={})=>({kind:'choice',prompt,answer,options,hint,...extra});
const I=(prompt,answer,answers=[],hint='',extra={})=>({kind:'input',prompt,answer,answers,hint,...extra});
const D=(speaker,text,side='left')=>({speaker,text,side});

const T={
 en:{'der Hunger':'hunger','der Durst':'thirst','tanzen':'to dance','wandern':'to hike','schwimmen':'to swim','Gitarre spielen':'to play guitar','Freunde treffen':'to meet friends','Fahrrad fahren':'to ride a bicycle','stricken':'to knit','grillen':'to barbecue','das Hobby':'hobby','wichtig':'important','im Internet surfen':'to browse the internet','der Beruf':'profession','das Alter':'age','die Freizeit':'free time','der Spaß':'fun','dabeihaben':'to have with you','nur':'only','genau':'exactly','schon':'already','gucken':'to watch','noch':'still / another','toll':'great','glauben':'to believe','Ich glaube …':'I think …','Stimmt.':'That is right.','Oh, wie dumm!':'Oh, how unfortunate!','Na klar.':'Of course.','ganz sicher':'definitely','auf jeden Fall':'definitely','nächste Woche':'next week','nächstes Wochenende':'next weekend','nächsten Samstag':'next Saturday','der Würfel':'die','würfeln':'to roll the die','oft':'often','immer':'always','nie':'never','selten':'rarely','manchmal':'sometimes','leider':'unfortunately','es gibt':'there is / there are','vielleicht':'maybe','gleich':'in a moment','Moment mal.':'Wait a moment.','Guck mal.':'Look.','Sag mal.':'Tell me / say …','Kein Problem.':'No problem.','Ich weiß es nicht.':'I do not know.','besonders':'especially','Es macht Spaß.':'It is fun.'},
 ru:{'der Hunger':'голод','der Durst':'жажда','tanzen':'танцевать','wandern':'ходить в поход','schwimmen':'плавать','Gitarre spielen':'играть на гитаре','Freunde treffen':'встречаться с друзьями','Fahrrad fahren':'ездить на велосипеде','stricken':'вязать','grillen':'готовить на гриле','das Hobby':'хобби','wichtig':'важный','im Internet surfen':'сидеть в интернете','der Beruf':'профессия','das Alter':'возраст','die Freizeit':'свободное время','der Spaß':'удовольствие','dabeihaben':'иметь с собой','nur':'только','genau':'точно','schon':'уже','gucken':'смотреть','noch':'ещё','toll':'отличный','glauben':'думать / верить','Ich glaube …':'Я думаю …','Stimmt.':'Верно.','Oh, wie dumm!':'Вот досада!','Na klar.':'Конечно.','ganz sicher':'совершенно точно','auf jeden Fall':'в любом случае','nächste Woche':'на следующей неделе','nächstes Wochenende':'в следующие выходные','nächsten Samstag':'в следующую субботу','der Würfel':'игральная кость','würfeln':'бросать кубик','oft':'часто','immer':'всегда','nie':'никогда','selten':'редко','manchmal':'иногда','leider':'к сожалению','es gibt':'есть / имеется','vielleicht':'может быть','gleich':'сейчас / скоро','Moment mal.':'Подожди минутку.','Guck mal.':'Посмотри.','Sag mal.':'Скажи-ка.','Kein Problem.':'Без проблем.','Ich weiß es nicht.':'Я не знаю.','besonders':'особенно','Es macht Spaß.':'Это весело.'},
 uk:{'der Hunger':'голод','der Durst':'спрага','tanzen':'танцювати','wandern':'ходити в похід','schwimmen':'плавати','Gitarre spielen':'грати на гітарі','Freunde treffen':'зустрічатися з друзями','Fahrrad fahren':'їздити на велосипеді','stricken':'в’язати','grillen':'готувати на грилі','das Hobby':'хобі','wichtig':'важливий','im Internet surfen':'сидіти в інтернеті','der Beruf':'професія','das Alter':'вік','die Freizeit':'вільний час','der Spaß':'задоволення','dabeihaben':'мати із собою','nur':'лише','genau':'точно','schon':'вже','gucken':'дивитися','noch':'ще','toll':'чудовий','glauben':'думати / вірити','Ich glaube …':'Я думаю …','Stimmt.':'Правильно.','Oh, wie dumm!':'От халепа!','Na klar.':'Звичайно.','ganz sicher':'цілком точно','auf jeden Fall':'у будь-якому разі','nächste Woche':'наступного тижня','nächstes Wochenende':'наступними вихідними','nächsten Samstag':'наступної суботи','der Würfel':'гральний кубик','würfeln':'кидати кубик','oft':'часто','immer':'завжди','nie':'ніколи','selten':'рідко','manchmal':'іноді','leider':'на жаль','es gibt':'є','vielleicht':'можливо','gleich':'зараз / скоро','Moment mal.':'Зачекай хвилинку.','Guck mal.':'Подивись.','Sag mal.':'Скажи-но.','Kein Problem.':'Без проблем.','Ich weiß es nicht.':'Я не знаю.','besonders':'особливо','Es macht Spaß.':'Це весело.'},
 tr:{'der Hunger':'açlık','der Durst':'susuzluk','tanzen':'dans etmek','wandern':'doğa yürüyüşü yapmak','schwimmen':'yüzmek','Gitarre spielen':'gitar çalmak','Freunde treffen':'arkadaşlarla buluşmak','Fahrrad fahren':'bisiklete binmek','stricken':'örgü örmek','grillen':'mangal yapmak','das Hobby':'hobi','wichtig':'önemli','im Internet surfen':'internette gezinmek','der Beruf':'meslek','das Alter':'yaş','die Freizeit':'boş zaman','der Spaß':'eğlence','dabeihaben':'yanında bulundurmak','nur':'sadece','genau':'aynen / tam','schon':'zaten','gucken':'izlemek','noch':'hâlâ / bir tane daha','toll':'harika','glauben':'inanmak / düşünmek','Ich glaube …':'Bence …','Stimmt.':'Doğru.','Oh, wie dumm!':'Ne kötü!','Na klar.':'Tabii ki.','ganz sicher':'kesinlikle','auf jeden Fall':'her hâlükârda','nächste Woche':'gelecek hafta','nächstes Wochenende':'gelecek hafta sonu','nächsten Samstag':'gelecek cumartesi','der Würfel':'zar','würfeln':'zar atmak','oft':'sık sık','immer':'her zaman','nie':'asla','selten':'nadiren','manchmal':'bazen','leider':'maalesef','es gibt':'var','vielleicht':'belki','gleich':'hemen / birazdan','Moment mal.':'Bir dakika.','Guck mal.':'Bak.','Sag mal.':'Söylesene.','Kein Problem.':'Sorun değil.','Ich weiß es nicht.':'Bilmiyorum.','besonders':'özellikle','Es macht Spaß.':'Eğlenceli.'},
 ar:{'der Hunger':'الجوع','der Durst':'العطش','tanzen':'يرقص','wandern':'يتنزه سيرًا','schwimmen':'يسبح','Gitarre spielen':'يعزف الغيتار','Freunde treffen':'يلتقي بالأصدقاء','Fahrrad fahren':'يركب الدراجة','stricken':'يحيك','grillen':'يشوي','das Hobby':'الهواية','wichtig':'مهم','im Internet surfen':'يتصفح الإنترنت','der Beruf':'المهنة','das Alter':'العمر','die Freizeit':'وقت الفراغ','der Spaß':'المتعة','dabeihaben':'يحمل معه','nur':'فقط','genau':'بالضبط','schon':'بالفعل','gucken':'يشاهد','noch':'ما زال / أيضًا','toll':'رائع','glauben':'يعتقد','Ich glaube …':'أعتقد أن …','Stimmt.':'صحيح.','Oh, wie dumm!':'يا للأسف!','Na klar.':'طبعًا.','ganz sicher':'بالتأكيد','auf jeden Fall':'على كل حال','nächste Woche':'الأسبوع القادم','nächstes Wochenende':'عطلة نهاية الأسبوع القادمة','nächsten Samstag':'السبت القادم','der Würfel':'حجر النرد','würfeln':'يرمي النرد','oft':'غالبًا','immer':'دائمًا','nie':'أبدًا','selten':'نادرًا','manchmal':'أحيانًا','leider':'للأسف','es gibt':'يوجد','vielleicht':'ربما','gleich':'حالًا','Moment mal.':'لحظة من فضلك.','Guck mal.':'انظر.','Sag mal.':'قل لي.','Kein Problem.':'لا مشكلة.','Ich weiß es nicht.':'لا أعرف.','besonders':'خصوصًا','Es macht Spaß.':'هذا ممتع.'},
 ja:{'der Hunger':'空腹','der Durst':'のどの渇き','tanzen':'踊る','wandern':'ハイキングする','schwimmen':'泳ぐ','Gitarre spielen':'ギターを弾く','Freunde treffen':'友達に会う','Fahrrad fahren':'自転車に乗る','stricken':'編み物をする','grillen':'バーベキューをする','das Hobby':'趣味','wichtig':'大切な','im Internet surfen':'インターネットを見る','der Beruf':'職業','das Alter':'年齢','die Freizeit':'自由時間','der Spaß':'楽しさ','dabeihaben':'持っている','nur':'だけ','genau':'その通り','schon':'もう','gucken':'見る','noch':'まだ / もう一つ','toll':'すばらしい','glauben':'思う','Ich glaube …':'私は…と思います','Stimmt.':'その通りです。','Oh, wie dumm!':'それは残念！','Na klar.':'もちろん。','ganz sicher':'確実に','auf jeden Fall':'必ず','nächste Woche':'来週','nächstes Wochenende':'次の週末','nächsten Samstag':'次の土曜日','der Würfel':'さいころ','würfeln':'さいころを振る','oft':'よく','immer':'いつも','nie':'決して～ない','selten':'めったに～ない','manchmal':'ときどき','leider':'残念ながら','es gibt':'～がある','vielleicht':'たぶん','gleich':'すぐに','Moment mal.':'ちょっと待って。','Guck mal.':'見て。','Sag mal.':'ねえ。','Kein Problem.':'問題ありません。','Ich weiß es nicht.':'分かりません。','besonders':'特に','Es macht Spaß.':'楽しいです。'},
 ro:{'der Hunger':'foamea','der Durst':'setea','tanzen':'a dansa','wandern':'a face drumeții','schwimmen':'a înota','Gitarre spielen':'a cânta la chitară','Freunde treffen':'a se întâlni cu prietenii','Fahrrad fahren':'a merge cu bicicleta','stricken':'a tricota','grillen':'a face grătar','das Hobby':'hobby-ul','wichtig':'important','im Internet surfen':'a naviga pe internet','der Beruf':'profesia','das Alter':'vârsta','die Freizeit':'timpul liber','der Spaß':'distracția','dabeihaben':'a avea la sine','nur':'doar','genau':'exact','schon':'deja','gucken':'a se uita','noch':'încă','toll':'minunat','glauben':'a crede','Ich glaube …':'Cred că …','Stimmt.':'Așa este.','Oh, wie dumm!':'Ce păcat!','Na klar.':'Desigur.','ganz sicher':'cu siguranță','auf jeden Fall':'în orice caz','nächste Woche':'săptămâna viitoare','nächstes Wochenende':'weekendul viitor','nächsten Samstag':'sâmbăta viitoare','der Würfel':'zarul','würfeln':'a arunca zarul','oft':'des','immer':'întotdeauna','nie':'niciodată','selten':'rar','manchmal':'uneori','leider':'din păcate','es gibt':'există','vielleicht':'poate','gleich':'imediat','Moment mal.':'O clipă.','Guck mal.':'Uite.','Sag mal.':'Spune-mi.','Kein Problem.':'Nicio problemă.','Ich weiß es nicht.':'Nu știu.','besonders':'mai ales','Es macht Spaß.':'Este distractiv.'},
 pl:{'der Hunger':'głód','der Durst':'pragnienie','tanzen':'tańczyć','wandern':'wędrować','schwimmen':'pływać','Gitarre spielen':'grać na gitarze','Freunde treffen':'spotykać się z przyjaciółmi','Fahrrad fahren':'jeździć na rowerze','stricken':'robić na drutach','grillen':'grillować','das Hobby':'hobby','wichtig':'ważny','im Internet surfen':'surfować w internecie','der Beruf':'zawód','das Alter':'wiek','die Freizeit':'czas wolny','der Spaß':'zabawa','dabeihaben':'mieć przy sobie','nur':'tylko','genau':'dokładnie','schon':'już','gucken':'oglądać','noch':'jeszcze','toll':'świetny','glauben':'wierzyć / uważać','Ich glaube …':'Myślę, że …','Stimmt.':'Zgadza się.','Oh, wie dumm!':'Ale szkoda!','Na klar.':'Jasne.','ganz sicher':'na pewno','auf jeden Fall':'w każdym razie','nächste Woche':'w przyszłym tygodniu','nächstes Wochenende':'w przyszły weekend','nächsten Samstag':'w przyszłą sobotę','der Würfel':'kostka do gry','würfeln':'rzucać kostką','oft':'często','immer':'zawsze','nie':'nigdy','selten':'rzadko','manchmal':'czasami','leider':'niestety','es gibt':'jest / są','vielleicht':'może','gleich':'zaraz','Moment mal.':'Chwileczkę.','Guck mal.':'Spójrz.','Sag mal.':'Powiedz.','Kein Problem.':'Nie ma problemu.','Ich weiß es nicht.':'Nie wiem.','besonders':'szczególnie','Es macht Spaß.':'To jest fajne.'},
 ku:{'der Hunger':'birçîbûn','der Durst':'tîbûn','tanzen':'govend kirin','wandern':'meşîn li xwezayê','schwimmen':'avjenî kirin','Gitarre spielen':'gîtar lêxistin','Freunde treffen':'hevalan dîtin','Fahrrad fahren':'bi bisîkletê çûn','stricken':'tevn kirin','grillen':'goşt şewitandin','das Hobby':'hobî','wichtig':'girîng','im Internet surfen':'li înternetê gerîn','der Beruf':'pîşe','das Alter':'temen','die Freizeit':'dema vala','der Spaß':'kêf','dabeihaben':'bi xwe re hebûn','nur':'tenê','genau':'tam','schon':'jixwe','gucken':'temaşe kirin','noch':'hîn','toll':'pir baş','glauben':'bawer kirin','Ich glaube …':'Ez difikirim …','Stimmt.':'Rast e.','Oh, wie dumm!':'Çi mixabin!','Na klar.':'Bêguman.','ganz sicher':'bi temamî','auf jeden Fall':'di her şertî de','nächste Woche':'hefteya pêş','nächstes Wochenende':'daîreya hefteya pêş','nächsten Samstag':'şemiya pêş','der Würfel':'zar','würfeln':'zar avêtin','oft':'pir caran','immer':'her tim','nie':'qet','selten':'kêm caran','manchmal':'carinan','leider':'mixabin','es gibt':'heye','vielleicht':'belkî','gleich':'niha','Moment mal.':'Demekê raweste.','Guck mal.':'Binêre.','Sag mal.':'Bêje.','Kein Problem.':'Pirsgirêk tune.','Ich weiß es nicht.':'Ez nizanim.','besonders':'bi taybetî','Es macht Spaß.':'Kêfxweş e.'}
};
(data.vocabulary||[]).forEach(item=>{item.translations={};for(const [lang,map] of Object.entries(T))item.translations[lang]=map[item.word]||map[item.id]||''});

const countries=new Set(['Deutschland','Österreich','Schweiz','Türkei','Ukraine','Spanien','USA','Japan','Vietnam','Polen','Bulgarien','Frankreich','Rumänien']);
const directions=new Set(['Norden','Süden','Osten','Westen']);
window.L6T4PluralItems=(data.lesson6Nouns||[]).filter(item=>!countries.has(item.word)&&!directions.has(item.word)).map(item=>({...item,answer:item.noPlural?'kein Plural':item.plural}));

const sounds=(data.soundActivities||[]).map(row=>({activity:row.activity,file:row.file}));
const soundNames=sounds.map(row=>row.activity);
const rotate=(answer,index,count=4)=>{const others=soundNames.filter(x=>x!==answer);const shift=index%Math.max(1,others.length);return [answer,...others.slice(shift).concat(others.slice(0,shift)).slice(0,count-1)]};
const soundItems=[];
sounds.forEach((row,index)=>soundItems.push({kind:'audio-choice',phase:'choice',prompt:'Welche Aktivität hörst du?',answer:row.activity,options:rotate(row.activity,index),audioFile:row.file,hint:'Höre das Geräusch noch einmal.'}));
sounds.forEach(row=>soundItems.push({kind:'audio-produce',phase:'produce',prompt:'Welche Aktivität hörst du?',answer:row.activity,answers:[String(row.activity).replace(/^die\s+/i,'')],audioFile:row.file,hint:'Sprich oder schreibe die Aktivität.'}));
Object.assign(task('sound-activity'),{title:'Hören und Erkennen',description:'Höre die Geräusche und erkenne die Aktivitäten.',instruction:'Höre und erkenne die Aktivität. Bearbeite zuerst alle Auswahlaufgaben. Danach sprich oder schreibe die Aktivitäten.',kind:'sound-sequence',items:soundItems});

Object.assign(task('cards'),{title:'Karteikarten',description:'Lerne die Wörter.',instruction:'Lerne die Wörter.'});
Object.assign(task('image-word'),{description:'Finde das Wort.',instruction:'Finde das Wort.'});
Object.assign(task('word-image'),{description:'Finde das Wort.',instruction:'Finde das Wort.'});
Object.assign(task('listen-image'),{description:'Höre das Wort und finde das Bild.',instruction:'Höre das Wort und wähle das passende Bild.'});
Object.assign(task('article'),{title:'Artikel',description:'Wähle den passenden Artikel.',instruction:'Wähle den passenden Artikel.'});
Object.assign(task('plural'),{title:'Plural',description:'Bilde die Pluralform mit Artikel.',instruction:'Sieh oder höre das Nomen. Sprich oder schreibe die Pluralform mit Artikel. Bei Nomen ohne Plural: kein Plural.'});
Object.assign(task('noun-verb'),{title:'Nomen-Verb-Verbindungen',description:'Finde das passende Verb.',instruction:'Finde das passende Verb.'});

const phraseRows=[
 ['Kommst du am Samstag mit ins Kino?','Na klar.',['Na klar.','Das Wetter ist blau.','Mein Beruf ist Koch.','Ich trinke den Tisch.']],
 ['Ich habe den Würfel zu Hause vergessen.','Kein Problem.',['Kein Problem.','Der Film ist um acht.','Ich bin 30 Jahre alt.','Gitarre ist ein Beruf.']],
 ['Der Bus ist schon weg.','Oh, wie dumm!',['Oh, wie dumm!','Na klar, der Salat.','Mein Hobby sind 20 Uhr.','Guck mal, ich schwimme nie ein Buch.']],
 ['Der neue Film ist wirklich toll.','Stimmt.',['Stimmt.','Moment mal, ich bin ein Beruf.','Der Würfel trinkt.','Nächste Woche ist blau.']],
 ['Wann beginnt das Konzert?','Ich weiß es nicht.',['Ich weiß es nicht.','Na klar, ich bin 32 Jahre.','Oh, wie dumm, der Tisch.','Es macht Durst.']],
 ['Kommst du nächste Woche zum Grillen?','Vielleicht.',['Vielleicht.','Der Beruf ist fünf Uhr.','Ich schwimme ein Buch.','Stimmt, die Farbe arbeitet.']],
 ['Ich komme heute zehn Minuten später.','Kein Problem.',['Kein Problem.','Ich bin ein Fahrrad.','Der Kaffee spielt Gitarre.','Nie ist mein Beruf.']],
 ['Spielst du nicht gern Tennis?','Doch, sehr gern.',['Doch, sehr gern.','Nein, sehr gern nicht ja.','Der Film hat 30 Jahre.','Die Gitarre trinkt Wasser.']],
 ['Macht dir Tanzen Spaß?','Ja, es macht Spaß.',['Ja, es macht Spaß.','Der Samstag ist ein Beruf.','Ich esse das Internet.','Die Farbe fährt Fahrrad.']],
 ['Ist das dein Lieblingsfilm?','Ja, genau.',['Ja, genau.','Die Musik ist 18 Uhr alt.','Ich grille das Buch.','Der Würfel ist eine Woche.']],
 ['Hast du den Würfel dabei?','Na klar.',['Na klar.','Ich wohne im Salat.','Das Wetter liest ein Buch.','Meine Farbe ist 20 Jahre.']],
 ['Ich glaube, Nina kommt erst um acht.','Kein Problem, wir haben Zeit.',['Kein Problem, wir haben Zeit.','Der Würfel ist Verkäufer.','Ich trinke das Kino.','Die Gitarre ist morgen blau.']],
 ['Wo ist mein Buch?','Guck mal. Es liegt auf dem Tisch.',['Guck mal. Es liegt auf dem Tisch.','Na klar, ich bin ein Film.','Der Tisch schwimmt.','Auf jeden Fall ist Hunger rot.']],
 ['Kannst du mir bitte die Telefonnummer schicken?','Moment mal.',['Oh, wie dumm!','Moment mal.','Guck mal.','Stimmt.']],
 ['Wir spielen nach dem Essen noch zusammen.','Es macht Spaß.',['Es macht Spaß.','Ich weiß es nicht, der Beruf.','Moment mal, die Farbe trinkt.','Leider ist das Buch ein Samstag.']]
];
const phraseItems=phraseRows.map((row,index)=>C('Wähle die passende Antwort.',row[1],row[2],'Wähle die einzige Antwort, die zur Situation passt.',{dialog:[D(index%2?'Mara':'Anna',row[0])]}));
Object.assign(task('phrases'),{title:'Reagieren',description:'Wähle die passende Antwort.',instruction:'Wähle die passende Antwort.',items:phraseItems});

const reactionRows=[
 ['Kommst du am Samstag mit ins Kino?','l6t4-reaktion-01.mp3','Na klar.',['Ja, gern.','Na klar, gern.']],
 ['Ich habe deinen Würfel vergessen.','l6t4-reaktion-02.mp3','Kein Problem.',['Das ist kein Problem.']],
 ['Der Bus ist schon weg.','l6t4-reaktion-03.mp3','Oh, wie dumm!',[]],
 ['Der Film ist wirklich toll.','l6t4-reaktion-04.mp3','Stimmt.',['Ja, das stimmt.']],
 ['Wann beginnt der Film?','l6t4-reaktion-05.mp3','Ich weiß es nicht.',['Das weiß ich nicht.']],
 ['Kommst du nächste Woche zum Grillen?','l6t4-reaktion-06.mp3','Vielleicht.',['Vielleicht komme ich.']],
 ['Spielst du nicht gern Tennis?','l6t4-reaktion-07.mp3','Doch, sehr gern.',['Doch, ich spiele sehr gern Tennis.']],
 ['Macht dir Tanzen Spaß?','l6t4-reaktion-08.mp3','Ja, es macht Spaß.',['Es macht Spaß.']],
 ['Hast du den Würfel dabei?','l6t4-reaktion-09.mp3','Na klar.',['Ja, natürlich.','Ja, ich habe ihn dabei.']],
 ['Ich komme zehn Minuten später.','l6t4-reaktion-10.mp3','Kein Problem.',['Das ist kein Problem.']],
 ['Du hast heute keine Zeit, oder?','l6t4-reaktion-11.mp3','Doch, ich habe Zeit.',['Doch, heute habe ich Zeit.']],
 ['Ist das dein Lieblingsfilm?','l6t4-reaktion-12.mp3','Ja, genau.',['Ja, das ist mein Lieblingsfilm.']],
 ['Hast du morgen Zeit?','l6t4-reaktion-13.mp3','Vielleicht.',['Vielleicht habe ich Zeit.']],
 ['Kannst du mir die Telefonnummer schicken?','l6t4-reaktion-14.mp3','Moment mal.',['Einen Moment.','Moment mal, bitte.']],
 ['Möchtest du noch einen Kaffee?','l6t4-reaktion-15.mp3','Nein, danke.',['Nein, vielen Dank.']]
];
const reactionItems=reactionRows.map(([spoken,audioFile,answer,answers])=>({kind:'audio-reaction',prompt:'',spoken,audioFile,answer,answers,hint:'Antworte passend.'}));
Object.assign(task('phrase-reaction'),{title:'Hören und Reagieren',description:'Höre die Person und antworte passend.',instruction:'Höre die Person und antworte passend. Du kannst schreiben oder sprechen.',items:reactionItems});

const nehmenRows=[
 ['Ich ___ einen Tee.','nehme',['nehme','neme','nimmt','nehmt']],
 ['Was ___ du?','nimmst',['nimmst','nimst','nehme','nehmen']],
 ['Mara ___ nur Wasser.','nimmt',['nimmt','nimt','nehmen','nehmt']],
 ['Wir ___ zwei Portionen.','nehmen',['nehmen','nemmen','nehme','nimmt']],
 ['Was ___ ihr?','nehmt',['nehmt','nemt','nimmt','nehmen']],
 ['Die Gäste ___ Kaffee.','nehmen',['nehmen','nemmen','nehme','nehmt']],
 ['Thomas ___ einen Salat.','nimmt',['nimmt','nimt','nehme','nehmen']],
 ['Du ___ den Würfel.','nimmst',['nimmst','nimst','nimmt','nehmt']],
 ['Frau Klein ___ eine Cola.','nimmt',['nimmt','nimt','nehmen','nehme']],
 ['Anna und Leo ___ Pommes.','nehmen',['nehmen','nemmen','nimmt','nehmt']],
 ['Ich ___ heute das Fahrrad.','nehme',['nehme','neme','nehmen','nimmt']],
 ['Ihr ___ die Getränke.','nehmt',['nehmt','nemt','nimmst','nehmen']],
 ['Was ___ Maria und Tim?','nehmen',['nehmen','nemmen','nimmt','nehme']],
 ['Der Mann ___ das Buch.','nimmt',['nimmt','nimt','nehmt','nehmen']],
 ['Du und ich ___ einen Kaffee.','nehmen',['nehmen','nehme','nemmen','nehmt']]
];
Object.assign(task('nehmen'),{title:'Verb „nehmen“',description:'Finde die richtige Form von „nehmen“.',instruction:'Was ist die richtige Form von „nehmen“?',items:nehmenRows.map(([prompt,answer,options])=>C(prompt,answer,options,'Achte auf das Subjekt und auf h oder mm.'))});
Object.assign(task('yes-no-doch'),{title:'Ja, Nein oder Doch',description:'Wähle die passende Antwort.',instruction:'Wähle die passende Antwort.'});
Object.assign(task('doch-answer'),{title:'Doch',description:'Widersprich der Aussage.',instruction:'Antworte auf die Aussage. Widersprich immer der Aussage.',instructionExample:'<div class="example-box"><b>Beispiel</b><br>Aussage: Anna und Tom gucken keinen Film.<br>Antwort: Doch, Anna und Tom gucken einen Film.<br>Oder: Doch, sie gucken einen Film.</div>'});

const dialogs=[
 {id:'ctx1',lines:[D('Anna','Am Samstag arbeite ich bis 14 Uhr. Danach treffe ich Lea im Café. Am Sonntag möchte ich wandern, aber nur wenn es nicht regnet.'),D('Daniel','Ich habe am Samstag keine Zeit. Am Sonntag fahre ich morgens Fahrrad. Bei Regen bleibe ich zu Hause und lese einen Krimi.','right')]},
 {id:'ctx2',lines:[D('Mara','Der Film beginnt um 19 Uhr. Ich komme direkt von der Arbeit und schaffe es vielleicht erst um Viertel nach sieben.'),D('Tim','Kein Problem. Ich kaufe die Karten. Bring bitte deinen Würfel für später mit.','right'),D('Mara','Den Würfel habe ich schon in meiner Tasche.')]},
 {id:'ctx3',lines:[D('Sofia','Ich spiele nicht Gitarre, aber ich höre jeden Tag Musik. Am Freitag möchte ich zu deinem Konzert kommen.'),D('Paul','Das Konzert ist leider am Donnerstag. Am Freitag übe ich mit meiner Gruppe.','right'),D('Sofia','Dann komme ich am Donnerstag.')]},
 {id:'ctx4',lines:[D('Lea','Nächsten Samstag soll es regnen. Wollen wir lieber am Sonntag grillen?'),D('Omar','Am Sonntag besuche ich meine Eltern. Wir können am Samstag in meiner Küche kochen.','right'),D('Lea','Gut. Ich bringe Salat und Brot mit.')]},
 {id:'ctx5',lines:[D('Nina','Ich mag Krimis, aber der neue Film dauert fast drei Stunden. Das ist mir heute zu lang.'),D('Jonas','Dann sehen wir die kurze Komödie. Sie beginnt zwanzig Minuten später.','right'),D('Nina','Gut, dann habe ich vorher noch Zeit für einen Kaffee.')]}];
const byId=id=>dialogs.find(dialog=>dialog.id===id).lines;
const rfRows=[
 ['ctx1','Anna hat am Samstag zuerst Arbeit und danach Freizeit.','Richtig'],['ctx1','Daniel geht bei Regen Fahrrad fahren.','Falsch'],['ctx1','Das Wetter ist für die Pläne am Sonntag wichtig.','Richtig'],
 ['ctx2','Mara kommt pünktlich zum Film.','Falsch'],['ctx2','Tim kann die Karten vor Mara kaufen.','Richtig'],['ctx2','Nach dem Film wollen sie noch spielen.','Richtig'],
 ['ctx3','Sofia spielt in der Gruppe.','Falsch'],['ctx3','Sofia kommt am Donnerstag zum Konzert.','Richtig'],['ctx3','Paul übt am Freitag mit anderen Musikern.','Richtig'],
 ['ctx4','Lea und Omar kochen am Samstag zusammen.','Richtig'],['ctx4','Omar hat am Sonntag Zeit zum Grillen.','Falsch'],['ctx4','Lea bringt etwas zum Essen mit.','Richtig'],
 ['ctx5','Nina und Jonas sehen heute den kürzeren Film.','Richtig'],['ctx5','Nina mag keine Krimis.','Falsch'],['ctx5','Nina kann vor dem Film noch Kaffee trinken.','Richtig']
];
Object.assign(task('dialog-rf'),{title:'Dialoge – richtig oder falsch',description:'Lies den Dialog und antworte richtig oder falsch.',instruction:'Lies den Dialog und antworte: richtig oder falsch.',items:rfRows.map(([id,prompt,answer])=>C(prompt,answer,['Richtig','Falsch'],'Denke an den ganzen Dialog.',{dialog:byId(id)}))});

const abcRows=[
 ['ctx1','Wann trifft Anna Lea?','Nach der Arbeit.',['Vor der Arbeit.','Nach der Arbeit.','Am Sonntagmorgen.']],
 ['ctx1','Was macht Daniel bei Regen?','Er bleibt zu Hause und liest.',['Er fährt Fahrrad.','Er bleibt zu Hause und liest.','Er trifft Lea.']],
 ['ctx1','Was haben Anna und Daniel am Sonntag?','Beide haben einen Plan.',['Beide haben einen Plan.','Beide müssen arbeiten.','Beide gehen ins Café.']],
 ['ctx2','Warum kauft Tim die Karten?','Mara kommt vielleicht später.',['Mara kommt vielleicht später.','Tim hat den Würfel vergessen.','Der Film beginnt morgen.']],
 ['ctx2','Was soll Mara mitbringen?','Den Würfel.',['Die Karten.','Den Würfel.','Einen Kaffee.']],
 ['ctx2','Was möchten sie später machen?','Zusammen spielen.',['Zusammen spielen.','Zur Arbeit gehen.','Fahrrad fahren.']],
 ['ctx3','Wer spielt in einer Gruppe?','Paul.',['Sofia.','Paul.','Beide.']],
 ['ctx3','Wann kommt Sofia zum Konzert?','Am Donnerstag.',['Am Donnerstag.','Am Freitag.','Am Samstag.']],
 ['ctx3','Warum passt Freitag nicht?','Paul übt mit seiner Gruppe.',['Sofia arbeitet.','Paul übt mit seiner Gruppe.','Das Konzert ist am Samstag.']],
 ['ctx4','Was machen Lea und Omar am Samstag?','Sie kochen zusammen.',['Sie grillen draußen.','Sie kochen zusammen.','Sie besuchen Eltern.']],
 ['ctx4','Warum passt Sonntag nicht?','Omar besucht seine Eltern.',['Omar besucht seine Eltern.','Lea muss arbeiten.','Es gibt kein Brot.']],
 ['ctx4','Was bringt Lea mit?','Salat und Brot.',['Salat und Brot.','Nur Wasser.','Eine Gitarre.']],
 ['ctx5','Warum wählen sie die Komödie?','Der Krimi ist Nina heute zu lang.',['Der Krimi ist Nina heute zu lang.','Nina mag keine Filme.','Die Komödie beginnt früher.']],
 ['ctx5','Was kann Nina vor dem Film machen?','Einen Kaffee trinken.',['Arbeiten.','Einen Kaffee trinken.','Wandern.']],
 ['ctx5','Was passt zu Nina?','Sie mag Krimis, möchte heute aber einen kurzen Film.',['Sie mag keine Krimis.','Sie möchte heute drei Stunden Film sehen.','Sie mag Krimis, möchte heute aber einen kurzen Film.']]
];
Object.assign(task('dialog-abc'),{title:'Dialoge',description:'Lies den Dialog und entscheide A, B oder C.',instruction:'Lies den Dialog und entscheide: A, B oder C.',items:abcRows.map(([id,prompt,answer,options])=>C(prompt,answer,options,'Nutze den Sinn und Zusammenhang.',{dialog:byId(id),abc:true}))});
Object.assign(task('gaps'),{title:'Dialoge ergänzen',description:'Wähle die passende Reaktion für die Lücke.',instruction:'Wähle die passende Reaktion für die Lücke im Dialog.'});
Object.assign(task('listen-abc'),{title:'Hören und Verstehen',description:'Höre den Dialog und markiere A, B oder C.',instruction:'Höre den Dialog und markiere A, B oder C.'});
(task('listen-abc')?.items||[]).forEach(item=>item.abc=true);

const findenRows=[
 ['Ich finde meinen Schlüssel nicht.','Aktivität'],['Ich finde den Film toll.','Meinung'],['Mara findet ihr Buch unter dem Tisch.','Aktivität'],['Wie findest du das Lied?','Meinung'],['Tim findet sein Fahrrad vor der Schule.','Aktivität'],['Wir finden Grillen toll.','Meinung'],['Wo finde ich die Informationen?','Aktivität'],['Ich finde den Beruf interessant.','Meinung'],['Anna findet ihren Würfel in der Tasche.','Aktivität'],['Wie findest du das Wetter heute?','Meinung'],['Paul findet seine Freunde im Park.','Aktivität'],['Ich finde Wandern sehr schön.','Meinung'],['Lea findet die Gitarre im Zimmer.','Aktivität'],['Wie findet Maria den Krimi?','Meinung'],['Omar findet sein Buch nicht.','Aktivität']
];
const findenOptions=[{label:'Meinung',image:'finden-meinung.webp'},{label:'Aktivität',image:'finden-entdecken.webp'}];
Object.assign(task('finden'),{title:'Bedeutungen von „finden“',description:'Unterscheide Meinung und Aktivität.',instructionHtml:'Lies den Satz und entscheide: Geht es hier um <b>Meinung</b> oder um <b>Aktivität</b>?',items:findenRows.map(([prompt,answer])=>({kind:'image-choice',prompt,answer,options:findenOptions,hint:'Achte auf die Bedeutung von „finden“.',meaningImages:true}))});
Object.assign(task('questions'),{title:'Hobbys und Lieblingssachen',description:'Lies die Frage und finde die passende Antwort.',instruction:'Lies die Frage und finde die passende Antwort.'});
(task('questions')?.items||[]).forEach(item=>item.abc=true);

const hobbyItems=[
 C('Antwort: Mein Hobby ist Schwimmen.','Was ist dein Hobby?',['Was ist dein Hobby?','Was sind deine Hobbys?','Was ist dein Beruf?'],'Achte auf ein Hobby.'),
 C('Frage: Was sind deine Hobbys?','Meine Hobbys sind Schwimmen und Wandern.',['Mein Hobby ist Schwimmen.','Meine Hobbys sind Schwimmen und Wandern.','Meine Hobbys ist Schwimmen.','Mein Hobby sind Schwimmen und Wandern.'],'Achte auf Plural.'),
 C('Antwort: Meine Hobbys sind Lesen und Tanzen.','Was sind deine Hobbys?',['Was ist dein Hobby?','Was sind deine Hobbys?','Was ist deine Lieblingsfarbe?'],'Achte auf mehrere Hobbys.'),
 C('Frage: Was ist dein Hobby?','Mein Hobby ist Stricken.',['Mein Hobby ist Stricken.','Meine Hobbys sind Stricken.','Mein Hobby sind Stricken.','Meine Hobby ist Stricken.'],'Achte auf Singular.'),
 C('Antwort: Mein Lieblingsfilm ist ein Krimi.','Was ist dein Lieblingsfilm?',['Was ist dein Lieblingsfilm?','Was sind deine Lieblingsfilme?','Was ist dein Lieblingsbuch?'],'Achte auf eine Lieblingssache.'),
 C('Frage: Was sind deine Lieblingsfilme?','Meine Lieblingsfilme sind zwei Krimis.',['Mein Lieblingsfilm ist zwei Krimis.','Meine Lieblingsfilme sind zwei Krimis.','Meine Lieblingsfilme ist ein Krimi.','Mein Lieblingsfilme sind zwei Krimis.'],'Achte auf Plural.'),
 C('Antwort: Meine Lieblingsfarben sind Blau und Grün.','Was sind deine Lieblingsfarben?',['Was ist deine Lieblingsfarbe?','Was sind deine Lieblingsfarben?','Welche Musik hörst du?'],'Achte auf mehrere Farben.'),
 C('Frage: Was ist deine Lieblingsfarbe?','Meine Lieblingsfarbe ist Blau.',['Meine Lieblingsfarbe ist Blau.','Meine Lieblingsfarben sind Blau.','Mein Lieblingsfarbe ist Blau.','Meine Lieblingsfarbe sind Blau.'],'Achte auf Singular.'),
 C('Antwort: Mein Lieblingsbuch ist „Momo“.','Was ist dein Lieblingsbuch?',['Was ist dein Lieblingsbuch?','Was sind deine Lieblingsbücher?','Was ist dein Beruf?'],'Achte auf ein Buch.'),
 C('Frage: Was sind deine Lieblingsbücher?','Meine Lieblingsbücher sind „Momo“ und „Tschick“.',['Mein Lieblingsbuch ist „Momo“ und „Tschick“.','Meine Lieblingsbücher sind „Momo“ und „Tschick“.','Meine Lieblingsbücher ist „Momo“.','Mein Lieblingsbücher sind zwei Bücher.'],'Achte auf Plural.'),
 C('Antwort: Mein Hobby ist Fahrradfahren.','Was ist dein Hobby?',['Was ist dein Hobby?','Was sind deine Hobbys?','Wie alt bist du?'],'Achte auf ein Hobby.'),
 C('Frage: Was sind deine Hobbys?','Meine Hobbys sind Gitarrespielen und Schwimmen.',['Mein Hobby ist Gitarrespielen.','Meine Hobbys sind Gitarrespielen und Schwimmen.','Meine Hobby sind Gitarrespielen.','Mein Hobbys ist Schwimmen.'],'Achte auf mehrere Hobbys.'),
 C('Antwort: Meine Hobbys sind Grillen, Lesen und Wandern.','Was sind deine Hobbys?',['Was ist dein Hobby?','Was sind deine Hobbys?','Was machst du beruflich?'],'Achte auf mehrere Aktivitäten.'),
 C('Frage: Was ist dein Lieblingshobby?','Mein Lieblingshobby ist Tanzen.',['Mein Lieblingshobby ist Tanzen.','Meine Lieblingshobbys sind Tanzen.','Mein Lieblingshobby sind Tanzen.','Meine Lieblingshobby ist Tanzen.'],'Achte auf Singular.'),
 C('Antwort: Meine Lieblingshobbys sind Tanzen und Schwimmen.','Was sind deine Lieblingshobbys?',['Was ist dein Lieblingshobby?','Was sind deine Lieblingshobbys?','Was ist dein Lieblingsfilm?'],'Achte auf mehrere Lieblingshobbys.')
];
Object.assign(task('singular-plural'),{title:'Hobby',description:'Wähle die richtige Frage oder Antwort.',instruction:'Wähle die richtige Antwort.',items:hobbyItems});

const desiredOrder=['cards','image-word','word-image','listen-image','article','plural','sound-activity','noun-verb','nehmen','yes-no-doch','doch-answer','dialog-rf','dialog-abc','phrases','gaps','listen-abc','phrase-reaction','finden','questions','singular-plural','exam'];
data.tasks.sort((a,b)=>desiredOrder.indexOf(a.id)-desiredOrder.indexOf(b.id));
window.L6T4_USER_META=[
 ['cards','1','Karteikarten','🃏','Lerne die Wörter.'],['image-word','2','Bedeutung → Wort','💡','Finde das Wort.'],['word-image','3','Bild → Wort','🖼️','Finde das Wort.'],['listen-image','4','Hören → Bild','🎧','Höre das Wort und finde das Bild.'],['article','5','Artikel','der','Wähle den passenden Artikel.'],['plural','6','Plural','🎤','Bilde die Pluralform mit Artikel.','plural-sprechen.html'],['sound-activity','7','Hören und Erkennen','🔉','Höre und erkenne die Aktivität.'],['noun-verb','8','Nomen-Verb-Verbindungen','↔️','Finde das passende Verb.'],['nehmen','9','Verb „nehmen“','☕','Finde die richtige Form von „nehmen“.'],['yes-no-doch','10','Ja, Nein oder Doch','↩️','Wähle die passende Antwort.'],['doch-answer','11','Doch','DOCH','Widersprich der Aussage.'],['dialog-rf','12','Dialoge – richtig oder falsch','✓✗','Lies den Dialog und entscheide.'],['dialog-abc','13','Dialoge','ABC','Lies den Dialog und entscheide A, B oder C.'],['phrases','14','Reagieren','💬','Wähle die passende Antwort.'],['gaps','15','Dialoge ergänzen','▤','Ergänze den Dialog.'],['listen-abc','16','Hören und Verstehen','🎧','Höre den Dialog und entscheide A, B oder C.'],['phrase-reaction','17','Hören und Reagieren','🎧💬','Höre und antworte passend.'],['finden','18','Bedeutungen von „finden“','🔍','Unterscheide Meinung und Aktivität.'],['questions','19','Hobbys und Lieblingssachen','❓','Finde die passende Antwort.'],['singular-plural','20','Hobby','1↔2','Wähle die richtige Frage oder Antwort.'],['exam','21','Themenprüfung','⭐','Zeige, was du gelernt hast.']
].map(([id,number,title,icon,description,external])=>({id,number,title,icon,description,external}));
})();