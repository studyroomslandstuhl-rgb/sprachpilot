try{import('./l5t2-theme-open.js?v=1')}catch(e){}
const STD_LANGS=[['en','EN'],['ru','RU'],['tr','TR'],['uk','UK'],['ar','AR'],['ja','JA'],['ro','RO'],['pl','PL'],['ku','KU']];
const LANG_NAMES={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
function langKey(){
  let p=null;
  try{p=(typeof profile==='function')?profile():JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'null')}catch(e){p=null}
  const raw=p?.motherLanguageCode||p?.muttersprache||p?.motherLanguage||p?.mother_language||p?.language||localStorage.getItem('motherLanguage')||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en';
  const m=String(raw||'').trim().toLowerCase();
  const map={ru:'ru',rus:'ru',russisch:'ru',russian:'ru',русский:'ru',tr:'tr',türkisch:'tr',tuerkisch:'tr',turkisch:'tr',turkish:'tr',türkçe:'tr',uk:'uk',ua:'uk',ukrainisch:'uk',ukrainian:'uk',українська:'uk',украинский:'uk',ar:'ar',arabisch:'ar',arabic:'ar',العربية:'ar',ja:'ja',japanisch:'ja',japanese:'ja',日本語:'ja',ro:'ro',rumänisch:'ro',rumaenisch:'ro',romanian:'ro',română:'ro',pl:'pl',polnisch:'pl',polish:'pl',polski:'pl',ku:'ku',kurdisch:'ku',kurdish:'ku',kurdî:'ku',en:'en',englisch:'en',english:'en'};
  if(map[m])return map[m];
  if(m.includes('russ'))return'ru';
  if(m.includes('türk')||m.includes('tuerk')||m.includes('turk'))return'tr';
  if(m.includes('ukrain'))return'uk';
  if(m.includes('arab'))return'ar';
  if(m.includes('japan'))return'ja';
  if(m.includes('rumän')||m.includes('rumaen')||m.includes('roman'))return'ro';
  if(m.includes('pol'))return'pl';
  if(m.includes('kurd')||m.includes('kurdî'))return'ku';
  return'en';
}
function tr(w){const t=w?.tr||{};const k=langKey();return t[k]||t.en||w?.word||w?.full||'—'}
function nativeTrHtml(w){const k=langKey(),t=w?.tr||{};return `<div class="native-trans"><b>Muttersprache (${LANG_NAMES[k]||k.toUpperCase()}):</b> ${t[k]||t.en||'—'}</div>`}
function stdTr(w){const t=w?.tr||{};return `<div class="std-trans">${STD_LANGS.map(([k,l])=>`<div><b>${l}:</b> ${t[k]||'—'}</div>`).join('')}</div>`}
(function(){
  const IMG={spaet:'spaet.png',schon:'schon.png',erst:'erst.png',viertel:'viertel.png',halb:'halb.png',uhr:'uhr.png',kurz:'kurz.png',gleich:'gleich.png',sekunde:'sekunde.png',minute:'minute.png',stunde:'stunde.png',tag:'tag.png',woche:'woche.png',monat:'monat.png',jahr:'jahr.png'};
  const TR={
    spaet:{en:'late',ru:'поздно',tr:'geç',uk:'пізно',ar:'متأخر',ja:'遅い',ro:'târziu',pl:'późno',ku:'dereng'},
    schon:{en:'already',ru:'уже',tr:'zaten',uk:'вже',ar:'بالفعل',ja:'もう',ro:'deja',pl:'już',ku:'jixwe / êdî'},
    erst:{en:'only / not until',ru:'только / лишь',tr:'daha / sadece',uk:'лише / тільки',ar:'فقط / ليس قبل',ja:'まだ / たった',ro:'abia / doar',pl:'dopiero / tylko',ku:'tenê / hîn'},
    viertel:{en:'quarter',ru:'четверть',tr:'çeyrek',uk:'чверть',ar:'ربع',ja:'4分の1',ro:'sfert',pl:'kwadrans',ku:'çaryek'},
    halb:{en:'half',ru:'половина',tr:'yarım',uk:'половина',ar:'نصف',ja:'半',ro:'jumătate',pl:'pół',ku:'nîv'},
    uhr:{en:'clock / o’clock',ru:'часы / час',tr:'saat',uk:'годинник / година',ar:'ساعة',ja:'時計 / 時',ro:'ceas / ora',pl:'zegar / godzina',ku:'saet'},
    kurz:{en:'shortly / just',ru:'незадолго / почти',tr:'az kala / kısa',uk:'незадовго / майже',ar:'قبل قليل / تقريبًا',ja:'少し前 / もうすぐ',ro:'cu puțin înainte',pl:'krótko / zaraz',ku:'kin / nêzîk'},
    gleich:{en:'soon / almost',ru:'скоро / почти',tr:'hemen / neredeyse',uk:'скоро / майже',ar:'قريبًا / تقريبًا',ja:'もうすぐ / ほぼ',ro:'imediat / aproape',pl:'zaraz / prawie',ku:'niha / nêzîk'},
    sekunde:{en:'second',ru:'секунда',tr:'saniye',uk:'секунда',ar:'ثانية',ja:'秒',ro:'secundă',pl:'sekunda',ku:'çirke'},
    minute:{en:'minute',ru:'минута',tr:'dakika',uk:'хвилина',ar:'دقيقة',ja:'分',ro:'minut',pl:'minuta',ku:'deqe'},
    stunde:{en:'hour',ru:'час',tr:'saat',uk:'година',ar:'ساعة',ja:'時間',ro:'oră',pl:'godzina',ku:'saet'},
    tag:{en:'day',ru:'день',tr:'gün',uk:'день',ar:'يوم',ja:'日',ro:'zi',pl:'dzień',ku:'roj'},
    woche:{en:'week',ru:'неделя',tr:'hafta',uk:'тиждень',ar:'أسبوع',ja:'週',ro:'săptămână',pl:'tydzień',ku:'hefte'},
    monat:{en:'month',ru:'месяц',tr:'ay',uk:'місяць',ar:'شهر',ja:'月',ro:'lună',pl:'miesiąc',ku:'meh'},
    jahr:{en:'year',ru:'год',tr:'yıl',uk:'рік',ar:'سنة',ja:'年',ro:'an',pl:'rok',ku:'sal'}
  };
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{if(TR[w.id])w.tr=TR[w.id];if(IMG[w.id])w.image='/assets/img/'+IMG[w.id]});
  if(typeof TIME_NOUNS!=='undefined')TIME_NOUNS.forEach(w=>{if(TR[w.id])w.tr=TR[w.id];if(IMG[w.id])w.image='/assets/img/'+IMG[w.id]});
})();