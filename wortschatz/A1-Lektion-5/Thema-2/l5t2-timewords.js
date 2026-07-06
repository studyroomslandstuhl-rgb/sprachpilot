(function(){
  const TIME_WORDS=[
    {id:'sekunde',article:'die',word:'Sekunde',full:'die Sekunde',plural:'die Sekunden',type:'time',image:'/assets/img/sekunde.png',sentence:'Eine Minute hat sechzig Sekunden.',tr:{en:'second',ru:'секунда',tr:'saniye',uk:'секунда',ar:'ثانية',ja:'秒',ro:'secundă',pl:'sekunda',ku:'çirke'}},
    {id:'minute',article:'die',word:'Minute',full:'die Minute',plural:'die Minuten',type:'time',image:'/assets/img/minute.png',sentence:'Eine Stunde hat sechzig Minuten.',tr:{en:'minute',ru:'минута',tr:'dakika',uk:'хвилина',ar:'دقيقة',ja:'分',ro:'minut',pl:'minuta',ku:'deqe'}},
    {id:'stunde',article:'die',word:'Stunde',full:'die Stunde',plural:'die Stunden',type:'time',image:'/assets/img/stunde.png',sentence:'Der Kurs dauert vier Stunden.',tr:{en:'hour',ru:'час',tr:'saat',uk:'година',ar:'ساعة',ja:'時間',ro:'oră',pl:'godzina',ku:'saet'}},
    {id:'tag',article:'der',word:'Tag',full:'der Tag',plural:'die Tage',type:'time',image:'/assets/img/tag.png',sentence:'Die Woche hat sieben Tage.',tr:{en:'day',ru:'день',tr:'gün',uk:'день',ar:'يوم',ja:'日',ro:'zi',pl:'dzień',ku:'roj'}},
    {id:'woche',article:'die',word:'Woche',full:'die Woche',plural:'die Wochen',type:'time',image:'/assets/img/woche.png',sentence:'Der Monat hat vier Wochen.',tr:{en:'week',ru:'неделя',tr:'hafta',uk:'тиждень',ar:'أسبوع',ja:'週',ro:'săptămână',pl:'tydzień',ku:'hefte'}},
    {id:'monat',article:'der',word:'Monat',full:'der Monat',plural:'die Monate',type:'time',image:'/assets/img/monat.png',sentence:'Das Jahr hat zwölf Monate.',tr:{en:'month',ru:'месяц',tr:'ay',uk:'місяць',ar:'شهر',ja:'月',ro:'lună',pl:'miesiąc',ku:'meh'}},
    {id:'jahr',article:'das',word:'Jahr',full:'das Jahr',plural:'die Jahre',type:'time',image:'/assets/img/jahr.png',sentence:'Ein Jahr hat zwölf Monate.',tr:{en:'year',ru:'год',tr:'yıl',uk:'рік',ar:'سنة',ja:'年',ro:'an',pl:'rok',ku:'sal'}}
  ];
  const target=(typeof WORDS!=='undefined')?WORDS:(window.WORDS=window.WORDS||[]);
  const existing=new Set(target.map(w=>w.id));
  TIME_WORDS.forEach(w=>{if(!existing.has(w.id))target.push(w)});
  window.TIME_NOUNS=TIME_WORDS;
})();