(function(){
'use strict';
const LANGS={en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']};
const T={
 leiser:{en:'quieter',ru:'тише',tr:'daha sessiz',uk:'тихіше',ar:'بصوت أخفض',ja:'もっと静かに',ro:'mai încet',pl:'ciszej',ku:'deng kêmtir'},
 erklaeren:{en:'to explain',ru:'объяснять',tr:'açıklamak',uk:'пояснювати',ar:'يشرح',ja:'説明する',ro:'a explica',pl:'wyjaśniać',ku:'rave kirin'},
 laut:{en:'loud / loudly',ru:'громко',tr:'yüksek sesle',uk:'голосно',ar:'بصوت عالٍ',ja:'大きな声で',ro:'tare / cu voce tare',pl:'głośno',ku:'bi dengê bilind'},
 ausmachen:{en:'to switch off',ru:'выключать',tr:'kapatmak',uk:'вимикати',ar:'يطفئ / يغلق',ja:'消す',ro:'a opri',pl:'wyłączać',ku:'vemirandin'},
 zuhoeren:{en:'to listen',ru:'слушать',tr:'dinlemek',uk:'слухати',ar:'يستمع',ja:'よく聞く',ro:'a asculta',pl:'słuchać',ku:'guhdarî kirin'},
 aufstehen:{en:'to stand up / get up',ru:'вставать',tr:'ayağa kalkmak',uk:'вставати',ar:'ينهض / يقف',ja:'立つ / 起きる',ro:'a se ridica',pl:'wstawać',ku:'rabûn'},
 warten:{en:'to wait',ru:'ждать',tr:'beklemek',uk:'чекати',ar:'ينتظر',ja:'待つ',ro:'a aștepta',pl:'czekać',ku:'li bendê man'},
 gebuehr:{en:'fee',ru:'сбор / плата',tr:'ücret',uk:'збір / плата',ar:'رسوم',ja:'手数料 / 料金',ro:'taxă',pl:'opłata',ku:'heq / ücret'},
 kasse:{en:'cash desk / checkout',ru:'касса',tr:'kasa',uk:'каса',ar:'صندوق الدفع',ja:'レジ / 会計',ro:'casă / casierie',pl:'kasa',ku:'kasa'},
 lachen:{en:'to laugh',ru:'смеяться',tr:'gülmek',uk:'сміятися',ar:'يضحك',ja:'笑う',ro:'a râde',pl:'śmiać się',ku:'kenîn'},
 aufhoeren:{en:'to stop',ru:'прекращать',tr:'durmak / bırakmak',uk:'припиняти',ar:'يتوقف',ja:'やめる',ro:'a se opri',pl:'przestawać',ku:'rawestan'},
 doch:{en:'do / come on / after all',ru:'же / всё-таки',tr:'ya / hadi / aslında',uk:'же / все-таки',ar:'هيا / بالفعل',ja:'ほら / ぜひ / じゃあ',ro:'totuși / hai',pl:'przecież / no',ku:'ka / lê'},
 bitte:{en:'please',ru:'пожалуйста',tr:'lütfen',uk:'будь ласка',ar:'من فضلك',ja:'お願いします / どうぞ',ro:'vă rog / te rog',pl:'proszę',ku:'ji kerema xwe'},
 mal:{en:'just / for a moment',ru:'-ка / немного',tr:'bir / şöyle',uk:'-но / трохи',ar:'قليلاً / مرة',ja:'ちょっと / 一度',ro:'puțin / o dată',pl:'no / raz',ku:'carekê / hinek'},
 anmeldung:{en:'registration',ru:'регистрация',tr:'kayıt',uk:'реєстрація',ar:'التسجيل',ja:'登録 / 申込み',ro:'înscriere',pl:'rejestracja / zapis',ku:'tomarkirin'},
 kursgebuehr:{en:'course fee',ru:'плата за курс',tr:'kurs ücreti',uk:'плата за курс',ar:'رسوم الدورة',ja:'受講料',ro:'taxă de curs',pl:'opłata za kurs',ku:'heqê kursê'},
 stock:{en:'floor / storey',ru:'этаж',tr:'kat',uk:'поверх',ar:'طابق',ja:'階',ro:'etaj',pl:'piętro',ku:'qat'},
 unterricht:{en:'lesson / class',ru:'занятие / урок',tr:'ders',uk:'заняття / урок',ar:'الدرس / الحصة',ja:'授業',ro:'curs / lecție',pl:'zajęcia / lekcja',ku:'ders'},
 sprachschule:{en:'language school',ru:'языковая школа',tr:'dil okulu',uk:'мовна школа',ar:'مدرسة لغات',ja:'語学学校',ro:'școală de limbi străine',pl:'szkoła językowa',ku:'dibistana ziman'}
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en');for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;return'en'}
const c=code();for(const item of window.L9T2?.cards||[]){const tr=T[item.id]?.[c]||T[item.id]?.en;if(tr){item.translation=tr;item.meaning=`${tr}${item.meaning?` · ${item.meaning}`:''}`}}
window.L9T2Translations={code:c,lexicon:T};
})();
