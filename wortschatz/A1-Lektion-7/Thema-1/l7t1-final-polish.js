(function(){
'use strict';
if(window.__SP_L7T1_FINAL_POLISH_2)return;
window.__SP_L7T1_FINAL_POLISH_2=true;

const LEVELS=Object.freeze({
 'gar nicht':'😭',
 'nicht so gut':'🙁',
 'gut':'🙂',
 'sehr gut':'🤩'
});

const ABILITY_ROWS=[
 ['Maria','gar nicht','kochen','kochen.webp','Maria kann gar nicht kochen.'],
 ['Du','nicht so gut','Tennis spielen','tennis_spielen.webp','Du kannst nicht so gut Tennis spielen.'],
 ['Sofia','gut','singen','lied.webp','Sofia kann gut singen.'],
 ['Paul','sehr gut','Ski fahren','ski_fahren.webp','Paul kann sehr gut Ski fahren.'],
 ['Anna','gar nicht','jonglieren','jonglieren.webp','Anna kann gar nicht jonglieren.'],
 ['Ihr','nicht so gut','Gitarre spielen','gitarre_spielen.webp','Ihr könnt nicht so gut Gitarre spielen.'],
 ['Lara','gut','reiten','reiten.webp','Lara kann gut reiten.'],
 ['Wir','sehr gut','fotografieren','fotografieren.webp','Wir können sehr gut fotografieren.'],
 ['Mia','gar nicht','Klavier spielen','klavier_spielen.webp','Mia kann gar nicht Klavier spielen.'],
 ['Omar','nicht so gut','malen','malen.webp','Omar kann nicht so gut malen.'],
 ['Die Kinder','gut','Fahrrad fahren','fahrrad_fahren.webp','Die Kinder können gut Fahrrad fahren.'],
 ['Jonas','sehr gut','Tennis spielen','tennis_spielen.webp','Jonas kann sehr gut Tennis spielen.'],
 ['Ich','gar nicht','Ski fahren','ski_fahren.webp','Ich kann gar nicht Ski fahren.'],
 ['Amir','nicht so gut','jonglieren','jonglieren.webp','Amir kann nicht so gut jonglieren.'],
 ['Nina','sehr gut','Gitarre spielen','gitarre_spielen.webp','Nina kann sehr gut Gitarre spielen.']
];

const SMS_ROWS=[
 {
  messages:[
   ['Mia','Ich kann heute nicht zum Schwimmbad kommen. Ich bin krank.','left'],
   ['Lena','Schade. Willst du morgen kommen?','right'],
   ['Mia','Ja, morgen will ich kommen.','left']
  ],
  trueFalsePrompt:'Mia will heute nicht zum Schwimmbad kommen.',
  trueFalseAnswer:'Falsch',
  abcPrompt:'Was bedeutet „Ich kann heute nicht kommen“ hier?',
  abcAnswer:'Es ist heute nicht möglich.',
  abcOptions:['Es ist heute nicht möglich.','Mia hat heute keine Lust.','Mia sagt höflich einen Wunsch.']
 },
 {
  messages:[
   ['Ali','Ich will heute Abend Gitarre üben.','left'],
   ['Sara','Kannst du schon gut spielen?','right'],
   ['Ali','Noch nicht so gut.','left']
  ],
  trueFalsePrompt:'Ali hat für heute Abend einen festen Plan.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Was zeigt „Ich will heute Abend üben“?',
  abcAnswer:'einen festen Plan / Willen',
  abcOptions:['einen festen Plan / Willen','eine Fähigkeit','einen höflichen Wunsch']
 },
 {
  messages:[
   ['Anna','Ich möchte morgen einen Deutschkurs besuchen. Wann beginnt er?','left'],
   ['Sprachschule','Der Kurs beginnt um 9 Uhr.','right']
  ],
  trueFalsePrompt:'Anna sagt höflich, was sie gern machen möchte.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Welche Bedeutung hat „möchte“ hier?',
  abcAnswer:'ein höflicher Wunsch',
  abcOptions:['ein höflicher Wunsch','eine Fähigkeit','ein fester Wille']
 },
 {
  messages:[
   ['Tom','Kannst du mir bei Mathematik helfen?','left'],
   ['Nina','Ja. Ich kann gut Mathematik.','right']
  ],
  trueFalsePrompt:'Tom fragt, ob Nina die Fähigkeit hat, ihm zu helfen.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Welche Bedeutung hat „kann“ in „Ich kann gut Mathematik“?',
  abcAnswer:'Fähigkeit',
  abcOptions:['Fähigkeit','fester Plan','höflicher Wunsch']
 },
 {
  messages:[
   ['Lara','Wir können uns morgen um 16 Uhr treffen.','left'],
   ['Ben','Gut. Ich will danach noch zum Schwimmbad gehen.','right']
  ],
  trueFalsePrompt:'Lara sagt, dass ein Treffen morgen um 16 Uhr möglich ist.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Was bedeutet „Wir können uns morgen treffen“ hier?',
  abcAnswer:'Es ist möglich.',
  abcOptions:['Es ist möglich.','Wir wollen es unbedingt.','Wir fragen höflich.']
 },
 {
  messages:[
   ['Omar','Möchtest du einen Tee?','left'],
   ['Eva','Ja, gern. Ich möchte einen Tee.','right']
  ],
  trueFalsePrompt:'Eva drückt höflich einen Wunsch aus.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Warum passt „möchte“ hier am besten?',
  abcAnswer:'Es ist ein höflicher Wunsch.',
  abcOptions:['Es ist ein höflicher Wunsch.','Eva zeigt eine Fähigkeit.','Eva sagt einen festen Plan.']
 },
 {
  messages:[
   ['Paul','Ich will auf keinen Fall Ski fahren.','left'],
   ['Mara','Okay. Möchtest du lieber spazieren gehen?','right']
  ],
  trueFalsePrompt:'Paul sagt, dass er nicht Ski fahren kann.',
  trueFalseAnswer:'Falsch',
  abcPrompt:'Was bedeutet „Ich will auf keinen Fall Ski fahren“?',
  abcAnswer:'Paul möchte das nicht und entscheidet sich dagegen.',
  abcOptions:['Paul möchte das nicht und entscheidet sich dagegen.','Paul hat die Fähigkeit nicht.','Paul fragt höflich nach einer Möglichkeit.']
 },
 {
  messages:[
   ['Lea','Kann dein Bruder jonglieren?','left'],
   ['Max','Ja, sehr gut.','right']
  ],
  trueFalsePrompt:'Lea fragt nach einer Fähigkeit.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Was bedeutet „kann jonglieren“?',
  abcAnswer:'Er hat die Fähigkeit zu jonglieren.',
  abcOptions:['Er hat die Fähigkeit zu jonglieren.','Er hat fest geplant zu jonglieren.','Er bittet höflich darum zu jonglieren.']
 },
 {
  messages:[
   ['Sofia','Ich möchte am Samstag ins Kino.','left'],
   ['Mila','Ich will auch. Kaufen wir Karten?','right']
  ],
  trueFalsePrompt:'Mit „möchte“ sagt Sofia zuerst einen Wunsch, keinen sicheren festen Plan.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Was drückt Sofia mit „Ich möchte ins Kino“ aus?',
  abcAnswer:'einen Wunsch',
  abcOptions:['einen Wunsch','eine Fähigkeit','eine Unmöglichkeit']
 },
 {
  messages:[
   ['Jonas','Ich kann morgen nicht pünktlich sein. Der Bus kommt spät.','left'],
   ['Lehrer','Okay, danke für die Information.','right']
  ],
  trueFalsePrompt:'Jonas sagt, dass er morgen nicht pünktlich sein will.',
  trueFalseAnswer:'Falsch',
  abcPrompt:'Was bedeutet „Ich kann morgen nicht pünktlich sein“?',
  abcAnswer:'Pünktlich sein ist morgen nicht möglich.',
  abcOptions:['Pünktlich sein ist morgen nicht möglich.','Jonas möchte absichtlich zu spät kommen.','Jonas äußert höflich einen Wunsch.']
 },
 {
  messages:[
   ['Nina','Wollt ihr am Samstag Tennis spielen?','left'],
   ['Omar','Ja. Wir wollen um 15 Uhr spielen.','right']
  ],
  trueFalsePrompt:'Omar spricht über einen konkreten Plan für Samstag.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Was zeigt „Wir wollen um 15 Uhr spielen“?',
  abcAnswer:'einen festen Plan',
  abcOptions:['einen festen Plan','eine Fähigkeit','eine höfliche Bestellung']
 },
 {
  messages:[
   ['Kellner','Möchten Sie etwas essen?','left'],
   ['Maria','Ja, ich möchte einen Kuchen.','right']
  ],
  trueFalsePrompt:'Der Kellner fragt höflich nach Marias Wunsch.',
  trueFalseAnswer:'Richtig',
  abcPrompt:'Warum verwendet man hier „möchten“?',
  abcAnswer:'für einen höflichen Wunsch',
  abcOptions:['für einen höflichen Wunsch','für eine Fähigkeit','für einen festen Plan']
 }
];

function abilityTask(){
 return{
  id:'faehigkeit-saetze-schreiben',
  icon:'✍️',
  kind:'ability-write',
  title:'Sätze mit können',
  description:'Schreibe die Sätze mit „können“.',
  items:ABILITY_ROWS.map(([subject,level,activity,image,answer])=>({
   subject,level,emoji:LEVELS[level],activity,image,answer,
   answers:[answer,answer.replace(/[.!?]+$/,'')],
   noHelp:true,noAudio:true
  }))
 };
}

function smsTask(){
 return{
  id:'sms-modalverben',
  icon:'💬',
  kind:'sms-modal-combo',
  title:'SMS-Gespräche: können, wollen, möchten',
  description:'Lies die SMS und beantworte die Fragen.',
  items:SMS_ROWS.map(row=>({
   ...row,
   trueFalseOptions:['Richtig','Falsch'],
   noHelp:true,noAudio:true
  }))
 };
}

function cleanVariant(value){
 const text=String(value||'').trim();
 if(!text)return'';
 const cleaned=text
  .replace(/^Variante\s+\d+\s*(?:[·|—-]\s*)?/i,'')
  .replace(/\s*(?:[·|—-]\s*)Variante\s+\d+\s*$/i,'')
  .trim();
 return cleaned;
}
function stripVariantNotes(task){
 (task?.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  if(typeof item.context==='string'){
   const cleaned=cleanVariant(item.context);
   if(cleaned)item.context=cleaned;else delete item.context;
  }
  if(typeof item.label==='string'&&/^Variante\s+\d+$/i.test(item.label.trim()))delete item.label;
  if(typeof item.note==='string'&&/^Variante\s+\d+$/i.test(item.note.trim()))delete item.note;
 });
}

function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let tasks=[...theme.tasks];
 const exam=tasks.find(task=>task?.exam||task?.id==='pruefung');
 const learning=tasks.filter(task=>task!==exam);

 // Die vom Nutzer vor dieser Änderung als Aufgabe 11 bezeichnete Aufgabe entfernen.
 const oldTask11=learning[10]||null;
 if(oldTask11)tasks=tasks.filter(task=>task!==oldTask11);

 // Bisherige Aufgabe 9 (Fragen ordnen/markieren) durch die Schreibaufgabe ersetzen.
 const oldNine=tasks.findIndex(task=>task?.id==='fragen-ordnen-markieren');
 const replacement=abilityTask();
 if(oldNine>=0)tasks.splice(oldNine,1,replacement);
 else if(!tasks.some(task=>task?.id===replacement.id))tasks.splice(Math.min(8,tasks.length),0,replacement);

 tasks=tasks.filter(task=>task?.id!=='sms-modalverben');
 tasks.forEach(stripVariantNotes);

 // Neue SMS-Aufgabe als letzte Lernaufgabe direkt vor der Prüfung.
 const sms=smsTask();
 if(exam){
  tasks=tasks.filter(task=>task!==exam);
  tasks.push(sms);
  exam.exam=true;
  tasks.push(exam);
 }else{
  tasks.push(sms);
 }
 tasks.forEach((task,index)=>{task.order=index+1});
 theme.tasks=tasks;
 theme.abilityEmojis={...LEVELS};
 theme.finalPolishRevision='l7t1-final-polish-2026-08-13-v2';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
