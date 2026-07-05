function langKey(){
  const p=(typeof profile==='function')?profile():null;
  const m=String(p?.muttersprache||p?.motherLanguage||p?.mother_language||p?.language||'').toLowerCase();
  if(m.includes('russ')||m.includes('russian')||m==='ru')return'ru';
  if(m.includes('türk')||m.includes('turk')||m.includes('turkish')||m==='tr')return'tr';
  if(m.includes('ukrain')||m.includes('ukrainian')||m==='uk')return'uk';
  if(m.includes('arab')||m.includes('arabic')||m==='ar')return'ar';
  if(m.includes('japan')||m.includes('japanese')||m==='ja')return'ja';
  if(m.includes('rumän')||m.includes('ruman')||m.includes('romanian')||m==='ro')return'ro';
  return'en';
}
function tr(w){const t=w.tr||{};const k=langKey();return t[k]||t.en||'—'}
(function(){
  const TR={
    montag:{en:'Monday',ru:'понедельник',tr:'pazartesi',uk:'понеділок',ar:'الاثنين',ja:'月曜日',ro:'luni'},
    dienstag:{en:'Tuesday',ru:'вторник',tr:'salı',uk:'вівторок',ar:'الثلاثاء',ja:'火曜日',ro:'marți'},
    mittwoch:{en:'Wednesday',ru:'среда',tr:'çarşamba',uk:'середа',ar:'الأربعاء',ja:'水曜日',ro:'miercuri'},
    donnerstag:{en:'Thursday',ru:'четверг',tr:'perşembe',uk:'четвер',ar:'الخميس',ja:'木曜日',ro:'joi'},
    freitag:{en:'Friday',ru:'пятница',tr:'cuma',uk:'пʼятниця',ar:'الجمعة',ja:'金曜日',ro:'vineri'},
    samstag:{en:'Saturday',ru:'суббота',tr:'cumartesi',uk:'субота',ar:'السبت',ja:'土曜日',ro:'sâmbătă'},
    sonntag:{en:'Sunday',ru:'воскресенье',tr:'pazar',uk:'неділя',ar:'الأحد',ja:'日曜日',ro:'duminică'},
    morgen:{en:'morning',ru:'утро',tr:'sabah',uk:'ранок',ar:'الصباح',ja:'朝',ro:'dimineață'},
    vormittag:{en:'morning / before noon',ru:'утро / до полудня',tr:'öğleden önce',uk:'до обіду',ar:'قبل الظهر',ja:'午前',ro:'înainte de prânz'},
    mittag:{en:'noon / midday',ru:'полдень / обеденное время',tr:'öğle',uk:'полудень / обід',ar:'الظهر',ja:'正午 / 昼',ro:'amiază'},
    nachmittag:{en:'afternoon',ru:'день / после обеда',tr:'öğleden sonra',uk:'після обіду',ar:'بعد الظهر',ja:'午後',ro:'după-amiază'},
    abend:{en:'evening',ru:'вечер',tr:'akşam',uk:'вечір',ar:'المساء',ja:'夕方 / 夜',ro:'seară'},
    nacht:{en:'night',ru:'ночь',tr:'gece',uk:'ніч',ar:'الليل',ja:'夜',ro:'noapte'},
    um:{en:'at',ru:'в / около',tr:'saat ...de',uk:'о / близько',ar:'في الساعة',ja:'〜に',ro:'la'},
    am:{en:'on / in the',ru:'в / на',tr:'-de / -da',uk:'у / в',ar:'في / على',ja:'〜に',ro:'la / în'},
    von:{en:'from',ru:'с / от',tr:'-den / -dan',uk:'з / від',ar:'من',ja:'〜から',ro:'de la'},
    bis:{en:'until / to',ru:'до',tr:'kadar',uk:'до',ar:'حتى',ja:'〜まで',ro:'până la'},
    fernsehen:{en:'to watch TV',ru:'смотреть телевизор',tr:'televizyon izlemek',uk:'дивитися телевізор',ar:'يشاهد التلفاز',ja:'テレビを見る',ro:'a se uita la televizor'},
    aufraeumen:{en:'to tidy up',ru:'убирать',tr:'toplamak / düzenlemek',uk:'прибирати',ar:'يرتب',ja:'片付ける',ro:'a face ordine'},
    anfangen:{en:'to start / to begin',ru:'начинать / начинаться',tr:'başlamak',uk:'починати / починатися',ar:'يبدأ',ja:'始める / 始まる',ro:'a începe'},
    anrufen:{en:'to call',ru:'звонить',tr:'aramak',uk:'телефонувати',ar:'يتصل',ja:'電話する',ro:'a suna'},
    kurs:{en:'course',ru:'курс',tr:'kurs',uk:'курс',ar:'دورة / كورس',ja:'コース / 授業',ro:'curs'},
    termin:{en:'appointment',ru:'термин / встреча',tr:'randevu',uk:'зустріч / запис',ar:'موعد',ja:'予約 / 予定',ro:'programare'},
    pause:{en:'break',ru:'пауза / перерыв',tr:'mola',uk:'перерва',ar:'استراحة',ja:'休憩',ro:'pauză'},
    arbeit:{en:'work',ru:'работа',tr:'iş / çalışma',uk:'робота',ar:'عمل',ja:'仕事',ro:'muncă / serviciu'},
    training:{en:'training',ru:'тренировка',tr:'antrenman',uk:'тренування',ar:'تدريب',ja:'トレーニング',ro:'antrenament'},
    wann:{en:'when',ru:'когда',tr:'ne zaman',uk:'коли',ar:'متى',ja:'いつ',ro:'când'}
  };
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{if(TR[w.id])w.tr=TR[w.id]});
})();