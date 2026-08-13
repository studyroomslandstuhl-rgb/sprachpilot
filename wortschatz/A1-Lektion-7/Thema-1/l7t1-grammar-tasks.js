(function(){
'use strict';
if(window.__SP_L7T1_GRAMMAR_TASKS_2)return;
window.__SP_L7T1_GRAMMAR_TASKS_2=true;

const PRONOUNS=['ich','du','er / sie / es','wir','ihr','sie / Sie'];
const FORMS={
 'können':['kann','kannst','kann','können','könnt','können'],
 'wollen':['will','willst','will','wollen','wollt','wollen'],
 'möchten':['möchte','möchtest','möchte','möchten','möchtet','möchten']
};

function tableTask(){
 return{
  id:'modal-konjugieren',icon:'🧠',kind:'conjugation-input-table',
  title:'Konjugieren: können, wollen, möchte',description:'Konjugiere die Verben',
  items:Object.entries(FORMS).map(([verb,forms])=>({verb,rows:PRONOUNS.map((pronoun,index)=>({pronoun,answer:forms[index]}))}))
 };
}
function formTask(){
 const items=[];
 for(const [verb,forms] of Object.entries(FORMS))PRONOUNS.forEach((pronoun,index)=>items.push({kind:'input',prompt:`${verb}: ${pronoun} →`,answer:forms[index],answers:[forms[index]],noHelp:true}));
 return{id:'modalformen-schreiben',icon:'✍️',kind:'input',title:'Verbformen',description:'Schreibe die richtige Verbform.',items};
}
function contextTask(){
 const rows=[
  ['Ich habe die Fähigkeit. Ich ___ gut schwimmen.','kann',['kann','will','möchte']],
  ['Du hast heute einen festen Plan. Du ___ Tennis spielen.','willst',['kannst','willst','möchtest']],
  ['Anna bestellt höflich im Café. Sie ___ einen Tee.','möchte',['kann','will','möchte']],
  ['Wir haben die Fähigkeit. Wir ___ gut Deutsch sprechen.','können',['können','wollen','möchten']],
  ['Ihr habt einen festen Plan für Samstag. Ihr ___ Ski fahren.','wollt',['könnt','wollt','möchtet']],
  ['Die Kinder fragen höflich. Sie ___ ein Eis.','möchten',['können','wollen','möchten']],
  ['Paul hat Klavier spielen gelernt. Er ___ Klavier spielen.','kann',['kann','will','möchte']],
  ['Ich habe einen Plan für heute. Ich ___ einen Kuchen backen.','will',['kann','will','möchte']],
  ['Lara bestellt höflich im Restaurant. Ich ___ eine Suppe.','möchte',['kann','will','möchte']],
  ['Du kannst reiten. Du ___ reiten.','kannst',['kannst','willst','möchtest']],
  ['Wir haben einen festen Plan. Wir ___ morgen früh losfahren.','wollen',['können','wollen','möchten']],
  ['Ihr bestellt höflich. Ihr ___ einen Kaffee.','möchtet',['könnt','wollt','möchtet']],
  ['Mia kann jonglieren. Sie ___ jonglieren.','kann',['kann','will','möchte']],
  ['Ich habe einen festen Plan. Ich ___ heute meine Hausaufgaben machen.','will',['kann','will','möchte']],
  ['Wir bestellen höflich. Wir ___ zwei Wasser.','möchten',['können','wollen','möchten']]
 ];
 return{id:'modalverb-kontext',icon:'💬',kind:'choice',title:'können, wollen oder möchten?',description:'Was passt: können, wollen oder möchten?',items:rows.map(([prompt,answer,options])=>({kind:'choice',prompt,answer,options,noHelp:true}))};
}

const STRUCTURE_ROWS=[
 ['Ich kann gut singen.',['Ich','kann','gut','singen','.'],['Ich'],['kann','singen']],
 ['Du willst heute Tennis spielen.',['Du','willst','heute','Tennis','spielen','.'],['Du'],['willst','spielen']],
 ['Anna möchte einen Tee trinken.',['Anna','möchte','einen','Tee','trinken','.'],['Anna'],['möchte','trinken']],
 ['Wir können gut Deutsch sprechen.',['Wir','können','gut','Deutsch','sprechen','.'],['Wir'],['können','sprechen']],
 ['Ihr wollt am Samstag Ski fahren.',['Ihr','wollt','am','Samstag','Ski','fahren','.'],['Ihr'],['wollt','fahren']],
 ['Die Kinder möchten ein Spiel spielen.',['Die Kinder','möchten','ein','Spiel','spielen','.'],['Die Kinder'],['möchten','spielen']],
 ['Paul kann Klavier spielen.',['Paul','kann','Klavier','spielen','.'],['Paul'],['kann','spielen']],
 ['Ich will heute einen Kuchen backen.',['Ich','will','heute','einen','Kuchen','backen','.'],['Ich'],['will','backen']],
 ['Mia möchte nach Hause gehen.',['Mia','möchte','nach','Hause','gehen','.'],['Mia'],['möchte','gehen']],
 ['Du kannst gut fotografieren.',['Du','kannst','gut','fotografieren','.'],['Du'],['kannst','fotografieren']],
 ['Wir wollen morgen früh losfahren.',['Wir','wollen','morgen','früh','losfahren','.'],['Wir'],['wollen','losfahren']],
 ['Ihr möchtet Französisch sprechen.',['Ihr','möchtet','Französisch','sprechen','.'],['Ihr'],['möchtet','sprechen']],
 ['Lara kann gut reiten.',['Lara','kann','gut','reiten','.'],['Lara'],['kann','reiten']],
 ['Die Schüler wollen einen Text lesen.',['Die Schüler','wollen','einen','Text','lesen','.'],['Die Schüler'],['wollen','lesen']],
 ['Wir möchten ein Lied hören.',['Wir','möchten','ein','Lied','hören','.'],['Wir'],['möchten','hören']],
 ['Tom kann Fahrrad fahren.',['Tom','kann','Fahrrad','fahren','.'],['Tom'],['kann','fahren']],
 ['Sara will heute Grammatik üben.',['Sara','will','heute','Grammatik','üben','.'],['Sara'],['will','üben']],
 ['Omar möchte einen Brief schreiben.',['Omar','möchte','einen','Brief','schreiben','.'],['Omar'],['möchte','schreiben']],
 ['Ich kann einen Handstand machen.',['Ich','kann','einen','Handstand','machen','.'],['Ich'],['kann','machen']],
 ['Ihr wollt Freunde treffen.',['Ihr','wollt','Freunde','treffen','.'],['Ihr'],['wollt','treffen']],
 ['Nina möchte ein Buch lesen.',['Nina','möchte','ein','Buch','lesen','.'],['Nina'],['möchte','lesen']],
 ['Wir können gut jonglieren.',['Wir','können','gut','jonglieren','.'],['Wir'],['können','jonglieren']],
 ['Paul will pünktlich zur Schule gehen.',['Paul','will','pünktlich','zur','Schule','gehen','.'],['Paul'],['will','gehen']],
 ['Sie möchten im Schwimmbad schwimmen.',['Sie','möchten','im','Schwimmbad','schwimmen','.'],['Sie'],['möchten','schwimmen']]
];

const QUESTION_ROWS=[
 ['Kann ich gut singen?',['Kann','ich','gut','singen','?'],['ich'],['Kann','singen']],
 ['Willst du heute Tennis spielen?',['Willst','du','heute','Tennis','spielen','?'],['du'],['Willst','spielen']],
 ['Möchte Anna einen Tee trinken?',['Möchte','Anna','einen','Tee','trinken','?'],['Anna'],['Möchte','trinken']],
 ['Können wir gut Deutsch sprechen?',['Können','wir','gut','Deutsch','sprechen','?'],['wir'],['Können','sprechen']],
 ['Wollt ihr am Samstag Ski fahren?',['Wollt','ihr','am','Samstag','Ski','fahren','?'],['ihr'],['Wollt','fahren']],
 ['Möchten die Kinder ein Spiel spielen?',['Möchten','die Kinder','ein','Spiel','spielen','?'],['die Kinder'],['Möchten','spielen']],
 ['Kann Paul Klavier spielen?',['Kann','Paul','Klavier','spielen','?'],['Paul'],['Kann','spielen']],
 ['Willst du heute einen Kuchen backen?',['Willst','du','heute','einen','Kuchen','backen','?'],['du'],['Willst','backen']],
 ['Möchte Mia nach Hause gehen?',['Möchte','Mia','nach','Hause','gehen','?'],['Mia'],['Möchte','gehen']],
 ['Kannst du gut fotografieren?',['Kannst','du','gut','fotografieren','?'],['du'],['Kannst','fotografieren']],
 ['Wollen wir morgen früh losfahren?',['Wollen','wir','morgen','früh','losfahren','?'],['wir'],['Wollen','losfahren']],
 ['Möchtet ihr Französisch sprechen?',['Möchtet','ihr','Französisch','sprechen','?'],['ihr'],['Möchtet','sprechen']],
 ['Kann Lara gut reiten?',['Kann','Lara','gut','reiten','?'],['Lara'],['Kann','reiten']],
 ['Wollen die Schüler einen Text lesen?',['Wollen','die Schüler','einen','Text','lesen','?'],['die Schüler'],['Wollen','lesen']],
 ['Möchten wir ein Lied hören?',['Möchten','wir','ein','Lied','hören','?'],['wir'],['Möchten','hören']],
 ['Kann Tom Fahrrad fahren?',['Kann','Tom','Fahrrad','fahren','?'],['Tom'],['Kann','fahren']],
 ['Will Sara heute Grammatik üben?',['Will','Sara','heute','Grammatik','üben','?'],['Sara'],['Will','üben']],
 ['Möchte Omar einen Brief schreiben?',['Möchte','Omar','einen','Brief','schreiben','?'],['Omar'],['Möchte','schreiben']],
 ['Kann ich einen Handstand machen?',['Kann','ich','einen','Handstand','machen','?'],['ich'],['Kann','machen']],
 ['Wollt ihr Freunde treffen?',['Wollt','ihr','Freunde','treffen','?'],['ihr'],['Wollt','treffen']],
 ['Möchte Nina ein Buch lesen?',['Möchte','Nina','ein','Buch','lesen','?'],['Nina'],['Möchte','lesen']],
 ['Können wir gut jonglieren?',['Können','wir','gut','jonglieren','?'],['wir'],['Können','jonglieren']],
 ['Will Paul pünktlich zur Schule gehen?',['Will','Paul','pünktlich','zur','Schule','gehen','?'],['Paul'],['Will','gehen']],
 ['Möchten Sie im Schwimmbad schwimmen?',['Möchten','Sie','im','Schwimmbad','schwimmen','?'],['Sie'],['Möchten','schwimmen']]
];

function statementTask(){return{id:'aussagen-ordnen-markieren',icon:'🧩',kind:'order-mark',title:'Aussagesätze',description:'Ordne die Sätze richtig zu!',items:STRUCTURE_ROWS.map(([answer,tokens,subject,verbs])=>({answer,tokens,subject,verbs}))};}
function questionTask(){return{id:'fragen-ordnen-markieren',icon:'❓',kind:'order-mark',title:'Fragen',description:'Ordne die Fragen richtig zu!',items:QUESTION_ROWS.map(([answer,tokens,subject,verbs])=>({answer,tokens,subject,verbs}))};}

function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const firstIds=['karteikarten','bild-erklaerung-wort','artikel-plural','nomen-verben-verbinden'];
 const first=firstIds.map(id=>theme.tasks.find(task=>task?.id===id)).filter(Boolean);
 const exam=theme.tasks.find(task=>task?.exam||task?.id==='pruefung');
 const replaced=new Set(['koennen-wollen-formen','modalverb-waehlen','aussagen-ordnen','fragen-bilden','ja-nein-fragen','w-fragen','modal-konjugieren','modalformen-schreiben','modalverb-kontext','aussagen-ordnen-markieren','fragen-ordnen-markieren']);
 const later=theme.tasks.filter(task=>!first.includes(task)&&task!==exam&&!replaced.has(task?.id));
 const grammar=[tableTask(),formTask(),contextTask(),statementTask(),questionTask()];
 theme.tasks=[...first,...grammar,...later];
 if(exam){exam.exam=true;theme.tasks.push(exam)}
 theme.tasks.forEach((task,index)=>task.order=index+1);
 theme.grammarRevision='l7t1-grammar-flow-2026-08-13-v2';
 window.L7_THEME=theme;
 return theme;
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();