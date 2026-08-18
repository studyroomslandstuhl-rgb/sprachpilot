(function(){
'use strict';
if(window.__SP_L7T3_EXAM_MIXED_V1)return;window.__SP_L7T3_EXAM_MIXED_V1=true;
const Q=[
 {kind:'choice',sourceTask:'karteikarten',prompt:'gehen',answer:'ist gegangen',options:['ist gegangen','hat gegangen','ist gegeht'],hint:'Achte auf Hilfsverb und Partizip II.'},
 {kind:'choice',sourceTask:'partizip-finden',prompt:'bleiben – Welches Partizip II ist richtig?',answer:'geblieben',options:['geblieben','gebleibt','gebleiben'],hint:'Achte auf die unregelmäßige Form.'},
 {kind:'choice',sourceTask:'memory',prompt:'Welches Partizip II gehört zu „schwimmen“?',answer:'geschwommen',options:['geschwommen','geschwimmt','geschwimmen'],hint:'Finde das passende Paar.'},
 {kind:'input',sourceTask:'partizip-bauen',prompt:'Baue das Partizip II: spazieren gehen',answer:'spazieren gegangen',answers:['spazieren gegangen'],hint:'Der erste Teil bleibt unverändert.'},
 {kind:'choice',sourceTask:'endungen',prompt:'gefahren – endet das Partizip II auf -t oder -en?',answer:'-en',options:['-t','-en'],hint:'Sieh dir die Endung an.'},
 {kind:'choice',sourceTask:'endungen',prompt:'getanzt – endet das Partizip II auf -t oder -en?',answer:'-t',options:['-t','-en'],hint:'Sieh dir die Endung an.'},
 {kind:'input',sourceTask:'partizip-schreiben',prompt:'Schreibe die Perfektform: bleiben',answer:'ist geblieben',answers:['ist geblieben'],hint:'Dieses Verb bildet das Perfekt mit sein.'},
 {kind:'input',sourceTask:'partizip-schreiben',prompt:'Schreibe die Perfektform: backen',answer:'hat gebacken',answers:['hat gebacken'],hint:'Dieses Verb bildet das Perfekt mit haben.'},
 {kind:'input',sourceTask:'hoeren',audio:'spazieren_gehen.mp3',prompt:'Höre den Infinitiv und schreibe Partizip II.',answer:'spazieren gegangen',answers:['spazieren gegangen'],hint:'Achte auf beide Teile des Verbs.'},
 {kind:'input',sourceTask:'hoeren',audio:'schwimmen.mp3',prompt:'Höre den Infinitiv und schreibe Partizip II.',answer:'geschwommen',answers:['geschwommen'],hint:'Achte auf die unregelmäßige Form.'},
 {kind:'input',sourceTask:'sein',prompt:'ich → sein',answer:'bin',answers:['bin'],hint:'Konjugiere sein.'},
 {kind:'input',sourceTask:'sein',prompt:'ihr → sein',answer:'seid',answers:['seid'],hint:'Konjugiere sein.'},
 {kind:'choice',sourceTask:'grammatik',context:'Anna ist nach Berlin gefahren.',prompt:'Was ist das Hilfsverb?',answer:'ist',options:['Anna','ist','Berlin','gefahren'],hint:'Das Hilfsverb ist konjugiert.'},
 {kind:'choice',sourceTask:'grammatik',context:'Paul hat einen Kuchen gebacken.',prompt:'Was ist das Partizip II?',answer:'gebacken',options:['Paul','hat','Kuchen','gebacken'],hint:'Das Partizip II steht hier am Satzende.'},
 {kind:'order',sourceTask:'saetze',prompt:'Ordne den Satz.',answer:'Ich bin gestern nach Hause gegangen',answers:['Ich bin gestern nach Hause gegangen.'],tokens:['Ich','bin','gestern','nach','Hause','gegangen'],hint:'Das Hilfsverb steht auf Position 2.'},
 {kind:'order',sourceTask:'saetze',prompt:'Ordne den Satz.',answer:'Wir haben am Samstag lange getanzt',answers:['Wir haben am Samstag lange getanzt.'],tokens:['Wir','haben','am','Samstag','lange','getanzt'],hint:'Das Hilfsverb steht auf Position 2.'},
 {kind:'input',sourceTask:'saetze-schreiben',prompt:'Schreibe im Perfekt: Mia – am Abend – spazieren gehen',answer:'Mia ist am Abend spazieren gegangen.',answers:['Mia ist am Abend spazieren gegangen.'],hint:'Achte auf sein und das Partizip II.'},
 {kind:'input',sourceTask:'saetze-schreiben',prompt:'Schreibe im Perfekt: Paul – am Morgen – Brot – backen',answer:'Paul hat am Morgen Brot gebacken.',answers:['Paul hat am Morgen Brot gebacken.'],hint:'Achte auf haben und das Partizip II.'},
 {kind:'choice',sourceTask:'haben-sein',prompt:'geflogen – welches Hilfsverb?',answer:'sein',options:['haben','sein'],hint:'Achte auf Bewegung und Ortswechsel.'},
 {kind:'choice',sourceTask:'haben-sein',prompt:'gebacken – welches Hilfsverb?',answer:'haben',options:['haben','sein'],hint:'Dieses Verb bildet das Perfekt mit haben.'},
 {kind:'input',sourceTask:'text-umschreiben',context:'Lea fährt mit dem Zug nach Köln.',prompt:'Schreibe den Satz im Perfekt.',answer:'Lea ist mit dem Zug nach Köln gefahren.',answers:['Lea ist mit dem Zug nach Köln gefahren.'],hint:'Hilfsverb auf Position 2, Partizip II am Ende.'},
 {kind:'input',sourceTask:'text-umschreiben',context:'Sara backt am Abend einen Kuchen.',prompt:'Schreibe den Satz im Perfekt.',answer:'Sara hat am Abend einen Kuchen gebacken.',answers:['Sara hat am Abend einen Kuchen gebacken.'],hint:'Hilfsverb auf Position 2, Partizip II am Ende.'},
 {kind:'choice',sourceTask:'fehler-korrigieren',context:'Du ist spät gekommen.',prompt:'Welches Wort ist falsch?',answer:'ist',options:['Du','ist','spät','gekommen'],hint:'Prüfe die Konjugation von sein.'},
 {kind:'input',sourceTask:'fehler-korrigieren',context:'Du ist spät gekommen.',prompt:'Schreibe die richtige Form für „ist“.',answer:'bist',answers:['bist'],hint:'Konjugiere sein mit du.'},
 {kind:'input',sourceTask:'fehler-korrigieren',context:'Paul hat ein Kuchen gebacken.',prompt:'Schreibe den richtigen Artikel statt „ein“.',answer:'einen',answers:['einen'],hint:'Kuchen ist maskulin und hier Akkusativ.'},
 {kind:'choice',sourceTask:'lesen',context:'Nina ist am Samstag früh nach Hamburg gefahren. Am Nachmittag ist sie im Schwimmbad geschwommen. Am Abend hat sie mit Freunden getanzt.',prompt:'Was hat Nina am Nachmittag gemacht?',answer:'Sie ist geschwommen.',options:['Sie ist geschwommen.','Sie hat Brot gebacken.','Sie ist geflogen.'],hint:'Lies den mittleren Satz genau.'},
 {kind:'choice',sourceTask:'lesen',context:'Omar ist am Sonntag mit seiner Familie in den Wald gefahren. Sie sind drei Stunden gewandert. Danach sind sie zu Hause geblieben. Omar hat Brot gebacken.',prompt:'Was hat Omar zu Hause gemacht?',answer:'Brot gebacken',options:['Brot gebacken','getanzt','geschwommen'],hint:'Lies den letzten Satz genau.'},
 {kind:'input',sourceTask:'lueckentext',context:'Wir ___ im Café geblieben.',prompt:'Ergänze haben oder sein in der richtigen Form.',answer:'sind',answers:['sind'],hint:'Subjekt: wir.'},
 {kind:'input',sourceTask:'lueckentext',context:'Sara ___ Brot gebacken.',prompt:'Ergänze haben oder sein in der richtigen Form.',answer:'hat',answers:['hat'],hint:'Subjekt: Sara.'},
 {kind:'input',sourceTask:'lueckentext',context:'Ihr ___ sehr spät nach Hause gefahren.',prompt:'Ergänze haben oder sein in der richtigen Form.',answer:'seid',answers:['seid'],hint:'Subjekt: ihr.'},
 {kind:'choice',sourceTask:'karteikarten',prompt:'tanzen',answer:'hat getanzt',options:['hat getanzt','ist getanzt','hat getanzen'],hint:'Achte auf Hilfsverb und Partizip II.'},
 {kind:'input',sourceTask:'partizip-schreiben',prompt:'Schreibe nur Partizip II: kommen',answer:'gekommen',answers:['gekommen'],hint:'Unregelmäßiges Partizip II.'}
];
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const old=theme.tasks.find(t=>t?.exam);
 if(!old)return theme;
 const exam={...old,id:'t3-pruefung-v3',title:'Prüfung',description:'Mischprüfung aus allen Aufgaben von Thema 3.',kind:'',items:Q,exam:true,icon:'⭐',contentVersion:'l7t3-mixed-exam-v1'};
 const index=theme.tasks.indexOf(old);
 theme.tasks.splice(index,1,exam);
 theme.examRevision='l7t3-mixed-all-task-types-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
