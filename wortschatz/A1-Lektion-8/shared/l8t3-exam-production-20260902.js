(function(){
'use strict';
if(window.__SP_L8T3_EXAM_PRODUCTION_20260902_V2)return;window.__SP_L8T3_EXAM_PRODUCTION_20260902_V2=true;
const CDN='https://sprachpilot.b-cdn.net/';
const C=(label,prompt,options,answer,context='')=>({type:'choice',label,prompt,options,answer,context});
const I=(label,prompt,answer,context='',hint='')=>({type:'input',label,prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const IMG=(label,prompt,image,answer,hint='')=>({type:'image-input',label,prompt,image,answer:Array.isArray(answer)?answer:[answer],hint});
const O=(label,prompt,tokens,answer,context='')=>({type:'order',label,prompt,tokens,answer:Array.isArray(answer)?answer:[answer],context});
const ITEMS=[
 C('Bedeutung → Wort','Sehr viel Arbeit, wenig Zeit und keine Pause. Welches Wort passt?',['die Erfahrung','der Stress','der Kollege'],'der Stress'),
 C('Wort → Bedeutung','Was bedeutet „professionell“?',['gut, korrekt und passend zum Beruf arbeiten','nur wenige Stunden arbeiten','keine Berufserfahrung haben'],'gut, korrekt und passend zum Beruf arbeiten'),
 C('Bedeutung → Wort','Eine Person arbeitet mit dir im gleichen Team. Welches Wort passt?',['der Kellner','der Kollege','der Architekt'],'der Kollege'),
 IMG('Bild → Wort','Schreibe das Wort mit Artikel.',CDN+'cafe.webp',['das Café','das Cafe'],'Achte auf den Artikel.'),
 IMG('Bild → Plural','Schreibe den Plural mit Artikel.',CDN+'kollege.webp',['die Kollegen','Kollegen'],'Der Singular ist: der Kollege.'),
 I('sein / haben','Früher ___ ich Kellnerin.',['war']),
 I('sein / haben','Damals ___ wir viel Stress.',['hatten']),
 I('Zeit erkennen','Heute ist mein Chef freundlich. →',['Gegenwart']),
 I('Zeit erkennen','Ich habe gestern lange gearbeitet. →',['Vergangenheit']),
 I('Buchstabensalat','R · E · S · T · A · U · R · A · N · T',['Restaurant','das Restaurant']),
 I('Buchstabensalat','K · O · L · L · E · G · E',['Kollege','der Kollege']),
 O('Satz bauen','Bilde den Satz.',['Meine','Arbeit','war','früher','sehr','stressig.'],['Meine Arbeit war früher sehr stressig.','Meine Arbeit war früher sehr stressig']),
 O('Satz bauen','Bilde den Satz.',['Heute','ist','mein','Team','sehr','nett.'],['Heute ist mein Team sehr nett.','Heute ist mein Team sehr nett']),
 O('Vergangenheit','Bilde den Satz im Perfekt.',['Früher','habe','ich','im','Café','gearbeitet.'],['Früher habe ich im Café gearbeitet.','Früher habe ich im Café gearbeitet']),
 I('Dialog','Mia: Wie war dein Chef früher?\nOmar: Er ___ sehr professionell.',['war'])
];
function themeOf(all){return all?.[3]||all?.['3']||(Array.isArray(all)?all.find(t=>Number(t?.number)===3):null)}
function apply(theme){if(!theme||!Array.isArray(theme.tasks))return theme;let exam=theme.tasks.find(t=>t?.exam);if(!exam){exam={exam:true};theme.tasks.push(exam)}exam.id='pruefung-l8t3-inhalte-v2';exam.exam=true;exam.spProductionExam=true;exam.noAudio=true;exam.title='Prüfung';exam.kind='mixed-production';exam.icon='⭐';exam.emoji='⭐';exam.instruction='Löse die 15 Aufgaben.';exam.items=ITEMS.map(item=>({...item,options:item.options?[...item.options]:undefined,tokens:item.tokens?[...item.tokens]:undefined,answer:Array.isArray(item.answer)?[...item.answer]:item.answer}));delete exam.audio;delete exam.audioFile;delete exam.listening;const others=theme.tasks.filter(t=>t!==exam&&!t?.exam);theme.tasks=[...others,exam];theme.contentRevision='l8t3-exam-production-20260902-v2-learned-content-only';return theme}
const previous=window.L8_CONTENT_READY;window.L8_T3_EXAM_PRODUCTION_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T3 produktive Prüfung',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T3_EXAM_PRODUCTION_READY;window.L8T3ExamProduction20260902={apply,version:2};
})();
