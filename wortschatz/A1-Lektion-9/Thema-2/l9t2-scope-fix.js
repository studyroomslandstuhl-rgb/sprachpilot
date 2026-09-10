(function(){
'use strict';
const D=window.L9T2;if(!D)return;
const A=D.assets||window.L9T2Assets||{};
const bunnyImage=id=>typeof A.image==='function'?A.image(id):`https://sprachpilot.b-cdn.net/${String(id||'')}.webp`;
const bunnyAudio=id=>typeof A.audio==='function'?A.audio(id):`https://sprachpilot.b-cdn.net/audio/${String(id||'')}.mp3`;

/* Aufgaben 2–5 benutzen ausschließlich die 22 Einträge aus L9T2:
   19 Wortschatzkarten + doch / bitte / mal. Keine alten oder neuen Wörter.
   Die drei Modalpartikeln haben bewusst KEIN Bild: Sie werden als echte Emojis gerendert.
   Für alle 19 Wörter werden Bild und Audio direkt aus der zentralen Bunny-Zuordnung geladen. */
D.visualWords=(D.flashcards||[]).map(x=>({
 ...x,
 image:x.type==='grammar'?'':bunnyImage(x.id),
 audio:x.type==='grammar'?x.audio:bunnyAudio(x.id)
}));
D.mixedWords=[...D.visualWords];
D.wordLabel=x=>String(x?.full||x?.word||'').trim();

D.dialogGaps=[
 {id:'d01',dialog:['A: Wie soll ich im Unterricht sprechen?','B: Bitte ___.'],answer:'leise',hint:'Nicht laut.'},
 {id:'d02',dialog:['A: Ich verstehe die Aufgabe nicht.','B: Können Sie sie bitte ___?'],answer:'erklären',hint:'Etwas verständlich machen.'},
 {id:'d03',dialog:['A: Ich kann dich nicht hören.','B: Dann spreche ich ___.'],answer:'laut',hint:'Das Gegenteil von leise.'},
 {id:'d04',dialog:['A: Das Handy ist noch an.','B: Dann musst du es ___.'],answer:'ausmachen',hint:'Danach ist das Handy nicht mehr an.'},
 {id:'d05',dialog:['A: Die Lehrerin erklärt etwas. Was soll ich machen?','B: Gut ___.'],answer:'zuhören',hint:'Aufmerksam hören.'},
 {id:'d06',dialog:['A: Der Lehrer sagt: Bitte ___.','B: Okay, ich stehe jetzt.'],answer:'aufstehen',hint:'Vom Stuhl nach oben kommen.'},
 {id:'d07',dialog:['A: Mein Termin ist erst später. Was soll ich machen?','B: Hier ___.'],answer:'warten',hint:'Bleiben, bis etwas passiert.'},
 {id:'d08',dialog:['A: Wie viel muss ich bezahlen?','B: Die ___ ist 50 Euro.'],answer:'Gebühr',hint:'Geld für eine Leistung.'},
 {id:'d09',dialog:['A: Wo kann ich bezahlen?','B: An der ___.'],answer:'Kasse',hint:'Dort bezahlt man.'},
 {id:'d10',dialog:['A: Der Witz ist lustig. Was machen alle?','B: Sie ___.'],answer:'lachen',hint:'Man zeigt, dass etwas lustig ist.'},
 {id:'d11',dialog:['A: Du redest immer weiter.','B: Okay, ich werde ___.'],answer:'aufhören',hint:'Nicht weitermachen.'},
 {id:'d12',dialog:['A: Wo melde ich mich für den Kurs an?','B: Bei der ___.'],answer:'Anmeldung',hint:'Dort meldet man sich offiziell an.'},
 {id:'d13',dialog:['A: Wo ist Raum 205?','B: Im zweiten ___.'],answer:'Stock',hint:'Eine Etage im Gebäude.'},
 {id:'d14',dialog:['A: Was beginnt um neun Uhr?','B: Der ___.'],answer:'Unterricht',hint:'Die Lernzeit mit der Lehrkraft.'},
 {id:'d15',dialog:['A: Wo lernst du Deutsch?','B: In der ___.'],answer:'Sprachschule',hint:'Eine Schule für Sprachen.'},
 {id:'d16',dialog:['A: Wo kann ich ein Auto mieten?','B: Bei der ___.'],answer:'Autovermietung',hint:'Dort kann man ein Auto mieten.'},
 {id:'d17',dialog:['A: Ich habe dort einen Termin.','B: Dann musst du ___.'],answer:'hingehen',hint:'Zu diesem Ort gehen.'},
 {id:'d18',dialog:['A: Was machen wir mit den Koffern?','B: Wir müssen sie ins Auto ___.'],answer:'laden',hint:'Etwas in ein Fahrzeug bringen.'},
 {id:'d19',dialog:['A: Wo soll ich auf meinen Termin warten?','B: Im ___.'],answer:'Wartebereich',hint:'Der Bereich zum Warten.'},
 {id:'d20',dialog:['A: Ich bin nicht sicher, ob ich reinkommen soll.','B: Komm ___ rein!'],answer:'doch',hint:'Macht die Aufforderung stärker oder ermutigend.'},
 {id:'d21',dialog:['A: Ich verstehe das nicht.','B: Erklären Sie das ___ noch einmal.'],answer:'bitte',hint:'Macht die Aufforderung höflich.'},
 {id:'d22',dialog:['A: Ich habe nicht gut zugehört.','B: Hör ___ genau zu.'],answer:'mal',hint:'Macht die Aufforderung natürlicher und freundlicher.'}
];

const oldItemIds=typeof D.itemIds==='function'?D.itemIds.bind(D):null;
D.itemIds=function(taskId){
 if(taskId==='bild-wort')return D.visualWords.map(x=>'pic-'+x.id);
 if(taskId==='bild-hoeren')return D.visualWords.map(x=>'aud-'+x.id);
 if(taskId==='memory')return D.visualWords.map(x=>'mem-'+x.id);
 if(taskId==='dialog-luecken')return D.dialogGaps.map(x=>x.id);
 return oldItemIds?oldItemIds(taskId):[];
};
})();