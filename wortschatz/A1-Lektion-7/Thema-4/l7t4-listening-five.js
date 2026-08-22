(function(){
'use strict';
if(window.__SP_L7T4_LISTENING_FIVE_V4)return;window.__SP_L7T4_LISTENING_FIVE_V4=true;
const BASE='https://sprachpilot.b-cdn.net/audio/';
const fixed=(q,options,answer)=>({q,options,answer,preserveOrder:true});
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
   fixed('Warum kommt Omar heute nicht zum Deutschkurs?',['Er muss arbeiten.','Er ist krank.','Sein Sohn ist krank.'],'Er ist krank.'),
   fixed('Wann kommt Omar wieder zum Kurs?',['morgen','er weiß es noch nicht','übermorgen'],'er weiß es noch nicht'),
   fixed('Was macht die Sekretärin?',['Sie ruft den Arzt an.','Sie informiert den Lehrer.','Sie sagt der Lehrerin Bescheid.'],'Sie informiert den Lehrer.')
  ]
 },
 {
  title:'Sohn hat Arzttermin · Schule',audio:BASE+'l7t4_hoeren_arzttermin_schule_kind_03.mp3',filename:'l7t4_hoeren_arzttermin_schule_kind_03.mp3',
  transcript:'Sekretariat: Guten Morgen, Grundschule Sonnenweg.\nElena Marin: Guten Morgen, hier spricht Elena Marin. Mein Sohn Paul Marin aus der Klasse 2b kann heute nicht zur Schule kommen.\nSekretariat: Ist Paul krank?\nElena Marin: Nein. Er hat um 9:30 Uhr einen Termin beim Zahnarzt. Morgen kommt er wieder zur Schule.\nSekretariat: Alles klar. Ich sage Herrn Becker Bescheid.\nElena Marin: Vielen Dank. Auf Wiederhören.',
  questions:[
   fixed('Warum fehlt Paul heute?',['Er ist krank und geht zum Arzt.','Er macht einen Arzttermin.','Er hat einen Termin beim Zahnarzt.'],'Er hat einen Termin beim Zahnarzt.'),
   fixed('Wann ist der Arzttermin?',['um 9:30 Uhr','um 10:30 Uhr','um 11:30 Uhr'],'um 9:30 Uhr'),
   fixed('In welche Klasse geht Paul?',['Klasse 3a','Klasse 2b','Klasse 4b'],'Klasse 2b')
  ]
 },
 {
  title:'Teilnehmerin · Deutschkurs',audio:BASE+'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',filename:'l7t4_hoeren_arzttermin_sprachkurs_teilnehmerin_04.mp3',
  transcript:'Kursbüro: Guten Morgen, Sprachschule Dialog.\nAmina Saleh: Guten Morgen, hier spricht Amina Saleh. Ich kann am Montag nicht zum Deutschkurs kommen.\nKursbüro: Was ist das Problem?\nAmina Saleh: Ich habe schon viel gefehlt. Wenn ich mich vom Deutschkurs abmelde, verliere ich den Kurs.\nKursbüro: Das verstehe ich. Bitte sprechen Sie auch mit Ihrer Kursleiterin.\nAmina Saleh: Vielen Dank. Auf Wiederhören.',
  questions:[
   fixed('An welchem Tag fehlt Amina im Deutschkurs?',['am Freitag','am Montag','am Dienstag'],'am Montag'),
   fixed('Was bedeutet „vom Deutschkurs abmelden“?',['Sie bekommt einen anderen Kurs.','Sie verliert den Deutschkurs.','Sie muss zum Jobcenter gehen.'],'Sie verliert den Deutschkurs.'),
   fixed('Warum hat Amina Probleme?',['Sie möchte zum Arzt gehen.','Sie hat am Montag eine Prüfung.','Sie hat schon viel gefehlt.'],'Sie hat schon viel gefehlt.')
  ]
 },
 {
  title:'Sohn krank · Ausflug',audio:BASE+'l7t4_hoeren_krank_ausflug_kind_05.mp3',filename:'l7t4_hoeren_krank_ausflug_kind_05.mp3',
  transcript:'Sekretariat: Grundschule am Park, guten Morgen.\nSamir Ali: Guten Morgen, hier spricht Samir Ali. Mein Sohn Karim geht in die Klasse 3b.\nSekretariat: Guten Morgen, Herr Ali. Was ist los?\nSamir Ali: Karim ist krank. Er kann am Freitag beim Ausflug nicht mitkommen.\nSekretariat: Das ist schade. Ich informiere die Lehrerin. Gute Besserung für Karim.\nSamir Ali: Vielen Dank. Auf Wiederhören.',
  questions:[
   fixed('Was kann Karim am Freitag nicht machen?',['zur Schule kommen','beim Ausflug mitkommen','ins Schwimmbad kommen'],'beim Ausflug mitkommen'),
   fixed('Warum kann Karim nicht mitkommen?',['Die Schule am Freitag ist geschlossen.','Der Eintritt ist zu teuer.','Er ist krank.'],'Er ist krank.'),
   fixed('Was macht das Sekretariat?',['Es informiert die Lehrerin.','Es fährt Karim zum Arzt.','Es sagt den Ausflug ab.'],'Es informiert die Lehrerin.')
  ]
 }
];
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const task=(theme?.tasks||[]).find(t=>t?.id==='hoeren-sekretariat');if(!task)return theme;
 task.title='Hören Krankmeldungen';task.description='Höre und antworte.';task.instruction='Höre den Dialog und wähle A, B oder C.';task.icon='🎧';task.kind='audio-pack';task.items=dialogs;
 theme.contentRevision='l7t4-listening-five-20260822-v4';window.L7_THEME=theme;window.L7T4_LISTENING_DIALOGS=dialogs;return theme;
});
})();