(function(){
'use strict';
if(window.__SP_L7T4_TASK11_DIALOGS_V2)return;window.__SP_L7T4_TASK11_DIALOGS_V2=true;
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.id==='hoerdialog-ordnen');
 if(!task)return theme;
 task.title='Dialoge';
 task.description='Wähle passende Äußerung.';
 task.instruction='Lese Dialoge und wähle die passende Äußerung.';
 task.items=[
  {
   turns:[
    ['Sekretariat','{{gap}}'],
    ['Mutter','Guten Morgen, hier spricht Elena Marin. Mein Sohn kann heute leider nicht zur Schule kommen.'],
    ['Sekretariat','Guten Morgen, Frau Marin. Wie heißt Ihr Sohn?'],
    ['Mutter','Paul Marin. Er geht in die Klasse 2b.'],
    ['Sekretariat','Danke. Was ist heute los?']
   ],
   options:['Auf Wiederhören und gute Besserung.','Grundschule Sonnenweg, guten Morgen.','Der Unterricht endet heute um zwölf Uhr.'],
   answer:'Grundschule Sonnenweg, guten Morgen.'
  },
  {
   turns:[
    ['Vater','Guten Morgen. Mein Sohn Karim kann heute nicht kommen.'],
    ['Sekretariat','Was ist los?'],
    ['Vater','{{gap}}'],
    ['Sekretariat','Das tut mir leid. Bleibt er heute zu Hause?'],
    ['Vater','Ja. Morgen rufe ich noch einmal an.']
   ],
   options:['Er ist krank und hat Fieber.','Er ist wieder gesund und kommt gleich.','Er fährt heute mit der Klasse ins Schwimmbad.'],
   answer:'Er ist krank und hat Fieber.'
  },
  {
   turns:[
    ['Amina','Guten Morgen, hier spricht Amina Saleh. Ich kann am Montag nicht zum Deutschkurs kommen.'],
    ['Kursbüro','Guten Morgen, Frau Saleh. Warum können Sie nicht kommen?'],
    ['Amina','Ich habe am Morgen einen Arzttermin.'],
    ['Kursbüro','{{gap}}'],
    ['Amina','Am Dienstag bin ich wieder da.'],
    ['Kursbüro','Alles klar. Danke für die Information.']
   ],
   options:['Wann beginnt heute der Unterricht?','Warum gehen Sie zum Arzt?','Wann kommen Sie wieder zum Kurs?'],
   answer:'Wann kommen Sie wieder zum Kurs?'
  },
  {
   turns:[
    ['Sekretariat','Grundschule am Park, guten Morgen.'],
    ['Vater','{{gap}}'],
    ['Sekretariat','Das ist schade. Ist Karim krank?'],
    ['Vater','Ja, er hat Fieber und bleibt zu Hause.'],
    ['Sekretariat','Danke. Ich informiere die Lehrerin.']
   ],
   options:['Mein Sohn Karim kann am Freitag beim Ausflug nicht mitkommen.','Mein Sohn Karim möchte am Freitag einen neuen Ausflug planen.','Mein Sohn Karim kommt am Freitag später zum Unterricht.'],
   answer:'Mein Sohn Karim kann am Freitag beim Ausflug nicht mitkommen.'
  },
  {
   turns:[
    ['Mutter','Mein Sohn Paul hat morgen um halb zehn einen Termin beim Zahnarzt.'],
    ['Sekretariat','{{gap}}'],
    ['Mutter','Nein. Der Termin dauert länger. Am Donnerstag kommt er wieder.'],
    ['Sekretariat','Dann fehlt Paul morgen den ganzen Tag.'],
    ['Mutter','Ja, genau. Vielen Dank.']
   ],
   options:['Kommt Paul nach dem Termin noch zur Schule?','Kommt Paul heute schon um halb zehn zur Schule?','Kommt Paul am Donnerstag nicht mehr zur Schule?'],
   answer:'Kommt Paul nach dem Termin noch zur Schule?'
  },
  {
   turns:[
    ['Sekretariat','Grundschule Sonnenweg, guten Morgen.'],
    ['Mutter','Guten Morgen. Ich möchte meine Tochter für heute abmelden.'],
    ['Sekretariat','Wie heißt Ihre Tochter?'],
    ['Mutter','{{gap}}'],
    ['Sekretariat','Danke. Warum kann Elena heute nicht kommen?'],
    ['Mutter','Sie ist krank und hat heute einen Arzttermin.']
   ],
   options:['Sie heißt Elena Marin und geht in die Klasse 2a.','Sie heißt Frau Müller und arbeitet im Sekretariat.','Sie heißt Elena Marin und kommt heute um zwei Uhr zurück.'],
   answer:'Sie heißt Elena Marin und geht in die Klasse 2a.'
  },
  {
   turns:[
    ['Kursbüro','Sprachschule Dialog, guten Morgen.'],
    ['Amina','Guten Morgen, hier spricht Amina Saleh.'],
    ['Kursbüro','Guten Morgen, Frau Saleh. Was kann ich für Sie tun?'],
    ['Amina','{{gap}}'],
    ['Kursbüro','Das ist ein Problem. Sie haben schon oft gefehlt.'],
    ['Amina','Ja, ich weiß. Mein Kind ist heute krank.']
   ],
   options:['Ich möchte heute einen neuen Deutschkurs beginnen.','Ich möchte wissen, wann der nächste Ausflug ist.','Ich kann heute wieder nicht zum Deutschkurs kommen.'],
   answer:'Ich kann heute wieder nicht zum Deutschkurs kommen.'
  },
  {
   turns:[
    ['Vater','Danke. Sie haben die Krankmeldung schon notiert. Muss ich noch etwas machen?'],
    ['Sekretariat','{{gap}}'],
    ['Vater','Alles klar. Dann rufe ich morgen wieder an, wenn Karim noch krank ist.'],
    ['Sekretariat','Genau. Gute Besserung für Karim.'],
    ['Vater','Vielen Dank. Auf Wiederhören.']
   ],
   options:['Nein. Wenn Karim morgen noch krank ist, rufen Sie bitte noch einmal an.','Ja. Sie müssen Karim heute noch in die Schule bringen.','Nein. Der Ausflug findet deshalb morgen nicht statt.'],
   answer:'Nein. Wenn Karim morgen noch krank ist, rufen Sie bitte noch einmal an.'
  }
 ];
 theme.contentRevision='l7t4-dialogs-v2-20260822';
 window.L7_THEME=theme;
 return theme;
});
})();
