(function(){
'use strict';
const LANGS={
 en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],
 uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],
 ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']
};
const T={
 leise:{en:'quiet / quietly',ru:'тихо / тихий',tr:'sessiz / sessizce',uk:'тихо / тихий',ar:'هادئ / بهدوء',ja:'静か / 静かに',ro:'încet / liniștit',pl:'cicho / cichy',ku:'bêdeng / bi dengê nizm'},
 erklaeren:{en:'to explain',ru:'объяснять',tr:'açıklamak',uk:'пояснювати',ar:'يشرح',ja:'説明する',ro:'a explica',pl:'wyjaśniać',ku:'rave kirin'},
 laut:{en:'loud',ru:'громко / громкий',tr:'yüksek sesle',uk:'голосно / гучний',ar:'بصوت عالٍ',ja:'大きな声で / うるさい',ro:'tare / cu voce tare',pl:'głośno / głośny',ku:'bi dengê bilind'},
 ausmachen:{en:'to switch off',ru:'выключать',tr:'kapatmak',uk:'вимикати',ar:'يطفئ / يغلق',ja:'消す / 電源を切る',ro:'a opri',pl:'wyłączać',ku:'vemirandin'},
 zuhoeren:{en:'to listen',ru:'слушать',tr:'dinlemek',uk:'слухати',ar:'يستمع',ja:'聞く / 耳を傾ける',ro:'a asculta',pl:'słuchać',ku:'guhdarî kirin'},
 aufstehen:{en:'to stand up / get up',ru:'вставать',tr:'ayağa kalkmak',uk:'вставати',ar:'ينهض / يقف',ja:'立つ / 起きる',ro:'a se ridica',pl:'wstawać',ku:'rabûn'},
 warten:{en:'to wait',ru:'ждать',tr:'beklemek',uk:'чекати',ar:'ينتظر',ja:'待つ',ro:'a aștepta',pl:'czekać',ku:'li bendê man'},
 gebuehr:{en:'fee',ru:'сбор / плата',tr:'ücret',uk:'збір / плата',ar:'رسوم',ja:'手数料 / 料金',ro:'taxă',pl:'opłata',ku:'heq / ücret'},
 kasse:{en:'cash desk / checkout',ru:'касса',tr:'kasa',uk:'каса',ar:'صندوق الدفع',ja:'レジ / 会計',ro:'casă',pl:'kasa',ku:'kasa'},
 lachen:{en:'to laugh',ru:'смеяться',tr:'gülmek',uk:'сміятися',ar:'يضحك',ja:'笑う',ro:'a râde',pl:'śmiać się',ku:'kenîn'},
 autovermietung:{en:'car rental',ru:'прокат автомобилей',tr:'araç kiralama',uk:'прокат автомобілів',ar:'تأجير السيارات',ja:'レンタカー会社',ro:'închiriere auto',pl:'wypożyczalnia samochodów',ku:'kirêkirina otomobîlan'},
 hingehen:{en:'to go there',ru:'идти туда',tr:'oraya gitmek',uk:'йти туди',ar:'يذهب إلى هناك',ja:'そこへ行く',ro:'a merge acolo',pl:'iść tam',ku:'çûn wir'},
 laden:{en:'to load',ru:'грузить',tr:'yüklemek',uk:'завантажувати / вантажити',ar:'يحمّل',ja:'積み込む',ro:'a încărca',pl:'ładować',ku:'bar kirin'},
 wartebereich:{en:'waiting area',ru:'зона ожидания',tr:'bekleme alanı',uk:'зона очікування',ar:'منطقة الانتظار',ja:'待合スペース',ro:'zonă de așteptare',pl:'poczekalnia / strefa oczekiwania',ku:'qada bendê'},
 aufhoeren:{en:'to stop',ru:'прекращать',tr:'bırakmak / durmak',uk:'припиняти',ar:'يتوقف',ja:'やめる',ro:'a se opri',pl:'przestawać',ku:'rawestan'},
 anmeldung:{en:'registration',ru:'регистрация',tr:'kayıt',uk:'реєстрація',ar:'تسجيل',ja:'登録 / 申込み',ro:'înscriere',pl:'rejestracja / zapis',ku:'qeydkirin'},
 stock:{en:'floor / storey',ru:'этаж',tr:'kat',uk:'поверх',ar:'طابق',ja:'階',ro:'etaj',pl:'piętro',ku:'qat'},
 unterricht:{en:'lesson / class',ru:'занятие / урок',tr:'ders',uk:'заняття / урок',ar:'درس / حصة',ja:'授業',ro:'curs / lecție',pl:'lekcja / zajęcia',ku:'ders / perwerdehî'},
 sprachschule:{en:'language school',ru:'языковая школа',tr:'dil okulu',uk:'мовна школа',ar:'مدرسة لغات',ja:'語学学校',ro:'școală de limbi străine',pl:'szkoła językowa',ku:'dibistana ziman'}
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){
 const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en');
 for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;
 return'en';
}
const c=code();
for(const item of window.L9T2?.cards||[]){
 const tr=T[item.id]?.[c]||T[item.id]?.en;
 if(tr){item.translation=tr;item.meaning=`${tr} · ${item.meaning||''}`}
}
window.L9T2Translations={code:c,lexicon:T};
})();