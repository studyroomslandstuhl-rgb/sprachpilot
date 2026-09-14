(function(){
'use strict';
const D=window.L9T3;if(!D)return;
D.duerfenFormSentences=[
{id:'g01',q:'Ich ___ hier kurz warten.',a:'darf'},
{id:'g02',q:'Du ___ auf diesem Parkplatz parken.',a:'darfst'},
{id:'g03',q:'Paul hat eine Erlaubnis. Er ___ das Auto hier abstellen.',a:'darf'},
{id:'g04',q:'Maria hat heute frei. Sie ___ länger bleiben.',a:'darf'},
{id:'g05',q:'Das Kind ist mit seiner Mutter hier. Es ___ mit ins Gebäude kommen.',a:'darf'},
{id:'g06',q:'Wir ___ unsere Laptops mitnehmen.',a:'dürfen'},
{id:'g07',q:'Ihr ___ im Wartebereich leise sprechen.',a:'dürft'},
{id:'g08',q:'Tom und Mia haben Tickets. Sie ___ jetzt einsteigen.',a:'dürfen'},
{id:'g09',q:'Ali, Sofia und Ben ___ ihre Taschen mitnehmen.',a:'dürfen'},
{id:'g10',q:'Frau Klein, Sie ___ hier Platz nehmen.',a:'dürfen'},
{id:'g11',q:'Herr Sato, Sie ___ das Formular hier abgeben.',a:'dürfen'},
{id:'g12',q:'Man ___ in diesem Bereich nicht rauchen.',a:'darf'},
{id:'g13',q:'Meine Schwester hat eine Fahrkarte. Sie ___ mit dem Zug fahren.',a:'darf'},
{id:'g14',q:'Meine Eltern ___ hier eine Stunde parken.',a:'dürfen'},
{id:'g15',q:'Du ___ dein Handy hier nicht benutzen.',a:'darfst'},
{id:'g16',q:'Ich ___ eine Frage stellen.',a:'darf'},
{id:'g17',q:'Wir ___ die Unterlagen am Schalter abgeben.',a:'dürfen'},
{id:'g18',q:'Ihr ___ nach der Kontrolle euer Gepäck mitnehmen.',a:'dürft'},
{id:'g19',q:'Anna ist im Lesebereich. Sie ___ dort nicht telefonieren.',a:'darf'},
{id:'g20',q:'Herr Meier und Frau Rossi, Sie ___ jetzt zum Schalter kommen.',a:'dürfen'}
];
const task={id:'duerfen-formen-saetze',kind:'gap-two',title:'dürfen – Personen und Sätze',description:'Ergänze die richtige Form von dürfen.',icon:'🧩'};
if(Array.isArray(D.tasks)){
 D.tasks=D.tasks.filter(t=>t.id!==task.id);
 const i=D.tasks.findIndex(t=>t.id==='duerfen-tabelle');
 D.tasks.splice(i>=0?i+1:D.tasks.length,0,task);
}
window.SP_L9T3_DUERFEN_FORM_TASK={data:D,items:D.duerfenFormSentences,taskId:task.id,theme:3,topicId:'wortschatz-a1-lektion-9-thema-3',verb:'dürfen',exampleForm:'darf',title:task.title,description:task.description};
})();
