(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;
const C=(prompt,answer,options,hint='',extra={})=>({kind:'choice',prompt,answer,options,hint,...extra});
const I=(prompt,answer,answers=[],hint='',extra={})=>({kind:'input',prompt,answer,answers,hint,...extra});
const D=(speaker,text,side='left')=>({speaker,text,side});
const shuffleOptions=(answer,pool,index,count=4)=>{
 const rest=pool.filter(value=>value!==answer);
 const rotated=rest.slice(index%Math.max(1,rest.length)).concat(rest.slice(0,index%Math.max(1,rest.length)));
 return [answer,...rotated.slice(0,count-1)];
};
const task=id=>data.tasks.find(item=>item.id===id);

/* Aufgabe 5 und 6: keine transparenten Komposita. */
const compounds=new Set(['Speisekarte','Apfelsaft','Tomatensalat','Schinkensalat','Käsebrot','Schinkenbrot','Schwimmbad','Lieblingsbuch','Lieblingsfilm','Lieblingsfarbe','Lieblingshobby','Wochenende']);
data.lesson6Nouns=(data.lesson6Nouns||[]).filter(item=>!compounds.has(item.word));
const articleOptions=['der','die','das','kein Artikel'];
const articleItems=data.lesson6Nouns.map(noun=>{
 if(noun.article==='der oder das')return{kind:'choice',prompt:`___ ${noun.word}`,answer:'der',answers:['das'],options:articleOptions,hint:'Bei Ketchup sind „der“ und „das“ richtig.',nounSource:noun.source};
 return C(`___ ${noun.word}`,noun.article,articleOptions,`${noun.word} gehört zu ${noun.source}.`,{nounSource:noun.source});
});
if(task('article'))task('article').items=articleItems;

/* Aufgabe 7: echtes Geräusch, zuerst auswählen, danach selbst schreiben. */
const soundRows=[
 ['duschen','l6t4-geraeusch-duschen.mp3',['duschen']],
 ['kochen','l6t4-geraeusch-kochen.mp3',['kochen']],
 ['staubsaugen','l6t4-geraeusch-staubsaugen.mp3',['staubsaugen']],
 ['telefonieren','l6t4-geraeusch-telefonieren.mp3',['telefonieren']],
 ['lachen','l6t4-geraeusch-lachen.mp3',['lachen']],
 ['weinen','l6t4-geraeusch-weinen.mp3',['weinen']],
 ['schnarchen','l6t4-geraeusch-schnarchen.mp3',['schnarchen','schlafen','schlafen und schnarchen']],
 ['Zähne putzen','l6t4-geraeusch-zaehne-putzen.mp3',['Zähne putzen','die Zähne putzen']],
 ['Geschirr spülen','l6t4-geraeusch-geschirr-spuelen.mp3',['Geschirr spülen','das Geschirr spülen']],
 ['Musik hören','l6t4-geraeusch-musik-hoeren.mp3',['Musik hören']],
 ['fernsehen','l6t4-geraeusch-fernsehen.mp3',['fernsehen']],
 ['die Tür öffnen','l6t4-geraeusch-tuer-oeffnen.mp3',['die Tür öffnen','Tür öffnen']],
 ['die Tür schließen','l6t4-geraeusch-tuer-schliessen.mp3',['die Tür schließen','Tür schließen']],
 ['die Waschmaschine benutzen','l6t4-geraeusch-waschmaschine.mp3',['die Waschmaschine benutzen','Waschmaschine benutzen']],
 ['Kaffee kochen','l6t4-geraeusch-kaffee-kochen.mp3',['Kaffee kochen']]
];
const soundPool=soundRows.map(row=>row[0]);
const soundItems=soundRows.map(([answer,audioFile,answers],index)=>({kind:'audio-double',prompt:'Was hörst du?',answer,answers,options:shuffleOptions(answer,soundPool,index,4),audioFile,hint:'Höre auf das typische Geräusch der Aktivität.'}));
Object.assign(task('sound-activity'),{title:'Geräusche erkennen und schreiben',description:'Höre ein Geräusch, wähle die Aktivität und schreibe sie danach selbst.',kind:'audio-double',items:soundItems});

/* Aufgabe 8: ausschließlich die vorgegebenen Verbindungen aus der Lektion. */
const nounVerbPairs=[
 ['Fußball','spielen'],['das Internet','surfen'],['der Hunger','haben'],['der Durst','haben'],['die Freunde','treffen'],['die Gitarre','spielen'],['das Fahrrad','fahren'],['der Spaß','haben'],['die Computerspiele','spielen'],['ins Kino','gehen'],['die Musik','hören'],['der Sport','machen'],['die Krimis','lesen']
];
const verbPool=[...new Set(nounVerbPairs.map(pair=>pair[1]))];
const nounVerbItems=nounVerbPairs.map(([noun,verb],index)=>C(noun,verb,shuffleOptions(verb,verbPool,index,4),'Bilde genau die Verbindung aus der Lektion.',{nounVerbOnly:true}));
Object.assign(task('noun-verb'),{title:'Nomen und Verben aus der Lektion',description:'Links steht der Ausdruck aus der Lektion, rechts nur das passende Verb.',items:nounVerbItems});

/* Aufgabe 9: Redemittel als echte Dialogreaktionen. */
const phraseDialogs=[
 {line:'Kommst du am Samstag mit ins Kino?',answer:'Na klar.',options:['Na klar.','Oh, wie dumm!','Ich weiß es nicht.','Moment mal.']},
 {line:'Ich habe den Würfel zu Hause vergessen.',answer:'Kein Problem.',options:['Kein Problem.','Stimmt.','Auf jeden Fall.','Guck mal.']},
 {line:'Der Bus ist schon weg.',answer:'Oh, wie dumm!',options:['Oh, wie dumm!','Na klar.','Es macht Spaß.','Ja, genau.']},
 {line:'Der neue Film ist wirklich toll.',answer:'Stimmt.',options:['Stimmt.','Leider nicht.','Moment mal.','Ich weiß es nicht.']},
 {line:'Wann beginnt das Konzert?',answer:'Ich weiß es nicht.',options:['Ich weiß es nicht.','Auf jeden Fall.','Na klar.','Es macht Spaß.']},
 {line:'Kommst du nächste Woche zum Grillen?',answer:'Vielleicht.',options:['Vielleicht.','Stimmt.','Oh, wie dumm!','Guck mal.']},
 {line:'Ich komme heute zehn Minuten später.',answer:'Kein Problem.',options:['Kein Problem.','Leider nicht.','Moment mal.','Auf jeden Fall.']},
 {line:'Spielst du nicht gern Tennis?',answer:'Doch, sehr gern.',options:['Doch, sehr gern.','Nein, sehr gern.','Ich weiß es nicht.','Moment mal.']},
 {line:'Macht dir Tanzen Spaß?',answer:'Ja, es macht Spaß.',options:['Ja, es macht Spaß.','Oh, wie dumm!','Leider nicht.','Moment mal.']},
 {line:'Ist das dein Lieblingsfilm?',answer:'Ja, genau.',options:['Ja, genau.','Kein Problem.','Vielleicht.','Guck mal.']},
 {line:'Hast du den Würfel dabei?',answer:'Na klar.',options:['Na klar.','Oh, wie dumm!','Leider nicht.','Ich weiß es nicht.']},
 {line:'Ich glaube, Nina kommt um acht.',answer:'Stimmt.',options:['Stimmt.','Kein Problem.','Es macht Spaß.','Moment mal.']},
 {line:'Wo ist mein Buch?',answer:'Guck mal. Es liegt auf dem Tisch.',options:['Guck mal. Es liegt auf dem Tisch.','Na klar.','Auf jeden Fall.','Leider nicht.']},
 {line:'Du wolltest mich etwas fragen?',answer:'Sag mal, kommst du morgen mit?',options:['Sag mal, kommst du morgen mit?','Oh, wie dumm!','Stimmt.','Es macht Spaß.']},
 {line:'Wir spielen nach dem Essen noch zusammen.',answer:'Das macht Spaß.',options:['Das macht Spaß.','Ich weiß es nicht.','Moment mal.','Leider nicht.']}
];
const phraseItems=phraseDialogs.map((item,index)=>C('Wähle die passende Antwort.',item.answer,item.options,'Welche Reaktion passt zum Sinn des Gesprächs?',{dialog:[D(index%2?'Mara':'Anna',item.line)]}));
Object.assign(task('phrases'),{title:'Passend reagieren',description:'Wähle die passende Antwort im Dialog.',items:phraseItems});

/* Neue Aufgabe: Redemittel hören und selbst reagieren. */
const reactionRows=[
 ['Kommst du am Samstag mit ins Kino?','l6t4-reaktion-01.mp3','Na klar.',['Ja, gern.','Na klar, gern.']],
 ['Ich habe deinen Würfel vergessen.','l6t4-reaktion-02.mp3','Kein Problem.',['Das ist kein Problem.']],
 ['Der Bus ist schon weg.','l6t4-reaktion-03.mp3','Oh, wie dumm!',[]],
 ['Der Film ist wirklich toll.','l6t4-reaktion-04.mp3','Stimmt.',['Ja, das stimmt.']],
 ['Wann beginnt der Film?','l6t4-reaktion-05.mp3','Ich weiß es nicht.',['Das weiß ich nicht.']],
 ['Kommst du nächste Woche zum Grillen?','l6t4-reaktion-06.mp3','Vielleicht.',['Vielleicht komme ich.']],
 ['Spielst du nicht gern Tennis?','l6t4-reaktion-07.mp3','Doch, sehr gern.',['Doch, ich spiele sehr gern Tennis.']],
 ['Macht dir Tanzen Spaß?','l6t4-reaktion-08.mp3','Ja, es macht Spaß.',['Es macht Spaß.']],
 ['Hast du den Würfel dabei?','l6t4-reaktion-09.mp3','Na klar.',['Ja, natürlich.','Ja, ich habe ihn dabei.']],
 ['Ich komme zehn Minuten später.','l6t4-reaktion-10.mp3','Kein Problem.',['Das ist kein Problem.']],
 ['Du hast heute keine Zeit, oder?','l6t4-reaktion-11.mp3','Doch, ich habe Zeit.',['Doch, heute habe ich Zeit.']],
 ['Ist das dein Lieblingsfilm?','l6t4-reaktion-12.mp3','Ja, genau.',['Ja, das ist mein Lieblingsfilm.']],
 ['Hast du morgen Zeit?','l6t4-reaktion-13.mp3','Vielleicht.',['Vielleicht habe ich Zeit.']],
 ['Ich glaube, Nina kommt um acht.','l6t4-reaktion-14.mp3','Stimmt.',['Ja, das stimmt.']],
 ['Möchtest du noch einen Kaffee?','l6t4-reaktion-15.mp3','Nein, danke.',['Nein, vielen Dank.']]
];
const reactionItems=reactionRows.map(([spoken,audioFile,answer,answers])=>({kind:'audio-reaction',prompt:'Höre die Person und antworte passend. Du kannst schreiben oder sprechen.',audioFile,answer,answers,hint:'Antworte mit einem vollständigen, passenden Redemittel.'}));
const reactionTask={id:'phrase-reaction',title:'Hören und passend reagieren',icon:'🎧💬',description:'Höre einen Satz und antworte passend durch Schreiben oder Sprechen.',kind:'audio-reaction',items:reactionItems};

/* Anspruchsvollere Dialoge für die bisherigen Aufgaben 13 und 14. */
const dialogs=[
 {id:'ctx1',lines:[D('Anna','Am Samstag arbeite ich bis 14 Uhr. Danach treffe ich Lea im Café. Am Sonntag möchte ich wandern, aber nur wenn es nicht regnet.'),D('Daniel','Ich habe am Samstag keine Zeit. Am Sonntag fahre ich morgens Fahrrad. Wenn das Wetter schlecht ist, bleibe ich zu Hause und lese einen Krimi.','right')]},
 {id:'ctx2',lines:[D('Mara','Der Film beginnt um 19 Uhr. Ich komme direkt von der Arbeit und schaffe es vielleicht erst um Viertel nach sieben.'),D('Tim','Kein Problem. Ich kaufe die Karten. Bring bitte den Würfel für später mit.','right'),D('Mara','Den Würfel habe ich schon in meiner Tasche.')]},
 {id:'ctx3',lines:[D('Sofia','Ich spiele nicht Gitarre, aber ich höre jeden Tag Musik. Am Freitag möchte ich zu deinem Konzert kommen.'),D('Paul','Das Konzert ist leider am Donnerstag. Am Freitag übe ich mit meiner Gruppe.','right'),D('Sofia','Dann komme ich am Donnerstag.')]},
 {id:'ctx4',lines:[D('Lea','Nächsten Samstag soll es regnen. Wollen wir lieber am Sonntag grillen?'),D('Omar','Am Sonntag besuche ich meine Eltern. Wir können am Samstag in meiner Küche kochen.','right'),D('Lea','Gut. Ich bringe Salat und Brot mit.')]},
 {id:'ctx5',lines:[D('Nina','Ich mag Krimis, aber der neue Film dauert fast drei Stunden. Das ist mir heute zu lang.'),D('Jonas','Dann sehen wir die kurze Komödie. Sie beginnt zwanzig Minuten später.','right'),D('Nina','Gut, dann habe ich vorher noch Zeit für einen Kaffee.')]}];
const byId=id=>dialogs.find(dialog=>dialog.id===id).lines;
const rfRows=[
 ['ctx1','Anna trifft Lea nach ihrer Arbeit.','Richtig'],['ctx1','Daniel wandert am Sonntag mit Anna.','Falsch'],['ctx1','Das Wetter kann die Sonntagspläne verändern.','Richtig'],
 ['ctx2','Tim wartet mit dem Kartenkauf auf Mara.','Falsch'],['ctx2','Mara kommt möglicherweise nach dem Filmbeginn.','Richtig'],['ctx2','Nach dem Film möchten sie wahrscheinlich noch spielen.','Richtig'],
 ['ctx3','Sofia spielt selbst Gitarre.','Falsch'],['ctx3','Sofia ändert nach Pauls Information ihren Plan.','Richtig'],['ctx3','Paul hat am Freitag keine Probe.','Falsch'],
 ['ctx4','Lea und Omar grillen am Sonntag.','Falsch'],['ctx4','Das Wetter ist ein Grund für den neuen Plan.','Richtig'],['ctx4','Omar bringt Salat und Brot mit.','Falsch'],
 ['ctx5','Nina und Jonas wählen den langen Krimi.','Falsch'],['ctx5','Der andere Film beginnt später.','Richtig'],['ctx5','Nina hat vor dem Film keine Zeit für einen Kaffee.','Falsch']
];
const rfItems=rfRows.map(([id,prompt,answer])=>C(prompt,answer,['Richtig','Falsch'],'Verstehe den gesamten Zusammenhang, nicht nur einzelne Wörter.',{dialog:byId(id)}));
Object.assign(task('dialog-rf'),{title:'Dialoge im Kontext: richtig oder falsch',description:'Lies den ganzen Dialog und entscheide nach Sinn und Kontext.',items:rfItems});
const abcRows=[
 ['ctx1','Warum trifft Anna Lea erst am Nachmittag?','Weil sie bis 14 Uhr arbeitet.',['Weil sie bis 14 Uhr arbeitet.','Weil Lea am Vormittag wandert.','Weil es am Samstag regnet.']],
 ['ctx1','Was macht Daniel bei schlechtem Wetter?','Er bleibt zu Hause und liest.',['Er bleibt zu Hause und liest.','Er trifft Lea im Café.','Er fährt trotzdem Fahrrad.']],
 ['ctx1','Welcher Plan findet unabhängig vom Sonntagswetter statt?','Anna trifft Lea im Café.',['Anna trifft Lea im Café.','Anna wandert.','Daniel fährt Fahrrad.']],
 ['ctx2','Warum kauft Tim die Karten?','Mara kommt möglicherweise zu spät.',['Mara kommt möglicherweise zu spät.','Tim kennt den Film nicht.','Mara hat kein Geld dabei.']],
 ['ctx2','Was soll Mara mitbringen?','Den Würfel.',['Den Würfel.','Die Kinokarten.','Einen Kaffee.']],
 ['ctx2','Was machen sie wahrscheinlich nach dem Film?','Sie spielen zusammen.',['Sie spielen zusammen.','Sie gehen arbeiten.','Sie fahren Fahrrad.']],
 ['ctx3','Wann ist Pauls Konzert?','Am Donnerstag.',['Am Donnerstag.','Am Freitag.','Am Samstag.']],
 ['ctx3','Warum kann Paul am Freitag nicht mit Sofia ausgehen?','Er übt mit seiner Gruppe.',['Er übt mit seiner Gruppe.','Er besucht seine Eltern.','Er arbeitet bis 14 Uhr.']],
 ['ctx3','Was ändert Sofia?','Den Tag ihres Konzertbesuchs.',['Den Tag ihres Konzertbesuchs.','Ihr Lieblingshobby.','Pauls Musikgruppe.']],
 ['ctx4','Warum grillen sie nicht wie zuerst geplant?','Weil Regen angekündigt ist.',['Weil Regen angekündigt ist.','Weil Omar keinen Grill hat.','Weil Lea keine Zeit hat.']],
 ['ctx4','Warum passt Sonntag nicht?','Omar besucht seine Eltern.',['Omar besucht seine Eltern.','Lea arbeitet am Sonntag.','Das Café ist geschlossen.']],
 ['ctx4','Was bringt Lea mit?','Salat und Brot.',['Salat und Brot.','Getränke und Ketchup.','Nur einen Würfel.']],
 ['ctx5','Warum möchte Nina den Krimi heute nicht sehen?','Er dauert ihr zu lange.',['Er dauert ihr zu lange.','Sie mag keine Krimis.','Er beginnt zu früh.']],
 ['ctx5','Welchen Film wählen sie?','Die kurze Komödie.',['Die kurze Komödie.','Den langen Krimi.','Keinen Film.']],
 ['ctx5','Warum kann Nina vorher noch Kaffee trinken?','Der andere Film beginnt später.',['Der andere Film beginnt später.','Jonas kauft die Karten morgen.','Das Café liegt im Kino.']]
];
const abcItems=abcRows.map(([id,prompt,answer,options])=>C(prompt,answer,options,'Nutze alle Informationen aus dem Dialog.',{dialog:byId(id)}));
Object.assign(task('dialog-abc'),{title:'Dialoge im Kontext verstehen',description:'Beantworte Fragen, für die du den Sinn und Zusammenhang verstehen musst.',items:abcItems});

/* Aufgabe 15: klare Lücke und logisch passende Reaktionen. */
const gapRows=[
 [D('Anna','Kommst du am Samstag mit ins Kino?'),D('Daniel','___, sehr gern.','right'),'Na klar.',['Na klar.','Oh, wie dumm!','Ich weiß es nicht.','Moment mal.']],
 [D('Mara','Ich habe den Würfel vergessen.'),D('Tim','___, ich habe einen dabei.','right'),'Kein Problem.',['Kein Problem.','Stimmt.','Leider nicht.','Auf jeden Fall.']],
 [D('Sofia','Der Bus ist schon weg.'),D('Paul','___! Dann warten wir auf den nächsten.','right'),'Oh, wie dumm',['Oh, wie dumm','Na klar','Es macht Spaß','Ja, genau']],
 [D('Lea','Der Film war toll.'),D('Omar','___, besonders die Musik.','right'),'Stimmt.',['Stimmt.','Vielleicht.','Moment mal.','Leider nicht.']],
 [D('Nina','Wann beginnt das Konzert?'),D('Jonas','___ Ich gucke kurz im Internet.','right'),'Ich weiß es nicht.',['Ich weiß es nicht.','Na klar.','Auf jeden Fall.','Es macht Spaß.']],
 [D('Anna','Kommst du nächste Woche zum Grillen?'),D('Daniel','___ Ich muss erst meinen Arbeitsplan prüfen.','right'),'Vielleicht.',['Vielleicht.','Stimmt.','Oh, wie dumm!','Guck mal.']],
 [D('Mara','Spielst du nicht gern Tennis?'),D('Tim','___ Ich spiele jeden Samstag.','right'),'Doch, sehr gern.',['Doch, sehr gern.','Nein, sehr gern.','Kein Problem.','Moment mal.']],
 [D('Sofia','Macht dir Wandern Spaß?'),D('Paul','Ja, ___.','right'),'es macht Spaß',['es macht Spaß','ich weiß es nicht','oh wie dumm','leider nicht']],
 [D('Lea','Ist das dein Lieblingsbuch?'),D('Omar','___ Ich lese es schon zum dritten Mal.','right'),'Ja, genau.',['Ja, genau.','Kein Problem.','Vielleicht.','Guck mal.']],
 [D('Nina','Ich komme heute zehn Minuten später.'),D('Jonas','___ Ich warte vor dem Kino.','right'),'Kein Problem.',['Kein Problem.','Leider nicht.','Oh, wie dumm!','Ich weiß es nicht.']],
 [D('Anna','Hast du den Würfel dabei?'),D('Daniel','___ Er ist in meiner Tasche.','right'),'Na klar.',['Na klar.','Vielleicht.','Stimmt.','Leider nicht.']],
 [D('Mara','Ich glaube, der Film beginnt um acht.'),D('Tim','___ Auf der Karte steht auch acht Uhr.','right'),'Stimmt.',['Stimmt.','Kein Problem.','Moment mal.','Oh, wie dumm!']],
 [D('Sofia','Wo ist meine Gitarre?'),D('Paul','___ Sie steht neben dem Schrank.','right'),'Guck mal.',['Guck mal.','Na klar.','Auf jeden Fall.','Leider nicht.']],
 [D('Lea','Du wolltest mich etwas fragen?'),D('Omar','___ Kommst du am Sonntag mit?','right'),'Sag mal.',['Sag mal.','Stimmt.','Es macht Spaß.','Oh, wie dumm!']],
 [D('Nina','Wir spielen nach dem Essen zusammen.'),D('Jonas','Super, ___.','right'),'das macht Spaß',['das macht Spaß','ich weiß es nicht','leider nicht','Moment mal']]
];
const gapItems=gapRows.map(([first,second,answer,options])=>C('Wähle die passende Reaktion für die Lücke im Dialog.',answer,options,'Die Ergänzung muss grammatisch und inhaltlich in die markierte Lücke passen.',{dialog:[first,second]}));
Object.assign(task('gaps'),{title:'Dialoge sinnvoll ergänzen',description:'Die Lücke ist mit ___ markiert. Wähle die Reaktion, die grammatisch und inhaltlich passt.',items:gapItems});

/* Bisherige Aufgabe 18: nur Audiodatei und Frage, keine Transkripte im Programm. */
const listeningRows=[
 ['l6t4-hoeren-01.mp3','Was macht Nina am Freitag?','Sie trifft Freunde.',['Sie trifft Freunde.','Sie strickt.','Sie spielt Tennis.']],
 ['l6t4-hoeren-02.mp3','Was macht Tim nie?','Er fährt nie Fahrrad.',['Er fährt nie Fahrrad.','Er wandert nie.','Er grillt nie.']],
 ['l6t4-hoeren-03.mp3','Was ist Marias Lieblingshobby?','Gitarre spielen.',['Gitarre spielen.','Schwimmen.','Grillen.']],
 ['l6t4-hoeren-04.mp3','Wann grillt Familie Ali?','Nächsten Samstag.',['Nächsten Samstag.','Am Montag.','Heute.']],
 ['l6t4-hoeren-05.mp3','Hat Omar den Würfel dabei?','Ja.',['Ja.','Nein.','Das weiß man nicht.']],
 ['l6t4-hoeren-06.mp3','Wie findet Lea den Film?','Toll.',['Toll.','Langweilig.','Schlecht.']],
 ['l6t4-hoeren-07.mp3','Was macht Daniel am Sonntag?','Er wandert.',['Er wandert.','Er arbeitet.','Er grillt.']],
 ['l6t4-hoeren-08.mp3','Wie oft surft Sofia im Internet?','Manchmal.',['Immer.','Manchmal.','Nie.']],
 ['l6t4-hoeren-09.mp3','Was nimmt Paul?','Einen Kaffee.',['Einen Kaffee.','Einen Tee.','Eine Cola.']],
 ['l6t4-hoeren-10.mp3','Warum kommt Mara nicht mit?','Sie hat keine Zeit.',['Sie hat keine Zeit.','Sie hat Hunger.','Sie findet den Film schlecht.']],
 ['l6t4-hoeren-11.mp3','Was ist Jonas von Beruf?','Koch.',['Koch.','Verkäufer.','Lehrer.']],
 ['l6t4-hoeren-12.mp3','Welche Farbe mag Nina besonders?','Blau.',['Blau.','Rot.','Grün.']],
 ['l6t4-hoeren-13.mp3','Wann kommt Anna?','Gleich.',['Gleich.','Nächste Woche.','Nächsten Samstag.']],
 ['l6t4-hoeren-14.mp3','Was machen Lea und Omar?','Sie spielen mit einem Würfel.',['Sie spielen mit einem Würfel.','Sie fahren Fahrrad.','Sie hören Musik.']],
 ['l6t4-hoeren-15.mp3','Was macht Tim selten?','Er guckt Filme.',['Er guckt Filme.','Er trifft Freunde.','Er schwimmt.']]
];
const listeningItems=listeningRows.map(([audioFile,prompt,answer,options])=>({kind:'audio-choice',audioFile,prompt,answer,options,hint:'Höre den Dialog noch einmal und achte auf den Zusammenhang.'}));
Object.assign(task('listen-abc'),{title:'Hörverstehen: kurze Dialoge',description:'Höre den Dialog. Die Transkription wird in der Aufgabe nicht angezeigt.',items:listeningItems});

/* Aufgabe 19: zwei Bunny-Bilder für die zwei Bedeutungen von finden. */
const findenOptions=[
 {label:'suchen oder entdecken',image:'finden-entdecken.webp'},
 {label:'eine Meinung sagen',image:'finden-meinung.webp'}
];
const findenRows=[
 ['Ich finde meinen Schlüssel nicht.','suchen oder entdecken'],['Ich finde den Film toll.','eine Meinung sagen'],['Mara findet ihr Buch unter dem Tisch.','suchen oder entdecken'],['Wie findest du das Lied?','eine Meinung sagen'],['Tim findet sein Fahrrad vor der Schule.','suchen oder entdecken'],['Wir finden Grillen toll.','eine Meinung sagen'],['Wo finde ich die Informationen?','suchen oder entdecken'],['Ich finde den Beruf interessant.','eine Meinung sagen'],['Anna findet ihren Würfel in der Tasche.','suchen oder entdecken'],['Wie findest du das Wetter heute?','eine Meinung sagen'],['Paul findet seine Freunde im Park.','suchen oder entdecken'],['Ich finde Wandern sehr schön.','eine Meinung sagen'],['Lea findet die Gitarre im Zimmer.','suchen oder entdecken'],['Wie findet Maria den Krimi?','eine Meinung sagen'],['Omar findet sein Buch nicht.','suchen oder entdecken']
];
const findenItems=findenRows.map(([prompt,answer])=>({kind:'image-choice',prompt,answer,options:findenOptions,hint:'Wähle das Bild für die passende Bedeutung von „finden“.',meaningImages:true}));
Object.assign(task('finden'),{title:'finden: zwei Bedeutungen mit Bildern',description:'Lies den Satz und wähle eines der zwei Bedeutungsbilder.',items:findenItems});

/* Offene Schreibaufgaben entfernen: eine zuverlässige Grammatik- und Inhaltsbewertung ist ohne Sprachmodell nicht möglich. */
data.tasks=data.tasks.filter(item=>!['write-dialog','profile'].includes(item.id));
const phraseIndex=data.tasks.findIndex(item=>item.id==='phrases');
if(phraseIndex>=0)data.tasks.splice(phraseIndex+1,0,reactionTask);

/* Prüfung ohne unkontrollierte offene Texte. */
const exam=task('exam');
if(exam){
 exam.title='Themenprüfung';
 exam.description='15 geschlossene und eindeutig kontrollierbare Aufgaben.';
 exam.items=[
  task('word-image').items[0],articleItems.find(item=>item.prompt==='___ Hobby')||articleItems[0],
  C('Plural: das Fahrrad','die Fahrräder',['die Fahrräder','die Fahrrade','der Fahrräder'],'Achte auf Artikel und Umlaut.'),
  nounVerbItems[0],phraseItems[0],task('nehmen').items[0],task('yes-no-doch').items[1],task('doch-answer').items[0],
  rfItems[1],abcItems[3],gapItems[0],task('finden').items[1],task('questions').items[0],task('singular-plural').items[1],articleItems.find(item=>item.prompt==='___ Freizeit')||articleItems[1]
 ];
}

data.soundActivities=soundRows.map(([activity,file],index)=>({index:index+1,activity,file}));
data.reactionAudio=reactionRows.map(([spoken,file,answer,answers],index)=>({index:index+1,spoken,file,answer,answers}));
data.findenImages={discover:'finden-entdecken.webp',opinion:'finden-meinung.webp'};
})();