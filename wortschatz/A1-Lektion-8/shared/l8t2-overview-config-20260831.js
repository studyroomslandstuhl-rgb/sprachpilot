(function(){
'use strict';
if(window.__SP_L8T2_OVERVIEW_CONFIG_20260831)return;window.__SP_L8T2_OVERVIEW_CONFIG_20260831=true;
window.L8_T2_OVERVIEW_CONFIG_PENDING=true;
window.L8_T2_OVERVIEW_CONFIG_READY=Promise.resolve(window.L8_T2_VOCAB_READY||window.L8_T2_TRANSLATIONS_READY||window.L8_T2_CURRENT_READY||window.L8_CONTENT_READY).then(()=>{
 const all=window.L8_ALL_THEMES||{},theme=all[2]||all['2'];if(!theme)return theme;
 theme.grammarOverview=[
  {group:'Zeitpräpositionen',title:'seit + Dativ',text:'Etwas hat in der Vergangenheit begonnen und dauert noch an.'},
  {group:'Zeitpräpositionen',title:'vor + Dativ',text:'Etwas ist zu einem Zeitpunkt in der Vergangenheit passiert und ist fertig.'},
  {group:'Nomen und Verben mit festen Präpositionen',title:'eine Ausbildung machen als + Beruf'},
  {group:'Nomen und Verben mit festen Präpositionen',title:'arbeiten als + Beruf'},
  {group:'Nomen und Verben mit festen Präpositionen',title:'arbeiten bei + Name der Firma'},
  {group:'Nomen und Verben mit festen Präpositionen',title:'eine Stelle haben als + Beruf'},
  {group:'Nomen und Verben mit festen Präpositionen',title:'eine Stelle haben bei + Name der Firma'}
 ];
 if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
 window.L8_T2_OVERVIEW_CONFIG_PENDING=false;return theme;
}).catch(error=>{window.L8_T2_OVERVIEW_CONFIG_PENDING=false;console.error('L8T2 Übersichtsstruktur',error);throw error});
})();
