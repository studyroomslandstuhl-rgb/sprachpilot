function langKey(){
  const p=profile&&profile();
  const m=String(p?.muttersprache||p?.motherLanguage||p?.mother_language||p?.language||'').toLowerCase();
  if(m.includes('russ'))return'ru';
  if(m.includes('türk')||m.includes('turk'))return'tr';
  if(m.includes('ukrain'))return'uk';
  if(m.includes('arab'))return'ar';
  if(m.includes('japan'))return'ja';
  if(m.includes('rumän')||m.includes('ruman')||m.includes('roman'))return'ro';
  return'en';
}
(function(){
  const TR={
    spaet:{en:'late',ru:'поздно',tr:'geç',uk:'пізно',ar:'متأخر',ja:'遅い',ro:'târziu'},
    schon:{en:'already',ru:'уже',tr:'zaten',uk:'вже',ar:'بالفعل',ja:'もう',ro:'deja'},
    erst:{en:'only / not until',ru:'только / лишь',tr:'daha / sadece',uk:'лише / тільки',ar:'فقط / ليس قبل',ja:'まだ / たった',ro:'abia / doar'},
    viertel:{en:'quarter',ru:'четверть',tr:'çeyrek',uk:'чверть',ar:'ربع',ja:'4分の1',ro:'sfert'},
    halb:{en:'half',ru:'половина',tr:'yarım',uk:'половина',ar:'نصف',ja:'半',ro:'jumătate'},
    uhr:{en:'clock / o’clock',ru:'часы / час',tr:'saat',uk:'годинник / година',ar:'ساعة',ja:'時計 / 時',ro:'ceas / ora'},
    kurz:{en:'shortly / just',ru:'незадолго / почти',tr:'az kala / kısa',uk:'незадовго / майже',ar:'قبل قليل / تقريبًا',ja:'少し前 / もうすぐ',ro:'cu puțin înainte'},
    gleich:{en:'soon / almost',ru:'скоро / почти',tr:'hemen / neredeyse',uk:'скоро / майже',ar:'قريبًا / تقريبًا',ja:'もうすぐ / ほぼ',ro:'imediat / aproape'}
  };
  if(typeof WORDS!=='undefined')WORDS.forEach(w=>{if(TR[w.id])w.tr=TR[w.id]});
})();