(function(){
'use strict';
function apply(){
 const D=window.L9T1;if(!D||!Array.isArray(D.tasks))return;
 const cfg={
  'karteikarten':{icon:'🃏',title:'Karteikarten',description:'Lerne die Wörter.'},
  'hoeren-bild':{icon:'🎧',title:'Hören & Bild',description:'Wähle das passende Bild.'},
  'bedeutung-wort':{icon:'🧠',title:'Bedeutung finden',description:'Wähle das richtige Wort.'},
  'bild-sprechen':{icon:'🗣️',title:'Bild & Sprechen',description:'Sprich oder schreibe das Wort.'},
  'artikel-nomen':{icon:'🏷️',title:'Artikel',description:'Schreibe den richtigen Artikel.'},
  'artikel-schreiben':{icon:'🏷️',title:'Artikel',description:'Schreibe den richtigen Artikel.'},
  'plural-bild':{icon:'🔤',title:'Plural',description:'Schreibe die richtige Pluralform.'},
  'nomen-dialoge':{icon:'💬',title:'Nomen im Dialog',description:'Ergänze das Nomen.'},
  'artikel-kasus':{icon:'🎯',title:'Artikel im Satz',description:'Ergänze den Artikel.'},
  'muessen-tabelle':{icon:'🔄',title:'müssen konjugieren',description:'Konjugiere müssen.'},
  'muessen-saetze':{icon:'🧩',title:'müssen + Verb',description:'Ergänze müssen und das Verb.'},
  'modal-kontext':{icon:'💡',title:'Welches Modalverb?',description:'Wähle das richtige Modalverb.'},
  'anweisungen-hoeren':{icon:'🧭',title:'Anweisungen hören',description:'Ordne die Schritte zu.',instruction:'Ordne die Schritte zu.'},
  'lueckentexte':{icon:'🧱',title:'Anweisungen im Text',description:'Fülle die Lücken.'},
  'anleitung-schreiben':{icon:'🛠️',title:'Anleitung schreiben',description:'Schreibe die Anleitung.'},
  'pruefung':{icon:'⭐',title:'Prüfung',description:'Teste dein Wissen.',instruction:'Teste dein Wissen.'}
 };
 for(const t of D.tasks){const c=cfg[t.id];if(c)Object.assign(t,c,{instruction:c.instruction||c.description});}
 const order=['karteikarten','hoeren-bild','bedeutung-wort','bild-sprechen','artikel-nomen','artikel-schreiben','plural-bild','nomen-dialoge','artikel-kasus','muessen-tabelle','muessen-saetze','modal-kontext','anweisungen-hoeren','lueckentexte','anleitung-schreiben','pruefung'];
 const pos=new Map(order.map((id,i)=>[id,i]));
 D.tasks.sort((a,b)=>(pos.get(a.id)??999)-(pos.get(b.id)??999));
}
window.L9T1ThemeFinal={apply};
apply();
})();
