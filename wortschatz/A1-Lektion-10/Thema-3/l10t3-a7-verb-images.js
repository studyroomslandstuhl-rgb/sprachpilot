(function(){
'use strict';
const D=window.L10T3;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const row=(id,left,middle,modal,verb,image)=>({
  id,left,middle,modal,verb,
  image:CDN+image+'.webp',
  hint:'Schau auf das Bild. Achte auf das Subjekt: sollen steht auf Position 2, der Infinitiv am Satzende.'
});

/* L10T3 A7: Das Verb wird nicht als Hinweis geschrieben. Das Bild zeigt die Handlung.
   Die Bilder stammen aus bereits verwendetem SprachPilot-Wortschatz aus L3-L10. */
D.sollenGaps=[
  row('sg01','Beim Amt','du einen neuen Aufenthaltstitel','sollst','beantragen','beantragen'),
  row('sg02','Vor dem Arztgespräch','du dein Handy','sollst','ausmachen','ausmachen'),
  row('sg03','Vor der Praxis','Herr Ali das Auto','soll','parken','parken'),
  row('sg04','Nach dem Arztbesuch','Maria die Krankmeldung beim Chef','soll','abgeben','abgeben'),
  row('sg05','Bei starkem Husten','du heute nicht','sollst','rauchen','rauchen'),
  row('sg06','Zum Termin','Anna ihre Versichertenkarte','soll','mitnehmen','mitnehmen'),
  row('sg07','Vor der Untersuchung','ich das Formular','soll','ausfüllen','ausfuellen'),
  row('sg08','Morgen','wir die Arztbescheinigung','sollen','mitbringen','mitbringen'),
  row('sg09','Frau Klein,','Sie das Formular hier','sollen','unterschreiben','unterschreiben'),
  row('sg10','Nach dem Neustart','das Gerät wieder','soll','funktionieren','funktionieren'),
  row('sg11','Für den Termin','du eine Uhrzeit','sollst','wählen','waehlen'),
  row('sg12','Für die Behandlung','ihr einen passenden Termin','sollt','auswählen','auswaehlen'),
  row('sg13','Nach der Arbeit','ich die Medizin','soll','abholen','abholen'),
  row('sg14','Am Telefon','Herr Novak seinen Namen','soll','wiederholen','wiederholen'),
  row('sg15','Im Amt','die Mitarbeiterin das Dokument','soll','stempeln','stempeln'),
  row('sg16','Für den Termin morgen','wir ein Auto','sollen','mieten','mieten'),
  row('sg17','Bei Rückenschmerzen','Anna die Salbe zweimal täglich','soll','verwenden','verwenden'),
  row('sg18','Heute','Herr Klein die Krankmeldung an den Chef','soll','schicken','schicken'),
  row('sg19','In der Praxis','Frau Rossi heute einen neuen Patienten','soll','empfangen','empfangen'),
  row('sg20','Bei Sonnenbrand','Paul die Haut','soll','kühlen','kuehlen')
];

const task=(D.tasks||[]).find(t=>t.id==='sollen-verb');
if(task){
  task.title='sollen + Bildverb';
  task.cardText='Schau das Bild an. Ergänze sollen und das Verb.';
  task.text='Schau das Bild an. Ergänze die richtige Form von sollen und den Infinitiv.';
  task.example='Maria ___ das Formular [Bild]. → Maria soll das Formular ausfüllen.';
}
})();
