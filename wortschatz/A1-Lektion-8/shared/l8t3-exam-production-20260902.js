(function(){
'use strict';
if(window.__SP_L8T3_EXAM_PRODUCTION_20260902_V1)return;window.__SP_L8T3_EXAM_PRODUCTION_20260902_V1=true;
const CDN='https://sprachpilot.b-cdn.net/';
const C=(label,prompt,options,answer,context='')=>({type:'choice',label,prompt,options,answer,context});
const I=(label,prompt,answer,context='',hint='')=>({type:'input',label,prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const IMG=(label,prompt,image,answer,hint='')=>({type:'image-input',label,prompt,image,answer:Array.isArray(answer)?answer:[answer],hint});
const O=(label,prompt,tokens,answer,context='')=>({type:'order',label,prompt,tokens,answer:Array.isArray(answer)?answer:[answer],context});
const ITEMS=[
 C('Bedeutung → Wort','Eine Person, mit der du zusammenarbeitest. Welches Wort passt?',['der Kollege','der Kellner','der Arbeiter'],'der Kollege'),
 C('Wort → Bedeutung','Was bedeutet „professionell“?',['Eine Person arbeitet gut, korrekt und passend zum Beruf.','Eine Person hat immer frei.','Eine Arbeit dauert nur zehn Minuten.'],'Eine Person arbeitet gut, korrekt und passend zum Beruf.'),
 C('Bedeutung → Wort','Sehr viel Arbeit, wenig Zeit und keine Pause. Welches Wort passt?',['der Stress','der Spaß','die Erfahrung'],'der Stress'),
 C('Wort → Bedeutung','Was bedeutet „Berufserfahrung“?',['Erfahrung aus früherer Arbeit.','Ein Schulfach in der Grundschule.','Eine Pause im Restaurant.'],'Erfahrung aus früherer Arbeit.'),
 IMG('Bild → Wort','Schreibe das Wort mit Artikel.',CDN+'cafe.webp',['das Café','das Cafe','Café','Cafe'],'Achte auf den Artikel.'),
 IMG('Bild → Wort','Schreibe das Wort mit Artikel.',CDN+'architektin.webp',['die Architektin','Architektin'],'Achte auf den Artikel.'),
 IMG('Bild → Plural','Schreibe den Plural mit Artikel.',CDN+'kollege.webp',['die Kollegen','Kollegen'],'Der Singular ist: der Kollege.'),
 IMG('Bild → Plural','Schreibe den Plural mit Artikel.',CDN+'restaurant.webp',['die Restaurants','Restaurants'],'Der Singular ist: das Restaurant.'),
 I('sein oder haben?','Früher ___ ich Kellnerin.','war','','Beruf + Vergangenheit: sein.'),
 I('sein oder haben?','Damals ___ du noch keine Berufserfahrung.','hattest','','Berufserfahrung hat man.'),
 I('sein oder haben?','Vor zwei Jahren ___ wir ein kleines Team.','waren','','Team beschreibt, wie wir waren.'),
 I('sein oder haben?','Gestern ___ ihr sehr viel Stress.','hattet','','Stress hat man.'),
 I('sein oder haben?','Früher ___ der Chef sehr streng.','war','','Der Chef war so.'),
 I('sein oder haben?','Damals ___ die Kollegen wenig Zeit für Pausen.','hatten','','Zeit hat man.'),
 I('Heute oder früher?','Heute ___ meine Arbeit einfach.','ist','','Heute = Gegenwart.'),
 I('Heute oder früher?','Früher ___ meine Arbeit sehr schwer.','war','','Früher = Vergangenheit.'),
 I('Heute oder früher?','Heute ___ ich viel Berufserfahrung.','habe','','Heute = Gegenwart; Erfahrung hat man.'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Meine','Arbeit','war','früher','sehr','stressig'],['Meine Arbeit war früher sehr stressig','Meine Arbeit war früher sehr stressig.'],'Wie war deine Arbeit früher?'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Nein','ich','hatte','damals','keine','Berufserfahrung'],['Nein ich hatte damals keine Berufserfahrung','Nein, ich hatte damals keine Berufserfahrung','Nein, ich hatte damals keine Berufserfahrung.'],'Hattest du damals schon Berufserfahrung?'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Heute','ist','mein','Team','sehr','nett'],['Heute ist mein Team sehr nett','Heute ist mein Team sehr nett.'],'Wie ist dein Team heute?')
];
function themeOf(all){return all?.[3]||all?.['3']||(Array.isArray(all)?all.find(t=>Number(t?.number)===3):null)}
function apply(theme){if(!theme||!Array.isArray(theme.tasks))return theme;let exam=theme.tasks.find(t=>t?.exam);if(!exam){exam={exam:true};theme.tasks.push(exam)}exam.id='pruefung-l8t3-produktiv-v1';exam.exam=true;exam.spProductionExam=true;exam.noAudio=true;exam.title='Prüfung';exam.kind='mixed-production';exam.icon='⭐';exam.emoji='⭐';exam.instruction='Löse die Aufgaben. Schreibe und baue die Antworten selbst.';exam.items=ITEMS.map(item=>({...item,options:item.options?[...item.options]:undefined,tokens:item.tokens?[...item.tokens]:undefined,answer:Array.isArray(item.answer)?[...item.answer]:item.answer}));delete exam.audio;delete exam.audioFile;delete exam.listening;const others=theme.tasks.filter(t=>t!==exam&&!t?.exam);theme.tasks=[...others,exam];theme.contentRevision='l8t3-exam-production-20260902-v1';return theme}
const previous=window.L8_CONTENT_READY;window.L8_T3_EXAM_PRODUCTION_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T3 produktive Prüfung',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T3_EXAM_PRODUCTION_READY;window.L8T3ExamProduction20260902={apply,version:1};
})();
