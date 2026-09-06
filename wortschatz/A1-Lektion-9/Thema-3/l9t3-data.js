(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const media=id=>({image:`${CDN}${id}.webp`,audio:`${AUDIO}${id}.mp3`});
const noun=(id,article,word,plural,meaning,example)=>({id,article,word,full:`${article} ${word}`,plural,type:'noun',meaning,example,...media(id)});
const word=(id,value,type,meaning,opts={})=>({id,word:value,full:value,article:'',plural:'',perfect:opts.perfect||'',type,meaning,example:opts.example||'',...media(id),...(opts.media||{})});
const cards=[
 word('duerfen','dürfen','modal','Dieses Modalverb sagt: Etwas ist erlaubt oder nicht erlaubt.',{perfect:'hat gedurft',example:'Darf man hier parken?'}),
 word('international','international','adjective','Etwas betrifft mehrere Länder oder Menschen aus mehreren Ländern.',{example:'Das ist ein internationaler Flughafen.'}),
 word('beantragen','beantragen','verb','Man bittet eine Behörde offiziell um etwas.',{perfect:'hat beantragt',example:'Ich möchte ein Visum beantragen.'}),
 noun('zigarette','die','Zigarette','die Zigaretten','Etwas mit Tabak, das man raucht.','Hier darf man keine Zigarette rauchen.'),
 word('ausmachen','ausmachen','verb','Man schaltet ein Gerät oder Licht aus.',{perfect:'hat ausgemacht',example:'Machen Sie bitte das Handy aus.'}),
 word('langsam','langsam','adverb','Nicht schnell.',{example:'Fahren Sie bitte langsam.'}),
 noun('parkplatz','der','Parkplatz','die Parkplätze','Ein Platz, auf dem ein Auto stehen darf.','Hier ist ein Parkplatz.'),
 word('parken','parken','verb','Man stellt ein Auto für eine Zeit an einen Platz.',{perfect:'hat geparkt',example:'Darf man hier parken?'}),
 word('abgeben','abgeben','verb','Man gibt etwas einer Person oder Stelle und lässt es dort.',{perfect:'hat abgegeben',example:'Man muss das Gepäck abgeben.'}),
 noun('laptop','der','Laptop','die Laptops','Ein tragbarer Computer.','Der Laptop ist im Gepäck.'),
 noun('gepaeck','das','Gepäck','kein Plural','Koffer und Taschen, die man auf einer Reise mitnimmt.','Das Gepäck ist schwer.'),
 word('rauchen','rauchen','verb','Man benutzt eine Zigarette und atmet den Rauch ein.',{perfect:'hat geraucht',example:'Man darf hier nicht rauchen.'}),
 noun('moment','der','Moment','die Momente','Eine sehr kurze Zeit.','Einen Moment, bitte.'),
 word('achtung','Achtung!','interjection','Ein Warnwort: Man soll gut aufpassen.',{example:'Achtung! Hier darf man nicht rauchen.'}),
 word('erlaubt','erlaubt','adjective','Man darf etwas machen.',{example:'Parken ist hier erlaubt.'}),
 word('verboten','verboten','adjective','Man darf etwas nicht machen.',{example:'Rauchen ist hier verboten.'}),
 word('gepaeck_abgeben','Gepäck abgeben','phrase','Man gibt sein Gepäck an einer Stelle ab und nimmt es nicht mit.',{perfect:'hat Gepäck abgegeben',example:'Man muss das Gepäck abgeben.',media:{image:`${CDN}abgeben.webp`,audio:''}}),
 word('mitnehmen','mitnehmen','verb','Man nimmt etwas oder jemanden mit sich.',{perfect:'hat mitgenommen',example:'Darf ich den Laptop mitnehmen?'}),
 noun('regel','die','Regel','die Regeln','Eine Information darüber, was man machen darf, muss oder nicht darf.','Bitte beachten Sie die Regeln.')
];
const nouns=cards.filter(x=>x.type==='noun');
const label=x=>x.full||x.word;
const pluralOnly=x=>/^kein plural$/i.test(x.plural||'')?'kein Plural':String(x.plural||'').replace(/^die\s+/i,'');
const forms=[
 {id:'df1',pronoun:'ich',answer:'darf'},{id:'df2',pronoun:'du',answer:'darfst'},{id:'df3',pronoun:'er / sie / es',answer:'darf'},{id:'df4',pronoun:'wir',answer:'dürfen'},{id:'df5',pronoun:'ihr',answer:'dürft'},{id:'df6',pronoun:'sie / Sie',answer:'dürfen'},{id:'df7',pronoun:'man',answer:'darf'}
];
const gaps=[
 ['g01','Hier', 'man nicht', 'darf','rauchen','rauchen'],['g02','Auf diesem Parkplatz','du heute', 'darfst','parken','parken'],['g03','Im Flugzeug','man den Laptop', 'darf','mitnehmen','laptop'],['g04','Am Schalter','ich meinen Antrag', 'darf','abgeben','abgeben'],['g05','Im Unterricht','ihr nicht laut', 'dürft','lachen','lachen'],
 ['g06','Im Wartebereich','wir leise', 'dürfen','sprechen','leise'],['g07','Hier','Sie das Handy nicht', 'dürfen','benutzen','ausmachen'],['g08','Auf dem Parkplatz','er eine Stunde', 'darf','warten','parkplatz'],['g09','Bei der Kontrolle','man das Gepäck nicht', 'darf','öffnen','gepaeck'],['g10','Im Amt','du eine Frage', 'darfst','stellen','amt'],
 ['g11','Im Zug','wir den Laptop', 'dürfen','benutzen','laptop'],['g12','Vor der Tür','ihr nicht', 'dürft','rauchen','zigarette'],['g13','Bei der Autovermietung','Sie das Auto hier', 'dürfen','parken','autovermietung'],['g14','Am Automaten','man das Ticket', 'darf','nehmen','ticket'],['g15','Im Kurs','ich kurz', 'darf','aufstehen','unterricht'],
 ['g16','Im Wartebereich','du hier', 'darfst','warten','wartebereich'],['g17','Bei der Behörde','wir die Unterlagen', 'dürfen','abgeben','unterlagen'],['g18','Im Gebäude','man nur langsam', 'darf','gehen','langsam'],['g19','Hier','die Kinder nicht allein', 'dürfen','warten','regel'],['g20','Nach der Kontrolle','ihr euer Gepäck', 'dürft','mitnehmen','gepaeck']
].map(x=>({id:x[0],left:x[1],middle:x[2],modal:x[3],verb:x[4],image:`${CDN}${x[5]}.webp`,hint:'Achte auf das Subjekt und auf den Infinitiv am Satzende.'}));
const builders=[
 ['b01',['man','hier','dürfen','rauchen'],'Man darf hier rauchen.'],['b02',['du','hier','nicht','dürfen','parken'],'Du darfst hier nicht parken.'],['b03',['wir','den Laptop','dürfen','mitnehmen'],'Wir dürfen den Laptop mitnehmen.'],['b04',['ihr','im Wartebereich','dürfen','warten'],'Ihr dürft im Wartebereich warten.'],['b05',['Sie','das Gepäck','dürfen','abgeben'],'Sie dürfen das Gepäck abgeben.'],
 ['b06',['ich','eine Frage','dürfen','stellen'],'Ich darf eine Frage stellen.'],['b07',['er','hier','nicht','dürfen','rauchen'],'Er darf hier nicht rauchen.'],['b08',['man','auf diesem Parkplatz','dürfen','parken'],'Man darf auf diesem Parkplatz parken.'],['b09',['du','das Handy','dürfen','ausmachen'],'Du darfst das Handy ausmachen.'],['b10',['wir','hier','nicht laut','dürfen','sprechen'],'Wir dürfen hier nicht laut sprechen.'],
 ['b11',['ihr','die Unterlagen','dürfen','mitnehmen'],'Ihr dürft die Unterlagen mitnehmen.'],['b12',['Sie','im Gebäude','dürfen','warten'],'Sie dürfen im Gebäude warten.'],['b13',['man','das Ticket','dürfen','nehmen'],'Man darf das Ticket nehmen.'],['b14',['ich','den Antrag','dürfen','beantragen'],'Ich darf den Antrag beantragen.'],['b15',['du','den Führerschein','dürfen','zeigen'],'Du darfst den Führerschein zeigen.'],
 ['b16',['wir','das Auto','hier','dürfen','parken'],'Wir dürfen das Auto hier parken.'],['b17',['ihr','nicht','dürfen','lachen'],'Ihr dürft nicht lachen.'],['b18',['Sie','langsam','dürfen','fahren'],'Sie dürfen langsam fahren.'],['b19',['man','das Dokument','dürfen','abholen'],'Man darf das Dokument abholen.'],['b20',['er','das Gepäck','dürfen','mitnehmen'],'Er darf das Gepäck mitnehmen.']
].map(x=>({id:x[0],chunks:x[1],answer:x[2]}));
const modalItems=[
 ['m01','Ich habe morgen einen Termin. Ich ___ meinen Ausweis mitbringen.','muss'],['m02','Hier ist Rauchen verboten. Man ___ hier nicht rauchen.','darf'],['m03','Anna hat einen Plan: Sie ___ morgen ein Auto mieten.','will'],['m04','Im Café: Ich ___ bitte einen Kaffee.','möchte'],['m05','Paul fährt gern Auto. Er ___ lange Fahrten.','mag'],['m06','Mira spricht drei Sprachen. Sie ___ gut Deutsch sprechen.','kann'],
 ['m07','Wir haben gleich einen Termin. Wir ___ jetzt losfahren.','müssen'],['m08','Auf diesem Parkplatz ist Parken erlaubt. Ihr ___ hier parken.','dürft'],['m09','Tom hat beschlossen: Er ___ den Antrag heute stellen.','will'],['m10','Am Schalter: Ich ___ eine Auskunft.','möchte'],['m11','Die Kinder essen gern Eis. Sie ___ Eis.','mögen'],['m12','Der Automat funktioniert. Man ___ hier ein Ticket kaufen.','kann'],
 ['m13','Du hast morgen Prüfung. Du ___ heute lernen.','musst'],['m14','Der Laptop ist erlaubt. Du ___ ihn mitnehmen.','darfst'],['m15','Wir planen eine Reise. Wir ___ nach Berlin fahren.','wollen'],['m16','Was ___ Sie trinken?','möchten'],['m17','Meine Mutter trinkt gern Tee. Sie ___ Tee.','mag'],['m18','Ich habe genug Geld. Ich ___ die Gebühr bar bezahlen.','kann'],
 ['m19','Das Gepäck ist zu schwer. Wir ___ es abgeben.','müssen'],['m20','Hier ist Fotografieren verboten. Sie ___ hier nicht fotografieren.','dürfen']
].map(x=>({id:x[0],prompt:x[1],answer:x[2],options:['kann','können','will','wollen','möchte','möchten','mag','mögen','muss','müssen','darf','darfst','dürft','dürfen'],hint:'Achte auf Bedeutung und Subjekt.'}));
const dialogModal={
 id:'dialog-modal',title:'Zwei Freundinnen planen den Tag',
 lines:[
  {speaker:'Mia',text:'Ich ___ heute zur Behörde gehen. Mein Ausweis ist fertig.',answer:'muss',options:['muss','darf','will','kann']},
  {speaker:'Lina',text:'Ich ___ mitkommen, wenn du möchtest.',answer:'kann',options:['muss','darf','will','kann']},
  {speaker:'Mia',text:'Super. Danach ___ ich noch eine Fahrkarte kaufen.',answer:'will',options:['muss','darf','will','kann']},
  {speaker:'Lina',text:'Am neuen Automaten ___ man auch mit Karte bezahlen.',answer:'kann',options:['muss','darf','will','kann']},
  {speaker:'Mia',text:'Gut. Aber im Amt ___ man nicht laut telefonieren.',answer:'darf',options:['muss','darf','will','kann'],neg:true},
  {speaker:'Lina',text:'Dann ___ wir unsere Handys ausmachen.',answer:'müssen',options:['müssen','dürfen','wollen','können']},
  {speaker:'Mia',text:'Nach dem Termin ___ wir noch einen Kaffee trinken.',answer:'können',options:['müssen','dürfen','wollen','können']},
  {speaker:'Lina',text:'Ja, ich ___ unbedingt ins neue Café gehen.',answer:'will',options:['muss','darf','will','kann']}
 ]
};
const readings=[
 {id:'r1',title:'Regeln in der Bibliothek',text:'In der Bibliothek ist leises Sprechen erlaubt. Telefonieren ist in den Lesebereichen verboten. Taschen dürfen mitgenommen werden, aber Essen und Rauchen sind nicht erlaubt. Bücher muss man vor dem Verlassen an der Kasse ausleihen.',questions:[
  ['r1q1','Darf man leise sprechen?','Ja'],['r1q2','Darf man im Lesebereich telefonieren?','Nein'],['r1q3','Darf man Taschen mitnehmen?','Ja'],['r1q4','Darf man dort rauchen?','Nein'],['r1q5','Muss man Bücher vor dem Verlassen ausleihen?','Ja'],['r1q6','Darf man dort essen?','Nein']
 ]},
 {id:'r2',title:'Regeln im Schwimmbad',text:'Vor dem Schwimmen muss man duschen. Im Schwimmbad sind Glasflaschen verboten. Kinder dürfen nur mit einer erwachsenen Person ins tiefe Becken. Fotografieren ist nur mit Erlaubnis erlaubt. Im Wartebereich darf man essen.',questions:[
  ['r2q1','Muss man vor dem Schwimmen duschen?','Ja'],['r2q2','Darf man Glasflaschen mitbringen?','Nein'],['r2q3','Dürfen Kinder allein ins tiefe Becken?','Nein'],['r2q4','Darf man immer fotografieren?','Nein'],['r2q5','Darf man mit Erlaubnis fotografieren?','Ja'],['r2q6','Darf man im Wartebereich essen?','Ja']
 ]},
 {id:'r3',title:'Regeln im Bürgeramt',text:'Besucher müssen zuerst ihre Nummer nehmen und im Wartebereich warten. Rauchen und lautes Telefonieren sind im Gebäude verboten. Dokumente dürfen am Schalter abgegeben werden. Für einige Anträge muss man einen gültigen Ausweis zeigen.',questions:[
  ['r3q1','Muss man zuerst eine Nummer nehmen?','Ja'],['r3q2','Darf man im Gebäude rauchen?','Nein'],['r3q3','Darf man laut telefonieren?','Nein'],['r3q4','Darf man Dokumente am Schalter abgeben?','Ja'],['r3q5','Muss man im Wartebereich warten?','Ja'],['r3q6','Muss man für einige Anträge einen Ausweis zeigen?','Ja']
 ]}
].map(r=>({...r,questions:r.questions.map(q=>({id:q[0],prompt:q[1],answer:q[2],options:['Ja','Nein']}))}));
const tasks=[
 {id:'karteikarten',kind:'cards',title:'Karteikarten',description:'Lerne die Wörter.',icon:'🃏'},
 {id:'wort-bild',kind:'word-image',title:'Wort & Bild',description:'Wähle das richtige Bild.',icon:'🖼️'},
 {id:'hoeren-schreiben',kind:'audio-write',title:'Hören & Schreiben',description:'Höre und schreibe das Wort.',icon:'🎧'},
 {id:'bedeutung',kind:'meaning-choice',title:'Bedeutung',description:'Wähle die richtige Bedeutung.',icon:'🧠'},
 {id:'artikel-wort',kind:'article-word',title:'Artikel & Wort',description:'Schreibe Artikel und Wort.',icon:'🏷️'},
 {id:'plural',kind:'plural-write',title:'Plural',description:'Schreibe die Pluralform.',icon:'🔤'},
 {id:'duerfen-tabelle',kind:'conjugation-table',title:'dürfen konjugieren',description:'Konjugiere dürfen.',icon:'📊'},
 {id:'duerfen-verb',kind:'gap-two',title:'dürfen + Verb',description:'Ergänze dürfen und das Verb.',icon:'🧩'},
 {id:'satz-bauen',kind:'build-sentence',title:'Sätze bauen',description:'Bilde den richtigen Satz.',icon:'🧱'},
 {id:'modalverb',kind:'modal-choice',title:'Welches Modalverb?',description:'Wähle das passende Modalverb.',icon:'💡'},
 {id:'dialog-modal',kind:'dialog-modal',title:'Dialog: Modalverben',description:'Ergänze die Modalverben.',icon:'💬'},
 {id:'regeln-lesen',kind:'reading-rules',title:'Regeln lesen',description:'Lies und beantworte die Fragen.',icon:'📚'},
 {id:'pruefung',kind:'exam',title:'Prüfung',description:'Zeig, was du kannst.',icon:'🏆',exam:true}
];
window.L9T3={title:'Was darf man?',cards,nouns,forms,gaps,builders,modalItems,dialogModal,readings,tasks,label,pluralOnly};
window.L9_T3_WORDS=cards;
if(window.L9_THEMES?.[3]){window.L9_THEMES[3].coreVocabulary=cards;window.L9_THEMES[3].tasks=tasks;window.L9_THEMES[3].title='Was darf man?';window.L9_THEMES[3].subtitle='dürfen · erlaubt und verboten · Regeln';window.L9_THEMES[3].chips=['dürfen','erlaubt','verboten','Regeln'];}
})();