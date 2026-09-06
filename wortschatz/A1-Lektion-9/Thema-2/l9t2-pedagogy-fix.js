(function(){
'use strict';
const D=window.L9T2;if(!D)return;

D.particleChoice=[
 {id:'m01',context:'Du bist am Schalter. Du sprichst mit einer Mitarbeiterin, die du nicht kennst. Du möchtest sehr höflich fragen.',dialog:['A: Entschuldigung, ich verstehe die Aufgabe nicht.','B: Erklären Sie das ___ noch einmal.'],answer:'bitte'},
 {id:'m02',context:'Du sprichst mit einem Mitarbeiter bei der Anmeldung. Ihr kennt euch nicht. Die Aufforderung soll höflich sein.',dialog:['A: Ich habe meinen Ausweis heute vergessen.','B: Bringen Sie ihn morgen ___ mit.'],answer:'bitte'},
 {id:'m03',context:'Eine Beamtin erklärt einem Besucher freundlich, wo er bleiben soll. Sie spricht höflich mit Sie.',dialog:['A: Wo soll ich auf meinen Termin warten?','B: Warten Sie ___ im Wartebereich.'],answer:'bitte'},
 {id:'m04',context:'Du brauchst Hilfe von einer Mitarbeiterin. Du möchtest nicht unfreundlich klingen.',dialog:['A: Ich kann den Vertrag nicht gut lesen.','B: Lesen Sie ihn ___ noch einmal in Ruhe.'],answer:'bitte'},
 {id:'m05',context:'Du fragst einen fremden Mitarbeiter in der Sprachschule. Die Aufforderung soll höflich sein.',dialog:['A: Ich finde die Kasse nicht.','B: Fragen Sie ___ die Mitarbeiterin dort.'],answer:'bitte'},
 {id:'m06',context:'Du redest locker mit deiner Freundin. Sie hat ein neues Buch und du möchtest es nur kurz sehen.',dialog:['A: Ich habe ein neues Buch.','B: Zeig ___!'],answer:'mal'},
 {id:'m07',context:'Du sitzt neben einem Freund. Du möchtest, dass er nur kurz auf eine Stelle schaut.',dialog:['A: Was steht auf dem Formular?','B: Schau ___ hier.'],answer:'mal'},
 {id:'m08',context:'Du probierst mit einem Freund einen Automaten aus. Du schlägst locker vor, es noch einmal zu versuchen.',dialog:['A: Ich glaube, der Automat ist kaputt.','B: Probier es ___ noch einmal.'],answer:'mal'},
 {id:'m09',context:'Du übst mit einer Freundin. Sie soll kurz genauer zuhören. Ihr sprecht ganz normal und locker miteinander.',dialog:['A: Ich kenne das Wort noch nicht.','B: Hör ___ genau zu.'],answer:'mal'},
 {id:'m10',context:'Ein Freund sucht die Kasse. Du gibst ihm ganz locker einen kurzen Tipp.',dialog:['A: Wo ist die Kasse?','B: Geh ___ nach links und schau dort.'],answer:'mal'},
 {id:'m11',context:'Deine Freundin steht vor der Tür und traut sich nicht hinein. Du möchtest sie ermutigen.',dialog:['A: Ich weiß nicht, ob ich reinkommen soll.','B: Komm ___ rein!'],answer:'doch'},
 {id:'m12',context:'Ein Freund möchte nichts fragen, obwohl die Mitarbeiterin helfen kann. Du möchtest ihn überzeugen.',dialog:['A: Ich möchte lieber nicht fragen.','B: Frag ___! Die Mitarbeiterin hilft dir.'],answer:'doch'},
 {id:'m13',context:'Deine Freundin glaubt, dass sie die Aufgabe nicht schafft. Du möchtest ihr Mut machen.',dialog:['A: Ich glaube, ich kann das nicht.','B: Versuch es ___!'],answer:'doch'},
 {id:'m14',context:'Ein Freund möchte nicht mit zum Kurs. Du möchtest ihn freundlich überreden.',dialog:['A: Ich möchte heute nicht zum Kurs gehen.','B: Komm ___ mit! Es wird bestimmt gut.'],answer:'doch'},
 {id:'m15',context:'Der Antrag ist fertig, aber deine Freundin ist noch unsicher und möchte ihn nicht abgeben. Du möchtest sie überzeugen.',dialog:['A: Ich bin nicht sicher. Vielleicht gebe ich den Antrag nicht ab.','B: Gib ihn ___ ab! Alles ist fertig.'],answer:'doch'}
];

D.particleWrite=[
 {id:'w01',context:'Du bist bei einer Behörde und sprichst mit einer Person, die du nicht kennst. Formuliere die Aufforderung höflich.',dialog:['A: Guten Tag. Wo soll ich auf meinen Termin warten?','B: Du zeigst der Person den richtigen Platz.'],base:'Warten Sie hier.',answer:'Warten Sie bitte hier.',particle:'bitte'},
 {id:'w02',context:'Du sprichst mit einer Mitarbeiterin. Du hast etwas nicht verstanden und möchtest sehr höflich um eine neue Erklärung bitten.',dialog:['A: Entschuldigung, ich verstehe das nicht.','B: Die Mitarbeiterin kann es noch einmal erklären.'],base:'Erklären Sie das noch einmal.',answer:'Erklären Sie das bitte noch einmal.',particle:'bitte'},
 {id:'w03',context:'Deine Freundin zeigt dir ein neues Foto. Du möchtest es nur kurz sehen und sprichst locker mit ihr.',dialog:['A: Ich habe ein neues Foto.','B: Du möchtest es sehen.'],base:'Zeig es.',answer:'Zeig es mal.',particle:'mal'},
 {id:'w04',context:'Du sitzt mit einem Freund zusammen. Du möchtest, dass er nur kurz auf eine Stelle schaut.',dialog:['A: Was steht dort?','B: Du zeigst auf die richtige Stelle.'],base:'Schau hier.',answer:'Schau mal hier.',particle:'mal'},
 {id:'w05',context:'Deine Freundin ist unsicher und weiß nicht, ob sie mitkommen soll. Du möchtest sie ermutigen.',dialog:['A: Ich weiß nicht. Vielleicht bleibe ich zu Hause.','B: Du möchtest, dass sie mitkommt.'],base:'Komm mit.',answer:'Komm doch mit.',particle:'doch'},
 {id:'w06',context:'Ein Freund traut sich nicht, die Mitarbeiterin anzusprechen. Du möchtest ihm Mut machen.',dialog:['A: Ich möchte lieber nichts fragen.','B: Die Mitarbeiterin kann ihm helfen.'],base:'Frag die Mitarbeiterin.',answer:'Frag doch die Mitarbeiterin.',particle:'doch'},
 {id:'w07',context:'Du bist am Schalter und brauchst Hilfe mit einem Formular. Die Person vor dir ist eine fremde Mitarbeiterin.',dialog:['A: Ich komme mit dem Formular nicht weiter.','B: Du möchtest höflich um Hilfe bitten.'],base:'Helfen Sie mir.',answer:'Helfen Sie mir bitte.',answers:['Helfen Sie bitte mir.'],particle:'bitte'},
 {id:'w08',context:'Du und dein Freund seid am Automaten. Ihr seid nicht sicher, ob er kaputt ist. Du schlägst locker vor, es noch einmal zu testen.',dialog:['A: Funktioniert der Automat wirklich nicht?','B: Du möchtest einen kurzen neuen Versuch.'],base:'Probier es noch einmal.',answer:'Probier es mal noch einmal.',particle:'mal'},
 {id:'w09',context:'Deine Freundin glaubt, dass die Aufgabe zu schwer ist. Du möchtest ihr Mut machen und sie zum Versuch bewegen.',dialog:['A: Ich schaffe die Aufgabe bestimmt nicht.','B: Du möchtest sie ermutigen.'],base:'Versuch es.',answer:'Versuch es doch.',particle:'doch'},
 {id:'w10',context:'Du gibst einer fremden Person in der Sprachschule einen höflichen Tipp.',dialog:['A: Ich finde den Schalter nicht.','B: Eine Mitarbeiterin kann die Information geben.'],base:'Fragen Sie die Mitarbeiterin.',answer:'Fragen Sie bitte die Mitarbeiterin.',particle:'bitte'},
 {id:'w11',context:'Du bist mit einem Freund zusammen. Er weiß nicht, was auf dem Schild steht. Du möchtest, dass er kurz selbst liest.',dialog:['A: Was steht auf dem Schild?','B: Du möchtest, dass er kurz hinschaut und liest.'],base:'Lies das Schild.',answer:'Lies mal das Schild.',particle:'mal'},
 {id:'w12',context:'Der Antrag deiner Freundin ist vollständig, aber sie möchte ihn trotzdem noch nicht abgeben. Du möchtest sie überzeugen.',dialog:['A: Alles ist fertig, aber ich warte lieber noch.','B: Du findest, dass sie den Antrag jetzt abgeben kann.'],base:'Gib den Antrag ab.',answer:'Gib den Antrag doch ab.',particle:'doch'}
];

D.ruleReadings=[
 {id:'r01',title:'In der Sprachschule',text:'In der Sprachschule beginnt der Unterricht um neun Uhr. Die Teilnehmer sollen schon vorher da sein. Im Flur spricht man leise, weil dort auch andere Kurse arbeiten. Die Gebühr bezahlt man nicht im Unterricht, sondern an der Kasse. Wer früher kommt, bleibt bis zum Start im Wartebereich.',questions:[
  {q:'Wo gibt man das Geld für den Kurs ab?',answer:'an der Kasse',options:['an der Kasse','im Unterricht','im zweiten Stock','bei der Autovermietung']},
  {q:'Wie soll die Stimme im Flur sein?',answer:'leise',options:['leise','laut','sehr schnell','egal']},
  {q:'Wo bleibt man, wenn der Kurs noch nicht angefangen hat?',answer:'im Wartebereich',options:['im Wartebereich','an der Kasse','im Auto','zu Hause']}
 ]},
 {id:'r02',title:'Im Unterricht',text:'Während des Unterrichts bleibt das Handy aus. Wenn die Lehrkraft spricht, hören alle gut zu. Das Buch soll jeder dabeihaben. Wer etwas nicht versteht, soll eine Frage stellen. Wenn andere Teilnehmer arbeiten, spricht man nicht laut.',questions:[
  {q:'Was macht man mit dem Telefon während des Kurses?',answer:'ausmachen',options:['ausmachen','laden','mitnehmen','abholen']},
  {q:'Welche Sache soll jeder zum Lernen dabeihaben?',answer:'das Buch',options:['das Buch','den Führerschein','die Gebühr','das Auto']},
  {q:'Was macht man, wenn eine Aufgabe unklar ist?',answer:'fragen',options:['fragen','lachen','weggehen','bezahlen']}
 ]},
 {id:'r03',title:'Beim Amt',text:'Für einen Termin beim Amt nimmt man den Ausweis und die Unterlagen mit. Nach der Anmeldung bleibt man im Wartebereich, bis man dran ist. Danach geht man zum Schalter und trägt die Informationen in den Antrag ein. Bevor man den fertigen Antrag abgibt, schreibt man am Ende seinen Namen darunter.',questions:[
  {q:'Welche Sachen braucht man für den Termin?',answer:'Ausweis und Unterlagen',options:['Ausweis und Unterlagen','nur Geld','ein Auto','nur eine Fahrkarte']},
  {q:'Wo bleibt man, solange man noch nicht dran ist?',answer:'im Wartebereich',options:['im Wartebereich','an der Kasse','im Unterricht','bei der Autovermietung']},
  {q:'Was macht man ganz zum Schluss mit dem Antrag, bevor man ihn abgibt?',answer:'unterschreiben',options:['unterschreiben','ausmachen','laden','lachen']}
 ]},
 {id:'r04',title:'Bei der Autovermietung',text:'Bei der Autovermietung zeigt man zuerst den Führerschein. Danach bekommt man den Vertrag. Man liest dieses Papier genau und unterschreibt es erst danach. Bevor man losfährt, schaut man das Auto an und kontrolliert es. Wenn alles in Ordnung ist, kann man das Auto abholen.',questions:[
  {q:'Welches Dokument zeigt man direkt am Anfang?',answer:'den Führerschein',options:['den Führerschein','die Fahrkarte','die Gebühr','das Buch']},
  {q:'Welches Papier soll man genau lesen und danach unterschreiben?',answer:'den Vertrag',options:['den Vertrag','den Unterricht','die Kasse','den Stock']},
  {q:'Was schaut man sich an, bevor man damit losfährt?',answer:'das Auto',options:['das Auto','die Sprachschule','die Kasse','die Gebühr']}
 ]}
];
})();
