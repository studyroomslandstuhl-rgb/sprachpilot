(function(){
'use strict';
if(window.__SP_L7T4_MEANING_USER_FIX_V1)return;window.__SP_L7T4_MEANING_USER_FIX_V1=true;
const item=(term,answer,wrong1,wrong2)=>({
 prompt:`Was bedeutet „${term}“?`,
 answer,
 options:[answer,wrong1,wrong2],
 hint:`Die passende Bedeutung ist: ${answer}.`
});
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.id==='wort-bedeutung');
 if(!task)return theme;
 task.title='Bedeutung';
 task.description='Finde die passende Bedeutung.';
 task.instruction='';
 task.items=[
  item('Mädchen','kleine Frau','kleiner Mann','Gruppe von Kindern in der Schule'),
  item('Junge','kleiner Mann','kleine Frau','eine Person, die hilft, wenn man krank ist'),
  item('Klasse','Gruppe von Kindern in der Schule','Ort, wo man schwimmen kann','Schule für die 1. bis 4. Klasse'),
  item('Schwimmbad','Ort, wo man schwimmen kann','Ort, wo man lernt','Preis für ein Ticket'),
  item('Eintritt','Preis für ein Ticket','eine kurze Reise','Lernen in der Gruppe mit einem Lehrer oder einer Lehrerin'),
  item('Grundschule','Schule für die 1. bis 4. Klasse','Ort, wo man schwimmen kann','Gruppe von Kindern in der Schule'),
  item('Unterricht','Lernen in der Gruppe mit einem Lehrer oder einer Lehrerin, zum Beispiel Mathematikunterricht, Englischunterricht oder Deutschunterricht','eine kurze Reise','für kurze Zeit weggehen und dann wiederkommen'),
  item('Leitung','der Chef oder in der Schule der Schuldirektor','Gruppe von Kindern in der Schule','Preis für ein Ticket'),
  item('Schule','Ort, wo man lernt','Ort, wo man schwimmen kann','Preis für ein Ticket'),
  item('Arzt','eine Person, die hilft, wenn man krank ist (Mann)','eine Person, die hilft, wenn man krank ist (Frau)','der Chef oder in der Schule der Schuldirektor'),
  item('Ärztin','eine Person, die hilft, wenn man krank ist (Frau)','eine Person, die hilft, wenn man krank ist (Mann)','kleine Frau'),
  item('Ausflug','eine kurze Reise','Preis für ein Ticket','Gruppe von Kindern in der Schule'),
  item('losfahren','anfangen zu fahren','für kurze Zeit weggehen und dann wiederkommen','zusammengehen'),
  item('zurückkommen','für kurze Zeit weggehen und dann wiederkommen','anfangen zu fahren','nicht da sein'),
  item('mitkommen','zusammengehen','anfangen zu fahren','nicht da sein'),
  item('fehlen','nicht da sein','sich nicht gut fühlen','Informationen geben'),
  item('krank','sich nicht gut fühlen','nicht da sein','anfangen zu fahren'),
  item('Bescheid sagen','Informationen geben','zusammengehen','eine kurze Reise'),
  item('Gute Besserung','eine Person wünscht, dass die andere Person gesund wird','wenn etwas Schlechtes passiert und man traurig ist','Informationen geben'),
  item('schade','wenn etwas Schlechtes passiert und man traurig ist','eine Person wünscht, dass die andere Person gesund wird','sich nicht gut fühlen')
 ];
 task.contentRevision='l7t4-meaning-user-20260822-v1';
 theme.contentRevision='l7t4-meaning-user-20260822-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
