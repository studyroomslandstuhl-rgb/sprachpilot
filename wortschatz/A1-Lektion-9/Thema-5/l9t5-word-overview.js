(function(){
'use strict';
if(!window.SPWordOverviewStandard)return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const items=window.L9_T5_WORDS||window.L9_THEMES?.[5]?.coreVocabulary||[];
const LANGS={en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']};
const LABEL={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
const T={
 buergeramt:{en:"citizens' office",ru:'гражданское ведомство',tr:'vatandaşlık işleri dairesi',uk:'центр адміністративних послуг',ar:'مكتب شؤون المواطنين',ja:'市民課',ro:'birou pentru cetățeni',pl:'urząd obywatelski',ku:'ofîsa welatiyan'},
 buergerbuero:{en:"citizens' service office",ru:'бюро для граждан',tr:'vatandaş hizmet bürosu',uk:'бюро обслуговування громадян',ar:'مكتب خدمة المواطنين',ja:'市民サービス窓口',ro:'birou de servicii pentru cetățeni',pl:'biuro obsługi mieszkańców',ku:'buroya welatiyan'},
 meldebehoerde_t5:{en:'registration authority',ru:'регистрационное ведомство',tr:'ikamet kayıt kurumu',uk:'орган реєстрації місця проживання',ar:'دائرة تسجيل السكن',ja:'住民登録局',ro:'autoritatea de înregistrare a domiciliului',pl:'urząd meldunkowy',ku:'dezgeha qeydê'},
 auslaenderbehoerde:{en:'immigration office',ru:'ведомство по делам иностранцев',tr:'yabancılar dairesi',uk:'відомство у справах іноземців',ar:'دائرة شؤون الأجانب',ja:'外国人局',ro:'oficiul pentru străini',pl:'urząd do spraw cudzoziemców',ku:'dezgeha biyaniyan'},
 standesamt:{en:'registry office',ru:'ЗАГС',tr:'nüfus dairesi',uk:'РАЦС',ar:'مكتب الأحوال المدنية',ja:'戸籍役場',ro:'oficiul de stare civilă',pl:'urząd stanu cywilnego',ku:'ofîsa rewşa sivîl'},
 jobcenter:{en:'job center',ru:'центр занятости и пособий',tr:'iş merkezi',uk:'центр зайнятості та допомоги',ar:'مركز العمل',ja:'ジョブセンター',ro:'centru pentru ocuparea forței de muncă',pl:'Jobcenter',ku:'navenda kar'},
 agentur_fuer_arbeit:{en:'employment agency',ru:'агентство по трудоустройству',tr:'iş ajansı',uk:'агентство зайнятості',ar:'وكالة العمل',ja:'雇用局',ro:'agenția pentru ocuparea forței de muncă',pl:'agencja pracy',ku:'ajansa kar'},
 finanzamt:{en:'tax office',ru:'налоговая служба',tr:'vergi dairesi',uk:'податкова служба',ar:'مكتب الضرائب',ja:'税務署',ro:'administrația fiscală',pl:'urząd skarbowy',ku:'ofîsa bacê'},
 sozialamt:{en:'social welfare office',ru:'социальная служба',tr:'sosyal yardım dairesi',uk:'соціальна служба',ar:'مكتب الشؤون الاجتماعية',ja:'福祉事務所',ro:'oficiul de asistență socială',pl:'urząd pomocy społecznej',ku:'ofîsa civakî'},
 jugendamt:{en:'youth welfare office',ru:'служба по делам молодёжи',tr:'gençlik dairesi',uk:'служба у справах дітей та молоді',ar:'مكتب رعاية الشباب',ja:'青少年福祉局',ro:'oficiul pentru tineret',pl:'urząd ds. młodzieży',ku:'ofîsa ciwanan'},
 fahrerlaubnisbehoerde:{en:'driving licence authority',ru:'ведомство по водительским правам',tr:'sürücü belgesi dairesi',uk:'відомство з водійських посвідчень',ar:'دائرة رخص القيادة',ja:'運転免許局',ro:'autoritatea pentru permise de conducere',pl:'urząd prawa jazdy',ku:'dezgeha destûra ajotinê'},
 kfz_zulassungsstelle:{en:'vehicle registration office',ru:'отдел регистрации автомобилей',tr:'araç tescil dairesi',uk:'служба реєстрації транспортних засобів',ar:'مكتب تسجيل المركبات',ja:'自動車登録局',ro:'serviciul de înmatriculări auto',pl:'wydział rejestracji pojazdów',ku:'ofîsa qeyda wesayîtan'},
 gesundheitsamt:{en:'public health office',ru:'управление здравоохранения',tr:'sağlık dairesi',uk:'управління охорони здоров’я',ar:'دائرة الصحة',ja:'保健所',ro:'direcția de sănătate publică',pl:'urząd zdrowia',ku:'ofîsa tenduristiyê'},
 reisepass:{en:'passport',ru:'загранпаспорт',tr:'pasaport',uk:'закордонний паспорт',ar:'جواز سفر',ja:'パスポート',ro:'pașaport',pl:'paszport',ku:'pasaport'},
 aufenthaltstitel:{en:'residence permit',ru:'вид на жительство',tr:'oturma izni',uk:'дозвіл на проживання',ar:'تصريح إقامة',ja:'在留許可',ro:'permis de ședere',pl:'zezwolenie na pobyt',ku:'destûra rûniştinê'},
 geburtsurkunde:{en:'birth certificate',ru:'свидетельство о рождении',tr:'doğum belgesi',uk:'свідоцтво про народження',ar:'شهادة ميلاد',ja:'出生証明書',ro:'certificat de naștere',pl:'akt urodzenia',ku:'belgeya jidayikbûnê'},
 heiratsurkunde:{en:'marriage certificate',ru:'свидетельство о браке',tr:'evlilik belgesi',uk:'свідоцтво про шлюб',ar:'شهادة زواج',ja:'結婚証明書',ro:'certificat de căsătorie',pl:'akt małżeństwa',ku:'belgeya zewacê'},
 meldebescheinigung:{en:'registration certificate',ru:'справка о регистрации',tr:'ikamet kayıt belgesi',uk:'довідка про реєстрацію місця проживання',ar:'شهادة تسجيل السكن',ja:'住民登録証明書',ro:'certificat de domiciliu',pl:'zaświadczenie o zameldowaniu',ku:'belgeya qeydê'},
 wohnungsgeberbestaetigung:{en:'landlord confirmation',ru:'подтверждение от арендодателя',tr:'ev sahibi onayı',uk:'підтвердження від орендодавця',ar:'تأكيد من المؤجر',ja:'家主確認書',ro:'confirmare de la proprietar',pl:'potwierdzenie od wynajmującego',ku:'pejirandina xwediyê xanî'},
 mietvertrag:{en:'rental agreement',ru:'договор аренды',tr:'kira sözleşmesi',uk:'договір оренди',ar:'عقد إيجار',ja:'賃貸契約書',ro:'contract de închiriere',pl:'umowa najmu',ku:'peymana kirê'},
 arbeitsvertrag:{en:'employment contract',ru:'трудовой договор',tr:'iş sözleşmesi',uk:'трудовий договір',ar:'عقد عمل',ja:'雇用契約書',ro:'contract de muncă',pl:'umowa o pracę',ku:'peymana kar'},
 passfoto:{en:'passport photo',ru:'фото на паспорт',tr:'vesikalık fotoğraf',uk:'фото на паспорт',ar:'صورة جواز سفر',ja:'証明写真',ro:'fotografie de pașaport',pl:'zdjęcie paszportowe',ku:'wêneya pasaportê'},
 steuer_id:{en:'tax ID',ru:'налоговый идентификационный номер',tr:'vergi kimlik numarası',uk:'податковий ідентифікаційний номер',ar:'الرقم الضريبي',ja:'納税者番号',ro:'cod fiscal',pl:'identyfikator podatkowy',ku:'nasnameya bacê'},
 fahrzeugpapiere:{en:'vehicle documents',ru:'документы на автомобиль',tr:'araç belgeleri',uk:'документи на транспортний засіб',ar:'أوراق المركبة',ja:'車両書類',ro:'actele vehiculului',pl:'dokumenty pojazdu',ku:'belgeyên wesayîtê'},
 versicherungsnachweis:{en:'proof of insurance',ru:'подтверждение страховки',tr:'sigorta belgesi',uk:'підтвердження страхування',ar:'إثبات التأمين',ja:'保険証明書',ro:'dovada asigurării',pl:'potwierdzenie ubezpieczenia',ku:'belgeya sîgorteyê'}
};
const ASSETS={meldebehoerde_t5:'meldebehoerde'};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en');for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;return'en'}
const c=code();
const rendered=items.map(item=>{const asset=ASSETS[item.id]||item.id;return{...item,image:`${CDN}${asset}.webp`,audio:`${AUDIO}${asset}.mp3`,translation:T[item.id]?.[c]||T[item.id]?.en||''}});
window.SPWordOverviewStandard.render({root:'#app',items:rendered,title:'Wörter aus Thema 5',description:'Hier siehst und hörst du die neuen Behörden und Unterlagen.',translationLabel:LABEL[c]||'Englisch',headerSubtitle:'Wortschatzübersicht · Welche Behörde brauche ich? · A1 Lektion 9 · Thema 5'});
})();