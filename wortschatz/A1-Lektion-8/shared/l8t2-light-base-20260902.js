(function(){
'use strict';
if(window.__SP_L8T2_LIGHT_BASE_20260902)return;
window.__SP_L8T2_LIGHT_BASE_20260902=true;

const CDN='https://sprachpilot.b-cdn.net/';
const A=CDN+'audio/';
const TIME_WORDS=[
 {id:'sekunde',term:'die Sekunde',word:'Sekunde',article:'die',plural:'die Sekunden',type:'noun',image:CDN+'sekunde.webp',audio:A+'sekunde.mp3'},
 {id:'minute',term:'die Minute',word:'Minute',article:'die',plural:'die Minuten',type:'noun',image:CDN+'minute.webp',audio:A+'minute.mp3'},
 {id:'stunde',term:'die Stunde',word:'Stunde',article:'die',plural:'die Stunden',type:'noun',image:CDN+'stunde.webp',audio:A+'stunde.mp3'},
 {id:'tag',term:'der Tag',word:'Tag',article:'der',plural:'die Tage',type:'noun',image:CDN+'tag.webp',audio:A+'tag.mp3'},
 {id:'woche',term:'die Woche',word:'Woche',article:'die',plural:'die Wochen',type:'noun',image:CDN+'woche.webp',audio:A+'woche.mp3'},
 {id:'monat',term:'der Monat',word:'Monat',article:'der',plural:'die Monate',type:'noun',image:CDN+'monat.webp',audio:A+'monat.mp3'},
 {id:'jahr',term:'das Jahr',word:'Jahr',article:'das',plural:'die Jahre',type:'noun',image:CDN+'jahr.webp',audio:A+'jahr.mp3'}
];
window.L8_T2_TIME_WORDS=TIME_WORDS.map(x=>({...x}));

const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
function cardsTask(theme){return (theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function mergeTimeWords(cards){
 if(!cards)return;
 cards.items=Array.isArray(cards.items)?cards.items:[];
 const seen=new Set(cards.items.map(x=>norm(term(x))));
 for(const word of TIME_WORDS){const k=norm(word.term);if(!seen.has(k)){cards.items.push({...word});seen.add(k)}}
}
function pluralTask(){return{id:'zeitwoerter-artikel-plural',title:'Zeitwörter: Plural',instruction:'Schreibe die richtige Pluralform.',kind:'input',icon:'🎧',emoji:'🎧',items:TIME_WORDS.map(w=>({type:'input',prompt:'',answer:[w.plural.replace(/^die\s+/,'')],audio:w.audio,audioFile:w.audio}))}}
function seitVorTask(){return{id:'zeitwoerter-seit-vor',title:'Seit und vor',instruction:'Schreibe die richtigen Zeitangaben.',kind:'input',icon:'✍️',emoji:'✍️',items:[
 {type:'input',prompt:'seit + 1 + Sekunde',answer:['seit einer Sekunde']},{type:'input',prompt:'vor + 2 + Sekunden',answer:['vor zwei Sekunden','vor 2 Sekunden']},{type:'input',prompt:'seit + 4 + Sekunden',answer:['seit vier Sekunden','seit 4 Sekunden']},
 {type:'input',prompt:'seit + 1 + Minute',answer:['seit einer Minute']},{type:'input',prompt:'vor + 3 + Minuten',answer:['vor drei Minuten','vor 3 Minuten']},{type:'input',prompt:'seit + 6 + Minuten',answer:['seit sechs Minuten','seit 6 Minuten']},
 {type:'input',prompt:'seit + 1 + Stunde',answer:['seit einer Stunde']},{type:'input',prompt:'vor + 2 + Stunden',answer:['vor zwei Stunden','vor 2 Stunden']},{type:'input',prompt:'seit + 5 + Stunden',answer:['seit fünf Stunden','seit 5 Stunden']},
 {type:'input',prompt:'seit + 1 + Tag',answer:['seit einem Tag']},{type:'input',prompt:'vor + 2 + Tage',answer:['vor zwei Tagen','vor 2 Tagen']},{type:'input',prompt:'seit + 4 + Tage',answer:['seit vier Tagen','seit 4 Tagen']},
 {type:'input',prompt:'seit + 1 + Woche',answer:['seit einer Woche']},{type:'input',prompt:'vor + 2 + Wochen',answer:['vor zwei Wochen','vor 2 Wochen']},{type:'input',prompt:'seit + 3 + Wochen',answer:['seit drei Wochen','seit 3 Wochen']},
 {type:'input',prompt:'seit + 1 + Monat',answer:['seit einem Monat']},{type:'input',prompt:'vor + 2 + Monate',answer:['vor zwei Monaten','vor 2 Monaten']},{type:'input',prompt:'seit + 5 + Monate',answer:['seit fünf Monaten','seit 5 Monaten']},
 {type:'input',prompt:'seit + 1 + Jahr',answer:['seit einem Jahr']},{type:'input',prompt:'vor + 2 + Jahre',answer:['vor zwei Jahren','vor 2 Jahren']},{type:'input',prompt:'seit + 3 + Jahre',answer:['seit drei Jahren','seit 3 Jahren']},{type:'input',prompt:'vor + 5 + Jahre',answer:['vor fünf Jahren','vor 5 Jahren']}
]}}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cards=cardsTask(theme);
 mergeTimeWords(cards);
 theme.tasks=theme.tasks.filter(t=>!['zeitwoerter-wiederholung','zeitwoerter-artikel-plural','zeitwoerter-seit-vor'].includes(String(t?.id||'')));
 const idx=Math.max(0,theme.tasks.indexOf(cards));
 theme.tasks.splice(idx+1,0,pluralTask(),seitVorTask());
 if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_LIGHT_BASE_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_LIGHT_BASE_READY;
window.L8T2LightBase={apply};
})();