(function(){
'use strict';
if(window.__SP_L7T4_LISTENING_FIVE_V3)return;window.__SP_L7T4_LISTENING_FIVE_V3=true;
const BASE='https://sprachpilot.b-cdn.net/audio/';
const dialogs=[
 {
  title:'Tochter krank · Schule',audio:BASE+'l7t4_hoeren_krankmeldung_schule_kind_01.mp3',filename:'l7t4_hoeren_krankmeldung_schule_kind_01.mp3',
  transcript:'Sekretariat: Guten Morgen, Grundschule am Park, hier ist Frau Klein.\nHassan Ali: Guten Morgen, hier spricht Hassan Ali. Meine Tochter Sara Ali kann heute und morgen nicht zur Schule kommen.\nSekretariat: In welche Klasse geht Sara?\nHassan Ali: Sie geht in die Klasse 3a. Sie ist krank und wir gehen heute zum Arzt.\nSekretariat: Das tut mir leid. Ich sage Frau Müller Bescheid. Gute Besserung für Sara.\nHassan Ali: Vielen Dank. Auf Wiederhören.\nSekretariat: Auf Wiederhören.',
  questions:[{q:'Wer ist krank?',options:['Sara Ali','Hassan Ali','Frau Klein'],answer:'Sara Ali'},{q:'Wie lange kann Sara nicht zur Schule kommen?',options:['heute und morgen','nur heute Nachmittag','eine Woche'],answer:'heute und morgen'},{q:'In welche Klasse geht Sara?',options:['Klasse 3a','Klasse 2b','Klasse 4a'],answer:'Klasse 3a'}]
 },
 {
  title:'Teilnehmer krank · Sprachkurs',audio:BASE+'l7t4_hoeren_krankmeldung_sprachkurs_teilnehmer_02.mp3',filename:'l7t4_hoeren_krankmeldung_sprachkurs_teilnehmer_02.mp3',
  transcript:'Sekretärin: Sprachschule Aktiv, guten Morgen.\nOmar Hassan: Guten Morgen, hier spricht Omar Hassan. Ich kann heute nicht zum Deutschkurs kommen.\nSekretärin: Was ist los, Herr Hassan?\nOmar Hassan: Ich bin krank. Ich weiß noch nicht, wann ich wieder zum Kurs kommen kann.\nSekretärin: Danke für die Information. Ich informiere den Lehrer. Gute Besserung!\nOmar Hassan: Vielen Dank. Auf Wiederhören.',
  questions:[
   {q:'Warum kommt Omar heute nicht zum Deutschkurs?',options:['Er muss arbeiten.','Er ist krank.','Sein Sohn ist krank.'],answer:'Er ist krank.'},
   {q:'Wann kommt Omar wieder zum Kurs?',options:['morgen','er weiß es noch nicht','übermorgen'],answer:'er weiß es noch nicht'},
   {q:'Was macht die Sekretärin?',options:['Sie ruft den Arzt an.','Sie informiert den Lehrer.','Sie sagt der Lehrerin Bescheid.'],answer:'Sie informiert den Lehrer.'}
  ]
 },
 {
  title:'Sohn hat Arzttermin · Schule',audio:BASE+'l7t4_hoeren_arzttermin_schule_kind_03.mp3',filename:'l7t4_hoeren_arzttermin_schule_kind_03.mp3',
  transcript:'Sekretariat: Guten Morgen, Grundschule Sonnenweg.\nElena Marin: Guten Morgen, hier spricht Elena Marin. Mein Sohn Paul Marin aus der Klasse 2b kann heute nicht zur Schule kommen.\nSekretariat: Ist Paul krank?\nElena Marin: Nein. Er hat um 9:30 Uhr einen Termin beim Zahnarzt. Morgen kommt er wieder zur Schule.\nSekretariat: Alles klar. Ich sage Herrn Becker Bescheid.\nElena Marin: Vielen Dank. Auf Wiederhören.',
  questions:[
   {q:'Warum fehlt Paul heute?',options:['Er ist krank und geht zum Arzt.','Er macht einen Arzttermin.','Er hat einen Termin beim Zahnarzt.'],answer:'Er hat einen Termin beim Zahnarzt.'},
   {q:'Wann ist der Arzttermin?',options:['um 9:30 Uhr','um 10:30 Uhr','um 11:30 Uhr'],answer:'um 9:30 Uhr'},
   {q:'In welche Klasse geht Paul?',options:['Klasse 3a','Klasse 2b','Klasse 4b'],answer:'Klasse 2b'}
  ]
 },
 {
  title:'Teilnehmerin · Deutschkurs',audio:BASE+'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',filename:'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',
  transcript:'Kursbüro: Guten Morgen, Sprachschule Dialog.\nAmina Saleh: Guten Morgen, hier spricht Amina Saleh. Ich kann am Montag nicht zum Deutschkurs kommen.\nKursbüro: Was ist das Problem?\nAmina Saleh: Ich habe schon viel gefehlt. Wenn ich mich vom Deutschkurs abmelde, verliere ich den Kurs.\nKursbüro: Das verstehe ich. Bitte sprechen Sie auch mit Ihrer Kursleiterin.\nAmina Saleh: Vielen Dank. Auf Wiederhören.',
  questions:[
   {q:'An welchem Tag fehlt Amina im Deutschkurs?',options:['am Freitag','am Montag','am Dienstag'],answer:'am Montag'},
   {q:'Was bedeutet „vom Deutschkurs abmelden“?',options:['Sie bekommt einen anderen Kurs.','Sie verliert den Deutschkurs.','Sie muss zum Jobcenter gehen.'],answer:'Sie verliert den Deutschkurs.'},
   {q:'Warum hat Amina Probleme?',options:['Sie möchte zum Arzt gehen.','Sie hat am Montag eine Prüfung.','Sie hat schon viel gefehlt.'],answer:'Sie hat schon viel gefehlt.'}
  ]
 },
 {
  title:'Sohn krank · Ausflug',audio:BASE+'l7t4_hoeren_krank_ausflug_kind_05.mp3',filename:'l7t4_hoeren_krank_ausflug_kind_05.mp3',
  transcript:'Sekretariat: Grundschule am Park, guten Morgen.\nSamir Ali: Guten Morgen, hier spricht Samir Ali. Mein Sohn Karim geht in die Klasse 3b.\nSekretariat: Guten Morgen, Herr Ali. Was ist los?\nSamir Ali: Karim ist krank. Er kann am Freitag beim Ausflug nicht mitkommen.\nSekretariat: Das ist schade. Ich informiere die Lehrerin. Gute Besserung für Karim.\nSamir Ali: Vielen Dank. Auf Wiederhören.',
  questions:[
   {q:'Was kann Karim am Freitag nicht machen?',options:['zur Schule kommen','beim Ausflug mitkommen','ins Schwimmbad kommen'],answer:'beim Ausflug mitkommen'},
   {q:'Warum kann Karim nicht mitkommen?',options:['Die Schule am Freitag ist geschlossen.','Der Eintritt ist zu teuer.','Er ist krank.'],answer:'Er ist krank.'},
   {q:'Was macht das Sekretariat?',options:['Es informiert die Lehrerin.','Es fährt Karim zum Arzt.','Es sagt den Ausflug ab.'],answer:'Es informiert die Lehrerin.'}
  ]
 }
];
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const task=(theme?.tasks||[]).find(t=>t?.id==='hoeren-sekretariat');if(!task)return theme;
 task.title='Hören Krankmeldungen';task.description='Höre und antworte.';task.instruction='Höre den Dialog und wähle A, B oder C.';task.icon='🎧';task.kind='audio-pack';task.items=dialogs;
 theme.contentRevision='l7t4-listening-five-20260822-v3';window.L7_THEME=theme;window.L7T4_LISTENING_DIALOGS=dialogs;return theme;
});
})();