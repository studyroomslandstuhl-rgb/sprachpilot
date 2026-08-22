(function(){
'use strict';
if(window.__SP_L7T4_LISTENING_FIVE_V5)return;window.__SP_L7T4_LISTENING_FIVE_V5=true;
const BASE='https://sprachpilot.b-cdn.net/audio/';
const fixed=(q,options,answer)=>({q,options,answer,preserveOrder:true});
const dialogs=[
 {
  title:'Tochter krank · Schule',audio:BASE+'l7t4_hoeren_krankmeldung_schule_kind_01.mp3',filename:'l7t4_hoeren_krankmeldung_schule_kind_01.mp3',
  transcript:'Sekretariat: Guten Morgen, Grundschule am Park, hier ist Frau Klein.\nHassan Ali: Guten Morgen, hier spricht Hassan Ali. Meine Tochter Sara Ali kann heute und morgen nicht zur Schule kommen.\nSekretariat: In welche Klasse geht Sara?\nHassan Ali: Sie geht in die Klasse 3a. Sie ist krank und wir gehen heute zum Arzt.\nSekretariat: Das tut mir leid. Ich sage Frau Müller Bescheid. Gute Besserung für Sara.\nHassan Ali: Vielen Dank. Auf Wiederhören.\nSekretariat: Auf Wiederhören.',
  questions:[
   fixed('Wer ist krank?',['Hassan Ali','Sara Ali','Frau Klein'],'Sara Ali'),
   fixed('Wie lange kann Sara nicht zur Schule kommen?',['eine Woche','nur heute Nachmittag','heute und morgen'],'heute und morgen'),
   fixed('In welche Klasse geht Sara?',['Klasse 3a','Klasse 4a','Klasse 2b'],'Klasse 3a')
  ]
 },
 {
  title:'Teilnehmer krank · Sprachkurs',audio:BASE+'l7t4_hoeren_krankmeldung_sprachkurs_teilnehmer_02.mp3',filename:'l7t4_hoeren_krankmeldung_sprachkurs_teilnehmer_02.mp3',
  transcript:'Kursbüro: Sprachschule Aktiv, guten Morgen.\nOmar Hassan: Guten Morgen, hier spricht Omar Hassan. Ich kann heute nicht zum Deutschkurs kommen.\nKursbüro: Was ist los, Herr Hassan?\nOmar Hassan: Ich bin krank und muss zu Hause bleiben. Morgen möchte ich wieder zum Kurs kommen.\nKursbüro: Danke für die Information. Ich sage Ihrer Lehrerin Bescheid. Gute Besserung!\nOmar Hassan: Vielen Dank. Auf Wiederhören.',
  questions:[
   fixed('Warum kommt Omar heute nicht zum Deutschkurs?',['Er muss arbeiten.','Er ist krank.','Er macht einen Ausflug.'],'Er ist krank.'),
   fixed('Wann möchte Omar wieder zum Kurs kommen?',['morgen','heute Nachmittag','nächste Woche'],'morgen'),
   fixed('Was macht das Kursbüro?',['Es ruft den Arzt an.','Es holt Omar ab.','Es sagt der Lehrerin Bescheid.'],'Es sagt der Lehrerin Bescheid.')
  ]
 },
 {
  title:'Sohn hat Arzttermin · Schule',audio:BASE+'l7t4_hoeren_arzttermin_schule_kind_03.mp3',filename:'l7t4_hoeren_arzttermin_schule_kind_03.mp3',
  transcript:'Sekretariat: Guten Morgen, Grundschule Sonnenweg.\nElena Marin: Guten Morgen, hier spricht Elena Marin. Mein Sohn Paul Marin aus der Klasse 2b kann heute nicht zur Schule kommen.\nSekretariat: Ist Paul krank?\nElena Marin: Nein. Er hat um halb zehn einen Termin beim Arzt. Morgen kommt er wieder zur Schule.\nSekretariat: Alles klar. Ich sage Herrn Becker Bescheid.\nElena Marin: Vielen Dank. Auf Wiederhören.',
  questions:[
   fixed('Warum fehlt Paul heute?',['Er fährt mit der Klasse weg.','Er ist im Schwimmbad.','Er hat einen Arzttermin.'],'Er hat einen Arzttermin.'),
   fixed('Wann ist der Arzttermin?',['um 9:30 Uhr','um 11 Uhr','um 8 Uhr'],'um 9:30 Uhr'),
   fixed('In welche Klasse geht Paul?',['Klasse 3a','Klasse 2b','Klasse 4b'],'Klasse 2b')
  ]
 },
 {
  title:'Teilnehmerin · Deutschkurs',audio:BASE+'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',filename:'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',
  transcript:'Kursbüro: Guten Morgen, Sprachschule Dialog.\nAmina Saleh: Guten Morgen, hier spricht Amina Saleh. Ich kann am Montag nicht zum Deutschkurs kommen.\nKursbüro: Was ist der Grund?\nAmina Saleh: Ich habe am Montagmorgen einen Termin bei der Ärztin. Am Dienstag komme ich wieder.\nKursbüro: Danke, Frau Saleh. Ich gebe der Kursleiterin Bescheid.\nAmina Saleh: Vielen Dank. Auf Wiederhören.',
  questions:[
   fixed('An welchem Tag fehlt Amina im Deutschkurs?',['am Freitag','am Montag','am Dienstag'],'am Montag'),
   fixed('Warum fehlt sie?',['Sie hat einen Termin bei der Ärztin.','Sie hat keinen Unterricht.','Sie ist auf einem Ausflug.'],'Sie hat einen Termin bei der Ärztin.'),
   fixed('Wann kommt Amina wieder?',['am Mittwoch','am Montagmittag','am Dienstag'],'am Dienstag')
  ]
 },
 {
  title:'Sohn krank · Ausflug',audio:BASE+'l7t4_hoeren_krank_ausflug_kind_05.mp3',filename:'l7t4_hoeren_krank_ausflug_kind_05.mp3',
  transcript:'Sekretariat: Grundschule am Park, guten Morgen.\nSamir Ali: Guten Morgen, hier spricht Samir Ali. Mein Sohn Karim geht in die Klasse 3b.\nSekretariat: Guten Morgen, Herr Ali. Was ist los?\nSamir Ali: Karim ist krank. Er kann am Freitag beim Ausflug nicht mitkommen.\nSekretariat: Das ist schade. Ich sage der Lehrerin Bescheid. Gute Besserung für Karim.\nSamir Ali: Vielen Dank. Auf Wiederhören.',
  questions:[
   fixed('Was kann Karim am Freitag nicht machen?',['zum Schwimmbad fahren','beim Ausflug mitkommen','zum Deutschkurs kommen'],'beim Ausflug mitkommen'),
   fixed('Warum kann Karim nicht mitkommen?',['Der Bus fährt zu früh.','Der Eintritt ist zu teuer.','Er ist krank.'],'Er ist krank.'),
   fixed('Was macht das Sekretariat?',['Es sagt der Lehrerin Bescheid.','Es fährt Karim zum Arzt.','Es sagt den Ausflug ab.'],'Es sagt der Lehrerin Bescheid.')
  ]
 }
];
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const task=(theme?.tasks||[]).find(t=>t?.id==='hoeren-sekretariat');if(!task)return theme;
 task.title='Hören Krankmeldungen';task.description='Höre und antworte.';task.instruction='Höre den Dialog und wähle A, B oder C.';task.icon='🎧';task.kind='audio-pack';task.items=dialogs;
 theme.contentRevision='l7t4-listening-five-20260822-v5';window.L7_THEME=theme;window.L7T4_LISTENING_DIALOGS=dialogs;return theme;
});
})();