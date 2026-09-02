(function(){
'use strict';if(window.__SP_L8T1_EXAM_SAFEGUARD_20260902)return;window.__SP_L8T1_EXAM_SAFEGUARD_20260902=true;
function themeOf(all){return all?.[1]||all?.['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):null)}
function fallback(){return{id:'pruefung-berufe-sicher-v1',kind:'exam',exam:true,title:'Prüfung',icon:'⭐',emoji:'⭐',instruction:'Löse die 15 Aufgaben.',items:[
 {type:'choice',prompt:'Was ist die feminine Form von „der Chef“?',options:['die Chefinnen','die Chefin','der Chef'],answer:'die Chefin'},
 {type:'choice',prompt:'Was bedeutet „arbeitslos“?',options:['keinen Job haben','bei einer Firma angestellt sein','eine eigene Firma haben'],answer:'keinen Job haben'},
 {type:'choice',prompt:'Was bedeutet „selbstständig“?',options:['eine eigene Firma oder Praxis haben','keinen Beruf kennen','bei jeder Firma angestellt sein'],answer:'eine eigene Firma oder Praxis haben'},
 {type:'input',prompt:'Plural von „der Arzt“: ___',answer:['die Ärzte','Ärzte']},
 {type:'input',prompt:'___ Mechatronikerin',answer:['die']},
 {type:'order',prompt:'Bilde die Frage.',tokens:['Was','machst','du','beruflich?'],answer:['Was machst du beruflich?','Was machst du beruflich']},
 {type:'order',prompt:'Bilde die Frage.',tokens:['Was','sind','Sie','von','Beruf?'],answer:['Was sind Sie von Beruf?','Was sind Sie von Beruf']},
 {type:'input',prompt:'Ich ___ Koch.',answer:['arbeite als']},
 {type:'input',prompt:'Ich ___ einer Firma.',answer:['arbeite bei']},
 {type:'input',prompt:'Das ist meine ___ Firma.',answer:['eigene']},
 {type:'input',prompt:'Das ist ein ___ Thema.',answer:['eigenes']},
 {type:'input',prompt:'Ich habe einen ___ Job.',answer:['eigenen']},
 {type:'input',prompt:'Ich habe keinen Job. Ich bin ___.',answer:['arbeitslos']},
 {type:'input',prompt:'Ich habe eine eigene Praxis. Ich bin ___.',answer:['selbstständig']},
 {type:'order',prompt:'Bilde eine passende Antwort.',tokens:['Ich','arbeite','als','Journalistin.'],answer:['Ich arbeite als Journalistin.','Ich arbeite als Journalistin']}
]}}
const previous=window.L8_CONTENT_READY;window.L8_T1_EXAM_SAFEGUARD_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);if(!theme||!Array.isArray(theme.tasks))return themes;let exam=theme.tasks.find(t=>t?.exam);if(!exam){exam=fallback()}else{exam.exam=true;exam.title='Prüfung';exam.icon='⭐';exam.emoji='⭐';if((exam.items||[]).length>15)exam.items=exam.items.slice(0,15)}theme.tasks=[...theme.tasks.filter(t=>t!==exam&&!t?.exam),exam];if(Number(document.body?.dataset?.theme||0)===1)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T1 Prüfungsabsicherung',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T1_EXAM_SAFEGUARD_READY;
})();