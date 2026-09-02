(function(){
'use strict';
if(window.__SP_L8T2_EXAM_20260902_V3)return;
window.__SP_L8T2_EXAM_20260902_V3=true;
const CDN='https://sprachpilot.b-cdn.net/';
const C=(label,prompt,options,answer,context='')=>({type:'choice',label,prompt,options,answer,context});
const I=(label,prompt,answer,context='',hint='')=>({type:'input',label,prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});
const IMG=(label,prompt,image,answer,hint='')=>({type:'image-input',label,prompt,image,answer:Array.isArray(answer)?answer:[answer],hint});
const O=(label,prompt,tokens,answer,context='')=>({type:'order',label,prompt,tokens,answer:Array.isArray(answer)?answer:[answer],context});
const EXAM_ITEMS=[
 C('Bedeutung → Wort','Man lernt systematisch einen Beruf. Welches Wort passt?',['die Ausbildung','das Praktikum','die Bewerbung'],'die Ausbildung'),
 C('Bedeutung → Wort','Dokument mit Schule, Ausbildung und bisherigen Arbeitsstationen. Welches Wort passt?',['der Lebenslauf','das Anschreiben','das Bewerbungsfoto'],'der Lebenslauf'),
 C('Wort → Bedeutung','Was bedeutet „die Berufserfahrung“?',['Erfahrung aus früherer Arbeit.','Eine Schule für Kinder.','Eine Reise in ein anderes Land.'],'Erfahrung aus früherer Arbeit.'),
 C('Wort → Bedeutung','Was bedeutet „das Vorstellungsgespräch“?',['Ein Gespräch mit einer Firma vor einer möglichen Einstellung.','Ein Gespräch mit Freunden im Café.','Eine schriftliche Prüfung in der Berufsschule.'],'Ein Gespräch mit einer Firma vor einer möglichen Einstellung.'),
 IMG('Bild → Wort','Schreibe das Wort mit Artikel.',CDN+'praktikum.webp',['das Praktikum','Praktikum'],'Achte auf den Artikel.'),
 IMG('Bild → Wort','Schreibe das Wort mit Artikel.',CDN+'bewerbung.webp',['die Bewerbung','Bewerbung'],'Achte auf den Artikel.'),
 IMG('Bild → Plural','Schreibe den Plural mit Artikel.',CDN+'tourist.webp',['die Touristen','Touristen'],'Der Singular ist: der Tourist.'),
 IMG('Bild → Plural','Schreibe den Plural mit Artikel.',CDN+'touristin.webp',['die Touristinnen','Touristinnen'],'Der Singular ist: die Touristin.'),
 IMG('Bild → Plural','Schreibe den Plural mit Artikel.',CDN+'buero.webp',['die Büros','die Bueros','Büros','Bueros'],'Der Singular ist: das Büro.'),
 IMG('Bild → Plural','Schreibe den Plural mit Artikel.',CDN+'beruf.webp',['die Berufe','Berufe'],'Der Singular ist: der Beruf.'),
 I('seit oder vor?','Ich arbeite ___ drei Jahren in einem Hotel.','seit','','Die Arbeit dauert bis heute.'),
 I('seit oder vor?','Ich habe ___ drei Jahren meine Ausbildung beendet.','vor','','Das Ereignis ist abgeschlossen.'),
 I('seit oder vor?','Mina wohnt ___ Januar in Köln.','seit','','Sie wohnt heute noch dort.'),
 I('seit oder vor?','Omar hat ___ einem Monat eine Bewerbung geschickt.','vor','','Das Ereignis war in der Vergangenheit.'),
 I('seit oder vor?','Wir lernen ___ sechs Monaten Deutsch.','seit','','Der Zeitraum dauert noch an.'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Ich','arbeite','seit','zwei','Jahren','im','Café'],['Ich arbeite seit zwei Jahren im Café','Ich arbeite seit zwei Jahren im Café.'],'Seit wann arbeitest du im Café?'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Ich','habe','vor','drei','Jahren','meine','Ausbildung','angefangen'],['Ich habe vor drei Jahren meine Ausbildung angefangen','Ich habe vor drei Jahren meine Ausbildung angefangen.'],'Wann hast du deine Ausbildung angefangen?'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Das','Praktikum','hat','sechs','Monate','gedauert'],['Das Praktikum hat sechs Monate gedauert','Das Praktikum hat sechs Monate gedauert.'],'Wie lange hat das Praktikum gedauert?'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Seit','einem','Jahr','arbeite','ich','in','Teilzeit'],['Seit einem Jahr arbeite ich in Teilzeit','Seit einem Jahr arbeite ich in Teilzeit.'],'Seit wann arbeitest du in Teilzeit?'),
 O('Frage → Antwort','Baue eine passende Antwort.',['Ich','möchte','mich','um','die','Stelle','bewerben'],['Ich möchte mich um die Stelle bewerben','Ich möchte mich um die Stelle bewerben.'],'Was sagst du in einer Bewerbung?')
];
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let exam=theme.tasks.find(t=>t?.exam);
 if(!exam){exam={exam:true};theme.tasks.push(exam)}
 exam.id='pruefung-l8t2-produktiv-v1';
 exam.exam=true;exam.spProductionExam=true;exam.noAudio=true;
 exam.title='Prüfung';exam.kind='mixed-production';exam.icon='⭐';exam.emoji='⭐';
 exam.instruction='Löse die Aufgaben. Schreibe und baue die Antworten selbst.';
 exam.items=EXAM_ITEMS.map(item=>({...item,options:item.options?[...item.options]:undefined,tokens:item.tokens?[...item.tokens]:undefined,answer:Array.isArray(item.answer)?[...item.answer]:item.answer}));
 delete exam.audio;delete exam.audioFile;delete exam.listening;
 theme.contentRevision='l8t2-exam-20260902-v3-production';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_EXAM_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all,2);apply(theme);if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;return themes});
window.L8_CONTENT_READY=window.L8_T2_EXAM_READY;
window.L8T2Exam20260902={apply,version:3};
})();
