(function(){
'use strict';
if(window.__SP_L8T2_TASK7_9_20260901)return;
window.__SP_L8T2_TASK7_9_20260901=true;

const AUDIO7='https://sprachpilot.b-cdn.net/audio/l8t2_aufgabe7_bewerbung_emre.mp3';
const AUDIO8='https://sprachpilot.b-cdn.net/audio/l8t2_aufgabe8_bewerbung_aylin.mp3';
const input=(prompt,answer,audio='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],audio,audioFile:audio});
const choice=(prompt,options,answer,audio='')=>({type:'choice',prompt,options,answer,audio,audioFile:audio});

const TASK7={
 id:'bewerbung-hoeren-schreiben',
 title:'Bewerbungsgespräch – Fragen beantworten',
 instruction:'Höre das Telefongespräch und beantworte die Fragen in vollständigen Sätzen.',
 kind:'input',icon:'🎧',emoji:'🎧',
 items:[
  input('Wo wohnt Emre?',[
   'Emre wohnt in Köln.','Er wohnt in Köln.','In Köln wohnt Emre.','In Köln wohnt er.'
  ],AUDIO7),
  input('Wie lange wohnt Emre schon in Köln?',[
   'Emre wohnt seit drei Jahren in Köln.','Er wohnt seit drei Jahren in Köln.','Seit drei Jahren wohnt Emre in Köln.','Seit drei Jahren wohnt er in Köln.','Emre wohnt seit 3 Jahren in Köln.','Er wohnt seit 3 Jahren in Köln.','Seit 3 Jahren wohnt Emre in Köln.','Seit 3 Jahren wohnt er in Köln.'
  ],AUDIO7),
  input('Wann ist Emre nach Deutschland gekommen?',[
   'Emre ist vor fünf Jahren nach Deutschland gekommen.','Er ist vor fünf Jahren nach Deutschland gekommen.','Vor fünf Jahren ist Emre nach Deutschland gekommen.','Vor fünf Jahren ist er nach Deutschland gekommen.','Emre ist vor 5 Jahren nach Deutschland gekommen.','Er ist vor 5 Jahren nach Deutschland gekommen.','Vor 5 Jahren ist Emre nach Deutschland gekommen.','Vor 5 Jahren ist er nach Deutschland gekommen.'
  ],AUDIO7),
  input('Wann hat Emre seine Ausbildung angefangen?',[
   'Emre hat seine Ausbildung vor vier Jahren angefangen.','Er hat seine Ausbildung vor vier Jahren angefangen.','Emre hat vor vier Jahren seine Ausbildung angefangen.','Er hat vor vier Jahren seine Ausbildung angefangen.','Vor vier Jahren hat Emre seine Ausbildung angefangen.','Vor vier Jahren hat er seine Ausbildung angefangen.','Emre hat seine Ausbildung vor 4 Jahren angefangen.','Er hat seine Ausbildung vor 4 Jahren angefangen.','Vor 4 Jahren hat Emre seine Ausbildung angefangen.','Vor 4 Jahren hat er seine Ausbildung angefangen.'
  ],AUDIO7),
  input('Wie lange hat die Ausbildung gedauert?',[
   'Die Ausbildung hat zwei Jahre gedauert.','Seine Ausbildung hat zwei Jahre gedauert.','Die Ausbildung hat 2 Jahre gedauert.','Seine Ausbildung hat 2 Jahre gedauert.','Zwei Jahre hat die Ausbildung gedauert.','2 Jahre hat die Ausbildung gedauert.'
  ],AUDIO7),
  input('Wann hat Emre die Ausbildung beendet?',[
   'Emre hat die Ausbildung vor zwei Jahren beendet.','Er hat die Ausbildung vor zwei Jahren beendet.','Emre hat seine Ausbildung vor zwei Jahren beendet.','Er hat seine Ausbildung vor zwei Jahren beendet.','Vor zwei Jahren hat Emre die Ausbildung beendet.','Vor zwei Jahren hat er die Ausbildung beendet.','Emre hat die Ausbildung vor 2 Jahren beendet.','Er hat die Ausbildung vor 2 Jahren beendet.','Vor 2 Jahren hat Emre die Ausbildung beendet.','Vor 2 Jahren hat er die Ausbildung beendet.'
  ],AUDIO7),
  input('Wie lange hat Emre nach der Ausbildung in einem Restaurant gearbeitet?',[
   'Emre hat acht Monate in einem Restaurant gearbeitet.','Er hat acht Monate in einem Restaurant gearbeitet.','Emre hat acht Monate in einem kleinen Restaurant gearbeitet.','Er hat acht Monate in einem kleinen Restaurant gearbeitet.','Emre hat 8 Monate in einem Restaurant gearbeitet.','Er hat 8 Monate in einem Restaurant gearbeitet.','Acht Monate hat Emre in einem Restaurant gearbeitet.','Acht Monate hat er in einem Restaurant gearbeitet.'
  ],AUDIO7),
  input('Seit wann besucht Emre einen Deutschkurs?',[
   'Emre besucht seit einem Jahr einen Deutschkurs.','Er besucht seit einem Jahr einen Deutschkurs.','Seit einem Jahr besucht Emre einen Deutschkurs.','Seit einem Jahr besucht er einen Deutschkurs.','Emre besucht seit 1 Jahr einen Deutschkurs.','Er besucht seit 1 Jahr einen Deutschkurs.','Seit 1 Jahr besucht Emre einen Deutschkurs.','Seit 1 Jahr besucht er einen Deutschkurs.'
  ],AUDIO7),
  input('Seit wann arbeitet Emre im Café?',[
   'Emre arbeitet seit zehn Monaten im Café.','Er arbeitet seit zehn Monaten im Café.','Seit zehn Monaten arbeitet Emre im Café.','Seit zehn Monaten arbeitet er im Café.','Emre arbeitet seit 10 Monaten im Café.','Er arbeitet seit 10 Monaten im Café.','Seit 10 Monaten arbeitet Emre im Café.','Seit 10 Monaten arbeitet er im Café.'
  ],AUDIO7),
  input('Wie lange lernt Emre schon Deutsch?',[
   'Emre lernt seit zwei Jahren Deutsch.','Er lernt seit zwei Jahren Deutsch.','Seit zwei Jahren lernt Emre Deutsch.','Seit zwei Jahren lernt er Deutsch.','Emre lernt seit 2 Jahren Deutsch.','Er lernt seit 2 Jahren Deutsch.','Seit 2 Jahren lernt Emre Deutsch.','Seit 2 Jahren lernt er Deutsch.'
  ],AUDIO7)
 ]
};

const TASK8={
 id:'bewerbung-hoeren-verstehen',
 title:'Bewerbungsgespräch – Hörverstehen',
 instruction:'Höre das Telefongespräch und wähle die richtige Antwort.',
 kind:'choice',icon:'🎧',emoji:'🎧',
 items:[
  choice('Aylin wohnt immer noch in Düsseldorf.',['Richtig','Falsch'],'Falsch',AUDIO8),
  choice('Aylin lebt seit sechs Jahren in Deutschland.',['Richtig','Falsch'],'Richtig',AUDIO8),
  choice('Aylin hat ihre Ausbildung vor drei Jahren begonnen.',['Richtig','Falsch'],'Richtig',AUDIO8),
  choice('Die Ausbildung hat drei Jahre gedauert.',['Richtig','Falsch'],'Falsch',AUDIO8),
  choice('Nach der Ausbildung hat Aylin sofort ihre erste Stelle angefangen.',['Richtig','Falsch'],'Falsch',AUDIO8),
  choice('Aylin macht seit vier Monaten einen Deutschkurs.',['Richtig','Falsch'],'Falsch',AUDIO8),
  choice('Aylin hat ihre erste Stelle vor circa eineinhalb Jahren angefangen.',['Richtig','Falsch'],'Richtig',AUDIO8),
  choice('Seit acht Monaten arbeitet Aylin in Teilzeit.',['Richtig','Falsch'],'Richtig',AUDIO8),
  choice('Das Praktikum soll zwei Jahre dauern.',['Richtig','Falsch'],'Falsch',AUDIO8),
  choice('Aylin lernt seit vier Jahren Deutsch.',['Richtig','Falsch'],'Richtig',AUDIO8),

  choice('Wo wohnt Aylin jetzt?',['In Köln.','In Düsseldorf.','In Essen.'],'In Köln.',AUDIO8),
  choice('Wie lange hat Aylin in Düsseldorf gewohnt?',['Zwei Jahre.','Seit zwei Jahren.','Vor zwei Jahren.'],'Zwei Jahre.',AUDIO8),
  choice('Wie lange ist Aylin schon in Deutschland?',['Seit sechs Jahren.','Vor sechs Jahren.','Sechs Monate.'],'Seit sechs Jahren.',AUDIO8),
  choice('Wann hat sie ihre Ausbildung begonnen?',['Vor drei Jahren.','Seit drei Jahren.','Drei Jahre.'],'Vor drei Jahren.',AUDIO8),
  choice('Wie lange hat die Ausbildung gedauert?',['Ein Jahr.','Seit einem Jahr.','Vor einem Jahr.'],'Ein Jahr.',AUDIO8),
  choice('Wie lange hat der Deutschkurs gedauert?',['Vier Monate.','Seit vier Monaten.','Vor vier Monaten.'],'Vier Monate.',AUDIO8),
  choice('Wann hat Aylin ihre erste Stelle angefangen?',['Vor circa eineinhalb Jahren.','Seit circa eineinhalb Jahren.','Eineinhalb Jahre.'],'Vor circa eineinhalb Jahren.',AUDIO8),
  choice('Seit wann arbeitet Aylin in Teilzeit?',['Seit acht Monaten.','Vor acht Monaten.','Acht Monate.'],'Seit acht Monaten.',AUDIO8),
  choice('Wie lange möchte Aylin das Praktikum machen?',['Zwei Monate.','Seit zwei Monaten.','Vor zwei Monaten.'],'Zwei Monate.',AUDIO8),
  choice('Wann kann Aylin mit dem Praktikum anfangen?',['In drei Wochen.','Seit drei Wochen.','Vor drei Wochen.'],'In drei Wochen.',AUDIO8)
 ]
};

const TASK9={
 id:'email-luecken',
 title:'E-Mails mit Lücken',
 instruction:'Lies die E-Mail und ergänze die fehlende Stelle.',
 kind:'input',icon:'✉️',emoji:'✉️',
 items:[
  input('E-Mail 1: Ergänze die Anrede.',[
   'Sehr geehrte Frau Berger','Sehr geehrte Frau Berger,'
  ]),
  input('E-Mail 2: Ergänze die fehlende Zeitangabe.',[
   'seit zwei Jahren','seit 2 Jahren'
  ]),
  input('E-Mail 3: Ergänze den fehlenden Satzteil.',[
   'habe vor drei Jahren','habe vor 3 Jahren'
  ]),
  input('E-Mail 4: Ergänze den Schlusssatz.',[
   'Ich freue mich auf Ihre Antwort.','Ich freue mich auf Ihre Antwort'
  ]),
  input('E-Mail 5: Ergänze den Gruß.',[
   'Mit freundlichen Grüßen','Mit freundlichen Gruessen'
  ])
 ]
};
TASK9.items[0].context='_____\n\nvielen Dank für Ihre Nachricht. Ich interessiere mich sehr für das Praktikum in Ihrem Hotel. Ich kann ab dem 1. Oktober anfangen.\n\nMit freundlichen Grüßen\nEmre Demir';
TASK9.items[1].context='Sehr geehrte Frau Klein,\n\nich möchte mich für die Stelle in Ihrem Café bewerben. Ich arbeite _____ als Kellner und habe schon viel Berufserfahrung.\n\nMit freundlichen Grüßen\nOmar Said';
TASK9.items[2].context='Sehr geehrter Herr Becker,\n\nvielen Dank für das Telefonat. Ich _____ eine Ausbildung als Koch angefangen. Die Ausbildung hat zwei Jahre gedauert.\n\nMit freundlichen Grüßen\nIvan Petrov';
TASK9.items[3].context='Sehr geehrte Frau Wagner,\n\nseit einem Jahr arbeite ich in einem Pflegeheim. Jetzt möchte ich gern ein Praktikum bei Ihnen machen. Ab nächsten Monat habe ich Zeit.\n\n_____\n\nMit freundlichen Grüßen\nAylin Yilmaz';
TASK9.items[4].context='Sehr geehrter Herr Müller,\n\nvielen Dank für Ihre Einladung zum Gespräch. Der Termin am Dienstag um 10 Uhr passt sehr gut.\n\n_____\nSara Klein';

function replacePractice(theme,index,newTask){
 const positions=[];
 (theme.tasks||[]).forEach((task,i)=>{if(!task?.exam)positions.push(i)});
 const absolute=positions[index];
 if(Number.isInteger(absolute))theme.tasks.splice(absolute,1,newTask);
 else{
  const examIndex=(theme.tasks||[]).findIndex(task=>task?.exam);
  theme.tasks.splice(examIndex>=0?examIndex:theme.tasks.length,0,newTask);
 }
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 replacePractice(theme,6,TASK7);
 replacePractice(theme,7,TASK8);
 replacePractice(theme,8,TASK9);
 return theme;
}

window.L8_T2_TASK7_9_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK7_9_READY;
window.L8T2Task7to9={apply};
})();
