(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const media=id=>({image:`${CDN}${id}.webp`,audio:`${AUDIO}${id}.mp3`});
const card=(id,word,opts={})=>({id,word,full:opts.full||word,article:opts.article||'',plural:opts.plural||'',type:opts.type||'word',example:opts.example||'',meaning:opts.meaning||'',answers:[opts.full||word],...media(id)});

const cards=[
 card('leiser','leiser',{type:'adverb',example:'Sprich bitte leiser.',meaning:'Nicht so laut. Die Stimme oder ein Geräusch soll weniger laut sein.'}),
 card('erklaeren','erklären',{type:'verb',example:'Erklären Sie das bitte noch einmal.',meaning:'Man sagt etwas so, dass eine andere Person es besser verstehen kann.'}),
 card('laut','laut',{type:'adverb',example:'Sprich bitte nicht so laut.',meaning:'Mit viel Lautstärke. Man kann es deutlich hören.'}),
 card('ausmachen','ausmachen',{type:'verb',example:'Mach bitte das Handy aus.',meaning:'Ein Gerät oder Licht ausschalten. Danach ist es nicht mehr an.'}),
 card('zuhoeren','zuhören',{type:'verb',example:'Hör bitte zu.',meaning:'Man hört aufmerksam, was eine andere Person sagt.'}),
 card('aufstehen','aufstehen',{type:'verb',example:'Steh bitte auf.',meaning:'Man sitzt oder liegt und kommt dann nach oben auf die Füße.'}),
 card('warten','warten',{type:'verb',example:'Warten Sie bitte hier.',meaning:'Man bleibt eine Zeit lang, bis etwas passiert oder jemand kommt.'}),
 card('gebuehr','Gebühr',{type:'noun',article:'die',full:'die Gebühr',plural:'die Gebühren',example:'Die Gebühr ist 50 Euro.',meaning:'Geld, das man für eine bestimmte Leistung oder einen offiziellen Vorgang bezahlt.'}),
 card('kasse','Kasse',{type:'noun',article:'die',full:'die Kasse',plural:'die Kassen',example:'Bezahlen Sie bitte an der Kasse.',meaning:'Der Ort, an dem man bezahlt.'}),
 card('lachen','lachen',{type:'verb',example:'Die Kursteilnehmer lachen.',meaning:'Man zeigt mit Stimme und Gesicht, dass etwas lustig ist oder man sich freut.'}),
 card('aufhoeren','aufhören',{type:'verb',example:'Hör bitte auf.',meaning:'Man beendet eine Handlung und macht nicht weiter.'}),
 card('doch','doch',{type:'modalpartikel',example:'Komm doch bitte rein.',meaning:'Ein kleines Wort, das eine Bitte oder Aufforderung freundlicher oder nachdrücklicher machen kann.'}),
 card('bitte','bitte',{type:'modalpartikel',example:'Warten Sie bitte hier.',meaning:'Ein höfliches Wort für Bitten und Aufforderungen.'}),
 card('mal','mal',{type:'modalpartikel',example:'Hör mal zu.',meaning:'Ein kleines Wort, das eine Aufforderung im Alltag oft natürlicher und lockerer macht.'}),
 card('anmeldung','Anmeldung',{type:'noun',article:'die',full:'die Anmeldung',plural:'die Anmeldungen',example:'Die Anmeldung ist im ersten Stock.',meaning:'Man meldet sich offiziell für etwas an und gibt dafür seine Daten an.'}),
 card('kursgebuehr','Kursgebühr',{type:'noun',article:'die',full:'die Kursgebühr',plural:'die Kursgebühren',example:'Die Kursgebühr bezahlt man an der Kasse.',meaning:'Das Geld, das man für einen Kurs bezahlen muss.'}),
 card('stock','Stock',{type:'noun',article:'der',full:'der Stock',plural:'die Stockwerke',example:'Der Unterricht ist im zweiten Stock.',meaning:'Eine Etage in einem Gebäude.'}),
 card('unterricht','Unterricht',{type:'noun',article:'der',full:'der Unterricht',plural:'kein Plural',example:'Der Unterricht beginnt um neun.',meaning:'Die Zeit, in der eine Lehrkraft mit Lernenden arbeitet und etwas erklärt oder übt.'}),
 card('sprachschule','Sprachschule',{type:'noun',article:'die',full:'die Sprachschule',plural:'die Sprachschulen',example:'Ich lerne Deutsch in einer Sprachschule.',meaning:'Eine Schule, in der man eine Sprache lernt.'})
];

window.L9T2={
 title:'Mach das bitte!',
 cards,
 tasks:[{id:'karteikarten',kind:'cards',title:'Karteikarten',description:'Lerne die Wörter.',instruction:'Lerne die Wörter.',icon:'🃏'}]
};
})();