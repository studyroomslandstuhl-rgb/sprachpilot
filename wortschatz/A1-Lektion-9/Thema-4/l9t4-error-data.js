(function(){
'use strict';
const D=window.L9T4;if(!D)return;
D.errorCorrections=[
 {id:'err01',parts:['Ich','brauche','eine','Auskunfft.'],wrongIndex:3,answer:'Auskunft',hint:'Nomen: die Auskunft.',correct:'Ich brauche eine Auskunft.'},
 {id:'err02',parts:['Die','Mitarbeiterin','helfen','mir.'],wrongIndex:2,answer:'hilft',hint:'Subjekt: die Mitarbeiterin.',correct:'Die Mitarbeiterin hilft mir.'},
 {id:'err03',parts:['Was','bedeuten','das?'],wrongIndex:1,answer:'bedeutet',hint:'Subjekt: das.',correct:'Was bedeutet das?'},
 {id:'err04',parts:['Ich','verstehen','das','Formular','nicht.'],wrongIndex:1,answer:'verstehe',hint:'Subjekt: ich.',correct:'Ich verstehe das Formular nicht.'},
 {id:'err05',parts:['Können','Sie','das','bitte','wiederholst?'],wrongIndex:4,answer:'wiederholen',hint:'Nach können steht der Infinitiv.',correct:'Können Sie das bitte wiederholen?'},
 {id:'err06',parts:['Ich','habe','meinen','Reisepas','dabei.'],wrongIndex:3,answer:'Reisepass',hint:'Achte auf die Schreibweise des Nomens.',correct:'Ich habe meinen Reisepass dabei.'},
 {id:'err07',parts:['Das','Behörde','ist','heute','offen.'],wrongIndex:0,answer:'Die',hint:'Behörde ist feminin.',correct:'Die Behörde ist heute offen.'},
 {id:'err08',parts:['Ich','brauche','einen','Versicherung.'],wrongIndex:2,answer:'eine',hint:'Versicherung ist feminin.',correct:'Ich brauche eine Versicherung.'},
 {id:'err09',parts:['Der','Dokument','ist','wichtig.'],wrongIndex:0,answer:'Das',hint:'Dokument ist neutral.',correct:'Das Dokument ist wichtig.'},
 {id:'err10',parts:['Die','Einkommensnachweis','liegt','hier.'],wrongIndex:0,answer:'Der',hint:'Einkommensnachweis ist maskulin.',correct:'Der Einkommensnachweis liegt hier.'},
 {id:'err11',parts:['Ich','mache','im','Juli','zwei','Reise.'],wrongIndex:5,answer:'Reisen',hint:'Nach zwei brauchst du den Plural.',correct:'Ich mache im Juli zwei Reisen.'},
 {id:'err12',parts:['Die','Botschaf','ist','in','Berlin.'],wrongIndex:1,answer:'Botschaft',hint:'Achte auf die Schreibweise.',correct:'Die Botschaft ist in Berlin.'},
 {id:'err13',parts:['Mein','Familienstant','ist','ledig.'],wrongIndex:1,answer:'Familienstand',hint:'Achte auf den letzten Buchstaben.',correct:'Mein Familienstand ist ledig.'},
 {id:'err14',parts:['Die','Beamtin','hat','mir','helft.'],wrongIndex:4,answer:'geholfen',hint:'Perfekt von helfen: hat ...',correct:'Die Beamtin hat mir geholfen.'},
 {id:'err15',parts:['Ich','bin','im','Sommer','nach','Polen','gereisen.'],wrongIndex:6,answer:'gereist',hint:'Perfekt von reisen: ist ...',correct:'Ich bin im Sommer nach Polen gereist.'},
 {id:'err16',parts:['Die','Prüfung','ist','mündliche.'],wrongIndex:3,answer:'mündlich',hint:'Nach ist steht hier die Grundform des Adjektivs.',correct:'Die Prüfung ist mündlich.'},
 {id:'err17',parts:['Bitte','geben','Sie','die','Antwort','schriftlicher.'],wrongIndex:5,answer:'schriftlich',hint:'Hier brauchst du die Grundform.',correct:'Bitte geben Sie die Antwort schriftlich.'},
 {id:'err18',parts:['Mein','Einkomen','ist','2.500','Euro.'],wrongIndex:1,answer:'Einkommen',hint:'Achte auf die Schreibweise.',correct:'Mein Einkommen ist 2.500 Euro.'},
 {id:'err19',parts:['Ich','habe','meine','Frau','in','Deutschland','kennengelernen.'],wrongIndex:6,answer:'kennengelernt',hint:'Perfekt von kennenlernen: hat ...',correct:'Ich habe meine Frau in Deutschland kennengelernt.'},
 {id:'err20',parts:['Die','Verpflichtungserklährung','fehlt','noch.'],wrongIndex:1,answer:'Verpflichtungserklärung',hint:'Achte genau auf die Schreibweise.',correct:'Die Verpflichtungserklärung fehlt noch.'}
];
const newTask={id:'fehler-korrigieren',kind:'error-correction',title:'Fehler korrigieren',description:'Markiere den Fehler und schreibe die richtige Form.',icon:'🔎'};
const tasks=(D.tasks||[]).filter(x=>x.id!==newTask.id);
const pos=tasks.findIndex(x=>x.id==='unterlagen-hoeren');
if(pos>=0)tasks.splice(pos,0,newTask);else{const exam=tasks.findIndex(x=>x.exam);if(exam>=0)tasks.splice(exam,0,newTask);else tasks.push(newTask)}
D.tasks=tasks;
if(window.L9_THEMES?.[4])window.L9_THEMES[4].tasks=D.tasks;
})();