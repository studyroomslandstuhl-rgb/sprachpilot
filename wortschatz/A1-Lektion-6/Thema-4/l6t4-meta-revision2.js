(function(){
'use strict';
const meta=[
 {id:'cards',number:'1',title:'Karteikarten',icon:'🃏',description:'Wörter mit Bunny-Bildern lernen.'},
 {id:'image-word',number:'2',title:'Bedeutung → Wort',icon:'💡',description:'Bedeutung lesen und Wort wählen.'},
 {id:'word-image',number:'3',title:'Bild → Wort',icon:'🖼️',description:'Bunny-Bild ansehen und Wort wählen.'},
 {id:'listen-image',number:'4',title:'Hören → Bild',icon:'🎧',description:'Wort hören und eines von vier Bunny-Bildern wählen.'},
 {id:'article',number:'5',title:'Nomen aus Lektion 6',icon:'der',description:'Nomen aus Lektion 6 ohne Komposita.'},
 {id:'plural',number:'6',title:'Plural: Nomen aus Lektion 6',icon:'🎤',description:'Pluralformen ohne Komposita.',external:'plural-sprechen.html'},
 {id:'sound-activity',number:'7',title:'Geräusche erkennen und schreiben',icon:'🔉',description:'Geräusch hören, Aktivität wählen und anschließend schreiben.'},
 {id:'noun-verb',number:'8',title:'Nomen und Verben aus der Lektion',icon:'↔️',description:'Nur die vorgegebenen Verbindungen aus Lektion 6.'},
 {id:'phrases',number:'9',title:'Passend reagieren',icon:'💬',description:'Wähle die passende Antwort im Dialog.'},
 {id:'phrase-reaction',number:'10',title:'Hören und passend reagieren',icon:'🎧💬',description:'Höre einen Satz und antworte durch Schreiben oder Sprechen.'},
 {id:'nehmen',number:'11',title:'nehmen in Dialogen',icon:'☕',description:'Formen von nehmen üben.'},
 {id:'yes-no-doch',number:'12',title:'ja, nein oder doch?',icon:'↩️',description:'Passende Kurzantworten wählen.'},
 {id:'doch-answer',number:'13',title:'Mit doch antworten',icon:'DOCH',description:'Name oder passendes Pronomen wird akzeptiert.'},
 {id:'dialog-rf',number:'14',title:'Dialoge im Kontext: richtig oder falsch',icon:'✓✗',description:'Nicht nur Wörter, sondern Sinn und Zusammenhang verstehen.'},
 {id:'dialog-abc',number:'15',title:'Dialoge im Kontext verstehen',icon:'ABC',description:'Fragen zum Zusammenhang der Dialoge beantworten.'},
 {id:'gaps',number:'16',title:'Dialoge sinnvoll ergänzen',icon:'▤',description:'Die deutlich markierte Lücke passend ergänzen.'},
 {id:'listen-abc',number:'17',title:'Hörverstehen: kurze Dialoge',icon:'🎧',description:'Dialoge aus Bunny Storage hören und Fragen beantworten.'},
 {id:'finden',number:'18',title:'finden: zwei Bedeutungen',icon:'🔍',description:'Zwischen zwei Bunny-Bildern für die Bedeutungen wählen.'},
 {id:'questions',number:'19',title:'Hobbys und Lieblingssachen',icon:'❓',description:'Fragen und Antworten zuordnen.'},
 {id:'singular-plural',number:'20',title:'Hobby: Singular und Plural',icon:'1↔2',description:'Hobby, Hobbys und Lieblingssachen üben.'},
 {id:'exam',number:'21',title:'Themenprüfung',icon:'⭐',description:'15 eindeutig kontrollierbare Aufgaben.'}
];
function build(entry){
 const current=window.L6T4_DATA?.tasks?.find(item=>item.id===entry.id);
 const file=entry.external||`task.html?task=${encodeURIComponent(entry.id)}`;
 const key=entry.external||`task-${entry.id}`;
 const total=entry.id==='plural'?(window.L6T4PluralItems?.length||0):(current?.items?.length||0);
 return{...entry,file,key,total,exam:entry.id==='exam'};
}
try{L6T4_META.splice(0,L6T4_META.length,...meta)}catch(e){}
try{L6T4_TASKS.splice(0,L6T4_TASKS.length,...meta.map(build))}catch(e){}
})();