(function(){
'use strict';
if(window.__SP_L7T4_CARD_CONTENT_V1)return;
window.__SP_L7T4_CARD_CONTENT_V1=true;

const T=(en,ru,tr,uk,ar,ja,ro,pl,ku)=>({en,ru,tr,uk,ar,ja,ro,pl,ku});
const DATA={
 'mädchen':{type:'noun',plural:'die Mädchen',example:'Das Mädchen geht in die Klasse 3a.',tr:T('girl','девочка','kız','дівчинка','فتاة','女の子','fată','dziewczynka','keç')},
 'junge':{type:'noun',plural:'die Jungen',example:'Der Junge wartet vor der Schule.',tr:T('boy','мальчик','erkek çocuk','хлопчик','ولد','男の子','băiat','chłopiec','kur')},
 'klasse':{type:'noun',plural:'die Klassen',example:'Sara geht in die Klasse 3a.',tr:T('class','класс','sınıf','клас','صف','クラス','clasă','klasa','pol')},
 'schwimmbad':{type:'noun',plural:'die Schwimmbäder',example:'Die Klasse geht ins Schwimmbad.',tr:T('swimming pool','бассейн','yüzme havuzu','басейн','مسبح','プール','piscină','basen','hewza avjeniyê')},
 'eintritt':{type:'noun',plural:'die Eintritte',example:'Der Eintritt kostet drei Euro.',tr:T('admission / entrance fee','вход / плата за вход','giriş ücreti','вхід / плата за вхід','رسم الدخول','入場料','taxă de intrare','wstęp / opłata za wstęp','pereyê ketinê')},
 'grundschule':{type:'noun',plural:'die Grundschulen',example:'Das Kind geht in die Grundschule.',tr:T('primary school','начальная школа','ilkokul','початкова школа','مدرسة ابتدائية','小学校','școală primară','szkoła podstawowa','dibistana seretayî')},
 'unterricht':{type:'noun',plural:'kein Plural',example:'Der Unterricht beginnt um acht Uhr.',tr:T('lesson / class','урок / занятия','ders','урок / заняття','درس','授業','lecție / curs','lekcja / zajęcia','ders')},
 'leitung':{type:'noun',plural:'die Leitungen',example:'Die Leitung schreibt eine Information.',tr:T('management / person in charge','руководство','yönetim','керівництво','الإدارة','運営 / 責任者','conducere','kierownictwo','rêveberî')},
 'schule':{type:'noun',plural:'die Schulen',example:'Die Schule ist heute geschlossen.',tr:T('school','школа','okul','школа','مدرسة','学校','școală','szkoła','dibistan')},
 'arzt':{type:'noun',plural:'die Ärzte',example:'Wir gehen heute zum Arzt.',tr:T('doctor','врач','doktor','лікар','طبيب','医師','medic','lekarz','bijîşk')},
 'ärztin':{type:'noun',plural:'die Ärztinnen',example:'Meine Tochter hat einen Termin bei der Ärztin.',tr:T('female doctor','врач','kadın doktor','лікарка','طبيبة','女性医師','doctoriță','lekarka','bijîşka jin')},
 'schulausflug':{type:'noun',plural:'die Schulausflüge',example:'Der Schulausflug ist am Freitag.',tr:T('school trip','школьная экскурсия','okul gezisi','шкільна екскурсія','رحلة مدرسية','学校の遠足','excursie școlară','wycieczka szkolna','gerra dibistanê')},
 'schade':{type:'other',example:'Schade, Sara kann nicht mitkommen.',tr:T('what a pity','жаль','yazık','шкода','يا للأسف','残念','păcat','szkoda','mixabin')},
 'losfahren':{type:'verb',example:'Der Bus fährt um acht Uhr los.',tr:T('to set off / depart','отправляться','yola çıkmak','вирушати','ينطلق','出発する','a porni','wyruszać','rê ketin')},
 'zurückkommen':{type:'verb',example:'Wir kommen um 16 Uhr zurück.',tr:T('to come back','возвращаться','geri dönmek','повертатися','يعود','戻ってくる','a se întoarce','wracać','vegerîn')},
 'mitkommen':{type:'verb',example:'Kann dein Sohn mitkommen?',tr:T('to come along','пойти / поехать вместе','birlikte gelmek','піти / поїхати разом','يأتي مع الآخرين','一緒に来る','a veni împreună','iść / jechać razem','bi hev re hatin')},
 'krank':{type:'adjective',example:'Meine Tochter ist krank.',tr:T('ill / sick','больной / больная','hasta','хворий / хвора','مريض','病気の','bolnav / bolnavă','chory / chora','nexweş')},
 'bescheid sagen':{type:'phrase',example:'Ich sage der Lehrerin Bescheid.',tr:T('to let someone know / inform','сообщить / дать знать','haber vermek','повідомити / дати знати','يُبلغ','知らせる','a anunța','dać znać / poinformować','agahdar kirin')},
 'fehlen':{type:'verb',example:'Amir fehlt heute im Unterricht.',tr:T('to be absent / be missing','отсутствовать','eksik olmak / gelmemek','бути відсутнім','يغيب','欠席する','a lipsi','być nieobecnym','ne amade bûn')},
 'sich entschuldigen':{type:'verb',example:'Ich möchte mich entschuldigen.',tr:T('to apologize','извиняться','özür dilemek','вибачатися','يعتذر','謝る','a-și cere scuze','przepraszać','lêborîn xwestin')},
 'gute besserung':{type:'phrase',example:'Gute Besserung für Ihre Tochter!',tr:T('Get well soon!','Выздоравливайте!','Geçmiş olsun!','Одужуйте!','سلامتك!','お大事に！','Însănătoșire grabnică!','Szybkiego powrotu do zdrowia!','Bi lez baş bibe!')},
 'guten morgen hier spricht':{type:'phrase',example:'Guten Morgen, hier spricht Hassan Ali.',tr:T('Good morning, this is …','Доброе утро, говорит …','Günaydın, ben …','Добрий ранок, говорить …','صباح الخير، معك …','おはようございます、…です','Bună dimineața, sunt …','Dzień dobry, mówi …','Beyanî baş, ez … im')},
 'mein sohn heißt':{type:'phrase',example:'Mein Sohn heißt Karim.',tr:T("My son's name is …",'Моего сына зовут …','Oğlumun adı …','Мого сина звати …','اسم ابني …','息子の名前は…です','Pe fiul meu îl cheamă …','Mój syn ma na imię …','Navê kurê min … e')},
 'meine tochter heißt':{type:'phrase',example:'Meine Tochter heißt Sara.',tr:T("My daughter's name is …",'Мою дочь зовут …','Kızımın adı …','Мою доньку звати …','اسم ابنتي …','娘の名前は…です','Pe fiica mea o cheamă …','Moja córka ma na imię …','Navê keça min … e')},
 'er sie geht in die klasse':{type:'phrase',example:'Sie geht in die Klasse 3a.',tr:T('He/She is in class …','Он/Она учится в классе …','O … sınıfına gidiyor','Він/Вона навчається в класі …','هو/هي في الصف …','彼/彼女は…組です','El/Ea este în clasa …','On/Ona chodzi do klasy …','Ew di pola … de ye')},
 'mein kind kann heute nicht zur schule kommen':{type:'phrase',example:'Mein Kind kann heute nicht zur Schule kommen.',tr:T('My child cannot come to school today.','Мой ребёнок сегодня не может прийти в школу.','Çocuğum bugün okula gelemiyor.','Моя дитина сьогодні не може прийти до школи.','طفلي لا يستطيع الحضور إلى المدرسة اليوم.','子どもは今日学校に行けません。','Copilul meu nu poate veni astăzi la școală.','Moje dziecko nie może dziś przyjść do szkoły.','Zarokê min îro nikare were dibistanê.')},
 'wir gehen heute zum arzt':{type:'phrase',example:'Wir gehen heute zum Arzt.',tr:T('We are going to the doctor today.','Мы сегодня идём к врачу.','Bugün doktora gidiyoruz.','Ми сьогодні йдемо до лікаря.','سنذهب اليوم إلى الطبيب.','今日は医者に行きます。','Mergem astăzi la medic.','Idziemy dziś do lekarza.','Em îro diçin cem bijîşk.')},
 'das tut mir leid':{type:'phrase',example:'Das tut mir leid.',tr:T("I'm sorry.",'Мне жаль.','Üzgünüm.','Мені шкода.','أنا آسف / آسفة.','それは残念です。','Îmi pare rău.','Przykro mi.','Mixabin.')},
 'ich sage der lehrerin bescheid':{type:'phrase',example:'Ich sage Frau Müller Bescheid.',tr:T("I'll let the teacher know.",'Я сообщу учительнице.','Öğretmene haber veririm.','Я повідомлю вчительку.','سأُبلغ المعلمة.','先生に知らせます。','O anunț pe profesoară.','Dam znać nauczycielce.','Ez ê mamosteya jin agahdar bikim.')},
 'ich sage dem lehrer bescheid':{type:'phrase',example:'Ich sage Herrn Klein Bescheid.',tr:T("I'll let the teacher know.",'Я сообщу учителю.','Öğretmene haber veririm.','Я повідомлю вчителя.','سأُبلغ المعلم.','先生に知らせます。','Îl anunț pe profesor.','Dam znać nauczycielowi.','Ez ê mamoste agahdar bikim.')},
 'vielen dank für die information':{type:'phrase',example:'Vielen Dank für die Information.',tr:T('Thank you very much for the information.','Большое спасибо за информацию.','Bilgi için çok teşekkür ederim.','Дуже дякую за інформацію.','شكرًا جزيلاً على المعلومات.','情報をありがとうございます。','Vă mulțumesc mult pentru informație.','Dziękuję bardzo za informację.','Gelek spas ji bo agahiyê.')},
 'auf wiederhören':{type:'phrase',example:'Auf Wiederhören.',tr:T('Goodbye. (on the phone)','До свидания. (по телефону)','Hoşça kalın. (telefonda)','До побачення. (по телефону)','إلى اللقاء. (على الهاتف)','失礼します。','La revedere. (la telefon)','Do usłyszenia.','Bi xatirê te. (di telefonê de)')}
};
function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[„“”"'`´.,!?;:()\/…]+/g,' ').replace(/\s+/g,' ').trim()}
function keyFor(item){const values=[item?.full,item?.word,item?.answer,item?.term,item?.prompt,item?.label,item?.front].filter(Boolean);for(const value of values){const key=norm(value);if(DATA[key])return key}return''}
function cardTask(theme){return (theme?.tasks||[]).find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''))}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const cards=cardTask(theme);if(!cards)return theme;
 cards.id='karteikarten';cards.title='Karteikarten';cards.kind='cards';cards.description='Lern die Wörter.';
 (cards.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  const key=keyFor(item),entry=DATA[key];if(!entry)return;
  item.kind='cards';item.type=entry.type;item.category=entry.type;item.translations={...(item.translations&&typeof item.translations==='object'?item.translations:{}),...entry.tr};
  if(entry.plural&&!item.plural)item.plural=entry.plural;
  if(entry.example&&!item.example)item.example=entry.example;
 });
 theme.contentRevision='l7t4-card-standard-20260818-v1';window.L7_THEME=theme;return theme;
});
window.L7T4CardContent={data:DATA};
})();
