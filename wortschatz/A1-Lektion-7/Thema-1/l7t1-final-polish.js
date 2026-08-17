(function(){
'use strict';
if(window.__SP_L7T1_FINAL_POLISH_4)return;
window.__SP_L7T1_FINAL_POLISH_4=true;

const LEVELS=Object.freeze({'gar nicht':'😭','nicht so gut':'🙁','gut':'🙂','sehr gut':'🤩'});

const ABILITY_ROWS=[
 ['Maria','gar nicht','backen','backen.webp','Maria kann gar nicht backen.'],
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
 {messages:[['Mia','Ich kann heute nicht zum Schwimmbad kommen. Ich bin krank.','left'],['Lena','Schade. Willst du morgen kommen?','right'],['Mia','Ja, morgen will ich kommen.','left']],trueFalsePrompt:'Mia will heute nicht kommen.',trueFalseAnswer:'Falsch',abcPrompt:'Mia sagt: „Ich kann heute nicht kommen.“ Was heißt das?',abcAnswer:'Heute geht es nicht.',abcOptions:['Heute geht es nicht.','Mia will heute zu Hause bleiben.','Mia sagt einen Wunsch höflich.']},
 {messages:[['Ali','Ich will heute Abend Gitarre üben.','left'],['Sara','Kannst du schon gut spielen?','right'],['Ali','Noch nicht so gut.','left']],trueFalsePrompt:'Ali hat heute Abend einen Plan.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Ich will heute Abend üben“?',abcAnswer:'Das ist Alis Plan.',abcOptions:['Das ist Alis Plan.','Ali kann sehr gut spielen.','Ali fragt höflich.']},
 {messages:[['Anna','Ich möchte morgen einen Deutschkurs besuchen. Wann beginnt der Kurs?','left'],['Sprachschule','Der Kurs beginnt um 9 Uhr.','right']],trueFalsePrompt:'Anna hat einen Wunsch.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Ich möchte einen Deutschkurs besuchen“?',abcAnswer:'Anna sagt ihren Wunsch höflich.',abcOptions:['Anna sagt ihren Wunsch höflich.','Anna kann sehr gut Deutsch.','Anna hat einen festen Termin.']},
 {messages:[['Tom','Kannst du mir bei Mathematik helfen?','left'],['Nina','Ja. Ich kann gut Mathematik.','right']],trueFalsePrompt:'Nina kann Tom helfen.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Ich kann gut Mathematik“?',abcAnswer:'Nina kann das gut.',abcOptions:['Nina kann das gut.','Nina plant Mathematik für heute.','Nina bestellt höflich.']},
 {messages:[['Lara','Wir können uns morgen um 16 Uhr treffen.','left'],['Ben','Gut. Ich will danach zum Schwimmbad gehen.','right']],trueFalsePrompt:'Lara kann morgen um 16 Uhr kommen.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Wir können uns morgen treffen“?',abcAnswer:'Der Termin passt.',abcOptions:['Der Termin passt.','Sie wollen es unbedingt.','Sie bestellen höflich.']},
 {messages:[['Omar','Möchtest du einen Tee?','left'],['Eva','Ja, gern. Ich möchte einen Tee.','right']],trueFalsePrompt:'Eva möchte Tee.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Ich möchte einen Tee“?',abcAnswer:'Eva sagt ihren Wunsch höflich.',abcOptions:['Eva sagt ihren Wunsch höflich.','Eva kann Tee trinken.','Eva hat einen Plan für morgen.']},
 {messages:[['Paul','Ich will auf keinen Fall Ski fahren.','left'],['Mara','Okay. Möchtest du spazieren gehen?','right']],trueFalsePrompt:'Paul kann nicht Ski fahren.',trueFalseAnswer:'Falsch',abcPrompt:'Was heißt „Ich will auf keinen Fall Ski fahren“?',abcAnswer:'Paul will das nicht.',abcOptions:['Paul will das nicht.','Paul kann das nicht.','Paul bestellt höflich.']},
 {messages:[['Lea','Kann dein Bruder jonglieren?','left'],['Max','Ja, sehr gut.','right']],trueFalsePrompt:'Lea fragt: Kann der Bruder jonglieren?',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Er kann jonglieren“?',abcAnswer:'Er hat es gelernt.',abcOptions:['Er hat es gelernt.','Er plant es für heute.','Er sagt einen Wunsch.']},
 {messages:[['Sofia','Ich möchte am Samstag ins Kino.','left'],['Mila','Ich will auch. Kaufen wir Karten?','right']],trueFalsePrompt:'Sofia hat einen Wunsch.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Ich möchte ins Kino“?',abcAnswer:'Sofia hat einen Wunsch.',abcOptions:['Sofia hat einen Wunsch.','Sofia hat einen festen Plan.','Sofia sagt: Ich kann das.']},
 {messages:[['Jonas','Ich kann morgen nicht pünktlich sein. Der Bus kommt spät.','left'],['Lehrer','Okay. Danke für die Information.','right']],trueFalsePrompt:'Jonas will zu spät kommen.',trueFalseAnswer:'Falsch',abcPrompt:'Was heißt „Ich kann morgen nicht pünktlich sein“?',abcAnswer:'Der Bus ist spät. Es geht nicht.',abcOptions:['Der Bus ist spät. Es geht nicht.','Jonas will zu spät kommen.','Jonas möchte zu spät kommen.']},
 {messages:[['Nina','Wollt ihr am Samstag Tennis spielen?','left'],['Omar','Ja. Wir wollen um 15 Uhr spielen.','right']],trueFalsePrompt:'Omar hat einen Plan für 15 Uhr.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Wir wollen um 15 Uhr spielen“?',abcAnswer:'Das ist ihr Plan.',abcOptions:['Das ist ihr Plan.','Sie können sehr gut Tennis.','Sie fragen höflich.']},
 {messages:[['Kellner','Möchten Sie etwas essen?','left'],['Maria','Ja, ich möchte einen Kuchen.','right']],trueFalsePrompt:'Maria hat einen Wunsch.',trueFalseAnswer:'Richtig',abcPrompt:'Was heißt „Ich möchte einen Kuchen“?',abcAnswer:'Maria sagt ihren Wunsch höflich.',abcOptions:['Maria sagt ihren Wunsch höflich.','Maria kann Kuchen backen.','Maria plant das für morgen.']}
];

const EXAM_ROWS=[
 {examType:'Wortbedeutung',prompt:'Was bedeutet „pünktlich“?',answer:'zur richtigen Zeit',options:['zur richtigen Zeit','sehr spät','sehr teuer','gar nicht']},
 {examType:'Artikel',prompt:'Welcher Artikel ist richtig: ___ Buch?',answer:'das',options:['der','die','das','kein Artikel']},
 {examType:'Plural',prompt:'Wie heißt der Plural von „der Text“?',answer:'die Texte',options:['die Texte','die Texten','der Texte','die Text']},
 {examType:'Nomen und Verb',prompt:'Welche Verbindung ist richtig?',answer:'Spiele spielen',options:['Spiele spielen','Spiele machen','Spiele fahren','Spiele lesen']},
 {examType:'Nomen und Verb',prompt:'Welche Verbindung ist richtig?',answer:'Ski fahren',options:['Ski fahren','Ski spielen','Ski lesen','Ski hören']},
 {examType:'Verbform',prompt:'Du ___ gut singen.',answer:'kannst',options:['kannst','kann','könnt','können']},
 {examType:'Verbform',prompt:'Wir ___ heute Tennis spielen. Das ist unser Plan.',answer:'wollen',options:['wollen','können','möchten','wollt']},
 {examType:'Höflicher Wunsch',prompt:'Ich ___ einen Tee, bitte.',answer:'möchte',options:['möchte','will','kann','möchtest']},
 {examType:'Bedeutung von können',prompt:'Mia sagt: „Ich kann heute nicht kommen.“ Was heißt das?',answer:'Heute geht es nicht.',options:['Heute geht es nicht.','Mia will nicht kommen.','Mia sagt einen Wunsch höflich.','Mia kann sehr gut kommen.']},
 {examType:'Bedeutung von wollen',prompt:'Paul sagt: „Ich will heute Gitarre üben.“ Was heißt das?',answer:'Das ist Pauls Plan.',options:['Das ist Pauls Plan.','Paul kann sehr gut spielen.','Paul bestellt höflich.','Paul ist krank.']},
 {examType:'Wie gut?',prompt:'Welches Emoji bedeutet „gar nicht“?',answer:'😭',options:['😭','🙁','🙂','🤩']},
 {examType:'Satzstellung',prompt:'Welcher Satz ist richtig?',answer:'Maria kann gut backen.',options:['Maria kann gut backen.','Maria gut kann backen.','Maria kann backen gut.','Kann Maria gut backen.']},
 {examType:'Frage',prompt:'Welche Frage ist richtig?',answer:'Kann Maria gut backen?',options:['Kann Maria gut backen?','Maria kann gut backen?','Kann gut Maria backen?','Maria gut kann backen?']},
 {examType:'Redemittel',prompt:'Was bedeutet „auf keinen Fall“?',answer:'ganz sicher nicht',options:['ganz sicher nicht','vielleicht','ein bisschen','sehr gut']},
 {examType:'Bedeutung von möchten',prompt:'Maria sagt: „Ich möchte einen Kuchen.“ Was heißt das?',answer:'Maria sagt ihren Wunsch höflich.',options:['Maria sagt ihren Wunsch höflich.','Maria kann Kuchen backen.','Maria hat einen festen Plan.','Maria will auf keinen Fall Kuchen.']}
];

function abilityTask(){return{id:'faehigkeit-saetze-schreiben',icon:'✍️',kind:'ability-write',title:'Sätze mit können',description:'Schreibe die Sätze mit „können“.',items:ABILITY_ROWS.map(([subject,level,activity,image,answer])=>({subject,level,emoji:LEVELS[level],activity,image,answer,answers:[answer,answer.replace(/[.!?]+$/,'')],noHelp:true,noAudio:true}))};}
function smsTask(){return{id:'sms-modalverben',icon:'💬',kind:'sms-modal-combo',title:'SMS-Gespräche: können, wollen, möchten',description:'Lies die SMS und beantworte die Fragen.',items:SMS_ROWS.map(row=>({...row,trueFalseOptions:['Richtig','Falsch'],noHelp:true,noAudio:true}))};}
function standardExam(existing){
 const exam=existing||{id:'pruefung'};
 exam.exam=true;exam.icon='⭐';exam.title='Prüfung';exam.description='15 gemischte Fragen aus Lektion 7 · Thema 1.';
 exam.kind='choice';exam.items=EXAM_ROWS.map(row=>({kind:'choice',prompt:row.prompt,answer:row.answer,options:row.options,examType:row.examType,noHelp:true,noAudio:true}));
 return exam;
}
function cleanVariant(value){return String(value||'').trim().replace(/^Variante\s+\d+\s*(?:[·|—-]\s*)?/i,'').replace(/\s*(?:[·|—-]\s*)Variante\s+\d+\s*$/i,'').trim();}
function stripVariantNotes(task){(task?.items||[]).forEach(item=>{if(!item||typeof item!=='object')return;if(typeof item.context==='string'){const cleaned=cleanVariant(item.context);if(cleaned)item.context=cleaned;else delete item.context}if(typeof item.label==='string'&&/^Variante\s+\d+$/i.test(item.label.trim()))delete item.label;if(typeof item.note==='string'&&/^Variante\s+\d+$/i.test(item.note.trim()))delete item.note;});}

function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let tasks=[...theme.tasks];
 const oldExam=tasks.find(task=>task?.exam||task?.id==='pruefung'||task?.id==='exam');
 const learning=tasks.filter(task=>task!==oldExam);
 const oldTask11=learning[10]||null;
 if(oldTask11)tasks=tasks.filter(task=>task!==oldTask11);

 tasks=tasks.filter(task=>task?.id!=='faehigkeit-saetze-schreiben'&&task?.id!=='sms-modalverben'&&task!==oldExam);
 const questionIndex=tasks.findIndex(task=>task?.id==='fragen-ordnen-markieren');
 const ability=abilityTask();
 if(questionIndex>=0)tasks.splice(questionIndex+1,0,ability);else tasks.splice(Math.min(9,tasks.length),0,ability);
 tasks.forEach(stripVariantNotes);
 tasks.push(smsTask());
 tasks.push(standardExam(oldExam));
 tasks.forEach((task,index)=>{task.order=index+1});
 theme.tasks=tasks;
 theme.abilityEmojis={...LEVELS};
 theme.finalPolishRevision='l7t1-final-polish-2026-08-17-v4';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();