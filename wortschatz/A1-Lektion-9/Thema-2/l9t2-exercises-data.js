(function(){
'use strict';
const D=window.L9T2;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const img=id=>`${CDN}${id}.webp`;
const aud=id=>`${CDN}audio/${id}.mp3`;
const clone=x=>({...x});
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'');
const t1=(window.L9_THEMES?.[1]?.coreVocabulary||[]).map(clone);
const t2=(D.cards||[]).map(clone);
const extraT1=[{id:'abgeben',word:'abgeben',full:'abgeben',type:'verb',perfect:'hat abgegeben',example:'Man muss die Unterlagen abgeben.',meaning:'Man gibt etwas einer Person oder Stelle und lässt es dort.',image:img('abgeben'),audio:aud('abgeben')}];
const map=new Map();
[...t1,...extraT1,...t2].forEach(x=>{if(!x?.id)return;const v={...x};v.image=v.image||img(v.id);v.audio=v.audio||aud(v.id);if(!map.has(v.id))map.set(v.id,v)});
D.mixedWords=[...map.values()];
D.visualWords=D.mixedWords.filter(x=>x.id&&x.image&&x.type!=='grammar');
D.wordLabel=x=>String(x?.full||x?.word||'').trim();

D.dialogGaps=[
 {id:'d01',dialog:['A: Ich verstehe die Aufgabe nicht.','B: Ich kann sie noch einmal ___.'],answer:'erklären',hint:'Man sagt etwas so, dass die andere Person es besser versteht.'},
 {id:'d02',dialog:['A: Das Handy ist noch an.','B: Kannst du es bitte ___?'],answer:'ausmachen',hint:'Danach ist das Handy nicht mehr an.'},
 {id:'d03',dialog:['A: Ich kann dich nicht hören.','B: Dann spreche ich etwas ___.'],answer:'laut',hint:'Das Gegenteil von leise.'},
 {id:'d04',dialog:['A: Wir sind im Unterricht.','B: Dann sprechen wir bitte ___.'],answer:'leise',hint:'Nicht laut.'},
 {id:'d05',dialog:['A: Was sagt die Lehrerin?','B: Du musst gut ___.'],answer:'zuhören',hint:'Aufmerksam hören.'},
 {id:'d06',dialog:['A: Der Unterricht beginnt.','B: Dann müssen wir jetzt ___.'],answer:'aufstehen',hint:'Vom Stuhl nach oben gehen.'},
 {id:'d07',dialog:['A: Wo soll ich die Gebühr bezahlen?','B: An der ___.'],answer:'Kasse',hint:'Dort bezahlt man.'},
 {id:'d08',dialog:['A: Was muss ich für die Anmeldung bezahlen?','B: Die ___ ist 50 Euro.'],answer:'Gebühr',hint:'Geld für eine Leistung.'},
 {id:'d09',dialog:['A: Wo soll ich auf meinen Termin warten?','B: Im ___.'],answer:'Wartebereich',hint:'Dort sitzen Menschen und warten.'},
 {id:'d10',dialog:['A: Wo ist der Unterricht?','B: Im zweiten ___.'],answer:'Stock',hint:'Eine Etage im Gebäude.'},
 {id:'d11',dialog:['A: Wo lernst du Deutsch?','B: In einer ___.'],answer:'Sprachschule',hint:'Eine Schule für Sprachen.'},
 {id:'d12',dialog:['A: Was mache ich mit dem Antrag?','B: Du musst ihn ___.'],answer:'ausfüllen',hint:'Informationen in ein Formular schreiben.'},
 {id:'d13',dialog:['A: Was mache ich mit den Unterlagen?','B: Du musst sie am Schalter ___.'],answer:'abgeben',hint:'Die Unterlagen bleiben bei der Stelle.'},
 {id:'d14',dialog:['A: Mein Dokument ist fertig. Was kann ich machen?','B: Du kannst es morgen ___.'],answer:'abholen',hint:'Hingehen und mitnehmen.'},
 {id:'d15',dialog:['A: Ich möchte ein Auto mieten.','B: Dann geh zur ___.'],answer:'Autovermietung',hint:'Dort kann man ein Auto mieten.'},
 {id:'d16',dialog:['A: Der Automat ist wieder in Ordnung.','B: Ja, er ___ wieder.'],answer:'funktioniert',answers:['funktioniert'],hint:'Er arbeitet wieder richtig.'}
];

D.sentenceTypes=[
 {id:'s01',text:'Der Unterricht beginnt um neun.',answer:'Satz'},
 {id:'s02',text:'Der Automat funktioniert heute wieder.',answer:'Satz'},
 {id:'s03',text:'Die Gebühr ist 50 Euro.',answer:'Satz'},
 {id:'s04',text:'Wir warten im Wartebereich.',answer:'Satz'},
 {id:'s05',text:'Ich bringe morgen meinen Ausweis mit.',answer:'Satz'},
 {id:'s06',text:'Der Lehrer erklärt die Aufgabe.',answer:'Satz'},
 {id:'s07',text:'Ali hilft seiner Freundin.',answer:'Satz'},
 {id:'s08',text:'Wo ist die Kasse?',answer:'Frage'},
 {id:'s09',text:'Musst du den Antrag ausfüllen?',answer:'Frage'},
 {id:'s10',text:'Können Sie das bitte erklären?',answer:'Frage'},
 {id:'s11',text:'Wann beginnt der Unterricht?',answer:'Frage'},
 {id:'s12',text:'Bringst du morgen das Buch mit?',answer:'Frage'},
 {id:'s13',text:'Hilfst du mir bitte?',answer:'Frage'},
 {id:'s14',text:'Sprich bitte leise!',answer:'Imperativ'},
 {id:'s15',text:'Hört gut zu!',answer:'Imperativ'},
 {id:'s16',text:'Stehen Sie bitte auf!',answer:'Imperativ'},
 {id:'s17',text:'Bring deinen Ausweis mit!',answer:'Imperativ'},
 {id:'s18',text:'Helft eurer Lehrerin!',answer:'Imperativ'},
 {id:'s19',text:'Warte doch hier!',answer:'Imperativ'},
 {id:'s20',text:'Mach bitte das Handy aus!',answer:'Imperativ'}
];

D.imperativePersons=[
 {id:'p01',text:'Sprich bitte leise!',answer:'du'},
 {id:'p02',text:'Mach das Handy aus!',answer:'du'},
 {id:'p03',text:'Hör mal zu!',answer:'du'},
 {id:'p04',text:'Steh bitte auf!',answer:'du'},
 {id:'p05',text:'Warte hier!',answer:'du'},
 {id:'p06',text:'Bring den Ausweis mit!',answer:'du'},
 {id:'p07',text:'Hilf mir bitte!',answer:'du'},
 {id:'p08',text:'Sprecht bitte leise!',answer:'ihr'},
 {id:'p09',text:'Macht die Bücher auf!',answer:'ihr'},
 {id:'p10',text:'Hört gut zu!',answer:'ihr'},
 {id:'p11',text:'Steht bitte auf!',answer:'ihr'},
 {id:'p12',text:'Wartet im Wartebereich!',answer:'ihr'},
 {id:'p13',text:'Bringt die Unterlagen mit!',answer:'ihr'},
 {id:'p14',text:'Helft eurem Lehrer!',answer:'ihr'},
 {id:'p15',text:'Sprechen Sie bitte leise!',answer:'Sie'},
 {id:'p16',text:'Machen Sie das Handy aus!',answer:'Sie'},
 {id:'p17',text:'Hören Sie bitte zu!',answer:'Sie'},
 {id:'p18',text:'Stehen Sie bitte auf!',answer:'Sie'},
 {id:'p19',text:'Warten Sie hier!',answer:'Sie'},
 {id:'p20',text:'Bringen Sie den Führerschein mit!',answer:'Sie'}
];

D.imperativeTable=[
 {id:'t01',cue:'leise sein',du:'Sei leise.',ihr:'Seid leise.',sie:'Seien Sie leise.'},
 {id:'t02',cue:'gut zuhören',du:'Hör gut zu.',ihr:'Hört gut zu.',sie:'Hören Sie gut zu.'},
 {id:'t03',cue:'aufstehen',du:'Steh auf.',ihr:'Steht auf.',sie:'Stehen Sie auf.'},
 {id:'t04',cue:'den Ausweis mitbringen',du:'Bring den Ausweis mit.',ihr:'Bringt den Ausweis mit.',sie:'Bringen Sie den Ausweis mit.'},
 {id:'t05',cue:'den Antrag ausfüllen',du:'Füll den Antrag aus.',duAnswers:['Fülle den Antrag aus.'],ihr:'Füllt den Antrag aus.',sie:'Füllen Sie den Antrag aus.'},
 {id:'t06',cue:'an der Kasse bezahlen',du:'Bezahl an der Kasse.',duAnswers:['Bezahle an der Kasse.'],ihr:'Bezahlt an der Kasse.',sie:'Bezahlen Sie an der Kasse.'},
 {id:'t07',cue:'mir helfen',du:'Hilf mir.',ihr:'Helft mir.',sie:'Helfen Sie mir.'},
 {id:'t08',cue:'mir antworten',du:'Antworte mir.',ihr:'Antwortet mir.',sie:'Antworten Sie mir.'},
 {id:'t09',cue:'das Handy ausmachen',du:'Mach das Handy aus.',ihr:'Macht das Handy aus.',sie:'Machen Sie das Handy aus.'},
 {id:'t10',cue:'im Wartebereich warten',du:'Warte im Wartebereich.',ihr:'Wartet im Wartebereich.',sie:'Warten Sie im Wartebereich.'}
];

D.imperativeBuild=[
 {id:'b01',form:'du',cue:'das Handy ausmachen · bitte',answer:'Mach bitte das Handy aus.'},
 {id:'b02',form:'du',cue:'morgen das Buch mitbringen',answer:'Bring morgen das Buch mit.'},
 {id:'b03',form:'du',cue:'leise sprechen · bitte',answer:'Sprich bitte leise.'},
 {id:'b04',form:'du',cue:'mir helfen · bitte',answer:'Hilf mir bitte.'},
 {id:'b05',form:'ihr',cue:'gut zuhören',answer:'Hört gut zu.'},
 {id:'b06',form:'ihr',cue:'im Wartebereich warten',answer:'Wartet im Wartebereich.'},
 {id:'b07',form:'ihr',cue:'morgen die Unterlagen mitbringen',answer:'Bringt morgen die Unterlagen mit.'},
 {id:'b08',form:'ihr',cue:'aufstehen · bitte',answer:'Steht bitte auf.'},
 {id:'b09',form:'Sie',cue:'den Antrag ausfüllen · bitte',answer:'Füllen Sie bitte den Antrag aus.'},
 {id:'b10',form:'Sie',cue:'an der Kasse bezahlen · bitte',answer:'Bezahlen Sie bitte an der Kasse.'},
 {id:'b11',form:'Sie',cue:'den Führerschein zeigen · bitte',answer:'Zeigen Sie bitte den Führerschein.'},
 {id:'b12',form:'Sie',cue:'zur Autovermietung gehen · bitte',answer:'Gehen Sie bitte zur Autovermietung.'},
 {id:'b13',form:'du',cue:'zuerst das Ziel wählen',answer:'Wähl zuerst das Ziel.',answers:['Wähle zuerst das Ziel.']},
 {id:'b14',form:'du',cue:'den Antrag unterschreiben',answer:'Unterschreib den Antrag.',answers:['Unterschreibe den Antrag.']},
 {id:'b15',form:'ihr',cue:'die Fahrkarten nehmen',answer:'Nehmt die Fahrkarten.'},
 {id:'b16',form:'Sie',cue:'das Dokument kontrollieren',answer:'Kontrollieren Sie das Dokument.'},
 {id:'b17',form:'du',cue:'mir antworten · bitte',answer:'Antworte mir bitte.'},
 {id:'b18',form:'ihr',cue:'dem Lehrer helfen',answer:'Helft dem Lehrer.'},
 {id:'b19',form:'Sie',cue:'langsam fahren · bitte',answer:'Fahren Sie bitte langsam.'},
 {id:'b20',form:'du',cue:'die Kasse suchen',answer:'Such die Kasse.',answers:['Suche die Kasse.']}
];

D.particleChoice=[
 {id:'m01',dialog:['A: Entschuldigung, ich verstehe die Aufgabe nicht.','B: Erklären Sie das ___ noch einmal.'],answer:'bitte'},
 {id:'m02',dialog:['A: Ich habe meinen Ausweis vergessen.','B: Bringen Sie ihn morgen ___ mit.'],answer:'bitte'},
 {id:'m03',dialog:['A: Wo soll ich warten?','B: Warten Sie ___ im Wartebereich.'],answer:'bitte'},
 {id:'m04',dialog:['A: Ich kann den Vertrag nicht lesen.','B: Lesen Sie ihn ___ noch einmal in Ruhe.'],answer:'bitte'},
 {id:'m05',dialog:['A: Ich finde den Schalter nicht.','B: Fragen Sie ___ die Mitarbeiterin.'],answer:'bitte'},
 {id:'m06',dialog:['A: Ich habe ein neues Buch.','B: Zeig ___!'],answer:'mal'},
 {id:'m07',dialog:['A: Was steht auf dem Formular?','B: Schau ___ hier.'],answer:'mal'},
 {id:'m08',dialog:['A: Ich glaube, der Automat ist kaputt.','B: Probier es ___ noch einmal.'],answer:'mal'},
 {id:'m09',dialog:['A: Ich kenne das Wort nicht.','B: Hör ___ genau zu.'],answer:'mal'},
 {id:'m10',dialog:['A: Wo ist die Kasse?','B: Geh ___ nach links und schau dort.'],answer:'mal'},
 {id:'m11',dialog:['A: Ich weiß nicht, ob ich reinkommen darf.','B: Komm ___ rein!'],answer:'doch'},
 {id:'m12',dialog:['A: Ich möchte nicht fragen.','B: Frag ___! Die Mitarbeiterin hilft dir.'],answer:'doch'},
 {id:'m13',dialog:['A: Ich glaube, ich kann das nicht.','B: Versuch es ___!'],answer:'doch'},
 {id:'m14',dialog:['A: Ich möchte heute nicht zum Kurs gehen.','B: Komm ___ mit! Es wird gut.'],answer:'doch'},
 {id:'m15',dialog:['A: Ich bin nicht sicher, ob ich den Antrag abgeben soll.','B: Gib ihn ___ ab! Alles ist fertig.'],answer:'doch'}
];

D.particleWrite=[
 {id:'w01',dialog:['A: Guten Tag. Wo soll ich warten?','B: Formuliere die höfliche Aufforderung.'],base:'Warten Sie hier.',answer:'Warten Sie bitte hier.',particle:'bitte'},
 {id:'w02',dialog:['A: Entschuldigung, ich verstehe das nicht.','B: Formuliere die höfliche Aufforderung.'],base:'Erklären Sie das noch einmal.',answer:'Erklären Sie das bitte noch einmal.',particle:'bitte'},
 {id:'w03',dialog:['A: Ich habe ein neues Foto.','B: Du möchtest es kurz sehen.'],base:'Zeig es.',answer:'Zeig es mal.',answers:['Zeig mal es.'],particle:'mal'},
 {id:'w04',dialog:['A: Was steht dort?','B: Du möchtest, dass dein Freund kurz schaut.'],base:'Schau hier.',answer:'Schau mal hier.',particle:'mal'},
 {id:'w05',dialog:['A: Ich weiß nicht, ob ich mitkommen soll.','B: Du möchtest die Person ermutigen.'],base:'Komm mit.',answer:'Komm doch mit.',particle:'doch'},
 {id:'w06',dialog:['A: Ich traue mich nicht zu fragen.','B: Du möchtest die Person ermutigen.'],base:'Frag die Mitarbeiterin.',answer:'Frag doch die Mitarbeiterin.',particle:'doch'},
 {id:'w07',dialog:['A: Guten Tag. Ich brauche Hilfe mit dem Formular.','B: Formuliere eine höfliche Bitte.'],base:'Helfen Sie mir.',answer:'Helfen Sie mir bitte.',answers:['Helfen Sie bitte mir.'],particle:'bitte'},
 {id:'w08',dialog:['A: Ist der Automat wirklich kaputt?','B: Du willst, dass dein Freund es kurz ausprobiert.'],base:'Probier es noch einmal.',answer:'Probier es mal noch einmal.',particle:'mal'},
 {id:'w09',dialog:['A: Ich glaube, ich schaffe die Aufgabe nicht.','B: Du möchtest die Person ermutigen.'],base:'Versuch es.',answer:'Versuch es doch.',particle:'doch'},
 {id:'w10',dialog:['A: Ich finde den Schalter nicht.','B: Formuliere eine höfliche Aufforderung.'],base:'Fragen Sie die Mitarbeiterin.',answer:'Fragen Sie bitte die Mitarbeiterin.',particle:'bitte'},
 {id:'w11',dialog:['A: Ich weiß nicht, was auf dem Schild steht.','B: Du willst, dass dein Freund kurz liest.'],base:'Lies das Schild.',answer:'Lies mal das Schild.',particle:'mal'},
 {id:'w12',dialog:['A: Ich möchte den Antrag nicht abgeben, obwohl alles fertig ist.','B: Du möchtest die Person überzeugen.'],base:'Gib den Antrag ab.',answer:'Gib den Antrag doch ab.',particle:'doch'}
];

D.ruleReadings=[
 {id:'r01',title:'In der Sprachschule',rules:['Kommt pünktlich zum Unterricht.','Sprecht im Flur leise.','Bezahlt die Kursgebühr an der Kasse.','Wartet vor dem Kurs im Wartebereich.'],questions:[
  {q:'Wo bezahlt man die Kursgebühr?',answer:'an der Kasse',options:['an der Kasse','im Unterricht','im zweiten Stock','bei der Autovermietung']},
  {q:'Wie soll man im Flur sprechen?',answer:'leise',options:['leise','laut','schnell','gar nicht']},
  {q:'Wo wartet man vor dem Kurs?',answer:'im Wartebereich',options:['im Wartebereich','an der Kasse','im Auto','zu Hause']}
 ]},
 {id:'r02',title:'Im Unterricht',rules:['Mach das Handy aus.','Hör gut zu.','Bring dein Buch mit.','Frag, wenn du etwas nicht verstehst.','Sprich bitte leise, wenn andere arbeiten.'],questions:[
  {q:'Was soll man mit dem Handy machen?',answer:'ausmachen',options:['ausmachen','mitbringen','abholen','laden']},
  {q:'Was soll man mitbringen?',answer:'das Buch',options:['das Buch','den Führerschein','das Wechselgeld','das Auto']},
  {q:'Was soll man machen, wenn man etwas nicht versteht?',answer:'fragen',options:['fragen','lachen','weggehen','bezahlen']}
 ]},
 {id:'r03',title:'Beim Amt',rules:['Bringen Sie Ihren Ausweis und Ihre Unterlagen mit.','Warten Sie am Schalter.','Füllen Sie den Antrag aus.','Unterschreiben Sie den Antrag am Ende.'],questions:[
  {q:'Was muss man mitbringen?',answer:'Ausweis und Unterlagen',options:['Ausweis und Unterlagen','nur Wechselgeld','ein Auto','nur eine Fahrkarte']},
  {q:'Wo soll man warten?',answer:'am Schalter',options:['am Schalter','im Auto','an der Kasse','im Unterricht']},
  {q:'Was soll man am Ende machen?',answer:'den Antrag unterschreiben',options:['den Antrag unterschreiben','das Handy ausmachen','den Führerschein kaufen','laut sprechen']}
 ]},
 {id:'r04',title:'Bei der Autovermietung',rules:['Zeigen Sie den Führerschein.','Lesen Sie den Vertrag.','Unterschreiben Sie den Vertrag.','Kontrollieren Sie das Auto.','Holen Sie das Auto danach ab.'],questions:[
  {q:'Was soll man zuerst zeigen?',answer:'den Führerschein',options:['den Führerschein','die Fahrkarte','die Gebühr','das Wechselgeld']},
  {q:'Was soll man lesen und unterschreiben?',answer:'den Vertrag',options:['den Vertrag','den Unterricht','die Kasse','das Ziel']},
  {q:'Was soll man vor dem Abholen kontrollieren?',answer:'das Auto',options:['das Auto','die Sprachschule','den Stock','die Gebühr']}
 ]}
];

D.tasks=[
 {id:'karteikarten',kind:'cards',title:'Karteikarten',description:'Lerne die Wörter.',icon:'🃏'},
 {id:'bild-wort',kind:'image-choice',title:'Bild & Wort',description:'Wähle das richtige Wort.',icon:'🖼️'},
 {id:'bild-hoeren',kind:'audio-choice',title:'Bild & Hören',description:'Hör die Wörter und wähle.',icon:'🎧'},
 {id:'memory',kind:'memory',title:'Memory',description:'Finde Wort und Bild.',icon:'🧠'},
 {id:'dialog-luecken',kind:'dialog-input',title:'Dialoge',description:'Ergänze das passende Wort.',icon:'💬'},
 {id:'satzart',kind:'classify-sentence',title:'Satz, Frage oder Imperativ?',description:'Ordne den Satz zu.',icon:'🧭'},
 {id:'imperativ-person',kind:'classify-person',title:'du, ihr oder Sie?',description:'Ordne den Imperativ zu.',icon:'👥'},
 {id:'imperativ-tabelle',kind:'imperative-table',title:'Imperativ-Tabelle',description:'Fülle die Tabelle aus.',icon:'📋'},
 {id:'imperativ-bilden',kind:'imperative-build',title:'Imperativ bilden',description:'Schreibe den Imperativ.',icon:'🧩'},
 {id:'modalpartikel-waehlen',kind:'particle-choice',title:'mal, bitte oder doch?',description:'Wähle die passende Partikel.',icon:'🎯'},
 {id:'modalpartikel-schreiben',kind:'particle-write',title:'Partikel im Dialog',description:'Schreibe den passenden Satz.',icon:'✍️'},
 {id:'regeln-lesen',kind:'reading',title:'Regeln lesen',description:'Lies die Regeln und antworte.',icon:'📖'},
 {id:'pruefung',kind:'exam',title:'Prüfung',description:'Zeig, was du kannst.',icon:'🏆',exam:true}
];

D.itemIds=function(taskId){
 if(taskId==='karteikarten')return (D.flashcards||D.cards||[]).map(x=>x.id);
 if(taskId==='bild-wort')return D.visualWords.map(x=>'pic-'+x.id);
 if(taskId==='bild-hoeren')return D.visualWords.map(x=>'aud-'+x.id);
 if(taskId==='memory')return ['memory-board'];
 if(taskId==='dialog-luecken')return D.dialogGaps.map(x=>x.id);
 if(taskId==='satzart')return D.sentenceTypes.map(x=>x.id);
 if(taskId==='imperativ-person')return D.imperativePersons.map(x=>x.id);
 if(taskId==='imperativ-tabelle')return D.imperativeTable.map(x=>x.id);
 if(taskId==='imperativ-bilden')return D.imperativeBuild.map(x=>x.id);
 if(taskId==='modalpartikel-waehlen')return D.particleChoice.map(x=>x.id);
 if(taskId==='modalpartikel-schreiben')return D.particleWrite.map(x=>x.id);
 if(taskId==='regeln-lesen')return D.ruleReadings.map(x=>x.id);
 if(taskId==='pruefung')return ['exam'];
 return [];
};
D.norm=norm;
})();