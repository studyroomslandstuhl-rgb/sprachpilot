(function(){
'use strict';
const meta=[
 {id:'cards',number:'1',title:'Karteikarten',icon:'🃏',description:'Wörter mit Bunny-Bildern lernen.'},
 {id:'image-word',number:'2',title:'Bedeutung → Wort',icon:'💡',description:'Bedeutung lesen und Wort wählen.'},
 {id:'word-image',number:'3',title:'Bild → Wort',icon:'🖼️',description:'Bunny-Bild ansehen und Wort wählen.'},
 {id:'listen-image',number:'4',title:'Hören → Bild',icon:'🎧',description:'Wort hören und eines von vier Bunny-Bildern wählen.'},
 {id:'article',number:'5',title:'Artikel',icon:'der',description:'Wähle der, die, das oder kein Artikel.'},
 {id:'plural',number:'6',title:'Plural',icon:'🎤',description:'Bilde die Pluralformen.',external:'plural-sprechen.html'},
 {id:'sound-activity',number:'7',title:'Hören und Erkennen',icon:'🔉',description:'Höre ein Geräusch und erkenne die Aktivität.'},
 {id:'noun-verb',number:'8',title:'Nomen-Verb-Verbindungen',icon:'↔️',description:'Ordne passende Nomen und Verben zu.'},
 {id:'nehmen',number:'9',title:'Verb „nehmen“',icon:'☕',description:'Übe die Formen von nehmen.'},
 {id:'yes-no-doch',number:'10',title:'Ja, Nein oder Doch',icon:'↩️',description:'Wähle die passende Kurzantwort.'},
 {id:'doch-answer',number:'11',title:'Doch',icon:'DOCH',description:'Antworte passend mit doch.'},
 {id:'dialog-rf',number:'12',title:'Dialoge – richtig oder falsch',icon:'✓✗',description:'Verstehe Sinn und Zusammenhang der Dialoge.'},
 {id:'dialog-abc',number:'13',title:'Dialoge',icon:'🎧',description:'Höre einen Dialog und beantworte alle drei Fragen.',external:'dialoge.html?v=l6t4-dialoge2',key:'task-dialog-abc',total:5},
 {id:'phrases',number:'14',title:'Reagieren',icon:'💬',description:'Wähle die passende Reaktion.'},
 {id:'gaps',number:'15',title:'Dialoge ergänzen',icon:'▤',description:'Ergänze die deutlich markierte Lücke.'},
 {id:'listen-abc',number:'16',title:'Hören und Verstehen',icon:'🎧',description:'Höre und beantworte die Frage.'},
 {id:'phrase-reaction',number:'17',title:'Hören und Reagieren',icon:'🎧💬',description:'Höre einen Satz und reagiere passend.'},
 {id:'finden',number:'18',title:'Bedeutungen von „finden“',icon:'🔍',description:'Unterscheide die Bedeutungen von finden.'},
 {id:'questions',number:'19',title:'Hobbys und Lieblingssachen',icon:'❓',description:'Ordne Fragen und Antworten zu.'},
 {id:'singular-plural',number:'20',title:'Hobby',icon:'1↔2',description:'Übe Hobby, Hobbys und Lieblingssachen.'},
 {id:'exam',number:'21',title:'Themenprüfung',icon:'⭐',description:'Bearbeite die Themenprüfung.'}
];
function build(entry){
 const current=window.L6T4_DATA?.tasks?.find(item=>item.id===entry.id);
 const file=entry.external||`task.html?task=${encodeURIComponent(entry.id)}`;
 const key=entry.key||entry.external||`task-${entry.id}`;
 const total=entry.total??(entry.id==='plural'?(window.L6T4PluralItems?.length||0):(current?.items?.length||0));
 return{...entry,file,key,total,exam:entry.id==='exam'};
}
try{L6T4_META.splice(0,L6T4_META.length,...meta)}catch(e){}
try{L6T4_TASKS.splice(0,L6T4_TASKS.length,...meta.map(build))}catch(e){}
})();
