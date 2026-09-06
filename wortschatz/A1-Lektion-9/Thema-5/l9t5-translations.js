(function(){
'use strict';
const LANGS={en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']};
const LABEL={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
const T={
buergerbuero:{en:"citizens' service office",ru:'бюро для граждан',tr:'vatandaş hizmet bürosu',uk:'бюро обслуговування громадян',ar:'مكتب خدمة المواطنين',ja:'市民サービス窓口',ro:'birou pentru cetățeni',pl:'biuro obsługi mieszkańców',ku:'buroya welatiyan'},
meldebehoerde_t5:{en:'registration authority',ru:'регистрационное ведомство',tr:'ikamet kayıt kurumu',uk:'орган реєстрації місця проживання',ar:'دائرة تسجيل السكن',ja:'住民登録局',ro:'autoritatea de înregistrare',pl:'urząd meldunkowy',ku:'dezgeha qeydê'},
auslaenderbehoerde:{en:'immigration office',ru:'ведомство по делам иностранцев',tr:'yabancılar dairesi',uk:'відомство у справах іноземців',ar:'دائرة شؤون الأجانب',ja:'外国人局',ro:'oficiul pentru străini',pl:'urząd ds. cudzoziemców',ku:'dezgeha biyaniyan'},
standesamt:{en:'registry office',ru:'ЗАГС',tr:'nüfus dairesi',uk:'РАЦС',ar:'مكتب الأحوال المدنية',ja:'戸籍役場',ro:'oficiul de stare civilă',pl:'urząd stanu cywilnego',ku:'ofîsa rewşa sivîl'},
jobcenter:{en:'job center',ru:'центр занятости и пособий',tr:'iş merkezi',uk:'центр зайнятості та допомоги',ar:'مركز العمل',ja:'ジョブセンター',ro:'centru de ocupare',pl:'Jobcenter',ku:'navenda kar'},
agentur_fuer_arbeit:{en:'employment agency',ru:'агентство по трудоустройству',tr:'iş ajansı',uk:'агентство зайнятості',ar:'وكالة العمل',ja:'雇用局',ro:'agenția pentru ocupare',pl:'agencja pracy',ku:'ajansa kar'},
finanzamt:{en:'tax office',ru:'налоговая служба',tr:'vergi dairesi',uk:'податкова служба',ar:'مكتب الضرائب',ja:'税務署',ro:'administrația fiscală',pl:'urząd skarbowy',ku:'ofîsa bacê'},
sozialamt:{en:'social welfare office',ru:'социальная служба',tr:'sosyal yardım dairesi',uk:'соціальна служба',ar:'مكتب الشؤون الاجتماعية',ja:'福祉事務所',ro:'oficiul social',pl:'urząd pomocy społecznej',ku:'ofîsa civakî'},
jugendamt:{en:'youth welfare office',ru:'служба по делам молодёжи',tr:'gençlik dairesi',uk:'служба у справах дітей',ar:'مكتب رعاية الشباب',ja:'青少年福祉局',ro:'oficiul pentru tineret',pl:'urząd ds. młodzieży',ku:'ofîsa ciwanan'},
kfz_zulassungsstelle:{en:'vehicle registration office',ru:'отдел регистрации автомобилей',tr:'araç tescil dairesi',uk:'служба реєстрації авто',ar:'مكتب تسجيل المركبات',ja:'自動車登録局',ro:'serviciul de înmatriculări',pl:'wydział rejestracji pojazdów',ku:'ofîsa qeyda wesayîtan'},
gesundheitsamt:{en:'public health office',ru:'управление здравоохранения',tr:'sağlık dairesi',uk:'управління охорони здоров’я',ar:'دائرة الصحة',ja:'保健所',ro:'direcția de sănătate',pl:'urząd zdrowia',ku:'ofîsa tenduristiyê'},
reisepass:{en:'passport',ru:'загранпаспорт',tr:'pasaport',uk:'закордонний паспорт',ar:'جواز سفر',ja:'パスポート',ro:'pașaport',pl:'paszport',ku:'pasaport'},
aufenthaltstitel:{en:'residence permit',ru:'вид на жительство',tr:'oturma izni',uk:'дозвіл на проживання',ar:'تصريح إقامة',ja:'在留許可',ro:'permis de ședere',pl:'zezwolenie na pobyt',ku:'destûra rûniştinê'},
geburtsurkunde:{en:'birth certificate',ru:'свидетельство о рождении',tr:'doğum belgesi',uk:'свідоцтво про народження',ar:'شهادة ميلاد',ja:'出生証明書',ro:'certificat de naștere',pl:'akt urodzenia',ku:'belgeya jidayikbûnê'},
heiratsurkunde:{en:'marriage certificate',ru:'свидетельство о браке',tr:'evlilik belgesi',uk:'свідоцтво про шлюб',ar:'شهادة زواج',ja:'結婚証明書',ro:'certificat de căsătorie',pl:'akt małżeństwa',ku:'belgeya zewacê'},
meldebescheinigung:{en:'registration certificate',ru:'справка о регистрации',tr:'ikamet kayıt belgesi',uk:'довідка про реєстрацію',ar:'شهادة تسجيل السكن',ja:'住民登録証明書',ro:'certificat de domiciliu',pl:'zaświadczenie o zameldowaniu',ku:'belgeya qeydê'},
mietvertrag:{en:'rental agreement',ru:'договор аренды',tr:'kira sözleşmesi',uk:'договір оренди',ar:'عقد إيجار',ja:'賃貸契約書',ro:'contract de închiriere',pl:'umowa najmu',ku:'peymana kirê'},
arbeitsvertrag:{en:'employment contract',ru:'трудовой договор',tr:'iş sözleşmesi',uk:'трудовий договір',ar:'عقد عمل',ja:'雇用契約書',ro:'contract de muncă',pl:'umowa o pracę',ku:'peymana kar'},
passfoto:{en:'passport photo',ru:'фото на паспорт',tr:'vesikalık fotoğraf',uk:'фото на паспорт',ar:'صورة جواز سفر',ja:'証明写真',ro:'fotografie de pașaport',pl:'zdjęcie paszportowe',ku:'wêneya pasaportê'},
fuehrerschein_beantragen:{en:'to apply for a driving licence',ru:'подать заявление на водительские права',tr:'ehliyet başvurusu yapmak',uk:'подати заяву на водійське посвідчення',ar:'التقدم بطلب رخصة قيادة',ja:'運転免許を申請する',ro:'a solicita permisul de conducere',pl:'wnioskować o prawo jazdy',ku:'daxwaza destûra ajotinê kirin'},
einen_antrag_ausfuellen:{en:'to fill out an application',ru:'заполнить заявление',tr:'başvuru formunu doldurmak',uk:'заповнити заяву',ar:'ملء طلب',ja:'申請書に記入する',ro:'a completa o cerere',pl:'wypełnić wniosek',ku:'daxwazname dagirtin'},
ausweis_mitbringen:{en:'to bring the ID card',ru:'принести удостоверение личности',tr:'kimliği getirmek',uk:'принести посвідчення особи',ar:'إحضار بطاقة الهوية',ja:'身分証を持参する',ro:'a aduce actul de identitate',pl:'przynieść dowód osobisty',ku:'nasname anîn'},
reisepass_mitbringen:{en:'to bring the passport',ru:'принести загранпаспорт',tr:'pasaportu getirmek',uk:'принести закордонний паспорт',ar:'إحضار جواز السفر',ja:'パスポートを持参する',ro:'a aduce pașaportul',pl:'przynieść paszport',ku:'pasaport anîn'},
viele_papiere_mitbringen:{en:'to bring many papers',ru:'принести много документов',tr:'birçok belge getirmek',uk:'принести багато документів',ar:'إحضار أوراق كثيرة',ja:'多くの書類を持参する',ro:'a aduce multe acte',pl:'przynieść wiele dokumentów',ku:'gelek belge anîn'},
antrag_abgeben:{en:'to hand in an application',ru:'сдать заявление',tr:'başvuruyu teslim etmek',uk:'подати заяву',ar:'تسليم الطلب',ja:'申請書を提出する',ro:'a depune cererea',pl:'złożyć wniosek',ku:'daxwazname teslîm kirin'},
dokument_unterschreiben:{en:'to sign a document',ru:'подписать документ',tr:'belgeyi imzalamak',uk:'підписати документ',ar:'توقيع وثيقة',ja:'書類に署名する',ro:'a semna un document',pl:'podpisać dokument',ku:'belge îmze kirin'},
gebuehr_zahlen:{en:'to pay a fee',ru:'оплатить сбор',tr:'ücret ödemek',uk:'сплатити збір',ar:'دفع رسوم',ja:'手数料を払う',ro:'a plăti o taxă',pl:'zapłacić opłatę',ku:'heq dayîn'},
visum_bekommen:{en:'to get a visa',ru:'получить визу',tr:'vize almak',uk:'отримати візу',ar:'الحصول على تأشيرة',ja:'ビザを取得する',ro:'a obține o viză',pl:'dostać wizę',ku:'vîze stendin'}
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en');for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;return'en'}
const c=code();for(const item of window.L9T5?.cards||[]){item.translation=T[item.id]?.[c]||T[item.id]?.en||''}
window.L9T5Translations={code:c,label:LABEL[c]||'Englisch',lexicon:T};
})();