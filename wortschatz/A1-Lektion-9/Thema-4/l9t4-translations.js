(function(){
'use strict';
const LANGS={en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']};
const LABEL={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
const T={
allein:{en:'alone',ru:'один / одна',tr:'yalnız',uk:'сам / сама',ar:'وحده',ja:'一人で',ro:'singur / singură',pl:'sam / sama',ku:'bi tenê'},
behoerde:{en:'authority / public office',ru:'ведомство',tr:'resmî kurum',uk:'державна установа',ar:'جهة رسمية',ja:'官庁',ro:'instituție publică',pl:'urząd',ku:'dezgehê fermî'},
person:{en:'person',ru:'человек',tr:'kişi',uk:'особа',ar:'شخص',ja:'人',ro:'persoană',pl:'osoba',ku:'kes'},
geburtsname:{en:'birth name',ru:'фамилия при рождении',tr:'doğum soyadı',uk:'прізвище при народженні',ar:'اسم العائلة عند الولادة',ja:'出生時の姓',ro:'nume la naștere',pl:'nazwisko rodowe',ku:'navê malbatê yê jidayikbûnê'},
geschlecht:{en:'sex / gender',ru:'пол',tr:'cinsiyet',uk:'стать',ar:'الجنس',ja:'性別',ro:'sex / gen',pl:'płeć',ku:'zayend'},
auslaender:{en:'foreigner (male)',ru:'иностранец',tr:'yabancı erkek',uk:'іноземець',ar:'أجنبي',ja:'外国人（男性）',ro:'străin',pl:'cudzoziemiec',ku:'biyanî'},
auslaenderin:{en:'foreigner (female)',ru:'иностранка',tr:'yabancı kadın',uk:'іноземка',ar:'أجنبية',ja:'外国人（女性）',ro:'străină',pl:'cudzoziemka',ku:'jinê biyanî'},
maennlich:{en:'male',ru:'мужской',tr:'erkek',uk:'чоловічий',ar:'ذكر',ja:'男性',ro:'masculin',pl:'męski',ku:'nêr'},
weiblich:{en:'female',ru:'женский',tr:'kadın',uk:'жіночий',ar:'أنثى',ja:'女性',ro:'feminin',pl:'żeński',ku:'mê'},
angehoeriger:{en:'male relative / family member',ru:'родственник',tr:'erkek yakını',uk:'родич',ar:'قريب',ja:'男性の家族',ro:'rudă',pl:'krewny',ku:'xizmê mêr'},
angehoerige:{en:'female relative / family member',ru:'родственница',tr:'kadın yakını',uk:'родичка',ar:'قريبة',ja:'女性の家族',ro:'rudă',pl:'krewna',ku:'xizma jin'},
bedeuten:{en:'to mean',ru:'означать',tr:'anlamına gelmek',uk:'означати',ar:'يعني',ja:'意味する',ro:'a însemna',pl:'znaczyć',ku:'wate kirin'},
wiederholen:{en:'to repeat',ru:'повторять',tr:'tekrarlamak',uk:'повторювати',ar:'يكرر',ja:'繰り返す',ro:'a repeta',pl:'powtarzać',ku:'dubare kirin'},
verstehen:{en:'to understand',ru:'понимать',tr:'anlamak',uk:'розуміти',ar:'يفهم',ja:'理解する',ro:'a înțelege',pl:'rozumieć',ku:'fêm kirin'},
sprachschule_besuchen:{en:'to attend a language school',ru:'посещать языковую школу',tr:'dil okuluna gitmek',uk:'відвідувати мовну школу',ar:'يرتاد مدرسة لغات',ja:'語学学校に通う',ro:'a frecventa o școală de limbi',pl:'uczęszczać do szkoły językowej',ku:'çûna dibistana ziman'},
helfen:{en:'to help',ru:'помогать',tr:'yardım etmek',uk:'допомагати',ar:'يساعد',ja:'助ける',ro:'a ajuta',pl:'pomagać',ku:'alîkarî kirin'},
auskunft:{en:'information',ru:'справка / информация',tr:'bilgi',uk:'довідка / інформація',ar:'معلومة',ja:'案内 / 情報',ro:'informație',pl:'informacja',ku:'agahî'},
erlaubnis:{en:'permission',ru:'разрешение',tr:'izin',uk:'дозвіл',ar:'إذن',ja:'許可',ro:'permisiune',pl:'pozwolenie',ku:'destûr'},
erklaerung:{en:'explanation',ru:'объяснение',tr:'açıklama',uk:'пояснення',ar:'شرح',ja:'説明',ro:'explicație',pl:'wyjaśnienie',ku:'ravekirin'},
dokument:{en:'document',ru:'документ',tr:'belge',uk:'документ',ar:'وثيقة',ja:'書類',ro:'document',pl:'dokument',ku:'belge'},
geld:{en:'money',ru:'деньги',tr:'para',uk:'гроші',ar:'مال',ja:'お金',ro:'bani',pl:'pieniądze',ku:'pere'},
genug:{en:'enough',ru:'достаточно',tr:'yeterli',uk:'достатньо',ar:'كافٍ',ja:'十分',ro:'destul',pl:'wystarczająco',ku:'bes'},
einkommen:{en:'income',ru:'доход',tr:'gelir',uk:'дохід',ar:'دخل',ja:'収入',ro:'venit',pl:'dochód',ku:'dahat'},
reise:{en:'trip / journey',ru:'поездка',tr:'seyahat',uk:'подорож',ar:'رحلة',ja:'旅行',ro:'călătorie',pl:'podróż',ku:'sefer'},
versicherung:{en:'insurance',ru:'страховка',tr:'sigorta',uk:'страхування',ar:'تأمين',ja:'保険',ro:'asigurare',pl:'ubezpieczenie',ku:'sîgorte'},
botschaft:{en:'embassy',ru:'посольство',tr:'büyükelçilik',uk:'посольство',ar:'سفارة',ja:'大使館',ro:'ambasadă',pl:'ambasada',ku:'balyozxane'},
visum:{en:'visa',ru:'виза',tr:'vize',uk:'віза',ar:'تأشيرة',ja:'ビザ',ro:'viză',pl:'wiza',ku:'vîze'},
mitarbeiter:{en:'employee (male)',ru:'сотрудник',tr:'erkek çalışan',uk:'працівник',ar:'موظف',ja:'男性職員',ro:'angajat',pl:'pracownik',ku:'xebatkar'},
mitarbeiterin:{en:'employee (female)',ru:'сотрудница',tr:'kadın çalışan',uk:'працівниця',ar:'موظفة',ja:'女性職員',ro:'angajată',pl:'pracownica',ku:'xebatkara jin'},
beamter:{en:'civil servant (male)',ru:'чиновник',tr:'erkek memur',uk:'держслужбовець',ar:'موظف حكومي',ja:'男性公務員',ro:'funcționar public',pl:'urzędnik',ku:'karmendê dewletê'},
beamtin:{en:'civil servant (female)',ru:'чиновница',tr:'kadın memur',uk:'держслужбовиця',ar:'موظفة حكومية',ja:'女性公務員',ro:'funcționară publică',pl:'urzędniczka',ku:'karmenda dewletê'},
verdienen:{en:'to earn',ru:'зарабатывать',tr:'kazanmak',uk:'заробляти',ar:'يكسب',ja:'稼ぐ',ro:'a câștiga',pl:'zarabiać',ku:'qezenç kirin'},
reisepass:{en:'passport',ru:'загранпаспорт',tr:'pasaport',uk:'закордонний паспорт',ar:'جواز سفر',ja:'パスポート',ro:'pașaport',pl:'paszport',ku:'pasaport'},
reisen:{en:'to travel',ru:'путешествовать',tr:'seyahat etmek',uk:'подорожувати',ar:'يسافر',ja:'旅行する',ro:'a călători',pl:'podróżować',ku:'sefer kirin'},
bisherige:{en:'previous / so far',ru:'предыдущий',tr:'önceki',uk:'попередній',ar:'السابق',ja:'これまでの / 以前の',ro:'anterior',pl:'dotychczasowy',ku:'berê'},
familienstand:{en:'marital status',ru:'семейное положение',tr:'medeni durum',uk:'сімейний стан',ar:'الحالة الاجتماعية',ja:'婚姻状況',ro:'stare civilă',pl:'stan cywilny',ku:'rewşa zewacê'},
verpflichtungserklaerung:{en:'declaration of commitment',ru:'обязательство о финансовом обеспечении',tr:'taahhütname',uk:'зобов’язання про фінансове забезпечення',ar:'تعهد مالي',ja:'身元保証書',ro:'declarație de angajament',pl:'zobowiązanie finansowe',ku:'daxuyaniya berpirsiyariyê'},
einkommensnachweis:{en:'proof of income',ru:'подтверждение дохода',tr:'gelir belgesi',uk:'підтвердження доходу',ar:'إثبات الدخل',ja:'収入証明',ro:'dovada venitului',pl:'zaświadczenie o dochodach',ku:'belgeya dahatê'},
kennenlernen:{en:'to get to know / meet',ru:'знакомиться',tr:'tanışmak',uk:'знайомитися',ar:'يتعرف على',ja:'知り合う',ro:'a cunoaște',pl:'poznać',ku:'nas kirin'},
schriftlich:{en:'written / in writing',ru:'письменно',tr:'yazılı',uk:'письмово',ar:'كتابي',ja:'書面で',ro:'în scris',pl:'pisemnie',ku:'nivîskî'},
muendlich:{en:'oral / spoken',ru:'устно',tr:'sözlü',uk:'усно',ar:'شفهي',ja:'口頭で',ro:'oral',pl:'ustnie',ku:'devkî'},
hoffentlich:{en:'hopefully',ru:'надеюсь',tr:'umarım',uk:'сподіваюся',ar:'نأمل أن',ja:'うまくいけば',ro:'sperăm',pl:'miejmy nadzieję',ku:'hêvîdarim'},
zum_glueck:{en:'luckily / fortunately',ru:'к счастью',tr:'neyse ki',uk:'на щастя',ar:'لحسن الحظ',ja:'幸いにも',ro:'din fericire',pl:'na szczęście',ku:'bi şansê'},
endlich:{en:'finally',ru:'наконец',tr:'nihayet',uk:'нарешті',ar:'أخيرًا',ja:'ついに',ro:'în sfârșit',pl:'wreszcie',ku:'di dawiyê de'}
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en');for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;return'en'}
const c=code();for(const item of window.L9T4?.cards||[]){item.translation=T[item.id]?.[c]||T[item.id]?.en||''}
window.L9T4Translations={code:c,label:LABEL[c]||'Englisch',lexicon:T};
})();