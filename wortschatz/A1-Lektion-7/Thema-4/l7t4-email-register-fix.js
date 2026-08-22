(function(){
'use strict';
if(window.__SP_L7T4_EMAIL_REGISTER_FIX_V1)return;
window.__SP_L7T4_EMAIL_REGISTER_FIX_V1=true;
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
   text:'Sehr {{0}} Frau Müller,\n\nich kann heute leider nicht zum Deutschkurs kommen. Ich bin {{1}} und muss zu Hause bleiben. Morgen melde ich mich noch einmal bei Ihnen.\n\nMit freundlichen {{2}}\nMaria Becker',
   blanks:[
    gap('geehrte',['geehrte','geehrter','liebe']),
    gap('krank',['krank','gesund','pünktlich']),
    gap('Grüßen',['Grüßen','Grüße','Gruß'])
   ]
  },
  {
   register:'formal',from:'Omar Hassan',subject:'Arzttermin',
   text:'Sehr {{0}} Herr Klein,\n\nich kann morgen nicht am Deutschkurs teilnehmen. Ich habe um 10 Uhr einen Termin beim {{1}}. Am nächsten Kurstag bin ich wieder da.\n\nMit freundlichen {{2}}\nOmar Hassan',
   blanks:[
    gap('geehrter',['geehrte','geehrter','lieber']),
    gap('Arzt',['Arzt','Unterricht','Ausflug']),
    gap('Grüßen',['Grüßen','Grüße','Gruß'])
   ]
  },
  {
   register:'formal',from:'Amina Saleh',subject:'Fehlen im Deutschkurs',
   text:'Sehr {{0}} Frau Berger,\n\nmein Sohn ist krank. Deshalb kann ich heute nicht zum Deutschkurs {{1}}. Bitte entschuldigen Sie mein Fehlen.\n\nMit freundlichen {{2}}\nAmina Saleh',
   blanks:[
    gap('geehrte',['liebe','geehrter','geehrte']),
    gap('kommen',['kommen','kommt','gekommen']),
    gap('Grüßen',['Grüße','Grüßen','Gruß'])
   ]
  },
  {
   register:'semiformal',from:'Elena Marin',subject:'Heute nicht im Kurs',
   text:'{{0}} Frau Schneider,\n\nmeine Tochter ist heute krank und ich muss mit ihr zum Arzt. Deshalb kann ich heute leider nicht in den Deutschkurs kommen. Morgen sage ich Ihnen noch einmal Bescheid.\n\n{{1}}\nElena Marin',
   blanks:[
    gap('Liebe',['Sehr geehrte','Liebe','Lieber']),
    gap('Viele Grüße',['Mit freundlichen Grüßen','Viele Grüße','Viele Grüßen'])
   ]
  },
  {
   register:'semiformal',from:'Samir Ali',subject:'Kurs am Montag',
   text:'{{0}} Herr Becker,\n\nich kann am Montag leider nicht zum Kurs kommen. Ich habe einen wichtigen Termin. Am Dienstag bin ich wieder im Unterricht.\n\n{{1}}\nSamir Ali',
   blanks:[
    gap('Lieber',['Sehr geehrter','Liebe','Lieber']),
    gap('Liebe Grüße',['Mit freundlichen Grüßen','Liebe Grüße','Lieben Grüße'])
   ]
  }
 ];
 theme.contentRevision='l7t4-email-register-20260822-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
