(function(){
'use strict';
const D=window.L9T2;if(!D)return;
D.particleWrite=[
 {id:'w01',context:'Du sprichst mit einer Mitarbeiterin. Du kennst sie nicht. Sei höflich.',dialog:['A: Wo soll ich warten?'],blocks:['Sie','hier warten'],answer:'Warten Sie bitte hier.',particle:'bitte'},
 {id:'w02',context:'Du hast etwas nicht verstanden. Du sprichst mit einer Mitarbeiterin. Sei höflich.',dialog:['A: Entschuldigung, ich verstehe das nicht.'],blocks:['Sie','das noch einmal erklären'],answer:'Erklären Sie das bitte noch einmal.',particle:'bitte'},
 {id:'w03',context:'Du sprichst mit deiner Freundin. Ihr redet locker miteinander.',dialog:['A: Ich habe ein neues Foto.'],blocks:['du','das Foto zeigen'],answer:'Zeig mal das Foto.',answers:['Zeige mal das Foto.'],particle:'mal'},
 {id:'w04',context:'Du sitzt neben einem Freund. Er soll kurz auf eine Stelle schauen.',dialog:['A: Wo steht das?'],blocks:['du','hier schauen'],answer:'Schau mal hier.',particle:'mal'},
 {id:'w05',context:'Deine Freundin ist unsicher. Sie weiß nicht, ob sie mitkommen soll.',dialog:['A: Vielleicht bleibe ich zu Hause.'],blocks:['du','mitkommen'],answer:'Komm doch mit.',particle:'doch'},
 {id:'w06',context:'Dein Freund möchte die Mitarbeiterin nicht fragen. Du findest: Er kann fragen.',dialog:['A: Ich möchte lieber nichts fragen.'],blocks:['du','die Mitarbeiterin fragen'],answer:'Frag doch die Mitarbeiterin.',answers:['Frage doch die Mitarbeiterin.'],particle:'doch'},
 {id:'w07',context:'Du bist am Schalter. Du brauchst Hilfe. Du kennst die Mitarbeiterin nicht.',dialog:['A: Ich verstehe das Formular nicht.'],blocks:['Sie','mir helfen'],answer:'Helfen Sie mir bitte.',answers:['Helfen Sie bitte mir.'],particle:'bitte'},
 {id:'w08',context:'Du bist mit einem Freund am Automaten. Ihr redet locker.',dialog:['A: Ich glaube, der Automat ist kaputt.'],blocks:['du','es probieren'],answer:'Probier es mal.',answers:['Probiere es mal.'],particle:'mal'},
 {id:'w09',context:'Deine Freundin sagt, dass sie die Aufgabe nicht kann. Du findest: Sie soll es versuchen.',dialog:['A: Das kann ich nicht.'],blocks:['du','es versuchen'],answer:'Versuch es doch.',answers:['Versuche es doch.'],particle:'doch'},
 {id:'w10',context:'Eine fremde Person sucht den Schalter. Du möchtest höflich helfen.',dialog:['A: Wo ist der Schalter?'],blocks:['Sie','die Mitarbeiterin fragen'],answer:'Fragen Sie bitte die Mitarbeiterin.',particle:'bitte'},
 {id:'w11',context:'Du bist mit einem Freund zusammen. Er weiß nicht, was auf dem Schild steht.',dialog:['A: Was steht auf dem Schild?'],blocks:['du','das Schild lesen'],answer:'Lies mal das Schild.',particle:'mal'},
 {id:'w12',context:'Der Antrag ist fertig. Deine Freundin ist aber noch unsicher.',dialog:['A: Ich weiß nicht. Vielleicht gebe ich den Antrag später ab.'],blocks:['du','den Antrag abgeben'],answer:'Gib den Antrag doch ab.',particle:'doch'}
];
const t=(D.tasks||[]).find(x=>x.id==='modalpartikel-schreiben');
if(t){t.title='Sätze mit Partikeln';t.description='Bilde einen passenden Satz.';t.icon='🧩'}
})();
