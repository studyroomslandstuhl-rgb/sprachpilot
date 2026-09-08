(function(){
'use strict';
const D=window.L9T1;if(!D)return;
D.sequenceTrueFalse=[
 {
  id:'fahrkarte-kaufen',title:'Fahrkarte kaufen',statements:[
   {id:'a',text:'Am Anfang sieht man viele verschiedene Orte.',answer:true},
   {id:'b',text:'Man bezahlt gleich am Anfang.',answer:false},
   {id:'c',text:'Nach dem Bezahlen kommt etwas aus der Maschine.',answer:true}
  ]
 },
 {
  id:'antrag-stellen',title:'Antrag stellen',statements:[
   {id:'a',text:'Man schreibt auch, wo man wohnt.',answer:true},
   {id:'b',text:'Man schaut erst nach dem Schreiben unten, ob alles richtig ist.',answer:false},
   {id:'c',text:'Am Ende schreibt man seinen Namen unten.',answer:true}
  ]
 },
 {
  id:'auto-mieten',title:'Auto mieten',statements:[
   {id:'a',text:'Man liest etwas, bevor man seinen Namen schreibt.',answer:true},
   {id:'b',text:'Die Frau zeigt das Auto ganz am Anfang.',answer:false},
   {id:'c',text:'Die Frau zeigt das Auto erst nach dem Lesen und Schreiben.',answer:true}
  ]
 },
 {
  id:'dokument-abholen',title:'Dokument abholen',statements:[
   {id:'a',text:'Man wartet vielleicht ein paar Minuten.',answer:true},
   {id:'b',text:'Man wartet eine Stunde.',answer:false},
   {id:'c',text:'Vor dem Gehen schaut man noch einmal auf den eigenen Namen.',answer:true}
  ]
 }
];
const task={id:'anweisungen-richtig-falsch2',kind:'sequences',title:'Hören: Richtig oder falsch?',description:'Höre genau zu und entscheide.',instruction:'Höre genau zu. Entscheide bei jeder Aussage: richtig oder falsch.',icon:'🎧'};
D.tasks=(D.tasks||[]).filter(t=>t.id!=='anweisungen-richtig-falsch'&&t.id!==task.id);
const pos=D.tasks.findIndex(t=>t.id==='anweisungen-hoeren');
if(pos>=0)D.tasks.splice(pos+1,0,task);else{const exam=D.tasks.findIndex(t=>t.exam||t.id==='pruefung');if(exam>=0)D.tasks.splice(exam,0,task);else D.tasks.push(task)}
if(window.L9_THEMES?.[1])window.L9_THEMES[1].tasks=D.tasks;
})();
