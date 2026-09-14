(function(){
'use strict';
if(window.__SP_L10T2_PHARMACY_DIALOGUES_V1)return;
window.__SP_L10T2_PHARMACY_DIALOGUES_V1=true;
const D=window.L10T2;if(!D)return;
const task={id:'apotheke-dialoge-hoeren',title:'Apotheke – Dialoge hören',icon:'⚕️',cardText:'Höre 5 Dialoge. Markiere Problem und Tipp.',text:'Höre den Dialog. Markiere das Problem und den passenden Tipp.'};
if(Array.isArray(D.tasks)&&!D.tasks.some(t=>t.id===task.id)){
 const exam=D.tasks.find(t=>t.exam)||null;
 D.tasks=D.tasks.filter(t=>!t.exam);
 D.tasks.push(task);
 if(exam)D.tasks.push(exam);
}
D.pharmacyDialogues=[
 {id:'apo1',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-1.mp3',lines:[
  ['Apothekerin','Guten Tag. Was kann ich für Sie tun?'],['Frau Berger','Ich habe starke Kopfschmerzen und mein Hals tut weh.'],['Apothekerin','Haben Sie Fieber?'],['Frau Berger','Nein, kein Fieber.'],['Apothekerin','Dann nehmen Sie eine Schmerztablette und trinken Sie viel Tee oder Wasser. Wenn es schlimmer wird, gehen Sie bitte zum Arzt.']
 ],questions:[
  {q:'Was ist das Problem von Frau Berger?',a:'Kopfschmerzen und Halsschmerzen',options:['Kopfschmerzen und Halsschmerzen','Bauchschmerzen','Rückenschmerzen','Sonnenbrand']},
  {q:'Was soll Frau Berger machen?',a:'Eine Schmerztablette nehmen und viel trinken',options:['Eine Schmerztablette nehmen und viel trinken','Sport machen','Zur Arbeit gehen','Heiß duschen']}
 ]},
 {id:'apo2',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-2.mp3',lines:[
  ['Apotheker','Guten Tag, Herr Yilmaz. Was fehlt Ihnen?'],['Herr Yilmaz','Ich habe Husten und Schnupfen. Meine Nase ist zu und ich kann schlecht schlafen.'],['Apotheker','Haben Sie Fieber?'],['Herr Yilmaz','Nein.'],['Apotheker','Trinken Sie viel, ruhen Sie sich aus und nehmen Sie diese Tabletten nur nach der Packungsangabe.']
 ],questions:[
  {q:'Was ist das Problem von Herrn Yilmaz?',a:'Husten und Schnupfen',options:['Husten und Schnupfen','Zahnschmerzen','Knieschmerzen','Sonnenbrand']},
  {q:'Was soll Herr Yilmaz machen?',a:'Viel trinken und sich ausruhen',options:['Viel trinken und sich ausruhen','Lange arbeiten','Fußball spielen','Wenig schlafen']}
 ]},
 {id:'apo3',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-3.mp3',lines:[
  ['Apothekerin','Guten Tag. Wie kann ich Ihnen helfen?'],['Frau Novak','Mein Rücken tut weh. Ich habe gestern bei der Arbeit schwere Kisten getragen.'],['Apothekerin','Ist der Schmerz sehr stark?'],['Frau Novak','Nein, aber unangenehm.'],['Apothekerin','Sie können eine Salbe verwenden. Bewegen Sie sich vorsichtig und tragen Sie heute nichts Schweres.']
 ],questions:[
  {q:'Was tut Frau Novak weh?',a:'Der Rücken',options:['Der Rücken','Der Hals','Der Bauch','Die Zähne']},
  {q:'Was soll Frau Novak machen?',a:'Eine Salbe verwenden und nichts Schweres tragen',options:['Eine Salbe verwenden und nichts Schweres tragen','Schwere Kisten tragen','Den ganzen Tag rennen','Zur Notaufnahme fahren']}
 ]},
 {id:'apo4',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-4.mp3',lines:[
  ['Apotheker','Guten Tag, Herr Sato. Was ist passiert?'],['Herr Sato','Ich war gestern lange in der Sonne. Jetzt ist meine Haut rot und tut weh.'],['Apotheker','Das ist ein Sonnenbrand. Kühlen Sie die Haut und verwenden Sie diese Salbe.'],['Herr Sato','Wie oft?'],['Apotheker','Zweimal am Tag. Und heute bitte nicht mehr in die Sonne.']
 ],questions:[
  {q:'Was ist das Problem von Herrn Sato?',a:'Sonnenbrand',options:['Sonnenbrand','Schnupfen','Kopfschmerzen','Husten']},
  {q:'Was soll Herr Sato machen?',a:'Die Haut kühlen und eine Salbe verwenden',options:['Die Haut kühlen und eine Salbe verwenden','Heiß duschen','In die Sonne gehen','Sport machen']}
 ]},
 {id:'apo5',audio:'https://sprachpilot.b-cdn.net/audio/l10t2-apotheke-dialog-5.mp3',lines:[
  ['Apothekerin','Guten Abend. Was haben Sie?'],['Frau Klein','Ich habe seit gestern starken Husten und jetzt 39 Grad Fieber.'],['Apothekerin','39 Grad ist viel. Haben Sie auch Schmerzen?'],['Frau Klein','Ja, mein ganzer Körper tut weh.'],['Apothekerin','Bitte gehen Sie heute noch zum Arzt. Bei so hohem Fieber reicht eine Beratung in der Apotheke nicht.']
 ],questions:[
  {q:'Was ist das Problem von Frau Klein?',a:'Starker Husten und hohes Fieber',options:['Starker Husten und hohes Fieber','Nur Schnupfen','Rückenschmerzen','Sonnenbrand']},
  {q:'Was soll Frau Klein machen?',a:'Zum Arzt gehen',options:['Zum Arzt gehen','Zur Arbeit gehen','Sport machen','Nur Kaffee trinken']}
 ]}
];
const pharmacyExam=[
 {section:'Apotheke',type:'choice',q:'Frau Klein hat 39 Grad Fieber und starken Husten. Was soll sie machen?',a:'zum Arzt gehen',options:['zum Arzt gehen','Sport machen','arbeiten gehen','nichts trinken']},
 {section:'Apotheke',type:'choice',q:'Herr Sato hat Sonnenbrand. Was passt?',a:'die Haut kühlen',options:['die Haut kühlen','schwere Kisten tragen','laut sprechen','Kaffee trinken']}
];
if(Array.isArray(D.examItems)&&D.examItems.length){D.examItems=[...D.examItems.slice(0,Math.max(0,20-pharmacyExam.length)),...pharmacyExam].slice(0,20)}
})();
