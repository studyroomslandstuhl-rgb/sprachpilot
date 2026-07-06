const STD_LANGS=[['en','EN'],['ru','RU'],['tr','TR'],['uk','UK'],['ar','AR'],['ja','JA'],['ro','RO'],['pl','PL'],['ku','KU']];
const LANG_NAMES={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
function langKey(){
  let p=null;try{p=(typeof profile==='function')?profile():JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')}catch(e){p=null}
  const raw=p?.motherLanguageCode||p?.muttersprache||p?.motherLanguage||p?.mother_language||p?.language||localStorage.getItem('motherLanguage')||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en';
  const m=String(raw||'').trim().toLowerCase();
  const map={ru:'ru',russisch:'ru',russian:'ru',tr:'tr',türkisch:'tr',tuerkisch:'tr',turkisch:'tr',turkish:'tr',uk:'uk',ua:'uk',ukrainisch:'uk',ukrainian:'uk',ar:'ar',arabisch:'ar',arabic:'ar',ja:'ja',japanisch:'ja',japanese:'ja',ro:'ro',rumänisch:'ro',rumaenisch:'ro',romanian:'ro',pl:'pl',polnisch:'pl',polish:'pl',ku:'ku',kurdisch:'ku',kurdish:'ku',en:'en',englisch:'en',english:'en'};
  if(map[m])return map[m];
  if(m.includes('russ'))return'ru';if(m.includes('türk')||m.includes('tuerk')||m.includes('turk'))return'tr';if(m.includes('ukrain'))return'uk';if(m.includes('arab'))return'ar';if(m.includes('japan'))return'ja';if(m.includes('rumän')||m.includes('rumaen')||m.includes('roman'))return'ro';if(m.includes('pol'))return'pl';if(m.includes('kurd'))return'ku';return'en';
}
function tr(w){const t=w?.tr||{};const k=langKey();return t[k]||t.en||'—'}
function nativeTrHtml(w){const k=langKey(),t=w?.tr||{};return `<div class="native-trans"><b>Muttersprache (${LANG_NAMES[k]||k.toUpperCase()}):</b> ${t[k]||t.en||'—'}</div>`}
function stdTr(w){const t=w?.tr||{};return `<div class="std-trans">${STD_LANGS.map(([k,l])=>`<div><b>${l}:</b> ${t[k]||'—'}</div>`).join('')}</div>`}
(function(){
  const IMG={montag:'montag.png',dienstag:'dienstag.png',mittwoch:'mittwoch.png',donnerstag:'donnerstag.png',freitag:'freitag.png',samstag:'samstag.png',sonntag:'sonntag.png',morgen:'morgen.png',vormittag:'vormittag.png',mittag:'mittag.png',nachmittag:'nachmittag.png',abend:'abend.png',nacht:'nacht.png',um:'um.png',am:'am.png',von:'von.png',bis:'bis.png',fernsehen:'fernsehen.png',aufraeumen:'aufraumen.png',anfangen:'anfangen.png',anrufen:'anrufen.png',kurs:'kurs.png',termin:'termin.png',pause:'pause.png',arbeit:'arbeit.png',training:'training.png',wann:'wann.png'};
  const TR={
    montag:{en:'Monday',ru:'понедельник',tr:'pazartesi',uk:'понеділок',ar:'الاثنين',ja:'月曜日',ro:'luni',pl:'poniedziałek',ku:'duşem'},
    dienstag:{en:'Tuesday',ru:'вторник',tr:'salı',uk:'вівторок',ar:'الثلاثاء',ja:'火曜日',ro:'marți',pl:'wtorek',ku:'sêşem'},
    mittwoch:{en:'Wednesday',ru:'среда',tr:'çarşamba',uk:'середа',ar:'الأربعاء',ja:'水曜日',ro:'miercuri',pl:'środa',ku:'çarşem'},
    donnerstag:{en:'Thursday',ru:'четверг',tr:'perşembe',uk:'четвер',ar:'الخميس',ja:'木曜日',ro:'joi',pl:'czwartek',ku:'pêncşem'},
    freitag:{en:'Friday',ru:'пятница',tr:'cuma',uk:'пʼятниця',ar:'الجمعة',ja:'金曜日',ro:'vineri',pl:'piątek',ku:'în'},
    samstag:{en:'Saturday',ru:'суббота',tr:'cumartesi',uk:'субота',ar:'السبت',ja:'土曜日',ro:'sâmbătă',pl:'sobota',ku:'şemî'},
    sonntag:{en:'Sunday',ru:'воскресенье',tr:'pazar',uk:'неділя',ar:'الأحد',ja:'日曜日',ro:'duminică',pl:'niedziela',ku:'yekşem'},
    morgen:{en:'morning',ru:'утро',tr:'sabah',uk:'ранок',ar:'الصباح',ja:'朝',ro:'dimineață',pl:'rano / poranek',ku:'sibeh'},
    vormittag:{en:'morning / before noon',ru:'утро / до полудня',tr:'öğleden önce',uk:'до обіду',ar:'قبل الظهر',ja:'午前',ro:'înainte de prânz',pl:'przedpołudnie',ku:'berî nîvro'},
    mittag:{en:'noon / midday',ru:'полдень / обеденное время',tr:'öğle',uk:'полудень / обід',ar:'الظهر',ja:'正午 / 昼',ro:'amiază',pl:'południe',ku:'nîvro'},
    nachmittag:{en:'afternoon',ru:'день / после обеда',tr:'öğleden sonra',uk:'після обіду',ar:'بعد الظهر',ja:'午後',ro:'după-amiază',pl:'popołudnie',ku:'piştî nîvro'},
    abend:{en:'evening',ru:'вечер',tr:'akşam',uk:'вечір',ar:'المساء',ja:'夕方 / 夜',ro:'seară',pl:'wieczór',ku:'êvar'},
    nacht:{en:'night',ru:'ночь',tr:'gece',uk:'ніч',ar:'الليل',ja:'夜',ro:'noapte',pl:'noc',ku:'şev'},
    um:{en:'at',ru:'в / около',tr:'saat ...de',uk:'о / близько',ar:'في الساعة',ja:'〜に',ro:'la',pl:'o / około',ku:'di saet ... de'},
    am:{en:'on / in the',ru:'в / на',tr:'-de / -da',uk:'у / в',ar:'في / على',ja:'〜に',ro:'la / în',pl:'w / na',ku:'di ... de'},
    von:{en:'from',ru:'с / от',tr:'-den / -dan',uk:'з / від',ar:'من',ja:'〜から',ro:'de la',pl:'od / z',ku:'ji'},
    bis:{en:'until / to',ru:'до',tr:'kadar',uk:'до',ar:'حتى',ja:'〜まで',ro:'până la',pl:'do',ku:'heta'},
    fernsehen:{en:'to watch TV',ru:'смотреть телевизор',tr:'televizyon izlemek',uk:'дивитися телевізор',ar:'يشاهد التلفاز',ja:'テレビを見る',ro:'a se uita la televizor',pl:'oglądać telewizję',ku:'temaşeya televîzyonê kirin'},
    aufraeumen:{en:'to tidy up',ru:'убирать',tr:'toplamak / düzenlemek',uk:'прибирати',ar:'يرتب',ja:'片付ける',ro:'a face ordine',pl:'sprzątać',ku:'paqij kirin / rêxistin'},
    anfangen:{en:'to start / to begin',ru:'начинать / начинаться',tr:'başlamak',uk:'починати / починатися',ar:'يبدأ',ja:'始める / 始まる',ro:'a începe',pl:'zaczynać',ku:'dest pê kirin'},
    anrufen:{en:'to call',ru:'звонить',tr:'aramak',uk:'телефонувати',ar:'يتصل',ja:'電話する',ro:'a suna',pl:'dzwonić',ku:'telefon kirin'},
    kurs:{en:'course',ru:'курс',tr:'kurs',uk:'курс',ar:'دورة / كورس',ja:'コース / 授業',ro:'curs',pl:'kurs',ku:'kurs'},
    termin:{en:'appointment',ru:'термин / встреча',tr:'randevu',uk:'зустріч / запис',ar:'موعد',ja:'予約 / 予定',ro:'programare',pl:'termin / spotkanie',ku:'hevdîtin / randevû'},
    pause:{en:'break',ru:'пауза / перерыв',tr:'mola',uk:'перерва',ar:'استراحة',ja:'休憩',ro:'pauză',pl:'przerwa',ku:'navber'},
    arbeit:{en:'work',ru:'работа',tr:'iş / çalışma',uk:'робота',ar:'عمل',ja:'仕事',ro:'muncă / serviciu',pl:'praca',ku:'kar'},
    training:{en:'training',ru:'тренировка',tr:'antrenman',uk:'тренування',ar:'تدريب',ja:'トレーニング',ro:'antrenament',pl:'trening',ku:'rahênan'},
    wann:{en:'when',ru:'когда',tr:'ne zaman',uk:'коли',ar:'متى',ja:'いつ',ro:'când',pl:'kiedy',ku:'kengî'}
  };
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{if(TR[w.id])w.tr=TR[w.id];if(IMG[w.id])w.image='/assets/img/'+IMG[w.id]});
  window.displayImage=function(w){return w?.image||''};
  window.hasGoodImage=function(w){return !!(w&&w.image)};
  window.imgHtml=function(w){return hasGoodImage(w)?`<img src="${displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`};
  window.bigImgHtml=function(w){return hasGoodImage(w)?`<img class="task-img" src="${displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`};
  window.renderOverview=function(el){const groups={};WORDS.forEach(w=>(groups[w.type]=groups[w.type]||[]).push(w));el.innerHTML=Object.keys(groups).map(g=>`<div class="type-block"><div class="type-title">${g}</div>${groups[g].map(w=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b><div class="small">${w.plural?`Plural: ${w.plural}`:'kein Plural'}</div>${stdTr(w)}<div class="small">${w.type}</div></div></div>`).join('')}</div>`).join('')};
  window.renderStats=function(el){const st=loadTask('karteikarten.html',WORDS.length);el.innerHTML=WORDS.map((w,i)=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b>${stdTr(w)}<div class="small ${st.done.includes(i)?'ok':'todo'}">${st.done.includes(i)?'gelernt':'noch offen'}</div></div></div>`).join('')};
})();