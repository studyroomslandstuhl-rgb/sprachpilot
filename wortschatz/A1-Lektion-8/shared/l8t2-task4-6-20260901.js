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

const TEXT1='Maria hat ihre Ausbildung als Kellnerin vor vier Jahren angefangen. Nach einem Jahr war die Ausbildung fertig. Danach hat sie sechs Monate eine Stelle gesucht. Dann hat sie in einem Hotel angefangen und dort ein Jahr gearbeitet. Seit eineinhalb Jahren arbeitet sie in einem Café. Am Wochenende ist dort oft viel Stress, aber Maria arbeitet gern im Service.';
const TEXT2='Amir ist vor sechs Jahren nach Deutschland gekommen. Zuerst hat er acht Monate einen Deutschkurs besucht. Vor vier Jahren hat er dann eine Ausbildung als Krankenpfleger angefangen. Drei Jahre später hatte er seinen Abschluss. Heute arbeitet er in einem Krankenhaus. Dort hat er vor ungefähr einem Jahr angefangen.';
const TEXT3='Lena wollte zuerst in einem Büro arbeiten. Vor fünf Jahren hat sie aber eine Ausbildung als Köchin angefangen. Zwei Jahre später war die Ausbildung fertig. Danach war sie ein Jahr in einem großen Restaurant. Dann hat sie die Stelle gewechselt. Seit zwei Jahren arbeitet sie in einem kleinen Café und kocht dort mittags. Manchmal hilft sie auch im Service.';
const TEXT4='Daniel ist seit sechs Jahren bei derselben Firma. In den ersten zwei Jahren war er Arbeiter und hatte noch wenig Berufserfahrung. Danach hat er einen Kurs gemacht. Der Kurs hat ein halbes Jahr gedauert. Erst nach dem Kurs bekam er andere Aufgaben. Heute arbeitet Daniel selbstständiger und zeigt neuen Kollegen die Arbeit.';
const TEXT5='Sofia hat ihre Ausbildung als Friseurin vor vier Jahren beendet. Danach arbeitete sie zwei Jahre in einem großen Salon mit vielen Kollegen. Dann wollte sie näher an ihrer Wohnung arbeiten und wechselte den Arbeitgeber. Seitdem arbeitet sie in einem kleinen Salon. Dort hat sie weniger Kollegen, aber mehr eigene Kunden. Sie sagt, dass ihre Arbeit heute ruhiger ist.';

const TASK6=[
 tf(TEXT1,'Maria hat nach ihrer Ausbildung sofort eine Stelle gefunden.','Falsch'),
 tf(TEXT1,'Maria hat insgesamt länger gearbeitet als ihre Ausbildung gedauert hat.','Richtig'),
 tf(TEXT1,'Maria arbeitet heute bei demselben Arbeitgeber wie direkt nach der Ausbildung.','Falsch'),
 tf(TEXT1,'Maria hat ihre Ausbildung ungefähr vor drei Jahren beendet.','Richtig'),
 tf(TEXT2,'Amir hat schon vor seiner Ausbildung Deutsch gelernt.','Richtig'),
 tf(TEXT2,'Amir arbeitet ungefähr so lange im Krankenhaus, wie ein Drittel seiner Ausbildung gedauert hat.','Richtig'),
 tf(TEXT2,'Amir hat seine Ausbildung direkt nach seiner Ankunft in Deutschland angefangen.','Falsch'),
 tf(TEXT2,'Amirs Ausbildung war vor ungefähr einem Jahr fertig.','Richtig'),
 tf(TEXT3,'Lena hat nach ihrer Ausbildung zuerst in einem Café gearbeitet.','Falsch'),
 tf(TEXT3,'Lena hat heute mehr als drei Jahre Berufserfahrung nach der Ausbildung.','Richtig'),
 tf(TEXT3,'Lena arbeitet seit dem Ende ihrer Ausbildung beim gleichen Arbeitgeber.','Falsch'),
 tf(TEXT3,'Lenas Ausbildung und ihre bisherige Arbeit im Café waren gleich lang.','Richtig'),
 tf(TEXT4,'Daniel bekam die neuen Aufgaben schon vor dem Kurs.','Falsch'),
 tf(TEXT4,'Als Daniel den Kurs angefangen hat, arbeitete er schon ungefähr zwei Jahre bei der Firma.','Richtig'),
 tf(TEXT4,'Daniel hat heute mehr Berufserfahrung als am Anfang.','Richtig'),
 tf(TEXT4,'Daniel arbeitet heute wahrscheinlich nicht mehr nur als einfacher Arbeiter mit den gleichen Aufgaben wie früher.','Richtig'),
 tf(TEXT5,'Sofia hat nach ihrer Ausbildung nur bei einem Arbeitgeber gearbeitet.','Falsch'),
 tf(TEXT5,'Sofia arbeitet seit ungefähr zwei Jahren im kleinen Salon.','Richtig'),
 tf(TEXT5,'Sofia hat heute mehr Kollegen als früher.','Falsch'),
 tf(TEXT5,'Der Wechsel des Arbeitgebers hat auch Sofias Arbeitsweg verändert.','Richtig')
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
  task6.title='Biografien verstehen';
  task6.instruction='Lies genau und entscheide: richtig oder falsch.';
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