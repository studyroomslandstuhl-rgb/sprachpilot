(function(){
'use strict';
if(window.__SP_L7T1_TASK13_QUESTIONS_2)return;
window.__SP_L7T1_TASK13_QUESTIONS_2=true;

const ROWS=[
 ['Kannst du gut singen?','Ja, ich kann gut singen.',['Ja, ich kann gut singen.','Ja, ich will gut singen.','Nein, ich möchte einen Tee.','Ich will heute Tennis spielen.'],'Achte auf „kannst du“: Die Antwort beginnt mit „Ja, ich kann …“.'],
 ['Kann Paul Klavier spielen?','Ja, er kann Klavier spielen.',['Ja, er kann Klavier spielen.','Ja, er will Klavier spielen.','Nein, wir können Klavier spielen.','Er möchte heute Ski fahren.'],'Die Frage fragt nach einer Fähigkeit von Paul.'],
 ['Könnt ihr Tennis spielen?','Ja, wir können Tennis spielen.',['Ja, wir können Tennis spielen.','Ja, ihr könnt Tennis spielen.','Wir wollen einen Kuchen backen.','Nein, ich kann Tennis spielen.'],'Auf „ihr“ antwortet die Gruppe mit „wir“.'],
 ['Kann Mia heute kommen?','Nein, sie kann heute nicht kommen.',['Nein, sie kann heute nicht kommen.','Nein, sie will heute nicht kommen.','Ja, ich kann heute kommen.','Sie möchte heute Tennis spielen.'],'Die Frage fragt, ob es für Mia möglich ist.'],
 ['Willst du heute einen Kuchen backen?','Ja, ich will heute einen Kuchen backen.',['Ja, ich will heute einen Kuchen backen.','Ja, ich kann heute einen Kuchen backen.','Ich möchte Klavier spielen.','Nein, sie will einen Kuchen backen.'],'„Willst du …?“ fragt nach einem Plan oder Wunsch.'],
 ['Wollt ihr am Samstag Ski fahren?','Ja, wir wollen am Samstag Ski fahren.',['Ja, wir wollen am Samstag Ski fahren.','Ja, ihr wollt am Samstag Ski fahren.','Wir können sehr gut singen.','Nein, ich möchte Ski fahren.'],'Auf „ihr“ antwortet die Gruppe mit „wir wollen“.'],
 ['Will Anna heute Gitarre üben?','Nein, sie will heute nicht Gitarre üben.',['Nein, sie will heute nicht Gitarre üben.','Nein, sie kann heute nicht Gitarre üben.','Ja, ich will Gitarre üben.','Sie möchte einen Tee.'],'Die Frage fragt nach Annas Plan.'],
 ['Möchtest du einen Tee?','Ja, gern. Ich möchte einen Tee.',['Ja, gern. Ich möchte einen Tee.','Ja, ich kann einen Tee.','Nein, ich will Tennis spielen.','Ich kann sehr gut fotografieren.'],'„möchtest“ wird für einen höflichen Wunsch benutzt.'],
 ['Möchte Nina ins Schwimmbad gehen?','Ja, sie möchte ins Schwimmbad gehen.',['Ja, sie möchte ins Schwimmbad gehen.','Ja, sie kann ins Schwimmbad gehen.','Wir wollen ins Schwimmbad gehen.','Nein, ich möchte reiten.'],'Die Antwort muss zu Nina und zu „möchte“ passen.'],
 ['Möchtet ihr ein Lied hören?','Ja, wir möchten ein Lied hören.',['Ja, wir möchten ein Lied hören.','Ja, ihr möchtet ein Lied hören.','Wir können ein Lied schreiben.','Ich will einen Text lesen.'],'Auf „ihr“ antwortet die Gruppe mit „wir möchten“.'],
 ['Wie gut kannst du Fahrrad fahren?','Ich kann sehr gut Fahrrad fahren.',['Ich kann sehr gut Fahrrad fahren.','Ich will Fahrrad fahren.','Ich möchte ein Fahrrad.','Wir können nicht Tennis spielen.'],'„Wie gut?“ braucht eine Abstufung wie „sehr gut“.'],
 ['Was willst du heute machen?','Ich will heute Freunde treffen.',['Ich will heute Freunde treffen.','Ich kann gut Freunde treffen.','Ich möchte heute pünktlich sein.','Wir können einen Tee trinken.'],'Die Frage mit „willst“ fragt nach einem Plan.'],
 ['Was möchtest du essen?','Ich möchte einen Kuchen.',['Ich möchte einen Kuchen.','Ich kann einen Kuchen.','Ich will Klavier spielen.','Ich kann sehr gut lesen.'],'Die Frage fragt höflich nach einem Essenswunsch.'],
 ['Kannst du morgen pünktlich sein?','Ja, ich kann morgen pünktlich sein.',['Ja, ich kann morgen pünktlich sein.','Ja, ich will morgen pünktlich sein.','Ich möchte heute Ski fahren.','Nein, wir wollen einen Tee.'],'Die Frage fragt, ob es möglich ist.'],
 ['Wollt ihr morgen früh losfahren?','Nein, wir wollen erst am Nachmittag losfahren.',['Nein, wir wollen erst am Nachmittag losfahren.','Nein, wir können nicht losfahren.','Ja, ihr wollt morgen früh losfahren.','Ich möchte morgen früh singen.'],'Die Antwort muss zu „ihr“ und zum Plan mit „wollen“ passen.']
];

function buildItems(){
 const seen=new Set();
 return ROWS.map(([prompt,answer,options,hint],index)=>({
  id:`frage-antwort-${index+1}`,
  kind:'choice',
  prompt,
  answer,
  options:[...options],
  hint,
  noAudio:true
 })).filter(item=>{
  const key=String(item.prompt||'').trim().toLowerCase();
  if(!key||seen.has(key))return false;
  seen.add(key);
  return true;
 });
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(item=>item?.id==='fragen-antworten');
 if(!task)return theme;
 const items=buildItems();
 if(items.length!==15)throw new Error(`L7T1 Aufgabe 13: erwartet 15 eindeutige Fragen, erhalten ${items.length}.`);
 task.kind='choice';
 task.title='Fragen und Antworten';
 task.description='Lies die Frage und wähle die passende Antwort.';
 task.items=items;
 task.task13Revision='l7t1-task13-unique-questions-2026-08-17-v2';
 theme.task13Revision=task.task13Revision;
 window.L7T1Task13Audit={count:items.length,uniquePrompts:new Set(items.map(item=>item.prompt)).size===15,prompts:items.map(item=>item.prompt)};
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
