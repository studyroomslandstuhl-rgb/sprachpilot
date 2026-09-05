(function(){
'use strict';
const LANGS={
 en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],
 uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],
 ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']
};
const T={
 leiser:{en:'quieter',ru:'тише',tr:'daha sessiz',uk:'тихіше',ar:'بصوت أخفض',ja:'もっと静かに',ro:'mai încet',pl:'ciszej',ku:'bi dengê nizm'},
 erklaeren:{en:'to explain',ru:'объяснять',tr:'açıklamak',uk:'пояснювати',ar:'يشرح',ja:'説明する',ro:'a explica',pl:'wyjaśniać',ku:'rave kirin'},
 laut:{en:'loud',ru:'громко / громкий',tr:'yüksek sesle',uk:'голосно / гучний',ar:'بصوت عالٍ',ja:'大きな声で / うるさい',ro:'tare / cu voce tare',pl:'głośno / głośny',ku:'bi dengê bilind'},
 ausmachen:{en:'to switch off',ru:'выключать',tr:'kapatmak',uk:'вимикати',ar:'يطفئ / يغلق',ja:'消す / 電源を切る',ro:'a opri',pl:'wyłączać',ku:'vemirandin'},
 zuhoeren:{en:'to listen',ru:'слушать',tr:'dinlemek',uk:'слухати',ar:'يستمع',ja:'聞く / 耳を傾ける',ro:'a asculta',pl:'słuchać',ku:'guhdarî kirin'},
 aufstehen:{en:'to stand up / get up',ru:'вставать',tr:'ayağa kalkmak',uk:'вставати',ar:'ينهض / يقف',ja:'立つ / 起きる',ro:'a se ridica',pl:'wstawać',ku:'rabûn'},
 warten:{en:'to wait',ru:'ждать',tr:'beklemek',uk:'чекати',ar:'ينتظر',ja:'待つ',ro:'a aștepta',pl:'czekać',ku:'li bendê man'},
 gebuehr:{en:'fee',ru:'сбор / плата',tr:'ücret',uk:'збір / плата',ar:'رسوم',ja:'手数料 / 料金',ro:'taxă',pl:'opłata',ku:'heq / ücret'},
 kasse:{en:'cash desk / checkout',ru:'касса',tr:'kasa',uk:'каса',ar:'صندوق الدفع',ja:'レジ / 会計',ro:'casă',pl:'kasa',ku:'kasa'},
 lachen:{en:'to laugh',ru:'смеяться',tr:'gülmek',uk:'сміятися',ar:'يضحك',ja:'笑う',ro:'a râde',pl:'śmiać się',ku:'kenîn'},
 aufhoeren:{en:'to stop',ru:'прекращать',tr:'bırakmak / durmak',uk:'припиняти',ar:'يتوقف',ja:'やめる',ro:'a se opri',pl:'przestawać',ku:'rawestan'},
 doch:{en:'do / after all (particle)',ru:'же / всё-таки',tr:'ya / hadi (edat)',uk:'ж / все-таки',ar:'بل / أداة للتلطيف أو التأكيد',ja:' doch（強調・やわらげる語）',ro:'totuși / doar',pl:'przecież / jednak',ku:'lê / erê'},
 bitte:{en:'please',ru:'пожалуйста',tr:'lütfen',uk:'будь ласка',ar:'من فضلك',ja:'お願いします / どうぞ',ro:'te rog / vă rog',pl:'proszę',ku:'ji kerema xwe'},
 mal:{en:'just / once (particle)',ru:'-ка / раз',tr:'bir / hele (edat)',uk:'-но / раз',ar:'مرة / أداة محادثة',ja:' mal（会話の助詞）',ro:'puțin / o dată',pl:'raz / no',ku:'carêk'},
 anmeldung:{en:'registration',ru:'регистрация',tr:'kayıt',uk:'реєстрація',ar:'تسجيل',ja:'登録 / 申込み',ro:'înscriere',pl:'rejestracja / zapis',ku:'qeydkirin'},
 kursgebuehr:{en:'course fee',ru:'плата за курс',tr:'kurs ücreti',uk:'плата за курс',ar:'رسوم الدورة',ja:'受講料',ro:'taxă de curs',pl:'opłata za kurs',ku:'heqê kursê'},
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