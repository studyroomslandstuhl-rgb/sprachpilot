(function(){
'use strict';
window.L8_T2_TIME_REVIEW_PENDING=true;
window.L8_T2_TIME_REVIEW_READY=(async()=>{
  await window.L8_CONTENT_READY;
  const all=window.L8_ALL_THEMES||{};
  const theme=all[2]||all['2'];
  if(!theme||!Array.isArray(theme.tasks))throw new Error('L8 Thema 2 konnte nicht geladen werden.');

  const ids=new Set(['zeitwoerter-wiederholung','zeitwoerter-artikel-plural','zeitwoerter-seit-vor']);
  theme.tasks=theme.tasks.filter(task=>!ids.has(task?.id));

  const cards={
    id:'zeitwoerter-wiederholung',
    title:'Zeitwörter wiederholen',
    emoji:'🕒',
    instruction:'Wiederhole die Zeitwörter aus Lektion 5.',
    kind:'cards',
    items:[
      {term:'die Sekunde',detail:'Plural: die Sekunden',example:'Eine Minute hat sechzig Sekunden.',image:'sekunde.webp',audio:'sekunde.mp3'},
      {term:'die Minute',detail:'Plural: die Minuten',example:'Eine Stunde hat sechzig Minuten.',image:'minute.webp',audio:'minute.mp3'},
      {term:'die Stunde',detail:'Plural: die Stunden',example:'Der Kurs dauert vier Stunden.',image:'stunde.webp',audio:'stunde.mp3'},
      {term:'der Tag',detail:'Plural: die Tage',example:'Die Woche hat sieben Tage.',image:'tag.webp',audio:'tag.mp3'},
      {term:'die Woche',detail:'Plural: die Wochen',example:'Der Monat hat vier Wochen.',image:'woche.webp',audio:'woche.mp3'},
      {term:'der Monat',detail:'Plural: die Monate',example:'Das Jahr hat zwölf Monate.',image:'monat.webp',audio:'monat.mp3'},
      {term:'das Jahr',detail:'Plural: die Jahre',example:'Ein Jahr hat zwölf Monate.',image:'jahr.webp',audio:'jahr.mp3'}
    ]
  };

  const grammar={
    id:'zeitwoerter-artikel-plural',
    title:'Artikel und Plural',
    emoji:'🔤',
    instruction:'Wähle Artikel und Plural.',
    intro:'Wiederholung aus Lektion 5: Lerne die Zeitwörter immer mit Artikel und Plural.',
    items:[
      {type:'choice',prompt:'___ Sekunde',options:['der','die','das'],answer:'die',hint:'Sekunde ist feminin: die Sekunde.'},
      {type:'choice',prompt:'Plural von „die Sekunde“',options:['die Sekunde','die Sekunden','die Sekundes'],answer:'die Sekunden',hint:'Der Plural endet auf -n: die Sekunden.'},
      {type:'choice',prompt:'___ Minute',options:['der','die','das'],answer:'die',hint:'Minute ist feminin: die Minute.'},
      {type:'choice',prompt:'Plural von „die Minute“',options:['die Minuten','die Minute','die Minuter'],answer:'die Minuten',hint:'Der Plural lautet: die Minuten.'},
      {type:'choice',prompt:'___ Stunde',options:['der','die','das'],answer:'die',hint:'Stunde ist feminin: die Stunde.'},
      {type:'choice',prompt:'Plural von „die Stunde“',options:['die Stunden','die Stunde','die Stünde'],answer:'die Stunden',hint:'Der Plural lautet: die Stunden.'},
      {type:'choice',prompt:'___ Tag',options:['der','die','das'],answer:'der',hint:'Tag ist maskulin: der Tag.'},
      {type:'choice',prompt:'Plural von „der Tag“',options:['die Tage','die Tagen','die Tags'],answer:'die Tage',hint:'Der Plural lautet: die Tage.'},
      {type:'choice',prompt:'___ Woche',options:['der','die','das'],answer:'die',hint:'Woche ist feminin: die Woche.'},
      {type:'choice',prompt:'Plural von „die Woche“',options:['die Woche','die Wochen','die Wöchen'],answer:'die Wochen',hint:'Der Plural lautet: die Wochen.'},
      {type:'choice',prompt:'___ Monat',options:['der','die','das'],answer:'der',hint:'Monat ist maskulin: der Monat.'},
      {type:'choice',prompt:'Plural von „der Monat“',options:['die Monate','die Monaten','die Monats'],answer:'die Monate',hint:'Der Plural lautet: die Monate.'},
      {type:'choice',prompt:'___ Jahr',options:['der','die','das'],answer:'das',hint:'Jahr ist neutral: das Jahr.'},
      {type:'choice',prompt:'Plural von „das Jahr“',options:['die Jahre','die Jahren','die Jähre'],answer:'die Jahre',hint:'Der Plural lautet: die Jahre.'}
    ]
  };

  const use={
    id:'zeitwoerter-seit-vor',
    title:'seit und vor mit Zeitwörtern',
    emoji:'⏳',
    instruction:'Bilde die richtige Zeitangabe.',
    intro:'seit und vor stehen hier mit Dativ. Singular: seit/vor einer Sekunde, einer Minute, einer Stunde, einer Woche; seit/vor einem Tag, einem Monat, einem Jahr. Im Plural heißt es z. B. seit zwei Tagen, vor drei Monaten, seit vier Jahren.',
    items:[
      {type:'input',prompt:'seit + 1 + Sekunde',answer:['seit einer Sekunde'],hint:'Sekunde ist feminin: einer Sekunde.'},
      {type:'input',prompt:'vor + 2 + Sekunde',answer:['vor zwei Sekunden','vor 2 Sekunden'],hint:'Im Plural: Sekunden.'},
      {type:'input',prompt:'vor + 1 + Minute',answer:['vor einer Minute'],hint:'Minute ist feminin: einer Minute.'},
      {type:'input',prompt:'seit + 3 + Minute',answer:['seit drei Minuten','seit 3 Minuten'],hint:'Im Plural: Minuten.'},
      {type:'input',prompt:'seit + 1 + Stunde',answer:['seit einer Stunde'],hint:'Stunde ist feminin: einer Stunde.'},
      {type:'input',prompt:'vor + 4 + Stunde',answer:['vor vier Stunden','vor 4 Stunden'],hint:'Im Plural: Stunden.'},
      {type:'input',prompt:'vor + 1 + Tag',answer:['vor einem Tag'],hint:'Tag ist maskulin: einem Tag.'},
      {type:'input',prompt:'seit + 2 + Tag',answer:['seit zwei Tagen','seit 2 Tagen'],hint:'Dativ Plural: Tagen.'},
      {type:'input',prompt:'seit + 1 + Woche',answer:['seit einer Woche'],hint:'Woche ist feminin: einer Woche.'},
      {type:'input',prompt:'vor + 3 + Woche',answer:['vor drei Wochen','vor 3 Wochen'],hint:'Im Plural: Wochen.'},
      {type:'input',prompt:'vor + 1 + Monat',answer:['vor einem Monat'],hint:'Monat ist maskulin: einem Monat.'},
      {type:'input',prompt:'seit + 5 + Monat',answer:['seit fünf Monaten','seit 5 Monaten'],hint:'Dativ Plural: Monaten.'},
      {type:'input',prompt:'seit + 1 + Jahr',answer:['seit einem Jahr'],hint:'Jahr ist neutral: einem Jahr.'},
      {type:'input',prompt:'vor + 3 + Jahr',answer:['vor drei Jahren','vor 3 Jahren'],hint:'Dativ Plural: Jahren.'}
    ]
  };

  theme.tasks.unshift(use);
  theme.tasks.unshift(grammar);
  theme.tasks.unshift(cards);
  if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
  window.L8_T2_TIME_REVIEW_DONE=true;
  window.L8_T2_TIME_REVIEW_PENDING=false;
  return theme;
})().catch(error=>{
  window.L8_T2_TIME_REVIEW_PENDING=false;
  console.error('L8T2 Zeitwort-Wiederholung',error);
  throw error;
});
})();
