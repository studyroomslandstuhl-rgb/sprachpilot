(function(){
'use strict';
if(window.__SP_L8T1_SHORT_INSTRUCTIONS_V1)return;window.__SP_L8T1_SHORT_INSTRUCTIONS_V1=true;
const TEXT={
 'karteikarten':'Lerne die Wörter.',
 'berufe-bild-v2':'Wähle den Beruf.',
 'berufspaare-v2':'Finde die passende Berufsform.',
 'berufe-plural-v2':'Wähle den richtigen Plural.',
 'berufe-artikel-v2':'Wähle der oder die.',
 'berufsfragen-dialog-v3':'Bilde die Frage und antworte.',
 'beruf-saetze-ordnen-v2':'Ordne die Wörter.',
 'eigen-grammatik-v2':'Wähle die richtige Form.',
 'berufe-hoeren-v2':'Höre und wähle.',
 'berufe-lesen-v2':'Lies und wähle.',
 'berufe-dialoge-v2':'Ergänze den Dialog.',
 'pruefung-berufe-v2':'Bearbeite die Prüfung.'
};
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;
 if(!theme||!Array.isArray(theme.tasks))return themes;
 for(const task of theme.tasks){if(TEXT[task.id])task.instruction=TEXT[task.id]}
 theme.subtitle='Lerne Berufe und frage nach dem Beruf.';
 theme.instructionRevision='l8t1-short-imperatives-20260826-v1';
 if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;
 return themes;
});
})();