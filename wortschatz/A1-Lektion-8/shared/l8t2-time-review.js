(function(){
'use strict';
if(window.__SP_L8T2_TIME_REVIEW_V2)return;window.__SP_L8T2_TIME_REVIEW_V2=true;
window.L8_T2_TIME_REVIEW_PENDING=true;

const CDN='https://sprachpilot.b-cdn.net/';
const A=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const GRAMMAR_CARD=/(arbeiten\s+(als|bei)|\b(als|bei)\b.*\barbeiten\b|ausbildung.*machen|machen.*ausbildung|^seit$|^vor$)/i;

const TIME_WORDS=[
 {id:'sekunde',term:'die Sekunde',word:'Sekunde',article:'die',plural:'die Sekunden',type:'noun',detail:'Zeitwort · Wiederholung aus Lektion 5',example:'Eine Minute hat sechzig Sekunden.',image:CDN+'sekunde.webp',audio:A+'sekunde.mp3',tr:{en:'second',ru:'секунда',uk:'секунда',tr:'saniye',ar:'ثانية',ja:'秒',ro:'secundă',pl:'sekunda',ku:'saniye'}},
 {id:'minute',term:'die Minute',word:'Minute',article:'die',plural:'die Minuten',type:'noun',detail:'Zeitwort · Wiederholung aus Lektion 5',example:'Eine Stunde hat sechzig Minuten.',image:CDN+'minute.webp',audio:A+'minute.mp3',tr:{en:'minute',ru:'минута',uk:'хвилина',tr:'dakika',ar:'دقيقة',ja:'分',ro:'minut',pl:'minuta',ku:'deqe'}},
 {id:'stunde',term:'die Stunde',word:'Stunde',article:'die',plural:'die Stunden',type:'noun',detail:'Zeitwort · Wiederholung aus Lektion 5',example:'Der Kurs dauert vier Stunden.',image:CDN+'stunde.webp',audio:A+'stunde.mp3',tr:{en:'hour',ru:'час',uk:'година',tr:'saat',ar:'ساعة',ja:'時間',ro:'oră',pl:'godzina',ku:'saet'}},
 {id:'tag',term:'der Tag',word:'Tag',article:'der',plural:'die Tage',type:'noun',detail:'Zeitwort · Wiederholung aus Lektion 5',example:'Eine Woche hat sieben Tage.',image:CDN+'tag.webp',audio:A+'tag.mp3',tr:{en:'day',ru:'день',uk:'день',tr:'gün',ar:'يوم',ja:'日',ro:'zi',pl:'dzień',ku:'roj'}},
 {id:'woche',term:'die Woche',word:'Woche',article:'die',plural:'die Wochen',type:'noun',detail:'Zeitwort · Wiederholung aus Lektion 5',example:'Eine Woche hat sieben Tage.',image:CDN+'woche.webp',audio:A+'woche.mp3',tr:{en:'week',ru:'неделя',uk:'тиждень',tr:'hafta',ar:'أسبوع',ja:'週',ro:'săptămână',pl:'tydzień',ku:'hefte'}},
 {id:'monat',term:'der Monat',word:'Monat',article:'der',plural:'die Monate',type:'noun',detail:'Zeitwort · Wiederholung aus Lektion 5',example:'Ein Jahr hat zwölf Monate.',image:CDN+'monat.webp',audio:A+'monat.mp3',tr:{en:'month',ru:'месяц',uk:'місяць',tr:'ay',ar:'شهر',ja:'月',ro:'lună',pl:'miesiąc',ku:'meh'}},
 {id:'jahr',term:'das Jahr',word:'Jahr',article:'das',plural:'die Jahre',type:'noun',detail:'Zeitwort · Wiederholung aus Lektion 5',example:'Ein Jahr hat zwölf Monate.',image:CDN+'jahr.webp',audio:A+'jahr.mp3',tr:{en:'year',ru:'год',uk:'рік',tr:'yıl',ar:'سنة',ja:'年',ro:'an',pl:'rok',ku:'sal'}}
];

function mainCards(theme){return (theme.tasks||[]).find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(String(task?.title||'')))}
function cleanGrammarCards(items){return (items||[]).filter(item=>{const t=term(item);return t&&!GRAMMAR_CARD.test(t)})}
function mergeTimeWords(task){
 task.items=cleanGrammarCards(Array.isArray(task.items)?task.items:[]);
 const seen=new Set(task.items.map(item=>norm(term(item))));
 for(const word of TIME_WORDS){const key=norm(word.term);if(!seen.has(key)){task.items.push({...word});seen.add(key)}}
 task.instruction=task.instruction||'Wiederhole die Wörter aus diesem Thema.';
 return task;
}

window.L8_T2_TIME_WORDS=TIME_WORDS.map(item=>({...item}));
window.L8_T2_TIME_REVIEW_READY=(async()=>{
  await window.L8_CONTENT_READY;
  const all=window.L8_ALL_THEMES||{},theme=all[2]||all['2'];
  if(!theme||!Array.isArray(theme.tasks))throw new Error('L8 Thema 2 konnte nicht geladen werden.');

  // Alte Zwischenversionen entfernen. Die eigentlichen Zeit-Aufgaben werden erst NACH
  // l8t2-quality eingefügt, damit dessen bestehende Aufgabenreihenfolge nicht verschoben wird.
  const oldIds=new Set(['zeitwoerter-wiederholung','zeitwoerter-artikel-plural','zeitwoerter-seit-vor']);
  theme.tasks=theme.tasks.filter(task=>!oldIds.has(task?.id));

  let cards=mainCards(theme);
  if(!cards){cards={id:'karteikarten',title:'Karteikarten',emoji:'🃏',kind:'cards',instruction:'Wiederhole die Wörter.',items:[]};theme.tasks.unshift(cards)}
  mergeTimeWords(cards);

  if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
  window.L8_T2_TIME_REVIEW_DONE=true;window.L8_T2_TIME_REVIEW_PENDING=false;
  return theme;
})().catch(error=>{window.L8_T2_TIME_REVIEW_PENDING=false;console.error('L8T2 Zeitwort-Wiederholung',error);throw error});
})();
