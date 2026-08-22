(function(){
'use strict';
if(window.__SP_L7T4_TASK11_DIALOGS_V4)return;window.__SP_L7T4_TASK11_DIALOGS_V4=true;
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
    ['Sekretariat','Grundschule am Park, guten Morgen.'],
    ['Vater','Guten Morgen. Mein Kind kann heute nicht kommen.'],
    ['Sekretariat','{{gap}}'],
    ['Vater','Karim Ali. Er geht in die Klasse 3b.'],
    ['Sekretariat','Danke. Was ist heute los?']
   ],
   options:['Wie heißen Sie?','Wie heißt Ihr Kind?','Wie heißt die Lehrerin?'],
   answer:'Wie heißt Ihr Kind?'
  },
  {
   turns:[
    ['Vater','Guten Morgen. Mein Sohn Karim kann heute nicht kommen.'],
    ['Sekretariat','Was ist los?'],
    ['Vater','{{gap}}'],
    ['Sekretariat','Das tut mir leid. Bleibt er heute zu Hause?'],
    ['Vater','Ja. Morgen rufe ich noch einmal an.']
   ],
   options:['Er sind krank und hat Fieber.','Er ist krank und hat Fieber.','Er ist krank und haben Fieber.'],
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
   options:['Wann kommen Sie wieder zur Schule?','Wann kommt Sie wieder zum Kurs?','Wann kommen Sie wieder zum Kurs?'],
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
   options:['Mein Sohn Karim kann am Freitag beim Unterricht nicht mitkommen.','Mein Sohn Karim kann am Freitag beim Ausflug nicht mitkommt.','Mein Sohn Karim kann am Freitag beim Ausflug nicht mitkommen.'],
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
   options:['Kommt Paul nach dem Termin noch zur Schule?','Kommen Paul nach dem Termin noch zur Schule?','Kommt Paul nach dem Termin noch zum Deutschkurs?'],
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
   options:['Ich heiße Elena Marin und gehe in die Klasse 2a.','Sie heißt Elena Marin und geht in die Klasse 2a.','Sie heißt Elena Marin und gehe in die Klasse 2a.'],
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
   options:['Ich kann heute wieder nicht zur Schule kommen.','Ich kann heute wieder nicht zum Deutschkurs kommt.','Ich kann heute wieder nicht zum Deutschkurs kommen.'],
   answer:'Ich kann heute wieder nicht zum Deutschkurs kommen.'
  },
  {
   turns:[
    ['Mutter','Meine Tochter ist heute krank und bleibt zu Hause.'],
    ['Sekretariat','Alles klar. Ich sage der Lehrerin Bescheid. Gute Besserung für Ihre Tochter.'],
    ['Mutter','{{gap}}'],
    ['Sekretariat','Gern. Ich wünsche Ihrer Tochter einen ruhigen Tag.']
   ],
   options:['Ihnen auch gute Besserung.','Vielen Dank.','Ebenfalls.'],
   answer:'Vielen Dank.'
  }
 ];
 theme.contentRevision='l7t4-dialogs-v4-20260822';
 window.L7_THEME=theme;
 return theme;
});
})();
