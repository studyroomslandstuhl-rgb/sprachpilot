(function(){
'use strict';
const D=window.L9T1;if(!D)return;
D.sequenceTrueFalse=[
 {
  id:'fahrkarte-kaufen',title:'Fahrkarte kaufen',statements:[
   {id:'a',text:'Zuerst gibt man das Reiseziel an.',answer:true},
   {id:'b',text:'Noch bevor man Erwachsene oder Kind auswählt, bezahlt man die Fahrkarte.',answer:false},
   {id:'c',text:'Nach dem Bezahlen nimmt man die Fahrkarte aus dem Automaten.',answer:true}
  ]
 },
 {
  id:'antrag-stellen',title:'Antrag stellen',statements:[
   {id:'a',text:'Das Formular bekommt man bei der Behörde.',answer:true},
   {id:'b',text:'Die persönlichen Daten trägt man erst nach der Unterschrift ein.',answer:false},
   {id:'c',text:'Vor dem Unterschreiben soll man prüfen, ob alle nötigen Papiere da sind.',answer:true}
  ]
 },
 {
  id:'auto-mieten',title:'Auto mieten',statements:[
   {id:'a',text:'Am Anfang geht man zu der Firma, bei der man den Wagen leiht.',answer:true},
   {id:'b',text:'Die Fahrzeugpapiere unterschreibt man, bevor man den Führerschein zeigt.',answer:false},
   {id:'c',text:'Der Führerschein darf nicht abgelaufen sein.',answer:true}
  ]
 },
 {
  id:'dokument-abholen',title:'Dokument abholen',statements:[
   {id:'a',text:'Mit dem Ausweis zeigt man am Schalter, welche Person man ist.',answer:true},
   {id:'b',text:'Nach dem Ausweis bekommt man das Dokument immer sofort.',answer:false},
   {id:'c',text:'Vor dem Weggehen soll man nachsehen, ob im eigenen Namen kein Fehler ist.',answer:true}
  ]
 }
];
const task={id:'anweisungen-richtig-falsch',kind:'sequences',title:'Hören: Richtig oder falsch?',description:'Höre zu und entscheide.',instruction:'Höre zu. Entscheide bei jeder Aussage: richtig oder falsch.',icon:'🎧'};
D.tasks=(D.tasks||[]).filter(t=>t.id!==task.id);
const pos=D.tasks.findIndex(t=>t.id==='anweisungen-hoeren');
if(pos>=0)D.tasks.splice(pos+1,0,task);else{const exam=D.tasks.findIndex(t=>t.exam||t.id==='pruefung');if(exam>=0)D.tasks.splice(exam,0,task);else D.tasks.push(task)}
if(window.L9_THEMES?.[1])window.L9_THEMES[1].tasks=D.tasks;
})();
