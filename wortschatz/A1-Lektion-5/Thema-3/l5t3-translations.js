const STD_LANGS=[['en','EN'],['ru','RU'],['tr','TR'],['uk','UK'],['ar','AR'],['ja','JA'],['ro','RO'],['pl','PL'],['ku','KU']];
const LANG_NAMES={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
function langKey(){let p=null;try{p=(typeof profile==='function')?profile():JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')}catch(e){p=null}const raw=p?.motherLanguageCode||p?.muttersprache||p?.motherLanguage||p?.mother_language||p?.language||localStorage.getItem('motherLanguage')||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en';const m=String(raw||'').trim().toLowerCase();const map={ru:'ru',russisch:'ru',russian:'ru',tr:'tr',türkisch:'tr',tuerkisch:'tr',turkisch:'tr',turkish:'tr',uk:'uk',ua:'uk',ukrainisch:'uk',ukrainian:'uk',ar:'ar',arabisch:'ar',arabic:'ar',ja:'ja',japanisch:'ja',japanese:'ja',ro:'ro',rumänisch:'ro',rumaenisch:'ro',romanian:'ro',pl:'pl',polnisch:'pl',polish:'pl',ku:'ku',kurdisch:'ku',kurdish:'ku',en:'en',englisch:'en',english:'en'};if(map[m])return map[m];if(m.includes('russ'))return'ru';if(m.includes('türk')||m.includes('tuerk')||m.includes('turk'))return'tr';if(m.includes('ukrain'))return'uk';if(m.includes('arab'))return'ar';if(m.includes('japan'))return'ja';if(m.includes('rumän')||m.includes('rumaen')||m.includes('roman'))return'ro';if(m.includes('pol'))return'pl';if(m.includes('kurd'))return'ku';return'en'}
function tr(w){const t=w?.tr||{};const k=langKey();return t[k]||t.en||'—'}
function nativeTrHtml(w){const k=langKey(),t=w?.tr||{};return `<div class="native-trans"><b>Muttersprache (${LANG_NAMES[k]||k.toUpperCase()}):</b> ${t[k]||t.en||'—'}</div>`}
function stdTr(w){const t=w?.tr||{};return `<div class="std-trans">${STD_LANGS.map(([k,l])=>`<div><b>${l}:</b> ${t[k]||'—'}</div>`).join('')}</div>`}
(function(){
  const IMG={montag:'montag.png',dienstag:'dienstag.png',mittwoch:'mittwoch.png',donnerstag:'donnerstag.png',freitag:'freitag.png',samstag:'samstag.png',sonntag:'sonntag.png',morgen:'morgen.png',vormittag:'vormittag.png',mittag:'mittag.png',nachmittag:'nachmittag.png',abend:'abend.png',nacht:'nacht.png','acht-uhr':'uhr.png','halb-neun':'halb.png','viertel-nach-zehn':'viertel.png','zehn-vor-acht':'uhr.png',wochenende:'wochenende.png',woche:'woche.png',monat:'monat.png',aufstehen:'aufstehen.png','aufräumen':'aufraumen.png',aufraeumen:'aufraumen.png',fernsehen:'fernsehen.png',anrufen:'anrufen.png',anfangen:'anfangen.png',arbeiten:'arbeiten.png',lernen:'lernen.png'};
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
    'acht-uhr':{en:'eight o’clock',ru:'восемь часов',tr:'saat sekiz',uk:'восьма година',ar:'الساعة الثامنة',ja:'8時',ro:'ora opt',pl:'ósma godzina',ku:'saet heşt'},
    'halb-neun':{en:'half past eight',ru:'полдевятого',tr:'sekiz buçuk',uk:'пів на девʼяту',ar:'الثامنة والنصف',ja:'8時半',ro:'opt și jumătate',pl:'wpół do dziewiątej',ku:'heşt û nîv'},
    'viertel-nach-zehn':{en:'quarter past ten',ru:'четверть одиннадцатого',tr:'onu çeyrek geçe',uk:'чверть на одинадцяту',ar:'العاشرة والربع',ja:'10時15分',ro:'zece și un sfert',pl:'kwadrans po dziesiątej',ku:'deh û çaryek'},
    'zehn-vor-acht':{en:'ten to eight',ru:'без десяти восемь',tr:'sekize on var',uk:'за десять восьма',ar:'الثامنة إلا عشر دقائق',ja:'8時10分前',ro:'opt fără zece',pl:'za dziesięć ósma',ku:'deh kêmasî heşt'},
    wochenende:{en:'weekend',ru:'выходные',tr:'hafta sonu',uk:'вихідні',ar:'عطلة نهاية الأسبوع',ja:'週末',ro:'weekend',pl:'weekend',ku:'dawiya hefteyê'},
    woche:{en:'week',ru:'неделя',tr:'hafta',uk:'тиждень',ar:'أسبوع',ja:'週',ro:'săptămână',pl:'tydzień',ku:'hefte'},
    monat:{en:'month',ru:'месяц',tr:'ay',uk:'місяць',ar:'شهر',ja:'月',ro:'lună',pl:'miesiąc',ku:'meh'},
    aufstehen:{en:'to get up',ru:'вставать',tr:'kalkmak',uk:'вставати',ar:'ينهض / يستيقظ',ja:'起きる',ro:'a se trezi / a se ridica',pl:'wstawać',ku:'rabûn'},
    'aufräumen':{en:'to tidy up',ru:'убирать',tr:'toplamak / düzenlemek',uk:'прибирати',ar:'يرتب',ja:'片付ける',ro:'a face ordine',pl:'sprzątać',ku:'paqij kirin / rêxistin'},
    aufraeumen:{en:'to tidy up',ru:'убирать',tr:'toplamak / düzenlemek',uk:'прибирати',ar:'يرتب',ja:'片付ける',ro:'a face ordine',pl:'sprzątać',ku:'paqij kirin / rêxistin'},
    fernsehen:{en:'to watch TV',ru:'смотреть телевизор',tr:'televizyon izlemek',uk:'дивитися телевізор',ar:'يشاهد التلفاز',ja:'テレビを見る',ro:'a se uita la televizor',pl:'oglądać telewizję',ku:'temaşeya televîzyonê kirin'},
    anrufen:{en:'to call',ru:'звонить',tr:'aramak',uk:'телефонувати',ar:'يتصل',ja:'電話する',ro:'a suna',pl:'dzwonić',ku:'telefon kirin'},
    anfangen:{en:'to start / to begin',ru:'начинать / начинаться',tr:'başlamak',uk:'починати / починатися',ar:'يبدأ',ja:'始める / 始まる',ro:'a începe',pl:'zaczynać',ku:'dest pê kirin'},
    arbeiten:{en:'to work',ru:'работать',tr:'çalışmak',uk:'працювати',ar:'يعمل',ja:'働く',ro:'a lucra',pl:'pracować',ku:'kar kirin'},
    lernen:{en:'to learn / to study',ru:'учиться / учить',tr:'öğrenmek / çalışmak',uk:'вчитися / вчити',ar:'يتعلم / يدرس',ja:'学ぶ / 勉強する',ro:'a învăța',pl:'uczyć się',ku:'fêr bûn'}
  };
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{if(TR[w.id])w.tr=TR[w.id];if(IMG[w.id])w.image='/assets/img/'+IMG[w.id]});
  window.displayImage=function(w){return w?.image||''};window.hasGoodImage=function(w){return !!(w&&w.image)};
  window.fixImg=function(el){const ph=document.createElement('div');ph.className='word-placeholder';ph.textContent='kein Bild';el.replaceWith(ph)};
  window.imgHtml=function(w){return hasGoodImage(w)?`<img src="${displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="word-placeholder">kein Bild</div>`};
  window.bigImgHtml=function(w){return hasGoodImage(w)?`<img class="task-img" src="${displayImage(w)}" onerror="fixImg(this)" alt="">`:`<div class="placeholder-img">Bild fehlt<br>${full(w)}</div>`};
  window.renderOverview=function(el){const groups={};WORDS.forEach(w=>(groups[w.type]=groups[w.type]||[]).push(w));el.innerHTML=Object.keys(groups).map(g=>`<div class="type-block"><div class="type-title">${g}</div>${groups[g].map(w=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b><div class="small">${w.plural?`Plural: ${w.plural}`:'kein Plural'}</div>${stdTr(w)}<div class="small">${w.type}</div></div></div>`).join('')}</div>`).join('')};
  window.renderStats=function(el){const st=loadTask('karteikarten.html',WORDS.length);el.innerHTML=WORDS.map((w,i)=>`<div class="word-row">${imgHtml(w)}<div><b>${full(w)}</b>${stdTr(w)}<div class="small ${st.done.includes(i)?'ok':'todo'}">${st.done.includes(i)?'gelernt':'noch offen'}</div></div></div>`).join('')};
})();