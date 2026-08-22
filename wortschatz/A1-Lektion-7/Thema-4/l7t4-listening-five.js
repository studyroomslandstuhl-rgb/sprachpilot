(function(){
'use strict';
if(window.__SP_L7T4_LISTENING_FIVE_V2)return;window.__SP_L7T4_LISTENING_FIVE_V2=true;
const BASE='https://sprachpilot.b-cdn.net/audio/';
const dialogs=[
 {
  title:'Tochter krank · Schule',audio:BASE+'l7t4_hoeren_krankmeldung_schule_kind_01.mp3',filename:'l7t4_hoeren_krankmeldung_schule_kind_01.mp3',
  transcript:'Sekretariat: Guten Morgen, Grundschule am Park, hier ist Frau Klein.\nHassan Ali: Guten Morgen, hier spricht Hassan Ali. Meine Tochter Sara Ali kann heute und morgen nicht zur Schule kommen.\nSekretariat: In welche Klasse geht Sara?\nHassan Ali: Sie geht in die Klasse 3a. Sie ist krank und wir gehen heute zum Arzt.\nSekretariat: Das tut mir leid. Ich sage Frau Müller Bescheid. Gute Besserung für Sara.\nHassan Ali: Vielen Dank. Auf Wiederhören.\nSekretariat: Auf Wiederhören.',
  questions:[{q:'Wer ist krank?',options:['Sara Ali','Hassan Ali','Frau Klein'],answer:'Sara Ali'},{q:'Wie lange kann Sara nicht zur Schule kommen?',options:['heute und morgen','nur heute Nachmittag','eine Woche'],answer:'heute und morgen'},{q:'In welche Klasse geht Sara?',options:['Klasse 3a','Klasse 2b','Klasse 4a'],answer:'Klasse 3a'}]
 },
 {
  title:'Teilnehmer krank · Sprachkurs',audio:BASE+'l7t4_hoeren_krankmeldung_sprachkurs_teilnehmer_02.mp3',filename:'l7t4_hoeren_krankmeldung_sprachkurs_teilnehmer_02.mp3',
  transcript:'Kursbüro: Sprachschule Aktiv, guten Morgen.\nOmar Hassan: Guten Morgen, hier spricht Omar Hassan. Ich kann heute nicht zum Deutschkurs kommen.\nKursbüro: Was ist los, Herr Hassan?\nOmar Hassan: Ich bin krank und muss zu Hause bleiben. Morgen möchte ich wieder zum Kurs kommen.\nKursbüro: Danke für die Information. Ich sage Ihrer Lehrerin Bescheid. Gute Besserung!\nOmar Hassan: Vielen Dank. Auf Wiederhören.',
  questions:[{q:'Warum kommt Omar heute nicht zum Deutschkurs?',options:['Er ist krank.','Er macht einen Ausflug.','Er muss arbeiten.'],answer:'Er ist krank.'},{q:'Wann möchte Omar wieder zum Kurs kommen?',options:['morgen','nächste Woche','heute Nachmittag'],answer:'morgen'},{q:'Was macht das Kursbüro?',options:['Es sagt der Lehrerin Bescheid.','Es ruft den Arzt an.','Es holt Omar ab.'],answer:'Es sagt der Lehrerin Bescheid.'}]
 },
 {
  title:'Sohn hat Arzttermin · Schule',audio:BASE+'l7t4_hoeren_arzttermin_schule_kind_03.mp3',filename:'l7t4_hoeren_arzttermin_schule_kind_03.mp3',
  transcript:'Sekretariat: Guten Morgen, Grundschule Sonnenweg.\nElena Marin: Guten Morgen, hier spricht Elena Marin. Mein Sohn Paul Marin aus der Klasse 2b kann heute nicht zur Schule kommen.\nSekretariat: Ist Paul krank?\nElena Marin: Nein. Er hat um halb zehn einen Termin beim Arzt. Morgen kommt er wieder zur Schule.\nSekretariat: Alles klar. Ich sage Herrn Becker Bescheid.\nElena Marin: Vielen Dank. Auf Wiederhören.',
  questions:[{q:'Warum fehlt Paul heute?',options:['Er hat einen Arzttermin.','Er ist im Schwimmbad.','Er fährt mit der Klasse weg.'],answer:'Er hat einen Arzttermin.'},{q:'Wann ist der Arzttermin?',options:['um 9:30 Uhr','um 8 Uhr','um 11 Uhr'],answer:'um 9:30 Uhr'},{q:'In welche Klasse geht Paul?',options:['Klasse 2b','Klasse 3a','Klasse 4b'],answer:'Klasse 2b'}]
 },
 {
  title:'Teilnehmerin hat Arzttermin · Sprachkurs',audio:BASE+'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',filename:'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',
  transcript:'Kursbüro: Guten Morgen, Sprachschule Dialog.\nAmina Saleh: Guten Morgen, hier spricht Amina Saleh. Ich kann am Montag nicht zum Deutschkurs kommen.\nKursbüro: Was ist der Grund?\nAmina Saleh: Ich habe am Montagmorgen einen Termin bei der Ärztin. Am Dienstag komme ich wieder.\nKursbüro: Danke, Frau Saleh. Ich gebe der Kursleiterin Bescheid.\nAmina Saleh: Vielen Dank. Auf Wiederhören.',
  questions:[{q:'An welchem Tag fehlt Amina im Deutschkurs?',options:['am Montag','am Dienstag','am Freitag'],answer:'am Montag'},{q:'Warum fehlt sie?',options:['Sie hat einen Termin bei der Ärztin.','Sie ist auf einem Ausflug.','Sie hat keinen Unterricht.'],answer:'Sie hat einen Termin bei der Ärztin.'},{q:'Wann kommt Amina wieder?',options:['am Dienstag','am Mittwoch','am Montagmittag'],answer:'am Dienstag'}]
 },
 {
  title:'Sohn krank · Ausflug',audio:BASE+'l7t4_hoeren_krank_ausflug_kind_05.mp3',filename:'l7t4_hoeren_krank_ausflug_kind_05.mp3',
  transcript:'Sekretariat: Grundschule am Park, guten Morgen.\nSamir Ali: Guten Morgen, hier spricht Samir Ali. Mein Sohn Karim geht in die Klasse 3b.\nSekretariat: Guten Morgen, Herr Ali. Was ist los?\nSamir Ali: Karim ist krank. Er kann am Freitag beim Ausflug nicht mitkommen.\nSekretariat: Das ist schade. Ich sage der Lehrerin Bescheid. Gute Besserung für Karim.\nSamir Ali: Vielen Dank. Auf Wiederhören.',
  questions:[{q:'Was kann Karim am Freitag nicht machen?',options:['beim Ausflug mitkommen','zum Deutschkurs kommen','zum Schwimmbad fahren'],answer:'beim Ausflug mitkommen'},{q:'Warum kann Karim nicht mitkommen?',options:['Er ist krank.','Der Eintritt ist zu teuer.','Der Bus fährt zu früh.'],answer:'Er ist krank.'},{q:'Was macht das Sekretariat?',options:['Es sagt der Lehrerin Bescheid.','Es sagt den Ausflug ab.','Es fährt Karim zum Arzt.'],answer:'Es sagt der Lehrerin Bescheid.'}]
 }
];
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const task=(theme?.tasks||[]).find(t=>t?.id==='hoeren-sekretariat');if(!task)return theme;
 task.title='Hören Krankmeldungen';task.description='Höre und antworte.';task.instruction='Höre den Dialog und wähle A, B oder C.';task.icon='🎧';task.kind='audio-pack';task.items=dialogs;
 theme.contentRevision='l7t4-listening-five-20260822-v2';window.L7_THEME=theme;window.L7T4_LISTENING_DIALOGS=dialogs;return theme;
});
})();