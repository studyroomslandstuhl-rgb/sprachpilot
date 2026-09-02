(function(){
'use strict';
if(window.__SP_L8T2_EXAM_20260902_V5)return;
window.__SP_L8T2_EXAM_20260902_V5=true;
const CDN='https://sprachpilot.b-cdn.net/';
const C=(label,prompt,options,answer,context='')=>({type:'choice',label,prompt,options,answer,context});
const I=(label,prompt,answer,context='',hint='')=>({type:'input',label,prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const IMG=(label,prompt,image,answer,hint='')=>({type:'image-input',label,prompt,image,answer:Array.isArray(answer)?answer:[answer],hint});
const O=(label,prompt,tokens,answer,context='')=>({type:'order',label,prompt,tokens,answer:Array.isArray(answer)?answer:[answer],context});
const EXAM_ITEMS=[
 C('Bedeutung → Wort','Etwas braucht eine bestimmte Zeit. Welches Verb passt?',['zeigen','dauern','heiraten'],'dauern'),
 C('Wort → Bedeutung','Was bedeutet „heiraten“?',['jemandem etwas zeigen','eine Ehe schließen','eine bestimmte Zeit brauchen'],'eine Ehe schließen'),
 C('Bedeutung → Wort','Du machst etwas sichtbar, damit eine andere Person es sehen kann. Welches Verb passt?',['dauern','heiraten','zeigen'],'zeigen'),
 IMG('Bild → Wort','Schreibe das Verb.',CDN+'heiraten.webp',['heiraten'],'Das Wort steht in den Karteikarten.'),
 IMG('Bild → Wort','Schreibe das Verb.',CDN+'zeigen.webp',['zeigen'],'Das Wort steht in den Karteikarten.'),
 I('Artikel / Plural','Plural von „die Woche“: ___',['die Wochen','Wochen']),
 I('Artikel / Plural','___ Monat',['der']),
 I('seit / vor','seit + 2 + Tag → ___',['seit zwei Tagen','seit 2 Tagen']),
 I('seit / vor','vor + 1 + Jahr → ___',['vor einem Jahr']),
 I('seit / vor','Ich arbeite ___ zwei Jahren bei der Firma.',['seit']),
 I('seit / vor','Ich habe ___ drei Monaten hier angefangen.',['vor']),
 O('Frage bauen','Bilde die Frage.',['Seit','wann','arbeitest','du','hier?'],['Seit wann arbeitest du hier?','Seit wann arbeitest du hier']),
 O('Satz bauen','Bilde den Satz.',['Die','Ausbildung','hat','drei','Jahre','gedauert.'],['Die Ausbildung hat drei Jahre gedauert.','Die Ausbildung hat drei Jahre gedauert']),
 I('Wort einsetzen','Die Ausbildung hat zwei Jahre ___.',['gedauert']),
 O('Biografie','Bilde einen richtigen Satz.',['Seit','zwei','Jahren','arbeite','ich','bei','einer','Firma.'],['Seit zwei Jahren arbeite ich bei einer Firma.','Seit zwei Jahren arbeite ich bei einer Firma'])
];
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let exam=theme.tasks.find(t=>t?.exam);
 if(!exam){exam={exam:true};theme.tasks.push(exam)}
 exam.id='pruefung-l8t2-inhalte-v2';exam.exam=true;exam.spProductionExam=true;exam.noAudio=true;
 exam.title='Prüfung';exam.kind='mixed-production';exam.icon='⭐';exam.emoji='⭐';
 exam.instruction='Löse die 15 Aufgaben.';
 exam.items=EXAM_ITEMS.map(item=>({...item,options:item.options?[...item.options]:undefined,tokens:item.tokens?[...item.tokens]:undefined,answer:Array.isArray(item.answer)?[...item.answer]:item.answer}));
 delete exam.audio;delete exam.audioFile;delete exam.listening;
 theme.contentRevision='l8t2-exam-20260902-v5-learned-content-only';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_EXAM_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all,2);apply(theme);if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;return themes});
window.L8_CONTENT_READY=window.L8_T2_EXAM_READY;
window.L8T2Exam20260902={apply,version:5};
})();
