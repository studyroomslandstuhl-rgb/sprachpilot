(function(){
'use strict';
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const task=(theme?.tasks||[]).find(t=>t?.id==='hoeren-sekretariat');
 const item=task?.items?.[4];
 if(item?.transcript)item.transcript=item.transcript.replace('Karim Ali: Guten Morgen, hier spricht Samir Ali.','Samir Ali: Guten Morgen, hier spricht Samir Ali.');
 if(window.L7T4_LISTENING_DIALOGS?.[4]?.transcript)window.L7T4_LISTENING_DIALOGS[4].transcript=window.L7T4_LISTENING_DIALOGS[4].transcript.replace('Karim Ali: Guten Morgen, hier spricht Samir Ali.','Samir Ali: Guten Morgen, hier spricht Samir Ali.');
 return theme;
});
})();