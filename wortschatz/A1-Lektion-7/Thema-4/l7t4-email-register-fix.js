(function(){
'use strict';
if(window.__SP_L7T4_EMAIL_REGISTER_FIX_V2)return;
window.__SP_L7T4_EMAIL_REGISTER_FIX_V2=true;
const gap=(answer,options)=>({answer,options});
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const email=theme.tasks.find(t=>t?.id==='email-ergaenzen');
 if(!email)return theme;
 email.title='E-Mail ergänzen';
 email.description='Ergänze die E-Mail.';
 email.instruction='Ergänze die E-Mail.';
 email.twoStage=true;
 email.items=[
  {
   register:'formal',from:'Maria Becker',subject:'Krankmeldung',
   text:'Sehr {{0}} Frau Müller,\n\nich kann {{1}} leider nicht zum Deutschkurs {{2}}. Ich bin {{3}} und muss zu Hause {{4}}. Morgen melde ich mich noch einmal bei Ihnen.\n\nMit freundlichen {{5}}\nMaria Becker',
   blanks:[
    gap('geehrte',['geehrte','geehrter','liebe']),
    gap('heute',['heute','morgen','gestern']),
    gap('kommen',['kommen','kommt','gekommen']),
    gap('krank',['krank','gesund','pünktlich']),
    gap('bleiben',['bleiben','fahren','schwimmen']),
    gap('Grüßen',['Grüßen','Grüße','Gruß'])
   ]
  },
  {
   register:'formal',from:'Omar Hassan',subject:'Arzttermin',
   text:'Sehr {{0}} Herr Klein,\n\nich kann {{1}} nicht am Deutschkurs {{2}}. Ich habe um 10 Uhr einen {{3}} beim {{4}}. Am nächsten Kurstag bin ich wieder da.\n\nMit freundlichen {{5}}\nOmar Hassan',
   blanks:[
    gap('geehrter',['geehrte','geehrter','lieber']),
    gap('morgen',['morgen','gestern','heute Abend']),
    gap('teilnehmen',['teilnehmen','teilnimmt','teilgenommen']),
    gap('Termin',['Termin','Unterricht','Ausflug']),
    gap('Arzt',['Arzt','Lehrer','Eintritt']),
    gap('Grüßen',['Grüßen','Grüße','Gruß'])
   ]
  },
  {
   register:'formal',from:'Amina Saleh',subject:'Fehlen im Deutschkurs',
   text:'Sehr {{0}} Frau Berger,\n\nmein Sohn ist {{1}}. Deshalb kann ich heute nicht zum Deutschkurs {{2}}. Ich muss mit ihm zum {{3}}. Bitte entschuldigen Sie mein {{4}}.\n\nMit freundlichen {{5}}\nAmina Saleh',
   blanks:[
    gap('geehrte',['liebe','geehrter','geehrte']),
    gap('krank',['krank','gesund','pünktlich']),
    gap('kommen',['kommen','kommt','gekommen']),
    gap('Arzt',['Arzt','Unterricht','Ausflug']),
    gap('Fehlen',['Fehlen','Unterricht','Eintritt']),
    gap('Grüßen',['Grüße','Grüßen','Gruß'])
   ]
  },
  {
   register:'semiformal',from:'Elena Marin',subject:'Heute nicht im Kurs',
   text:'{{0}} Frau Schneider,\n\nmeine Tochter ist heute {{1}} und ich muss mit ihr zum {{2}}. Deshalb kann ich heute leider nicht in den Deutschkurs {{3}}. Morgen sage ich Ihnen noch einmal {{4}}.\n\n{{5}}\nElena Marin',
   blanks:[
    gap('Liebe',['Sehr geehrte','Liebe','Lieber']),
    gap('krank',['krank','gesund','fertig']),
    gap('Arzt',['Arzt','Ausflug','Unterricht']),
    gap('kommen',['kommen','kommt','gekommen']),
    gap('Bescheid',['Bescheid','Eintritt','Klasse']),
    gap('Viele Grüße',['Mit freundlichen Grüßen','Viele Grüße','Viele Grüßen'])
   ]
  },
  {
   register:'semiformal',from:'Samir Ali',subject:'Kurs am Montag',
   text:'{{0}} Herr Becker,\n\nich kann am {{1}} leider nicht zum Kurs {{2}}. Ich habe einen wichtigen {{3}}. Am Dienstag bin ich wieder im {{4}}.\n\n{{5}}\nSamir Ali',
   blanks:[
    gap('Lieber',['Sehr geehrter','Liebe','Lieber']),
    gap('Montag',['Montag','Freitag','Sonntag']),
    gap('kommen',['kommen','kommt','gekommen']),
    gap('Termin',['Termin','Eintritt','Ausflug']),
    gap('Unterricht',['Unterricht','Schwimmbad','Arzt']),
    gap('Liebe Grüße',['Mit freundlichen Grüßen','Liebe Grüße','Lieben Grüße'])
   ]
  }
 ];
 theme.contentRevision='l7t4-email-register-20260822-v2';
 window.L7_THEME=theme;
 return theme;
});
})();
