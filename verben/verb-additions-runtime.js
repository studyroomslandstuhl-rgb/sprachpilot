(function(){
'use strict';
const E=window.VerbGroupsEngine;
if(!E||E.__requestedVerbSupport)return;
E.__requestedVerbSupport=true;
const NEW=new Set(window.SP_ADDED_VERBS||[]);
const REF=new Set(['sich bewegen','sich konzentrieren','sich kümmern','sich interessieren','sich erinnern','sich anziehen','sich ausziehen','sich umziehen','sich duschen','sich freuen','sich ärgern','sich beschweren','sich überlegen']);
const DAT_REF=new Set(['sich überlegen']);
const SEP={
 'hinweisen':['weisen','hin'],'auffallen':['fallen','auf'],'einfallen':['fallen','ein'],'hinzufügen':['fügen','hin'],'spazieren gehen':['gehen','spazieren'],
 'sich anziehen':['ziehen','an'],'sich ausziehen':['ziehen','aus'],'sich umziehen':['ziehen','um']
};
const FORMS={
 'bieten':['biete','bietest','bietet','bieten','bietet','bieten'],
 'bitten':['bitte','bittest','bittet','bitten','bittet','bitten'],
 'nennen':['nenne','nennst','nennt','nennen','nennt','nennen'],
 'sitzen':['sitze','sitzt','sitzt','sitzen','sitzt','sitzen'],
 'treiben':['treibe','treibst','treibt','treiben','treibt','treiben'],
 'binden':['binde','bindest','bindet','binden','bindet','binden'],
 'brennen':['brenne','brennst','brennt','brennen','brennt','brennen'],
 'erschrecken':['erschrecke','erschrickst','erschrickt','erschrecken','erschreckt','erschrecken'],
 'fliehen':['fliehe','fliehst','flieht','fliehen','flieht','fliehen'],
 'fließen':['fließe','fließt','fließt','fließen','fließt','fließen'],
 'frieren':['friere','frierst','friert','frieren','friert','frieren'],
 'gelingen':['gelinge','gelingst','gelingt','gelingen','gelingt','gelingen'],
 'gelten':['gelte','giltst','gilt','gelten','geltet','gelten'],
 'geschehen':['geschehe','geschiehst','geschieht','geschehen','gescheht','geschehen'],
 'gleichen':['gleiche','gleichst','gleicht','gleichen','gleicht','gleichen'],
 'heben':['hebe','hebst','hebt','heben','hebt','heben'],
 'klingen':['klinge','klingst','klingt','klingen','klingt','klingen'],
 'leiden':['leide','leidest','leidet','leiden','leidet','leiden'],
 'leihen':['leihe','leihst','leiht','leihen','leiht','leihen'],
 'meiden':['meide','meidest','meidet','meiden','meidet','meiden'],
 'reiben':['reibe','reibst','reibt','reiben','reibt','reiben'],
 'schaffen':['schaffe','schaffst','schafft','schaffen','schafft','schaffen'],
 'scheiden':['scheide','scheidest','scheidet','scheiden','scheidet','scheiden'],
 'scheinen':['scheine','scheinst','scheint','scheinen','scheint','scheinen'],
 'schießen':['schieße','schießt','schießt','schießen','schießt','schießen'],
 'schmeißen':['schmeiße','schmeißt','schmeißt','schmeißen','schmeißt','schmeißen'],
 'senden':['sende','sendest','sendet','senden','sendet','senden'],
 'treten':['trete','trittst','tritt','treten','tretet','treten'],
 'verzeihen':['verzeihe','verzeihst','verzeiht','verzeihen','verzeiht','verzeihen'],
 'weisen':['weise','weist','weist','weisen','weist','weisen'],
 'wiegen':['wiege','wiegst','wiegt','wiegen','wiegt','wiegen'],
 'zwingen':['zwinge','zwingst','zwingt','zwingen','zwingt','zwingen']
};
const IRR=new Set(['bieten','bitten','nennen','sitzen','treiben','binden','brennen','erschrecken','fliehen','fließen','frieren','gelingen','gelten','geschehen','gleichen','heben','klingen','leiden','leihen','meiden','reiben','scheiden','scheinen','schießen','schmeißen','treten','verzeihen','weisen','wiegen','zwingen','auffallen','einfallen','hinweisen','spazieren gehen']);
const ACC={ich:'mich',du:'dich',er:'sich',wir:'uns',ihr:'euch',sie:'sich'};
const DAT={ich:'mir',du:'dir',er:'sich',wir:'uns',ihr:'euch',sie:'sich'};

const TRANSLATION_VERBS=["aufräumen","einkaufen","anrufen","fernsehen","anfangen","beginnen","starten","enden","aussterben","aufmachen","zumachen","begraben","zerstören","verbiegen","mitgeben","mitnehmen","heißen","aufstehen","frühstücken","duschen","anziehen","ausziehen","einsteigen","aussteigen","umsteigen","ankommen","abfahren","holen","zahlen","ausfüllen","anmelden","mitkommen","zurückkommen","sitzen","liegen","hängen","stellen","legen","können","müssen","wollen","dürfen","sollen","möchten","mögen","biegen","abbiegen","passen","lügen","erzählen","abholen","chatten","ausleihen","versprechen","vereinbaren","vorhaben","planen","aufgeben","zuhören","zusehen","gehören","abschreiben","vorlesen","verschlafen","vergeben","verbringen","kennenlernen","bleiben","einladen","ausfallen","aufbacken","verschwenden","sich verändern","verwechseln","tauschen","austauschen","ablenken","absagen","stören","vermuten","abraten","beraten","vorschlagen","wählen","entscheiden","aussuchen","ruinieren","leiten","sich benehmen","sich vorstellen","sich kämmen","sich rasieren","sich schminken","sich bewegen","wandern","meinen","grillen","wecken","üben","trainieren","losfahren","dabeihaben","leidtun","leiden","opfern","klopfen","riechen","stinken","schauen","gucken","würfeln","schweigen","vernichten","erleben","steigen","sinken","bieten","bitten","nennen","treiben","binden","brennen","erschrecken","fliehen","fließen","frieren","gelingen","gelten","geschehen","passieren","gleichen","heben","klingen","leihen","meiden","reiben","schaffen","scheiden","trennen","teilen","scheinen","schießen","schmeißen","senden","treten","verzeihen","weisen","hinweisen","auffallen","einfallen","sich konzentrieren","sich kümmern","sich interessieren","wiegen","zwingen","sich erinnern","sich anziehen","sich ausziehen","sich umziehen","sich duschen","sich freuen","sich ärgern","sich beschweren","sich überlegen","hinzufügen","spazieren gehen"];
const TRANSLATION_ROWS={
  "Rumänisch":["a face ordine","a face cumpărături","a suna","a se uita la televizor","a începe","a începe","a porni / a începe","a se termina","a dispărea ca specie","a deschide","a închide","a îngropa","a distruge","a îndoi / deforma","a da cuiva să ia cu el","a lua cu sine","a se numi","a se ridica / a se scula","a lua micul dejun","a face duș","a îmbrăca / a pune pe sine","a dezbrăca / a scoate hainele","a urca într-un mijloc de transport","a coborî dintr-un mijloc de transport","a schimba mijlocul de transport","a sosi","a pleca / porni","a aduce / a lua","a plăti","a completa un formular","a înregistra / a se înscrie","a veni cu cineva","a se întoarce","a sta jos","a sta culcat / a se afla","a atârna","a pune în poziție verticală","a pune culcat","a putea","a trebui","a vrea","a avea voie","a trebui / a fi indicat","a dori","a plăcea","a îndoi","a vira","a se potrivi","a minți","a povesti","a lua / a veni după cineva","a conversa online","a împrumuta / a lua cu împrumut","a promite","a conveni / a stabili","a intenționa","a planifica","a renunța / a preda","a asculta atent","a privi / a urmări","a aparține","a copia","a citi cu voce tare","a dormi prea mult","a ierta / a atribui","a petrece timp","a cunoaște","a rămâne","a invita","a fi anulat / a nu avea loc","a coace din nou / a încălzi la cuptor","a risipi","a se schimba","a confunda","a schimba / a face schimb","a înlocui / a schimba","a distrage","a anula","a deranja","a presupune","a sfătui să nu","a consilia","a propune","a alege","a decide","a alege","a ruina","a conduce","a se comporta","a se prezenta / a-și imagina","a se pieptăna","a se bărbieri","a se machia","a se mișca","a face drumeții","a crede / a vrea să spună","a face grătar","a trezi pe cineva","a exersa","a se antrena","a porni la drum","a avea la sine","a părea rău","a suferi","a sacrifica","a bate / a ciocăni","a mirosi","a mirosi urât","a privi","a privi","a arunca zarul","a tăcea","a nimici","a trăi / a experimenta","a urca / a crește","a scădea / a se scufunda","a oferi","a ruga / a cere","a numi","a împinge / a practica","a lega","a arde","a se speria","a fugi","a curge","a îngheța / a-i fi frig","a reuși","a fi valabil","a se întâmpla","a se întâmpla / a trece","a semăna cu","a ridica","a suna","a împrumuta","a evita","a freca","a reuși / a crea","a despărți / a divorța","a separa","a împărți","a străluci / a părea","a trage","a arunca","a trimite","a păși / a lovi cu piciorul","a ierta","a arăta / a indica","a atrage atenția asupra","a atrage atenția / a ieși în evidență","a veni în minte","a se concentra","a avea grijă de","a se interesa de","a cântări","a obliga","a-și aminti","a se îmbrăca","a se dezbrăca","a se schimba de haine","a face duș","a se bucura / a aștepta cu nerăbdare","a se enerva","a se plânge","a se gândi bine","a adăuga","a se plimba"],
  "Arabisch":["يرتب","يتسوق","يتصل هاتفياً","يشاهد التلفاز","يبدأ","يبدأ","ينطلق / يبدأ","ينتهي","ينقرض","يفتح","يغلق","يدفن","يدمر","يثني / يشوه","يعطي ليأخذ معه","يأخذ معه","يسمى","ينهض","يتناول الفطور","يستحم","يرتدي","يخلع ملابسه","يركب","ينزل","يبدل وسيلة النقل","يصل","يغادر","يجلب","يدفع","يملأ","يسجل","يأتي معه","يعود","يجلس","يستلقي / يقع","يعلق","يضع واقفاً","يضع أفقياً","يستطيع","يجب","يريد","يسمح له","ينبغي","يرغب","يحب","يثني","ينعطف","يناسب","يكذب","يروي","يصطحب / يستلم","يدردش","يستعير / يعير","يعد","يتفق على","ينوي","يخطط","يستسلم / يسلم","ينصت","يشاهد","ينتمي","ينسخ","يقرأ بصوت عالٍ","ينام أكثر من اللازم","يسامح / يمنح","يقضي الوقت","يتعرف على","يبقى","يدعو","يلغى","يعيد الخَبز","يهدر","يتغير","يخلط بين","يبدل","يستبدل","يشتت","يلغي","يزعج","يفترض","ينصح بعدم","ينصح","يقترح","يختار","يقرر","يختار","يدمر","يدير","يتصرف","يعرّف بنفسه / يتخيل","يمشط شعره","يحلق","يتزين بالمكياج","يتحرك","يتنزه سيراً","يقصد / يعتقد","يشوي","يوقظ","يتمرن","يتدرب","ينطلق","يحمل معه","يؤسف","يعاني","يضحي","يطرق","يشم / تفوح منه رائحة","ينتن","ينظر / يشاهد","ينظر / يشاهد","يرمي النرد","يصمت","يدمر","يختبر / يعيش","يرتفع","ينخفض / يغرق","يقدم","يطلب / يرجو","يسمي","يدفع / يمارس","يربط","يحترق","يفزع","يهرب","يجري","يشعر بالبرد / يتجمد","ينجح","يسري / يعتبر","يحدث","يحدث / يمر","يشبه","يرفع","يبدو صوته","يعير / يستعير","يتجنب","يفرك","ينجز / يخلق","يفصل / يطلق","يفصل","يقسم / يشارك","يشرق / يبدو","يطلق النار","يرمي","يرسل","يدوس / يركل","يسامح","يشير / يدل","يشير إلى","يلفت الانتباه","يخطر ببال","يركز","يهتم بـ","يهتم بـ","يزن","يجبر","يتذكر","يرتدي ملابسه","يخلع ملابسه","يغير ملابسه","يستحم","يفرح / يتطلع إلى","ينزعج","يشتكي","يفكر ملياً","يضيف","يتمشى"],
  "Russisch":["убирать","делать покупки","звонить","смотреть телевизор","начинать","начинать","стартовать / начинать","заканчиваться","вымирать","открывать","закрывать","хоронить / закапывать","разрушать","сгибать / деформировать","давать с собой","брать с собой","называться","вставать","завтракать","принимать душ","надевать","снимать одежду","садиться в транспорт","выходить из транспорта","делать пересадку","прибывать","отправляться","принести / забрать","платить","заполнять","регистрировать / записываться","идти / ехать вместе","возвращаться","сидеть","лежать","висеть","ставить","класть","мочь","быть должным","хотеть","иметь разрешение","следует / должен","хотелось бы","любить / нравиться","гнуть","поворачивать","подходить","лгать","рассказывать","забирать","общаться в чате","одалживать / брать напрокат","обещать","договариваться","намереваться","планировать","сдаваться / сдавать","слушать внимательно","наблюдать","принадлежать","списывать / переписывать","читать вслух","проспать","прощать / присуждать","проводить время","знакомиться","оставаться","приглашать","отменяться / не состояться","допекать / разогревать в духовке","тратить впустую","изменяться","путать","менять / обменивать","заменять / обмениваться","отвлекать","отменять","мешать","предполагать","отговаривать","консультировать","предлагать","выбирать","решать","выбирать","разорять / портить","руководить","вести себя","представляться / представлять себе","причёсываться","бриться","краситься","двигаться","ходить в поход","иметь в виду / считать","жарить на гриле","будить","упражняться","тренироваться","отправляться","иметь при себе","быть жаль","страдать","жертвовать","стучать","пахнуть / нюхать","вонять","смотреть","смотреть","бросать кубик","молчать","уничтожать","переживать / испытывать","подниматься / расти","снижаться / тонуть","предлагать","просить","называть","гнать / заниматься","связывать","гореть","пугаться","бежать / спасаться","течь","мёрзнуть / замерзать","удаваться","действовать / считаться","происходить","происходить / проходить","быть похожим","поднимать","звучать","одалживать","избегать","тереть","справляться / создавать","разделять / разводиться","разделять","делить / делиться","светить / казаться","стрелять","швырять","посылать","ступать / пинать","прощать","указывать","указывать на","бросаться в глаза","приходить в голову","сосредоточиваться","заботиться о","интересоваться","весить / взвешивать","заставлять","вспоминать","одеваться","раздеваться","переодеваться","принимать душ","радоваться / ждать с нетерпением","сердиться / раздражаться","жаловаться","обдумывать","добавлять","гулять"],
  "Ukrainisch":["прибирати","робити покупки","телефонувати","дивитися телевізор","починати","починати","стартувати / починати","закінчуватися","вимирати","відкривати","закривати","ховати / закопувати","руйнувати","згинати / деформувати","давати із собою","брати із собою","називатися","вставати","снідати","приймати душ","надягати","знімати одяг","сідати в транспорт","виходити з транспорту","робити пересадку","прибувати","відправлятися","принести / забрати","платити","заповнювати","реєструвати / записуватися","йти / їхати разом","повертатися","сидіти","лежати","висіти","ставити","класти","могти","мусити","хотіти","мати дозвіл","слід / повинен","хотіти б","любити / подобатися","гнути","повертати","підходити","брехати","розповідати","забирати","спілкуватися в чаті","позичати / брати напрокат","обіцяти","домовлятися","мати намір","планувати","здаватися / здавати","уважно слухати","спостерігати","належати","списувати / переписувати","читати вголос","проспати","прощати / присуджувати","проводити час","знайомитися","залишатися","запрошувати","скасовуватися / не відбутися","допікати / розігрівати в духовці","марнувати","змінюватися","плутати","міняти / обмінювати","замінювати / обмінювати","відволікати","скасовувати","заважати","припускати","відмовляти / радити не робити","консультувати","пропонувати","обирати","вирішувати","вибирати","руйнувати / псувати","керувати","поводитися","представлятися / уявляти","розчісуватися","голитися","фарбуватися","рухатися","ходити в похід","мати на увазі / вважати","смажити на грилі","будити","вправлятися","тренуватися","вирушати","мати при собі","бути шкода","страждати","жертвувати","стукати","пахнути / нюхати","смердіти","дивитися","дивитися","кидати кубик","мовчати","знищувати","переживати / зазнавати","підніматися / зростати","знижуватися / тонути","пропонувати","просити","називати","гнати / займатися","зв'язувати","горіти","лякатися","тікати","текти","мерзнути / замерзати","вдаватися","діяти / вважатися","відбуватися","траплятися / проходити","бути схожим","піднімати","звучати","позичати","уникати","терти","впоратися / створювати","розділяти / розлучатися","розділяти","ділити / ділитися","світити / здаватися","стріляти","жбурляти","надсилати","ступати / копати ногой","пробачати","вказувати","вказувати на","впадати в око","спадати на думку","зосереджуватися","піклуватися про","цікавитися","важити / зважувати","змушувати","згадувати","одягатися","роздягатися","переодягатися","приймати душ","радіти / з нетерпінням чекати","сердитися / дратуватися","скаржитися","обмірковувати","додавати","гуляти"],
  "Türkisch":["toparlamak","alışveriş yapmak","telefonla aramak","televizyon izlemek","başlamak","başlamak","başlamak / çalıştırmak","bitmek","nesli tükenmek","açmak","kapatmak","gömmek","yok etmek","bükmek / eğmek","yanına vermek","yanına almak","adı olmak / denmek","ayağa kalkmak","kahvaltı yapmak","duş almak","giymek","çıkarmak / soyunmak","binmek","inmek","aktarma yapmak","varmak","hareket etmek","gidip getirmek / almak","ödemek","doldurmak","kaydettirmek / kayıt olmak","birlikte gelmek","geri gelmek","oturmak","yatmak / bulunmak","asılı olmak","koymak / dik koymak","yatırmak / koymak","yapabilmek","zorunda olmak","istemek","izinli olmak","-gerek / -meli","istemek","sevmek / hoşlanmak","bükmek","dönmek","uymak","yalan söylemek","anlatmak","gidip almak","sohbet etmek","ödünç almak / vermek","söz vermek","kararlaştırmak","niyetinde olmak","planlamak","vazgeçmek / teslim etmek","dinlemek","seyretmek","ait olmak","kopya etmek","yüksek sesle okumak","uyuyakalmak / geç uyanmak","affetmek / vermek","zaman geçirmek","tanışmak","kalmak","davet etmek","iptal olmak","yeniden fırınlamak","boşa harcamak","değişmek","karıştırmak","değiştirmek","değiştirmek / değiştokuş etmek","dikkatini dağıtmak","iptal etmek","rahatsız etmek","tahmin etmek","vazgeçirmeye çalışmak","danışmanlık yapmak","önermek","seçmek","karar vermek","seçmek","mahvetmek","yönetmek","davranmak","kendini tanıtmak / hayal etmek","kendi saçını taramak","traş olmak","makyaj yapmak","hareket etmek","doğa yürüyüşü yapmak","kastetmek / düşünmek","mangal yapmak","uyandırmak","alıştırma yapmak","antrenman yapmak","yola çıkmak","yanında bulundurmak","üzgün olmak","acı çekmek","feda etmek","kapıyı çalmak / vurmak","kokmak / koklamak","kötü kokmak","bakmak / izlemek","bakmak / izlemek","zar atmak","susmak","yok etmek","deneyimlemek","yükselmek","düşmek / batmak","sunmak / teklif etmek","rica etmek","adlandırmak / söylemek","sürmek / yapmak","bağlamak","yanmak","korkmak / ürkmek","kaçmak","akmak","üşümek / donmak","başarılı olmak","geçerli olmak","meydana gelmek","olmak / geçmek","benzemek","kaldırmak","kulağa gelmek","ödünç vermek / almak","kaçınmak","ovmak","başarmak / yaratmak","ayırmak / boşanmak","ayırmak","bölmek / paylaşmak","parlamak / görünmek","ateş etmek","fırlatmak","göndermek","adım atmak / tekmelemek","affetmek","göstermek / işaret etmek","dikkat çekmek / belirtmek","dikkat çekmek","aklına gelmek","konsantre olmak","ilgilenmek / bakmak","ilgilenmek","tartmak","zorlamak","hatırlamak","giyinmek","soyunmak","üstünü değiştirmek","duş almak","sevinmek / dört gözle beklemek","sinirlenmek","şikâyet etmek","iyice düşünmek","eklemek","yürüyüşe çıkmak"],
  "Japanisch":["片づける","買い物をする","電話をかける","テレビを見る","始める","始まる / 始める","開始する / 出発する","終わる","絶滅する","開ける","閉める","埋める / 埋葬する","破壊する","曲げる / 変形させる","持たせる","持っていく / 連れていく","～という名前である","起きる / 立ち上がる","朝食をとる","シャワーを浴びる","着る","脱ぐ","乗り込む","降りる","乗り換える","到着する","出発する","取りに行く / 連れてくる","支払う","記入する","登録する / 申し込む","一緒に来る","戻ってくる","座っている","横たわっている / 置いてある","掛かっている","立てて置く","横にして置く","できる","～しなければならない","～したい","～してもよい","～することになっている","～したい","好きである","曲げる","曲がる","合う","うそをつく","話す / 語る","迎えに行く / 受け取る","チャットする","借りる / 貸す","約束する","取り決める / 約束する","～するつもりである","計画する","あきらめる / 提出する","よく聞く","見守る","属する","書き写す","音読する","寝過ごす","許す / 与える","過ごす","知り合う","残る","招待する","中止になる","焼き直す","無駄にする","変化する","取り違える","交換する","交換する / 取り替える","気をそらす","キャンセルする","邪魔する","推測する","やめるよう助言する","助言する / 相談に乗る","提案する","選ぶ","決める","選ぶ","台無しにする","指導する / 運営する","振る舞う","自己紹介する / 想像する","髪をとかす","ひげをそる","化粧する","動く","ハイキングする","意味する / 思う","バーベキューをする","起こす","練習する","トレーニングする","出発する","持っている","申し訳なく思う","苦しむ","犠牲にする","ノックする / たたく","におう / かぐ","臭う","見る","見る","サイコロを振る","黙る","滅ぼす","経験する","上がる","下がる / 沈む","提供する","頼む","名前を挙げる / 呼ぶ","追い立てる / 行う","結ぶ","燃える","驚く / 怖がる","逃げる","流れる","寒がる / 凍る","うまくいく","有効である / ～と見なされる","起こる","起こる / 通る","似ている","持ち上げる","聞こえる / 響く","貸す / 借りる","避ける","こする","成し遂げる / 作る","分ける / 離婚する","分ける","分ける / 共有する","輝く / ～のように見える","撃つ","投げる","送る","踏む / 蹴る","許す","指し示す","指摘する","目立つ / 気づかれる","思いつく","集中する","世話をする","興味を持つ","重さがある / 量る","強制する","思い出す","服を着る","服を脱ぐ","着替える","シャワーを浴びる","喜ぶ / 楽しみにする","腹を立てる","苦情を言う","よく考える","付け加える","散歩する"]
};
window.VERB_TRANSLATIONS=window.VERB_TRANSLATIONS||{};
Object.entries(TRANSLATION_ROWS).forEach(([language,values])=>{
 const target=window.VERB_TRANSLATIONS[language]=window.VERB_TRANSLATIONS[language]||{};
 TRANSLATION_VERBS.forEach((verb,index)=>{if(values[index])target[verb]=values[index]});
});
const BASE_LANGUAGES=["Englisch","Arabisch","Russisch","Ukrainisch","Türkisch","Rumänisch","Japanisch"];
const translationAudit=()=>{
 const verbs=[...new Set(window.SP_VERB_GROUP_DATA?.verbs||[])];
 const missing={};
 BASE_LANGUAGES.forEach(language=>{
  const map=window.VERB_TRANSLATIONS[language]||{};
  const absent=verbs.filter(verb=>!String(map[verb]||"").trim());
  if(absent.length)missing[language]=absent;
 });
 return{complete:Object.keys(missing).length===0,languages:BASE_LANGUAGES.slice(),verbCount:verbs.length,missing};
};
window.SP_VERB_BASE_LANGUAGES=Object.freeze(BASE_LANGUAGES.slice());
window.SP_VERB_TRANSLATION_AUDIT=translationAudit();
if(!window.SP_VERB_TRANSLATION_AUDIT.complete)console.error("Fehlende Verbübersetzungen",window.SP_VERB_TRANSLATION_AUDIT.missing);

const original={forms:E.forms.bind(E),displayForm:E.displayForm.bind(E),groupLabel:E.groupLabel.bind(E),phrase:E.phrase.bind(E),meaning:E.meaning.bind(E),sentence:E.sentence.bind(E),question:E.question.bind(E)};
function parts(v){
 const sep=SEP[v]||null,ref=REF.has(v),base=sep?sep[0]:(ref?v.replace(/^sich\s+/,''):v);
 return{base,prefix:sep?.[1]||'',reflexive:ref,dative:DAT_REF.has(v)}
}
function forms(v){
 if(!NEW.has(v))return original.forms(v);
 const p=parts(v);
 return FORMS[p.base]||original.forms(p.base)
}
function displayForm(v,pi){
 if(!NEW.has(v))return original.displayForm(v,pi);
 const p=parts(v),person=E.PERSONS[pi]||E.PERSONS[0],bits=[forms(v)[pi]];
 if(p.reflexive)bits.push((p.dative?DAT:ACC)[person.key]||'sich');
 if(p.prefix)bits.push(p.prefix);
 return bits.join(' ')
}
function groupLabel(v){
 if(!NEW.has(v))return original.groupLabel(v);
 if(REF.has(v))return'Reflexiv';
 if(SEP[v])return'Trennbar';
 if(IRR.has(v))return'Unregelmäßig';
 return'Regelmäßig'
}
function phrase(v,pi){return NEW.has(v)?`${E.PERSONS[pi].label} ${displayForm(v,pi)}`:original.phrase(v,pi)}
function meaning(v){return original.meaning(v)}
function sentence(v){return NEW.has(v)?(window.SP_VERB_SENTENCES?.[v]||`Ich lerne das Verb „${v}“.`):original.sentence(v)}
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function options(answer,pool,count=4){const seen=new Set([norm(answer)]),others=[];shuffle(pool).forEach(x=>{if(x!=null&&!seen.has(norm(x))){seen.add(norm(x));others.push(x)}});return shuffle([answer,...others.slice(0,count-1)])}
function question(groupId,task,v,personOverride=null){
 if(!NEW.has(v))return original.question(groupId,task,v,personOverride);
 const group=E.GROUPS[groupId-1],names=group.verbs,pi=personOverride??E.personFor(groupId,task,v),answerForm=displayForm(v,pi),meanings=group.verbs.map(meaning);
 if(task==='meaning-to-verb')return{kind:'mc',prompt:meaning(v),answer:v,options:options(v,names),image:v};
 if(task==='verb-to-meaning')return{kind:'mc',prompt:`Was bedeutet „${v}“?`,answer:meaning(v),options:options(meaning(v),meanings)};
 if(task==='listen')return{kind:'mc',prompt:'Höre das Verb.',answer:v,options:options(v,names),audio:v};
 if(task==='image-to-verb')return{kind:'mc',prompt:'Welches Verb zeigt das Bild?',answer:v,options:options(v,names),image:v};
 if(task==='verb-to-image')return{kind:'images',prompt:`Welches Bild passt zu „${v}“?`,answer:v,options:options(v,names)};
 if(task==='read-sentence')return{kind:'mc',prompt:sentence(v),answer:v,options:options(v,names)};
 if(task==='change')return{kind:'mc',prompt:`Zu welcher Gruppe gehört „${v}“?`,answer:groupLabel(v),options:options(groupLabel(v),['Regelmäßig','Unregelmäßig','Trennbar','Nicht trennbar','Reflexiv','Modalverb'])};
 if(task==='choose-form')return{kind:'mc',prompt:`${E.PERSONS[pi].label} – ${v}`,answer:answerForm,options:options(answerForm,group.verbs.map(x=>NEW.has(x)?displayForm(x,pi):original.displayForm(x,pi)))};
 if(task==='write-form')return{kind:'input',prompt:`${E.PERSONS[pi].label} – ${v}`,answer:answerForm,placeholder:'Verbform schreiben'};
 if(task==='speak')return{kind:'speech',prompt:`Sprich: ${E.PERSONS[pi].label} – ${v}`,answer:phrase(v,pi),answers:[phrase(v,pi),answerForm],writeAnswer:answerForm};
 if(task==='sentence')return{kind:'input',prompt:`${E.PERSONS[pi].label} ________ (${v}).`,answer:answerForm,placeholder:'Verbform schreiben'};
 return{kind:'input',prompt:'Schreibe das Verb.',answer:v}
}
E.forms=forms;E.displayForm=displayForm;E.groupLabel=groupLabel;E.phrase=phrase;E.meaning=meaning;E.sentence=sentence;E.question=question;
})();