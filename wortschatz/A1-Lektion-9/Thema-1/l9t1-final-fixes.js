(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const by=id=>(D.modals||[]).find(x=>x.id===id);
if(by('m1'))Object.assign(by('m1'),{
 prompt:'Mein Auto ist kaputt. Der Bus und der Zug fahren heute. Ich ___ mit dem Bus fahren.',
 answer:'kann',options:['muss','kann','will','mag','möchte'],
 hint:'Es gibt mehrere Möglichkeiten. Deshalb ist es möglich, aber nicht notwendig.'
});
if(by('m11'))Object.assign(by('m11'),{
 prompt:'Er hat genug Geld und braucht ein Ticket. Das Ticket gibt es am Automaten oder online. Er ___ das Ticket am Automaten kaufen.',
 answer:'kann',options:['muss','kann','will','mag','möchte'],
 hint:'Er muss ein Ticket haben, aber er kann entscheiden, wo er es kauft.'
});
if(by('m16'))Object.assign(by('m16'),{
 prompt:'Man hat einen Online-Termin gebucht. Man hat die Bestätigung auf dem Handy und auch auf Papier. Man ___ die Bestätigung auf dem Handy zeigen.',
 answer:'kann',options:['muss','kann','will','mag','möchte'],
 hint:'Das Handy ist eine Möglichkeit. Man muss die Bestätigung nicht genau auf dem Handy zeigen.'
});
const gapTask=(D.tasks||[]).find(t=>t.id==='muessen-saetze');
if(gapTask&&gapTask.icon==='🖼️')gapTask.icon='✍️';
})();
