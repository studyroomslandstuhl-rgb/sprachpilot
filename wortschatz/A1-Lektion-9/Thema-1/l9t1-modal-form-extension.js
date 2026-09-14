(function(){
'use strict';
const D=window.L9T1;if(!D)return;
D.muessenFormSentences=[
{id:'m0',q:'Ich ___ morgen zum Amt gehen.',a:'muss'},
{id:'m1',q:'Du ___ deinen Ausweis mitbringen.',a:'musst'},
{id:'m2',q:'Paul hat einen Termin. Er ___ pünktlich sein.',a:'muss'},
{id:'m3',q:'Maria braucht einen neuen Ausweis. Sie ___ einen Antrag stellen.',a:'muss'},
{id:'m4',q:'Das Kind fährt mit. Es ___ einen Ausweis haben.',a:'muss'},
{id:'m5',q:'Wir ___ die Formulare vollständig ausfüllen.',a:'müssen'},
{id:'m6',q:'Ihr ___ eure Unterlagen am Schalter abgeben.',a:'müsst'},
{id:'m7',q:'Tom und Mia haben einen Termin. Sie ___ um 10 Uhr beim Amt sein.',a:'müssen'},
{id:'m8',q:'Ali, Sofia und Ben ___ ihre Papiere mitbringen.',a:'müssen'},
{id:'m9',q:'Frau Becker, Sie ___ hier unterschreiben.',a:'müssen'},
{id:'m10',q:'Herr Yilmaz, Sie ___ Ihren Führerschein zeigen.',a:'müssen'},
{id:'m11',q:'Man ___ zuerst eine Nummer ziehen.',a:'muss'},
{id:'m12',q:'Meine Mutter braucht ein Dokument. Sie ___ zum Bürgeramt gehen.',a:'muss'},
{id:'m13',q:'Meine Eltern ___ den Antrag zusammen unterschreiben.',a:'müssen'},
{id:'m14',q:'Du ___ am Automaten zuerst das Ziel wählen.',a:'musst'},
{id:'m15',q:'Ich ___ das Dokument morgen abholen.',a:'muss'},
{id:'m16',q:'Wir ___ vor der Fahrt Fahrkarten kaufen.',a:'müssen'},
{id:'m17',q:'Ihr ___ die Angaben noch einmal kontrollieren.',a:'müsst'},
{id:'m18',q:'Sara ist bei der Autovermietung. Sie ___ ihren Führerschein zeigen.',a:'muss'},
{id:'m19',q:'Herr Klein und Frau Rossi, Sie ___ beide hier unterschreiben.',a:'müssen'}
];
const task={id:'muessen-formen-saetze',icon:'🧩',title:'müssen – Personen und Sätze',description:'Ergänze die richtige Form von müssen.',instruction:'Ergänze die richtige Form von müssen.',kind:'modals'};
if(Array.isArray(D.tasks)){
 D.tasks=D.tasks.filter(t=>t.id!==task.id);
 const i=D.tasks.findIndex(t=>t.id==='muessen-tabelle');
 D.tasks.splice(i>=0?i+1:D.tasks.length,0,task);
}
window.SP_L9T1_MUESSEN_FORM_TASK={data:D,items:D.muessenFormSentences,taskId:task.id,theme:1,topicId:'wortschatz-a1-lektion-9-thema-1',verb:'müssen',exampleForm:'muss',title:task.title,description:task.description};
})();
