(function(){
'use strict';
if(window.__SP_L8T2_TASK4_6_20260901)return;
window.__SP_L8T2_TASK4_6_20260901=true;

const choice=(prompt,options,answer,context='')=>({type:'choice',prompt,options,answer,context});
const order=(tokens,answer)=>({type:'order',tokens,answer});
const tf=(context,prompt,answer)=>({type:'choice',context,prompt,options:['Richtig','Falsch'],answer});

const TASK4=[
 choice('Seit wann arbeitest du im Café?',['Seit zwei Jahren.','Vor zwei Jahren.','Als Kellner.'],'Seit zwei Jahren.'),
 choice('Welche Frage passt?',['Seit wann arbeitest du hier?','Wo ist das Café?','Was kostet der Kaffee?'],'Seit wann arbeitest du hier?','Seit drei Monaten.'),
 choice('Wann hast du die Ausbildung gemacht?',['Vor vier Jahren.','Seit vier Jahren.','Vier Monate.'],'Vor vier Jahren.'),
 choice('Welche Frage passt?',['Wann hast du als Koch angefangen?','Wie lange dauert die Pause?','Wo wohnst du?'],'Wann hast du als Koch angefangen?','Vor einem Jahr.'),
 choice('Wie lange arbeitest du schon bei der Firma?',['Seit fünf Jahren.','Vor fünf Jahren.','Fünf Jahre alt.'],'Seit fünf Jahren.'),
 choice('Welche Frage passt?',['Wie lange arbeitest du schon im Restaurant?','Wann öffnet das Restaurant?','Was isst du im Restaurant?'],'Wie lange arbeitest du schon im Restaurant?','Seit sechs Monaten.'),
 choice('Was bist du von Beruf?',['Ich bin Architektin.','Seit zwei Jahren.','Bei einer Firma.'],'Ich bin Architektin.'),
 choice('Welche Frage passt?',['Was bist du von Beruf?','Seit wann bist du hier?','Wie heißt die Firma?'],'Was bist du von Beruf?','Ich bin Arbeiter.'),
 choice('Wo arbeitest du?',['Bei einer Firma.','Als Kellnerin.','Vor drei Jahren.'],'Bei einer Firma.'),
 choice('Welche Frage passt?',['Wo arbeitest du?','Wie lange arbeitest du?','Wann hast du frei?'],'Wo arbeitest du?','In einem Restaurant.'),
 choice('Als was arbeitest du?',['Als Koch.','Seit einem Jahr.','Im Café.'],'Als Koch.'),
 choice('Welche Frage passt?',['Als was arbeitest du?','Wo arbeitest du?','Wann arbeitest du?'],'Als was arbeitest du?','Als Kellnerin.'),
 choice('Wie lange hat die Ausbildung gedauert?',['Drei Jahre.','Vor drei Jahren.','Seit drei Jahren.'],'Drei Jahre.'),
 choice('Welche Frage passt?',['Wie lange hat die Ausbildung gedauert?','Wann hat die Ausbildung angefangen?','Wo war die Ausbildung?'],'Wie lange hat die Ausbildung gedauert?','Zwei Jahre.'),
 choice('Wann hast du bei der Firma angefangen?',['Vor acht Monaten.','Seit acht Monaten.','Acht Monate lang.'],'Vor acht Monaten.'),
 choice('Welche Frage passt?',['Wann hast du im Café angefangen?','Wie lange dauert die Arbeit?','Was machst du im Café?'],'Wann hast du im Café angefangen?','Vor zwei Wochen.'),
 choice('Hast du Berufserfahrung?',['Ja, ich arbeite seit drei Jahren als Koch.','Nein, ich bin im Restaurant.','Vor drei Jahren.'],'Ja, ich arbeite seit drei Jahren als Koch.'),
 choice('Welche Frage passt?',['Hast du Berufserfahrung?','Wie heißt dein Kollege?','Wann ist Pause?'],'Hast du Berufserfahrung?','Ja, ich habe zwei Jahre in einem Café gearbeitet.'),
 choice('Seit wann bist du bei diesem Arbeitgeber?',['Seit Januar.','Im Januar.','Vor Januar.'],'Seit Januar.'),
 choice('Welche Frage passt?',['Wann hast du deine Ausbildung beendet?','Seit wann machst du die Ausbildung?','Wie heißt dein Beruf?'],'Wann hast du deine Ausbildung beendet?','Vor drei Monaten.')
];

const TASK5=[
 order(['Ich','arbeite','seit','drei','Jahren','im','Restaurant.'],'Ich arbeite seit drei Jahren im Restaurant.'),
 order(['Sie','arbeitet','seit','sechs','Monaten','im','Café.'],'Sie arbeitet seit sechs Monaten im Café.'),
 order(['Er','hat','vor','zwei','Jahren','die','Ausbildung','gemacht.'],'Er hat vor zwei Jahren die Ausbildung gemacht.'),
 order(['Ich','arbeite','als','Koch','bei','einem','Restaurant.'],'Ich arbeite als Koch bei einem Restaurant.'),
 order(['Sie','arbeitet','als','Architektin','bei','einer','Firma.'],'Sie arbeitet als Architektin bei einer Firma.'),
 order(['Vor','drei','Monaten','habe','ich','hier','angefangen.'],'Vor drei Monaten habe ich hier angefangen.'),
 order(['Seit','einem','Jahr','arbeite','ich','mit','diesem','Team.'],'Seit einem Jahr arbeite ich mit diesem Team.'),
 order(['Die','Ausbildung','hat','drei','Jahre','gedauert.'],'Die Ausbildung hat drei Jahre gedauert.'),
 order(['Mein','Kollege','arbeitet','seit','fünf','Jahren','hier.'],'Mein Kollege arbeitet seit fünf Jahren hier.'),
 order(['Ich','habe','vor','einem','Jahr','die','Ausbildung','beendet.'],'Ich habe vor einem Jahr die Ausbildung beendet.'),
 order(['Seit','wann','arbeitest','du','im','Café?'],'Seit wann arbeitest du im Café?'),
 order(['Wann','hast','du','die','Ausbildung','gemacht?'],'Wann hast du die Ausbildung gemacht?'),
 order(['Wie','lange','arbeitest','du','schon','hier?'],'Wie lange arbeitest du schon hier?'),
 order(['Als','was','arbeitest','du','bei','der','Firma?'],'Als was arbeitest du bei der Firma?'),
 order(['Wo','hast','du','vorher','gearbeitet?'],'Wo hast du vorher gearbeitet?'),
 order(['Ich','habe','schon','viel','Berufserfahrung.'],'Ich habe schon viel Berufserfahrung.'),
 order(['Vor','vier','Jahren','war','ich','noch','in','der','Ausbildung.'],'Vor vier Jahren war ich noch in der Ausbildung.'),
 order(['Seit','zwei','Wochen','arbeite','ich','in','Vollzeit.'],'Seit zwei Wochen arbeite ich in Vollzeit.'),
 order(['Er','arbeitet','bei','der','Firma','als','Arbeiter.'],'Er arbeitet bei der Firma als Arbeiter.'),
 order(['Sie','hat','vor','fünf','Jahren','als','Kellnerin','angefangen.'],'Sie hat vor fünf Jahren als Kellnerin angefangen.')
];

const TEXT1='Maria arbeitet seit zwei Jahren in einem Café. Vor drei Jahren hat sie eine Ausbildung als Kellnerin gemacht. Die Ausbildung hat sechs Monate gedauert. Danach hat sie einige Monate eine Stelle gesucht. Erst dann hat sie im Café angefangen. Heute kennt sie die Arbeit im Service sehr gut.';
const TEXT2='Amir wollte Krankenpfleger werden. Vor vier Jahren hat er seine Ausbildung angefangen. Nach drei Jahren war die Ausbildung fertig. Seit einem Jahr arbeitet er in einem Krankenhaus. Dort arbeitet er oft mit einem großen Team und hat viel Kontakt mit Menschen.';
const TEXT3='Lena hat vor fünf Jahren eine Ausbildung als Köchin angefangen. Die Ausbildung hat zwei Jahre gedauert. Danach hat sie ein Jahr in einem Restaurant gearbeitet. Seit zwei Jahren arbeitet sie in einem kleinen Café. Dort kocht sie mittags und hilft manchmal auch im Service.';
const TEXT4='Daniel arbeitet seit sechs Jahren bei derselben Firma. Am Anfang war er Arbeiter und hatte wenig Erfahrung. Nach zwei Jahren hat er einen Kurs gemacht. Der Kurs hat sechs Monate gedauert. Danach bekam er andere Aufgaben. Seit dreieinhalb Jahren arbeitet er selbstständiger und hilft neuen Kollegen.';
const TEXT5='Sofia hat vor vier Jahren ihre Ausbildung als Friseurin beendet. Danach hat sie zwei Jahre in einem großen Salon gearbeitet. Seit zwei Jahren arbeitet sie in einem kleinen Salon in ihrer Nähe. Dort hat sie weniger Kollegen, aber mehr eigene Kunden. Sie sagt, die Arbeit ist heute ruhiger als früher.';

const TASK6=[
 tf(TEXT1,'Die Ausbildung von Maria hat drei Jahre gedauert.','Falsch'),
 tf(TEXT1,'Maria hat nicht direkt nach der Ausbildung im Café angefangen.','Richtig'),
 tf(TEXT1,'Maria arbeitet länger im Café, als ihre Ausbildung gedauert hat.','Richtig'),
 tf(TEXT1,'Maria hat heute Berufserfahrung im Service.','Richtig'),
 tf(TEXT2,'Amir hat eine Ausbildung als Krankenpfleger gemacht.','Richtig'),
 tf(TEXT2,'Amirs Ausbildung hat drei Jahre gedauert.','Richtig'),
 tf(TEXT2,'Amir arbeitet seit dem Beginn seiner Ausbildung im Krankenhaus.','Falsch'),
 tf(TEXT2,'Amir hat seine Ausbildung ungefähr vor einem Jahr beendet.','Richtig'),
 tf(TEXT3,'Lena hat nach der Ausbildung sofort im Café angefangen.','Falsch'),
 tf(TEXT3,'Lena hat insgesamt Erfahrung in einem Restaurant und in einem Café.','Richtig'),
 tf(TEXT3,'Lenas Ausbildung war länger als ihre bisherige Arbeit im Café.','Falsch'),
 tf(TEXT3,'Lena arbeitet heute nur im Service und kocht nicht mehr.','Falsch'),
 tf(TEXT4,'Daniel arbeitet heute noch genau so wie an seinem ersten Arbeitstag.','Falsch'),
 tf(TEXT4,'Daniel hatte schon viel Erfahrung, als er bei der Firma angefangen hat.','Falsch'),
 tf(TEXT4,'Der Kurs begann ungefähr zwei Jahre nach Daniels Arbeitsbeginn.','Richtig'),
 tf(TEXT4,'Daniel kann heute neue Kollegen bei der Arbeit unterstützen.','Richtig'),
 tf(TEXT5,'Sofia hat ihre Ausbildung vor vier Jahren beendet.','Richtig'),
 tf(TEXT5,'Sofia arbeitet seit vier Jahren im gleichen Salon.','Falsch'),
 tf(TEXT5,'Im kleinen Salon hat Sofia mehr eigene Kunden als früher.','Richtig'),
 tf(TEXT5,'Sofia findet ihre heutige Arbeit stressiger als früher.','Falsch')
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const practice=theme.tasks.filter(task=>!task?.exam);
 const task4=practice[3],task5=practice[4],task6=practice[5];
 if(task4){
  task4.title='Fragen und Antworten';
  task4.instruction='Wähle passende Frage oder Antwort.';
  task4.kind='choice';task4.icon='✅';task4.emoji='✅';
  delete task4.intro;
  task4.items=TASK4.map(item=>({...item,options:[...item.options]}));
 }
 if(task5){
  task5.title='Sätze ordnen';
  task5.instruction='Ordne die Wörter zu einem richtigen Satz.';
  task5.kind='order';task5.icon='🧩';task5.emoji='🧩';
  delete task5.intro;
  task5.items=TASK5.map(item=>({...item,tokens:[...item.tokens]}));
 }
 if(task6){
  task6.instruction='Lies den Text und entscheide: richtig oder falsch.';
  task6.kind='choice';task6.icon='📖';task6.emoji='📖';
  delete task6.intro;
  task6.items=TASK6.map(item=>({...item,options:[...item.options]}));
 }
 return theme;
}

window.L8_T2_TASK4_6_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK4_6_READY;
window.L8T2Task4to6={apply};
})();
